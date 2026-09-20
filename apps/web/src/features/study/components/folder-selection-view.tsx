'use client';

import { useTranslations } from 'next-intl';

import { useState, useMemo } from 'react';
import type { Folder } from '@/services/vocabulary';
import {
  Button,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { FolderCard } from '@/features/vocabulary/components/cards/folder-card';
import { StudyBottomActionBar } from '@/features/study/components/study-bottom-action-bar';

interface FolderSelectionViewProps {
  activeFolderId: string | null;
  allFolders: Folder[];
  isLoading: boolean;
  onSelectFolder: (folderId: string) => void;
  onBackToDashboard?: () => void;
  onCreateFolder: () => void;
  onViewFolderWords: (folderId: string) => void;
}

export function FolderSelectionView({
  activeFolderId,
  allFolders,
  isLoading,
  onSelectFolder,
  onBackToDashboard,
  onCreateFolder,
  onViewFolderWords,
}: FolderSelectionViewProps) {
  const t = useTranslations('Vocabulary.Folders');
  const tStudy = useTranslations('Vocabulary.Study');
  const [selectedFolderForAction, setSelectedFolderForAction] =
    useState<Folder | null>(null);

  const { userFolders, categoryMap } = useMemo(() => {
    const userList: Folder[] = [];
    const grouped = new Map<string, Folder[]>();

    allFolders.forEach((folder) => {
      if (
        !folder.category ||
        folder.category.trim() === '' ||
        folder.category === 'Cá nhân'
      ) {
        userList.push(folder);
      } else {
        const cat = folder.category.trim();
        if (!grouped.has(cat)) {
          grouped.set(cat, []);
        }
        grouped.get(cat)!.push(folder);
      }
    });

    return {
      userFolders: userList,
      categoryMap: grouped,
    };
  }, [allFolders]);

  const handleFolderClick = (folder: Folder) => {
    setSelectedFolderForAction(folder);
    onSelectFolder(folder.id);
  };

  return (
    <div className="h-full overflow-y-auto overscroll-contain pb-28 p-1 sm:p-2 max-w-[1600px] mx-auto w-full space-y-6">
      {/* 1. Top Header */}
      <div className="flex flex-col space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t('selectFolderTitle')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t('selectFolderSubtitle')}
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={onCreateFolder}
            className="gap-2 cursor-pointer font-semibold shrink-0"
          >
            <Icons name="plus" className="h-4 w-4" />
            <span>{t('createNewFolder')}</span>
          </Button>
        </div>
      </div>

      {/* 2. SECTION 1: USER-CREATED FOLDERS (HIỂN THỊ ĐẦU TIÊN) */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icons name="folder" className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {t('myFolders')}
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        ) : userFolders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-border/70 rounded-2xl bg-muted/10 space-y-3">
            <Icons
              name="folder"
              className="h-10 w-10 text-muted-foreground/40"
            />
            <p className="text-sm font-medium text-muted-foreground">
              {t('noCustomFolders')}
            </p>
            <Button
              size="sm"
              className="gap-2 cursor-pointer"
              onClick={onCreateFolder}
            >
              <Icons name="plus" className="h-4 w-4" />
              <span>{tStudy('createFirstFolder')}</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {userFolders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                isActive={
                  folder.id === (selectedFolderForAction?.id || activeFolderId)
                }
                isUserFolder={true}
                onSelectFolder={() => handleFolderClick(folder)}
                onViewFolderWords={onViewFolderWords}
              />
            ))}
          </div>
        )}
      </div>

      {/* 3. SECTION 2+: CATEGORIZED FOLDERS (CHIA THEO TỪNG DẠNG, VÍ DỤ: TỪ VỰNG TOEIC HÀNG RIÊNG) */}
      {Array.from(categoryMap.entries()).map(([categoryName, folderList]) => (
        <div key={categoryName} className="flex flex-col space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <Icons name="sparkles" className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {categoryName}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {folderList.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                isActive={
                  folder.id === (selectedFolderForAction?.id || activeFolderId)
                }
                isUserFolder={false}
                onSelectFolder={() => handleFolderClick(folder)}
                onViewFolderWords={onViewFolderWords}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Floating Bottom Action Bar for Selected Folder */}
      {selectedFolderForAction && (
        <StudyBottomActionBar
          onLearnNew={() => {
            onSelectFolder(selectedFolderForAction.id);
            onViewFolderWords(selectedFolderForAction.id);
          }}
          onPractice={() => {
            onSelectFolder(selectedFolderForAction.id);
            onViewFolderWords(selectedFolderForAction.id);
          }}
          onFlashcard={() => {
            onSelectFolder(selectedFolderForAction.id);
            onViewFolderWords(selectedFolderForAction.id);
          }}
        />
      )}
    </div>
  );
}
