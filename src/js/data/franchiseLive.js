// Keeps the built-in collections current with TMDB (your key): titles that came out (or were
// announced) after the list was written are added at the end, so a new Marvel series shows up
// without an app update. Marvel uses TMDB's "Marvel Cinematic Universe" tag (films and series);
// other film sagas use their TMDB collection. Checked when you open a collection, kept 3 days.
import * as store from '../lib/store.js';
import * as extras from '../api/extras.js';
import { likeness } from '../lib/titles.js';

const KEY = 'franchiseLive';
const FRESH = 3 * 864e5;
const MCU_KEYWORD = '180547';

function cache() {
  return store.get(KEY, {}) || {};
}

// The collection with what TMDB added (from the last check; nothing to wait for).
export function withLive(f) {
  const c = cache()[f.id];
  if (!c || !c.items || !c.items.length) return f;
  const have = {};
  f.items.forEach((it) => (have[it[0]] = 1));
  const extra = c.items.filter((it) => !have[it[0]]);
  return extra.length ? Object.assign({}, f, { items: f.items.concat(extra) }) : f;
}

const yearOf = (d) => parseInt(String(d || '').slice(0, 4), 10) || 0;
const lastYear = (f) => f.items.reduce((m, it) => Math.max(m, it[2] || 0), 0);

function mcu(f) {
  const from = lastYear(f) + '-01-01';
  const pick = (r, type) =>
    ((r && r.results) || [])
      .filter((x) => (type === 'tv' ? x.first_air_date : x.release_date))
      .map((x) => ({ id: x.id, type: type, title: x.title || x.name, date: type === 'tv' ? x.first_air_date : x.release_date }));
  return Promise.all([
    extras.tmdbGet('discover/movie', { with_keywords: MCU_KEYWORD, sort_by: 'primary_release_date.asc', 'primary_release_date.gte': from, language: 'en-US' }).then((r) => pick(r, 'movie')),
    extras.tmdbGet('discover/tv', { with_keywords: MCU_KEYWORD, sort_by: 'first_air_date.asc', 'first_air_date.gte': from, language: 'en-US' }).then((r) => pick(r, 'tv')),
  ]).then((lists) => {
    const all = lists[0].concat(lists[1]).sort((a, b) => String(a.date).localeCompare(String(b.date)));
    return Promise.all(all.map((x) => extras.tmdbImdb(x.type, x.id).catch(() => null))).then((ids) =>
      all.map((x, i) => (ids[i] ? (x.type === 'tv' ? [ids[i], x.title, yearOf(x.date), 's'] : [ids[i], x.title, yearOf(x.date)]) : null)).filter(Boolean)
    );
  });
}

// A film saga: its TMDB collection, when the names clearly match.
function collection(f) {
  const name = f.name.replace(/\b(saga|collection|franchise|films?|movies?)\b/gi, '').trim();
  return extras.searchCollections(name).then((list) => {
    let best = null;
    let score = 0;
    list.forEach((c) => {
      const s = likeness(name, String(c.name).replace(/\b(collection|coleção)\b/gi, ''));
      if (s > score) {
        score = s;
        best = c;
      }
    });
    if (!best || score < 0.85) return [];
    return extras.tmdbCollection(best.id).then((c) => c.items);
  });
}

// Checks TMDB (when the last check is old) → resolves with the updated collection.
export function refresh(f) {
  if (!extras.hasTmdb() || /^tmdb:/.test(f.id)) return Promise.resolve(f);
  const c = cache()[f.id];
  if (c && c.at > Date.now() - FRESH) return Promise.resolve(withLive(f));
  const series = f.items.some((it) => it[3] === 's');
  const job = f.id === 'mcu' ? mcu(f) : series ? Promise.resolve([]) : collection(f);
  return job
    .then((items) => {
      const have = {};
      f.items.forEach((it) => (have[it[0]] = 1));
      const all = cache();
      all[f.id] = { at: Date.now(), items: (items || []).filter((it) => !have[it[0]]) };
      store.set(KEY, all);
      return withLive(f);
    })
    .catch(() => withLive(f));
}
