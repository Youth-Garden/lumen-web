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
import { MasteryOverviewCard } from '@/features/vocabulary/components/mastery/mastery-overview-card';
import { FolderSelectionView } from '@/features/study/components/folder-selection-view';
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
  const router = useRouter();

  const { data, isLoading } = useVocabularyFolders();
  const [presentCreateFolder] = usePortal(CreateFolderDialog);
  const [presentStudyView] = usePortalWithoutBackdrop<StudyViewData>(StudyView);

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isSelectingFolder, setIsSelectingFolder] = useState(false);

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

  const dueCountForActive = dueFlashcards?.data?.length || 0;

  const handleSelectFolder = (folderId: string) => {
    setSelectedFolderId(folderId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lumen_selected_folder_id', folderId);
    }
    setIsSelectingFolder(false);
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
    if (dueFlashcards?.data && dueFlashcards.data.length > 0) {
      const dueWordIds = new Set(dueFlashcards.data.map((df) => df.wordId));
      const matched = uniqueFlashcards.filter((card) =>
        dueWordIds.has(card.id),
      );
      if (matched.length > 0) {
        return matched.slice(0, 3);
      }
    }
    return uniqueFlashcards.slice(0, 3);
  }, [uniqueFlashcards, dueFlashcards?.data]);

  const handleStudyAll = () => {
    if (!allFlashcards.length || !activeFolder) return;
    presentStudyView({
      cards: allFlashcards,
      folderName: activeFolder.name,
    });
  };

  const handleStudyDue = () => {
    if (!allFlashcards.length || !activeFolder) return;
    if (dueFlashcards?.data && dueFlashcards.data.length > 0) {
      const dueWordIds = new Set(dueFlashcards.data.map((df) => df.wordId));
      const dueCards = allFlashcards.filter((card) => dueWordIds.has(card.id));
      if (dueCards.length > 0) {
        presentStudyView({
          cards: dueCards,
          folderName: `${activeFolder.name} - ${t('reviewNormal')}`,
        });
        return;
      }
    }
    handleStudyAll();
  };

  const handleStudyMissed = () => {
    if (!frequentlyMissedCards.length || !activeFolder) return;
    presentStudyView({
      cards: frequentlyMissedCards,
      folderName: `${activeFolder.name} - ${t('frequentlyMissedTitle')}`,
    });
  };

  const totalWordsCount = activeFolder?.flashcardCount || 0;
  const learnedWordsCount = Math.min(
    totalWordsCount,
    Math.max(dueCountForActive * 4, Math.round(totalWordsCount * 0.42)),
  );

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
            onReviewDue={handleStudyDue}
            onReviewAll={handleStudyAll}
            onFlashcards={handleStudyAll}
          />
        )}

        <NotificationPromptCard />

        <SentencePracticeCard
          usedCount={12}
          totalWords={totalWordsCount || 608}
          onClick={handleStudyAll}
        />

        {isLoading ? (
          <Skeleton className="h-44 w-full rounded-3xl" />
        ) : (
          <CurrentLearningFolderCard
            activeFolder={activeFolder}
            dueCount={dueCountForActive}
            onSwitchFolder={() => setIsSelectingFolder(true)}
            onStudyNow={handleStudyAll}
            onViewFolder={() => handleViewFolder()}
          />
        )}
      </div>

      {/* RIGHT COLUMN: Independent scroll, Spaced Repetition Banner, Missed Words, Folder Catalog */}
      <div className="flex-1 w-full h-full max-h-full min-h-0 overflow-y-auto space-y-5 pr-2 min-w-0 scrollbar-thin overscroll-contain pb-10">
        <SpacedRepetitionCard />

        <FrequentlyMissedWordsCard
          missedCards={frequentlyMissedCards}
          onReviewMissed={handleStudyMissed}
          onFlashcardsMissed={handleStudyMissed}
        />

        <FolderCatalogSection
          folders={allFolders}
          activeFolderId={activeFolder?.id || null}
          onViewFolder={(folderId) => handleViewFolder(folderId)}
          onCreateFolder={() => presentCreateFolder()}
        />
      </div>
    </div>
  );
}
