// The remote's keys, shown on the title page before you open it (manga, comics, books): a card at the
// bottom with the reading keys, and the listening keys too when the book has audio. Not focusable.
import { h, clear } from '../lib/dom.js';
import { t } from '../lib/i18n.js';

const cap = (s, cls) => h('span.kg-key' + (cls ? '.' + cls : ''), { text: s });
const row = (keys, label) => h('div.kg-row', null, [h('div.kg-keys', null, keys), h('div.kg-label', { text: label })]);

function readCol() {
  return h('div.kg-col', null, [
    h('div.kg-head', { text: '📖 ' + t('Lendo') }),
    row([cap('◀'), cap('▶')], t('Virar a página')),
    row([cap('▲'), cap('▼')], t('Descer na página / virar')),
    row([cap('OK')], t('Menu: marcar página, modo')),
    row([cap('OK ×2'), cap('CH ±')], t('Zoom (50% por vez)')),
    row([cap('', 'yellow'), cap('', 'blue')], t('Próximo / anterior capítulo')),
    row([cap('↩')], t('Voltar: tira o zoom, depois sai')),
  ]);
}

function listenCol() {
  return h('div.kg-col', null, [
    h('div.kg-head', { text: '🎧 ' + t('Ouvindo') }),
    row([cap('OK')], t('Tocar / pausar')),
    row([cap('◀'), cap('▶')], t('30 s para trás / frente')),
    row([cap('▲'), cap('▼')], t('Capítulo anterior / próximo')),
    row([cap('CH ±')], t('Virar a página que você vê')),
    row([cap('OK ⏱')], t('Segurar: velocidade, marcações')),
    row([cap('↩')], t('Voltar: salva onde parou')),
  ]);
}

// opts: { listen } → also the listening keys. Call again to redraw (e.g. when audio is found).
export function keysGuide(holder, opts) {
  const box = holder || h('div.keys-guide');
  clear(box);
  box.appendChild(h('div.kg-title', { text: '🎮 ' + t('Teclas do controle') }));
  box.appendChild(h('div.kg-cols', null, [readCol(), opts && opts.listen ? listenCol() : null]));
  box.classList.toggle('two', !!(opts && opts.listen));
  // Never on top of the title's text and buttons (the TV's fonts are wider than a PC's, so the
  // buttons may take more rows): smaller first, hidden if it still doesn't fit.
  const fit = () => {
    const info = box.parentNode && box.parentNode.querySelector('.md-info');
    if (!info) return;
    box.classList.remove('compact');
    box.style.visibility = '';
    const clash = () => info.getBoundingClientRect().bottom + 16 > box.getBoundingClientRect().top;
    if (!clash()) return;
    box.classList.add('compact');
    if (clash()) box.style.visibility = 'hidden';
  };
  setTimeout(fit, 0);
  setTimeout(fit, 700);
  setTimeout(fit, 2500);
  return box;
}
