'use client';

import { useTranslations } from 'next-intl';

import { Button, Card } from '@lumen/uikit/components';
import { Icons, PlantGrowthIcon } from '@lumen/uikit/icons';
import { SegmentedMasteryGauge } from './segmented-mastery-gauge';

interface MasteryOverviewCardProps {
  totalWords: number;
  learnedWords: number;
  dueCount: number;
  onReviewDue: () => void;
  onReviewAll: () => void;
  onFlashcards?: () => void;
}

export function MasteryOverviewCard({
  totalWords,
  learnedWords,
  dueCount,
  onReviewDue,
  onReviewAll,
  onFlashcards,
}: MasteryOverviewCardProps) {
  const t = useTranslations('Vocabulary.Folders');
  const tMastery = useTranslations('Vocabulary.Mastery');
  const stage1 = Math.max(1, Math.round(learnedWords * 0.08));
  const stage2 = Math.max(1, Math.round(learnedWords * 0.15));
  const stage3 = Math.max(2, Math.round(learnedWords * 0.25));
  const stage4 = Math.max(2, Math.round(learnedWords * 0.22));
  const stage5 = Math.max(0, learnedWords - stage1 - stage2 - stage3 - stage4);

  const stages = [
    { level: 1, count: stage1, label: tMastery('stageLevel1') },
    { level: 2, count: stage2, label: tMastery('stageLevel2') },
    { level: 3, count: stage3, label: tMastery('stageLevel3') },
    { level: 4, count: stage4, label: tMastery('stageLevel4') },
    { level: 5, count: stage5, label: tMastery('stageLevel5') },
  ];

  return (
    <Card className="rounded-3xl border-none bg-card p-5 shadow-sm space-y-3">
      {/* Header using Lumen primary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-primary">
            {learnedWords}
          </span>
          <span className="text-base font-bold text-foreground">
            {tMastery('learnedWordsCount', { count: '' }).trim()}
          </span>
        </div>
        <Icons name="chevron-right" className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* 5 Segmented Gauges with progressive active segments */}
      <div className="grid grid-cols-5 gap-1">
        {stages.map((stage) => (
          <SegmentedMasteryGauge
            key={stage.label}
            level={stage.level}
            count={stage.count}
            label={stage.label}
          />
        ))}
      </div>

      {/* Needs Review Alert Row */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold">
        <div className="flex items-center gap-2">
          <PlantGrowthIcon
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
          <Icons name="rotate-ccw" className="h-3.5 w-3.5" />
          <span>{t('reviewNormal')}</span>
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
