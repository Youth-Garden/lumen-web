import type { I18nString } from '@/shared/types';
import { Locale } from '@/shared/types';

export const idResponseMapper = (
  raw: Record<string, unknown>,
): { id: string } => ({
  id: String(raw?.id ?? ''),
});

export const voidResponseMapper = (): void => undefined;

export const toI18nString = (raw: unknown): I18nString => {
  if (!raw) return {};

  if (typeof raw === 'object' && raw !== null) {
    return raw as I18nString;
  }

  if (typeof raw === 'string' && raw.trim()) {
    const trimmed = raw.trim();
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as I18nString;
      }
    } catch {
      // Not JSON string
    }

    return { [Locale.EN]: trimmed };
  }

  return {};
};
