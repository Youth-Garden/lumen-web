'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { VocabularyWordCard } from '@/features/vocabulary/components/cards/vocabulary-word-card';
import { type VocabularyWord } from '@/services/vocabulary';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { usePortal } from '@lumen/uikit/portal';
import { WordDetailSheet } from './word-detail-sheet';

export interface DueWordsListViewProps {
  folderId?: string;
  folderName?: string;
  dueCards: VocabularyWord[];
  learnedCards: VocabularyWord[];
  onBackToOverview: () => void;
  onPractice?: (cards: VocabularyWord[]) => void;
  onFlashcards?: (cards: VocabularyWord[]) => void;
}

type TabType = 'due' | 'learned';

export function DueWordsListView({
  dueCards,
  learnedCards,
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
      <div className="flex flex-col gap-3 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                {t('viewDueWordsTitle')}
              </h1>
            </div>
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
          {displayedCards.map((flashcard) => (
            <VocabularyWordCard
              key={flashcard.id}
              word={flashcard}
              onClick={presentWordDetail}
            />
          ))}
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
        </div>
      )}
    </div>
  );
}
