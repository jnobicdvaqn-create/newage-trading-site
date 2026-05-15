import type { Locale, Translations } from './types';
import raw from '../data/translations.json';

const translations = raw as Translations;

export function t(key: string, locale: Locale): string {
  const keys = key.split('.');
  let value: unknown = translations[locale];
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof value === 'string' ? value : key;
}

export function localePath(locale: Locale, path: string = ''): string {
  return `/${locale}${path}`;
}

export function alternates(locale: Locale, path: string = ''): Array<{ lang: Locale; href: string }> {
  const locales: Locale[] = ['en', 'ru', 'zh'];
  return locales.map(l => ({ lang: l, href: `/${l}${path}` }));
}

// Export raw translations for complex data access (objects, nested maps)
export function getTranslations(locale: Locale) {
  return translations[locale];
}
export function getRawTranslations() {
  return translations;
}

// ── Pricing module i18n (new structure) ──
import * as pricingEn from './pricing/en';
import * as pricingRu from './pricing/ru';
import * as pricingZh from './pricing/zh';

const pricingModules: Record<Locale, Record<string, unknown>> = {
  en: pricingEn as Record<string, unknown>,
  ru: pricingRu as Record<string, unknown>,
  zh: pricingZh as Record<string, unknown>,
};

/** Get pricing module translations for a locale */
export function getPricingTranslations(locale: Locale) {
  return pricingModules[locale] ?? pricingModules.en;
}

/** Pricing-specific t() helper — falls back to English if key missing */
export function tp(key: string, locale: Locale): string {
  const fallback = pricingModules.en as Record<string, string>;
  const module = (pricingModules[locale] ?? fallback) as Record<string, string>;
  return module[key] ?? fallback[key] ?? key;
}
