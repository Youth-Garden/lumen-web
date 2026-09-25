'use client';

import { DailyGoalDialog } from '@/features/dashboard/components/daily-goal-dialog';
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  IconButton,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { usePortal } from '@lumen/uikit/portal';
import { cn } from '@lumen/uikit/utils';
import { useTranslations } from 'next-intl';

interface TodayGoalProgressCardProps {
  todayStudyMinutes: number;
  dailyGoalMinutes: number;
  isLoading?: boolean;
}

export function TodayGoalProgressCard({
  todayStudyMinutes,
  dailyGoalMinutes,
  isLoading = false,
}: TodayGoalProgressCardProps) {
  const t = useTranslations('Dashboard.Overview');
  const [presentDailyGoalDialog] = usePortal(DailyGoalDialog);

  const safeGoal = Math.max(dailyGoalMinutes, 1);
  const timePercent = Math.min(
    100,
    Math.round((todayStudyMinutes / safeGoal) * 100),
  );
  const isTimeMet = todayStudyMinutes >= safeGoal;
  const minutesRemaining = Math.max(0, safeGoal - todayStudyMinutes);

  if (isLoading) {
    return (
      <Card className="h-full flex flex-col justify-between">
        <CardHeader className="px-5 pt-3.5 pb-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-5 w-5 rounded-full shrink-0" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-3 w-36 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-7 w-7 rounded-lg" />
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-3.5 pt-3 flex-1 flex flex-col justify-between gap-3">
          <div className="space-y-2.5">
            <div className="flex items-end justify-between gap-2">
              <div className="flex items-baseline gap-1.5">
                <Skeleton className="h-8 w-14 rounded-lg" />
                <Skeleton className="h-4 w-10 rounded-md" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="w-full h-2.5 rounded-full" />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-muted/20">
              <Skeleton className="h-3.5 w-3.5 rounded-full shrink-0" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-2.5 w-12 rounded" />
                <Skeleton className="h-3 w-8 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-muted/20">
              <Skeleton className="h-3.5 w-3.5 rounded-full shrink-0" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-2.5 w-12 rounded" />
                <Skeleton className="h-3 w-8 rounded" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col justify-between relative overflow-hidden bg-linear-to-br from-card via-card to-primary/5 dark:to-primary/10">
      {/* Ambient background glow spot */}
      <div
        className={cn(
          'absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700',
          isTimeMet ? 'bg-emerald-500' : 'bg-primary',
        )}
      />

      <CardHeader className="px-5 pt-3.5 pb-0 relative z-10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Icons name="target" className="h-5 w-5 text-primary shrink-0" />
            <div>
              <CardTitle className="text-sm font-bold font-heading text-foreground">
                {t('todayGoalTitle')}
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground">
                {t('todayGoalDesc')}
              </CardDescription>
            </div>
          </div>

          <IconButton
            onClick={() => presentDailyGoalDialog()}
            title={t('setDailyGoal')}
            aria-label={t('setDailyGoal')}
          >
            <Icons name="settings" className="h-3.5 w-3.5" />
          </IconButton>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-3.5 pt-3 flex-1 flex flex-col justify-between gap-3 relative z-10">
        {/* Core Metric Display: Big Bold Numbers + Status Badge */}
        <div className="space-y-2.5">
          <div className="flex items-end justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-heading font-black tracking-tight text-foreground leading-none">
                {todayStudyMinutes}
              </span>
              <span className="text-sm font-bold text-muted-foreground">
                /{safeGoal}m
              </span>
            </div>

            <Badge
              variant={isTimeMet ? 'success' : 'default'}
              size="default"
              className="font-bold flex items-center gap-1.5 px-3 py-1 text-xs shrink-0"
            >
              {isTimeMet ? (
                <>
                  <Icons name="check" className="h-3.5 w-3.5 stroke-[3]" />
                  <span>100%</span>
                </>
              ) : (
                <span>{timePercent}%</span>
              )}
            </Badge>
          </div>

          {/* High-Contrast Gradient Progress Bar */}
          <div className="w-full h-2.5 bg-muted/40 rounded-full overflow-hidden p-0.5 relative">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-700 ease-out shadow-2xs',
                isTimeMet
                  ? 'bg-linear-to-r from-emerald-500 to-teal-400'
                  : 'bg-linear-to-r from-primary via-indigo-500 to-emerald-400',
              )}
              style={{
                width: timePercent > 0 ? `${Math.max(timePercent, 4)}%` : '0%',
              }}
            />
          </div>
        </div>

        {/* Clean Bento Footer Chips */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <Card
            variant="muted"
            size="sm"
            className="flex-row items-center gap-2 px-2.5 py-1.5"
          >
            <Icons name="clock" className="h-3.5 w-3.5 text-primary shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-muted-foreground truncate leading-tight">
                {t('studyTimeProgress')}
              </span>
              <span className="text-xs font-bold text-foreground truncate leading-tight">
                {todayStudyMinutes}m
              </span>
            </div>
          </Card>

          <Card
            variant="muted"
            size="sm"
            className="flex-row items-center gap-2 px-2.5 py-1.5"
          >
            <Icons
              name={isTimeMet ? 'sparkles' : 'flame'}
              className={cn(
                'h-3.5 w-3.5 shrink-0',
                isTimeMet ? 'text-emerald-500' : 'text-amber-500',
              )}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-muted-foreground truncate leading-tight">
                {isTimeMet ? t('dailyGoalReached') : t('streakActive')}
              </span>
              <span className="text-xs font-bold text-foreground truncate leading-tight">
                {isTimeMet
                  ? '100%'
                  : `${minutesRemaining}m ${t('days').slice(0, 0)}`}
              </span>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
