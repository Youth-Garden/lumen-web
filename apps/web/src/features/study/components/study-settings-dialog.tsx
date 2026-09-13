'use client';

import { LessonQuotaDialog } from '@/features/study/components/lesson-quota-dialog';
import { PronunciationAccentDialog } from '@/features/study/components/pronunciation-accent-dialog';
import { useStudySettings } from '@/features/study/hooks/use-study-settings';
import { PronunciationAccent } from '@/services/vocabulary';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Switch,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { PortalProps, usePortal } from '@lumen/uikit/portal';
import { useTranslations } from 'next-intl';

export function StudySettingsDialog({ isOpen, onDismiss }: PortalProps) {
  const t = useTranslations('Vocabulary.Study');
  const { settings, updateSettings } = useStudySettings();
  const [presentQuota] = usePortal(LessonQuotaDialog, {
    key: 'lesson_quota_dialog',
  });
  const [presentAccent] = usePortal(PronunciationAccentDialog, {
    key: 'pronunciation_accent_dialog',
  });

  const currentAccentLabel =
    settings.accent === PronunciationAccent.UK
      ? t('accentUkLabel')
      : t('accentUsLabel');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent className="bg-card">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-lg font-bold text-foreground">
            {t('settingsTitle')}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-1">
          {/* Row 1: Bật hiệu ứng âm thanh */}
          <div className="flex items-center justify-between py-3">
            <span className="text-sm font-semibold text-foreground">
              {t('soundEffectsTitle')}
            </span>
            <Switch
              checked={settings.soundEffectsEnabled}
              onCheckedChange={(checked) =>
                updateSettings({
                  soundEffectsEnabled: Boolean(checked),
                })
              }
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-foreground">
                {t('autoPlayAudioTitle')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('autoPlayAudioDesc')}
              </p>
            </div>

            <Switch
              checked={settings.autoPlayAudio}
              onCheckedChange={(checked) =>
                updateSettings({ autoPlayAudio: Boolean(checked) })
              }
            />
          </div>

          <div
            onClick={(event) => {
              event.stopPropagation();
              presentQuota({});
            }}
            className="w-full flex items-center justify-between text-left h-12 cursor-pointer"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-foreground">
                {t('maxQuestionsPerSession')}
              </p>
              <p className="text-xs font-semibold text-primary">
                {settings.lessonQuotaPreset === 'FEW' &&
                  `${t('quotaFew')} (${t('quotaFewDesc')})`}
                {settings.lessonQuotaPreset === 'MODERATE' &&
                  `${t('quotaModerate')} (${t('quotaModerateDesc')})`}
                {settings.lessonQuotaPreset === 'MANY' &&
                  `${t('quotaMany')} (${t('quotaManyDesc')})`}
                {settings.lessonQuotaPreset === 'A_LOT' &&
                  `${t('quotaALot')} (${t('quotaALotDesc')})`}
              </p>
            </div>
            <Icons
              name="chevron-right"
              className="w-4 h-4 text-muted-foreground"
            />
          </div>

          <div
            onClick={(event) => {
              event.stopPropagation();
              presentAccent({});
            }}
            className="w-full flex items-center justify-between text-left h-12 cursor-pointer"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-foreground">
                {t('vocabularyAccentTitle')}
              </p>
              <p className="text-xs font-semibold text-primary">
                {currentAccentLabel}
              </p>
            </div>
            <Icons
              name="chevron-right"
              className="w-4 h-4 text-muted-foreground"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
