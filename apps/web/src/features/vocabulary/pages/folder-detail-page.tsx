'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';

import { useMemo } from 'react';
import { toast } from 'sonner';

import {
  useFolderFlashcards,
  useFolderTopics,
  useVocabularyFolderDetail,
} from '@/features/vocabulary/hooks';
import { getLocalizedText } from '@/features/vocabulary/utils';
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
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const routeId = typeof params?.id === 'string' ? params.id : '';
  const folderId = propFolderId || routeId;

  const goBack = useGoBack(RouteEnum.VOCABULARY);
  const { data: folderDetail, isLoading } = useVocabularyFolderDetail(folderId);
  const { data: topics = [], isLoading: isLoadingTopics } =
    useFolderTopics(folderId);

  const folderDisplayName = getLocalizedText(folderDetail?.name, locale);

  useSetBreadcrumb(
    useMemo(
      () => [
        { label: t('title'), href: RouteEnum.VOCABULARY },
        {
          label: folderDisplayName || '',
          isLoading: isLoading && !folderDetail,
        },
      ],
      [t, folderDisplayName, isLoading, folderDetail],
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
      folderName: folderDisplayName,
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

    if (mode === StudySessionMode.LEARN_NEW) {
      const unlearned = flashcards.filter(
        (c) =>
          (c.level ?? 0) === 0 &&
          (c.learningStep ?? 0) === 0 &&
          (c.masteryScore ?? 0) === 0,
      );
      if (unlearned.length === 0) {
        toast.info(t('allWordsLearnedInFolder'));
        startStudy(StudySessionMode.PRACTICE);
        return;
      }
    }

    if (mode === StudySessionMode.PRACTICE) {
      const learned = flashcards.filter(
        (c) =>
          (c.level ?? 0) >= 1 ||
          (c.learningStep ?? 0) >= 1 ||
          (c.masteryScore ?? 0) > 0 ||
          Boolean(c.isWilted),
      );
      if (learned.length === 0) {
        toast.info(t('noLearnedWordsToPractice'));
        startStudy(StudySessionMode.LEARN_NEW);
        return;
      }
    }

    presentStudyView({
      cards: flashcards,
      mode,
      folderName: folderDisplayName || t('defaultFolderDescription'),
    });
  };

  if (isLoading || isLoadingTopics) {
    return (
      <div className="w-full py-2 pb-36 space-y-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 sm:h-9 w-48 sm:w-64 rounded-xl" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-72 sm:w-96 rounded-md mt-1" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 justify-items-center">
          {Array.from({ length: 18 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-between text-center p-2.5 rounded-2xl w-36 sm:w-40 select-none"
            >
              <div className="relative w-22 h-22 sm:w-24 sm:h-24 flex items-center justify-center">
                <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-full border-2 border-muted/30 absolute inset-0" />
                <Skeleton className="w-16 h-16 sm:w-17 sm:h-17 rounded-full" />
              </div>

              <div className="mt-2.5 w-full flex flex-col items-center gap-1.5 px-1">
                <Skeleton className="h-4 w-20 sm:w-24 rounded-md" />
                <Skeleton className="h-3 w-14 sm:w-16 rounded-md" />
              </div>

              <div className="flex items-center justify-center gap-2.5 mt-2.5">
                <Skeleton className="h-3.5 w-10 rounded-full" />
                <Skeleton className="h-3.5 w-6 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-card/90 backdrop-blur-md rounded-full shadow-lg p-1.5 px-3 border border-border/40">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
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
        folderName={folderDisplayName}
        category={getLocalizedText(folderDetail.category, locale) || undefined}
        description={
          getLocalizedText(folderDetail.description, locale) || undefined
        }
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
