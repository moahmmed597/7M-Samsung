// Bookmarks with a colour, per title (per profile): a page of a chapter in the reader, or a moment of a
// track in the audiobook player. { chapterId, chapter, page | time, color, at }
import * as store from './store.js';

const KEY = 'bookmarks';
export const COLORS = [
  { id: 'red', hex: '#ef4444', label: 'Vermelho' },
  { id: 'yellow', hex: '#facc15', label: 'Amarelo' },
  { id: 'green', hex: '#22c55e', label: 'Verde' },
  { id: 'blue', hex: '#3b82f6', label: 'Azul' },
];
export const hexOf = (id) => (COLORS.find((c) => c.id === id) || COLORS[1]).hex;

const all = () => store.get(KEY, {}) || {};

export function list(key) {
  return (all()[key] || []).slice().sort((a, b) => (a.ci - b.ci) || ((a.page || 0) - (b.page || 0)) || ((a.time || 0) - (b.time || 0)));
}

// The bookmark on this exact page (or null).
export function at(key, chapterId, page) {
  return (all()[key] || []).find((b) => b.chapterId === chapterId && b.page === page && b.time == null) || null;
}

// Adds or recolours (same place = same bookmark).
export function put(key, mark) {
  const a = all();
  const l = (a[key] || []).filter((b) => !(b.chapterId === mark.chapterId && (mark.time == null ? b.page === mark.page && b.time == null : b.time != null && Math.abs(b.time - mark.time) < 2)));
  l.push(Object.assign({ at: Date.now() }, mark));
  a[key] = l.slice(-200);
  store.set(KEY, a);
}

export function remove(key, mark) {
  const a = all();
  a[key] = (a[key] || []).filter((b) => !(b.chapterId === mark.chapterId && b.page === mark.page && b.time === mark.time));
  if (!a[key].length) delete a[key];
  store.set(KEY, a);
}
