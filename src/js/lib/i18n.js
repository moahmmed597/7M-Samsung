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
  if (/^pt/i.test(nav)) return 'pt';
  return 'en';
}

export function init(setting) {
  const supported = ['en', 'ar', 'es', 'fr', 'tr', 'de', 'pt'];
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
    case 'pt': return 'pt-BR';
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
