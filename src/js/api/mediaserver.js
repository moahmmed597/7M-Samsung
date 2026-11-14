// Jellyfin / Emby (like Nuvio's media servers): the user's own server appears as a stream source.
// Only the server address and the access token are kept on this TV, never the password.
import { request } from '../lib/http.js';
import * as store from '../lib/store.js';
import { t } from '../lib/i18n.js';

export const KINDS = [
  { id: 'jellyfin', name: 'Jellyfin' },
  { id: 'emby', name: 'Emby' },
];

export function connection() {
  const c = store.settings().mediaServer;
  return c && c.token && c.address ? c : null;
}

export function enabled() {
  return !!connection() && store.settings().mediaServerEnabled !== false;
}

function deviceId() {
  let id = store.settings().mediaServerDeviceId;
  if (!id) {
    id = 'tv' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
    store.saveSettings({ mediaServerDeviceId: id });
  }
  return id;
}

function root(c) {
  return c.address + (c.providerId === 'emby' ? '/emby' : '');
}

function headers(c) {
  const auth = 'MediaBrowser Client="Stremio 7M", Device="Samsung TV", DeviceId="' + deviceId() + '", Version="1.0"' + (c.token ? ', Token="' + c.token + '"' : '');
  const h = {};
  h[c.providerId === 'emby' ? 'X-Emby-Authorization' : 'Authorization'] = auth;
  return h;
}

function call(c, method, path, body) {
  return request(method, root(c) + path, body, { timeout: 15000, headers: headers(c) });
}

export function normalizeAddress(value) {
  let v = String(value || '').trim();
  if (!v) return '';
  if (!/^https?:\/\//i.test(v)) v = 'http://' + v;
  if (!/:\d+(\/|$)/.test(v.replace(/^https?:\/\//i, '')) && /^http:/i.test(v)) v = v.replace(/\/*$/, '') + ':8096';
  return v.replace(/\/+$/, '').replace(/\/emby$/i, '');
}

// Logs in with the user's name and password; keeps only the token.
export function connect(providerId, address, username, password) {
  const draft = { providerId: providerId, address: normalizeAddress(address) };
  if (!draft.address) return Promise.reject(new Error(t('Endereço inválido')));
  return call(draft, 'GET', '/System/Info/Public').then((info) =>
    call(draft, 'POST', '/Users/AuthenticateByName', { Username: username, Pw: password || '' }).then((auth) => {
      if (!auth || !auth.AccessToken || !auth.User) throw new Error(t('Usuário ou senha errados'));
      const c = {
        providerId: providerId,
        address: draft.address,
        token: auth.AccessToken,
        userId: auth.User.Id,
        user: auth.User.Name || username,
        name: (info && info.ServerName) || draft.address,
      };
      store.saveSettings({ mediaServer: c, mediaServerEnabled: true });
      return c;
    })
  );
}

export function disconnect() {
  const c = connection();
  if (c) call(c, 'POST', '/Sessions/Logout').catch(() => {});
  store.saveSettings({ mediaServer: null });
}

function q(obj) {
  return Object.keys(obj)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]))
    .join('&');
}

function findItem(c, type, imdb) {
  const params = {
    Recursive: 'true',
    IncludeItemTypes: type === 'movie' ? 'Movie' : 'Series',
    AnyProviderIdEquals: 'imdb.' + imdb,
    Fields: 'ProviderIds,MediaSources',
    Limit: 20,
  };
  return call(c, 'GET', '/Users/' + c.userId + '/Items?' + q(params)).then((r) =>
    ((r && r.Items) || []).filter((it) => {
      const ids = it.ProviderIds || {};
      return String(ids.Imdb || ids.IMDB || ids.imdb || '') === imdb;
    })
  );
}

function streamUrl(c, itemId, sourceId) {
  return root(c) + '/Videos/' + encodeURIComponent(itemId) + '/stream?' + q({ static: 'true', MediaSourceId: sourceId, DeviceId: deviceId(), api_key: c.token });
}

function sizeLabel(bytes) {
  if (!bytes) return '';
  return bytes > 1073741824 ? (bytes / 1073741824).toFixed(1) + ' GB' : Math.round(bytes / 1048576) + ' MB';
}

// Stremio ids: "tt123" (movie) or "tt123:1:2" (episode).
export function streams(type, id) {
  const c = connection();
  const m = String(id).match(/^(tt\d+)(?::(\d+):(\d+))?$/);
  if (!c || !m) return Promise.resolve([]);
  return findItem(c, type, m[1]).then((items) => {
    if (items.length !== 1) return [];
    const item = items[0];
    const pick =
      type === 'movie'
        ? Promise.resolve(item)
        : call(c, 'GET', '/Shows/' + encodeURIComponent(item.Id) + '/Episodes?' + q({ UserId: c.userId, Season: m[2], Fields: 'MediaSources' })).then((r) =>
            ((r && r.Items) || []).find((ep) => ep.ParentIndexNumber === +m[2] && ep.IndexNumber === +m[3] && !ep.IsMissing)
          );
    return pick.then((it) =>
      !it
        ? []
        : (it.MediaSources || []).map((src) => {
            const video = (src.MediaStreams || []).find((x) => x.Type === 'Video');
            const audio = (src.MediaStreams || []).find((x) => x.Type === 'Audio');
            return {
              name: c.name,
              title: [src.Name || it.Name, [video && video.DisplayTitle, audio && audio.DisplayTitle, (src.Container || '').toUpperCase(), sizeLabel(src.Size)].filter(Boolean).join(' · ')].join('\n'),
              url: streamUrl(c, it.Id, src.Id),
              behaviorHints: { filename: (src.Path || '').split(/[\\/]/).pop() },
            };
          })
    );
  });
}

// A built-in "add-on" so the server shows up in the source list next to the others.
export function virtualAddon() {
  if (!enabled()) return null;
  const c = connection();
  return {
    transportUrl: 'mediaserver://' + c.providerId,
    manifest: { id: 'mediaserver.' + c.providerId, name: c.name, resources: ['stream'], types: ['movie', 'series'], idPrefixes: ['tt'] },
    base: '',
    query: '',
    virtualStreams: streams,
  };
}

// Jellyfin Quick Connect: the TV shows a code; the user approves it in Jellyfin on the phone
// (Settings → Quick Connect), no password typed. For views/deviceLink.js.
export function quickConnectFlow(address) {
  const draft = { providerId: 'jellyfin', address: normalizeAddress(address) };
  return {
    name: 'Jellyfin',
    hint: t('No app ou site do Jellyfin: Configurações → Quick Connect, e digite o código.'),
    start: () => {
      if (!draft.address) return Promise.reject(new Error(t('Endereço inválido')));
      return call(draft, 'GET', '/QuickConnect/Enabled').then((on) => {
        if (on === false) throw new Error(t('Ative o Quick Connect no painel do Jellyfin'));
        return call(draft, 'POST', '/QuickConnect/Initiate').then((r) => {
          if (!r || !r.Secret) throw new Error('Quick Connect');
          return {
            code: r.Code,
            url: draft.address + '/web/#/quickconnect',
            qrUrl: draft.address + '/web/#/quickconnect',
            interval: 4,
            expiresIn: 600,
            poll: () =>
              call(draft, 'GET', '/QuickConnect/Connect?secret=' + encodeURIComponent(r.Secret)).then((st) => {
                if (!st || !st.Authenticated) return 'pending';
                return Promise.all([
                  call(draft, 'GET', '/System/Info/Public').catch(() => null),
                  call(draft, 'POST', '/Users/AuthenticateWithQuickConnect', { Secret: r.Secret }),
                ]).then((x) => {
                  const info = x[0];
                  const auth = x[1];
                  if (!auth || !auth.AccessToken) return 'pending';
                  store.saveSettings({
                    mediaServer: {
                      providerId: 'jellyfin',
                      address: draft.address,
                      token: auth.AccessToken,
                      userId: auth.User.Id,
                      user: auth.User.Name,
                      name: (info && info.ServerName) || draft.address,
                    },
                    mediaServerEnabled: true,
                  });
                  return 'ok';
                });
              }),
          };
        });
      });
    },
  };
}
