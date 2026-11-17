// Backup of everything the app keeps on the TV (all profiles): settings, keys, sources, reading and
// listening places, bookmarks, Live TV sources, collections. Saved through the TV service into a file
// in the TV's home folder (reinstalling the app doesn't touch it), and downloadable to the phone.
// Caches (covers, art) are left out: they come back by themselves.
import * as store from './store.js';

const SVC = 'http://127.0.0.1:8095';
const PREFIX = 'kai.';
const SKIP = /(Art\d*$|Famous\d*$|GenreArt$|[Cc]ache|^kai\.devlog)/;
const LAST = 'backupAt';

function xhr(method, url, body, timeout) {
  return new Promise((resolve, reject) => {
    const x = new XMLHttpRequest();
    x.open(method, url);
    x.timeout = timeout || 15000;
    if (body) x.setRequestHeader('Content-Type', 'application/json');
    x.onload = () => (x.status >= 200 && x.status < 300 ? resolve(x.responseText) : reject(new Error('HTTP ' + x.status)));
    x.onerror = x.ontimeout = () => reject(new Error('service'));
    x.send(body || null);
  });
}

export function collect() {
  const data = {};
  let n = 0;
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (!k || k.indexOf(PREFIX) !== 0 || SKIP.test(k)) continue;
    data[k] = window.localStorage.getItem(k);
    n++;
  }
  return { app: 'stremio7m', v: 1, at: Date.now(), count: n, data: data };
}

// Saves now; resolves { onTv } (true when the file on the TV was written too).
export function save() {
  const b = collect();
  return xhr('POST', SVC + '/api/backup', JSON.stringify(b), 30000).then((r) => {
    let out = {};
    try {
      out = JSON.parse(r);
    } catch (e) {}
    store.set(LAST, b.at);
    return { onTv: !!out.onTv, count: b.count, at: b.at };
  });
}

export const lastAt = () => store.get(LAST, 0) || 0;

// The copy kept on the TV: { at, count } or null.
export function onTv() {
  return xhr('GET', SVC + '/api/backup', null, 10000)
    .then((r) => {
      const b = JSON.parse(r);
      return b && b.app === 'stremio7m' ? b : null;
    })
    .catch(() => null);
}

// A backup sent from the phone (the service keeps it until the app asks once).
export function fromPhone() {
  return xhr('GET', SVC + '/api/restore-data', null, 10000).then((r) => {
    const b = JSON.parse(r);
    if (!b || b.app !== 'stremio7m') throw new Error('bad');
    return b;
  });
}

// Puts a backup back and restarts the app. What the backup doesn't have stays as it is.
export function apply(b) {
  if (!b || b.app !== 'stremio7m' || !b.data) return false;
  Object.keys(b.data).forEach((k) => {
    if (k.indexOf(PREFIX) !== 0) return;
    try {
      window.localStorage.setItem(k, b.data[k]);
    } catch (e) {
      /* full: keep going */
    }
  });
  setTimeout(() => window.location.reload(), 600);
  return true;
}

// Once a day, quietly: so a reinstall never loses anything even if you forgot.
export function auto() {
  if (Date.now() - lastAt() < 24 * 3600 * 1000) return;
  save().catch(() => {});
}
