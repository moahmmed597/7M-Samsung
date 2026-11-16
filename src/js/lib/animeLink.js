// Link between an anime and the manga it comes from (AniList relations + arm.haglund.dev ids).
// There is no public table "episode N = chapter M", so the jump is an ESTIMATE: the chapters of the
// manga are spread over the episodes of the anime seasons in order (filler and recaps shift it).
import { postJSON, getJSON } from './http.js';

const API = 'https://graphql.anilist.co';
const ARM = 'https://arm.haglund.dev/api/v2/ids?source=';
const NODE = 'id type format status popularity episodes chapters countryOfOrigin averageScore genres description(asHtml: false) startDate { year } title { romaji english native } synonyms coverImage { large }';
const MEDIA = '{ Media(id: %ID%) { ' + NODE + ' relations { edges { relationType node { ' + NODE + ' } } } } }';
const FALLBACK_CH_PER_EP = 2.5; // ongoing manga: no total to divide by

const cache = {};
function media(id) {
  if (!cache[id]) {
    cache[id] = postJSON(API, { query: MEDIA.replace('%ID%', id) }, { timeout: 15000, quiet: true })
      .then((r) => r && r.data && r.data.Media)
      .catch((e) => {
        delete cache[id];
        throw e;
      });
  }
  return cache[id];
}

const edges = (m, type, kind) => ((m && m.relations && m.relations.edges) || []).filter((e) => e.relationType === type && e.node && (!kind || e.node.type === kind)).map((e) => e.node);
// The manga behind an anime: AniList lists it as SOURCE or ADAPTATION, spin-offs too; the most popular one is the main series.
const mainManga = (m) =>
  ((m && m.relations && m.relations.edges) || [])
    .filter((e) => (e.relationType === 'SOURCE' || e.relationType === 'ADAPTATION') && e.node && e.node.type === 'MANGA' && e.node.format !== 'NOVEL')
    .map((e) => e.node)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))[0];
const isTV = (n) => n.format === 'TV' || n.format === 'TV_SHORT' || n.format === 'ONA';

// Stremio id (kitsu:N, tt…, mal:N, anilist:N) → AniList anime id.
export function anilistIdOf(stremioId) {
  const s = String(stremioId || '');
  let m = /^anilist:(\d+)/.exec(s);
  if (m) return Promise.resolve(+m[1]);
  let src = null;
  let id = null;
  if ((m = /^kitsu:(\d+)/.exec(s))) (src = 'kitsu'), (id = m[1]);
  else if ((m = /^mal:(\d+)/.exec(s))) (src = 'myanimelist'), (id = m[1]);
  else if ((m = /^(tt\d+)/.exec(s))) (src = 'imdb'), (id = m[1]);
  if (!src) return Promise.resolve(null);
  return getJSON(ARM + src + '&id=' + id, { timeout: 10000, quiet: true })
    .then((r) => (r && r.anilist) || null)
    .catch(() => null);
}

// The anime seasons of one franchise, in order: walk PREQUEL back to the first one, then SEQUEL forward.
function seasonsOf(animeId) {
  const out = [];
  const seen = {};
  const back = (id, guard) =>
    media(id).then((m) => {
      const pre = guard < 12 ? edges(m, 'PREQUEL', 'ANIME').filter(isTV)[0] : null;
      return pre && !seen[pre.id] ? ((seen[pre.id] = 1), back(pre.id, guard + 1)) : m;
    });
  const fwd = (m, guard) => {
    out.push(m);
    const seq = guard < 14 ? edges(m, 'SEQUEL', 'ANIME').filter(isTV)[0] : null;
    if (!seq || seen['f' + seq.id]) return out;
    seen['f' + seq.id] = 1;
    return media(seq.id).then((n) => fwd(n, guard + 1));
  };
  seen[animeId] = 1;
  return back(animeId, 0).then((first) => ((seen['f' + first.id] = 1), fwd(first, 0)));
}

// anime episode → { manga (AniList node), chapter, approx } or null when the anime has no manga source.
export function episodeToChapter(animeId, episode) {
  return seasonsOf(animeId).then((seasons) => {
    const cur = seasons.filter((s) => s.id === animeId)[0] || seasons[0];
    const src = mainManga(cur) || mainManga(seasons[0]);
    if (!src) return null;
    return media(src.id).then((manga) => {
      let before = 0;
      let total = 0;
      let reached = false;
      seasons.forEach((s) => {
        if (s.id === cur.id) reached = true;
        const n = s.episodes || 0;
        if (!reached) before += n;
        total += n;
      });
      const ep = before + Math.max(1, episode || 1);
      const per = manga.chapters && total ? manga.chapters / total : FALLBACK_CH_PER_EP;
      return { manga: manga, chapter: Math.max(1, Math.round(ep * per)), approx: true };
    });
  });
}

// manga chapter → { anime (AniList node), episode, approx } or null when no anime adapts it.
export function chapterToEpisode(mangaId, chapter) {
  return media(mangaId).then((manga) => {
    const first = edges(manga, 'ADAPTATION', 'ANIME').filter(isTV)[0];
    if (!first) return null;
    return seasonsOf(first.id).then((seasons) => {
      const total = seasons.reduce((a, s) => a + (s.episodes || 0), 0);
      const per = manga.chapters && total ? manga.chapters / total : FALLBACK_CH_PER_EP;
      let ep = Math.max(1, Math.round((chapter || 1) / per));
      for (let i = 0; i < seasons.length; i++) {
        const n = seasons[i].episodes || 0;
        if (ep <= n || i === seasons.length - 1) return { anime: seasons[i], episode: Math.min(ep, n || ep), approx: true };
        ep -= n;
      }
      return null;
    });
  });
}

// A manga AniList node in the shape the manga views use.
export function mangaMeta(n) {
  return { id: 'anilist:' + n.id, anilist: n.id, type: 'manga', name: (n.title && (n.title.english || n.title.romaji)) || '', poster: n.coverImage && n.coverImage.large, media: n };
}

// The anime of a manga (first TV adaptation) in the shape openAnime wants.
export function animeMeta(n) {
  return { anilist: n.id, type: n.format === 'MOVIE' ? 'movie' : 'series', name: (n.title && (n.title.english || n.title.romaji)) || '', poster: n.coverImage && n.coverImage.large };
}
