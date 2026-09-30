import type { Paging } from '@lumen/shared-api';

export const EMPTY_PAGING: Paging<never> = Object.freeze({
  items: [] as never[],
  meta: {
    currentPage: 1,
    perPage: 0,
    totalItems: 0,
    totalPages: 0,
  },
});

export const createEmptyPaging = <T>(perPage = 0): Paging<T> => ({
  items: [] as T[],
  meta: {
    currentPage: 1,
    perPage,
    totalItems: 0,
    totalPages: 0,
  },
});
