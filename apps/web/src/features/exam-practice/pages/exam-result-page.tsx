'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';

import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { formatDuration } from '@lumen/utils';
import { RouteEnum } from '@/shared/constants';
import { formatUrl } from '@lumen/shared-api';
import { useGetExamAttemptDetail, useStartRetest } from '../hooks/use-exam-practice';
import { ExamAttemptStatus, TestPlayerMode } from '@/services/exam-practice/exam-practice.types';
import { useRouter } from 'next/navigation';

export const ExamResultPage = () => {
  const params = useParams<{ testId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('ExamResult');

  const attemptId = searchParams.get('attemptId') ?? '';
  const testId = params.testId;

  const { data: attempt, isLoading } = useGetExamAttemptDetail(attemptId);
  const { mutate: startRetest, isPending: isRetesting } = useStartRetest();

  const handleRetest = () => {
    startRetest(attemptId, {
      onSuccess: (newAttempt) => {
        router.push(
          formatUrl(RouteEnum.TOEIC_TEST, { id: testId }, { attemptId: newAttempt.id }),
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Icons name="loader-2" className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!attempt || attempt.status !== ExamAttemptStatus.COMPLETED) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <Icons name="file-question" className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">{t('notFound')}</p>
        <Button variant="outline" onClick={() => router.push(RouteEnum.TOEIC)}>
          {t('backToTests')}
        </Button>
      </div>
    );
  }

  const totalAnswered = attempt.answers.length;
  const totalCorrect = attempt.answers.filter((answer) => answer.isCorrect).length;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const elapsedSeconds = attempt.elapsedSeconds ?? 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Icons name="trophy" className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
      </motion.div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-primary text-primary-foreground p-6 rounded-2xl shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Icons name="trophy" className="w-20 h-20" />
          </div>
          <h3 className="text-sm font-medium opacity-80 mb-1">{t('totalScore')}</h3>
          <div className="text-5xl font-bold">
            {attempt.totalScore}
            <span className="text-xl font-normal opacity-70"> / 990</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border p-6 rounded-2xl shadow-sm"
        >
          <div className="flex items-center justify-between mb-3 border-b pb-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icons name="headphones" className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">{t('listening')}</span>
            </div>
            <div className="text-2xl font-bold">
              {attempt.listeningScore}
              <span className="text-xs font-normal text-muted-foreground"> / 495</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icons name="book-open" className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium">{t('reading')}</span>
            </div>
            <div className="text-2xl font-bold">
              {attempt.readingScore}
              <span className="text-xs font-normal text-muted-foreground"> / 495</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-3"
        >
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/40 rounded-full flex items-center justify-center">
            <Icons name="clock" className="w-6 h-6 text-orange-500" />
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-medium mb-1">{t('timeSpent')}</p>
            <div className="text-2xl font-bold">{formatDuration(elapsedSeconds)}</div>
          </div>
        </motion.div>
      </div>

      {/* Accuracy Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border rounded-2xl shadow-sm p-6 mb-8"
      >
        <h3 className="font-semibold text-lg mb-4">{t('accuracy')}</h3>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                {t('correct')} {totalCorrect} / {totalAnswered}
              </span>
              <span className="font-semibold text-primary">{accuracy}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${accuracy}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </div>
          <div className="text-4xl font-bold text-primary">{accuracy}%</div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap justify-center gap-3"
      >
        <Button
          variant="outline"
          size="lg"
          className="gap-2"
          onClick={() =>
            router.push(
              formatUrl(
                RouteEnum.TOEIC_TEST,
                { id: testId },
                { attemptId, mode: TestPlayerMode.REVIEW },
              ),
            )
          }
        >
          <Icons name="eye" className="h-5 w-5" />
          {t('reviewAnswers')}
        </Button>

        {totalCorrect < totalAnswered && (
          <Button
            variant="secondary"
            size="lg"
            className="gap-2"
            disabled={isRetesting}
            onClick={handleRetest}
          >
            <Icons name="rotate-ccw" className="h-5 w-5" />
            {t('retestWrong')}
          </Button>
        )}

        <Button size="lg" className="gap-2" onClick={() => router.push(RouteEnum.TOEIC)}>
          <Icons name="layers" className="h-5 w-5" />
          {t('backToTests')}
        </Button>
      </motion.div>
    </div>
  );
};
