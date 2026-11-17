// Link between an anime and the manga it comes from (AniList relations + arm.haglund.dev ids).
// The jump uses real tables when the series is in them (lib/episodeMap.js: episode by episode, or arc
// by arc); otherwise it is an ESTIMATE: the chapters are spread over the episodes of the seasons.
import { postJSON, getJSON } from './http.js';
import * as epmap from './episodeMap.js';

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
// Every name of the franchise (first season and the manga), to find it in the tables.
const namesOf = (nodes) => {
  const out = [];
  nodes.forEach((n) => {
    if (!n || !n.title) return;
    out.push(n.title.english, n.title.romaji);
    (n.synonyms || []).forEach((x) => out.push(x));
  });
  return out.filter(Boolean).slice(0, 12);
};

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
      const guess = { manga: manga, chapter: Math.max(1, Math.round(ep * per)), approx: true };
      const viaTable = (names, n) =>
        epmap.tableFor(names).then((tb) => {
          const ch = epmap.chapterOf(tb, n);
          return ch ? { manga: manga, chapter: ch, approx: tb.kind !== 'exact' } : null;
        });
      // This season's own list (Naruto Shippuden counts from 1), then the franchise's (all seasons).
      return (cur.id !== seasons[0].id ? viaTable(namesOf([cur]), Math.max(1, episode || 1)) : Promise.resolve(null))
        .then((r) => r || viaTable(namesOf([seasons[0], manga]), ep))
        .then((r) => r || guess)
        .catch(() => guess);
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
      // Episode counted across seasons → the season it falls in and its number there.
      const place = (abs, approx) => {
        let ep = abs;
        for (let i = 0; i < seasons.length; i++) {
          const n = seasons[i].episodes || 0;
          if (ep <= n || i === seasons.length - 1) return { anime: seasons[i], episode: Math.max(1, Math.min(ep, n || ep)), approx: approx };
          ep -= n;
        }
        return null;
      };
      const guess = place(Math.max(1, Math.round((chapter || 1) / per)), true);
      const ch = Math.floor(chapter || 1);
      // The franchise's list (all seasons); past its end, a later season with its own list (Shippuden).
      const later = (i) => {
        if (i >= seasons.length) return Promise.resolve(null);
        return epmap.tableFor(namesOf([seasons[i]])).then((tb) => {
          const e = epmap.episodeOf(tb, ch);
          return e ? { anime: seasons[i], episode: e, approx: tb.kind !== 'exact' } : later(i + 1);
        });
      };
      return epmap
        .tableFor(namesOf([seasons[0], manga]))
        .then((tb) => {
          const abs = epmap.episodeOf(tb, ch);
          if (abs) return place(abs, tb.kind !== 'exact');
          return later(1).then((r) => {
            if (r) return r;
            // Past what the anime has adapted: its latest episode, and say so.
            const last = epmap.lastAdapted(tb);
            return last && ch > last[1] ? Object.assign(place(last[0], false), { ahead: true, lastChapter: last[1] }) : null;
          });
        })
        .then((r) => r || guess)
        .catch(() => guess);
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
