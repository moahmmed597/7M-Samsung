// A comic series: cover and summary from ComicVine, the issues from your own sources (the one with the
// most issues is picked; 📚 lets you choose another), the reader, and the movies and shows of the
// same hero (TMDB): Spider-Man comics → the Spider-Man films.
import { h, clear, loadVisibleImages } from '../lib/dom.js';
import * as store from '../lib/store.js';
import * as nav from '../lib/nav.js';
import * as cv from '../api/comicvine.js';
import * as pl from '../api/plugins.js';
import * as extras from '../api/extras.js';
import { toast, menu } from '../ui.js';
import * as router from '../router.js';
import { t } from '../lib/i18n.js';
import { openReader, readingModeMenu, readingModeLabel } from './reader.js';
import { searchPlugin, openSources } from './sources.js';
import { openDetails } from './details.js';
import * as shelf from '../lib/mangaLib.js';
import { chapterSearchRow, focusChapter } from '../lib/chapterJump.js';
import { scanSources, linkOf, norm } from '../lib/sourceFind.js';

const CHUNK = 50;
const TMDB_IMG = 'https://image.tmdb.org/t/p/w342';

export function openComicDetails(m) {
  router.push(ComicDetailsView(m));
}

function plain(text) {
  return String(text || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// The hero of a series, to look for its films: the main character, else the title without the extras.
function heroOf(m) {
  const chars = m.characters || [];
  const title = norm(m.title);
  const inTitle = chars.find((c) => title.indexOf(norm(c)) >= 0);
  if (inTitle) return inTitle;
  return String(m.title || '')
    .replace(/\(.*?\)/g, '')
    .replace(/^(the\s+)?(all-new|all new|amazing|spectacular|uncanny|ultimate|superior|savage|mighty|astonishing|incredible|sensational|new|original)\s+/i, '')
    .replace(/[:\-–].*$/, '')
    .replace(/\s+(vol(ume)?\.?\s*\d+|\d+)$/i, '')
    .trim();
}

// Films and shows of that hero (TMDB, with your key): titles that carry the hero's name.
export function moviesOf(hero) {
  if (!hero || !extras.hasTmdb()) return Promise.resolve([]);
  const n = norm(hero);
  return extras.tmdbGet('search/multi', { query: hero, include_adult: false }).then((r) =>
    ((r && r.results) || [])
      .filter((x) => (x.media_type === 'movie' || x.media_type === 'tv') && x.poster_path && norm(x.title || x.name).indexOf(n) >= 0)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 20)
  );
}
export function openTmdb(x) {
  const type = x.media_type === 'tv' ? 'tv' : 'movie';
  extras
    .tmdbImdb(type, x.id)
    .then((imdb) => (imdb ? openDetails(type === 'tv' ? 'series' : 'movie', imdb) : toast(t('Não encontrei este título.'))))
    .catch(() => toast(t('Não encontrei este título.')));
}

function links() {
  return store.get('comicLinks', {}) || {};
}
function saveLink(id, v) {
  const all = links();
  if (v) all[id] = v;
  else delete all[id];
  store.set('comicLinks', all);
}

function ComicDetailsView(m0) {
  const m = Object.assign({}, m0);
  const key = 'cv' + m.cvId;
  const el = h('div.view.md-view');
  const info = h('div.md-info');
  const list = h('div.md-list', { 'data-scroll-y': '', 'data-pad-y': '120', 'data-group': '', 'data-vertical': '' });
  el.appendChild(info);
  el.appendChild(list);

  let chapters = [];
  let chunk = 0;
  let alive = true;
  let source = null;
  let found = null;
  let scanning = null;
  let picked = false;
  let movies = null;
  const status = h('div.loading-line', { text: t('Procurando edições...') });
  const progress = () => (store.get('readProgress', {}) || {})[key] || null;

  function indexOfProgress() {
    const p = progress();
    if (!p) return -1;
    const i = chapters.findIndex((c) => c.id === p.chapterId);
    if (i >= 0 || p.chapter == null) return i;
    return chapters.findIndex((c) => c.chapter != null && parseFloat(c.chapter) === parseFloat(p.chapter));
  }

  function read(index, page) {
    if (!chapters.length) return toast(t('Nenhuma edição encontrada.'));
    openReader({
      key: key,
      title: m.name,
      chapters: chapters,
      index: Math.max(0, index),
      startPage: page || 0,
      poster: m.poster,
      kind: 'cv',
      ref: { cvId: m.cvId, name: m.name, title: m.title, poster: m.poster, year: m.year },
      rtl: false, // western comics read left to right
      pagesFn: source ? (cid) => pl.pages(source.pid, cid) : undefined,
    });
  }

  function renderInfo() {
    clear(info);
    const cover = h('img.md-cover', { alt: '' });
    cover.setAttribute('data-lazy', m.poster || '');
    info.appendChild(cover);
    const text = h('div.md-text');
    text.appendChild(h('div.md-title', { text: m.name }));
    const bits = [m.publisher, m.issues ? t('{n} edições', { n: m.issues }) : '', (m.characters || []).slice(0, 3).join(', ')];
    text.appendChild(h('div.md-meta', { text: bits.filter(Boolean).join('  ·  ') }));
    text.appendChild(h('div.md-desc', { text: plain(m.description || m.deck) }));
    const p = progress();
    const idx = indexOfProgress();
    const btns = [
      h('div.btn.primary', { focusable: true, 'data-autofocus': '', onSelect: () => (idx >= 0 ? read(idx, p.page) : read(0, 0)) }, [
        h('span.ico', { text: '📖' }),
        idx >= 0 ? t('Continuar: #{n}', { n: chapters[idx].chapter }) : t('Ler'),
      ]),
    ];
    if (movies && movies.length) btns.push(h('div.btn', { focusable: true, onSelect: moviesMenu }, [h('span.ico', { text: '🎬' }), t('Filmes e séries ({n})', { n: movies.length })]));
    btns.push(
      h('div.btn', { focusable: true, onSelect: () => (shelf.toggleFav(key, 'cv', m), renderInfo()) }, [
        h('span.ico', { text: shelf.isFav(key) ? '♥' : '♡' }),
        shelf.isFav(key) ? t('Nos favoritos') : t('Favoritar'),
      ])
    );
    if (pl.installed().length) btns.push(h('div.btn', { focusable: true, onSelect: pickSource }, [h('span.ico', { text: '📚' }), source ? source.name : t('Fonte')]));
    btns.push(h('div.btn', { focusable: true, onSelect: () => readingModeMenu(() => renderInfo()) }, [h('span.ico', { text: readingModeLabel().icon }), readingModeLabel().text]));
    text.appendChild(h('div.details-buttons', { 'data-group': '' }, btns));
    info.appendChild(text);
    loadVisibleImages(info);
  }

  function moviesMenu() {
    menu(
      t('Filmes e séries'),
      movies.map((x) => ({ label: x.title || x.name, sub: ((x.release_date || x.first_air_date || '').slice(0, 4) + '  ·  ' + (x.media_type === 'tv' ? t('Série') : t('Filme'))).trim(), value: x })),
      { onPick: openTmdb }
    );
  }

  function renderList(focusFirst) {
    clear(list);
    if (!chapters.length) {
      list.appendChild(status);
      return;
    }
    const start = chunk * CHUNK;
    const end = Math.min(chapters.length, start + CHUNK);
    const p = progress();
    const nav2 = (label, to) => h('div.stream.md-nav', { focusable: true, onSelect: () => ((chunk = to), renderList(true)) }, [h('div.s-main', { text: label })]);
    if (chapters.length > 8)
      list.appendChild(
        chapterSearchRow(() => chapters, (i) => {
          chunk = Math.floor(i / CHUNK);
          renderList(false);
          focusChapter(list, i);
        })
      );
    if (chunk > 0) list.appendChild(nav2('◀ ' + t('Edições {a}–{b}', { a: (chunk - 1) * CHUNK + 1, b: chunk * CHUNK }), chunk - 1));
    for (let i = start; i < end; i++) {
      const c = chapters[i];
      const here = p && p.chapterId === c.id;
      const label = (c.chapter !== null && c.chapter !== undefined ? '#' + c.chapter : t('Especial')) + (c.title ? ' · ' + c.title : '');
      list.appendChild(
        h('div.stream', { focusable: true, 'data-ci': String(i), onSelect: () => read(i, here ? p.page : 0) }, [
          h('div.s-main', { text: label }),
          here ? h('span.s-tag.ok', { text: t('Parou aqui') }) : null,
        ])
      );
    }
    if (end < chapters.length) list.appendChild(nav2(t('Edições {a}–{b}', { a: end + 1, b: Math.min(chapters.length, end + CHUNK) }) + ' ▶', chunk + 1));
    if (focusFirst) {
      const first = list.querySelector('.stream');
      if (first) nav.focus(first);
    }
  }

  function showSource(ln, cs) {
    source = ln;
    chapters = cs;
    const idx = indexOfProgress();
    chunk = idx >= 0 ? Math.floor(idx / CHUNK) : 0;
    renderInfo();
    renderList(false);
  }

  const names = () => {
    const out = [];
    [m.title, m.name].forEach((x) => x && !out.some((y) => norm(y) === norm(x)) && out.push(x));
    return out;
  };

  function scan(onHit) {
    if (!scanning)
      scanning = scanSources(names(), onHit, { alive: () => alive, year: m.year, min: 0.8 }).then((all) => {
        found = all;
        return all;
      });
    return scanning;
  }

  function noSources(text) {
    status.textContent = text;
    renderInfo();
    renderList(false);
    list.appendChild(h('div.stream', { focusable: true, onSelect: openSources }, [h('div.s-main', { text: '📚 ' + t('Minhas fontes') })]));
    pl.installed().forEach((p) =>
      list.appendChild(h('div.stream', { focusable: true, onSelect: () => searchPlugin(p.id, p.name, m.title) }, [h('div.s-main', { text: '🔎 ' + t('Buscar em {name}', { name: p.name }) })]))
    );
  }

  function loadIssues() {
    chapters = [];
    clear(list);
    list.appendChild(status);
    if (!pl.installed().length) return noSources(t('Para ler, adicione suas fontes em Minhas fontes.'));
    const ln = links()[m.cvId];
    if (ln) {
      status.textContent = t('Carregando capítulos de {name}...', { name: ln.name });
      return pl
        .chapters(ln.pid, ln.mid)
        .then((cs) => {
          if (!alive) return;
          if (!cs.length) throw new Error('empty');
          showSource(ln, sortIssues(cs));
        })
        .catch(() => {
          if (!alive) return;
          saveLink(m.cvId, null);
          autoFind();
        });
    }
    autoFind();
  }

  // Oldest issue first when they are numbered.
  function sortIssues(cs) {
    const num = (c) => (isFinite(parseFloat(c.chapter)) ? parseFloat(c.chapter) : null);
    if (cs.filter((c) => num(c) !== null).length >= cs.length * 0.6) cs.sort((a, b) => (num(a) === null ? 1e9 : num(a)) - (num(b) === null ? 1e9 : num(b)));
    return cs;
  }

  function autoFind() {
    status.textContent = t('Procurando nas suas fontes...');
    scan((hit) => {
      if (!source && !picked) showSource(linkOf(hit), sortIssues(hit.cs));
    }).then((all) => {
      if (!alive) return;
      if (!all.length) return noSources(t('Não encontrei este título nas suas fontes.'));
      if (picked) return;
      const best = all[0];
      saveLink(m.cvId, linkOf(best));
      if (!source || source.pid !== best.pid) showSource(linkOf(best), sortIssues(best.cs));
      if (all.length > 1) toast(t('Achei em {n} fontes. Troque no botão 📚.', { n: all.length }), 5000);
    });
  }

  function pickSource() {
    if (!found) {
      toast(t('Procurando nas suas fontes...'), 4000);
      return scan().then(() => alive && pickSource());
    }
    const items = found.map((hit) => ({
      label: hit.name,
      sub: t('{n} edições', { n: hit.count }) + (norm(hit.title) !== norm(m.title) ? '  ·  ' + hit.title : ''),
      value: hit,
      checked: !!source && source.pid === hit.pid,
    }));
    items.push({ label: '🔎 ' + t('Buscar manualmente'), sub: t('Procure com outro nome numa fonte'), value: 'manual' });
    menu(t('Fonte das edições'), items, {
      onPick: (v) => {
        picked = true;
        if (v === 'manual')
          return menu(t('Buscar manualmente'), pl.installed().map((p) => ({ label: t('Buscar em {name}', { name: p.name }), value: p })), {
            onPick: (p) => searchPlugin(p.id, p.name, m.title),
          });
        saveLink(m.cvId, Object.assign(linkOf(v), { manual: true }));
        showSource(linkOf(v), sortIssues(v.cs));
      },
    });
  }

  renderInfo();
  loadIssues();
  // Description and characters, then the films of the hero.
  cv.volume(m.cvId)
    .then((v) => {
      if (!alive) return;
      Object.assign(m, { description: v.description, characters: v.characters, publisher: v.publisher || m.publisher, issues: v.issues || m.issues, poster: m.poster || v.poster });
      renderInfo();
      return moviesOf(heroOf(m));
    })
    .catch(() => moviesOf(heroOf(m)))
    .then((list2) => {
      if (!alive || !list2) return;
      movies = list2;
      renderInfo();
    })
    .catch(() => {});

  return {
    el: el,
    onShow: () => {
      if (chapters.length) {
        renderInfo();
        renderList(false);
      }
      loadVisibleImages(el);
    },
    destroy: () => {
      alive = false;
    },
  };
}
