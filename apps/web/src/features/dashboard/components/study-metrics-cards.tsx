'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { StreakIcon } from '@/shared/components/streak-icon';
import { RouteEnum } from '@/shared/constants';
import { Card, CardContent, Skeleton } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';

interface StudyMetricsCardsProps {
  streak: number;
  todayStudyMinutes: number;
  dailyGoalMinutes: number;
  totalLearnedWords: number;
  dueCount: number;
  isLoading: boolean;
}

export function StudyMetricsCards({
  streak,
  todayStudyMinutes,
  dailyGoalMinutes,
  totalLearnedWords,
  dueCount,
  isLoading,
}: StudyMetricsCardsProps) {
  const t = useTranslations('Dashboard.Overview');
  const router = useRouter();

  const safeGoal = Math.max(dailyGoalMinutes, 1);
  const goalPercent = Math.min(
    Math.round((todayStudyMinutes / safeGoal) * 100),
    100,
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. ANCHOR CARD: Streak (Brand Accent Primary Surface) */}
      <Card
        onClick={() => router.push(RouteEnum.PROFILE)}
        className="rounded-3xl border-none bg-primary text-primary-foreground shadow-xs overflow-hidden relative group cursor-pointer"
      >
        <CardContent className="p-5 flex flex-col justify-between h-full space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <StreakIcon size={18} />
              <span className="text-xs font-semibold text-primary-foreground/80 tracking-wide">
                {t('studyStreak')}
              </span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground shrink-0 transition-transform group-hover:scale-105">
              <Icons name="arrow-up-right" className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-2">
            {isLoading ? (
              <Skeleton className="h-9 w-24 rounded-lg bg-primary-foreground/20" />
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-primary-foreground">
                  {streak}
                </span>
                <span className="text-sm font-semibold text-primary-foreground/80">
                  {t('days')}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary-foreground bg-primary-foreground/15 px-2.5 py-1 rounded-full w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" />
              <span>
                {todayStudyMinutes > 0
                  ? t('streakActive')
                  : t('streakInactive')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Today Study Time */}
      <Card className="rounded-3xl border-none bg-card text-card-foreground shadow-xs transition-all duration-200 hover:shadow-sm group">
        <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {t('studyTimeToday')}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/30 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors">
              <Icons name="arrow-up-right" className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-2">
            {isLoading ? (
              <Skeleton className="h-9 w-24 rounded-lg" />
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-foreground">
                  {todayStudyMinutes}
                </span>
                <span className="text-sm font-semibold text-muted-foreground">
                  /{dailyGoalMinutes}m
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-success bg-success/10 px-2.5 py-1 rounded-full w-fit">
              <span>{t('goalProgress', { percent: goalPercent })}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Total Learned Words */}
      <Card
        onClick={() => router.push(RouteEnum.VOCABULARY)}
        className="rounded-3xl border-none bg-card text-card-foreground shadow-xs transition-all duration-200 hover:shadow-sm group cursor-pointer"
      >
        <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {t('totalWordsLearned')}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/30 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors">
              <Icons name="arrow-up-right" className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-2">
            {isLoading ? (
              <Skeleton className="h-9 w-20 rounded-lg" />
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-foreground">
                  {totalLearnedWords}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {t('totalWordsCount', { count: '' }).trim()}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full w-fit">
              <span>{t('activeRetention')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Due Reviews */}
      <Card
        onClick={() => router.push(RouteEnum.STUDY)}
        className="rounded-3xl border-none bg-card text-card-foreground shadow-xs transition-all duration-200 hover:shadow-sm group cursor-pointer"
      >
        <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {t('dueTodayCount')}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/30 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors">
              <Icons name="arrow-up-right" className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-2">
            {isLoading ? (
              <Skeleton className="h-9 w-20 rounded-lg" />
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-foreground">
                  {dueCount}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {t('cards')}
                </span>
              </div>
            )}

            <div
              className={cn(
                'flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit',
                dueCount > 0
                  ? 'bg-warning/10 text-warning'
                  : 'bg-muted/40 text-muted-foreground',
              )}
            >
              <span>
                {dueCount > 0 ? t('needReviewPrompt') : t('allDonePrompt')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
