// Ajustes: conta, servidor do PC, Hero Banner, tema OLED, legendas, addons e depuração.
import { h, clear } from '../lib/dom.js';
import * as nav from '../lib/nav.js';
import * as store from '../lib/store.js';
import { log } from '../lib/log.js';
import { deviceInfo } from '../lib/luna.js';
import * as substyle from '../lib/substyle.js';
import * as update from '../api/update.js';
import * as stremio from '../api/stremio.js';
import * as server from '../api/server.js';
import * as addons from '../api/addons.js';
import * as hero from '../api/hero.js';
import { topbar, toast, menu, confirmDialog, refreshProfileChips } from '../ui.js';
import * as router from '../router.js';
import { openLogin } from './login.js';
import { avatar, switchProfile, createProfile } from './profiles.js';
import { t } from '../lib/i18n.js';
import * as phone from '../lib/phone.js';
import * as theme from '../lib/theme.js';
import * as tracker from '../api/tracker.js';
import * as avvideo from '../lib/avvideo.js';
import { openTrackLink } from './trackLink.js';
import * as debrid from '../api/debrid.js';
import * as mediaserver from '../api/mediaserver.js';
import * as homeRows from '../lib/homeRows.js';
import * as mdblistRows from '../api/mdblistRows.js';
import * as badges from '../lib/badges.js';
import * as speedtest from '../lib/speedtest.js';
import { CW_SORTS } from './home.js';
import { promptText } from '../ui.js';

const SUB_LANGS = [
  { label: 'Inglês', value: ['eng', 'en'] },
  { label: 'Árabe', value: ['ara', 'ar'] },
  { label: 'Espanhol', value: ['spa', 'es'] },
  { label: 'Nenhum (não ligar sozinho)', value: [] },
];
const AUDIO_LANGS = [
  { label: 'Original do arquivo', value: [] },
  { label: 'Inglês quando houver', value: ['eng', 'en'] },
  { label: 'Árabe quando houver', value: ['ara', 'ar'] },
  { label: 'Japonês quando houver', value: ['jpn', 'ja'] },
];

// Addons úteis que o app aproveita (Anime Kitsu: catálogos de anime e IDs do calendário/AniSkip).
const RECOMMENDED = [
  { id: 'community.anime.kitsu', name: 'Anime Kitsu', url: 'https://anime-kitsu.strem.fun/manifest.json', desc: 'Catálogos e detalhes de animes (usado pelo calendário)' },
  { id: 'org.stremio.opensubtitlesv3', name: 'OpenSubtitles v3', url: 'https://opensubtitles-v3.strem.io/manifest.json', desc: 'Legendas em português para quase tudo' },
];

export function SettingsView() {
  const el = h('div.view');
  const scroller = h('div.scroll-y', { 'data-scroll-y': '' });
  const bar = topbar('settings', router.goTab);
  const body = h('div.settings');
  scroller.appendChild(bar);
  scroller.appendChild(body);
  el.appendChild(scroller);

  let device = '';
  deviceInfo()
    .then((d) => {
      device = [d.modelName, d.firmwareVersion, d.sdkVersion ? 'webOS ' + d.sdkVersion : ''].filter(Boolean).join(' · ');
    })
    .catch(() => {});

  function row(label, sub, value, onSelect, extra) {
    return h('div.set-row', { focusable: true, onSelect: onSelect }, [
      h('div.label', null, [label, sub ? h('small', { text: sub }) : null]),
      extra || h('div.value', { text: value || '' }),
    ]);
  }

  function checkForUpdate() {
    toast(t('Procurando atualização...'));
    update
      .check()
      .then((info) => {
        if (!info) return toast(t('Você já tem a versão mais nova.'));
        confirmDialog(
          t('Atualização disponível ({date}): {msg}', { date: shortDate(info.date), msg: info.message || '' }),
          t('Atualizar agora'),
          () => {
            toast(t('Atualizando... o app vai recarregar.'), 60000);
            update.apply(info).then((ok) => {
              if (!ok) toast(t('A atualização ainda está chegando. Tente de novo em alguns minutos.'), 6000);
            });
          }
        );
      })
      .catch((e) => toast(t('Não foi possível verificar: {msg}', { msg: e.message }), 5000));
  }

  function shortDate(iso) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  }

  function installFromUrl(url, name) {
    if (!stremio.isLoggedIn()) return toast(t('Entre na conta primeiro'));
    confirmDialog(t('Instalar {name} na sua conta Stremio?', { name: name }), t('Instalar'), () => {
      toast(t('Instalando...'));
      stremio
        .installAddon(url)
        .then((m) => addons.load(true).then(() => m))
        .then((m) => {
          router.dropTab('home');
          toast(t('{name} instalado na sua conta', { name: m.name || 'Addon' }));
          render();
        })
        .catch((e) => toast(t('Não foi possível instalar: {msg}', { msg: e.message }), 5000));
    });
  }

  function toggle(on) {
    return h('div.toggle', { cls: on ? 'on' : '' }, h('i'));
  }

  let page = 'main';

  function keyInput(title, sub, key, placeholder) {
    const s = store.settings();
    const input = h('input.input', { type: 'text', value: s[key] || '', placeholder: placeholder });
    input.__submit = (v) => {
      const patch = {};
      patch[key] = v.trim();
      store.saveSettings(patch);
      toast(v.trim() ? t('Chave salva') : t('Chave removida'));
      render();
    };
    return h('div.set-row', { focusable: true, onSelect: () => nav.select(input) }, [h('div.label', null, [title, h('small', { text: sub })]), input]);
  }

  function goMain() {
    page = 'main';
    render();
    scroller.scrollTop = 0;
  }

  function pageHeader(title) {
    body.appendChild(row('‹ ' + t('Voltar'), '', '', () => goMain()));
    body.appendChild(h('div.set-section', { text: title }));
  }

  function accountCard(p) {
    const name = p === 'trakt' ? 'Trakt' : 'Simkl';
    const acc = tracker.account(p);
    const on = tracker.isConnected(p);
    const state = on ? (acc && acc.user ? t('Conectado: {user}', { user: acc.user }) : t('Conectado')) : tracker.needsReconnect(p) ? t('Reconectar') : t('Desconectado');
    const sub = p === 'trakt' ? t('Sincroniza assistidos, progresso e Continuar assistindo com o Trakt') : t('Sincroniza assistidos e progresso com o Simkl');
    const card = row(name, sub, state, () => {
      if (on) {
        menu(name, [{ label: t('Sincronizar agora'), value: 'sync' }, { label: t('Desconectar'), value: 'off' }], {
          onPick: (v) => {
            if (v === 'sync') {
              toast(t('Sincronizando...'));
              tracker.syncNow().then(() => {
                router.dropTab('home');
                toast(t('Sincronizado'));
              });
            } else {
              tracker.disconnect(p);
              toast(t('{name} desconectado', { name: name }));
              render();
            }
          },
        });
        return;
      }
      if (!tracker.hasKeys(p)) return toast(p === 'trakt' ? t('Preencha o Client ID e o Client Secret do Trakt abaixo.') : t('Preencha o Client ID do Simkl abaixo.'), 5000);
      openTrackLink(p, () => render());
    });
    card.classList.add('acct-card', 'acct-' + p);
    if (on) card.classList.add('acct-on');
    return card;
  }

  function renderTracking(s) {
    pageHeader(t('Rastreamento (Trakt e Simkl)'));
    body.appendChild(h('div.set-section', { text: t('Contas conectadas') }));
    tracker.PROVIDERS.forEach((p) => body.appendChild(accountCard(p)));
    body.appendChild(keyInput(t('Trakt Client ID'), t('Crie um app grátis em trakt.tv/oauth/applications (Redirect: urn:ietf:wg:oauth:2.0:oob)'), 'traktClientId', 'Client ID'));
    body.appendChild(keyInput(t('Trakt Client Secret'), t('Do mesmo app do Trakt'), 'traktClientSecret', 'Client Secret'));
    body.appendChild(keyInput(t('Simkl Client ID'), t('Crie um app grátis em simkl.com/settings/developer'), 'simklClientId', 'Client ID'));

    body.appendChild(h('div.set-section', { text: t('Fontes') }));
    const SRC = [
      { id: 'both', label: t('Trakt e Simkl') },
      { id: 'trakt', label: 'Trakt' },
      { id: 'simkl', label: 'Simkl' },
    ];
    const srcRow = (title, sub, key) => {
      const cur = SRC.find((x) => x.id === s[key]) || SRC[0];
      body.appendChild(
        row(title, sub, cur.label, () =>
          menu(title, SRC.map((x) => ({ label: x.label, value: x.id, checked: x.id === cur.id })), {
            onPick: (v) => {
              const patch = {};
              patch[key] = v;
              store.saveSettings(patch);
              render();
            },
          })
        )
      );
    };
    srcRow(t('Fonte da biblioteca'), t('De onde vêm os assistidos e o Continuar assistindo'), 'librarySource');
    srcRow(t('Fonte do progresso'), t('Para onde o progresso de reprodução é enviado'), 'progressSource');

    body.appendChild(h('div.set-section', { text: t('Recursos do Trakt') }));
    body.appendChild(
      row(t('Sincronizar agora'), t('Atualiza assistidos e Continuar assistindo'), '', () => {
        if (!tracker.connected().length) return toast(t('Conecte uma conta primeiro'));
        toast(t('Sincronizando...'));
        tracker.syncNow().then(() => {
          router.dropTab('home');
          toast(t('Sincronizado'));
        });
      })
    );
  }

  function renderSkip(s) {
    pageHeader(t('Pular trechos'));
    const flip = (title, sub, on, apply) =>
      body.appendChild(
        row(title, sub, '', () => {
          apply(!on);
          render();
        }, toggle(on))
      );
    const skipOn = s.skipMode !== 'off';
    flip(t('Pular abertura'), t('IntroDB (séries e filmes) — introdb.app'), skipOn, (v) => store.saveSettings({ skipMode: v ? (s.skipAuto === false ? 'prompt' : 'auto') : 'off' }));
    if (skipOn) {
      flip(t('Pular automaticamente'), t('Desligado: mostra o botão "Pular"'), s.skipMode === 'auto', (v) => store.saveSettings({ skipMode: v ? 'auto' : 'prompt', skipAuto: v }));
    }
    body.appendChild(h('div.set-section', { text: t('Animes') }));
    flip(t('Anime Skip'), t('Anime-Skip (anime-skip.com) e AniSkip: abertura e encerramento de animes'), s.animeSkip !== false, (v) => store.saveSettings({ animeSkip: v }));
    body.appendChild(keyInput(t('AnimeSkip Client ID'), t('Sua chave do anime-skip.com (fica só nesta TV)'), 'animeSkipClientId', 'Client ID'));
  }

  function renderDebrid(s) {
    pageHeader(t('Debrid'));
    body.appendChild(h('div.hint', { style: { padding: '0 4px 14px' }, text: t('Toca fontes torrent pela sua conta debrid, sem o servidor do PC. Cada um usa a própria chave, que fica só nesta TV.') }));
    const act = debrid.active();
    const anyKey = debrid.PROVIDERS.some((p) => (s[p.key] || '').trim());
    body.appendChild(
      row(t('Usar debrid'), anyKey ? (act ? t('Usando {name}', { name: act.name }) : t('Desligado')) : t('Preencha uma chave abaixo'), '', () => {
        store.saveSettings({ debridEnabled: s.debridEnabled === false });
        render();
      }, toggle(anyKey && s.debridEnabled !== false))
    );
    const cur = debrid.PROVIDERS.find((p) => p.id === s.debridProvider) || debrid.PROVIDERS[0];
    body.appendChild(
      row(t('Serviço preferido'), t('Usado quando há mais de uma chave'), cur.name, () =>
        menu(t('Serviço preferido'), debrid.PROVIDERS.map((p) => ({ label: p.name, value: p.id, checked: p.id === cur.id })), {
          onPick: (v) => {
            store.saveSettings({ debridProvider: v });
            render();
          },
        })
      )
    );
    body.appendChild(h('div.set-section', { text: t('Chaves de API') }));
    debrid.PROVIDERS.forEach((p) => {
      body.appendChild(keyInput(p.name, t('Sua chave de API em {site}', { site: p.site }), p.key, 'API key'));
      if ((s[p.key] || '').trim())
        body.appendChild(
          row(t('Testar {name}', { name: p.name }), '', '', () => {
            toast(t('Testando...'));
            debrid
              .testKey(p.id, s[p.key].trim())
              .then((who) => toast(t('{name} OK: {user}', { name: p.name, user: who }), 5000))
              .catch((e) => toast(t('{name} recusou a chave: {msg}', { name: p.name, msg: e.message }), 6000));
          })
        );
    });
  }

  function renderHomePage(s) {
    pageHeader(t('Tela inicial'));
    const cur = CW_SORTS.find((x) => x.id === s.cwSort) || CW_SORTS[0];
    body.appendChild(
      row(t('Ordem do Continuar assistindo'), '', t(cur.label), () =>
        menu(t('Ordem do Continuar assistindo'), CW_SORTS.map((x) => ({ label: t(x.label), value: x.id, checked: x.id === cur.id })), {
          onPick: (v) => {
            store.saveSettings({ cwSort: v });
            router.dropTab('home');
            render();
          },
        })
      )
    );

    // ---- MDBList lists as rows ----
    body.appendChild(h('div.set-section', { text: t('Listas do MDBList') }));
    if (!mdblistRows.hasKey()) {
      body.appendChild(h('div.hint', { style: { padding: '0 4px 10px' }, text: t('Coloque sua chave MDBList em Ajustes → Metadados extras para usar listas.') }));
    } else {
      const saveRows = (list) => {
        mdblistRows.setRows(list);
        router.dropTab('home');
        render();
      };
      body.appendChild(
        row(t('Minhas listas'), t('Escolha quais das suas listas aparecem na tela inicial'), '', () => {
          toast(t('Carregando...'));
          mdblistRows
            .myLists()
            .then((lists) => {
              const chosen = mdblistRows.rows();
              menu(t('Minhas listas'), lists.map((l) => ({ label: l.name, sub: t('{n} títulos', { n: l.items }), value: l, checked: chosen.some((c) => c.id === l.id) })), {
                empty: t('Você ainda não tem listas no MDBList.'),
                onPick: (l) => {
                  const cur2 = mdblistRows.rows();
                  const on = cur2.some((c) => c.id === l.id);
                  saveRows(on ? cur2.filter((c) => c.id !== l.id) : cur2.concat([{ id: l.id, name: l.name }]));
                },
              });
            })
            .catch((e) => toast(t('Erro: {msg}', { msg: e.message }), 5000));
        })
      );
      body.appendChild(
        row(t('Adicionar lista pública'), t('Ex.: usuario/nome-da-lista ou o link do mdblist.com'), '', () =>
          promptText(t('Adicionar lista pública'), '', 'user/list', (text) =>
            mdblistRows
              .findList(text)
              .then((l) => {
                const cur2 = mdblistRows.rows();
                if (!cur2.some((c) => c.id === l.id)) saveRows(cur2.concat([l]));
                toast(t('Lista "{name}" adicionada', { name: l.name }));
              })
              .catch(() => toast(t('Lista não encontrada'), 5000))
          )
        )
      );
    }

    // ---- Rows: order and hidden ----
    body.appendChild(h('div.set-section', { text: t('Fileiras') }));
    body.appendChild(h('div.hint', { style: { padding: '0 4px 10px' }, text: t('OK numa fileira: subir, descer ou esconder.') }));
    const all = addons.boardCatalogs().concat(mdblistRows.boardEntries());
    homeRows.sort(all).forEach((e) => {
      const hidden = homeRows.isHidden(e);
      const name = e.catalog.name || e.catalog.id;
      const kind = e.fetch ? '' : ({ movie: t('Filmes'), series: t('Séries'), anime: t('Animes') }[e.catalog.type] || e.catalog.type) + ' · ';
      body.appendChild(
        row((hidden ? '⊘ ' : '') + name, kind + (e.addon.manifest.name || ''), hidden ? t('Escondida') : t('Visível'), () =>
          menu(name, [
            { label: '▲ ' + t('Subir'), value: -1 },
            { label: '▼ ' + t('Descer'), value: 1 },
            { label: hidden ? t('Mostrar') : t('Esconder'), value: 0 },
          ], {
            onPick: (v) => {
              if (v === 0) homeRows.toggleHidden(e);
              else homeRows.move(all, e, v);
              router.dropTab('home');
              render();
            },
          })
        )
      );
    });
    body.appendChild(
      row(t('Restaurar ordem padrão'), '', '', () => {
        homeRows.reset();
        router.dropTab('home');
        toast(t('Ordem padrão restaurada'));
        render();
      })
    );
  }

  function renderBadges(s) {
    pageHeader(t('Selos das fontes'));
    const cur = badges.streamBadgeSettings();
    badges.KINDS.forEach((k) =>
      body.appendChild(
        row(t(k.label), '', '', () => {
          badges.setBadge(k.id, !cur[k.id]);
          render();
        }, toggle(cur[k.id]))
      )
    );
  }

  // Draft for the media server login (the password is never saved).
  const msDraft = { providerId: 'jellyfin', address: '', user: '', pass: '' };

  function draftInput(title, sub, field, placeholder, type) {
    const input = h('input.input', { type: type || 'text', value: msDraft[field], placeholder: placeholder });
    input.__submit = (v) => {
      msDraft[field] = v.trim();
      render();
    };
    return h('div.set-row', { focusable: true, onSelect: () => nav.select(input) }, [h('div.label', null, [title, sub ? h('small', { text: sub }) : null]), input]);
  }

  function renderServers(s) {
    pageHeader(t('Servidores de mídia (Jellyfin e Emby)'));
    body.appendChild(h('div.hint', { style: { padding: '0 4px 14px' }, text: t('Os filmes e séries do seu servidor aparecem como fonte, junto com os addons.') }));
    const c = mediaserver.connection();
    if (c) {
      const kindName = (mediaserver.KINDS.find((k) => k.id === c.providerId) || {}).name || '';
      const card = row(c.name, kindName + ' · ' + c.address, t('Conectado: {user}', { user: c.user }), () =>
        menu(c.name, [{ label: t('Desconectar'), value: 'off' }], {
          onPick: () => {
            mediaserver.disconnect();
            router.dropTab('home');
            toast(t('{name} desconectado', { name: c.name }));
            render();
          },
        })
      );
      card.classList.add('acct-card');
      if (s.mediaServerEnabled !== false) card.classList.add('acct-on');
      body.appendChild(card);
      body.appendChild(
        row(t('Mostrar como fonte'), t('Lista os arquivos do servidor nas fontes'), '', () => {
          store.saveSettings({ mediaServerEnabled: s.mediaServerEnabled === false });
          render();
        }, toggle(s.mediaServerEnabled !== false))
      );
      return;
    }
    const kind = mediaserver.KINDS.find((k) => k.id === msDraft.providerId) || mediaserver.KINDS[0];
    body.appendChild(
      row(t('Tipo de servidor'), '', kind.name, () =>
        menu(t('Tipo de servidor'), mediaserver.KINDS.map((k) => ({ label: k.name, value: k.id, checked: k.id === kind.id })), {
          onPick: (v) => {
            msDraft.providerId = v;
            render();
          },
        })
      )
    );
    body.appendChild(draftInput(t('Endereço do servidor'), t('Ex.: 192.168.0.20:8096'), 'address', 'http://IP:8096'));
    body.appendChild(draftInput(t('Usuário'), '', 'user', t('Usuário')));
    body.appendChild(draftInput(t('Senha'), t('Usada só para entrar; não fica salva'), 'pass', '••••', 'password'));
    body.appendChild(
      row(t('Conectar'), '', '', () => {
        if (!msDraft.address || !msDraft.user) return toast(t('Preencha o endereço e o usuário'));
        toast(t('Conectando...'));
        mediaserver
          .connect(msDraft.providerId, msDraft.address, msDraft.user, msDraft.pass)
          .then((conn) => {
            msDraft.pass = '';
            router.dropTab('home');
            toast(t('Conectado a {name}', { name: conn.name }));
            render();
          })
          .catch((e) => toast(t('Não foi possível conectar: {msg}', { msg: e.message }), 6000));
      })
    );
  }

  function render() {
    const s = store.settings();
    const keep = nav.current();
    const keepIndex = keep ? Array.prototype.indexOf.call(body.querySelectorAll('.set-row'), keep) : -1;
    clear(body);
    if (page !== 'main') {
      if (page === 'tracking') renderTracking(s);
      else if (page === 'debrid') renderDebrid(s);
      else if (page === 'servers') renderServers(s);
      else if (page === 'home') renderHomePage(s);
      else if (page === 'badges') renderBadges(s);
      else renderSkip(s);
      const sub = body.querySelectorAll('.set-row');
      if (keepIndex >= 0 && sub[keepIndex]) nav.focus(sub[keepIndex]);
      else if (sub[0]) nav.focus(sub[0]);
      return;
    }

    // ---- Idioma do app (vale para a TV inteira; o nome fica bilíngue para quem não lê o atual) ----
    const LANGS = [
      { id: 'auto', label: t('Automático (idioma da TV)') },
      { id: 'en', label: 'English' },
      { id: 'ar', label: 'العربية' },
    ];
    body.appendChild(h('div.set-section', { text: 'Language / اللغة' }));
    body.appendChild(
      row('Language / اللغة', '', (LANGS.find((l) => l.id === s.language) || LANGS[0]).label, () =>
        menu('Language / اللغة', LANGS.map((l) => ({ label: l.label, value: l.id, checked: l.id === s.language })), {
          onPick: (v) => {
            if (v === s.language) return;
            store.saveSettings({ language: v });
            window.location.reload(); // recarrega para todas as telas mudarem de idioma
          },
        })
      )
    );

    // ---- Perfil (cada perfil tem sua conta Stremio, histórico e preferências) ----
    const prof = store.activeProfile();
    const allProfiles = store.profiles();
    body.appendChild(h('div.set-section', { text: t('Perfil') }));
    const nameInput = h('input.input', { type: 'text', value: prof.name });
    nameInput.__submit = (v) => {
      const name = v.trim();
      if (!name) return;
      store.updateProfile(prof.id, { name: name });
      refreshProfileChips();
      toast(t('Nome do perfil salvo'));
      render();
    };
    body.appendChild(
      h('div.set-row', { focusable: true, onSelect: () => nav.select(nameInput) }, [
        h('div.label', null, [avatar(prof, 'small'), ' ' + t('Nome do perfil'), h('small', { text: t('Este perfil usa a conta Stremio abaixo') })]),
        nameInput,
      ])
    );
    body.appendChild(
      row(t('Cor do perfil'), '', '', () =>
        menu(
          t('Cor do perfil'),
          store.COLORS.map((c, i) => ({ label: [t('Roxo'), t('Rosa'), t('Verde-água'), t('Laranja'), t('Azul'), t('Vermelho'), t('Verde'), t('Cinza')][i], value: c, checked: c === prof.color })),
          {
            onPick: (c) => {
              store.updateProfile(prof.id, { color: c });
              refreshProfileChips();
              render();
            },
          }
        ),
        h('div.avatar.small', { style: { backgroundColor: prof.color }, text: ' ' })
      )
    );
    if (allProfiles.length > 1) {
      body.appendChild(
        row(t('Trocar de perfil'), t('{n} perfis nesta TV', { n: allProfiles.length }), '', () =>
          menu(
            t('Trocar de perfil'),
            allProfiles.map((p) => ({ label: p.name, value: p.id, checked: p.id === prof.id })),
            { onPick: (id) => id !== prof.id && switchProfile(id) }
          )
        )
      );
    }
    body.appendChild(row(t('Adicionar perfil'), t('Para outra pessoa, com outra conta Stremio'), '', () => createProfile()));
    if (allProfiles.length > 1) {
      body.appendChild(
        row(t('Copiar ajustes de outro perfil'), t('Legendas, aparência, tela inicial e coleções (a conta não é copiada)'), '', () =>
          menu(t('Copiar ajustes de'), allProfiles.filter((p) => p.id !== prof.id).map((p) => ({ label: p.name, value: p.id })), {
            onPick: (id) => {
              const from = allProfiles.find((p) => p.id === id);
              confirmDialog(t('Trocar os ajustes de "{to}" pelos de "{from}"?', { to: prof.name, from: from.name }), t('Copiar'), () => {
                store.copySettingsFrom(id);
                theme.apply(store.settings().theme);
                document.body.classList.toggle('oled', !!store.settings().oled);
                router.dropTab('home');
                toast(t('Ajustes copiados de {name}', { name: from.name }));
                render();
              });
            },
          })
        )
      );
    }
    if (allProfiles.length > 1) {
      body.appendChild(
        row(t('Perguntar "Quem está assistindo?" ao abrir'), '', '', () => {
          store.saveSettings({ askProfile: !store.settings().askProfile });
          render();
        }, toggle(s.askProfile))
      );
      body.appendChild(
        row(t('Apagar este perfil'), t('Remove deste aparelho a conta e as preferências do perfil (a conta Stremio continua existindo)'), '', () =>
          confirmDialog(t('Apagar o perfil "{name}" desta TV?', { name: prof.name }), t('Apagar'), () => {
            store.removeProfile(prof.id);
            switchProfile(store.activeProfile().id);
          })
        )
      );
    }

    body.appendChild(h('div.set-section', { text: t('Conta Stremio') }));
    if (stremio.isLoggedIn()) {
      const u = stremio.user();
      body.appendChild(row(t('Conectado'), t('Addons e biblioteca sincronizados com a conta'), (u && u.email) || t('conta Stremio'), null));
      body.appendChild(
        row(t('Atualizar addons e biblioteca'), t('Busca de novo a lista de addons instalados'), '', () => {
          Promise.all([addons.load(true), stremio.getLibrary()])
            .then(() => {
              toast(t('Atualizado'));
              router.dropTab('home');
            })
            .catch((e) => toast(t('Erro: {msg}', { msg: e.message })));
        })
      );
      body.appendChild(
        row(t('Sair da conta'), '', '', () =>
          confirmDialog(t('Sair da conta Stremio?'), t('Sair'), () => {
            stremio.logout();
            addons.load(true).then(() => {
              router.dropTab('home');
              render();
            });
          })
        )
      );
    } else {
      body.appendChild(
        row(t('Entrar na conta'), t('Traz seus addons (Torrentio, debrid...) e a biblioteca'), '', () =>
          openLogin(() => {
            Promise.all([stremio.refreshUser().catch(() => {}), addons.load(true), stremio.getLibrary()]).then(() => {
              router.dropTab('home');
              render();
            });
          })
        )
      );
    }

    // ---- Phone remote: QR code that opens the remote page with the PIN already filled in ----
    body.appendChild(h('div.set-section', { text: t('Controle pelo celular') }));
    const phoneBox = h('div.set-row.phone-remote', { focusable: true }, h('div.phone-sub', { text: t('Carregando...') }));
    body.appendChild(phoneBox);
    phone.info().then((i) => {
      clear(phoneBox);
      if (!i) {
        phoneBox.appendChild(h('div.phone-sub', { text: t('O controle pelo celular não está rodando. Feche o app e abra de novo pelo TizenBrew.') }));
        return;
      }
      phoneBox.appendChild(h('img.phone-qr', { src: phone.qrImage(i.url, 300), alt: '' }));
      phoneBox.appendChild(
        h('div.phone-text', null, [
          h('div.phone-title', { text: t('Aponte a câmera do celular para o código') }),
          h('div.phone-sub', { text: t('Ou abra no navegador do celular (mesmo Wi-Fi):') }),
          h('div.phone-url', { text: 'http://' + i.ip + ':' + i.port }),
          h('div.phone-sub', { text: t('PIN: {pin}', { pin: i.pin }) }),
        ])
      );
    });

    body.appendChild(h('div.set-section', { text: t('Servidor de streaming (PC)') }));
    const st = server.lastStatus();
    const stText = !s.serverUrl ? t('não configurado') : st.ok && st.url === server.baseUrl() ? t('conectado ✓') : t('sem resposta');
    const urlInput = h('input.input', { type: 'text', value: s.serverUrl || '', placeholder: 'ex.: 192.168.0.10' });
    urlInput.__submit = (v) => {
      store.saveSettings({ serverUrl: v.trim() });
      server.check().then((r) => {
        toast(r.ok ? t('Servidor conectado') : t('Servidor não respondeu em {url}', { url: server.baseUrl() }));
        render();
      });
    };
    body.appendChild(
      h('div.set-row', { focusable: true, onSelect: () => nav.select(urlInput) }, [
        h('div.label', null, [t('Endereço do PC'), h('small', { text: t('Rode o stremio-service no PC (porta 11470). Status: {s}', { s: stText }) })]),
        urlInput,
      ])
    );
    body.appendChild(
      row(t('Procurar na rede'), t('Varre a rede local atrás do servidor'), '', () => {
        toast(t('Procurando servidor na rede...'), 20000);
        server
          .scan()
          .then((ip) => {
            if (!ip) return toast(t('Nenhum servidor encontrado. Ele está aberto no PC?'));
            store.saveSettings({ serverUrl: ip });
            return server.check().then(() => {
              toast(t('Servidor encontrado em {ip}', { ip: ip }));
              render();
            });
          })
          .catch((e) => toast(t('Falha na busca: {msg}', { msg: e.message })));
      })
    );
    body.appendChild(
      row(t('Testar conexão'), '', '', () =>
        server.check().then((r) => {
          toast(r.ok ? t('Servidor OK') + (r.version ? ' (v' + r.version + ')' : '') : t('Sem resposta de {url}', { url: server.baseUrl() || '-' }));
          render();
        })
      )
    );

    body.appendChild(h('div.set-section', { text: t('Aparência (Kai)') }));
    const heroName = t((hero.SOURCES.find((x) => x.id === s.heroSource) || hero.SOURCES[0]).name);
    body.appendChild(
      row(t('Hero Banner'), t('Destaques no topo da tela inicial'), heroName, () =>
        menu(
          t('Fonte do Hero Banner'),
          hero.SOURCES.map((x) => ({ label: t(x.name), value: x.id, checked: x.id === s.heroSource })),
          {
            onPick: (v) => {
              store.saveSettings({ heroSource: v });
              router.dropTab('home');
              render();
            },
          }
        )
      )
    );
    const curTheme = theme.THEMES.find((x) => x.id === s.theme) || theme.THEMES[0];
    body.appendChild(
      row(t('Tema de cores'), t('Cor de destaque do app'), t(curTheme.label), () =>
        menu(
          t('Tema de cores'),
          theme.THEMES.map((x) => ({ label: t(x.label), value: x.id, checked: x.id === curTheme.id })),
          {
            onPick: (v) => {
              store.saveSettings({ theme: v });
              theme.apply(v);
              render();
            },
          }
        )
      )
    );
    body.appendChild(
      row(t('Tela inicial'), t('Ordem das fileiras, listas do MDBList e Continuar assistindo'), '', () => {
        page = 'home';
        render();
        scroller.scrollTop = 0;
      })
    );
    body.appendChild(
      row(t('Modo ambiente'), t('O trailer toca sem som atrás do Hero Banner (mais pesado na TV)'), '', () => {
        store.saveSettings({ ambientMode: !store.settings().ambientMode });
        router.dropTab('home');
        render();
      }, toggle(!!s.ambientMode))
    );
    body.appendChild(
      row(t('Tema OLED (preto puro)'), t('Fundo totalmente preto'), '', () => {
        const on = !store.settings().oled;
        store.saveSettings({ oled: on });
        document.body.classList.toggle('oled', on);
        render();
      }, toggle(s.oled))
    );
    body.appendChild(
      row(t('Escolha inteligente'), t('Assistir já toca a melhor fonte; o botão Fontes mostra a lista'), '', () => {
        store.saveSettings({ smartChoice: store.settings().smartChoice === false });
        render();
      }, toggle(s.smartChoice !== false))
    );
    body.appendChild(
      row(t('Modo desempenho'), t('Mais rápido na TV: sem animações, sem Novos episódios e sem sincronizar em segundo plano'), '', () => {
        const on = store.settings().perfMode === false;
        store.saveSettings({ perfMode: on });
        document.body.classList.toggle('perf', on);
        router.dropTab('home'); // rebuilt with or without the extras
        render();
      }, toggle(store.settings().perfMode !== false))
    );
    body.appendChild(
      row(t('Rolagem animada'), t('Mais bonita, porém mais pesada na TV'), '', () => {
        const on = !store.settings().smoothScroll;
        store.saveSettings({ smoothScroll: on });
        nav.setSmooth(on);
        render();
      }, toggle(s.smoothScroll))
    );

    body.appendChild(h('div.set-section', { text: t('Legendas e áudio') }));
    const subName = (SUB_LANGS.find((x) => JSON.stringify(x.value) === JSON.stringify(s.subtitleLangs)) || { label: (s.subtitleLangs || []).join(', ') }).label;
    body.appendChild(
      row(t('Idioma da legenda'), t('Escolhida sozinha ao abrir o vídeo'), t(subName), () =>
        menu(t('Idioma da legenda'), SUB_LANGS.map((x) => ({ label: t(x.label), value: x.value, checked: x.label === subName })), {
          onPick: (v) => {
            store.saveSettings({ subtitleLangs: v });
            render();
          },
        })
      )
    );
    body.appendChild(
      row(t('Ligar legenda automaticamente'), t('Se o áudio não estiver no seu idioma'), '', () => {
        store.saveSettings({ subtitlesAuto: !store.settings().subtitlesAuto });
        render();
      }, toggle(s.subtitlesAuto))
    );
    const audName = (AUDIO_LANGS.find((x) => JSON.stringify(x.value) === JSON.stringify(s.audioLangs)) || AUDIO_LANGS[0]).label;
    body.appendChild(
      row(t('Áudio preferido'), avvideo.available() && s.playerEngine !== 'html5' ? t('Escolhido sozinho ao abrir o vídeo') : t('Precisa do servidor do PC para ler as faixas'), t(audName), () =>
        menu(t('Áudio preferido'), AUDIO_LANGS.map((x) => ({ label: t(x.label), value: x.value, checked: x.label === audName })), {
          onPick: (v) => {
            store.saveSettings({ audioLangs: v });
            render();
          },
        })
      )
    );

    // ---- Aparência da legenda (padrão Kai: Nata Sans, negrito, contorno fino + sombra) ----
    body.appendChild(h('div.set-section', { text: t('Aparência da legenda') }));
    const preview = h('div.subs', null, h('span', { html: t('Oi. Meu nome é Peter Parker.') + '\n<i>' + t('Você não lembra de mim...') + '</i>' }));
    substyle.apply(preview, s);
    body.appendChild(h('div.sub-preview', null, preview));
    const lb = substyle.labels(s);
    const choose = (title, sub, list, key, value, label) =>
      body.appendChild(
        row(title, sub, t(String(label)), () =>
          menu(title, list.map((x) => ({ label: t(String(x.label)), value: x.id, checked: x.id === value })), {
            onPick: (v) => {
              const patch = {};
              patch[key] = v;
              store.saveSettings(patch);
              render();
            },
          })
        )
      );
    choose(t('Fonte'), t('Vale para legendas de addons (OpenSubtitles etc.)'), substyle.FONTS, 'subtitleFont', s.subtitleFont, lb.font);
    choose(t('Estilo'), t('Contorno, sombra ou caixa de fundo'), substyle.STYLES, 'subtitleStyle', s.subtitleStyle, lb.style);
    choose(t('Cor do texto'), '', substyle.COLORS, 'subtitleColor', s.subtitleColor, lb.color);
    choose(
      t('Tamanho'),
      '',
      substyle.SIZES.map((v) => ({ id: v, label: v + '%' })),
      'subtitleSize',
      s.subtitleSize || 100,
      (s.subtitleSize || 100) + '%'
    );
    choose(t('Posição'), t('Distância da borda de baixo'), substyle.POSITIONS, 'subtitlePosition', s.subtitlePosition, lb.position);
    body.appendChild(
      row(t('Negrito'), t('O Kai usa negrito'), '', () => {
        store.saveSettings({ subtitleBold: store.settings().subtitleBold === false });
        render();
      }, toggle(s.subtitleBold !== false))
    );
    body.appendChild(
      h('div.hint', { style: { padding: '6px 4px 0' }, text: t('Legendas embutidas no arquivo são desenhadas pela própria TV: só cor, tamanho, posição e caixa se aplicam a elas.') })
    );

    // ---- Player ----
    body.appendChild(h('div.set-section', { text: t('Player') }));
    choose(
      t('Player de vídeo'),
      t('O player da Samsung troca a faixa de áudio; o do navegador é o antigo'),
      [
        { id: 'auto', label: avvideo.available() ? t('Samsung (AVPlay)') : t('Samsung (AVPlay) · indisponível nesta TV') },
        { id: 'html5', label: t('Navegador (HTML5)') },
      ],
      'playerEngine',
      s.playerEngine === 'html5' ? 'html5' : 'auto',
      s.playerEngine === 'html5' ? t('Navegador (HTML5)') : t('Samsung (AVPlay)')
    );

    body.appendChild(
      row(t('Sugestões no fim'), t('Ao terminar um filme, mostra "Mais como este"'), '', () => {
        store.saveSettings({ postPlay: store.settings().postPlay === false });
        render();
      }, toggle(s.postPlay !== false))
    );
    body.appendChild(
      row(t('Selos das fontes'), t('Qualidade, HDR, áudio, idioma, tamanho...'), '', () => {
        page = 'badges';
        render();
        scroller.scrollTop = 0;
      })
    );

    // ---- Tracking and skip segments live on their own pages ----
    body.appendChild(h('div.set-section', { text: t('Integrações') }));
    body.appendChild(
      row(t('Rastreamento (Trakt e Simkl)'), t('Contas, fontes e recursos do Trakt'), tracker.connected().length ? t('Conectado') : t('Desconectado'), () => {
        page = 'tracking';
        render();
        scroller.scrollTop = 0;
      })
    );
    body.appendChild(
      row(t('Pular trechos'), t('Abertura, recapitulação e encerramento'), s.skipMode === 'off' ? t('Desligado') : t('Ligado'), () => {
        page = 'skip';
        render();
        scroller.scrollTop = 0;
      })
    );

    body.appendChild(
      row(t('Debrid'), 'Real-Debrid · TorBox · Premiumize', debrid.active() ? debrid.active().name : t('Desligado'), () => {
        page = 'debrid';
        render();
        scroller.scrollTop = 0;
      })
    );
    body.appendChild(
      row(t('Servidores de mídia (Jellyfin e Emby)'), t('Seu próprio servidor como fonte'), mediaserver.enabled() ? mediaserver.connection().name : t('Desconectado'), () => {
        page = 'servers';
        render();
        scroller.scrollTop = 0;
      })
    );

    // ---- Metadados (opcional, como no Kai) ----
    body.appendChild(h('div.set-section', { text: t('Metadados extras (opcional)') }));
    const keyRow = (title, sub, key, placeholder) => {
      const input = h('input.input', { type: 'text', value: s[key] || '', placeholder: placeholder });
      input.__submit = (v) => {
        const patch = {};
        patch[key] = v.trim();
        store.saveSettings(patch);
        toast(v.trim() ? t('Chave salva') : t('Chave removida'));
        render();
      };
      body.appendChild(
        h('div.set-row', { focusable: true, onSelect: () => nav.select(input) }, [
          h('div.label', null, [title, h('small', { text: sub })]),
          input,
        ])
      );
    };
    keyRow(t('Chave TMDB'), t('Descrições em árabe, perfis de atores, calendário de filmes, logos e elenco com fotos (grátis em themoviedb.org)'), 'tmdbKey', 'API key (v3)');
    keyRow(t('Chave MDBList'), t('Notas do Rotten Tomatoes, Metacritic, Trakt e Letterboxd (grátis em mdblist.com)'), 'mdblistKey', 'API key');
    keyRow(t('Chave RPDB'), t('Pôsteres com as notas desenhadas (ratingposterdb.com)'), 'rpdbKey', 'API key');
    body.appendChild(
      row(t('Guia para os pais'), t('Violência, palavrões e cenas fortes na página do título (IMDb via tiffara.com)'), '', () => {
        store.saveSettings({ parentalGuide: !store.settings().parentalGuide });
        render();
      }, toggle(!!s.parentalGuide))
    );

    body.appendChild(h('div.set-section', { text: t('Addons') }));
    const list = addons.list();
    body.appendChild(
      row(t('Addons ativos'), stremio.isLoggedIn() ? t('Gerencie pela sua conta em web.stremio.com') : t('Sem conta: Cinemeta, OpenSubtitles e os adicionados aqui'), t('{n} addon(s)', { n: list.length }), () =>
        menu(t('Addons ativos'), list.map((a) => ({ label: a.manifest.name || a.manifest.id, sub: a.transportUrl })), {})
      )
    );
    // Addons recomendados (só aparecem se ainda não estiverem instalados).
    RECOMMENDED.filter((r) => !list.some((a) => a.transportUrl === r.url || (a.manifest && a.manifest.id === r.id))).forEach((r) =>
      body.appendChild(row(t('Instalar {name}', { name: r.name }), t(r.desc), '', () => installFromUrl(r.url, r.name)))
    );
    const addInput = h('input.input', { type: 'text', placeholder: 'https://.../manifest.json' });
    addInput.__submit = (v) => {
      const u = v.trim();
      if (!/^https?:\/\/.+manifest\.json/.test(u)) return toast(t('Cole a URL do manifest.json do addon'));
      if (stremio.isLoggedIn()) return installFromUrl(u, t('o addon'));
      const cur = store.settings().localAddons || [];
      store.saveSettings({ localAddons: cur.concat([u]) });
      addons.load(true).then(() => {
        router.dropTab('home');
        toast(t('Addon adicionado'));
        render();
      });
    };
    body.appendChild(
      h('div.set-row', { focusable: true, onSelect: () => nav.select(addInput) }, [
        h('div.label', null, [t('Adicionar addon por URL'), h('small', { text: stremio.isLoggedIn() ? t('Instala na sua conta Stremio') : t('Fica só nesta TV') })]),
        addInput,
      ])
    );

    body.appendChild(h('div.set-section', { text: t('Sobre e depuração') }));
    const logInput = h('input.input', { type: 'text', value: s.devlogUrl || '', placeholder: 'http://IP-DO-PC:8099/log' });
    logInput.__submit = (v) => {
      store.saveSettings({ devlogUrl: v.trim() });
      log.setRemote(v.trim());
      log.info(t('Log remoto ligado'));
      toast(v.trim() ? t('Enviando logs para o PC') : t('Log remoto desligado'));
    };
    body.appendChild(
      h('div.set-row', { focusable: true, onSelect: () => nav.select(logInput) }, [
        h('div.label', null, [t('Log remoto'), h('small', { text: t('npm run logs no PC') })]),
        logInput,
      ])
    );
    const netRow = row(t('Testar a internet'), t('Ping e velocidade de download (Cloudflare)'), '', () => {
      const v = netRow.querySelector('.value');
      v.textContent = t('Medindo o ping...');
      speedtest
        .run((step) => (v.textContent = step === 'ping' ? t('Medindo o ping...') : t('Baixando arquivo de teste...')))
        .then((r) => {
          const verdict = r.mbps >= 40 ? t('dá para 4K') : r.mbps >= 15 ? t('bom para 1080p') : r.mbps >= 6 ? t('só 720p com folga') : t('lenta para vídeo');
          v.textContent = r.mbps + ' Mbps · ' + r.pingMs + ' ms';
          toast(t('Internet: {mbps} Mbps, ping {ms} ms ({verdict})', { mbps: r.mbps, ms: r.pingMs, verdict: verdict }), 8000);
        })
        .catch((e) => {
          v.textContent = '';
          toast(t('O teste falhou: {msg}', { msg: e.message }), 5000);
        });
    });
    body.appendChild(netRow);

    body.appendChild(h('div.set-section', { text: t('Atualizações') }));
    body.appendChild(row(t('Versão instalada'), device || 'Stremio Kai', shortDate(update.BUILD), null));
    const latestRow = row(t('Versão mais nova no GitHub'), update.REPO, t('Verificando...'), () => checkForUpdate());
    body.appendChild(latestRow);
    update
      .latest()
      .then((info) => {
        const v = latestRow.querySelector('.value');
        if (!v) return;
        const newer = info.build && info.build !== update.BUILD && Date.parse(info.build) > Date.parse(update.BUILD);
        v.textContent = shortDate(info.date) + (newer ? '  ·  ' + t('nova!') : '  ·  ' + t('em dia'));
        if (info.message) latestRow.querySelector('.label small').textContent = info.message;
      })
      .catch(() => {
        const v = latestRow.querySelector('.value');
        if (v) v.textContent = t('sem conexão');
      });
    body.appendChild(row(t('Procurar atualização'), t('Baixa a versão nova do GitHub ({repo})', { repo: update.REPO }), '', () => checkForUpdate()));

    const rows = body.querySelectorAll('.set-row');
    if (keepIndex >= 0 && rows[keepIndex]) nav.focus(rows[keepIndex]);
  }

  render();

  return {
    el: el,
    onBack: () => {
      if (page === 'main') return false;
      goMain();
      return true;
    },
    onShow: () => {
      server.check().then(() => render());
    },
    destroy: () => bar.__destroy && bar.__destroy(),
  };
}
