import { ArticleDto, TranslateResponse } from './reading.types';

export const articleMapper = (raw: any): ArticleDto => ({
  id: raw?.id || '',
  title: raw?.title || '',
  content: raw?.content || '',
  createdAt: raw?.createdAt || '',
});

export const translateResponseMapper = (raw: any): TranslateResponse => ({
  translatedText: raw?.translatedText || '',
});
