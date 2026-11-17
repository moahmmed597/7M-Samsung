// Movies and Series tabs (idea from Harbor: one room per kind). Each shows the collections that belong to
// that kind (directors, actors, studios... for movies; services and networks for series) and the add-on
// catalogs of that type. Rows load only as they come into view, like the home screen.
import { h, clear, loadVisibleImages } from '../lib/dom.js';
import { topbar, spinnerLine } from '../ui.js';
import * as router from '../router.js';
import { t } from '../lib/i18n.js';
import * as addons from '../api/addons.js';
import * as nc from '../api/nuvioCollections.js';
import { collectionRows } from './nuvioHome.js';
import { buildRow } from './home.js';
import { SearchView } from './search.js';

// Collection groups shown in each tab (names as in collections/home.json).
export const MOVIE_GROUPS = ['Film Collections', 'Legendary Directors', 'Actors', 'Studios', 'By Decade', 'Awards', 'International Cinema', 'Documentaries'];
export const SERIES_GROUPS = ['Streaming Services', 'Networks', 'Reality TV'];
// Kept off the home screen (they live in the Movies / Series tabs now): the heaviest groups.


function TypeView(type) {
  const tab = type === 'movie' ? 'movies' : 'series';
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const bar = topbar(tab, router.goTab);
  const rows = h('div.rows');
  scroller.appendChild(bar);
  scroller.appendChild(h('div.row-title.catalog-title', { text: type === 'movie' ? t('Filmes') : t('Séries') }));
  scroller.appendChild(
    h('div.details-buttons', { 'data-group': '' }, [
      h('div.btn', { focusable: true, onSelect: () => router.push(SearchView(type)) }, [h('span.ico', { text: '🔍' }), type === 'movie' ? t('Buscar filmes') : t('Buscar séries')]),
    ])
  );
  scroller.appendChild(rows);
  el.appendChild(scroller);

  let pending = [];
  let active = 0;
  function loadNearby() {
    if (el.offsetParent === null) return;
    const limit = window.innerHeight * 2.2;
    for (let i = 0; i < pending.length && active < 2; i++) {
      const p = pending[i];
      if (p.state) continue;
      if (p.row.getBoundingClientRect().top > limit) break;
      p.state = 'loading';
      active++;
      Promise.resolve(p.load()).then(
        () => {
          p.state = 'done';
          active--;
          loadNearby();
        },
        () => {
          p.state = 'done';
          active--;
          loadNearby();
        }
      );
    }
  }

  let loaded = false;
  function render() {
    loaded = true;
    clear(rows);
    rows.appendChild(spinnerLine(t('Carregando catálogos...')));
    addons.load().then(() => {
      clear(rows);
      const cats = addons.boardCatalogs().filter((c) => c.catalog && c.catalog.type === type);
      pending = cats.map((c) => Object.assign(buildRow(c, rows), { state: '' }));
      const box = h('div');
      rows.appendChild(box);
      const groups = type === 'movie' ? MOVIE_GROUPS : SERIES_GROUPS;
      nc.load('home')
        .then((data) => {
          const list = collectionRows(box, data.filter((c) => groups.indexOf(c.t) >= 0)).map((x) => Object.assign(x, { state: '' }));
          pending = pending.concat(list);
          loadNearby();
        })
        .catch(() => {});
      loadNearby();
    });
  }

  return {
    el: el,
    onShow: () => {
      if (!loaded) render();
      loadNearby();
      loadVisibleImages(el);
    },
    onScroll: () => loadNearby(),
    freeMemory: () => {
      pending = [];
      clear(rows);
      loaded = false;
    },
    destroy: () => bar.__destroy && bar.__destroy(),
  };
}

export const MoviesView = () => TypeView('movie');
export const SeriesView = () => TypeView('series');
