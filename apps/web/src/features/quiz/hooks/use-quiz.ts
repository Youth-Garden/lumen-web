import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { quizService, quizKeys } from '@/services/quiz';
import type { GenerateQuizDto, SubmitAnswerDto } from '@/services/quiz';

export const useGenerateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: GenerateQuizDto) =>
      quizService.generateQuiz(dto).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
    },
  });
};

export const useSubmitAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      questionId,
      dto,
    }: {
      id: string;
      questionId: string;
      dto: SubmitAnswerDto;
    }) => quizService.submitAnswer(id, questionId, dto).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: quizKeys.detail(variables.id),
      });
    },
  });
};

export const useFinishQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      quizService.finishQuiz(id).then((res) => res.data),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
    },
  });
};

export const useQuizzes = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: quizKeys.list(params),
    queryFn: () => quizService.listQuizzes(params).then((res) => res.data),
  });
};

export const useQuizDetail = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: quizKeys.detail(id),
    queryFn: () => quizService.getQuiz(id).then((res) => res.data),
    enabled: options?.enabled,
  });
};