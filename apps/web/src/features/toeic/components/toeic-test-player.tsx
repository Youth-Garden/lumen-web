'use client';

import { Icons } from '@lumen/uikit/icons';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  useFinishExamAttempt,
  useStartExamAttempt,
  useSubmitExamAnswer,
} from '@/features/exam-practice/hooks/use-exam-practice';
import { RouteEnum } from '@/shared/constants/route';
import { useCountdown } from '@/shared/hooks';
import { useGetToeicTestById } from '../hooks/use-toeic';

import { ToeicQuestionRenderer } from './player/toeic-question-renderer';
import { ToeicTestHeader } from './player/toeic-test-header';
import { ToeicTestSidebar } from './player/toeic-test-sidebar';
import { ToeicTestIntro } from './toeic-test-intro';

interface ToeicTestPlayerProps {
  testId: string;
}

export const ToeicTestPlayer = ({ testId }: ToeicTestPlayerProps) => {
  const router = useRouter();
  const t = useTranslations('ToeicTestPlayer');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const form = useForm<{ answers: Record<string, string> }>({
    defaultValues: { answers: {} },
  });

  const { data: test, isLoading, isError } = useGetToeicTestById(testId);
  const startAttemptMutation = useStartExamAttempt();

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const submitAnswerMutation = useSubmitExamAnswer(attemptId);
  const finishAttemptMutation = useFinishExamAttempt(attemptId);

  const handleFinishTest = () => {
    finishAttemptMutation.mutate(undefined, {
      onSuccess: () => setIsFinished(true),
    });
  };

  const { secondsRemaining: timeRemaining, start: startTimer } = useCountdown({
    initialSeconds: 120 * 60,
    autoStart: false,
    onComplete: handleFinishTest,
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
              onSuccess: (data) => {
                setAttemptId(data.id);
                startTimer();
              },
            },
          );
        }}
      />
    );
  }

  // Test Completed Screen
  if (isFinished) {
    const totalQuestions = test.questions.length;
    const answeredCount = Object.keys(form.getValues().answers || {}).length;

    return (
      <div className="flex h-screen items-center justify-center bg-slate-50/50 dark:bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 bg-card rounded-2xl shadow-lg border text-center space-y-6"
        >
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Icons name="check-circle" className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            Test Completed!
          </h2>
          <p className="text-muted-foreground text-lg">
            You have successfully finished the test.
          </p>
          <div className="bg-muted p-4 rounded-xl flex justify-between items-center text-sm">
            <span className="font-medium">Questions Answered:</span>
            <span className="font-bold text-primary">
              {answeredCount} / {totalQuestions}
            </span>
          </div>
          <button
            onClick={() => router.push(RouteEnum.DASHBOARD)}
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
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
