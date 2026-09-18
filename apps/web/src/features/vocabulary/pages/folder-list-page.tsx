'use client';

import { useTranslations } from 'next-intl';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import {
  StudyView,
  type StudyViewData,
} from '@/features/study/components/study-view';
import { useDueFlashcards } from '@/features/study/hooks';
import { CurrentLearningFolderCard } from '@/features/vocabulary/components/cards/current-learning-folder-card';
import { FolderCatalogSection } from '@/features/vocabulary/components/cards/folder-catalog-section';
import { FrequentlyMissedWordsCard } from '@/features/vocabulary/components/cards/frequently-missed-words-card';
import { NotificationPromptCard } from '@/features/vocabulary/components/cards/notification-prompt-card';
import { SentencePracticeCard } from '@/features/vocabulary/components/cards/sentence-practice-card';
import { SpacedRepetitionCard } from '@/features/vocabulary/components/cards/spaced-repetition-card';
import { CreateFolderDialog } from '@/features/vocabulary/components/dialogs/create-folder-dialog';
import {
  SwitchFolderDialog,
  type SwitchFolderDialogData,
} from '@/features/vocabulary/components/dialogs/switch-folder-dialog';
import { MasteryOverviewCard } from '@/features/vocabulary/components/mastery/mastery-overview-card';
import {
  useFolderStudyActions,
  useVocabularyFolders,
  useVocabularyOverview,
} from '@/features/vocabulary/hooks';
import {
  vocabularyKeys,
  vocabularyService,
  type VocabularyWord,
} from '@/services/vocabulary';
import { RouteEnum } from '@/shared/constants';
import { formatUrl } from '@lumen/shared-api';
import { Skeleton } from '@lumen/uikit/components';
import { usePortal, usePortalWithoutBackdrop } from '@lumen/uikit/portal';
import { useQueries } from '@tanstack/react-query';

export function FolderListPage() {
  const tStudy = useTranslations('Vocabulary.Study');
  const router = useRouter();

  const { data, isLoading } = useVocabularyFolders();
  const [presentCreateFolder] = usePortal(CreateFolderDialog);
  const [presentSwitchFolder] =
    usePortal<SwitchFolderDialogData>(SwitchFolderDialog);
  const [presentStudyView] = usePortalWithoutBackdrop<StudyViewData>(StudyView);

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const allFolders = useMemo(() => data?.data || [], [data?.data]);

  useEffect(() => {
    if (allFolders.length > 0 && !selectedFolderId) {
      const savedId =
        typeof window !== 'undefined'
          ? localStorage.getItem('lumen_selected_folder_id')
          : null;
      const matchedFolder =
        allFolders.find((folder) => folder.id === savedId) || allFolders[0];

      if (matchedFolder) {
        setSelectedFolderId(matchedFolder.id);
      }
    }
  }, [allFolders, selectedFolderId]);

  const activeFolder = useMemo(
    () =>
      allFolders.find((folder) => folder.id === selectedFolderId) ||
      allFolders[0] ||
      null,
    [allFolders, selectedFolderId],
  );

  const { data: dueFlashcards } = useDueFlashcards({
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

  const handleSelectFolder = (folderId: string) => {
    setSelectedFolderId(folderId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lumen_selected_folder_id', folderId);
    }
  };

  const handleViewFolder = (folderId?: string) => {
    const targetId = folderId || activeFolder?.id;
    if (!targetId) return;
    router.push(formatUrl(RouteEnum.FOLDER_DETAIL, { id: targetId }));
  };

  const { data: overviewRes } = useVocabularyOverview();
  const overviewData = overviewRes?.data;

  const {
    dueCardsList,
    learnedCardsList,
    frequentlyMissedCards,
    handlePractice,
    handleLearnNew,
    handleFlashcards,
    handlePracticeMissed,
    handleFlashcardsMissed,
  } = useFolderStudyActions({
    activeFolder,
    flashcards: allFlashcards,
    dueFlashcardsData: dueFlashcards?.data,
    presentStudyView,
  });

  const dueCountForActive = dueCardsList.length;
  const totalWordsCount = activeFolder?.flashcardCount || 0;

  const { learnedWordsCount, stages } = useMemo(() => {
    const stage1Count = allFlashcards.filter(
      (card) => (card.level ?? 0) === 1,
    ).length;
    const stage2Count = allFlashcards.filter(
      (card) => (card.level ?? 0) === 2,
    ).length;
    const stage3Count = allFlashcards.filter(
      (card) => (card.level ?? 0) === 3,
    ).length;
    const stage4Count = allFlashcards.filter(
      (card) => (card.level ?? 0) === 4,
    ).length;
    const stage5Count = allFlashcards.filter(
      (card) => (card.level ?? 0) >= 5,
    ).length;

    return {
      learnedWordsCount: learnedCardsList.length,
      stages: [
        { level: 1, count: stage1Count },
        { level: 2, count: stage2Count },
        { level: 3, count: stage3Count },
        { level: 4, count: stage4Count },
        { level: 5, count: stage5Count },
      ],
    };
  }, [allFlashcards, learnedCardsList.length]);

  const enrichedFolders = useMemo(() => {
    return allFolders.map((folder) => {
      if (folder.id === activeFolder?.id) {
        return {
          ...folder,
          learnedCount: Math.max(folder.learnedCount ?? 0, learnedWordsCount),
          dueCount: dueCountForActive,
        };
      }
      return folder;
    });
  }, [allFolders, activeFolder?.id, learnedWordsCount, dueCountForActive]);

  return (
    <div className="h-full max-h-full flex flex-col lg:flex-row items-stretch gap-7 lg:gap-8 w-full min-h-0">
      {/* LEFT COLUMN: Independent scroll, Mastery Overview, Notifications, Sentence Practice, Pinned Folder */}
      <div className="w-full lg:w-[360px] xl:w-[380px] shrink-0 h-full max-h-full min-h-0 overflow-y-auto space-y-4 pr-1.5 scrollbar-thin overscroll-contain pb-10">
        {isLoading ? (
          <Skeleton className="h-64 w-full rounded-3xl" />
        ) : (
          <MasteryOverviewCard
            totalWords={totalWordsCount}
            learnedWords={learnedWordsCount}
            dueCount={dueCountForActive}
            stages={stages}
            onViewDueWords={() => router.push(RouteEnum.VOCABULARY_DUE)}
            onReviewDue={handlePractice}
            onReviewAll={handleLearnNew}
            onFlashcards={handleFlashcards}
          />
        )}

        <NotificationPromptCard />

        <SentencePracticeCard
          usedCount={0}
          totalWords={totalWordsCount}
          onClick={handlePractice}
        />

        {isLoading ? (
          <Skeleton className="h-44 w-full rounded-3xl" />
        ) : (
          <CurrentLearningFolderCard
            activeFolder={activeFolder}
            dueCount={dueCountForActive}
            learnedCount={learnedWordsCount}
            onSwitchFolder={() =>
              presentSwitchFolder({
                activeFolderId: activeFolder?.id || null,
                onSelectFolder: (id) => setSelectedFolderId(id),
                onViewFolderWords: (id) => handleViewFolder(id),
              })
            }
            onStudyNow={handleLearnNew}
            onPractice={handlePractice}
            onFlashcards={handleFlashcards}
            onViewFolder={() => handleViewFolder()}
          />
        )}
      </div>

      {/* RIGHT COLUMN: Independent scroll, Spaced Repetition Banner, Missed Words, Folder Catalog */}
      <div className="flex-1 w-full h-full max-h-full min-h-0 overflow-y-auto space-y-5 pr-2 min-w-0 scrollbar-thin overscroll-contain pb-10">
        <SpacedRepetitionCard />

        <FrequentlyMissedWordsCard
          missedCards={frequentlyMissedCards}
          onReviewMissed={handlePracticeMissed}
          onFlashcardsMissed={handleFlashcardsMissed}
        />

        <FolderCatalogSection
          folders={enrichedFolders}
          activeFolderId={activeFolder?.id || null}
          isLoading={isLoading}
          onViewFolder={(folderId) => handleViewFolder(folderId)}
          onCreateFolder={() => presentCreateFolder()}
        />
      </div>
    </div>
  );
}
