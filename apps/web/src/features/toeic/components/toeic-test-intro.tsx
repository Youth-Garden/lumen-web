'use client';

import { useState } from 'react';
import { Button, Card } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';
import { useTranslations } from 'next-intl';

import { ExamAttemptMode } from '@/services/exam-practice/exam-practice.types';

interface ToeicTestIntroProps {
  title: string;
  questionCount: number;
  isStarting: boolean;
  onStart: (config: {
    mode: ExamAttemptMode;
    partsAttempted: number[];
    customTimeLimit: number | null;
  }) => void;
}

export const ToeicTestIntro = ({
  title,
  questionCount,
  isStarting,
  onStart,
}: ToeicTestIntroProps) => {
  const t = useTranslations('ToeicTestPlayer');

  const [mode, setMode] = useState<ExamAttemptMode>(ExamAttemptMode.FULL);
  const [selectedParts, setSelectedParts] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7,
  ]);
  const [timeMode, setTimeMode] = useState<'standard' | 'custom' | 'untimed'>(
    'standard',
  );
  const [customMinutes, setCustomMinutes] = useState(120);

  const togglePart = (part: number) => {
    setSelectedParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part],
    );
  };

  const handleStart = () => {
    let limit: number | null = null;
    if (timeMode === 'standard') {
      limit =
        mode === ExamAttemptMode.FULL
          ? 120 * 60
          : selectedParts.length * 15 * 60; // 15 mins average per part
    } else if (timeMode === 'custom') {
      limit = customMinutes * 60;
    }

    onStart({
      mode,
      partsAttempted:
        mode === ExamAttemptMode.FULL ? [1, 2, 3, 4, 5, 6, 7] : selectedParts,
      customTimeLimit: limit,
    });
  };

  return (
    <Card className="mx-auto max-w-2xl p-8 shadow-xl border border-slate-100 dark:border-slate-800 bg-card rounded-3xl space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight mb-2 text-foreground">
          {title}
        </h2>
        <p className="text-muted-foreground text-sm">
          {t('questionsCount', { count: questionCount }) ||
            `${questionCount} Questions Available`}
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border dark:border-slate-800">
        <button
          onClick={() => setMode(ExamAttemptMode.FULL)}
          className={cn(
            'py-2.5 text-sm font-semibold rounded-lg transition-all',
            mode === ExamAttemptMode.FULL
              ? 'bg-white dark:bg-slate-800 text-foreground shadow'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          Full Test Mode
        </button>
        <button
          onClick={() => setMode(ExamAttemptMode.PART)}
          className={cn(
            'py-2.5 text-sm font-semibold rounded-lg transition-all',
            mode === ExamAttemptMode.PART
              ? 'bg-white dark:bg-slate-800 text-foreground shadow'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          Practice by Parts
        </button>
      </div>

      {/* Custom Part Selection (only for PART mode) */}
      {mode === ExamAttemptMode.PART && (
        <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Select Parts to Practice
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((part) => {
              const isSelected = selectedParts.includes(part);
              return (
                <button
                  key={part}
                  onClick={() => togglePart(part)}
                  className={cn(
                    'py-2 text-xs font-semibold rounded-lg border transition-all',
                    isSelected
                      ? 'border-primary bg-primary/5 text-primary dark:border-primary/50'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground',
                  )}
                >
                  Part {part}
                </button>
              );
            })}
          </div>
          {selectedParts.length === 0 && (
            <p className="text-[10px] text-red-500 font-semibold mt-1">
              Please select at least one part.
            </p>
          )}
        </div>
      )}

      {/* Time Limit Setting */}
      <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Time Settings
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {['standard', 'custom', 'untimed'].map((tMode) => (
            <button
              key={tMode}
              onClick={() => setTimeMode(tMode as any)}
              className={cn(
                'py-2 text-xs font-semibold rounded-lg border capitalize transition-all',
                timeMode === tMode
                  ? 'border-indigo-500 bg-indigo-500/5 text-indigo-600 dark:border-indigo-500/50 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground',
              )}
            >
              {tMode}
            </button>
          ))}
        </div>

        {timeMode === 'custom' && (
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs font-semibold text-muted-foreground">
              Duration (Minutes):
            </span>
            <input
              type="number"
              min="1"
              max="240"
              value={customMinutes}
              onChange={(e) =>
                setCustomMinutes(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-20 rounded bg-background border px-2 py-1 text-xs font-bold focus:outline-none dark:border-slate-800"
            />
          </div>
        )}
      </div>

      {/* Start Button */}
      <div className="text-center pt-2">
        <Button
          size="lg"
          className="rounded-full px-12 font-bold shadow-lg hover:shadow-xl transition-shadow"
          disabled={
            isStarting ||
            (mode === ExamAttemptMode.PART && selectedParts.length === 0)
          }
          onClick={handleStart}
        >
          {isStarting ? (
            <Icons name="loader-2" className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Icons name="play" className="mr-2 h-5 w-5" />
          )}
          {t('startTest') || 'Start Attempt'}
        </Button>
      </div>
    </Card>
  );
};
