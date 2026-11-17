// "Continue watching" as one row, used by Home (everything) and by the Movies, Series and Anime tabs
// (only their own titles). Hold OK on a card: a menu to open it or to remove it from the row.
import { h, clear, loadVisibleImages } from '../lib/dom.js';
import * as stremio from '../api/stremio.js';
import * as hero from '../api/hero.js';
import * as store from '../lib/store.js';
import { card, menu, toast, confirmDialog } from '../ui.js';
import { openDetails } from './details.js';
import { t, epLabel } from '../lib/i18n.js';

export const isAnimeId = (id) => /^(kitsu|mal|anilist):/.test(String(id || ''));
// Which tab a title belongs to: 'anime', 'movie' or 'series'.
export function tabOf(it) {
  if (isAnimeId(it._id)) return 'anime';
  return it.type === 'movie' ? 'movie' : 'series';
}

function sortContinue(list) {
  const mode = store.settings().cwSort;
  const frac = (it) => (it.state && it.state.duration ? it.state.timeOffset / it.state.duration : 0);
  if (mode === 'progress') return list.slice().sort((a, b) => frac(b) - frac(a));
  if (mode === 'name') return list.slice().sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
  return list;
}

function episodeLabel(videoId, metaId) {
  if (!videoId || videoId === metaId) return '';
  const m = String(videoId).match(/:(\d+):(\d+)$/);
  return m ? epLabel(m[1], m[2]) : '';
}

// Hold OK on a card: open it, or take it off "Continue watching".
export function holdMenu(title, onOpen, onRemove, removeLabel, onRemoveAll) {
  return () =>
    menu(title, [
      { label: '▶ ' + t('Abrir'), value: 'open' },
      { label: '✕ ' + (removeLabel || t('Tirar de Continuar assistindo')), value: 'rm' },
      onRemoveAll ? { label: '🗑 ' + t('Tirar todos'), value: 'all' } : null,
    ].filter(Boolean), { onPick: (v) => (v === 'open' ? onOpen() : v === 'all' ? onRemoveAll() : onRemove()) });
}

// only: null (everything), 'anime', 'movie' or 'series'.
export function ContinueRow(only) {
  const row = h('div.row', { 'data-anchor': '30' });
  function render() {
    clear(row);
    const all = sortContinue(stremio.continueWatching()).filter((it) => !only || tabOf(it) === only);
    const items = all.slice(0, 20);
    // Hold OK → "Remove all": empties the row in one go (asks first).
    const clearAll = () =>
      confirmDialog(t('Tirar todos ({n}) de Continuar assistindo?', { n: all.length }), t('Tirar todos'), () => {
        stremio.dismissContinueMany(all.map((it) => it._id));
        toast(t('Continuar assistindo está vazio.'));
        render();
      });
    if (!items.length) {
      row.style.display = 'none';
      return;
    }
    row.style.display = '';
    row.appendChild(h('div.row-title', null, [t('Continuar assistindo'), h('small', { text: t('Segure OK para tirar da lista') })]));
    const track = h('div.row-track', { 'data-scroll-x': '', 'data-group': '' });
    items.forEach((it) => {
      const s = it.state;
      const ep = episodeLabel(s.video_id, it._id);
      const bg = /^tt\d+/.test(it._id) ? hero.background(it._id) : it.poster;
      // The episode's own picture (TMDB still, 300 px wide) when it's a series; the show's art otherwise.
      const se = /^(tt\d+):(\d+):(\d+)$/.exec(s.video_id || '');
      const still = se ? 'https://episodes.metahub.space/' + se[1] + '/' + se[2] + '/' + se[3] + '/w300.jpg' : null;
      const open = () => openDetails(it.type, it._id, { videoId: s.video_id, autoStreams: true });
      const c = card(
        { name: it.name, poster: it.poster },
        {
          wide: true,
          image: still || bg,
          fallback: still ? bg : null,
          title: it.name + (ep ? ' · ' + ep : ''),
          progress: s.duration ? s.timeOffset / s.duration : 0,
          overlay: { ep: ep, title: it.name, chip: s.duration && s.timeOffset / s.duration >= 0.03 ? t('{n}% assistido', { n: Math.round((s.timeOffset / s.duration) * 100) }) : t('A seguir') },
          onSelect: open,
        }
      );
      c.__long = holdMenu(it.name, open, () => {
        stremio.dismissContinue(it._id);
        toast(t('Tirado de Continuar assistindo.'));
        render();
      }, null, clearAll);
      track.appendChild(c);
    });
    row.appendChild(track);
    loadVisibleImages(row);
  }
  render();
  return { el: row, render: render };
}
