'use client';

import { useToggle } from '@lumen/hooks';
import {
  Badge,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  IconButton,
  Input,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { PortalProps } from '@lumen/uikit/portal';
import { cn } from '@lumen/uikit/utils';
import { useTranslations } from 'next-intl';
import React from 'react';
import { toast } from 'sonner';
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
  isPopular?: boolean;
}

const GOAL_TIERS: GoalTierConfig[] = [
  {
    minutes: 15,
    titleKey: 'goalCasual',
    descKey: 'goalCasualDesc',
    iconName: 'coffee',
  },
  {
    minutes: 30,
    titleKey: 'goalStandard',
    descKey: 'goalStandardDesc',
    iconName: 'zap',
    isPopular: true,
  },
  {
    minutes: 45,
    titleKey: 'goalAccelerated',
    descKey: 'goalAcceleratedDesc',
    iconName: 'flame',
  },
  {
    minutes: 60,
    titleKey: 'goalIntensive',
    descKey: 'goalIntensiveDesc',
    iconName: 'trophy',
  },
];

export function DailyGoalDialog({ isOpen, onDismiss }: PortalProps) {
  const t = useTranslations('Dashboard.Overview');
  const { data: progressData } = useProgressDashboard();
  const updateSettings = useUpdateProgressSettings();

  const [selectedGoal, setSelectedGoal] = React.useState(15);
  const [isCustom, , setIsCustom] = useToggle(false);
  const [customMinutes, setCustomMinutes] = React.useState('15');

  React.useEffect(() => {
    if (progressData?.dailyGoalMinutes) {
      const current = progressData.dailyGoalMinutes;
      setSelectedGoal(current);
      setCustomMinutes(String(current));
      const isPreset = GOAL_TIERS.some((tier) => tier.minutes === current);
      if (!isPreset) {
        setIsCustom(true);
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
          toast.success(t('goalUpdatedSuccess'));
          onDismiss?.();
        },
      },
    );
  };

  const handleDecrementMinutes = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCustom(true);
    const val = parseInt(customMinutes, 10);
    const current = Number.isNaN(val) ? 30 : val;
    setCustomMinutes(String(Math.max(5, current - 1)));
  };

  const handleIncrementMinutes = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCustom(true);
    const val = parseInt(customMinutes, 10);
    const current = Number.isNaN(val) ? 30 : val;
    setCustomMinutes(String(Math.min(180, current + 1)));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader align="center">
          <DialogTitle>{t('setDailyGoal')}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 my-4">
          <div className="grid grid-cols-2 gap-2.5">
            {GOAL_TIERS.map((tier) => {
              const isSelected = selectedGoal === tier.minutes && !isCustom;
              return (
                <Card
                  key={tier.minutes}
                  role="radio"
                  variant="outline"
                  aria-checked={isSelected}
                  onClick={() => {
                    setSelectedGoal(tier.minutes);
                    setCustomMinutes(String(tier.minutes));
                    setIsCustom(false);
                  }}
                  className={cn(
                    'cursor-pointer transition-all p-3',
                    isSelected
                      ? 'border-primary/60 bg-primary/10 dark:bg-primary/15'
                      : 'hover:bg-muted/50 hover:border-border',
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-xl shrink-0 transition-colors',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted/60 text-muted-foreground',
                        )}
                      >
                        <Icons name={tier.iconName} className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-black font-heading tracking-tight text-foreground">
                        {tier.minutes} {t('mins')}
                      </span>
                    </div>
                    {tier.isPopular && (
                      <Badge variant="subtle" size="sm">
                        {t('recommended')}
                      </Badge>
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
                </Card>
              );
            })}
          </div>

          <Card
            variant="outline"
            className={cn(
              'flex-row items-center justify-between p-3 gap-3 transition-all',
              isCustom
                ? 'border-primary/60 bg-primary/10 dark:bg-primary/15'
                : 'hover:bg-muted/50 hover:border-border',
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-xl shrink-0 transition-colors',
                  isCustom
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/60 text-muted-foreground',
                )}
              >
                <Icons name="sliders" className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground block">
                  {t('customGoal')}
                </span>
                <span className="text-[11px] text-muted-foreground block">
                  5 - 180 {t('mins')}
                </span>
              </div>
            </div>

            <div
              className="flex items-center gap-2 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center rounded-xl bg-muted/60 p-0.5">
                <IconButton
                  type="button"
                  disabled={parseInt(customMinutes, 10) <= 5}
                  onClick={handleDecrementMinutes}
                  aria-label="Decrease minutes"
                >
                  <Icons name="minus" className="h-3.5 w-3.5" />
                </IconButton>
                <Input
                  type="number"
                  min={5}
                  max={180}
                  value={customMinutes}
                  onFocus={() => setIsCustom(true)}
                  onChange={(event) => {
                    setCustomMinutes(event.target.value);
                    setIsCustom(true);
                  }}
                  className="w-10 h-7 text-center text-xs font-bold border-none shadow-none bg-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus-visible:ring-0 p-0"
                  placeholder="30"
                />
                <IconButton
                  type="button"
                  disabled={parseInt(customMinutes, 10) >= 180}
                  onClick={handleIncrementMinutes}
                  aria-label="Increase minutes"
                >
                  <Icons name="plus" className="h-3.5 w-3.5" />
                </IconButton>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                {t('mins')}
              </span>
            </div>
          </Card>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSaveGoal}
            disabled={updateSettings.isPending}
            size="default"
          >
            <span>
              {updateSettings.isPending ? t('saving') : t('saveChanges')}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
