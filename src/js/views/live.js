// Live TV: M3U playlists you add yourself (the app ships no channels). Playlists → groups → channels → player.
// The list is read once and kept as compact arrays; the screen shows 40 rows at a time to stay light on a TV.
import { h, clear } from '../lib/dom.js';
import * as nav from '../lib/nav.js';
import { getText } from '../lib/http.js';
import { playlistUrl } from '../lib/phone.js';
import * as store from '../lib/store.js';
import { topbar, spinnerLine, toast, promptText, menu } from '../ui.js';
import * as router from '../router.js';
import { t } from '../lib/i18n.js';
import { openPlayer } from './player.js';

const PAGE = 40;
const MAX = 30000;

const lists = () => store.get('livePlaylists', []) || [];

// #EXTINF:-1 tvg-logo="…" group-title="News",Channel name  \n  http://…
export function parseM3U(text) {
  const out = [];
  const lines = String(text || '').split(/\r?\n/);
  let name = '';
  let group = '';
  for (let i = 0; i < lines.length && out.length < MAX; i++) {
    const l = lines[i].trim();
    if (!l) continue;
    if (l.indexOf('#EXTINF') === 0) {
      const g = /group-title="([^"]*)"/i.exec(l);
      group = g ? g[1].trim() : '';
      const c = l.lastIndexOf(',');
      name = c >= 0 ? l.slice(c + 1).trim() : '';
    } else if (l.charAt(0) !== '#' && /^(https?|rtmp|rtsp|udp):/i.test(l)) {
      out.push([name || l, group || t('Outros'), l]);
      name = '';
      group = '';
    }
  }
  return out;
}

function load(url) {
  // Direct first, then through the TV's own service (most IPTV hosts refuse the app's origin).
  return getText(url, { timeout: 40000, quiet: true }).catch(() => getText(playlistUrl(url), { timeout: 60000, quiet: true }));
}

export function LiveView() {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const bar = topbar('live', router.goTab);
  scroller.appendChild(bar);
  scroller.appendChild(h('div.row-title.catalog-title', { text: t('TV ao vivo') }));
  const body = h('div.flat-list', { 'data-group': '', 'data-vertical': '' });
  scroller.appendChild(body);
  el.appendChild(scroller);

  function draw() {
    clear(body);
    body.appendChild(
      h('div.stream', { focusable: true, 'data-autofocus': '', onSelect: add }, [h('div.s-main', { text: '＋ ' + t('Adicionar lista M3U') })])
    );
    lists().forEach((p, i) =>
      body.appendChild(
        h('div.stream', { focusable: true, onSelect: () => router.push(ChannelsView(p)) }, [
          h('div.s-main', { text: p.name }),
          h('span.s-tag', {
            text: t('Remover'),
            onSelect: null,
          }),
        ])
      )
    );
    if (!lists().length) body.appendChild(h('div.modal-text', { text: t('Cole o endereço de uma lista M3U sua. O app não traz nenhum canal.') }));
  }
  function add() {
    promptText(t('Endereço da lista M3U'), 'http://', '', (url) => {
      const u = url.trim();
      if (!/^https?:\/\//i.test(u)) return toast(t('Endereço inválido.'));
      const all = lists();
      all.push({ name: u.replace(/^https?:\/\//i, '').split(/[/?]/)[0] + ' #' + (all.length + 1), url: u });
      store.set('livePlaylists', all);
      draw();
    });
  }
  draw();
  // OK opens a playlist; the Red button (or a long press on the tile) offers Remove.
  return {
    el: el,
    onKey: (e) => {
      if (e.keyCode === nav.KEY.RED) {
        const cur = nav.current && nav.current();
        const rows = [].slice.call(body.querySelectorAll('.stream'));
        const idx = rows.indexOf(cur) - 1;
        if (idx >= 0 && lists()[idx]) {
          const p = lists()[idx];
          menu(p.name, [{ label: t('Remover'), value: 'rm' }], {
            onPick: () => {
              store.set('livePlaylists', lists().filter((x) => x !== p && x.url !== p.url));
              draw();
            },
          });
          return true;
        }
      }
      return false;
    },
    destroy: () => bar.__destroy && bar.__destroy(),
  };
}

function ChannelsView(pl) {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  scroller.appendChild(h('div.row-title.catalog-title', { text: pl.name }));
  const bar = h('div.details-buttons', { 'data-group': '' });
  const body = h('div.flat-list', { 'data-group': '', 'data-vertical': '' });
  scroller.appendChild(bar);
  scroller.appendChild(body);
  el.appendChild(scroller);
  let all = [];
  let group = null; // null = list of groups
  let query = '';
  let shown = 0;

  function groups() {
    const m = {};
    all.forEach((c) => (m[c[1]] = (m[c[1]] || 0) + 1));
    return Object.keys(m).sort().map((g) => ({ g: g, n: m[g] }));
  }
  function play(c) {
    const id = 'live:' + c[2];
    openPlayer({ meta: { id: id, type: 'tv', name: c[0] }, video: { id: id, title: c[0] }, stream: { url: c[2], name: c[0] }, live: true });
  }
  function draw() {
    clear(body);
    shown = 0;
    if (!all.length) return;
    if (group === null && !query) {
      groups().forEach((x) => body.appendChild(h('div.stream', { focusable: true, onSelect: () => ((group = x.g), draw()) }, [h('div.s-main', { text: x.g }), h('span.s-tag', { text: String(x.n) })])));
      const f = body.querySelector('.stream');
      if (f) nav.focus(f);
      return;
    }
    const rows = all.filter((c) => (group === null || c[1] === group) && (!query || c[0].toLowerCase().indexOf(query) >= 0));
    more(rows, true);
  }
  function more(rows, first) {
    const old = body.querySelector('.more-row');
    if (old) body.removeChild(old);
    const end = Math.min(rows.length, shown + PAGE);
    for (let i = shown; i < end; i++) {
      const c = rows[i];
      body.appendChild(h('div.stream', { focusable: true, onSelect: () => play(c) }, [h('div.s-main', { text: c[0] })]));
    }
    shown = end;
    if (end < rows.length) body.appendChild(h('div.stream.more-row', { focusable: true, onSelect: () => more(rows) }, [h('div.s-main', { text: '+ ' + t('Carregar mais') + ' (' + (rows.length - end) + ')' })]));
    if (!rows.length) body.appendChild(h('div.modal-text', { text: t('Nada por aqui.') }));
    if (first) {
      const f = body.querySelector('.stream');
      if (f) nav.focus(f);
    }
  }
  bar.appendChild(h('div.btn', { focusable: true, onSelect: () => ((group = null), (query = ''), draw()) }, t('Grupos')));
  bar.appendChild(h('div.btn', { focusable: true, onSelect: () => promptText(t('Buscar canal'), query, '', (q) => ((query = q.toLowerCase()), draw())) }, [h('span.ico', { text: '🔍' }), t('Buscar canal')]));
  const sp = spinnerLine(t('Carregando...'));
  body.appendChild(sp);
  load(pl.url).then(
    (txt) => {
      all = parseM3U(txt);
      clear(body);
      if (!all.length) body.appendChild(h('div.modal-text', { text: t('Não achei canais nesta lista.') }));
      draw();
    },
    () => {
      clear(body);
      body.appendChild(h('div.modal-text', { text: t('Não consegui baixar a lista.') }));
    }
  );
  return { el: el, onBack: () => (group !== null || query ? ((group = null), (query = ''), draw(), true) : false) };
}
