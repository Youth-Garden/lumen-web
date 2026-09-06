'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { CurrentLearningFolderCard } from '@/features/vocabulary/components/cards/current-learning-folder-card';
import { FrequentlyMissedWordsCard } from '@/features/vocabulary/components/cards/frequently-missed-words-card';
import { SpacedRepetitionCard } from '@/features/vocabulary/components/cards/spaced-repetition-card';
import { CreateFolderDialog } from '@/features/vocabulary/components/dialogs/create-folder-dialog';
import { MasteryOverviewCard } from '@/features/vocabulary/components/mastery/mastery-overview-card';
import { FolderSelectionView } from '@/features/vocabulary/components/study/folder-selection-view';
import { StudyView } from '@/features/vocabulary/components/study/study-view';
import {
  useDueFlashcards,
  useVocabularyFolderDetail,
  useVocabularyFolders,
} from '@/features/vocabulary/hooks';
import { RouteEnum } from '@/shared/constants';
import { formatUrl } from '@lumen/shared-api';
import { Skeleton } from '@lumen/uikit/components';
import { usePortal } from '@lumen/uikit/portal';
import type { VocabularyWord } from '@/services/vocabulary/vocabulary.types';

export function FolderListPage() {
  const t = useTranslations('Vocabulary.Folders');
  const router = useRouter();

  const { data, isLoading } = useVocabularyFolders();
  const [presentCreateFolder] = usePortal(CreateFolderDialog);

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isSelectingFolder, setIsSelectingFolder] = useState(false);
  const [isStudyOpen, setIsStudyOpen] = useState(false);
  const [studyCardsToUse, setStudyCardsToUse] = useState<VocabularyWord[]>([]);
  const [studyFolderTitle, setStudyFolderTitle] = useState<string>('');

  const allFolders = useMemo(() => data?.data || [], [data?.data]);

  // Sync selected folder from localStorage or pick the first available folder dynamically
  useEffect(() => {
    if (allFolders.length > 0 && !selectedFolderId) {
      const savedId =
        typeof window !== 'undefined'
          ? localStorage.getItem('lumen_selected_folder_id') ||
            localStorage.getItem('lumen_selected_folder_id')
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

  // Load due flashcards for the active folder directly from backend
  const { data: dueFlashcards } = useDueFlashcards({
    folderId: activeFolder?.id,
  });

  // Load detail / flashcards for active folder directly from backend
  const { data: activeFolderDetail, isLoading: isFolderLoading } =
    useVocabularyFolderDetail(activeFolder?.id || '', {
      enabled: Boolean(activeFolder?.id),
    });

  const dueCountForActive = dueFlashcards?.data?.length || 0;

  const handleSelectFolder = (folderId: string) => {
    setSelectedFolderId(folderId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lumen_selected_folder_id', folderId);
    }
    setIsSelectingFolder(false);
  };

  const handleViewFolder = () => {
    if (!activeFolder) return;
    router.push(formatUrl(RouteEnum.FOLDER_DETAIL, { id: activeFolder.id }));
  };

  const allFlashcards: VocabularyWord[] = useMemo(
    () => activeFolderDetail?.flashcards || [],
    [activeFolderDetail?.flashcards],
  );

  // Frequently missed cards (top cards that are due or focus words)
  const frequentlyMissedCards = useMemo(() => {
    if (!allFlashcards.length) return [];
    if (dueFlashcards?.data && dueFlashcards.data.length > 0) {
      const dueWordIds = new Set(dueFlashcards.data.map((df) => df.wordId));
      const matched = allFlashcards.filter((card) => dueWordIds.has(card.id));
      if (matched.length > 0) {
        return matched.slice(0, 4);
      }
    }
    return allFlashcards.slice(0, 4);
  }, [allFlashcards, dueFlashcards?.data]);

  // Launch study with full set of cards
  const handleStudyAll = () => {
    if (!allFlashcards.length || !activeFolder) return;
    setStudyCardsToUse(allFlashcards);
    setStudyFolderTitle(activeFolder.name);
    setIsStudyOpen(true);
  };

  // Launch study with due cards
  const handleStudyDue = () => {
    if (!allFlashcards.length || !activeFolder) return;
    if (dueFlashcards?.data && dueFlashcards.data.length > 0) {
      const dueWordIds = new Set(dueFlashcards.data.map((df) => df.wordId));
      const dueCards = allFlashcards.filter((card) => dueWordIds.has(card.id));
      if (dueCards.length > 0) {
        setStudyCardsToUse(dueCards);
        setStudyFolderTitle(
          `${activeFolder.name} - ${t('wordsToReviewTitle', { count: dueCards.length })}`,
        );
        setIsStudyOpen(true);
        return;
      }
    }
    handleStudyAll();
  };

  // Launch study for frequently missed cards
  const handleStudyMissed = () => {
    if (!frequentlyMissedCards.length || !activeFolder) return;
    setStudyCardsToUse(frequentlyMissedCards);
    setStudyFolderTitle(`${activeFolder.name} - ${t('frequentlyMissedTitle')}`);
    setIsStudyOpen(true);
  };

  const totalWordsCount = activeFolder?.flashcardCount || 0;
  const learnedWordsCount = Math.min(
    totalWordsCount,
    Math.max(dueCountForActive * 4, Math.round(totalWordsCount * 0.42)),
  );

  const isContentLoading =
    isLoading || (isFolderLoading && !allFlashcards.length);

  // If user clicked "Đổi thư mục" or no active folder exists yet, render full Folder Selection View
  if (isSelectingFolder || (!isLoading && !activeFolder)) {
    return (
      <FolderSelectionView
        activeFolderId={activeFolder?.id || null}
        allFolders={allFolders}
        isLoading={isLoading}
        onSelectFolder={handleSelectFolder}
        onBackToDashboard={
          activeFolder ? () => setIsSelectingFolder(false) : undefined
        }
        onCreateFolder={() => presentCreateFolder()}
        onViewFolderWords={(folderId) => {
          router.push(formatUrl(RouteEnum.FOLDER_DETAIL, { id: folderId }));
        }}
      />
    );
  }

  return (
    <div className="flex flex-col space-y-7 p-1 sm:p-2">
      {/* 1. Active Learning Folder (Hero Banner) - Page title is hidden when folder is active */}
      {isLoading ? (
        <Skeleton className="h-40 w-full rounded-3xl" />
      ) : (
        <CurrentLearningFolderCard
          activeFolder={activeFolder}
          dueCount={dueCountForActive}
          onSwitchFolder={() => setIsSelectingFolder(true)}
          onStudyNow={handleStudyAll}
          onViewFolder={handleViewFolder}
          isLoading={isContentLoading}
        />
      )}

      {/* 2. Three Action & Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Spaced Repetition (SRS) */}
        <SpacedRepetitionCard />

        {/* Card 2: Frequently Missed Words */}
        <FrequentlyMissedWordsCard
          missedCards={frequentlyMissedCards}
          onReviewMissed={handleStudyMissed}
        />

        {/* Card 3: Mastery Overview */}
        <MasteryOverviewCard
          totalWords={totalWordsCount}
          learnedWords={learnedWordsCount}
          dueCount={dueCountForActive}
          onReviewDue={handleStudyDue}
          onReviewAll={handleStudyAll}
        />
      </div>

      {/* Embedded Study View Modal */}
      {isStudyOpen && studyCardsToUse.length > 0 && (
        <StudyView
          cards={studyCardsToUse}
          isOpen={isStudyOpen}
          onClose={() => setIsStudyOpen(false)}
          folderName={studyFolderTitle}
        />
      )}
    </div>
  );
}
