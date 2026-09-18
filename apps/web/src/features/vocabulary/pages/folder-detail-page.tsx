'use client';

import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';

import { useMemo } from 'react';

import {
  useFolderFlashcards,
  useFolderTopics,
  useVocabularyFolderDetail,
} from '@/features/vocabulary/hooks';
import { RouteEnum } from '@/shared/constants';
import { useGoBack, useSetBreadcrumb } from '@/shared/hooks';
import { formatUrl } from '@lumen/shared-api';
import { Skeleton } from '@lumen/uikit/components';
import { usePortal, usePortalWithoutBackdrop } from '@lumen/uikit/portal';
import {
  ConfirmDeleteFolderDialog,
  type ConfirmDeleteFolderData,
} from '@/features/vocabulary/components/dialogs/confirm-delete-folder-dialog';
import {
  StudyView,
  type StudyViewData,
} from '@/features/study/components/study-view';
import { StudySessionMode } from '@/features/study/types/study.types';
import { StudyBottomActionBar } from '@/features/study/components/study-bottom-action-bar';
import { FolderTopicGrid } from '../components/folder-detail/folder-topic-grid';

interface FolderDetailPageProps {
  folderId?: string;
}

export function FolderDetailPage({
  folderId: propFolderId,
}: FolderDetailPageProps = {}) {
  const t = useTranslations('Vocabulary.Folders');
  const router = useRouter();
  const params = useParams();
  const routeId = typeof params?.id === 'string' ? params.id : '';
  const folderId = propFolderId || routeId;

  const goBack = useGoBack(RouteEnum.VOCABULARY);
  const { data: folderDetail, isLoading } = useVocabularyFolderDetail(folderId);
  const { data: topics = [], isLoading: isLoadingTopics } =
    useFolderTopics(folderId);

  useSetBreadcrumb(
    useMemo(
      () => [
        { label: t('title'), href: RouteEnum.VOCABULARY },
        {
          label: folderDetail?.name || '',
          isLoading: isLoading && !folderDetail,
        },
      ],
      [t, folderDetail, isLoading],
    ),
  );

  const { data: allFlashcardsPage } = useFolderFlashcards(folderId, undefined, {
    enabled: Boolean(folderId),
  });

  const [presentStudyView] = usePortalWithoutBackdrop<StudyViewData>(StudyView);
  const [presentDeleteConfirm] = usePortal<ConfirmDeleteFolderData>(
    ConfirmDeleteFolderDialog,
  );

  const isCustomFolder = folderDetail ? !folderDetail.isSystem : false;

  const handleDeleteFolder = () => {
    if (!folderDetail) return;
    presentDeleteConfirm({
      folderId: folderDetail.id,
      folderName: folderDetail.name,
      onSuccess: () => {
        router.push(RouteEnum.VOCABULARY);
      },
    });
  };

  const topicStats = topics.map((topicItem) => ({
    name: topicItem.topic,
    viName: topicItem.topicVi ?? topicItem.topic,
    imageUrl: topicItem.topicImageUrl ?? undefined,
    count: topicItem.count,
    learnedCount: topicItem.learnedCount,
    dueCount: topicItem.dueCount,
  }));

  const handleTopicClick = (topicName: string) => {
    router.push(
      formatUrl(RouteEnum.FOLDER_TOPIC_DETAIL, {
        id: folderId,
        topic: encodeURIComponent(topicName),
      }),
    );
  };

  const startStudy = (mode?: StudySessionMode) => {
    const flashcards = allFlashcardsPage?.data ?? [];
    if (!flashcards.length) return;

    presentStudyView({
      cards: [...flashcards].sort(() => Math.random() - 0.5),
      mode,
      folderName: folderDetail?.name || t('defaultFolderDescription'),
    });
  };

  if (isLoading || isLoadingTopics) {
    return (
      <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <div className="space-y-3">
          <Skeleton className="h-10 w-72 rounded-xl" />
          <Skeleton className="h-5 w-96 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center">
          {Array.from({ length: 15 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center gap-3 w-32">
              <Skeleton className="w-20 h-20 rounded-full" />
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!folderDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 space-y-4">
        <h2 className="text-xl font-bold text-foreground">
          {t('folderNotFound')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t('folderNotFoundDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full py-2 pb-36">
      <FolderTopicGrid
        folderName={folderDetail.name}
        category={folderDetail.category || undefined}
        description={folderDetail.description || undefined}
        selectedTopic={null}
        topicStats={topicStats}
        onSelectTopic={handleTopicClick}
        onGoBack={goBack}
        onDeleteFolder={isCustomFolder ? handleDeleteFolder : undefined}
      />

      {Boolean(allFlashcardsPage?.data?.length) && (
        <StudyBottomActionBar
          onLearnNew={() => startStudy(StudySessionMode.LEARN_NEW)}
          onPractice={() => startStudy(StudySessionMode.PRACTICE)}
          onFlashcard={() => startStudy(StudySessionMode.FLASHCARD)}
        />
      )}
    </div>
  );
}
