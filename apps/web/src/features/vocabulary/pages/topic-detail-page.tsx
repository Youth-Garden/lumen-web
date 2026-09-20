'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';

import {
  useFolderFlashcards,
  useFolderTopics,
  useVocabularyFolderDetail,
} from '@/features/vocabulary/hooks';
import { getLocalizedText } from '@/features/vocabulary/utils';
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
  const locale = useLocale();
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

  const folderDisplayName = getLocalizedText(folderDetail?.name, locale);

  useSetBreadcrumb(
    useMemo(() => {
      const items: BreadcrumbConfigItem[] = [
        { label: t('title'), href: RouteEnum.VOCABULARY },
      ];
      if (isLoadingFolder && !folderDetail) {
        items.push({ label: '', isLoading: true });
      } else if (folderDetail) {
        items.push({
          label: folderDisplayName,
          href: formatUrl(RouteEnum.FOLDER_DETAIL, { id: folderId }),
        });
      }
      items.push({
        label: topicViName || topicName,
        isLoading:
          (isLoadingTopics || isLoadingFlashcards) &&
          !topicViName &&
          !topicName,
      });
      return items;
    }, [
      t,
      folderId,
      folderDetail,
      folderDisplayName,
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
      <div className="w-full py-2 pb-36">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 15 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center text-center p-3 sm:p-4 rounded-2xl gap-2.5"
            >
              <Skeleton className="w-[50px] h-[50px] rounded-full shrink-0" />
              <div className="w-full flex flex-col items-center gap-1.5 px-1">
                <Skeleton className="h-4 w-20 sm:w-24 rounded-md" />
                <Skeleton className="h-3.5 w-24 sm:w-28 rounded-md" />
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
      <TopicWordsList
        folderId={folderId}
        folderName={folderDisplayName}
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
