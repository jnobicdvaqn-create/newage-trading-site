export type Locale = 'en' | 'ru' | 'zh';

export interface TranslationMap {
  [key: string]: string | TranslationMap;
}

export type Translations = Record<Locale, TranslationMap>;
