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
import { keysGuide } from './keysGuide.js';
import { openReader, readingModeMenu, readingModeLabel } from './reader.js';
import { openAnime } from './anime.js';
import { chapterToEpisode, animeMeta } from '../lib/animeLink.js';
import * as links2 from '../lib/crossLinks.js';
import * as pl from '../api/plugins.js';
import { searchPlugin, pluginApi } from './sources.js';
import * as shelf from '../lib/mangaLib.js';
import { chapterSearchRow, focusChapter } from '../lib/chapterJump.js';

const CHUNK = 50;

// Titles compared loosely: case, accents, punctuation and "the/a" don't matter.
function norm(x) {
  return String(x || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9؀-ۿ]+/g, ' ')
    .replace(/\b(the|a|an)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
// 1 = same title; less when words differ ("One Piece Colored" vs "One Piece" is about 0.6).
function likeness(a, b) {
  const x = norm(a);
  const y = norm(b);
  if (!x || !y) return 0;
  if (x === y) return 1;
  const A = x.split(' ');
  const B = y.split(' ');
  const inB = A.filter((w) => B.indexOf(w) >= 0).length;
  return (0.9 * inB) / (A.length + B.length - inB);
}
// The source title linked to each AniList manga, so it opens right away next time.
function links() {
  return store.get('mangaLinks2', {}) || {};
}
function saveLink(id, v) {
  const all = links();
  if (v) all[id] = v;
  else delete all[id];
  store.set('mangaLinks2', all);
}

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
  const guide = keysGuide(null, {});
  el.appendChild(guide);
  el.appendChild(list);

  let chapters = [];
  let chunk = 0;
  let langSet = LANG_SETS.find((x) => x.id === store.settings().mangaLangs) || LANG_SETS[0];
  let alive = true;
  let anime = null;
  let linked = []; // light novel, other versions, live action
  let focusIdx = -1;
  // Chapters from one of your sources (when MangaDex doesn't have the title): { pid, name, mid, title }.
  let source = null;
  const status = h('div.loading-line', { text: t('Procurando capítulos...') });

  const progress = () => (store.get('readProgress', {}) || {})[key] || null;

  function indexOfProgress() {
    const p = progress();
    if (!p) return -1;
    const i = chapters.findIndex((c) => c.id === p.chapterId);
    if (i >= 0 || p.chapter == null) return i;
    return chapters.findIndex((c) => c.chapter != null && parseFloat(c.chapter) === parseFloat(p.chapter));
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
      pagesFn: source ? (cid) => pl.pages(source.pid, cid) : undefined,
    });
  }

  function renderInfo() {
    clear(info);
    keysGuide(guide, { listen: false });
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
                toast(
                  r.ahead
                    ? t('O anime ainda não chegou neste capítulo (vai até o cap. {c}). Abrindo o último: episódio {n}.', { c: r.lastChapter, n: r.episode })
                    : r.approx
                      ? t('Episódio {n} (aproximado)', { n: r.episode })
                      : t('Episódio {n}', { n: r.episode }),
                  6000
                );
                openAnime(Object.assign(animeMeta(r.anime), { episode: r.episode }));
              })
              .catch(() => openAnime(animeMeta(anime)));
          },
        }, [h('span.ico', { text: '▶' }), t('Ver no anime')])
      );
    if (linked.length) btns.push(h('div.btn', { focusable: true, onSelect: () => links2.linkedMenu(linked) }, [h('span.ico', { text: '🔗' }), t('Ligado ({n})', { n: linked.length })]));
    btns.push(
      h('div.btn', {
        focusable: true,
        onSelect: () => {
          shelf.toggleFav(key, 'al', m);
          renderInfo();
        },
      }, [h('span.ico', { text: shelf.isFav(key) ? '♥' : '♡' }), shelf.isFav(key) ? t('Nos favoritos') : t('Favoritar')])
    );
    if (pl.installed('manga').length) btns.push(h('div.btn', { focusable: true, onSelect: pickSource }, [h('span.ico', { text: '📚' }), h('span.lbl', { text: source ? source.name : 'MangaDex' })]));
    if (!source) btns.push(
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
    btns.push(h('div.btn', { focusable: true, onSelect: () => readingModeMenu(() => renderInfo()) }, [h('span.ico', { text: readingModeLabel().icon }), readingModeLabel().text]));
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
    if (chapters.length > 8)
      list.appendChild(
        chapterSearchRow(() => chapters, (i) => {
          chunk = Math.floor(i / CHUNK);
          renderList(false);
          focusChapter(list, i);
        })
      );
    if (chunk > 0) list.appendChild(nav2('◀ ' + t('Capítulos {a}–{b}', { a: (chunk - 1) * CHUNK + 1, b: chunk * CHUNK }), chunk - 1));
    for (let i = start; i < end; i++) {
      const c = chapters[i];
      const read2 = p && p.chapterId === c.id;
      const title = (c.chapter !== null && c.chapter !== undefined ? t('Cap. {n}', { n: c.chapter }) : t('Especial')) + (c.title ? ' · ' + c.title : '');
      list.appendChild(
        h('div.stream', { focusable: true, 'data-ci': String(i), onSelect: () => read(i, read2 ? p.page : 0) }, [
          h('div.s-main', { text: title }),
          c.lang ? h('span.s-tag', { text: c.lang.toUpperCase() }) : null,
          c.pages ? h('span.s-tag', { text: c.pages + ' ' + t('pág.') }) : null,
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

  let mdCount = null; // chapters MangaDex has (null = not asked yet)
  let found = null; // titles found in your sources, most chapters first
  let scanning = null;
  let picked = false; // you chose the source by hand on this screen

  function loadChapters() {
    const ln = links()[m.anilist];
    if (ln && ln.md) return loadChaptersMd(false);
    if (ln && pl.installed('manga').some((p) => p.id === ln.pid)) return useSource(ln, true);
    loadChaptersMd(true);
  }

  function showSource(ln, cs) {
    source = ln;
    chapters = cs;
    const idx = indexOfProgress();
    chunk = idx >= 0 ? Math.floor(idx / CHUNK) : 0;
    renderInfo();
    renderList(false);
  }

  // Chapters of the linked source title.
  function useSource(ln, fallback) {
    chapters = [];
    clear(list);
    status.textContent = t('Carregando capítulos de {name}...', { name: ln.name });
    list.appendChild(status);
    return pluginApi(ln.pid, ln.name)
      .chapters({ mid: ln.mid })
      .then((cs) => {
        if (!alive) return;
        if (!cs.length) throw new Error('empty');
        showSource(ln, cs);
      })
      .catch(() => {
        if (!alive) return;
        if (fallback) {
          saveLink(m.anilist, null);
          return loadChaptersMd(true);
        }
        status.textContent = t('Não consegui carregar os capítulos de {name}.', { name: ln.name });
        renderList(false);
      });
  }

  // The names to look for: English, Romaji, the name shown, then the other known titles.
  function names() {
    const out = [];
    [media.title && media.title.english, media.title && media.title.romaji, m.name].concat(media.synonyms || []).forEach((x) => {
      if (x && !out.some((y) => norm(y) === norm(x)) && out.length < 4) out.push(x);
    });
    return out;
  }

  // This title in one source: the best-matching search result and its chapters, or null.
  function findIn(p, qs) {
    let qi = 0;
    function next() {
      if (!alive || qi >= Math.min(qs.length, 2)) return Promise.resolve(null);
      const q = qs[qi++];
      return pl.search(p.id, q, 0).then(
        (items) => {
          let best = null;
          let score = 0;
          (items || []).slice(0, 40).forEach((it) => {
            const s2 = Math.max.apply(null, qs.map((n) => likeness(n, it.title)));
            if (s2 > score) {
              score = s2;
              best = it;
            }
          });
          if (!best || score < 0.85) return next();
          return pluginApi(p.id, p.name)
            .chapters({ mid: best.id })
            .then((cs) => (cs.length ? { pid: p.id, name: p.name, mid: best.id, title: best.title, count: cs.length, cs: cs } : next()), next);
        },
        () => next()
      );
    }
    return next();
  }

  // Look in all your sources, two at a time; onHit gets each source that has the title.
  function scan(onHit) {
    if (scanning) return scanning;
    const plugins = pl.installed('manga');
    const qs = names();
    const hits = [];
    let i = 0;
    function lane() {
      if (!alive || i >= plugins.length) return Promise.resolve();
      const p = plugins[i++];
      return findIn(p, qs)
        .then((hit) => {
          if (hit && alive) {
            hits.push(hit);
            if (onHit) onHit(hit);
          }
        }, () => {})
        .then(lane);
    }
    scanning = Promise.all([lane(), lane()]).then(() => {
      found = hits.sort((x, y) => y.count - x.count);
      return found;
    });
    return scanning;
  }
  const linkOf = (hit) => ({ pid: hit.pid, name: hit.name, mid: hit.mid, title: hit.title, count: hit.count });

  // MangaDex has no chapters (licensed titles like One Piece): look in all your sources.
  // The first one found opens right away; when the search ends, the one with the most chapters wins.
  function autoFind() {
    if (!pl.installed('manga').length) {
      status.textContent = t('O MangaDex não tem capítulos deste título (muitas séries licenciadas não ficam lá).');
      renderInfo();
      renderList(false);
      return offerPlugins();
    }
    status.textContent = t('Procurando nas suas fontes...');
    scan((hit) => {
      if (!source && !picked) showSource(linkOf(hit), hit.cs);
    }).then((all) => {
      if (!alive) return;
      if (!all.length) {
        status.textContent = t('Não encontrei este título nas suas fontes.');
        renderInfo();
        renderList(false);
        return offerPlugins();
      }
      if (picked) return;
      const best = all[0];
      saveLink(m.anilist, linkOf(best));
      if (!source || source.pid !== best.pid) {
        showSource(linkOf(best), best.cs);
        toast(t('{name}: {n} capítulos', { name: best.name, n: best.count }), 5000);
      }
      if (all.length > 1) toast(t('Achei em {n} fontes. Troque no botão 📚.', { n: all.length }), 5000);
    });
  }

  // Choose the source for this title: every source that has it, with its number of chapters.
  function pickSource() {
    if (!found) {
      toast(t('Procurando nas suas fontes...'), 4000);
      return scan().then(() => alive && pickSource());
    }
    const items = found.map((hit) => ({
      label: hit.name,
      sub: t('{n} capítulos', { n: hit.count }) + (norm(hit.title) !== norm(m.name) ? '  ·  ' + hit.title : ''),
      value: hit,
      checked: !!source && source.pid === hit.pid,
    }));
    items.unshift({ label: 'MangaDex', sub: mdCount ? t('{n} capítulos', { n: mdCount }) : '', value: 'md', checked: !source });
    items.push({ label: '🔎 ' + t('Buscar manualmente'), sub: t('Procure com outro nome numa fonte'), value: 'manual' });
    menu(t('Fonte dos capítulos'), items, {
      onPick: (v) => {
        picked = true;
        if (v === 'md') {
          saveLink(m.anilist, { md: true });
          return loadChaptersMd(false);
        }
        if (v === 'manual') return manualSearch();
        saveLink(m.anilist, Object.assign(linkOf(v), { manual: true }));
        showSource(linkOf(v), v.cs);
      },
    });
  }
  function manualSearch() {
    const q = names()[0] || m.name;
    menu(t('Buscar manualmente'), pl.installed('manga').map((p) => ({ label: t('Buscar em {name}', { name: p.name }), value: p })), {
      onPick: (p) => searchPlugin(p.id, p.name, q),
    });
  }

  function loadChaptersMd(thenSearch) {
    chapters = [];
    source = null;
    clear(list);
    status.textContent = t('Procurando capítulos...');
    list.appendChild(status);
    md.find(m.anilist, [media.title && media.title.english, media.title && media.title.romaji, m.name])
      .then((id) => (id ? md.chapters(id, langSet.langs) : []))
      .then(
        (cs) => {
          if (!alive) return;
          mdCount = cs.length;
          if (!cs.length && thenSearch) return autoFind();
          chapters = cs;
          let idx = indexOfProgress();
          // Opened from an anime episode: jump to the chapter that matches it (estimate).
          if (idx < 0 && m.focusChapter && cs.length) {
            idx = cs.findIndex((c) => parseFloat(c.chapter) >= m.focusChapter);
            if (idx < 0) idx = cs.length - 1;
            focusIdx = idx;
          }
          chunk = idx >= 0 ? Math.floor(idx / CHUNK) : 0;
          if (!cs.length) status.textContent = t('O MangaDex não tem capítulos deste título (muitas séries licenciadas não ficam lá).');
          renderInfo();
          renderList(false);
        },
        () => {
          if (!alive) return;
          if (thenSearch) return autoFind();
          status.textContent = t('Não encontrei capítulos deste título agora.');
          renderList(false);
        }
      );
  }

  // Search the title in the plugins you installed (My sources).
  function offerPlugins() {
    const q = names()[0] || m.name;
    const plugins = pl.installed('manga');
    if (!plugins.length) {
      list.appendChild(h('div.modal-text', { text: t('Adicione fontes em Mangá → Minhas fontes para ler outros títulos.') }));
      return;
    }
    plugins.forEach((p) =>
      list.appendChild(
        h('div.stream', { focusable: true, onSelect: () => searchPlugin(p.id, p.name, q) }, [h('div.s-main', { text: '🔎 ' + t('Buscar em {name}', { name: p.name }) }), h('span.s-tag', { text: (p.lang || '').toUpperCase() })])
      )
    );
  }

  renderInfo();
  loadChapters();
  adaptation(m.anilist).then((a) => {
    if (!alive || !a) return;
    anime = a;
    renderInfo();
  });
  links2
    .forManga(m.anilist, m.name)
    .then((l) => {
      if (!alive || !l.length) return;
      linked = l;
      renderInfo();
    })
    .catch(() => {});

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
