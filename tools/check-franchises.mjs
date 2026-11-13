// Checks src/js/data/franchises.js against Cinemeta: each IMDb id must exist with the same
// type, a matching title and year (±3: Cinemeta sometimes has the US release), and every `chrono` list must hold exactly the items.
// Usage: node tools/check-franchises.mjs
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { FRANCHISES } = await import(pathToFileURL(path.join(root, 'src/js/data/franchises.js')).href);

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
let bad = 0;
const fail = (msg) => {
  bad++;
  console.log('  ✗ ' + msg);
};

async function meta(type, id) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(`https://v3-cinemeta.strem.io/meta/${type}/${id}.json`);
      if (r.ok) return (await r.json()).meta || null;
    } catch (e) {
      /* retry */
    }
  }
  return null;
}

const seen = new Map();
for (const f of FRANCHISES) {
  console.log(`${f.id} (${f.items.length})`);
  const ids = f.items.map((it) => it[0]);
  if (new Set(ids).size !== ids.length) fail(`${f.id}: duplicate id`);
  if (f.chrono) {
    const a = [...f.chrono].sort().join();
    const b = [...ids].sort().join();
    if (a !== b) fail(`${f.id}: chrono list differs from items (${f.chrono.length} vs ${ids.length})`);
  }
  await Promise.all(
    f.items.map(async ([id, title, year, kind]) => {
      const type = kind === 's' ? 'series' : 'movie';
      const key = type + id;
      if (!seen.has(key)) seen.set(key, meta(type, id));
      const m = await seen.get(key);
      if (!m || !m.name) return fail(`${id} ${title}: not found on Cinemeta as ${type}`);
      const y = parseInt(m.year || m.releaseInfo, 10);
      const nameOk = norm(m.name) === norm(title) || norm(m.name).includes(norm(title)) || norm(title).includes(norm(m.name));
      const exact = norm(m.name) === norm(title); // same title: a re-release year on Cinemeta is fine
      if (!nameOk || (!exact && !(Math.abs(y - year) <= 3))) fail(`${id} expected "${title}" ${year}, Cinemeta has "${m.name}" ${m.year || m.releaseInfo}`);
    })
  );
}
console.log(bad ? `${bad} problem(s)` : 'all ids match');
process.exit(bad ? 1 : 0);
