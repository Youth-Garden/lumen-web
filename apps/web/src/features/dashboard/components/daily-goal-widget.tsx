'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { RadialProgress } from '@lumen/uikit/components';
import { useProgressDashboard } from '../hooks/use-progress-dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';

export function DailyGoalWidget() {
  const t = useTranslations('Dashboard.Overview');
  const { data: progressData, isLoading } = useProgressDashboard();

  if (isLoading || !progressData) {
    return (
      <Card className="flex flex-col items-center justify-center min-h-[300px] bg-background/40 backdrop-blur-md border-white/10 shadow-lg">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-[120px] w-[120px] rounded-full bg-muted/50" />
          <div className="h-4 w-32 bg-muted/50 rounded" />
          <div className="h-3 w-48 bg-muted/50 rounded" />
        </div>
      </Card>
    );
  }

  const { todayStudyMinutes, dailyGoalMinutes } = progressData;
  const safeDailyGoal = dailyGoalMinutes > 0 ? dailyGoalMinutes : 15;
  const isGoalReached = todayStudyMinutes >= safeDailyGoal;
  const progressPercent = Math.min(Math.round((todayStudyMinutes / safeDailyGoal) * 100), 100);

  return (
    <Card className="flex flex-col min-h-[300px] bg-background/40 backdrop-blur-md border-white/10 shadow-lg overflow-hidden relative group">
      {/* Background glow effect */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 transition-colors duration-1000 ${isGoalReached ? 'bg-green-500' : 'bg-primary'}`} />
      
      <CardHeader className="relative z-10 pb-2">
        <CardTitle className="flex items-center gap-2">
          <Icons name="activity" className="h-5 w-5 text-primary" />
          Daily Goal
        </CardTitle>
        <CardDescription>
          Your learning progress for today
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center relative z-10 pt-4">
        <RadialProgress
          value={todayStudyMinutes}
          max={safeDailyGoal}
          size={160}
          strokeWidth={14}
          colorClass={isGoalReached ? 'text-green-500' : 'text-primary'}
          trackColorClass="text-primary/10 dark:text-primary/20"
          showValue={false}
          className="mb-6 drop-shadow-md"
        />
        
        {/* Value overlay inside the ring */}
        <div className="absolute top-[4.5rem] flex flex-col items-center justify-center">
          <span className="text-3xl font-black tracking-tight flex items-baseline gap-1">
            {todayStudyMinutes}
            <span className="text-sm font-medium text-muted-foreground tracking-normal">
              / {safeDailyGoal}m
            </span>
          </span>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider mt-1">
            {progressPercent}%
          </span>
        </div>

        <div className="text-center mt-2 space-y-1">
          <h4 className="font-semibold text-lg">
            {isGoalReached ? 'Goal Reached! 🏆' : 'Keep it up! 🔥'}
          </h4>
          <p className="text-sm text-muted-foreground">
            {isGoalReached 
              ? "You've hit your daily study goal. Great job!" 
              : `${safeDailyGoal - todayStudyMinutes} minutes left to reach your goal.`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
