'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';

import {
  StudyView,
  type StudyViewData,
} from '@/features/study/components/study-view';
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
  useVocabularyFolders,
  useVocabularyOverview,
} from '@/features/vocabulary/hooks';
import { calculateGlobalTotalWords } from '@/features/vocabulary/utils';
import { vocabularyService, type VocabularyWord } from '@/services/vocabulary';
import { RouteEnum } from '@/shared/constants';
import { useLocale } from '@/shared/hooks';
import { i18nText } from '@/shared/utils';
import { useLocalStorage } from '@lumen/hooks';
import { formatUrl } from '@lumen/shared-api';
import { Skeleton } from '@lumen/uikit/components';
import { usePortal, usePortalWithoutBackdrop } from '@lumen/uikit/portal';

export function FolderListPage() {
  const tStudy = useTranslations('Vocabulary.Study');
  const locale = useLocale();
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

  const { data: overviewRes } = useVocabularyOverview();
  const overviewData = overviewRes?.data;

  const activeFolderDueCount = activeFolder?.dueCount ?? 0;
  const activeFolderLearnedCount = activeFolder?.learnedCount ?? 0;

  const globalTotalWords = useMemo(
    () => calculateGlobalTotalWords(allFolders),
    [allFolders],
  );

  const globalDueCount = overviewData?.dueCount ?? 0;

  const globalLearnedCount = overviewData?.totalLearnedWords ?? 0;

  const stages = overviewData?.memoryLevels ?? [];

  const frequentlyMissedCards: VocabularyWord[] =
    overviewData?.frequentlyMissedWords ?? [];

  const startActiveFolderStudy = async (mode: StudySessionMode) => {
    if (!activeFolder?.id) return;
    try {
      const res = await vocabularyService.getFolderWords(
        activeFolder.id,
        undefined,
        1,
        50,
      );
      const cards = res.data?.data || [];
      if (!cards.length) {
        toast.info(tStudy('noWordsInFolder'));
        return;
      }
      presentStudyView({
        cards,
        folderName: i18nText(activeFolder.name, locale),
        mode,
      });
    } catch {
      toast.error(tStudy('failedToLoadCards'));
    }
  };

  const handleGlobalPractice = () => {
    if (globalDueCount > 0) {
      router.push(RouteEnum.VOCABULARY_DUE);
    } else {
      startActiveFolderStudy(StudySessionMode.PRACTICE);
    }
  };

  const handleGlobalLearnNew = () => {
    startActiveFolderStudy(StudySessionMode.LEARN_NEW);
  };

  const handleGlobalFlashcards = () => {
    startActiveFolderStudy(StudySessionMode.FLASHCARD);
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
            onStudyNow={() =>
              startActiveFolderStudy(StudySessionMode.LEARN_NEW)
            }
            onPractice={() => startActiveFolderStudy(StudySessionMode.PRACTICE)}
            onFlashcards={() =>
              startActiveFolderStudy(StudySessionMode.FLASHCARD)
            }
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
