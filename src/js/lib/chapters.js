// Chapters of a Matroska (.mkv/.webm) file, read with small HTTP Range requests (like Nuvio's
// chapter panel). Best effort: any failure just means no chapters.
const HEAD_BYTES = 256 * 1024;
const MAX_CHAPTERS_BYTES = 1024 * 1024;

const ID = {
  EBML: 0x1a45dfa3,
  SEGMENT: 0x18538067,
  SEEK_HEAD: 0x114d9b74,
  SEEK: 0x4dbb,
  SEEK_ID: 0x53ab,
  SEEK_POS: 0x53ac,
  CHAPTERS: 0x1043a770,
  EDITION: 0x45b9,
  EDITION_HIDDEN: 0x45bd,
  EDITION_DEFAULT: 0x45db,
  ATOM: 0xb6,
  TIME_START: 0x91,
  ATOM_HIDDEN: 0x98,
  ATOM_ENABLED: 0x4598,
  DISPLAY: 0x80,
  STRING: 0x85,
  CLUSTER: 0x1f43b675,
};

// Variable-length integer at pos. keepMarker: element ids keep the length bit.
function vint(b, pos, keepMarker) {
  if (pos >= b.length) return null;
  const first = b[pos];
  let len = 1;
  let mask = 0x80;
  while (len <= 8 && !(first & mask)) {
    len++;
    mask >>= 1;
  }
  if (len > 8 || pos + len > b.length) return null;
  let value = keepMarker ? first : first & (mask - 1);
  let allOnes = value === mask - 1;
  for (let i = 1; i < len; i++) {
    value = value * 256 + b[pos + i];
    if (b[pos + i] !== 0xff) allOnes = false;
  }
  return { value: value, len: len, unknown: !keepMarker && allOnes };
}

// { id, start (data), end } or null.
function element(b, pos) {
  const id = vint(b, pos, true);
  if (!id || id.len > 4) return null;
  const size = vint(b, pos + id.len, false);
  if (!size) return null;
  const start = pos + id.len + size.len;
  return { id: id.value, start: start, end: size.unknown ? Infinity : start + size.value, pos: pos };
}

function kids(b, parent) {
  const out = [];
  const end = Math.min(parent.end, b.length);
  let pos = parent.start;
  while (pos < end) {
    const e = element(b, pos);
    if (!e || e.end > end || e.end <= pos) break;
    out.push(e);
    pos = e.end;
  }
  return out;
}

function uint(b, e) {
  let v = 0;
  for (let i = e.start; i < e.end && i < b.length; i++) v = v * 256 + b[i];
  return v;
}

function utf8(b, e) {
  let s = '';
  for (let i = e.start; i < e.end && i < b.length; i++) s += '%' + ('0' + b[i].toString(16)).slice(-2);
  try {
    return decodeURIComponent(s).replace(/\0+$/, '').trim();
  } catch (x) {
    return '';
  }
}

function flag(b, parent, id, dflt) {
  const e = kids(b, parent).find((x) => x.id === id);
  return e ? uint(b, e) !== 0 : dflt;
}

// bytes = one whole Chapters element → [{ start (seconds), title }]
export function parse(b) {
  const root = element(b, 0);
  if (!root || root.id !== ID.CHAPTERS) return [];
  const editions = kids(b, root).filter((e) => e.id === ID.EDITION && !flag(b, e, ID.EDITION_HIDDEN, false));
  const ed = editions.find((e) => flag(b, e, ID.EDITION_DEFAULT, false)) || editions[0];
  if (!ed) return [];
  return kids(b, ed)
    .filter((e) => e.id === ID.ATOM && !flag(b, e, ID.ATOM_HIDDEN, false) && flag(b, e, ID.ATOM_ENABLED, true))
    .map((atom) => {
      const parts = kids(b, atom);
      const st = parts.find((x) => x.id === ID.TIME_START);
      if (!st) return null;
      const disp = parts.find((x) => x.id === ID.DISPLAY);
      const str = disp && kids(b, disp).find((x) => x.id === ID.STRING);
      return { start: uint(b, st) / 1e9, title: str ? utf8(b, str) : '' };
    })
    .filter(Boolean)
    .sort((x, y) => x.start - y.start);
}

function range(url, start, length) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.timeout = 8000;
    xhr.setRequestHeader('Range', 'bytes=' + start + '-' + (start + length - 1));
    xhr.onload = () => {
      const ok = xhr.status === 206 || (xhr.status === 200 && start === 0);
      if (!ok || !xhr.response) return resolve(null);
      let b = new Uint8Array(xhr.response);
      // A server that ignores Range on start=0 sends the whole file: keep only what was asked for.
      if (b.length > length) b = b.subarray(0, length);
      resolve(b);
    };
    xhr.onerror = xhr.ontimeout = () => resolve(null);
    xhr.send();
  });
}

// The whole element at absolute position pos (from the head bytes when it is there).
function elementAt(url, head, pos, max) {
  const fromHead = pos < head.length ? element(head, pos) : null;
  const probe = fromHead ? Promise.resolve({ b: head, e: fromHead }) : range(url, pos, 64).then((b) => (b ? { b: b, e: element(b, 0) } : null));
  return probe.then((p) => {
    if (!p || !p.e || p.e.end === Infinity) return null;
    const total = p.e.end - p.e.pos;
    if (total <= 0 || total > max) return null;
    if (pos + total <= head.length) return head.subarray(pos, pos + total);
    return range(url, pos, total).then((b) => (b && b.length === total ? b : null));
  });
}

export function looksMatroska(url, filename) {
  return /\.(mkv|webm)([?#]|$)/i.test(String(filename || '')) || /\.(mkv|webm)([?#]|$)/i.test(String(url || ''));
}

// Resolves to [{ start, title }] (possibly empty).
export function load(url) {
  if (!/^https?:\/\//i.test(String(url || '')) || typeof Uint8Array === 'undefined') return Promise.resolve([]);
  return range(url, 0, HEAD_BYTES)
    .then((head) => {
      if (!head) return [];
      const ebml = element(head, 0);
      if (!ebml || ebml.id !== ID.EBML) return [];
      const seg = element(head, ebml.end);
      if (!seg || seg.id !== ID.SEGMENT) return [];
      // Top-level children of the Segment until the first Cluster.
      let pos = seg.start;
      let seekHead = null;
      let chaptersPos = null;
      while (pos < head.length) {
        const e = element(head, pos);
        if (!e || e.end <= pos) break;
        if (e.id === ID.SEEK_HEAD && seekHead === null) seekHead = pos;
        if (e.id === ID.CHAPTERS) {
          chaptersPos = pos;
          break;
        }
        if (e.id === ID.CLUSTER || e.end === Infinity) break;
        pos = e.end;
      }
      const findPos =
        chaptersPos !== null || seekHead === null
          ? Promise.resolve(chaptersPos)
          : elementAt(url, head, seekHead, HEAD_BYTES).then((sh) => {
              if (!sh) return null;
              const root = element(sh, 0);
              let rel = null;
              kids(sh, root)
                .filter((x) => x.id === ID.SEEK)
                .forEach((s) => {
                  let id = null;
                  let p = null;
                  kids(sh, s).forEach((c) => {
                    if (c.id === ID.SEEK_ID) id = uint(sh, c);
                    else if (c.id === ID.SEEK_POS) p = uint(sh, c);
                  });
                  if (id === ID.CHAPTERS && p !== null && rel === null) rel = p;
                });
              return rel === null ? null : seg.start + rel;
            });
      return findPos.then((cp) => (cp === null ? [] : elementAt(url, head, cp, MAX_CHAPTERS_BYTES).then((b) => (b ? parse(b) : []))));
    })
    .catch(() => []);
}
