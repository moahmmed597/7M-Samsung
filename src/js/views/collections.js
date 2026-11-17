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

export const POSTER = (imdb) => 'https://images.metahub.space/poster/small/' + imdb + '/img';
const ORDER_KEY = 'franchiseOrder';

export function displayName(f) {
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
            watched: watched.isWatched(it.id),
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

export function watchedCount(f) {
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
// Laid out like the Anime tab: rows you scroll sideways with wide picture tiles. At the top what is
// yours (sagas you are in the middle of, favourites, your own collections), then each category.
const BACKDROP = (imdb) => 'https://images.metahub.space/background/medium/' + imdb + '/img';

// A wide tile: the backdrop of a film of the saga, its name, how many titles and how far you got.
function collTile(o) {
  const art = h('div.ct-art');
  const im = h('img', { alt: '' });
  im.setAttribute('data-lazy', o.art);
  im.onerror = () => {
    if (o.fallback && im.src !== o.fallback) im.src = o.fallback;
    else im.style.display = 'none';
  };
  art.appendChild(im);
  art.appendChild(h('div.ct-shade'));
  if (o.star) art.appendChild(h('div.ct-star', { text: '★' }));
  art.appendChild(h('div.ct-name', { text: o.name }));
  art.appendChild(h('div.ct-sub', { text: o.sub || '' }));
  if (o.progress) {
    const bar = h('div.ct-bar');
    bar.style.width = Math.round(Math.min(1, o.progress) * 100) + '%';
    art.appendChild(bar);
  }
  return h('div.card.coll-tile', { focusable: true, onSelect: o.onSelect }, [art]);
}

// The film whose backdrop stands for the saga: the most famous is usually the first one.
function artOf(f) {
  const it = f.items.find((x) => /^tt\d+/.test(x[0])) || f.items[0];
  return it ? it[0] : '';
}

function franchiseTile(f, tmdbId) {
  const done = tmdbId ? 0 : watchedCount(f);
  const id = artOf(f);
  const isUrl = /^https?:/.test(id);
  return collTile({
    name: displayName(f),
    art: isUrl ? id : BACKDROP(id),
    fallback: isUrl ? '' : POSTER(id),
    sub: tmdbId ? t('Coleção do TMDB') : done ? t('Assistidos: {done} de {n}', { done: done, n: f.items.length }) : t('{n} títulos', { n: f.items.length }),
    progress: done ? done / f.items.length : 0,
    star: isFav(f.id),
    onSelect: () => (tmdbId ? openTmdbCollection(tmdbId) : openFranchise(f)),
  });
}

export function CollectionsView() {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const bar = topbar('collections', router.goTab);
  const head = h('div.coll-head');
  const results = h('div');
  const rows = h('div.rows');
  scroller.appendChild(bar);
  scroller.appendChild(head);
  scroller.appendChild(results);
  scroller.appendChild(rows);
  el.appendChild(scroller);

  function addRow(title, count, tiles) {
    if (!tiles.length) return;
    const track = h('div.row-track.coll-track', { 'data-scroll-x': '', 'data-group': '' }, tiles);
    rows.appendChild(h('div.row', { 'data-anchor': '30' }, [h('div.row-title', null, [title, count ? h('small', { text: count }) : null]), track]));
  }

  function newCollectionPrompt() {
    promptText(t('Nome da nova coleção'), '', t('Ex.: Para ver no fim de semana'), (name) => {
      const c = newCollection(name);
      router.push(MyCollectionView(c.id));
    });
  }

  function drawHead() {
    clear(head);
    head.appendChild(h('div.row-title.catalog-title', { text: t('Coleções') }));
    head.appendChild(
      h('div.details-buttons', { 'data-group': '' }, [
        h('div.btn', { focusable: true, onSelect: searchPrompt }, [h('span.ico', { text: '🔍' }), t('Buscar coleção')]),
        h('div.btn', { focusable: true, onSelect: newCollectionPrompt }, [h('span.ico', { text: '＋' }), t('Nova coleção')]),
      ])
    );
  }

  function searchPrompt() {
    if (!extras.hasTmdb()) return toast(t('Com uma chave TMDB em Ajustes, dá para buscar qualquer outra coleção de filmes.'), 6000);
    promptText(t('Buscar coleção'), '', t('Ex.: Shrek, Rambo, Saw'), (q) => search(q));
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
        if (!list.length) return results.appendChild(h('div.hint', { text: t('Nenhuma coleção encontrada.') }));
        const track = h('div.row-track', { 'data-scroll-x': '', 'data-group': '' });
        list.forEach((c) => track.appendChild(card({ name: c.name, poster: c.poster }, { onSelect: () => openTmdbCollection(c.id) })));
        results.appendChild(h('div.row', { 'data-anchor': '30' }, [h('div.row-title', { text: t('Resultados para "{q}"', { q: query }) }), track]));
        loadVisibleImages(el, 400);
        const first = track.querySelector('.card');
        if (first) nav.focus(first);
      })
      .catch(() => {
        if (my !== token) return;
        clear(results);
        results.appendChild(h('div.hint', { text: t('Não foi possível buscar agora.') }));
      });
  }

  const sig = () => JSON.stringify([FRANCHISES.map(watchedCount), favs(), myCollections().map((c) => [c.id, c.name, c.items.length])]);
  let lastSig = '';
  function render() {
    lastSig = sig();
    clear(rows);
    // Sagas you are in the middle of: the next film is one tap away.
    const going = FRANCHISES.map((f) => ({ f: f, done: watchedCount(f) }))
      .filter((x) => x.done > 0 && x.done < x.f.items.length)
      .sort((a, b) => b.done / b.f.items.length - a.done / a.f.items.length)
      .slice(0, 20);
    addRow(t('Continue a saga'), '', going.map((x) => franchiseTile(x.f)));
    const pinned = favEntries();
    addRow('★ ' + t('Favoritas'), '', pinned.map((e) => franchiseTile(e.f, e.tmdbId)));
    // Your own collections, and a tile to make a new one.
    const mine = myCollections().map((c) => {
      const first = c.items[0];
      const id = first ? first.id : '';
      return collTile({
        name: c.name,
        art: /^tt\d+/.test(id) ? BACKDROP(id) : (first && first.poster) || '',
        fallback: first ? first.poster || POSTER(id) : '',
        sub: t('{n} títulos', { n: c.items.length }) + '  ·  ' + t('Coleção sua'),
        onSelect: () => router.push(MyCollectionView(c.id)),
      });
    });
    mine.push(
      h('div.card.coll-tile.coll-new', { focusable: true, onSelect: newCollectionPrompt }, [
        h('div.ct-art', null, [h('div.ct-plus', { text: '+' }), h('div.ct-name', { text: t('Nova coleção') })]),
      ])
    );
    addRow(t('Minhas coleções'), '', mine);
    CATS.forEach((c) => {
      const list = FRANCHISES.filter((f) => catOf(f) === c.id);
      addRow(t(c.label), t('{n} coleções', { n: list.length }), list.map((f) => franchiseTile(f)));
    });
    loadVisibleImages(el, 400);
  }

  drawHead();
  render();

  return {
    el: el,
    onShow: () => {
      // Back from a collection: redraw only when something changed (keeps your place otherwise).
      if (sig() !== lastSig) render();
      loadVisibleImages(el, 400);
    },
    onScroll: () => loadVisibleImages(el, 400),
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
  let sagaFilter = 'all'; // for mcu: 'all' | 'mcu_core' | 'xmen' | 'spiderman'

  const XMEN_IDS = new Set([
    'tt0120903', 'tt0290334', 'tt0376994', 'tt0458525', 'tt1270798', 'tt1430132',
    'tt1877832', 'tt1431045', 'tt3385516', 'tt3315342', 'tt5463162', 'tt6565702',
    'tt4682266', 'tt6263850'
  ]);
  const SPIDEY_LEGACY_IDS = new Set([
    'tt0145487', 'tt0316654', 'tt0413300', 'tt0948470', 'tt1872181'
  ]);
  const SPIDEY_ALL_IDS = new Set([
    'tt0145487', 'tt0316654', 'tt0413300', 'tt0948470', 'tt1872181',
    'tt2250912', 'tt6320628', 'tt10872600'
  ]);

  function matchSaga(id) {
    if (f.id !== 'mcu' || sagaFilter === 'all') return true;
    if (sagaFilter === 'xmen') return XMEN_IDS.has(id);
    if (sagaFilter === 'spiderman') return SPIDEY_ALL_IDS.has(id);
    if (sagaFilter === 'mcu_core') return (!XMEN_IDS.has(id) || id === 'tt6263850') && !SPIDEY_LEGACY_IDS.has(id);
    return true;
  }

  function nextUp(list) {
    return (
      list.find((it) => {
        if (!matchSaga(it[0])) return false;
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
    if (f.id === 'mcu') {
      filters.appendChild(
        chip('saga_all', t('Todos'), sagaFilter === 'all', () => {
          sagaFilter = 'all';
          render('saga_all');
        })
      );
      filters.appendChild(
        chip('saga_mcu', t('Marvel Studios'), sagaFilter === 'mcu_core', () => {
          sagaFilter = 'mcu_core';
          render('saga_mcu');
        })
      );
      filters.appendChild(
        chip('saga_xmen', 'X-Men', sagaFilter === 'xmen', () => {
          sagaFilter = 'xmen';
          render('saga_xmen');
        })
      );
      filters.appendChild(
        chip('saga_spidey', 'Spider-Man', sagaFilter === 'spiderman', () => {
          sagaFilter = 'spiderman';
          render('saga_spidey');
        })
      );
    }
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
      if (!matchSaga(it[0])) return;
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
