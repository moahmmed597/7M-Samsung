// Comics tab: Western comics (English / French / Spanish originals) from MangaDex, read in the same
// TV reader as manga. A search box plus popular lists; a title opens its chapter list.
import { h, clear, loadVisibleImages } from '../lib/dom.js';
import * as nav from '../lib/nav.js';
import * as server from '../api/server.js';
import * as md from '../api/mangadex.js';
import * as store from '../lib/store.js';
import { topbar, card, spinnerLine, toast, promptText } from '../ui.js';
import * as router from '../router.js';
import { t } from '../lib/i18n.js';
import { openReader } from './reader.js';

const MD = 'https://api.mangadex.org/';
const enc = encodeURIComponent;
const CHUNK = 50;

function cover(m) {
  const rel = (m.relationships || []).filter((r) => r.type === 'cover_art')[0];
  const f = rel && rel.attributes && rel.attributes.fileName;
  return f ? 'https://uploads.mangadex.org/covers/' + m.id + '/' + f + '.256.jpg' : '';
}
function titleOf(m) {
  const a = m.attributes || {};
  return (a.title && (a.title.en || a.title[Object.keys(a.title)[0]])) || '';
}
function toMeta(m) {
  const a = m.attributes || {};
  const d = a.description || {};
  return { id: 'md:' + m.id, mdId: m.id, type: 'comic', name: titleOf(m), poster: cover(m), description: d.en || d[Object.keys(d)[0]] || '', year: a.year };
}

// A page of comics: query = text to search, or '' for the most followed.
function list(query, offset) {
  const url =
    MD + 'manga?limit=30&offset=' + (offset || 0) + '&includes%5B%5D=cover_art&originalLanguage%5B%5D=en&originalLanguage%5B%5D=fr&originalLanguage%5B%5D=es&availableTranslatedLanguage%5B%5D=en&hasAvailableChapters=true' +
    '&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive' +
    (query ? '&title=' + enc(query) + '&order%5Brelevance%5D=desc' : '&order%5BfollowedCount%5D=desc');
  return server.getJSONViaProxy(url, { timeout: 25000 }).then((r) => ({ items: ((r && r.data) || []).map(toMeta), more: !!(r && r.total > (offset || 0) + 30) }));
}

export function ComicsView() {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const bar = topbar('comics', router.goTab);
  scroller.appendChild(bar);
  const head = h('div.row-title.catalog-title', { text: t('Quadrinhos') });
  const searchBtn = h('div.btn', { focusable: true, 'data-autofocus': '', onSelect: () => promptText(t('Buscar quadrinhos'), '', '', (q) => router.push(ComicGrid(t('Resultados') + ': ' + q, q))) }, [h('span.ico', { text: '🔍' }), t('Buscar quadrinhos')]);
  scroller.appendChild(h('div.details-buttons', { 'data-group': '' }, [searchBtn]));
  scroller.appendChild(head);
  const gridHost = h('div');
  scroller.appendChild(gridHost);
  el.appendChild(scroller);
  const grid = ComicGrid('', '', gridHost);
  return {
    el: el,
    onShow: () => loadVisibleImages(el, 400),
    onScroll: () => loadVisibleImages(el, 400),
    destroy: () => {
      bar.__destroy && bar.__destroy();
      grid.destroy && grid.destroy();
    },
  };
}

// Grid of results; embedded in the tab (host) or its own screen.
function ComicGrid(title, query, host) {
  const el = host || h('div.view');
  const scroller = host ? el : h('div.scroll-y', { 'data-scroll-y': '' });
  const gridEl = h('div.grid');
  if (!host) {
    scroller.appendChild(h('div.row-title.catalog-title', { text: title }));
    el.appendChild(scroller);
  }
  scroller.appendChild(gridEl);
  let offset = 0;
  let more = null;
  function next() {
    if (more && more.parentNode) gridEl.removeChild(more);
    const sp = spinnerLine(t('Carregando...'));
    gridEl.appendChild(sp);
    list(query, offset)
      .then((r) => {
        if (sp.parentNode) gridEl.removeChild(sp);
        r.items.forEach((m) => gridEl.appendChild(card(m, { onSelect: () => router.push(ComicDetails(m)) })));
        offset += 30;
        if (r.more) {
          more = h('div.card.see-all', { focusable: true, onSelect: () => next() }, [h('div.poster-wrap', null, h('div.see-all-label', null, [h('b', { text: '+' }), t('Carregar mais')])), h('div.name', { text: '' })]);
          gridEl.appendChild(more);
        }
        loadVisibleImages(el, 400);
        if (!host && offset === 30) {
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
  return { el: el, onShow: () => loadVisibleImages(el, 400), destroy: () => {} };
}

function ComicDetails(m) {
  const el = h('div.view.md-view');
  const info = h('div.md-info');
  const listEl = h('div.md-list', { 'data-scroll-y': '', 'data-pad-y': '120', 'data-group': '', 'data-vertical': '' });
  el.appendChild(info);
  el.appendChild(listEl);
  let chapters = [];
  let chunk = 0;
  let alive = true;
  const status = h('div.loading-line', { text: t('Procurando capítulos...') });
  const key = 'md' + m.mdId;
  const progress = () => (store.get('readProgress', {}) || {})[key] || null;
  const idxOf = () => {
    const p = progress();
    return p ? chapters.findIndex((c) => c.id === p.chapterId) : -1;
  };
  function read(i, page) {
    if (!chapters.length) return toast(t('Nenhum capítulo encontrado.'));
    openReader({ key: key, title: m.name, chapters: chapters, index: Math.max(0, i), startPage: page || 0, rtl: false });
  }
  function renderInfo() {
    clear(info);
    const img = h('img.md-cover', { alt: '' });
    img.setAttribute('data-lazy', m.poster || '');
    info.appendChild(img);
    const text = h('div.md-text');
    text.appendChild(h('div.md-title', { text: m.name }));
    text.appendChild(h('div.md-meta', { text: [m.year, chapters.length ? t('{n} capítulos', { n: chapters.length }) : ''].filter(Boolean).join('  ·  ') }));
    text.appendChild(h('div.md-desc', { text: m.description }));
    const idx = idxOf();
    text.appendChild(
      h('div.details-buttons', { 'data-group': '' }, [
        h('div.btn.primary', { focusable: true, 'data-autofocus': '', onSelect: () => (idx >= 0 ? read(idx, progress().page) : read(0, 0)) }, [h('span.ico', { text: '📖' }), idx >= 0 ? t('Continuar: cap. {n}', { n: chapters[idx].chapter }) : t('Ler')]),
      ])
    );
    info.appendChild(text);
    loadVisibleImages(info);
  }
  function renderList() {
    clear(listEl);
    if (!chapters.length) return listEl.appendChild(status);
    const start = chunk * CHUNK;
    const end = Math.min(chapters.length, start + CHUNK);
    const p = progress();
    const jump = (label, to) => h('div.stream.md-nav', { focusable: true, onSelect: () => ((chunk = to), renderList()) }, [h('div.s-main', { text: label })]);
    if (chunk > 0) listEl.appendChild(jump('◀ ' + t('Capítulos {a}–{b}', { a: (chunk - 1) * CHUNK + 1, b: chunk * CHUNK }), chunk - 1));
    for (let i = start; i < end; i++) {
      const c = chapters[i];
      const here = p && p.chapterId === c.id;
      listEl.appendChild(
        h('div.stream', { focusable: true, onSelect: () => read(i, here ? p.page : 0) }, [
          h('div.s-main', { text: (c.chapter !== null && c.chapter !== undefined ? t('Cap. {n}', { n: c.chapter }) : t('Especial')) + (c.title ? ' · ' + c.title : '') }),
          h('span.s-tag', { text: c.pages + ' ' + t('pág.') }),
          here ? h('span.s-tag.ok', { text: t('Parou aqui') }) : null,
        ])
      );
    }
    if (end < chapters.length) listEl.appendChild(jump(t('Capítulos {a}–{b}', { a: end + 1, b: Math.min(chapters.length, end + CHUNK) }) + ' ▶', chunk + 1));
  }
  renderInfo();
  renderList();
  md.chapters(m.mdId, ['en', 'fr', 'es'])
    .then((cs) => {
      if (!alive) return;
      chapters = cs;
      const i = idxOf();
      chunk = i >= 0 ? Math.floor(i / CHUNK) : 0;
      if (!cs.length) status.textContent = t('Nenhum capítulo disponível neste idioma. Mude o idioma no botão do globo.');
      renderInfo();
      renderList();
    })
    .catch(() => alive && (status.textContent = t('Não encontrei capítulos deste título agora.')));
  return {
    el: el,
    onShow: () => {
      if (chapters.length) {
        renderInfo();
        renderList();
      }
      loadVisibleImages(el);
    },
    destroy: () => (alive = false),
  };
}
