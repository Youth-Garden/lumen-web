'use client';

import { useStudySettings } from '@/features/study/hooks/use-study-settings';
import { PronunciationAccent } from '@/services/vocabulary';
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

export function PronunciationAccentDialog({ isOpen, onDismiss }: PortalProps) {
  const t = useTranslations('Vocabulary.Study');
  const { settings, updateSettings } = useStudySettings();

  const accentOptions = [
    {
      value: PronunciationAccent.US,
      label: t('accentUsLabel'),
    },
    {
      value: PronunciationAccent.UK,
      label: t('accentUkLabel'),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent className="max-w-[360px] sm:max-w-[360px] bg-card">
        <DialogHeader align="center">
          <DialogTitle>{t('vocabularyAccentTitle')}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-1">
          {accentOptions.map((item) => {
            const isSelected = settings.accent === item.value;

            return (
              <Button
                variant="ghost"
                key={item.value}
                type="button"
                onClick={() => {
                  updateSettings({ accent: item.value });
                  onDismiss?.();
                }}
                className={`w-full flex items-center justify-between text-left ${
                  isSelected ? 'bg-primary/10' : 'hover:bg-muted/40'
                }`}
              >
                <span
                  className={`text-sm ${
                    isSelected
                      ? 'text-primary font-bold'
                      : 'text-foreground font-medium'
                  }`}
                >
                  {item.label}
                </span>

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
