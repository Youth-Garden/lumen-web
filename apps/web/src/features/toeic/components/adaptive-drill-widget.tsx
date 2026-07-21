'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button, Card } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import {
  useAdaptiveDrill,
  useSubmitDrill,
} from '../hooks/use-adaptive-learning';

export const AdaptiveDrillWidget = () => {
  const t = useTranslations('AdaptiveLearning');
  const { refetch, isFetching, data: drill } = useAdaptiveDrill();
  const { mutateAsync: submitDrill, isPending: isSubmitting } =
    useSubmitDrill();

  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number | null>(
    null,
  );
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleStartDrill = async () => {
    const res = await refetch();
    if (res.data) {
      setActiveQuestionIdx(0);
      setSelectedAnswers({});
      setIsSubmitted(false);
    }
  };

  const currentQuestion =
    drill && activeQuestionIdx !== null
      ? drill.questions[activeQuestionIdx]
      : null;

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-card to-card p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
            <Icons name="zap" className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground leading-tight">
              {t('startSmartDrill')}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              5 questions targeting your weakest TOEIC Parts
            </p>
          </div>
        </div>

        <Button
          size="lg"
          className="rounded-xl font-semibold shadow-md shadow-primary/20"
          onClick={handleStartDrill}
          disabled={isFetching}
        >
          {isFetching ? (
            <Icons name="loader-2" className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Icons name="play" className="h-4 w-4 mr-2" />
          )}
          {t('startSmartDrill')}
        </Button>
      </div>

      {/* Drill Question Modal / Inline Player */}
      {drill && activeQuestionIdx !== null && currentQuestion && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Question {activeQuestionIdx + 1} of {drill.questions.length} (Part{' '}
              {currentQuestion.partNumber})
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setActiveQuestionIdx(null)}
            >
              <Icons name="close" className="h-4 w-4" />
            </Button>
          </div>

          <div className="bg-card p-4 rounded-xl border mb-4">
            <p className="font-medium text-foreground text-base leading-relaxed">
              {currentQuestion.prompt}
            </p>
          </div>

          <div className="space-y-2 mb-6">
            {currentQuestion.options.map((option, optIdx) => {
              const optionLetter = String.fromCharCode(65 + optIdx);
              const isSelected =
                selectedAnswers[activeQuestionIdx] === optionLetter;

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() =>
                    setSelectedAnswers((prev) => ({
                      ...prev,
                      [activeQuestionIdx]: optionLetter,
                    }))
                  }
                  className={`w-full flex items-center p-3 rounded-xl border text-left text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-primary/10 border-primary text-primary shadow-sm'
                      : 'bg-card border-border hover:bg-muted/50 text-foreground'
                  }`}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-xs font-bold mr-3">
                    {optionLetter}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={activeQuestionIdx === 0}
              onClick={() =>
                setActiveQuestionIdx((prev) => (prev !== null ? prev - 1 : 0))
              }
            >
              Previous
            </Button>

            {activeQuestionIdx < drill.questions.length - 1 ? (
              <Button
                size="sm"
                onClick={() =>
                  setActiveQuestionIdx((prev) => (prev !== null ? prev + 1 : 0))
                }
              >
                Next
              </Button>
            ) : (
              <Button
                size="sm"
                disabled={isSubmitting}
                onClick={async () => {
                  await submitDrill({ answers: selectedAnswers });
                  setIsSubmitted(true);
                  setActiveQuestionIdx(null);
                }}
              >
                {isSubmitting ? (
                  <Icons
                    name="loader-2"
                    className="h-4 w-4 animate-spin mr-2"
                  />
                ) : null}
                Submit Drill
              </Button>
            )}
          </div>
        </div>
      )}

      {isSubmitted && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold flex items-center gap-2">
          <Icons name="check-circle" className="h-5 w-5" />
          {t('drillCompleted')}
        </div>
      )}
    </Card>
  );
};
