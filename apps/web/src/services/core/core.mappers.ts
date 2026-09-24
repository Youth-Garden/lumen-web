import type { I18nString } from '@/shared/types';

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
  return {};
};
