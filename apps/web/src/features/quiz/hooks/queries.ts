import { useQuery } from '@tanstack/react-query';
import { quizService, quizKeys } from '@/services/quiz';

export const useQuizzesQuery = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: quizKeys.list(params),
    queryFn: () => quizService.listQuizzes(params).then((res) => res.data),
  });
};

export const useQuizDetailQuery = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: quizKeys.detail(id),
    queryFn: () => quizService.getQuiz(id).then((res) => res.data),
    enabled: options?.enabled,
  });
};
