'use client';

import { useTranslations } from 'next-intl';

import type { Folder } from '@/services/vocabulary';
import { Button, Skeleton } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useMemo } from 'react';
import { FolderCard } from './folder-card';

interface FolderCatalogSectionProps {
  folders: Folder[];
  activeFolderId: string | null;
  isLoading?: boolean;
  onViewFolder: (folderId: string) => void;
  onCreateFolder?: () => void;
}

export function FolderCatalogSection({
  folders,
  activeFolderId,
  isLoading = false,
  onViewFolder,
  onCreateFolder,
}: FolderCatalogSectionProps) {
  const t = useTranslations('Vocabulary.Folders');
  const { userFolders, categorizedGroups } = useMemo(() => {
    const userList: Folder[] = [];
    const catMap = new Map<string, Folder[]>();

    folders.forEach((folderItem) => {
      if (
        !folderItem.category ||
        folderItem.category.trim() === '' ||
        folderItem.category === 'Cá nhân'
      ) {
        userList.push(folderItem);
      } else {
        const cat = folderItem.category.trim();
        if (!catMap.has(cat)) catMap.set(cat, []);
        catMap.get(cat)!.push(folderItem);
      }
    });

    return {
      userFolders: userList,
      categorizedGroups: Array.from(catMap.entries()),
    };
  }, [folders]);

  return (
    <div className="space-y-6 w-full relative">
      {/* 1. User Folders - Displayed First */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold tracking-tight text-foreground">
              {t('myFolders')}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('myFoldersSubtitle')}
            </p>
          </div>

          {onCreateFolder && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCreateFolder}
              className="gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Icons name="plus" className="h-3.5 w-3.5" />
              <span>{t('createFolder')}</span>
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-36 w-full rounded-2xl" />
            ))}
          </div>
        ) : userFolders.length === 0 ? (
          <div className="p-5 rounded-2xl bg-card shadow-sm text-center text-xs text-muted-foreground">
            {t('noCustomFoldersHint')}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {userFolders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                isActive={folder.id === activeFolderId}
                isUserFolder={true}
                onViewFolderWords={onViewFolder}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. Categorized Folders (e.g. TOEIC, IELTS, etc.) */}
      {categorizedGroups.map(([categoryName, groupFolders]) => (
        <div key={categoryName} className="space-y-3">
          <div>
            <h3 className="text-base font-bold tracking-tight text-foreground">
              {categoryName}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('systemFoldersSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {groupFolders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                isActive={folder.id === activeFolderId}
                isUserFolder={false}
                onViewFolderWords={onViewFolder}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
