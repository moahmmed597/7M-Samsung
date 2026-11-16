// "Reading" hub: comics and books under one tab (the top bar has no room for one tab each).
import { h } from '../lib/dom.js';
import { topbar } from '../ui.js';
import * as router from '../router.js';
import { t } from '../lib/i18n.js';
import { ComicsView } from './comics.js';
import { BooksView } from './books.js';

export function ReadingView() {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const bar = topbar('reading', router.goTab);
  scroller.appendChild(bar);
  scroller.appendChild(h('div.row-title.catalog-title', { text: t('Leitura') }));
  scroller.appendChild(
    h('div.details-buttons', { 'data-group': '' }, [
      h('div.btn.primary', { focusable: true, 'data-autofocus': '', onSelect: () => router.push(ComicsView()) }, [h('span.ico', { text: '🦸' }), t('Quadrinhos')]),
      h('div.btn', { focusable: true, onSelect: () => router.push(BooksView()) }, [h('span.ico', { text: '📚' }), t('Livros')]),
    ])
  );
  el.appendChild(scroller);
  return { el: el, destroy: () => bar.__destroy && bar.__destroy() };
}
