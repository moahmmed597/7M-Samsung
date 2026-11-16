// "Go to chapter": a row at the top of a chapter list. You type a number and land on that chapter
// (or the nearest one after it when that exact number isn't there).
import { h } from './dom.js';
import * as nav from './nav.js';
import { promptText, toast } from '../ui.js';
import { t } from './i18n.js';

export function findChapter(chapters, text) {
  const n = parseFloat(String(text).replace(',', '.').replace(/[^\d.]/g, ''));
  if (!isFinite(n)) return -1;
  let best = -1;
  let gap = Infinity;
  chapters.forEach((c, i) => {
    const v = parseFloat(c.chapter);
    if (!isFinite(v)) return;
    const d = v >= n ? v - n : (n - v) * 1000; // prefer the same or the next chapter
    if (d < gap) {
      gap = d;
      best = i;
    }
  });
  return best;
}

// chapters(): the current list; show(i): open the page of the list that has chapter i and focus it.
export function chapterSearchRow(chapters, show) {
  return h('div.stream.md-nav.md-jump', {
    focusable: true,
    onSelect: () =>
      promptText(t('Ir para o capítulo'), '', t('Número do capítulo'), (q) => {
        const i = findChapter(chapters(), q);
        if (i < 0) return toast(t('Não achei esse capítulo.'));
        show(i);
      }),
  }, [h('div.s-main', { text: '🔢 ' + t('Ir para o capítulo...') })]);
}

// Focus the row of chapter i in a list built with data-ci attributes.
export function focusChapter(list, i) {
  const row = list.querySelector('[data-ci="' + i + '"]');
  if (row) nav.focus(row);
}
