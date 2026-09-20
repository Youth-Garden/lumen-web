'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { FolderSelectionView } from '@/features/study/components/folder-selection-view';
import { CreateFolderDialog } from '@/features/vocabulary/components/dialogs/create-folder-dialog';
import { useVocabularyFolders } from '@/features/vocabulary/hooks';
import { RouteEnum } from '@/shared/constants';
import { useSetBreadcrumb } from '@/shared/hooks';
import { useLocalStorage } from '@lumen/hooks';
import { formatUrl } from '@lumen/shared-api';
import { usePortal } from '@lumen/uikit/portal';

export function FolderSelectionPage() {
  const t = useTranslations('Vocabulary.Folders');
  const router = useRouter();
  const { data, isLoading } = useVocabularyFolders();
  const [presentCreateFolder] = usePortal(CreateFolderDialog);
  const [activeFolderId, setActiveFolderId] = useLocalStorage<string | null>(
    'lumen_selected_folder_id',
    null,
  );

  useSetBreadcrumb(
    useMemo(
      () => [
        { label: t('title'), href: RouteEnum.VOCABULARY },
        { label: t('selectFolderTitle') },
      ],
      [t],
    ),
  );

  const allFolders = useMemo(() => data?.data || [], [data?.data]);

  const handleSelectFolder = (folderId: string) => {
    setActiveFolderId(folderId);
    router.push(RouteEnum.VOCABULARY);
  };

  const handleViewFolder = (folderId: string) => {
    router.push(formatUrl(RouteEnum.FOLDER_DETAIL, { id: folderId }));
  };

  const handleBackToDashboard = () => {
    router.push(RouteEnum.VOCABULARY);
  };

  return (
    <FolderSelectionView
      activeFolderId={activeFolderId}
      allFolders={allFolders}
      isLoading={isLoading}
      onSelectFolder={handleSelectFolder}
      onBackToDashboard={handleBackToDashboard}
      onCreateFolder={() => presentCreateFolder()}
      onViewFolderWords={handleViewFolder}
    />
  );
}
