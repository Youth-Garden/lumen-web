import { examPracticeService } from '@/services/exam-practice';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const adaptiveLearningKeys = {
  all: ['adaptive-learning'] as const,
  weakness: () => [...adaptiveLearningKeys.all, 'weakness'] as const,
  drill: () => [...adaptiveLearningKeys.all, 'drill'] as const,
};

export function useWeaknessAnalysis() {
  return useQuery({
    queryKey: adaptiveLearningKeys.weakness(),
    queryFn: async () => {
      const res = await examPracticeService.getWeaknessAnalysis();
      return res.data;
    },
  });
}

export function useAdaptiveDrill() {
  return useQuery({
    queryKey: adaptiveLearningKeys.drill(),
    queryFn: async () => {
      const res = await examPracticeService.getAdaptiveDrill();
      return res.data;
    },
    enabled: false,
  });
}
export function useSubmitDrill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { answers: Record<number, string> }) => {
      // Simulate submission delay
      return new Promise((resolve) => setTimeout(resolve, 600));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adaptiveLearningKeys.weakness(),
      });
    },
  });
}
