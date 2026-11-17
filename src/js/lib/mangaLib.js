// Your manga shelf: favorites, and "continue reading" built from the reader's saved places.
// Works for every source (AniList manga 'al', plugins 'pl', Suwayomi 'sw', ComicVine comics 'cv').
import * as store from './store.js';

const FAVS = 'mangaFavs';

export const favs = () => store.get(FAVS, []) || [];
export const isFav = (key) => favs().some((f) => f.key === key);

export function toggleFav(key, kind, ref) {
  const all = favs();
  const i = all.findIndex((f) => f.key === key);
  if (i >= 0) all.splice(i, 1);
  else all.unshift({ key: key, kind: kind, ref: { anilist: ref.anilist, mdId: ref.mdId, swId: ref.swId, plId: ref.plId, plName: ref.plName, mid: ref.mid, cvId: ref.cvId, title: ref.title, name: ref.name, poster: ref.poster, description: ref.description, author: ref.author, status: ref.status, year: ref.year } });
  store.set(FAVS, all.slice(0, 200));
  return i < 0;
}

// Newest first: titles with a saved place that carry what is needed to reopen them.
export function continueList(limit) {
  const all = store.get('readProgress', {}) || {};
  return Object.keys(all)
    .map((k) => Object.assign({ key: k }, all[k]))
    .filter((p) => p.kind && p.ref && p.at)
    .sort((a, b) => b.at - a.at)
    .slice(0, limit || 20);
}
