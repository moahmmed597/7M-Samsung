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
    im.setAttribute('data-lazy', f.c);
    im.onerror = () => {
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
        c.f.forEach((f) => track.appendChild(folderTile(f)));
        loadVisibleImages(row);
        return Promise.resolve();
      },
    };
  });
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
