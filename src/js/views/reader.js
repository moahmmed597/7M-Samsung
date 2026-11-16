// Reader for manga and webtoons, made for the TV remote.
//   Left/Right: turn the page (Right = previous for right-to-left manga). Up/Down: pan a tall page, or turn.
//   Red: zoom 100% → 150% → 200% (arrows then pan). Green: fit the screen ↔ fit the width (webtoons).
//   Yellow / Blue (or Channel up/down): next / previous chapter. Back: reset the zoom, then close.
// Memory: one <img> on screen plus one preloaded page; everything else is dropped at once.
import { h } from '../lib/dom.js';
import { KEY } from '../lib/nav.js';
import * as router from '../router.js';
import * as store from '../lib/store.js';
import * as md from '../api/mangadex.js';
import { toast } from '../ui.js';
import { t } from '../lib/i18n.js';

const W = 1920;
const H = 1080;
const PAN = 300;
const ZOOMS = [1, 1.5, 2];

// opts: { key, title, chapters, index, startPage, rtl }
export function openReader(opts) {
  router.push(ReaderView(opts));
}

function ReaderView(opts) {
  let ci = opts.index;
  let pages = [];
  let pi = 0;
  let mode = store.settings().readerMode === 'width' ? 'width' : 'fit';
  let zi = 0; // index in ZOOMS
  let px = 0;
  let py = 0;
  let nat = { w: 0, h: 0 };
  let pre = null;
  let hudTimer = null;
  let token = 0;
  let alive = true;
  let retried = false;

  const img = h('img.rd-img', { alt: '' });
  const hud = h('div.rd-hud');
  const msg = h('div.rd-msg');
  const el = h('div.view.reader', null, [img, hud, msg]);

  const chapter = () => opts.chapters[ci];
  const size = () => {
    const fit = mode === 'fit' ? Math.min(W / nat.w, H / nat.h) : W / nat.w;
    const s = fit * ZOOMS[zi];
    return { s: s, w: nat.w * s, h: nat.h * s };
  };

  function say(text) {
    msg.textContent = text || '';
    msg.style.display = text ? '' : 'none';
  }

  function showHud(extra) {
    const c = chapter();
    hud.textContent = (opts.title ? opts.title + ' · ' : '') + t('Cap. {n}', { n: c && c.chapter !== null && c.chapter !== undefined ? c.chapter : ci + 1 }) + ' · ' + (pi + 1) + ' / ' + pages.length + (extra ? ' · ' + extra : '');
    hud.classList.add('show');
    clearTimeout(hudTimer);
    hudTimer = setTimeout(() => hud.classList.remove('show'), 3000);
  }

  function apply() {
    const z = size();
    px = z.w <= W ? (W - z.w) / 2 : Math.max(W - z.w, Math.min(0, px));
    py = z.h <= H ? (H - z.h) / 2 : Math.max(H - z.h, Math.min(0, py));
    img.style.width = Math.round(z.w) + 'px';
    img.style.height = Math.round(z.h) + 'px';
    img.style.webkitTransform = img.style.transform = 'translate(' + Math.round(px) + 'px,' + Math.round(py) + 'px)';
  }

  // anchor: where a tall page starts. Right-to-left manga starts a zoomed page on its right side.
  function layout(anchor) {
    const z = size();
    px = opts.rtl ? W - z.w : 0;
    py = anchor === 'bottom' ? H - z.h : 0;
    apply();
  }

  function save() {
    if (!opts.key || !chapter()) return;
    const all = store.get('readProgress', {}) || {};
    all[opts.key] = { chapterId: chapter().id, chapter: chapter().chapter, page: pi, title: opts.title, poster: opts.poster, kind: opts.kind, ref: opts.ref, at: Date.now() };
    const keys = Object.keys(all);
    if (keys.length > 200) delete all[keys[0]];
    store.set('readProgress', all);
  }

  function showPage(anchor) {
    if (!pages.length) return;
    retried = false;
    const my = ++token;
    img.style.visibility = 'hidden';
    img.onload = () => {
      if (my !== token || !alive) return;
      nat = { w: img.naturalWidth || 1, h: img.naturalHeight || 1 };
      layout(anchor);
      img.style.visibility = '';
      say('');
      showHud();
      save();
      // Preload only the next page; the old one is released.
      pre = null;
      if (pi + 1 < pages.length) {
        pre = new Image();
        pre.src = pages[pi + 1];
      }
    };
    img.onerror = () => {
      if (my !== token || !alive) return;
      if (!retried) {
        retried = true;
        img.src = pages[pi] + (pages[pi].indexOf('?') < 0 ? '?r=1' : '&r=1');
        return;
      }
      say(t('Não foi possível carregar esta página. Aperte para o lado para continuar.'));
    };
    say(t('Carregando...'));
    img.src = pages[pi];
  }

  function loadChapter(i, start) {
    const my = ++token;
    ci = i;
    pages = [];
    img.removeAttribute('src');
    say(t('Carregando...'));
    (opts.pagesFn || md.pages)(chapter().id)
      .then((list) => {
        if (my !== token || !alive) return;
        if (!list.length) return say(t('Este capítulo não tem páginas.'));
        pages = list;
        pi = start === 'last' ? list.length - 1 : Math.max(0, Math.min(start || 0, list.length - 1));
        showPage(start === 'last' ? 'bottom' : 'top');
      })
      .catch(() => alive && say(t('Não foi possível abrir este capítulo agora.')));
  }

  function chapterStep(d) {
    const n = ci + d;
    if (n < 0 || n >= opts.chapters.length) return toast(d > 0 ? t('Este é o último capítulo.') : t('Este é o primeiro capítulo.'));
    zi = 0;
    loadChapter(n, d > 0 ? 0 : 'last');
  }

  // dir: +1 next page in reading order, -1 previous.
  function turn(dir) {
    if (dir > 0) {
      if (pi + 1 < pages.length) {
        pi++;
        zi = 0;
        showPage('top');
      } else chapterStep(1);
    } else if (pi > 0) {
      pi--;
      zi = 0;
      showPage('bottom');
    } else chapterStep(-1);
  }

  function zoomStep() {
    const z0 = size();
    const cx = (W / 2 - px) / z0.w;
    const cy = (H / 2 - py) / z0.h;
    zi = (zi + 1) % ZOOMS.length;
    const z1 = size();
    px = W / 2 - cx * z1.w;
    py = H / 2 - cy * z1.h;
    apply();
    showHud(t('Zoom {n}%', { n: Math.round(ZOOMS[zi] * 100) }));
  }

  function onKey(e) {
    const k = e.keyCode;
    const z = size();
    const panX = z.w > W + 1;
    const panY = z.h > H + 1;
    if (!pages.length) return k === KEY.BACK ? false : true;
    if (k === KEY.RED) return zoomStep(), true;
    if (k === KEY.GREEN) {
      mode = mode === 'fit' ? 'width' : 'fit';
      store.saveSettings({ readerMode: mode });
      zi = 0;
      layout('top');
      showHud(mode === 'fit' ? t('Ajustar à tela') : t('Ajustar à largura'));
      return true;
    }
    if (k === KEY.YELLOW || k === KEY.CH_UP) return chapterStep(1), true;
    if (k === KEY.BLUE || k === KEY.CH_DOWN) return chapterStep(-1), true;
    if (k === KEY.ENTER) return showHud(), true;
    if (k === KEY.LEFT || k === KEY.RIGHT) {
      const next = (k === KEY.RIGHT) !== !!opts.rtl; // RTL: Left = next
      if (panX) {
        const toRight = k === KEY.RIGHT;
        const atEdge = toRight ? px <= W - z.w + 1 : px >= -1;
        if (!atEdge) {
          px += toRight ? -PAN : PAN;
          apply();
          return true;
        }
      }
      turn(next ? 1 : -1);
      return true;
    }
    if (k === KEY.UP || k === KEY.DOWN) {
      const down = k === KEY.DOWN;
      if (panY) {
        const atEdge = down ? py <= H - z.h + 1 : py >= -1;
        if (!atEdge) {
          py += down ? -PAN : PAN;
          apply();
          return true;
        }
        if (ZOOMS[zi] > 1) return true; // zoomed: the edge just stops
      }
      turn(down ? 1 : -1);
      return true;
    }
    return false;
  }

  loadChapter(ci, opts.startPage || 0);

  return {
    el: el,
    onKey: onKey,
    onBack: () => {
      if (zi > 0) {
        zi = 0;
        layout('top');
        return true;
      }
      return false;
    },
    destroy: () => {
      alive = false;
      token++;
      clearTimeout(hudTimer);
      pre = null;
      img.onload = img.onerror = null;
      img.removeAttribute('src');
    },
  };
}
