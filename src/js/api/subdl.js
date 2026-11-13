// SubDL (subdl.com): Arabic (and other) subtitles with the user's own API key from Settings.
// Search goes through the TV service when the API refuses the app's origin; the ZIP files are
// unpacked by the TV service (/api/subzip), which also converts Windows-1256 Arabic to UTF-8.
import * as server from './server.js';
import * as store from '../lib/store.js';
import { PORT } from '../lib/phone.js';

const API = 'https://api.subdl.com/api/v1/subtitles';
const DL = 'https://dl.subdl.com';
// SubDL language codes → the 3-letter codes the rest of the app uses.
const LANGS = { AR: 'ara', EN: 'eng', FR: 'fre', ES: 'spa', TR: 'tur', FA: 'per', UR: 'urd' };

export function key() {
  return (store.settings().subdlKey || '').trim();
}

function prefLangs() {
  const map = { ara: 'AR', ar: 'AR', eng: 'EN', en: 'EN', spa: 'ES', es: 'ES', fre: 'FR', fr: 'FR', tur: 'TR', tr: 'TR' };
  const out = [];
  (store.settings().subtitleLangs || []).forEach((l) => {
    const c = map[String(l).toLowerCase()];
    if (c && out.indexOf(c) < 0) out.push(c);
  });
  if (out.indexOf('AR') < 0) out.unshift('AR');
  return out.join(',');
}

// Resolves to subtitle entries like the add-ons give: { id, lang, url, addon }.
export function search(type, videoId) {
  const k = key();
  const m = String(videoId || '').match(/^(tt\d+)(?::(\d+):(\d+))?$/);
  if (!k || !m) return Promise.resolve([]);
  const params = ['api_key=' + encodeURIComponent(k), 'imdb_id=' + m[1], 'type=' + (type === 'series' ? 'tv' : 'movie'), 'languages=' + prefLangs(), 'subs_per_page=30'];
  if (m[2]) params.push('season_number=' + m[2], 'episode_number=' + m[3]);
  const ep = m[2] ? 'S' + ('0' + m[2]).slice(-2) + 'E' + ('0' + m[3]).slice(-2) : '';
  return server
    .getJSONViaProxy(API + '?' + params.join('&'), { timeout: 12000 })
    .then((r) =>
      ((r && r.subtitles) || [])
        .filter((s) => s && s.url)
        .map((s, i) => ({
          id: 'subdl-' + i + '-' + s.url,
          lang: LANGS[String(s.language || s.lang || '').toUpperCase()] || String(s.lang || s.language || '').toLowerCase(),
          url: 'http://127.0.0.1:' + PORT + '/api/subzip?url=' + encodeURIComponent(DL + s.url) + (ep ? '&ep=' + ep : ''),
          addon: 'SubDL' + (s.release_name ? ' · ' + s.release_name : ''),
        }))
    )
    .catch(() => []);
}
