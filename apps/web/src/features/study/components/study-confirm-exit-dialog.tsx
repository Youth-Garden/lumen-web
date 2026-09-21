'use client';

import { useTranslations } from 'next-intl';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@lumen/uikit/components';
import type { PortalProps } from '@lumen/uikit/portal';

export interface StudyConfirmExitData {
  onConfirmExit: () => void;
}

export function StudyConfirmExitDialog({
  isOpen,
  onDismiss,
  data,
}: PortalProps<StudyConfirmExitData>) {
  const t = useTranslations('Vocabulary.Study');

  const handleConfirmExit = () => {
    onDismiss?.();
    data.onConfirmExit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{t('confirmExitTitle')}</DialogTitle>
          <DialogDescription>{t('confirmExitDescription')}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onDismiss?.()}
          >
            {t('continueStudying')}
          </Button>
          <Button type="button" variant="default" onClick={handleConfirmExit}>
            {t('saveAndExit')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
