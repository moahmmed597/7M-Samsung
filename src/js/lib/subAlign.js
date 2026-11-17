// Lines an add-on subtitle up with the film's own subtitle timing (read from the video file by the TV
// service), like Nuvio's automatic sync: the same lines start at the same moments, so the right
// shift is the one that makes most start times meet. Frame-rate differences (a subtitle made for a
// 25 fps release on a 23.976 one) stretch the whole film; those scales are tried too.
// Pure: no DOM, no network.

const SCALES = [1, 25 / 23.976, 23.976 / 25, 25 / 24, 24 / 25, 24 / 23.976, 23.976 / 24];
const WINDOW = 180; // largest shift looked for (seconds)
const BIN = 0.2;
const TOL = 0.35; // a line "meets" when the shifted start is this close

function nearest(sorted, x) {
  let lo = 0;
  let hi = sorted.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] < x) lo = mid + 1;
    else hi = mid;
  }
  let best = sorted[lo] - x;
  if (lo > 0 && Math.abs(sorted[lo - 1] - x) < Math.abs(best)) best = sorted[lo - 1] - x;
  return best; // signed gap to the closest reference start
}

// How many target lines meet a reference line after scale + offset; and the gaps, to refine.
function meet(R, T, scale, offset, tol) {
  const gaps = [];
  for (let i = 0; i < T.length; i++) {
    const g = nearest(R, T[i] * scale + offset);
    if (Math.abs(g) <= tol) gaps.push(g);
  }
  return gaps;
}

function median(a) {
  if (!a.length) return 0;
  const s = a.slice().sort((x, y) => x - y);
  return s[s.length >> 1];
}

// ref: [[startMs, durationMs], ...] (the film's own subtitle); cues: [{ start, end }] in seconds.
// → { scale, offset, score, matched, second } — apply as: new start = start * scale + offset.
//   score 0 means "not sure": leave the subtitle alone.
export function align(ref, cues) {
  const R = ref.map((c) => c[0] / 1000).filter(isFinite).sort((a, b) => a - b);
  const T = cues.map((c) => c.start).filter(isFinite).sort((a, b) => a - b);
  if (R.length < 20 || T.length < 20) return null;
  // Only the reference lines inside the span the target could cover count for the score.
  const step = Math.max(1, Math.floor(T.length / 400));
  const sample = T.filter((_, i) => i % step === 0);
  const found = [];
  SCALES.forEach((scale) => {
    const votes = {};
    let j0 = 0;
    for (let i = 0; i < sample.length; i++) {
      const t = sample[i] * scale;
      while (j0 < R.length && R[j0] < t - WINDOW) j0++;
      for (let j = j0; j < R.length && R[j] <= t + WINDOW; j++) {
        const b = Math.round((R[j] - t) / BIN);
        votes[b] = (votes[b] || 0) + 1;
      }
    }
    Object.keys(votes)
      .sort((a, b) => votes[b] - votes[a])
      .slice(0, 6)
      .forEach((b) => {
        let off = +b * BIN;
        let gaps = meet(R, T, scale, off, TOL + BIN);
        off += median(gaps);
        gaps = meet(R, T, scale, off, TOL);
        off += median(gaps);
        gaps = meet(R, T, scale, off, TOL);
        const lo = T[0] * scale + off;
        const hi = T[T.length - 1] * scale + off;
        const inSpan = R.filter((x) => x >= lo - 1 && x <= hi + 1).length;
        const score = gaps.length / Math.max(1, Math.min(T.length, inSpan));
        found.push({ scale: scale, offset: Math.round(off * 100) / 100, score: score, matched: gaps.length });
      });
  });
  if (!found.length) return null;
  // Best first; at equal strength the plain shift (no stretch) wins.
  found.sort((a, b) => b.score - a.score || (a.scale === 1 ? -1 : b.scale === 1 ? 1 : 0));
  const best = found[0];
  // The strongest answer that is clearly a different one (another shift, more than 2 s away at 30 min).
  const at = (f) => f.scale * 1800 + f.offset;
  const rival = found.find((f) => Math.abs(at(f) - at(best)) > 2);
  const second = rival ? rival.score : 0;
  const sure = best.matched >= 20 && best.score >= 0.45 && best.score >= second + 0.15;
  return { scale: best.scale, offset: best.offset, score: sure ? best.score : 0, matched: best.matched, second: second };
}

// The cues retimed with a found scale (the offset is applied by the player's delay).
export function rescale(cues, scale) {
  if (!scale || scale === 1) return cues;
  return cues.map((c) => Object.assign({}, c, { start: c.start * scale, end: c.end * scale }));
}
