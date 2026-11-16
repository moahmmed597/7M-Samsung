// Books tab: free books with open full text (Open Library + Internet Archive), with an OLED text
// reader for the TV (black background, big type). No account, no key.
//   Reader: Left/Right/Up/Down turn the page (Right = previous for Arabic books), Red changes the
//   type size, Enter shows the page number. The place is saved by character offset, so changing the
//   size does not lose it.
import { h, clear, loadVisibleImages } from '../lib/dom.js';
import * as nav from '../lib/nav.js';
import { KEY } from '../lib/nav.js';
import { getJSON, getText } from '../lib/http.js';
import { fetchUrl as phoneFetchUrl } from '../lib/phone.js';
import * as store from '../lib/store.js';
import { topbar, card, spinnerLine, toast, promptText, menu } from '../ui.js';
import * as router from '../router.js';
import { t } from '../lib/i18n.js';

const API = 'https://openlibrary.org/search.json';
const enc = encodeURIComponent;
const LANGS = [
  { id: 'en', ol: 'eng', label: 'English' },
  { id: 'ar', ol: 'ara', label: 'العربية' },
  { id: 'fr', ol: 'fre', label: 'Français' },
  { id: 'es', ol: 'spa', label: 'Español' },
  { id: 'pt', ol: 'por', label: 'Português' },
];
const SIZES = [34, 44, 56, 70];

// Direct first (Open Library and the Internet Archive allow browsers); the TV's own service otherwise.
function viaTv(fn, url, opts) {
  return fn(url, opts).catch((e) => {
    if (e && e.status && e.status !== 0) throw e;
    return fn(phoneFetchUrl(url), opts);
  });
}

// Open Library lists the Internet Archive copies of a book (ia); only books with open (public) full text are asked for.
function toMeta(b, lang) {
  // Skip audio books (librivox) and bulk scans (isbn_ / bwb_): the first plain copy has text.
  const ia = (b.ia || []).filter((x) => !/librivox|^isbn_|^bwb_/.test(x))[0] || '';
  return {
    id: 'ol:' + b.key,
    bookId: b.key,
    type: 'book',
    name: b.title || '',
    poster: b.cover_i ? 'https://covers.openlibrary.org/b/id/' + b.cover_i + '-M.jpg' : '',
    author: (b.author_name || []).slice(0, 2).join(', '),
    lang: lang,
    downloads: 0,
    textUrl: ia ? 'https://archive.org/download/' + ia + '/' + ia + '_djvu.txt' : '',
  };
}

function search(query, lang, page) {
  const ol = (LANGS.filter((x) => x.id === lang)[0] || LANGS[0]).ol;
  const q = API + '?q=' + enc((query || 'subject:fiction') + ' AND ebook_access:public AND language:' + ol) + '&sort=' + (query ? 'relevance' : 'rating') + '&limit=30&page=' + (page || 1) + '&fields=key,title,author_name,cover_i,ia,ebook_access';
  return viaTv(getJSON, q, { timeout: 20000, quiet: true }).then((r) => ({
    items: ((r && r.docs) || []).filter((b) => b.ia && b.ia.length && b.ebook_access === 'public' && b.ia.some((x) => !/librivox|^isbn_|^bwb_/.test(x))).map((b) => toMeta(b, lang)),
    more: !!(r && r.numFound > (page || 1) * 30),
  }));
}

export function BooksView() {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const bar = topbar('books', router.goTab);
  scroller.appendChild(bar);
  let lang = LANGS.filter((x) => x.id === store.settings().booksLang)[0] || LANGS[0];
  const host = h('div');
  const searchBtn = h('div.btn', { focusable: true, 'data-autofocus': '', onSelect: () => promptText(t('Buscar livros'), '', '', (q) => router.push(BookGrid(t('Resultados') + ': ' + q, q, lang.id))) }, [h('span.ico', { text: '🔍' }), t('Buscar livros')]);
  scroller.appendChild(h('div.details-buttons', { 'data-group': '' }, [searchBtn, h('div.btn', {
    focusable: true,
    onSelect: () =>
      menu(t('Idioma dos livros'), LANGS.map((x) => ({ label: x.label, value: x, checked: x.id === lang.id })), {
        onPick: (v) => {
          lang = v;
          store.saveSettings({ booksLang: v.id });
          clear(host);
          host.appendChild(BookGrid('', '', lang.id, host).el);
          loadVisibleImages(el, 400);
        },
      }),
  }, [h('span.ico', { text: '🌐' }), t('Idioma dos livros')])]));
  scroller.appendChild(h('div.row-title.catalog-title', { text: t('Livros gratuitos (domínio público)') }));
  scroller.appendChild(host);
  host.appendChild(BookGrid('', '', lang.id, host).el);
  el.appendChild(scroller);
  return { el: el, onShow: () => loadVisibleImages(el, 400), onScroll: () => loadVisibleImages(el, 400), destroy: () => bar.__destroy && bar.__destroy() };
}

function BookGrid(title, query, lang, host) {
  const el = host ? h('div') : h('div.view');
  const scroller = host ? el : h('div.scroll-y', { 'data-scroll-y': '' });
  const gridEl = h('div.grid');
  if (!host) {
    scroller.appendChild(h('div.row-title.catalog-title', { text: title }));
    el.appendChild(scroller);
  }
  scroller.appendChild(gridEl);
  let page = 0;
  let more = null;
  function next() {
    if (more && more.parentNode) gridEl.removeChild(more);
    const sp = spinnerLine(t('Carregando...'));
    gridEl.appendChild(sp);
    search(query, lang, ++page)
      .then((r) => {
        if (sp.parentNode) gridEl.removeChild(sp);
        r.items.forEach((b) => gridEl.appendChild(card(b, { onSelect: () => router.push(BookDetails(b)) })));
        if (!r.items.length && page === 1) gridEl.appendChild(h('div.modal-text', { text: t('Nada por aqui.') }));
        if (r.more) {
          more = h('div.card.see-all', { focusable: true, onSelect: () => next() }, [h('div.poster-wrap', null, h('div.see-all-label', null, [h('b', { text: '+' }), t('Carregar mais')])), h('div.name', { text: '' })]);
          gridEl.appendChild(more);
        }
        loadVisibleImages(el, 400);
        if (!host && page === 1) {
          const first = gridEl.querySelector('.card');
          if (first) nav.focus(first);
        }
      })
      .catch(() => {
        if (sp.parentNode) gridEl.removeChild(sp);
        toast(t('Não foi possível carregar agora.'));
      });
  }
  next();
  return { el: el, onShow: () => loadVisibleImages(el, 400) };
}

function BookDetails(b) {
  const el = h('div.view.md-view');
  const info = h('div.md-info');
  el.appendChild(info);
  const img = h('img.md-cover', { alt: '' });
  img.setAttribute('data-lazy', b.poster || '');
  info.appendChild(img);
  const text = h('div.md-text');
  text.appendChild(h('div.md-title', { text: b.name }));
  text.appendChild(h('div.md-meta', { text: [b.author, b.lang.toUpperCase()].filter(Boolean).join('  ·  ') }));
  const prog = () => (store.get('bookProgress', {}) || {})[b.id] || null;
  const p = prog();
  text.appendChild(
    h('div.details-buttons', { 'data-group': '' }, [
      h('div.btn.primary', { focusable: true, 'data-autofocus': '', onSelect: () => (b.textUrl ? router.push(BookReader(b)) : toast(t('Este livro não tem texto para ler aqui.'))) }, [h('span.ico', { text: '📖' }), p ? t('Continuar') : t('Ler')]),
    ])
  );
  info.appendChild(text);
  return { el: el, onShow: () => loadVisibleImages(el) };
}

// Plain text → paragraphs without the Gutenberg licence header / footer.
function clean(raw) {
  let s = String(raw || '').replace(/\r\n?/g, '\n');
  const a = s.search(/\*\*\* ?START OF[^\n]*\n/);
  if (a >= 0) s = s.slice(s.indexOf('\n', a) + 1);
  const z = s.search(/\*\*\* ?END OF/);
  if (z >= 0) s = s.slice(0, z);
  return s
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean)
    .join('\n\n');
}

function BookReader(b) {
  const el = h('div.view.book-reader');
  const body = h('div.bk-text');
  const hud = h('div.rd-hud');
  el.appendChild(body);
  el.appendChild(hud);
  const rtl = b.lang === 'ar' || b.lang === 'he' || b.lang === 'fa';
  let text = '';
  let starts = [0];
  let pi = 0;
  const saved0 = (store.get('bookProgress', {}) || {})[b.id];
  let si = saved0 ? SIZES.indexOf(saved0.fs) : 1;
  if (si < 0) si = 1;
  let hudTimer = null;
  let alive = true;

  const fs = () => SIZES[si] || 44;

  function paginate(keepOffset) {
    const per = Math.round(940 * Math.pow(44 / fs(), 2));
    starts = [0];
    let i = 0;
    while (i < text.length) {
      let end = Math.min(text.length, i + per);
      if (end < text.length) {
        const cut = Math.max(text.lastIndexOf('\n', end), text.lastIndexOf(' ', end));
        if (cut > i + per * 0.6) end = cut;
      }
      while (text.charAt(end) === ' ' || text.charAt(end) === '\n') end++;
      i = end;
      if (i < text.length) starts.push(i);
    }
    pi = 0;
    for (let k = 0; k < starts.length; k++) if (starts[k] <= keepOffset) pi = k;
  }

  function showHud(extra) {
    hud.textContent = b.name + ' · ' + (pi + 1) + ' / ' + starts.length + (extra ? ' · ' + extra : '');
    hud.classList.add('show');
    clearTimeout(hudTimer);
    hudTimer = setTimeout(() => hud.classList.remove('show'), 2500);
  }

  function render() {
    body.style.fontSize = fs() + 'px';
    body.style.direction = rtl ? 'rtl' : 'ltr';
    body.style.textAlign = rtl ? 'right' : 'left';
    body.textContent = text.slice(starts[pi], starts[pi + 1] === undefined ? text.length : starts[pi + 1]).replace(/\n\n/g, '\n');
    const all = store.get('bookProgress', {}) || {};
    all[b.id] = { offset: starts[pi], fs: fs() };
    const keys = Object.keys(all);
    if (keys.length > 100) delete all[keys[0]];
    store.set('bookProgress', all);
  }

  function turn(d) {
    const n = pi + d;
    if (n < 0 || n >= starts.length) return toast(d > 0 ? t('Fim do livro.') : t('Início do livro.'));
    pi = n;
    render();
    showHud();
  }

  function onKey(e) {
    const k = e.keyCode;
    if (!text) return k === KEY.BACK ? false : true;
    if (k === KEY.LEFT || k === KEY.RIGHT) return turn((k === KEY.RIGHT) !== rtl ? 1 : -1), true;
    if (k === KEY.DOWN || k === KEY.CH_UP || k === KEY.YELLOW) return turn(1), true;
    if (k === KEY.UP || k === KEY.CH_DOWN || k === KEY.BLUE) return turn(-1), true;
    if (k === KEY.RED) {
      const off = starts[pi];
      si = (si + 1) % SIZES.length;
      paginate(off);
      render();
      showHud(t('Tamanho {n}', { n: fs() }));
      return true;
    }
    if (k === KEY.ENTER) return showHud(), true;
    return false;
  }

  body.textContent = t('Carregando...');
  viaTv(getText, b.textUrl, { timeout: 60000, quiet: true })
    .then((raw) => {
      if (!alive) return;
      text = clean(raw);
      if (!text) return (body.textContent = t('Este livro não tem texto para ler aqui.'));
      const saved = (store.get('bookProgress', {}) || {})[b.id];
      paginate(saved ? saved.offset : 0);
      render();
      showHud();
    })
    .catch(() => alive && (body.textContent = t('Não foi possível abrir este livro agora.')));

  return { el: el, onKey: onKey, destroy: () => ((alive = false), clearTimeout(hudTimer)) };
}
