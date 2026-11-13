// Trechos para pular (abertura, recapitulação, encerramento), como o notify_skip do Kai:
// 1) IntroDB (por IMDb + temporada/episódio) tem prioridade;
// 2) AniSkip (por ID do MyAnimeList) para animes, com o ID convertido via arm.haglund.dev.
import { getJSON, postJSON } from '../lib/http.js';
import { fetchUrl as phoneFetchUrl } from '../lib/phone.js';
import * as server from './server.js';
import { log } from '../lib/log.js';
import * as store from '../lib/store.js';

const INTRODB = 'https://api.introdb.app/segments';
const ANISKIP = 'https://api.aniskip.com/v2/skip-times/';
const ANIMESKIP = 'https://api.anime-skip.com/graphql';
const ARM = 'https://arm.haglund.dev/api/v2/';

// O IntroDB só libera CORS para o próprio site; se a TV bloquear, vai pelo proxy do serviço da TV.
function getJSONWithProxy(url) {
  return server.getJSONViaProxy(url, { timeout: 10000 });
}

// Anime-Skip (api.anime-skip.com, GraphQL) needs the user's own Client ID, kept only in this TV's settings.
function animeSkipKey() {
  const s = store.settings();
  return s.animeSkip === false ? '' : (s.animeSkipClientId || '').trim();
}

function animeSkipQuery(query, key) {
  const body = { query: query };
  const opts = { timeout: 10000, quiet: true, headers: { 'X-Client-ID': key } };
  return postJSON(ANIMESKIP, body, opts).catch((e) => {
    if (e.status && e.status !== 0) throw e;
    return postJSON(phoneFetchUrl(ANIMESKIP), body, opts);
  });
}

// Anime-Skip marks where a segment starts; it ends where the next one starts.
function fromAnimeSkipTimestamps(list, baseDuration) {
  const map = { intro: 'intro', 'new intro': 'intro', 'mixed intro': 'intro', recap: 'recap', credits: 'outro', 'new credits': 'outro', 'mixed credits': 'outro' };
  const sorted = (list || []).filter((x) => isFinite(x.at) && x.at >= 0).sort((a, b) => a.at - b.at);
  const out = [];
  sorted.forEach((x, i) => {
    const type = map[String((x.type && x.type.name) || '').toLowerCase()];
    if (!type) return;
    const next = sorted[i + 1];
    let end = next && next.at > x.at ? next.at : null;
    if (end === null && type === 'outro' && (!baseDuration || x.at >= baseDuration / 2)) end = 100000;
    if (end !== null && end > x.at) out.push({ type: type, start: x.at, end: end, source: 'Anime-Skip' });
  });
  return out;
}

const showCache = {};
function animeSkipSegments(anilist, season, episode, key) {
  if (!anilist || !episode) return Promise.resolve([]);
  const ck = String(anilist);
  if (!showCache[ck])
    showCache[ck] = animeSkipQuery('{ findShowsByExternalId(service: ANILIST, serviceId: "' + ck + '") { id } }', key)
      .then((r) => ((r && r.data && r.data.findShowsByExternalId) || []).map((x) => String(x.id)).filter((x) => /^[\w-]+$/.test(x)))
      .catch((e) => {
        delete showCache[ck];
        throw e;
      });
  return showCache[ck].then((ids) => {
    let chain = Promise.resolve([]);
    ids.forEach((id) => {
      chain = chain.then((found) => {
        if (found.length) return found;
        return animeSkipQuery('{ findEpisodesByShowId(showId: "' + id + '") { season number baseDuration timestamps { at type { name } } } }', key).then((r) => {
          const eps = (r && r.data && r.data.findEpisodesByShowId) || [];
          const same = eps.filter((e) => Number(e.number) === Number(episode));
          const bySeason = season ? same.filter((e) => Number(e.season) === Number(season)) : same;
          let best = [];
          (bySeason.length ? bySeason : same).forEach((e) => {
            const segs = fromAnimeSkipTimestamps(e.timestamps, e.baseDuration);
            if (segs.length > best.length) best = segs;
          });
          return best;
        });
      });
    });
    return chain;
  });
}

function fromIntroDb(data) {
  const out = [];
  const map = { intro: 'intro', recap: 'recap', outro: 'outro' };
  Object.keys(map).forEach((k) => {
    const s = data && data[k];
    if (s && isFinite(s.start_sec) && isFinite(s.end_sec) && s.end_sec > s.start_sec) out.push({ type: map[k], start: s.start_sec, end: s.end_sec, source: 'IntroDB' });
  });
  return out;
}

function fromAniSkip(data) {
  const map = { op: 'intro', 'mixed-op': 'intro', recap: 'recap', ed: 'outro', 'mixed-ed': 'outro' };
  return ((data && data.found && data.results) || [])
    .filter((r) => map[r.skipType] && r.interval)
    .map((r) => ({ type: map[r.skipType], start: r.interval.startTime, end: r.interval.endTime, source: 'AniSkip' }));
}

// IDs de anime: "kitsu:123:5", "mal:123:5", "anilist:123:5" → { source, id, episode }
function parseAnimeId(videoId) {
  const m = String(videoId).match(/^(kitsu|mal|anilist):(\d+)(?::(\d+))?/);
  return m ? { source: m[1] === 'mal' ? 'myanimelist' : m[1], id: m[2], episode: m[3] ? parseInt(m[3], 10) : 1 } : null;
}

// arm.haglund.dev gives the MyAnimeList and AniList ids; { mal, anilist }.
const malCache = {};
function idsFromAnime(a) {
  const key = a.source + ':' + a.id;
  if (!malCache[key])
    malCache[key] = getJSON(ARM + 'ids?source=' + a.source + '&id=' + a.id, { quiet: true })
      .then((r) => ({
        mal: a.source === 'myanimelist' ? parseInt(a.id, 10) : (r && r.myanimelist) || null,
        anilist: a.source === 'anilist' ? parseInt(a.id, 10) : (r && r.anilist) || null,
      }))
      .catch(() => ({ mal: a.source === 'myanimelist' ? parseInt(a.id, 10) : null, anilist: a.source === 'anilist' ? parseInt(a.id, 10) : null }));
  return malCache[key];
}

// IMDb + temporada → ids (o arm devolve uma entrada por temporada do TVDB/TMDB).
function idsFromImdb(imdb, season) {
  const key = imdb + ':' + season;
  if (!malCache[key])
    malCache[key] = getJSON(ARM + 'imdb?id=' + imdb, { quiet: true })
      .then((list) => {
        const arr = Array.isArray(list) ? list : [];
        const hit =
          arr.find((x) => (x.myanimelist || x.anilist) && (x['thetvdb-season'] === season || x['themoviedb-season'] === season)) ||
          (arr.length === 1 ? arr[0] : null);
        return { mal: (hit && hit.myanimelist) || null, anilist: (hit && hit.anilist) || null };
      })
      .catch(() => ({ mal: null, anilist: null }));
  return malCache[key];
}

export function isAnime(meta) {
  const g = (meta.genres || meta.genre || []).map((x) => String(x).toLowerCase());
  return /^(kitsu|mal|anilist):/.test(meta.id) || g.indexOf('anime') >= 0 || (g.indexOf('animation') >= 0 && /japan/i.test(meta.country || ''));
}

export function getSegments(meta, video, durationSec) {
  const anime = parseAnimeId(video.id);
  const imdb = /^tt\d+/.test(meta.id) ? meta.id.match(/^tt\d+/)[0] : null;
  const season = video.season;
  const episode = video.episode;

  const intro = imdb
    ? getJSONWithProxy(INTRODB + '?imdb_id=' + imdb + (isFinite(season) && isFinite(episode) ? '&season=' + season + '&episode=' + episode : ''))
        .then(fromIntroDb)
        .catch(() => [])
    : Promise.resolve([]);

  return intro.then((segs) => {
    if (segs.length) return segs;
    let idsPromise = null;
    let ep = episode;
    let seasonForSkip = null;
    if (anime) {
      idsPromise = idsFromAnime(anime);
      ep = anime.episode;
    } else if (imdb && isAnime(meta) && isFinite(episode)) {
      idsPromise = idsFromImdb(imdb, season || 1);
      seasonForSkip = season || 1;
    }
    if (!idsPromise || !ep) return [];
    return idsPromise.then((ids) => {
      const key = animeSkipKey();
      const fromAs = key && ids.anilist ? animeSkipSegments(ids.anilist, seasonForSkip, ep, key).catch(() => []) : Promise.resolve([]);
      return fromAs.then((found) => {
        if (found.length) return found;
        if (!ids.mal) return [];
        const q = ['op', 'ed', 'recap', 'mixed-op', 'mixed-ed'].map((t) => 'types%5B%5D=' + t).join('&');
        return getJSONWithProxy(ANISKIP + ids.mal + '/' + ep + '?' + q + '&episodeLength=' + Math.round(durationSec || 0))
          .then(fromAniSkip)
          .catch(() => []);
      });
    });
  }).then((segs) => {
    if (segs.length) log.info('Pular: ' + segs.map((s) => s.type + ' ' + s.start.toFixed(0) + '-' + s.end.toFixed(0) + ' (' + s.source + ')').join(', '));
    return segs;
  });
}

// Settings → Skip segments → Test: asks IntroDB for WandaVision S1E1 the three ways the app can
// (straight, through the TV service, through the PC server) and says which one answered.
export function selfTest() {
  const url = INTRODB + '?imdb_id=tt9140560&season=1&episode=1';
  const ok = (r) => !!(r && r.intro);
  const tryOne = (u) => getJSON(u, { timeout: 8000, quiet: true }).then(ok, () => false);
  return tryOne(url).then((direct) => {
    if (direct) return 'direct';
    return tryOne(phoneFetchUrl(url)).then((viaTv) => {
      if (viaTv) return 'tv';
      const p = server.getJSONViaProxy(url, { timeout: 8000 }).then(ok, () => false);
      return p.then((viaPc) => (viaPc ? 'pc' : 'none'));
    });
  });
}
