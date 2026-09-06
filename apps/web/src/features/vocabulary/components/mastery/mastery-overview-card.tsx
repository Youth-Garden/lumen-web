'use client';

import { useTranslations } from 'next-intl';
import { Button, Card } from '@lumen/uikit/components';
import { Icons, PlantGrowthIcon } from '@lumen/uikit/icons';

interface MasteryOverviewCardProps {
  totalWords: number;
  learnedWords: number;
  dueCount: number;
  onReviewDue: () => void;
  onReviewAll: () => void;
}

export function MasteryOverviewCard({
  totalWords,
  learnedWords,
  dueCount,
  onReviewDue,
  onReviewAll,
}: MasteryOverviewCardProps) {
  const t = useTranslations('Vocabulary.Folders');

  const stage1 = Math.max(1, Math.round(learnedWords * 0.08));
  const stage2 = Math.max(1, Math.round(learnedWords * 0.15));
  const stage3 = Math.max(2, Math.round(learnedWords * 0.25));
  const stage4 = Math.max(2, Math.round(learnedWords * 0.22));
  const stage5 = Math.max(0, learnedWords - stage1 - stage2 - stage3 - stage4);

  const stages = [
    { count: stage1, label: t('justLearned') },
    { count: stage2, label: t('temporary') },
    { count: stage3, label: t('lastingMemory') },
    { count: stage4, label: t('memorized') },
    { count: stage5, label: t('proficient') },
  ];

  const percent = totalWords > 0 ? Math.min(100, Math.round((learnedWords / totalWords) * 100)) : 0;

  return (
    <Card className="rounded-3xl border border-border/70 bg-card p-6 shadow-xs flex flex-col justify-between space-y-6">
      {/* Header: Progress Summary */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-primary">
              {learnedWords}
            </span>
            <span className="text-base font-bold text-foreground">
              {t('learnedWordsTitle', { count: '' }).trim()}
            </span>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {t('totalWordsLabel', { learned: learnedWords, total: totalWords })} ({percent}%)
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted/60 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* 5 Memory Stages */}
      <div className="grid grid-cols-5 gap-2 pt-1">
        {stages.map((stage) => (
          <div
            key={stage.label}
            className="flex flex-col items-center p-2.5 rounded-2xl border border-border/50 bg-muted/20 text-center"
          >
            <span className="text-base font-black text-foreground mb-1">
              {stage.count}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground line-clamp-1">
              {stage.label}
            </span>
          </div>
        ))}
      </div>

      {/* Review Alert & Action */}
      <div className="pt-3 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            {dueCount > 0 ? (
              <span className="text-sm select-none leading-none">🔥</span>
            ) : (
              <PlantGrowthIcon stage={4} className="h-4 w-4" />
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">
              {dueCount > 0
                ? t('wordsToReviewTitle', { count: dueCount })
                : t('noWordsToReview')}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {dueCount > 0 ? t('frequentlyMissedSubtitle') : t('allMastered')}
            </p>
          </div>
        </div>

        <Button
          onClick={dueCount > 0 ? onReviewDue : onReviewAll}
          className="gap-2 rounded-2xl font-bold shadow-sm self-stretch sm:self-auto px-5"
          variant={dueCount > 0 ? 'default' : 'outline'}
        >
          <Icons name="rotate-ccw" className="h-4 w-4" />
          <span>{dueCount > 0 ? t('reviewFlashcards') : t('quickReview')}</span>
        </Button>
      </div>
    </Card>
  );
}
