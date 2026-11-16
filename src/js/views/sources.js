// "My sources": manga from sources YOU add. The app bundles none. Two kinds:
//  - Plugin repositories in Harbor's format (a repo.json with *.plugin.js files): paste the repo URL,
//    install the plugins you want, they run on the TV in a sandbox (api/plugins.js).
//  - A Suwayomi server on your PC/NAS (Tachiyomi/Mihon extension repos are added there).
// Pick a source → Popular / Search → title → chapters → the TV reader.
import { h, clear, loadVisibleImages } from '../lib/dom.js';
import * as nav from '../lib/nav.js';
import * as sw from '../api/suwayomi.js';
import * as pl from '../api/plugins.js';
import { serviceVersion } from '../lib/phone.js';
import * as store from '../lib/store.js';
import { card, spinnerLine, toast, promptText, menu, confirmDialog } from '../ui.js';
import * as router from '../router.js';
import { t } from '../lib/i18n.js';
import { openReader } from './reader.js';
import * as shelf from '../lib/mangaLib.js';

const CHUNK = 50;

export function openSources() {
  router.push(SourcesView());
}

// Ask for the server address ("http://192.168.1.20:4567"), check it, save it.
export function connectServer(done) {
  promptText(t('Endereço do servidor Suwayomi'), sw.base() || 'http://', 'http://192.168.1.20:4567', (url) => {
    let u = url.trim().replace(/\/+$/, '');
    if (!/^https?:\/\//i.test(u)) u = 'http://' + u;
    // A repository link pasted here (raw.githubusercontent / jsDelivr / *.json): add it as a repository.
    if (/\.json(\?|$)|raw\.githubusercontent\.com|cdn\.jsdelivr\.net|\/repo(\.json)?$/i.test(u)) {
      if (/\.json(\?|$)/i.test(sw.base())) store.saveSettings({ suwayomiUrl: '' });
      return addRepoUrl(u, done);
    }
    store.saveSettings({ suwayomiUrl: u });
    sw.ping().then(
      () => {
        toast(t('Servidor conectado.'));
        if (done) done();
      },
      () => {
        toast(t('Não consegui falar com o servidor. Confira o endereço e se o CORS está ligado.'), 6000);
        if (done) done();
      }
    );
  });
}

// Adds a plugin repository by its link (also used by the phone setup page).
export function addRepoUrl(u, done) {
  toast(t('Lendo o repositório...'));
  return pl.fetchRepo(u).then(
    (r) => {
      if (r.kind !== 'harbor') {
        toast(t('Não reconheci este repositório.'), 6000);
        return done && done();
      }
      pl.addRepo(u);
      // Install every plugin of the repository (they are small); you can remove any later.
      return Promise.all(r.plugins.map((p) => pl.install(u, p).then(() => 1, () => 0))).then((ok) => {
        const n = ok.reduce((a, b) => a + b, 0);
        toast(t('{n} plugins instalados de {name}.', { n: n, name: r.name || t('Repositório') }), 5000);
        if (done) done();
      });
    },
    () => {
      toast(t('Não consegui abrir o repositório.'), 5000);
      if (done) done();
    }
  );
}

// ---------- adapters: one per kind of source ----------
function suwayomiApi(src) {
  return {
    name: src.name,
    latest: src.latest,
    kind: 'sw',
    browse: (k, page, q) => sw.browse(src.id, k, page, q),
    chapters: (m) => sw.chapters(m.swId),
    pagesFn: sw.pages,
    key: (m) => 'sw' + m.swId,
  };
}

const numOf = (c) => {
  const n = parseFloat(c.chapter);
  return isNaN(n) ? null : n;
};

export function pluginApi(pid, name) {
  let offset = 0;
  const toMeta = (it) => ({
    id: 'pl:' + pid + ':' + it.id,
    plId: pid,
    plName: name,
    mid: it.id,
    type: 'manga',
    name: it.title,
    poster: it.cover ? pl.imageUrl(it.cover, pl.refererOf(pid)) : '',
    description: it.description,
    author: it.author,
    status: it.status,
  });
  return {
    name: name,
    latest: false,
    kind: 'pl',
    browse: (k, page, q) => {
      if (page === 1) offset = 0;
      const p = k === 'search' ? pl.search(pid, q, offset) : pl.popular(pid, offset);
      return p.then((items) => {
        offset += items.length;
        return { items: items.map(toMeta), more: items.length > 0 };
      });
    },
    detail: (m) => pl.detail(pid, m.mid),
    chapters: (m) =>
      pl.chapters(pid, m.mid).then((cs) => {
        // Reading order: oldest first when the chapters are numbered (sites usually list newest first).
        const numbered = cs.filter((c) => numOf(c) !== null).length;
        if (numbered >= cs.length * 0.6) cs.sort((a, b) => (numOf(a) === null ? 1e9 : numOf(a)) - (numOf(b) === null ? 1e9 : numOf(b)));
        return cs;
      }),
    pagesFn: (cid) => pl.pages(pid, cid),
    key: (m) => 'pl' + pid + ':' + m.mid,
  };
}

// ---------- the list of sources ----------
function SourcesView() {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  el.appendChild(scroller);
  scroller.appendChild(h('div.row-title.catalog-title', { text: t('Minhas fontes') }));
  const body = h('div.flat-list', { 'data-group': '', 'data-vertical': '' });
  scroller.appendChild(body);
  const row = (text, sub, onSelect, tag) => h('div.stream', { focusable: true, onSelect: onSelect }, [h('div.s-main', null, [text, sub ? h('small', { text: ' ' + sub }) : null]), tag ? h('span.s-tag', { text: tag }) : null]);
  const section = (text) => body.appendChild(h('div.src-sec', { text: text }));

  function addRepo() {
    promptText(t('Endereço do repositório (repo.json)'), 'https://', '', (url) => {
      const u = url.trim();
      if (!/^https?:\/\//i.test(u)) return toast(t('Endereço inválido.'));
      toast(t('Lendo o repositório...'));
      pl.fetchRepo(u).then(
        (r) => {
          if (r.kind === 'harbor') {
            // Install every plugin of the repository at once (the old way asked one at a time).
            pl.addRepo(u);
            return Promise.all(r.plugins.map((p) => pl.install(u, p).then(() => 1, () => 0))).then((ok) => {
              toast(t('{n} plugins instalados de {name}.', { n: ok.reduce((x, y) => x + y, 0), name: r.name || t('Repositório') }), 5000);
              load();
            });
          }
          const why = {
            tachiyomi: t('Este é um repositório Tachiyomi/Mihon (apps Android). Adicione-o no seu servidor Suwayomi e conecte o servidor aqui.'),
            aidoku: t('Este é um repositório Aidoku (iPhone). O formato dele não roda na TV.'),
            mangayomi: t('Este é um repositório Mangayomi. Ainda não roda na TV.'),
          }[r.kind];
          toast(why || t('Não reconheci este repositório.'), 8000);
        },
        () => toast(t('Não consegui abrir o repositório.'), 5000)
      );
    });
  }

  function pickPlugins(url, r) {
    const have = pl.installed().map((p) => p.id);
    menu(
      r.name || t('Repositório'),
      r.plugins.map((p) => ({ label: p.name, sub: [p.lang.toUpperCase(), 'v' + p.version, have.indexOf(p.id) >= 0 ? t('instalado') : '', p.nsfw ? '18+' : ''].filter(Boolean).join(' · '), value: p, checked: have.indexOf(p.id) >= 0 })),
      {
        empty: t('Nenhum plugin neste repositório.'),
        onPick: (p) => {
          toast(t('Instalando {name}...', { name: p.name }));
          pl.install(url, p).then(
            () => {
              toast(t('{name} instalado.', { name: p.name }));
              load();
            },
            () => toast(t('Não consegui instalar {name}.', { name: p.name }), 5000)
          );
        },
      }
    );
  }

  function pluginMenu(p) {
    menu(p.name, [
      { label: t('Abrir'), value: 'open' },
      { label: t('Atualizar'), value: 'update' },
      { label: t('Remover'), value: 'remove' },
    ], {
      onPick: (v) => {
        if (v === 'open') router.push(SourceGrid(pluginApi(p.id, p.name)));
        else if (v === 'update')
          pl.fetchRepo(p.repoUrl)
            .then((r) => {
              const man = r.plugins.find((x) => x.id === p.id);
              if (!man) throw new Error('gone');
              return pl.install(p.repoUrl, man);
            })
            .then(
              () => (toast(t('{name} atualizado.', { name: p.name })), load()),
              () => toast(t('Não consegui atualizar.'))
            );
        else if (v === 'remove') confirmDialog(t('Remover {name}?', { name: p.name }), t('Remover'), () => (pl.uninstall(p.id), load()));
      },
    });
  }

  function load() {
    clear(body);
    // Plugins (Harbor repositories)
    section(t('Plugins (repositórios no formato do Harbor)'));
    if (serviceVersion() && serviceVersion() < 2)
      body.appendChild(h('div.modal-text', { text: t('O serviço da TV ainda é o antigo. Desligue a TV segurando o botão Power do controle até reiniciar, e abra o app de novo.') }));
    body.appendChild(row('＋ ' + t('Adicionar repositório'), t('cole o link do repo.json'), addRepo));
    pl.installed().forEach((p) => body.appendChild(row(p.name, 'v' + p.version, () => router.push(SourceGrid(pluginApi(p.id, p.name))), (p.lang || '').toUpperCase())));
    pl.installed().length &&
      body.appendChild(row('⚙ ' + t('Gerenciar plugins'), '', () =>
        menu(t('Plugins'), pl.installed().map((p) => ({ label: p.name, sub: 'v' + p.version, value: p })), { onPick: pluginMenu })
      ));
    pl.repos().forEach((u) =>
      body.appendChild(
        row('📦 ' + u.replace(/^https?:\/\//, ''), '', () =>
          menu(t('Repositório'), [{ label: t('Ver plugins'), value: 'list' }, { label: t('Remover repositório'), value: 'rm' }], {
            onPick: (v) => {
              if (v === 'rm') return pl.removeRepo(u), load();
              toast(t('Lendo o repositório...'));
              pl.fetchRepo(u).then((r) => pickPlugins(u, r), () => toast(t('Não consegui abrir o repositório.')));
            },
          })
        )
      )
    );
    // Suwayomi
    section(t('Servidor Suwayomi (extensões Tachiyomi/Mihon)'));
    body.appendChild(row('🔌 ' + (sw.enabled() ? sw.base() : t('Conectar servidor Suwayomi')), '', () => connectServer(load)));
    if (sw.enabled()) {
      const sp = spinnerLine(t('Carregando...'));
      body.appendChild(sp);
      sw.sources().then(
        (list) => {
          if (sp.parentNode) body.removeChild(sp);
          list.forEach((s) => body.appendChild(row(s.name, '', () => router.push(SourceGrid(suwayomiApi(s))), s.lang.toUpperCase())));
        },
        () => {
          if (sp.parentNode) body.removeChild(sp);
          body.appendChild(h('div.modal-text', { text: t('Não consegui falar com o servidor. Confira o endereço e se o CORS está ligado.') }));
        }
      );
    }
    const first = body.querySelector('.stream');
    if (first) nav.focus(first);
  }
  load();
  return { el: el };
}

// ---------- a source: Popular / Latest / Search ----------
export function searchPlugin(pid, name, query) {
  router.push(SourceGrid(pluginApi(pid, name), query));
}

function SourceGrid(api, startQuery) {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  el.appendChild(scroller);
  let kind = 'popular';
  let query = '';
  let page = 0;
  let more = null;
  const gridEl = h('div.grid');
  const bar = h('div.details-buttons', { 'data-group': '' });
  scroller.appendChild(h('div.row-title.catalog-title', { text: api.name }));
  scroller.appendChild(bar);
  scroller.appendChild(gridEl);

  function reload(k, q) {
    kind = k;
    query = q || '';
    page = 0;
    clear(gridEl);
    next();
  }
  if (startQuery) {
    kind = 'search';
    query = startQuery;
  }
  bar.appendChild(h('div.btn.primary', { focusable: true, 'data-autofocus': '', onSelect: () => reload('popular') }, t('Populares')));
  if (api.latest) bar.appendChild(h('div.btn', { focusable: true, onSelect: () => reload('latest') }, t('Recentes')));
  bar.appendChild(h('div.btn', { focusable: true, onSelect: () => promptText(t('Buscar mangá'), '', '', (q) => reload('search', q)) }, [h('span.ico', { text: '🔍' }), t('Buscar mangá')]));

  function next() {
    if (more && more.parentNode) gridEl.removeChild(more);
    const sp = spinnerLine(t('Carregando...'));
    gridEl.appendChild(sp);
    const my = kind + query;
    api.browse(kind, ++page, query).then(
      (r) => {
        if (my !== kind + query) return;
        if (sp.parentNode) gridEl.removeChild(sp);
        r.items.forEach((m) => gridEl.appendChild(card(m, { onSelect: () => router.push(SourceDetails(m, api)) })));
        if (!r.items.length && page === 1) gridEl.appendChild(h('div.modal-text', { text: t('Nada por aqui.') }));
        if (r.more) {
          more = h('div.card.see-all', { focusable: true, onSelect: () => next() }, [h('div.poster-wrap', null, h('div.see-all-label', null, [h('b', { text: '+' }), t('Carregar mais')])), h('div.name', { text: '' })]);
          gridEl.appendChild(more);
        }
        loadVisibleImages(el, 400);
      },
      (e) => {
        if (sp.parentNode) gridEl.removeChild(sp);
        toast(t('Não foi possível carregar agora.') + (e && e.message ? ' (' + e.message + ')' : ''), 5000);
      }
    );
  }
  next();
  return { el: el, onShow: () => loadVisibleImages(el, 400), onScroll: () => loadVisibleImages(el, 400) };
}

export function openSourceManga(m) {
  const api = m.plId ? pluginApi(m.plId, m.plName || '') : suwayomiApi({ id: '', name: '', latest: false });
  router.push(SourceDetails(m, api));
}

// ---------- a title: info + chapters ----------
function SourceDetails(m, api) {
  const el = h('div.view.md-view');
  const info = h('div.md-info');
  const listEl = h('div.md-list', { 'data-scroll-y': '', 'data-pad-y': '120', 'data-group': '', 'data-vertical': '' });
  el.appendChild(info);
  el.appendChild(listEl);
  let chapters = [];
  let chunk = 0;
  let alive = true;
  const key = api.key(m);
  const status = h('div.loading-line', { text: t('Procurando capítulos...') });
  const progress = () => (store.get('readProgress', {}) || {})[key] || null;
  const idxOf = () => {
    const p = progress();
    return p ? chapters.findIndex((c) => c.id === p.chapterId) : -1;
  };
  function read(i, page) {
    if (!chapters.length) return toast(t('Nenhum capítulo encontrado.'));
    openReader({ key: key, title: m.name, chapters: chapters, index: Math.max(0, i), startPage: page || 0, rtl: true, pagesFn: api.pagesFn, poster: m.poster, kind: api.kind, ref: m });
  }
  function renderInfo() {
    clear(info);
    const c = h('img.md-cover', { alt: '' });
    c.setAttribute('data-lazy', m.poster || '');
    info.appendChild(c);
    const text = h('div.md-text');
    text.appendChild(h('div.md-title', { text: m.name }));
    text.appendChild(h('div.md-meta', { text: [m.author, m.status, chapters.length ? t('{n} capítulos', { n: chapters.length }) : ''].filter(Boolean).join('  ·  ') }));
    text.appendChild(h('div.md-desc', { text: m.description || '' }));
    const idx = idxOf();
    text.appendChild(
      h('div.details-buttons', { 'data-group': '' }, [
        h('div.btn.primary', { focusable: true, 'data-autofocus': '', onSelect: () => (idx >= 0 ? read(idx, progress().page) : read(0, 0)) }, [h('span.ico', { text: '📖' }), idx >= 0 ? t('Continuar: cap. {n}', { n: chapters[idx].chapter }) : t('Ler')]),
        h('div.btn', { focusable: true, onSelect: () => (shelf.toggleFav(key, api.kind, m), renderInfo()) }, [h('span.ico', { text: shelf.isFav(key) ? '♥' : '♡' }), shelf.isFav(key) ? t('Nos favoritos') : t('Favoritar')]),
      ])
    );
    info.appendChild(text);
    loadVisibleImages(info);
  }
  function renderList() {
    clear(listEl);
    if (!chapters.length) return listEl.appendChild(status);
    const start = chunk * CHUNK;
    const end = Math.min(chapters.length, start + CHUNK);
    const p = progress();
    const jump = (label, to) => h('div.stream.md-nav', { focusable: true, onSelect: () => ((chunk = to), renderList()) }, [h('div.s-main', { text: label })]);
    if (chunk > 0) listEl.appendChild(jump('◀ ' + t('Capítulos {a}–{b}', { a: (chunk - 1) * CHUNK + 1, b: chunk * CHUNK }), chunk - 1));
    for (let i = start; i < end; i++) {
      const c = chapters[i];
      const here = p && p.chapterId === c.id;
      listEl.appendChild(
        h('div.stream', { focusable: true, onSelect: () => read(i, here ? p.page : 0) }, [
          h('div.s-main', { text: (c.chapter !== null && c.chapter !== undefined ? t('Cap. {n}', { n: c.chapter }) : t('Especial')) + (c.title ? ' · ' + c.title : '') }),
          c.scanlator ? h('span.s-tag', { text: c.scanlator }) : null,
          here ? h('span.s-tag.ok', { text: t('Parou aqui') }) : null,
        ])
      );
    }
    if (end < chapters.length) listEl.appendChild(jump(t('Capítulos {a}–{b}', { a: end + 1, b: Math.min(chapters.length, end + CHUNK) }) + ' ▶', chunk + 1));
  }
  renderInfo();
  renderList();
  if (api.detail && !m.description)
    api.detail(m).then(
      (d) => {
        if (!alive || !d) return;
        m.description = d.description || m.description;
        m.author = d.author || m.author;
        m.status = d.status || m.status;
        renderInfo();
      },
      () => {}
    );
  api.chapters(m).then(
    (cs) => {
      if (!alive) return;
      chapters = cs;
      const i = idxOf();
      chunk = i >= 0 ? Math.floor(i / CHUNK) : 0;
      if (!cs.length) status.textContent = t('Nenhum capítulo encontrado.');
      renderInfo();
      renderList();
    },
    (e) => alive && (status.textContent = t('Não encontrei capítulos deste título agora.') + (e && e.message ? ' (' + e.message + ')' : ''))
  );
  return {
    el: el,
    onShow: () => {
      if (chapters.length) {
        renderInfo();
        renderList();
      }
      loadVisibleImages(el);
    },
    destroy: () => (alive = false),
  };
}
