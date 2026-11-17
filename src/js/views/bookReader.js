// Text books read like a book: the plugin's pages (SVG pictures with the text inside) are turned back
// into text, and the app lays it out itself on paper, two pages side by side like an open book, with a
// book font, margins and page numbers. Arabic reads right to left. Pages that are real pictures (scans)
// go to the picture reader instead.
//   ◀ ▶ / ▲ ▼: turn the page (the chapter goes on by itself)   CH + / −: text size
//   OK: menu (bookmark this page, my bookmarks, text size, paper colour, one or two pages)
//   Yellow / Blue: next / previous chapter        Back: close
import { h, clear } from '../lib/dom.js';
import { KEY } from '../lib/nav.js';
import * as bm from '../lib/bookmarks.js';
import * as router from '../router.js';
import * as store from '../lib/store.js';
import { toast, menu } from '../ui.js';
import { t } from '../lib/i18n.js';

const SIZES = [24, 28, 32, 36, 42];
const PAPERS = [
  { id: 'paper', label: 'Papel', bg: '#f3ead6', fg: '#2b2217' },
  { id: 'white', label: 'Branco', bg: '#fbfaf7', fg: '#1d1d1f' },
  { id: 'night', label: 'Noite', bg: '#1d1c21', fg: '#d9d3c7' },
];

// The text of one plugin page, as paragraphs; null when it isn't a text page.
function pageText(url) {
  if (!/^data:image\/svg\+xml/i.test(url || '')) return null;
  let svg = '';
  try {
    const i = url.indexOf(',');
    svg = /;base64,/i.test(url.slice(0, i + 1)) ? decodeURIComponent(escape(atob(url.slice(i + 1)))) : decodeURIComponent(url.slice(i + 1));
  } catch (e) {
    return null;
  }
  const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
  const fo = doc.getElementsByTagName('foreignObject')[0];
  let html = '';
  if (fo) html = new XMLSerializer().serializeToString(fo);
  else {
    // A picture made of <text> lines: the lines between the title and the page number.
    const lines = Array.prototype.map.call(doc.getElementsByTagName('text'), (x) => x.textContent.trim()).filter(Boolean);
    if (lines.length < 3) return null;
    html = lines.slice(1, -1).join('<br/>');
  }
  const box = document.createElement('div');
  box.innerHTML = html.replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '\n\n').replace(/<\/p>/gi, '\n\n').replace(/<br\s*\/?>/gi, '\n');
  const text = (box.textContent || '').replace(/\r/g, '');
  const paras = text.split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean);
  return paras.length ? paras : null;
}

// opts as for the picture reader. fallback(): opens the picture reader instead.
export function BookReaderView(opts, fallback) {
  let ci = opts.index;
  let page = 0; // page (column) index in this chapter
  let count = 1;
  let token = 0;
  let alive = true;
  let startAt = opts.startPage || 0;
  const s0 = store.settings();
  let size = SIZES.indexOf(s0.bookFont) >= 0 ? s0.bookFont : 32;
  let paper = PAPERS.find((p) => p.id === s0.bookPaper) || PAPERS[0];
  let spread = s0.bookSpread !== false; // two pages side by side

  const flow = h('div.bk-flow');
  const sheet = h('div.bk-sheet', null, flow);
  const spine = h('div.bk-spine');
  const left = h('div.bk-num.l');
  const right = h('div.bk-num.r');
  const head = h('div.bk-head');
  const ribbon = h('div.rd-ribbon');
  ribbon.style.display = 'none';
  const book = h('div.bk-book', null, [sheet, spine, head, left, right, ribbon]);
  const msg = h('div.rd-msg');
  const el = h('div.view.reader.bk-view', null, [book, msg]);
  const chapter = () => opts.chapters[ci];

  function say(text) {
    msg.textContent = text || '';
    msg.style.display = text ? '' : 'none';
  }

  function geometry() {
    // The book: 1680 x 940 on the 1920 x 1080 screen; each page has wide margins like a printed book.
    const bw = spread ? 1680 : 1060;
    const bh = 940;
    book.style.width = bw + 'px';
    book.style.height = bh + 'px';
    book.classList.toggle('one', !spread);
    const padX = 80;
    const padY = 80;
    const gap = 2 * padX; // the inner margins of both pages + the spine
    const colW = spread ? (bw - 2 * padX - gap) / 2 : bw - 2 * padX;
    sheet.style.left = padX + 'px';
    sheet.style.top = padY + 'px';
    sheet.style.width = bw - 2 * padX + 'px';
    sheet.style.height = bh - 2 * padY + 'px';
    flow.style.height = bh - 2 * padY + 'px';
    flow.style.webkitColumnWidth = flow.style.columnWidth = colW + 'px';
    flow.style.webkitColumnGap = flow.style.columnGap = gap + 'px';
    return { colStep: colW + gap, per: spread ? 2 : 1 };
  }

  function paint() {
    el.style.background = paper.id === 'night' ? '#0b0b0e' : '#14110d';
    book.style.background = paper.bg;
    book.style.color = paper.fg;
    book.classList.toggle('dark', paper.id === 'night');
    flow.style.fontSize = size + 'px';
  }

  function measure() {
    const g = geometry();
    count = Math.max(1, Math.round(flow.scrollWidth / g.colStep));
    return g;
  }

  function show() {
    const g = measure();
    page = Math.max(0, Math.min(page - (page % g.per), count - 1));
    const x = page * g.colStep * (opts.rtl ? -1 : 1);
    flow.style.webkitTransform = flow.style.transform = 'translateX(' + -x + 'px)';
    const c = chapter();
    head.textContent = (opts.title || '') + (c ? '  ·  ' + (c.title || t('Cap. {n}', { n: c.chapter != null ? c.chapter : ci + 1 })) : '');
    // Page numbers at the bottom of each page.
    const a = page + 1;
    const b = page + 2 <= count ? page + 2 : '';
    if (spread) {
      left.textContent = opts.rtl ? b : a;
      right.textContent = opts.rtl ? a : b;
    } else {
      left.textContent = '';
      right.textContent = a + ' / ' + count;
    }
    drawRibbon();
    save();
  }

  function save() {
    if (!opts.key || !chapter()) return;
    const all = store.get('readProgress', {}) || {};
    all[opts.key] = { chapterId: chapter().id, chapter: chapter().chapter, page: page, title: opts.title, poster: opts.poster, kind: opts.kind, ref: opts.ref, at: Date.now() };
    const keys = Object.keys(all);
    if (keys.length > 200) delete all[keys[0]];
    store.set('readProgress', all);
  }

  function loadChapter(i, start) {
    const my = ++token;
    ci = i;
    clear(flow);
    say(t('Carregando...'));
    opts
      .pagesFn(chapter().id)
      .then((list) => {
        if (my !== token || !alive) return;
        if (!list.length) return say(t('Esta fonte não tem páginas para ler aqui (alguns sites só oferecem download). Volte e tente outra fonte no botão 📚.'));
        const paras = [];
        for (let k = 0; k < list.length; k++) {
          const p = pageText(list[k]);
          if (!p) return fallback(); // real pictures: the picture reader
          // The plugin's own page breaks don't matter here; a paragraph cut between two pages is joined.
          p.forEach((x) => paras.push(x));
        }
        if (!opts.rtl && paras.some((x) => /[؀-ۿ]/.test(x))) opts.rtl = true;
        book.setAttribute('dir', opts.rtl ? 'rtl' : 'ltr');
        const c = chapter();
        if (c && c.title) flow.appendChild(h('h2.bk-title', { text: c.title }));
        paras.forEach((x) => flow.appendChild(h('p', { text: x })));
        say('');
        measure();
        page = start === 'last' ? count - 1 : Math.max(0, Math.min(start || 0, count - 1));
        show();
      })
      .catch(() => alive && say(t('Não foi possível abrir este capítulo agora.')));
  }

  function chapterStep(d) {
    const n = ci + d;
    if (n < 0 || n >= opts.chapters.length) return toast(d > 0 ? t('Este é o último capítulo.') : t('Este é o primeiro capítulo.'));
    loadChapter(n, d > 0 ? 0 : 'last');
  }

  function turn(d) {
    const per = spread ? 2 : 1;
    if (d > 0) {
      if (page + per < count) {
        page += per;
        show();
      } else chapterStep(1);
    } else if (page > 0) {
      page = Math.max(0, page - per);
      show();
    } else chapterStep(-1);
  }

  function setSize(d) {
    const i = Math.max(0, Math.min(SIZES.length - 1, SIZES.indexOf(size) + d));
    if (SIZES[i] === size) return;
    // Keep the place: the same share of the chapter.
    const share = count > 1 ? page / count : 0;
    size = SIZES[i];
    store.saveSettings({ bookFont: size });
    paint();
    measure();
    page = Math.floor(share * count);
    show();
    toast(t('Texto: {n}', { n: size }));
  }

  // ---- bookmarks (a page of a chapter, like in the picture reader) ----
  function drawRibbon() {
    const c = chapter();
    const b = opts.key && c ? bm.at(opts.key, c.id, page) : null;
    ribbon.style.display = b ? '' : 'none';
    if (b) ribbon.style.background = bm.hexOf(b.color);
  }
  function markMenu() {
    const c = chapter();
    if (!opts.key || !c) return;
    const cur = bm.at(opts.key, c.id, page);
    const items = bm.COLORS.map((x) => ({ label: '● ' + t(x.label), value: x.id, checked: !!cur && cur.color === x.id }));
    if (cur) items.push({ label: '✕ ' + t('Tirar a marcação'), value: '' });
    menu(t('Marcar esta página'), items, {
      onPick: (v) => {
        if (!v) bm.remove(opts.key, cur);
        else bm.put(opts.key, { ci: ci, chapterId: c.id, chapter: c.chapter, page: page, color: v });
        drawRibbon();
        toast(v ? t('Página marcada.') : t('Marcação tirada.'));
      },
    });
  }
  function marksMenu() {
    const list = bm.list(opts.key).filter((b) => b.time == null);
    if (!list.length) return toast(t('Nenhuma página marcada ainda.'));
    menu(
      t('Minhas marcações'),
      list.map((b) => ({ label: '● ' + t('Cap. {n}', { n: b.chapter != null ? b.chapter : b.ci + 1 }) + ' · ' + t('Página {n}', { n: b.page + 1 }), value: b })),
      {
        onPick: (b) => {
          let i = opts.chapters.findIndex((c) => c.id === b.chapterId);
          if (i < 0) i = Math.min(b.ci, opts.chapters.length - 1);
          if (i === ci) {
            page = b.page;
            show();
          } else loadChapter(i, b.page);
        },
      }
    );
  }
  function okMenu() {
    const c = chapter();
    const cur = opts.key && c ? bm.at(opts.key, c.id, page) : null;
    menu(t('Leitura'), [
      { label: '🔖 ' + (cur ? t('Mudar a marcação desta página') : t('Marcar esta página')), value: 'mark' },
      { label: '📑 ' + t('Minhas marcações'), value: 'marks' },
      { label: '🔠 ' + t('Tamanho do texto'), sub: String(size), value: 'size' },
      { label: '🎨 ' + t('Cor do papel'), sub: t(paper.label), value: 'paper' },
      { label: (spread ? '📄 ' : '📖 ') + (spread ? t('Uma página') : t('Duas páginas')), value: 'spread' },
    ], {
      onPick: (v) => {
        if (v === 'mark') markMenu();
        else if (v === 'marks') marksMenu();
        else if (v === 'size')
          menu(t('Tamanho do texto'), SIZES.map((x) => ({ label: String(x), value: x, checked: x === size })), { onPick: (x) => setSize(SIZES.indexOf(x) - SIZES.indexOf(size)) });
        else if (v === 'paper')
          menu(t('Cor do papel'), PAPERS.map((p) => ({ label: t(p.label), value: p.id, checked: p.id === paper.id })), {
            onPick: (id) => {
              paper = PAPERS.find((p) => p.id === id) || PAPERS[0];
              store.saveSettings({ bookPaper: paper.id });
              paint();
            },
          });
        else if (v === 'spread') {
          spread = !spread;
          store.saveSettings({ bookSpread: spread });
          const share = count > 1 ? page / count : 0;
          measure();
          page = Math.floor(share * count);
          show();
        }
      },
    });
  }

  paint();
  loadChapter(ci, startAt);

  return {
    el: el,
    onKey: (e) => {
      const k = e.keyCode;
      if (k === KEY.ENTER) return okMenu(), true;
      if (k === KEY.CH_UP) return setSize(1), true;
      if (k === KEY.CH_DOWN) return setSize(-1), true;
      if (k === KEY.YELLOW) return chapterStep(1), true;
      if (k === KEY.BLUE) return chapterStep(-1), true;
      if (k === KEY.LEFT || k === KEY.RIGHT) return turn((k === KEY.RIGHT) !== !!opts.rtl ? 1 : -1), true;
      if (k === KEY.DOWN) return turn(1), true;
      if (k === KEY.UP) return turn(-1), true;
      return false;
    },
    destroy: () => {
      alive = false;
      save();
    },
  };
}
