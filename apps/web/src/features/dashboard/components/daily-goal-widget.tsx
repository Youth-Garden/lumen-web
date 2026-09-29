'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  IconButton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { usePortal } from '@lumen/uikit/portal';
import { cn } from '@lumen/uikit/utils';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { useProgressDashboard } from '../hooks/use-progress-dashboard';
import { DailyGoalDialog } from './daily-goal-dialog';

export function DailyGoalWidget() {
  const t = useTranslations('Dashboard.Overview');
  const { data: progressData, isLoading } = useProgressDashboard();
  const [presentDailyGoalDialog] = usePortal(DailyGoalDialog);

  const { todayStudyMinutes = 0, dailyGoalMinutes = 15 } = progressData || {};
  const safeDailyGoal = dailyGoalMinutes > 0 ? dailyGoalMinutes : 15;
  const isGoalReached = todayStudyMinutes >= safeDailyGoal;
  const progressPercent = Math.min(
    Math.round((todayStudyMinutes / safeDailyGoal) * 100),
    100,
  );

  const chartData = useMemo(() => {
    const completedVal = Math.min(todayStudyMinutes, safeDailyGoal);
    const remainingVal = Math.max(0, safeDailyGoal - todayStudyMinutes);
    return [
      {
        name: 'completed',
        value: completedVal,
        fill: isGoalReached ? 'var(--success)' : 'var(--primary)',
      },
      {
        name: 'remaining',
        value: remainingVal,
        fill: 'var(--muted)',
      },
    ];
  }, [todayStudyMinutes, safeDailyGoal, isGoalReached]);

  if (isLoading || !progressData) {
    return (
      <Card className="p-5 flex flex-col items-center justify-center min-h-[220px]">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="h-28 w-28 rounded-full bg-muted/40" />
          <div className="h-3.5 w-24 bg-muted/40 rounded" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5 flex flex-col justify-between overflow-hidden relative">
      {/* Background glow effect */}
      <div
        className={cn(
          'absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-15 pointer-events-none transition-colors duration-1000',
          isGoalReached ? 'bg-success' : 'bg-primary',
        )}
      />

      {/* Header */}
      <CardHeader className="p-0 pb-1 relative z-10 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-foreground">
            {t('dailyGoal')}
          </CardTitle>
        </div>
        <IconButton
          onClick={() => presentDailyGoalDialog()}
          aria-label={t('setDailyGoal')}
          title={t('setDailyGoal')}
        >
          <Icons name="settings" className="h-4 w-4" />
        </IconButton>
      </CardHeader>

      {/* Semi-Circle Arc Gauge */}
      <div className="relative w-full h-32 flex items-center justify-center z-10 -mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={0}
              innerRadius="72%"
              outerRadius="96%"
              paddingAngle={2}
              cornerRadius={4}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.fill}
                  opacity={entry.name === 'remaining' ? 0.75 : 1}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center overlay label */}
        <div className="absolute inset-x-0 bottom-2 flex flex-col items-center justify-center pointer-events-none select-none">
          <span className="text-2xl font-black font-heading tracking-tight text-foreground">
            {progressPercent}%
          </span>
          <span className="text-[11px] font-semibold text-muted-foreground">
            {todayStudyMinutes}/{safeDailyGoal}m
          </span>
        </div>
      </div>

      {/* Minimalist Legend Dots */}
      <div className="flex items-center justify-center gap-4 text-xs pt-2 z-10">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'h-2 w-2 rounded-full',
              isGoalReached ? 'bg-success' : 'bg-primary',
            )}
          />
          <span className="text-[11px] text-muted-foreground">
            {t('studiedMinutes')}:{' '}
            <strong className="text-foreground font-semibold">
              {todayStudyMinutes}m
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-muted" />
          <span className="text-[11px] text-muted-foreground">
            {isGoalReached ? (
              <span className="text-success font-bold">
                {t('goalReachedDesc')}
              </span>
            ) : (
              <>
                {t('remaining')}:{' '}
                <strong className="text-foreground font-semibold">
                  {safeDailyGoal - todayStudyMinutes}m
                </strong>
              </>
            )}
          </span>
        </div>
      </div>
    </Card>
  );
}
