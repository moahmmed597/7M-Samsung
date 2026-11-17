// Book paper: a chapter's text laid out like a printed book (two pages side by side or one), used by
// the book reader and the audiobook player. Text comes from the plugins' text pages (SVG pictures with
// the words inside), turned back into paragraphs and mended where the source broke lines mid-sentence.
// The audiobook player can light up the sentence being read (estimated from the time: the audio has no
// word timings).
import { h, clear } from './dom.js';

// ---- text of the plugin pages ----
function svgOf(url) {
  const i = url.indexOf(',');
  return /;base64,/i.test(url.slice(0, i + 1)) ? decodeURIComponent(escape(atob(url.slice(i + 1)))) : decodeURIComponent(url.slice(i + 1));
}

// The paragraphs of one plugin page; null when it isn't a text page (a scan, a picture).
export function pageText(url) {
  if (!/^data:image\/svg\+xml/i.test(url || '')) return null;
  let svg = '';
  try {
    svg = svgOf(url);
  } catch (e) {
    return null;
  }
  const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
  const fo = doc.getElementsByTagName('foreignObject')[0];
  let html = '';
  if (fo) html = new XMLSerializer().serializeToString(fo);
  else {
    const lines = Array.prototype.map.call(doc.getElementsByTagName('text'), (x) => x.textContent.trim()).filter(Boolean);
    if (lines.length < 3) return null;
    html = lines.slice(1, -1).join('<br/>');
  }
  const box = document.createElement('div');
  box.innerHTML = html.replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '\n\n').replace(/<\/p>/gi, '\n\n').replace(/<br\s*\/?>/gi, '\n');
  const text = (box.textContent || '').replace(/\r/g, '');
  const paras = text.split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean);
  return paras.length ? paras : null;
}

const ENDS = /[.!?؟…:;"”’»)\]*_\-–—]$/;
// Many sources break their lines in the middle of a sentence ("Theon Greyjoy brought forth" / "the
// sword."). A paragraph that doesn't end a sentence is joined with the next one when that one goes on.
export function mend(paras) {
  const out = [];
  paras.forEach((p) => {
    const prev = out[out.length - 1];
    const goesOn = /^[a-z,;:)\]’”'"-]/.test(p) || (/^[؀-ۿ]/.test(p) && prev && !ENDS.test(prev) && prev.length > 60);
    if (prev && !ENDS.test(prev) && prev.length > 25 && goesOn) out[out.length - 1] = prev + ' ' + p;
    else out.push(p);
  });
  return out;
}

// All the text pages of a chapter as paragraphs, or null when one of them is a picture.
export function chapterText(list) {
  const paras = [];
  for (let k = 0; k < list.length; k++) {
    const p = pageText(list[k]);
    if (!p) return null;
    p.forEach((x) => paras.push(x));
  }
  return paras.length ? mend(paras) : null;
}

const SENT = /[^.!?؟…]+(?:[.!?؟…]+["”’»)\]]*\s*|$)/g;

// opts: { width, height, spread, size, paper: { bg, fg, id } }
export function Paper(o) {
  const opts = Object.assign({ width: 1680, height: 940, spread: true, size: 30 }, o || {});
  const flow = h('div.bk-flow');
  const sheet = h('div.bk-sheet', null, flow);
  const spine = h('div.bk-spine');
  const left = h('div.bk-num.l');
  const right = h('div.bk-num.r');
  const head = h('div.bk-head');
  const ribbon = h('div.rd-ribbon');
  ribbon.style.display = 'none';
  const el = h('div.bk-book', null, [sheet, spine, head, left, right, ribbon]);
  let page = 0;
  let count = 1;
  let rtl = false;
  let sents = []; // { el, start, end } in characters
  let total = 1;
  let lit = null;
  let step = 1;

  function geometry() {
    const bw = opts.spread ? opts.width : Math.min(opts.width, Math.round(opts.height * 1.15));
    const bh = opts.height;
    el.style.width = bw + 'px';
    el.style.height = bh + 'px';
    el.classList.toggle('one', !opts.spread);
    const padX = Math.round(bh * 0.085);
    const padY = Math.round(bh * 0.09);
    const gap = 2 * padX;
    const colW = opts.spread ? (bw - 2 * padX - gap) / 2 : bw - 2 * padX;
    sheet.style.left = padX + 'px';
    sheet.style.top = padY + 'px';
    sheet.style.width = bw - 2 * padX + 'px';
    sheet.style.height = bh - 2 * padY + 'px';
    flow.style.height = bh - 2 * padY + 'px';
    flow.style.webkitColumnWidth = flow.style.columnWidth = colW + 'px';
    flow.style.webkitColumnGap = flow.style.columnGap = gap + 'px';
    head.style.left = head.style.right = left.style.left = right.style.right = padX + 'px';
    step = colW + gap;
  }
  function measure() {
    geometry();
    count = Math.max(1, Math.round(flow.scrollWidth / step));
  }
  function per() {
    return opts.spread ? 2 : 1;
  }
  function show(p) {
    if (p != null) page = p;
    measure();
    page = Math.max(0, Math.min(page - (page % per()), count - 1));
    const x = page * step * (rtl ? -1 : 1);
    flow.style.webkitTransform = flow.style.transform = 'translateX(' + -x + 'px)';
    const a = page + 1;
    const b = page + 2 <= count ? page + 2 : '';
    if (opts.spread) {
      left.textContent = rtl ? b : a;
      right.textContent = rtl ? a : b;
    } else {
      left.textContent = '';
      right.textContent = a + ' / ' + count;
    }
    return page;
  }
  // The page (column) a node is on.
  function pageOf(node) {
    const f = flow.getBoundingClientRect();
    const r = node.getBoundingClientRect();
    const scale = f.width ? flow.offsetWidth / f.width : 1; // the view may be scaled to the screen
    const off = rtl ? (f.right - r.right) * scale : (r.left - f.left) * scale;
    return Math.max(0, Math.floor((off + 2) / step));
  }

  const api = {
    el: el,
    setPaper(p) {
      el.style.background = p.bg;
      el.style.color = p.fg;
      el.classList.toggle('dark', p.id === 'night');
    },
    setSize(px) {
      opts.size = px;
      flow.style.fontSize = px + 'px';
    },
    setSpread(on) {
      opts.spread = !!on;
    },
    setHead(text) {
      head.textContent = text || '';
    },
    // paras: the chapter's paragraphs; title: shown above the first one.
    setText(paras, title, isRtl) {
      rtl = !!isRtl;
      el.setAttribute('dir', rtl ? 'rtl' : 'ltr');
      clear(flow);
      sents = [];
      lit = null;
      let pos = 0;
      if (title) flow.appendChild(h('h2.bk-title', { text: title }));
      paras.forEach((p, i) => {
        const pe = h('p', { cls: i === 0 ? 'first' : '' });
        (p.match(SENT) || [p]).forEach((s) => {
          const se = h('span', { text: s });
          pe.appendChild(se);
          sents.push({ el: se, start: pos, end: pos + s.length });
          pos += s.length;
        });
        flow.appendChild(pe);
      });
      total = Math.max(1, pos);
      page = 0;
    },
    show: show,
    get page() {
      return page;
    },
    get count() {
      return count;
    },
    get per() {
      return per();
    },
    share() {
      return count > 1 ? page / count : 0;
    },
    ribbon(color) {
      ribbon.style.display = color ? '' : 'none';
      if (color) ribbon.style.background = color;
    },
    // Lights the sentence at this point of the chapter (0..1) and turns to its page; -1 clears.
    follow(frac) {
      if (!sents.length) return;
      if (frac < 0) {
        if (lit) lit.classList.remove('now');
        lit = null;
        return;
      }
      const at = Math.min(total - 1, Math.max(0, frac * total));
      let lo = 0;
      let hi = sents.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (sents[mid].end <= at) lo = mid + 1;
        else hi = mid;
      }
      const s = sents[lo].el;
      if (s === lit) return;
      if (lit) lit.classList.remove('now');
      s.classList.add('now');
      lit = s;
      const p = pageOf(s);
      if (p < page || p >= page + per()) show(p - (p % per()));
    },
  };
  return api;
}
