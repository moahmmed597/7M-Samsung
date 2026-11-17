var REMOTE_PAGE = "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover\">\n<meta name=\"theme-color\" content=\"#0d0b14\">\n<meta name=\"apple-mobile-web-app-capable\" content=\"yes\">\n<title>Stremio Kai remote</title>\n<style>\n  :root { --bg: #0d0b14; --card: #1b1826; --key: #262236; --text: #f2f0f8; --muted: #9a94ad; --accent: #7b5bf5; }\n  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }\n  html, body { margin: 0; background: var(--bg); color: var(--text); font: 16px/1.4 system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans Arabic\", sans-serif; }\n  body { min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: max(16px, env(safe-area-inset-top)) 16px max(24px, env(safe-area-inset-bottom)); }\n  header { width: 100%; max-width: 420px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }\n  .brand { font-size: 20px; } .brand b { color: #9d85ff; }\n  .status { font-size: 13px; color: var(--muted); }\n  .status.ok { color: #8fe3aa; } .status.bad { color: #ff8f8f; }\n  main { width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: 22px; }\n  button { font: inherit; color: var(--text); background: var(--key); border: 0; border-radius: 18px; cursor: pointer; touch-action: manipulation; user-select: none; -webkit-user-select: none; }\n  button:active { transform: scale(0.96); background: #332d47; }\n  .pad { position: relative; width: min(300px, 78vw); height: min(300px, 78vw); margin: 4px auto 0; border-radius: 50%; background: var(--card); }\n  .pad button { position: absolute; width: 33%; height: 33%; border-radius: 50%; background: transparent; font-size: 30px; color: #d8d2ea; }\n  .pad button:active { background: rgba(255,255,255,0.08); }\n  .pad .up { top: 2%; left: 33.5%; } .pad .down { bottom: 2%; left: 33.5%; }\n  .pad .left { left: 2%; top: 33.5%; } .pad .right { right: 2%; top: 33.5%; }\n  .pad .ok { left: 31%; top: 31%; width: 38%; height: 38%; background: var(--accent); color: #fff; font-size: 20px; font-weight: 700; }\n  .pad .ok:active { background: #6847e8; }\n  .row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }\n  .row.two { grid-template-columns: 1fr 1fr; }\n  .row button { height: 58px; font-size: 22px; }\n  .row button small { display: block; font-size: 11px; color: var(--muted); margin-top: 2px; }\n  .type { display: flex; gap: 10px; }\n  .type input { flex: 1; min-width: 0; font: inherit; color: var(--text); background: var(--card); border: 2px solid #2d2840; border-radius: 16px; padding: 14px 16px; outline: none; }\n  .type input:focus { border-color: var(--accent); }\n  .type button { padding: 0 20px; background: var(--accent); font-weight: 700; }\n  .hint { color: var(--muted); font-size: 13px; text-align: center; margin: -10px 0 0; }\n  .tabs { width: 100%; max-width: 420px; display: flex; gap: 8px; margin-bottom: 18px; }\n  .tabs button { flex: 1; height: 42px; border-radius: 14px; font-weight: 600; }\n  .tabs button.on { background: var(--accent); }\n  body.locked .tabs { display: none; }\n  body.tab-browse main { display: none; }\n  .browse { width: 100%; max-width: 420px; }\n  .browse[hidden] { display: none; }\n  .browse h2 { font-size: 16px; margin: 6px 0 10px; }\n  .browse .strip { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 14px; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }\n  .browse .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }\n  .browse .grid .item { max-width: none; }\n  .browse .item { flex: 0 0 31%; max-width: 31%; min-width: 0; overflow: hidden; scroll-snap-align: start; background: none; padding: 0; border-radius: 12px; text-align: left; color: var(--text); }\n  .browse .item img, .browse .item .ph { width: 100%; aspect-ratio: 2 / 3; object-fit: cover; border-radius: 12px; background: var(--card); display: block; }\n  .browse .item .t { font-size: 12px; margin-top: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n  .browse .item .s { font-size: 11px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n  .browse .item .bar { height: 3px; background: #2d2840; border-radius: 2px; margin-top: 4px; }\n  .browse .item .bar i { display: block; height: 100%; background: var(--accent); border-radius: 2px; }\n  .browse .empty { color: var(--muted); font-size: 14px; text-align: center; padding: 40px 0; }\n  .now { display: flex; gap: 14px; background: var(--card); border-radius: 18px; padding: 12px; }\n  .now[hidden] { display: none; }\n  .now img { width: 74px; height: 110px; object-fit: cover; border-radius: 10px; background: #2d2840; flex-shrink: 0; }\n  .np-info { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; }\n  .np-title { font-weight: 700; font-size: 17px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n  .np-ep { color: var(--muted); font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-height: 17px; }\n  .np-info input[type=range] { width: 100%; margin: 10px 0 4px; accent-color: var(--accent); }\n  .np-times { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }\n  .np-times button { width: 46px; height: 34px; border-radius: 12px; font-size: 16px; }\n  .type .mic { padding: 0 16px; background: var(--key); font-size: 22px; }\n  .type .mic.on { background: #e5484d; }\n  .pin { display: none; flex-direction: column; gap: 14px; align-items: center; text-align: center; padding-top: 30px; }\n  .pin input { width: 200px; text-align: center; font-size: 34px; letter-spacing: 12px; color: var(--text); background: var(--card); border: 2px solid #2d2840; border-radius: 16px; padding: 12px; outline: none; }\n  .pin button { padding: 14px 40px; background: var(--accent); font-weight: 700; }\n  body.locked main { display: none; } body.locked .pin { display: flex; }\n</style>\n</head>\n<body class=\"locked\">\n<header>\n  <div class=\"brand\">Stremio <b>Kai</b> remote</div>\n  <div class=\"status\" id=\"status\">…</div>\n</header>\n\n<section class=\"pin\">\n  <div>Enter the PIN shown on the TV<br><small style=\"color:var(--muted)\">Settings → Phone remote</small></div>\n  <input id=\"pin\" inputmode=\"numeric\" maxlength=\"4\" autocomplete=\"off\" placeholder=\"····\">\n  <button id=\"pinGo\">Connect</button>\n</section>\n\n<nav class=\"tabs\" id=\"tabs\">\n  <button class=\"on\" data-tab=\"remote\">Remote</button>\n  <button data-tab=\"browse\">Browse</button>\n</nav>\n\n<section class=\"browse\" id=\"browse\" hidden></section>\n\n<main>\n  <section class=\"now\" id=\"now\" hidden>\n    <img id=\"npPoster\" alt=\"\">\n    <div class=\"np-info\">\n      <div class=\"np-title\" id=\"npTitle\"></div>\n      <div class=\"np-ep\" id=\"npEp\"></div>\n      <input type=\"range\" id=\"npSeek\" min=\"0\" max=\"100\" value=\"0\">\n      <div class=\"np-times\"><span id=\"npPos\">0:00</span><button id=\"npPlay\" data-key=\"10252\">⏯</button><span id=\"npDur\">0:00</span></div>\n    </div>\n  </section>\n  <div class=\"pad\">\n    <button class=\"up\" data-key=\"38\" aria-label=\"Up\">▲</button>\n    <button class=\"left\" data-key=\"37\" aria-label=\"Left\">◀</button>\n    <button class=\"ok\" data-key=\"13\">OK</button>\n    <button class=\"right\" data-key=\"39\" aria-label=\"Right\">▶</button>\n    <button class=\"down\" data-key=\"40\" aria-label=\"Down\">▼</button>\n  </div>\n  <div class=\"row\">\n    <button data-key=\"10009\">↩<small>Back</small></button>\n    <button data-key=\"10252\">⏯<small>Play / pause</small></button>\n    <button data-key=\"413\">⏹<small>Stop</small></button>\n  </div>\n  <div class=\"row two\">\n    <button data-key=\"412\">⏪<small>Rewind</small></button>\n    <button data-key=\"417\">⏩<small>Forward</small></button>\n  </div>\n  <div class=\"row\">\n    <button data-vol=\"down\">🔉<small>Volume −</small></button>\n    <button data-vol=\"mute\">🔇<small>Mute</small></button>\n    <button data-vol=\"up\">🔊<small>Volume +</small></button>\n  </div>\n  <div class=\"row two\">\n    <button data-key=\"428\">⏪ Aa<small>Subtitles earlier</small></button>\n    <button data-key=\"427\">Aa ⏩<small>Subtitles later</small></button>\n  </div>\n  <form class=\"type\" id=\"searchForm\">\n    <input id=\"query\" type=\"search\" placeholder=\"Search on the TV…\" autocomplete=\"off\" enterkeyhint=\"search\">\n    <button type=\"button\" id=\"mic\" class=\"mic\" aria-label=\"Voice search\" hidden>🎤</button>\n    <button type=\"submit\">Search</button>\n  </form>\n  <p class=\"hint\" id=\"voiceHint\">Speak your search: tap 🎤 on your phone's keyboard, or the mic button.</p>\n  <form class=\"type\" id=\"typeForm\">\n    <input id=\"text\" placeholder=\"Type on the TV…\" autocomplete=\"off\" enterkeyhint=\"send\">\n    <button type=\"submit\">Send</button>\n  </form>\n  <p class=\"hint\">Typing fills the selected text box on the TV (search, sign-in…).</p>\n</main>\n\n<script>\n(function () {\n  var pin = '';\n  var statusEl = document.getElementById('status');\n  function status(text, cls) { statusEl.textContent = text; statusEl.className = 'status ' + (cls || ''); }\n\n  // The QR code on the TV opens this page with #pin=1234, so scanning connects straight away.\n  var m = location.hash.match(/pin=(\\d{4})/);\n  try { pin = (m && m[1]) || localStorage.getItem('kaiRemotePin') || ''; } catch (e) { pin = (m && m[1]) || ''; }\n  if (m) history.replaceState(null, '', location.pathname);\n\n  function check(p) {\n    return fetch('/api/check?pin=' + encodeURIComponent(p)).then(function (r) { return r.ok; }).catch(function () { return false; });\n  }\n  function unlock(p) {\n    return check(p).then(function (ok) {\n      if (!ok) { status('Wrong PIN', 'bad'); document.body.classList.add('locked'); return false; }\n      pin = p;\n      try { localStorage.setItem('kaiRemotePin', p); } catch (e) {}\n      document.body.classList.remove('locked');\n      status('Connected', 'ok');\n      refreshNow();\n      return true;\n    });\n  }\n  document.getElementById('pinGo').onclick = function () { unlock(document.getElementById('pin').value.trim()); };\n  document.getElementById('pin').onkeydown = function (e) { if (e.key === 'Enter') unlock(this.value.trim()); };\n\n  function post(url, body) {\n    return fetch(url + (url.indexOf('?') < 0 ? '?' : '&') + 'pin=' + encodeURIComponent(pin), { method: 'POST', body: body || '' })\n      .then(function (r) {\n        if (r.status === 401) { status('PIN changed: enter it again', 'bad'); document.body.classList.add('locked'); }\n        else status('Connected', 'ok');\n      })\n      .catch(function () { status('TV not reachable', 'bad'); });\n  }\n\n  // Holding an arrow repeats it, like the real remote.\n  Array.prototype.forEach.call(document.querySelectorAll('[data-key]'), function (b) {\n    var code = b.getAttribute('data-key');\n    var repeat = null, delay = null;\n    var arrow = /^3[7-9]$|^40$/.test(code);\n    function stop() { clearTimeout(delay); clearInterval(repeat); delay = repeat = null; }\n    b.addEventListener('pointerdown', function (e) {\n      e.preventDefault();\n      if (navigator.vibrate) navigator.vibrate(10);\n      post('/api/key?code=' + code);\n      if (arrow) delay = setTimeout(function () { repeat = setInterval(function () { post('/api/key?code=' + code); }, 140); }, 400);\n    });\n    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { b.addEventListener(ev, stop); });\n  });\n\n  document.getElementById('typeForm').onsubmit = function (e) {\n    e.preventDefault();\n    var input = document.getElementById('text');\n    if (!input.value) return;\n    post('/api/text?submit=1', input.value).then(function () { input.value = ''; });\n  };\n\n  // ---- Browse: Continue watching, New episodes and Library from the TV; tap to open on the TV ----\n  var browseEl = document.getElementById('browse');\n  Array.prototype.forEach.call(document.querySelectorAll('[data-tab]'), function (b) {\n    b.onclick = function () {\n      var browse = b.getAttribute('data-tab') === 'browse';\n      document.body.classList.toggle('tab-browse', browse);\n      browseEl.hidden = !browse;\n      Array.prototype.forEach.call(document.querySelectorAll('[data-tab]'), function (x) { x.classList.toggle('on', x === b); });\n      if (browse) loadBrowse();\n    };\n  });\n  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }\n  function item(it) {\n    var b = el('button', 'item');\n    if (it.poster) { var im = el('img'); im.loading = 'lazy'; im.alt = ''; im.src = it.poster; b.appendChild(im); } else b.appendChild(el('div', 'ph'));\n    b.appendChild(el('div', 't', it.name));\n    if (it.sub) b.appendChild(el('div', 's', it.sub));\n    if (it.progress) { var bar = el('div', 'bar'), fill = el('i'); fill.style.width = Math.round(it.progress * 100) + '%'; bar.appendChild(fill); b.appendChild(bar); }\n    b.onclick = function () {\n      if (navigator.vibrate) navigator.vibrate(15);\n      post('/api/open?type=' + encodeURIComponent(it.type) + '&id=' + encodeURIComponent(it.id) + (it.video ? '&video=' + encodeURIComponent(it.video) : ''))\n        .then(function () { status('Opening on the TV…', 'ok'); });\n    };\n    return b;\n  }\n  function loadBrowse() {\n    fetch('/api/browse?pin=' + encodeURIComponent(pin)).then(function (r) { return r.json(); }).then(function (d) {\n      browseEl.innerHTML = '';\n      var labels = d.labels || {};\n      var any = false;\n      [['continueWatching', 'strip'], ['newEpisodes', 'strip'], ['library', 'grid']].forEach(function (sec) {\n        var list = d[sec[0]] || [];\n        if (!list.length) return;\n        any = true;\n        browseEl.appendChild(el('h2', '', labels[sec[0]] || sec[0]));\n        var box = el('div', sec[1]);\n        list.forEach(function (it) { box.appendChild(item(it)); });\n        browseEl.appendChild(box);\n      });\n      if (!any) browseEl.appendChild(el('div', 'empty', 'Nothing yet: open the app on the TV and sign in to your Stremio account.'));\n    }).catch(function () { status('TV not reachable', 'bad'); });\n  }\n\n  // Volume: the TV's own volume, through the TV.\n  Array.prototype.forEach.call(document.querySelectorAll('[data-vol]'), function (b) {\n    b.addEventListener('click', function () {\n      if (navigator.vibrate) navigator.vibrate(10);\n      fetch('/api/volume?dir=' + b.getAttribute('data-vol') + '&pin=' + encodeURIComponent(pin), { method: 'POST' })\n        .then(function (r) { return r.json(); })\n        .then(function (r) { if (r.ok) status('Connected', 'ok'); else status(/allow/.test(r.error || '') ? 'Allow the remote on the TV' : 'Volume not available', 'bad'); })\n        .catch(function () { status('TV not reachable', 'bad'); });\n    });\n  });\n\n  // Now playing: poster, title and a progress bar you can drag to jump.\n  var nowEl = document.getElementById('now'), seek = document.getElementById('npSeek'), dragging = false, lastPoster = '';\n  function fmt(sec) {\n    sec = Math.max(0, Math.floor(sec)); var h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60;\n    return (h ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + (s < 10 ? '0' : '') + s;\n  }\n  function refreshNow() {\n    if (!pin || document.body.classList.contains('locked') || document.hidden) return;\n    fetch('/api/state?pin=' + encodeURIComponent(pin)).then(function (r) { return r.json(); }).then(function (r) {\n      var p = r.playing;\n      nowEl.hidden = !p;\n      if (!p) return;\n      document.getElementById('npTitle').textContent = p.title;\n      document.getElementById('npEp').textContent = p.episode || '';\n      if (p.poster && p.poster !== lastPoster) { document.getElementById('npPoster').src = lastPoster = p.poster; }\n      document.getElementById('npDur').textContent = fmt(p.duration);\n      document.getElementById('npPlay').textContent = p.paused ? '▶' : '⏸';\n      if (!dragging && p.duration) {\n        // The TV reports every few seconds; move the bar along in between.\n        var pos = p.paused ? p.position : p.position + (Date.now() - r.at) / 1000;\n        seek.max = p.duration; seek.value = Math.min(pos, p.duration);\n        document.getElementById('npPos').textContent = fmt(pos);\n      }\n    }).catch(function () {});\n  }\n  seek.addEventListener('input', function () { dragging = true; document.getElementById('npPos').textContent = fmt(seek.value); });\n  seek.addEventListener('change', function () {\n    dragging = false;\n    post('/api/seek?to=' + Math.floor(seek.value));\n  });\n  setInterval(refreshNow, 2000);\n\n  // Search on the TV from anywhere in the app (typed, keyboard dictation, or the mic button).\n  var query = document.getElementById('query');\n  function search(q) {\n    q = (q || '').trim();\n    if (q.length < 2) return;\n    post('/api/search', q).then(function () { query.value = ''; status('Searching on the TV…', 'ok'); });\n  }\n  document.getElementById('searchForm').onsubmit = function (e) { e.preventDefault(); search(query.value); };\n\n  // The browser's speech recognition only runs on secure (https) pages; on the TV's local\n  // address the keyboard's own dictation button does the same job, so the hint stays.\n  var Rec = window.SpeechRecognition || window.webkitSpeechRecognition;\n  if (!(Rec && window.isSecureContext)) document.getElementById('voiceHint').textContent = \"Speak your search: tap 🎤 on your phone's keyboard, then Search.\";\n  if (Rec && window.isSecureContext) {\n    var mic = document.getElementById('mic');\n    mic.hidden = false;\n    mic.onclick = function () {\n      var r = new Rec();\n      r.lang = navigator.language || 'en-US';\n      r.interimResults = false;\n      mic.classList.add('on');\n      r.onresult = function (e) { var q = e.results[0][0].transcript; query.value = q; search(q); };\n      r.onend = function () { mic.classList.remove('on'); };\n      r.onerror = function () { mic.classList.remove('on'); status('Mic not available: use the keyboard 🎤', 'bad'); };\n      r.start();\n    };\n  }\n\n  if (pin) unlock(pin); else status('Locked');\n})();\n</script>\n</body>\n</html>\n";
var SETUP_PAGE = "<!DOCTYPE html>\r\n<html lang=\"ar\" dir=\"rtl\">\r\n<head>\r\n<meta charset=\"utf-8\">\r\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\r\n<title>Stremio Kai · المفاتيح</title>\r\n<style>\r\n  body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Tahoma, sans-serif; background: #0d0b14; color: #fff; }\r\n  main { max-width: 560px; margin: 0 auto; padding: 18px 16px 60px; }\r\n  h1 { font-size: 22px; margin: 6px 0 4px; }\r\n  p.lead { color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.6; margin: 0 0 14px; }\r\n  section { background: rgba(255,255,255,0.06); border-radius: 14px; padding: 14px; margin-bottom: 12px; }\r\n  h2 { font-size: 17px; margin: 0 0 4px; }\r\n  .help { font-size: 13px; color: rgba(255,255,255,0.6); margin: 0 0 10px; line-height: 1.6; }\r\n  .help a { color: #c9bbff; }\r\n  label { display: block; font-size: 13px; color: rgba(255,255,255,0.75); margin: 8px 0 4px; }\r\n  input { width: 100%; box-sizing: border-box; padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.18); background: #17131f; color: #fff; font-size: 15px; direction: ltr; text-align: left; }\r\n  code { background: rgba(255,255,255,0.1); padding: 1px 6px; border-radius: 6px; direction: ltr; display: inline-block; }\r\n  button { width: 100%; padding: 15px; border: 0; border-radius: 12px; background: #7b5bf5; color: #fff; font-size: 17px; font-weight: 700; position: sticky; bottom: 12px; }\r\n  #msg { text-align: center; margin: 12px 0; font-size: 15px; min-height: 20px; }\r\n  .ok { color: #6ee7a0; } .err { color: #ff8a8a; }\r\n  #pinbox { display: none; }\r\n</style>\r\n</head>\r\n<body>\r\n<main>\r\n  <h1>مفاتيح Stremio Kai</h1>\r\n  <p class=\"lead\">اللي تكتبه هنا يروح للتلفزيون مباشرة عن طريق شبكة البيت، ويبقى في التلفزيون بس. الخانات الفاضية ما تغيّر شي.</p>\r\n\r\n  <section id=\"pinbox\">\r\n    <h2>الرقم السري</h2>\r\n    <p class=\"help\">اكتب الرقم السري اللي يطلع في التلفزيون (الإعدادات ← التكاملات).</p>\r\n    <input id=\"pin\" inputmode=\"numeric\" maxlength=\"4\" placeholder=\"1234\">\r\n  </section>\r\n\r\n  <section>\r\n    <h2>Trakt</h2>\r\n    <p class=\"help\">افتح <a href=\"https://developer.trakt.tv/apps\" target=\"_blank\" rel=\"noopener\">developer.trakt.tv/apps</a>، اضغط على تطبيقك (أو Create app وحط في Redirect URIs <code>urn:ietf:wg:oauth:2.0:oob</code>)، وانسخ <b>Client ID</b>. التطبيقات الجديدة ما فيها Client Secret، وهذا عادي.</p>\r\n    <label>Client ID</label><input data-k=\"traktClientId\" autocomplete=\"off\">\r\n    <label>Client Secret (بس إذا تطبيقك قديم وفيه واحد)</label><input data-k=\"traktClientSecret\" autocomplete=\"off\">\r\n  </section>\r\n\r\n  <section>\r\n    <h2>Simkl</h2>\r\n    <p class=\"help\">افتح <a href=\"https://simkl.com/settings/developer/new/\" target=\"_blank\" rel=\"noopener\">simkl.com/settings/developer</a>، سوّ تطبيق، وحط في Redirect URI <code>urn:ietf:wg:oauth:2.0:oob</code>، وانسخ Client ID.</p>\r\n    <label>Client ID</label><input data-k=\"simklClientId\" autocomplete=\"off\">\r\n  </section>\r\n\r\n  <section>\r\n    <h2>البيانات والتقييمات</h2>\r\n    <label>TMDB API key (v3) — <a href=\"https://www.themoviedb.org/settings/api\" target=\"_blank\" rel=\"noopener\">themoviedb.org</a></label><input data-k=\"tmdbKey\" autocomplete=\"off\">\r\n    <label>MDBList API key — <a href=\"https://mdblist.com/preferences/\" target=\"_blank\" rel=\"noopener\">mdblist.com</a></label><input data-k=\"mdblistKey\" autocomplete=\"off\">\r\n    <label>RPDB key — <a href=\"https://ratingposterdb.com/\" target=\"_blank\" rel=\"noopener\">ratingposterdb.com</a></label><input data-k=\"rpdbKey\" autocomplete=\"off\">\r\n    <label>ComicVine key (الكوميكس) — <a href=\"https://comicvine.gamespot.com/api/\" target=\"_blank\" rel=\"noopener\">comicvine.gamespot.com</a></label><input data-k=\"comicvineKey\" autocomplete=\"off\">\r\n    <label>OMDb key (الجوائز) — <a href=\"https://www.omdbapi.com/apikey.aspx\" target=\"_blank\" rel=\"noopener\">omdbapi.com</a></label><input data-k=\"omdbKey\" autocomplete=\"off\">\r\n  </section>\r\n\r\n  <section>\r\n    <h2>الترجمة والتخطي</h2>\r\n    <label>SubDL API key — <a href=\"https://subdl.com/panel/api\" target=\"_blank\" rel=\"noopener\">subdl.com</a></label><input data-k=\"subdlKey\" autocomplete=\"off\">\r\n    <label>Anime-Skip Client ID — <a href=\"https://anime-skip.com/\" target=\"_blank\" rel=\"noopener\">anime-skip.com</a></label><input data-k=\"animeSkipClientId\" autocomplete=\"off\">\r\n  </section>\r\n\r\n  <section>\r\n    <h2>IPTV (البث المباشر)</h2>\r\n    <p class=\"help\">بيانات اشتراك Xtream Codes حقك. تنرسل للتلفزيون مباشرة على شبكة البيت وتتحفظ فيه بس.</p>\r\n    <label>Host (مثال http://example.com:80)</label><input data-k=\"iptvHost\" autocomplete=\"off\">\r\n    <label>Username</label><input data-k=\"iptvUser\" autocomplete=\"off\">\r\n    <label>Password</label><input data-k=\"iptvPass\" autocomplete=\"off\">\r\n  </section>\r\n\r\n  <section>\r\n    <h2>مانجا</h2>\r\n    <label>رابط مستودع إضافات (repo.json)</label><input data-k=\"mangaRepo\" autocomplete=\"off\">\r\n  </section>\r\n\r\n  <section>\r\n    <h2>Debrid</h2>\r\n    <label>Real-Debrid — <a href=\"https://real-debrid.com/apitoken\" target=\"_blank\" rel=\"noopener\">real-debrid.com/apitoken</a></label><input data-k=\"realDebridKey\" autocomplete=\"off\">\r\n    <label>TorBox — <a href=\"https://torbox.app/settings\" target=\"_blank\" rel=\"noopener\">torbox.app/settings</a></label><input data-k=\"torboxKey\" autocomplete=\"off\">\r\n    <label>Premiumize — <a href=\"https://www.premiumize.me/account\" target=\"_blank\" rel=\"noopener\">premiumize.me/account</a></label><input data-k=\"premiumizeKey\" autocomplete=\"off\">\r\n  </section>\r\n\r\n  <div id=\"msg\"></div>\r\n  <button id=\"save\">إرسال للتلفزيون</button>\r\n</main>\r\n<script>\r\n(function () {\r\n  var pin = (location.hash.match(/pin=(\\d{4})/) || [])[1] || '';\r\n  // Opened from one service's QR on the TV: show only that service, with a button to its key page.\r\n  var only = (location.hash.match(/only=(\\w+)/) || [])[1] || '';\r\n  if (only) {\r\n    var field = document.querySelector('input[data-k=\"' + only + '\"]');\r\n    if (field) {\r\n      var secs = document.querySelectorAll('section');\r\n      for (var q = 0; q < secs.length; q++) if (secs[q].id !== 'pinbox' && !secs[q].contains(field)) secs[q].style.display = 'none';\r\n      var mates = field.parentNode.querySelectorAll('input[data-k]');\r\n      for (var w = 0; w < mates.length; w++) {\r\n        if (mates[w] === field) continue;\r\n        mates[w].style.display = 'none';\r\n        if (mates[w].previousElementSibling) mates[w].previousElementSibling.style.display = 'none';\r\n      }\r\n      var label = field.previousElementSibling;\r\n      var link = label && label.querySelector('a');\r\n      var help = field.parentNode.querySelector('.help a');\r\n      var target = (link || help);\r\n      if (target) {\r\n        var go = document.createElement('a');\r\n        go.href = target.href;\r\n        go.target = '_blank';\r\n        go.rel = 'noopener';\r\n        go.textContent = '١) افتح صفحة المفتاح وانسخه';\r\n        go.style.cssText = 'display:block;text-align:center;padding:14px;border-radius:12px;background:#2b2440;color:#fff;font-weight:700;margin:6px 0 12px;text-decoration:none';\r\n        field.parentNode.insertBefore(go, field.parentNode.querySelector('h2').nextSibling);\r\n      }\r\n      field.placeholder = '٢) الصق المفتاح هنا';\r\n      document.getElementById('save').textContent = '٣) إرسال للتلفزيون';\r\n    }\r\n  }\r\n  var pinBox = document.getElementById('pinbox');\r\n  var pinInput = document.getElementById('pin');\r\n  if (!pin) pinBox.style.display = 'block';\r\n  var msg = document.getElementById('msg');\r\n  function say(text, cls) { msg.textContent = text; msg.className = cls || ''; }\r\n  document.getElementById('save').onclick = function () {\r\n    var p = pin || pinInput.value.trim();\r\n    if (!/^\\d{4}$/.test(p)) return say('اكتب الرقم السري (4 أرقام)', 'err');\r\n    var keys = {};\r\n    var n = 0;\r\n    var inputs = document.querySelectorAll('input[data-k]');\r\n    for (var i = 0; i < inputs.length; i++) {\r\n      var v = inputs[i].value.trim();\r\n      if (v) { keys[inputs[i].getAttribute('data-k')] = v; n++; }\r\n    }\r\n    if (!n) return say('ما كتبت أي مفتاح', 'err');\r\n    say('جاري الإرسال...');\r\n    var x = new XMLHttpRequest();\r\n    x.open('POST', '/api/keys?pin=' + encodeURIComponent(p));\r\n    x.setRequestHeader('Content-Type', 'application/json');\r\n    x.onload = function () {\r\n      if (x.status === 200) {\r\n        say('وصلت للتلفزيون ✓ (' + n + ')', 'ok');\r\n        for (var j = 0; j < inputs.length; j++) inputs[j].value = '';\r\n      } else if (x.status === 401) say('الرقم السري غلط', 'err');\r\n      else say('ما وصلت، جرّب مرة ثانية', 'err');\r\n    };\r\n    x.onerror = function () { say('ما قدرت أوصل للتلفزيون. تأكد إنك على نفس الواي فاي', 'err'); };\r\n    x.send(JSON.stringify(keys));\r\n  };\r\n})();\r\n</script>\r\n</body>\r\n</html>\r\n";
var BACKUP_PAGE = "<!DOCTYPE html>\r\n<html lang=\"ar\" dir=\"rtl\">\r\n<head>\r\n<meta charset=\"utf-8\">\r\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\r\n<title>Stremio 7M · النسخة الاحتياطية</title>\r\n<style>\r\n  body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Tahoma, sans-serif; background: #0b0f19; color: #fff; }\r\n  main { max-width: 560px; margin: 0 auto; padding: 18px 16px 60px; }\r\n  h1 { font-size: 22px; margin: 6px 0 4px; }\r\n  p.lead { color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.7; margin: 0 0 14px; }\r\n  section { background: rgba(255,255,255,0.06); border-radius: 14px; padding: 14px; margin-bottom: 12px; }\r\n  h2 { font-size: 17px; margin: 0 0 4px; }\r\n  .help { font-size: 13px; color: rgba(255,255,255,0.6); margin: 0 0 10px; line-height: 1.6; }\r\n  input[type=text] { width: 100%; box-sizing: border-box; padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.18); background: #141a29; color: #fff; font-size: 15px; direction: ltr; text-align: left; }\r\n  input[type=file] { width: 100%; color: #fff; margin-bottom: 10px; }\r\n  .btn { display: block; box-sizing: border-box; width: 100%; padding: 15px; border: 0; border-radius: 12px; background: #2f5bd3; color: #fff; font-size: 17px; font-weight: 700; text-align: center; text-decoration: none; }\r\n  .btn.alt { background: #7b5bf5; }\r\n  #msg { text-align: center; margin: 12px 0; font-size: 15px; min-height: 20px; }\r\n  .ok { color: #6ee7a0; } .err { color: #ff8a8a; }\r\n  #pinbox { display: none; }\r\n</style>\r\n</head>\r\n<body>\r\n<main>\r\n  <h1>النسخة الاحتياطية</h1>\r\n  <p class=\"lead\">فيها كل إعداداتك: الملفات الشخصية، المفاتيح، المصادر، وين وقفت في القراءة والاستماع، والقنوات. احفظها في جوالك عشان لو حذفت التطبيق أو ثبّته من جديد ترجعها بضغطة. <b>فيها مفاتيحك وكلمات سر القنوات، لا ترسلها لأحد.</b></p>\r\n\r\n  <section id=\"pinbox\">\r\n    <h2>الرقم السري</h2>\r\n    <p class=\"help\">اكتب الرقم السري اللي يطلع في التلفزيون.</p>\r\n    <input id=\"pin\" type=\"text\" inputmode=\"numeric\" maxlength=\"4\" placeholder=\"1234\">\r\n  </section>\r\n\r\n  <section>\r\n    <h2>⬇️ نزّل النسخة لجوالك</h2>\r\n    <p class=\"help\">أول سوّ \"احفظ نسخة الحين\" في التلفزيون (الإعدادات ← حول ← النسخة الاحتياطية)، بعدين اضغط هنا.</p>\r\n    <a id=\"down\" class=\"btn\" href=\"#\">نزّل الملف</a>\r\n  </section>\r\n\r\n  <section>\r\n    <h2>⬆️ رجّع نسخة للتلفزيون</h2>\r\n    <p class=\"help\">اختر ملف <code>stremio7m-backup.json</code> من جوالك. التلفزيون بيسألك قبل ما يرجعها.</p>\r\n    <input id=\"file\" type=\"file\" accept=\".json,application/json\">\r\n    <button id=\"send\" class=\"btn alt\">أرسل للتلفزيون</button>\r\n  </section>\r\n\r\n  <div id=\"msg\"></div>\r\n</main>\r\n<script>\r\n(function () {\r\n  var m = /[?&#]pin=(\\d{4})/.exec(location.href);\r\n  var pin = m ? m[1] : '';\r\n  var pinBox = document.getElementById('pinbox');\r\n  var pinInput = document.getElementById('pin');\r\n  if (!pin) pinBox.style.display = 'block';\r\n  var msg = document.getElementById('msg');\r\n  function say(text, cls) { msg.textContent = text; msg.className = cls || ''; }\r\n  function thePin() {\r\n    var p = pin || pinInput.value.trim();\r\n    if (!/^\\d{4}$/.test(p)) { say('اكتب الرقم السري (4 أرقام)', 'err'); return ''; }\r\n    return p;\r\n  }\r\n  document.getElementById('down').onclick = function (e) {\r\n    e.preventDefault();\r\n    var p = thePin();\r\n    if (!p) return;\r\n    var x = new XMLHttpRequest();\r\n    x.open('GET', '/api/backup-file?pin=' + encodeURIComponent(p));\r\n    x.onload = function () {\r\n      if (x.status === 401) return say('الرقم السري غلط', 'err');\r\n      if (x.status !== 200) return say('ما في نسخة. سوّ \"احفظ نسخة الحين\" في التلفزيون أول', 'err');\r\n      var blob = new Blob([x.responseText], { type: 'application/json' });\r\n      var a = document.createElement('a');\r\n      a.href = URL.createObjectURL(blob);\r\n      a.download = 'stremio7m-backup.json';\r\n      document.body.appendChild(a);\r\n      a.click();\r\n      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 2000);\r\n      say('تم التنزيل ✓ احفظه في مكان آمن', 'ok');\r\n    };\r\n    x.onerror = function () { say('ما قدرت أوصل للتلفزيون. تأكد إنك على نفس الواي فاي', 'err'); };\r\n    x.send();\r\n  };\r\n  document.getElementById('send').onclick = function () {\r\n    var p = thePin();\r\n    if (!p) return;\r\n    var f = document.getElementById('file').files[0];\r\n    if (!f) return say('اختر ملف النسخة أول', 'err');\r\n    var r = new FileReader();\r\n    r.onload = function () {\r\n      var text = String(r.result || '');\r\n      try {\r\n        var o = JSON.parse(text);\r\n        if (!o || o.app !== 'stremio7m') throw new Error('x');\r\n      } catch (e) { return say('هذا مو ملف نسخة Stremio 7M', 'err'); }\r\n      say('جاري الإرسال...');\r\n      var x = new XMLHttpRequest();\r\n      x.open('POST', '/api/restore?pin=' + encodeURIComponent(p));\r\n      x.setRequestHeader('Content-Type', 'application/json');\r\n      x.onload = function () {\r\n        if (x.status === 200) say('وصلت ✓ وافق في التلفزيون عشان ترجع', 'ok');\r\n        else if (x.status === 401) say('الرقم السري غلط', 'err');\r\n        else say('ما وصلت، جرّب مرة ثانية', 'err');\r\n      };\r\n      x.onerror = function () { say('ما قدرت أوصل للتلفزيون. تأكد إنك على نفس الواي فاي', 'err'); };\r\n      x.send(text);\r\n    };\r\n    r.readAsText(f);\r\n  };\r\n})();\r\n</script>\r\n</body>\r\n</html>\r\n";
// Phone remote: a TizenBrew service (Node.js 4 on the TV, so plain ES5).
// - Serves the remote page to phones on the same Wi-Fi at http://<TV IP>:8095
// - Phones send key presses and text, guarded by a 4-digit PIN shown in the app's Settings.
// - The app on the TV long-polls /api/events from 127.0.0.1 and replays them as remote keys.
'use strict';

var http = require('http');
var os = require('os');

// Bump when the service changes: a running copy compares it with the newest one on GitHub.
var SERVICE_VERSION = 7;
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

// ---- Backup of the app's settings (Settings → About → Backup) ----
// Kept in memory and in a file in the TV's home folder, which reinstalling the app does not touch
// (the service belongs to TizenBrew). The phone can download it and send one back (PIN).
var BACKUP_MAX = 6 * 1024 * 1024;
var backupBlob = null;
var restoreBlob = null;
function backupFiles() {
  var path = require('path');
  var dirs = [process.env.HOME, '/home/owner', '/opt/usr/home/owner'].filter(function (d, i, a) { return d && a.indexOf(d) === i; });
  return dirs.map(function (d) { return path.join(d, '.stremio7m-backup.json'); });
}
// The copy before is kept too (".prev"), so one bad save can never wipe a good backup.
function saveBackupFile(text) {
  var fs = require('fs');
  var list = backupFiles();
  for (var i = 0; i < list.length; i++) {
    try {
      try { fs.writeFileSync(list[i] + '.prev', fs.readFileSync(list[i])); } catch (e0) { /* first copy */ }
      fs.writeFileSync(list[i], text);
      return list[i];
    } catch (e) { /* not writable: try the next folder */ }
  }
  return '';
}
function backupInfo() {
  var fs = require('fs');
  var list = backupFiles();
  var at = function (t) { try { return JSON.parse(t).at || 0; } catch (e) { return 0; } };
  for (var i = 0; i < list.length; i++) {
    try {
      var cur = fs.readFileSync(list[i], 'utf8');
      var prev = '';
      try { prev = fs.readFileSync(list[i] + '.prev', 'utf8'); } catch (e1) { /* none */ }
      return { file: list[i], at: at(cur), prevAt: prev ? at(prev) : 0 };
    } catch (e) { /* not here */ }
  }
  return { file: '', at: backupBlob ? at(backupBlob) : 0, prevAt: 0 };
}
function loadBackupFile() {
  var fs = require('fs');
  var list = backupFiles();
  for (var i = 0; i < list.length; i++) {
    try { return fs.readFileSync(list[i], 'utf8'); } catch (e) { /* not there */ }
  }
  return null;
}
function isBackup(text) {
  try {
    var o = JSON.parse(text);
    return !!(o && o.app === 'stremio7m' && o.data && typeof o.data === 'object');
  } catch (e) {
    return false;
  }
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

  // The app saves its backup here, and reads it back (this TV only).
  if (url.pathname === '/api/backup' && req.method === 'POST') {
    if (!isLocal(req)) return send(res, 403, { error: 'local only' });
    return readBody(req, function (body) {
      if (!isBackup(body)) return send(res, 400, { ok: false });
      backupBlob = body;
      var where = saveBackupFile(body);
      send(res, 200, { ok: true, onTv: !!where });
    }, BACKUP_MAX);
  }
  if (url.pathname === '/api/backup') {
    if (!isLocal(req)) return send(res, 403, { error: 'local only' });
    var b = backupBlob || loadBackupFile();
    return b ? send(res, 200, b) : send(res, 404, { error: 'no backup' });
  }
  if (url.pathname === '/api/backup-info') {
    if (!isLocal(req)) return send(res, 403, { error: 'local only' });
    return send(res, 200, backupInfo());
  }
  // The copy before the last one (in case the last save was a mistake).
  if (url.pathname === '/api/backup-prev') {
    if (!isLocal(req)) return send(res, 403, { error: 'local only' });
    var pv = null;
    backupFiles().some(function (f) { try { pv = require('fs').readFileSync(f + '.prev', 'utf8'); return true; } catch (e) { return false; } });
    return pv ? send(res, 200, pv) : send(res, 404, { error: 'none' });
  }
  // A backup sent from the phone, waiting for the app to take it.
  if (url.pathname === '/api/restore-data') {
    if (!isLocal(req)) return send(res, 403, { error: 'local only' });
    var r = restoreBlob;
    restoreBlob = null;
    return r ? send(res, 200, r) : send(res, 404, { error: 'nothing' });
  }

  // ---- Phone side ----
  if (url.pathname === '/backup' || url.pathname === '/backup.html') {
    return send(res, 200, typeof BACKUP_PAGE === 'string' ? BACKUP_PAGE : 'Backup page missing', 'text/html; charset=utf-8');
  }
  // The phone downloads the last backup as a file.
  if (url.pathname === '/api/backup-file') {
    if (q.pin !== PIN) return send(res, 401, { ok: false });
    var f = backupBlob || loadBackupFile();
    if (!f) return send(res, 404, { ok: false });
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Disposition': 'attachment; filename="stremio7m-backup.json"', 'Cache-Control': 'no-store' });
    return res.end(f);
  }
  // The phone sends a backup file back: the app is told and asks for it.
  if (url.pathname === '/api/restore' && req.method === 'POST') {
    if (q.pin !== PIN) return send(res, 401, { ok: false });
    return readBody(req, function (body) {
      if (!isBackup(body)) return send(res, 400, { ok: false });
      restoreBlob = body;
      push({ type: 'restore' });
      send(res, 200, { ok: true });
    }, BACKUP_MAX);
  }
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
