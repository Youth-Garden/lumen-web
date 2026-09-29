'use client';

import { useVocabularyFolders } from '@/features/vocabulary/hooks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@lumen/uikit/components';
import { PortalProps } from '@lumen/uikit/portal';
import { useTranslations } from 'next-intl';
import { useLocalStorage } from '@lumen/hooks';
import { useMemo } from 'react';
import { FolderCatalogSection } from '../cards/folder-catalog-section';

export interface SwitchFolderDialogData {
  activeFolderId?: string | null;
  onSelectFolder?: (folderId: string) => void;
  onViewFolderWords?: (folderId: string) => void;
}

export function SwitchFolderDialog({
  isOpen,
  onDismiss,
  data,
}: PortalProps<SwitchFolderDialogData>) {
  const t = useTranslations('Vocabulary.Folders');
  const { data: foldersRes, isLoading } = useVocabularyFolders();
  const [, setSelectedFolderId] = useLocalStorage<string | null>(
    'lumen_selected_folder_id',
    null,
  );

  const allFolders = useMemo(() => foldersRes?.data || [], [foldersRes?.data]);
  const activeFolderId = data?.activeFolderId || null;

  const handleSelectFolder = (folderId: string) => {
    setSelectedFolderId(folderId);
    data?.onSelectFolder?.(folderId);
    onDismiss?.();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent
        onDismiss={onDismiss}
        className="w-[94vw] sm:max-w-5xl md:max-w-6xl lg:max-w-7xl h-[86vh] max-h-[900px] flex flex-col overflow-hidden"
      >
        {/* Top Header */}
        <DialogHeader className="pb-4 shrink-0 pr-10">
          <div className="space-y-1">
            <DialogTitle className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {t('selectFolderTitle')}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {t('selectFolderSubtitle')}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pt-2 pr-1.5 scrollbar-thin">
          <FolderCatalogSection
            folders={allFolders}
            activeFolderId={activeFolderId}
            isLoading={isLoading}
            onViewFolder={handleSelectFolder}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
