// Parental guide (like Nuvio): IMDb parents-guide levels from api.tiffara.com, off by default.
import * as server from './server.js';

const API = 'https://api.tiffara.com/titles/';
const CATS = [
  { key: 'SEXUAL_CONTENT', label: 'Nudez' },
  { key: 'VIOLENCE', label: 'Violência' },
  { key: 'PROFANITY', label: 'Palavrões' },
  { key: 'ALCOHOL_DRUGS', label: 'Álcool e drogas' },
  { key: 'FRIGHTENING_INTENSE_SCENES', label: 'Cenas assustadoras' },
];
const cache = {};

function severity(cat) {
  const list = ((cat && cat.severityBreakdowns) || []).map((x) => ({ level: String(x.severityLevel || '').toLowerCase(), votes: +x.voteCount || 0 }));
  const none = (list.find((x) => x.level === 'none') || { votes: 0 }).votes;
  const top = list.filter((x) => x.level && x.level !== 'none').sort((a, b) => b.votes - a.votes)[0];
  return top && top.votes > none ? top.level : null;
}

// Resolves to [{ label, level }] with level 'mild' | 'moderate' | 'severe'; [] when nothing to show.
export function guide(imdbId) {
  const id = (String(imdbId || '').match(/^tt\d+/) || [])[0];
  if (!id) return Promise.resolve([]);
  if (cache[id]) return cache[id];
  const p = server
    .getJSONViaProxy(API + id + '/parentsGuide', { timeout: 6000 })
    .then((r) => {
      const map = {};
      ((r && r.parentsGuide) || []).forEach((c) => (map[String(c.category || '').toUpperCase()] = c));
      return CATS.map((c) => ({ label: c.label, level: severity(map[c.key]) })).filter((x) => x.level);
    })
    .catch(() => {
      delete cache[id];
      return [];
    });
  cache[id] = p;
  return p;
}
