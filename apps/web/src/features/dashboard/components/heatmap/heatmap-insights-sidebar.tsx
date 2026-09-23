'use client';

import { Card } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';
import React from 'react';

import { LongestStreakIcon, StreakIcon } from '@/shared/components/streak-icon';
import type { HeatmapInsightsSidebarProps } from '../../types/heatmap.types';

export function HeatmapInsightsSidebar({
  activeYear,
  currentYear,
  streak,
  longestStreak,
  activeDaysCount,
  totalDaysInYear,
  averagePerDay,
  totalActivities,
}: HeatmapInsightsSidebarProps) {
  const t = useTranslations('Dashboard');
  const isCurrentYear = activeYear === currentYear;

  return (
    <div className="hidden lg:flex flex-col justify-between w-60 xl:w-64 border-l border-border/40 pl-5 py-0.5 shrink-0 space-y-3">
      <div>
        <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
          <Icons name="sparkles" className="h-3.5 w-3.5 text-primary" />
          {t('statsTitleYear', { year: activeYear })}
        </p>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {t('activeDaysLabel')}:
            </span>
            <span className="font-bold text-foreground">
              {t('daysValue', { count: activeDaysCount })}
              <span className="text-muted-foreground font-normal ml-1 text-[11px]">
                /{totalDaysInYear}
              </span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {t('longestStreakLabel')}:
            </span>
            <span className="font-bold text-foreground flex items-center justify-end gap-1.5">
              <div className="w-4 h-4 flex items-center justify-center shrink-0">
                <LongestStreakIcon size={16} />
              </div>
              <span>{t('daysValue', { count: longestStreak })}</span>
            </span>
          </div>

          {isCurrentYear ? (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{t('streakLabel')}:</span>
              <span className="font-bold text-foreground flex items-center justify-end gap-1.5">
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  <StreakIcon size={16} />
                </div>
                <span>{t('daysValue', { count: streak })}</span>
              </span>
            </div>
          ) : null}

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{t('avgPerDay')}:</span>
            <span className="font-bold text-primary">
              {t('activitiesValue', { count: averagePerDay })}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {t('totalActivities')}:
            </span>
            <span className="font-bold text-foreground">
              {t('activitiesValue', { count: totalActivities })}
            </span>
          </div>
        </div>
      </div>

      <Card
        variant="muted"
        size="sm"
        className="p-2.5 text-[11px] text-muted-foreground leading-relaxed"
      >
        {t('fsrsTip')}
      </Card>
    </div>
  );
}
