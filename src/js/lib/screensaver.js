// Screensaver (Settings → Appearance): after N idle minutes outside the player, film backdrops
// fade in and out with the title and a clock. Any key brings the app back (the key is swallowed).
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
  return +store.settings().screensaver || 0;
}

function playing() {
  return !!document.querySelector('.view.player:not(.hidden)') || document.documentElement.classList.contains('av-playing');
}

function show() {
  if (overlay) return;
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
    const m = minutes();
    if (!m || overlay) return;
    if (playing()) {
      lastKey = Date.now();
      return;
    }
    if (Date.now() - lastKey >= m * 60000) show();
  }, 15000);
}
