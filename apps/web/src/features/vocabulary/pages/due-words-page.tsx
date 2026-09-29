'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import {
  StudyView,
  type StudyViewData,
} from '@/features/study/components/study-view';
import { useDueWords } from '@/features/study/hooks';
import { dueWordToVocabularyWord } from '@/services/study';
import { StudySessionMode } from '@/features/study/types/study.types';
import { DueWordsListView } from '@/features/vocabulary/components/folder-detail/due-words-list-view';
import { type VocabularyWord } from '@/services/vocabulary';
import { RouteEnum } from '@/shared/constants';
import { useSetBreadcrumb, type BreadcrumbConfigItem } from '@/shared/hooks';
import { Skeleton } from '@lumen/uikit/components';
import { usePortalWithoutBackdrop } from '@lumen/uikit/portal';

export function DueWordsPage() {
  const tStudy = useTranslations('Vocabulary.Study');
  const tFolders = useTranslations('Vocabulary.Folders');
  const router = useRouter();

  const [presentStudyView] = usePortalWithoutBackdrop<StudyViewData>(StudyView);

  const { data: dueWordsResponse, isLoading } = useDueWords({
    limit: 100,
  });

  const dueCardsList: VocabularyWord[] = useMemo(() => {
    return (dueWordsResponse?.data || []).map(dueWordToVocabularyWord);
  }, [dueWordsResponse?.data]);

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

  if (isLoading) {
    return (
      <div className="w-full space-y-6 pb-20">
        <div className="flex flex-col gap-3 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Skeleton className="h-8 sm:h-9 w-56 sm:w-64 rounded-xl" />
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <Skeleton className="h-8 w-28 rounded-lg" />
              <Skeleton className="h-8 w-32 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 15 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center text-center p-3 sm:p-4 rounded-2xl gap-2.5"
            >
              <Skeleton className="w-[50px] h-[50px] rounded-full shrink-0" />
              <div className="w-full flex flex-col items-center gap-1.5 px-1">
                <Skeleton className="h-5 sm:h-6 w-20 sm:w-24 rounded-md" />
                <Skeleton className="h-4 w-28 sm:w-32 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-2">
      <DueWordsListView
        dueCards={dueCardsList}
        learnedCards={dueCardsList}
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
