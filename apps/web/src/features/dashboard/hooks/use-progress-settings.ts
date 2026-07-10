import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  progressService,
  UpdateProgressSettingsPayload,
  progressKeys,
} from '@/services/progress';

export const useProgressSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProgressSettingsPayload) =>
      progressService.updateSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressKeys.dashboard() });
    },
  });
};
