'use client';

import { useState } from 'react';
import { useGetToeicTestById } from '../hooks';
import {
  useStartExamAttempt,
  useSubmitExamAnswer,
  useFinishExamAttempt,
} from '@/features/exam-practice/hooks/use-exam-practice';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { ToeicTestIntro } from './toeic-test-intro';
import { ToeicTestQuestion } from './toeic-test-question';
import { ToeicTestNavigation } from './toeic-test-navigation';

interface ToeicTestPlayerProps {
  testId: string;
}

export const ToeicTestPlayer = ({ testId }: ToeicTestPlayerProps) => {
  const t = useTranslations('ToeicTestPlayer');
  const router = useRouter();

  const { data: test, isLoading, isError } = useGetToeicTestById(testId);
  const startAttemptMutation = useStartExamAttempt();

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const submitAnswerMutation = useSubmitExamAnswer(attemptId ?? '');
  const finishAttemptMutation = useFinishExamAttempt(attemptId ?? '');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const form = useForm<{ answers: Record<string, string> }>({
    defaultValues: { answers: {} },
  });

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Icons
          name="loader-2"
          className="h-10 w-10 animate-spin text-primary"
        />
      </div>
    );
  }

  if (isError || !test) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-destructive">
        <p>{t('failedToLoadTest')}</p>
      </div>
    );
  }

  // Intro Screen (Before Starting Attempt)
  if (!attemptId) {
    return (
      <ToeicTestIntro
        title={test.title}
        questionCount={test.questions.length}
        isStarting={startAttemptMutation.isPending}
        onStart={() => {
          startAttemptMutation.mutate(
            { testId, testType: 'TOEIC' },
            {
              onSuccess: (data) => setAttemptId(data.id),
            },
          );
        }}
      />
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const totalQuestions = test.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const currentAnswers = form.watch('answers');

  const handleSelectOption = (option: string) => {
    form.setValue(`answers.${currentQuestion.id}`, option);
    submitAnswerMutation.mutate({
      questionId: currentQuestion.id,
      userAnswer: option,
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleFinishTest = () => {
    finishAttemptMutation.mutate(undefined, {
      onSuccess: () => {
        router.push(`/dashboard`); // Navigate back to dashboard or results page
      },
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{test.title}</h2>

          <ToeicTestNavigation
            totalQuestions={totalQuestions}
            currentQuestionIndex={currentQuestionIndex}
            answers={currentAnswers}
            questions={test.questions}
            onNavigate={(index) => setCurrentQuestionIndex(index)}
          />
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-indigo-500 transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ToeicTestQuestion
            question={currentQuestion}
            form={form}
            onSelectOption={handleSelectOption}
          />
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className="rounded-full px-6"
        >
          <Icons name="chevron-left" className="mr-2 h-4 w-4" /> {t('previous')}
        </Button>

        {currentQuestionIndex === totalQuestions - 1 ? (
          <Button
            size="lg"
            onClick={handleFinishTest}
            disabled={finishAttemptMutation.isPending}
            className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-8 text-white shadow-lg hover:from-green-600 hover:to-emerald-700"
          >
            {finishAttemptMutation.isPending ? (
              <Icons name="loader-2" className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons name="check-circle" className="mr-2 h-4 w-4" />
            )}
            {t('submitTest')}
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={nextQuestion}
            className="rounded-full bg-slate-900 px-8 text-white shadow-lg hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700"
          >
            {t('next')} <Icons name="chevron-right" className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
