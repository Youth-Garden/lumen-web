'use client';

import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { usePortal } from '@lumen/uikit/portal';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  useFinishExamAttempt,
  useGetExamAttemptDetail,
  usePauseExamAttempt,
  useStartExamAttempt,
  useSubmitExamAnswer,
} from '@/features/exam-practice/hooks/use-exam-practice';
import {
  ExamAttemptMode,
  ExamType,
  TestPlayerMode,
} from '@/services/exam-practice/exam-practice.types';
import { ToeicQuestionDto } from '@/services/toeic';
import { useCountdown } from '@lumen/hooks';

import { RouteEnum } from '@/shared/constants';
import { formatUrl } from '@lumen/shared-api';
import { useGetToeicTestById } from '../hooks/use-toeic';
import { ToeicResultDashboard } from './analytics/toeic-result-dashboard';
import { ToeicNotePanel } from './player/toeic-note-panel';
import { ToeicQuestionGroupRenderer } from './player/toeic-question-group-renderer';
import { ToeicTestHeader } from './player/toeic-test-header';
import { ToeicTestSidebar } from './player/toeic-test-sidebar';
import {
  ConfirmDialogActionEnum,
  ToeicTestConfirmDialog,
} from './toeic-test-confirm-dialog';
import { ToeicTestIntro } from './toeic-test-intro';

interface ToeicTestPlayerProps {
  testId: string;
  initialAttemptId?: string;
  isReviewMode?: boolean;
}

export const ToeicTestPlayer = ({
  testId,
  initialAttemptId,
  isReviewMode,
}: ToeicTestPlayerProps) => {
  const router = useRouter();
  const t = useTranslations('ToeicTestPlayer');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(
    new Set(),
  );
  const [showNotePanel, setShowNotePanel] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<string | undefined>(
    undefined,
  );

  const form = useForm<{ answers: Record<string, string> }>({
    defaultValues: { answers: {} },
  });

  const { data: test, isLoading, isError } = useGetToeicTestById(testId);
  const startAttemptMutation = useStartExamAttempt();

  const [attemptId, setAttemptId] = useState<string | null>(
    initialAttemptId || null,
  );
  const [mode, setMode] = useState<TestPlayerMode>(
    isReviewMode ? TestPlayerMode.REVIEW : TestPlayerMode.TEST,
  );
  const submitAnswerMutation = useSubmitExamAnswer(attemptId);
  const finishAttemptMutation = useFinishExamAttempt(attemptId || '');
  const pauseAttemptMutation = usePauseExamAttempt(attemptId || '');
  const { data: attemptDetail } = useGetExamAttemptDetail(attemptId || '');

  const handleFinishTest = () => {
    finishAttemptMutation.mutate(undefined, {
      onSuccess: () => {
        router.push(
          formatUrl(
            RouteEnum.EXAM_RESULT,
            { id: testId },
            { attemptId: attemptId ?? '' },
          ),
        );
      },
    });
  };

  const {
    secondsRemaining: timeRemaining,
    start: startTimer,
    pause: pauseTimer,
    reset: resetTimer,
    isActive: isTimerActive,
  } = useCountdown({
    initialSeconds: 120 * 60,
    autoStart: false,
    onComplete: handleFinishTest,
  });

  // Track if we've initialized the timer from an existing attempt
  const [timerInitialized, setTimerInitialized] = useState(false);

  useEffect(() => {
    if (attemptDetail && !timerInitialized && attemptId) {
      if (isReviewMode) {
        const answersRecord: Record<string, string> = {};
        attemptDetail.answers.forEach((a) => {
          answersRecord[a.questionId] = a.userAnswer;
        });
        form.reset({ answers: answersRecord });
      } else {
        // Resuming an attempt or page refresh
        const totalSecs = attemptDetail.customTimeLimit ?? 120 * 60;
        const remaining = Math.max(0, totalSecs - attemptDetail.elapsedSeconds);

        // Only auto-start if not review mode and status is IN_PROGRESS
        if (attemptDetail.status === 'IN_PROGRESS') {
          resetTimer(remaining);
          startTimer();

          // Also restore answers
          const answersRecord: Record<string, string> = {};
          attemptDetail.answers.forEach((answer) => {
            answersRecord[answer.questionId] = answer.userAnswer;
          });
          form.reset({ answers: answersRecord });
        }
      }
      setTimerInitialized(true);
    }
  }, [
    isReviewMode,
    attemptDetail,
    form,
    attemptId,
    timerInitialized,
    resetTimer,
    startTimer,
  ]);

  const [presentConfirmDialog] = usePortal(ToeicTestConfirmDialog);

  const confirmAction = async () => {
    const totalSecs = attemptDetail?.customTimeLimit ?? 120 * 60;
    const elapsed = totalSecs - timeRemaining;

    await pauseAttemptMutation.mutateAsync(elapsed);
    router.push(RouteEnum.TOEIC);
  };

  const handlePauseToggle = () => {
    presentConfirmDialog({
      action: ConfirmDialogActionEnum.PAUSE,
      onConfirm: confirmAction,
    });
  };

  const handleExit = () => {
    presentConfirmDialog({
      action: ConfirmDialogActionEnum.EXIT,
      onConfirm: confirmAction,
    });
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
        onStart={(config) => {
          startAttemptMutation.mutate(
            {
              testId,
              testType: ExamType.TOEIC,
              mode: config.mode,
              partsAttempted: config.partsAttempted,
              customTimeLimit: config.customTimeLimit || undefined,
            },
            {
              onSuccess: (data) => {
                setAttemptId(data.id);
                if (config.customTimeLimit) {
                  resetTimer(config.customTimeLimit);
                } else if (
                  config.customTimeLimit === null &&
                  config.mode === ExamAttemptMode.PART
                ) {
                  resetTimer(config.partsAttempted.length * 15 * 60);
                } else {
                  resetTimer(120 * 60);
                }
                startTimer();
              },
            },
          );
        }}
      />
    );
  }

  const displayQuestions =
    attemptDetail?.mode === ExamAttemptMode.RETEST && attemptDetail.questionIds
      ? test.questions.filter((question) =>
          attemptDetail.questionIds!.includes(question.id),
        )
      : (test?.questions ?? []);

  // Test Completed Screen
  if (mode === TestPlayerMode.RESULT) {
    return (
      <div className="flex min-h-screen bg-slate-50/50 dark:bg-background">
        <ToeicResultDashboard
          questions={displayQuestions}
          userAnswers={form.getValues().answers || {}}
          timeSpentSeconds={120 * 60 - timeRemaining}
          onReview={() => setMode(TestPlayerMode.REVIEW)}
        />
      </div>
    );
  }

  // Grouping logic
  const groups: ToeicQuestionDto[][] = [];
  if (displayQuestions.length > 0) {
    let currentGroup: ToeicQuestionDto[] = [];
    let lastContext: {
      audioUrl?: string;
      imageUrl?: string;
      transcript?: string;
    } | null = null;

    displayQuestions.forEach((question) => {
      const hasContext = !!(
        question.audioUrl ||
        question.imageUrl ||
        question.transcript
      );
      const isSameContext =
        hasContext &&
        lastContext &&
        question.audioUrl === lastContext.audioUrl &&
        question.imageUrl === lastContext.imageUrl &&
        question.transcript === lastContext.transcript;

      if (isSameContext) {
        currentGroup.push(question);
      } else {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
        }
        currentGroup = [question];
        lastContext = hasContext
          ? {
              audioUrl: question.audioUrl,
              imageUrl: question.imageUrl,
              transcript: question.transcript,
            }
          : null;
      }
    });
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }
  }

  const currentGroup = groups[currentQuestionIndex] ?? [];
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
    const targetQuestion = displayQuestions[index];
    if (targetQuestion) {
      const groupIndex = groups.findIndex((g) =>
        g.some((q) => q.id === targetQuestion.id),
      );
      if (groupIndex !== -1) {
        setCurrentQuestionIndex(groupIndex);
      }
    }
  };

  const questionStatuses = displayQuestions.map((q) => ({
    id: q.id,
    questionNumber: q.questionNumber,
    part: q.part,
    correctAnswer: q.correctAnswer,
  }));

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-background">
      {mode === TestPlayerMode.REVIEW ? (
        <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
            <h1 className="truncate text-lg font-semibold md:text-xl">
              {test.title} - {t('reviewMode')}
            </h1>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowNotePanel(!showNotePanel)}
                variant={showNotePanel ? 'default' : 'outline'}
                className="gap-2"
              >
                <Icons name="book-open" className="h-4 w-4" />
                Notes
              </Button>
              <Button
                onClick={() => setMode(TestPlayerMode.RESULT)}
                variant="outline"
              >
                <Icons name="arrow-left" className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
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

      {mode === TestPlayerMode.TEST && !isTimerActive && attemptId !== null ? (
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
        <div className="flex flex-1 mx-auto w-full max-w-[1600px] items-start relative">
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
                    isReviewMode={mode === TestPlayerMode.REVIEW}
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
                    onTakeNote={(quote) => {
                      setCurrentQuote(quote);
                      setShowNotePanel(true);
                    }}
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
            isReviewMode={mode === TestPlayerMode.REVIEW}
            currentQuestionIndices={currentGroup.map((questionInGroup) =>
              displayQuestions.findIndex(
                (targetQuestion) => targetQuestion.id === questionInGroup.id,
              ),
            )}
            onNavigate={handleNavigateQuestion}
          />

          {/* Notes Sidebar Drawer */}
          {showNotePanel && currentGroup[0] && (
            <ToeicNotePanel
              questionId={currentGroup[0].id}
              testId={testId}
              initialQuote={currentQuote}
              onClose={() => {
                setShowNotePanel(false);
                setCurrentQuote(undefined);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};
