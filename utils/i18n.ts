import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { TFunction } from 'i18next';

import enCommon from '../public/locales/en/common.json';
import frCommon from '../public/locales/fr/common.json';
import enTools from '../public/locales/en/tools.json';
import frTools from '../public/locales/fr/tools.json';

const resources = {
  en: { common: enCommon, tools: enTools },
  fr: { common: frCommon, tools: frTools },
} as const;

export type Locale = keyof typeof resources;

export const defaultLocale: Locale = 'fr';
const supportedLngs = Object.keys(resources) as Locale[];

/** Même clé que celle utilisée par i18next-browser-languagedetector, pour que
 *  la préférence des visiteurs existants soit conservée. */
const LOCALE_STORAGE_KEY = 'i18nextLng';
const ONE_YEAR_IN_SECONDS = 31536000;

function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (supportedLngs as string[]).includes(value);
}

/**
 * Langue préférée du visiteur, lue côté navigateur uniquement.
 * À n'appeler qu'APRÈS le montage : le serveur rend toujours `defaultLocale`,
 * donc lire ceci pendant le rendu initial rouvrirait l'écart d'hydratation.
 */
export function readStoredLocale(): Locale | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // localStorage inaccessible : navigation privée, cookies bloqués
  }

  const fromCookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${LOCALE_STORAGE_KEY}=`))
    ?.split('=')[1];
  if (isLocale(fromCookie)) return fromCookie;

  const fromNavigator = navigator.language?.split('-')[0];
  return isLocale(fromNavigator) ? fromNavigator : null;
}

function persistLocale(locale: string): void {
  if (typeof window === 'undefined' || !isLocale(locale)) return;

  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // idem : on se contente du cookie
  }
  document.cookie = `${LOCALE_STORAGE_KEY}=${locale};path=/;max-age=${ONE_YEAR_IN_SECONDS};SameSite=Lax`;
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    debug: process.env.NODE_ENV === 'development',
    // Serveur et client démarrent sur la même langue avec les mêmes
    // ressources : c'est ce qui garantit un rendu identique à l'hydratation.
    // La langue du visiteur est appliquée après montage, par I18nProvider.
    lng: defaultLocale,
    fallbackLng: defaultLocale,
    supportedLngs,
    defaultNS: 'common',
    ns: ['common', 'tools'],
    initImmediate: false,
    resources,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
  });

  // Remplace le cache de i18next-browser-languagedetector : toute bascule de
  // langue, d'où qu'elle vienne, est mémorisée.
  i18n.on('languageChanged', persistLocale);
}

// Utilitaire pour récupérer un tableau typé depuis les traductions
export function tList<T = string>(t: TFunction, key: string): T[] {
  const result = t(key, { returnObjects: true });
  if (Array.isArray(result)) {
    return result as T[];
  }
  if (
    typeof result === 'string' ||
    typeof result === 'number' ||
    typeof result === 'boolean'
  ) {
    return [result as unknown as T];
  }
  return [];
}

export default i18n;
