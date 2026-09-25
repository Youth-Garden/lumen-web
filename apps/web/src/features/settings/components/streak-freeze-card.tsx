'use client';

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';

import type { DashboardProgressResponse } from '@/services/progress';
import { StreakFreezeIcon } from '@/shared/components/streak-icon';

interface StreakFreezeCardProps {
  dashboardData?: DashboardProgressResponse;
}

export function StreakFreezeCard({ dashboardData }: StreakFreezeCardProps) {
  const t = useTranslations('Settings.streakFreeze');

  const streakFreezes = Math.min(
    Math.max(dashboardData?.streakFreezes ?? 0, 0),
    5,
  );
  const maxFreezes = 5;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/10 shrink-0 p-1">
              <StreakFreezeIcon size={28} />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">{t('title')}</CardTitle>
              <CardDescription>{t('description')}</CardDescription>
            </div>
          </div>

          <Badge variant="info" size="sm" className="gap-1.5 shrink-0">
            <Icons name="shield" className="h-3.5 w-3.5" />
            <span>
              {streakFreezes}/{maxFreezes} {t('available')}
            </span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        <div className="flex items-center gap-2">
          {Array.from({ length: maxFreezes }).map((_, index) => {
            const isFilled = index < streakFreezes;
            return (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  isFilled ? 'bg-sky-500' : 'bg-muted/40'
                }`}
              />
            );
          })}
        </div>

        <div className="flex flex-col gap-2 text-xs text-muted-foreground leading-relaxed pt-1">
          <div className="flex items-start gap-2">
            <Icons
              name="check"
              className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5"
            />
            <span>{t('dailyRewardHint')}</span>
          </div>
          <div className="flex items-start gap-2">
            <Icons
              name="shield"
              className="h-4 w-4 text-sky-500 shrink-0 mt-0.5"
            />
            <span>{t('autoProtectHint')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
