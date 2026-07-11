'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Icons } from '@lumen/uikit/icons';

import { useGetToeicTestById } from '../hooks/use-toeic';
import {
  useStartExamAttempt,
  useSubmitExamAnswer,
  useFinishExamAttempt,
} from '@/features/exam-practice/hooks/use-exam-practice';

import { ToeicTestIntro } from './toeic-test-intro';
import { ToeicTestHeader } from './player/toeic-test-header';
import { ToeicTestSidebar } from './player/toeic-test-sidebar';
import { ToeicQuestionRenderer } from './player/toeic-question-renderer';

interface ToeicTestPlayerProps {
  testId: string;
}

export const ToeicTestPlayer = ({ testId }: ToeicTestPlayerProps) => {
  const router = useRouter();
  const t = useTranslations('ToeicTestPlayer');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(120 * 60); // 120 minutes

  const form = useForm<{ answers: Record<string, string> }>({
    defaultValues: { answers: {} },
  });

  const { data: test, isLoading, isError } = useGetToeicTestById(testId);
  const startAttemptMutation = useStartExamAttempt();

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const submitAnswerMutation = useSubmitExamAnswer(attemptId ?? '');
  const finishAttemptMutation = useFinishExamAttempt(attemptId ?? '');

  // Timer logic
  useEffect(() => {
    if (!attemptId || timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [attemptId, timeRemaining]);

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
  const currentAnswers = form.watch('answers');

  const handleSelectOption = (option: string) => {
    form.setValue(`answers.${currentQuestion.id}`, option);
    submitAnswerMutation.mutate({
      questionId: currentQuestion.id,
      userAnswer: option,
    });

    // Auto advance after 500ms for smoothness
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    }, 500);
  };

  const handleFinishTest = () => {
    finishAttemptMutation.mutate(undefined, {
      onSuccess: () => {
        router.push(`/dashboard`); // Navigate back to dashboard or results page
      },
    });
  };

  const questionStatuses = test.questions.map((q) => ({
    id: q.id,
    questionNumber: q.questionNumber,
    part: q.part,
  }));

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-background">
      <ToeicTestHeader
        title={test.title}
        timeRemainingSeconds={timeRemaining}
        isSubmitting={finishAttemptMutation.isPending}
        onFinish={handleFinishTest}
      />

      <div className="flex flex-1 mx-auto w-full max-w-[1600px] items-start">
        {/* Main Content Area */}
        <div className="flex-1 px-4 py-8 md:px-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="h-full"
            >
              <ToeicQuestionRenderer
                question={currentQuestion}
                userAnswer={currentAnswers[currentQuestion.id]}
                onSelectOption={handleSelectOption}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <ToeicTestSidebar
          questions={questionStatuses}
          answers={currentAnswers}
          currentQuestionIndex={currentQuestionIndex}
          onNavigate={(index) => setCurrentQuestionIndex(index)}
        />
      </div>
    </div>
  );
};
