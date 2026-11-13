// Packages dist/ as a Tizen web app (.wgt) for "TizenBrew Installer → Install from GitHub".
// Why: TizenBrew opens app modules as a web page from 127.0.0.1, where Samsung's APIs (AVPlay,
// the player that switches audio tracks) don't exist. An installed app has them. The installer
// re-signs the package with the user's own Samsung certificate (Tizen 7+), so it ships unsigned.
// The app code still updates itself: loader.js loads the newest build from GitHub.
//
// Usage: npm run build && node tools/build-wgt.mjs   → out/Stremio7M.wgt
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const out = path.join(root, 'out');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const PACKAGE_ID = 'St7MSmsung'; // 10 letters/digits (Tizen rule)
const APP_ID = PACKAGE_ID + '.Stremio7M';
const SERVICE_ID = PACKAGE_ID + '.Service';
const version = String(pkg.version || '1.0.0').replace(/[^0-9.].*$/, '') || '1.0.0';

const config = `<?xml version="1.0" encoding="UTF-8"?>
<widget xmlns:tizen="http://tizen.org/ns/widgets" xmlns="http://www.w3.org/ns/widgets" id="https://github.com/moahmmed597/7M-Samsung" version="${version}" viewmodes="maximized">
    <access origin="*" subdomains="true"></access>
    <tizen:application id="${APP_ID}" package="${PACKAGE_ID}" required_version="3.0"/>
    <content src="index.html"/>
    <feature name="http://tizen.org/feature/screen.size.all"/>
    <feature name="http://tizen.org/feature/web.service"/>
    <icon src="icon.png"/>
    <name>Stremio 7M</name>
    <tizen:metadata key="http://samsung.com/tv/metadata/prelaunch.support" value="false"/>
    <tizen:privilege name="http://tizen.org/privilege/internet"/>
    <tizen:privilege name="http://tizen.org/privilege/tv.inputdevice"/>
    <tizen:privilege name="http://tizen.org/privilege/application.launch"/>
    <tizen:privilege name="http://developer.samsung.com/privilege/network.public"/>
    <tizen:privilege name="http://developer.samsung.com/privilege/productinfo"/>
    <tizen:profile name="tv-samsung"/>
    <tizen:service id="${SERVICE_ID}">
        <tizen:content src="service/remote-service.js"/>
        <tizen:name>Stremio7MService</tizen:name>
        <tizen:description>Phone remote and helper requests for Stremio 7M</tizen:description>
    </tizen:service>
    <tizen:setting screen-orientation="landscape" context-menu="disable" background-support="disable" encryption="disable" install-location="auto" hwkey-event="enable"/>
</widget>
`;

const files = [];
function add(name, data) {
  files.push({ name: name, data: Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8') });
}

add('config.xml', config);
// AVPlay draws through an <object type="application/avplayer">: allow it in the installed app.
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8').replace("object-src 'none'", 'object-src *');
add('index.html', html);
['loader.js', 'app.js', 'app.css', 'build.json', 'icon.png', 'largeIcon.png'].forEach((f) => {
  const p = path.join(dist, f);
  if (fs.existsSync(p)) add(f, fs.readFileSync(p));
});
(function walk(dir, rel) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach((f) => {
    const p = path.join(dir, f);
    const r = rel + '/' + f;
    if (fs.statSync(p).isDirectory()) walk(p, r);
    else add(r.slice(1), fs.readFileSync(p));
  });
})(path.join(dist, 'fonts'), '/fonts');
// The service: the same file TizenBrew runs, plus the entry points a Tizen service needs.
const service = fs.readFileSync(path.join(dist, 'remote-service.js'), 'utf8');
add('service/remote-service.js', service + '\nmodule.exports.onStart = function () {};\nmodule.exports.onRequest = function () {};\nmodule.exports.onExit = function () {};\n');

// ---------- Minimal ZIP writer (deflate) ----------
const CRC = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 255] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
const local = [];
const central = [];
let offset = 0;
files.forEach((f) => {
  const name = Buffer.from(f.name, 'utf8');
  const comp = zlib.deflateRawSync(f.data);
  const crc = crc32(f.data);
  const h = Buffer.alloc(30);
  h.writeUInt32LE(0x04034b50, 0);
  h.writeUInt16LE(20, 4);
  h.writeUInt16LE(0x0800, 6); // UTF-8 names
  h.writeUInt16LE(8, 8);
  h.writeUInt32LE(crc, 14);
  h.writeUInt32LE(comp.length, 18);
  h.writeUInt32LE(f.data.length, 22);
  h.writeUInt16LE(name.length, 26);
  local.push(h, name, comp);
  const c = Buffer.alloc(46);
  c.writeUInt32LE(0x02014b50, 0);
  c.writeUInt16LE(20, 4);
  c.writeUInt16LE(20, 6);
  c.writeUInt16LE(0x0800, 8);
  c.writeUInt16LE(8, 10);
  c.writeUInt32LE(crc, 16);
  c.writeUInt32LE(comp.length, 20);
  c.writeUInt32LE(f.data.length, 24);
  c.writeUInt16LE(name.length, 28);
  c.writeUInt32LE(offset, 42);
  central.push(c, name);
  offset += h.length + name.length + comp.length;
});
const cd = Buffer.concat(central);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(files.length, 8);
end.writeUInt16LE(files.length, 10);
end.writeUInt32LE(cd.length, 12);
end.writeUInt32LE(offset, 16);
fs.mkdirSync(out, { recursive: true });
const target = path.join(out, 'Stremio7M.wgt');
fs.writeFileSync(target, Buffer.concat(local.concat([cd, end])));
console.log('[wgt] ' + path.relative(root, target) + ' (' + files.length + ' files, app id ' + APP_ID + ')');
