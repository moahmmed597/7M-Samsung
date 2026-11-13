// XHR com Promise: o Chromium 38 não tem fetch().
import { log } from './log.js';
import { t } from './i18n.js';

export function request(method, url, body, opts) {
  const o = opts || {};
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.timeout = o.timeout || 20000;
    // o.form: body is sent as a URL-encoded form (debrid APIs), otherwise as JSON.
    const hasBody = body !== undefined && body !== null;
    const payload = !hasBody ? null : o.form ? formEncode(body) : JSON.stringify(body);
    if (hasBody) xhr.setRequestHeader('Content-Type', o.form ? 'application/x-www-form-urlencoded' : 'application/json');
    if (o.headers) for (const k in o.headers) xhr.setRequestHeader(k, o.headers[k]);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (o.raw) return resolve(xhr.responseText);
        try {
          resolve(xhr.responseText ? JSON.parse(xhr.responseText) : null);
        } catch (e) {
          reject(new Error(t('JSON inválido de {url}', { url: url })));
        }
      } else {
        const err = new Error(t('HTTP {code} em {url}', { code: xhr.status, url: url }));
        err.status = xhr.status;
        reject(err);
      }
    };
    xhr.onerror = () => {
      const err = new Error(t('Falha de rede em {url}', { url: url }));
      err.status = 0;
      reject(err);
    };
    xhr.ontimeout = () => {
      const err = new Error(t('Tempo esgotado em {url}', { url: url }));
      err.status = 0;
      err.timeout = true;
      reject(err);
    };
    xhr.send(payload);
  }).catch((err) => {
    if (!o.quiet) log.warn(err.message);
    throw err;
  });
}

function formEncode(obj) {
  return Object.keys(obj)
    .filter((k) => obj[k] !== undefined && obj[k] !== null)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]))
    .join('&');
}

export function getJSON(url, opts) {
  return request('GET', url, null, opts);
}

export function postJSON(url, body, opts) {
  return request('POST', url, body, opts);
}

export function getText(url, opts) {
  return request('GET', url, null, Object.assign({ raw: true }, opts));
}

// Cache em memória com validade, para catálogos e metadados.
const cache = new Map();
export function cachedJSON(url, ttlMs, opts) {
  const hit = cache.get(url);
  const now = Date.now();
  if (hit && now - hit.t < (ttlMs || 600000)) return hit.p;
  const p = getJSON(url, opts).catch((e) => {
    cache.delete(url);
    throw e;
  });
  cache.set(url, { t: now, p: p });
  // Pouca RAM na TV: guarda só as últimas 60 respostas.
  if (cache.size > 60) cache.delete(cache.keys().next().value);
  return p;
}
