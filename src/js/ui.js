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
  { id: 'movies', label: 'Filmes' },
  { id: 'series', label: 'Séries' },
  { id: 'anime', label: 'Animes' },
  { id: 'manga', label: 'Mangás' },
  { id: 'collections', label: 'Coleções' },
  { id: 'search', label: 'Buscar' },
  { id: 'library', label: 'Biblioteca' },
  { id: 'calendar', label: 'Calendário' },
  { id: 'settings', label: 'Ajustes' },
];

let keyed = false;
document.addEventListener('keydown', () => (keyed = true), true);
document.addEventListener('mousemove', () => (keyed = true), true);

// Icons: Lucide (ISC licence), drawn as lines inside a rounded tile (idea from Harbor).
const NAV_ICONS = {
  home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/> <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  movies: '<path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/> <path d="m6.2 5.3 3.1 3.9"/> <path d="m12.4 3.4 3.1 4"/> <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
  series: '<rect width="20" height="15" x="2" y="7" rx="2" ry="2"/> <polyline points="17 2 12 7 7 2"/>',
  anime: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/> <path d="M20 3v4"/> <path d="M22 5h-4"/> <path d="M4 17v2"/> <path d="M5 18H3"/>',
  manga: '<path d="M12 7v14"/> <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  collections: '<rect width="7" height="7" x="3" y="3" rx="1"/> <rect width="7" height="7" x="14" y="3" rx="1"/> <rect width="7" height="7" x="14" y="14" rx="1"/> <rect width="7" height="7" x="3" y="14" rx="1"/>',
  search: '<circle cx="11" cy="11" r="8"/> <path d="m21 21-4.3-4.3"/>',
  library: '<path d="m16 6 4 14"/> <path d="M12 6v14"/> <path d="M8 8v12"/> <path d="M4 4v16"/>',
  calendar: '<path d="M8 2v4"/> <path d="M16 2v4"/> <rect width="18" height="18" x="3" y="4" rx="2"/> <path d="M3 10h18"/> <path d="M8 14h.01"/> <path d="M12 14h.01"/> <path d="M16 14h.01"/> <path d="M8 18h.01"/> <path d="M12 18h.01"/> <path d="M16 18h.01"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/> <circle cx="12" cy="12" r="3"/>',
};

// Left sidebar (profile, one row per tab with icon, clock). It is fixed on the screen and the scroll area of
// the page starts after its collapsed width. The returned node sits at the top of the page's scroll area.
export function topbar(activeId, onTab) {
  const clock = h('div.top-clock');
  const tick = () => (clock.textContent = timeHM(new Date()));
  tick();
  const timer = setInterval(tick, 20000);
  // Collapsed to a thin row of icons; it opens (names shown, over the page) while the focus is on it.
  let side = null;
  // Only a key press opens it (not the focus the page gets when it first appears).
  const open = () => side && keyed && side.classList.add('open');
  const closeSoon = () =>
    setTimeout(() => {
      if (side && !side.querySelector('.focused')) side.classList.remove('open');
    }, 0);
  const tabs = TABS.filter((tab) => (tab.id !== 'anime' || store.settings().animeTab !== false));
  side = h('div.sidebar', { 'data-group': '', 'data-vertical': '' }, [
    profileButton(onTab),
    h(
      'div.side-nav',
      null,
      tabs.map((tab) =>
        h('div.tab', { focusable: true, cls: tab.id === activeId ? 'active' : '', onSelect: () => onTab(tab.id), onFocus: open }, [
          h('span.nav-ico', { html: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (NAV_ICONS[tab.id] || NAV_ICONS.home) + '</svg>' }),
          h('span.tab-label', { text: t(tab.label) }),
        ])
      )
    ),
  ]);
  Array.prototype.forEach.call(side.querySelectorAll('[data-focus]'), (el) => {
    if (!el.__focus) el.__focus = open;
    el.__blur = closeSoon;
  });
  const chip = side.querySelector('.profile-chip');
  if (chip) chip.__focus = open;
  const anchor = h('div.side-anchor', null, [side, clock]);
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
  if (o.watched) wrap.appendChild(h('div.done-dot'));
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
