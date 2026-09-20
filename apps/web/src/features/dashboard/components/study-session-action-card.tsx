'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React from 'react';

import { StreakIcon } from '@/shared/components/streak-icon';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { RouteEnum } from '@/shared/constants';

interface StudySessionActionCardProps {
  dueCount: number;
  todayStudyMinutes: number;
  dailyGoalMinutes: number;
  streak: number;
  isLoading?: boolean;
}

export function StudySessionActionCard({
  dueCount,
  todayStudyMinutes,
  dailyGoalMinutes,
  streak,
  isLoading = false,
}: StudySessionActionCardProps) {
  const t = useTranslations('Dashboard.Overview');
  const router = useRouter();
  const safeGoal = Math.max(dailyGoalMinutes, 1);
  const goalPercent = Math.min(
    100,
    Math.round((todayStudyMinutes / safeGoal) * 100),
  );

  if (isLoading) {
    return (
      <Card className="rounded-3xl border-none bg-card shadow-xs p-6 space-y-4 h-full flex flex-col justify-between">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-none bg-card shadow-xs overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icons name="sparkles" className="h-4 w-4" />
              </div>
              <CardTitle className="text-base font-bold font-heading text-foreground">
                {t('dailyGoal')}
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              {t('learningProgress')}
            </CardDescription>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center gap-1.5 shrink-0">
            <StreakIcon size={14} />
            {streak} {t('days')}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1 flex-1 flex flex-col justify-between">
        {/* Daily Goal Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{t('dailyGoal')}</span>
            <span className="font-bold text-foreground">
              {todayStudyMinutes}/{dailyGoalMinutes}m{' '}
              <span className="text-muted-foreground font-normal">
                ({goalPercent}%)
              </span>
            </span>
          </div>
          <div className="w-full h-2 bg-muted/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${goalPercent}%` }}
            />
          </div>
        </div>

        {/* Due Cards Status Prompt */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/40">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-foreground">
              {dueCount > 0
                ? t('reminderDescDue', { count: dueCount })
                : t('reminderDescAllDone')}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {dueCount > 0 ? t('needReviewPrompt') : t('allDonePrompt')}
            </p>
          </div>

          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl ${
              dueCount > 0
                ? 'bg-warning/15 text-warning'
                : 'bg-success/15 text-success'
            }`}
          >
            <Icons
              name={dueCount > 0 ? 'clock' : 'check'}
              className="h-4 w-4"
            />
          </div>
        </div>

        {/* Action Button */}
        {dueCount > 0 ? (
          <Button
            variant="default"
            onClick={() => router.push(RouteEnum.STUDY)}
            className="w-full"
          >
            <Icons name="play" className="h-4 w-4 mr-1.5" />
            {t('startReview', { count: dueCount })}
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => router.push(RouteEnum.VOCABULARY)}
            className="w-full"
          >
            <Icons name="book-open" className="h-4 w-4 mr-1.5" />
            {t('exploreNewWords')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
