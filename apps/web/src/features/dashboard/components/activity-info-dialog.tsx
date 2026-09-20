'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { PortalProps } from '@lumen/uikit/portal';
import { cn } from '@lumen/uikit/utils';
import { useTranslations } from 'next-intl';
import React from 'react';
import { getIntensityDotClass } from '../utils/heatmap.utils';

export function ActivityInfoDialog({ isOpen, onDismiss }: PortalProps) {
  const t = useTranslations('Dashboard.ActivityInfo');

  const heatmapLevels = [
    { count: 0, labelKey: 'level0' as const },
    { count: 1, labelKey: 'level1' as const },
    { count: 5, labelKey: 'level2' as const },
    { count: 12, labelKey: 'level3' as const },
    { count: 25, labelKey: 'level4' as const },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent
        onDismiss={onDismiss}
        className="sm:max-w-[560px] max-h-[88vh] flex flex-col bg-card shadow-xl"
      >
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg sm:text-xl font-bold font-heading flex items-center gap-2">
            <Icons name="info" className="h-5 w-5 text-primary shrink-0" />
            {t('title')}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            {t('subtitle')}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto pr-1.5 space-y-5 my-3 text-xs sm:text-sm">
          {/* Section 1: What is an Activity */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Icons name="activity" className="h-4 w-4 text-primary" />
              {t('whatIsActivityTitle')}
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              {t('whatIsActivityDesc')}
            </p>

            <div className="space-y-2 pt-1 pl-1">
              <div className="flex items-start gap-2.5">
                <div className="size-5 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Icons name="layers" className="size-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-foreground block">
                    {t('flashcardReviewTitle')}
                  </span>
                  <span className="text-muted-foreground text-xs leading-relaxed">
                    {t('flashcardReviewDesc')}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="size-5 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Icons name="vocabulary" className="size-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-foreground block">
                    {t('vocabLearnTitle')}
                  </span>
                  <span className="text-muted-foreground text-xs leading-relaxed">
                    {t('vocabLearnDesc')}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="size-5 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Icons name="clock" className="size-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-foreground block">
                    {t('studySessionTitle')}
                  </span>
                  <span className="text-muted-foreground text-xs leading-relaxed">
                    {t('studySessionDesc')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Heatmap Intensity Scale */}
          <div className="space-y-2.5 pt-2 border-t border-border/40">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Icons name="sparkles" className="h-4 w-4 text-primary" />
              {t('heatmapLevelsTitle')}
            </h4>
            <p className="text-muted-foreground leading-relaxed text-xs">
              {t('heatmapLevelsDesc')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {heatmapLevels.map((lvl) => (
                <div
                  key={lvl.labelKey}
                  className="flex items-center gap-2.5 text-xs"
                >
                  <div
                    className={cn(
                      'size-3.5 rounded-[3px] shrink-0',
                      getIntensityDotClass(lvl.count),
                    )}
                  />
                  <span className="text-muted-foreground font-medium">
                    {t(lvl.labelKey)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Consistency Metrics */}
          <div className="space-y-2.5 pt-2 border-t border-border/40">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Icons name="trophy" className="h-4 w-4 text-primary" />
              {t('metricsTitle')}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="font-semibold text-foreground block text-xs">
                  {t('metricActiveDaysTitle')}
                </span>
                <span className="text-muted-foreground text-xs leading-relaxed">
                  {t('metricActiveDaysDesc')}
                </span>
              </div>

              <div>
                <span className="font-semibold text-foreground block text-xs">
                  {t('metricStreakTitle')}
                </span>
                <span className="text-muted-foreground text-xs leading-relaxed">
                  {t('metricStreakDesc')}
                </span>
              </div>

              <div>
                <span className="font-semibold text-foreground block text-xs">
                  {t('metricLongestStreakTitle')}
                </span>
                <span className="text-muted-foreground text-xs leading-relaxed">
                  {t('metricLongestStreakDesc')}
                </span>
              </div>

              <div>
                <span className="font-semibold text-foreground block text-xs">
                  {t('metricAvgPerDayTitle')}
                </span>
                <span className="text-muted-foreground text-xs leading-relaxed">
                  {t('metricAvgPerDayDesc')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2 border-t border-border/40 sm:justify-end">
          <Button
            variant="default"
            onClick={onDismiss}
            className="w-full sm:w-auto"
          >
            {t('close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
