'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { PortalProps } from '@lumen/uikit/portal';
import { cn } from '@lumen/uikit/utils';
import { useTranslations } from 'next-intl';
import { getIntensityDotClass } from '../utils/heatmap.utils';

export function ActivityInfoDialog({ isOpen, onDismiss }: PortalProps) {
  const t = useTranslations('Dashboard.ActivityInfo');

  const activityTypes = [
    {
      icon: 'layers' as const,
      title: t('flashcardReviewTitle'),
      description: t('flashcardReviewDesc'),
      className: 'bg-amber-500/10 text-amber-500',
    },
    {
      icon: 'vocabulary' as const,
      title: t('vocabLearnTitle'),
      description: t('vocabLearnDesc'),
      className: 'bg-primary/10 text-primary',
    },
    {
      icon: 'clock' as const,
      title: t('studySessionTitle'),
      description: t('studySessionDesc'),
      className: 'bg-emerald-500/10 text-emerald-500',
    },
  ];

  const heatmapLevels = [
    { count: 0, labelKey: 'level0' as const },
    { count: 1, labelKey: 'level1' as const },
    { count: 5, labelKey: 'level2' as const },
    { count: 12, labelKey: 'level3' as const },
    { count: 25, labelKey: 'level4' as const },
  ];

  const metrics = [
    {
      title: t('metricActiveDaysTitle'),
      description: t('metricActiveDaysDesc'),
    },
    {
      title: t('metricStreakTitle'),
      description: t('metricStreakDesc'),
    },
    {
      title: t('metricLongestStreakTitle'),
      description: t('metricLongestStreakDesc'),
    },
    {
      title: t('metricAvgPerDayTitle'),
      description: t('metricAvgPerDayDesc'),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent
        onDismiss={onDismiss}
        className="sm:max-w-md max-h-[88vh] flex flex-col overflow-hidden"
      >
        <DialogHeader align="center">
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1 space-y-5">
          <section className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Icons
                name="activity"
                className="h-5 w-5 text-primary shrink-0"
              />

              <div>
                <h4 className="font-heading text-sm font-bold text-foreground">
                  {t('whatIsActivityTitle')}
                </h4>

                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {t('whatIsActivityDesc')}
                </p>
              </div>
            </div>

            <div className="flex flex-col divide-y divide-border/40">
              {activityTypes.map((activity) => (
                <div
                  key={activity.title}
                  className="flex items-start gap-3 py-2.5 first:pt-1 last:pb-1"
                >
                  <div
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-xl mt-0.5',
                      activity.className,
                    )}
                  >
                    <Icons name={activity.icon} className="size-4" />
                  </div>

                  <div className="space-y-0.5 min-w-0 flex-1">
                    <span className="block font-heading text-xs font-bold text-foreground">
                      {activity.title}
                    </span>
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Icons
                name="sparkles"
                className="h-5 w-5 text-primary shrink-0"
              />

              <div>
                <h4 className="font-heading text-sm font-bold text-foreground">
                  {t('heatmapLevelsTitle')}
                </h4>

                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {t('heatmapLevelsDesc')}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-muted/40 p-4">
              <div className="grid grid-cols-5 gap-2">
                {heatmapLevels.map((level) => (
                  <div
                    key={level.labelKey}
                    className="flex min-w-0 flex-col items-center gap-2"
                  >
                    <div
                      className={cn(
                        'size-4 sm:size-4.5 rounded-[3.5px] shrink-0',
                        getIntensityDotClass(level.count),
                      )}
                    />

                    <span className="text-center text-[10px] font-medium leading-tight text-muted-foreground sm:text-[11px]">
                      {t(level.labelKey)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Icons
                name="trophy"
                className="h-5 w-5 text-amber-500 shrink-0"
              />

              <div>
                <h4 className="font-heading text-sm font-bold text-foreground">
                  {t('metricsTitle')}
                </h4>

                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {t('metricsSubtitle')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {metrics.map((metric, index) => (
                <div
                  key={metric.title}
                  className="relative overflow-hidden rounded-2xl bg-muted/40 p-3.5"
                >
                  <div className="absolute right-2.5 top-2.5 text-[10px] font-bold text-muted-foreground/30 select-none">
                    0{index + 1}
                  </div>

                  <span className="block max-w-[85%] font-heading text-xs font-bold text-foreground">
                    {metric.title}
                  </span>

                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    {metric.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="pt-3 shrink-0">
          <Button
            variant="default"
            size="default"
            onClick={onDismiss}
            className="w-full"
          >
            {t('close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
