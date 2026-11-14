// Anime tab: this season, Discover (trending, popular, top rated, airing, upcoming, movies),
// Studios and Genres, from AniList (free, no key). Rows load one by one as they come into view,
// like the home screen, so the tab costs nothing until it is opened. A title opens with the
// Anime Kitsu add-on's id when it is installed (right season and episodes), else its IMDb id.
import { h, clear, loadVisibleImages } from '../lib/dom.js';
import * as nav from '../lib/nav.js';
import { postJSON, getJSON } from '../lib/http.js';
import { topbar, card, spinnerLine, toast } from '../ui.js';
import * as router from '../router.js';
import * as addons from '../api/addons.js';
import { openDetails } from './details.js';
import { t } from '../lib/i18n.js';

const API = 'https://graphql.anilist.co';
const ARM = 'https://arm.haglund.dev/api/v2/ids?source=anilist&id=';
const FIELDS = 'id format title { romaji english } coverImage { large }';

function seasonNow() {
  const d = new Date();
  return { season: ['WINTER', 'SPRING', 'SUMMER', 'FALL'][Math.floor(d.getMonth() / 3)], year: d.getFullYear() };
}

// Lists: each is a filter for AniList's Page.media.
export const DISCOVER = [
  { id: 'trending', label: 'Em alta agora', args: 'sort: TRENDING_DESC' },
  { id: 'airing', label: 'Lançando agora', args: 'status: RELEASING, sort: POPULARITY_DESC' },
  { id: 'popular', label: 'Mais populares', args: 'sort: POPULARITY_DESC' },
  { id: 'top', label: 'Mais bem avaliados', args: 'sort: SCORE_DESC' },
  { id: 'upcoming', label: 'Em breve', args: 'status: NOT_YET_RELEASED, sort: POPULARITY_DESC' },
  { id: 'movies', label: 'Filmes de anime', args: 'format: MOVIE, sort: POPULARITY_DESC' },
];
export const STUDIOS = ['MAPPA', 'ufotable', 'Wit Studio', 'Kyoto Animation', 'Bones', 'Production I.G', 'A-1 Pictures', 'Madhouse', 'Toei Animation', 'Studio Ghibli', 'CloverWorks', 'Trigger', 'Sunrise', 'Shaft', 'David Production', 'Studio Pierrot'];
export const GENRES = [
  ['Action', 'Ação'], ['Adventure', 'Aventura'], ['Comedy', 'Comédia'], ['Drama', 'Drama'], ['Fantasy', 'Fantasia'], ['Horror', 'Terror'],
  ['Mystery', 'Mistério'], ['Romance', 'Romance'], ['Sci-Fi', 'Ficção científica'], ['Slice of Life', 'Cotidiano'], ['Sports', 'Esportes'],
  ['Supernatural', 'Sobrenatural'], ['Mecha', 'Mecha'], ['Psychological', 'Psicológico'], ['Music', 'Música'],
];

const cache = {};
function anilist(query) {
  if (cache[query]) return cache[query];
  const p = postJSON(API, { query: query }, { timeout: 15000, quiet: true })
    .then((r) => r && r.data)
    .catch((e) => {
      delete cache[query];
      throw e;
    });
  cache[query] = p;
  return p;
}

function toMetas(list) {
  return (list || []).map((m) => ({
    id: 'anilist:' + m.id,
    anilist: m.id,
    type: m.format === 'MOVIE' ? 'movie' : 'series',
    name: (m.title && (m.title.english || m.title.romaji)) || '',
    poster: m.coverImage && m.coverImage.large,
  }));
}

// A page of a filter: "sort: X, genre: Y" etc.
function page(args, n, perPage) {
  return anilist('{ Page(page: ' + (n || 1) + ', perPage: ' + (perPage || 20) + ') { pageInfo { hasNextPage } media(type: ANIME, isAdult: false, ' + args + ') { ' + FIELDS + ' } } }').then((d) => ({
    items: toMetas(d && d.Page && d.Page.media),
    more: !!(d && d.Page && d.Page.pageInfo && d.Page.pageInfo.hasNextPage),
  }));
}

// A studio's titles, most popular first.
function studioPage(name) {
  return anilist('{ Studio(search: ' + JSON.stringify(name) + ') { media(sort: POPULARITY_DESC, isMain: true, perPage: 40) { nodes { ' + FIELDS + ' } } } }').then((d) => ({
    items: toMetas(d && d.Studio && d.Studio.media && d.Studio.media.nodes).filter((m) => m.name),
    more: false,
  }));
}

// AniList id → the id Stremio's add-ons know.
const idCache = {};
export function openAnime(m) {
  const go = (ids) => {
    const kitsuOk = ids.kitsu && addons.withResource('meta', 'series', 'kitsu:' + ids.kitsu).length;
    const id = kitsuOk ? 'kitsu:' + ids.kitsu : ids.imdb || (ids.kitsu ? 'kitsu:' + ids.kitsu : null);
    if (!id) return toast(t('Não encontrei este anime nos addons.'));
    openDetails(m.type, id);
  };
  if (idCache[m.anilist]) return go(idCache[m.anilist]);
  getJSON(ARM + m.anilist, { timeout: 10000, quiet: true })
    .then((r) => {
      idCache[m.anilist] = { imdb: r && r.imdb, kitsu: r && r.kitsu };
      go(idCache[m.anilist]);
    })
    .catch(() => toast(t('Não encontrei este anime nos addons.')));
}

function posterRow(parent, title, load, onMore) {
  const row = h('div.row', { 'data-anchor': '30' });
  const track = h('div.row-track.pending', { 'data-scroll-x': '', 'data-group': '' }, spinnerLine(t('Carregando...')));
  row.appendChild(h('div.row-title', { text: title }));
  row.appendChild(track);
  parent.appendChild(row);
  return {
    row: row,
    load: () =>
      load()
        .then((r) => {
          clear(track);
          track.classList.remove('pending');
          if (!r.items.length) return parent.removeChild(row);
          r.items.forEach((m) => track.appendChild(card(m, { onSelect: () => openAnime(m) })));
          if (onMore)
            track.appendChild(
              h('div.card.see-all', { focusable: true, onSelect: onMore }, [
                h('div.poster-wrap', null, h('div.see-all-label', null, [h('b', { text: '→' }), t('Ver tudo')])),
                h('div.name', { text: '' }),
              ])
            );
          loadVisibleImages(row);
        })
        .catch(() => row.parentNode && parent.removeChild(row)),
  };
}

function tileRow(parent, title, tiles, cls) {
  const row = h('div.row', { 'data-anchor': '30' });
  row.appendChild(h('div.row-title', { text: title }));
  row.appendChild(
    h(
      'div.row-track',
      { 'data-scroll-x': '', 'data-group': '' },
      tiles.map((x, i) =>
        h('div.card.anime-tile', { focusable: true, cls: cls + ' hue-' + (i % 6), onSelect: x.open }, [
          h('div.poster-wrap', null, h('div.tile-label', { text: x.label })),
          h('div.name', { text: '' }),
        ])
      )
    )
  );
  parent.appendChild(row);
}

export function AnimeView() {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const bar = topbar('anime', router.goTab);
  const rows = h('div.rows');
  scroller.appendChild(bar);
  scroller.appendChild(rows);
  el.appendChild(scroller);

  const pending = [];
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
      p.load().then(() => {
        p.state = 'done';
        active--;
        loadNearby();
      });
    }
  }

  const s = seasonNow();
  const add = (title, load, onMore) => pending.push(posterRow(rows, title, load, onMore));
  add(t('Esta temporada'), () => page('season: ' + s.season + ', seasonYear: ' + s.year + ', sort: POPULARITY_DESC'), () =>
    router.push(AnimeGridView(t('Esta temporada'), 'season: ' + s.season + ', seasonYear: ' + s.year + ', sort: POPULARITY_DESC'))
  );
  tileRow(rows, t('Descobrir'), DISCOVER.map((d) => ({ label: t(d.label), open: () => router.push(AnimeGridView(t(d.label), d.args)) })), 'discover');
  add(t('Em alta agora'), () => page(DISCOVER[0].args), () => router.push(AnimeGridView(t('Em alta agora'), DISCOVER[0].args)));
  tileRow(rows, t('Estúdios'), STUDIOS.map((name) => ({ label: name, open: () => router.push(AnimeGridView(name, null, name)) })), 'studio');
  tileRow(rows, t('Gêneros'), GENRES.map((g) => ({ label: t(g[1]), open: () => router.push(AnimeGridView(t(g[1]), 'genre: ' + JSON.stringify(g[0]) + ', sort: POPULARITY_DESC')) })), 'genre');
  add(t('Lançando agora'), () => page(DISCOVER[1].args), () => router.push(AnimeGridView(t('Lançando agora'), DISCOVER[1].args)));
  add(t('Filmes de anime'), () => page(DISCOVER[5].args), () => router.push(AnimeGridView(t('Filmes de anime'), DISCOVER[5].args)));

  return {
    el: el,
    onShow: () => {
      loadNearby();
      loadVisibleImages(el);
    },
    onScroll: () => loadNearby(),
    destroy: () => bar.__destroy && bar.__destroy(),
  };
}

// Full list (a Discover tile, a studio or a genre), next pages loaded with the last card.
function AnimeGridView(title, args, studio) {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const grid = h('div.grid');
  scroller.appendChild(h('div.row-title.catalog-title', { text: title }));
  scroller.appendChild(grid);
  el.appendChild(scroller);
  let n = 0;
  let moreCard = null;
  function more() {
    if (moreCard && moreCard.parentNode) grid.removeChild(moreCard);
    grid.appendChild(spinnerLine(t('Carregando...')));
    (studio ? studioPage(studio) : page(args, ++n, 35))
      .then((r) => {
        const sp = grid.querySelector('.loading-line');
        if (sp) grid.removeChild(sp);
        r.items.forEach((m) => grid.appendChild(card(m, { onSelect: () => openAnime(m) })));
        if (r.more && !studio) {
          moreCard = h('div.card.see-all', { focusable: true, onSelect: () => more() }, [
            h('div.poster-wrap', null, h('div.see-all-label', null, [h('b', { text: '+' }), t('Carregar mais')])),
            h('div.name', { text: '' }),
          ]);
          grid.appendChild(moreCard);
        }
        loadVisibleImages(el, 400);
        if (n === 1 || studio) {
          const first = grid.querySelector('.card');
          if (first) nav.focus(first);
        }
      })
      .catch(() => toast(t('Não foi possível carregar agora.')));
  }
  more();
  return { el: el, onShow: () => loadVisibleImages(el, 400) };
}
