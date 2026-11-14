// Screensaver (Settings → Appearance): after N idle minutes outside the player, film backdrops
// fade in and out with the title and a clock. With OLED protection on: pure black screen with
// a shifting dim clock to prevent burn-in on OLED TVs, even during video pause.
import { h, clear } from './dom.js';
import * as store from './store.js';
import * as hero from '../api/hero.js';
import { timeHM } from '../ui.js';

const SLIDE_MS = 12000;
let lastKey = Date.now();
let overlay = null;
let slideTimer = null;
let items = [];
let index = 0;

function minutes() {
  const m = +store.settings().screensaver;
  if (!m && store.settings().oledProtection) return 5; // default 5 min for OLED if off
  return m || 0;
}

function playing() {
  return !!document.querySelector('.view.player:not(.hidden)') || document.documentElement.classList.contains('av-playing');
}

function isVideoPaused() {
  const v = document.querySelector('video');
  if (!v) return false;
  return v.paused || !document.documentElement.classList.contains('av-playing');
}

function show(forceOled) {
  if (overlay) return;
  const oledMode = forceOled || !!store.settings().oledProtection;
  if (oledMode) {
    const clock = h('div.ss-clock', { style: { position: 'absolute', color: 'rgba(255,255,255,0.4)', fontSize: '38px', fontWeight: '600', transition: 'top 0.5s, left 0.5s' } });
    overlay = h('div.screensaver.oled-ss', { style: { position: 'fixed', left: 0, top: 0, width: '100%', height: '100%', background: '#000000', zIndex: 99999 } }, clock);
    document.body.appendChild(overlay);
    const shift = () => {
      clock.textContent = timeHM(new Date());
      const top = Math.floor(15 + Math.random() * 65);
      const left = Math.floor(15 + Math.random() * 65);
      clock.style.top = top + '%';
      clock.style.left = left + '%';
    };
    shift();
    slideTimer = setInterval(shift, 60000);
    return;
  }

  const img = h('div.ss-bg');
  const title = h('div.ss-title');
  const clock = h('div.ss-clock');
  overlay = h('div.screensaver', null, [img, h('div.ss-shade'), h('div.ss-info', null, [clock, title])]);
  document.body.appendChild(overlay);
  const next = () => {
    clock.textContent = timeHM(new Date());
    const it = items.length ? items[index++ % items.length] : null;
    if (it) {
      img.classList.remove('show');
      setTimeout(() => {
        if (!overlay) return;
        img.style.backgroundImage = 'url("' + it.background + '")';
        title.textContent = it.name || '';
        img.classList.add('show');
      }, 900);
    }
  };
  const ready = items.length ? Promise.resolve() : hero.load().then((l) => (items = (l || []).filter((x) => x.background))).catch(() => {});
  ready.then(() => {
    if (!overlay) return;
    next();
    slideTimer = setInterval(next, SLIDE_MS);
  });
}

function hide() {
  clearInterval(slideTimer);
  slideTimer = null;
  if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
  if (overlay) clear(overlay);
  overlay = null;
}

export function init() {
  // Capture phase: runs before the app's own key handling.
  document.addEventListener(
    'keydown',
    (e) => {
      lastKey = Date.now();
      if (overlay) {
        hide();
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );
  ['mousemove', 'click'].forEach((ev) => document.addEventListener(ev, () => {
    lastKey = Date.now();
    if (overlay) hide();
  }, true));

  setInterval(() => {
    if (overlay) return;
    const oled = !!store.settings().oledProtection;
    const idleMs = Date.now() - lastKey;

    // OLED protection during video pause (after 90s)
    if (oled && playing() && isVideoPaused() && idleMs >= 90000) {
      show(true);
      return;
    }

    const m = minutes();
    if (!m) return;
    if (playing()) {
      if (!oled || !isVideoPaused()) lastKey = Date.now();
      return;
    }
    if (idleMs >= m * 60000) show();
  }, 15000);
}
