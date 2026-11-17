// Comics tab, laid out like the Anime tab: your shelves (continue reading, favourites), your sources,
// new issues of the week, publishers as logo tiles (Marvel, DC, Image...), heroes as picture tiles,
// and rows of the big series in between. The catalog is ComicVine (your own free key); reading
// comes from your sources, like manga.
import { h, clear, loadVisibleImages } from '../lib/dom.js';
import * as nav from '../lib/nav.js';
import * as store from '../lib/store.js';
import * as cv from '../api/comicvine.js';
import { topbar, card, spinnerLine, toast, promptText } from '../ui.js';
import * as router from '../router.js';
import { t } from '../lib/i18n.js';
import { tileRow, setTileArt } from './anime.js';
import { openComicDetails } from './comicDetails.js';
import { openSources, openSourceManga } from './sources.js';
import * as shelf from '../lib/mangaLib.js';

const MARVEL = ['Spider-Man', 'X-Men', 'Avengers', 'Iron Man', 'Deadpool', 'Wolverine', 'Venom', 'Hulk', 'Thor', 'Captain America', 'Black Panther', 'Daredevil', 'Fantastic Four', 'Guardians of the Galaxy', 'Doctor Strange', 'Moon Knight', 'Punisher', 'Silver Surfer'];
const DC = ['Batman', 'Superman', 'Wonder Woman', 'Joker', 'Flash', 'Green Lantern', 'Justice League', 'Aquaman', 'Harley Quinn', 'Teen Titans', 'Nightwing', 'Catwoman', 'Green Arrow', 'Shazam'];
const INDIE = ['Invincible', 'The Walking Dead', 'Spawn', 'Saga', 'Hellboy', 'Teenage Mutant Ninja Turtles', 'The Boys', 'Sandman', 'Watchmen', 'Sin City', 'Umbrella Academy', 'Locke & Key'];
// Publishers: the name ComicVine uses, and the series to show for each.
const PUBLISHERS = [
  { name: 'Marvel', match: 'Marvel', series: MARVEL },
  { name: 'DC Comics', match: 'DC Comics', series: DC },
  { name: 'Image', match: 'Image', series: ['Invincible', 'The Walking Dead', 'Spawn', 'Saga', 'Paper Girls', 'Chew', 'Monstress', 'Deadly Class'] },
  { name: 'Dark Horse Comics', match: 'Dark Horse', series: ['Hellboy', 'Sin City', 'Umbrella Academy', 'Usagi Yojimbo', 'B.P.R.D.', 'Black Hammer'] },
  { name: 'Vertigo', match: 'Vertigo', series: ['Sandman', 'Fables', 'Preacher', 'Y: The Last Man', 'Hellblazer', 'Transmetropolitan', '100 Bullets'] },
  { name: 'IDW Publishing', match: 'IDW', series: ['Teenage Mutant Ninja Turtles', 'Transformers', 'G.I. Joe', 'Locke & Key', 'Star Trek'] },
  { name: 'BOOM! Studios', match: 'BOOM', series: ['Something is Killing the Children', 'Power Rangers', 'Lumberjanes', 'Once & Future'] },
  { name: 'Dynamite Entertainment', match: 'Dynamite', series: ['The Boys', 'Red Sonja', 'Vampirella', 'The Shadow'] },
  { name: 'Valiant', match: 'Valiant', series: ['X-O Manowar', 'Bloodshot', 'Harbinger', 'Shadowman'] },
];
const ROWS = ['Spider-Man', 'Batman', 'X-Men', 'Superman', 'Avengers', 'The Walking Dead'];
const MONTH = 30 * 864e5;

// One picture per name, kept for a month (ComicVine counts requests). get(i) → Promise<url>.
function artFor(cacheKey, count, get, onEach) {
  const cached = store.get(cacheKey, null);
  const urls = cached && cached.at > Date.now() - MONTH && cached.urls ? cached.urls.slice() : [];
  let i = 0;
  let changed = false;
  function lane() {
    while (i < count && urls[i]) {
      onEach(i, urls[i]);
      i++;
    }
    if (i >= count) return Promise.resolve();
    const k = i++;
    return get(k)
      .then((u) => {
        if (u) {
          urls[k] = u;
          changed = true;
          onEach(k, u);
        }
      }, () => {})
      .then(lane);
  }
  return Promise.all([lane(), lane()]).then(() => changed && store.set(cacheKey, { at: Date.now(), urls: urls }));
}
const seriesArt = (name) => cv.searchVolumes(name, 0).then((r) => (r.items[0] ? r.items[0].art || r.items[0].poster : ''));

function heroTiles(parent, title, names, cacheKey) {
  const row = tileRow(parent, title, names.map((x) => ({ label: x, open: () => router.push(ComicGridView(x)) })), 'discover');
  const art = [];
  artFor(cacheKey, names.length, (i) => seriesArt(names[i]), (i, u) => {
    art[i] = u;
    setTileArt(row, art);
  });
  return row;
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
          items.slice(0, 20).forEach((m) => track.appendChild(card(m, { onSelect: () => openComicDetails(m) })));
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

export function ComicsView() {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const bar = topbar('comics', router.goTab);
  const rows = h('div.rows');
  scroller.appendChild(bar);
  scroller.appendChild(
    h('div.details-buttons', { 'data-group': '' }, [
      h('div.btn', { focusable: true, onSelect: search }, [h('span.ico', { text: '🔍' }), t('Buscar quadrinhos')]),
      h('div.btn', { focusable: true, onSelect: () => openSources('comics') }, [h('span.ico', { text: '📚' }), t('Minhas fontes')]),
    ])
  );
  const shelves = h('div');
  scroller.appendChild(shelves);
  scroller.appendChild(rows);
  el.appendChild(scroller);

  function search() {
    if (!cv.hasKey()) return toast(t('Adicione sua chave do ComicVine em Ajustes → Chaves.'), 6000);
    promptText(t('Buscar quadrinhos'), '', 'Batman, Spider-Man...', (q) => q.trim() && router.push(ComicGridView(q.trim())));
  }

  // Your comics only (kind 'cv'); a title opened from a source directly reopens there.
  function drawShelves() {
    clear(shelves);
    const mk = (title, list) => {
      if (!list.length) return;
      const track = h('div.row-track', { 'data-scroll-x': '', 'data-group': '' });
      list.forEach((x) =>
        track.appendChild(card({ id: x.key, name: x.name, poster: x.poster }, { onSelect: () => (x.ref.cvId ? openComicDetails(Object.assign({ id: 'cv:' + x.ref.cvId, type: 'comic' }, x.ref)) : openSourceManga(x.ref)) }))
      );
      shelves.appendChild(h('div.row', { 'data-anchor': '30' }, [h('div.row-title', { text: title }), track]));
      loadVisibleImages(track);
    };
    mk(t('Continuar lendo'), shelf.continueList(40).filter((p) => p.kind === 'cv').slice(0, 15).map((p) => ({ key: p.key, ref: p.ref, name: (p.title || '') + ' · #' + p.chapter, poster: p.poster })));
    mk(t('Favoritos'), shelf.favs().filter((f) => f.kind === 'cv').map((f) => ({ key: f.key, ref: f.ref, name: f.ref.name, poster: f.ref.poster })));
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
  const add = (title, load, onMore) => pending.push(posterRow(rows, title, load, onMore));
  const seriesRow = (x) => add(x, () => cv.searchVolumes(x, 0).then((r) => r.items), () => router.push(ComicGridView(x)));

  if (!cv.hasKey()) {
    rows.appendChild(
      h('div.flat-list', null, [
        h('div.modal-text', { text: t('Os quadrinhos usam o catálogo do ComicVine. Pegue uma chave grátis em comicvine.gamespot.com/api e coloque em Ajustes → Chaves (ou pela página do celular).') }),
        h('div.modal-text', { text: t('Para ler, adicione suas fontes em Minhas fontes.') }),
      ])
    );
  } else {
    add(t('Novas edições da semana'), () => cv.newThisWeek(7));
    // Publishers: their logos, like the studios in the Anime tab.
    const pubRow = tileRow(rows, t('Editoras'), PUBLISHERS.map((p) => ({ label: p.name, open: () => router.push(ComicGridView(p.name, p)) })), 'publisher');
    const logos = [];
    artFor('comicPublisherLogos', PUBLISHERS.length, (i) => cv.publisherLogo(PUBLISHERS[i].name), (i, u) => {
      logos[i] = u;
      setTileArt(pubRow, logos);
    });
    seriesRow(ROWS[0]);
    heroTiles(rows, t('Heróis da Marvel'), MARVEL, 'comicArtMarvel');
    seriesRow(ROWS[1]);
    heroTiles(rows, t('Heróis da DC'), DC, 'comicArtDC');
    seriesRow(ROWS[2]);
    heroTiles(rows, t('Independentes'), INDIE, 'comicArtIndie');
    ROWS.slice(3).forEach(seriesRow);
    setTimeout(loadNearby, 50);
  }

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

// A grid of series: everything with that name, or (pub) the series of one publisher.
export function ComicGridView(title, pub) {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const gridEl = h('div.grid');
  scroller.appendChild(h('div.row-title.catalog-title', { text: title }));
  scroller.appendChild(gridEl);
  el.appendChild(scroller);
  let n = 0;
  let more = null;
  let alive = true;
  const seen = {};
  // One page: 100 series with that name; for a publisher, one of its series names at a time.
  const pageOf = (k) =>
    pub
      ? cv.searchVolumes(pub.series[k], 0).then((r) => ({ items: r.items.filter((m) => String(m.publisher).indexOf(pub.match) >= 0).slice(0, 12), more: k + 1 < pub.series.length }))
      : cv.searchVolumes(title, k);
  function next() {
    if (!alive) return;
    if (more && more.parentNode) gridEl.removeChild(more);
    if (!gridEl.querySelector('.loading-line')) gridEl.appendChild(spinnerLine(t('Carregando...')));
    const first = n === 0;
    pageOf(n++)
      .then((r) => {
        if (!alive) return;
        const sp = gridEl.querySelector('.loading-line');
        if (sp && !(pub && r.more)) gridEl.removeChild(sp);
        r.items.forEach((m) => {
          if (seen[m.id]) return;
          seen[m.id] = true;
          gridEl.insertBefore(card(m, { onSelect: () => openComicDetails(m) }), gridEl.querySelector('.loading-line'));
        });
        loadVisibleImages(el, 400);
        if (!nav.current() || first) {
          const c = gridEl.querySelector('.card');
          if (c) nav.focus(c);
        }
        // A publisher fills in by itself; a name search waits for "Load more".
        if (pub && r.more) return next();
        if (!gridEl.querySelector('.card')) gridEl.appendChild(h('div.modal-text', { text: t('Nada por aqui.') }));
        if (r.more) {
          more = h('div.card.see-all', { focusable: true, onSelect: () => next() }, [
            h('div.poster-wrap', null, h('div.see-all-label', null, [h('b', { text: '+' }), t('Carregar mais')])),
            h('div.name', { text: '' }),
          ]);
          gridEl.appendChild(more);
        }
      })
      .catch((e) => {
        const sp = gridEl.querySelector('.loading-line');
        if (sp) gridEl.removeChild(sp);
        toast(e && e.message === 'bad key' ? t('O ComicVine recusou a chave. Confira em Ajustes → Chaves.') : t('Não foi possível carregar agora.'), 6000);
      });
  }
  next();
  return {
    el: el,
    onShow: () => loadVisibleImages(el, 400),
    destroy: () => {
      alive = false;
    },
  };
}

// "Read the comic" from a film or show page: the series of that hero.
export function openComicsFor(query) {
  if (!cv.hasKey()) return toast(t('Adicione sua chave do ComicVine em Ajustes → Chaves.'), 6000);
  router.push(ComicGridView(query));
}
