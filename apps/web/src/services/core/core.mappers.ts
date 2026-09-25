import type { I18nString } from '@/shared/types';
import { Locale } from '@/shared/types';

export const idResponseMapper = (
  raw: Record<string, unknown>,
): { id: string } => ({
  id: String(raw?.id ?? ''),
});

export const voidResponseMapper = (): void => undefined;

export const toI18nString = (raw: unknown): I18nString => {
  if (raw && typeof raw === 'object') {
    return raw as I18nString;
  }
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed as I18nString;
      }
    } catch {
      // Not JSON string
    }
    return { [Locale.EN]: raw.trim() };
  }
  return {};
};

