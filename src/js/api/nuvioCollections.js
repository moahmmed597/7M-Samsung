// Imported Nuvio collections (tools/import-nuvio-collections.mjs): the file is loaded on demand
// next to app.js, and each source is fetched only when its row is shown.
// Source kinds: { q } TMDB discover, { list } TMDB list, { coll } TMDB collection, { trakt } Trakt
// list, { addon, cat } an installed add-on's catalog.
import { getJSON } from '../lib/http.js';
import * as extras from './extras.js';
import * as tracker from './tracker.js';
import * as addons from './addons.js';

const TMDB_IMG = 'https://image.tmdb.org/t/p/w342';
const files = {};

export function load(name) {
  if (!files[name]) {
    const base = window.__KAI_BASE__ || '';
    files[name] = getJSON(base + 'collections/' + name + '.json', { timeout: 30000 }).catch((e) => {
      delete files[name];
      throw e;
    });
  }
  return files[name];
}

function fromTmdb(list, media) {
  return (list || [])
    .filter((x) => x && x.poster_path)
    .map((x) => {
      const type = (x.media_type || media) === 'tv' ? 'series' : 'movie';
      return { id: 'tmdb:' + x.id, tmdb: x.id, tmdbType: type === 'series' ? 'tv' : 'movie', type: type, name: x.title || x.name || '', poster: TMDB_IMG + x.poster_path };
    });
}

function sortList(items, sort) {
  const s = String(sort || '');
  const key = s.split('.')[0];
  const desc = /desc$/.test(s);
  if (!key || key === 'original_order' || key === 'rank') return items;
  return items.slice().sort((a, b) => ((a.__s[key] || 0) - (b.__s[key] || 0)) * (desc ? -1 : 1));
}

// One page of a source: { items, more }.
export function fetchSource(src, page) {
  const n = page || 1;
  if (src.q) {
    return extras.tmdbGet('discover/' + src.m, Object.assign({ page: n, include_adult: 'false' }, src.q)).then((r) => ({
      items: fromTmdb(r && r.results, src.m),
      more: !!(r && r.page < r.total_pages && n < 20),
    }));
  }
  if (src.list) {
    return extras.tmdbGet('list/' + src.list, {}).then((r) => {
      const raw = ((r && r.items) || []).map((x) => Object.assign({}, x, { __s: { vote_average: x.vote_average, popularity: x.popularity, release_date: Date.parse(x.release_date || x.first_air_date) || 0 } }));
      const items = fromTmdb(sortList(raw, src.sort), src.m);
      return { items: items.slice((n - 1) * 40, n * 40), more: items.length > n * 40 };
    });
  }
  if (src.coll) {
    return extras.tmdbGet('collection/' + src.coll, {}).then((r) => {
      const parts = ((r && r.parts) || []).slice().sort((a, b) => (Date.parse(a.release_date) || 9e15) - (Date.parse(b.release_date) || 9e15));
      return { items: fromTmdb(parts, 'movie'), more: false };
    });
  }
  if (src.trakt) {
    const kind = src.m === 'tv' ? 'show' : 'movie';
    return tracker.traktPublic('/lists/' + src.trakt + '/items/' + kind + '?limit=40&page=' + n).then((list) => ({
      items: (list || [])
        .map((x) => {
          const m = x.movie || x.show;
          const imdb = m && m.ids && m.ids.imdb;
          return imdb ? { id: imdb, type: x.movie ? 'movie' : 'series', name: m.title, poster: 'https://images.metahub.space/poster/medium/' + imdb + '/img' } : null;
        })
        .filter(Boolean),
      more: (list || []).length >= 40,
    }));
  }
  if (src.addon) {
    const a = addons.list().find((x) => x.manifest && x.manifest.id === src.addon);
    if (!a) return Promise.resolve({ items: [], more: false, missing: src.addon });
    const extra = {};
    if (src.genre) extra.genre = src.genre;
    if (n > 1) extra.skip = (n - 1) * 100;
    return addons
      .fetchCatalog({ addon: a, catalog: { type: src.m, id: src.cat } }, extra)
      .then((metas) => ({ items: metas, more: metas.length >= 50 }));
  }
  return Promise.resolve({ items: [], more: false });
}

// TMDB items open through their IMDb id (what the add-ons know); others open as they are.
export function idFor(m) {
  if (!m.tmdb) return Promise.resolve(m.id);
  return extras.tmdbImdb(m.tmdbType, m.tmdb).then((imdb) => imdb || m.id);
}

