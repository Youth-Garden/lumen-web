'use client';

import { useLocale } from '@/shared/hooks';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { CreateFolderDialog } from '@/features/vocabulary/components/dialogs/create-folder-dialog';
import {
  useCreateFlashcard,
  useVocabularyFolders,
} from '@/features/vocabulary/hooks';
import { i18nText } from '@/shared/utils';
import {
  Button,
  ScrollArea,
  Sheet,
  SheetClose,
  SheetContent,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { type PortalProps, usePortal } from '@lumen/uikit/portal';

export interface SaveToFolderData {
  wordId: string;
  term?: string;
}

export function SaveToFolderSheet({
  isOpen,
  onDismiss,
  data,
}: PortalProps<SaveToFolderData>) {
  const t = useTranslations('Vocabulary.Folders');
  const locale = useLocale();
  const { data: folders, isLoading } = useVocabularyFolders();
  const { mutateAsync: createFlashcard, isPending } = useCreateFlashcard();
  const [presentCreateFolder] = usePortal(CreateFolderDialog);
  const [savingFolderId, setSavingFolderId] = useState<string | null>(null);

  const customFolders = (folders?.data ?? []).filter(
    (folder) => !folder.isSystem,
  );
  const wordId = data?.wordId;

  const handleSelectFolder = async (folderId: string) => {
    if (!wordId || isPending) return;

    try {
      setSavingFolderId(folderId);
      await createFlashcard({
        folderId,
        wordId,
      });
      toast.success(t('addedToFolderSuccess'));
      onDismiss?.();
    } catch {
      toast.error(t('alreadyInFolder'));
    } finally {
      setSavingFolderId(null);
    }
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onDismiss?.();
      }}
    >
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="w-full max-w-lg mx-auto rounded-t-3xl max-h-[85dvh] sm:max-h-[80vh] gap-0 p-0 border-t border-border/60 shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/40">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-heading">
              {t('saveToFolder')}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground pt-0.5">
              {t('saveToFolderDescription')}
            </p>
          </div>
          <SheetClose />
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          {/* Create New Folder Button */}
          <Button
            variant="default"
            className="w-full justify-center gap-2 font-bold"
            onClick={() => presentCreateFolder()}
          >
            <Icons name="plus" className="h-4 w-4" />
            <span>{t('createNewFolder')}</span>
          </Button>

          {/* Folders List */}
          <ScrollArea className="max-h-[45vh] pr-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Icons
                  name="loader-2"
                  className="h-6 w-6 animate-spin text-muted-foreground"
                />
              </div>
            ) : customFolders.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <Icons
                  name="folder"
                  className="h-10 w-10 mx-auto text-muted-foreground/40"
                />
                <p className="text-sm text-muted-foreground">
                  {t('noCustomFolders')}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {customFolders.map((folder) => {
                  const isSaving = savingFolderId === folder.id;
                  const folderName = i18nText(folder.name, locale);

                  return (
                    <button
                      key={folder.id}
                      type="button"
                      disabled={isPending}
                      onClick={() => handleSelectFolder(folder.id)}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-muted/50 transition-colors text-left group cursor-pointer disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                          <Icons name="folder" className="h-4 w-4" />
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-sm text-foreground truncate">
                            {folderName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {folder.flashcardCount}{' '}
                            {t('wordDetail').toLowerCase()}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 ml-3">
                        {isSaving ? (
                          <Icons
                            name="loader-2"
                            className="h-4 w-4 animate-spin text-primary"
                          />
                        ) : (
                          <Icons
                            name="plus"
                            className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
