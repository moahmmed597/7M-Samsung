// Finds one title in all your installed sources (plugins): search each, take the best-matching
// result, read its chapters. Two sources at a time; the caller gets each hit as it comes.
import * as pl from '../api/plugins.js';
import { pluginApi } from '../views/sources.js';

import { norm, likeness } from './titles.js';
export { norm, likeness };

// A source's title without the extras around the name: "Dracula (رواية دراكولا - اقرأ واستمع)" → "Dracula".
export function bareTitle(x) {
  const t = String(x || '')
    .replace(/\([^)]*\)|\[[^\]]*\]|【[^】]*】/g, ' ')
    .split(/\s[-–—|]\s|\s*\|\s*/)[0]
    .trim();
  return t || String(x || '');
}
const scoreOf = (n, title) => Math.max(likeness(n, title), likeness(n, bareTitle(title)));

// names: the titles to try (first two are searched); year: prefer results that carry it.
// o.candidates: an array that collects the near misses ({ pid, name, mid, title, cover, score }), to offer them.
// onHit(hit) for each source that has it; resolves with all hits, most chapters first.
// hit: { pid, name, mid, title, count, cs }
export function scanSources(names, onHit, opts) {
  const o = opts || {};
  const plugins = pl.installed(o.kind || 'manga');
  const min = o.min || 0.85;
  let i = 0;
  const hits = [];
  function findIn(p) {
    let qi = 0;
    function next() {
      if ((o.alive && !o.alive()) || qi >= Math.min(names.length, 2)) return Promise.resolve(null);
      const q = names[qi++];
      return pl.search(p.id, q, 0).then(
        (items) => {
          let best = null;
          let score = 0;
          (items || []).slice(0, 40).forEach((it) => {
            let s = Math.max.apply(null, names.map((n) => scoreOf(n, it.title)));
            if (o.candidates && s >= 0.4) o.candidates.push({ pid: p.id, name: p.name, mid: it.id, title: it.title, cover: it.cover, score: s });
            if (o.year && String(it.title).indexOf(String(o.year)) >= 0) s += 0.05;
            if (s > score) {
              score = s;
              best = it;
            }
          });
          if (!best || score < min) return next();
          return pluginApi(p.id, p.name)
            .chapters({ mid: best.id })
            .then((cs) => {
              if (cs.length) return { pid: p.id, name: p.name, mid: best.id, title: best.title, count: cs.length, cs: cs };
              // Audiobooks: a book that only has sound (no text pages) still counts.
              if (o.kind !== 'books') return next();
              return pl.audioTracks(p.id, best.id).then((tr) => (tr.length ? { pid: p.id, name: p.name, mid: best.id, title: best.title, count: tr.length, cs: [], tracks: tr } : next()));
            }, next);
        },
        () => next()
      );
    }
    return next();
  }
  function lane() {
    if ((o.alive && !o.alive()) || i >= plugins.length) return Promise.resolve();
    const p = plugins[i++];
    return findIn(p)
      .then((hit) => {
        if (hit) {
          hits.push(hit);
          if (onHit) onHit(hit);
        }
      }, () => {})
      .then(lane);
  }
  return Promise.all([lane(), lane()]).then(() => hits.sort((a, b) => b.count - a.count));
}

export const linkOf = (hit) => ({ pid: hit.pid, name: hit.name, mid: hit.mid, title: hit.title, count: hit.count });
