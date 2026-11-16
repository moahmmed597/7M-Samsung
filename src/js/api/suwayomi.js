// Suwayomi server client (the same idea as Aidoku / Tachiyomi / Harbor): the app ships NO manga sources.
// You run a Suwayomi server (PC, NAS, phone...), install the extension repositories YOU choose on it,
// and enter its address in Settings. The TV then browses and reads through that server.
// API: the server's GraphQL endpoint (/api/graphql). Images come from the same server.
import { postJSON } from '../lib/http.js';
import * as store from '../lib/store.js';

export const base = () => String(store.settings().suwayomiUrl || '').replace(/\/+$/, '');
export const enabled = () => !!base();

const digits = (x) => /^\d+$/.test(String(x));

function gql(query, variables) {
  return postJSON(base() + '/api/graphql', { query: query, variables: variables || {} }, { timeout: 40000, quiet: true }).then((r) => {
    if (r && r.errors && r.errors.length && !r.data) throw new Error(String(r.errors[0].message || 'server'));
    if (!r || !r.data) throw new Error('server');
    return r.data;
  });
}

export function img(path) {
  if (!path) return '';
  return /^https?:/i.test(path) ? path : base() + path;
}

// Is the server there?
export function ping() {
  return gql('query { aboutServer { name version } }').then((d) => d.aboutServer);
}

// Installed sources (adult ones hidden unless the user turns them on).
export function sources() {
  return gql('query { sources { nodes { id name lang iconUrl supportsLatest isNsfw isLocal } } }').then((d) =>
    ((d.sources && d.sources.nodes) || [])
      .filter((s) => s && s.id != null && digits(s.id) && (!s.isNsfw || store.settings().suwayomiNsfw === true))
      .map((s) => ({ id: String(s.id), name: String(s.name || s.id), lang: String(s.lang || ''), latest: !!s.supportsLatest, local: !!s.isLocal }))
  );
}

const KIND = { popular: 'POPULAR', latest: 'LATEST', search: 'SEARCH' };

function toMeta(m) {
  return { id: 'sw:' + m.id, swId: String(m.id), type: 'manga', name: m.title || '', poster: base() + '/api/v1/manga/' + m.id + '/thumbnail', description: m.description || '', author: m.author || m.artist || '', status: m.status || '' };
}

// kind: 'popular' | 'latest' | 'search' → { items, more }
export function browse(sourceId, kind, page, query) {
  if (!digits(sourceId)) return Promise.resolve({ items: [], more: false });
  const q =
    'mutation($page: Int!, $query: String) { fetchSourceManga(input: { source: "' +
    sourceId +
    '", type: ' +
    KIND[kind] +
    ', page: $page, query: $query }) { hasNextPage mangas { id title author artist status description } } }';
  return gql(q, { page: page || 1, query: query || null }).then((d) => {
    const p = d.fetchSourceManga || {};
    return { items: (p.mangas || []).map(toMeta), more: !!p.hasNextPage };
  });
}

// Chapters in reading order (cached by the server; asks the source when it has none yet).
export function chapters(mangaId) {
  if (!digits(mangaId)) return Promise.resolve([]);
  const map = (nodes) =>
    (nodes || [])
      .filter((c) => c && c.id != null)
      .map((c) => ({ id: String(c.id), chapter: c.chapterNumber >= 0 ? c.chapterNumber : null, title: c.name || '', lang: '', pages: c.pageCount > 0 ? c.pageCount : 0, scanlator: c.scanlator || '' }))
      .sort((a, b) => (a.chapter === null ? 1e9 : a.chapter) - (b.chapter === null ? 1e9 : b.chapter));
  return gql('query { chapters(condition: { mangaId: ' + mangaId + ' }) { nodes { id name chapterNumber scanlator pageCount } } }').then((d) => {
    const cached = d.chapters && d.chapters.nodes;
    if (cached && cached.length) return map(cached);
    return gql('mutation { fetchChapters(input: { mangaId: ' + mangaId + ' }) { chapters { id name chapterNumber scanlator pageCount } } }').then((x) => map(x.fetchChapters && x.fetchChapters.chapters));
  });
}

// URLs of a chapter's pages.
export function pages(chapterId) {
  if (!digits(chapterId)) return Promise.resolve([]);
  return gql('mutation { fetchChapterPages(input: { chapterId: ' + chapterId + ' }) { pages } }').then((d) =>
    ((d.fetchChapterPages && d.fetchChapterPages.pages) || []).filter((p) => typeof p === 'string' && p).map(img)
  );
}
