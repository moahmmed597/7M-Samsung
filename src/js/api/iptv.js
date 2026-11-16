// Live TV sources you add yourself (the app ships no channels):
//  - Xtream Codes account (server + username + password): categories, then the channels of one
//    category at a time (light on the TV), and "now / next" for the channels on screen.
//  - M3U playlist link: read once, grouped by group-title.
// Requests go through the TV service (/api/phttp): IPTV servers rarely allow the app's origin.
import { httpRaw } from './plugins.js';
import * as store from '../lib/store.js';

const KEY = 'iptvSources';
const FAVS = 'iptvFavs';

export const sources = () => store.get(KEY, []) || [];
export function saveSource(src) {
  const all = sources().filter((x) => x.id !== src.id);
  all.push(src);
  store.set(KEY, all);
  store.set('iptvActive', src.id);
}
export function removeSource(id) {
  store.set(KEY, sources().filter((x) => x.id !== id));
  if (store.get('iptvActive', '') === id) store.set('iptvActive', '');
  delete cache[id];
}
export function active() {
  const all = sources();
  return all.find((x) => x.id === store.get('iptvActive', '')) || all[0] || null;
}
export function setActive(id) {
  store.set('iptvActive', id);
}

export const favs = () => store.get(FAVS, {}) || {};
export function toggleFav(srcId, ch) {
  const all = favs();
  const k = srcId + '|' + ch.id;
  if (all[k]) delete all[k];
  else all[k] = { id: ch.id, name: ch.name, logo: ch.logo, url: ch.url, cat: ch.cat, epg: ch.epg, src: srcId };
  store.set(FAVS, all);
  return !!all[k];
}
export const isFav = (srcId, chId) => !!favs()[srcId + '|' + chId];
export const favList = (srcId) =>
  Object.keys(favs())
    .map((k) => favs()[k])
    .filter((c) => c.src === srcId);

function get(url, json) {
  return httpRaw(url, { timeoutMs: 30000 }).then((r) => {
    if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));
    if (!json) return r.body;
    try {
      return JSON.parse(r.body);
    } catch (e) {
      throw new Error('bad answer');
    }
  });
}

const base = (s) => String(s.url || '').replace(/\/+$/, '');
const api = (s, action, extra) =>
  base(s) + '/player_api.php?username=' + encodeURIComponent(s.user) + '&password=' + encodeURIComponent(s.pass) + (action ? '&action=' + action : '') + (extra || '');

// Checks an Xtream login; resolves with the account info or rejects.
export function checkXtream(s) {
  return get(api(s, ''), true).then((r) => {
    if (!r || !r.user_info || String(r.user_info.auth) !== '1') throw new Error('login');
    return r.user_info;
  });
}

const cache = {}; // per source: { cats, byCat: {catId: channels}, m3u: channels }

// [{ id, name }]
export function categories(s) {
  const c = (cache[s.id] = cache[s.id] || { byCat: {} });
  if (c.cats) return Promise.resolve(c.cats);
  if (s.type === 'xtream') {
    return get(api(s, 'get_live_categories'), true).then((list) => {
      c.cats = (Array.isArray(list) ? list : []).map((x) => ({ id: String(x.category_id), name: String(x.category_name || '') }));
      return c.cats;
    });
  }
  return loadM3u(s).then(() => c.cats);
}

// Channels of one category: [{ id, name, logo, url, cat, epg, num }]
export function channels(s, catId) {
  const c = (cache[s.id] = cache[s.id] || { byCat: {} });
  if (c.byCat[catId]) return Promise.resolve(c.byCat[catId]);
  if (s.type === 'xtream') {
    return get(api(s, 'get_live_streams', '&category_id=' + encodeURIComponent(catId)), true).then((list) => {
      const out = (Array.isArray(list) ? list : []).map((x) => ({
        id: String(x.stream_id),
        name: String(x.name || ''),
        logo: x.stream_icon || '',
        url: base(s) + '/live/' + encodeURIComponent(s.user) + '/' + encodeURIComponent(s.pass) + '/' + x.stream_id + '.' + (s.format || 'm3u8'),
        cat: String(x.category_id || catId),
        epg: x.epg_channel_id || '',
        num: x.num || '',
      }));
      c.byCat[catId] = out;
      return out;
    });
  }
  return loadM3u(s).then(() => c.byCat[catId] || []);
}

// Channel lists already in memory for a source (used by search).
export function loaded(s) {
  const c = cache[s.id];
  return c ? Object.keys(c.byCat).map((k) => c.byCat[k]) : [];
}

function loadM3u(s) {
  const c = (cache[s.id] = cache[s.id] || { byCat: {} });
  if (c.cats) return Promise.resolve();
  return get(s.url, false).then((text) => {
    const cats = [];
    const seen = {};
    const lines = String(text || '').split(/\r?\n/);
    let info = null;
    let n = 0;
    for (let i = 0; i < lines.length && n < 30000; i++) {
      const l = lines[i].trim();
      if (!l) continue;
      if (l.indexOf('#EXTINF') === 0) {
        const attr = (k) => {
          const m = new RegExp(k + '="([^"]*)"', 'i').exec(l);
          return m ? m[1] : '';
        };
        const comma = l.lastIndexOf(',');
        info = { name: comma >= 0 ? l.slice(comma + 1).trim() : '', logo: attr('tvg-logo'), group: attr('group-title') || '—', epg: attr('tvg-id') };
      } else if (l.charAt(0) !== '#' && info) {
        const g = info.group;
        if (!seen[g]) {
          seen[g] = 1;
          cats.push({ id: g, name: g });
          c.byCat[g] = [];
        }
        c.byCat[g].push({ id: 'm' + n, name: info.name || l, logo: info.logo, url: l, cat: g, epg: info.epg, num: String(n + 1) });
        n++;
        info = null;
      }
    }
    c.cats = cats;
  });
}

// What is on now and next (Xtream only): [{ title, start, end }] in ms.
const epgCache = {};
export function nowNext(s, ch) {
  if (!s || s.type !== 'xtream') return Promise.resolve([]);
  const k = s.id + '|' + ch.id;
  const hit = epgCache[k];
  if (hit && Date.now() - hit.at < 10 * 60000) return Promise.resolve(hit.list);
  return get(api(s, 'get_short_epg', '&stream_id=' + encodeURIComponent(ch.id) + '&limit=2'), true)
    .then((r) => {
      const list = ((r && r.epg_listings) || []).map((e) => ({
        title: b64(e.title),
        start: Number(e.start_timestamp) * 1000,
        end: Number(e.stop_timestamp) * 1000,
      }));
      epgCache[k] = { at: Date.now(), list: list };
      return list;
    })
    .catch(() => []);
}
function b64(x) {
  try {
    return decodeURIComponent(escape(atob(String(x || ''))));
  } catch (e) {
    return String(x || '');
  }
}
