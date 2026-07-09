import { passThroughMapper } from '../core';
import type { AdminUser, UserListResponse } from './users.types';

export const adminUserMapper = (raw: any): AdminUser => ({
  ...raw,
  id: raw?.id ? String(raw.id) : '',
});

export const userListMapper = (raw: any): UserListResponse => ({
  items: Array.isArray(raw?.items) ? raw.items.map(adminUserMapper) : [],
  meta: raw?.meta ?? {
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 0,
  },
});
