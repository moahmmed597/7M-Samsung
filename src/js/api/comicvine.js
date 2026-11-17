// Comics catalog: ComicVine (comicvine.gamespot.com), with YOUR free API key (Settings → Keys, or the
// phone page). ComicVine does not answer apps directly, so requests go through the TV service.
// It is a catalog only (covers, issues, characters); reading comes from your own sources (plugins).
import * as store from '../lib/store.js';
import { httpRaw } from './plugins.js';

const API = 'https://comicvine.gamespot.com/api/';
const VOL_FIELDS = 'id,name,image,publisher,start_year,count_of_issues,deck';

export const key = () => String(store.settings().comicvineKey || '').trim();
export const hasKey = () => !!key();

const cache = {};
function get(path, params) {
  if (!key()) return Promise.reject(new Error('no ComicVine key'));
  const q = Object.assign({ api_key: key(), format: 'json' }, params || {});
  const url = API + path + '?' + Object.keys(q).map((k) => k + '=' + encodeURIComponent(q[k])).join('&');
  if (cache[url]) return cache[url];
  const p = httpRaw(url, { timeoutMs: 20000 }).then((r) => {
    let j = null;
    try {
      j = JSON.parse((r && r.body) || '');
    } catch (e) {}
    if (!j) throw new Error('HTTP ' + (r ? r.status : '?'));
    if (j.status_code !== 1) throw new Error(j.status_code === 100 ? 'bad key' : j.error || 'ComicVine');
    return j;
  });
  cache[url] = p;
  p.catch(() => delete cache[url]);
  return p;
}

const img = (i) => (i && (i.medium_url || i.small_url || i.original_url || i.super_url)) || '';
const wide = (i) => (i && (i.screen_large_url || i.super_url || i.original_url || i.medium_url)) || '';

// A ComicVine volume (a series: "The Amazing Spider-Man (1963)") in the shape the views use.
export function toMeta(v) {
  return {
    id: 'cv:' + v.id,
    cvId: v.id,
    type: 'comic',
    title: v.name || '',
    name: (v.name || '') + (v.start_year ? ' (' + v.start_year + ')' : ''),
    year: v.start_year ? parseInt(v.start_year, 10) || null : null,
    poster: img(v.image),
    art: wide(v.image),
    publisher: (v.publisher && v.publisher.name) || '',
    issues: v.count_of_issues || 0,
    deck: v.deck || '',
  };
}

// Big publishers first, then the longer series: what you most likely mean by "Batman".
const MAJOR = { Marvel: 3, DC: 3, 'DC Comics': 3, Image: 2, 'Dark Horse Comics': 2, 'IDW Publishing': 1, 'BOOM! Studios': 1, Vertigo: 2, 'Dynamite Entertainment': 1, 'Valiant': 1 };
function rank(list) {
  return list
    .filter((v) => v && v.count_of_issues > 0 && v.image)
    .sort((a, b) => (MAJOR[(b.publisher || {}).name] || 0) - (MAJOR[(a.publisher || {}).name] || 0) || b.count_of_issues - a.count_of_issues);
}

// Series whose name contains the words (page: 0, 1, ...). Ranked: big publishers, long runs.
export function searchVolumes(query, pageNo) {
  return get('volumes/', { filter: 'name:' + query, sort: 'count_of_issues:desc', limit: 100, offset: (pageNo || 0) * 100, field_list: VOL_FIELDS }).then((j) => ({
    items: rank(j.results || []).map(toMeta),
    more: (j.offset || 0) + (j.number_of_page_results || 0) < (j.number_of_total_results || 0),
  }));
}

// One series with its description and main characters.
export function volume(id) {
  return get('volume/4050-' + id + '/', { field_list: VOL_FIELDS + ',description,characters' }).then((j) => {
    const v = j.results || {};
    const m = toMeta(v);
    m.description = v.description || v.deck || '';
    m.characters = (v.characters || []).slice().sort((a, b) => (b.count || 0) - (a.count || 0)).map((c) => c.name);
    return m;
  });
}

// Issues out in the last `days` days, one card per series (newest first).
export function newThisWeek(days) {
  const d = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
  return get('issues/', { filter: 'store_date:' + d(days || 7) + '|' + d(-1), sort: 'store_date:desc', limit: 100, field_list: 'id,issue_number,image,volume,store_date' }).then((j) => {
    const seen = {};
    const out = [];
    (j.results || []).forEach((i) => {
      const v = i.volume || {};
      if (!v.id || seen[v.id] || !i.image) return;
      seen[v.id] = 1;
      out.push({ id: 'cv:' + v.id, cvId: v.id, type: 'comic', title: v.name || '', name: (v.name || '') + ' #' + (i.issue_number || ''), poster: img(i.image), art: wide(i.image) });
    });
    return out;
  });
}

// A publisher's logo (Marvel, DC...): the exact name, else the closest one.
export function publisherLogo(name) {
  return get('publishers/', { filter: 'name:' + name, field_list: 'id,name,image', limit: 20 }).then((j) => {
    const list = (j.results || []).filter((p) => p.image);
    const low = String(name).toLowerCase();
    const p = list.find((x) => String(x.name).toLowerCase() === low) || list.sort((a, b) => String(a.name).length - String(b.name).length)[0];
    return p ? (p.image.original_url || p.image.super_url || p.image.medium_url || '') : '';
  });
}

// Checks the key (Settings): resolves true when ComicVine accepts it.
export function checkKey() {
  return get('types/', {}).then(() => true);
}
