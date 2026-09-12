'use client';

import { useTranslations } from 'next-intl';

import { Icons } from '@lumen/uikit/icons';
import { Button } from '@lumen/uikit/components';
import { MissedWordStat } from '@/features/study/types/study.types';

interface StudyCompletedProps {
  totalInBatch: number;
  masteredCount: number;
  missedWords: MissedWordStat[];
  onRestart: () => void;
  onClose: () => void;
}

export function StudyCompleted({
  totalInBatch,
  masteredCount,
  missedWords,
  onRestart,
  onClose,
}: StudyCompletedProps) {
  const t = useTranslations('Vocabulary.Study');
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-5 animate-in zoom-in-95 duration-300 max-w-lg w-full mx-auto">
      <div className="flex items-center justify-center">
        <Icons name="plant-growth" stage={5} className="w-16 h-16" />
      </div>

      <div className="space-y-1">
        <h3 className="text-3xl font-black text-foreground">
          {t('completedLessonTitle')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('completedLessonSubtitle', {
            mastered: masteredCount,
            total: totalInBatch,
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full pt-2">
        <div className="p-4 rounded-2xl bg-emerald-500/10">
          <p className="text-2xl font-black text-emerald-500">
            {masteredCount}
          </p>
          <p className="text-xs font-semibold text-muted-foreground uppercase mt-0.5">
            {t('masteredWordsCard')}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-rose-500/10">
          <p className="text-2xl font-black text-rose-500">
            {missedWords.length}
          </p>
          <p className="text-xs font-semibold text-muted-foreground uppercase mt-0.5">
            {t('wordsToReviewCard')}
          </p>
        </div>
      </div>

      {/* Missed words list if any */}
      {missedWords.length > 0 && (
        <div className="w-full text-left space-y-2 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Icons
              name="alert-triangle"
              className="w-3.5 h-3.5 text-rose-500"
            />
            <span>{t('missedWordsToReview')}</span>
          </div>
          <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
            {missedWords.map((item) => {
              const def = item.card.definitions?.[0];
              const meaning = def?.translationVi || def?.definitionEn || '';
              return (
                <div
                  key={item.card.id}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-muted/30 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">
                      {item.card.term}
                    </span>
                    <span className="text-muted-foreground truncate max-w-[200px]">
                      {meaning}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 font-semibold">
                    {t('missedCount', { count: item.errorCount })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex space-x-3 pt-4 w-full">
        <Button
          variant="outline"
          className="flex-1 cursor-pointer"
          onClick={onRestart}
        >
          {t('studyAgain')}
        </Button>
        <Button
          variant="default"
          className="flex-1 cursor-pointer"
          onClick={onClose}
        >
          {t('finish')}
        </Button>
      </div>
    </div>
  );
}
