import {
  VocabularyOverview,
  vocabularyKeys,
  vocabularyService,
} from '@/services/vocabulary';
import { useAuthStore } from '@/store/auth.store';
import { BaseResponse } from '@lumen/shared-api';
import { useQuery } from '@tanstack/react-query';

export const useVocabularyOverview = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<BaseResponse<VocabularyOverview>>({
    queryKey: vocabularyKeys.overview(),
    queryFn: () => vocabularyService.getOverview(),
    enabled: isAuthenticated,
  });
};
