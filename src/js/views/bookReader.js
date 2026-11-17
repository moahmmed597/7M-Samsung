// Text books read like a book (lib/paper.js): the plugin's text pages are turned back into text and
// laid out by the app on paper, two pages side by side like an open book. Arabic reads right to left.
// Pages that are real pictures (scans) go to the picture reader instead.
//   ◀ ▶ / ▲ ▼: turn the page (the chapter goes on by itself)   CH + / −: text size
//   OK: menu (bookmark this page, my bookmarks, text size, paper colour, one or two pages)
//   Yellow / Blue: next / previous chapter        Back: close
import { h } from '../lib/dom.js';
import { KEY } from '../lib/nav.js';
import * as bm from '../lib/bookmarks.js';
import * as store from '../lib/store.js';
import { Paper, chapterText } from '../lib/paper.js';
import { toast, menu } from '../ui.js';
import { t } from '../lib/i18n.js';

export const SIZES = [24, 27, 30, 34, 38, 44];
export const PAPERS = [
  { id: 'paper', label: 'Papel', bg: '#f4ecda', fg: '#2a2219' },
  { id: 'white', label: 'Branco', bg: '#fbfaf6', fg: '#1c1c1e' },
  { id: 'night', label: 'Noite', bg: '#1e1d22', fg: '#d8d2c6' },
];
export const paperNow = () => PAPERS.find((p) => p.id === store.settings().bookPaper) || PAPERS[0];

// opts as for the picture reader. fallback(): opens the picture reader instead.
export function BookReaderView(opts, fallback) {
  let ci = opts.index;
  let token = 0;
  let alive = true;
  const s0 = store.settings();
  let size = SIZES.indexOf(s0.bookFont) >= 0 ? s0.bookFont : 30;
  let paper = paperNow();
  let spread = s0.bookSpread !== false;
  const book = Paper({ width: 1720, height: 960, spread: spread, size: size });
  const msg = h('div.rd-msg');
  const el = h('div.view.reader.bk-view', null, [book.el, msg]);
  const chapter = () => opts.chapters[ci];

  function say(text) {
    msg.textContent = text || '';
    msg.style.display = text ? '' : 'none';
  }
  function paint() {
    el.style.background = paper.id === 'night' ? '#0b0b0e' : '#16120d';
    book.setPaper(paper);
    book.setSize(size);
  }

  function show(p) {
    book.show(p);
    drawRibbon();
    save();
  }

  function save() {
    if (!opts.key || !chapter()) return;
    const all = store.get('readProgress', {}) || {};
    all[opts.key] = { chapterId: chapter().id, chapter: chapter().chapter, page: book.page, title: opts.title, poster: opts.poster, kind: opts.kind, ref: opts.ref, at: Date.now() };
    const keys = Object.keys(all);
    if (keys.length > 200) delete all[keys[0]];
    store.set('readProgress', all);
  }

  function loadChapter(i, start) {
    const my = ++token;
    ci = i;
    say(t('Carregando...'));
    opts
      .pagesFn(chapter().id)
      .then((list) => {
        if (my !== token || !alive) return;
        if (!list.length) return say(t('Esta fonte não tem páginas para ler aqui (alguns sites só oferecem download). Volte e tente outra fonte no botão 📚.'));
        const paras = chapterText(list);
        if (!paras) return fallback(); // real pictures: the picture reader
        if (!opts.rtl && paras.some((x) => /[؀-ۿ]/.test(x))) opts.rtl = true;
        const c = chapter();
        book.setText(paras, c && c.title, opts.rtl);
        book.setHead((opts.title || '') + (c ? '  ·  ' + (c.title || t('Cap. {n}', { n: c.chapter != null ? c.chapter : ci + 1 })) : ''));
        say('');
        book.show(0);
        show(start === 'last' ? book.count - 1 : Math.max(0, Math.min(start || 0, book.count - 1)));
      })
      .catch(() => alive && say(t('Não foi possível abrir este capítulo agora.')));
  }

  function chapterStep(d) {
    const n = ci + d;
    if (n < 0 || n >= opts.chapters.length) return toast(d > 0 ? t('Este é o último capítulo.') : t('Este é o primeiro capítulo.'));
    loadChapter(n, d > 0 ? 0 : 'last');
  }

  function turn(d) {
    const per = book.per;
    if (d > 0) {
      if (book.page + per < book.count) show(book.page + per);
      else chapterStep(1);
    } else if (book.page > 0) show(Math.max(0, book.page - per));
    else chapterStep(-1);
  }

  // Keeps the same share of the chapter when the layout changes.
  function relayout(change) {
    const share = book.share();
    change();
    paint();
    book.show(0);
    show(Math.floor(share * book.count));
  }
  function setSize(d) {
    const i = Math.max(0, Math.min(SIZES.length - 1, SIZES.indexOf(size) + d));
    if (SIZES[i] === size) return;
    relayout(() => {
      size = SIZES[i];
      store.saveSettings({ bookFont: size });
    });
    toast(t('Texto: {n}', { n: size }));
  }

  // ---- bookmarks (a page of a chapter, like in the picture reader) ----
  function drawRibbon() {
    const c = chapter();
    const b = opts.key && c ? bm.at(opts.key, c.id, book.page) : null;
    book.ribbon(b ? bm.hexOf(b.color) : null);
  }
  function markMenu() {
    const c = chapter();
    if (!opts.key || !c) return;
    const cur = bm.at(opts.key, c.id, book.page);
    const items = bm.COLORS.map((x) => ({ label: '● ' + t(x.label), value: x.id, checked: !!cur && cur.color === x.id }));
    if (cur) items.push({ label: '✕ ' + t('Tirar a marcação'), value: '' });
    menu(t('Marcar esta página'), items, {
      onPick: (v) => {
        if (!v) bm.remove(opts.key, cur);
        else bm.put(opts.key, { ci: ci, chapterId: c.id, chapter: c.chapter, page: book.page, color: v });
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
          if (i === ci) show(b.page);
          else loadChapter(i, b.page);
        },
      }
    );
  }
  function okMenu() {
    const c = chapter();
    const cur = opts.key && c ? bm.at(opts.key, c.id, book.page) : null;
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
        else if (v === 'spread')
          relayout(() => {
            spread = !spread;
            store.saveSettings({ bookSpread: spread });
            book.setSpread(spread);
          });
      },
    });
  }

  paint();
  loadChapter(ci, opts.startPage || 0);

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
