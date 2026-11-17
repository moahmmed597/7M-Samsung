// Manga tab: this season, Discover, Formats (manga / manhwa / manhua) and Genres, from AniList
// (free, no key). Rows load only as they come into view, like the home screen. A title opens its
// details page, where the chapters come from MangaDex and are read in the built-in reader.
import { h, clear, loadVisibleImages } from '../lib/dom.js';
import * as nav from '../lib/nav.js';
import { postJSON } from '../lib/http.js';
import * as store from '../lib/store.js';
import { topbar, card, spinnerLine, toast, promptText } from '../ui.js';
import * as router from '../router.js';
import { t } from '../lib/i18n.js';
import { tileRow, setTileArt, slug, SEASONS, SEASON_ART_URLS, SEASON_FALLBACK_URLS } from './anime.js';
import { openMangaDetails } from './mangaDetails.js';
import { openSources, openSourceManga } from './sources.js';
import * as shelf from '../lib/mangaLib.js';

const API = 'https://graphql.anilist.co';
const FIELDS =
  'id format status chapters volumes countryOfOrigin averageScore genres description(asHtml: false) startDate { year } title { romaji english native } synonyms coverImage { large }';
const SEASON_START = { WINTER: '0101', SPRING: '0401', SUMMER: '0701', FALL: '1001' };

const cache = {};
function anilist(query) {
  if (!cache[query]) {
    cache[query] = postJSON(API, { query: query }, { timeout: 15000, quiet: true })
      .then((r) => r && r.data)
      .catch((e) => {
        delete cache[query];
        throw e;
      });
  }
  return cache[query];
}

function toMetas(list) {
  return (list || []).map((m) => ({
    id: 'anilist:' + m.id,
    anilist: m.id,
    type: 'manga',
    name: (m.title && (m.title.english || m.title.romaji)) || '',
    poster: m.coverImage && m.coverImage.large,
    media: m,
  }));
}

// A page of a filter ("sort: X, genre: Y"...): { items, more }.
function page(args, n, perPage) {
  return anilist(
    '{ Page(page: ' + (n || 1) + ', perPage: ' + (perPage || 20) + ') { pageInfo { hasNextPage } media(type: MANGA, isAdult: false, ' + args + ') { ' + FIELDS + ' } } }'
  ).then((d) => ({
    items: toMetas(d && d.Page && d.Page.media),
    more: !!(d && d.Page && d.Page.pageInfo && d.Page.pageInfo.hasNextPage),
  }));
}

function seasonNow() {
  const d = new Date();
  return { season: SEASONS[Math.floor(d.getMonth() / 3)], year: d.getFullYear() };
}
const seasonArgs = (x) => 'startDate_greater: ' + x.year + SEASON_START[x.season] + ', sort: POPULARITY_DESC';

const DISCOVER = [
  { label: 'Em alta agora', args: 'sort: TRENDING_DESC' },
  { label: 'Mais populares', args: 'sort: POPULARITY_DESC' },
  { label: 'Mais bem avaliados', args: 'sort: SCORE_DESC' },
  { label: 'Completos', args: 'status: FINISHED, sort: SCORE_DESC' },
  { label: 'Lançando agora', args: 'status: RELEASING, sort: POPULARITY_DESC' },
  { label: 'Em breve', args: 'status: NOT_YET_RELEASED, sort: POPULARITY_DESC' },
];
// A picture for each Discover / Formats tile: the wide banner of the top title of that list
// (a different title on each tile). One AniList request, kept for a day.
function tileArt() {
  const cached = store.get('mangaTileArt', null);
  if (cached && cached.at > Date.now() - 864e5 && cached.urls && cached.urls.length === DISCOVER.length + FORMATS.length) return Promise.resolve(cached.urls);
  const lists = DISCOVER.concat(FORMATS);
  const q =
    '{' +
    lists.map((d, i) => 'l' + i + ': Page(perPage: 8) { media(type: MANGA, isAdult: false, ' + d.args + ') { id bannerImage coverImage { extraLarge } } }').join(' ') +
    '}';
  return postJSON('https://graphql.anilist.co', { query: q }, { timeout: 15000, quiet: true })
    .then((r) => {
      const used = {};
      const urls = lists.map((d, i) => {
        const media = (r && r.data && r.data['l' + i] && r.data['l' + i].media) || [];
        const pick = media.find((x) => x.bannerImage && !used[x.id]) || media.find((x) => !used[x.id]);
        if (!pick) return '';
        used[pick.id] = 1;
        return pick.bannerImage || (pick.coverImage && pick.coverImage.extraLarge) || '';
      });
      if (urls.some(Boolean)) store.set('mangaTileArt', { at: Date.now(), urls: urls });
      return urls;
    })
    .catch(() => []);
}

const FORMATS = [
  { label: 'Mangá (Japão)', args: 'countryOfOrigin: "JP", format: MANGA, sort: POPULARITY_DESC' },
  { label: 'Manhwa (Coreia)', args: 'countryOfOrigin: "KR", sort: POPULARITY_DESC' },
  { label: 'Manhua (China)', args: 'countryOfOrigin: "CN", sort: POPULARITY_DESC' },
  { label: 'Romances leves', args: 'format: NOVEL, sort: POPULARITY_DESC' },
  { label: 'One-shots', args: 'format: ONE_SHOT, sort: POPULARITY_DESC' },
];
// [AniList genre or tag, Portuguese key for t() or null]
const GENRES = [
  ['Action', 'Ação'], ['Adventure', 'Aventura'], ['Comedy', 'Comédia'], ['Drama', 'Drama'], ['Fantasy', 'Fantasia'], ['Horror', 'Terror'],
  ['Mystery', 'Mistério'], ['Romance', 'Romance'], ['Sci-Fi', 'Ficção científica'], ['Slice of Life', 'Cotidiano'], ['Sports', 'Esportes'],
  ['Supernatural', 'Sobrenatural'], ['Psychological', 'Psicológico'], ['Mahou Shoujo', null], ['Mecha', 'Mecha'],
];
const TAGS = [['Isekai', null], ['Reincarnation', null], ['Martial Arts', null], ['Samurai', null], ['Vampire', null], ['School', null], ['Survival', null], ['Time Manipulation', 'Viagem no tempo']];
const SEASON_NAME = { WINTER: 'Inverno', SPRING: 'Primavera', SUMMER: 'Verão', FALL: 'Outono' };

function posterRow(parent, title, args, onMore) {
  const row = h('div.row', { 'data-anchor': '30' });
  const track = h('div.row-track.pending', { 'data-scroll-x': '', 'data-group': '' }, spinnerLine(t('Carregando...')));
  row.appendChild(h('div.row-title', { text: title }));
  row.appendChild(track);
  parent.appendChild(row);
  return {
    row: row,
    load: () =>
      page(args)
        .then((r) => {
          clear(track);
          track.classList.remove('pending');
          if (!r.items.length) return parent.removeChild(row);
          r.items.forEach((m) => track.appendChild(card(m, { onSelect: () => openMangaDetails(m) })));
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

export function MangaView() {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const bar = topbar('manga', router.goTab);
  const rows = h('div.rows');
  scroller.appendChild(bar);
  // Sources of your own Suwayomi server (the app ships none).
  scroller.appendChild(
    h('div.details-buttons', { 'data-group': '' }, [
      h('div.btn', {
        focusable: true,
        onSelect: () =>
          promptText(t('Buscar mangás'), '', 'One Piece, Solo Leveling...', (q) => {
            const v = q.trim();
            if (v) router.push(MangaGridView('🔍 ' + v, 'search: ' + JSON.stringify(v) + ', sort: SEARCH_MATCH'));
          }),
      }, [h('span.ico', { text: '🔍' }), t('Buscar mangás')]),
      h('div.btn', { focusable: true, onSelect: () => openSources('manga') }, [h('span.ico', { text: '📚' }), t('Minhas fontes')]),
    ])
  );
  const shelves = h('div');
  scroller.appendChild(shelves);
  scroller.appendChild(rows);
  el.appendChild(scroller);

  // "Continue reading" and "Favorites": from your own reading, every source.
  const openBy = (kind, ref) => (kind === 'sw' || kind === 'pl' ? openSourceManga(ref) : openMangaDetails(Object.assign({ id: 'anilist:' + ref.anilist, type: 'manga', media: {} }, ref)));
  function drawShelves() {
    clear(shelves);
    const mk = (title, list) => {
      if (!list.length) return;
      const track = h('div.row-track', { 'data-scroll-x': '', 'data-group': '' });
      list.forEach((x) => track.appendChild(card({ id: x.key, name: x.name, poster: x.poster }, { onSelect: () => openBy(x.kind, x.ref) })));
      shelves.appendChild(h('div.row', { 'data-anchor': '30' }, [h('div.row-title', { text: title }), track]));
      loadVisibleImages(track);
    };
    mk(t('Continuar lendo'), shelf.continueList(40).filter((p) => p.kind !== 'cv').slice(0, 15).map((p) => ({ key: p.key, kind: p.kind, ref: p.ref, name: (p.title || '') + ' · ' + t('Cap. {n}', { n: p.chapter }), poster: p.poster })));
    mk(t('Favoritos'), shelf.favs().filter((f) => f.kind !== 'cv').map((f) => ({ key: f.key, kind: f.kind, ref: f.ref, name: f.ref.name, poster: f.ref.poster })));
  }
  drawShelves();

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

  const grid = (label, args) => router.push(MangaGridView(label, args));
  const s = seasonNow();
  const add = (title, args) => pending.push(posterRow(rows, title, args, () => grid(title, args)));

  add(t('Lançando agora'), 'status: RELEASING, sort: TRENDING_DESC');
  // Seasonal manga: what started in each season of this year (same cards as the anime tab).
  tileRow(
    rows,
    t('Mangá da temporada'),
    SEASONS.map((x) => ({
      label: t(SEASON_NAME[x]) + ' ' + s.year,
      seasonKey: x,
      artUrl: SEASON_ART_URLS[x],
      fallbackUrl: SEASON_FALLBACK_URLS[x],
      open: () => grid(t(SEASON_NAME[x]) + ' ' + s.year, 'startDate_greater: ' + s.year + SEASON_START[x] + ', startDate_lesser: ' + s.year + (SEASON_START[SEASONS[(SEASONS.indexOf(x) + 1) % 4]] === '0101' ? '1231' : SEASON_START[SEASONS[(SEASONS.indexOf(x) + 1) % 4]]) + ', sort: POPULARITY_DESC'),
    })),
    'genre'
  );
  const discoverRow = tileRow(rows, t('Descobrir'), DISCOVER.map((d) => ({ label: t(d.label), open: () => grid(t(d.label), d.args) })), 'discover');
  add(t('Em alta agora'), 'sort: TRENDING_DESC');
  const formatsRow = tileRow(rows, t('Formatos'), FORMATS.map((f, i) => ({ label: t(f.label), open: () => grid(t(f.label), f.args) })), 'discover formats');
  tileArt().then((a) => {
    setTileArt(discoverRow, a.slice(0, DISCOVER.length));
    setTileArt(formatsRow, a.slice(DISCOVER.length));
  });
  tileRow(
    rows,
    t('Gêneros'),
    GENRES.map((g) => ({ label: g[1] ? t(g[1]) : g[0], art: 'genre-' + slug(g[0]), open: () => grid(g[1] ? t(g[1]) : g[0], 'genre: ' + JSON.stringify(g[0]) + ', sort: POPULARITY_DESC') })),
    'genre'
  );
  tileRow(
    rows,
    t('Temas'),
    TAGS.map((g) => ({ label: g[1] ? t(g[1]) : g[0], art: 'genre-' + slug(g[0]), open: () => grid(g[1] ? t(g[1]) : g[0], 'tag: ' + JSON.stringify(g[0]) + ', sort: POPULARITY_DESC') })),
    'discover'
  );
  add(t('Mais populares'), 'sort: POPULARITY_DESC');

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

// A full list, next pages loaded with the last card.
function MangaGridView(title, args) {
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
    page(args, ++n, 35)
      .then((r) => {
        const sp = gridEl.querySelector('.loading-line');
        if (sp) gridEl.removeChild(sp);
        r.items.forEach((m) => {
          if (seen[m.id]) return;
          seen[m.id] = true;
          gridEl.appendChild(card(m, { onSelect: () => openMangaDetails(m) }));
        });
        if (r.more) {
          more = h('div.card.see-all', { focusable: true, onSelect: () => next() }, [
            h('div.poster-wrap', null, h('div.see-all-label', null, [h('b', { text: '+' }), t('Carregar mais')])),
            h('div.name', { text: '' }),
          ]);
          gridEl.appendChild(more);
        }
        loadVisibleImages(el, 400);
        if (n === 1) {
          const first = gridEl.querySelector('.card');
          if (first) nav.focus(first);
        }
      })
      .catch(() => toast(t('Não foi possível carregar agora.')));
  }
  next();
  return { el: el, onShow: () => loadVisibleImages(el, 400) };
}
