// Ponto de entrada do Stremio Kai para webOS.
import './polyfills.js';
import { CollectionsView } from './views/collections.js';
import { MangaView } from './views/manga.js';
import { ComicsView } from './views/comics.js';
import { DiscoverView } from './views/discover.js';
import { LiveView } from './views/live.js';
import * as iptv from './api/iptv.js';
import { addRepoUrl } from './views/sources.js';
import { MoviesView, SeriesView } from './views/typeTab.js';
import { AnimeView } from './views/anime.js';
import { log } from './lib/log.js';
import { t, init as initI18n } from './lib/i18n.js';
import * as nav from './lib/nav.js';
import { loadVisibleImages } from './lib/dom.js';
import * as store from './lib/store.js';
import * as stremio from './api/stremio.js';
import * as server from './api/server.js';
import * as addons from './api/addons.js';
import * as router from './router.js';
import { openDetails } from './views/details.js';
import { HomeView } from './views/home.js';
import { SearchView } from './views/search.js';
import { LibraryView } from './views/library.js';
import { SettingsView } from './views/settings.js';
import { CalendarView } from './views/calendar.js';
import { maybeShowWizard } from './views/wizard.js';
import { openPlayer } from './views/player.js';
import * as update from './api/update.js';
import { toast } from './ui.js';
import * as profiles from './views/profiles.js';
import { openLogin } from './views/login.js';
import { registerTizenKeys } from './lib/platform.js';
import * as phone from './lib/phone.js';
import * as theme from './lib/theme.js';
import * as screensaver from './lib/screensaver.js';
import * as tracker from './api/tracker.js';
import { openTrackLink } from './views/trackLink.js';

function boot() {
  const s = store.settings();
  initI18n(s.language);
  // Default profile names were saved in Portuguese ("Perfil 1"): shown in the app's language.
  store.profiles().forEach((p) => {
    const m = /^Perfil (\d+)$/.exec(p.name || '');
    if (m && t('Perfil {n}', { n: m[1] }) !== p.name) store.updateProfile(p.id, { name: t('Perfil {n}', { n: m[1] }) });
  });
  if (s.devlogUrl) log.setRemote(s.devlogUrl);
  log.info('Iniciando', navigator.userAgent);

  registerTizenKeys();
  // No internet: a calm screen with "Try again" instead of empty rows (idea from Stream Goat).
  const offline = document.createElement('div');
  offline.className = 'offline-screen';
  offline.innerHTML = '<div class="off-ico">⟲</div><div class="off-t"></div><div class="off-s"></div>';
  offline.querySelector('.off-t').textContent = t('Sem internet');
  offline.querySelector('.off-s').textContent = t('Confira o Wi-Fi da TV. O app volta sozinho quando a conexão voltar.');
  document.body.appendChild(offline);
  const netCheck = () => offline.classList.toggle('show', navigator.onLine === false);
  window.addEventListener('offline', netCheck);
  window.addEventListener('online', () => {
    netCheck();
    try {
      const v = router.currentView && router.currentView();
      if (v && v.reload) v.reload();
    } catch (e) {}
  });
  netCheck();
  phone.start();
  screensaver.init();
  // Opened from the phone's Browse tab: the title's page, ready on the episode when there is one.
  phone.onOpen((ev) => {
    router.goTab('home');
    openDetails(ev.kind, ev.item, ev.video ? { videoId: ev.video, autoStreams: true } : {});
  });
  // Keys pasted on the phone's setup page: saved on this TV only. With new Trakt/Simkl keys and no
  // account linked yet, the link screen opens right away (scan its QR, sign in, done).
  phone.onKeys((keys) => {
    // IPTV account and manga repository from the phone: added as sources, not kept as settings.
    if (keys.iptvHost && keys.iptvUser && keys.iptvPass) {
      const host = keys.iptvHost.replace(/\/+$/, '');
      const src = { id: 'x' + Date.now(), type: 'xtream', url: host, user: keys.iptvUser, pass: keys.iptvPass, name: host.replace(/^https?:\/\//, '').split(/[:/]/)[0], format: 'm3u8' };
      iptv.checkXtream(src).then(
        (info) => {
          if (info && info.username) src.name += ' · ' + info.username;
          iptv.saveSource(src);
          router.dropTab('live');
          toast(t('Conta IPTV adicionada. Abra TV ao vivo.'), 6000);
        },
        () => toast(t('Não consegui entrar no IPTV. Confira host, usuário e senha.'), 7000)
      );
    }
    if (keys.mangaRepo) addRepoUrl(keys.mangaRepo, null, 'manga');
    ['iptvHost', 'iptvUser', 'iptvPass', 'mangaRepo'].forEach((k) => delete keys[k]);
    if (!Object.keys(keys).length) return;
    store.saveSettings(keys);
    router.dropTab('settings');
    toast(t('Chaves recebidas do celular: {n}', { n: Object.keys(keys).length }), 5000);
    const want = keys.traktClientId && !tracker.isConnected('trakt') ? 'trakt' : keys.simklClientId && !tracker.isConnected('simkl') ? 'simkl' : null;
    if (want && tracker.hasKeys(want)) openTrackLink(want);
  });
  phone.onSearch((q) => {
    router.goTab('search');
    const view = router.currentView();
    if (view && view.search) view.search(q);
  });
  nav.install();
  // Imagens e fileiras sob demanda depois que a rolagem para (segurar a seta não recalcula a cada passo).
  nav.setSmooth(s.smoothScroll);
  let scrollTimer = null;
  nav.onScroll((node) => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const v = router.currentView();
      loadVisibleImages(v ? v.el : node.closest('.view') || node);
      if (v && v.onScroll) v.onScroll();
    }, 120);
  });

  router.registerTab('home', HomeView);
  router.registerTab('search', SearchView);
  router.registerTab('library', LibraryView);
  router.registerTab('settings', SettingsView);
  router.registerTab('calendar', CalendarView);
  router.registerTab('collections', CollectionsView);
  router.registerTab('anime', AnimeView);
  router.registerTab('manga', MangaView);
  router.registerTab('comics', ComicsView);
  router.registerTab('discover', DiscoverView);
  router.registerTab('live', LiveView);
  router.registerTab('movies', MoviesView);
  router.registerTab('series', SeriesView);

  // "Quem está assistindo?" (com mais de um perfil) antes de carregar a conta.
  if (profiles.needsPicker() && !window.location.search.includes('nopicker')) {
    const bootEl = document.getElementById('boot');
    if (bootEl) bootEl.style.display = 'none';
    profiles.showPicker(() => {
      if (bootEl) bootEl.style.display = '';
      start();
    });
  } else start();

  // Ao voltar do segundo plano, revalida o servidor do PC.
  document.addEventListener('webOSRelaunch', () => {
    server.check();
    devLaunch();
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) server.check();
  });
}

// Carrega o perfil escolhido: conta, biblioteca, addons e a tela inicial.
function start() {
  stremio.reloadProfile();
  let s = store.settings();
  // Navy blue is the main look now: everyone gets it once (black stays one tap away in Appearance → Theme).
  if (!s.navyLook1) s = store.saveSettings({ theme: 'graphite', themePicked: false, bgStyle: 'default', oled: false, navyLook1: true });
  theme.applyLook(s);
  // The dark Graphite look for everyone until they pick a colour in Settings → Appearance.
  theme.apply(s.themePicked ? s.theme : 'graphite');
  document.body.classList.toggle('perf', s.perfMode !== false);
  log.info('Perfil', store.activeProfile().name);

  // Atualiza a conta em segundo plano; a tela inicial abre com o cache.
  if (stremio.isLoggedIn()) {
    stremio.refreshUser().catch(() => {});
    stremio.getLibrary().catch(() => {});
  }

  Promise.all([server.check(), addons.load().catch(() => null)]).then(() => {
    const bootEl = document.getElementById('boot');
    if (bootEl) bootEl.parentNode.removeChild(bootEl);
    const initialTab = (window.location.hash || '').replace('#', '') || 'home';
    router.goTab(initialTab);
    if (profiles.isNewProfilePendingLogin() && !stremio.isLoggedIn()) {
      // Perfil novo: entra na conta Stremio deste perfil (para ter o histórico próprio).
      profiles.clearNewProfileFlag();
      openLogin(() => {
        Promise.all([stremio.refreshUser().catch(() => {}), addons.load(true), stremio.getLibrary()]).then(() => {
          const home = router.tabView('home');
          if (home && home.reload) home.reload();
        });
      });
    } else maybeShowWizard();
    devLaunch();
    // Aviso de versão nova (no máximo uma vez por dia).
    if (update.shouldAutoCheck()) {
      setTimeout(() => {
        update
          .check()
          .then((info) => info && toast(t('Atualização disponível: Ajustes → Procurar atualização'), 7000))
          .catch(() => {});
      }, 8000);
    }
  });
}

// Só em builds de desenvolvimento (KAI_DEVLOG): abre o player direto com uma URL passada pelo
// luna-send (params.devPlay), para reproduzir travamentos sem precisar navegar com o controle.
function devLaunch() {
  if (!__KAI_DEVLOG__ || !window.PalmSystem) return;
  let params = {};
  try {
    params = JSON.parse(window.PalmSystem.launchParams || '{}') || {};
  } catch (e) {
    return;
  }
  // devPlay64: URL em base64 (o webOS escapa "&" nos parâmetros de lançamento).
  if (params.devPlay64) params.devPlay = window.atob(params.devPlay64);
  if (!params.devPlay) return;
  log.info('devPlay', params.devPlay);
  openPlayer({
    meta: { id: 'dev', type: 'movie', name: params.devTitle || 'Teste' },
    video: { id: 'dev' },
    stream: { url: params.devPlay },
    streams: [],
    startTime: (params.devStart || 0) * 1000,
    isSeries: false,
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
