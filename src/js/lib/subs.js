// Legendas externas (SRT/VTT/ASS/SSA) desenhadas pelo próprio app, sincronizadas com o <video>.
import { getText } from './http.js';

export function toSec(ts) {
  if (!ts) return NaN;
  const s = String(ts).trim().replace(',', '.');
  const m = s.match(/(?:(?:(\d+):)?(\d+):)?(\d+(?:\.\d+)?)/);
  if (!m) return NaN;
  const h = parseInt(m[1] || '0', 10);
  const min = parseInt(m[2] || '0', 10);
  const sec = parseFloat(m[3] || '0');
  return h * 3600 + min * 60 + sec;
}

// Parses ASS/SSA subtitle events.
export function parseAss(text) {
  const cues = [];
  const lines = String(text)
    .replace(/^\uFEFF/, '')
    .replace(/\r/g, '')
    .split('\n');

  let startIdx = 1;
  let endIdx = 2;
  let textIdx = 9;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.charCodeAt(0) === 59 /* ; */) continue;

    if (/^Format:\s*/i.test(line)) {
      const parts = line.replace(/^Format:\s*/i, '').split(',').map((x) => x.trim().toLowerCase());
      startIdx = parts.indexOf('start');
      endIdx = parts.indexOf('end');
      textIdx = parts.indexOf('text');
      if (startIdx < 0) startIdx = 1;
      if (endIdx < 0) endIdx = 2;
      if (textIdx < 0) textIdx = parts.length - 1;
      continue;
    }

    if (/^Dialogue:\s*/i.test(line)) {
      const raw = line.replace(/^Dialogue:\s*/i, '');
      const limit = textIdx >= 0 ? textIdx : 9;
      let commaCount = 0;
      let lastPos = 0;
      const fields = [];
      for (let pos = 0; pos < raw.length && commaCount < limit; pos++) {
        if (raw[pos] === ',') {
          fields.push(raw.substring(lastPos, pos).trim());
          lastPos = pos + 1;
          commaCount++;
        }
      }
      fields.push(raw.substring(lastPos));

      const start = toSec(fields[startIdx]);
      const end = toSec(fields[endIdx]);
      let body = fields[fields.length - 1] || '';

      if (!isFinite(start) || !isFinite(end) || end <= start) continue;

      body = body
        .replace(/\{\\[^}]*\}/g, '')
        .replace(/\{[^}]*\}/g, '')
        .replace(/\\[Nn]/g, '\n')
        .replace(/\\h/g, ' ')
        .trim();

      if (body) {
        cues.push({ start: start, end: end, text: sanitize(body) });
      }
    }
  }
  cues.sort((a, b) => a.start - b.start);
  return cues;
}

// Parses SRT and WebVTT subtitles.
export function parseSrt(text) {
  const cues = [];
  const normalized = String(text)
    .replace(/^\uFEFF/, '')
    .replace(/\r\n?/g, '\n');

  const blocks = normalized.split(/\n\s*\n+/);
  for (let i = 0; i < blocks.length; i++) {
    const lines = blocks[i].trim().split('\n');
    let j = 0;
    while (j < lines.length && lines[j].indexOf('-->') < 0) j++;
    if (j >= lines.length) continue;

    const parts = lines[j].split('-->');
    if (parts.length < 2) continue;
    const start = toSec(parts[0]);
    const endToken = parts[1].trim().split(/\s+/)[0];
    const end = toSec(endToken);
    if (!isFinite(start) || !isFinite(end) || end <= start) continue;

    const body = lines
      .slice(j + 1)
      .join('\n')
      .replace(/\{\\[^}]*\}/g, '')
      .replace(/\\[Nn]/g, '\n')
      .trim();

    if (body) cues.push({ start: start, end: end, text: sanitize(body) });
  }
  cues.sort((a, b) => a.start - b.start);
  return cues;
}

export function parse(text) {
  if (!text) return [];
  const s = String(text);
  if (/^Dialogue:\s*/im.test(s) || /\[Events\]/i.test(s)) {
    const assCues = parseAss(s);
    if (assCues.length) return assCues;
  }
  const srtCues = parseSrt(s);
  if (srtCues.length) return srtCues;
  return parseAss(s);
}

// Mantém só <i>, <b>, <u>; o resto vira texto.
export function sanitize(s) {
  const esc = String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc.replace(/&lt;(\/?)(i|b|u)&gt;/gi, '<$1$2>').replace(/&lt;\/?[^&]*&gt;/g, '');
}

export function load(url, fallbackUrl) {
  return getText(url, { timeout: 20000 })
    .catch((e) => {
      if (fallbackUrl) return getText(fallbackUrl, { timeout: 20000 });
      throw e;
    })
    .then(parse);
}

// Renderizador: chame update(tempoEmSegundos) a cada timeupdate/intervalo.
export function Renderer(el) {
  let cues = [];
  let offset = 0;
  let lastHtml = '';
  let idx = 0;

  function find(t) {
    if (idx >= cues.length || (cues[idx] && cues[idx].start > t)) idx = 0;
    while (idx < cues.length && cues[idx].end < t) idx++;
    const out = [];
    for (let k = idx; k < cues.length && cues[k].start <= t; k++) {
      if (cues[k].end >= t) out.push(cues[k].text);
    }
    return out.join('\n');
  }

  return {
    set: (c) => {
      cues = c || [];
      idx = 0;
      lastHtml = '';
      el.innerHTML = '';
    },
    clear: () => {
      cues = [];
      lastHtml = '';
      el.innerHTML = '';
    },
    // One cue at a time (embedded subtitles delivered live by the Samsung player).
    add: (c) => {
      cues.push(c);
      if (cues.length > 300) cues.splice(0, 100);
      idx = 0;
    },
    active: () => cues.length > 0,
    setOffset: (sec) => (offset = sec),
    offset: () => offset,
    update: (t) => {
      if (!cues.length) return;
      const html = find(t - offset);
      if (html === lastHtml) return;
      lastHtml = html;
      el.innerHTML = html ? '<span dir="auto">' + html + '</span>' : '';
    },
  };
}
