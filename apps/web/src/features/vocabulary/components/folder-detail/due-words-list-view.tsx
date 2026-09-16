'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import Link from 'next/link';
import { RouteEnum } from '@/shared/constants';
import { useSetBreadcrumb } from '@/shared/hooks';
import { MasteryFlowerBadge } from '@/features/vocabulary/components/mastery/mastery-flower-badge';
import { type VocabularyWord } from '@/services/vocabulary';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { usePortal } from '@lumen/uikit/portal';
import { WordDetailSheet } from './word-detail-sheet';

export interface DueWordsListViewProps {
  folderName: string;
  dueCards: VocabularyWord[];
  learnedCards: VocabularyWord[];
  onBackToOverview: () => void;
  onPractice?: (cards: VocabularyWord[]) => void;
  onFlashcards?: (cards: VocabularyWord[]) => void;
}

type TabType = 'due' | 'learned';

export function DueWordsListView({
  folderName,
  dueCards,
  learnedCards,
  onBackToOverview,
  onPractice,
  onFlashcards,
}: DueWordsListViewProps) {
  const t = useTranslations('Vocabulary.Folders');
  const [activeTab, setActiveTab] = useState<TabType>('due');
  const [presentWordDetail] = usePortal<VocabularyWord>(WordDetailSheet);

  useSetBreadcrumb(
    useMemo(
      () => [
        { label: t('title'), href: RouteEnum.VOCABULARY },
        { label: folderName, onClick: onBackToOverview },
        { label: t('viewDueWordsTitle') },
      ],
      [t, folderName, onBackToOverview],
    ),
  );

  const displayedCards = useMemo(() => {
    return activeTab === 'due' ? dueCards : learnedCards;
  }, [activeTab, dueCards, learnedCards]);

  return (
    <div className="w-full space-y-6 pb-20 animate-in fade-in-50 duration-200">
      {/* Top Navigation & Header */}
      <div className="flex flex-col gap-3 border-b border-border/60 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                {t('viewDueWordsTitle')}
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                {t('wordsCount', { count: displayedCards.length })}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {folderName}
            </p>
          </div>

          {/* Tab Filter using UIKit Button variants */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <Button
              variant={activeTab === 'due' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('due')}
            >
              <span>
                {t('tabDueOnly')} ({dueCards.length})
              </span>
            </Button>
            <Button
              variant={activeTab === 'learned' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('learned')}
            >
              <span>
                {t('tabLearnedAll')} ({learnedCards.length})
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Word Grid */}
      {displayedCards.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {displayedCards.map((flashcard) => {
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
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Icons name="sparkles" className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            {activeTab === 'due'
              ? t('noDueWordsTitle')
              : t('noLearnedWordsTitle')}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {activeTab === 'due'
              ? t('noDueWordsDesc')
              : t('noLearnedWordsDesc')}
          </p>
          {activeTab === 'due' && learnedCards.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setActiveTab('learned')}
              className="mt-2"
            >
              <span>{t('tabLearnedAll')}</span>
            </Button>
          )}
        </div>
      )}

      {/* Floating Action Buttons */}
      {displayedCards.length > 0 && (
        <div className="fixed bottom-6 right-8 flex items-center gap-3 z-30">
          {onFlashcards && (
            <Button
              variant="secondary"
              size="default"
              onClick={() => onFlashcards(displayedCards)}
              className="gap-2 shadow-md cursor-pointer"
            >
              <Icons name="layers" className="h-4 w-4" />
              <span>{t('flashcardsAction')}</span>
            </Button>
          )}
          {onPractice && (
            <Button
              variant="default"
              size="default"
              onClick={() => onPractice(displayedCards)}
              className="gap-2 shadow-md cursor-pointer"
            >
              <Icons name="sparkles" className="h-4 w-4" />
              <span>{t('reviewNormal')}</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
