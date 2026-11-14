// Phone remote: a TizenBrew service (Node.js 4 on the TV, so plain ES5).
// - Serves the remote page to phones on the same Wi-Fi at http://<TV IP>:8095
// - Phones send key presses and text, guarded by a 4-digit PIN shown in the app's Settings.
// - The app on the TV long-polls /api/events from 127.0.0.1 and replays them as remote keys.
'use strict';

var http = require('http');
var os = require('os');

var PORT = 8095;
var HOLD_MS = 25000; // long-poll hold time
var KEEP = 50; // events kept for late pollers
var PIN = String(1000 + Math.floor(Math.random() * 9000));

var events = [];
var browseData = null;
var nowPlaying = null;
var nowPlayingAt = 0;
var nextId = 1;
var waiting = [];

// The address phones reach the TV on: a home-network (private) IPv4 first, any other IPv4 after.
function tvIp() {
  var nets = os.networkInterfaces();
  var names = Object.keys(nets);
  var other = '';
  for (var i = 0; i < names.length; i++) {
    var list = nets[names[i]];
    for (var j = 0; j < list.length; j++) {
      var a = list[j];
      if (a.family !== 'IPv4' || a.internal) continue;
      if (/^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(a.address)) return a.address;
      if (!other) other = a.address;
    }
  }
  return other;
}

function isLocal(req) {
  var a = req.socket.remoteAddress || '';
  return a === '127.0.0.1' || a === '::1' || a === '::ffff:127.0.0.1';
}

// Only the AniSkip client id is forwarded (nothing else from the app).
function fetchHeaders(req) {
  var h = { Accept: 'application/json', 'User-Agent': 'stremio-kai-tizen' };
  var id = String(req.headers['x-client-id'] || '').trim();
  if (id && /^[\w.\-]{1,128}$/.test(id)) h['X-Client-ID'] = id;
  return h;
}

// GET a small binary file (follows up to 3 redirects, max 5 MB).
function fetchBinary(target, hops, done) {
  var r = require('https').get({ hostname: target.hostname, path: target.path, headers: { 'User-Agent': 'stremio-7m-tizen' }, timeout: 15000 }, function (resp) {
    if (resp.statusCode >= 300 && resp.statusCode < 400 && resp.headers.location && hops < 3) {
      resp.resume();
      var next = require('url').parse(require('url').resolve('https://' + target.hostname + target.path, resp.headers.location));
      if (next.protocol !== 'https:') return done(new Error('redirect'));
      return fetchBinary(next, hops + 1, done);
    }
    if (resp.statusCode !== 200) { resp.resume(); return done(new Error('HTTP ' + resp.statusCode)); }
    var chunks = [], size = 0;
    resp.on('data', function (c) { size += c.length; if (size > 5242880) { r.abort(); return; } chunks.push(c); });
    resp.on('end', function () { done(null, Buffer.concat(chunks)); });
  });
  r.on('error', function (e) { done(e); });
  r.on('timeout', function () { r.abort(); });
}

// Windows-1256 (Arabic) bytes 0x80-0xFF.
var CP1256 = '€پ‚ƒ„…†‡ˆ‰ٹ‹Œچژڈگ‘’“”•–—ک™ڑ›œ‌‍ں ،¢£¤¥¦§¨©ھ«¬­®¯°±²³´µ¶·¸¹؛»¼½¾؟ہءآأؤإئابةتثجحخدذرزسشصض×طظعغـفقكàلâمنهوçèéêëىيîïًٌٍَôُِ÷ّùْûü‎‏ے';

function decodeSub(buf) {
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) return buf.slice(2).toString('utf16le');
  var utf = buf.toString('utf8');
  if (utf.indexOf('�') < 0) return utf.replace(/^﻿/, '');
  var out = '';
  for (var i = 0; i < buf.length; i++) out += buf[i] < 128 ? String.fromCharCode(buf[i]) : CP1256.charAt(buf[i] - 128);
  return out;
}

// Reads a ZIP's central directory and returns the best .srt/.vtt/.ass as text (null if none).
function subFromZip(buf, ep) {
  try {
    var eocd = -1;
    for (var i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
      if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) return null;
    var count = buf.readUInt16LE(eocd + 10);
    var pos = buf.readUInt32LE(eocd + 16);
    var files = [];
    for (var n = 0; n < count && pos + 46 <= buf.length; n++) {
      if (buf.readUInt32LE(pos) !== 0x02014b50) break;
      var method = buf.readUInt16LE(pos + 10);
      var csize = buf.readUInt32LE(pos + 20);
      var nameLen = buf.readUInt16LE(pos + 28);
      var extraLen = buf.readUInt16LE(pos + 30);
      var commentLen = buf.readUInt16LE(pos + 32);
      var local = buf.readUInt32LE(pos + 42);
      var name = buf.slice(pos + 46, pos + 46 + nameLen).toString('utf8');
      if (/\.(srt|vtt|ass|ssa)$/i.test(name)) files.push({ name: name, method: method, csize: csize, local: local });
      pos += 46 + nameLen + extraLen + commentLen;
    }
    if (!files.length) return null;
    var pick = files[0];
    var m = /^S(\d+)E(\d+)$/i.exec(ep);
    if (m && files.length > 1) {
      var re = new RegExp('(s0*' + (+m[1]) + '[ ._-]*e0*' + (+m[2]) + '(?!\\d))|(\\b' + (+m[1]) + 'x0*' + (+m[2]) + '(?!\\d))', 'i');
      for (var k = 0; k < files.length; k++) if (re.test(files[k].name)) { pick = files[k]; break; }
    }
    var lh = pick.local;
    if (buf.readUInt32LE(lh) !== 0x04034b50) return null;
    var start = lh + 30 + buf.readUInt16LE(lh + 26) + buf.readUInt16LE(lh + 28);
    var data = buf.slice(start, start + pick.csize);
    var raw = pick.method === 8 ? require('zlib').inflateRawSync(data) : pick.method === 0 ? data : null;
    return raw ? decodeSub(raw) : null;
  } catch (e) {
    return null;
  }
}

function send(res, status, body, type) {
  res.writeHead(status, {
    'Content-Type': type || 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'x-client-id, content-type',
    'Cache-Control': 'no-store'
  });
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}

function push(ev) {
  ev.id = nextId++;
  events.push(ev);
  if (events.length > KEEP) events.shift();
  var w = waiting;
  waiting = [];
  w.forEach(function (fn) { fn(); });
}

function since(id) {
  return events.filter(function (e) { return e.id > id; });
}

function readBody(req, cb, limit) {
  var data = '';
  req.on('data', function (c) {
    data += c;
    if (data.length > (limit || 4096)) req.destroy();
  });
  req.on('end', function () { cb(data); });
}

var page = null;
function remotePage() {
  if (page === null) {
    // Served from the module on jsDelivr next to this file, or inlined by the build.
    page = typeof REMOTE_PAGE === 'string' ? REMOTE_PAGE : '';
  }
  return page;
}

// Volume: the app can't change it itself, so it presses the TV's own volume keys through
// Samsung's remote-control API (the one phone remote apps use), on this TV only. The first time,
// the TV may ask to allow "Stremio Kai Remote".
var tvWs = null;
var tvQueue = [];
function tvKey(keyName, cb) {
  var WebSocket;
  try {
    WebSocket = require('ws');
  } catch (e) {
    return cb('no websocket module');
  }
  var msg = JSON.stringify({
    method: 'ms.remote.control',
    params: { Cmd: 'Click', DataOfCmd: keyName, Option: 'false', TypeOfRemote: 'SendRemoteKey' }
  });
  if (tvWs && tvWs.readyState === 1) {
    tvWs.send(msg);
    return cb(null);
  }
  tvQueue.push({ msg: msg, cb: cb });
  if (tvWs) return;
  var name = new Buffer('Stremio Kai Remote').toString('base64');
  tvWs = new WebSocket('ws://127.0.0.1:8001/api/v2/channels/samsung.remote.control?name=' + name);
  var flush = function (err) {
    var q = tvQueue;
    tvQueue = [];
    q.forEach(function (item) {
      if (!err && tvWs && tvWs.readyState === 1) tvWs.send(item.msg);
      item.cb(err);
    });
  };
  tvWs.on('message', function (data) {
    // The TV answers ms.channel.connect once the connection is allowed.
    if (String(data).indexOf('ms.channel.connect') >= 0) flush(null);
    else if (String(data).indexOf('ms.channel.unauthorized') >= 0) flush('not allowed on the TV');
  });
  tvWs.on('error', function () {
    tvWs = null;
    flush('TV remote API unreachable');
  });
  tvWs.on('close', function () {
    tvWs = null;
  });
  setTimeout(function () {
    if (tvQueue.length) flush('waiting for the TV to allow the remote');
  }, 15000);
}

var server = http.createServer(function (req, res) {
  try {
    handle(req, res);
  } catch (e) {
    try { send(res, 500, { error: String(e && e.message) }); } catch (e2) { /* already answered */ }
  }
});

function handle(req, res) {
  var url = require('url').parse(req.url, true);
  var q = url.query;

  if (req.method === 'OPTIONS') return send(res, 204, '');

  // ---- TV side (app on the same TV only) ----
  // Fetches a skip-times API for the app (those sites refuse requests from the app's own origin).
  // Local only, GET only, and only these hosts: it is not a general proxy.
  if (url.pathname === '/api/fetch') {
    if (!isLocal(req)) return send(res, 403, { error: 'local only' });
    var target = require('url').parse(String(q.url || ''));
    var okHosts = ['api.introdb.app', 'api.aniskip.com', 'arm.haglund.dev', 'api.anime-skip.com', 'api.tiffara.com', 'api.mdblist.com', 'api.subdl.com'];
    if (target.protocol !== 'https:' || okHosts.indexOf(target.hostname) < 0) return send(res, 400, { error: 'host not allowed' });
    var isPost = req.method === 'POST';
    // POST only for the Anime-Skip GraphQL endpoint.
    if (isPost && (target.hostname !== 'api.anime-skip.com' || target.pathname !== '/graphql')) return send(res, 400, { error: 'post not allowed' });
    var run = function (payload) {
      var headers = fetchHeaders(req);
      if (isPost) {
        headers['Content-Type'] = 'application/json';
        headers['Content-Length'] = Buffer.byteLength(payload);
      }
      var upstream = require('https').request({ method: isPost ? 'POST' : 'GET', hostname: target.hostname, path: target.path, headers: headers, timeout: 8000 }, function (r) {
        var chunks = [];
        r.on('data', function (c) { chunks.push(c); });
        r.on('end', function () { send(res, r.statusCode || 502, Buffer.concat(chunks).toString('utf8')); });
      });
      upstream.on('error', function () { send(res, 502, { error: 'upstream failed' }); });
      upstream.on('timeout', function () { upstream.abort(); });
      if (isPost) upstream.write(payload);
      upstream.end();
    };
    if (isPost) return readBody(req, function (body) { run(typeof body === 'string' ? body : JSON.stringify(body)); });
    return run('');
  }
  // SubDL subtitles come as ZIP files (often Windows-1256 Arabic): download, unzip the .srt
  // (the one for ?ep=S01E02 when there are several) and return it as UTF-8 text.
  if (url.pathname === '/api/subzip') {
    if (!isLocal(req)) return send(res, 403, { error: 'local only' });
    var zt = require('url').parse(String(q.url || ''));
    if (zt.protocol !== 'https:' || zt.hostname !== 'dl.subdl.com') return send(res, 400, { error: 'host not allowed' });
    return fetchBinary(zt, 0, function (err, buf) {
      if (err) return send(res, 502, { error: 'download failed' });
      var text = subFromZip(buf, String(q.ep || ''));
      if (text === null) return send(res, 404, { error: 'no subtitle in zip' });
      send(res, 200, text, 'text/plain; charset=utf-8');
    });
  }
  if (url.pathname === '/api/info') {
    if (!isLocal(req)) return send(res, 403, { error: 'local only' });
    return send(res, 200, { ip: tvIp(), port: PORT, pin: PIN, last: nextId - 1, version: 1 });
  }
  if (url.pathname === '/api/events') {
    if (!isLocal(req)) return send(res, 403, { error: 'local only' });
    var after = parseInt(q.since, 10) || 0;
    if (after > nextId) after = 0; // the service restarted
    var ready = since(after);
    if (ready.length) return send(res, 200, { events: ready, last: nextId - 1 });
    var done = false;
    var finish = function () {
      if (done) return;
      done = true;
      clearTimeout(timer);
      send(res, 200, { events: since(after), last: nextId - 1 });
    };
    var timer = setTimeout(finish, HOLD_MS);
    waiting.push(finish);
    req.on('close', function () { done = true; clearTimeout(timer); });
    return;
  }

  if (url.pathname === '/api/state' && req.method === 'POST') {
    if (!isLocal(req)) return send(res, 403, { error: 'local only' });
    return readBody(req, function (body) {
      try {
        nowPlaying = JSON.parse(body);
      } catch (e) {
        nowPlaying = null;
      }
      nowPlayingAt = Date.now();
      send(res, 200, { ok: true });
    });
  }

  if (url.pathname === '/api/browse' && req.method === 'POST') {
    if (!isLocal(req)) return send(res, 403, { error: 'local only' });
    return readBody(req, function (body) {
      try {
        browseData = JSON.parse(body);
      } catch (e) {
        /* keep the last good lists */
      }
      send(res, 200, { ok: true });
    }, 500000);
  }

  // ---- Phone side ----
  if (url.pathname === '/' || url.pathname === '/index.html') {
    return send(res, 200, remotePage(), 'text/html; charset=utf-8');
  }
  // Key setup from the phone (the QR in Settings): the keys go to the app on this TV only.
  if (url.pathname === '/setup' || url.pathname === '/setup.html') {
    return send(res, 200, typeof SETUP_PAGE === 'string' ? SETUP_PAGE : 'Setup page missing', 'text/html; charset=utf-8');
  }
  if (url.pathname === '/api/keys' && req.method === 'POST') {
    if (q.pin !== PIN) return send(res, 401, { ok: false });
    return readBody(req, function (body) {
      var allowed = ['traktClientId', 'traktClientSecret', 'simklClientId', 'tmdbKey', 'mdblistKey', 'rpdbKey', 'subdlKey', 'animeSkipClientId', 'realDebridKey', 'torboxKey', 'premiumizeKey'];
      var keys = {};
      var n = 0;
      try {
        var data = JSON.parse(body || '{}');
        allowed.forEach(function (k) {
          var v = typeof data[k] === 'string' ? data[k].trim() : '';
          if (v && v.length <= 200 && /^[\w.\-:]+$/.test(v)) { keys[k] = v; n++; }
        });
      } catch (e) {
        return send(res, 400, { ok: false });
      }
      if (!n) return send(res, 400, { ok: false });
      push({ type: 'keys', keys: keys });
      send(res, 200, { ok: true, count: n });
    }, 8192);
  }
  if (url.pathname === '/api/check') {
    return send(res, q.pin === PIN ? 200 : 401, { ok: q.pin === PIN });
  }
  if (url.pathname === '/api/key' && req.method === 'POST') {
    if (q.pin !== PIN) return send(res, 401, { ok: false });
    var code = parseInt(q.code, 10);
    if (!(code > 0 && code < 70000)) return send(res, 400, { ok: false });
    push({ type: 'key', code: code });
    return send(res, 200, { ok: true });
  }
  if (url.pathname === '/api/search' && req.method === 'POST') {
    if (q.pin !== PIN) return send(res, 401, { ok: false });
    return readBody(req, function (text) {
      push({ type: 'search', text: String(text).slice(0, 200) });
      send(res, 200, { ok: true });
    });
  }
  if (url.pathname === '/api/browse') {
    if (q.pin !== PIN) return send(res, 401, { ok: false });
    return send(res, 200, browseData || { continueWatching: [], newEpisodes: [], library: [] });
  }
  if (url.pathname === '/api/open' && req.method === 'POST') {
    if (q.pin !== PIN) return send(res, 401, { ok: false });
    if (!q.id || (q.type !== 'movie' && q.type !== 'series')) return send(res, 400, { ok: false });
    push({ type: 'open', kind: q.type, item: String(q.id).slice(0, 200), video: q.video ? String(q.video).slice(0, 200) : '' });
    return send(res, 200, { ok: true });
  }
  if (url.pathname === '/api/state') {
    if (q.pin !== PIN) return send(res, 401, { ok: false });
    // The player reports every few seconds; a stale report means it's no longer playing.
    var fresh = nowPlaying && Date.now() - nowPlayingAt < 45000;
    return send(res, 200, { playing: fresh ? nowPlaying : null, at: nowPlayingAt });
  }
  if (url.pathname === '/api/seek' && req.method === 'POST') {
    if (q.pin !== PIN) return send(res, 401, { ok: false });
    var to = parseInt(q.to, 10);
    if (!(to >= 0)) return send(res, 400, { ok: false });
    push({ type: 'seek', to: to });
    return send(res, 200, { ok: true });
  }
  if (url.pathname === '/api/volume' && req.method === 'POST') {
    if (q.pin !== PIN) return send(res, 401, { ok: false });
    var keyName = { up: 'KEY_VOLUP', down: 'KEY_VOLDOWN', mute: 'KEY_MUTE' }[q.dir];
    if (!keyName) return send(res, 400, { ok: false });
    return tvKey(keyName, function (err) {
      send(res, err ? 502 : 200, { ok: !err, error: err || undefined });
    });
  }
  if (url.pathname === '/api/text' && req.method === 'POST') {
    if (q.pin !== PIN) return send(res, 401, { ok: false });
    return readBody(req, function (text) {
      push({ type: 'text', text: String(text).slice(0, 500), submit: q.submit === '1' });
      send(res, 200, { ok: true });
    });
  }
  send(res, 404, { error: 'not found' });
}

// Port busy: an older copy may still be letting go of it; try again for a minute.
var tries = 0;
server.on('error', function () {
  if (++tries < 12) setTimeout(function () { server.listen(PORT, '0.0.0.0'); }, 5000);
});
server.listen(PORT, '0.0.0.0');
