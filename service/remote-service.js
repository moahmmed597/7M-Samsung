// Phone remote: a TizenBrew service (Node.js 4 on the TV, so plain ES5).
// - Serves the remote page to phones on the same Wi-Fi at http://<TV IP>:8095
// - Phones send key presses and text, guarded by a 4-digit PIN shown in the app's Settings.
// - The app on the TV long-polls /api/events from 127.0.0.1 and replays them as remote keys.
'use strict';

var http = require('http');
var os = require('os');

// Bump when the service changes: a running copy compares it with the newest one on GitHub.
var SERVICE_VERSION = 5;
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

// GET a small binary file (follows up to 5 redirects, http or https, max 5 MB).
function fetchBinary(target, hops, done) {
  var mod = target.protocol === 'http:' ? require('http') : require('https');
  var port = target.port || (target.protocol === 'http:' ? 80 : 443);
  var r = mod.get({ hostname: target.hostname, port: port, path: target.path, headers: { 'User-Agent': 'stremio-7m-tizen' }, timeout: 15000 }, function (resp) {
    if (resp.statusCode >= 300 && resp.statusCode < 400 && resp.headers.location && hops < 5) {
      resp.resume();
      var resolved = require('url').resolve((target.protocol || 'https:') + '//' + target.hostname + target.path, resp.headers.location);
      var next = require('url').parse(resolved);
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

// ---- Web requests of manga plugins (see /api/phttp) ----
var BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
// ---------- Subtitle timeline of a video file (for automatic subtitle sync) ----------
// A Matroska (.mkv) file keeps an index ("Cues") that mkvmerge fills with one entry per subtitle line:
// when it starts and how long it stays. Reading only the file's start and that index (a few hundred KB,
// with HTTP range requests) gives the timing of every line of the film's own subtitles, without
// downloading the film. The app lines its add-on subtitle up against it. Written from the Matroska spec.
var MKV = {
  EBML: 0x1A45DFA3, SEGMENT: 0x18538067, SEEKHEAD: 0x114D9B74, SEEK: 0x4DBB, SEEKID: 0x53AB, SEEKPOS: 0x53AC,
  INFO: 0x1549A966, TIMESCALE: 0x2AD7B1, TRACKS: 0x1654AE6B, TRACK: 0xAE, TNUM: 0xD7, TTYPE: 0x83, CODEC: 0x86,
  LANG: 0x22B59C, LANGBCP: 0x22B59D, TNAME: 0x536E, FORCED: 0x55AA, CUES: 0x1C53BB6B, CUEPOINT: 0xBB,
  CUETIME: 0xB3, CUEPOS: 0xB7, CUETRACK: 0xF7, CUEDUR: 0xB2, CLUSTER: 0x1F43B675
};
var subTimelineCache = {};
var subTimelineOrder = [];

function rangeGet(target, start, end, hops, done) {
  var mod = target.protocol === 'http:' ? require('http') : require('https');
  var finished = false;
  var finish = function (err, buf, total) {
    if (finished) return;
    finished = true;
    done(err, buf, total);
  };
  var r = mod.request({ method: 'GET', hostname: target.hostname, port: target.port || (target.protocol === 'http:' ? 80 : 443), path: target.path, headers: { 'User-Agent': BROWSER_UA, Range: 'bytes=' + start + '-' + end, Accept: '*/*' }, timeout: 20000 }, function (resp) {
    var loc = resp.headers.location;
    if (resp.statusCode >= 300 && resp.statusCode < 400 && loc && hops < 6) {
      resp.resume();
      return rangeGet(require('url').parse(require('url').resolve(target.protocol + '//' + target.host + target.path, loc)), start, end, hops + 1, finish);
    }
    if (resp.statusCode !== 206 && resp.statusCode !== 200) {
      resp.resume();
      return finish(new Error('HTTP ' + resp.statusCode));
    }
    var total = 0;
    var cr = /\/(\d+)\s*$/.exec(String(resp.headers['content-range'] || ''));
    if (cr) total = +cr[1];
    else if (resp.statusCode === 200) total = +resp.headers['content-length'] || 0;
    var want = end - start + 1;
    var chunks = [];
    var size = 0;
    resp.on('data', function (c) {
      chunks.push(c);
      size += c.length;
      // A server that ignores Range sends the whole file: stop once we have the part we asked for.
      if (size >= want) {
        try { r.abort(); } catch (e) {}
        var b = Buffer.concat(chunks);
        finish(null, resp.statusCode === 200 ? b.slice(start, start + want) : b.slice(0, want), total);
      }
    });
    resp.on('end', function () { finish(null, Buffer.concat(chunks).slice(0, want), total); });
    resp.on('error', function (e) { finish(e); });
  });
  r.on('timeout', function () { r.abort(); finish(new Error('timeout')); });
  r.on('error', function (e) { finish(e); });
  r.end();
}

// EBML variable-length numbers. Ids keep their marker bits; sizes drop them.
function ebmlId(b, p) {
  var f = b[p];
  if (f === undefined) return null;
  var len = f & 0x80 ? 1 : f & 0x40 ? 2 : f & 0x20 ? 3 : f & 0x10 ? 4 : 0;
  if (!len || p + len > b.length) return null;
  var v = 0;
  for (var i = 0; i < len; i++) v = v * 256 + b[p + i];
  return { v: v, len: len };
}
function ebmlSize(b, p) {
  var f = b[p];
  if (f === undefined) return null;
  var len = 1;
  var mask = 0x80;
  while (len <= 8 && !(f & mask)) { len++; mask >>= 1; }
  if (len > 8 || p + len > b.length) return null;
  var v = f & (mask - 1);
  var all = v === mask - 1;
  for (var i = 1; i < len; i++) { v = v * 256 + b[p + i]; if (b[p + i] !== 0xff) all = false; }
  return { v: all ? -1 : v, len: len };
}
// Elements between `from` and `to`: [{ id, start (data), end }]; stops at the first one cut off.
function ebmlChildren(b, from, to) {
  var out = [];
  var p = from;
  while (p < to) {
    var id = ebmlId(b, p);
    if (!id) break;
    var sz = ebmlSize(b, p + id.len);
    if (!sz) break;
    var ds = p + id.len + sz.len;
    var de = sz.v < 0 ? to : ds + sz.v;
    out.push({ id: id.v, start: ds, end: de, cut: de > b.length });
    if (de > b.length) break;
    p = de;
  }
  return out;
}
function ebmlUint(b, e) {
  var v = 0;
  for (var i = e.start; i < e.end && i < b.length; i++) v = v * 256 + b[i];
  return v;
}
function ebmlStr(b, e) {
  return b.slice(e.start, Math.min(e.end, b.length)).toString('utf8').replace(/\u0000+$/, '');
}
function firstOf(list, id) {
  for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
  return null;
}

function parseTracks(b, el) {
  var out = [];
  ebmlChildren(b, el.start, Math.min(el.end, b.length)).forEach(function (te) {
    if (te.id !== MKV.TRACK) return;
    var k = ebmlChildren(b, te.start, Math.min(te.end, b.length));
    var g = function (id) { return firstOf(k, id); };
    var type = g(MKV.TTYPE) ? ebmlUint(b, g(MKV.TTYPE)) : 0;
    if (type !== 17) return; // subtitles only
    out.push({
      number: g(MKV.TNUM) ? ebmlUint(b, g(MKV.TNUM)) : 0,
      codec: g(MKV.CODEC) ? ebmlStr(b, g(MKV.CODEC)) : '',
      lang: g(MKV.LANGBCP) ? ebmlStr(b, g(MKV.LANGBCP)) : g(MKV.LANG) ? ebmlStr(b, g(MKV.LANG)) : 'eng',
      name: g(MKV.TNAME) ? ebmlStr(b, g(MKV.TNAME)) : '',
      forced: g(MKV.FORCED) ? ebmlUint(b, g(MKV.FORCED)) === 1 : false
    });
  });
  return out;
}

// done(err, { tracks: [{ number, codec, lang, name, forced, cues: [[startMs, durationMs], ...] }] })
function subtitleTimeline(mediaUrl, done) {
  if (subTimelineCache[mediaUrl]) return done(null, subTimelineCache[mediaUrl]);
  var target = require('url').parse(mediaUrl);
  if ((target.protocol !== 'http:' && target.protocol !== 'https:') || !target.hostname) return done(new Error('bad url'));
  var HEAD = 262143;
  rangeGet(target, 0, HEAD, 0, function (err, b, total) {
    if (err) return done(err);
    var top = ebmlChildren(b, 0, b.length);
    if (!top.length || top[0].id !== MKV.EBML) return done(new Error('not a Matroska file'));
    var seg = firstOf(top, MKV.SEGMENT);
    if (!seg) return done(new Error('no segment'));
    var segStart = seg.start;
    var kids = ebmlChildren(b, segStart, b.length);
    var scale = 1000000;
    var info = firstOf(kids, MKV.INFO);
    if (info && !info.cut) {
      var ts = firstOf(ebmlChildren(b, info.start, info.end), MKV.TIMESCALE);
      if (ts) scale = ebmlUint(b, ts) || scale;
    }
    var seeks = {};
    var sh = firstOf(kids, MKV.SEEKHEAD);
    if (sh) {
      ebmlChildren(b, sh.start, Math.min(sh.end, b.length)).forEach(function (s) {
        if (s.id !== MKV.SEEK) return;
        var k = ebmlChildren(b, s.start, s.end);
        var idEl = firstOf(k, MKV.SEEKID);
        var posEl = firstOf(k, MKV.SEEKPOS);
        if (idEl && posEl) seeks[ebmlUint(b, idEl)] = segStart + ebmlUint(b, posEl);
      });
    }
    // Read an element at an absolute position (its header first, then the whole thing, up to 12 MB).
    function readAt(pos, cb) {
      rangeGet(target, pos, pos + 31, 0, function (e1, h) {
        if (e1 || !h || h.length < 4) return cb(e1 || new Error('short'));
        var id = ebmlId(h, 0);
        var sz = id && ebmlSize(h, id.len);
        if (!sz || sz.v < 0 || sz.v > 12582912) return cb(new Error('bad element'));
        var hl = id.len + sz.len;
        rangeGet(target, pos, pos + hl + sz.v - 1, 0, function (e2, full) {
          if (e2 || !full) return cb(e2 || new Error('read'));
          cb(null, full, { id: id.v, start: hl, end: hl + sz.v });
        });
      });
    }
    function withTracks(cb) {
      var tr = firstOf(kids, MKV.TRACKS);
      if (tr && !tr.cut) return cb(parseTracks(b, tr));
      if (!seeks[MKV.TRACKS]) return cb([]);
      readAt(seeks[MKV.TRACKS], function (e, buf, el) { cb(e ? [] : parseTracks(buf, el)); });
    }
    withTracks(function (tracks) {
      tracks = tracks.filter(function (t) { return !/PGS|VOBSUB|DVB/i.test(t.codec); });
      if (!tracks.length) return done(new Error('no text subtitles in the file'));
      var cuesPos = seeks[MKV.CUES];
      if (!cuesPos) return done(new Error('no index'));
      readAt(cuesPos, function (e, buf, el) {
        if (e) return done(e);
        if (el.id !== MKV.CUES) return done(new Error('index not found'));
        var byTrack = {};
        tracks.forEach(function (t) { byTrack[t.number] = t; t.cues = []; });
        var ms = scale / 1000000;
        ebmlChildren(buf, el.start, el.end).forEach(function (cp) {
          if (cp.id !== MKV.CUEPOINT) return;
          var k = ebmlChildren(buf, cp.start, cp.end);
          var timeEl = firstOf(k, MKV.CUETIME);
          if (!timeEl) return;
          var tm = ebmlUint(buf, timeEl) * ms;
          k.forEach(function (p) {
            if (p.id !== MKV.CUEPOS) return;
            var pk = ebmlChildren(buf, p.start, p.end);
            var trEl = firstOf(pk, MKV.CUETRACK);
            var t = trEl && byTrack[ebmlUint(buf, trEl)];
            if (!t) return;
            var durEl = firstOf(pk, MKV.CUEDUR);
            t.cues.push([Math.round(tm), durEl ? Math.round(ebmlUint(buf, durEl) * ms) : 0]);
          });
        });
        var out = { tracks: tracks.filter(function (t) { return t.cues.length >= 20; }) };
        if (!out.tracks.length) return done(new Error('the index has no subtitle lines'));
        out.tracks.forEach(function (t) { t.cues.sort(function (a, c) { return a[0] - c[0]; }); });
        subTimelineCache[mediaUrl] = out;
        subTimelineOrder.push(mediaUrl);
        if (subTimelineOrder.length > 4) delete subTimelineCache[subTimelineOrder.shift()];
        done(null, out);
      });
    });
  });
}

var SKIP_HEADERS = { host: 1, 'content-length': 1, connection: 1, 'accept-encoding': 1, 'transfer-encoding': 1 };
function pluginFetch(target, o, hops, done) {
  var mod = target.protocol === 'http:' ? require('http') : require('https');
  var headers = { 'User-Agent': BROWSER_UA, Accept: '*/*', 'Accept-Encoding': 'gzip, deflate' };
  var src = o.headers && typeof o.headers === 'object' ? o.headers : {};
  Object.keys(src).forEach(function (k) {
    if (!SKIP_HEADERS[k.toLowerCase()]) headers[k] = String(src[k]);
  });
  var method = String(o.method || 'GET').toUpperCase();
  var body = typeof o.body === 'string' ? o.body : null;
  if (body !== null) headers['Content-Length'] = Buffer.byteLength(body);
  var finished = false;
  var finish = function (err, out) {
    if (finished) return;
    finished = true;
    done(err, out);
  };
  var r = mod.request({ method: method, hostname: target.hostname, port: target.port || (target.protocol === 'http:' ? 80 : 443), path: target.path, headers: headers, timeout: Math.min(Number(o.timeoutMs) || 20000, 40000) }, function (resp) {
    var loc = resp.headers.location;
    if (resp.statusCode >= 300 && resp.statusCode < 400 && loc && o.redirect !== 'manual' && hops < 6) {
      resp.resume();
      var next = require('url').parse(require('url').resolve(target.protocol + '//' + target.host + target.path, loc));
      // 303 (and 301/302 after a POST) continue as GET, like a browser
      var o2 = o;
      if (resp.statusCode === 303 || ((resp.statusCode === 301 || resp.statusCode === 302) && method === 'POST')) o2 = { headers: o.headers, method: 'GET', responseType: o.responseType, timeoutMs: o.timeoutMs };
      return pluginFetch(next, o2, hops + 1, finish);
    }
    var chunks = [];
    var size = 0;
    resp.on('data', function (c) {
      size += c.length;
      if (size > 15728640) {
        r.abort();
        return finish(new Error('too big'));
      }
      chunks.push(c);
    });
    resp.on('end', function () {
      var buf = Buffer.concat(chunks);
      var enc = String(resp.headers['content-encoding'] || '').toLowerCase();
      try {
        if (enc === 'gzip') buf = require('zlib').gunzipSync(buf);
        else if (enc === 'deflate') buf = require('zlib').inflateSync(buf);
      } catch (e) {}
      var h = {};
      Object.keys(resp.headers).forEach(function (k) { h[k] = String(resp.headers[k]); });
      finish(null, {
        status: resp.statusCode,
        ok: resp.statusCode >= 200 && resp.statusCode < 300,
        headers: h,
        body: o.responseType === 'base64' ? buf.toString('base64') : buf.toString('utf8'),
        url: target.protocol + '//' + target.host + target.path
      });
    });
  });
  r.on('error', function (e) { finish(e); });
  r.on('timeout', function () { r.abort(); finish(new Error('timeout')); });
  if (body !== null) r.write(body);
  r.end();
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
    var okHosts = ['api.introdb.app', 'api.aniskip.com', 'arm.haglund.dev', 'api.anime-skip.com', 'api.tiffara.com', 'api.mdblist.com', 'api.subdl.com', 'api.torbox.app', 'api.mangadex.org'];
    if (target.protocol !== 'https:' || okHosts.indexOf(target.hostname) < 0) return send(res, 400, { error: 'host not allowed' });
    var isPost = req.method === 'POST';
    // POST only for the Anime-Skip GraphQL endpoint.
    // POST only for the Anime-Skip GraphQL endpoint and TorBox's device sign-in.
    var postOk = (target.hostname === 'api.anime-skip.com' && target.pathname === '/graphql') || (target.hostname === 'api.torbox.app' && target.pathname === '/v1/api/user/auth/device/token');
    if (isPost && !postOk) return send(res, 400, { error: 'post not allowed' });
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
  // ---- Manga plugins (Harbor format) ----
  // A plugin runs in a sandboxed worker in the app; its web requests come here because the sites refuse
  // the app's origin. Local only (the app on this TV). Any http(s) site, GET or POST, the plugin's
  // headers (Referer, Cookie, User-Agent...), redirects followed, 15 MB at most.
  // Subtitle timing of a video file (automatic subtitle sync): local only.
  if (url.pathname === '/api/subtimeline') {
    if (!isLocal(req)) return send(res, 403, { error: 'local only' });
    return subtitleTimeline(String(url.query.url || ''), function (err, out) {
      if (err) return send(res, 200, { error: String(err.message || err) });
      send(res, 200, out);
    });
  }
  if (url.pathname === '/api/phttp' && req.method === 'POST') {
    if (!isLocal(req)) return send(res, 403, { error: 'local only' });
    return readBody(req, function (raw) {
      var o;
      try { o = JSON.parse(raw || '{}'); } catch (e) { return send(res, 400, { error: 'bad json' }); }
      var u = require('url').parse(String(o.url || ''));
      if ((u.protocol !== 'https:' && u.protocol !== 'http:') || !u.hostname) return send(res, 400, { error: 'bad url' });
      pluginFetch(u, o, 0, function (err, out) {
        if (err) return send(res, 502, { error: String(err.message || err) });
        send(res, 200, out);
      });
    }, 2097152);
  }
  // Chapter pages and covers that need the plugin's Referer: the image is fetched here and passed on.
  if (url.pathname === '/api/pimg') {
    if (!isLocal(req)) return send(res, 403, { error: 'local only' });
    var iu = require('url').parse(String(q.u || ''));
    if ((iu.protocol !== 'https:' && iu.protocol !== 'http:') || !iu.hostname) return send(res, 400, { error: 'bad url' });
    var ih = { 'User-Agent': String(q.ua || BROWSER_UA), Accept: 'image/*,*/*;q=0.8' };
    if (q.r) ih.Referer = String(q.r);
    var pipeImg = function (target, hops) {
      var mod = target.protocol === 'http:' ? require('http') : require('https');
      var r = mod.get({ hostname: target.hostname, port: target.port || (target.protocol === 'http:' ? 80 : 443), path: target.path, headers: ih, timeout: 20000 }, function (resp) {
        if (resp.statusCode >= 300 && resp.statusCode < 400 && resp.headers.location && hops < 5) {
          resp.resume();
          return pipeImg(require('url').parse(require('url').resolve(target.protocol + '//' + target.host + target.path, resp.headers.location)), hops + 1);
        }
        res.writeHead(resp.statusCode || 502, { 'Content-Type': resp.headers['content-type'] || 'image/jpeg', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'max-age=86400' });
        resp.pipe(res);
      });
      r.on('error', function () { send(res, 502, { error: 'upstream failed' }); });
      r.on('timeout', function () { r.abort(); });
    };
    return pipeImg(iu, 0);
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
  // The app asks an old copy of this service to quit, so the new one can start (updates).
  if (url.pathname === '/api/exit') {
    if (!isLocal(req)) return send(res, 403, { error: 'local only' });
    send(res, 200, { ok: true });
    return setTimeout(function () { process.exit(0); }, 300);
  }
  if (url.pathname === '/api/info') {
    if (!isLocal(req)) return send(res, 403, { error: 'local only' });
    return send(res, 200, { ip: tvIp(), port: PORT, pin: PIN, last: nextId - 1, version: SERVICE_VERSION });
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
      var allowed = ['traktClientId', 'traktClientSecret', 'simklClientId', 'tmdbKey', 'mdblistKey', 'rpdbKey', 'omdbKey', 'comicvineKey', 'subdlKey', 'animeSkipClientId', 'realDebridKey', 'torboxKey', 'premiumizeKey'];
      var keys = {};
      var n = 0;
      try {
        var data = JSON.parse(body || '{}');
        allowed.forEach(function (k) {
          var v = typeof data[k] === 'string' ? data[k].trim() : '';
          if (v && v.length <= 200 && /^[\w.\-:]+$/.test(v)) { keys[k] = v; n++; }
        });
        // Links (IPTV server, manga repository) and IPTV login: other characters allowed.
        ['iptvHost', 'mangaRepo'].forEach(function (k) {
          var v = typeof data[k] === 'string' ? data[k].trim() : '';
          if (v && v.length <= 500 && /^https?:\/\/[^\s"'<>]+$/i.test(v)) { keys[k] = v; n++; }
        });
        ['iptvUser', 'iptvPass'].forEach(function (k) {
          var v = typeof data[k] === 'string' ? data[k].trim() : '';
          if (v && v.length <= 200 && !/[\s"'<>]/.test(v)) { keys[k] = v; n++; }
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
// TizenBrew runs this file from the newest release tag, which can be older than the app (the app always
// loads the newest commit). So, once, the newest copy on GitHub is fetched; when it is a newer version it
// runs instead of this one. Offline or same version: this copy starts.
function startHere() { server.listen(PORT, '0.0.0.0'); }
(function selfUpdate() {
  try { require('https'); } catch (e) { return startHere(); }
  if (global.__KAI_SVC_CHILD) return startHere();
  var https = require('https');
  var done = false;
  function finish(code) {
    if (done) return;
    done = true;
    var m = code && /var SERVICE_VERSION = (\d+);/.exec(code);
    if (m && Number(m[1]) > SERVICE_VERSION && code.indexOf('REMOTE_PAGE') >= 0) {
      try {
        global.__KAI_SVC_CHILD = true;
        new Function('require', 'module', 'exports', '__dirname', code)(require, { exports: {} }, {}, typeof __dirname === 'string' ? __dirname : '.');
        console.log('Stremio 7M service updated to v' + m[1]);
        return;
      } catch (e) {
        console.log('Newer service failed: ' + e.message);
      }
    }
    startHere();
  }
  // Old Node on the TV: https.get(options, callback) only (no url + options form).
  function get(url, cb) {
    try {
      var o = require('url').parse(url);
      var r = https.get({ hostname: o.hostname, path: o.path, port: 443, headers: { 'User-Agent': 'stremio-7m-tizen', Accept: 'application/vnd.github.sha' } }, function (res) {
        var body = '';
        res.setEncoding('utf8');
        res.on('data', function (c) { body += c; });
        res.on('end', function () { cb(res.statusCode === 200 ? body : null); });
      });
      r.on('error', function () { cb(null); });
      r.setTimeout(6000, function () { r.abort(); });
    } catch (e) {
      cb(null);
    }
  }
  setTimeout(function () { finish(null); }, 15000);
  try {
    get('https://api.github.com/repos/moahmmed597/Stremio-Kai-7M/commits/main', function (sha) {
      sha = String(sha || '').replace(/\s/g, '');
      if (!/^[0-9a-f]{40}$/.test(sha)) return finish(null);
      get('https://cdn.jsdelivr.net/gh/moahmmed597/Stremio-Kai-7M@' + sha + '/dist/remote-service.js', finish);
    });
  } catch (e) {
    finish(null);
  }
})();
