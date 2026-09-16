'use client';

import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  useFolderFlashcards,
  useFolderTopics,
  useVocabularyFolderDetail,
} from '@/features/vocabulary/hooks';
import { useDueFlashcards } from '@/features/study/hooks';
import { RouteEnum } from '@/shared/constants';
import { useGoBack } from '@/shared/hooks';
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
import { TopicWordsList } from '../components/folder-detail/topic-words-list';

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
  const { data: dueFlashcardsResponse } = useDueFlashcards(
    { folderId },
    { enabled: Boolean(folderId) },
  );

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isViewingWords, setIsViewingWords] = useState(false);

  const { data: flashcardsPage, isLoading: isLoadingFlashcards } =
    useFolderFlashcards(folderId, selectedTopic ?? undefined, {
      enabled: isViewingWords && Boolean(selectedTopic),
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

  const dueIdSet = new Set(
    (dueFlashcardsResponse?.data ?? []).flatMap((df) => [
      df.flashcardId,
      df.wordId,
    ]),
  );

  const topicStats = topics.map((topicItem) => ({
    name: topicItem.topic,
    viName: topicItem.topicVi ?? topicItem.topic,
    imageUrl: topicItem.topicImageUrl ?? undefined,
    count: topicItem.count,
    learnedCount: topicItem.learnedCount,
    dueCount: topicItem.dueCount,
  }));

  const handleTopicClick = (topicName: string) => {
    setSelectedTopic(topicName);
    setIsViewingWords(true);
  };

  const handleBackToTopics = () => {
    setIsViewingWords(false);
    setSelectedTopic(null);
  };

  const startStudy = (topicName: string | null, mode?: StudySessionMode) => {
    const flashcards = flashcardsPage?.data ?? [];
    const cardsToStudy =
      topicName && flashcards.length > 0
        ? flashcards
        : [...(flashcardsPage?.data ?? [])].sort(() => Math.random() - 0.5);

    const selectedTopicStat = topicStats.find((ts) => ts.name === topicName);

    presentStudyView({
      cards: cardsToStudy,
      selectedTopic: topicName,
      mode,
      folderName: topicName
        ? `${selectedTopicStat?.viName || topicName} (${topicName})`
        : folderDetail?.name || t('defaultFolderDescription'),
    });
  };

  if (isLoading) {
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
      {!isViewingWords ? (
        <FolderTopicGrid
          folderName={folderDetail.name}
          category={folderDetail.category || undefined}
          description={folderDetail.description || undefined}
          selectedTopic={selectedTopic}
          topicStats={topicStats}
          onSelectTopic={handleTopicClick}
          onGoBack={goBack}
          onDeleteFolder={isCustomFolder ? handleDeleteFolder : undefined}
        />
      ) : (
        <TopicWordsList
          folderName={folderDetail.name}
          topicName={selectedTopic || ''}
          topicViName={
            topicStats.find((ts) => ts.name === selectedTopic)?.viName
          }
          flashcards={flashcardsPage?.data ?? []}
          onBackToTopics={handleBackToTopics}
        />
      )}

      <StudyBottomActionBar
        onLearnNew={() =>
          startStudy(
            isViewingWords ? selectedTopic : null,
            StudySessionMode.LEARN_NEW,
          )
        }
        onPractice={() =>
          startStudy(
            isViewingWords ? selectedTopic : null,
            StudySessionMode.PRACTICE,
          )
        }
        onFlashcard={() =>
          startStudy(
            isViewingWords ? selectedTopic : null,
            StudySessionMode.FLASHCARD,
          )
        }
      />
    </div>
  );
}
