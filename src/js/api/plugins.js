// Manga plugins in Harbor's format (a repo.json listing "*.plugin.js" files), so the same repositories
// people add to Harbor work on the TV. The app ships no plugin: you add a repository URL yourself.
//
// Safety: a plugin is someone else's code. It runs in a Web Worker (no access to the app, its storage or
// your accounts), with fetch/XHR and the rest removed; it can only ask the app to (1) make a web request
// (done by the TV service, see /api/phttp in service/remote-service.js) and (2) parse HTML into a plain
// tree. The worker prelude below is adapted from Harbor's sandbox (MIT, Copyright (c) 2026 Harbor).
import { request } from '../lib/http.js';
import { PORT, serviceVersion } from '../lib/phone.js';
import * as store from '../lib/store.js';

const SVC = 'http://127.0.0.1:' + PORT;
const REPOS = { manga: 'mangaRepos', comics: 'comicRepos', books: 'bookRepos' };
export const KINDS = ['manga', 'comics', 'books'];
const kindKey = (k) => (k === 'comics' || k === 'books' ? k : 'manga');
const PLUGINS = 'mangaPlugins';

// ---------- storage ----------
// Manga, Comics and Books keep their own sources: each plugin carries its kind ('manga' for the old ones).
export const kindOf = (p) => kindKey(p && p.kind);
export const repos = (kind) => store.get(REPOS[kindKey(kind)], []) || [];
// Every plugin (to run one by its id), or only one kind's.
export const installed = (kind) => {
  const all = store.get(PLUGINS, []) || [];
  return kind ? all.filter((p) => kindOf(p) === kind) : all;
};
function saveInstalled(list) {
  store.set(PLUGINS, list);
}
export function addRepo(url, kind) {
  const key = REPOS[kindKey(kind)];
  const r = (store.get(key, []) || []).filter((x) => x !== url);
  r.push(url);
  store.set(key, r);
}
export function removeRepo(url, kind) {
  const key = REPOS[kindKey(kind)];
  store.set(key, (store.get(key, []) || []).filter((x) => x !== url));
}
// Removes a repository and every plugin installed from it (in that tab). Returns how many plugins went.
export function removeRepoAll(url, kind) {
  const gone = installed(kind).filter((p) => p.repoUrl === url);
  gone.forEach((p) => uninstall(p.id));
  removeRepo(url, kind);
  return gone.length;
}
// Empties a tab: every plugin and every repository of Manga (or Comics). Returns how many plugins went.
export function removeAll(kind) {
  const gone = installed(kind);
  gone.forEach((p) => uninstall(p.id));
  repos(kind).forEach((u) => removeRepo(u, kind));
  return gone.length;
}
// Moves a whole repository (and its plugins) to the other tab.
export function moveRepo(url, from, to) {
  installed(from)
    .filter((p) => p.repoUrl === url)
    .forEach((p) => setKind(p.id, to));
  removeRepo(url, from);
  addRepo(url, to);
}
// Moves a plugin to the other tab.
export function setKind(id, kind) {
  saveInstalled(installed().map((p) => (p.id === id ? Object.assign({}, p, { kind: kindKey(kind) }) : p)));
}
export function uninstall(id) {
  saveInstalled(installed().filter((p) => p.id !== id));
  stop(id);
}

// ---------- web requests (through the TV service) ----------
// opts: { method, headers, body, responseType: 'text'|'json'|'base64', timeoutMs, redirect }
export function httpRaw(url, opts) {
  const o = opts || {};
  return request('POST', SVC + '/api/phttp', { url: url, method: o.method, headers: o.headers, body: o.body, responseType: o.responseType, timeoutMs: o.timeoutMs, redirect: o.redirect }, { timeout: (o.timeoutMs || 20000) + 5000, quiet: true }).catch(
    () => direct(url, o)
  );
}

// Only through the TV service (the plugin test uses it to tell an old service from a working one).
export function serviceOnly(url) {
  return request('POST', SVC + '/api/phttp', { url: url }, { timeout: 20000, quiet: true }).catch((e) => {
    throw new Error(e && e.status === 404 ? 'old TV service (no /api/phttp)' : (e && e.message) || 'service');
  });
}

// Without the TV service (old copy still running, or a PC browser): ask the site directly.
// Works for sites that allow it (GitHub raw files, many APIs); others refuse.
function direct(url, o) {
  return new Promise((resolve, reject) => {
    const x = new XMLHttpRequest();
    x.open(o.method || 'GET', url, true);
    x.timeout = o.timeoutMs || 20000;
    x.onload = () => resolve({ status: x.status, ok: x.status >= 200 && x.status < 300, headers: { 'content-type': x.getResponseHeader('content-type') || '' }, body: x.responseText, url: url });
    x.onerror = x.ontimeout = () => reject(new Error(serviceVersion() && serviceVersion() < 2 ? 'old TV service: restart the TV' : 'network'));
    x.send(typeof o.body === 'string' ? o.body : null);
  });
}
function getText(url) {
  return httpRaw(url, {}).then((r) => {
    if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));
    return r.body;
  });
}

// Image through the TV service with the Referer the site expects (hotlink protection).
export function imageUrl(url, referer) {
  if (!url) return '';
  if (/^data:image\//i.test(url)) return url; // a page drawn by the plugin itself (book text as SVG)
  return SVC + '/api/pimg?u=' + encodeURIComponent(url) + (referer ? '&r=' + encodeURIComponent(referer) : '');
}

// ---------- repositories ----------
function classify(parsed) {
  if (parsed && Array.isArray(parsed.plugins)) return 'harbor';
  const arr = Array.isArray(parsed) ? parsed : parsed && (parsed.sources || parsed.mangayomiSources);
  if (!Array.isArray(arr) || !arr.length) return 'unknown';
  if (arr.some((e) => e && typeof e.apk === 'string')) return 'tachiyomi';
  if (arr.some((e) => e && (e.sourceCodeUrl || e.pkgPath))) return 'mangayomi';
  if (arr.some((e) => e && (e.file || e.downloadURL) && /\.aix/i.test(e.file || e.downloadURL || ''))) return 'aidoku';
  if (parsed && parsed.info && Array.isArray(parsed.sources)) return 'aidoku';
  return 'unknown';
}

// { kind, name, plugins: [{ id, name, version, lang, nsfw, icon, entry }] }
export function fetchRepo(url) {
  return getText(url).then((text) => {
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      throw new Error('not json');
    }
    const kind = classify(parsed);
    if (kind !== 'harbor') return { kind: kind, name: (parsed && parsed.name) || '', plugins: [] };
    const plugins = parsed.plugins
      .filter((p) => p && typeof p.id === 'string' && typeof p.name === 'string' && typeof p.entry === 'string')
      .map((p) => ({ id: p.id, name: p.name, version: String(p.version || '0'), lang: String(p.lang || ''), nsfw: p.nsfw === true, icon: typeof p.icon === 'string' ? p.icon : '', entry: p.entry }));
    return { kind: kind, name: String(parsed.name || ''), plugins: plugins };
  });
}

function resolveUrl(base, rel) {
  if (/^https?:\/\//i.test(rel)) return rel;
  return base.replace(/[^/]*$/, '') + rel.replace(/^\.\//, '');
}

// kind: 'manga' or 'comics' (an update keeps the plugin where it is).
export function install(repoUrl, man, kind) {
  return getText(resolveUrl(repoUrl, man.entry)).then((source) => {
    if (source.length > 2 * 1024 * 1024) throw new Error('too big');
    const old = installed().find((p) => p.id === man.id);
    const list = installed().filter((p) => p.id !== man.id);
    list.push({ id: man.id, name: man.name, version: man.version, lang: man.lang, nsfw: man.nsfw, icon: man.icon, repoUrl: repoUrl, entry: man.entry, source: source, kind: kind || kindOf(old) });
    saveInstalled(list);
    stop(man.id);
    return man;
  });
}

// ---------- HTML → plain tree (done here: the worker has no DOM) ----------
const DROP = { script: 1, style: 1, noscript: 1, template: 1, iframe: 1, object: 1, embed: 1, link: 1, meta: 1 };
function serialize(el, depth, budget) {
  const a = {};
  for (let i = 0; i < el.attributes.length; i++) a[el.attributes[i].name] = el.attributes[i].value;
  const c = [];
  if (depth < 200) {
    const kids = el.childNodes;
    for (let i = 0; i < kids.length && budget.n < 60000; i++) {
      const k = kids[i];
      if (k.nodeType === 1) {
        if (DROP[k.tagName.toLowerCase()]) continue;
        budget.n++;
        c.push(serialize(k, depth + 1, budget));
      } else if (k.nodeType === 3 && k.nodeValue && k.nodeValue.trim()) {
        budget.n++;
        c.push({ x: k.nodeValue });
      }
    }
  }
  return { t: el.tagName.toLowerCase(), a: a, x: '', c: c };
}
function parseHtml(html) {
  const doc = new DOMParser().parseFromString(String(html || ''), 'text/html');
  return doc.body ? serialize(doc.body, 0, { n: 0 }) : { t: 'body', a: {}, x: '', c: [] };
}

// ---------- the worker ----------
const PRELUDE = String.raw`(function () {
  "use strict";
  var post = self.postMessage.bind(self);
  var pending = Object.create(null);
  var seq = 0;
  var provider = null;
  var BLOCKED = ["fetch", "XMLHttpRequest", "WebSocket", "EventSource", "importScripts", "indexedDB", "caches", "Worker", "SharedWorker", "BroadcastChannel", "Notification", "navigator", "Request", "Response", "MessageChannel"];
  function safePost(m) { try { post(m); return true; } catch (e) { return false; } }
  function bridge(kind, payload) {
    var id = "b" + (++seq);
    return new Promise(function (resolve, reject) { pending[id] = { resolve: resolve, reject: reject }; safePost({ type: kind, id: id, payload: payload }); });
  }
  function normOpts(opts) {
    opts = opts && typeof opts === "object" ? opts : {};
    var headers = {}, src = opts.headers;
    if (src && typeof src === "object") for (var k in src) if (Object.prototype.hasOwnProperty.call(src, k)) headers[String(k)] = String(src[k]);
    var rt = opts.responseType; if (rt !== "json" && rt !== "base64") rt = "text";
    return { method: opts.method ? String(opts.method) : "GET", headers: headers, body: typeof opts.body === "string" ? opts.body : undefined, responseType: rt, redirect: opts.redirect === "manual" ? "manual" : undefined, timeoutMs: typeof opts.timeoutMs === "number" ? opts.timeoutMs : undefined };
  }
  function httpCall(url, opts) {
    var norm = normOpts(opts);
    return bridge("http", { url: String(url), opts: norm }).then(function (res) {
      if (norm.responseType === "json") { try { return JSON.parse(res.body); } catch (e) { return null; } }
      return res;
    });
  }
  function isEl(n) { return n != null && typeof n === "object" && typeof n.t === "string"; }
  function children(n) { return isEl(n) && Array.isArray(n.c) ? n.c : []; }
  function classList(n) { var c = n.a && n.a["class"]; return c ? String(c).split(/\s+/).filter(Boolean) : []; }
  function collectText(n) { if (!isEl(n)) return typeof n.x === "string" ? n.x : ""; var k = children(n), s = ""; for (var i = 0; i < k.length; i++) s += collectText(k[i]); return s; }
  function descendants(n, out) { var k = children(n); for (var i = 0; i < k.length; i++) if (isEl(k[i])) { out.push(k[i]); descendants(k[i], out); } return out; }
  function elementChildren(n) { var k = children(n), out = []; for (var i = 0; i < k.length; i++) if (isEl(k[i])) out.push(k[i]); return out; }
  function parseAttr(inner) {
    var ops = ["*=", "^=", "$=", "~=", "="];
    for (var k = 0; k < ops.length; k++) { var idx = inner.indexOf(ops[k]); if (idx >= 0) return { name: inner.slice(0, idx).trim().toLowerCase(), op: ops[k], value: inner.slice(idx + ops[k].length).trim().replace(/^["']|["']$/g, "") }; }
    return { name: inner.trim().toLowerCase(), op: null, value: null };
  }
  function parseCompound(sel) {
    var out = { tag: null, id: null, classes: [], attrs: [] }, i = 0, word = /[A-Za-z0-9_-]/;
    while (i < sel.length) {
      var ch = sel.charAt(i);
      if (ch === "*") { i++; continue; }
      if (ch === "#") { i++; var id = ""; while (i < sel.length && word.test(sel.charAt(i))) id += sel.charAt(i++); if (id) out.id = id; continue; }
      if (ch === ".") { i++; var cl = ""; while (i < sel.length && word.test(sel.charAt(i))) cl += sel.charAt(i++); if (cl) out.classes.push(cl); continue; }
      if (ch === "[") { var end = sel.indexOf("]", i); if (end < 0) break; out.attrs.push(parseAttr(sel.slice(i + 1, end))); i = end + 1; continue; }
      if (word.test(ch)) { var t = ""; while (i < sel.length && word.test(sel.charAt(i))) t += sel.charAt(i++); out.tag = t.toLowerCase(); continue; }
      i++;
    }
    return out;
  }
  function parseGroup(g) {
    var toks = g.replace(/\s*>\s*/g, " > ").trim().split(/\s+/).filter(Boolean), steps = [], comb = "descendant";
    for (var i = 0; i < toks.length; i++) { if (toks[i] === ">") { comb = "child"; continue; } steps.push({ sel: parseCompound(toks[i]), combinator: comb }); comb = "descendant"; }
    return steps;
  }
  function matchesSimple(n, s) {
    if (!isEl(n)) return false;
    if (s.tag && s.tag !== "*" && n.t.toLowerCase() !== s.tag) return false;
    if (s.id && (n.a ? n.a.id : undefined) !== s.id) return false;
    if (s.classes.length) { var cls = classList(n); for (var i = 0; i < s.classes.length; i++) if (cls.indexOf(s.classes[i]) < 0) return false; }
    for (var j = 0; j < s.attrs.length; j++) {
      var a = s.attrs[j], av = n.a ? n.a[a.name] : undefined;
      if (av == null) return false; av = String(av);
      if (a.op === null) continue;
      if (a.op === "=" && av !== a.value) return false;
      if (a.op === "*=" && av.indexOf(a.value) < 0) return false;
      if (a.op === "^=" && av.slice(0, a.value.length) !== a.value) return false;
      if (a.op === "$=" && av.slice(av.length - a.value.length) !== a.value) return false;
      if (a.op === "~=" && av.split(/\s+/).indexOf(a.value) < 0) return false;
    }
    return true;
  }
  function dedupe(arr) { var out = []; for (var i = 0; i < arr.length; i++) if (out.indexOf(arr[i]) < 0) out.push(arr[i]); return out; }
  function matchSteps(root, steps) {
    var cur = [root];
    for (var s = 0; s < steps.length; s++) {
      var st = steps[s], next = [];
      for (var c = 0; c < cur.length; c++) { var pool = st.combinator === "child" ? elementChildren(cur[c]) : descendants(cur[c], []); for (var p = 0; p < pool.length; p++) if (matchesSimple(pool[p], st.sel)) next.push(pool[p]); }
      cur = dedupe(next); if (!cur.length) break;
    }
    return cur;
  }
  function runQuery(root, selector, first) {
    var groups = String(selector).split(","), results = [];
    for (var g = 0; g < groups.length; g++) { var gr = groups[g].trim(); if (!gr) continue; var steps = parseGroup(gr); if (!steps.length) continue; var m = matchSteps(root, steps); for (var k = 0; k < m.length; k++) results.push(m[k]); if (first && results.length) break; }
    results = dedupe(results);
    return first ? results.slice(0, 1) : results;
  }
  function HElement(n) { this._node = n; }
  HElement.prototype.text = function () { return collectText(this._node).replace(/\s+/g, " ").trim(); };
  HElement.prototype.attr = function (name) { var v = this._node.a ? this._node.a[String(name)] : undefined; return v == null ? null : String(v); };
  HElement.prototype.getAttribute = HElement.prototype.attr;
  HElement.prototype.querySelector = function (sel) { var r = runQuery(this._node, sel, true); return r.length ? new HElement(r[0]) : null; };
  HElement.prototype.querySelectorAll = function (sel) { return runQuery(this._node, sel, false).map(function (n) { return new HElement(n); }); };
  function HDocument(tree) { this._root = { t: "#document", a: {}, x: "", c: tree ? [tree] : [] }; }
  HDocument.prototype.querySelector = HElement.prototype.querySelector;
  HDocument.prototype.querySelectorAll = HElement.prototype.querySelectorAll;
  Object.defineProperty(HDocument.prototype, "_node", { get: function () { return this._root; } });
  // HTML parser inside the sandbox, so harbor.parseHtml() works both ways plugins use it:
  // right away (doc.querySelectorAll(...)) and with await. Tolerant, like a browser for normal pages.
  var VOID = { area: 1, base: 1, br: 1, col: 1, embed: 1, hr: 1, img: 1, input: 1, link: 1, meta: 1, source: 1, track: 1, wbr: 1 };
  var RAW = { script: 1, style: 1, textarea: 1, title: 1 };
  var DROP = { script: 1, style: 1, noscript: 1, template: 1 };
  var ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…", mdash: "—", ndash: "–", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", copy: "©" };
  function decode(t) {
    return t.indexOf("&") < 0 ? t : t.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, function (m, e) {
      if (e.charAt(0) === "#") {
        var n = e.charAt(1) === "x" || e.charAt(1) === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
        return isFinite(n) ? String.fromCodePoint ? String.fromCodePoint(n) : String.fromCharCode(n) : m;
      }
      var v = ENT[e.toLowerCase()];
      return v === undefined ? m : v;
    });
  }
  function syncParse(html) {
    html = String(html || "");
    var root = { t: "body", a: {}, x: "", c: [] };
    var stack = [root];
    var i = 0, n = html.length, count = 0;
    var top = function () { return stack[stack.length - 1]; };
    while (i < n && count < 80000) {
      var lt = html.indexOf("<", i);
      if (lt < 0) lt = n;
      if (lt > i) {
        var txt = html.slice(i, lt);
        top().c.push({ x: txt.trim() ? decode(txt) : " " }); count++;
      }
      if (lt >= n) break;
      if (html.substr(lt, 4) === "<!--") { var ce = html.indexOf("-->", lt + 4); i = ce < 0 ? n : ce + 3; continue; }
      if (html.charAt(lt + 1) === "!" || html.charAt(lt + 1) === "?") { var de = html.indexOf(">", lt); i = de < 0 ? n : de + 1; continue; }
      if (html.charAt(lt + 1) === "/") {
        var ge = html.indexOf(">", lt);
        var name = html.slice(lt + 2, ge < 0 ? n : ge).trim().toLowerCase();
        for (var k = stack.length - 1; k > 0; k--) if (stack[k].t === name) { stack.length = k; break; }
        i = ge < 0 ? n : ge + 1;
        continue;
      }
      var m = /^<([a-zA-Z][a-zA-Z0-9:-]*)/.exec(html.slice(lt, lt + 64));
      if (!m) { top().c.push({ x: "<" }); i = lt + 1; continue; }
      var tag = m[1].toLowerCase();
      var j = lt + m[0].length, attrs = {}, selfClose = false;
      while (j < n) {
        while (j < n && /\s/.test(html.charAt(j))) j++;
        var ch = html.charAt(j);
        if (ch === ">") { j++; break; }
        if (ch === "/" && html.charAt(j + 1) === ">") { selfClose = true; j += 2; break; }
        var am = /^[^\s=>\/]+/.exec(html.slice(j, j + 256));
        if (!am) { j++; continue; }
        var an = am[0].toLowerCase(); j += am[0].length;
        while (j < n && /\s/.test(html.charAt(j))) j++;
        var av = "";
        if (html.charAt(j) === "=") {
          j++;
          while (j < n && /\s/.test(html.charAt(j))) j++;
          var q = html.charAt(j);
          if (q === '"' || q === "'") { var qe = html.indexOf(q, j + 1); av = html.slice(j + 1, qe < 0 ? n : qe); j = qe < 0 ? n : qe + 1; }
          else { var um = /^[^\s>]*/.exec(html.slice(j, j + 2048)); av = um[0]; j += av.length; }
        }
        if (!(an in attrs)) attrs[an] = decode(av);
      }
      i = j;
      if (RAW[tag]) {
        var re = html.toLowerCase().indexOf("</" + tag, i);
        var body = html.slice(i, re < 0 ? n : re);
        i = re < 0 ? n : html.indexOf(">", re) + 1 || n;
        if (!DROP[tag]) { var el0 = { t: tag, a: attrs, x: "", c: body.trim() ? [{ x: decode(body) }] : [] }; top().c.push(el0); count++; }
        continue;
      }
      if ((tag === "li" || tag === "option" || tag === "p" || tag === "tr" || tag === "td" || tag === "th") && top().t === tag) stack.pop();
      var el = { t: tag, a: attrs, x: "", c: [] };
      if (!DROP[tag]) { top().c.push(el); count++; }
      if (!VOID[tag] && !selfClose) stack.push(el);
    }
    return root;
  }
  // Works without await; awaiting it gives the same document.
  function parseHtml(html) {
    var doc = new HDocument(syncParse(html));
    var ready = new HDocument(null);
    ready._root = doc._root;
    Object.defineProperty(doc, "then", { value: function (ok) { return Promise.resolve(ready).then(ok); }, enumerable: false });
    return doc;
  }
  function log() { var a = []; for (var i = 0; i < arguments.length; i++) { try { a.push(String(arguments[i])); } catch (e) { a.push("?"); } } safePost({ type: "log", args: a }); }
  function register(p) { provider = p; }
  var harbor = { http: httpCall, parseHtml: parseHtml, register: register, log: log };
  self.onmessage = function (e) {
    var m = e.data;
    if (!m || typeof m !== "object") return;
    if (m.type === "call") {
      var fn = provider ? provider[m.method] : null;
      if (typeof fn !== "function") return safePost({ type: "error", id: m.id, error: "no method: " + m.method });
      Promise.resolve().then(function () { return fn.apply(provider, Array.isArray(m.args) ? m.args : []); })
        .then(function (v) { if (!safePost({ type: "result", id: m.id, value: v })) safePost({ type: "error", id: m.id, error: "unserializable result" }); })
        .catch(function (err) { safePost({ type: "error", id: m.id, error: String(err && err.message ? err.message : err) }); });
      return;
    }
    if (m.type === "bridgeResult") { var p = pending[m.id]; if (!p) return; delete pending[m.id]; if (m.ok) p.resolve(m.value); else p.reject(new Error(String(m.error || "bridge error"))); }
  };
  for (var bi = 0; bi < BLOCKED.length; bi++) { try { self[BLOCKED[bi]] = undefined; } catch (e) {} }
  try {
    var ret = (function (harbor, self, globalThis, window, fetch, XMLHttpRequest, WebSocket, EventSource, importScripts, indexedDB, caches, Worker, SharedWorker, BroadcastChannel, MessageChannel, postMessage, close, navigator, location, document, Request, Response) {
      "use strict";
`;
const EPILOGUE = String.raw`
      ;return (typeof plugin !== "undefined") ? plugin : undefined;
    })(harbor);
    if (!provider) provider = ret;
    if (!provider || typeof provider !== "object") throw new Error("plugin registered no provider");
    safePost({ type: "ready", meta: { id: String(provider.id), name: String(provider.name) } });
  } catch (err) {
    safePost({ type: "initError", error: String(err && err.message ? err.message : err) });
  }
})();
`;

const workers = {};
let order = [];

function stop(id) {
  const w = workers[id];
  if (w) {
    try {
      w.worker.terminate();
    } catch (e) {}
    Object.keys(w.calls || {}).forEach((cid) => {
      clearTimeout(w.calls[cid].timer);
      w.calls[cid].reject(new Error('stopped'));
    });
    w.calls = {};
    if (w.url) URL.revokeObjectURL(w.url);
    delete workers[id];
  }
  order = order.filter((x) => x !== id);
}

function start(p) {
  const blob = new Blob([PRELUDE, p.source, EPILOGUE], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);
  const w = { worker: worker, url: url, calls: {}, seq: 0, origin: '', ready: null };
  w.ready = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('plugin did not start')), 15000);
    w.onReady = (ok, err) => {
      clearTimeout(timer);
      if (ok) resolve();
      else reject(new Error(err || 'plugin failed'));
    };
  });
  worker.onmessage = (e) => {
    const m = e.data || {};
    if (m.type === 'ready') return w.onReady(true);
    if (m.type === 'initError') return w.onReady(false, m.error);
    if (m.type === 'result' || m.type === 'error') {
      const c = w.calls[m.id];
      if (!c) return;
      delete w.calls[m.id];
      clearTimeout(c.timer);
      return m.type === 'result' ? c.resolve(m.value) : c.reject(new Error(m.error));
    }
    if (m.type === 'http') {
      const u = String((m.payload && m.payload.url) || '');
      const o = (m.payload && m.payload.opts) || {};
      if (!/^https?:\/\//i.test(u)) return worker.postMessage({ type: 'bridgeResult', id: m.id, ok: false, error: 'bad url' });
      const mm = /^(https?:\/\/[^/]+)/i.exec(u);
      if (mm) w.origin = mm[1] + '/';
      httpRaw(u, o).then(
        (r) => worker.postMessage({ type: 'bridgeResult', id: m.id, ok: true, value: r }),
        (err) => worker.postMessage({ type: 'bridgeResult', id: m.id, ok: false, error: String((err && err.message) || err) })
      );
      return;
    }
    if (m.type === 'parse') {
      let tree = null;
      try {
        tree = parseHtml(m.payload && m.payload.html);
      } catch (err) {
        return worker.postMessage({ type: 'bridgeResult', id: m.id, ok: false, error: 'parse failed' });
      }
      return worker.postMessage({ type: 'bridgeResult', id: m.id, ok: true, value: tree });
    }
  };
  worker.onerror = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    w.onReady(false, (e && e.message) || 'worker error');
  };
  workers[p.id] = w;
  order.push(p.id);
  // keep at most three plugins running (memory on the TV)
  while (order.length > 3) stop(order[0]);
  return w;
}

// Starts a plugin (for the test screen): resolves when it is running.
export function ready(id) {
  const p = installed().find((x) => x.id === id);
  if (!p) return Promise.reject(new Error('not installed'));
  try {
    return (workers[id] || start(p)).ready;
  } catch (e) {
    return Promise.reject(new Error('worker: ' + ((e && e.message) || e)));
  }
}

// Can this TV run a sandboxed worker at all? (test screen)
export function workerCheck() {
  return new Promise((resolve, reject) => {
    let url = '';
    try {
      url = URL.createObjectURL(new Blob(['postMessage("ok")'], { type: 'text/javascript' }));
      const w = new Worker(url);
      const timer = setTimeout(() => reject(new Error('no answer')), 5000);
      w.onmessage = () => (clearTimeout(timer), w.terminate(), URL.revokeObjectURL(url), resolve());
      w.onerror = (e) => (clearTimeout(timer), reject(new Error((e && e.message) || 'blocked')));
    } catch (e) {
      reject(new Error((e && e.name ? e.name + ': ' : '') + ((e && e.message) || e)));
    }
  });
}

function call(id, method, args, timeout) {
  const p = installed().find((x) => x.id === id);
  if (!p) return Promise.reject(new Error('not installed'));
  let w;
  try {
    w = workers[id] || start(p);
  } catch (e) {
    return Promise.reject(new Error('worker: ' + ((e && e.message) || e)));
  }
  order = order.filter((x) => x !== id).concat([id]);
  return w.ready.then(
    () =>
      new Promise((resolve, reject) => {
        const cid = 'c' + ++w.seq;
        w.calls[cid] = { resolve: resolve, reject: reject, timer: setTimeout(() => (delete w.calls[cid], reject(new Error('timeout'))), timeout || 25000) };
        w.worker.postMessage({ type: 'call', id: cid, method: method, args: args || [] });
      })
  );
}

// Referer for images: the page's own header, else the site the plugin last talked to.
export function refererOf(id) {
  const w = workers[id];
  return (w && w.origin) || '';
}

// ---------- calls, shaped like Harbor's adapter ----------
const str = (v) => (typeof v === 'string' ? v : undefined);
function toSummary(o) {
  if (!o || typeof o !== 'object' || !str(o.id) || !str(o.title)) return null;
  return { id: o.id, title: o.title, cover: /^https?:\/\//i.test(o.cover || '') ? o.cover : '', description: str(o.description) || '', status: str(o.status) || '', author: str(o.author) || '', year: typeof o.year === 'number' ? o.year : null };
}
export function popular(id, offset) {
  return call(id, 'popular', [offset || 0, undefined], 25000).then((v) => (Array.isArray(v) ? v.map(toSummary).filter(Boolean) : []));
}
export function search(id, query, offset) {
  return call(id, 'search', [query, offset || 0, undefined], 25000).then((v) => (Array.isArray(v) ? v.map(toSummary).filter(Boolean) : []));
}
export function detail(id, mangaId) {
  return call(id, 'detail', [mangaId], 25000).then(toSummary);
}
// "1160 - title" → "title" when the number is already shown.
function cleanTitle(title, num) {
  if (!title || !num) return title || '';
  const rest = title.replace(/^\s*(ch(apter)?\.?|الفصل|فصل)?\s*/i, '');
  if (rest.indexOf(num) !== 0) return title;
  return rest.slice(num.length).replace(/^[\s\-–—:.·|]+/, '').replace(/[.\s]+$/, '');
}
export function chapters(id, mangaId) {
  return call(id, 'chapters', [mangaId], 30000).then((v) =>
    (Array.isArray(v) ? v : [])
      .filter((c) => c && str(c.id))
      .slice(0, 5000)
      .map((c) => ({ id: c.id, chapter: str(c.chapter) || null, title: cleanTitle(str(c.title), str(c.chapter)), lang: str(c.language) || '', pages: typeof c.pages === 'number' ? c.pages : 0, scanlator: str(c.group) || '' }))
  );
}
// Page image URLs, already routed through the TV service with the right Referer.
export function pages(id, chapterId) {
  return call(id, 'pageUrls', [chapterId], 35000).then((v) => {
    const ref = refererOf(id);
    return (Array.isArray(v) ? v : [])
      .map((x) => {
        const u = typeof x === 'string' ? x : x && (x.url || x.imageUrl || x.src || x.img || x.image);
        if (!/^https?:\/\//i.test(u || '') && !/^data:image\//i.test(u || '')) return null;
        const h = x && typeof x === 'object' && x.headers ? x.headers : {};
        const r = h.Referer || h.referer || ref;
        return imageUrl(String(u).trim(), r);
      })
      .filter(Boolean);
  });
}

// Audiobook tracks of a book (optional plugin method audioTracks(bookId)):
// [{ id, title, url (mp3/m4a/...), duration (seconds, optional), chapter (optional, to match reading) }].
// A plugin without it (or with nothing for this book) gives [] — the book then has no 🎧 Listen.
export function audioTracks(id, bookId) {
  return call(id, 'audioTracks', [bookId], 30000).then(
    (v) =>
      (Array.isArray(v) ? v : [])
        .map((x, i) => ({
          id: str(x && x.id) || String(i),
          title: str(x && x.title) || '',
          url: str(x && (x.url || x.streamUrl)) || '',
          duration: typeof (x && x.duration) === 'number' ? x.duration : parseDuration(x && x.duration),
          chapter: x && x.chapter != null ? String(x.chapter) : null,
        }))
        .filter((x) => /^https?:\/\//i.test(x.url)),
    () => []
  );
}
// "25:40" or "1:02:03" → seconds
function parseDuration(v) {
  if (typeof v !== 'string' || !/^\d+(:\d+){1,2}$/.test(v)) return 0;
  return v.split(':').reduce((a, b) => a * 60 + +b, 0);
}

// ---------- updates ----------
// Downloads every installed plugin again from its repository (all: also when the version is the same,
// for a plugin fixed without changing its number). Resolves with how many were updated.
export function updateAll(kind, all) {
  const list = installed(kind);
  const byRepo = {};
  list.forEach((p) => p.repoUrl && (byRepo[p.repoUrl] = byRepo[p.repoUrl] || []).push(p));
  return Promise.all(
    Object.keys(byRepo).map((url) =>
      fetchRepo(url).then(
        (r) =>
          Promise.all(
            byRepo[url].map((p) => {
              const man = (r.plugins || []).find((x) => x.id === p.id);
              if (!man || (!all && String(man.version) === String(p.version))) return 0;
              return install(url, man).then(() => 1, () => 0);
            })
          ),
        () => [0]
      )
    )
  ).then((rs) => rs.reduce((a, b) => a.concat(b), []).reduce((a, b) => a + b, 0));
}
// Once a day, quietly: plugins whose repository has a newer version are updated.
export function autoUpdate() {
  const last = store.get('pluginsChecked', 0) || 0;
  if (Date.now() - last < 864e5 || !installed().length) return Promise.resolve(0);
  store.set('pluginsChecked', Date.now());
  return updateAll(null, false).catch(() => 0);
}

