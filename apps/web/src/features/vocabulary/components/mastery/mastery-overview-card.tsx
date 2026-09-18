import { useTranslations } from 'next-intl';

import { Button, Card } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';
import { SegmentedMasteryGauge } from './segmented-mastery-gauge';

interface MasteryOverviewCardProps {
  totalWords: number;
  learnedWords: number;
  dueCount: number;
  stages?: { level: number; count: number }[];
  onReviewDue: () => void;
  onReviewAll: () => void;
  onFlashcards?: () => void;
  onViewDueWords?: () => void;
}

export function MasteryOverviewCard({
  totalWords,
  learnedWords,
  dueCount,
  stages,
  onReviewDue,
  onReviewAll,
  onFlashcards,
  onViewDueWords,
}: MasteryOverviewCardProps) {
  const t = useTranslations('Vocabulary.Folders');
  const tMastery = useTranslations('Vocabulary.Mastery');
  const tStudy = useTranslations('Vocabulary.Study');

  const stageList = [
    {
      level: 1,
      count:
        stages?.find((stageItem) => stageItem.level === 1)?.count ??
        (learnedWords === 0 ? 0 : Math.round(learnedWords * 0.08)),
      label: tMastery('stageLevel1'),
    },
    {
      level: 2,
      count:
        stages?.find((stageItem) => stageItem.level === 2)?.count ??
        (learnedWords === 0 ? 0 : Math.round(learnedWords * 0.15)),
      label: tMastery('stageLevel2'),
    },
    {
      level: 3,
      count:
        stages?.find((stageItem) => stageItem.level === 3)?.count ??
        (learnedWords === 0 ? 0 : Math.round(learnedWords * 0.25)),
      label: tMastery('stageLevel3'),
    },
    {
      level: 4,
      count:
        stages?.find((stageItem) => stageItem.level === 4)?.count ??
        (learnedWords === 0 ? 0 : Math.round(learnedWords * 0.22)),
      label: tMastery('stageLevel4'),
    },
    {
      level: 5,
      count:
        stages?.find((stageItem) => stageItem.level === 5)?.count ??
        (learnedWords === 0
          ? 0
          : Math.max(
              0,
              learnedWords -
                Math.round(learnedWords * 0.08) -
                Math.round(learnedWords * 0.15) -
                Math.round(learnedWords * 0.25) -
                Math.round(learnedWords * 0.22),
            )),
      label: tMastery('stageLevel5'),
    },
  ];

  return (
    <Card className="rounded-3xl border-none bg-card p-5 shadow-sm space-y-3">
      {/* Header using Lumen primary */}
      <div
        role={onViewDueWords ? 'button' : undefined}
        tabIndex={onViewDueWords ? 0 : undefined}
        onClick={onViewDueWords}
        onKeyDown={
          onViewDueWords
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onViewDueWords();
                }
              }
            : undefined
        }
        className={cn(
          'flex items-center justify-between outline-none focus:outline-none focus-visible:outline-none',
          onViewDueWords &&
            'cursor-pointer group hover:opacity-80 transition-opacity select-none'
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-primary">
            {learnedWords}
          </span>
          <span className="text-base font-bold text-foreground">
            {tMastery('learnedWordsCount', { count: '' }).trim()}
          </span>
        </div>
        {onViewDueWords ? (
          <div
            className="p-1 rounded-full text-muted-foreground group-hover:text-foreground transition-colors"
            aria-label={t('viewDueWordsHint')}
            title={t('viewDueWordsHint')}
          >
            <Icons name="chevron-right" className="h-4 w-4" />
          </div>
        ) : (
          <Icons
            name="chevron-right"
            className="h-4 w-4 text-muted-foreground"
          />
        )}
      </div>

      {/* 5 Segmented Gauges with progressive active segments */}
      <div className="grid grid-cols-5 gap-1">
        {stageList.map((stage) => (
          <SegmentedMasteryGauge
            key={stage.label}
            level={stage.level}
            count={stage.count}
            label={stage.label}
            onClick={onViewDueWords}
          />
        ))}
      </div>

      {/* Needs Review Alert Row */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold">
        <div className="flex items-center gap-2">
          <Icons
            name="plant-growth"
            stage={3}
            className="h-4 w-4 shrink-0 text-primary"
          />
          <span>
            {dueCount > 0
              ? tMastery('needsPracticeCount', { count: dueCount })
              : tMastery('practiceCompletedToday')}
          </span>
        </div>
        <Icons name="info" className="h-3.5 w-3.5 text-primary/70" />
      </div>

      {/* 2 CTA Buttons - Standard Button variants, no custom roundings */}
      <div className="grid grid-cols-2 gap-2.5">
        <Button
          variant="default"
          onClick={dueCount > 0 ? onReviewDue : onReviewAll}
          className="gap-1.5 text-xs font-semibold cursor-pointer"
        >
          {dueCount > 0 ? (
            <>
              <Icons name="sparkles" className="h-3.5 w-3.5" />
              <span>{tStudy('practice')}</span>
            </>
          ) : (
            <>
              <Icons name="play" className="h-3.5 w-3.5 fill-current" />
              <span>{tStudy('learnNew')}</span>
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={onFlashcards || onReviewAll}
          className="gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <Icons name="layers" className="h-3.5 w-3.5 text-primary" />
          <span>{t('flashcardsAction')}</span>
        </Button>
      </div>
    </Card>
  );
}
