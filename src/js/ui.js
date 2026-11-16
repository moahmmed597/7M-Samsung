// Componentes compartilhados: toast, menus modais, barra superior, cartões.
import { h, clear } from './lib/dom.js';
import * as nav from './lib/nav.js';
import { smallPoster, smallBackground, ratedPoster } from './lib/img.js';
import * as store from './lib/store.js';
import { avatar, switchProfile, createProfile, showPicker } from './views/profiles.js';
import { t } from './lib/i18n.js';

let toastTimer = null;
export function toast(msg, ms) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), ms || 3500);
}

// Menu de opções (lista) num modal. options: [{ label, sub, checked, value, onSelect }]
export function menu(title, options, opts) {
  const o = opts || {};
  const list = h('div.modal-list', { 'data-scroll-y': '', 'data-pad-y': '80' });
  options.forEach((opt) => {
    list.appendChild(
      h(
        'div.opt',
        {
          focusable: true,
          cls: opt.checked ? 'checked' : '',
          'data-autofocus': opt.checked ? '' : null,
          onSelect: () => {
            close();
            if (opt.onSelect) opt.onSelect(opt.value);
            if (o.onPick) o.onPick(opt.value, opt);
          },
        },
        [opt.label, opt.sub ? h('small', { text: opt.sub }) : null]
      )
    );
  });
  if (!options.length) list.appendChild(h('div.modal-text', { text: o.empty || t('Nada por aqui.') }));
  const box = h('div.modal-box', { cls: o.center ? 'center' : '' }, [h('h3', { text: title }), list]);
  const modal = h('div.modal', null, box);
  document.getElementById('app').appendChild(modal);
  const layer = nav.pushLayer(modal, {
    onBack: () => close(),
    onKey: o.onKey,
  });
  nav.focusFirst(modal);
  let closed = false;
  function close() {
    if (closed) return;
    closed = true;
    nav.popLayer(layer);
    if (modal.parentNode) modal.parentNode.removeChild(modal);
    if (o.onClose) o.onClose();
  }
  return { close: close, el: modal };
}

export function confirmDialog(text, okLabel, onOk) {
  const box = h('div.modal-box.center', null, [
    h('h3', { text: text }),
    h('div.modal-actions', null, [
      h('div.btn.primary', { focusable: true, 'data-autofocus': '', text: okLabel || 'OK', onSelect: () => (close(), onOk && onOk()) }),
      h('div.btn', { focusable: true, text: t('Cancelar'), onSelect: () => close() }),
    ]),
  ]);
  const modal = h('div.modal', null, box);
  document.getElementById('app').appendChild(modal);
  const layer = nav.pushLayer(modal, { onBack: () => close() });
  nav.focusFirst(modal);
  function close() {
    nav.popLayer(layer);
    if (modal.parentNode) modal.parentNode.removeChild(modal);
  }
}

// Text box in a modal: OK on the box opens the TV keyboard; Done on it calls onSubmit(text).
export function promptText(title, value, placeholder, onSubmit) {
  const input = h('input.input', { type: 'text', value: value || '', placeholder: placeholder || '' });
  const row = h('div.set-row', { focusable: true, 'data-autofocus': '', onSelect: () => nav.select(input) }, input);
  const box = h('div.modal-box.center', null, [h('h3', { text: title }), row]);
  const modal = h('div.modal', null, box);
  document.getElementById('app').appendChild(modal);
  const layer = nav.pushLayer(modal, { onBack: () => close() });
  nav.focusFirst(modal);
  input.__submit = (v) => {
    const text = String(v || '').trim();
    close();
    if (text) onSubmit(text);
  };
  setTimeout(() => nav.select(input), 50);
  function close() {
    nav.popLayer(layer);
    if (modal.parentNode) modal.parentNode.removeChild(modal);
  }
}

// Barra superior com as abas principais.
export const TABS = [
  { id: 'home', label: 'Início' },
  { id: 'anime', label: 'Animes' },
  { id: 'manga', label: 'Mangás' },
  { id: 'reading', label: 'Leitura' },
  { id: 'live', label: 'TV ao vivo' },
  { id: 'collections', label: 'Coleções' },
  { id: 'search', label: 'Buscar' },
  { id: 'library', label: 'Biblioteca' },
  { id: 'calendar', label: 'Calendário' },
  { id: 'settings', label: 'Ajustes' },
];

// Icons (Material Design paths) for the sidebar.
const NAV_ICONS = {
  home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
  anime: 'M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
  manga: 'M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z',
  reading: 'M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z',
  live: 'M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z',
  collections: 'M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z',
  search: 'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
  library: 'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z',
  calendar: 'M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z',
  settings: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
};

// Left sidebar (profile, one row per tab with icon, clock). It is fixed on the screen and the scroll area of
// the page is moved to its right. The returned node sits at the top of the page's scroll area.
export function topbar(activeId, onTab) {
  const clock = h('div.side-clock');
  const tick = () => (clock.textContent = timeHM(new Date()));
  tick();
  const timer = setInterval(tick, 20000);
  const tabs = TABS.filter((tab) => (tab.id !== 'anime' || store.settings().animeTab !== false) && (tab.id !== 'manga' || store.settings().mangaTab !== false));
  const side = h('div.sidebar', { 'data-group': '', 'data-vertical': '' }, [
    profileButton(onTab),
    h(
      'div.side-nav',
      null,
      tabs.map((tab) =>
        h('div.tab', { focusable: true, cls: tab.id === activeId ? 'active' : '', onSelect: () => onTab(tab.id) }, [
          h('span.nav-ico', { html: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="' + (NAV_ICONS[tab.id] || NAV_ICONS.home) + '"/></svg>' }),
          h('span.tab-label', { text: t(tab.label) }),
        ])
      )
    ),
    h('div.spacer'),
    clock,
  ]);
  const anchor = h('div.side-anchor', null, side);
  anchor.__destroy = () => clearInterval(timer);
  setTimeout(() => {
    const sc = anchor.closest ? anchor.closest('.scroll-y') || anchor.parentNode : anchor.parentNode;
    if (sc && sc.classList) sc.classList.add('with-side');
    const v = anchor.closest ? anchor.closest('.view') : null;
    if (v) v.classList.add('has-side');
  }, 0);
  return anchor;
}

// Avatar do perfil ativo na barra superior: troca rápida de perfil.
function profileButton(onTab) {
  const chip = h('div.profile-chip', { focusable: true, onSelect: () => profileMenu(onTab) });
  fillChip(chip);
  return chip;
}

function fillChip(chip) {
  const p = store.activeProfile();
  clear(chip);
  chip.appendChild(avatar(p, 'small'));
  chip.appendChild(h('span', { text: p.name }));
}

// Atualiza o avatar/nome em todas as barras (depois de renomear ou trocar a cor).
export function refreshProfileChips() {
  Array.prototype.forEach.call(document.querySelectorAll('.profile-chip'), fillChip);
}

function profileMenu(onTab) {
  const active = store.activeProfile();
  const opts = store.profiles().map((p) => ({ label: p.name, sub: p.id === active.id ? t('Perfil atual') : t('Trocar para este perfil'), value: p.id, checked: p.id === active.id }));
  opts.push({ label: t('+ Adicionar perfil'), sub: t('Com outra conta Stremio (histórico separado)'), value: '__add' });
  opts.push({ label: t('Tela "Quem está assistindo?"'), sub: t('Escolher perfil'), value: '__picker' });
  opts.push({ label: t('Gerenciar perfis'), sub: t('Nome, cor, apagar'), value: '__manage' });
  menu(t('Perfis'), opts, {
    onPick: (v) => {
      if (v === '__add') createProfile();
      else if (v === '__picker') showPicker(() => window.location.reload());
      else if (v === '__manage') onTab('settings');
      else if (v !== active.id) switchProfile(v);
    },
  });
}

// Time of day. Default 12 hours ("5:08 PM"); Settings → Appearance switches to 24 hours.
export function timeHM(d) {
  const m = ('0' + d.getMinutes()).slice(-2);
  if (store.settings().clock24 === true) return ('0' + d.getHours()).slice(-2) + ':' + m;
  const hr = d.getHours();
  return (hr % 12 || 12) + ':' + m + ' ' + (hr < 12 ? 'AM' : 'PM');
}

export function fmtTime(sec) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const s = Math.floor(sec % 60);
  const m = Math.floor((sec / 60) % 60);
  const hh = Math.floor(sec / 3600);
  return (hh ? hh + ':' + ('0' + m).slice(-2) : m) + ':' + ('0' + s).slice(-2);
}

// Cartão de pôster (ou largo, para "continuar assistindo").
export function card(item, opts) {
  const o = opts || {};
  const wrap = h('div.poster-wrap');
  // Versões pequenas das imagens (o cartão tem 210x315 / 380x214).
  const plain = o.wide ? smallBackground(o.image || item.background || item.poster) : smallPoster(item.poster);
  // Rating posters (RPDB) when the user typed their own key in Settings; falls back to the normal one.
  const rated = o.wide ? null : ratedPoster(item.id || item.imdb_id, store.settings().rpdbKey);
  const src = rated || plain;
  if (src) {
    const im = h('img', { alt: '' });
    im.setAttribute('data-lazy', src);
    im.onerror = () => {
      if (rated && plain && im.src.indexOf(plain) < 0) {
        im.src = plain;
        return;
      }
      im.style.display = 'none';
      wrap.appendChild(h('div.ph', { text: item.name || '' }));
    };
    wrap.appendChild(im);
  } else wrap.appendChild(h('div.ph', { text: item.name || '' }));
  if (o.progress) wrap.appendChild(h('div.progress', null, h('i', { style: { width: Math.round(o.progress * 100) + '%' } })));
  if (o.badge) wrap.appendChild(h('div.badge', { text: o.badge }));
  // Continue watching card (idea: Nuvio): a status chip on top, episode + title over a shade at the bottom.
  if (o.overlay) {
    if (o.overlay.chip) wrap.appendChild(h('div.cw-badge', { text: o.overlay.chip }));
    wrap.appendChild(h('div.cw-info', null, [o.overlay.ep ? h('div.cw-ep', { text: o.overlay.ep }) : null, h('div.cw-title', { text: o.overlay.title || '' })]));
  }
  return h('div.card', { focusable: true, cls: (o.wide ? 'wide' : '') + (o.overlay ? ' cw' : ''), onSelect: o.onSelect, onFocus: o.onFocus }, [
    wrap,
    h('div.name', { text: o.title || item.name || '' }),
  ]);
}

export function spinnerLine(text) {
  return h('div.loading-line', null, [h('div.spinner.small'), text]);
}

export { clear };
