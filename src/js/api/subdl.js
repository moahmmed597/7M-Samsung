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
export function search(type, videoId, meta, video) {
  const k = key();
  let imdbId = '';
  let season = null;
  let episode = null;
  const m = String(videoId || '').match(/^(tt\d+)(?::(\d+):(\d+))?$/);
  if (m) {
    imdbId = m[1];
    season = m[2];
    episode = m[3];
  } else if (meta && meta.imdb_id) {
    imdbId = String(meta.imdb_id).trim();
    if (video) {
      if (video.season !== undefined) season = video.season;
      if (video.episode !== undefined) episode = video.episode;
    }
  }
  if (!k || !imdbId) return Promise.resolve([]);
  const isSeries = type === 'series' || season !== null;
  const params = ['api_key=' + encodeURIComponent(k), 'imdb_id=' + imdbId, 'type=' + (isSeries ? 'tv' : 'movie'), 'languages=' + prefLangs(), 'subs_per_page=30'];
  if (season !== null && episode !== null) params.push('season_number=' + season, 'episode_number=' + episode);
  const ep = season !== null && episode !== null ? 'S' + ('0' + season).slice(-2) + 'E' + ('0' + episode).slice(-2) : '';
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
