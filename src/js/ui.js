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

// Several text boxes in one window (e.g. IPTV server, username, password) and a confirm button.
// OK on a box opens the TV keyboard; Done keeps the text and moves to the next box.
// fields: [{ key, label, value, placeholder }]; onSubmit({ key: text, ... })
export function formDialog(title, fields, okLabel, onSubmit) {
  const inputs = {};
  const rows = fields.map((f) => {
    const input = h('input.input', { type: 'text', value: f.value || '', placeholder: f.placeholder || '' });
    inputs[f.key] = input;
    const row = h('div.set-row.form-row', { focusable: true, onSelect: () => nav.select(input) }, [h('div.label', { text: f.label }), input]);
    input.__submit = () => {
      // next box (or the button) after Done
      const all = [].slice.call(box.querySelectorAll('[data-focus]'));
      const next = all[all.indexOf(row) + 1];
      setTimeout(() => next && nav.focus(next), 150);
    };
    return row;
  });
  const ok = h('div.btn.primary', {
    focusable: true,
    text: okLabel || 'OK',
    onSelect: () => {
      const out = {};
      Object.keys(inputs).forEach((k) => (out[k] = String(inputs[k].value || '').trim()));
      close();
      onSubmit(out);
    },
  });
  const box = h('div.modal-box.center.form-box', null, [h('h3', { text: title }), h('div.form-rows', { 'data-group': '', 'data-vertical': '' }, rows), h('div.modal-actions', { 'data-group': '' }, [ok, h('div.btn', { focusable: true, text: t('Cancelar'), onSelect: () => close() })])]);
  const modal = h('div.modal', null, box);
  document.getElementById('app').appendChild(modal);
  const layer = nav.pushLayer(modal, { onBack: () => close() });
  nav.focusFirst(modal);
  function close() {
    nav.popLayer(layer);
    if (modal.parentNode) modal.parentNode.removeChild(modal);
  }
}

// Barra superior com as abas principais.
export const TABS = [
  { id: 'home', label: 'Início' },
  { id: 'discover', label: 'Descobrir' },
  { id: 'movies', label: 'Filmes' },
  { id: 'series', label: 'Séries' },
  { id: 'anime', label: 'Animes' },
  { id: 'manga', label: 'Mangás' },
  { id: 'live', label: 'TV ao vivo' },
  { id: 'collections', label: 'Coleções' },
  { id: 'search', label: 'Buscar' },
  { id: 'library', label: 'Biblioteca' },
  { id: 'calendar', label: 'Calendário' },
  { id: 'settings', label: 'Ajustes' },
];

let keyed = false;
document.addEventListener('keydown', () => (keyed = true), true);
document.addEventListener('mousemove', () => (keyed = true), true);

// Icons: Harbor's own navigation glyphs (MIT), tinted with the text colour.
const NAV_ICONS = {
  live: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 512 512"><path d="m342.976,371.707c3.755,3.805,8.668,5.704,13.581,5.704s9.854-1.909,13.609-5.728c62.714-63.788,62.714-167.575-.007-231.359-7.509-7.631-19.674-7.641-27.183-.025-7.516,7.616-7.523,19.973-.021,27.6,47.765,48.58,47.765,127.625-.007,176.208-7.495,7.627-7.489,19.987.028,27.6Z" fill="currentColor" stroke-width="0"/><path d="m409.926,72.323c-7.509,7.616-7.516,19.977-.014,27.6,84.677,86.06,84.677,226.095,0,312.155-7.502,7.624-7.495,19.984.014,27.6,3.755,3.805,8.675,5.707,13.588,5.707s9.847-1.909,13.602-5.725c99.64-101.272,99.64-266.049,0-367.321-7.502-7.627-19.674-7.638-27.19-.018Z" fill="currentColor" stroke-width="0"/><path d="m88.485,445.386c4.913,0,9.833-1.902,13.588-5.707,7.509-7.616,7.516-19.977.014-27.6-84.677-86.06-84.677-226.095,0-312.155,7.502-7.624,7.495-19.984-.014-27.6-7.509-7.613-19.681-7.603-27.19.018-99.64,101.272-99.64,266.049,0,367.321,3.755,3.819,8.675,5.725,13.602,5.725Z" fill="currentColor" stroke-width="0"/><path d="m141.84,371.682c3.755,3.819,8.675,5.728,13.602,5.728s9.826-1.902,13.581-5.704c7.516-7.616,7.523-19.973.021-27.6-47.771-48.583-47.771-127.629,0-176.208,7.503-7.627,7.496-19.984-.021-27.6-7.523-7.616-19.688-7.606-27.183.025-62.728,63.784-62.728,167.572,0,231.359Z" fill="currentColor" stroke-width="0"/><path d="m255.996,323.592c36.717,0,66.587-30.321,66.587-67.589s-29.87-67.593-66.587-67.593-66.58,30.321-66.58,67.593,29.87,67.589,66.58,67.589Z" fill="currentColor" stroke-width="0"/></svg>',
  discover: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 512 512"><path d="m256.003,0C114.845,0-.002,114.84-.002,256.002s114.847,255.998,256.005,255.998,255.999-114.84,255.999-255.998S397.162,0,256.003,0Zm0,473.552c-119.963,0-217.551-97.592-217.551-217.551S136.041,38.448,256.003,38.448s217.544,97.595,217.544,217.554-97.588,217.551-217.544,217.551Z" fill="currentColor" stroke-width="0"/><path d="m350.297,137.382l-128.191,42.729c-9.771,3.305-18.732,8.849-25.927,16.034-7.286,7.293-12.862,16.307-16.108,26.063l-42.705,128.1c-2.303,6.906-.509,14.523,4.641,19.67,3.664,3.667,8.577,5.632,13.595,5.632,2.038,0,4.089-.321,6.079-.988l128.107-42.701c9.764-3.252,18.78-8.829,26.06-16.118,7.188-7.192,12.737-16.16,16.059-26.004l42.705-128.104c2.303-6.906.509-14.523-4.641-19.67-5.15-5.157-12.792-6.948-19.674-4.645Zm-72.666,158.068l-91.627,30.54,30.54-91.628c1.375-4.128,3.734-7.939,6.818-11.023.002-.002.004-.004.007-.006l65.292,65.292s-.002.002-.003.003c-3.084,3.085-6.902,5.444-11.027,6.822Z" fill="currentColor" stroke-width="0"/></svg>',
  home: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 512 512"><path d="m496.463,180.74L281.201,11.614h-.007C266.413-.007,245.748-.003,230.952,11.61L15.551,180.806C5.669,188.564-.005,200.222-.005,212.788v255.649c0,22.424,18.243,40.663,40.667,40.663h147c10.615,0,19.227-8.605,19.227-19.224v-131.297h98.384v131.297c0,10.619,8.612,19.224,19.227,19.224h146.839c22.423,0,40.667-18.24,40.667-40.663v-255.723c0-12.555-5.667-24.21-15.542-31.974Zm-22.912,287.697c0,1.221-.991,2.216-2.212,2.216h-127.612v-131.297c0-10.619-8.612-19.224-19.228-19.224h-136.838c-10.615,0-19.228,8.605-19.228,19.224v131.297H40.662c-1.221,0-2.212-.994-2.212-2.216v-255.649c0-.684.307-1.319.852-1.745L254.702,41.847c.796-.635,1.926-.642,2.75,0l215.254,169.123c.53.419.845,1.071.845,1.745v255.723Z" fill="currentColor" stroke-width="0"/></svg>',
  movies: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 512 512"><path d="m440.16,0H71.841C32.228,0-.002,32.229-.002,71.842v368.319c0,39.613,32.229,71.839,71.842,71.839h368.319c39.613,0,71.842-32.226,71.842-71.839V71.842C512.002,32.229,479.773,0,440.16,0ZM38.453,275.226h58.694v79.92h-58.694v-79.92Zm337.946-38.448h-240.798V38.448h240.798v198.33Zm-279.252,0h-58.694v-79.948h58.694v79.948Zm38.454,38.448h240.798v198.327h-240.798v-198.327Zm279.252,0h58.694v79.92h-58.694v-79.92Zm0-38.448v-79.948h58.694v79.948h-58.694Zm58.694-164.936v46.54h-58.694V38.448h25.306c18.411,0,33.388,14.98,33.388,33.395ZM71.841,38.448h25.306v79.934h-58.694v-46.54c0-18.414,14.977-33.395,33.388-33.395Zm-33.388,401.714v-46.568h58.694v79.959h-25.306c-18.411,0-33.388-14.981-33.388-33.391Zm401.707,33.391h-25.306v-79.959h58.694v46.568c0,18.411-14.977,33.391-33.388,33.391Z" fill="currentColor" stroke-width="0"/></svg>',
  series: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 512 512"><path d="m471.328,118.426h-166.209l92.113-85.068c7.796-7.202,8.284-19.363,1.082-27.166-7.202-7.796-19.36-8.288-27.169-1.078l-115.161,106.354L140.822,5.115c-7.803-7.206-19.96-6.71-27.169,1.078-7.203,7.802-6.714,19.964,1.082,27.166l92.113,85.068H40.672C18.249,118.426.005,136.666.005,159.09v279.821c0,22.424,18.243,40.663,40.667,40.663h.142l-1.713,9.914c-1.808,10.462,5.207,20.41,15.668,22.218,1.11.188,2.212.283,3.294.283,9.184,0,17.308-6.599,18.92-15.954l2.843-16.46h352.345l2.843,16.46c1.612,9.355,9.736,15.954,18.92,15.954,1.082,0,2.185-.094,3.294-.283,10.462-1.808,17.476-11.756,15.668-22.218l-1.713-9.914h.142c22.424,0,40.667-18.24,40.667-40.663V159.09c0-22.424-18.243-40.664-40.667-40.664Zm2.212,320.485c0,1.221-.991,2.216-2.212,2.216H40.672c-1.221,0-2.212-.994-2.212-2.216V159.09c0-1.221.991-2.216,2.212-2.216h430.656c1.221,0,2.212.995,2.212,2.216v279.821Z" fill="currentColor" stroke-width="0"/></svg>',
  anime: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 512 512"><path d="m256.002,490.854c-131.559,0-223.44-76.272-223.44-185.478,0-17.88,2.491-36.116,7.412-54.31-9.46-20.015-16.753-40.945-21.711-62.343-14.778-63.752-6.309-118.662,3.399-153.501,2.753-9.875,12.782-15.884,22.769-13.588,44.142,10.008,85.977,27.099,124.34,50.806,7.433,4.592,14.834,9.512,22.092,14.691,42.54-14.579,87.732-14.593,130.279,0,7.255-5.171,14.656-10.098,22.095-14.691,38.36-23.707,80.195-40.806,124.34-50.806,9.997-2.289,20.015,3.713,22.769,13.588,9.708,34.839,18.177,89.749,3.399,153.501-4.959,21.383-12.251,42.32-21.711,62.343,4.92,18.187,7.408,36.423,7.408,54.31,0,109.206-91.881,185.478-223.437,185.478ZM54.301,63.787c-6.131,29.953-9.191,70.508,1.417,116.255,4.84,20.881,12.224,41.266,21.949,60.612,2.226,4.425,2.655,9.54,1.2,14.272-5.213,16.994-7.858,33.966-7.858,50.451,0,86.566,76.074,147.025,184.993,147.025s184.99-60.458,184.99-147.025c0-16.491-2.645-33.464-7.855-50.451-1.455-4.732-1.026-9.847,1.2-14.272,9.729-19.353,17.112-39.745,21.949-60.612,10.608-45.747,7.548-86.301,1.417-116.255-33.248,9.331-64.879,23.205-94.257,41.357-9.394,5.806-18.721,12.185-27.731,18.969-5.37,4.041-12.464,4.99-18.71,2.484-39.752-15.933-82.271-15.926-122.009,0-6.246,2.512-13.337,1.556-18.71-2.484-9.02-6.79-18.348-13.169-27.727-18.969-29.378-18.152-61.01-32.026-94.257-41.357Z" fill="currentColor" stroke-width="0"/><path d="m53.791,479.416c-4.965,0-9.931-1.919-13.693-5.737-7.453-7.558-7.363-19.729.199-27.183,12.272-12.094,25.459-23.435,39.187-33.708,12.778-9.575,26.307-18.431,40.202-26.331,9.219-5.248,20.961-2.024,26.209,7.216,5.248,9.226,2.017,20.965-7.213,26.213-12.496,7.098-24.66,15.067-36.154,23.679-12.349,9.24-24.206,19.436-35.243,30.316-3.744,3.692-8.619,5.534-13.494,5.534Z" fill="currentColor" stroke-width="0"/><path d="m19.242,395.215c-7.087,0-13.902-3.936-17.252-10.72-4.7-9.519-.792-21.048,8.731-25.745,13.79-6.804,27.964-13.232,42.125-19.094,8.528-3.531,17.248-6.937,25.916-10.126,9.966-3.692,21.013,1.445,24.677,11.404,3.667,9.966-1.438,21.013-11.404,24.677-8.19,3.015-16.428,6.232-24.485,9.568-13.382,5.541-26.775,11.613-39.815,18.047-2.732,1.347-5.635,1.989-8.493,1.989Z" fill="currentColor" stroke-width="0"/><path d="m458.212,479.416c-4.875,0-9.75-1.842-13.494-5.534-11.03-10.873-22.887-21.069-35.24-30.316-11.512-8.619-23.676-16.589-36.161-23.679-9.23-5.248-12.461-16.98-7.216-26.213,5.241-9.233,16.969-12.464,26.213-7.216,13.885,7.893,27.41,16.749,40.209,26.331,13.731,10.28,26.918,21.621,39.183,33.708,7.562,7.453,7.652,19.625.199,27.183-3.762,3.817-8.727,5.737-13.693,5.737Z" fill="currentColor" stroke-width="0"/><path d="m492.758,395.215c-2.858,0-5.761-.642-8.497-1.989-13.012-6.428-26.408-12.499-39.811-18.047-8.022-3.322-16.257-6.539-24.485-9.568-9.962-3.664-15.067-14.719-11.4-24.677,3.667-9.959,14.712-15.088,24.681-11.404,8.706,3.203,17.423,6.609,25.913,10.126,14.181,5.869,28.355,12.297,42.125,19.094,9.519,4.704,13.427,16.226,8.727,25.745-3.35,6.783-10.165,10.72-17.252,10.72Z" fill="currentColor" stroke-width="0"/><path d="m159.63,300.19c-10.618,0-19.223-8.612-19.223-19.227v-19.108c0-10.615,8.605-19.227,19.223-19.227s19.223,8.612,19.223,19.227v19.108c0,10.615-8.605,19.227-19.223,19.227Z" fill="currentColor" stroke-width="0"/><path d="m352.349,300.19c-10.618,0-19.223-8.612-19.223-19.227v-19.108c0-10.615,8.605-19.227,19.223-19.227s19.223,8.612,19.223,19.227v19.108c0,10.615-8.605,19.227-19.223,19.227Z" fill="currentColor" stroke-width="0"/></svg>',
  manga: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 512 512"><path d="m256.502.34C115.8.34,1.326,114.778,1.326,255.439c0,41.02,9.891,81.483,28.676,117.582L2.309,458.595c-4.642,14.338-.997,29.958,9.515,40.762,7.758,7.988,18.255,12.303,29.045,12.303,3.813,0,7.66-.544,11.438-1.652l89.987-26.355c39.187,19.677,83.128,28.878,127.445,26.62,132.22-6.698,238.454-115.7,241.849-248.149,1.777-69.438-23.908-135.036-72.324-184.706C390.82,27.712,325.912.34,256.502.34Zm216.693,260.794c-2.879,112.515-93.102,205.101-205.394,210.789-40.003,1.994-79.559-6.873-114.32-25.741-4.454-2.418-9.696-2.969-14.554-1.554l-97.41,28.529c-.39.111-1.261.355-2.168-.564-.906-.934-.627-1.806-.502-2.175l30.223-93.402c1.652-5.109,1.087-10.678-1.547-15.349-18.186-32.203-27.791-68.936-27.791-106.227,0-119.485,97.243-216.693,216.769-216.693,58.969,0,114.111,23.253,155.263,65.472,41.125,42.191,62.942,97.919,61.429,156.916Z" fill="currentColor" stroke-width="0"/><path d="m227.039,125.75c-10.435-1.736-20.305,5.465-21.977,15.941l-20.13,126.323c-1.673,10.47,5.465,20.312,15.941,21.978,1.018.167,2.035.244,3.039.244,9.277,0,17.433-6.733,18.938-16.185l20.13-126.323c1.673-10.469-5.465-20.311-15.941-21.977Z" fill="currentColor" stroke-width="0"/><path d="m196.397,324.417l-1.966-.313c-10.462-1.736-20.318,5.464-21.984,15.934-1.673,10.469,5.465,20.311,15.934,21.984l1.966.314c1.025.167,2.042.244,3.046.244,9.271,0,17.433-6.733,18.938-16.178,1.673-10.47-5.465-20.312-15.934-21.984Z" fill="currentColor" stroke-width="0"/><path d="m324.602,141.294c-10.469-1.715-20.312,5.464-21.977,15.941l-20.13,126.33c-1.673,10.469,5.465,20.312,15.941,21.978,1.018.167,2.035.244,3.039.244,9.277,0,17.433-6.733,18.938-16.185l20.13-126.33c1.673-10.469-5.465-20.312-15.941-21.977Z" fill="currentColor" stroke-width="0"/><path d="m293.905,339.954l-1.959-.307c-10.476-1.68-20.304,5.521-21.936,15.997-1.645,10.476,5.521,20.297,15.997,21.936l1.959.307c1.004.16,2.007.237,2.99.237,9.298,0,17.468-6.761,18.945-16.234,1.645-10.476-5.521-20.297-15.997-21.936Z" fill="currentColor" stroke-width="0"/></svg>',
  collections: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 512 512"><path d="m471.055,181.997H40.945C18.55,181.997.33,200.217.33,222.612v248.457c0,22.396,18.22,40.616,40.616,40.616h430.109c22.396,0,40.616-18.22,40.616-40.616v-248.457c0-22.396-18.22-40.616-40.616-40.616Zm2.209,289.072c0,1.22-.99,2.209-2.209,2.209H40.945c-1.22,0-2.209-.99-2.209-2.209v-248.457c0-1.22.99-2.209,2.209-2.209h430.109c1.22,0,2.209.99,2.209,2.209v248.457Z" fill="currentColor" stroke-width="0"/><path d="m27.869,110.147c0,10.602,8.601,19.204,19.203,19.204h417.897c10.602,0,19.203-8.602,19.203-19.204s-8.602-19.203-19.203-19.203H47.072c-10.602,0-19.203,8.602-19.203,19.203Z" fill="currentColor" stroke-width="0"/><path d="m395.023,38.722c10.602,0,19.203-8.602,19.203-19.203S405.625.315,395.023.315H117.012c-10.602,0-19.203,8.602-19.203,19.204s8.601,19.203,19.203,19.203h278.01Z" fill="currentColor" stroke-width="0"/></svg>',
  search: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 512 512"><path d="m404.866,377.706c33.832-39.978,54.268-91.636,54.268-147.983C459.133,103.232,356.216.315,229.727.315S.32,103.232.32,229.722s102.917,229.406,229.407,229.406c56.347,0,108.005-20.435,147.982-54.267l101.192,101.198c3.75,3.75,8.664,5.625,13.578,5.625s9.828-1.875,13.578-5.625c7.493-7.5,7.5-19.656,0-27.156l-101.191-101.198Zm-175.139,43.017c-105.321,0-191-85.679-191-191S124.405,38.722,229.727,38.722s191,85.679,191,191-85.679,191-191,191Z" fill="currentColor" stroke-width="0"/></svg>',
  library: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 512 512"><path d="m492.768,512c-8.368,0-16.066-5.499-18.48-13.944l-118.392-414.357c-2.91-10.21,2.994-20.85,13.204-23.767,10.245-2.917,20.853,3.001,23.77,13.201l118.392,414.357c2.91,10.21-2.994,20.853-13.204,23.77-1.766.502-3.545.74-5.29.74Z" fill="currentColor" stroke-width="0"/><path d="m255.999,512c-10.615,0-19.227-8.612-19.227-19.227V78.416c0-10.619,8.612-19.224,19.227-19.224s19.227,8.605,19.227,19.224v414.357c0,10.615-8.612,19.227-19.227,19.227Z" fill="currentColor" stroke-width="0"/><path d="m137.614,512c-10.615,0-19.227-8.612-19.227-19.227V137.608c0-10.619,8.612-19.224,19.227-19.224s19.227,8.605,19.227,19.224v355.165c0,10.615-8.612,19.227-19.227,19.227Z" fill="currentColor" stroke-width="0"/><path d="m19.222,512C8.607,512-.005,503.388-.005,492.773V19.224C-.005,8.605,8.607,0,19.222,0s19.227,8.605,19.227,19.224v473.549c0,10.615-8.612,19.227-19.227,19.227Z" fill="currentColor" stroke-width="0"/></svg>',
  calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 512 512"><path d="m440.159,24.922h-20.713v-5.695C419.446,8.612,410.839,0,400.222,0s-19.224,8.612-19.224,19.227v5.695h-105.774v-5.695C275.224,8.612,266.617,0,256.001,0s-19.224,8.612-19.224,19.227v5.695h-105.775v-5.695C131.002,8.612,122.396,0,111.778,0s-19.224,8.612-19.224,19.227v5.695h-20.712C32.229,24.922.001,55.909.001,93.993v348.936c0,38.084,32.228,69.071,71.841,69.071h368.316c39.613,0,71.84-30.987,71.84-69.071V93.993c0-38.084-32.227-69.071-71.84-69.071ZM71.842,63.376h20.712v21.914c0,10.615,8.607,19.227,19.224,19.227s19.224-8.612,19.224-19.227v-21.914h105.775v21.914c0,10.615,8.607,19.227,19.224,19.227s19.224-8.612,19.224-19.227v-21.914h105.774v21.914c0,10.615,8.607,19.227,19.224,19.227s19.224-8.612,19.224-19.227v-21.914h20.713c18.412,0,33.393,13.735,33.393,30.617v80.468H38.448v-80.468c0-16.882,14.98-30.617,33.394-30.617Zm368.316,410.169H71.842c-18.414,0-33.394-13.734-33.394-30.617v-230.014h435.103v230.014c0,16.882-14.98,30.617-33.393,30.617Z" fill="currentColor" stroke-width="0"/></svg>',
  settings: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 512 512"><path d="m498.531,164.543l-42.777-73.732c-7.019-12.093-21.315-17.935-34.789-14.227l-52.2,14.373c-8.49-5.813-17.398-10.958-26.62-15.376l-13.759-52.326c-3.562-13.501-15.802-22.939-29.771-22.939h-85.239c-13.969,0-26.202,9.438-29.764,22.954l-13.759,52.312c-9.229,4.426-18.137,9.563-26.62,15.376l-52.187-14.366c-13.48-3.736-27.791,2.126-34.796,14.219L13.475,164.529c-7.026,12.073-5.012,27.4,4.9,37.277l38.399,38.211c-.439,5.416-.669,10.77-.669,15.983s.23,10.567.669,15.983l-38.393,38.211c-9.912,9.856-11.933,25.177-4.914,37.27l42.77,73.704c7.005,12.093,21.322,17.948,34.796,14.247l52.2-14.373c8.483,5.806,17.391,10.95,26.62,15.37l13.759,52.319c3.555,13.508,15.795,22.953,29.764,22.953h85.239c13.976,0,26.216-9.445,29.771-22.96l13.759-52.312c9.222-4.419,18.13-9.563,26.62-15.376l52.2,14.379c13.481,3.715,27.791-2.154,34.782-14.226l42.784-73.725c7.019-12.093,4.998-27.414-4.907-37.27l-38.399-38.211c.439-5.416.669-10.769.669-15.983s-.23-10.567-.669-15.983l38.406-38.225c9.905-9.863,11.919-25.19,4.9-37.249Zm-76.903,54.724c-4.224,4.21-6.26,10.135-5.5,16.046.906,7.082,1.359,14.045,1.359,20.688s-.453,13.606-1.359,20.688c-.76,5.911,1.276,11.835,5.5,16.046l40.741,40.539-36.88,63.555-55.386-15.251c-5.75-1.568-11.926-.397-16.687,3.207-10.818,8.19-22.577,14.979-34.949,20.172-5.5,2.314-9.612,7.054-11.131,12.825l-14.596,55.498h-73.48l-14.596-55.498c-1.52-5.771-5.632-10.511-11.132-12.825-12.386-5.2-24.145-11.989-34.949-20.172-4.761-3.604-10.929-4.775-16.687-3.207l-55.386,15.251-36.88-63.555,40.741-40.539c4.224-4.21,6.259-10.135,5.5-16.046-.906-7.082-1.359-14.045-1.359-20.688s.453-13.606,1.359-20.688c.76-5.911-1.275-11.836-5.5-16.046l-40.741-40.539,36.88-63.555,55.386,15.244c5.778,1.589,11.933.39,16.687-3.207,10.804-8.183,22.563-14.972,34.949-20.172,5.5-2.314,9.612-7.054,11.132-12.826l14.588-55.49h73.495l14.589,55.49c1.519,5.771,5.632,10.511,11.131,12.826,12.372,5.193,24.131,11.982,34.949,20.172,4.754,3.597,10.916,4.789,16.687,3.207l55.386-15.244,36.88,63.555-40.741,40.539Z" fill="currentColor" stroke-width="0"/><path d="m255.999,171.492c-46.589,0-84.501,37.912-84.501,84.508s37.912,84.501,84.501,84.501,84.501-37.911,84.501-84.501-37.912-84.508-84.501-84.508Zm0,130.603c-25.421,0-46.095-20.674-46.095-46.095s20.674-46.102,46.095-46.102,46.095,20.681,46.095,46.102-20.674,46.095-46.095,46.095Z" fill="currentColor" stroke-width="0"/></svg>',
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
          h('span.nav-ico', { html: NAV_ICONS[tab.id] || NAV_ICONS.home }),
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
      if (o.fallback && im.src.indexOf(o.fallback) < 0) {
        im.src = o.fallback;
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
