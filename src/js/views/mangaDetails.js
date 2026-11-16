// Manga details: cover, summary, "Read" / "Continue", the anime adaptation (when there is one) and
// the chapter list from MangaDex. The list is shown 50 chapters at a time to keep the TV light.
import { h, clear, loadVisibleImages } from '../lib/dom.js';
import * as nav from '../lib/nav.js';
import { postJSON } from '../lib/http.js';
import * as store from '../lib/store.js';
import * as md from '../api/mangadex.js';
import { toast, menu } from '../ui.js';
import * as router from '../router.js';
import { t } from '../lib/i18n.js';
import { openReader } from './reader.js';
import { openAnime } from './anime.js';
import { chapterToEpisode, animeMeta } from '../lib/animeLink.js';
import * as shelf from '../lib/mangaLib.js';

const CHUNK = 50;

export function openMangaDetails(m) {
  router.push(MangaDetailsView(m));
}

function plain(text) {
  return String(text || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .trim();
}

// The anime adapted from this manga, if AniList knows one.
function adaptation(id) {
  return postJSON(
    'https://graphql.anilist.co',
    { query: '{ Media(id: ' + id + ') { relations { edges { relationType node { id type format title { english romaji } coverImage { large } } } } } }' },
    { timeout: 12000, quiet: true }
  )
    .then((r) => {
      const edges = (r && r.data && r.data.Media && r.data.Media.relations && r.data.Media.relations.edges) || [];
      const hit = edges.find((e) => e.relationType === 'ADAPTATION' && e.node && e.node.type === 'ANIME');
      return hit ? hit.node : null;
    })
    .catch(() => null);
}

const LANG_SETS = [
  { id: 'ar,en', label: 'Árabe, depois inglês', langs: ['ar', 'en'] },
  { id: 'en', label: 'Inglês', langs: ['en'] },
  { id: 'ar', label: 'Árabe', langs: ['ar'] },
];

function MangaDetailsView(m) {
  const media = m.media || {};
  const key = 'al' + m.anilist;
  const el = h('div.view.md-view');
  const info = h('div.md-info');
  const list = h('div.md-list', { 'data-scroll-y': '', 'data-pad-y': '120', 'data-group': '', 'data-vertical': '' });
  el.appendChild(info);
  el.appendChild(list);

  let chapters = [];
  let chunk = 0;
  let langSet = LANG_SETS.find((x) => x.id === store.settings().mangaLangs) || LANG_SETS[0];
  let alive = true;
  let anime = null;
  let focusIdx = -1;
  const status = h('div.loading-line', { text: t('Procurando capítulos...') });

  const progress = () => (store.get('readProgress', {}) || {})[key] || null;

  function indexOfProgress() {
    const p = progress();
    if (!p) return -1;
    return chapters.findIndex((c) => c.id === p.chapterId);
  }

  function read(index, page) {
    if (!chapters.length) return toast(t('Nenhum capítulo encontrado.'));
    openReader({
      key: key,
      title: m.name,
      chapters: chapters,
      index: Math.max(0, index),
      startPage: page || 0,
      poster: m.poster,
      kind: 'al',
      ref: { anilist: m.anilist, name: m.name, poster: m.poster },
      // Korean and Chinese comics read top to bottom, left to right; Japanese manga right to left.
      rtl: media.countryOfOrigin === 'JP' || !media.countryOfOrigin,
    });
  }

  function renderInfo() {
    clear(info);
    const cover = h('img.md-cover', { alt: '' });
    cover.setAttribute('data-lazy', m.poster || '');
    info.appendChild(cover);
    const text = h('div.md-text');
    text.appendChild(h('div.md-title', { text: m.name }));
    const bits = [];
    if (media.startDate && media.startDate.year) bits.push(media.startDate.year);
    if (media.averageScore) bits.push('★ ' + (media.averageScore / 10).toFixed(1));
    if (media.chapters) bits.push(t('{n} capítulos', { n: media.chapters }));
    if (media.status) bits.push({ FINISHED: t('Completo'), RELEASING: t('Em lançamento'), NOT_YET_RELEASED: t('Em breve'), HIATUS: t('Em hiato'), CANCELLED: t('Cancelado') }[media.status] || '');
    text.appendChild(h('div.md-meta', { text: bits.filter(Boolean).join('  ·  ') }));
    text.appendChild(h('div.details-genres', null, (media.genres || []).slice(0, 5).map((g) => h('span', { text: g }))));
    text.appendChild(h('div.md-desc', { text: plain(media.description) }));
    const p = progress();
    const idx = indexOfProgress();
    const readBtn = h('div.btn.primary', {
      focusable: true,
      'data-autofocus': '',
      onSelect: () => (idx >= 0 ? read(idx, p.page) : read(0, 0)),
    }, [h('span.ico', { text: '📖' }), idx >= 0 ? t('Continuar: cap. {n}', { n: chapters[idx].chapter }) : t('Ler')]);
    const btns = [readBtn];
    if (anime)
      btns.push(
        h('div.btn', {
          focusable: true,
          onSelect: () => {
            // The episode that matches the chapter you stopped at (or the one you are looking at): an estimate.
            const cur = idx >= 0 ? parseFloat(chapters[idx].chapter) : m.focusChapter || 1;
            chapterToEpisode(m.anilist, cur)
              .then((r) => {
                if (!r) return openAnime(animeMeta(anime));
                toast(t('Episódio {n} (aproximado)', { n: r.episode }));
                openAnime(Object.assign(animeMeta(r.anime), { episode: r.episode }));
              })
              .catch(() => openAnime(animeMeta(anime)));
          },
        }, [h('span.ico', { text: '▶' }), t('Ver no anime')])
      );
    btns.push(
      h('div.btn', {
        focusable: true,
        onSelect: () => {
          shelf.toggleFav(key, 'al', m);
          renderInfo();
        },
      }, [h('span.ico', { text: shelf.isFav(key) ? '♥' : '♡' }), shelf.isFav(key) ? t('Nos favoritos') : t('Favoritar')])
    );
    btns.push(
      h('div.btn', {
        focusable: true,
        onSelect: () =>
          menu(t('Idioma dos capítulos'), LANG_SETS.map((x) => ({ label: t(x.label), value: x, checked: x.id === langSet.id })), {
            onPick: (v) => {
              langSet = v;
              store.saveSettings({ mangaLangs: v.id });
              loadChapters();
            },
          }),
      }, [h('span.ico', { text: '🌐' }), t(langSet.label)])
    );
    text.appendChild(h('div.details-buttons', { 'data-group': '' }, btns));
    info.appendChild(text);
    loadVisibleImages(info);
  }

  function renderList(focusFirst) {
    clear(list);
    if (!chapters.length) {
      list.appendChild(status);
      return;
    }
    const start = chunk * CHUNK;
    const end = Math.min(chapters.length, start + CHUNK);
    const p = progress();
    const nav2 = (label, to) => h('div.stream.md-nav', { focusable: true, onSelect: () => ((chunk = to), renderList(true)) }, [h('div.s-main', { text: label })]);
    if (chunk > 0) list.appendChild(nav2('◀ ' + t('Capítulos {a}–{b}', { a: (chunk - 1) * CHUNK + 1, b: chunk * CHUNK }), chunk - 1));
    for (let i = start; i < end; i++) {
      const c = chapters[i];
      const read2 = p && p.chapterId === c.id;
      const title = (c.chapter !== null && c.chapter !== undefined ? t('Cap. {n}', { n: c.chapter }) : t('Especial')) + (c.title ? ' · ' + c.title : '');
      list.appendChild(
        h('div.stream', { focusable: true, onSelect: () => read(i, read2 ? p.page : 0) }, [
          h('div.s-main', { text: title }),
          h('span.s-tag', { text: c.lang.toUpperCase() }),
          h('span.s-tag', { text: c.pages + ' ' + t('pág.') }),
          read2 ? h('span.s-tag.ok', { text: t('Parou aqui') }) : null,
          !read2 && i === focusIdx ? h('span.s-tag.ok', { text: t('Perto do episódio (aprox.)') }) : null,
        ])
      );
    }
    if (end < chapters.length) list.appendChild(nav2(t('Capítulos {a}–{b}', { a: end + 1, b: Math.min(chapters.length, end + CHUNK) }) + ' ▶', chunk + 1));
    if (focusFirst) {
      const first = list.querySelector('.stream');
      if (first) nav.focus(first);
    }
  }

  function loadChapters() {
    chapters = [];
    clear(list);
    status.textContent = t('Procurando capítulos...');
    list.appendChild(status);
    md.find(m.anilist, [media.title && media.title.english, media.title && media.title.romaji, m.name])
      .then((id) => {
        if (!id) throw new Error('none');
        return md.chapters(id, langSet.langs);
      })
      .then((cs) => {
        if (!alive) return;
        chapters = cs;
        let idx = indexOfProgress();
        // Opened from an anime episode: jump to the chapter that matches it (estimate).
        if (idx < 0 && m.focusChapter) {
          idx = cs.findIndex((c) => parseFloat(c.chapter) >= m.focusChapter);
          if (idx < 0) idx = cs.length - 1;
          focusIdx = idx;
        }
        chunk = idx >= 0 ? Math.floor(idx / CHUNK) : 0;
        if (!cs.length) status.textContent = t('Nenhum capítulo disponível neste idioma. Mude o idioma no botão do globo.');
        renderInfo();
        renderList(false);
      })
      .catch(() => {
        if (!alive) return;
        status.textContent = t('Não encontrei capítulos deste título agora.');
      });
  }

  renderInfo();
  loadChapters();
  adaptation(m.anilist).then((a) => {
    if (!alive || !a) return;
    anime = a;
    renderInfo();
  });

  return {
    el: el,
    onShow: () => {
      // Back from the reader: refresh "Continue" and the marker.
      if (chapters.length) {
        renderInfo();
        renderList(false);
      }
      loadVisibleImages(el);
    },
    destroy: () => {
      alive = false;
    },
  };
}
