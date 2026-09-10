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
import { useTranslations } from 'next-intl';
import {
  LESSON_QUOTA_CONFIGS,
  LessonQuotaPreset,
  useStudySettings,
} from '@/features/study/hooks/use-study-settings';

export function LessonQuotaDialog({ isOpen, onDismiss }: PortalProps) {
  const t = useTranslations('Vocabulary.Study');
  const { settings, updateSettings } = useStudySettings();
  const presets: LessonQuotaPreset[] = ['FEW', 'MODERATE', 'MANY', 'A_LOT'];

  const getPresetLabel = (presetKey: LessonQuotaPreset) => {
    switch (presetKey) {
      case 'FEW':
        return { label: t('quotaFew'), range: t('quotaFewDesc') };
      case 'MODERATE':
        return { label: t('quotaModerate'), range: t('quotaModerateDesc') };
      case 'MANY':
        return { label: t('quotaMany'), range: t('quotaManyDesc') };
      case 'A_LOT':
        return { label: t('quotaALot'), range: t('quotaALotDesc') };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent className="max-w-[360px] sm:max-w-[360px] bg-card">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-base font-bold text-foreground">
            {t('maxQuestionsPerSession')}
          </DialogTitle>
          <p className="text-xs text-muted-foreground leading-relaxed pt-1">
            {t('quotaHint')}
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-1">
          {presets.map((presetKey) => {
            const config = LESSON_QUOTA_CONFIGS[presetKey];
            const localized = getPresetLabel(presetKey);
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
                    {localized.label}
                  </span>
                  <span
                    className={`text-xs ml-2 ${
                      isSelected
                        ? 'text-primary font-semibold'
                        : 'text-muted-foreground'
                    }`}
                  >
                    ({localized.range})
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
