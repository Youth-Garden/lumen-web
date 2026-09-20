import type { I18nString } from '@/services/vocabulary';

export function getLocalizedText(
  value: I18nString | null | undefined,
  locale: string = 'en',
  fallback: string = 'en',
): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    const map = value as Record<string, string | undefined>;
    return map[locale] || map[fallback] || Object.values(map)[0] || '';
  }
  return '';
}
