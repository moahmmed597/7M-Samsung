// MDBList lists as home rows (like Nuvio), with the user's own MDBList key from Settings.
import { getJSONViaProxy } from './server.js';
import * as store from '../lib/store.js';

const API = 'https://api.mdblist.com/';
const POSTER = (imdb) => 'https://images.metahub.space/poster/medium/' + imdb + '/img';

function apiKey() {
  return (store.settings().mdblistKey || '').trim();
}

export function hasKey() {
  return !!apiKey();
}

function call(path) {
  const sep = path.indexOf('?') >= 0 ? '&' : '?';
  return getJSONViaProxy(API + path + sep + 'apikey=' + encodeURIComponent(apiKey()), { timeout: 15000 });
}

// The user's own lists: [{ id, name, items }]
export function myLists() {
  if (!hasKey()) return Promise.resolve([]);
  return call('lists/user').then((r) => (Array.isArray(r) ? r : []).map((l) => ({ id: String(l.id), name: l.name, items: l.items || 0 })));
}

// A list by "user/list-slug", a mdblist.com URL or a numeric id: { id, name }.
export function findList(text) {
  const v = String(text || '').trim();
  const m = v.match(/mdblist\.com\/lists\/([^/?#]+)\/([^/?#]+)/i) || v.match(/^([\w.-]+)\/([\w.-]+)$/);
  const path = m ? 'lists/' + encodeURIComponent(m[1]) + '/' + encodeURIComponent(m[2]) : /^\d+$/.test(v) ? 'lists/' + v : null;
  if (!path) return Promise.reject(new Error('?'));
  return call(path).then((r) => {
    const l = Array.isArray(r) ? r[0] : r;
    if (!l || !l.id) throw new Error('?');
    return { id: String(l.id), name: l.name };
  });
}

export function rows() {
  return hasKey() ? store.settings().mdblistRows || [] : [];
}

export function setRows(list) {
  store.saveSettings({ mdblistRows: list });
}

// Stremio-style metas of a list.
export function items(id) {
  return call('lists/' + encodeURIComponent(id) + '/items?limit=40').then((r) => {
    const out = [];
    const add = (x, type) => x && x.imdb_id && out.push({ id: x.imdb_id, type: type, name: x.title, poster: POSTER(x.imdb_id), rank: x.rank || 0 });
    ((r && r.movies) || []).forEach((x) => add(x, 'movie'));
    ((r && r.shows) || []).forEach((x) => add(x, 'series'));
    return out.sort((a, b) => a.rank - b.rank);
  });
}

// Board entries, shaped like add-on catalog entries.
export function boardEntries() {
  return rows().map((l) => ({
    addon: { transportUrl: 'mdblist', manifest: { id: 'mdblist', name: 'MDBList' } },
    catalog: { id: l.id, name: l.name, type: 'movie' },
    fetch: () => items(l.id),
  }));
}
