import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { grammarKeys, grammarService } from '@/services/grammar';
import type { SubmitExerciseRequest } from '@/services/grammar';

export const useGrammarTopics = (
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    cefrLevel?: string;
    category?: string;
  },
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [...grammarKeys.topics(), params],
    queryFn: () => grammarService.getTopics(params).then((res) => res.data),
    ...options,
  });
};

export const useGrammarTopicDetail = (id: string) => {
  return useQuery({
    queryKey: grammarKeys.topicDetail(id),
    queryFn: () => grammarService.getTopicById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useLessonExercises = (lessonId: string) => {
  return useQuery({
    queryKey: grammarKeys.lessonExercises(lessonId),
    queryFn: () =>
      grammarService.getLessonExercises(lessonId).then((res) => res.data),
    enabled: !!lessonId,
  });
};

export const useSubmitExercise = (exerciseId: string) => {
  const t = useTranslations('Grammar');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitExerciseRequest) =>
      grammarService.submitExercise(exerciseId, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: grammarKeys.all });
    },
    onError: () => {
      toast.error(t('submit'));
    },
  });
};
