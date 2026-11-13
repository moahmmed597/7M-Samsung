// Colour themes. The stylesheet is written in the purple theme; another theme fetches it once,
// swaps the purple shades for the theme's and adds the result after the original.
export const THEMES = [
  { id: 'purple', label: 'Roxo', main: '#7b5bf5', light: '#9d85ff', pale: '#c9bbff' },
  { id: 'gold', label: 'Dourado', main: '#c9961a', light: '#e0b54a', pale: '#f2dca0' },
  { id: 'teal', label: 'Verde-água', main: '#14958c', light: '#3fc9bf', pale: '#a8ebe6' },
  { id: 'red', label: 'Vermelho', main: '#d6334a', light: '#f0596c', pale: '#f7b8c1' },
  { id: 'blue', label: 'Azul', main: '#2f6fe0', light: '#5b93f5', pale: '#b9d0fb' },
  { id: 'green', label: 'Verde', main: '#2e9e57', light: '#4fc27a', pale: '#b6e8c8' },
  { id: 'pink', label: 'Rosa', main: '#d43f8d', light: '#ec6aae', pale: '#f7bcdb' },
  { id: 'orange', label: 'Laranja', main: '#e0661f', light: '#f58c4c', pale: '#fbcfae' },
  { id: 'cyan', label: 'Ciano', main: '#1595b8', light: '#3ec0e0', pale: '#a9e5f4' },
  { id: 'indigo', label: 'Índigo', main: '#4652d6', light: '#6f7af0', pale: '#c3c8fa' },
  { id: 'silver', label: 'Prata', main: '#6f7a8c', light: '#9aa5b8', pale: '#d5dbe6' },
];

// Shapes and sizes (Settings → Appearance), applied as classes on <body>.
export const SHAPES = [
  { id: 'rounded', label: 'Arredondado' },
  { id: 'square', label: 'Reto' },
  { id: 'soft', label: 'Bem redondo' },
];
export const SIZES = [
  { id: 'small', label: 'Pequeno' },
  { id: 'medium', label: 'Médio' },
  { id: 'large', label: 'Grande' },
];
export const FOCUS = [
  { id: 'glow', label: 'Contorno e aumento' },
  { id: 'outline', label: 'Só contorno' },
  { id: 'lift', label: 'Só aumento' },
];
export const BACKGROUNDS = [
  { id: 'default', label: 'Escuro (padrão)' },
  { id: 'oled', label: 'Preto puro (OLED)' },
  { id: 'glow', label: 'Escuro com brilho da cor' },
];

export function applyLook(s) {
  const b = document.body;
  const set = (prefix, value, all) => all.forEach((x) => b.classList.toggle(prefix + x.id, x.id === value));
  set('shape-', s.cardShape || 'rounded', SHAPES);
  set('cards-', s.cardSize || 'medium', SIZES);
  set('focus-', s.focusStyle || 'glow', FOCUS);
  const bg = s.bgStyle || (s.oled ? 'oled' : 'default');
  b.classList.toggle('oled', bg === 'oled');
  b.classList.toggle('bg-glow', bg === 'glow');
}

const BASE = THEMES[0];

function rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(',');
}

function recolor(css, th) {
  const swap = [
    [BASE.main, th.main],
    [BASE.light, th.light],
    [BASE.pale, th.pale],
    ['rgba(' + rgb(BASE.main) + ',', 'rgba(' + rgb(th.main) + ','],
    ['rgba(' + rgb(BASE.light) + ',', 'rgba(' + rgb(th.light) + ','],
    ['#b9a8ff', th.pale],
  ];
  swap.forEach((p) => {
    css = css.split(p[0]).join(p[1]).split(p[0].toUpperCase()).join(p[1]);
  });
  return css;
}

export function apply(id) {
  const old = document.getElementById('theme-css');
  if (old) old.parentNode.removeChild(old);
  const th = THEMES.find((x) => x.id === id);
  if (!th || th === BASE) return;
  const x = new XMLHttpRequest();
  x.open('GET', (window.__KAI_BASE__ || '') + 'app.css'); // where loader.js took it from
  x.onload = () => {
    if (x.status !== 200) return;
    const style = document.createElement('style');
    style.id = 'theme-css';
    style.textContent = recolor(x.responseText, th);
    document.head.appendChild(style);
  };
  x.send();
}
