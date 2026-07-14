'use client';

import { useTranslations } from 'next-intl';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@lumen/uikit/components';
import { PortalProps } from '@lumen/uikit/portal';
import { useState } from 'react';

export enum ConfirmDialogActionEnum {
  PAUSE = 'PAUSE',
  EXIT = 'EXIT',
}

export interface ToeicTestConfirmDialogProps extends PortalProps {
  action: ConfirmDialogActionEnum;
  onConfirm: () => Promise<void>;
}

export function ToeicTestConfirmDialog({
  isOpen,
  onDismiss,
  data,
}: PortalProps<ToeicTestConfirmDialogProps>) {
  const t = useTranslations('ExamPractice');
  const [isPending, setIsPending] = useState(false);

  if (!data) return null;
  const { action, onConfirm } = data;

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await onConfirm();
      onDismiss?.();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isPending && onDismiss?.()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === ConfirmDialogActionEnum.PAUSE
              ? t('pauseTitle')
              : t('exitTitle')}
          </DialogTitle>
          <DialogDescription>
            {action === ConfirmDialogActionEnum.PAUSE
              ? t('confirmPause')
              : t('confirmExit')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            render={<Button variant="outline" disabled={isPending} />}
          >
            {t('cancel')}
          </DialogClose>
          <Button onClick={handleConfirm} disabled={isPending}>
            {t('confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
