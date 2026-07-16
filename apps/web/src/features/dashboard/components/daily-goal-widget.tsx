'use client';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  RadialProgress,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { PortalProps, usePortal } from '@lumen/uikit/portal';
import { useTranslations } from 'next-intl';
import React from 'react';
import {
  useProgressDashboard,
  useUpdateProgressSettings,
} from '../hooks/use-progress-dashboard';

export function DailyGoalDialog({ isOpen, onDismiss }: PortalProps) {
  const t = useTranslations('Dashboard.Overview');
  const { data: progressData } = useProgressDashboard();
  const updateSettings = useUpdateProgressSettings();
  const [selectedGoal, setSelectedGoal] = React.useState(15);

  React.useEffect(() => {
    if (progressData?.dailyGoalMinutes) {
      setSelectedGoal(progressData.dailyGoalMinutes);
    }
  }, [progressData?.dailyGoalMinutes, isOpen]);

  const handleSaveGoal = () => {
    updateSettings.mutate(
      { dailyGoalMinutes: selectedGoal },
      {
        onSuccess: () => {
          onDismiss?.();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('setDailyGoal')}</DialogTitle>
          <DialogDescription>{t('setDailyGoalDesc')}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 mt-4 mb-6">
          {[15, 30, 45, 60].map((minutes) => (
            <Button
              key={minutes}
              variant={selectedGoal === minutes ? 'default' : 'outline'}
              onClick={() => setSelectedGoal(minutes)}
              className="h-12 text-base"
            >
              {minutes} {t('mins')}
            </Button>
          ))}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            {t('cancel')}
          </DialogClose>
          <Button onClick={handleSaveGoal} disabled={updateSettings.isPending}>
            {updateSettings.isPending ? t('saving') : t('saveChanges')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DailyGoalWidget() {
  const t = useTranslations('Dashboard.Overview');
  const { data: progressData, isLoading } = useProgressDashboard();
  const [presentDailyGoalDialog] = usePortal(DailyGoalDialog);

  if (isLoading || !progressData) {
    return (
      <Card className="flex flex-col items-center justify-center min-h-[300px]">
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
  const progressPercent = Math.min(
    Math.round((todayStudyMinutes / safeDailyGoal) * 100),
    100,
  );

  return (
    <Card className="flex flex-col min-h-[300px] overflow-hidden relative group">
      {/* Background glow effect */}
      <div
        className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 transition-colors duration-1000 ${isGoalReached ? 'bg-green-500' : 'bg-primary'}`}
      />

      <CardHeader className="relative z-10 pb-2 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Icons name="activity" className="h-5 w-5 text-primary" />
            {t('dailyGoal')}
          </CardTitle>
          <CardDescription>{t('learningProgress')}</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => presentDailyGoalDialog()}
          className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 rounded-full"
        >
          <Icons name="settings" className="h-4 w-4" />
        </Button>
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
          className="mb-6"
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
            {isGoalReached ? t('goalReached') : t('keepItUp')}
          </h4>
          <p className="text-sm text-muted-foreground">
            {isGoalReached
              ? t('goalReachedDesc')
              : t('minutesLeft', {
                  minutes: safeDailyGoal - todayStudyMinutes,
                })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
