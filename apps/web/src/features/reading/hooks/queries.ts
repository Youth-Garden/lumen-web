import { useQuery } from '@tanstack/react-query';
import { readingKeys, readingService } from '@/services/reading';

export const useGetArticles = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: readingKeys.lists(),
    queryFn: () => readingService.getArticles(page, limit).then((res) => res.data),
  });
};

export const useGetArticleById = (id: string) => {
  return useQuery({
    queryKey: readingKeys.detail(id),
    queryFn: () => readingService.getArticleById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useTranslateText = (text: string) => {
  return useQuery({
    queryKey: [...readingKeys.all, 'translate', text],
    queryFn: () => readingService.translateText(text).then((res) => res.data),
    enabled: !!text && text.trim().length > 0,
    staleTime: Infinity, // translations don't change
  });
};
