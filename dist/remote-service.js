var REMOTE_PAGE = "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover\">\n<meta name=\"theme-color\" content=\"#0d0b14\">\n<meta name=\"apple-mobile-web-app-capable\" content=\"yes\">\n<title>Stremio Kai remote</title>\n<style>\n  :root { --bg: #0d0b14; --card: #1b1826; --key: #262236; --text: #f2f0f8; --muted: #9a94ad; --accent: #7b5bf5; }\n  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }\n  html, body { margin: 0; background: var(--bg); color: var(--text); font: 16px/1.4 system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans Arabic\", sans-serif; }\n  body { min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: max(16px, env(safe-area-inset-top)) 16px max(24px, env(safe-area-inset-bottom)); }\n  header { width: 100%; max-width: 420px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }\n  .brand { font-size: 20px; } .brand b { color: #9d85ff; }\n  .status { font-size: 13px; color: var(--muted); }\n  .status.ok { color: #8fe3aa; } .status.bad { color: #ff8f8f; }\n  main { width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: 22px; }\n  button { font: inherit; color: var(--text); background: var(--key); border: 0; border-radius: 18px; cursor: pointer; touch-action: manipulation; user-select: none; -webkit-user-select: none; }\n  button:active { transform: scale(0.96); background: #332d47; }\n  .pad { position: relative; width: min(300px, 78vw); height: min(300px, 78vw); margin: 4px auto 0; border-radius: 50%; background: var(--card); }\n  .pad button { position: absolute; width: 33%; height: 33%; border-radius: 50%; background: transparent; font-size: 30px; color: #d8d2ea; }\n  .pad button:active { background: rgba(255,255,255,0.08); }\n  .pad .up { top: 2%; left: 33.5%; } .pad .down { bottom: 2%; left: 33.5%; }\n  .pad .left { left: 2%; top: 33.5%; } .pad .right { right: 2%; top: 33.5%; }\n  .pad .ok { left: 31%; top: 31%; width: 38%; height: 38%; background: var(--accent); color: #fff; font-size: 20px; font-weight: 700; }\n  .pad .ok:active { background: #6847e8; }\n  .row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }\n  .row.two { grid-template-columns: 1fr 1fr; }\n  .row button { height: 58px; font-size: 22px; }\n  .row button small { display: block; font-size: 11px; color: var(--muted); margin-top: 2px; }\n  .type { display: flex; gap: 10px; }\n  .type input { flex: 1; min-width: 0; font: inherit; color: var(--text); background: var(--card); border: 2px solid #2d2840; border-radius: 16px; padding: 14px 16px; outline: none; }\n  .type input:focus { border-color: var(--accent); }\n  .type button { padding: 0 20px; background: var(--accent); font-weight: 700; }\n  .hint { color: var(--muted); font-size: 13px; text-align: center; margin: -10px 0 0; }\n  .tabs { width: 100%; max-width: 420px; display: flex; gap: 8px; margin-bottom: 18px; }\n  .tabs button { flex: 1; height: 42px; border-radius: 14px; font-weight: 600; }\n  .tabs button.on { background: var(--accent); }\n  body.locked .tabs { display: none; }\n  body.tab-browse main { display: none; }\n  .browse { width: 100%; max-width: 420px; }\n  .browse[hidden] { display: none; }\n  .browse h2 { font-size: 16px; margin: 6px 0 10px; }\n  .browse .strip { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 14px; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }\n  .browse .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }\n  .browse .grid .item { max-width: none; }\n  .browse .item { flex: 0 0 31%; max-width: 31%; min-width: 0; overflow: hidden; scroll-snap-align: start; background: none; padding: 0; border-radius: 12px; text-align: left; color: var(--text); }\n  .browse .item img, .browse .item .ph { width: 100%; aspect-ratio: 2 / 3; object-fit: cover; border-radius: 12px; background: var(--card); display: block; }\n  .browse .item .t { font-size: 12px; margin-top: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n  .browse .item .s { font-size: 11px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n  .browse .item .bar { height: 3px; background: #2d2840; border-radius: 2px; margin-top: 4px; }\n  .browse .item .bar i { display: block; height: 100%; background: var(--accent); border-radius: 2px; }\n  .browse .empty { color: var(--muted); font-size: 14px; text-align: center; padding: 40px 0; }\n  .now { display: flex; gap: 14px; background: var(--card); border-radius: 18px; padding: 12px; }\n  .now[hidden] { display: none; }\n  .now img { width: 74px; height: 110px; object-fit: cover; border-radius: 10px; background: #2d2840; flex-shrink: 0; }\n  .np-info { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; }\n  .np-title { font-weight: 700; font-size: 17px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n  .np-ep { color: var(--muted); font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-height: 17px; }\n  .np-info input[type=range] { width: 100%; margin: 10px 0 4px; accent-color: var(--accent); }\n  .np-times { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }\n  .np-times button { width: 46px; height: 34px; border-radius: 12px; font-size: 16px; }\n  .type .mic { padding: 0 16px; background: var(--key); font-size: 22px; }\n  .type .mic.on { background: #e5484d; }\n  .pin { display: none; flex-direction: column; gap: 14px; align-items: center; text-align: center; padding-top: 30px; }\n  .pin input { width: 200px; text-align: center; font-size: 34px; letter-spacing: 12px; color: var(--text); background: var(--card); border: 2px solid #2d2840; border-radius: 16px; padding: 12px; outline: none; }\n  .pin button { padding: 14px 40px; background: var(--accent); font-weight: 700; }\n  body.locked main { display: none; } body.locked .pin { display: flex; }\n</style>\n</head>\n<body class=\"locked\">\n<header>\n  <div class=\"brand\">Stremio <b>Kai</b> remote</div>\n  <div class=\"status\" id=\"status\">…</div>\n</header>\n\n<section class=\"pin\">\n  <div>Enter the PIN shown on the TV<br><small style=\"color:var(--muted)\">Settings → Phone remote</small></div>\n  <input id=\"pin\" inputmode=\"numeric\" maxlength=\"4\" autocomplete=\"off\" placeholder=\"····\">\n  <button id=\"pinGo\">Connect</button>\n</section>\n\n<nav class=\"tabs\" id=\"tabs\">\n  <button class=\"on\" data-tab=\"remote\">Remote</button>\n  <button data-tab=\"browse\">Browse</button>\n</nav>\n\n<section class=\"browse\" id=\"browse\" hidden></section>\n\n<main>\n  <section class=\"now\" id=\"now\" hidden>\n    <img id=\"npPoster\" alt=\"\">\n    <div class=\"np-info\">\n      <div class=\"np-title\" id=\"npTitle\"></div>\n      <div class=\"np-ep\" id=\"npEp\"></div>\n      <input type=\"range\" id=\"npSeek\" min=\"0\" max=\"100\" value=\"0\">\n      <div class=\"np-times\"><span id=\"npPos\">0:00</span><button id=\"npPlay\" data-key=\"10252\">⏯</button><span id=\"npDur\">0:00</span></div>\n    </div>\n  </section>\n  <div class=\"pad\">\n    <button class=\"up\" data-key=\"38\" aria-label=\"Up\">▲</button>\n    <button class=\"left\" data-key=\"37\" aria-label=\"Left\">◀</button>\n    <button class=\"ok\" data-key=\"13\">OK</button>\n    <button class=\"right\" data-key=\"39\" aria-label=\"Right\">▶</button>\n    <button class=\"down\" data-key=\"40\" aria-label=\"Down\">▼</button>\n  </div>\n  <div class=\"row\">\n    <button data-key=\"10009\">↩<small>Back</small></button>\n    <button data-key=\"10252\">⏯<small>Play / pause</small></button>\n    <button data-key=\"413\">⏹<small>Stop</small></button>\n  </div>\n  <div class=\"row two\">\n    <button data-key=\"412\">⏪<small>Rewind</small></button>\n    <button data-key=\"417\">⏩<small>Forward</small></button>\n  </div>\n  <div class=\"row\">\n    <button data-vol=\"down\">🔉<small>Volume −</small></button>\n    <button data-vol=\"mute\">🔇<small>Mute</small></button>\n    <button data-vol=\"up\">🔊<small>Volume +</small></button>\n  </div>\n  <div class=\"row two\">\n    <button data-key=\"428\">⏪ Aa<small>Subtitles earlier</small></button>\n    <button data-key=\"427\">Aa ⏩<small>Subtitles later</small></button>\n  </div>\n  <form class=\"type\" id=\"searchForm\">\n    <input id=\"query\" type=\"search\" placeholder=\"Search on the TV…\" autocomplete=\"off\" enterkeyhint=\"search\">\n    <button type=\"button\" id=\"mic\" class=\"mic\" aria-label=\"Voice search\" hidden>🎤</button>\n    <button type=\"submit\">Search</button>\n  </form>\n  <p class=\"hint\" id=\"voiceHint\">Speak your search: tap 🎤 on your phone's keyboard, or the mic button.</p>\n  <form class=\"type\" id=\"typeForm\">\n    <input id=\"text\" placeholder=\"Type on the TV…\" autocomplete=\"off\" enterkeyhint=\"send\">\n    <button type=\"submit\">Send</button>\n  </form>\n  <p class=\"hint\">Typing fills the selected text box on the TV (search, sign-in…).</p>\n</main>\n\n<script>\n(function () {\n  var pin = '';\n  var statusEl = document.getElementById('status');\n  function status(text, cls) { statusEl.textContent = text; statusEl.className = 'status ' + (cls || ''); }\n\n  // The QR code on the TV opens this page with #pin=1234, so scanning connects straight away.\n  var m = location.hash.match(/pin=(\\d{4})/);\n  try { pin = (m && m[1]) || localStorage.getItem('kaiRemotePin') || ''; } catch (e) { pin = (m && m[1]) || ''; }\n  if (m) history.replaceState(null, '', location.pathname);\n\n  function check(p) {\n    return fetch('/api/check?pin=' + encodeURIComponent(p)).then(function (r) { return r.ok; }).catch(function () { return false; });\n  }\n  function unlock(p) {\n    return check(p).then(function (ok) {\n      if (!ok) { status('Wrong PIN', 'bad'); document.body.classList.add('locked'); return false; }\n      pin = p;\n      try { localStorage.setItem('kaiRemotePin', p); } catch (e) {}\n      document.body.classList.remove('locked');\n      status('Connected', 'ok');\n      refreshNow();\n      return true;\n    });\n  }\n  document.getElementById('pinGo').onclick = function () { unlock(document.getElementById('pin').value.trim()); };\n  document.getElementById('pin').onkeydown = function (e) { if (e.key === 'Enter') unlock(this.value.trim()); };\n\n  function post(url, body) {\n    return fetch(url + (url.indexOf('?') < 0 ? '?' : '&') + 'pin=' + encodeURIComponent(pin), { method: 'POST', body: body || '' })\n      .then(function (r) {\n        if (r.status === 401) { status('PIN changed: enter it again', 'bad'); document.body.classList.add('locked'); }\n        else status('Connected', 'ok');\n      })\n      .catch(function () { status('TV not reachable', 'bad'); });\n  }\n\n  // Holding an arrow repeats it, like the real remote.\n  Array.prototype.forEach.call(document.querySelectorAll('[data-key]'), function (b) {\n    var code = b.getAttribute('data-key');\n    var repeat = null, delay = null;\n    var arrow = /^3[7-9]$|^40$/.test(code);\n    function stop() { clearTimeout(delay); clearInterval(repeat); delay = repeat = null; }\n    b.addEventListener('pointerdown', function (e) {\n      e.preventDefault();\n      if (navigator.vibrate) navigator.vibrate(10);\n      post('/api/key?code=' + code);\n      if (arrow) delay = setTimeout(function () { repeat = setInterval(function () { post('/api/key?code=' + code); }, 140); }, 400);\n    });\n    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { b.addEventListener(ev, stop); });\n  });\n\n  document.getElementById('typeForm').onsubmit = function (e) {\n    e.preventDefault();\n    var input = document.getElementById('text');\n    if (!input.value) return;\n    post('/api/text?submit=1', input.value).then(function () { input.value = ''; });\n  };\n\n  // ---- Browse: Continue watching, New episodes and Library from the TV; tap to open on the TV ----\n  var browseEl = document.getElementById('browse');\n  Array.prototype.forEach.call(document.querySelectorAll('[data-tab]'), function (b) {\n    b.onclick = function () {\n      var browse = b.getAttribute('data-tab') === 'browse';\n      document.body.classList.toggle('tab-browse', browse);\n      browseEl.hidden = !browse;\n      Array.prototype.forEach.call(document.querySelectorAll('[data-tab]'), function (x) { x.classList.toggle('on', x === b); });\n      if (browse) loadBrowse();\n    };\n  });\n  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }\n  function item(it) {\n    var b = el('button', 'item');\n    if (it.poster) { var im = el('img'); im.loading = 'lazy'; im.alt = ''; im.src = it.poster; b.appendChild(im); } else b.appendChild(el('div', 'ph'));\n    b.appendChild(el('div', 't', it.name));\n    if (it.sub) b.appendChild(el('div', 's', it.sub));\n    if (it.progress) { var bar = el('div', 'bar'), fill = el('i'); fill.style.width = Math.round(it.progress * 100) + '%'; bar.appendChild(fill); b.appendChild(bar); }\n    b.onclick = function () {\n      if (navigator.vibrate) navigator.vibrate(15);\n      post('/api/open?type=' + encodeURIComponent(it.type) + '&id=' + encodeURIComponent(it.id) + (it.video ? '&video=' + encodeURIComponent(it.video) : ''))\n        .then(function () { status('Opening on the TV…', 'ok'); });\n    };\n    return b;\n  }\n  function loadBrowse() {\n    fetch('/api/browse?pin=' + encodeURIComponent(pin)).then(function (r) { return r.json(); }).then(function (d) {\n      browseEl.innerHTML = '';\n      var labels = d.labels || {};\n      var any = false;\n      [['continueWatching', 'strip'], ['newEpisodes', 'strip'], ['library', 'grid']].forEach(function (sec) {\n        var list = d[sec[0]] || [];\n        if (!list.length) return;\n        any = true;\n        browseEl.appendChild(el('h2', '', labels[sec[0]] || sec[0]));\n        var box = el('div', sec[1]);\n        list.forEach(function (it) { box.appendChild(item(it)); });\n        browseEl.appendChild(box);\n      });\n      if (!any) browseEl.appendChild(el('div', 'empty', 'Nothing yet: open the app on the TV and sign in to your Stremio account.'));\n    }).catch(function () { status('TV not reachable', 'bad'); });\n  }\n\n  // Volume: the TV's own volume, through the TV.\n  Array.prototype.forEach.call(document.querySelectorAll('[data-vol]'), function (b) {\n    b.addEventListener('click', function () {\n      if (navigator.vibrate) navigator.vibrate(10);\n      fetch('/api/volume?dir=' + b.getAttribute('data-vol') + '&pin=' + encodeURIComponent(pin), { method: 'POST' })\n        .then(function (r) { return r.json(); })\n        .then(function (r) { if (r.ok) status('Connected', 'ok'); else status(/allow/.test(r.error || '') ? 'Allow the remote on the TV' : 'Volume not available', 'bad'); })\n        .catch(function () { status('TV not reachable', 'bad'); });\n    });\n  });\n\n  // Now playing: poster, title and a progress bar you can drag to jump.\n  var nowEl = document.getElementById('now'), seek = document.getElementById('npSeek'), dragging = false, lastPoster = '';\n  function fmt(sec) {\n    sec = Math.max(0, Math.floor(sec)); var h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60;\n    return (h ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + (s < 10 ? '0' : '') + s;\n  }\n  function refreshNow() {\n    if (!pin || document.body.classList.contains('locked') || document.hidden) return;\n    fetch('/api/state?pin=' + encodeURIComponent(pin)).then(function (r) { return r.json(); }).then(function (r) {\n      var p = r.playing;\n      nowEl.hidden = !p;\n      if (!p) return;\n      document.getElementById('npTitle').textContent = p.title;\n      document.getElementById('npEp').textContent = p.episode || '';\n      if (p.poster && p.poster !== lastPoster) { document.getElementById('npPoster').src = lastPoster = p.poster; }\n      document.getElementById('npDur').textContent = fmt(p.duration);\n      document.getElementById('npPlay').textContent = p.paused ? '▶' : '⏸';\n      if (!dragging && p.duration) {\n        // The TV reports every few seconds; move the bar along in between.\n        var pos = p.paused ? p.position : p.position + (Date.now() - r.at) / 1000;\n        seek.max = p.duration; seek.value = Math.min(pos, p.duration);\n        document.getElementById('npPos').textContent = fmt(pos);\n      }\n    }).catch(function () {});\n  }\n  seek.addEventListener('input', function () { dragging = true; document.getElementById('npPos').textContent = fmt(seek.value); });\n  seek.addEventListener('change', function () {\n    dragging = false;\n    post('/api/seek?to=' + Math.floor(seek.value));\n  });\n  setInterval(refreshNow, 2000);\n\n  // Search on the TV from anywhere in the app (typed, keyboard dictation, or the mic button).\n  var query = document.getElementById('query');\n  function search(q) {\n    q = (q || '').trim();\n    if (q.length < 2) return;\n    post('/api/search', q).then(function () { query.value = ''; status('Searching on the TV…', 'ok'); });\n  }\n  document.getElementById('searchForm').onsubmit = function (e) { e.preventDefault(); search(query.value); };\n\n  // The browser's speech recognition only runs on secure (https) pages; on the TV's local\n  // address the keyboard's own dictation button does the same job, so the hint stays.\n  var Rec = window.SpeechRecognition || window.webkitSpeechRecognition;\n  if (!(Rec && window.isSecureContext)) document.getElementById('voiceHint').textContent = \"Speak your search: tap 🎤 on your phone's keyboard, then Search.\";\n  if (Rec && window.isSecureContext) {\n    var mic = document.getElementById('mic');\n    mic.hidden = false;\n    mic.onclick = function () {\n      var r = new Rec();\n      r.lang = navigator.language || 'en-US';\n      r.interimResults = false;\n      mic.classList.add('on');\n      r.onresult = function (e) { var q = e.results[0][0].transcript; query.value = q; search(q); };\n      r.onend = function () { mic.classList.remove('on'); };\n      r.onerror = function () { mic.classList.remove('on'); status('Mic not available: use the keyboard 🎤', 'bad'); };\n      r.start();\n    };\n  }\n\n  if (pin) unlock(pin); else status('Locked');\n})();\n</script>\n</body>\n</html>\n";
var SETUP_PAGE = "<!DOCTYPE html>\n<html lang=\"ar\" dir=\"rtl\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>Stremio Kai · المفاتيح</title>\n<style>\n  body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Tahoma, sans-serif; background: #0d0b14; color: #fff; }\n  main { max-width: 560px; margin: 0 auto; padding: 18px 16px 60px; }\n  h1 { font-size: 22px; margin: 6px 0 4px; }\n  p.lead { color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.6; margin: 0 0 14px; }\n  section { background: rgba(255,255,255,0.06); border-radius: 14px; padding: 14px; margin-bottom: 12px; }\n  h2 { font-size: 17px; margin: 0 0 4px; }\n  .help { font-size: 13px; color: rgba(255,255,255,0.6); margin: 0 0 10px; line-height: 1.6; }\n  .help a { color: #c9bbff; }\n  label { display: block; font-size: 13px; color: rgba(255,255,255,0.75); margin: 8px 0 4px; }\n  input { width: 100%; box-sizing: border-box; padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.18); background: #17131f; color: #fff; font-size: 15px; direction: ltr; text-align: left; }\n  code { background: rgba(255,255,255,0.1); padding: 1px 6px; border-radius: 6px; direction: ltr; display: inline-block; }\n  button { width: 100%; padding: 15px; border: 0; border-radius: 12px; background: #7b5bf5; color: #fff; font-size: 17px; font-weight: 700; position: sticky; bottom: 12px; }\n  #msg { text-align: center; margin: 12px 0; font-size: 15px; min-height: 20px; }\n  .ok { color: #6ee7a0; } .err { color: #ff8a8a; }\n  #pinbox { display: none; }\n</style>\n</head>\n<body>\n<main>\n  <h1>مفاتيح Stremio Kai</h1>\n  <p class=\"lead\">اللي تكتبه هنا يروح للتلفزيون مباشرة عن طريق شبكة البيت، ويبقى في التلفزيون بس. الخانات الفاضية ما تغيّر شي.</p>\n\n  <section id=\"pinbox\">\n    <h2>الرقم السري</h2>\n    <p class=\"help\">اكتب الرقم السري اللي يطلع في التلفزيون (الإعدادات ← التكاملات).</p>\n    <input id=\"pin\" inputmode=\"numeric\" maxlength=\"4\" placeholder=\"1234\">\n  </section>\n\n  <section>\n    <h2>Trakt</h2>\n    <p class=\"help\">افتح <a href=\"https://developer.trakt.tv/apps\" target=\"_blank\" rel=\"noopener\">developer.trakt.tv/apps</a>، اضغط على تطبيقك (أو Create app وحط في Redirect URIs <code>urn:ietf:wg:oauth:2.0:oob</code>)، وانسخ <b>Client ID</b>. التطبيقات الجديدة ما فيها Client Secret، وهذا عادي.</p>\n    <label>Client ID</label><input data-k=\"traktClientId\" autocomplete=\"off\">\n    <label>Client Secret (بس إذا تطبيقك قديم وفيه واحد)</label><input data-k=\"traktClientSecret\" autocomplete=\"off\">\n  </section>\n\n  <section>\n    <h2>Simkl</h2>\n    <p class=\"help\">افتح <a href=\"https://simkl.com/settings/developer/new/\" target=\"_blank\" rel=\"noopener\">simkl.com/settings/developer</a>، سوّ تطبيق، وحط في Redirect URI <code>urn:ietf:wg:oauth:2.0:oob</code>، وانسخ Client ID.</p>\n    <label>Client ID</label><input data-k=\"simklClientId\" autocomplete=\"off\">\n  </section>\n\n  <section>\n    <h2>البيانات والتقييمات</h2>\n    <label>TMDB API key (v3) — <a href=\"https://www.themoviedb.org/settings/api\" target=\"_blank\" rel=\"noopener\">themoviedb.org</a></label><input data-k=\"tmdbKey\" autocomplete=\"off\">\n    <label>MDBList API key — <a href=\"https://mdblist.com/preferences/\" target=\"_blank\" rel=\"noopener\">mdblist.com</a></label><input data-k=\"mdblistKey\" autocomplete=\"off\">\n    <label>RPDB key — <a href=\"https://ratingposterdb.com/\" target=\"_blank\" rel=\"noopener\">ratingposterdb.com</a></label><input data-k=\"rpdbKey\" autocomplete=\"off\">\n  </section>\n\n  <section>\n    <h2>الترجمة والتخطي</h2>\n    <label>SubDL API key — <a href=\"https://subdl.com/panel/api\" target=\"_blank\" rel=\"noopener\">subdl.com</a></label><input data-k=\"subdlKey\" autocomplete=\"off\">\n    <label>Anime-Skip Client ID — <a href=\"https://anime-skip.com/\" target=\"_blank\" rel=\"noopener\">anime-skip.com</a></label><input data-k=\"animeSkipClientId\" autocomplete=\"off\">\n  </section>\n\n  <section>\n    <h2>Debrid</h2>\n    <label>Real-Debrid — <a href=\"https://real-debrid.com/apitoken\" target=\"_blank\" rel=\"noopener\">real-debrid.com/apitoken</a></label><input data-k=\"realDebridKey\" autocomplete=\"off\">\n    <label>TorBox — <a href=\"https://torbox.app/settings\" target=\"_blank\" rel=\"noopener\">torbox.app/settings</a></label><input data-k=\"torboxKey\" autocomplete=\"off\">\n    <label>Premiumize — <a href=\"https://www.premiumize.me/account\" target=\"_blank\" rel=\"noopener\">premiumize.me/account</a></label><input data-k=\"premiumizeKey\" autocomplete=\"off\">\n  </section>\n\n  <div id=\"msg\"></div>\n  <button id=\"save\">إرسال للتلفزيون</button>\n</main>\n<script>\n(function () {\n  var pin = (location.hash.match(/pin=(\\d{4})/) || [])[1] || '';\n  var pinBox = document.getElementById('pinbox');\n  var pinInput = document.getElementById('pin');\n  if (!pin) pinBox.style.display = 'block';\n  var msg = document.getElementById('msg');\n  function say(text, cls) { msg.textContent = text; msg.className = cls || ''; }\n  document.getElementById('save').onclick = function () {\n    var p = pin || pinInput.value.trim();\n    if (!/^\\d{4}$/.test(p)) return say('اكتب الرقم السري (4 أرقام)', 'err');\n    var keys = {};\n    var n = 0;\n    var inputs = document.querySelectorAll('input[data-k]');\n    for (var i = 0; i < inputs.length; i++) {\n      var v = inputs[i].value.trim();\n      if (v) { keys[inputs[i].getAttribute('data-k')] = v; n++; }\n    }\n    if (!n) return say('ما كتبت أي مفتاح', 'err');\n    say('جاري الإرسال...');\n    var x = new XMLHttpRequest();\n    x.open('POST', '/api/keys?pin=' + encodeURIComponent(p));\n    x.setRequestHeader('Content-Type', 'application/json');\n    x.onload = function () {\n      if (x.status === 200) {\n        say('وصلت للتلفزيون ✓ (' + n + ')', 'ok');\n        for (var j = 0; j < inputs.length; j++) inputs[j].value = '';\n      } else if (x.status === 401) say('الرقم السري غلط', 'err');\n      else say('ما وصلت، جرّب مرة ثانية', 'err');\n    };\n    x.onerror = function () { say('ما قدرت أوصل للتلفزيون. تأكد إنك على نفس الواي فاي', 'err'); };\n    x.send(JSON.stringify(keys));\n  };\n})();\n</script>\n</body>\n</html>\n";
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
