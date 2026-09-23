'use client';

import { LESSON_QUOTA_CONFIGS, LessonQuotaPreset } from '@/services/study';
import { useStudySettings } from '@/features/study/hooks/use-study-settings';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { PortalProps } from '@lumen/uikit/portal';
import { useTranslations } from 'next-intl';

export function LessonQuotaDialog({ isOpen, onDismiss }: PortalProps) {
  const t = useTranslations('Vocabulary.Study');
  const { settings, updateSettings } = useStudySettings();
  const presets: LessonQuotaPreset[] = Object.values(LessonQuotaPreset);

  const getPresetLabel = (presetKey: LessonQuotaPreset) => {
    switch (presetKey) {
      case LessonQuotaPreset.FEW:
        return t('quotaFew');
      case LessonQuotaPreset.MODERATE:
        return t('quotaModerate');
      case LessonQuotaPreset.MANY:
        return t('quotaMany');
      case LessonQuotaPreset.A_LOT:
        return t('quotaALot');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent className="max-w-[360px] sm:max-w-[360px] bg-card">
        <DialogHeader align="center">
          <DialogTitle>{t('maxQuestionsPerSession')}</DialogTitle>
          <DialogDescription>{t('quotaHint')}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1">
          {presets.map((presetKey) => {
            const config = LESSON_QUOTA_CONFIGS[presetKey];
            const label = getPresetLabel(presetKey);
            const rangeText = t('quotaQuestionsRange', {
              min: config.minCount,
              max: config.maxCount,
            });
            const isSelected = settings.lessonQuotaPreset === presetKey;

            return (
              <Button
                key={presetKey}
                variant="ghost"
                type="button"
                onClick={() => {
                  updateSettings({
                    lessonQuotaPreset: presetKey,
                    wordsPerSession: config.targetCount,
                  });
                  onDismiss?.();
                }}
                className={`w-full flex items-center justify-between text-left ${
                  isSelected ? 'bg-primary/10' : 'hover:bg-muted/40'
                }`}
              >
                <div>
                  <span
                    className={`text-sm ${
                      isSelected
                        ? 'text-primary font-bold'
                        : 'text-foreground font-medium'
                    }`}
                  >
                    {label}
                  </span>
                  <span
                    className={`text-xs ml-2 ${
                      isSelected
                        ? 'text-primary font-semibold'
                        : 'text-muted-foreground'
                    }`}
                  >
                    ({rangeText})
                  </span>
                </div>

                {isSelected && (
                  <Icons
                    name="check"
                    className="w-4 h-4 text-primary shrink-0"
                  />
                )}
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
