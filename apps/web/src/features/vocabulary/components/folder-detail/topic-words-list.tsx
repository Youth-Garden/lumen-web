'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { RouteEnum } from '@/shared/constants';
import { useSetBreadcrumb, type BreadcrumbConfigItem } from '@/shared/hooks';
import { MasteryFlowerBadge } from '@/features/vocabulary/components/mastery/mastery-flower-badge';
import { type VocabularyWord } from '@/services/vocabulary';
import { usePortal } from '@lumen/uikit/portal';
import { WordDetailSheet } from './word-detail-sheet';

export interface TopicWordsListProps {
  folderName?: string;
  topicName: string;
  topicViName?: string;
  flashcards: VocabularyWord[];
  onBackToTopics: () => void;
}

export function TopicWordsList({
  folderName,
  topicName,
  topicViName,
  flashcards,
  onBackToTopics,
}: TopicWordsListProps) {
  const t = useTranslations('Vocabulary.Folders');
  const [presentWordDetail] = usePortal<VocabularyWord>(WordDetailSheet);

  useSetBreadcrumb(
    useMemo(() => {
      const items: BreadcrumbConfigItem[] = [
        { label: t('title'), href: RouteEnum.VOCABULARY },
      ];
      if (folderName) {
        items.push({ label: folderName, onClick: onBackToTopics });
      }
      items.push({ label: topicViName || topicName });
      return items;
    }, [t, folderName, topicViName, topicName, onBackToTopics]),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            {topicViName || topicName}
          </h1>
          <span className="text-sm font-semibold text-muted-foreground">
            ({topicName})
          </span>
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary">
            {t('wordsCount', { count: flashcards.length })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {flashcards.map((flashcard) => {
          const primaryDef = flashcard.definitions?.[0];
          const meaningVi =
            primaryDef?.translationVi || primaryDef?.definition?.vi || '';
          const partOfSpeech = primaryDef?.partOfSpeech || '';

          return (
            <div
              key={flashcard.id}
              role="button"
              tabIndex={0}
              onClick={() => presentWordDetail(flashcard)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  presentWordDetail(flashcard);
                }
              }}
              className="group flex flex-col items-center justify-center text-center p-3 sm:p-4 rounded-2xl hover:bg-muted/40 active:bg-muted/60 hover:scale-[1.02] transition-all cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/40 gap-2.5"
            >
              <MasteryFlowerBadge
                level={flashcard.level ?? 0}
                learningStep={flashcard.learningStep ?? 0}
                isWilted={flashcard.isWilted ?? false}
                size={50}
              />

              <div className="w-full min-w-0 px-1">
                <p className="text-sm sm:text-base font-bold text-primary truncate group-hover:underline">
                  {flashcard.term}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {partOfSpeech && (
                    <span className="italic mr-1 font-medium">
                      {partOfSpeech}
                    </span>
                  )}
                  {meaningVi}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
