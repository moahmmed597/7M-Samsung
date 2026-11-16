// "My sources": manga from the Suwayomi server the user connected (Settings → Integrations or here).
// The app bundles no source. Pick a source → Popular / Latest / Search → title → chapters → reader.
import { h, clear, loadVisibleImages } from '../lib/dom.js';
import * as nav from '../lib/nav.js';
import * as sw from '../api/suwayomi.js';
import * as store from '../lib/store.js';
import { card, spinnerLine, toast, promptText } from '../ui.js';
import * as router from '../router.js';
import { t } from '../lib/i18n.js';
import { openReader } from './reader.js';
import * as shelf from '../lib/mangaLib.js';

const CHUNK = 50;

export function openSources() {
  router.push(SourcesView());
}

// Ask for the server address ("http://192.168.1.20:4567"), check it, save it.
export function connectServer(done) {
  promptText(t('Endereço do servidor Suwayomi'), sw.base() || 'http://', 'http://192.168.1.20:4567', (url) => {
    let u = url.trim().replace(/\/+$/, '');
    if (!/^https?:\/\//i.test(u)) u = 'http://' + u;
    store.saveSettings({ suwayomiUrl: u });
    sw.ping().then(
      () => {
        toast(t('Servidor conectado.'));
        if (done) done();
      },
      () => {
        toast(t('Não consegui falar com o servidor. Confira o endereço e se o CORS está ligado.'), 6000);
        if (done) done();
      }
    );
  });
}

function SourcesView() {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  el.appendChild(scroller);
  scroller.appendChild(h('div.row-title.catalog-title', { text: t('Minhas fontes') }));
  const body = h('div.md-list', { 'data-group': '', 'data-vertical': '' });
  scroller.appendChild(body);

  function load() {
    clear(body);
    body.appendChild(h('div.stream', { focusable: true, 'data-autofocus': '', onSelect: () => connectServer(load) }, [h('div.s-main', { text: '🔌 ' + (sw.enabled() ? sw.base() : t('Conectar servidor Suwayomi')) })]));
    if (!sw.enabled()) {
      body.appendChild(h('div.modal-text', { text: t('Suwayomi é um servidor gratuito que você instala no PC ou NAS. Você escolhe as fontes nele; este app não traz nenhuma.') }));
      return;
    }
    const sp = spinnerLine(t('Carregando...'));
    body.appendChild(sp);
    sw.sources().then(
      (list) => {
        if (sp.parentNode) body.removeChild(sp);
        if (!list.length) body.appendChild(h('div.modal-text', { text: t('Nenhuma fonte instalada no servidor.') }));
        list.forEach((s) =>
          body.appendChild(h('div.stream', { focusable: true, onSelect: () => router.push(SourceGrid(s)) }, [h('div.s-main', { text: s.name }), h('span.s-tag', { text: s.lang.toUpperCase() })]))
        );
        const first = body.querySelectorAll('.stream')[1];
        if (first) nav.focus(first);
      },
      () => {
        if (sp.parentNode) body.removeChild(sp);
        body.appendChild(h('div.modal-text', { text: t('Não consegui falar com o servidor. Confira o endereço e se o CORS está ligado.') }));
      }
    );
  }
  load();
  return { el: el };
}

function SourceGrid(src) {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  el.appendChild(scroller);
  let kind = 'popular';
  let query = '';
  let page = 0;
  let more = null;
  const gridEl = h('div.grid');
  const bar = h('div.details-buttons', { 'data-group': '' });
  scroller.appendChild(h('div.row-title.catalog-title', { text: src.name }));
  scroller.appendChild(bar);
  scroller.appendChild(gridEl);

  function reload(k, q) {
    kind = k;
    query = q || '';
    page = 0;
    clear(gridEl);
    next();
  }
  bar.appendChild(h('div.btn.primary', { focusable: true, 'data-autofocus': '', onSelect: () => reload('popular') }, t('Populares')));
  if (src.latest) bar.appendChild(h('div.btn', { focusable: true, onSelect: () => reload('latest') }, t('Recentes')));
  bar.appendChild(h('div.btn', { focusable: true, onSelect: () => promptText(t('Buscar mangá'), '', '', (q) => reload('search', q)) }, [h('span.ico', { text: '🔍' }), t('Buscar mangá')]));

  function next() {
    if (more && more.parentNode) gridEl.removeChild(more);
    const sp = spinnerLine(t('Carregando...'));
    gridEl.appendChild(sp);
    const my = kind + query;
    sw.browse(src.id, kind, ++page, query).then(
      (r) => {
        if (my !== kind + query) return;
        if (sp.parentNode) gridEl.removeChild(sp);
        r.items.forEach((m) => gridEl.appendChild(card(m, { onSelect: () => router.push(SourceDetails(m)) })));
        if (!r.items.length && page === 1) gridEl.appendChild(h('div.modal-text', { text: t('Nada por aqui.') }));
        if (r.more) {
          more = h('div.card.see-all', { focusable: true, onSelect: () => next() }, [h('div.poster-wrap', null, h('div.see-all-label', null, [h('b', { text: '+' }), t('Carregar mais')])), h('div.name', { text: '' })]);
          gridEl.appendChild(more);
        }
        loadVisibleImages(el, 400);
      },
      () => {
        if (sp.parentNode) gridEl.removeChild(sp);
        toast(t('Não foi possível carregar agora.'));
      }
    );
  }
  next();
  return { el: el, onShow: () => loadVisibleImages(el, 400), onScroll: () => loadVisibleImages(el, 400) };
}

export function openSourceManga(m) {
  router.push(SourceDetails(m));
}

function SourceDetails(m) {
  const el = h('div.view.md-view');
  const info = h('div.md-info');
  const listEl = h('div.md-list', { 'data-scroll-y': '', 'data-pad-y': '120', 'data-group': '', 'data-vertical': '' });
  el.appendChild(info);
  el.appendChild(listEl);
  let chapters = [];
  let chunk = 0;
  let alive = true;
  const key = 'sw' + m.swId;
  const status = h('div.loading-line', { text: t('Procurando capítulos...') });
  const progress = () => (store.get('readProgress', {}) || {})[key] || null;
  const idxOf = () => {
    const p = progress();
    return p ? chapters.findIndex((c) => c.id === p.chapterId) : -1;
  };
  function read(i, page) {
    if (!chapters.length) return toast(t('Nenhum capítulo encontrado.'));
    openReader({ key: key, title: m.name, chapters: chapters, index: Math.max(0, i), startPage: page || 0, rtl: true, pagesFn: sw.pages, poster: m.poster, kind: 'sw', ref: m });
  }
  function renderInfo() {
    clear(info);
    const c = h('img.md-cover', { alt: '' });
    c.setAttribute('data-lazy', m.poster || '');
    info.appendChild(c);
    const text = h('div.md-text');
    text.appendChild(h('div.md-title', { text: m.name }));
    text.appendChild(h('div.md-meta', { text: [m.author, m.status, chapters.length ? t('{n} capítulos', { n: chapters.length }) : ''].filter(Boolean).join('  ·  ') }));
    text.appendChild(h('div.md-desc', { text: m.description }));
    const idx = idxOf();
    text.appendChild(
      h('div.details-buttons', { 'data-group': '' }, [
        h('div.btn.primary', { focusable: true, 'data-autofocus': '', onSelect: () => (idx >= 0 ? read(idx, progress().page) : read(0, 0)) }, [h('span.ico', { text: '📖' }), idx >= 0 ? t('Continuar: cap. {n}', { n: chapters[idx].chapter }) : t('Ler')]),
        h('div.btn', { focusable: true, onSelect: () => (shelf.toggleFav(key, 'sw', m), renderInfo()) }, [h('span.ico', { text: shelf.isFav(key) ? '♥' : '♡' }), shelf.isFav(key) ? t('Nos favoritos') : t('Favoritar')]),
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
          h('div.s-main', { text: (c.chapter !== null ? t('Cap. {n}', { n: c.chapter }) : t('Especial')) + (c.title ? ' · ' + c.title : '') }),
          c.scanlator ? h('span.s-tag', { text: c.scanlator }) : null,
          here ? h('span.s-tag.ok', { text: t('Parou aqui') }) : null,
        ])
      );
    }
    if (end < chapters.length) listEl.appendChild(jump(t('Capítulos {a}–{b}', { a: end + 1, b: Math.min(chapters.length, end + CHUNK) }) + ' ▶', chunk + 1));
  }
  renderInfo();
  renderList();
  sw.chapters(m.swId).then(
    (cs) => {
      if (!alive) return;
      chapters = cs;
      const i = idxOf();
      chunk = i >= 0 ? Math.floor(i / CHUNK) : 0;
      if (!cs.length) status.textContent = t('Nenhum capítulo encontrado.');
      renderInfo();
      renderList();
    },
    () => alive && (status.textContent = t('Não encontrei capítulos deste título agora.'))
  );
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
