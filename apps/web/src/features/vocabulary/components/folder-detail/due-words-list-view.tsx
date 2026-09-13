'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { MasteryFlowerBadge } from '@/features/vocabulary/components/mastery/mastery-flower-badge';
import { type VocabularyWord } from '@/services/vocabulary';
import { Button, Card } from '@lumen/uikit/components';
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

  const displayedCards = useMemo(() => {
    return activeTab === 'due' ? dueCards : learnedCards;
  }, [activeTab, dueCards, learnedCards]);

  return (
    <div className="w-full space-y-6 pb-20 animate-in fade-in-50 duration-200">
      {/* Top Navigation & Header */}
      <div className="flex flex-col gap-4 border-b border-border/60 pb-5">
        <Button
          type="button"
          onClick={onBackToOverview}
          variant="ghost"
          size="sm"
          className="w-fit -ml-2.5 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <Icons name="arrow-left" className="h-4 w-4" />
          <span>{t('backToOverview')}</span>
        </Button>

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayedCards.map((flashcard) => {
            const primaryDef = flashcard.definitions?.[0];
            const meaningVi =
              primaryDef?.translationVi || primaryDef?.definition?.vi || '';
            const partOfSpeech = primaryDef?.partOfSpeech || '';

            return (
              <Card
                key={flashcard.id}
                role="button"
                tabIndex={0}
                onClick={() => presentWordDetail(flashcard)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    presentWordDetail(flashcard);
                  }
                }}
                className="flex items-center gap-3 p-3.5 rounded-2xl text-left bg-card hover:bg-muted/40 transition-all cursor-pointer group border border-border/40 hover:border-border/70 shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <div className="shrink-0">
                  <MasteryFlowerBadge
                    level={flashcard.level ?? 0}
                    learningStep={flashcard.learningStep ?? 0}
                    isWilted={flashcard.isWilted ?? false}
                    size={36}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-primary truncate group-hover:underline">
                    {flashcard.term}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {partOfSpeech && (
                      <span className="italic mr-1">{partOfSpeech}</span>
                    )}
                    {meaningVi}
                  </p>
                </div>

                <Icons
                  name="chevron-right"
                  className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground shrink-0 transition-colors"
                />
              </Card>
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
