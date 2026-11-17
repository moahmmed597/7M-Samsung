// Busca em todos os catálogos de addons que aceitam "search".
import { h, clear, loadVisibleImages } from '../lib/dom.js';
import * as nav from '../lib/nav.js';
import * as addons from '../api/addons.js';
import { topbar, card, spinnerLine } from '../ui.js';
import * as router from '../router.js';
import { openDetails } from './details.js';
import { t } from '../lib/i18n.js';
import * as extras from '../api/extras.js';
import { PersonView } from './person.js';
import * as store from '../lib/store.js';
import * as links2 from '../lib/crossLinks.js';
import { mangaMeta } from '../lib/animeLink.js';
import { openMangaDetails } from './mangaDetails.js';
import * as ol from '../api/openlibrary.js';
import { openBookDetails } from './books.js';
import * as cv from '../api/comicvine.js';
import { openComicDetails } from './comicDetails.js';

// only: 'movie' or 'series' to search one kind (the Search button of the Movies / Series tabs).
export function SearchView(only) {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const bar = topbar(only === 'movie' ? 'movies' : only === 'series' ? 'series' : 'search', router.goTab);
  const input = h('input.input', { type: 'text', placeholder: only === 'movie' ? t('Buscar filmes...') : only === 'series' ? t('Buscar séries...') : t('Buscar filmes e séries...'), focusable: true, 'data-autofocus': '' });
  const results = h('div.rows');
  scroller.appendChild(bar);
  const history = h('div.filters.search-history', { 'data-group': '' });
  scroller.appendChild(h('div.search-box', null, input));
  scroller.appendChild(history);
  scroller.appendChild(results);
  el.appendChild(scroller);

  let token = 0;
  input.__submit = (q) => run(q);

  // Recent searches (Settings → Appearance), per profile.
  const HIST = 'searchHistory';
  function renderHistory() {
    clear(history);
    if (store.settings().searchHistory === false) return;
    const list = store.get(HIST, []) || [];
    if (!list.length) return;
    history.appendChild(h('span.hist-label', { text: t('Buscas recentes:') }));
    list.forEach((q) =>
      history.appendChild(
        h('div.chip', {
          focusable: true,
          text: q,
          onSelect: () => {
            input.value = q;
            run(q);
          },
        })
      )
    );
    history.appendChild(
      h('div.chip', {
        focusable: true,
        text: '✕ ' + t('Limpar'),
        onSelect: () => {
          store.set(HIST, []);
          renderHistory();
        },
      })
    );
  }
  function remember(q) {
    if (store.settings().searchHistory === false) return;
    const list = (store.get(HIST, []) || []).filter((x) => x.toLowerCase() !== q.toLowerCase());
    list.unshift(q);
    store.set(HIST, list.slice(0, 8));
    renderHistory();
  }
  renderHistory();

  function run(q) {
    const query = (q || '').trim();
    clear(results);
    if (query.length < 2) {
      results.appendChild(h('div.hint', { text: t('Digite pelo menos 2 letras e confirme no teclado.') }));
      return;
    }
    const my = ++token;
    remember(query);
    results.appendChild(spinnerLine(t('Buscando "{q}"...', { q: query })));
    // People first: a row of actors/directors (TMDB), each opening their profile.
    const people = h('div.row.people-row', { 'data-anchor': '30' });
    extras
      .searchPeople(query)
      .then((list) => {
        if (my !== token || !list.length) return;
        people.appendChild(h('div.row-title', { text: t('Pessoas') }));
        people.appendChild(
          h(
            'div.row-track',
            { 'data-scroll-x': '', 'data-group': '' },
            list.map((p) =>
              h('div.cast.person-card', { focusable: true, onSelect: () => router.push(PersonView(p.id, p.name)) }, [
                h('div.ph', null, h('img', { src: p.photo, alt: '' })),
                h('div.nm', { text: p.name }),
              ])
            )
          )
        );
        results.insertBefore(people, results.firstChild);
      })
      .catch(() => {});
    addons.load().then(() => {
      if (my !== token) return;
      clear(results);
      if (people.firstChild) results.appendChild(people);
      const cats = addons.searchCatalogs().filter((c) => !only || (c.catalog && c.catalog.type === only));
      if (!cats.length) results.appendChild(h('div.hint', { text: t('Nenhum addon com busca instalado.') }));
      let found = 0;
      let pending = cats.length;
      // The whole app, not only films and shows: the same story as manga, book or comic (below).
      let tail = null;
      if (!only) {
        tail = h('div');
        results.appendChild(tail);
        const extra = (title, load, open) => {
          const row = h('div.row', { 'data-anchor': '30' });
          const track = h('div.row-track', { 'data-scroll-x': '', 'data-group': '' });
          row.appendChild(h('div.row-title', { text: title }));
          row.appendChild(track);
          return load()
            .then((list) => {
              if (my !== token || !list.length) return;
              list.slice(0, 20).forEach((m) => track.appendChild(card(m, { onSelect: () => open(m) })));
              tail.appendChild(row);
              loadVisibleImages(row);
            })
            .catch(() => {});
        };
        extra(t('Mangá'), () => links2.searchAniList(query, 'MANGA').then((l) => l.filter((n) => n.format !== 'NOVEL').map(mangaMeta)), openMangaDetails)
          .then(() => extra(t('Livros'), () => ol.search(query, 0).then((r) => r.items), openBookDetails))
          .then(() => cv.hasKey() && extra(t('Quadrinhos'), () => cv.searchVolumes(query, 0).then((r) => r.items), openComicDetails));
      }
      cats.forEach((entry) => {
        const row = h('div.row', { 'data-anchor': '30' });
        const track = h('div.row-track', { 'data-scroll-x': '', 'data-group': '' });
        row.appendChild(h('div.row-title', null, [entry.catalog.name || entry.catalog.id, h('small', { text: addons.catalogTitle(entry).split(' · ').pop() })]));
        row.appendChild(track);
        addons
          .fetchCatalog(entry, { search: query })
          .then((metas) => {
            if (my !== token || !metas.length) return;
            found++;
            metas.slice(0, 30).forEach((m) => track.appendChild(card(m, { onSelect: () => openDetails(m.type || entry.catalog.type, m.id) })));
            if (tail && tail.parentNode === results) results.insertBefore(row, tail);
            else results.appendChild(row);
            loadVisibleImages(row);
          })
          .catch(() => {})
          .then(() => {
            pending--;
            if (my === token && pending === 0 && !found) results.appendChild(h('div.hint', { text: t('Nada encontrado para "{q}".', { q: query }) }));
          });
      });
    });
  }

  run('');

  return {
    el: el,
    onShow: () => loadVisibleImages(el),
    destroy: () => bar.__destroy && bar.__destroy(),
    focusInput: () => nav.focus(input),
    // From the phone remote: fill the box and run the search.
    search: (q) => {
      input.value = q;
      run(q);
    },
  };
}
