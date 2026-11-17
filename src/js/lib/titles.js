// Loose title matching: case, accents, punctuation, years in brackets and "the/a" don't matter.
export function norm(x) {
  return String(x || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\(\s*\d{4}[^)]*\)/g, ' ')
    .replace(/[×✕]/g, 'x')
    .replace(/[^a-z0-9؀-ۿ]+/g, ' ')
    .replace(/\b(the|a|an)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// 1 = same title; less when words differ ("One Piece Colored" vs "One Piece" is about 0.6).
export function likeness(a, b) {
  const x = norm(a);
  const y = norm(b);
  if (!x || !y) return 0;
  if (x === y) return 1;
  const A = x.split(' ');
  const B = y.split(' ');
  const inB = A.filter((w) => B.indexOf(w) >= 0).length;
  return (0.9 * inB) / (A.length + B.length - inB);
}
