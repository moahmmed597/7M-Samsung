// MangaDex (api.mangadex.org): chapters and pages for manga. Its JSON answers don't allow the app's
// origin, so the calls go through the TV service like IntroDB does (server.getJSONViaProxy);
// the page images are plain <img> loads and need no help. Chapter pages come in "data saver" size
// (about 1000 px wide): light on the TV's memory.
import * as server from './server.js';

const MD = 'https://api.mangadex.org/';
const enc = encodeURIComponent;

function md(path) {
  return server.getJSONViaProxy(MD + path, { timeout: 25000 });
}

// The MangaDex id of an AniList manga: title search, then the one whose AniList link matches.
const idCache = {};
const norm = (x) => String(x || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
function names(m) {
  const a = m.attributes || {};
  const out = Object.keys(a.title || {}).map((k) => a.title[k]);
  (a.altTitles || []).forEach((o) => Object.keys(o).forEach((k) => out.push(o[k])));
  return out.map(norm).filter(Boolean);
}

export function find(anilistId, titles) {
  if (idCache[anilistId]) return idCache[anilistId];
  const list = (titles || []).filter(Boolean);
  const wanted = list.map(norm);
  let fallback = null; // a result whose title equals ours, when no result links to our AniList id
  const tryTitle = (i) => {
    if (i >= list.length) return Promise.resolve(fallback);
    return md('manga?title=' + enc(list[i]) + '&limit=10&order%5Brelevance%5D=desc').then((r) => {
      const data = (r && r.data) || [];
      const hit = data.find((m) => m.attributes && m.attributes.links && String(m.attributes.links.al) === String(anilistId));
      if (hit) return hit.id;
      if (!fallback) {
        const same = data.find((m) => names(m).some((n) => wanted.indexOf(n) >= 0));
        if (same) fallback = same.id;
      }
      return tryTitle(i + 1);
    });
  };
  const p = tryTitle(0).then((id) => id || null);
  idCache[anilistId] = p;
  p.catch(() => delete idCache[anilistId]);
  return p;
}

// Chapters in reading order, one per chapter number, languages in the order given ('ar' first, then 'en').
export function chapters(mangaId, langs) {
  const q = (langs || ['en']).map((l) => '&translatedLanguage%5B%5D=' + l).join('');
  return md('manga/' + mangaId + '/feed?limit=500&order%5Bvolume%5D=asc&order%5Bchapter%5D=asc&includeExternalUrl=0&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica' + q).then((r) => {
    const out = [];
    const seen = {};
    ((r && r.data) || [])
      .map((c) => ({
        id: c.id,
        chapter: c.attributes.chapter,
        volume: c.attributes.volume,
        title: c.attributes.title || '',
        lang: c.attributes.translatedLanguage,
        pages: c.attributes.pages || 0,
      }))
      .filter((c) => c.pages > 0)
      .sort((a, b) => {
        const na = parseFloat(a.chapter);
        const nb = parseFloat(b.chapter);
        return (isNaN(na) ? 1e9 : na) - (isNaN(nb) ? 1e9 : nb) || langs.indexOf(a.lang) - langs.indexOf(b.lang);
      })
      .forEach((c) => {
        const key = c.chapter === null || c.chapter === undefined ? c.id : String(c.chapter);
        if (seen[key]) return; // same chapter in another language: keep the preferred one
        seen[key] = true;
        out.push(c);
      });
    return out;
  });
}

// URLs of a chapter's pages.
export function pages(chapterId) {
  return md('at-home/server/' + chapterId).then((r) => {
    const c = r && r.chapter;
    if (!c || !r.baseUrl) throw new Error('MangaDex');
    const files = c.dataSaver && c.dataSaver.length ? c.dataSaver : c.data;
    const dir = c.dataSaver && c.dataSaver.length ? 'data-saver' : 'data';
    return (files || []).map((f) => r.baseUrl + '/' + dir + '/' + c.hash + '/' + f);
  });
}
