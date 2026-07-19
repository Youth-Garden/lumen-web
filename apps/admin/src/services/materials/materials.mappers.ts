import type { MaterialDto, MaterialListResponse } from './materials.types';

export const materialMapper = (raw: any): MaterialDto => {
  return {
    ...raw,
    id: raw?.id ? String(raw.id) : '',
    audioUrl: raw?.audioUrl ?? null,
    coverImageUrl: raw?.coverImageUrl ?? null,
    tags: Array.isArray(raw?.tags) ? raw.tags : [],
    views: typeof raw?.viewCount === 'number' ? raw.viewCount : 0,
  };
};

export const materialListMapper = (raw: any): MaterialListResponse => {
  return {
    items: Array.isArray(raw?.items) ? raw.items.map(materialMapper) : [],
    meta: raw?.meta ?? {
      currentPage: 1,
      perPage: 10,
      totalItems: 0,
      totalPages: 0,
    },
  };
};
