// Collections: film series (MCU, X-Men, The Lord of the Rings...) in one place, in release order
// or in story order, with what you've already watched marked. Built-in list plus any TMDB
// collection (search, or the "Collection" button on a film's page).
import { h, clear, loadVisibleImages } from '../lib/dom.js';
import * as nav from '../lib/nav.js';
import * as store from '../lib/store.js';
import * as stremio from '../api/stremio.js';
import * as extras from '../api/extras.js';
import * as watched from '../lib/watched.js';
import { topbar, card, spinnerLine, toast, menu } from '../ui.js';
import * as router from '../router.js';
import { openDetails } from './details.js';
import { t, current } from '../lib/i18n.js';
import { FRANCHISES, CATS, catOf, franchisesOf, findFranchise } from '../data/franchises.js';

const POSTER = (imdb) => 'https://images.metahub.space/poster/medium/' + imdb + '/img';
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
  const favBox = h('div');
  const grid = h('div');
  scroller.appendChild(bar);
  scroller.appendChild(searchBox);
  scroller.appendChild(results);
  scroller.appendChild(favBox);
  scroller.appendChild(h('div.row-title', { text: t('Coleções') }));
  scroller.appendChild(grid);
  el.appendChild(scroller);

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

  function renderGrid() {
    clear(favBox);
    const pinned = favEntries();
    if (pinned.length) {
      favBox.appendChild(h('div.row-title', { text: '★ ' + t('Favoritas') }));
      const fg = h('div.grid.fav-grid');
      pinned.forEach((e) => fg.appendChild(franchiseCard(e.f, e.tmdbId)));
      favBox.appendChild(fg);
    }
    clear(grid);
    const pinnedIds = pinned.map((e) => e.f.id);
    CATS.forEach((c) => {
      const list = FRANCHISES.filter((f) => pinnedIds.indexOf(f.id) < 0 && catOf(f) === c.id);
      if (!list.length) return;
      grid.appendChild(h('div.row-title.cat-title', { text: t(c.label) }));
      const g = h('div.grid');
      list.forEach((f) => g.appendChild(franchiseCard(f)));
      grid.appendChild(g);
    });
    loadVisibleImages(el, 400);
  }

  renderGrid();

  return {
    el: el,
    onShow: () => renderGrid(),
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

  function nextUp(list) {
    return list.find((it) => !itemWatched(it)) || null;
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

    clear(grid);
    list.forEach((it, i) => {
      const seen = itemWatched(it);
      if (hideWatched && seen) return;
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
