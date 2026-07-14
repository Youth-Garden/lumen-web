import { passThroughMapper } from '../core';
import type { User, UserListResponse } from './users.types';

export const userMapper = (raw: any): User => ({
  ...raw,
  id: raw?.id ? String(raw.id) : '',
});

export const userListMapper = (raw: any): UserListResponse => ({
  items: Array.isArray(raw?.items) ? raw.items.map(userMapper) : [],
  meta: raw?.meta ?? {
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 0,
  },
});
