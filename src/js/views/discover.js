// Discover (idea from Harbor): a few rows picked for you, different each day. "Because you watched X"
// from TMDB's recommendations for titles in your library, trending today, and hidden gems in the genre
// you watch most. Its own tab so the home screen stays light. Needs a TMDB key (Settings → Integrations).
import { h, clear, loadVisibleImages } from '../lib/dom.js';
import { topbar, card, spinnerLine, toast } from '../ui.js';
import * as router from '../router.js';
import { t } from '../lib/i18n.js';
import * as extras from '../api/extras.js';
import * as stremio from '../api/stremio.js';
import { openDetails } from './details.js';

const IMG = 'https://image.tmdb.org/t/p/w185';
const GENRES = { 28: 'Ação', 12: 'Aventura', 16: 'Animação', 35: 'Comédia', 80: 'Crime', 99: 'Documentário', 18: 'Drama', 14: 'Fantasia', 27: 'Terror', 9648: 'Mistério', 10749: 'Romance', 878: 'Ficção científica', 53: 'Suspense' };

// Same picks all day, new ones tomorrow.
function seeded(list, n) {
  const d = new Date();
  let seed = d.getFullYear() * 1000 + d.getMonth() * 40 + d.getDate();
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    const x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a.slice(0, n);
}

// A TMDB result opens its Stremio page once its IMDb id is known.
function open(type, tmdbId) {
  extras
    .tmdbImdb(type, tmdbId)
    .then((imdb) => (imdb ? openDetails(type === 'tv' ? 'series' : 'movie', imdb) : toast(t('Não encontrei este título.'))))
    .catch(() => toast(t('Não encontrei este título.')));
}

function row(parent, title, load) {
  const r = h('div.row', { 'data-anchor': '30' });
  const track = h('div.row-track', { 'data-scroll-x': '', 'data-group': '' }, spinnerLine(t('Carregando...')));
  r.appendChild(h('div.row-title', { text: title }));
  r.appendChild(track);
  parent.appendChild(r);
  return {
    row: r,
    load: () =>
      load()
        .then((items) => {
          clear(track);
          const list = (items || []).filter((x) => x.poster_path).slice(0, 20);
          if (!list.length) return r.parentNode && parent.removeChild(r);
          list.forEach((x) => {
            const type = x.media_type === 'tv' || x.first_air_date ? 'tv' : 'movie';
            track.appendChild(card({ id: 'tmdb:' + x.id, name: x.title || x.name, poster: IMG + x.poster_path }, { onSelect: () => open(type, x.id) }));
          });
          loadVisibleImages(r);
        })
        .catch(() => r.parentNode && parent.removeChild(r)),
  };
}

export function DiscoverView() {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const bar = topbar('discover', router.goTab);
  const rows = h('div.rows');
  scroller.appendChild(bar);
  scroller.appendChild(h('div.row-title.catalog-title', { text: t('Descobrir') }));
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
      p.load().then(() => {
        active--;
        loadNearby();
      });
    }
  }

  let built = false;
  function build() {
    built = true;
    clear(rows);
    if (!extras.hasTmdb()) {
      rows.appendChild(h('div.nc-hint', { text: t('Coloque sua chave TMDB (Ajustes → Integrações) para ver as sugestões.') }));
      return;
    }
    // Titles you watched or saved (IMDb ids), newest first.
    const lib = (stremio.cachedLibrary() || []).filter((it) => /^tt\d+/.test(it._id) && (it.state && (it.state.timeOffset > 0 || it.state.timesWatched > 0 || it.state.flaggedWatched) || !it.removed));
    lib.sort((a, b) => new Date(b._mtime || 0) - new Date(a._mtime || 0));
    const picks = seeded(lib.slice(0, 25), 3);
    picks.forEach((it) =>
      pending.push(
        row(rows, t('Porque você assistiu {name}', { name: it.name }), () =>
          extras.tmdbFind(it._id).then((f) => (f ? extras.tmdbGet(f.type + '/' + f.id + '/recommendations', {}).then((r) => (r && r.results) || []) : []))
        )
      )
    );
    pending.push(row(rows, t('Em alta hoje'), () => extras.tmdbGet('trending/all/day', {}).then((r) => seeded((r && r.results) || [], 20))));
    // The genre you watch most → well rated titles few people saw.
    const counts = {};
    lib.forEach((it) => (it.genres || []).forEach((g) => (counts[g] = (counts[g] || 0) + 1)));
    const ids = Object.keys(GENRES);
    const top = seeded(ids, 2);
    top.forEach((gid) =>
      pending.push(
        row(rows, t('Joias escondidas: {genre}', { genre: t(GENRES[gid]) }), () =>
          extras
            .tmdbGet('discover/movie', { with_genres: gid, sort_by: 'vote_average.desc', 'vote_count.gte': 300, 'vote_count.lte': 4000, page: 1 + (new Date().getDate() % 5) })
            .then((r) => (r && r.results) || [])
        )
      )
    );
    pending.push(row(rows, t('Séries em alta esta semana'), () => extras.tmdbGet('trending/tv/week', {}).then((r) => (r && r.results) || [])));
    loadNearby();
  }

  return {
    el: el,
    onShow: () => {
      if (!built) build();
      loadNearby();
      loadVisibleImages(el);
    },
    onScroll: () => loadNearby(),
    freeMemory: () => {
      pending = [];
      clear(rows);
      built = false;
    },
    destroy: () => bar.__destroy && bar.__destroy(),
  };
}
