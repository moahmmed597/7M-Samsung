// Real episode ↔ chapter tables, read from two fan sites when you ask for a jump:
//   anime2manga.net      — episode by episode (which chapters each one adapts, filler marked), ~20 big series
//   mangaepisodeguide.com — arc by arc (chapters and episodes of each arc), ~100 series
// Episodes are counted across all seasons (episode 1 of season 2 = the one after the last of season 1).
// Kept on the TV for a week in a small form. Not in the list → animeLink falls back to its estimate.
import * as store from './store.js';
import { httpRaw } from '../api/plugins.js';
import { likeness } from './titles.js';

const A2M = 'https://anime2manga.net/series-data.js';
const MEG = 'https://mangaepisodeguide.com/data/';
const WEEK = 7 * 864e5;

function getText(url) {
  return httpRaw(url, { timeoutMs: 25000 }).then((r) => {
    if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));
    return r.body || '';
  });
}

// The object literal that starts at `from` (it is plain JSON in that file), read without running anything.
function jsonAt(text, from) {
  const start = text.indexOf('{', from);
  if (start < 0) return null;
  let depth = 0;
  let inStr = false;
  for (let i = start; i < text.length; i++) {
    const c = text.charAt(i);
    if (inStr) {
      if (c === '\\') i++;
      else if (c === '"') inStr = false;
    } else if (c === '"') inStr = true;
    else if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return JSON.parse(text.slice(start, i + 1));
  }
  return null;
}

const nums = (list) => (list || []).map((x) => parseFloat(String(x).replace(/[^\d.]/g, ''))).filter((n) => isFinite(n));

// [episode, chapters[], filler] in order → [episode, chapter it starts on, last chapter, filler 0/1].
// A flashback to an old chapter (One Piece ep. 4 shows ch. 1 and 8) starts where the story stands: ch. 8.
function toRows(list) {
  let last = 0;
  return list.map((e) => {
    const ch = e[1];
    if (e[2] || !ch.length) return [e[0], 0, 0, 1];
    const ahead = ch.filter((n) => n >= last);
    const first = ahead.length ? Math.min.apply(null, ahead) : Math.min.apply(null, ch);
    const end = Math.max.apply(null, ch);
    last = Math.max(last, end);
    return [e[0], first, end, 0];
  });
}
// "245-247", "12", "Novel" → [245, 246, 247] / [12] / []
function rangeOf(x) {
  const m = /(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/.exec(String(x));
  if (m) return [+m[1], +m[2]];
  return nums([x]);
}

// { name: [[episode, firstChapter, lastChapter, filler 0/1], ...] }, kept a week.
function exactTables() {
  const c = store.get('epmapExact', null);
  if (c && c.at > Date.now() - WEEK) return Promise.resolve(c.t);
  return getText(A2M).then((js) => {
    const all = jsonAt(js, js.indexOf('SERIES')) || {};
    const t = {};
    Object.keys(all).forEach((k) => {
      const s = all[k] || {};
      const rows = toRows((s.EPISODES || []).map((e) => [+e.episode, nums(e.chapters), e.filler]));
      if (rows.length && s.name) t[s.name] = rows;
    });
    store.set('epmapExact', { at: Date.now(), t: t });
    return t;
  });
}

// The second site's index: [{ id, name, type: 'arc'|'episode' }], kept a week.
function arcIndex() {
  const c = store.get('epmapArcIdx', null);
  if (c && c.at > Date.now() - WEEK) return Promise.resolve(c.list);
  return getText(MEG + '_index.json').then((txt) => {
    const list = (JSON.parse(txt) || []).filter((x) => x && x.id && x.name && (x.type === 'arc' || x.type === 'episode')).map((x) => ({ id: x.id, name: x.name, type: x.type }));
    store.set('epmapArcIdx', { at: Date.now(), list: list });
    return list;
  });
}
// One series of the second site, kept a week: arcs [[chapterStart, chapterCount, episodeStart,
// episodeCount, filler]] or, for the few listed episode by episode, rows like the first site's.
function arcs(id, type) {
  const all = store.get('epmapArcs2', {}) || {};
  if (all[id] && all[id].at > Date.now() - WEEK) return Promise.resolve(all[id].d);
  return getText(MEG + encodeURIComponent(id) + '.json').then((txt) => {
    const j = JSON.parse(txt) || {};
    const data = (j.data || []).filter((r) => Array.isArray(r));
    const d =
      type === 'episode'
        ? { kind: 'exact', rows: toRows(data.filter((r) => r.length >= 3).map((r) => [+r[0], rangeOf(r[2]), r[3] ? 1 : 0])) }
        : { kind: 'arc', rows: data.filter((r) => r.length >= 5).map((r) => [+r[1] || 0, +r[2] || 0, +r[3] || 0, +r[4] || 0, r[5] ? 1 : 0]) };
    all[id] = { at: Date.now(), d: d };
    const keys = Object.keys(all);
    if (keys.length > 30) delete all[keys[0]];
    store.set('epmapArcs2', all);
    return d;
  });
}

function best(names, candidates, getName) {
  let hit = null;
  let score = 0;
  candidates.forEach((c) => {
    const s = Math.max.apply(null, names.map((n) => likeness(n, getName(c))));
    if (s > score) {
      score = s;
      hit = c;
    }
  });
  return score >= 0.85 ? hit : null;
}

// The table for a franchise (its anime and manga names): { kind: 'exact'|'arc', rows } or null.
export function tableFor(names) {
  const list = (names || []).filter(Boolean);
  if (!list.length) return Promise.resolve(null);
  return exactTables()
    .catch(() => ({}))
    .then((t) => {
      const name = best(list, Object.keys(t), (x) => x);
      if (name) return { kind: 'exact', rows: t[name] };
      return arcIndex()
        .then((idx) => {
          const s = best(list, idx, (x) => x.name);
          return s ? arcs(s.id, s.type).then((d) => (d.rows.length ? d : null)) : null;
        })
        .catch(() => null);
    });
}

// Episode (counted across seasons) → the chapter it starts on, or null when the table doesn't reach it.
export function chapterOf(table, ep) {
  if (!table) return null;
  if (table.kind === 'exact') {
    const rows = table.rows;
    const i = rows.findIndex((r) => r[0] === ep);
    if (i < 0) return null;
    // Filler: the story stands where the last real episode left it.
    for (let k = i; k >= 0; k--) if (!rows[k][3]) return k === i ? rows[k][1] : rows[k][2];
    return 1;
  }
  const a = table.rows.find((r) => ep >= r[2] && ep < r[2] + r[3]);
  if (!a) return null;
  if (a[4]) {
    const prev = table.rows.filter((r) => !r[4] && r[2] < a[2]).pop();
    return prev ? prev[0] + prev[1] - 1 : 1;
  }
  return Math.round(a[0] + ((ep - a[2]) / Math.max(1, a[3])) * a[1]);
}

// The last episode that adapts the story, and its last chapter: [episode, chapter].
export function lastAdapted(table) {
  if (!table) return null;
  if (table.kind === 'exact') {
    const r = table.rows.filter((x) => !x[3]).pop();
    return r ? [r[0], r[2]] : null;
  }
  const a = table.rows.filter((x) => !x[4]).pop();
  return a ? [a[2] + a[3] - 1, a[0] + a[1] - 1] : null;
}

// Chapter → the first episode (counted across seasons) that adapts it, or null when the anime hasn't reached it.
export function episodeOf(table, ch) {
  if (!table) return null;
  if (table.kind === 'exact') {
    const r = table.rows.find((x) => !x[3] && ch >= x[1] && ch <= x[2]) || table.rows.find((x) => !x[3] && x[1] >= ch);
    return r ? r[0] : null;
  }
  const a = table.rows.find((r) => !r[4] && ch >= r[0] && ch < r[0] + r[1]);
  if (!a) return null;
  return Math.max(a[2], Math.round(a[2] + ((ch - a[0]) / Math.max(1, a[1])) * a[3]));
}
