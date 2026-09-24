import {
  LongestStreakIcon,
  StreakFreezeIcon,
} from '@/shared/components/streak-icon';
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { calculateStreakMilestone } from '../utils/streak-tracker.utils';

interface StreakMilestoneCardProps {
  streak: number;
  streakFreezes?: number;
  isLoading?: boolean;
}

export function StreakMilestoneCard({
  streak,
  streakFreezes = 0,
  isLoading = false,
}: StreakMilestoneCardProps) {
  const t = useTranslations('Dashboard.Overview');

  const milestone = useMemo(() => {
    return calculateStreakMilestone(streak);
  }, [streak]);

  if (isLoading) {
    return (
      <Card className="p-4 sm:p-5 space-y-3">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </Card>
    );
  }

  const streakUnit = streak === 1 ? t('daySingular') : t('days');
  const freezeUnit =
    streakFreezes === 1 ? t('freezeShieldSingle') : t('freezeShieldPlural');
  const longestStreakDays = Math.max(streak, 1);
  const longestStreakUnit =
    longestStreakDays === 1 ? t('daySingular') : t('days');

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader className="px-5 pt-4 pb-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Icons name="trophy" className="h-5 w-5 text-amber-500 shrink-0" />
            <div>
              <CardTitle className="text-sm font-bold font-heading text-foreground">
                {t('streakMilestoneTitle')}
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground">
                {t('streakMilestoneDesc')}
              </CardDescription>
            </div>
          </div>

          <Badge variant="warning" size="sm" className="shrink-0 font-bold">
            {t('nextMilestoneLabel', { days: milestone.nextMilestone })}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-3.5 pt-2 flex-1 flex flex-col justify-between gap-3">
        {/* Milestone Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Icons name="award" className="size-4 text-amber-500 shrink-0" />
              <span className="text-xs font-bold text-foreground">
                {streak} {streakUnit}{' '}
                <span className="text-[11px] text-muted-foreground font-normal">
                  ({milestone.progressPercent}%)
                </span>
              </span>
            </div>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 shrink-0">
              {t('daysRemainingToMilestone', { days: milestone.remainingDays })}
            </span>
          </div>

          <div className="w-full h-2 bg-muted/60 dark:bg-muted/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-amber-400 via-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{
                width:
                  milestone.progressPercent > 0
                    ? `${Math.max(6, milestone.progressPercent)}%`
                    : '0%',
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
            <span>
              {milestone.prevMilestone}{' '}
              {milestone.prevMilestone === 1 ? t('daySingular') : t('days')}
            </span>
            <span>
              {milestone.nextMilestone} {t('days')}
            </span>
          </div>
        </div>

        {/* Protection & Record Stat Mini-Tiles */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Streak Freeze Inventory */}
          <Card
            variant="muted"
            size="sm"
            className="flex-row items-center gap-2.5 p-2.5 rounded-2xl"
          >
            <div className="flex size-7 shrink-0 items-center justify-center">
              <StreakFreezeIcon size={22} />
            </div>
            <div className="min-w-0 flex-1 flex flex-col justify-center">
              <p className="text-[10px] text-muted-foreground font-medium truncate leading-tight">
                {t('streakProtection')}
              </p>
              <p className="text-xs font-bold text-foreground truncate leading-snug">
                {streakFreezes} {freezeUnit}
              </p>
            </div>
          </Card>

          {/* Longest Streak Record */}
          <Card
            variant="muted"
            size="sm"
            className="flex-row items-center gap-2.5 p-2.5 rounded-2xl"
          >
            <div className="flex size-7 shrink-0 items-center justify-center">
              <LongestStreakIcon size={22} />
            </div>
            <div className="min-w-0 flex-1 flex flex-col justify-center">
              <p className="text-[10px] text-muted-foreground font-medium truncate leading-tight">
                {t('longestStreakTitle')}
              </p>
              <p className="text-xs font-bold text-foreground truncate leading-snug">
                {longestStreakDays} {longestStreakUnit}
              </p>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
