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
