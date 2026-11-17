// Books catalog: Open Library (openlibrary.org), free and without a key. It doesn't answer apps
// directly, so requests go through the TV service. A catalog only (covers, authors, summaries);
// reading comes from your own sources (plugins of the Books tab).
import { httpRaw } from './plugins.js';

const API = 'https://openlibrary.org';
const COVER = (id, size) => 'https://covers.openlibrary.org/b/id/' + id + '-' + (size || 'M') + '.jpg';

const cache = {};
function get(path) {
  const url = API + path;
  if (cache[url]) return cache[url];
  const p = httpRaw(url, { timeoutMs: 20000 }).then((r) => {
    if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));
    return JSON.parse(r.body || 'null');
  });
  cache[url] = p;
  p.catch(() => delete cache[url]);
  return p;
}

// A work in the shape the views use.
function toMeta(w) {
  const key = String(w.key || '').replace(/^\/works\//, '');
  const cover = w.cover_i || w.cover_id;
  const author = (w.author_name && w.author_name[0]) || (w.authors && w.authors[0] && w.authors[0].name) || '';
  return {
    id: 'ol:' + key,
    olKey: key,
    type: 'book',
    name: w.title || '',
    title: w.title || '',
    author: author,
    year: w.first_publish_year || null,
    poster: cover ? COVER(cover, 'M') : '',
  };
}

const withCovers = (list) => list.filter((m) => m.poster);

// Trending today / this week.
export function trending(period) {
  return get('/trending/' + (period || 'daily') + '.json?limit=40').then((j) => withCovers(((j && j.works) || []).map(toMeta)));
}

// A subject (fantasy, science_fiction, romance...).
export function subject(name, page) {
  return get('/subjects/' + encodeURIComponent(name) + '.json?limit=40&offset=' + (page || 0) * 40).then((j) => ({
    items: withCovers(((j && j.works) || []).map(toMeta)),
    more: !!(j && j.work_count > ((page || 0) + 1) * 40),
  }));
}

// Search by title or author (lang: 'ara' for Arabic books, optional).
export function search(q, page, lang) {
  const fields = 'key,title,author_name,cover_i,first_publish_year';
  return get('/search.json?q=' + encodeURIComponent(q) + (lang ? '&language=' + lang : '') + '&limit=40&page=' + ((page || 0) + 1) + '&fields=' + fields).then((j) => ({
    items: withCovers(((j && j.docs) || []).map(toMeta)),
    more: !!(j && j.numFound > ((page || 0) + 1) * 40),
  }));
}

// One work: summary and subjects.
export function work(key) {
  return get('/works/' + key + '.json').then((w) => {
    const d = w && w.description;
    return {
      description: typeof d === 'string' ? d : (d && d.value) || '',
      subjects: ((w && w.subjects) || []).slice(0, 5),
      cover: w && w.covers && w.covers[0] > 0 ? COVER(w.covers[0], 'L') : '',
    };
  });
}
