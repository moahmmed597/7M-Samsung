// Which badges show on the source list (Settings → Stream badges), like Nuvio's badge settings.
import * as store from './store.js';

export const KINDS = [
  { id: 'quality', label: 'Qualidade (4K, 1080p, 720p)', dflt: true },
  { id: 'hdr', label: 'HDR e Dolby Vision', dflt: true },
  { id: 'remux', label: 'REMUX', dflt: true },
  { id: 'codec', label: 'Codec (HEVC, AV1)', dflt: false },
  { id: 'audio', label: 'Áudio (Atmos, DTS, 5.1)', dflt: true },
  { id: 'lang', label: 'Idioma (Árabe, Multi)', dflt: true },
  { id: 'size', label: 'Tamanho do arquivo', dflt: false },
  { id: 'bitrate', label: 'Taxa estimada (Mbps)', dflt: true },
];

// { kind: true|false } with defaults filled in.
export function streamBadgeSettings() {
  const saved = store.settings().streamBadges || {};
  const out = {};
  KINDS.forEach((k) => (out[k.id] = saved[k.id] === undefined ? k.dflt : !!saved[k.id]));
  return out;
}

export function setBadge(kind, on) {
  const cur = streamBadgeSettings();
  cur[kind] = on;
  store.saveSettings({ streamBadges: cur });
}
