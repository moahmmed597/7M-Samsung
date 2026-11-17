// Everything made from the same story, across the tabs: anime, manga, light novels / books, films and
// shows (live action), comics. One "🔗 Linked" menu on each title page, built from AniList relations
// (anime ↔ manga ↔ novel, no key) and TMDB "based on ..." keywords (films and shows, your key).
import { postJSON } from './http.js';
import { likeness } from './titles.js';
import * as extras from '../api/extras.js';
import { menu } from '../ui.js';
import { t } from './i18n.js';
import { mangaMeta, animeMeta } from './animeLink.js';
import { openAnime } from '../views/anime.js';
import { openMangaDetails } from '../views/mangaDetails.js';
import { openBookFor } from '../views/books.js';
import { openTmdb } from '../views/comicDetails.js';

const API = 'https://graphql.anilist.co';
const NODE = 'id type format popularity title { english romaji native } synonyms coverImage { large } startDate { year }';
const LINKS = { SOURCE: 1, ADAPTATION: 1, ALTERNATIVE: 1, PARENT: 1 };
const nameOf = (n) => (n.title && (n.title.english || n.title.romaji)) || '';
const fmtOf = (f) => (f === 'MOVIE' ? t('Filme') : f === 'TV_SHORT' ? 'TV' : f === 'ONE_SHOT' ? 'One-shot' : f === 'NOVEL' || f === 'MANGA' ? '' : f || '');

const memo = {};
function ql(query, variables) {
  const k = query + JSON.stringify(variables || {});
  if (!memo[k])
    memo[k] = postJSON(API, { query: query, variables: variables || {} }, { timeout: 12000, quiet: true })
      .then((r) => (r && r.data) || {})
      .catch((e) => {
        delete memo[k];
        throw e;
      });
  return memo[k];
}
const relations = (id) =>
  ql('query($id:Int){ Media(id:$id){ ' + NODE + ' relations { edges { relationType node { ' + NODE + ' } } } } }', { id: id }).then((d) => d.Media || null);

const RANK = { NOVEL: 0, TV: 1, ONA: 1, TV_SHORT: 2, MOVIE: 2, MANGA: 3, OVA: 4, ONE_SHOT: 5 };
const rank = (n) => (n.format in RANK ? RANK[n.format] : 4);

// An AniList node → a menu entry that opens it in the right tab.
export function alItem(n) {
  const year = (n.startDate && n.startDate.year) || '';
  const sub = [fmtOf(n.format), year].filter(Boolean).join('  ·  ');
  if (n.type === 'ANIME') return { key: 'a' + n.id, icon: '📺', label: nameOf(n), sub: [t('Anime')].concat(sub ? [sub] : []).join('  ·  '), open: () => openAnime(animeMeta(n)) };
  if (n.format === 'NOVEL') return { key: 'n' + n.id, icon: '📕', label: nameOf(n), sub: [t('Livro')].concat(sub ? [sub] : []).join('  ·  '), open: () => openBookFor(nameOf(n)) };
  return { key: 'm' + n.id, icon: '📖', label: nameOf(n), sub: [t('Mangá')].concat(sub ? [sub] : []).join('  ·  '), open: () => openMangaDetails(mangaMeta(n)) };
}

// From an AniList title: its source and adaptations, and the adaptations of its source (anime → light
// novel → manga). The title itself is left out.
export function fromAniList(id) {
  if (!id) return Promise.resolve([]);
  return relations(id).then((m) => {
    if (!m) return [];
    const edges = (m.relations && m.relations.edges) || [];
    const direct = edges.filter((e) => LINKS[e.relationType] && e.node).map((e) => e.node);
    // The original work (AniList marks an anime's manga as SOURCE, or sometimes ADAPTATION).
    const sources = edges
      .filter((e) => e.node && (e.relationType === 'SOURCE' || (m.type === 'ANIME' && e.relationType === 'ADAPTATION' && e.node.type === 'MANGA')))
      .map((e) => e.node)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 2);
    return Promise.all(sources.map((s) => relations(s.id).catch(() => null))).then((more) => {
      const all = direct.slice();
      more.forEach((s) => s && ((s.relations && s.relations.edges) || []).forEach((e) => e.relationType === 'ADAPTATION' && e.node && all.push(e.node)));
      const seen = {};
      seen[id] = 1;
      return all
        .filter((n) => !seen[n.id] && (seen[n.id] = 1) && n.format !== 'MUSIC' && n.format !== 'SPECIAL')
        // Books first, then the anime series, films, manga, one-shots last; the most popular first in each.
        .sort((a, b) => rank(a) - rank(b) || (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 12)
        .map(alItem);
    });
  });
}

// The AniList title of this name (a light novel, a manga or an anime), or null.
export function findAniList(title, type, format) {
  if (!title) return Promise.resolve(null);
  const q = 'query($s:String){ Page(perPage:6){ media(search:$s' + (type ? ', type:' + type : '') + (format ? ', format_in:[' + format + ']' : '') + ', sort:SEARCH_MATCH){ ' + NODE + ' } } }';
  return ql(q, { s: title })
    .then((d) => {
      const list = (d.Page && d.Page.media) || [];
      const score = (n) => Math.max.apply(null, [n.title.english, n.title.romaji].concat(n.synonyms || []).map((x) => likeness(x, title)));
      return list.filter((n) => score(n) >= 0.85)[0] || null;
    })
    .catch(() => null);
}

// TMDB films / shows → menu entries.
export function tmdbItems(list) {
  return (list || []).map((x) => ({
    key: 't' + x.media_type + x.id,
    icon: '🎬',
    label: x.title || x.name,
    sub: ((x.media_type === 'tv' ? t('Série') : t('Filme')) + '  ·  ' + (x.release_date || x.first_air_date || '').slice(0, 4)).trim(),
    open: () => openTmdb(x),
  }));
}

// What a book is linked to: the light novel's anime and manga (AniList) + films and shows (TMDB).
export function forBook(title) {
  const al = findAniList(title, 'MANGA', 'NOVEL').then((n) => (n ? fromAniList(n.id) : [])).catch(() => []);
  const tm = extras.hasTmdb() ? extras.adaptationsOf(title, 'book').catch(() => []) : Promise.resolve([]);
  return Promise.all([al, tm]).then(([a, f]) => {
    const hasAnime = a.some((x) => x.icon === '📺');
    // An anime from AniList is already there: drop TMDB's animated copy of it.
    return a.concat(tmdbItems(hasAnime ? f.filter((x) => (x.genre_ids || []).indexOf(16) < 0) : f));
  });
}

// What a manga is linked to: anime, light novel, other versions (AniList) + live action (TMDB).
export function forManga(anilistId, title) {
  const tm = extras.hasTmdb() ? extras.adaptationsOf(title, 'manga', true).catch(() => []) : Promise.resolve([]);
  return Promise.all([fromAniList(anilistId).catch(() => []), tm]).then(([a, f]) => a.concat(tmdbItems(f)));
}

// What an anime is linked to: the manga, the light novel, the other versions + live action.
export function forAnime(anilistId, title) {
  return forManga(anilistId, title);
}

// The button's menu.
export function linkedMenu(items) {
  menu(
    t('Ligado a esta história'),
    items.map((x) => ({ label: x.icon + ' ' + x.label, sub: x.sub, value: x })),
    { onPick: (x) => x.open() }
  );
}
