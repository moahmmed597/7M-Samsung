// Idiomas do app: português (base), inglês e árabe. A chave é o próprio texto em português;
// t('Olá {nome}', { nome: 'Ana' }) troca os {parâmetros}. Idioma: escolhido nos Ajustes
// ou automático pelo idioma da TV.
import { EN } from './i18n-en.js';
import { AR } from './i18n-ar.js';
import { ES } from './i18n-es.js';
import { FR } from './i18n-fr.js';
import { TR } from './i18n-tr.js';
import { DE } from './i18n-de.js';

let lang = 'en';
const TABLES = { en: EN, ar: AR, es: ES, fr: FR, tr: TR, de: DE };

export function detect() {
  const nav = (window.navigator && (window.navigator.language || window.navigator.userLanguage)) || '';
  if (/^ar/i.test(nav)) return 'ar';
  if (/^es/i.test(nav)) return 'es';
  if (/^fr/i.test(nav)) return 'fr';
  if (/^tr/i.test(nav)) return 'tr';
  if (/^de/i.test(nav)) return 'de';
  if (/^it/i.test(nav)) return 'it';
  if (/^pt/i.test(nav)) return 'pt';
  if (/^ru/i.test(nav)) return 'ru';
  if (/^ja/i.test(nav)) return 'ja';
  if (/^ko/i.test(nav)) return 'ko';
  if (/^pl/i.test(nav)) return 'pl';
  if (/^nl/i.test(nav)) return 'nl';
  if (/^sv/i.test(nav)) return 'sv';
  if (/^el/i.test(nav)) return 'el';
  if (/^cs/i.test(nav)) return 'cs';
  if (/^hu/i.test(nav)) return 'hu';
  if (/^ro/i.test(nav)) return 'ro';
  if (/^uk/i.test(nav)) return 'uk';
  return 'en';
}

export function init(setting) {
  const supported = ['en', 'ar', 'es', 'fr', 'tr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'pl', 'nl', 'sv', 'el', 'cs', 'hu', 'ro', 'uk'];
  lang = supported.indexOf(setting) >= 0 ? setting : detect();
  const root = document.documentElement;
  root.setAttribute('lang', lang);
  // Right-to-left only for Arabic.
  root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  return lang;
}

export function current() {
  return lang;
}

// Idioma para APIs de metadados (TMDB).
export function apiLang() {
  switch (lang) {
    case 'ar': return 'ar-SA';
    case 'es': return 'es-ES';
    case 'fr': return 'fr-FR';
    case 'tr': return 'tr-TR';
    case 'de': return 'de-DE';
    case 'it': return 'it-IT';
    case 'pt': return 'pt-BR';
    case 'ru': return 'ru-RU';
    case 'ja': return 'ja-JP';
    case 'ko': return 'ko-KR';
    case 'pl': return 'pl-PL';
    case 'nl': return 'nl-NL';
    case 'sv': return 'sv-SE';
    case 'el': return 'el-GR';
    case 'cs': return 'cs-CZ';
    case 'hu': return 'hu-HU';
    case 'ro': return 'ro-RO';
    case 'uk': return 'uk-UA';
    default: return 'en-US';
  }
}

export function t(text, params) {
  if (lang === 'pt') {
    let out = text;
    if (params) {
      Object.keys(params).forEach((k) => {
        out = out.split('{' + k + '}').join(String(params[k]));
      });
    }
    return out;
  }
  const table = TABLES[lang] || EN;
  let out = (table && table[text] !== undefined) ? table[text] : (EN[text] !== undefined ? EN[text] : text);
  if (params) {
    Object.keys(params).forEach((k) => {
      out = out.split('{' + k + '}').join(String(params[k]));
    });
  }
  return out;
}

// "S1 E3" (Arabic: "م1 ح3", season/episode).
export function epLabel(season, episode) {
  if (lang === 'ar') return 'م' + season + ' ح' + episode;
  if (lang === 'es') return 'T' + season + ' E' + episode;
  if (lang === 'fr') return 'S' + season + ' É' + episode;
  if (lang === 'tr') return 'S' + season + ' B' + episode;
  return 'S' + season + ' E' + episode;
}
