// Home rows the user arranged (like Nuvio's customizable home): order and hidden rows, per profile.
import * as store from './store.js';

export function key(entry) {
  return (entry.addon.transportUrl || entry.addon.manifest.id || '') + '|' + entry.catalog.type + '|' + entry.catalog.id;
}

function prefs() {
  const p = store.settings().homeRows || {};
  return { order: p.order || [], hidden: p.hidden || [] };
}

function save(p) {
  store.saveSettings({ homeRows: { order: p.order, hidden: p.hidden } });
}

export function isHidden(entry) {
  return prefs().hidden.indexOf(key(entry)) >= 0;
}

// All entries in the user's order (new ones keep their place after the known ones).
export function sort(entries) {
  const order = prefs().order;
  return entries
    .map((e, i) => ({ e: e, i: i, o: order.indexOf(key(e)) }))
    .sort((a, b) => (a.o < 0 ? 1e6 + a.i : a.o) - (b.o < 0 ? 1e6 + b.i : b.o))
    .map((x) => x.e);
}

export function visible(entries) {
  const hidden = prefs().hidden;
  return sort(entries).filter((e) => hidden.indexOf(key(e)) < 0);
}

export function toggleHidden(entry) {
  const p = prefs();
  const k = key(entry);
  const i = p.hidden.indexOf(k);
  if (i >= 0) p.hidden.splice(i, 1);
  else p.hidden.push(k);
  save(p);
}

// Moves entry by delta (-1 up, +1 down) within the full list.
export function move(entries, entry, delta) {
  const list = sort(entries).map(key);
  const k = key(entry);
  const i = list.indexOf(k);
  const j = i + delta;
  if (i < 0 || j < 0 || j >= list.length) return;
  list.splice(i, 1);
  list.splice(j, 0, k);
  const p = prefs();
  p.order = list;
  save(p);
}

export function reset() {
  store.saveSettings({ homeRows: null });
}
