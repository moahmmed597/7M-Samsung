// Tela inicial: Hero Banner rotativo (Kai) + "Continuar assistindo" + catálogos dos addons.
import { h, clear, loadVisibleImages } from '../lib/dom.js';
import * as nav from '../lib/nav.js';
import { KEY } from '../lib/nav.js';
import * as addons from '../api/addons.js';
import * as stremio from '../api/stremio.js';
import * as hero from '../api/hero.js';
import { topbar, card, spinnerLine } from '../ui.js';
import * as router from '../router.js';
import { openDetails } from './details.js';
import * as newEpisodes from '../api/newEpisodes.js';
import * as tracker from '../api/tracker.js';
import * as phone from '../lib/phone.js';
import * as store from '../lib/store.js';
import { CatalogView, canPage } from './catalog.js';
import { t, epLabel } from '../lib/i18n.js';
import * as homeRows from '../lib/homeRows.js';
import * as mdblistRows from '../api/mdblistRows.js';
import { trailerIds } from './trailer.js';
import * as nc from '../api/nuvioCollections.js';
import * as extras from '../api/extras.js';
import { collectionRows } from './nuvioHome.js';

const ROTATE_MS = 8000;

export function HomeView() {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const bar = topbar('home', router.goTab);
  const heroUi = buildHero();
  const cwRow = h('div.row', { 'data-anchor': '30' });
  const neRow = h('div.row', { 'data-anchor': '30' });
  const rows = h('div.rows');
  scroller.appendChild(bar);
  scroller.appendChild(heroUi.el);
  scroller.appendChild(cwRow);
  scroller.appendChild(neRow);
  scroller.appendChild(rows);
  el.appendChild(scroller);

  let loadedBoard = false;

  // Trakt: items paused on other devices join Continue watching.
  tracker.onPlayback((list) => {
    if (stremio.mergeExternalProgress(list)) {
      renderContinue();
      publishBrowse();
    }
  });

  // Progress saved on other devices (phone, PC, Fire TV): refetch the account library when the
  // home screen comes back, at most once a minute, and redraw the row if anything changed.
  let lastSync = Date.now();
  function syncContinue() {
    if (!stremio.isLoggedIn() || Date.now() - lastSync < 60000) return;
    lastSync = Date.now();
    const before = JSON.stringify(stremio.continueWatching().map((it) => [it._id, it.state.video_id, it.state.timeOffset]));
    stremio
      .getLibrary()
      .then(() => {
        const after = JSON.stringify(stremio.continueWatching().map((it) => [it._id, it.state.video_id, it.state.timeOffset]));
        if (after !== before) {
          renderContinue();
          loadNew(true);
          publishBrowse();
        }
      })
      .catch(() => {});
  }
  // While the home screen stays open, check every 5 minutes too.
  const syncTimer = setInterval(() => {
    if (!el.classList.contains('hidden') && !perf()) syncContinue();
  }, 300000);

  // ---------- New episodes (series in your library, released this week) ----------
  let newList = perf() ? [] : newEpisodes.cached();
  let newLoadedAt = 0;
  function loadNew(force) {
    if (perf() || (!force && Date.now() - newLoadedAt < 30 * 60000)) return;
    newLoadedAt = Date.now();
    newEpisodes
      .load()
      .then((list) => {
        newList = list;
        renderNew();
        publishBrowse();
      })
      .catch(() => {});
  }

  function renderNew() {
    clear(neRow);
    if (!newList.length) {
      neRow.style.display = 'none';
      return;
    }
    neRow.style.display = '';
    neRow.appendChild(h('div.row-title', null, [t('Novos episódios'), h('small', { text: t('Séries da sua biblioteca, últimos 7 dias') })]));
    const track = h('div.row-track', { 'data-scroll-x': '', 'data-group': '' });
    newList.slice(0, 20).forEach((e) => {
      const c = card(
        { name: e.name, poster: e.poster },
        {
          wide: true,
          image: e.thumbnail || e.background || e.poster,
          title: e.name + ' · ' + epLabel(e.season, e.episode),
          onSelect: () => openDetails('series', e.seriesId, { videoId: e.videoId, autoStreams: true }),
        }
      );
      c.querySelector('.poster-wrap').appendChild(h('div.badge.new-badge', { text: dayLabel(e.released) }));
      track.appendChild(c);
    });
    neRow.appendChild(track);
    loadVisibleImages(neRow);
  }

  function dayLabel(ms) {
    const d = new Date(ms);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = new Date(d.getTime());
    day.setHours(0, 0, 0, 0);
    const diff = Math.round((today - day) / 86400000);
    if (diff <= 0) return t('Hoje');
    if (diff === 1) return t('Ontem');
    return t(['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][d.getDay()]);
  }

  // ---------- Browse on the phone: what the phone remote's Browse tab shows ----------
  function publishBrowse() {
    const cont = stremio.continueWatching().slice(0, 20).map((it) => ({
      type: it.type,
      id: it._id,
      video: it.state.video_id,
      name: it.name,
      sub: episodeLabel(it.state.video_id, it._id),
      poster: it.poster,
      progress: it.state.duration ? Math.round((it.state.timeOffset / it.state.duration) * 100) / 100 : 0,
    }));
    const fresh = newList.slice(0, 20).map((e) => ({
      type: 'series',
      id: e.seriesId,
      video: e.videoId,
      name: e.name,
      sub: epLabel(e.season, e.episode) + (e.title ? ' · ' + e.title : ''),
      poster: e.poster,
    }));
    const lib = stremio
      .cachedLibrary()
      .filter((it) => !it.removed && it.type !== 'other' && it.poster)
      .sort((a, b) => String(b._mtime || '').localeCompare(String(a._mtime || '')))
      .slice(0, 60)
      .map((it) => ({ type: it.type, id: it._id, name: it.name, poster: it.poster }));
    phone.browse({ continueWatching: cont, newEpisodes: fresh, library: lib, labels: { continueWatching: t('Continuar assistindo'), newEpisodes: t('Novos episódios'), library: t('Biblioteca') } });
  }

  function renderContinue() {
    clear(cwRow);
    const items = sortContinue(stremio.continueWatching()).slice(0, 20);
    if (!items.length) {
      cwRow.style.display = 'none';
      return;
    }
    cwRow.style.display = '';
    cwRow.appendChild(h('div.row-title', { text: t('Continuar assistindo') }));
    const track = h('div.row-track', { 'data-scroll-x': '', 'data-group': '' });
    items.forEach((it) => {
      const s = it.state;
      const ep = episodeLabel(s.video_id, it._id);
      const bg = /^tt\d+/.test(it._id) ? hero.background(it._id) : it.poster;
      track.appendChild(
        card(
          { name: it.name, poster: it.poster },
          {
            wide: true,
            image: bg,
            title: it.name + (ep ? ' · ' + ep : ''),
            progress: s.duration ? s.timeOffset / s.duration : 0,
            onSelect: () => openDetails(it.type, it._id, { videoId: s.video_id, autoStreams: true }),
          }
        )
      );
    });
    cwRow.appendChild(track);
    loadVisibleImages(cwRow);
  }

  // Fileiras sob demanda: só busca o catálogo quando a fileira chega perto da tela,
  // no máximo 2 ao mesmo tempo. Antes eram todas de uma vez e a TV ficava sem memória.
  let pending = [];
  let active = 0;

  function loadNearby() {
    if (el.offsetParent === null) return;
    const limit = window.innerHeight * 2.2;
    for (let i = 0; i < pending.length && active < 2; i++) {
      const p = pending[i];
      if (p.state !== 'idle') continue;
      if (!p.row.parentNode) {
        p.state = 'done';
        continue;
      }
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

  let boardToken = 0;
  function renderBoard() {
    const myBoard = ++boardToken;
    const alive = () => myBoard === boardToken && loadedBoard;
    loadedBoard = true;
    pending = [];
    clear(rows);
    rows.appendChild(spinnerLine(t('Carregando catálogos...')));
    addons
      .load()
      .then(() => {
        clear(rows);
        // Layout (Settings → Home screen): the imported collections (Kaptain), the add-on rows, or both.
        const layout = store.settings().homeLayout || 'collections';
        if (layout !== 'addons') {
          const box = h('div.nc-box');
          rows.appendChild(box);
          if (!extras.hasTmdb()) box.appendChild(h('div.nc-hint', { text: t('Coloque sua chave TMDB (Ajustes → Integrações) para ver as coleções da tela inicial.') }));
          nc.load('home')
            .then((data) => {
              if (!alive()) return;
              const list = collectionRows(box, data).map((x) => Object.assign(x, { state: 'idle' }));
              pending = list.concat(pending); // they sit above the add-on rows
              loadNearby();
            })
            .catch(() => box.appendChild(h('div.nc-hint', { text: t('Não foi possível carregar as coleções agora.') })));
        }
        if (layout === 'collections') return;
        // Add-on catalogs plus MDBList lists, in the order the user chose (Settings → Home rows).
        const wl = tracker.watchlistEntry();
        const cats = homeRows.visible((wl ? [wl] : []).concat(addons.boardCatalogs(), mdblistRows.boardEntries()));
        if (!cats.length) rows.appendChild(h('div.row-empty', { text: t('Nenhum catálogo. Entre na sua conta em Ajustes.') }));
        pending = pending.concat(cats.map((c) => Object.assign(buildRow(c, rows), { state: 'idle' })));
        loadNearby();
      })
      .catch((e) => {
        clear(rows);
        rows.appendChild(h('div.row-empty', { text: t('Erro ao carregar addons: {msg}', { msg: e.message }) }));
      });
  }

  heroUi.load();

  const view = {
    el: el,
    onShow: () => {
      renderContinue();
      syncContinue();
      tracker.maybeSync();
      renderNew();
      loadNew(false);
      publishBrowse();
      if (!loadedBoard) renderBoard();
      heroUi.resume();
      loadVisibleImages(el);
    },
    onHide: () => heroUi.pause(),
    onScroll: () => loadNearby(),
    // Chamado quando um vídeo começa: solta as fileiras (o catálogo volta do cache ao retornar).
    freeMemory: () => {
      newEpisodes.stop();
      newLoadedAt = 0; // check again once the video is closed
      pending = [];
      clear(rows);
      loadedBoard = false;
    },
    onKey: (e) => heroUi.onKey(e),
    reload: () => {
      heroUi.load();
      renderBoard();
    },
    destroy: () => {
      clearInterval(syncTimer);
      heroUi.pause();
      if (bar.__destroy) bar.__destroy();
    },
  };
  return view;
}

// Continue watching order (Settings → Home): recent (default), almost finished, or A–Z.
export const CW_SORTS = [
  { id: 'recent', label: 'Assistidos por último' },
  { id: 'progress', label: 'Quase terminados primeiro' },
  { id: 'name', label: 'Nome (A–Z)' },
];
function sortContinue(list) {
  const mode = store.settings().cwSort;
  const frac = (it) => (it.state && it.state.duration ? it.state.timeOffset / it.state.duration : 0);
  if (mode === 'progress') return list.slice().sort((a, b) => frac(b) - frac(a));
  if (mode === 'name') return list.slice().sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
  return list;
}

function episodeLabel(videoId, metaId) {
  if (!videoId || videoId === metaId) return '';
  const m = String(videoId).match(/:(\d+):(\d+)$/);
  return m ? epLabel(m[1], m[2]) : '';
}

const ROW_LIMIT = 20;

function buildRow(entry, parent) {
  const row = h('div.row', { 'data-anchor': '30' });
  const sub = entry.fetch ? entry.addon.manifest.name : typeLabel(entry.catalog.type) + ' · ' + (entry.addon.manifest.name || '');
  const title = h('div.row-title', null, [entry.catalog.name || entry.catalog.id, h('small', { text: sub })]);
  const track = h('div.row-track.pending', { 'data-scroll-x': '', 'data-group': '' }, spinnerLine(t('Carregando...')));
  row.appendChild(title);
  row.appendChild(track);
  parent.appendChild(row);
  const load = () =>
    (entry.fetch ? entry.fetch() : addons.fetchCatalog(entry))
      .then((metas) => {
        clear(track);
        track.classList.remove('pending');
        if (!metas.length) {
          if (row.parentNode) parent.removeChild(row);
          return;
        }
        metas.slice(0, ROW_LIMIT).forEach((m) => {
          track.appendChild(
            card(m, {
              onSelect: () => openDetails(m.type || entry.catalog.type, m.id),
            })
          );
        });
        // "See all" at the end of the row when the catalog has more than the row shows.
        if (!entry.fetch && (metas.length > ROW_LIMIT || canPage(entry))) {
          track.appendChild(
            h('div.card.see-all', { focusable: true, onSelect: () => router.push(CatalogView(entry)) }, [
              h('div.poster-wrap', null, h('div.see-all-label', null, [h('b', { text: '→' }), t('Ver tudo')])),
              h('div.name', { text: '' }),
            ])
          );
        }
        loadVisibleImages(row);
      })
      .catch(() => {
        if (row.parentNode) parent.removeChild(row);
      });
  return { row: row, load: load };
}

function perf() {
  return store.settings().perfMode !== false;
}

function typeLabel(type) {
  return { movie: t('Filmes'), series: t('Séries'), anime: t('Animes'), channel: t('Canais'), tv: 'TV' }[type] || type;
}

// ---------- Hero Banner ----------
function buildHero() {
  // Divs com background-image (tamanho fixo): a imagem só aparece pronta, já no tamanho final.
  const bgA = h('div.hero-bg');
  const bgB = h('div.hero-bg');
  const logo = h('img.hero-logo', { alt: '' });
  const title = h('div.hero-title');
  const meta = h('div.hero-meta');
  const desc = h('div.hero-desc');
  const dots = h('div.hero-dots');
  const watchBtn = h('div.btn.primary', { focusable: true, html: '<span class="ico">▶</span>' + t('Assistir'), onSelect: () => open(true) });
  const infoBtn = h('div.btn', { focusable: true, html: '<span class="ico">ⓘ</span>' + t('Detalhes'), onSelect: () => open(false) });
  const buttons = h('div.hero-buttons', { 'data-group': '' }, [watchBtn, infoBtn]);
  buttons.__last = watchBtn; // entrar no banner sempre pelo "Assistir"
  const ambient = h('div.hero-ambient');
  const el = h('div.hero', { 'data-anchor': '0' }, [
    bgA,
    bgB,
    ambient,
    h('div.hero-shade-left'),
    h('div.hero-shade-bottom'),
    h('div.hero-info', null, [logo, title, meta, desc, buttons, dots]),
  ]);

  let items = [];
  let index = 0;
  let timer = null;
  let front = bgA;
  let paused = true;
  let bgToken = 0;

  // ---------- Ambient mode (Settings → Appearance): the trailer plays behind the banner ----------
  let ambientTimer = null;
  let ambientOn = false;
  function stopAmbient() {
    clearTimeout(ambientTimer);
    ambientTimer = null;
    if (ambientOn) {
      ambientOn = false;
      ambient.classList.remove('show');
      const f = ambient.firstChild;
      if (f) f.src = 'about:blank';
      clear(ambient);
    }
  }
  function queueAmbient() {
    stopAmbient();
    if (!store.settings().ambientMode || paused) return;
    const it = items[index];
    ambientTimer = setTimeout(() => {
      if (paused || items[index] !== it || el.getBoundingClientRect().bottom < 200) return;
      const ids = it.trailers && it.trailers.length ? Promise.resolve(it.trailers) : addons.fetchMeta(it.type, it.id).then((m) => (it.trailers = trailerIds(m || {})));
      ids
        .then((list) => {
          if (paused || items[index] !== it || !list.length) return;
          clearTimeout(timer); // no rotation while the trailer plays
          ambientOn = true;
          const frame = h('iframe', { tabindex: '-1', allow: 'autoplay; encrypted-media', referrerpolicy: 'origin' });
          frame.onload = () => setTimeout(() => ambientOn && ambient.classList.add('show'), 1500);
          frame.src = 'https://www.youtube-nocookie.com/embed/' + list[0] + '?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&start=5';
          ambient.appendChild(frame);
          // A minute and a half, then back to the rotating pictures.
          ambientTimer = setTimeout(() => {
            stopAmbient();
            schedule();
          }, 90000);
        })
        .catch(() => {});
    }, 4000);
  }

  function open(play) {
    const it = items[index];
    if (it) openDetails(it.type, it.id, { autoStreams: play });
  }

  function render() {
    const it = items[index];
    if (!it) {
      el.style.display = 'none';
      return;
    }
    el.style.display = '';
    const back = front === bgA ? bgB : bgA;
    const pre = new Image();
    const token = ++bgToken;
    pre.onload = () => {
      if (token !== bgToken) return;
      back.style.backgroundImage = 'url("' + it.background + '")';
      // Dois frames para o fundo ser pintado antes do fade.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          back.classList.add('show');
          front.classList.remove('show');
          front = back;
        })
      );
    };
    pre.src = it.background;
    title.textContent = it.name;
    title.style.display = 'none';
    logo.style.display = '';
    logo.onerror = () => {
      logo.style.display = 'none';
      title.style.display = '';
    };
    logo.src = it.logo;
    const parts = [];
    if (it.year) parts.push(it.year);
    if (it.runtime) parts.push(it.runtime);
    if (it.genres && it.genres.length) parts.push(it.genres.slice(0, 3).join(', '));
    meta.innerHTML = (it.rating ? '<span class="imdb">★ ' + escapeHtml(it.rating) + '</span> · ' : '') + escapeHtml(parts.join(' · '));
    desc.textContent = it.description || '';
    clear(dots);
    items.forEach((_, i) => dots.appendChild(h('span', { cls: i === index ? 'on' : '' })));
    // Pré-carrega o próximo fundo.
    const nx = items[(index + 1) % items.length];
    if (nx) new Image().src = nx.background;
    queueAmbient();
  }

  function schedule() {
    clearTimeout(timer);
    if (paused || ambientOn || items.length < 2 || perf()) return; // Performance mode: changes only with left/right
    timer = setTimeout(() => {
      // Scrolled down to the rows: keep still, a fade there only costs smoothness.
      if (el.getBoundingClientRect().bottom > 0) {
        index = (index + 1) % items.length;
        render();
      }
      schedule();
    }, ROTATE_MS);
  }

  function go(delta) {
    if (!items.length) return;
    index = (index + delta + items.length) % items.length;
    render();
    schedule();
  }

  return {
    el: el,
    load: () =>
      hero
        .load()
        .then((list) => {
          items = list.slice(0, 12);
          index = 0;
          render();
          schedule();
        })
        .catch(() => {
          items = [];
          render();
        }),
    // Fora de vista, o banner solta os fundos (2 imagens 1920x1080 ≈ 16 MB na memória).
    pause: () => {
      paused = true;
      stopAmbient();
      clearTimeout(timer);
      bgToken++;
      bgA.style.backgroundImage = '';
      bgB.style.backgroundImage = '';
      bgA.classList.remove('show');
      bgB.classList.remove('show');
    },
    resume: () => {
      paused = false;
      if (items.length) render();
      schedule();
    },
    // Esquerda no primeiro botão / direita no último: troca o destaque.
    onKey: (e) => {
      const cur = nav.current();
      if (!cur || !buttons.contains(cur)) return false;
      if (e.keyCode === KEY.LEFT && cur === watchBtn) {
        go(-1);
        return true;
      }
      if (e.keyCode === KEY.RIGHT && cur === infoBtn) {
        go(1);
        return true;
      }
      return false;
    },
  };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}
