import { useMutation, useQueryClient } from '@tanstack/react-query';
import { quizService, quizKeys } from '@/services/quiz';
import type { GenerateQuizDto, SubmitAnswerDto } from '@/services/quiz';

export const useGenerateQuizMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: GenerateQuizDto) =>
      quizService.generateQuiz(dto).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
    },
  });
};

export const useSubmitAnswerMutation = () => {
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

export const useFinishQuizMutation = () => {
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
