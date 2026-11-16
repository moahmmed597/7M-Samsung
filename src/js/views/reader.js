// Reader for manga and webtoons, made for the TV remote.
//   Left/Right: turn the page (Right = previous for right-to-left manga). Up/Down: pan a tall page, or turn.
//   Zoom (made for the smart remote): OK twice = zoom in / back to normal; Channel up/down = zoom in / out;
//   Red = next zoom step. While zoomed the arrows move around the page like a mouse (they don't turn pages).
//   OK once: page mode (one page, two pages side by side, fit the width for webtoons). Green: next mode.
//   Yellow / Blue: next / previous chapter.
//   Back: reset the zoom, then close.
// Memory: one <img> on screen (two in two-page mode) plus the next page(s) preloaded; the rest is dropped.
import { h } from '../lib/dom.js';
import { KEY } from '../lib/nav.js';
import * as router from '../router.js';
import * as store from '../lib/store.js';
import * as md from '../api/mangadex.js';
import { toast, menu } from '../ui.js';
import { t } from '../lib/i18n.js';

const W = 1920;
const H = 1080;
const PAN = 300;
const ZOOMS = [1, 1.5, 2, 3];
const DOUBLE_MS = 450;

// opts: { key, title, chapters, index, startPage, rtl }
export function openReader(opts) {
  router.push(ReaderView(opts));
}

function ReaderView(opts) {
  let ci = opts.index;
  let pages = [];
  let pi = 0;
  const MODES = ['fit', 'double', 'width'];
  let mode = MODES.indexOf(store.settings().readerMode) >= 0 ? store.settings().readerMode : 'fit';
  let two = false; // two pages on screen now
  let f1 = 1; // share of the width taken by the current page when two are shown
  let pre2 = null;
  let zi = 0; // index in ZOOMS
  let lastOk = 0;
  let okTimer = null;
  let px = 0;
  let py = 0;
  let nat = { w: 0, h: 0 };
  let pre = null;
  let hudTimer = null;
  let token = 0;
  let alive = true;
  let retried = false;

  const img = h('img.rd-img', { alt: '' });
  const img2 = h('img.rd-img', { alt: '' });
  img2.style.display = 'none';
  const hud = h('div.rd-hud');
  const msg = h('div.rd-msg');
  const el = h('div.view.reader', null, [img, img2, hud, msg]);

  const chapter = () => opts.chapters[ci];
  const size = () => {
    const fit = mode === 'width' ? W / nat.w : Math.min(W / nat.w, H / nat.h);
    const s = fit * ZOOMS[zi];
    return { s: s, w: nat.w * s, h: nat.h * s };
  };

  function say(text) {
    msg.textContent = text || '';
    msg.style.display = text ? '' : 'none';
  }

  function showHud(extra) {
    const c = chapter();
    hud.textContent = (opts.title ? opts.title + ' · ' : '') + t('Cap. {n}', { n: c && c.chapter !== null && c.chapter !== undefined ? c.chapter : ci + 1 }) + ' · ' + (pi + 1) + (two ? '–' + (pi + 2) : '') + ' / ' + pages.length + (extra ? ' · ' + extra : '');
    hud.classList.add('show');
    clearTimeout(hudTimer);
    hudTimer = setTimeout(() => hud.classList.remove('show'), 3000);
  }

  function apply() {
    const z = size();
    px = z.w <= W ? (W - z.w) / 2 : Math.max(W - z.w, Math.min(0, px));
    py = z.h <= H ? (H - z.h) / 2 : Math.max(H - z.h, Math.min(0, py));
    const place = (im, x, w) => {
      im.style.width = Math.round(w) + 'px';
      im.style.height = Math.round(z.h) + 'px';
      im.style.webkitTransform = im.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(py) + 'px)';
    };
    if (!two) {
      place(img, px, z.w);
      img2.style.display = 'none';
      return;
    }
    // Two pages: the current one on the left (on the right for right-to-left manga).
    const w1 = z.w * f1;
    const w2 = z.w - w1;
    place(img, opts.rtl ? px + w2 : px, w1);
    place(img2, opts.rtl ? px : px + w1, w2);
    img2.style.display = '';
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
    img2.style.visibility = 'hidden';
    img2.onload = img2.onerror = null;
    const wide = (im) => (im.naturalWidth || 1) > (im.naturalHeight || 1) * 1.1;
    const done = (both) => {
      if (my !== token || !alive) return;
      two = both;
      const a = { w: img.naturalWidth || 1, h: img.naturalHeight || 1 };
      if (both) {
        const bw = ((img2.naturalWidth || 1) * a.h) / (img2.naturalHeight || 1);
        nat = { w: a.w + bw, h: a.h };
        f1 = a.w / nat.w;
      } else nat = a;
      layout(anchor);
      img.style.visibility = '';
      img2.style.visibility = '';
      say('');
      showHud();
      save();
      // Preload only what comes next; the old pages are released.
      const next = pi + (both ? 2 : 1);
      pre = pre2 = null;
      if (next < pages.length) {
        pre = new Image();
        pre.src = pages[next];
      }
      if (mode === 'double' && next + 1 < pages.length) {
        pre2 = new Image();
        pre2.src = pages[next + 1];
      }
    };
    img.onload = () => {
      if (my !== token || !alive) return;
      if (mode !== 'double' || pi + 1 >= pages.length || wide(img)) return done(false);
      img2.onload = () => done(!wide(img2));
      img2.onerror = () => done(false);
      img2.src = pages[pi + 1];
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
      const step = two ? 2 : 1;
      if (pi + step < pages.length) {
        pi += step;
        zi = 0;
        showPage('top');
      } else chapterStep(1);
    } else if (pi > 0) {
      pi = Math.max(0, pi - (mode === 'double' ? 2 : 1));
      zi = 0;
      showPage('bottom');
    } else chapterStep(-1);
  }

  const MODE_NAMES = { fit: 'Uma página', double: 'Duas páginas', width: 'Ajustar à largura' };
  function setMode(m) {
    mode = m;
    store.saveSettings({ readerMode: m });
    zi = 0;
    showPage('top');
    toast(t(MODE_NAMES[m]));
  }
  function modeMenu() {
    menu(
      t('Modo de leitura'),
      [
        { label: t('Uma página'), sub: t('A página inteira na tela'), value: 'fit', checked: mode === 'fit' },
        { label: t('Duas páginas'), sub: t('Lado a lado, como um livro aberto'), value: 'double', checked: mode === 'double' },
        { label: t('Ajustar à largura'), sub: t('Para webtoons: role com as setas'), value: 'width', checked: mode === 'width' },
        { label: '🔍 ' + t('OK 2x ou CH +/−: zoom'), value: '' },
      ],
      { onPick: (v) => v && v !== mode && setMode(v) }
    );
  }

  // to: the zoom step to go to (default: the next one, back to 100% after the last).
  function zoomStep(to) {
    const z0 = size();
    const cx = (W / 2 - px) / z0.w;
    const cy = (H / 2 - py) / z0.h;
    const n = typeof to === 'number' ? Math.max(0, Math.min(ZOOMS.length - 1, to)) : (zi + 1) % ZOOMS.length;
    if (n === zi) return showHud(t('Zoom {n}%', { n: Math.round(ZOOMS[zi] * 100) }));
    zi = n;
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
    // Channel up / down: zoom in / out.
    if (k === KEY.CH_UP) return zoomStep(zi + 1), true;
    if (k === KEY.CH_DOWN) return zoomStep(zi - 1), true;
    // OK twice quickly: zoom in (or back to normal when zoomed). OK once: show the page info.
    if (k === KEY.ENTER) {
      const now = Date.now();
      if (now - lastOk < DOUBLE_MS) {
        lastOk = 0;
        clearTimeout(okTimer);
        zoomStep(zi > 0 ? 0 : 2);
      } else {
        lastOk = now;
        clearTimeout(okTimer);
        okTimer = setTimeout(() => alive && modeMenu(), DOUBLE_MS);
      }
      return true;
    }
    // Zoomed: the arrows only move around the page and stop at its edges.
    if (zi > 0 && (k === KEY.LEFT || k === KEY.RIGHT || k === KEY.UP || k === KEY.DOWN)) {
      if (k === KEY.LEFT) px = Math.min(0, px + PAN);
      if (k === KEY.RIGHT) px = Math.max(Math.min(0, W - z.w), px - PAN);
      if (k === KEY.UP) py = Math.min(0, py + PAN);
      if (k === KEY.DOWN) py = Math.max(Math.min(0, H - z.h), py - PAN);
      if (!panX) px = (W - z.w) / 2;
      if (!panY) py = (H - z.h) / 2;
      apply();
      return true;
    }
    if (k === KEY.GREEN) return setMode(MODES[(MODES.indexOf(mode) + 1) % MODES.length]), true;
    if (k === KEY.YELLOW) return chapterStep(1), true;
    if (k === KEY.BLUE) return chapterStep(-1), true;
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
      clearTimeout(okTimer);
      pre = null;
      pre2 = null;
      img.onload = img.onerror = img2.onload = img2.onerror = null;
      img.removeAttribute('src');
      img2.removeAttribute('src');
    },
  };
}
