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

// Sections in UltraAnime's order. Each tile is a list: from the AIOMetadata add-on when it is
// installed (MAL data: { aio: catalog, g: genre option }), else from AniList ({ ani: filter }).
const SEASONS = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
const SEASON_LABEL = { WINTER: 'Winter', SPRING: 'Spring', SUMMER: 'Summer', FALL: 'Fall' };
function nextSeason(s) {
  const i = SEASONS.indexOf(s.season);
  return i === 3 ? { season: 'WINTER', year: s.year + 1 } : { season: SEASONS[i + 1], year: s.year };
}
const STUDIO_LIST = ['MAPPA', 'Madhouse', 'ufotable', 'Kyoto Animation', 'Bones', 'Wit Studio', 'Production I.G', 'Sunrise', 'Trigger', 'CloverWorks', 'A-1 Pictures', 'Toei Animation', 'Studio Pierrot', 'David Production', 'TMS Entertainment', 'P.A. Works', 'J.C.Staff', 'Studio Ghibli'];
// [MAL name (AIOMetadata option), Portuguese key for t() or null to show the name as is, AniList genre or tag]
const GENRE_LIST = [
  ['Action', 'Ação', 'genre: "Action"'], ['Adventure', 'Aventura', 'genre: "Adventure"'], ['Comedy', 'Comédia', 'genre: "Comedy"'], ['Drama', 'Drama', 'genre: "Drama"'],
  ['Fantasy', 'Fantasia', 'genre: "Fantasy"'], ['Horror', 'Terror', 'genre: "Horror"'], ['Mahou Shoujo', null, 'genre: "Mahou Shoujo"'], ['Mecha', 'Mecha', 'genre: "Mecha"'],
  ['Music', 'Música', 'genre: "Music"'], ['Mystery', 'Mistério', 'genre: "Mystery"'], ['Psychological', 'Psicológico', 'genre: "Psychological"'], ['Romance', 'Romance', 'genre: "Romance"'],
  ['Sci-Fi', 'Ficção científica', 'genre: "Sci-Fi"'], ['Slice of Life', 'Cotidiano', 'genre: "Slice of Life"'], ['Sports', 'Esportes', 'genre: "Sports"'], ['Supernatural', 'Sobrenatural', 'genre: "Supernatural"'], ['Suspense', null, 'genre: "Thriller"'],
];
const DEMOGRAPHICS = [['Shounen', null, 'tag: "Shounen"'], ['Seinen', null, 'tag: "Seinen"'], ['Shoujo', null, 'tag: "Shoujo"'], ['Josei', null, 'tag: "Josei"'], ['Kids', 'Infantil', 'tag: "Kids"']];
const THEMES = [
  ['Isekai', null, 'tag: "Isekai"'], ['Reincarnation', null, 'tag: "Reincarnation"'], ['Mythology', null, 'tag: "Mythology"'], ['Vampire', null, 'tag: "Vampire"'], ['Super Power', null, 'tag: "Super Power"'],
  ['Samurai', null, 'tag: "Samurai"'], ['Martial Arts', null, 'tag: "Martial Arts"'], ['Survival', null, 'tag: "Survival"'], ['Military', null, 'tag: "Military"'], ['Time Travel', null, 'tag: "Time Manipulation"'],
  ['Space', null, 'tag: "Space"'], ['Mecha', null, 'tag: "Real Robot"'], ['Urban Fantasy', null, 'tag: "Urban Fantasy"'], ['Team Sports', null, 'tag: "Team Sports"'], ['Love Polygon', null, 'tag: "Love Triangle"'],
];
const EVERYDAY = [
  ['Detective', null, 'tag: "Detective"'], ['Organized Crime', null, 'tag: "Organized Crime"'], ['Gore', null, 'tag: "Gore"'], ['Medical', null, 'tag: "Medicine"'], ['Historical', null, 'tag: "Historical"'],
  ['CGDCT', null, 'tag: "Cute Girls Doing Cute Things"'], ['Iyashikei', null, 'tag: "Iyashikei"'], ['Childcare', null, 'tag: "Parenthood"'], ['Gourmet', null, 'tag: "Food"'], ['Workplace', null, 'tag: "Workplace"'],
  ['School', null, 'tag: "School"'], ['Performing Arts', null, 'tag: "Acting"'], ['Visual Arts', null, 'tag: "Drawing"'], ['Pets', null, 'tag: "Pets"'], ['Showbiz', null, 'tag: "Idol"'],
];
const STYLES = [
  ['Parody', null, 'tag: "Parody"'], ['Gag Humor', null, 'tag: "Slapstick"'], ['Otaku Culture', null, 'tag: "Otaku Culture"'], ['Delinquents', null, 'tag: "Delinquents"'], ['Crossdressing', null, 'tag: "Crossdressing"'],
  ['Harem', null, 'tag: "Male Harem"'], ['Reverse Harem', null, 'tag: "Female Harem"'], ['Love Polygon', null, 'tag: "Love Triangle"'],
];
const DECADES = [[1980, '80s'], [1990, '90s'], [2000, '2000s'], [2010, '2010s'], [2020, '2020s']];

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
  if (m.aio) {
    const mal = /^mal:(\d+)/.exec(m.id);
    if (!mal) return openDetails(m.type, m.id);
    return getJSON('https://arm.haglund.dev/api/v2/ids?source=myanimelist&id=' + mal[1], { timeout: 10000, quiet: true })
      .then((r) => {
        const kitsuOk = r && r.kitsu && addons.withResource('meta', 'series', 'kitsu:' + r.kitsu).length;
        openDetails(m.type, kitsuOk ? 'kitsu:' + r.kitsu : (r && r.imdb) || m.id);
      })
      .catch(() => openDetails(m.type, m.id));
  }
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

// ---------- AIOMetadata (MAL) ----------
function aioAddon() {
  return addons.list().find((a) => a.manifest && a.manifest.id === 'aio-metadata');
}
function aioOption(cat, want) {
  const a = aioAddon();
  const c = a && (a.manifest.catalogs || []).find((x) => x.id === cat);
  const ex = c && (c.extra || []).find((e) => e.name === 'genre');
  const opts = (ex && ex.options) || [];
  const w = String(want).toLowerCase();
  return opts.find((o) => String(o).toLowerCase() === w) || opts.find((o) => String(o).toLowerCase().indexOf(w + ' - ') === 0) || null;
}
function aioPage(cat, genre, n) {
  const a = aioAddon();
  if (!a) return Promise.reject(new Error('no aio'));
  const extra = {};
  if (genre) extra.genre = genre;
  if (n > 1) extra.skip = (n - 1) * 50;
  return addons.fetchCatalog({ addon: a, catalog: { type: 'anime', id: cat } }, extra).then((metas) => ({
    items: metas.map((m) => Object.assign({}, m, { type: m.type === 'movie' || /movie/i.test(m.type) ? 'movie' : 'series', aio: true })),
    more: metas.length >= 50,
  }));
}
// A list for a tile: AIOMetadata when it has the catalog/option, else AniList.
function listSource(aioCat, aioGenre, aniArgs) {
  const opt = aioCat && (aioGenre ? aioOption(aioCat, aioGenre) : true);
  if (aioAddon() && opt) return (n) => aioPage(aioCat, aioGenre ? opt : null, n);
  return aniArgs ? (n) => page(aniArgs, n, 35) : null;
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
  const ns = nextSeason(s);
  const seasonArgs = (x) => 'season: ' + x.season + ', seasonYear: ' + x.year + ', sort: POPULARITY_DESC';
  const seasonName = (x) => SEASON_LABEL[x.season] + ' ' + x.year;
  const add = (title, load, onMore) => pending.push(posterRow(rows, title, load, onMore));
  // A tile row whose tiles open grids; tiles with no source at all are left out.
  const tiles = (title, list, cls) => {
    const usable = list.filter((x) => x.src);
    if (usable.length) tileRow(rows, title, usable.map((x) => ({ label: x.label, open: () => router.push(AnimeGridView(x.label, null, null, x.src)) })), cls);
  };
  const malList = (list, cls, title) =>
    tiles(title, list.map((g) => ({ label: g[1] ? t(g[1]) : g[0], src: listSource('mal.genres', g[0], g[2] + ', sort: POPULARITY_DESC') })), cls);

  add(t('Esta temporada'), () => page(seasonArgs(s)), () => router.push(AnimeGridView(t('Esta temporada'), seasonArgs(s))));
  tiles(t('Descobrir'), [
    { label: t('Lançando agora'), src: listSource('mal.airing', null, 'status: RELEASING, sort: POPULARITY_DESC') },
    { label: t('Esta temporada'), src: listSource('mal.seasons', seasonName(s), seasonArgs(s)) },
    { label: t('Próxima temporada'), src: listSource('mal.seasons', seasonName(ns), seasonArgs(ns)) },
    { label: t('Mais populares'), src: listSource(null, null, 'sort: POPULARITY_DESC') },
    { label: t('Mais favoritados'), src: listSource(null, null, 'sort: FAVOURITES_DESC') },
    { label: t('Melhores séries'), src: listSource('mal.top_anime', null, 'format: TV, sort: SCORE_DESC') },
    { label: t('Melhores filmes'), src: listSource(null, null, 'format: MOVIE, sort: SCORE_DESC') },
    { label: t('Mais bem avaliados'), src: listSource(null, null, 'sort: SCORE_DESC') },
  ], 'discover');
  add(t('Em alta agora'), () => page('sort: TRENDING_DESC'), () => router.push(AnimeGridView(t('Em alta agora'), 'sort: TRENDING_DESC')));
  tiles(t('Anime da temporada'), SEASONS.map((x) => {
    const one = { season: x, year: s.year };
    return { label: t(SEASON_LABEL[x] === 'Winter' ? 'Inverno' : SEASON_LABEL[x] === 'Spring' ? 'Primavera' : SEASON_LABEL[x] === 'Summer' ? 'Verão' : 'Outono') + ' ' + s.year, src: listSource('mal.seasons', seasonName(one), seasonArgs(one)) };
  }), 'genre');
  tiles(t('Estúdios'), STUDIO_LIST.map((name) => ({ label: name, src: listSource('mal.studios', name, null) || ((n) => (n > 1 ? Promise.resolve({ items: [], more: false }) : studioPage(name))) })), 'studio');
  malList(GENRE_LIST, 'genre', t('Gêneros'));
  malList(DEMOGRAPHICS, 'discover', t('Público'));
  tiles(t('Décadas'), DECADES.map((d) => ({ label: d[1], src: listSource(null, null, 'startDate_greater: ' + d[0] + '0000, startDate_lesser: ' + (d[0] + 10) + '0000, sort: SCORE_DESC') })), 'genre');
  malList(THEMES, 'discover', t('Temas'));
  malList(EVERYDAY, 'genre', t('Crime e vida cotidiana'));
  malList(STYLES, 'discover', t('Estilos de comédia e romance'));
  add(t('Filmes de anime'), () => page('format: MOVIE, sort: POPULARITY_DESC'), () => router.push(AnimeGridView(t('Filmes de anime'), 'format: MOVIE, sort: POPULARITY_DESC')));

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
function AnimeGridView(title, args, studio, src) {
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
    (src ? src(++n) : studio ? studioPage(studio) : page(args, ++n, 35))
      .then((r) => {
        const sp = grid.querySelector('.loading-line');
        if (sp) grid.removeChild(sp);
        r.items.forEach((m) => grid.appendChild(card(m, { onSelect: () => openAnime(m) })));
        if (r.more && (src || !studio)) {
          moreCard = h('div.card.see-all', { focusable: true, onSelect: () => more() }, [
            h('div.poster-wrap', null, h('div.see-all-label', null, [h('b', { text: '+' }), t('Carregar mais')])),
            h('div.name', { text: '' }),
          ]);
          grid.appendChild(moreCard);
        }
        loadVisibleImages(el, 400);
        if (n === 1 || (studio && !src)) {
          const first = grid.querySelector('.card');
          if (first) nav.focus(first);
        }
      })
      .catch(() => toast(t('Não foi possível carregar agora.')));
  }
  more();
  return { el: el, onShow: () => loadVisibleImages(el, 400) };
}
