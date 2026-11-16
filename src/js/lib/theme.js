// Colour themes. The stylesheet is written in the purple theme; another theme fetches it once,
// swaps the purple shades for the theme's and adds the result after the original.
export const THEMES = [
  { id: 'graphite', label: 'Grafite (escuro)', main: '#2f5bd3', light: '#e6e8ee', pale: '#ffffff' },
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
  { id: 'crimson', label: 'Carmim', main: '#e6194b', light: '#f25278', pale: '#f9a8b8' },
  { id: 'emerald', label: 'Esmeralda', main: '#059669', light: '#10b981', pale: '#6ee7b7' },
  { id: 'amber', label: 'Âmbar', main: '#d97706', light: '#f59e0b', pale: '#fcd34d' },
  { id: 'violet', label: 'Violeta real', main: '#6d28d9', light: '#8b5cf6', pale: '#c4b5fd' },
  { id: 'fuchsia', label: 'Fúcsia neon', main: '#c026d3', light: '#d946ef', pale: '#f0abfc' },
  { id: 'rose', label: 'Rosa rubi', main: '#e11d48', light: '#f43f5e', pale: '#fda4af' },
  { id: 'sky', label: 'Azul céu', main: '#0284c7', light: '#0ea5e9', pale: '#7dd3fc' },
  { id: 'lime', label: 'Lima neon', main: '#65a30d', light: '#84cc16', pale: '#bef264' },
  { id: 'slate', label: 'Ardósia', main: '#475569', light: '#64748b', pale: '#94a3b8' },
  { id: 'netflix', label: 'Vermelho Netflix', main: '#e50914', light: '#ff3b47', pale: '#ff999f' },
  { id: 'samsung', label: 'Azul Samsung', main: '#1428a0', light: '#2b50d6', pale: '#8ea7ff' },
  { id: 'cyberpunk', label: 'Cyberpunk neon', main: '#00c8d7', light: '#00f0ff', pale: '#a5faff' },
  { id: 'sunset', label: 'Pôr do sol', main: '#ea580c', light: '#f97316', pale: '#fdba74' },
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

export const FONTS = [
  { id: 'samsung', label: 'Samsung (da TV)' },
  { id: 'montserrat', label: 'Montserrat (Kai)' },
];

export function applyLook(s) {
  document.body.classList.toggle('font-samsung', (s.appFont || 'samsung') === 'samsung');
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
