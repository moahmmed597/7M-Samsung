// Books tab, built like Manga and Comics: your shelves (continue reading, favourites), rows from your own
// book sources, genres as tiles and the Open Library catalog. A book from the catalog looks itself up in
// your sources (the one with the most chapters wins, 📚 to choose) and opens in the same reader: the
// plugins draw each page of text as a picture (16:9), so the reader turns pages like a comic.
import { h, clear, loadVisibleImages } from '../lib/dom.js';
import * as nav from '../lib/nav.js';
import * as store from '../lib/store.js';
import * as ol from '../api/openlibrary.js';
import * as pl from '../api/plugins.js';
import { topbar, card, spinnerLine, toast, promptText, menu } from '../ui.js';
import * as router from '../router.js';
import { t } from '../lib/i18n.js';
import { keysGuide } from './keysGuide.js';
import { tileRow, setTileArt } from './anime.js';
import { openSources, openSourceManga, sourceRows, searchPlugin } from './sources.js';
import { openReader, readingModeMenu, readingModeLabel } from './reader.js';
import * as shelf from '../lib/mangaLib.js';
import { holdMenu } from './continueRow.js';
import { openListen, listenProgress, listenList, forgetListen } from './listen.js';
import { chapterSearchRow, focusChapter } from '../lib/chapterJump.js';
import { scanSources, linkOf, norm } from '../lib/sourceFind.js';
import * as links2 from '../lib/crossLinks.js';

// Open Library subjects: [subject, Portuguese label for t()]
const GENRES = [
  ['fantasy', 'Fantasia'], ['science_fiction', 'Ficção científica'], ['mystery', 'Mistério'], ['thriller', 'Suspense'],
  ['romance', 'Romance'], ['horror', 'Terror'], ['history', 'História'], ['biography', 'Biografias'],
  ['self-help', 'Autoajuda'], ['philosophy', 'Filosofia'], ['young_adult_fiction', 'Jovem adulto'], ['classics', 'Clássicos'],
];
const MONTH = 30 * 864e5;

// The books everyone knows, first in the tab: [name, author]. Covers and Open Library ids are looked up
// once and kept for a month.
const FAMOUS = [
  ['🔥', 'Livros famosos', [
    ['A Game of Thrones', 'George R. R. Martin'], ['The Last Wish', 'Andrzej Sapkowski'], ["Harry Potter and the Philosopher's Stone", 'J. K. Rowling'],
    ['The Fellowship of the Ring', 'J. R. R. Tolkien'], ['The Hobbit', 'J. R. R. Tolkien'], ['Dune', 'Frank Herbert'], ['The Hunger Games', 'Suzanne Collins'],
    ['The Name of the Wind', 'Patrick Rothfuss'], ['The Way of Kings', 'Brandon Sanderson'], ['Mistborn', 'Brandon Sanderson'], ['The Eye of the World', 'Robert Jordan'],
    ['Fourth Wing', 'Rebecca Yarros'], ['A Court of Thorns and Roses', 'Sarah J. Maas'], ['The Lightning Thief', 'Rick Riordan'], ['Shadow and Bone', 'Leigh Bardugo'],
    ['The Lion, the Witch and the Wardrobe', 'C. S. Lewis'], ['Eragon', 'Christopher Paolini'], ['The Alchemist', 'Paulo Coelho'], ['The Da Vinci Code', 'Dan Brown'],
  ]],
  ['🎬', 'Viraram filmes e séries', [
    ['The Godfather', 'Mario Puzo'], ['Jurassic Park', 'Michael Crichton'], ['The Shining', 'Stephen King'], ['It', 'Stephen King'], ['The Martian', 'Andy Weir'],
    ['Gone Girl', 'Gillian Flynn'], ['The Silence of the Lambs', 'Thomas Harris'], ['Fight Club', 'Chuck Palahniuk'], ['Shogun', 'James Clavell'],
    ['The Three-Body Problem', 'Liu Cixin'], ['Leviathan Wakes', 'James S. A. Corey'], ["The Handmaid's Tale", 'Margaret Atwood'], ['Outlander', 'Diana Gabaldon'],
    ['The Lord of the Rings', 'J. R. R. Tolkien'], ['Twilight', 'Stephenie Meyer'], ['The Maze Runner', 'James Dashner'], ['Ready Player One', 'Ernest Cline'],
  ]],
  ['🏛', 'Clássicos que todo mundo conhece', [
    ['Nineteen Eighty-Four', 'George Orwell'], ['To Kill a Mockingbird', 'Harper Lee'], ['Pride and Prejudice', 'Jane Austen'], ['The Great Gatsby', 'F. Scott Fitzgerald'],
    ['Crime and Punishment', 'Fyodor Dostoevsky'], ['One Hundred Years of Solitude', 'Gabriel García Márquez'], ['Les Misérables', 'Victor Hugo'],
    ['The Count of Monte Cristo', 'Alexandre Dumas'], ['Don Quixote', 'Miguel de Cervantes'], ['The Little Prince', 'Antoine de Saint-Exupéry'], ['Animal Farm', 'George Orwell'],
    ['Frankenstein', 'Mary Shelley'], ['Dracula', 'Bram Stoker'], ['Moby-Dick', 'Herman Melville'], ['War and Peace', 'Leo Tolstoy'], ['The Old Man and the Sea', 'Ernest Hemingway'],
  ]],
  ['🕵', 'Mistério e suspense famosos', [
    ['The Girl with the Dragon Tattoo', 'Stieg Larsson'], ['And Then There Were None', 'Agatha Christie'], ['Murder on the Orient Express', 'Agatha Christie'],
    ['The Silent Patient', 'Alex Michaelides'], ['Angels & Demons', 'Dan Brown'], ['The Girl on the Train', 'Paula Hawkins'], ['A Study in Scarlet', 'Arthur Conan Doyle'],
    ['The Hound of the Baskervilles', 'Arthur Conan Doyle'], ['Big Little Lies', 'Liane Moriarty'], ['The Firm', 'John Grisham'], ['Rebecca', 'Daphne du Maurier'],
  ]],
];

function famousList(list) {
  const all = store.get('bookFamous1', {}) || {};
  const fresh = (x) => all[x[0]] && all[x[0]].at > Date.now() - MONTH;
  const out = new Array(list.length);
  let i = 0;
  const lane = () => {
    if (i >= list.length) return Promise.resolve();
    const k = i++;
    const x = list[k];
    if (fresh(x)) {
      out[k] = all[x[0]].m;
      return lane();
    }
    return ol
      .famous(x[0], x[1])
      .then((m) => {
        out[k] = m;
        all[x[0]] = { at: Date.now(), m: m };
      }, () => {})
      .then(lane);
  };
  return Promise.all([lane(), lane(), lane(), lane()]).then(() => {
    store.set('bookFamous1', all);
    return out.filter(Boolean);
  });
}

// One cover per genre tile (the top book of that subject), kept for a month.
function genreArt(row) {
  const cached = store.get('bookGenreArt', null);
  const urls = cached && cached.at > Date.now() - MONTH && cached.urls ? cached.urls.slice() : [];
  let i = 0;
  let changed = false;
  const lane = () => {
    while (i < GENRES.length && urls[i]) i++;
    if (i >= GENRES.length) return Promise.resolve();
    const k = i++;
    return ol
      .subject(GENRES[k][0], 0)
      .then((r) => {
        const b = r.items[0];
        if (b && b.poster) {
          urls[k] = b.poster.replace('-M.jpg', '-L.jpg');
          changed = true;
          setTileArt(row, urls);
        }
      }, () => {})
      .then(lane);
  };
  setTileArt(row, urls);
  Promise.all([lane(), lane()]).then(() => changed && store.set('bookGenreArt', { at: Date.now(), urls: urls }));
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
          items.slice(0, 20).forEach((m) => track.appendChild(card(m, { onSelect: () => openBookDetails(m) })));
          if (onMore)
            track.appendChild(
              h('div.card.see-all', { focusable: true, onSelect: onMore }, [h('div.poster-wrap', null, h('div.see-all-label', null, [h('b', { text: '→' }), t('Ver tudo')])), h('div.name', { text: '' })])
            );
          loadVisibleImages(row);
        })
        .catch(() => row.parentNode && parent.removeChild(row)),
  };
}

export function BooksView() {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const bar = topbar('books', router.goTab);
  const rows = h('div.rows');
  scroller.appendChild(bar);
  scroller.appendChild(
    h('div.details-buttons', { 'data-group': '' }, [
      h('div.btn', { focusable: true, onSelect: search }, [h('span.ico', { text: '🔍' }), t('Buscar livros')]),
      h('div.btn', { focusable: true, onSelect: () => openSources('books') }, [h('span.ico', { text: '📚' }), t('Minhas fontes')]),
    ])
  );
  const shelves = h('div');
  scroller.appendChild(shelves);
  scroller.appendChild(rows);
  el.appendChild(scroller);

  function search() {
    promptText(t('Buscar livros'), '', t('Título ou autor'), (q) => q.trim() && router.push(BookGridView('🔍 ' + q.trim(), (n) => ol.search(q.trim(), n))));
  }

  function drawShelves() {
    clear(shelves);
    const mk = (title, list) => {
      if (!list.length) return;
      const track = h('div.row-track', { 'data-scroll-x': '', 'data-group': '' });
      list.forEach((x) => {
        const open = () => (x.ref.olKey ? openBookDetails(Object.assign({ id: 'ol:' + x.ref.olKey, type: 'book' }, x.ref)) : openSourceManga(x.ref));
        const c = card({ id: x.key, name: x.name, poster: x.poster }, { onSelect: open });
        if (x.cont) c.__long = holdMenu(x.name, open, () => (shelf.forget(x.key), forgetListen(x.key), toast(t('Tirado de Continuar lendo.')), drawShelves()), t('Tirar de Continuar lendo'));
        track.appendChild(c);
      });
      shelves.appendChild(h('div.row', { 'data-anchor': '30' }, [h('div.row-title', { text: title }), track]));
      loadVisibleImages(track);
    };
    // What you read and what you listen to, newest first (one card per book).
    const seen = {};
    const cont = shelf
      .continueList(60)
      .filter((p) => shelf.tabOf(p) === 'books')
      .map((p) => ({ cont: true, at: p.at, key: p.key, ref: p.ref, name: (p.title || '') + ' · ' + t('Cap. {n}', { n: p.chapter }), poster: p.poster }))
      .concat(listenList().map((p) => ({ cont: true, listen: true, at: p.at, key: p.key, ref: p.ref, name: '🎧 ' + (p.title || ''), poster: p.poster })))
      .sort((a, b) => b.at - a.at)
      .filter((x) => !seen[x.key] && (seen[x.key] = 1))
      .slice(0, 15);
    mk(t('Continuar lendo'), cont);
    mk(t('Favoritos'), shelf.favs().filter((f) => shelf.tabOf(f) === 'books').map((f) => ({ key: f.key, ref: f.ref, name: f.ref.name, poster: f.ref.poster })));
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
  // The famous books first, then your sources (all readable), then the rest of the catalog.
  FAMOUS.forEach((f) => pending.push(posterRow(rows, f[0] + ' ' + t(f[1]), () => famousList(f[2]))));
  sourceRows(rows, 'books').forEach((r) => pending.push(r));
  if (pending.length) rows.appendChild(h('div.row-title.src-rows-title', { text: t('Catálogo') }));
  pending.push(posterRow(rows, t('Em alta hoje'), () => ol.trending('daily')));
  const genreRow = tileRow(rows, t('Gêneros'), GENRES.map((g) => ({ label: t(g[1]), open: () => router.push(BookGridView(t(g[1]), (n) => ol.subject(g[0], n))) })), 'discover');
  genreArt(genreRow);
  pending.push(posterRow(rows, t('Em alta na semana'), () => ol.trending('weekly')));
  pending.push(posterRow(rows, t('Livros em árabe'), () => ol.search('language:ara', 0).then((r) => r.items), () => router.push(BookGridView(t('Livros em árabe'), (n) => ol.search('language:ara', n)))));
  [['fantasy', 'Fantasia'], ['mystery', 'Mistério'], ['science_fiction', 'Ficção científica']].forEach((g) =>
    pending.push(posterRow(rows, t(g[1]), () => ol.subject(g[0], 0).then((r) => r.items), () => router.push(BookGridView(t(g[1]), (n) => ol.subject(g[0], n)))))
  );
  setTimeout(loadNearby, 50);

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

// A grid of books; pageOf(n) → { items, more }.
function BookGridView(title, pageOf) {
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
    pageOf(n++)
      .then((r) => {
        const sp = gridEl.querySelector('.loading-line');
        if (sp) gridEl.removeChild(sp);
        r.items.forEach((m) => {
          if (seen[m.id]) return;
          seen[m.id] = true;
          gridEl.appendChild(card(m, { onSelect: () => openBookDetails(m) }));
        });
        if (!gridEl.querySelector('.card')) gridEl.appendChild(h('div.modal-text', { text: t('Nada por aqui.') }));
        if (r.more) {
          more = h('div.card.see-all', { focusable: true, onSelect: () => next() }, [h('div.poster-wrap', null, h('div.see-all-label', null, [h('b', { text: '+' }), t('Carregar mais')])), h('div.name', { text: '' })]);
          gridEl.appendChild(more);
        }
        loadVisibleImages(el, 400);
        if (n === 1) {
          const first = gridEl.querySelector('.card');
          if (first) nav.focus(first);
        }
      })
      .catch(() => {
        const sp = gridEl.querySelector('.loading-line');
        if (sp) gridEl.removeChild(sp);
        toast(t('Não foi possível carregar agora.'));
      });
  }
  next();
  return { el: el, onShow: () => loadVisibleImages(el, 400), onScroll: () => loadVisibleImages(el, 400) };
}

// ---------- one book ----------
const CHUNK = 50;
function links() {
  return store.get('bookLinks', {}) || {};
}
function saveLink(id, v) {
  const all = links();
  if (v) all[id] = v;
  else delete all[id];
  store.set('bookLinks', all);
}

export function openBookDetails(m) {
  router.push(BookDetailsView(m));
}

// From a film or a show: the book of the same title (straight to it when one clearly matches, else the
// search results to choose from).
export function openBookFor(title) {
  const n = norm(title);
  const base = String(title || '').split(/[:：]/)[0].trim();
  const grid = (q) => router.push(BookGridView('🔍 ' + q, (p) => ol.search(q, p)));
  ol.search(title, 0)
    .then((r) => {
      const hit = r.items.find((b) => norm(b.title) === n);
      if (hit) return openBookDetails(hit);
      // Nothing under the full name of a spin-off ("Series: Part")? The series itself.
      if (!r.items.length && base && base !== title) return grid(base);
      grid(title);
    })
    .catch(() => grid(title));
}

function BookDetailsView(m0) {
  const m = Object.assign({}, m0);
  const key = 'ol' + m.olKey;
  const el = h('div.view.md-view');
  const info = h('div.md-info');
  const list = h('div.md-list', { 'data-scroll-y': '', 'data-pad-y': '120', 'data-group': '', 'data-vertical': '' });
  el.appendChild(info);
  const guide = keysGuide(null, {});
  el.appendChild(guide);
  el.appendChild(list);
  let chapters = [];
  let chunk = 0;
  let alive = true;
  let source = null;
  let found = null;
  let scanning = null;
  let picked = false;
  let audio = []; // the source's audiobook tracks (🎧 Listen)
  let audioFor = '';
  let linked = []; // films, shows, anime, manga of the same story
  const status = h('div.loading-line', { text: t('Procurando nas suas fontes...') });
  const progress = () => (store.get('readProgress', {}) || {})[key] || null;
  const langOf = (pid) => ((pl.installed().find((p) => p.id === pid) || {}).lang || '');

  function indexOfProgress() {
    const p = progress();
    if (!p) return -1;
    const i = chapters.findIndex((c) => c.id === p.chapterId);
    if (i >= 0 || p.chapter == null) return i;
    return chapters.findIndex((c) => c.chapter != null && String(c.chapter) === String(p.chapter));
  }

  function read(index, page) {
    if (!chapters.length) {
      const first = list.querySelector('.stream.near') || list.querySelector('.stream');
      if (first) nav.focus(first);
      return toast(source ? t('Nenhum capítulo encontrado.') : t('Escolha o livro na lista ao lado.'), 4000);
    }
    openReader({
      key: key,
      title: m.name,
      chapters: chapters,
      index: Math.max(0, index),
      startPage: page || 0,
      poster: m.poster,
      kind: 'ol',
      ref: { olKey: m.olKey, name: m.name, title: m.title, poster: m.poster, author: m.author, tab: 'books' },
      rtl: source ? /^ar/i.test(langOf(source.pid)) : false,
      pagesFn: source ? (cid) => pl.pages(source.pid, cid) : undefined,
    });
  }

  const bookRef = () => ({ olKey: m.olKey, name: m.name, title: m.title, poster: m.poster, author: m.author, tab: 'books' });
  // Listening place → reading chapter, and back (same chapter number, or same position when the counts match).
  function chapterForTrack(lp) {
    if (lp.chapter != null) {
      const i = chapters.findIndex((c) => c.chapter != null && String(c.chapter) === String(lp.chapter));
      if (i >= 0) return i;
    }
    return chapters.length && chapters.length === audio.length ? Math.min(lp.track, chapters.length - 1) : -1;
  }
  function trackForChapter(ci) {
    const c = chapters[ci];
    if (!c) return -1;
    const i = audio.findIndex((tr) => tr.chapter != null && String(tr.chapter) === String(c.chapter));
    if (i >= 0) return i;
    return audio.length === chapters.length ? ci : -1;
  }
  function listen(i, at) {
    openListen({
      key: key,
      title: m.name,
      poster: m.cover || m.poster,
      tracks: audio,
      index: i,
      startTime: at || 0,
      ref: bookRef(),
      chapters: chapters,
      pagesFn: source && chapters.length ? (cid) => pl.pages(source.pid, cid) : null,
      rtl: source ? /^ar/i.test(langOf(source.pid)) : false,
    });
  }
  // 📖 Read: if you listened further on, it offers to continue from there.
  function startRead() {
    const p = progress();
    const lp = listenProgress(key);
    const idx = indexOfProgress();
    const li = lp ? chapterForTrack(lp) : -1;
    const fromRead = () => (idx >= 0 ? read(idx, p.page) : read(0, 0));
    if (lp && (!p || lp.at > p.at) && li >= 0 && li !== idx)
      return menu(t('Ler'), [
        { label: '🎧 ' + t('Continuar do cap. {n} (onde você ouviu)', { n: chapters[li].chapter != null ? chapters[li].chapter : li + 1 }), value: 'l' },
        { label: '📖 ' + (idx >= 0 ? t('Continuar: cap. {n}', { n: chapters[idx].chapter }) : t('Do começo')), value: 'r' },
      ], { onPick: (v) => (v === 'l' ? read(li, 0) : fromRead()) });
    fromRead();
  }
  // 🎧 Listen: if you read further on, it offers to listen from there.
  function startListen() {
    const p = progress();
    const lp = listenProgress(key);
    const idx = indexOfProgress();
    const ri = idx >= 0 ? trackForChapter(idx) : -1;
    const fromListen = () => (lp ? listen(Math.min(lp.track, audio.length - 1), lp.time) : listen(0, 0));
    if (p && (!lp || p.at > lp.at) && ri >= 0 && (!lp || ri !== lp.track))
      return menu(t('Ouvir'), [
        { label: '📖 ' + t('Ouvir do cap. {n} (onde você leu)', { n: chapters[idx].chapter != null ? chapters[idx].chapter : idx + 1 }), value: 'r' },
        { label: '🎧 ' + (lp ? t('Continuar de onde parei') : t('Do começo')), value: 'l' },
      ], { onPick: (v) => (v === 'r' ? listen(ri, 0) : fromListen()) });
    fromListen();
  }
  function loadAudio() {
    if (!source || audioFor === source.pid + ':' + source.mid) return;
    audioFor = source.pid + ':' + source.mid;
    const mine = audioFor;
    pl.audioTracks(source.pid, source.mid).then((tr) => {
      if (!alive || mine !== audioFor) return;
      audio = tr;
      renderInfo();
      if (!chapters.length) renderList();
    });
  }

  function renderInfo() {
    clear(info);
    keysGuide(guide, { listen: audio.length > 0 });
    const cover = h('img.md-cover', { alt: '' });
    cover.setAttribute('data-lazy', m.cover || m.poster || '');
    info.appendChild(cover);
    const text = h('div.md-text');
    text.appendChild(h('div.md-title', { text: m.name }));
    text.appendChild(h('div.md-meta', { text: [m.author, m.year, (m.subjects || []).slice(0, 3).join(', ')].filter(Boolean).join('  ·  ') }));
    text.appendChild(h('div.md-desc', { text: String(m.description || '').replace(/\[\d+\]|\(\[source\][^)]*\)/g, '').trim() }));
    const p = progress();
    const idx = indexOfProgress();
    const lp = listenProgress(key);
    const btns = [];
    const main = [];
    if (chapters.length || !audio.length)
      main.push(h('div.btn.primary', { focusable: true, 'data-autofocus': '', onSelect: startRead }, [h('span.ico', { text: '📖' }), idx >= 0 ? t('Continuar: cap. {n}', { n: chapters[idx].chapter }) : t('Ler')]));
    if (audio.length)
      main.push(h('div.btn' + (chapters.length ? '' : '.primary'), { focusable: true, 'data-autofocus': chapters.length ? null : '', onSelect: startListen }, [h('span.ico', { text: '🎧' }), lp ? t('Continuar ouvindo') : t('Ouvir')]));
    btns.push(
      h('div.btn', { focusable: true, onSelect: () => (shelf.toggleFav(key, 'ol', Object.assign({}, m, { tab: 'books' })), renderInfo()) }, [h('span.ico', { text: shelf.isFav(key) ? '♥' : '♡' }), shelf.isFav(key) ? t('Nos favoritos') : t('Favoritar')])
    );
    if (linked.length) btns.push(h('div.btn', { focusable: true, onSelect: () => (linked.length === 1 ? linked[0].open() : links2.linkedMenu(linked)) }, [h('span.ico', { text: '🔗' }), t('Ligado ({n})', { n: linked.length })]));
    if (pl.installed('books').length) btns.push(h('div.btn', { focusable: true, onSelect: pickSource }, [h('span.ico', { text: '📚' }), h('span.lbl', { text: source ? source.name : t('Escolher fonte') })]));
    btns.push(h('div.btn', { focusable: true, onSelect: () => readingModeMenu(() => renderInfo()) }, [h('span.ico', { text: readingModeLabel().icon }), readingModeLabel().text]));
    // Read and Listen big on top; the rest smaller underneath.
    if (main.length) text.appendChild(h('div.details-buttons.main-buttons', { 'data-group': '' }, main));
    text.appendChild(h('div.details-buttons.more-buttons', { 'data-group': '' }, btns));
    info.appendChild(text);
    loadVisibleImages(info);
  }

  function renderList() {
    clear(list);
    if (!chapters.length && audio.length) {
      audio.forEach((tr, i) => list.appendChild(h('div.stream', { focusable: true, onSelect: () => listen(i, 0) }, [h('div.s-main', { text: '🎧 ' + (tr.title || t('Faixa {n}', { n: i + 1 })) })])));
      return;
    }
    if (!chapters.length) return list.appendChild(status);
    const start = chunk * CHUNK;
    const end = Math.min(chapters.length, start + CHUNK);
    const p = progress();
    const nav2 = (label, to) => h('div.stream.md-nav', { focusable: true, onSelect: () => ((chunk = to), renderList()) }, [h('div.s-main', { text: label })]);
    if (chapters.length > 8) list.appendChild(chapterSearchRow(() => chapters, (i) => ((chunk = Math.floor(i / CHUNK)), renderList(), focusChapter(list, i))));
    if (chunk > 0) list.appendChild(nav2('◀ ' + t('Capítulos {a}–{b}', { a: (chunk - 1) * CHUNK + 1, b: chunk * CHUNK }), chunk - 1));
    for (let i = start; i < end; i++) {
      const c = chapters[i];
      const here = p && p.chapterId === c.id;
      list.appendChild(
        h('div.stream', { focusable: true, 'data-ci': String(i), onSelect: () => read(i, here ? p.page : 0) }, [
          h('div.s-main', { text: (c.chapter != null ? t('Cap. {n}', { n: c.chapter }) : '') + (c.title ? (c.chapter != null ? ' · ' : '') + c.title : '') }),
          here ? h('span.s-tag.ok', { text: t('Parou aqui') }) : null,
        ])
      );
    }
    if (end < chapters.length) list.appendChild(nav2(t('Capítulos {a}–{b}', { a: end + 1, b: Math.min(chapters.length, end + CHUNK) }) + ' ▶', chunk + 1));
  }

  function showSource(ln, cs, tracks) {
    source = ln;
    chapters = cs;
    if (tracks) {
      audio = tracks;
      audioFor = ln.pid + ':' + ln.mid;
    }
    const idx = indexOfProgress();
    chunk = idx >= 0 ? Math.floor(idx / CHUNK) : 0;
    renderInfo();
    renderList();
    loadAudio();
  }

  // Nothing matched well: what your sources did find for this title, one press to open it here.
  function useNear(c) {
    toast(t('Abrindo de {name}...', { name: c.name }));
    pl.chapters(c.pid, c.mid)
      .then((cs) => (cs.length ? { cs: cs } : pl.audioTracks(c.pid, c.mid).then((tr) => ({ cs: [], tracks: tr }))))
      .then((r) => {
        if (!alive) return;
        if (!r.cs.length && !(r.tracks && r.tracks.length)) return toast(t('Este não tem capítulos.'), 4000);
        const ln = { pid: c.pid, name: c.name, mid: c.mid, title: c.title, count: r.cs.length || r.tracks.length, manual: true };
        picked = true;
        saveLink(m.olKey, ln);
        showSource(ln, r.cs, r.tracks);
      })
      .catch(() => toast(t('Não consegui abrir.'), 4000));
  }
  function noSources(text) {
    renderInfo();
    clear(list);
    const seen = {};
    const offers = near
      .filter((c) => !seen[c.pid + c.mid] && (seen[c.pid + c.mid] = 1))
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
    if (offers.length) {
      list.appendChild(h('div.loading-line', { text: t('Achei nas suas fontes:') }));
      offers.forEach((c) =>
        list.appendChild(h('div.stream.near', { focusable: true, onSelect: () => useNear(c) }, [h('div.s-main', { text: '📕 ' + c.title }), h('span.s-tag', { text: c.name })]))
      );
    } else list.appendChild(h('div.loading-line', { text: text }));
    list.appendChild(h('div.loading-line', { text: t('Ou procure você mesmo:') }));
    pl.installed('books').forEach((p) => list.appendChild(h('div.stream', { focusable: true, onSelect: () => searchPlugin(p.id, p.name, m.title) }, [h('div.s-main', { text: '🔎 ' + t('Buscar em {name}', { name: p.name }) })])));
    list.appendChild(h('div.stream', { focusable: true, onSelect: () => openSources('books') }, [h('div.s-main', { text: '📚 ' + t('Minhas fontes') })]));
  }

  const near = []; // near misses from every source, offered when nothing matches well enough
  function scan(onHit) {
    if (!scanning)
      scanning = scanSources([m.title], onHit, { alive: () => alive, min: 0.8, kind: 'books', candidates: near }).then((all) => {
        found = all;
        return all;
      });
    return scanning;
  }

  function load() {
    if (!pl.installed('books').length) return noSources(t('Para ler, adicione suas fontes de livros em Minhas fontes.'));
    const ln = links()[m.olKey];
    if (ln) {
      status.textContent = t('Carregando capítulos de {name}...', { name: ln.name });
      return pl
        .chapters(ln.pid, ln.mid)
        .then((cs) =>
          cs.length ? cs : pl.audioTracks(ln.pid, ln.mid).then((tr) => {
            if (!tr.length) throw new Error('empty');
            audio = tr;
            audioFor = ln.pid + ':' + ln.mid;
            return cs;
          })
        )
        .then((cs) => {
          if (!alive) return;
          showSource(ln, cs);
        })
        .catch(() => {
          if (!alive) return;
          saveLink(m.olKey, null);
          autoFind();
        });
    }
    autoFind();
  }

  function autoFind() {
    status.textContent = t('Procurando nas suas fontes...');
    renderList();
    scan((hit) => {
      if (!source && !picked) showSource(linkOf(hit), hit.cs, hit.tracks);
    }).then((all) => {
      if (!alive) return;
      if (!all.length) return noSources(t('Não encontrei este título nas suas fontes.'));
      if (picked) return;
      const best = all[0];
      saveLink(m.olKey, linkOf(best));
      if (!source || source.pid !== best.pid) showSource(linkOf(best), best.cs, best.tracks);
      if (all.length > 1) toast(t('Achei em {n} fontes. Troque no botão 📚.', { n: all.length }), 5000);
    });
  }

  function pickSource() {
    if (!found) {
      toast(t('Procurando nas suas fontes...'), 4000);
      return scan().then(() => alive && pickSource());
    }
    const items = found.map((hit) => ({ label: hit.name, sub: t('{n} capítulos', { n: hit.count }) + (norm(hit.title) !== norm(m.title) ? '  ·  ' + hit.title : ''), value: hit, checked: !!source && source.pid === hit.pid }));
    items.push({ label: '🔎 ' + t('Buscar manualmente'), sub: t('Procure com outro nome numa fonte'), value: 'manual' });
    menu(t('Fonte dos capítulos'), items, {
      onPick: (v) => {
        picked = true;
        if (v === 'manual') return menu(t('Buscar manualmente'), pl.installed('books').map((p) => ({ label: t('Buscar em {name}', { name: p.name }), value: p })), { onPick: (p) => searchPlugin(p.id, p.name, m.title) });
        saveLink(m.olKey, Object.assign(linkOf(v), { manual: true }));
        showSource(linkOf(v), v.cs, v.tracks);
      },
    });
  }

  renderInfo();
  load();
  ol.work(m.olKey)
    .then((w) => {
      if (!alive) return;
      Object.assign(m, { description: w.description, subjects: w.subjects, cover: w.cover || '' });
      renderInfo();
    })
    .catch(() => {});
  // Made into a film, a show, an anime or a manga?
  links2
    .forBook(m.title)
    .then((l) => {
      if (!alive || !l.length) return;
      linked = l;
      renderInfo();
    })
    .catch(() => {});

  return {
    el: el,
    onShow: () => {
      if (chapters.length) {
        renderInfo();
        renderList();
      }
      loadVisibleImages(el);
    },
    destroy: () => {
      alive = false;
    },
  };
}
