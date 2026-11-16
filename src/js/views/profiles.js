// Perfis: tela "Quem está assistindo?", avatar e troca de perfil.
// Cada perfil tem sua própria conta Stremio (histórico, biblioteca, addons) e preferências.
import { h } from '../lib/dom.js';
import * as nav from '../lib/nav.js';
import * as store from '../lib/store.js';
import { t } from '../lib/i18n.js';

const SESSION_PICKED = 'kai.profilePicked';
const SESSION_NEW = 'kai.newProfile';

function session(key, value) {
  try {
    if (value === undefined) return window.sessionStorage.getItem(key);
    if (value === null) window.sessionStorage.removeItem(key);
    else window.sessionStorage.setItem(key, value);
  } catch (e) {
    /* ignore */
  }
  return null;
}

export function avatar(p, cls) {
  if (p.avatar) return h('div.avatar.pic', { cls: cls || '', style: { backgroundImage: 'url("' + avatarUrl(p.avatar) + '")' } });
  const initial = String(p.name || '?').trim().charAt(0).toUpperCase() || '?';
  return h('div.avatar', { cls: cls || '', style: { backgroundColor: p.color || store.COLORS[0] }, text: initial });
}

// Profile pictures (art from Harbor, MIT licence), shipped with the app in avatars/.
export const AVATARS = ['harbor_person', 17, 'harbor_face', 12, 'harbor_kawaii', 9, 'harbor_misc', 7, 'harbor_animal', 7, 'harbor_element', 4, 'harbor_cat', 4, 'harbor_space', 3];
export function avatarUrl(file) {
  return (window.__KAI_BASE__ || '') + 'avatars/' + file;
}
export function avatarFiles() {
  return AVAILABLE.slice();
}
const AVAILABLE = ["eboy_manga_eyes_bw_zoomed.webp", "egirl_manga_eyes_bw_zoomed_distinct.webp", "harbor_animal_01.webp", "harbor_animal_02.webp", "harbor_animal_04.webp", "harbor_animal_05.webp", "harbor_animal_06.webp", "harbor_animal_07.webp", "harbor_animal_08.webp", "harbor_cat_01.webp", "harbor_cat_02.webp", "harbor_cat_03.webp", "harbor_cat_04.webp", "harbor_element_01.webp", "harbor_element_02.webp", "harbor_element_03.webp", "harbor_element_04.webp", "harbor_face_01.webp", "harbor_face_02.webp", "harbor_face_03.webp", "harbor_face_04.webp", "harbor_face_05.webp", "harbor_face_06.webp", "harbor_face_07.webp", "harbor_face_08.webp", "harbor_face_09.webp", "harbor_face_10.webp", "harbor_face_11.webp", "harbor_face_12.webp", "harbor_kawaii_01.webp", "harbor_kawaii_02.webp", "harbor_kawaii_03.webp", "harbor_kawaii_04.webp", "harbor_kawaii_05.webp", "harbor_kawaii_06.webp", "harbor_kawaii_07.webp", "harbor_kawaii_08.webp", "harbor_kawaii_10.webp", "harbor_misc_01.webp", "harbor_misc_02.webp", "harbor_misc_03.webp", "harbor_misc_04.webp", "harbor_misc_05.webp", "harbor_misc_06.webp", "harbor_misc_08.webp", "harbor_person_01.webp", "harbor_person_02.webp", "harbor_person_03.webp", "harbor_person_04.webp", "harbor_person_05.webp", "harbor_person_06.webp", "harbor_person_07.webp", "harbor_person_08.webp", "harbor_person_09.webp", "harbor_person_10.webp", "harbor_person_11.webp", "harbor_person_12.webp", "harbor_person_13.webp", "harbor_person_14.webp", "harbor_person_15.webp", "harbor_person_16.webp", "harbor_person_17.webp", "harbor_space_01.webp", "harbor_space_02.webp", "harbor_space_03.webp"];


// Troca de perfil recarregando o app: conta, biblioteca e addons do outro perfil entram limpos.
export function switchProfile(id) {
  const target = store.profiles().find((p) => p.id === id);
  checkPin(target, () => {
    store.setActiveProfile(id);
    session(SESSION_PICKED, '1');
    window.location.reload();
  });
}

// ---------- PIN lock (Settings → Profile) ----------
// Asks for the profile's PIN when it has one; onOk runs only with the right PIN.
export function checkPin(profile, onOk) {
  if (!profile || !profile.pin) return onOk();
  pinDialog(t('PIN de {name}', { name: profile.name }), (pin) => {
    if (pin === profile.pin) {
      onOk();
      return true;
    }
    return false;
  });
}

// onSubmit(pin) returns true to close; false shows "wrong PIN" and keeps it open.
export function pinDialog(title, onSubmit, badText) {
  const err = h('div.modal-text.err-text');
  const input = h('input.input.pin-input', { type: 'password', inputmode: 'numeric', maxlength: '8', placeholder: '••••', focusable: true, 'data-autofocus': '' });
  const box = h('div.modal-box.center', null, [h('h3', { text: title }), input, err]);
  const modal = h('div.modal', null, box);
  document.getElementById('app').appendChild(modal);
  const layer = nav.pushLayer(modal, { onBack: () => close() });
  nav.focusFirst(modal);
  setTimeout(() => nav.select(input), 50);
  input.__submit = (v) => {
    const pin = String(v || '').trim();
    if (!pin) return;
    if (onSubmit(pin) === false) {
      err.textContent = badText || t('PIN errado. Tente de novo.');
      input.value = '';
      nav.focus(input);
      return;
    }
    close();
  };
  function close() {
    nav.popLayer(layer);
    if (modal.parentNode) modal.parentNode.removeChild(modal);
  }
}

// Pede o nome do perfil num modal (no TV o teclado virtual abre ao confirmar no campo).
export function askProfileName(title, initial, okLabel, onOk, onCancel) {
  const err = h('div.modal-text.err-text');
  const input = h('input.input', { type: 'text', value: initial || '', placeholder: t('Ex.: Ana, Pedro, Sala'), maxlength: '20', focusable: true, 'data-autofocus': '' });
  const submit = () => {
    const name = String(input.value || '').trim();
    if (!name) {
      err.textContent = t('Digite um nome para o perfil.');
      nav.focus(input);
      return;
    }
    const dup = store.profiles().some((p) => p.name.toLowerCase() === name.toLowerCase() && p.name !== initial);
    if (dup) {
      err.textContent = t('Já existe um perfil com esse nome.');
      nav.focus(input);
      return;
    }
    close();
    onOk(name);
  };
  input.__submit = submit;
  const box = h('div.modal-box.center', null, [
    h('h3', { text: title }),
    h('div.modal-text', null, input),
    err,
    h('div.modal-actions', { 'data-group': '' }, [
      h('div.btn.primary', { focusable: true, text: okLabel || t('Continuar'), onSelect: submit }),
      h('div.btn', { focusable: true, text: t('Cancelar'), onSelect: () => (close(), onCancel && onCancel()) }),
    ]),
  ]);
  const modal = h('div.modal', null, box);
  document.getElementById('app').appendChild(modal);
  const layer = nav.pushLayer(modal, { onBack: () => (close(), onCancel && onCancel()) });
  nav.focusFirst(modal);
  function close() {
    nav.popLayer(layer);
    if (modal.parentNode) modal.parentNode.removeChild(modal);
  }
}

// Novo perfil: primeiro o nome (não existe nome padrão), depois o app troca para ele e pede a conta.
export function createProfile() {
  askProfileName(t('Nome do novo perfil'), '', t('Criar perfil'), (name) => {
    const p = store.addProfile(name);
    session(SESSION_NEW, p.id);
    switchProfile(p.id);
  });
}

// Perfil recém-criado ainda sem conta: o app abre o login logo na entrada.
export function isNewProfilePendingLogin() {
  return session(SESSION_NEW) === store.activeProfile().id;
}

export function clearNewProfileFlag() {
  session(SESSION_NEW, null);
}

export function needsPicker() {
  if (session(SESSION_PICKED)) return false;
  // If askProfile is enabled (or active profile has a PIN), show the Choose Profile screen
  // upon launch so the user can pick a profile or create a new one (+).
  return (store.settings().askProfile !== false) || !!store.activeProfile().pin;
}

// Tela de escolha mostrada antes de o app carregar a conta.
export function showPicker(onPicked) {
  const list = store.profiles();
  const active = store.activeProfile();
  const cards = list.map((p) =>
    h(
      'div.profile-card',
      {
        focusable: true,
        'data-autofocus': p.id === active.id ? '' : null,
        onSelect: () => pick(p.id),
      },
      [avatar(p, 'big'), h('div.profile-name', { text: (p.pin ? '🔒 ' : '') + (p.isKids ? '🧒 ' : '') + p.name })]
    )
  );
  cards.push(
    h('div.profile-card', { focusable: true, onSelect: () => createProfile() }, [
      h('div.avatar.big.add', { text: '+' }),
      h('div.profile-name', { text: t('Adicionar perfil') }),
    ])
  );
  const el = h('div.view.profile-picker', null, [
    h('div.boot-logo', { html: 'Stremio <b>Kai 7M</b>' }),
    h('h1', { text: t('Quem está assistindo?') }),
    h('div.profile-row', { 'data-group': '' }, cards),
    h('p.profile-hint', { text: t('Cada perfil tem sua própria conta Stremio, com histórico e biblioteca separados.') }),
  ]);
  document.getElementById('app').appendChild(el);
  const layer = nav.pushLayer(el, { onBack: () => pick(active.id) });
  nav.focusFirst(el);

  function pick(id) {
    checkPin(
      list.find((p) => p.id === id),
      () => done(id)
    );
  }
  function done(id) {
    store.setActiveProfile(id);
    session(SESSION_PICKED, '1');
    nav.popLayer(layer);
    if (el.parentNode) el.parentNode.removeChild(el);
    onPicked();
  }
}
