'use client';

import { PronunciationAccent } from '@/services/vocabulary/vocabulary.types';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { PortalProps, usePortal } from '@lumen/uikit/portal';
import { useTranslations } from 'next-intl';
import { useStudySettings } from '@/features/study/hooks/use-study-settings';
import { LessonQuotaDialog } from '@/features/study/components/lesson-quota-dialog';
import { PronunciationAccentDialog } from '@/features/study/components/pronunciation-accent-dialog';

export function StudySettingsDialog({ isOpen, onDismiss }: PortalProps) {
  const t = useTranslations('Vocabulary.Study');
  const { settings, currentQuotaConfig, updateSettings } = useStudySettings();
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
      <DialogContent className="max-w-md p-6 rounded-xl border-none shadow-2xl bg-card space-y-4 transition-all duration-200">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-lg font-bold text-foreground">
            {t('settingsTitle')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-1">
          {/* Row 1: Bật hiệu ứng âm thanh */}
          <div className="flex items-center justify-between py-3 px-1">
            <span className="text-sm font-semibold text-foreground">
              {t('soundEffectsTitle')}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={settings.soundEffectsEnabled}
              onClick={() =>
                updateSettings({
                  soundEffectsEnabled: !settings.soundEffectsEnabled,
                })
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                settings.soundEffectsEnabled ? 'bg-primary' : 'bg-muted/90'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-background shadow-sm transition duration-200 ${
                  settings.soundEffectsEnabled
                    ? 'translate-x-5'
                    : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3 px-1">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-foreground">
                {t('autoPlayAudioTitle')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('autoPlayAudioDesc')}
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.autoPlayAudio}
              onClick={() =>
                updateSettings({ autoPlayAudio: !settings.autoPlayAudio })
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                settings.autoPlayAudio ? 'bg-primary' : 'bg-muted/90'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-background shadow-sm transition duration-200 ${
                  settings.autoPlayAudio ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Row 3: Số câu hỏi tối đa mỗi lần học */}
          <Button
            type="button"
            variant="ghost"
            onClick={(event) => {
              event.stopPropagation();
              presentQuota({});
            }}
            className="w-full flex items-center justify-between text-left p-2.5 h-12"
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
          </Button>

          {/* Row 4: Giọng phát âm từ vựng */}
          <Button
            variant="ghost"
            onClick={(event) => {
              event.stopPropagation();
              presentAccent({});
            }}
            className="w-full flex items-center justify-between text-left p-2.5 h-12"
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
          </Button>

          <div className="pt-3">
            <Button
              variant="default"
              className="w-full"
              onClick={() => onDismiss?.()}
            >
              {t('ok')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
