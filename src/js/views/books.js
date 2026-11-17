// Books tab, built like Manga and Comics: your shelves (continue reading, favourites), rows from your own
// book sources, genres as tiles and the Open Library catalog. A book from the catalog looks itself up in
// your sources (the one with the most chapters wins, 📚 to choose) and opens in the same reader: the
// plugins draw each page of text as a picture (16:9), so the reader turns pages like a comic.
import { h, clear, loadVisibleImages } from '../lib/dom.js';
import * as nav from '../lib/nav.js';
import * as store from '../lib/store.js';
import * as ol from '../api/openlibrary.js';
import * as pl from '../api/plugins.js';
import { topbar, card, spinnerLine, toast, promptText, menu } from '../ui.js';
import * as router from '../router.js';
import { t } from '../lib/i18n.js';
import { tileRow, setTileArt } from './anime.js';
import { openSources, openSourceManga, sourceRows, searchPlugin } from './sources.js';
import { openReader, readingModeMenu, readingModeLabel } from './reader.js';
import * as shelf from '../lib/mangaLib.js';
import { holdMenu } from './continueRow.js';
import { chapterSearchRow, focusChapter } from '../lib/chapterJump.js';
import { scanSources, linkOf, norm } from '../lib/sourceFind.js';

// Open Library subjects: [subject, Portuguese label for t()]
const GENRES = [
  ['fantasy', 'Fantasia'], ['science_fiction', 'Ficção científica'], ['mystery', 'Mistério'], ['thriller', 'Suspense'],
  ['romance', 'Romance'], ['horror', 'Terror'], ['history', 'História'], ['biography', 'Biografias'],
  ['self-help', 'Autoajuda'], ['philosophy', 'Filosofia'], ['young_adult_fiction', 'Jovem adulto'], ['classics', 'Clássicos'],
];
const MONTH = 30 * 864e5;

// One cover per genre tile (the top book of that subject), kept for a month.
function genreArt(row) {
  const cached = store.get('bookGenreArt', null);
  const urls = cached && cached.at > Date.now() - MONTH && cached.urls ? cached.urls.slice() : [];
  let i = 0;
  let changed = false;
  const lane = () => {
    while (i < GENRES.length && urls[i]) i++;
    if (i >= GENRES.length) return Promise.resolve();
    const k = i++;
    return ol
      .subject(GENRES[k][0], 0)
      .then((r) => {
        const b = r.items[0];
        if (b && b.poster) {
          urls[k] = b.poster.replace('-M.jpg', '-L.jpg');
          changed = true;
          setTileArt(row, urls);
        }
      }, () => {})
      .then(lane);
  };
  setTileArt(row, urls);
  Promise.all([lane(), lane()]).then(() => changed && store.set('bookGenreArt', { at: Date.now(), urls: urls }));
}

function posterRow(parent, title, load, onMore) {
  const row = h('div.row', { 'data-anchor': '30' });
  const track = h('div.row-track.pending', { 'data-scroll-x': '', 'data-group': '' }, spinnerLine(t('Carregando...')));
  row.appendChild(h('div.row-title', { text: title }));
  row.appendChild(track);
  parent.appendChild(row);
  return {
    row: row,
    started: false,
    load: () =>
      load()
        .then((items) => {
          clear(track);
          track.classList.remove('pending');
          if (!items.length) return row.parentNode && parent.removeChild(row);
          items.slice(0, 20).forEach((m) => track.appendChild(card(m, { onSelect: () => openBookDetails(m) })));
          if (onMore)
            track.appendChild(
              h('div.card.see-all', { focusable: true, onSelect: onMore }, [h('div.poster-wrap', null, h('div.see-all-label', null, [h('b', { text: '→' }), t('Ver tudo')])), h('div.name', { text: '' })])
            );
          loadVisibleImages(row);
        })
        .catch(() => row.parentNode && parent.removeChild(row)),
  };
}

export function BooksView() {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const bar = topbar('books', router.goTab);
  const rows = h('div.rows');
  scroller.appendChild(bar);
  scroller.appendChild(
    h('div.details-buttons', { 'data-group': '' }, [
      h('div.btn', { focusable: true, onSelect: search }, [h('span.ico', { text: '🔍' }), t('Buscar livros')]),
      h('div.btn', { focusable: true, onSelect: () => openSources('books') }, [h('span.ico', { text: '📚' }), t('Minhas fontes')]),
    ])
  );
  const shelves = h('div');
  scroller.appendChild(shelves);
  scroller.appendChild(rows);
  el.appendChild(scroller);

  function search() {
    promptText(t('Buscar livros'), '', t('Título ou autor'), (q) => q.trim() && router.push(BookGridView('🔍 ' + q.trim(), (n) => ol.search(q.trim(), n))));
  }

  function drawShelves() {
    clear(shelves);
    const mk = (title, list) => {
      if (!list.length) return;
      const track = h('div.row-track', { 'data-scroll-x': '', 'data-group': '' });
      list.forEach((x) => {
        const open = () => (x.ref.olKey ? openBookDetails(Object.assign({ id: 'ol:' + x.ref.olKey, type: 'book' }, x.ref)) : openSourceManga(x.ref));
        const c = card({ id: x.key, name: x.name, poster: x.poster }, { onSelect: open });
        if (x.cont) c.__long = holdMenu(x.name, open, () => (shelf.forget(x.key), toast(t('Tirado de Continuar lendo.')), drawShelves()), t('Tirar de Continuar lendo'));
        track.appendChild(c);
      });
      shelves.appendChild(h('div.row', { 'data-anchor': '30' }, [h('div.row-title', { text: title }), track]));
      loadVisibleImages(track);
    };
    mk(t('Continuar lendo'), shelf.continueList(60).filter((p) => shelf.tabOf(p) === 'books').slice(0, 15).map((p) => ({ cont: true, key: p.key, ref: p.ref, name: (p.title || '') + ' · ' + t('Cap. {n}', { n: p.chapter }), poster: p.poster })));
    mk(t('Favoritos'), shelf.favs().filter((f) => shelf.tabOf(f) === 'books').map((f) => ({ key: f.key, ref: f.ref, name: f.ref.name, poster: f.ref.poster })));
  }
  drawShelves();

  const pending = [];
  function loadNearby() {
    const top = scroller.scrollTop + (window.innerHeight || 1080) * 2;
    pending.forEach((r) => {
      if (!r.started && r.row.offsetTop < top) {
        r.started = true;
        r.load();
      }
    });
  }
  // Your sources first (all readable), then the Open Library catalog.
  sourceRows(rows, 'books').forEach((r) => pending.push(r));
  if (pending.length) rows.appendChild(h('div.row-title.src-rows-title', { text: t('Catálogo') }));
  pending.push(posterRow(rows, t('Em alta hoje'), () => ol.trending('daily')));
  const genreRow = tileRow(rows, t('Gêneros'), GENRES.map((g) => ({ label: t(g[1]), open: () => router.push(BookGridView(t(g[1]), (n) => ol.subject(g[0], n))) })), 'discover');
  genreArt(genreRow);
  pending.push(posterRow(rows, t('Em alta na semana'), () => ol.trending('weekly')));
  pending.push(posterRow(rows, t('Livros em árabe'), () => ol.search('language:ara', 0).then((r) => r.items), () => router.push(BookGridView(t('Livros em árabe'), (n) => ol.search('language:ara', n)))));
  [['fantasy', 'Fantasia'], ['mystery', 'Mistério'], ['science_fiction', 'Ficção científica']].forEach((g) =>
    pending.push(posterRow(rows, t(g[1]), () => ol.subject(g[0], 0).then((r) => r.items), () => router.push(BookGridView(t(g[1]), (n) => ol.subject(g[0], n)))))
  );
  setTimeout(loadNearby, 50);

  return {
    el: el,
    onShow: () => {
      drawShelves();
      loadNearby();
      loadVisibleImages(el);
    },
    onScroll: () => loadNearby(),
    destroy: () => bar.__destroy && bar.__destroy(),
  };
}

// A grid of books; pageOf(n) → { items, more }.
function BookGridView(title, pageOf) {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const gridEl = h('div.grid');
  scroller.appendChild(h('div.row-title.catalog-title', { text: title }));
  scroller.appendChild(gridEl);
  el.appendChild(scroller);
  let n = 0;
  let more = null;
  const seen = {};
  function next() {
    if (more && more.parentNode) gridEl.removeChild(more);
    gridEl.appendChild(spinnerLine(t('Carregando...')));
    pageOf(n++)
      .then((r) => {
        const sp = gridEl.querySelector('.loading-line');
        if (sp) gridEl.removeChild(sp);
        r.items.forEach((m) => {
          if (seen[m.id]) return;
          seen[m.id] = true;
          gridEl.appendChild(card(m, { onSelect: () => openBookDetails(m) }));
        });
        if (!gridEl.querySelector('.card')) gridEl.appendChild(h('div.modal-text', { text: t('Nada por aqui.') }));
        if (r.more) {
          more = h('div.card.see-all', { focusable: true, onSelect: () => next() }, [h('div.poster-wrap', null, h('div.see-all-label', null, [h('b', { text: '+' }), t('Carregar mais')])), h('div.name', { text: '' })]);
          gridEl.appendChild(more);
        }
        loadVisibleImages(el, 400);
        if (n === 1) {
          const first = gridEl.querySelector('.card');
          if (first) nav.focus(first);
        }
      })
      .catch(() => {
        const sp = gridEl.querySelector('.loading-line');
        if (sp) gridEl.removeChild(sp);
        toast(t('Não foi possível carregar agora.'));
      });
  }
  next();
  return { el: el, onShow: () => loadVisibleImages(el, 400), onScroll: () => loadVisibleImages(el, 400) };
}

// ---------- one book ----------
const CHUNK = 50;
function links() {
  return store.get('bookLinks', {}) || {};
}
function saveLink(id, v) {
  const all = links();
  if (v) all[id] = v;
  else delete all[id];
  store.set('bookLinks', all);
}

export function openBookDetails(m) {
  router.push(BookDetailsView(m));
}

function BookDetailsView(m0) {
  const m = Object.assign({}, m0);
  const key = 'ol' + m.olKey;
  const el = h('div.view.md-view');
  const info = h('div.md-info');
  const list = h('div.md-list', { 'data-scroll-y': '', 'data-pad-y': '120', 'data-group': '', 'data-vertical': '' });
  el.appendChild(info);
  el.appendChild(list);
  let chapters = [];
  let chunk = 0;
  let alive = true;
  let source = null;
  let found = null;
  let scanning = null;
  let picked = false;
  const status = h('div.loading-line', { text: t('Procurando nas suas fontes...') });
  const progress = () => (store.get('readProgress', {}) || {})[key] || null;
  const langOf = (pid) => ((pl.installed().find((p) => p.id === pid) || {}).lang || '');

  function indexOfProgress() {
    const p = progress();
    if (!p) return -1;
    const i = chapters.findIndex((c) => c.id === p.chapterId);
    if (i >= 0 || p.chapter == null) return i;
    return chapters.findIndex((c) => c.chapter != null && String(c.chapter) === String(p.chapter));
  }

  function read(index, page) {
    if (!chapters.length) return toast(t('Nenhum capítulo encontrado.'));
    openReader({
      key: key,
      title: m.name,
      chapters: chapters,
      index: Math.max(0, index),
      startPage: page || 0,
      poster: m.poster,
      kind: 'ol',
      ref: { olKey: m.olKey, name: m.name, title: m.title, poster: m.poster, author: m.author, tab: 'books' },
      rtl: source ? /^ar/i.test(langOf(source.pid)) : false,
      pagesFn: source ? (cid) => pl.pages(source.pid, cid) : undefined,
    });
  }

  function renderInfo() {
    clear(info);
    const cover = h('img.md-cover', { alt: '' });
    cover.setAttribute('data-lazy', m.cover || m.poster || '');
    info.appendChild(cover);
    const text = h('div.md-text');
    text.appendChild(h('div.md-title', { text: m.name }));
    text.appendChild(h('div.md-meta', { text: [m.author, m.year, (m.subjects || []).slice(0, 3).join(', ')].filter(Boolean).join('  ·  ') }));
    text.appendChild(h('div.md-desc', { text: String(m.description || '').replace(/\[\d+\]|\(\[source\][^)]*\)/g, '').trim() }));
    const p = progress();
    const idx = indexOfProgress();
    const btns = [
      h('div.btn.primary', { focusable: true, 'data-autofocus': '', onSelect: () => (idx >= 0 ? read(idx, p.page) : read(0, 0)) }, [h('span.ico', { text: '📖' }), idx >= 0 ? t('Continuar: cap. {n}', { n: chapters[idx].chapter }) : t('Ler')]),
      h('div.btn', { focusable: true, onSelect: () => (shelf.toggleFav(key, 'ol', Object.assign({}, m, { tab: 'books' })), renderInfo()) }, [h('span.ico', { text: shelf.isFav(key) ? '♥' : '♡' }), shelf.isFav(key) ? t('Nos favoritos') : t('Favoritar')]),
    ];
    if (pl.installed('books').length) btns.push(h('div.btn', { focusable: true, onSelect: pickSource }, [h('span.ico', { text: '📚' }), source ? source.name : t('Fonte')]));
    btns.push(h('div.btn', { focusable: true, onSelect: () => readingModeMenu(() => renderInfo()) }, [h('span.ico', { text: readingModeLabel().icon }), readingModeLabel().text]));
    text.appendChild(h('div.details-buttons', { 'data-group': '' }, btns));
    info.appendChild(text);
    loadVisibleImages(info);
  }

  function renderList() {
    clear(list);
    if (!chapters.length) return list.appendChild(status);
    const start = chunk * CHUNK;
    const end = Math.min(chapters.length, start + CHUNK);
    const p = progress();
    const nav2 = (label, to) => h('div.stream.md-nav', { focusable: true, onSelect: () => ((chunk = to), renderList()) }, [h('div.s-main', { text: label })]);
    if (chapters.length > 8) list.appendChild(chapterSearchRow(() => chapters, (i) => ((chunk = Math.floor(i / CHUNK)), renderList(), focusChapter(list, i))));
    if (chunk > 0) list.appendChild(nav2('◀ ' + t('Capítulos {a}–{b}', { a: (chunk - 1) * CHUNK + 1, b: chunk * CHUNK }), chunk - 1));
    for (let i = start; i < end; i++) {
      const c = chapters[i];
      const here = p && p.chapterId === c.id;
      list.appendChild(
        h('div.stream', { focusable: true, 'data-ci': String(i), onSelect: () => read(i, here ? p.page : 0) }, [
          h('div.s-main', { text: (c.chapter != null ? t('Cap. {n}', { n: c.chapter }) : '') + (c.title ? (c.chapter != null ? ' · ' : '') + c.title : '') }),
          here ? h('span.s-tag.ok', { text: t('Parou aqui') }) : null,
        ])
      );
    }
    if (end < chapters.length) list.appendChild(nav2(t('Capítulos {a}–{b}', { a: end + 1, b: Math.min(chapters.length, end + CHUNK) }) + ' ▶', chunk + 1));
  }

  function showSource(ln, cs) {
    source = ln;
    chapters = cs;
    const idx = indexOfProgress();
    chunk = idx >= 0 ? Math.floor(idx / CHUNK) : 0;
    renderInfo();
    renderList();
  }

  function noSources(text) {
    status.textContent = text;
    renderInfo();
    renderList();
    list.appendChild(h('div.stream', { focusable: true, onSelect: () => openSources('books') }, [h('div.s-main', { text: '📚 ' + t('Minhas fontes') })]));
    pl.installed('books').forEach((p) => list.appendChild(h('div.stream', { focusable: true, onSelect: () => searchPlugin(p.id, p.name, m.title) }, [h('div.s-main', { text: '🔎 ' + t('Buscar em {name}', { name: p.name }) })])));
  }

  function scan(onHit) {
    if (!scanning)
      scanning = scanSources([m.title], onHit, { alive: () => alive, min: 0.8, kind: 'books' }).then((all) => {
        found = all;
        return all;
      });
    return scanning;
  }

  function load() {
    if (!pl.installed('books').length) return noSources(t('Para ler, adicione suas fontes de livros em Minhas fontes.'));
    const ln = links()[m.olKey];
    if (ln) {
      status.textContent = t('Carregando capítulos de {name}...', { name: ln.name });
      return pl
        .chapters(ln.pid, ln.mid)
        .then((cs) => {
          if (!alive) return;
          if (!cs.length) throw new Error('empty');
          showSource(ln, cs);
        })
        .catch(() => {
          if (!alive) return;
          saveLink(m.olKey, null);
          autoFind();
        });
    }
    autoFind();
  }

  function autoFind() {
    status.textContent = t('Procurando nas suas fontes...');
    renderList();
    scan((hit) => {
      if (!source && !picked) showSource(linkOf(hit), hit.cs);
    }).then((all) => {
      if (!alive) return;
      if (!all.length) return noSources(t('Não encontrei este título nas suas fontes.'));
      if (picked) return;
      const best = all[0];
      saveLink(m.olKey, linkOf(best));
      if (!source || source.pid !== best.pid) showSource(linkOf(best), best.cs);
      if (all.length > 1) toast(t('Achei em {n} fontes. Troque no botão 📚.', { n: all.length }), 5000);
    });
  }

  function pickSource() {
    if (!found) {
      toast(t('Procurando nas suas fontes...'), 4000);
      return scan().then(() => alive && pickSource());
    }
    const items = found.map((hit) => ({ label: hit.name, sub: t('{n} capítulos', { n: hit.count }) + (norm(hit.title) !== norm(m.title) ? '  ·  ' + hit.title : ''), value: hit, checked: !!source && source.pid === hit.pid }));
    items.push({ label: '🔎 ' + t('Buscar manualmente'), sub: t('Procure com outro nome numa fonte'), value: 'manual' });
    menu(t('Fonte dos capítulos'), items, {
      onPick: (v) => {
        picked = true;
        if (v === 'manual') return menu(t('Buscar manualmente'), pl.installed('books').map((p) => ({ label: t('Buscar em {name}', { name: p.name }), value: p })), { onPick: (p) => searchPlugin(p.id, p.name, m.title) });
        saveLink(m.olKey, Object.assign(linkOf(v), { manual: true }));
        showSource(linkOf(v), v.cs);
      },
    });
  }

  renderInfo();
  load();
  ol.work(m.olKey)
    .then((w) => {
      if (!alive) return;
      Object.assign(m, { description: w.description, subjects: w.subjects, cover: w.cover || '' });
      renderInfo();
    })
    .catch(() => {});

  return {
    el: el,
    onShow: () => {
      if (chapters.length) {
        renderInfo();
        renderList();
      }
      loadVisibleImages(el);
    },
    destroy: () => {
      alive = false;
    },
  };
}
