import type { Locale } from './types';

export type { Locale };

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALES: Locale[] = ['en', 'ru', 'zh'];

export function isLocale(lang: string): lang is Locale {
  return LOCALES.includes(lang as Locale);
}
