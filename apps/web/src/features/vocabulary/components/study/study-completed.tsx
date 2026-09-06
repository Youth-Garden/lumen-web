'use client';

import { useTranslations } from 'next-intl';
import { PlantGrowthIcon } from '@lumen/uikit/icons';
import { Button } from '@lumen/uikit/components';

interface StudyCompletedProps {
  totalInBatch: number;
  gotItCount: number;
  reviewCount: number;
  onRestart: () => void;
  onClose: () => void;
}

export function StudyCompleted({ totalInBatch, gotItCount, reviewCount, onRestart, onClose }: StudyCompletedProps) {
  const t = useTranslations('Vocabulary.Study');

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-5 animate-in zoom-in-95 duration-300">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 shadow-lg">
        <PlantGrowthIcon stage={5} className="w-14 h-14" />
      </div>
      <div className="space-y-1">
        <h3 className="text-3xl font-black text-foreground">{t('completedTitle')}</h3>
        <p className="text-sm text-muted-foreground max-w-sm">{t('completedDescription', { count: totalInBatch })}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-xs pt-2">
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-2xl font-black text-emerald-600">{gotItCount}</p>
          <p className="text-xs font-semibold text-muted-foreground uppercase mt-0.5">{t('gotIt')}</p>
        </div>
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <p className="text-2xl font-black text-rose-600">{reviewCount}</p>
          <p className="text-xs font-semibold text-muted-foreground uppercase mt-0.5">{t('needReview')}</p>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button variant="outline" onClick={onRestart}>
          {t('studyAgain')}
        </Button>
        <Button onClick={onClose}>{t('done')}</Button>
      </div>
    </div>
  );
}
