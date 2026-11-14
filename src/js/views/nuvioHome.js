// Imported Nuvio collections on screen: each collection is a row of folder tiles (the pack's own
// cover art, poster or landscape); a folder opens with one row per source; a row's "See all"
// opens a grid. Tiles and rows are built only as they come into view, so 780 folders stay light.
import { h, clear, loadVisibleImages } from '../lib/dom.js';
import * as nav from '../lib/nav.js';
import { card, spinnerLine, toast } from '../ui.js';
import * as router from '../router.js';
import * as nc from '../api/nuvioCollections.js';
import { openDetails } from './details.js';
import { t } from '../lib/i18n.js';

export function openItem(m) {
  nc.idFor(m)
    .then((id) => openDetails(m.type, id))
    .catch(() => toast(t('Não foi possível abrir agora.')));
}

function folderTile(f) {
  const shape = f.s === 'L' ? 'landscape' : f.s === 'S' ? 'square' : 'poster';
  const wrap = h('div.poster-wrap');
  if (f.c) {
    const im = h('img', { alt: '' });
    // The packs' covers are full HD (1920x1080, up to 1.4 MB): decoded, each one takes ~8 MB of the
    // TV's memory for a 380 px tile. wsrv.nl (also used by Nuvio) sends them at the tile's size.
    const size = shape === 'landscape' ? '&w=400&h=225&fit=cover' : shape === 'square' ? '&w=260&h=260&fit=contain&cbg=f2f0f8' : '&w=230&h=345&fit=cover';
    const small = 'https://wsrv.nl/?url=' + encodeURIComponent(f.c) + size + '&output=jpg&q=80';
    im.setAttribute('data-lazy', small);
    let triedFull = false;
    im.onerror = () => {
      if (!triedFull) {
        triedFull = true; // the proxy failed: the original picture
        im.src = f.c;
        return;
      }
      im.style.display = 'none';
      wrap.appendChild(h('div.ph', { text: f.t }));
    };
    wrap.appendChild(im);
  } else wrap.appendChild(h('div.ph', { text: (f.e ? f.e + ' ' : '') + f.t }));
  // A folder with one source opens straight to its grid.
  const open = () => router.push(f.src.length === 1 ? SourceGridView(f.src[0], f.t) : FolderView(f));
  return h('div.card.nc-tile', { focusable: true, cls: 'nc-' + shape, onSelect: open }, [wrap, h('div.name', { text: f.h ? '' : f.t })]);
}

// Rows of folder tiles for every collection; returns pending loaders for the caller's lazy queue.
export function collectionRows(parent, data) {
  return data.map((c) => {
    const row = h('div.row.nc-row', { 'data-anchor': '30' });
    const track = h('div.row-track', { 'data-scroll-x': '', 'data-group': '' });
    row.appendChild(h('div.row-title', null, [c.t, h('small', { text: t('{n} pastas', { n: c.f.length }) })]));
    row.appendChild(track);
    parent.appendChild(row);
    return {
      row: row,
      load: () => {
        // 15 tiles per row keeps the home screen light; "See all" opens the whole collection.
        c.f.slice(0, ROW_TILES).forEach((f) => track.appendChild(folderTile(f)));
        if (c.f.length > ROW_TILES)
          track.appendChild(
            h('div.card.see-all', { focusable: true, onSelect: () => router.push(CollectionGridView(c)) }, [
              h('div.poster-wrap', null, h('div.see-all-label', null, [h('b', { text: '→' }), t('Ver tudo')])),
              h('div.name', { text: '' }),
            ])
          );
        loadVisibleImages(row);
        return Promise.resolve();
      },
    };
  });
}

const ROW_TILES = 15;

// A whole collection as a grid of folder tiles; images load as they come into view.
function CollectionGridView(c) {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const grid = h('div.grid.nc-grid');
  scroller.appendChild(h('div.row-title.catalog-title', { text: c.t }));
  scroller.appendChild(grid);
  el.appendChild(scroller);
  c.f.forEach((f) => grid.appendChild(folderTile(f)));
  setTimeout(() => {
    const first = grid.querySelector('.card');
    if (first) nav.focus(first);
    loadVisibleImages(el, 400);
  }, 0);
  return { el: el, onShow: () => loadVisibleImages(el, 400), onScroll: () => loadVisibleImages(el, 400) };
}

function sourceRow(parent, src, title) {
  const row = h('div.row', { 'data-anchor': '30' });
  const track = h('div.row-track.pending', { 'data-scroll-x': '', 'data-group': '' }, spinnerLine(t('Carregando...')));
  row.appendChild(h('div.row-title', { text: title }));
  row.appendChild(track);
  parent.appendChild(row);
  return {
    row: row,
    load: () =>
      nc
        .fetchSource(src, 1)
        .then((r) => {
          clear(track);
          track.classList.remove('pending');
          if (!r.items.length) {
            if (row.parentNode) parent.removeChild(row);
            return;
          }
          r.items.slice(0, 20).forEach((m) => track.appendChild(card(m, { onSelect: () => openItem(m) })));
          if (r.more || r.items.length > 20)
            track.appendChild(
              h('div.card.see-all', { focusable: true, onSelect: () => router.push(SourceGridView(src, title)) }, [
                h('div.poster-wrap', null, h('div.see-all-label', null, [h('b', { text: '→' }), t('Ver tudo')])),
                h('div.name', { text: '' }),
              ])
            );
          loadVisibleImages(row);
        })
        .catch(() => row.parentNode && parent.removeChild(row)),
  };
}

// A queue that loads rows near the screen, two at a time.
export function lazyQueue(el) {
  const pending = [];
  let active = 0;
  function run() {
    if (el.offsetParent === null) return;
    const limit = window.innerHeight * 2.2;
    for (let i = 0; i < pending.length && active < 2; i++) {
      const p = pending[i];
      if (p.state) continue;
      if (!p.row.parentNode) {
        p.state = 'done';
        continue;
      }
      if (p.row.getBoundingClientRect().top > limit) break;
      p.state = 'loading';
      active++;
      p.load().then(
        () => {
          p.state = 'done';
          active--;
          run();
        },
        () => {
          p.state = 'done';
          active--;
          run();
        }
      );
    }
  }
  return {
    add: (list) => {
      list.forEach((p) => pending.push(p));
      run();
    },
    run: run,
    clear: () => (pending.length = 0),
  };
}

function FolderView(f) {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const rows = h('div.rows');
  scroller.appendChild(h('div.row-title.catalog-title', { text: f.t }));
  scroller.appendChild(rows);
  el.appendChild(scroller);
  const q = lazyQueue(el);
  q.add(f.src.map((s) => sourceRow(rows, s, s.n || f.t)));
  return {
    el: el,
    onShow: () => {
      q.run();
      loadVisibleImages(el);
    },
    onScroll: () => q.run(),
  };
}

function SourceGridView(src, title) {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const grid = h('div.grid');
  scroller.appendChild(h('div.row-title.catalog-title', { text: title }));
  scroller.appendChild(grid);
  el.appendChild(scroller);
  let n = 0;
  let more = null;
  const seen = {};
  function next() {
    if (more && more.parentNode) grid.removeChild(more);
    grid.appendChild(spinnerLine(t('Carregando...')));
    nc.fetchSource(src, ++n)
      .then((r) => {
        const sp = grid.querySelector('.loading-line');
        if (sp) grid.removeChild(sp);
        r.items.forEach((m) => {
          if (seen[m.id]) return;
          seen[m.id] = true;
          grid.appendChild(card(m, { onSelect: () => openItem(m) }));
        });
        if (r.more) {
          more = h('div.card.see-all', { focusable: true, onSelect: () => next() }, [
            h('div.poster-wrap', null, h('div.see-all-label', null, [h('b', { text: '+' }), t('Carregar mais')])),
            h('div.name', { text: '' }),
          ]);
          grid.appendChild(more);
        }
        loadVisibleImages(el, 400);
        if (n === 1) {
          const first = grid.querySelector('.card');
          if (first) nav.focus(first);
        }
      })
      .catch(() => toast(t('Não foi possível carregar agora.')));
  }
  next();
  return { el: el, onShow: () => loadVisibleImages(el, 400) };
}
