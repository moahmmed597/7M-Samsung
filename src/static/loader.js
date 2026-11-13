// Starts the newest build. TizenBrew serves this module from jsDelivr's copy of the repository,
// which can lag GitHub by up to a day (and clearing it is rate-limited). So this asks GitHub for
// the latest commit and loads app.js/app.css pinned to it: a pinned jsDelivr copy is never stale.
// Offline, slow or failing: the copy next to this file. Plain ES5: it runs before any polyfill.
(function () {
  var REPO = 'moahmmed597/7M-Samsung';
  var started = false;

  function start(base) {
    if (started) return;
    started = true;
    window.__KAI_BASE__ = base;
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = base + 'app.css';
    document.head.appendChild(css);
    var js = document.createElement('script');
    js.src = base + 'app.js';
    if (base) {
      js.onerror = function () {
        document.head.removeChild(css);
        document.body.removeChild(js);
        started = false;
        start('');
      };
    }
    document.body.appendChild(js);
  }

  // Installed as a Tizen app (.wgt from TizenBrew Installer): start its own background service,
  // which serves the phone remote and fetches for the app (TizenBrew does this for modules).
  try {
    if (window.tizen && window.tizen.application && location.protocol !== 'http:' && location.protocol !== 'https:') {
      var pkgId = window.tizen.application.getCurrentApplication().appInfo.packageId;
      window.tizen.application.launchAppControl(
        new window.tizen.ApplicationControl('http://tizen.org/appcontrol/operation/service'),
        pkgId + '.Service',
        function () {},
        function () {}
      );
    }
  } catch (e) {
    /* not an installed app */
  }

  // Samsung's webapis (AVPlay: the player that can switch audio tracks). A packaged app gets it
  // from $WEBAPIS; under TizenBrew the page comes from 127.0.0.1, so the TV's own copy is tried
  // too. Whatever happens, the app starts (without AVPlay it uses the browser's <video>).
  var webapisDone = !/Tizen/i.test(navigator.userAgent || '') || !!window.webapis;
  var startArgs = null;
  function loadWebapis(list) {
    if (window.webapis || !list.length) {
      webapisDone = true;
      if (startArgs !== null) start(startArgs);
      return;
    }
    var s = document.createElement('script');
    var next = function () {
      if (s.parentNode) s.parentNode.removeChild(s);
      loadWebapis(window.webapis ? [] : list.slice(1));
    };
    var timer = setTimeout(next, 1500);
    s.onload = s.onerror = function () {
      clearTimeout(timer);
      if (window.webapis) {
        webapisDone = true;
        if (startArgs !== null) start(startArgs);
      } else next();
    };
    s.src = list[0];
    document.head.appendChild(s);
  }
  if (!webapisDone) loadWebapis(['$WEBAPIS/webapis/webapis.js', 'file:///usr/share/webapis/webapis/webapis.js', 'file:///usr/bin/../share/webapis/webapis/webapis.js']);
  var realStart = start;
  start = function (base) {
    if (!webapisDone) {
      startArgs = base;
      return;
    }
    realStart(base);
  };

  // Testing on the PC (npm run serve → http://localhost:5173): use this build, not GitHub's.
  // (TizenBrew itself serves from 127.0.0.1:8081, so it still gets the newest build.)
  if (location.hostname === 'localhost') {
    start('');
    return;
  }

  var x = new XMLHttpRequest();
  x.open('GET', 'https://api.github.com/repos/' + REPO + '/commits/main');
  x.setRequestHeader('Accept', 'application/vnd.github.sha');
  x.timeout = 4000;
  x.onload = function () {
    var sha = String(x.responseText || '').replace(/\s/g, '');
    start(x.status === 200 && /^[0-9a-f]{40}$/.test(sha) ? 'https://cdn.jsdelivr.net/gh/' + REPO + '@' + sha + '/dist/' : '');
  };
  x.onerror = x.ontimeout = function () {
    start('');
  };
  x.send();
})();
