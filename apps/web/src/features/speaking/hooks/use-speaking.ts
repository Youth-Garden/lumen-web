import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { speakingKeys, speakingService } from '@/services/speaking';
import type { SubmitSpeechRequest } from '@/services/speaking';

export const useSpeakingTasks = (
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  },
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [...speakingKeys.tasks(), params],
    queryFn: () => speakingService.getTasks(params).then((res) => res.data),
    ...options,
  });
};

export const useSubmitSpeech = (taskId: string) => {
  const t = useTranslations('Speaking');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitSpeechRequest) =>
      speakingService.submitSpeech(taskId, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: speakingKeys.all });
    },
    onError: () => {
      toast.error(t('submit'));
    },
  });
};
