// Built-in tracking: Trakt and Simkl, no add-on needed.
//
// - Sign in on the TV with a device code (trakt.tv/activate, simkl.com/pin): no typing passwords.
// - Scrobbles what plays here (start / pause / stop with the progress). Trakt and Simkl mark a
//   film or episode watched themselves when it stops past 80%.
// - Pulls the watched history into the app's watched markers, and Trakt's paused items
//   (from the phone, PC...) into Continue watching.
//
// Each profile has its own connection (stored per profile). API apps: the client ids/secret
// come from the build (KAI_TRAKT_ID, KAI_TRAKT_SECRET, KAI_SIMKL_ID) or from Settings.
import { request } from '../lib/http.js';
import * as store from '../lib/store.js';
import { log } from '../lib/log.js';
import * as watched from '../lib/watched.js';
import { t } from '../lib/i18n.js';

const TRAKT_API = 'https://api.trakt.tv';
const SIMKL_API = 'https://api.simkl.com';
const SYNC_EVERY = 30 * 60 * 1000;

export const PROVIDERS = ['trakt', 'simkl'];

// ---------- Keys and accounts ----------
const BUILT = {
  traktId: typeof __KAI_TRAKT_ID__ !== 'undefined' ? __KAI_TRAKT_ID__ : '',
  traktSecret: typeof __KAI_TRAKT_SECRET__ !== 'undefined' ? __KAI_TRAKT_SECRET__ : '',
  simklId: typeof __KAI_SIMKL_ID__ !== 'undefined' ? __KAI_SIMKL_ID__ : '',
};

// Older Trakt apps have a Client Secret; send it only when the user has one.
function withSecret(body, k) {
  if (k.traktSecret) body.client_secret = k.traktSecret;
  return body;
}

function keys() {
  const s = store.settings();
  return {
    // Own keys typed in Settings win; otherwise the app's own keys from the build (GitHub secrets).
    traktId: (s.traktClientId || '').trim() || BUILT.traktId,
    traktSecret: ((s.traktClientId || '').trim() ? (s.traktClientSecret || '').trim() : BUILT.traktSecret),
    simklId: (s.simklClientId || '').trim() || BUILT.simklId,
  };
}

// True when this build carries the app's own keys, so linking is just "scan and sign in".
export function hasBuiltInKeys(provider) {
  return provider === 'trakt' ? !!BUILT.traktId : !!BUILT.simklId;
}

export function hasKeys(provider) {
  const k = keys();
  // Trakt apps made on the new developer site have no secret (PKCE): the Client ID is enough.
  return provider === 'trakt' ? !!k.traktId : !!k.simklId;
}

export function account(provider) {
  return store.get('track.' + provider, null);
}

function saveAccount(provider, acc) {
  store.set('track.' + provider, acc);
}

export function isConnected(provider) {
  const a = account(provider);
  return !!(a && a.token && !a.invalid);
}

export function needsReconnect(provider) {
  const a = account(provider);
  return !!(a && a.invalid);
}

// Which service receives scrobbles (progressSource) and which one is pulled (librarySource): both | trakt | simkl.
function useFor(key, p) {
  const v = store.settings()[key];
  return v !== 'trakt' && v !== 'simkl' ? true : v === p;
}

export function connected() {
  return PROVIDERS.filter(isConnected);
}

export function disconnect(provider) {
  const a = account(provider);
  saveAccount(provider, null);
  if (provider === 'trakt' && a && a.token && hasKeys('trakt')) {
    const k = keys();
    request('POST', TRAKT_API + '/oauth/revoke', withSecret({ token: a.token, client_id: k.traktId }, k), { quiet: true }).catch(() => {});
  }
}

// ---------- HTTP ----------
function traktHeaders(token) {
  const hd = { 'trakt-api-version': '2', 'trakt-api-key': keys().traktId };
  if (token) hd.Authorization = 'Bearer ' + token;
  return hd;
}

function simklHeaders(token) {
  const hd = { 'simkl-api-key': keys().simklId };
  if (token) hd.Authorization = 'Bearer ' + token;
  return hd;
}

let refreshing = null;
function traktRefresh() {
  const a = account('trakt');
  if (!a || !a.refresh) return Promise.reject(new Error('no refresh token'));
  if (refreshing) return refreshing;
  const k = keys();
  refreshing = request(
    'POST',
    TRAKT_API + '/oauth/token',
    withSecret({ refresh_token: a.refresh, client_id: k.traktId, redirect_uri: 'urn:ietf:wg:oauth:2.0:oob', grant_type: 'refresh_token' }, k),
    { headers: traktHeaders(), quiet: true }
  )
    .then((r) => {
      saveAccount('trakt', Object.assign({}, a, tokenFields(r), { invalid: false }));
      return r.access_token;
    })
    .catch((e) => {
      if (e.status === 400 || e.status === 401) saveAccount('trakt', Object.assign({}, a, { invalid: true }));
      throw e;
    })
    .then(
      (v) => {
        refreshing = null;
        return v;
      },
      (e) => {
        refreshing = null;
        throw e;
      }
    );
  return refreshing;
}

function tokenFields(r) {
  return {
    token: r.access_token,
    refresh: r.refresh_token || null,
    expires: r.expires_in ? Date.now() + r.expires_in * 1000 : 0,
  };
}

function trakt(method, path, body) {
  const a = account('trakt');
  if (!a || !a.token) return Promise.reject(new Error('Trakt not connected'));
  const go = (token) => request(method, TRAKT_API + path, body, { headers: traktHeaders(token), quiet: true, timeout: 15000 });
  // Trakt tokens are short-lived now: refresh a little before they run out, and once on 401.
  const fresh = a.expires && a.expires - Date.now() < 3600000 ? traktRefresh().catch(() => a.token) : Promise.resolve(a.token);
  return fresh.then((token) =>
    go(token).catch((e) => {
      if (e.status !== 401) throw e;
      return traktRefresh().then(go);
    })
  );
}

function simkl(method, path, body) {
  const a = account('simkl');
  if (!a || !a.token) return Promise.reject(new Error('Simkl not connected'));
  return request(method, SIMKL_API + path, body, { headers: simklHeaders(a.token), quiet: true, timeout: 15000 }).catch((e) => {
    if (e.status === 401) saveAccount('simkl', Object.assign({}, a, { invalid: true }));
    throw e;
  });
}

// ---------- Device sign-in ----------
// Returns { code, url, cancel } and calls onDone(name) / onFail(message).
export function startLink(provider, onDone, onFail) {
  let stopped = false;
  let timer = null;
  const k = keys();
  const finish = (fn, v) => {
    if (stopped) return;
    stopped = true;
    clearTimeout(timer);
    fn(v);
  };

  const begin =
    provider === 'trakt'
      ? request('POST', TRAKT_API + '/oauth/device/code', { client_id: k.traktId }, { headers: traktHeaders(), quiet: true }).then((r) => ({
          code: r.user_code,
          url: r.verification_url || 'https://trakt.tv/activate',
          device: r.device_code,
          interval: (r.interval || 5) * 1000,
          expires: Date.now() + (r.expires_in || 600) * 1000,
        }))
      : request('GET', SIMKL_API + '/oauth/pin?client_id=' + encodeURIComponent(k.simklId), null, { quiet: true }).then((r) => ({
          code: r.user_code,
          url: r.verification_url || 'https://simkl.com/pin',
          device: r.device_code,
          interval: (r.interval || 5) * 1000,
          expires: Date.now() + (r.expires_in || 900) * 1000,
        }));

  const poll = (info) => {
    if (stopped) return;
    if (Date.now() > info.expires) return finish(onFail, 'expired');
    timer = setTimeout(() => {
      const check =
        provider === 'trakt'
          ? request('POST', TRAKT_API + '/oauth/device/token', withSecret({ code: info.device, client_id: k.traktId }, k), { headers: traktHeaders(), quiet: true })
          : request('GET', SIMKL_API + '/oauth/pin/' + encodeURIComponent(info.code) + '?client_id=' + encodeURIComponent(k.simklId), null, { quiet: true });
      check
        .then((r) => {
          if (stopped) return;
          const token = r && r.access_token;
          if (!token) return poll(info); // Simkl: { result: 'KO' } until the code is entered
          saveAccount(provider, Object.assign({ provider: provider }, tokenFields(r)));
          return whoAmI(provider)
            .catch(() => '')
            .then((name) => {
              const acc = account(provider);
              if (acc) saveAccount(provider, Object.assign({}, acc, { user: name }));
              finish(onDone, name);
              syncNow();
            });
        })
        .catch((e) => {
          // Trakt answers 400 while waiting, 429 "slow down"; 404/409/410/418 end the attempt.
          if (e.status === 400 || e.status === 429 || e.status === 0) return poll(e.status === 429 ? Object.assign({}, info, { interval: info.interval + 1000 }) : info);
          finish(onFail, e.status === 418 ? 'denied' : e.status === 410 ? 'expired' : e.message);
        });
    }, info.interval);
  };

  const handle = { code: '', url: '', cancel: () => finish(() => {}) };
  handle.ready = begin.then((info) => {
    handle.code = info.code;
    handle.url = info.url;
    poll(info);
    return handle;
  });
  handle.ready.catch((e) => finish(onFail, e.message));
  return handle;
}

function whoAmI(provider) {
  if (provider === 'trakt') return trakt('GET', '/users/settings').then((r) => (r && r.user && (r.user.name || r.user.username)) || '');
  return simkl('POST', '/users/settings', {}).then((r) => (r && r.user && r.user.name) || '');
}

// ---------- What is playing ----------
// Stremio ids: "tt123" (film / show) and "tt123:1:2" (episode); "tmdb:123" from some add-ons.
function ids(metaId) {
  const id = String(metaId || '');
  if (/^tt\d+$/.test(id)) return { imdb: id };
  const m = /^tmdb:(\d+)$/.exec(id);
  if (m) return { tmdb: Number(m[1]) };
  return null;
}

function item(meta, video) {
  const i = ids(meta && meta.id);
  if (!i) return null;
  if (meta.type === 'series') {
    if (!video || !(video.season > 0) || !(video.episode > 0)) return null;
    return { show: { ids: i, title: meta.name || undefined }, episode: { season: Number(video.season), number: Number(video.episode) } };
  }
  return { movie: { ids: i, title: meta.name || undefined } };
}

let playing = null; // { key, body, progress (0..1), lastAction, lastAt }

function scrobble(action, progress) {
  if (!playing) return;
  const body = Object.assign({}, playing.body, { progress: Math.max(0, Math.min(100, Math.round(progress * 10000) / 100)) });
  connected().filter((p) => useFor('progressSource', p)).forEach((p) => {
    const call = p === 'trakt' ? trakt('POST', '/scrobble/' + action, body) : simkl('POST', '/scrobble/' + action, body);
    call.then(() => log.info('tracker', p, action, body.progress)).catch((e) => {
      // 409: Trakt already has this (a second stop right after the first); not an error.
      if (e.status !== 409) log.warn('tracker', p, action, e.message);
    });
  });
  playing.lastAction = action;
  playing.lastAt = Date.now();
}

// Called by the player. fraction: 0..1
export function onPlay(meta, video, fraction) {
  if (!connected().length) return;
  const body = item(meta, video);
  if (!body) {
    playing = null;
    return;
  }
  const key = JSON.stringify(body);
  if (playing && playing.key !== key && playing.lastAction !== 'stop') scrobble('pause', playing.progress || 0);
  if (!playing || playing.key !== key) playing = { key: key, body: body, progress: fraction };
  playing.progress = fraction;
  if (playing.lastAction === 'start') return; // 'playing' also fires after every buffering pause
  scrobble('start', fraction);
}

export function onPause(fraction) {
  if (!playing || playing.lastAction === 'stop') return;
  playing.progress = fraction;
  if (playing.lastAction === 'pause') return;
  scrobble('pause', fraction);
}

export function onProgress(fraction) {
  if (playing) playing.progress = fraction;
}

// Leaving the player or the episode ending.
export function onStop(fraction) {
  if (!playing || playing.lastAction === 'stop') return;
  playing.progress = fraction;
  // Below 80% Trakt treats stop as pause (kept in its Continue watching); above, as watched.
  scrobble(fraction >= 0.8 ? 'stop' : 'pause', fraction);
  if (fraction >= 0.8) playing.lastAction = 'stop';
}

export function stop() {
  if (playing && playing.lastAction === 'start') onStop(playing.progress || 0);
  playing = null;
}

// ---------- Pull: watched history and paused items ----------
let syncing = null;
let lastSync = 0;

export function syncNow() {
  if (syncing) return syncing;
  const tasks = [];
  if (isConnected('trakt') && useFor('librarySource', 'trakt')) tasks.push(pullTraktWatched(), pullTraktPlayback());
  if (isConnected('simkl') && useFor('librarySource', 'simkl')) tasks.push(pullSimklWatched());
  if (!tasks.length) return Promise.resolve(false);
  lastSync = Date.now();
  syncing = Promise.all(tasks.map((p) => p.catch((e) => log.warn('tracker sync', e.message))))
    .then(() => true)
    .then(
      (v) => {
        syncing = null;
        return v;
      },
      () => {
        syncing = null;
        return false;
      }
    );
  return syncing;
}

// On app start / returning home: at most every SYNC_EVERY.
export function maybeSync() {
  if (Date.now() - lastSync < SYNC_EVERY) return Promise.resolve(false);
  return syncNow();
}

function pullTraktWatched() {
  return Promise.all([trakt('GET', '/sync/watched/movies'), trakt('GET', '/sync/watched/shows')]).then((res) => {
    const ids = [];
    (res[0] || []).forEach((m) => m.movie && m.movie.ids && m.movie.ids.imdb && ids.push(m.movie.ids.imdb));
    (res[1] || []).forEach((s) => {
      const imdb = s.show && s.show.ids && s.show.ids.imdb;
      if (!imdb) return;
      (s.seasons || []).forEach((se) => (se.episodes || []).forEach((ep) => ids.push(imdb + ':' + se.number + ':' + ep.number)));
    });
    watched.markWatchedMany(ids);
  });
}

function pullSimklWatched() {
  return simkl('GET', '/sync/all-items/?extended=full').then((r) => {
    if (!r) return;
    const ids = [];
    (r.movies || []).forEach((m) => {
      const imdb = m.movie && m.movie.ids && m.movie.ids.imdb;
      if (imdb && m.status === 'completed') ids.push(imdb);
    });
    (r.shows || []).concat(r.anime || []).forEach((s) => {
      const imdb = s.show && s.show.ids && s.show.ids.imdb;
      if (!imdb) return;
      (s.seasons || []).forEach((se) => (se.episodes || []).forEach((ep) => ids.push(imdb + ':' + se.number + ':' + ep.number)));
    });
    watched.markWatchedMany(ids);
  });
}

// Paused on another device → Continue watching here. Handed to whoever registered (home screen).
let playbackSink = null;
export function onPlayback(fn) {
  playbackSink = fn;
}

function pullTraktPlayback() {
  return trakt('GET', '/sync/playback?extended=full').then((list) => {
    const out = [];
    (list || []).forEach((p) => {
      const at = p.paused_at;
      const pct = Number(p.progress) || 0;
      if (pct < 1 || pct > 95) return;
      if (p.type === 'movie' && p.movie && p.movie.ids && p.movie.ids.imdb) {
        out.push({ type: 'movie', id: p.movie.ids.imdb, videoId: p.movie.ids.imdb, name: p.movie.title, runtime: p.movie.runtime || 0, progress: pct / 100, at: at });
      } else if (p.type === 'episode' && p.show && p.show.ids && p.show.ids.imdb && p.episode) {
        out.push({
          type: 'series',
          id: p.show.ids.imdb,
          videoId: p.show.ids.imdb + ':' + p.episode.season + ':' + p.episode.number,
          name: p.show.title,
          runtime: p.episode.runtime || (p.show && p.show.runtime) || 0,
          progress: pct / 100,
          at: at,
        });
      }
    });
    if (playbackSink && out.length) playbackSink(out);
  });
}

// Manual "watched" from the details screen (if the UI offers it).
export function markWatched(meta, video) {
  const body = item(meta, video);
  if (!body) return;
  const now = new Date().toISOString();
  const payload = body.movie ? { movies: [Object.assign({ watched_at: now }, body.movie)] } : { shows: [Object.assign({}, body.show, { seasons: [{ number: body.episode.season, episodes: [{ number: body.episode.number, watched_at: now }] }] })] };
  if (isConnected('trakt')) trakt('POST', '/sync/history', payload).catch((e) => log.warn('trakt history', e.message));
  if (isConnected('simkl')) simkl('POST', '/sync/history', payload).catch((e) => log.warn('simkl history', e.message));
}

// Trakt watchlist as a home row (Settings → Appearance → Home screen), newest first.
export function watchlistEntry() {
  if (!isConnected('trakt') || store.settings().traktWatchlistRow === false) return null;
  return {
    addon: { transportUrl: 'trakt', manifest: { id: 'trakt', name: 'Trakt' } },
    catalog: { id: 'watchlist', name: t('Minha lista do Trakt'), type: 'movie' },
    fetch: () =>
      trakt('GET', '/sync/watchlist?sort=added,desc').then((list) =>
        (list || [])
          .map((x) => {
            const m = x.movie || x.show;
            const imdb = m && m.ids && m.ids.imdb;
            return imdb ? { id: imdb, type: x.movie ? 'movie' : 'series', name: m.title, poster: 'https://images.metahub.space/poster/medium/' + imdb + '/img' } : null;
          })
          .filter(Boolean)
          .slice(0, 40)
      ),
  };
}
