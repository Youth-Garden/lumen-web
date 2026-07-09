import {
  ArticleDto,
  ArticleListResponse,
  TranslateResponse,
} from './reading.types';

export const articleMapper = (raw: any): ArticleDto => ({
  id: raw?.id || '',
  title: raw?.title || '',
  content: raw?.content || '',
  createdAt: raw?.createdAt || '',
});

export const articleListMapper = (raw: any): ArticleListResponse => ({
  items: Array.isArray(raw?.items) ? raw.items.map(articleMapper) : [],
  total: raw?.total || 0,
  page: raw?.page || 1,
  limit: raw?.limit || 10,
});

export const translateResponseMapper = (raw: any): TranslateResponse => ({
  translation: raw?.translation || '',
});
