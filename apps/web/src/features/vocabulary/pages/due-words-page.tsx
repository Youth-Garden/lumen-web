'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';

import {
  StudyView,
  type StudyViewData,
} from '@/features/study/components/study-view';
import { useDueFlashcards } from '@/features/study/hooks';
import { StudySessionMode } from '@/features/study/types/study.types';
import { DueWordsListView } from '@/features/vocabulary/components/folder-detail/due-words-list-view';
import { useVocabularyFolders } from '@/features/vocabulary/hooks';
import {
  vocabularyKeys,
  vocabularyService,
  type VocabularyWord,
} from '@/services/vocabulary';
import { RouteEnum } from '@/shared/constants';
import { useSetBreadcrumb, type BreadcrumbConfigItem } from '@/shared/hooks';
import { Skeleton } from '@lumen/uikit/components';
import { usePortalWithoutBackdrop } from '@lumen/uikit/portal';

export function DueWordsPage() {
  const tStudy = useTranslations('Vocabulary.Study');
  const tFolders = useTranslations('Vocabulary.Folders');
  const router = useRouter();

  const { data: foldersData, isLoading: isLoadingFolders } =
    useVocabularyFolders();
  const [presentStudyView] = usePortalWithoutBackdrop<StudyViewData>(StudyView);

  const allFolders = useMemo(() => foldersData?.data || [], [foldersData?.data]);

  const { data: dueFlashcards, isLoading: isLoadingDue } = useDueFlashcards({
    limit: 500,
  });

  const folderQueries = useQueries({
    queries: allFolders.map((folder) => ({
      queryKey: vocabularyKeys.folderFlashcards(folder.id),
      queryFn: () =>
        vocabularyService
          .getFolderFlashcards(folder.id, undefined, 1, 500)
          .then((res) => res.data),
      enabled: Boolean(folder.id),
    })),
  });

  const isLoadingCards = folderQueries.some((q) => q.isLoading);

  const allFlashcards = useMemo(() => {
    const list: VocabularyWord[] = [];
    const seen = new Set<string>();
    for (const q of folderQueries) {
      const cards = q.data?.data || [];
      for (const card of cards) {
        if (!seen.has(card.id)) {
          seen.add(card.id);
          list.push(card);
        }
      }
    }
    return list;
  }, [folderQueries]);

  const dueIdSet = useMemo(() => {
    return new Set(
      (dueFlashcards?.data || [])
        .filter(
          (card) =>
            Boolean(card.nextReviewAt) ||
            (card.level ?? 0) > 0 ||
            (card.learningStep ?? 0) > 0 ||
            Boolean(card.isWilted),
        )
        .flatMap((d) => [d.wordId, d.flashcardId]),
    );
  }, [dueFlashcards?.data]);

  const enrichedFlashcards = useMemo(() => {
    return allFlashcards.map((card) => {
      const isDue =
        dueIdSet.has(card.id) ||
        Boolean(card.wordId && dueIdSet.has(card.wordId)) ||
        Boolean(card.flashcardId && dueIdSet.has(card.flashcardId)) ||
        Boolean(card.isWilted);

      return isDue ? { ...card, isWilted: true } : card;
    });
  }, [allFlashcards, dueIdSet]);

  const dueCardsList = useMemo(() => {
    return enrichedFlashcards.filter(
      (card) =>
        ((card.level ?? 0) >= 1 || (card.learningStep ?? 0) >= 5) &&
        Boolean(card.isWilted),
    );
  }, [enrichedFlashcards]);

  const learnedCardsList = useMemo(() => {
    return enrichedFlashcards.filter(
      (card) =>
        (card.level ?? 0) >= 1 || (card.learningStep ?? 0) >= 5,
    );
  }, [enrichedFlashcards]);

  useSetBreadcrumb(
    useMemo(() => {
      const items: BreadcrumbConfigItem[] = [
        { label: tFolders('title'), href: RouteEnum.VOCABULARY },
        { label: tFolders('viewDueWordsTitle') },
      ];
      return items;
    }, [tFolders]),
  );

  const handleBackToOverview = () => {
    router.push(RouteEnum.VOCABULARY);
  };

  const isLoading = isLoadingFolders || isLoadingDue || isLoadingCards;

  if (isLoading) {
    return (
      <div className="w-full py-4 pb-20 space-y-6">
        <Skeleton className="h-9 w-64 rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-2">
      <DueWordsListView
        dueCards={dueCardsList}
        learnedCards={learnedCardsList}
        onBackToOverview={handleBackToOverview}
        onPractice={(cards) =>
          presentStudyView({
            cards,
            folderName: `${tFolders('viewDueWordsTitle')} - ${tStudy('practice')}`,
            mode: StudySessionMode.PRACTICE,
          })
        }
        onFlashcards={(cards) =>
          presentStudyView({
            cards,
            folderName: `${tFolders('viewDueWordsTitle')} - ${tStudy('flashcards')}`,
            mode: StudySessionMode.FLASHCARD,
          })
        }
      />
    </div>
  );
}
