// Collections: film series (MCU, X-Men, The Lord of the Rings...) in one place, in release order
// or in story order, with what you've already watched marked. Built-in list plus any TMDB
// collection (search, or the "Collection" button on a film's page).
import { h, clear, loadVisibleImages } from '../lib/dom.js';
import * as nav from '../lib/nav.js';
import * as store from '../lib/store.js';
import * as stremio from '../api/stremio.js';
import * as extras from '../api/extras.js';
import * as watched from '../lib/watched.js';
import { topbar, card, spinnerLine, toast, menu, confirmDialog, promptText } from '../ui.js';
import * as router from '../router.js';
import { openDetails } from './details.js';
import { t, current } from '../lib/i18n.js';
import { FRANCHISES, CATS, catOf, franchisesOf, findFranchise } from '../data/franchises.js';

const POSTER = (imdb) => 'https://images.metahub.space/poster/small/' + imdb + '/img';
const ORDER_KEY = 'franchiseOrder';

function displayName(f) {
  return current() === 'ar' && f.ar ? f.ar : f.name;
}

// ---------- Favorites: pinned to the top of the Collections tab (per profile) ----------
const FAV_KEY = 'franchiseFavs';

function favs() {
  return store.get(FAV_KEY, []) || [];
}

function isFav(id) {
  return favs().some((x) => x.id === id);
}

// Built-in ones are stored by id only; a TMDB collection keeps what's needed to show its card.
function toggleFav(f) {
  const list = favs();
  const i = list.findIndex((x) => x.id === f.id);
  if (i >= 0) list.splice(i, 1);
  else list.push(findFranchise(f.id) ? { id: f.id } : { id: f.id, name: f.name, poster: f.items[0][0] });
  store.set(FAV_KEY, list);
  return i < 0;
}

// Favorites in the order they were pinned, as { f (built-in) | stub, tmdbId }.
function favEntries() {
  return favs()
    .map((x) => {
      const f = findFranchise(x.id);
      if (f) return { f: f };
      const m = /^tmdb:(\d+)$/.exec(x.id);
      return m ? { f: { id: x.id, name: x.name, ar: x.name, items: [[x.poster]] }, tmdbId: Number(m[1]) } : null;
    })
    .filter(Boolean);
}

// ---------- Collections the user makes (per profile), like Nuvio's folders ----------
const MINE_KEY = 'myCollections';

export function myCollections() {
  return store.get(MINE_KEY, []) || [];
}

function saveMine(list) {
  store.set(MINE_KEY, list);
}

function newCollection(name, first) {
  const list = myCollections();
  const c = { id: 'my' + Date.now().toString(36), name: name, items: first ? [first] : [] };
  list.push(c);
  saveMine(list);
  return c;
}

function toggleInCollection(id, item) {
  const list = myCollections();
  const c = list.find((x) => x.id === id);
  if (!c) return false;
  const i = c.items.findIndex((x) => x.id === item.id);
  if (i >= 0) c.items.splice(i, 1);
  else c.items.push(item);
  saveMine(list);
  return i < 0;
}

// Details page "Collection" button: built-in/TMDB collections plus the user's own.
export function collectionMenu(meta, tmdbCollection) {
  const item = { id: meta.id, type: meta.type, name: meta.name, poster: meta.poster || '' };
  const opts = [];
  franchisesOf(meta.id).forEach((f) => opts.push({ label: displayName(f), sub: t('{n} títulos', { n: f.items.length }), value: { f: f } }));
  if (tmdbCollection && !franchisesOf(meta.id).some((f) => normalize(f.name) === normalize(tmdbCollection.name))) {
    opts.push({ label: tmdbCollection.name, sub: 'TMDB', value: { tmdb: tmdbCollection.id } });
  }
  myCollections().forEach((c) => {
    const inside = c.items.some((x) => x.id === meta.id);
    opts.push({ label: (inside ? '✓ ' : '+ ') + c.name, sub: inside ? t('Toque para tirar desta coleção') : t('Adicionar a esta coleção'), value: { mine: c.id } });
  });
  opts.push({ label: '+ ' + t('Nova coleção...'), value: { create: true } });
  menu(t('Coleções'), opts, {
    onPick: (v) => {
      if (v.f) return openFranchise(v.f);
      if (v.tmdb) return openTmdbCollection(v.tmdb);
      if (v.mine) {
        const c = myCollections().find((x) => x.id === v.mine);
        const added = toggleInCollection(v.mine, item);
        return toast(added ? t('Adicionado a "{name}"', { name: c.name }) : t('Removido de "{name}"', { name: c.name }));
      }
      promptText(t('Nome da nova coleção'), '', t('Ex.: Para ver no fim de semana'), (name) => {
        newCollection(name, item);
        toast(t('Coleção "{name}" criada', { name: name }));
      });
    },
  });
}

function MyCollectionView(id) {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const head = h('div.franchise-head');
  const filters = h('div.filters', { 'data-group': '' });
  const grid = h('div.grid');
  scroller.appendChild(head);
  scroller.appendChild(filters);
  scroller.appendChild(grid);
  el.appendChild(scroller);

  function render() {
    const c = myCollections().find((x) => x.id === id);
    if (!c) return router.pop();
    clear(head);
    head.appendChild(h('h1', { text: c.name }));
    head.appendChild(h('div.franchise-sub', { text: t('{n} títulos', { n: c.items.length }) + '  ·  ' + t('Coleção sua') }));
    clear(filters);
    filters.appendChild(
      h('div.chip', {
        focusable: true,
        text: t('Renomear'),
        onSelect: () =>
          promptText(t('Renomear'), c.name, '', (name) => {
            const list = myCollections();
            const x = list.find((y) => y.id === id);
            if (x) x.name = name;
            saveMine(list);
            render();
          }),
      })
    );
    filters.appendChild(
      h('div.chip', {
        focusable: true,
        text: t('Apagar coleção'),
        onSelect: () =>
          confirmDialog(t('Apagar a coleção "{name}"?', { name: c.name }), t('Apagar'), () => {
            saveMine(myCollections().filter((x) => x.id !== id));
            router.pop();
          }),
      })
    );
    clear(grid);
    c.items.forEach((it) =>
      grid.appendChild(
        card(
          { id: it.id, name: it.name, poster: it.poster || POSTER(it.id) },
          {
            badge: watched.isWatched(it.id) ? '✓' : '',
            onSelect: () =>
              menu(it.name, [
                { label: t('Abrir'), value: 'open' },
                { label: t('Tirar desta coleção'), value: 'remove' },
              ], {
                onPick: (v) => {
                  if (v === 'open') return openDetails(it.type, it.id);
                  toggleInCollection(id, it);
                  render();
                },
              }),
          }
        )
      )
    );
    if (!c.items.length) grid.appendChild(h('div.hint', { text: t('Vazia. Na página de um filme ou série, use o botão Coleção para adicionar.') }));
    loadVisibleImages(el, 400);
  }
  render();
  return { el: el, onShow: () => render() };
}

function isSeriesItem(it) {
  return it[3] === 's';
}

// Watched here (this TV / Trakt / Simkl) or flagged watched in the Stremio account.
function itemWatched(it) {
  if (isSeriesItem(it)) return false;
  if (watched.isWatched(it[0])) return true;
  const li = stremio.libraryItem(it[0]);
  return !!(li && li.state && (li.state.timesWatched > 0 || li.state.flaggedWatched));
}

function itemProgress(it) {
  const li = stremio.libraryItem(it[0]);
  if (li && li.state && li.state.timeOffset > 0 && li.state.duration > 0) return li.state.timeOffset / li.state.duration;
  return isSeriesItem(it) ? 0 : watched.progress(it[0]);
}

function watchedCount(f) {
  return f.items.filter(itemWatched).length;
}

function orderOf(f) {
  const all = store.get(ORDER_KEY, {}) || {};
  return f.chrono && all[f.id] === 'chrono' ? 'chrono' : 'release';
}

function setOrder(f, order) {
  const all = store.get(ORDER_KEY, {}) || {};
  all[f.id] = order;
  store.set(ORDER_KEY, all);
}

function ordered(f, order) {
  if (order !== 'chrono' || !f.chrono) return f.items.slice();
  const byId = {};
  f.items.forEach((it) => (byId[it[0]] = it));
  return f.chrono.map((id) => byId[id]).filter(Boolean);
}

export function openFranchise(f) {
  router.push(FranchiseView(f));
}

export function openTmdbCollection(id) {
  toast(t('Carregando coleção...'), 2500);
  extras
    .tmdbCollection(id)
    .then((f) => {
      if (!f.items.length) return toast(t('Nenhum título encontrado nesta coleção.'));
      openFranchise(f);
    })
    .catch(() => toast(t('Não foi possível carregar a coleção.')));
}

// Details page: the built-in franchise(s) this title is in (the MCU and Spider-Man share films).
export function openCollectionsFor(imdb, tmdbCollection) {
  const list = franchisesOf(imdb);
  if (list.length === 1 && !tmdbCollection) return openFranchise(list[0]);
  const opts = list.map((f) => ({ label: displayName(f), sub: t('{n} títulos', { n: f.items.length }), value: f }));
  if (tmdbCollection && !list.some((f) => normalize(f.name) === normalize(tmdbCollection.name))) {
    opts.push({ label: tmdbCollection.name, sub: 'TMDB', value: { tmdb: tmdbCollection.id } });
  }
  if (opts.length === 1 && opts[0].value.tmdb) return openTmdbCollection(opts[0].value.tmdb);
  menu(t('Coleções'), opts, { onPick: (v) => (v.tmdb ? openTmdbCollection(v.tmdb) : openFranchise(v)) });
}

export function hasCollection(imdb) {
  return franchisesOf(imdb).length > 0;
}

function normalize(s) {
  return String(s || '').toLowerCase().replace(/collection|coleção|سلسلة|[^a-z0-9]/g, '');
}

// ---------- Tab: every collection ----------
export function CollectionsView() {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const bar = topbar('collections', router.goTab);
  const searchBox = h('div.search-box');
  const results = h('div');
  const filterBox = h('div.filters', { 'data-group': '' });
  const mineBox = h('div');
  const favBox = h('div');
  const grid = h('div');
  scroller.appendChild(bar);
  scroller.appendChild(searchBox);
  scroller.appendChild(results);
  scroller.appendChild(filterBox);
  scroller.appendChild(mineBox);
  scroller.appendChild(favBox);
  scroller.appendChild(grid);
  el.appendChild(scroller);

  let activeCat = 'all';
  const CAT_TABS = [
    { id: 'all', label: 'Todos' },
    { id: 'heroes', label: 'Super-heróis e Grandes Sagas' },
    { id: 'movies', label: 'Filmes' },
    { id: 'series', label: 'Séries' },
    { id: 'cartoon', label: 'Desenhos animados' },
    { id: 'anime', label: 'Animes' },
    { id: 'mine', label: 'Minhas coleções' },
  ];

  function renderCategoryChips() {
    clear(filterBox);
    CAT_TABS.forEach((tab) => {
      filterBox.appendChild(
        h('div.chip', {
          focusable: true,
          cls: tab.id === activeCat ? 'active' : '',
          text: t(tab.label),
          onSelect: () => {
            activeCat = tab.id;
            renderCategoryChips();
            renderGrid();
          },
        })
      );
    });
  }

  if (extras.hasTmdb()) {
    const input = h('input.input', { type: 'text', placeholder: t('Buscar outra coleção (ex.: Shrek, Rambo, Saw)...'), focusable: true });
    input.__submit = (q) => search(q);
    searchBox.appendChild(input);
  } else {
    searchBox.appendChild(h('div.hint', { text: t('Com uma chave TMDB em Ajustes, dá para buscar qualquer outra coleção de filmes.') }));
  }

  let token = 0;
  function search(q) {
    const query = (q || '').trim();
    clear(results);
    if (query.length < 2) return;
    const my = ++token;
    results.appendChild(spinnerLine(t('Buscando "{q}"...', { q: query })));
    extras
      .searchCollections(query)
      .then((list) => {
        if (my !== token) return;
        clear(results);
        if (!list.length) {
          results.appendChild(h('div.hint', { text: t('Nenhuma coleção encontrada.') }));
          return;
        }
        results.appendChild(h('div.row-title', { text: t('Resultados') }));
        const track = h('div.row-track', { 'data-scroll-x': '', 'data-group': '' });
        list.forEach((c) => track.appendChild(card({ name: c.name, poster: c.poster }, { onSelect: () => openTmdbCollection(c.id) })));
        results.appendChild(h('div.row', null, track));
        loadVisibleImages(el, 400);
      })
      .catch(() => {
        if (my !== token) return;
        clear(results);
        results.appendChild(h('div.hint', { text: t('Não foi possível buscar agora.') }));
      });
  }

  function franchiseCard(f, tmdbId) {
    const done = tmdbId ? 0 : watchedCount(f);
    return card(
      { name: displayName(f), poster: POSTER(f.items[0][0]) },
      {
        badge: tmdbId ? '★' : (isFav(f.id) ? '★ ' : '') + (done ? done + '/' + f.items.length : String(f.items.length)),
        progress: done ? done / f.items.length : 0,
        onSelect: () => (tmdbId ? openTmdbCollection(tmdbId) : openFranchise(f)),
      }
    );
  }

  function renderMine() {
    clear(mineBox);
    mineBox.appendChild(h('div.row-title', { text: t('Minhas coleções') }));
    const g = h('div.grid.fav-grid');
    myCollections().forEach((c) => {
      const first = c.items[0];
      g.appendChild(
        card(
          { name: c.name, poster: first ? first.poster || POSTER(first.id) : '' },
          { badge: String(c.items.length), onSelect: () => router.push(MyCollectionView(c.id)) }
        )
      );
    });
    g.appendChild(
      h('div.card.see-all', {
        focusable: true,
        onSelect: () =>
          promptText(t('Nome da nova coleção'), '', t('Ex.: Para ver no fim de semana'), (name) => {
            const c = newCollection(name);
            renderMine();
            router.push(MyCollectionView(c.id));
          }),
      }, [h('div.poster-wrap', null, h('div.see-all-label', null, [h('b', { text: '+' }), t('Nova coleção')])), h('div.name', { text: '' })])
    );
    mineBox.appendChild(g);
  }

  function renderGrid() {
    clear(mineBox);
    clear(favBox);
    clear(grid);
    const showMine = activeCat === 'all' || activeCat === 'mine';
    if (showMine) {
      renderMine();
      const pinned = favEntries();
      if (pinned.length) {
        favBox.appendChild(h('div.row-title', { text: '★ ' + t('Favoritas') }));
        const fg = h('div.grid.fav-grid');
        pinned.forEach((e) => fg.appendChild(franchiseCard(e.f, e.tmdbId)));
        favBox.appendChild(fg);
      }
    }
    if (activeCat === 'mine') {
      loadVisibleImages(el, 400);
      return;
    }
    const pinned = favEntries();
    const pinnedIds = pinned.map((e) => e.f.id);
    const catsToShow = activeCat === 'all' ? CATS : CATS.filter((c) => c.id === activeCat);
    catsToShow.forEach((c) => {
      const list = FRANCHISES.filter((f) => (activeCat !== 'all' || pinnedIds.indexOf(f.id) < 0) && catOf(f) === c.id);
      if (!list.length) return;
      grid.appendChild(h('div.row-title.cat-title', { text: t(c.label) }));
      const g = h('div.grid');
      list.forEach((f) => g.appendChild(franchiseCard(f)));
      grid.appendChild(g);
    });
    loadVisibleImages(el, 400);
  }

  renderCategoryChips();
  renderGrid();

  return {
    el: el,
    onShow: () => {
      renderCategoryChips();
      renderGrid();
    },
    destroy: () => bar.__destroy && bar.__destroy(),
  };
}

// ---------- One collection ----------
function FranchiseView(f) {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const head = h('div.franchise-head');
  const filters = h('div.filters', { 'data-group': '' });
  const grid = h('div.grid');
  scroller.appendChild(head);
  scroller.appendChild(filters);
  scroller.appendChild(grid);
  el.appendChild(scroller);

  let order = orderOf(f);
  let hideWatched = false;
  let mediaFilter = 'all'; // 'all' | 'movies' | 'series'

  function nextUp(list) {
    return (
      list.find((it) => {
        if (mediaFilter === 'movies' && isSeriesItem(it)) return false;
        if (mediaFilter === 'series' && !isSeriesItem(it)) return false;
        return !itemWatched(it);
      }) || null
    );
  }

  function open(it) {
    openDetails(isSeriesItem(it) ? 'series' : 'movie', it[0]);
  }

  function render(keepFocus) {
    const list = ordered(f, order);
    const done = list.filter(itemWatched).length;
    clear(head);
    head.appendChild(h('h1', { text: displayName(f) }));
    head.appendChild(
      h('div.franchise-sub', {
        text:
          t('{n} títulos', { n: list.length }) +
          '  ·  ' +
          t('Assistidos: {done} de {n}', { done: done, n: list.length }) +
          (order === 'chrono' ? '  ·  ' + t('Ordem da história') : '  ·  ' + t('Ordem de lançamento')),
      })
    );

    clear(filters);
    const next = nextUp(list);
    if (next) {
      filters.appendChild(
        h('div.chip.primary-chip', { focusable: true, onSelect: () => open(next) }, '▶ ' + t('Próximo: {title}', { title: next[1] }))
      );
    }
    const chip = (key, label, active, onSelect) => {
      const c = h('div.chip', { focusable: true, cls: active ? 'active' : '', text: label, onSelect: onSelect });
      c.__key = key;
      return c;
    };
    const hasMovies = f.items.some((it) => !isSeriesItem(it));
    const hasSeries = f.items.some((it) => isSeriesItem(it));
    if (hasMovies && hasSeries) {
      filters.appendChild(
        chip('type_all', t('Todos'), mediaFilter === 'all', () => {
          mediaFilter = 'all';
          render('type_all');
        })
      );
      filters.appendChild(
        chip('type_movies', t('Só filmes'), mediaFilter === 'movies', () => {
          mediaFilter = 'movies';
          render('type_movies');
        })
      );
      filters.appendChild(
        chip('type_series', t('Só séries'), mediaFilter === 'series', () => {
          mediaFilter = 'series';
          render('type_series');
        })
      );
    }
    filters.appendChild(
      chip('release', t('Ordem de lançamento'), order === 'release', () => {
        order = 'release';
        setOrder(f, order);
        render('release');
      })
    );
    if (f.chrono) {
      filters.appendChild(
        chip('chrono', t('Ordem da história'), order === 'chrono', () => {
          order = 'chrono';
          setOrder(f, order);
          render('chrono');
        })
      );
    }
    filters.appendChild(
      chip('hide', t('Esconder assistidos'), hideWatched, () => {
        hideWatched = !hideWatched;
        render('hide');
      })
    );
    filters.appendChild(
      chip('fav', isFav(f.id) ? '★ ' + t('Fixada no topo') : '☆ ' + t('Fixar no topo'), isFav(f.id), () => {
        const on = toggleFav(f);
        toast(on ? t('Fixada no topo da aba Coleções') : t('Removida das favoritas'));
        render('fav');
      })
    );
    if (f.related && f.related.length) {
      f.related.forEach((relId) => {
        const relF = findFranchise(relId);
        if (relF) {
          filters.appendChild(
            chip('rel_' + relId, '🔗 ' + displayName(relF), false, () => router.push(FranchiseView(relF)))
          );
        }
      });
    }

    clear(grid);
    let count = 0;
    list.forEach((it, i) => {
      if (mediaFilter === 'movies' && isSeriesItem(it)) return;
      if (mediaFilter === 'series' && !isSeriesItem(it)) return;
      const seen = itemWatched(it);
      if (hideWatched && seen) return;
      count++;
      grid.appendChild(
        card(
          { name: it[1], poster: POSTER(it[0]) },
          {
            title: i + 1 + '. ' + it[1] + (isSeriesItem(it) ? ' · ' + t('série') : '') + ' (' + it[2] + ')',
            badge: seen ? '✓ ' + (i + 1) : String(i + 1),
            progress: seen ? 0 : itemProgress(it),
            onSelect: () => open(it),
          }
        )
      );
    });
    if (!grid.firstChild) grid.appendChild(h('div.hint', { text: t('Você já assistiu tudo desta coleção.') }));
    if (keepFocus) {
      const c = Array.prototype.find.call(filters.children, (x) => x.__key === keepFocus);
      if (c) nav.focus(c);
    }
    loadVisibleImages(el, 400);
  }

  render();

  return {
    el: el,
    onShow: () => render(),
  };
}
