// Live TV, in the style of Harbor's TV screen: a row of category chips, then channel cards with the
// logo, the category, what is on now (Xtream) and how far it has got. OK plays, Green adds to Favourites.
// Light on the TV: one category at a time, 40 cards per page, "now" only for the cards on screen.
import { h, clear, loadVisibleImages } from '../lib/dom.js';
import * as nav from '../lib/nav.js';
import { KEY } from '../lib/nav.js';
import * as iptv from '../api/iptv.js';
import { topbar, toast, promptText, menu, confirmDialog, timeHM, spinnerLine, formDialog } from '../ui.js';
import * as router from '../router.js';
import { t } from '../lib/i18n.js';
import { openPlayer } from './player.js';
import * as store from '../lib/store.js';

const PAGE = 40;

export function LiveView() {
  const el = h('div.view.live-view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const bar = topbar('live', router.goTab);
  const head = h('div.live-head');
  const chips = h('div.live-chips', { 'data-scroll-x': '', 'data-group': '' });
  const grid = h('div.live-grid', { 'data-group': '' });
  const hint = h('div.live-hint', { text: t('OK: assistir  ·  🟢 Verde: favorito') });
  scroller.appendChild(bar);
  scroller.appendChild(head);
  scroller.appendChild(chips);
  scroller.appendChild(grid);
  el.appendChild(scroller);
  el.appendChild(hint);

  // Preview: rest on a channel for a moment and it plays small and muted in the corner.
  const pvVideo = h('video', { muted: true, playsinline: true });
  pvVideo.muted = true;
  const pvName = h('div.lp-name');
  const preview = h('div.live-preview', null, [pvVideo, pvName]);
  el.appendChild(preview);
  let pvTimer = null;
  let pvFor = null;
  const previewOn = () => store.settings().livePreview !== false;
  function stopPreview() {
    clearTimeout(pvTimer);
    pvTimer = null;
    pvFor = null;
    preview.classList.remove('show');
    try {
      pvVideo.pause();
      pvVideo.removeAttribute('src');
      pvVideo.load();
    } catch (e) {}
  }
  function schedulePreview(ch) {
    clearTimeout(pvTimer);
    if (!previewOn() || !ch || !ch.url) return;
    if (pvFor && pvFor.id === ch.id) return;
    pvTimer = setTimeout(() => {
      pvFor = ch;
      pvName.textContent = ch.name;
      pvVideo.src = ch.url;
      const p = pvVideo.play();
      if (p && p.catch) p.catch(() => {});
      preview.classList.add('show');
    }, 1500);
  }
  pvVideo.onerror = () => preview.classList.remove('show');

  let src = iptv.active();
  let cat = 'fav';
  let shown = [];
  let count = 0;
  let token = 0;

  function drawHead() {
    clear(head);
    head.appendChild(h('div.row-title.catalog-title', { text: t('TV ao vivo') }));
    head.appendChild(
      h('div.details-buttons', { 'data-group': '' }, [
        h('div.btn', { focusable: true, onSelect: sourcesMenu }, [h('span.ico', { text: '📡' }), src ? src.name : t('Adicionar fonte')]),
        src ? h('div.btn', { focusable: true, onSelect: search }, [h('span.ico', { text: '🔍' }), t('Buscar canal')]) : null,
        src
          ? h('div.btn', { focusable: true, onSelect: () => (store.saveSettings({ livePreview: !previewOn() }), previewOn() || stopPreview(), drawHead()) }, [
              h('span.ico', { text: '👁' }),
              previewOn() ? t('Prévia: ligada') : t('Prévia: desligada'),
            ])
          : null,
      ])
    );
  }

  function sourcesMenu() {
    const list = iptv.sources().map((s) => ({ label: s.name, sub: s.type === 'xtream' ? 'Xtream Codes' : 'M3U', value: { kind: 'use', s: s }, checked: src && s.id === src.id }));
    list.push({ label: '＋ ' + t('Conta Xtream Codes'), sub: t('Servidor, usuário e senha do seu IPTV'), value: { kind: 'xtream' } });
    list.push({ label: '＋ ' + t('Lista M3U'), sub: t('Link da sua lista'), value: { kind: 'm3u' } });
    if (src) list.push({ label: '🗑 ' + t('Remover {name}', { name: src.name }), value: { kind: 'rm' } });
    menu(t('Fontes de TV ao vivo'), list, {
      onPick: (v) => {
        if (v.kind === 'use') {
          iptv.setActive(v.s.id);
          src = v.s;
          cat = 'fav';
          render();
        } else if (v.kind === 'xtream') addXtream();
        else if (v.kind === 'm3u') addM3u();
        else if (v.kind === 'rm') confirmDialog(t('Remover {name}?', { name: src.name }), t('Remover'), () => (iptv.removeSource(src.id), (src = iptv.active()), render()));
      },
    });
  }

  function addXtream() {
    formDialog(
      t('Conta Xtream Codes'),
      [
        { key: 'url', label: t('Servidor (Host)'), value: 'http://', placeholder: 'http://example.com:80' },
        { key: 'user', label: t('Usuário'), value: '' },
        { key: 'pass', label: t('Senha'), value: '' },
      ],
      t('Entrar'),
      (v) => {
        let u = (v.url || '').replace(/\/+$/, '');
        if (!/^https?:\/\//i.test(u)) u = 'http://' + u;
        if (!v.user || !v.pass || u === 'http://') return toast(t('Preencha servidor, usuário e senha.'), 5000);
        const s = { id: 'x' + Date.now(), type: 'xtream', url: u, user: v.user, pass: v.pass, name: u.replace(/^https?:\/\//, '').split(/[:/]/)[0], format: 'm3u8' };
        toast(t('Entrando...'));
        iptv.checkXtream(s).then(
          (info) => {
            if (info && info.username) s.name = s.name + ' · ' + info.username;
            iptv.saveSource(s);
            src = s;
            cat = 'fav';
            render();
            toast(t('Conta adicionada.'));
          },
          () => toast(t('Não consegui entrar. Confira servidor, usuário e senha.'), 6000)
        );
      }
    );
  }

  function addM3u() {
    promptText(t('Link da lista M3U'), 'http://', '', (url) => {
      const u = url.trim();
      if (!/^https?:\/\//i.test(u)) return toast(t('Endereço inválido.'));
      const s = { id: 'm' + Date.now(), type: 'm3u', url: u, name: u.replace(/^https?:\/\//, '').split(/[/?]/)[0] };
      iptv.saveSource(s);
      src = s;
      cat = 'fav';
      render();
    });
  }

  function search() {
    promptText(t('Buscar canal'), '', '', (q) => {
      const needle = q.trim().toLowerCase();
      if (!needle) return;
      cat = 'search:' + needle;
      drawGrid();
    });
  }

  function chip(label, key) {
    return h('div.chip', { focusable: true, cls: key === cat ? 'primary-chip' : '', onSelect: () => ((cat = key), drawChips(), drawGrid()) }, label);
  }
  function drawChips() {
    clear(chips);
    if (!src) return;
    chips.appendChild(chip('★ ' + t('Favoritos'), 'fav'));
    chips.appendChild(chip('🕘 ' + t('Vistos recentemente'), 'recent'));
    iptv
      .categories(src)
      .then((cats) => {
        if (!src) return;
        cats.slice(0, 80).forEach((c) => chips.appendChild(chip(c.name, c.id)));
      })
      .catch(() => toast(t('Não consegui carregar a lista.'), 5000));
  }

  function load() {
    if (cat === 'fav') return Promise.resolve(iptv.favList(src.id));
    if (cat === 'recent') return Promise.resolve(iptv.recentList(src.id));
    if (cat.indexOf('search:') === 0) {
      // Search the channels already loaded (M3U: the whole list; Xtream: the categories you opened, and favourites).
      const needle = cat.slice(7);
      return iptv.categories(src).then(() => {
        const res = [];
        const seen = {};
        iptv
          .loaded(src)
          .concat([iptv.favList(src.id)])
          .forEach((list) =>
            list.forEach((c) => {
              if (res.length < 200 && !seen[c.id] && String(c.name).toLowerCase().indexOf(needle) >= 0) {
                seen[c.id] = 1;
                res.push(c);
              }
            })
          );
        if (!res.length && src.type === 'xtream') toast(t('A busca procura nas categorias que você já abriu.'), 5000);
        return res;
      });
    }
    return iptv.channels(src, cat);
  }

  function drawGrid() {
    const my = ++token;
    clear(grid);
    if (!src) {
      grid.appendChild(h('div.live-empty', null, [h('div.t', { text: t('Sem fontes ainda') }), h('div.s', { text: t('Adicione sua conta Xtream Codes ou um link M3U. O app não traz nenhum canal.') })]));
      return;
    }
    grid.appendChild(spinnerLine(t('Carregando...')));
    load().then(
      (list) => {
        if (my !== token) return;
        clear(grid);
        shown = list || [];
        count = 0;
        if (!shown.length) grid.appendChild(h('div.live-empty', null, [h('div.t', { text: cat === 'fav' ? t('Sem favoritos ainda') : t('Nada por aqui.') }), h('div.s', { text: cat === 'fav' ? t('Escolha uma categoria e aperte o botão verde num canal.') : '' })]));
        more();
        const first = grid.querySelector('.live-cell');
        if (first && cat !== 'fav') nav.focus(first, { noScroll: true });
      },
      () => {
        if (my !== token) return;
        clear(grid);
        grid.appendChild(h('div.live-empty', null, [h('div.t', { text: t('Não consegui carregar a lista.') })]));
      }
    );
  }

  function more() {
    const old = grid.querySelector('.live-more');
    if (old) grid.removeChild(old);
    const end = Math.min(shown.length, count + PAGE);
    for (let i = count; i < end; i++) grid.appendChild(cell(shown[i]));
    count = end;
    if (count < shown.length) grid.appendChild(h('div.live-cell.live-more', { focusable: true, onSelect: more }, [h('div.lc-head', { text: '+ ' + t('Carregar mais') + ' (' + (shown.length - count) + ')' })]));
    loadVisibleImages(grid);
  }

  function cell(ch) {
    const logo = h('div.lc-logo');
    if (ch.logo) {
      const im = h('img', { alt: '' });
      im.setAttribute('data-lazy', ch.logo);
      im.onerror = () => (im.style.display = 'none');
      logo.appendChild(im);
    } else logo.appendChild(h('span', { text: (ch.name || '?').charAt(0) }));
    const now = h('div.lc-now', { text: ch.name });
    const meta = h('div.lc-meta');
    const prog = h('div.lc-prog', null, h('i'));
    const star = h('span.lc-star', { text: iptv.isFav(src.id, ch.id) ? '★' : '' });
    const el2 = h('div.live-cell', { focusable: true, onSelect: () => play(ch), onFocus: () => (epg(), schedulePreview(ch)) }, [
      h('div.lc-top', null, [logo, h('div.lc-id', null, [h('div.lc-name', { text: ch.name }), h('div.lc-cat', { text: ch.num ? '#' + ch.num : '' })]), star]),
      now,
      h('div.lc-bottom', null, [meta, prog]),
    ]);
    el2.__ch = ch;
    el2.__star = star;
    let asked = false;
    function epg() {
      if (asked) return;
      asked = true;
      iptv.nowNext(src, ch).then((list) => {
        const n = list.find((e) => e.start <= Date.now() && e.end > Date.now()) || list[0];
        if (!n) return;
        now.textContent = n.title || ch.name;
        const left = Math.max(0, Math.round((n.end - Date.now()) / 60000));
        const nx = list.find((e) => e.start >= n.end - 1000);
        meta.textContent = t('até {time}', { time: timeHM(new Date(n.end)) }) + ' · ' + t('{n} min restantes', { n: left }) + (nx ? '  ·  ' + t('Depois: {title}', { title: nx.title }) : '');
        prog.firstChild.style.width = Math.max(0, Math.min(100, ((Date.now() - n.start) / (n.end - n.start)) * 100)) + '%';
        prog.style.display = 'block';
      });
    }
    // the first cards on screen get "now" right away
    if (count < 8) setTimeout(epg, 300 + count * 150);
    return el2;
  }

  function play(ch) {
    stopPreview();
    iptv.addRecent(src.id, ch);
    const id = 'live:' + src.id + ':' + ch.id;
    openPlayer({ meta: { id: id, type: 'tv', name: ch.name, poster: ch.logo }, video: { id: id, title: ch.name }, stream: { url: ch.url, name: ch.name }, live: true });
  }

  function render() {
    drawHead();
    drawChips();
    drawGrid();
  }
  render();

  return {
    el: el,
    onKey: (e) => {
      if (e.keyCode !== KEY.GREEN) return false;
      const cur = nav.current();
      if (!cur || !cur.__ch || !src) return false;
      const on = iptv.toggleFav(src.id, cur.__ch);
      cur.__star.textContent = on ? '★' : '';
      toast(on ? t('Adicionado aos favoritos.') : t('Removido dos favoritos.'));
      return true;
    },
    onShow: () => loadVisibleImages(el),
    onHide: () => stopPreview(),
    destroy: () => (stopPreview(), bar.__destroy && bar.__destroy()),
  };
}
