'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';

import {
  StudyView,
  type StudyViewData,
} from '@/features/study/components/study-view';
import { useDueFlashcards } from '@/features/study/hooks';
import { StudySessionMode } from '@/features/study/types/study.types';
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
  calculateGlobalStages,
  calculateGlobalTotalWords,
  extractFrequentlyMissedCards,
  extractGlobalDueCards,
} from '@/features/vocabulary/utils';
import {
  vocabularyKeys,
  vocabularyService,
  type VocabularyWord,
} from '@/services/vocabulary';
import { RouteEnum } from '@/shared/constants';
import { useLocalStorage } from '@lumen/hooks';
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

  const [selectedFolderId, setSelectedFolderId] = useLocalStorage<
    string | null
  >('lumen_selected_folder_id', null);

  const allFolders = useMemo(() => data?.data || [], [data?.data]);

  useEffect(() => {
    if (allFolders.length > 0 && !selectedFolderId) {
      const defaultFolder = allFolders[0];
      if (defaultFolder) {
        setSelectedFolderId(defaultFolder.id);
      }
    }
  }, [allFolders, selectedFolderId, setSelectedFolderId]);

  const activeFolder = useMemo(
    () =>
      allFolders.find((folder) => folder.id === selectedFolderId) ||
      allFolders[0] ||
      null,
    [allFolders, selectedFolderId],
  );

  const { data: dueFlashcards } = useDueFlashcards({ limit: 500 });
  const { data: overviewRes } = useVocabularyOverview();
  const overviewData = overviewRes?.data;

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

  const activeFolderIndex = useMemo(
    () => allFolders.findIndex((folder) => folder.id === activeFolder?.id),
    [allFolders, activeFolder?.id],
  );

  const activeFolderFlashcards = useMemo(() => {
    if (activeFolderIndex < 0) return [];
    return folderQueries[activeFolderIndex]?.data?.data || [];
  }, [activeFolderIndex, folderQueries]);

  const {
    dueCardsList: activeFolderDueCards,
    learnedCardsList: activeFolderLearnedCards,
    handlePractice: handleFolderPractice,
    handleLearnNew: handleFolderLearnNew,
    handleFlashcards: handleFolderFlashcards,
  } = useFolderStudyActions({
    activeFolder,
    flashcards: activeFolderFlashcards,
    dueFlashcardsData: dueFlashcards?.data,
    presentStudyView,
  });

  const activeFolderDueCount =
    activeFolder?.dueCount ?? activeFolderDueCards.length;
  const activeFolderLearnedCount =
    activeFolder?.learnedCount ?? activeFolderLearnedCards.length;

  const globalTotalWords = useMemo(
    () => calculateGlobalTotalWords(allFolders),
    [allFolders],
  );

  const globalDueCards = useMemo(
    () => extractGlobalDueCards(allFlashcards),
    [allFlashcards],
  );

  const globalDueCount = useMemo(
    () =>
      dueFlashcards?.data?.length ??
      overviewData?.dueCount ??
      globalDueCards.length,
    [
      dueFlashcards?.data?.length,
      overviewData?.dueCount,
      globalDueCards.length,
    ],
  );

  const { globalLearnedCount, stages } = useMemo(
    () => calculateGlobalStages(allFlashcards, overviewData),
    [allFlashcards, overviewData],
  );

  const frequentlyMissedCards = useMemo(
    () => extractFrequentlyMissedCards(allFlashcards, 3),
    [allFlashcards],
  );

  const handleGlobalPractice = () => {
    const cardsToStudy =
      globalDueCards.length > 0 ? globalDueCards : allFlashcards;
    if (!cardsToStudy.length) return;
    presentStudyView({
      cards: cardsToStudy,
      folderName: tStudy('practice'),
      isReviewMode: globalDueCards.length > 0,
      mode: StudySessionMode.PRACTICE,
    });
  };

  const handleGlobalLearnNew = () => {
    const unlearned = allFlashcards.filter(
      (card) =>
        (card.level ?? 0) === 0 &&
        (card.learningStep ?? 0) === 0 &&
        (card.masteryScore ?? 0) === 0,
    );

    if (!allFlashcards.length) return;

    if (unlearned.length === 0) {
      toast.info(tStudy('allWordsLearnedInFolder'));
      handleGlobalPractice();
      return;
    }

    presentStudyView({
      cards: allFlashcards,
      folderName: tStudy('learnNew'),
      mode: StudySessionMode.LEARN_NEW,
    });
  };

  const handleGlobalFlashcards = () => {
    if (!allFlashcards.length) return;
    presentStudyView({
      cards: allFlashcards,
      folderName: tStudy('flashcards'),
      mode: StudySessionMode.FLASHCARD,
    });
  };

  const handlePracticeMissed = () => {
    if (!frequentlyMissedCards.length) return;
    presentStudyView({
      cards: frequentlyMissedCards,
      folderName: tStudy('practice'),
      isReviewMode: true,
      mode: StudySessionMode.PRACTICE,
    });
  };

  const handleFlashcardsMissed = () => {
    if (!frequentlyMissedCards.length) return;
    presentStudyView({
      cards: frequentlyMissedCards,
      folderName: tStudy('flashcards'),
      mode: StudySessionMode.FLASHCARD,
    });
  };

  const handleViewFolder = (folderId?: string) => {
    const targetId = folderId || activeFolder?.id;
    if (!targetId) return;
    router.push(formatUrl(RouteEnum.FOLDER_DETAIL, { id: targetId }));
  };

  return (
    <div className="h-full max-h-full flex flex-col lg:flex-row items-stretch gap-7 lg:gap-8 w-full min-h-0">
      {/* LEFT COLUMN: Independent scroll, Mastery Overview, Notifications, Sentence Practice, Pinned Folder */}
      <div className="w-full lg:w-[360px] xl:w-[380px] shrink-0 h-full max-h-full min-h-0 overflow-y-auto space-y-4 pr-1.5 scrollbar-thin overscroll-contain pb-10">
        {isLoading ? (
          <Skeleton className="h-64 w-full rounded-3xl" />
        ) : (
          <MasteryOverviewCard
            totalWords={globalTotalWords}
            learnedWords={globalLearnedCount}
            dueCount={globalDueCount}
            stages={stages}
            onViewDueWords={() => router.push(RouteEnum.VOCABULARY_DUE)}
            onReviewDue={handleGlobalPractice}
            onReviewAll={handleGlobalLearnNew}
            onFlashcards={handleGlobalFlashcards}
          />
        )}

        <NotificationPromptCard />

        <SentencePracticeCard
          usedCount={0}
          totalWords={globalTotalWords}
          onClick={handleGlobalPractice}
        />

        {isLoading ? (
          <Skeleton className="h-44 w-full rounded-3xl" />
        ) : (
          <CurrentLearningFolderCard
            activeFolder={activeFolder}
            dueCount={activeFolderDueCount}
            learnedCount={activeFolderLearnedCount}
            onSwitchFolder={() =>
              presentSwitchFolder({
                activeFolderId: activeFolder?.id || null,
                onSelectFolder: (id) => setSelectedFolderId(id),
                onViewFolderWords: (id) => handleViewFolder(id),
              })
            }
            onStudyNow={handleFolderLearnNew}
            onPractice={handleFolderPractice}
            onFlashcards={handleFolderFlashcards}
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
          folders={allFolders}
          activeFolderId={activeFolder?.id || null}
          isLoading={isLoading}
          onViewFolder={(folderId) => handleViewFolder(folderId)}
          onCreateFolder={() => presentCreateFolder()}
        />
      </div>
    </div>
  );
}
