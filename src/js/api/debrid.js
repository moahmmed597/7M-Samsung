// Debrid (like Nuvio): plays torrent sources through the user's own Real-Debrid, TorBox or
// Premiumize account, so they play without the PC server. Each user types their own API key in
// Settings (kept only on this TV); with no key this does nothing.
import { request, getJSON } from '../lib/http.js';
import * as store from '../lib/store.js';
import { t } from '../lib/i18n.js';
import * as server from './server.js';
import { fetchUrl as phoneFetchUrl } from '../lib/phone.js';

export const PROVIDERS = [
  { id: 'realdebrid', name: 'Real-Debrid', key: 'realDebridKey', site: 'real-debrid.com/apitoken' },
  { id: 'torbox', name: 'TorBox', key: 'torboxKey', site: 'torbox.app/settings' },
  { id: 'premiumize', name: 'Premiumize', key: 'premiumizeKey', site: 'premiumize.me/account' },
];

// The provider in use: the chosen one if it has a key, else the first with a key.
export function active() {
  const s = store.settings();
  if (s.debridEnabled === false) return null;
  const has = (p) => !!(s[p.key] || '').trim();
  const chosen = PROVIDERS.find((p) => p.id === s.debridProvider);
  const p = chosen && has(chosen) ? chosen : PROVIDERS.find(has);
  return p ? { id: p.id, name: p.name, key: s[p.key].trim() } : null;
}

const VIDEO_RE = /\.(mkv|mp4|avi|m4v|mov|ts|webm|wmv)$/i;

function magnet(infoHash, sources) {
  const tr = (sources || [])
    .filter((x) => /^tracker:/.test(x))
    .map((x) => '&tr=' + encodeURIComponent(x.slice(8)));
  return 'magnet:?xt=urn:btih:' + infoHash + tr.join('');
}

// files: [{ id, name, size }] in torrent order. Picks the file the add-on meant.
function pickFile(files, hint) {
  const vids = files.filter((f) => VIDEO_RE.test(f.name) && !/sample/i.test(f.name));
  const pool = vids.length ? vids : files;
  if (!pool.length) return null;
  const base = (n) => String(n || '').split('/').pop().toLowerCase();
  if (hint.filename) {
    const m = pool.find((f) => base(f.name) === base(hint.filename));
    if (m) return m;
  }
  if (hint.season != null && hint.episode != null) {
    const s = +hint.season;
    const e = +hint.episode;
    const re = new RegExp('(s0*' + s + '[ ._-]*e0*' + e + '(?!\\d))|(\\b' + s + 'x0*' + e + '(?!\\d))', 'i');
    const m = pool.find((f) => re.test(base(f.name)));
    if (m) return m;
  }
  if (hint.fileIdx != null && files[hint.fileIdx] && pool.indexOf(files[hint.fileIdx]) >= 0) return files[hint.fileIdx];
  return pool.slice().sort((a, b) => b.size - a.size)[0];
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function notCached(name) {
  return new Error(t('{name}: este torrent ainda não está no cache. Escolha outra fonte.', { name: name }));
}

// ---------- Real-Debrid ----------
const RD = 'https://api.real-debrid.com/rest/1.0/';
function rd(key, method, path, body) {
  return request(method, RD + path, body, { form: true, timeout: 20000, headers: { Authorization: 'Bearer ' + key } });
}
function realDebrid(key, mag, hint) {
  return rd(key, 'POST', 'torrents/addMagnet', { magnet: mag }).then((added) => {
    const id = added && added.id;
    if (!id) throw new Error('Real-Debrid: addMagnet');
    const info = () => rd(key, 'GET', 'torrents/info/' + encodeURIComponent(id));
    return info()
      .then((tor) => {
        const files = (tor.files || []).map((f) => ({ id: f.id, name: f.path, size: f.bytes }));
        const file = pickFile(files, hint);
        if (!file) throw new Error('Real-Debrid: no files');
        return rd(key, 'POST', 'torrents/selectFiles/' + encodeURIComponent(id), { files: String(file.id) });
      })
      .then(function poll(_, n) {
        n = n || 0;
        return info().then((tor) => {
          if (tor.status === 'downloaded' && tor.links && tor.links.length) return tor.links[0];
          if (n >= 3 || /error|dead|virus|magnet_error/.test(tor.status)) {
            rd(key, 'DELETE', 'torrents/delete/' + encodeURIComponent(id)).catch(() => {});
            throw notCached('Real-Debrid');
          }
          return wait(1500).then(() => poll(null, n + 1));
        });
      })
      .then((link) => rd(key, 'POST', 'unrestrict/link', { link: link }))
      .then((r) => {
        if (!r || !r.download) throw new Error('Real-Debrid: unrestrict');
        return r.download;
      });
  });
}

// ---------- TorBox ----------
const TB = 'https://api.torbox.app/v1/api/';
function torbox(key, mag, hint) {
  const auth = { Authorization: 'Bearer ' + key };
  return request('POST', TB + 'torrents/createtorrent', { magnet: mag, allow_zip: 'false' }, { form: true, timeout: 20000, headers: auth }).then((r) => {
    const id = r && r.data && r.data.torrent_id;
    if (!id) throw new Error((r && r.detail) || 'TorBox: createtorrent');
    const poll = (n) =>
      getJSON(TB + 'torrents/mylist?bypass_cache=true&id=' + encodeURIComponent(id), { timeout: 15000, headers: auth }).then((l) => {
        const tor = l && l.data;
        if (tor && (tor.download_present || tor.download_finished) && tor.files && tor.files.length) return tor;
        if (n >= 3) throw notCached('TorBox');
        return wait(1500).then(() => poll(n + 1));
      });
    return poll(0).then((tor) => {
      const files = tor.files.map((f) => ({ id: f.id, name: f.name || f.short_name, size: f.size }));
      const file = pickFile(files, hint);
      if (!file) throw new Error('TorBox: no files');
      return getJSON(TB + 'torrents/requestdl?token=' + encodeURIComponent(key) + '&torrent_id=' + encodeURIComponent(id) + '&file_id=' + encodeURIComponent(file.id), { timeout: 15000 }).then((d) => {
        if (!d || !d.data) throw new Error('TorBox: requestdl');
        return d.data;
      });
    });
  });
}

// ---------- Premiumize ----------
function premiumize(key, mag, hint) {
  return request('POST', 'https://www.premiumize.me/api/transfer/directdl', { src: mag, apikey: key }, { form: true, timeout: 25000 }).then((r) => {
    if (!r || r.status !== 'success' || !r.content || !r.content.length) throw notCached('Premiumize');
    const files = r.content.map((f, i) => ({ id: i, name: f.path, size: f.size, link: f.stream_link || f.link }));
    const file = pickFile(files, hint);
    if (!file || !file.link) throw notCached('Premiumize');
    return file.link;
  });
}

// Turns a torrent into a direct link. hint: { fileIdx, filename, season, episode }.
export function resolve(infoHash, sources, hint) {
  return freshRealDebrid().then(() => resolveNow(infoHash, sources, hint));
}

function resolveNow(infoHash, sources, hint) {
  const p = active();
  if (!p) return Promise.reject(new Error('debrid off'));
  const mag = magnet(String(infoHash).toLowerCase(), sources);
  const fn = p.id === 'realdebrid' ? realDebrid : p.id === 'torbox' ? torbox : premiumize;
  return fn(p.key, mag, hint || {}).catch((e) => {
    if (e.status === 401 || e.status === 403) throw new Error(t('{name}: a chave de API foi recusada. Confira em Ajustes → Debrid.', { name: p.name }));
    throw e;
  });
}

// Checks a key against the provider's account endpoint.
export function testKey(id, key) {
  if (id === 'realdebrid') return request('GET', RD + 'user', null, { timeout: 15000, headers: { Authorization: 'Bearer ' + key } }).then((u) => (u && u.username) || 'OK');
  if (id === 'torbox')
    return getJSON(TB + 'user/me', { timeout: 15000, headers: { Authorization: 'Bearer ' + key } }).then((u) => (u && u.data && u.data.email ? u.data.email : 'OK'));
  return getJSON('https://www.premiumize.me/api/account/info?apikey=' + encodeURIComponent(key), { timeout: 15000 }).then((u) => {
    if (!u || u.status !== 'success') throw new Error(t('Chave inválida'));
    return u.customer_id ? String(u.customer_id) : 'OK';
  });
}

// ---------- Sign-in by QR (no API key to copy) ----------
// TorBox: device flow for apps (just an app name). Real-Debrid: the public client id for open-source
// apps; approving gives this TV its own credentials, and the access token renews itself.
const RD_OAUTH = 'https://api.real-debrid.com/oauth/v2/';
const RD_OPEN_CLIENT = 'X245A4XAIBGVM';
const RD_GRANT = 'http://oauth.net/grant_type/device/1.0';

export function canSignIn(id) {
  return id === 'torbox' || id === 'realdebrid';
}

// For views/deviceLink.js: { name, start() }.
export function signInFlow(id) {
  const p = PROVIDERS.find((x) => x.id === id);
  if (id === 'torbox')
    return {
      name: p.name,
      start: () =>
        server.getJSONViaProxy(TB + 'user/auth/device/start?app=' + encodeURIComponent('Stremio Kai'), { timeout: 15000 }).then((r) => {
          const d = r && r.data;
          if (!d || !d.device_code) throw new Error('TorBox');
          return {
            code: d.code,
            url: d.friendly_verification_url || d.verification_url,
            qrUrl: d.verification_url_complete || d.verification_url,
            interval: d.interval,
            expiresIn: d.expires_in,
            poll: () =>
              // TorBox refuses the app's origin (no CORS): straight first, then through the TV service.
              request('POST', TB + 'user/auth/device/token', { device_code: d.device_code }, { timeout: 15000, quiet: true })
                .catch((e) => {
                  if (e.status) throw e;
                  return request('POST', phoneFetchUrl(TB + 'user/auth/device/token'), { device_code: d.device_code }, { timeout: 15000, quiet: true });
                })
                .then(
                (x) => {
                  const token = x && x.data && x.data.access_token;
                  if (!token) return 'pending';
                  store.saveSettings({ torboxKey: token, debridProvider: store.settings().debridProvider || 'torbox' });
                  return 'ok';
                },
                (e) => (e.status === 410 ? 'expired' : 'pending')
              ),
          };
        }),
    };
  if (id === 'realdebrid')
    return {
      name: p.name,
      start: () =>
        getJSON(RD_OAUTH + 'device/code?client_id=' + RD_OPEN_CLIENT + '&new_credentials=yes', { timeout: 15000 }).then((d) => {
          if (!d || !d.device_code) throw new Error('Real-Debrid');
          return {
            code: d.user_code,
            url: d.verification_url,
            qrUrl: d.direct_verification_url || d.verification_url,
            interval: d.interval,
            expiresIn: d.expires_in,
            poll: () =>
              getJSON(RD_OAUTH + 'device/credentials?client_id=' + RD_OPEN_CLIENT + '&code=' + encodeURIComponent(d.device_code), { timeout: 15000, quiet: true })
                .then(
                  (c) => (c && c.client_id && c.client_secret ? rdToken(c.client_id, c.client_secret, d.device_code).then(() => 'ok') : 'pending'),
                  (e) => (e.status === 403 ? 'denied' : 'pending')
                ),
          };
        }),
    };
  return null;
}

// Exchanges the device code (or the refresh token) for an access token and keeps both.
function rdToken(clientId, clientSecret, code) {
  return request('POST', RD_OAUTH + 'token', { client_id: clientId, client_secret: clientSecret, code: code, grant_type: RD_GRANT }, { form: true, timeout: 15000 }).then(
    (r) => {
      if (!r || !r.access_token) throw new Error('Real-Debrid token');
      store.saveSettings({
        realDebridKey: r.access_token,
        realDebridAuth: { clientId: clientId, clientSecret: clientSecret, refresh: r.refresh_token, expiresAt: Date.now() + (r.expires_in || 3600) * 1000 },
      });
      return r.access_token;
    }
  );
}

// Before using Real-Debrid: renew the access token when it came from QR sign-in and is about to end.
export function freshRealDebrid() {
  const a = store.settings().realDebridAuth;
  if (!a || !a.refresh || Date.now() < (a.expiresAt || 0) - 120000) return Promise.resolve();
  return rdToken(a.clientId, a.clientSecret, a.refresh).catch(() => {});
}
