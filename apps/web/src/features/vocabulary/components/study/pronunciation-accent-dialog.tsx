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
import { PortalProps } from '@lumen/uikit/portal';
import { useTranslations } from 'next-intl';
import { useStudySettings } from '../../hooks/use-study-settings';

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
      <DialogContent className="max-w-sm p-6 rounded-xl border-none shadow-2xl bg-card space-y-4 transition-all duration-200">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-base font-bold text-foreground">
            {t('vocabularyAccentTitle')}
          </DialogTitle>
          <p className="text-xs text-muted-foreground leading-relaxed pt-1">
            {t('accentHint')}
          </p>
        </DialogHeader>

        <div className="space-y-1">
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
