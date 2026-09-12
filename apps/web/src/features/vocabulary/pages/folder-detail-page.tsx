'use client';

import { useTranslations } from 'next-intl';

import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';

import { useVocabularyFolderDetail } from '@/features/vocabulary/hooks';
import { useDueFlashcards } from '@/features/study/hooks';
import { RouteEnum } from '@/shared/constants';
import { useGoBack } from '@/shared/hooks';
import { Skeleton } from '@lumen/uikit/components';
import { usePortalWithoutBackdrop } from '@lumen/uikit/portal';
import {
  StudyView,
  type StudyViewData,
} from '@/features/study/components/study-view';
import { StudySessionMode } from '@/features/study/types/study.types';
import { StudyBottomActionBar } from '@/features/study/components/study-bottom-action-bar';
import {
  FolderTopicGrid,
  type TopicStatItem,
} from '../components/folder-detail/folder-topic-grid';
import { TopicWordsList } from '../components/folder-detail/topic-words-list';

interface FolderDetailPageProps {
  folderId?: string;
}

export function FolderDetailPage({
  folderId: propFolderId,
}: FolderDetailPageProps = {}) {
  const t = useTranslations('Vocabulary.Folders');
  const params = useParams();
  const routeId = typeof params?.id === 'string' ? params.id : '';
  const folderId = propFolderId || routeId;

  const goBack = useGoBack(RouteEnum.VOCABULARY);
  const { data: folderDetail, isLoading } = useVocabularyFolderDetail(folderId);
  const { data: dueFlashcardsResponse } = useDueFlashcards(
    { folderId },
    { enabled: Boolean(folderId) },
  );
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isViewingWords, setIsViewingWords] = useState(false);
  const [presentStudyView] = usePortalWithoutBackdrop<StudyViewData>(StudyView);

  const flashcards = useMemo(
    () => folderDetail?.flashcards || [],
    [folderDetail?.flashcards],
  );

  const dueFlashcards = useMemo(
    () => dueFlashcardsResponse?.data || [],
    [dueFlashcardsResponse?.data],
  );

  const topicStats: TopicStatItem[] = useMemo(() => {
    if (!flashcards.length) return [];
    const dueIdSet = new Set(
      dueFlashcards.flatMap((df) => [df.flashcardId, df.wordId]),
    );

    const topicMap = new Map<
      string,
      {
        count: number;
        learnedCount: number;
        dueCount: number;
        viName: string;
        imageUrl: string;
      }
    >();

    flashcards.forEach((card) => {
      const top = card.topic?.trim() || t('generalTopic');
      const isLearned =
        (card.level ?? 0) >= 1 || (card.learningStep ?? 0) >= 1;
      const isDue =
        dueIdSet.has(card.id) ||
        Boolean(card.wordId && dueIdSet.has(card.wordId)) ||
        Boolean(card.flashcardId && dueIdSet.has(card.flashcardId));

      const existing = topicMap.get(top);
      if (existing) {
        existing.count += 1;
        if (isLearned) existing.learnedCount += 1;
        if (isDue) existing.dueCount += 1;
        if (!existing.viName && card.topicVi) existing.viName = card.topicVi;
        if (!existing.imageUrl && card.topicImageUrl)
          existing.imageUrl = card.topicImageUrl;
      } else {
        topicMap.set(top, {
          count: 1,
          learnedCount: isLearned ? 1 : 0,
          dueCount: isDue ? 1 : 0,
          viName: card.topicVi || top,
          imageUrl: card.topicImageUrl || '',
        });
      }
    });

    return Array.from(topicMap.entries())
      .map(([name, data]) => ({
        name,
        viName: data.viName,
        imageUrl: data.imageUrl,
        count: data.count,
        learnedCount: data.learnedCount,
        dueCount: data.dueCount,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [flashcards, dueFlashcards, t]);

  const displayedFlashcards = useMemo(() => {
    if (!selectedTopic) return [];
    return flashcards.filter((card) => {
      const top = card.topic?.trim() || t('generalTopic');
      return top === selectedTopic;
    });
  }, [flashcards, selectedTopic, t]);

  const selectedTopicStat = useMemo(() => {
    if (!selectedTopic) return null;
    return (
      topicStats.find((topicItem) => topicItem.name === selectedTopic) || null
    );
  }, [topicStats, selectedTopic]);

  const handleTopicClick = (topicName: string) => {
    setSelectedTopic(topicName);
    setIsViewingWords(true);
  };

  const handleBackToTopics = () => {
    setIsViewingWords(false);
    setSelectedTopic(null);
  };

  const startStudy = (
    topicName: string | null,
    mode?: StudySessionMode,
  ) => {
    let cardsToStudy = flashcards;
    if (topicName) {
      cardsToStudy = flashcards.filter((card) => {
        const top = card.topic?.trim() || t('generalTopic');
        return top === topicName;
      });
    } else {
      cardsToStudy = [...flashcards].sort(() => Math.random() - 0.5);
    }

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
          category={folderDetail.category}
          description={folderDetail.description}
          selectedTopic={selectedTopic}
          topicStats={topicStats}
          onSelectTopic={handleTopicClick}
          onGoBack={goBack}
        />
      ) : (
        <TopicWordsList
          topicName={selectedTopic || ''}
          topicViName={selectedTopicStat?.viName}
          flashcards={displayedFlashcards}
          onBackToTopics={handleBackToTopics}
        />
      )}

      {/* Floating Bottom Sticky Action Bar */}
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
