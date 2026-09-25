'use client';

import { NotFoundView } from '@/shared/components/not-found-view';
import { useLocale } from '@/shared/hooks';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { toast } from 'sonner';

import { StudyBottomActionBar } from '@/features/study/components/study-bottom-action-bar';
import {
  StudyView,
  type StudyViewData,
} from '@/features/study/components/study-view';
import { StudySessionMode } from '@/features/study/types/study.types';
import {
  useFolderFlashcards,
  useFolderTopics,
  useVocabularyFolderDetail,
} from '@/features/vocabulary/hooks';
import { RouteEnum } from '@/shared/constants';
import { useSetBreadcrumb, type BreadcrumbConfigItem } from '@/shared/hooks';
import { i18nText, includesI18n } from '@/shared/utils';
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
    () => topics.find((item) => includesI18n(item.topic, topicName)),
    [topics, topicName],
  );

  const localizedTopicTitle = topicInfo
    ? i18nText(topicInfo.topic, locale)
    : topicName;
  const flashcards = useMemo(
    () => flashcardsPage?.data ?? [],
    [flashcardsPage?.data],
  );

  const folderDisplayName = i18nText(folderDetail?.name, locale);

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
        label: localizedTopicTitle || topicName,
        isLoading:
          (isLoadingTopics || isLoadingFlashcards) &&
          !localizedTopicTitle &&
          !topicName,
      });
      return items;
    }, [
      t,
      folderId,
      folderDetail,
      folderDisplayName,
      isLoadingFolder,
      localizedTopicTitle,
      topicName,
      isLoadingTopics,
      isLoadingFlashcards,
    ]),
  );

  const startStudy = (mode: StudySessionMode) => {
    if (!flashcards.length) return;

    if (mode === StudySessionMode.LEARN_NEW) {
      const unlearned = flashcards.filter(
        (c) =>
          (c.level ?? 0) === 0 &&
          (c.learningStep ?? 0) === 0 &&
          (c.masteryScore ?? 0) === 0,
      );
      if (unlearned.length === 0) {
        toast.info(t('allWordsLearnedInTopic'));
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
      selectedTopic: topicName,
      mode,
      folderName: localizedTopicTitle || topicName,
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
    return <NotFoundView />;
  }

  return (
    <div className="w-full py-2 pb-36">
      <TopicWordsList flashcards={flashcards} />

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
