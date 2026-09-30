import type { I18nString } from '@/shared/types';
import { Locale } from '@/shared/types';

export function i18nText(
  input: I18nString | null | undefined,
  locale: Locale = Locale.EN,
): string {
  if (!input) return '';

  switch (locale) {
    case Locale.VI:
      return input[Locale.VI] || input[Locale.EN] || '';
    case Locale.EN:
    default:
      return input[Locale.EN] || input[Locale.VI] || '';
  }
}

export function getSecondaryI18nText(
  input: I18nString | null | undefined,
  currentLocale: Locale = Locale.EN,
): string {
  if (!input) return '';

  switch (currentLocale) {
    case Locale.VI:
      return input[Locale.EN] || '';
    case Locale.EN:
    default:
      return '';
  }
}

export function includesI18n(
  input: I18nString | null | undefined,
  query: string,
): boolean {
  if (!input || !query) return false;
  const normalizedQuery = query.toLowerCase().trim();
  return Object.values(input).some((val) =>
    val?.toLowerCase().includes(normalizedQuery),
  );
}
