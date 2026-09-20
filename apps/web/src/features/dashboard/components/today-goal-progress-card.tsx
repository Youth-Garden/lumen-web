'use client';

import { DailyGoalDialog } from '@/features/dashboard/components/daily-goal-dialog';
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
import { usePortal } from '@lumen/uikit/portal';
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

  // Single cleanly scaled SVG ring
  const size = 96;
  const center = size / 2;
  const strokeWidth = 7;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timePercent / 100) * circumference;

  if (isLoading) {
    return (
      <Card className="rounded-3xl border-none bg-card shadow-xs p-5 space-y-4">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <Skeleton className="h-28 w-full rounded-2xl" />
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-none bg-card shadow-xs overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="p-5 pb-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Icons name="target" className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold font-heading text-foreground">
                {t('todayGoalTitle')}
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground">
                {t('todayGoalDesc')}
              </CardDescription>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => presentDailyGoalDialog()}
            title={t('setDailyGoal')}
            aria-label={t('setDailyGoal')}
          >
            <Icons name="settings" className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 flex-1 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between gap-4">
          {/* Radial Ring */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg
              width={size}
              height={size}
              className="transform -rotate-90 origin-center"
            >
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="var(--muted)"
                strokeWidth={strokeWidth}
                opacity={0.3}
              />
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={isTimeMet ? '#10B981' : 'var(--primary)'}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-base font-black font-heading tracking-tight text-foreground">
                {timePercent}%
              </span>
            </div>
          </div>

          {/* Time and Goal Numbers */}
          <div className="flex-1 space-y-1.5">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-heading font-black tracking-tight text-foreground">
                {todayStudyMinutes}
              </span>
              <span className="text-sm font-semibold text-muted-foreground">
                /{dailyGoalMinutes}m
              </span>
            </div>

            <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${timePercent}%` }}
              />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span>{t('goalProgress', { percent: timePercent })}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[11px] text-muted-foreground bg-muted/25 rounded-2xl p-2.5 px-3 flex items-center justify-between">
          <span>
            {isTimeMet
              ? t('dailyGoalReached')
              : t('keepGoingToReachGoal', {
                  minutes: Math.max(0, safeGoal - todayStudyMinutes),
                })}
          </span>
          {isTimeMet && (
            <Icons name="check" className="h-3.5 w-3.5 text-emerald-500 shrink-0 stroke-[2.5]" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
