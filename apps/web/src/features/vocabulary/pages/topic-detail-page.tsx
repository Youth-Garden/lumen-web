'use client';

import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';

import {
  useFolderFlashcards,
  useFolderTopics,
  useVocabularyFolderDetail,
} from '@/features/vocabulary/hooks';
import {
  StudyView,
  type StudyViewData,
} from '@/features/study/components/study-view';
import { StudyBottomActionBar } from '@/features/study/components/study-bottom-action-bar';
import { StudySessionMode } from '@/features/study/types/study.types';
import { RouteEnum } from '@/shared/constants';
import { useSetBreadcrumb, type BreadcrumbConfigItem } from '@/shared/hooks';
import { formatUrl } from '@lumen/shared-api';
import { Skeleton } from '@lumen/uikit/components';
import { usePortalWithoutBackdrop } from '@lumen/uikit/portal';
import { TopicWordsList } from '../components/folder-detail/topic-words-list';

export function TopicDetailPage() {
  const t = useTranslations('Vocabulary.Folders');
  const router = useRouter();
  const params = useParams();

  const folderId = typeof params?.id === 'string' ? params.id : '';
  const rawTopic = typeof params?.topic === 'string' ? params.topic : '';
  const topicName = useMemo(
    () => (rawTopic ? decodeURIComponent(rawTopic) : ''),
    [rawTopic],
  );

  const { data: folderDetail, isLoading: isLoadingFolder } =
    useVocabularyFolderDetail(folderId);
  const { data: topics = [], isLoading: isLoadingTopics } =
    useFolderTopics(folderId);
  const { data: flashcardsPage, isLoading: isLoadingFlashcards } =
    useFolderFlashcards(folderId, topicName, {
      enabled: Boolean(folderId) && Boolean(topicName),
    });

  const [presentStudyView] = usePortalWithoutBackdrop<StudyViewData>(StudyView);

  const topicInfo = useMemo(
    () => topics.find((item) => item.topic === topicName),
    [topics, topicName],
  );

  const topicViName = topicInfo?.topicVi || topicName;
  const flashcards = useMemo(
    () => flashcardsPage?.data ?? [],
    [flashcardsPage?.data],
  );

  useSetBreadcrumb(
    useMemo(() => {
      const items: BreadcrumbConfigItem[] = [
        { label: t('title'), href: RouteEnum.VOCABULARY },
      ];
      if (isLoadingFolder && !folderDetail) {
        items.push({ label: '', isLoading: true });
      } else if (folderDetail) {
        items.push({
          label: folderDetail.name,
          href: formatUrl(RouteEnum.FOLDER_DETAIL, { id: folderId }),
        });
      }
      items.push({
        label: topicViName || topicName,
        isLoading: (isLoadingTopics || isLoadingFlashcards) && !topicViName && !topicName,
      });
      return items;
    }, [
      t,
      folderId,
      folderDetail,
      isLoadingFolder,
      topicViName,
      topicName,
      isLoadingTopics,
      isLoadingFlashcards,
    ]),
  );

  const handleBackToTopics = () => {
    router.push(formatUrl(RouteEnum.FOLDER_DETAIL, { id: folderId }));
  };

  const startStudy = (mode: StudySessionMode) => {
    if (!flashcards.length) return;
    presentStudyView({
      cards: flashcards,
      selectedTopic: topicName,
      mode,
      folderName: topicViName || topicName,
    });
  };

  const isLoading = isLoadingFolder || isLoadingTopics || isLoadingFlashcards;

  if (isLoading) {
    return (
      <div className="w-full py-4 pb-36 space-y-6">
        <Skeleton className="h-9 w-60 rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-2xl" />
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
      <TopicWordsList
        folderId={folderId}
        folderName={folderDetail.name}
        topicName={topicName}
        topicViName={topicViName}
        flashcards={flashcards}
        onBackToTopics={handleBackToTopics}
      />

      {flashcards.length > 0 && (
        <StudyBottomActionBar
          onLearnNew={() => startStudy(StudySessionMode.LEARN_NEW)}
          onPractice={() => startStudy(StudySessionMode.PRACTICE)}
          onFlashcard={() => startStudy(StudySessionMode.FLASHCARD)}
        />
      )}
    </div>
  );
}
