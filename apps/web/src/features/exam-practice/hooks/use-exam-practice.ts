import {
  examPracticeKeys,
  examPracticeService,
  StartExamAttemptRequest,
  SubmitExamAnswerRequest,
} from '@/services/exam-practice';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

  return useMutation({
    mutationFn: (data: SubmitExamAnswerRequest) =>
      examPracticeService.submitAnswer(attemptId, data),
    onSuccess: () => {
      // Background save, no need to invalidate the whole attempt details to avoid UI flickers.
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

export const useMyAttempts = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: examPracticeKeys.myAttempts(page),
    queryFn: () =>
      examPracticeService.getMyAttempts(page, limit).then((res) => res.data),
  });
};

export const useGetExamAttemptDetail = (attemptId: string) => {
  return useQuery({
    queryKey: examPracticeKeys.attemptDetail(attemptId),
    queryFn: () =>
      examPracticeService.getAttempt(attemptId).then((res) => res.data),
    enabled: !!attemptId,
  });
};

export const useStartRetest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sourceAttemptId: string) =>
      examPracticeService.startRetest(sourceAttemptId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examPracticeKeys.attempts() });
    },
    onError: () => {
      toast.error('Failed to start retest. Please try again.');
    },
  });
};

export const usePauseExamAttempt = (attemptId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (elapsedSeconds: number) =>
      examPracticeService.pauseAttempt(attemptId, elapsedSeconds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: examPracticeKeys.attemptDetail(attemptId),
      });
      queryClient.invalidateQueries({ queryKey: examPracticeKeys.attempts() });
    },
    onError: () => {
      toast.error('Failed to pause attempt.');
    },
  });
};

export const useResumeExamAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attemptId: string) =>
      examPracticeService.resumeAttempt(attemptId),
    onSuccess: (_, attemptId) => {
      queryClient.invalidateQueries({
        queryKey: examPracticeKeys.attemptDetail(attemptId),
      });
      queryClient.invalidateQueries({ queryKey: examPracticeKeys.attempts() });
    },
    onError: () => {
      toast.error('Failed to resume attempt.');
    },
  });
};
