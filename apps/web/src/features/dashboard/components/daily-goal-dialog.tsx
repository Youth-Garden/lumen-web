'use client';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { PortalProps } from '@lumen/uikit/portal';
import { cn } from '@lumen/uikit/utils';
import { useTranslations } from 'next-intl';
import React from 'react';
import {
  useProgressDashboard,
  useUpdateProgressSettings,
} from '../hooks/use-progress-dashboard';

interface GoalTierConfig {
  minutes: number;
  titleKey: 'goalCasual' | 'goalStandard' | 'goalAccelerated' | 'goalIntensive';
  descKey:
    | 'goalCasualDesc'
    | 'goalStandardDesc'
    | 'goalAcceleratedDesc'
    | 'goalIntensiveDesc';
  iconName: string;
  color: string;
  bgColor: string;
  isPopular?: boolean;
}

const GOAL_TIERS: GoalTierConfig[] = [
  {
    minutes: 15,
    titleKey: 'goalCasual',
    descKey: 'goalCasualDesc',
    iconName: 'coffee',
    color: 'text-sky-500',
    bgColor: 'bg-sky-500/10',
  },
  {
    minutes: 30,
    titleKey: 'goalStandard',
    descKey: 'goalStandardDesc',
    iconName: 'zap',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    isPopular: true,
  },
  {
    minutes: 45,
    titleKey: 'goalAccelerated',
    descKey: 'goalAcceleratedDesc',
    iconName: 'flame',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    minutes: 60,
    titleKey: 'goalIntensive',
    descKey: 'goalIntensiveDesc',
    iconName: 'trophy',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
];

export function DailyGoalDialog({ isOpen, onDismiss }: PortalProps) {
  const t = useTranslations('Dashboard.Overview');
  const { data: progressData } = useProgressDashboard();
  const updateSettings = useUpdateProgressSettings();

  const [selectedGoal, setSelectedGoal] = React.useState(15);
  const [isCustom, setIsCustom] = React.useState(false);
  const [customMinutes, setCustomMinutes] = React.useState('20');

  React.useEffect(() => {
    if (progressData?.dailyGoalMinutes) {
      const current = progressData.dailyGoalMinutes;
      setSelectedGoal(current);
      const isPreset = GOAL_TIERS.some((tier) => tier.minutes === current);
      if (!isPreset) {
        setIsCustom(true);
        setCustomMinutes(String(current));
      } else {
        setIsCustom(false);
      }
    }
  }, [progressData?.dailyGoalMinutes, isOpen]);

  const handleSaveGoal = () => {
    let finalMinutes = selectedGoal;
    if (isCustom) {
      const parsed = parseInt(customMinutes, 10);
      if (!isNaN(parsed) && parsed >= 5 && parsed <= 180) {
        finalMinutes = parsed;
      }
    }

    updateSettings.mutate(
      { dailyGoalMinutes: finalMinutes },
      {
        onSuccess: () => {
          onDismiss?.();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent className="sm:max-w-[480px] border-none shadow-xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icons name="target" className="h-4.5 w-4.5" />
            </div>
            <DialogTitle className="text-xl font-bold font-heading">
              {t('setDailyGoal')}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground pt-0.5">
            {t('setDailyGoalDesc')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 my-4">
          <div className="grid grid-cols-2 gap-2.5">
            {GOAL_TIERS.map((tier) => {
              const isSelected = selectedGoal === tier.minutes && !isCustom;
              return (
                <button
                  type="button"
                  key={tier.minutes}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => {
                    setSelectedGoal(tier.minutes);
                    setIsCustom(false);
                  }}
                  className={cn(
                    'group relative flex flex-col p-3 rounded-2xl text-left transition-all cursor-pointer border-none',
                    isSelected
                      ? 'bg-primary/10 text-primary shadow-xs'
                      : 'bg-muted/40 hover:bg-muted/70 text-foreground',
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'flex h-7 w-7 items-center justify-center rounded-xl shrink-0',
                          tier.bgColor,
                          tier.color,
                        )}
                      >
                        <Icons name={tier.iconName} className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-black font-heading tracking-tight text-foreground">
                        {tier.minutes} {t('mins')}
                      </span>
                    </div>
                    {tier.isPopular ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                        {t('recommended')}
                      </span>
                    ) : (
                      <span
                        className={cn(
                          'h-4 w-4 rounded-full flex items-center justify-center transition-colors',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted/80',
                        )}
                      >
                        {isSelected && (
                          <Icons
                            name="check"
                            className="h-2.5 w-2.5 text-primary-foreground"
                          />
                        )}
                      </span>
                    )}
                  </div>
                  <div className="space-y-0.5 pl-0.5">
                    <p className="text-xs font-bold text-foreground">
                      {t(tier.titleKey)}
                    </p>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 leading-tight">
                      {t(tier.descKey)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom goal option - borderless */}
          <div
            className={cn(
              'flex items-center justify-between p-3 rounded-2xl border-none transition-all',
              isCustom
                ? 'bg-primary/10 text-primary'
                : 'bg-muted/40 hover:bg-muted/70 text-foreground',
            )}
          >
            <button
              type="button"
              onClick={() => setIsCustom(true)}
              className="flex items-center gap-2.5 cursor-pointer text-left grow"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 shrink-0">
                <Icons name="sliders" className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-foreground block">
                  {t('customGoal')}
                </span>
                <span className="text-[11px] text-muted-foreground block">
                  5 - 180 {t('mins')}
                </span>
              </div>
            </button>

            {isCustom ? (
              <div className="flex items-center gap-2 shrink-0">
                <Input
                  type="number"
                  min={5}
                  max={180}
                  value={customMinutes}
                  onChange={(event) => setCustomMinutes(event.target.value)}
                  className="w-20 h-8 text-center text-xs font-bold border-none bg-background shadow-xs"
                  placeholder="30"
                />
                <span className="text-xs font-semibold text-muted-foreground">
                  {t('mins')}
                </span>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setIsCustom(true)}
              >
                {t('customGoal')}
              </Button>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose render={<Button variant="ghost" size="default" />}>
            {t('cancel')}
          </DialogClose>
          <Button
            onClick={handleSaveGoal}
            disabled={updateSettings.isPending}
            size="default"
            className="gap-2"
          >
            <Icons name="check" className="h-4 w-4" />
            <span>
              {updateSettings.isPending ? t('saving') : t('saveChanges')}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
