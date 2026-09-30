import { Paging } from '@lumen/shared-api';
import type { I18nString } from '@/shared/types';
import { Locale } from '@/shared/types';

export const idResponseMapper = (
  raw: Record<string, unknown>,
): { id: string } => ({
  id: String(raw?.id ?? ''),
});

export const voidResponseMapper = (): void => undefined;

export const pagingMapper = <T, R>(
  raw: any,
  itemMapper: (item: T) => R,
): Paging<R> | null => {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const rawItems = Array.isArray(raw.items)
    ? raw.items
    : Array.isArray(raw.data)
      ? raw.data
      : null;

  if (!rawItems) {
    return null;
  }

  const meta = raw.meta;
  if (!meta || typeof meta !== 'object') {
    return null;
  }

  return {
    items: rawItems.map((item: T) => itemMapper(item)),
    meta: {
      currentPage: Number(meta.currentPage),
      perPage: Number(meta.perPage),
      totalItems: Number(meta.totalItems),
      totalPages: Number(meta.totalPages),
    },
  };
};

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
