// Converts a Nuvio collections export (a community pack or a profile export) into the compact file
// the app reads: collections → folders (cover, shape) → sources (TMDB discover/list/collection/
// company, Trakt lists, add-on catalogs).
// Usage: node tools/import-nuvio-collections.mjs <export.json> <src/static/collections/name.json>
import fs from 'node:fs';
import path from 'node:path';

const [input, output, skipArg] = process.argv.slice(2);
// Optional third argument: collection titles to leave out, comma separated (e.g. "Anime,Actors").
const skip = String(skipArg || '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
if (!input || !output) {
  console.error('Usage: node tools/import-nuvio-collections.mjs <export.json> <output.json>');
  process.exit(1);
}

function findCollections(o, depth) {
  if (!o || typeof o !== 'object' || depth > 8) return null;
  if (Array.isArray(o) && o.length && o[0] && o[0].folders) return o;
  for (const v of Array.isArray(o) ? o : Object.values(o)) {
    const x = findCollections(v, depth + 1);
    if (x) return x;
  }
  return null;
}

// Nuvio's camelCase TMDB filters → TMDB discover parameters (movie or tv).
function discoverParams(filters, media) {
  const tv = media === 'tv';
  const map = {
    voteCountGte: 'vote_count.gte',
    'vote_count.gte': 'vote_count.gte',
    voteAverageGte: 'vote_average.gte',
    withOriginalLanguage: 'with_original_language',
    withGenres: 'with_genres',
    withoutGenres: 'without_genres',
    withKeywords: 'with_keywords',
    withoutKeywords: 'without_keywords',
    withCompanies: 'with_companies',
    withOriginCountry: 'with_origin_country',
    withNetworks: 'with_networks',
    watchRegion: 'watch_region',
    withWatchProviders: 'with_watch_providers',
    releaseDateGte: tv ? 'first_air_date.gte' : 'primary_release_date.gte',
    releaseDateLte: tv ? 'first_air_date.lte' : 'primary_release_date.lte',
    year: tv ? 'first_air_date_year' : 'primary_release_year',
  };
  const out = {};
  Object.keys(filters || {}).forEach((k) => {
    const v = filters[k];
    if (v === null || v === undefined || v === '') return;
    out[map[k] || k] = Array.isArray(v) ? v.join(',') : String(v);
  });
  return out;
}

function source(s) {
  const media = String(s.mediaType || s.type || '').toUpperCase() === 'TV' || s.type === 'series' ? 'tv' : 'movie';
  const name = s.title || s.name || '';
  if (s.provider === 'trakt' && s.traktListId) return { n: name, m: media, trakt: s.traktListId, sort: s.sortBy || 'rank' };
  if (s.provider === 'addon' || s.addonId) return { n: name, m: s.type || media, addon: s.addonId, cat: s.catalogId, genre: s.genre && s.genre !== 'None' ? s.genre : undefined };
  if (s.provider !== 'tmdb') return null;
  const kind = s.tmdbSourceType;
  if (kind === 'LIST') return { n: name, m: media, list: s.tmdbId, sort: s.sortBy };
  if (kind === 'COLLECTION') return { n: name, m: 'movie', coll: s.tmdbId };
  if (kind === 'COMPANY') return { n: name, m: media, q: Object.assign({ with_companies: String(s.tmdbId), sort_by: s.sortBy || 'popularity.desc' }, discoverParams(s.filters, media)) };
  return { n: name, m: media, q: Object.assign({ sort_by: s.sortBy || 'popularity.desc' }, discoverParams(s.filters, media)) };
}

const raw = JSON.parse(fs.readFileSync(input, 'utf8'));
const cols = findCollections(raw, 0) || [];
const out = cols.filter((c) => skip.indexOf(String(c.title).trim().toLowerCase()) < 0).map((c) => ({
  t: c.title,
  f: c.folders.map((f) => {
    const x = {
      t: f.title,
      s: String(f.tileShape || 'POSTER').charAt(0), // P, L, S
      c: f.coverImageUrl || undefined,
      e: f.coverEmoji || undefined,
      h: f.hideTitle ? 1 : undefined,
      src: (f.sources || f.catalogSources || []).map(source).filter(Boolean),
    };
    return x;
  }),
}));
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(out));
const folders = out.reduce((n, c) => n + c.f.length, 0);
const srcs = out.reduce((n, c) => n + c.f.reduce((m, f) => m + f.src.length, 0), 0);
console.log('[collections] ' + out.length + ' collections, ' + folders + ' folders, ' + srcs + ' sources → ' + output + ' (' + Math.round(fs.statSync(output).size / 1024) + ' KB)');
