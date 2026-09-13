'use client';

import { useTranslations } from 'next-intl';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { CurrentLearningFolderCard } from '@/features/vocabulary/components/cards/current-learning-folder-card';
import { FrequentlyMissedWordsCard } from '@/features/vocabulary/components/cards/frequently-missed-words-card';
import { SpacedRepetitionCard } from '@/features/vocabulary/components/cards/spaced-repetition-card';
import { NotificationPromptCard } from '@/features/vocabulary/components/cards/notification-prompt-card';
import { SentencePracticeCard } from '@/features/vocabulary/components/cards/sentence-practice-card';
import { FolderCatalogSection } from '@/features/vocabulary/components/cards/folder-catalog-section';
import { CreateFolderDialog } from '@/features/vocabulary/components/dialogs/create-folder-dialog';
import { DueWordsListView } from '@/features/vocabulary/components/folder-detail/due-words-list-view';
import { MasteryOverviewCard } from '@/features/vocabulary/components/mastery/mastery-overview-card';
import { FolderSelectionView } from '@/features/study/components/folder-selection-view';
import { StudySessionMode } from '@/features/study/types/study.types';
import {
  StudyView,
  type StudyViewData,
} from '@/features/study/components/study-view';
import { useDueFlashcards } from '@/features/study/hooks';
import {
  useVocabularyFolderDetail,
  useVocabularyFolders,
} from '@/features/vocabulary/hooks';
import { RouteEnum } from '@/shared/constants';
import { formatUrl } from '@lumen/shared-api';
import { Skeleton } from '@lumen/uikit/components';
import { usePortal, usePortalWithoutBackdrop } from '@lumen/uikit/portal';
import type { VocabularyWord } from '@/services/vocabulary';

export function FolderListPage() {
  const t = useTranslations('Vocabulary.Folders');
  const tStudy = useTranslations('Vocabulary.Study');
  const router = useRouter();

  const { data, isLoading } = useVocabularyFolders();
  const [presentCreateFolder] = usePortal(CreateFolderDialog);
  const [presentStudyView] = usePortalWithoutBackdrop<StudyViewData>(StudyView);

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isSelectingFolder, setIsSelectingFolder] = useState(false);
  const [isViewingDueWords, setIsViewingDueWords] = useState(false);

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
    folderId: activeFolder?.id,
  });

  const { data: activeFolderDetail } = useVocabularyFolderDetail(
    activeFolder?.id || '',
    {
      enabled: Boolean(activeFolder?.id),
    },
  );

  const dueCountForActive = useMemo(() => {
    if (!dueFlashcards?.data) return 0;
    return dueFlashcards.data.filter(
      (card) =>
        Boolean(card.nextReviewAt) ||
        (card.level ?? 0) > 0 ||
        (card.learningStep ?? 0) > 0,
    ).length;
  }, [dueFlashcards?.data]);

  const handleSelectFolder = (folderId: string) => {
    setSelectedFolderId(folderId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lumen_selected_folder_id', folderId);
    }
    setIsSelectingFolder(false);
    setIsViewingDueWords(false);
  };

  const handleViewFolder = (folderId?: string) => {
    const targetId = folderId || activeFolder?.id;
    if (!targetId) return;
    router.push(formatUrl(RouteEnum.FOLDER_DETAIL, { id: targetId }));
  };

  const allFlashcards: VocabularyWord[] = useMemo(
    () => activeFolderDetail?.flashcards || [],
    [activeFolderDetail?.flashcards],
  );

  const dueIdSet = useMemo(() => {
    const targetDueData = dueFlashcards?.data || [];
    return new Set(
      targetDueData
        .filter(
          (card) =>
            Boolean(card.nextReviewAt) ||
            (card.level ?? 0) > 0 ||
            (card.learningStep ?? 0) > 0,
        )
        .flatMap((df) => [df.wordId, df.flashcardId]),
    );
  }, [dueFlashcards?.data]);

  const dueCardsList: VocabularyWord[] = useMemo(() => {
    return allFlashcards.filter(
      (card) =>
        dueIdSet.has(card.id) ||
        Boolean(card.wordId && dueIdSet.has(card.wordId)) ||
        Boolean(card.flashcardId && dueIdSet.has(card.flashcardId)),
    );
  }, [allFlashcards, dueIdSet]);

  const learnedCardsList: VocabularyWord[] = useMemo(() => {
    return allFlashcards.filter(
      (card) =>
        (card.level ?? 0) > 0 ||
        (card.learningStep ?? 0) > 0 ||
        (card.masteryScore ?? 0) > 0,
    );
  }, [allFlashcards]);

  const uniqueFlashcards: VocabularyWord[] = useMemo(() => {
    const seen = new Set<string>();
    const list: VocabularyWord[] = [];
    for (const card of allFlashcards) {
      const termKey = card.term.toLowerCase().trim();
      if (!seen.has(termKey)) {
        seen.add(termKey);
        list.push(card);
      }
    }
    return list;
  }, [allFlashcards]);

  const frequentlyMissedCards = useMemo(() => {
    if (!uniqueFlashcards.length) return [];
    return uniqueFlashcards.filter((card) => Boolean(card.isWilted)).slice(0, 3);
  }, [uniqueFlashcards]);

  const handleLearnNew = () => {
    if (!allFlashcards.length || !activeFolder) return;
    presentStudyView({
      cards: allFlashcards,
      folderName: `${activeFolder.name} - ${tStudy('learnNew')}`,
      mode: StudySessionMode.LEARN_NEW,
    });
  };

  const handlePractice = () => {
    if (!allFlashcards.length || !activeFolder) return;
    const targetDueData = dueFlashcards?.data || [];
    const dueIdSet = new Set(
      targetDueData.flatMap((df) => [df.wordId, df.flashcardId]),
    );
    const dueCards = allFlashcards.filter(
      (card) =>
        dueIdSet.has(card.id) ||
        Boolean(card.wordId && dueIdSet.has(card.wordId)) ||
        Boolean(card.flashcardId && dueIdSet.has(card.flashcardId)),
    );
    const practiceCards = dueCards.length > 0 ? dueCards : allFlashcards;

    presentStudyView({
      cards: practiceCards,
      folderName: `${activeFolder.name} - ${tStudy('practice')}`,
      mode: StudySessionMode.PRACTICE,
    });
  };

  const handleFlashcards = () => {
    if (!allFlashcards.length || !activeFolder) return;
    const targetDueData = dueFlashcards?.data || [];
    const dueIdSet = new Set(
      targetDueData.flatMap((df) => [df.wordId, df.flashcardId]),
    );
    const dueCards = allFlashcards.filter(
      (card) =>
        dueIdSet.has(card.id) ||
        Boolean(card.wordId && dueIdSet.has(card.wordId)) ||
        Boolean(card.flashcardId && dueIdSet.has(card.flashcardId)),
    );
    const flashcardsList = dueCards.length > 0 ? dueCards : allFlashcards;

    presentStudyView({
      cards: flashcardsList,
      folderName: `${activeFolder.name} - ${tStudy('flashcards')}`,
      mode: StudySessionMode.FLASHCARD,
    });
  };

  const handlePracticeMissed = () => {
    if (!frequentlyMissedCards.length) return;
    presentStudyView({
      cards: frequentlyMissedCards,
      folderName: `${t('frequentlyMissedTitle')} - ${tStudy('practice')}`,
      mode: StudySessionMode.PRACTICE,
    });
  };

  const handleFlashcardsMissed = () => {
    if (!frequentlyMissedCards.length) return;
    presentStudyView({
      cards: frequentlyMissedCards,
      folderName: `${t('frequentlyMissedTitle')} - ${tStudy('flashcards')}`,
      mode: StudySessionMode.FLASHCARD,
    });
  };

  const totalWordsCount = activeFolder?.flashcardCount || 0;

  const { learnedWordsCount, stages } = useMemo(() => {
    if (!allFlashcards.length) {
      return {
        learnedWordsCount: 0,
        stages: [
          { level: 1, count: 0 },
          { level: 2, count: 0 },
          { level: 3, count: 0 },
          { level: 4, count: 0 },
          { level: 5, count: 0 },
        ],
      };
    }

    const learned = allFlashcards.filter(
      (card) =>
        (card.level ?? 0) > 0 ||
        (card.learningStep ?? 0) > 0 ||
        (card.masteryScore ?? 0) > 0,
    );

    const s1 = allFlashcards.filter((c) => (c.level ?? 0) === 1).length;
    const s2 = allFlashcards.filter((c) => (c.level ?? 0) === 2).length;
    const s3 = allFlashcards.filter((c) => (c.level ?? 0) === 3).length;
    const s4 = allFlashcards.filter((c) => (c.level ?? 0) === 4).length;
    const s5 = allFlashcards.filter((c) => (c.level ?? 0) >= 5).length;

    return {
      learnedWordsCount: learned.length,
      stages: [
        { level: 1, count: s1 },
        { level: 2, count: s2 },
        { level: 3, count: s3 },
        { level: 4, count: s4 },
        { level: 5, count: s5 },
      ],
    };
  }, [allFlashcards]);

  const enrichedFolders = useMemo(() => {
    return allFolders.map((folder) => {
      if (folder.id === activeFolder?.id && activeFolderDetail) {
        return {
          ...folder,
          learnedCount: Math.max(folder.learnedCount ?? 0, learnedWordsCount),
          dueCount: dueCountForActive,
        };
      }
      return folder;
    });
  }, [allFolders, activeFolder?.id, activeFolderDetail, learnedWordsCount, dueCountForActive]);

  if (isViewingDueWords && activeFolder) {
    return (
      <DueWordsListView
        folderName={activeFolder.name}
        dueCards={dueCardsList}
        learnedCards={learnedCardsList}
        onBackToOverview={() => setIsViewingDueWords(false)}
        onPractice={(cards) =>
          presentStudyView({
            cards,
            folderName: `${activeFolder.name} - ${tStudy('practice')}`,
            mode: StudySessionMode.PRACTICE,
          })
        }
        onFlashcards={(cards) =>
          presentStudyView({
            cards,
            folderName: `${activeFolder.name} - ${tStudy('flashcards')}`,
            mode: StudySessionMode.FLASHCARD,
          })
        }
      />
    );
  }

  if (isSelectingFolder || (!isLoading && !activeFolder)) {
    return (
      <FolderSelectionView
        activeFolderId={activeFolder?.id || null}
        allFolders={enrichedFolders}
        isLoading={isLoading}
        onSelectFolder={handleSelectFolder}
        onBackToDashboard={
          activeFolder ? () => setIsSelectingFolder(false) : undefined
        }
        onCreateFolder={() => presentCreateFolder()}
        onViewFolderWords={(folderId) => handleViewFolder(folderId)}
      />
    );
  }

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
            onViewDueWords={() => setIsViewingDueWords(true)}
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
            onSwitchFolder={() => setIsSelectingFolder(true)}
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
