'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useDeleteFolder } from '@/features/vocabulary/hooks';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import type { PortalProps } from '@lumen/uikit/portal';

export interface ConfirmDeleteFolderData {
  folderId: string;
  folderName: string;
  onSuccess?: () => void;
}

export function ConfirmDeleteFolderDialog({
  isOpen,
  onDismiss,
  data,
}: PortalProps<ConfirmDeleteFolderData>) {
  const t = useTranslations('Vocabulary.Folders');
  const { mutateAsync: deleteFolder, isPending } = useDeleteFolder();

  const handleDelete = async () => {
    await deleteFolder(data.folderId);
    toast.success(t('deleteSuccess'));
    data.onSuccess?.();
    onDismiss?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{t('confirmDeleteFolderTitle')}</DialogTitle>
          <DialogDescription>
            {t('confirmDeleteFolderDesc', { name: data.folderName })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end pt-4">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending && (
              <Icons name="loader-2" className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t('delete')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
