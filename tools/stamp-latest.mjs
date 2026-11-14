// Writes latest.json = { sha } of the current commit. loader.js reads it from raw.githubusercontent.com
// when GitHub's API is slow or over its hourly limit. Run after pushing a build, then commit it.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
fs.writeFileSync(path.join(root, 'latest.json'), JSON.stringify({ sha: sha }) + '\n');
console.log('[latest] ' + sha);
