'use client';

import { WeaknessLevelEnum } from '@/services/exam-practice/exam-practice.types';
import { Icons } from '@lumen/uikit/icons';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useWeaknessAnalysis } from '../hooks/use-adaptive-learning';
import { Card } from '@lumen/uikit/components';

export const WeaknessRadar = () => {
  const t = useTranslations('AdaptiveLearning');
  const { data, isLoading } = useWeaknessAnalysis();

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center min-h-[220px] p-6">
        <Icons name="loader-2" className="h-6 w-6 animate-spin text-primary" />
      </Card>
    );
  }

  const partMasteries = data?.partMasteries ?? [];
  const overallAccuracy = data?.overallAccuracy ?? 0;

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icons name="brain" className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground leading-tight">
              {t('title')}
            </h3>
            <p className="text-xs text-muted-foreground">{t('subtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-muted/50 px-3.5 py-1.5 rounded-xl">
          <span className="text-xs font-medium text-muted-foreground">
            {t('overallAccuracy')}:
          </span>
          <span className="text-base font-bold text-primary">
            {overallAccuracy}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {partMasteries.map((masteryItem) => {
          const isMastered =
            masteryItem.weaknessLevel === WeaknessLevelEnum.MASTERED;
          const isModerate =
            masteryItem.weaknessLevel === WeaknessLevelEnum.MODERATE;

          return (
            <div
              key={masteryItem.partNumber}
              className="p-3.5 rounded-xl bg-muted/20 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                    P{masteryItem.partNumber}
                  </span>
                  <span className="font-semibold text-sm text-foreground">
                    {masteryItem.name}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isMastered
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                      : isModerate
                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                  }`}
                >
                  {isMastered
                    ? t('statusMastered')
                    : isModerate
                      ? t('statusModerate')
                      : t('statusPractice')}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {masteryItem.correctCount} / {masteryItem.totalAttempted}{' '}
                    correct
                  </span>
                  <span className="font-bold text-foreground">
                    {masteryItem.accuracyPercentage}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${masteryItem.accuracyPercentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      isMastered
                        ? 'bg-emerald-500'
                        : isModerate
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
