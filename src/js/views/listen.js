// Audiobook player: a real <audio> player made for the TV remote, with the book's page for the chapter
// you are hearing in front of you (when the source also has the text), else the cover.
//   OK: play / pause          Hold OK: menu (speed, chapters, bookmark this moment, my bookmarks)
//   ◀ ▶: back / forward 30 s   ▲ ▼: previous / next chapter    CH + / −: turn the page you see
//   Media keys work too. Back saves the place and closes. Leaving the app pauses.
import { h } from '../lib/dom.js';
import { KEY } from '../lib/nav.js';
import * as router from '../router.js';
import * as store from '../lib/store.js';
import * as bm from '../lib/bookmarks.js';
import { toast, menu } from '../ui.js';
import { t } from '../lib/i18n.js';

const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];
const KEY_LISTEN = 'listenProgress';

export function listenProgress(key) {
  return (store.get(KEY_LISTEN, {}) || {})[key] || null;
}
export function forgetListen(key) {
  const all = store.get(KEY_LISTEN, {}) || {};
  delete all[key];
  store.set(KEY_LISTEN, all);
}
// Newest first, for the "Continue" shelf of the Books tab.
export function listenList() {
  const all = store.get(KEY_LISTEN, {}) || {};
  return Object.keys(all)
    .map((k) => Object.assign({ key: k }, all[k]))
    .filter((p) => p.ref && p.at)
    .sort((a, b) => b.at - a.at);
}

const fmt = (s) => {
  s = Math.max(0, Math.floor(s || 0));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return hh ? hh + ':' + String(mm).padStart(2, '0') + ':' + ss : mm + ':' + ss;
};

// opts: { key, title, poster, tracks, index, startTime, ref, pagesFn, chapters (reading chapters), rtl }
export function openListen(opts) {
  router.push(ListenView(opts));
}

function ListenView(opts) {
  const tracks = opts.tracks || [];
  let ti = Math.max(0, Math.min(opts.index || 0, tracks.length - 1));
  let speed = store.settings().listenSpeed || 1;
  let alive = true;
  let pages = [];
  let pi = 0;
  let pageToken = 0;

  const audio = document.createElement('audio');
  audio.preload = 'auto';
  const bg = h('div.ls-bg');
  if (opts.poster) bg.style.backgroundImage = 'url("' + opts.poster + '")';
  const page = h('img.ls-page', { alt: '' });
  page.style.display = 'none';
  const cover = h('img.ls-cover', { alt: '' });
  if (opts.poster) cover.src = opts.poster;
  const titleEl = h('div.ls-title', { text: opts.title || '' });
  const trackEl = h('div.ls-track');
  const fill = h('i');
  const bar = h('div.ls-bar', null, fill);
  const timeEl = h('div.ls-time');
  const stateEl = h('div.ls-state', { text: '▶' });
  const speedEl = h('div.ls-speed');
  const hint = h('div.ls-hint', { text: t('OK: tocar/pausar · ◀ ▶ 30 s · ▲ ▼ capítulo · CH: página · Segure OK: menu') });
  const panel = h('div.ls-panel', null, [cover, h('div.ls-info', null, [titleEl, trackEl, bar, h('div.ls-row', null, [stateEl, timeEl, speedEl])])]);
  const el = h('div.view.listen', null, [bg, page, panel, hint, audio]);

  function save() {
    if (!opts.key || !tracks[ti]) return;
    const all = store.get(KEY_LISTEN, {}) || {};
    all[opts.key] = { track: ti, trackId: tracks[ti].id, chapter: tracks[ti].chapter, time: Math.floor(audio.currentTime || 0), at: Date.now(), title: opts.title, poster: opts.poster, ref: opts.ref };
    const keys = Object.keys(all);
    if (keys.length > 200) delete all[keys[0]];
    store.set(KEY_LISTEN, all);
  }

  function drawInfo() {
    const tr = tracks[ti] || {};
    trackEl.textContent = (tr.title || t('Faixa {n}', { n: ti + 1 })) + '  ·  ' + (ti + 1) + ' / ' + tracks.length;
    speedEl.textContent = speed + '×';
    drawTime();
  }
  function drawTime() {
    const d = audio.duration && isFinite(audio.duration) ? audio.duration : (tracks[ti] && tracks[ti].duration) || 0;
    timeEl.textContent = fmt(audio.currentTime) + ' / ' + (d ? fmt(d) : '--:--');
    fill.style.width = d ? Math.min(100, (audio.currentTime / d) * 100) + '%' : '0%';
    stateEl.textContent = audio.paused ? '▶' : '⏸';
  }

  // The page of the chapter you are hearing (when the source also has the text).
  function loadPages() {
    const my = ++pageToken;
    pages = [];
    pi = 0;
    page.style.display = 'none';
    if (!opts.pagesFn || !opts.chapters || !opts.chapters.length) return;
    const tr = tracks[ti] || {};
    let c = tr.chapter != null ? opts.chapters.find((x) => String(x.chapter) === String(tr.chapter)) : null;
    if (!c && opts.chapters.length === tracks.length) c = opts.chapters[ti];
    if (!c) return;
    opts
      .pagesFn(c.id)
      .then((list) => {
        if (my !== pageToken || !alive || !list.length) return;
        pages = list;
        showPage();
      })
      .catch(() => {});
  }
  function showPage() {
    if (!pages.length) return;
    page.src = pages[pi];
    page.style.display = '';
    el.classList.add('has-page');
  }

  function playTrack(i, at) {
    ti = Math.max(0, Math.min(i, tracks.length - 1));
    const tr = tracks[ti];
    if (!tr) return;
    audio.src = tr.url;
    audio.playbackRate = speed;
    const start = at || 0;
    const go = () => {
      if (start) {
        try {
          audio.currentTime = start;
        } catch (e) {}
      }
      audio.playbackRate = speed;
      const p = audio.play();
      if (p && p.catch) p.catch(() => {});
    };
    audio.onloadedmetadata = go;
    audio.load();
    drawInfo();
    loadPages();
    save();
  }

  audio.ontimeupdate = () => alive && drawTime();
  audio.onplay = audio.onpause = () => alive && (drawTime(), save());
  audio.onended = () => {
    if (!alive) return;
    if (ti + 1 < tracks.length) playTrack(ti + 1, 0);
    else {
      toast(t('Fim do livro.'));
      save();
    }
  };
  audio.onerror = () => alive && toast(t('Não consegui tocar este capítulo.'), 5000);
  const saver = setInterval(() => alive && !audio.paused && save(), 5000);
  // Leaving the app (or the TV going to another app) pauses.
  const onHide = () => {
    if (document.hidden && !audio.paused) audio.pause();
  };
  document.addEventListener('visibilitychange', onHide);

  function seek(d) {
    const dur = audio.duration && isFinite(audio.duration) ? audio.duration : 0;
    let x = (audio.currentTime || 0) + d;
    if (x < 0) x = 0;
    if (dur && x > dur - 1) x = dur - 1;
    try {
      audio.currentTime = x;
    } catch (e) {}
    drawTime();
  }
  function toggle() {
    if (audio.paused) {
      const p = audio.play();
      if (p && p.catch) p.catch(() => {});
    } else audio.pause();
  }

  // ---- hold OK: the menu ----
  function openMenu() {
    const n = opts.key ? bm.list(opts.key).filter((b) => b.time != null).length : 0;
    menu(opts.title || t('Livro'), [
      { label: '⏩ ' + t('Velocidade: {n}×', { n: speed }), value: 'speed' },
      { label: '📃 ' + t('Capítulos'), sub: (ti + 1) + ' / ' + tracks.length, value: 'tracks' },
      { label: '🔖 ' + t('Marcar este momento'), sub: fmt(audio.currentTime), value: 'mark' },
      { label: '📑 ' + t('Minhas marcações') + (n ? ' (' + n + ')' : ''), value: 'marks' },
    ], {
      onPick: (v) => {
        if (v === 'speed')
          menu(t('Velocidade'), SPEEDS.map((x) => ({ label: x + '×', value: x, checked: x === speed })), {
            onPick: (x) => {
              speed = x;
              audio.playbackRate = x;
              store.saveSettings({ listenSpeed: x });
              drawInfo();
            },
          });
        else if (v === 'tracks')
          menu(t('Capítulos'), tracks.map((tr, i) => ({ label: tr.title || t('Faixa {n}', { n: i + 1 }), sub: tr.duration ? fmt(tr.duration) : '', value: i, checked: i === ti })), { onPick: (i) => playTrack(i, 0) });
        else if (v === 'mark')
          menu(t('Marcar este momento'), bm.COLORS.map((x) => ({ label: '● ' + t(x.label), value: x.id })), {
            onPick: (c) => {
              bm.put(opts.key, { ci: ti, chapterId: tracks[ti].id, chapter: tracks[ti].title, time: Math.floor(audio.currentTime || 0), color: c });
              toast(t('Momento marcado.'));
            },
          });
        else if (v === 'marks') {
          const list = bm.list(opts.key).filter((b) => b.time != null);
          if (!list.length) return toast(t('Nenhum momento marcado ainda.'));
          menu(t('Minhas marcações'), list.map((b) => ({ label: '● ' + (b.chapter || t('Faixa {n}', { n: b.ci + 1 })) + ' · ' + fmt(b.time), value: b })), {
            onPick: (b) => {
              const i = tracks.findIndex((x) => x.id === b.chapterId);
              if (i === ti) {
                try {
                  audio.currentTime = b.time;
                } catch (e) {}
              } else playTrack(i >= 0 ? i : b.ci, b.time);
            },
          });
        }
      },
    });
  }
  let hold = null;
  const onKeyUp = (e) => {
    if (e.keyCode !== KEY.ENTER || !hold) return;
    clearTimeout(hold.timer);
    const fired = hold.fired;
    hold = null;
    if (!fired) toggle();
  };
  document.addEventListener('keyup', onKeyUp, true);

  playTrack(ti, opts.startTime || 0);

  return {
    el: el,
    onKey: (e) => {
      const k = e.keyCode;
      if (k === KEY.ENTER) {
        if (e.repeat || hold) return true;
        const h1 = { fired: false, timer: 0 };
        h1.timer = setTimeout(() => {
          h1.fired = true;
          openMenu();
        }, 650);
        hold = h1;
        return true;
      }
      if (k === KEY.PLAYPAUSE) return toggle(), true;
      if (k === KEY.PLAY) return audio.play(), true;
      if (k === KEY.PAUSE) return audio.pause(), true;
      if (k === KEY.LEFT || k === KEY.RW) return seek(-30), true;
      if (k === KEY.RIGHT || k === KEY.FF) return seek(30), true;
      if (k === KEY.UP) return ti > 0 ? playTrack(ti - 1, 0) : toast(t('Este é o primeiro capítulo.')), true;
      if (k === KEY.DOWN) return ti + 1 < tracks.length ? playTrack(ti + 1, 0) : toast(t('Este é o último capítulo.')), true;
      if (k === KEY.CH_UP || k === KEY.CH_DOWN) {
        if (!pages.length) return true;
        const fwd = (k === KEY.CH_UP) !== !!opts.rtl ? 1 : -1;
        pi = Math.max(0, Math.min(pages.length - 1, pi + fwd));
        showPage();
        return true;
      }
      return false;
    },
    destroy: () => {
      alive = false;
      save();
      clearInterval(saver);
      document.removeEventListener('visibilitychange', onHide);
      document.removeEventListener('keyup', onKeyUp, true);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    },
  };
}
