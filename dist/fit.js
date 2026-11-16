// Phones, tablets, PCs and Android TV: the app draws on a fixed 1920x1080 canvas (made for a TV);
// here the canvas is scaled to fit the window and centered. A Tizen/webOS TV already shows it 1:1.
(function () {
  if (/Tizen|Web0S|SMART-TV/i.test(navigator.userAgent || '')) return;
  var meta = document.querySelector('meta[name=viewport]');
  if (meta) meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
  function fit() {
    var w = window.innerWidth || 1920;
    var h = window.innerHeight || 1080;
    var s = Math.min(w / 1920, h / 1080);
    var b = document.body;
    b.style.position = 'absolute';
    b.style.transformOrigin = '0 0';
    b.style.webkitTransformOrigin = '0 0';
    b.style.transform = b.style.webkitTransform = 'scale(' + s + ')';
    b.style.left = Math.round((w - 1920 * s) / 2) + 'px';
    b.style.top = Math.round((h - 1080 * s) / 2) + 'px';
    document.documentElement.style.background = '#000';
  }
  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', function () { setTimeout(fit, 200); });
})();

// Android (Capacitor): the Back button/gesture acts like Esc in the app.
(function () {
  function key(code) {
    var e = document.createEvent('Event');
    e.initEvent('keydown', true, true);
    e.keyCode = e.which = code;
    document.dispatchEvent(e);
  }
  var tries = 0;
  var t = setInterval(function () {
    var cap = window.Capacitor;
    var app = cap && cap.Plugins && cap.Plugins.App;
    if (app && app.addListener) {
      clearInterval(t);
      app.addListener('backButton', function () {
        key(27);
      });
    } else if (++tries > 40) clearInterval(t);
  }, 250);
})();
