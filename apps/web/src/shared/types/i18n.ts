import type { Locale } from '../i18n/routing';

export type SupportedLocale = Locale;
export type I18nMap = Partial<Record<SupportedLocale, string>>;
export type I18nString = I18nMap | string;

export type TranslationKey = string;
export type TranslateFn<T = TranslationKey> = (
  key: T,
  values?: Record<string, unknown>,
) => string;
