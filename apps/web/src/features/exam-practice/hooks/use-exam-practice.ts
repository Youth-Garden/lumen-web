import {
  examPracticeKeys,
  examPracticeService,
  StartExamAttemptRequest,
  SubmitExamAnswerRequest,
} from '@/services/exam-practice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export const useStartExamAttempt = () => {
  const t = useTranslations('ExamPractice');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StartExamAttemptRequest) =>
      examPracticeService.startAttempt(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examPracticeKeys.attempts() });
    },
    onError: () => {
      toast.error(t('startFailed'));
    },
  });
};

export const useSubmitExamAnswer = (attemptId: string) => {
  const t = useTranslations('ExamPractice');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitExamAnswerRequest) =>
      examPracticeService.submitAnswer(attemptId, data),
    onSuccess: () => {
      // Background save, no need to invalidate the whole attsempt details to avoid UI flickers.
    },
    onError: () => {
      toast.error(t('saveAnswerFailed'));
    },
  });
};

export const useFinishExamAttempt = (attemptId: string) => {
  const t = useTranslations('ExamPractice');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => examPracticeService.finishAttempt(attemptId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: examPracticeKeys.attemptDetail(attemptId),
      });
      toast.success(t('finishSuccess'));
    },
    onError: () => {
      toast.error(t('finishFailed'));
    },
  });
};
