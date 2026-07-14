'use client';

import { Button } from '@lumen/uikit/components';
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
import { ExamType } from '@/services/exam-practice/exam-practice.types';
import { ToeicQuestionDto } from '@/services/toeic';
import { useCountdown } from '@lumen/hooks';

import { useGetToeicTestById } from '../hooks/use-toeic';
import { ToeicResultDashboard } from './analytics/toeic-result-dashboard';
import { ToeicQuestionGroupRenderer } from './player/toeic-question-group-renderer';
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
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());

  const form = useForm<{ answers: Record<string, string> }>({
    defaultValues: { answers: {} },
  });

  const { data: test, isLoading, isError } = useGetToeicTestById(testId);
  const startAttemptMutation = useStartExamAttempt();

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [mode, setMode] = useState<'test' | 'result' | 'review'>('test');
  const submitAnswerMutation = useSubmitExamAnswer(attemptId);
  const finishAttemptMutation = useFinishExamAttempt(attemptId);

  const handleFinishTest = () => {
    finishAttemptMutation.mutate(undefined, {
      onSuccess: () => setMode('result'),
    });
  };

  const {
    secondsRemaining: timeRemaining,
    start: startTimer,
    pause: pauseTimer,
    isActive: isTimerActive,
  } = useCountdown({
    initialSeconds: 120 * 60,
    autoStart: false,
    onComplete: handleFinishTest,
  });

  const handlePauseToggle = () => {
    if (isTimerActive) pauseTimer();
    else startTimer();
  };

  const handleExit = () => {
    if (window.confirm(t('confirmExit') || 'Are you sure you want to exit?')) {
      router.push('/toeic');
    }
  };

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
            { testId, testType: ExamType.TOEIC },
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
  if (mode === 'result') {
    return (
      <div className="flex min-h-screen bg-slate-50/50 dark:bg-background">
        <ToeicResultDashboard
          questions={test.questions}
          userAnswers={form.getValues().answers || {}}
          timeSpentSeconds={120 * 60 - timeRemaining}
          onReview={() => setMode('review')}
        />
      </div>
    );
  }

  // Grouping logic
  const groups: ToeicQuestionDto[][] = [];
  if (test && test.questions) {
    let currentGroup: ToeicQuestionDto[] = [];
    let lastContext: {
      audioUrl?: string;
      imageUrl?: string;
      transcript?: string;
    } | null = null;

    test.questions.forEach((q) => {
      const hasContext = !!(q.audioUrl || q.imageUrl || q.transcript);
      const isSameContext =
        hasContext &&
        lastContext &&
        q.audioUrl === lastContext.audioUrl &&
        q.imageUrl === lastContext.imageUrl &&
        q.transcript === lastContext.transcript;

      if (isSameContext) {
        currentGroup.push(q);
      } else {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
        }
        currentGroup = [q];
        lastContext = hasContext
          ? {
              audioUrl: q.audioUrl,
              imageUrl: q.imageUrl,
              transcript: q.transcript,
            }
          : null;
      }
    });
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }
  }

  const currentGroup = groups[currentQuestionIndex] || [];
  const totalGroups = groups.length;
  const currentAnswers = form.watch('answers');

  const handleSelectOption = (questionId: string, option: string) => {
    form.setValue(`answers.${questionId}`, option);
    submitAnswerMutation.mutate({
      questionId,
      userAnswer: option,
    });
  };

  const handleToggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  const handleNavigateQuestion = (index: number) => {
    // index is the absolute question index from sidebar (0-199)
    // We need to find which group this question belongs to
    const targetQuestion = test.questions[index];
    if (targetQuestion) {
      const groupIndex = groups.findIndex((g) =>
        g.some((q) => q.id === targetQuestion.id),
      );
      if (groupIndex !== -1) {
        setCurrentQuestionIndex(groupIndex);
      }
    }
  };

  const questionStatuses = test.questions.map((q) => ({
    id: q.id,
    questionNumber: q.questionNumber,
    part: q.part,
  }));

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-background">
      {mode === 'review' ? (
        <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
            <h1 className="truncate text-lg font-semibold md:text-xl">
              {test.title} - {t('reviewMode')}
            </h1>
            <Button onClick={() => setMode('result')} variant="outline">
              <Icons name="arrow-left" className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </div>
      ) : (
        <ToeicTestHeader
          title={test.title}
          timeRemainingSeconds={timeRemaining}
          isSubmitting={finishAttemptMutation.isPending}
          isPaused={!isTimerActive && attemptId !== null}
          onFinish={handleFinishTest}
          onPauseToggle={handlePauseToggle}
          onExit={handleExit}
        />
      )}

      {mode === 'test' && !isTimerActive && attemptId !== null ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">{t('testPaused')}</h2>
            <p className="text-muted-foreground">{t('testPausedDesc')}</p>
            <Button size="lg" onClick={startTimer} className="mt-4">
              <Icons name="play" className="mr-2 h-5 w-5" />
              {t('resumeTest')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 mx-auto w-full max-w-[1600px] items-start">
          {/* Main Content Area */}
        <div className="flex-1 px-4 py-8 md:px-8 overflow-hidden h-[calc(100vh-64px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex} // Key by group index
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="h-full"
            >
              {currentGroup.length > 0 && (
                <ToeicQuestionGroupRenderer
                  questions={currentGroup}
                  userAnswers={currentAnswers}
                  flaggedQuestions={flaggedQuestions}
                  isReviewMode={mode === 'review'}
                  onSelectOption={handleSelectOption}
                  onToggleFlag={handleToggleFlag}
                  onNextGroup={() =>
                    setCurrentQuestionIndex(
                      Math.min(totalGroups - 1, currentQuestionIndex + 1),
                    )
                  }
                  onPrevGroup={() =>
                    setCurrentQuestionIndex(
                      Math.max(0, currentQuestionIndex - 1),
                    )
                  }
                  isFirstGroup={currentQuestionIndex === 0}
                  isLastGroup={currentQuestionIndex === totalGroups - 1}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <ToeicTestSidebar
          questions={questionStatuses}
          answers={currentAnswers}
          flaggedQuestions={flaggedQuestions}
          isReviewMode={mode === 'review'}
          currentQuestionIndices={currentGroup.map((q) =>
            test.questions.findIndex((tq) => tq.id === q.id),
          )}
          onNavigate={handleNavigateQuestion}
          />
        </div>
      )}
    </div>
  );
};
