'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { VocabularyWordCard } from '@/features/vocabulary/components/cards/vocabulary-word-card';
import { type VocabularyWord } from '@/services/vocabulary';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@lumen/uikit/components';
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

function WordGrid({
  cards,
  isWiltedOverride,
  emptyTitle,
  emptyDesc,
  presentWordDetail,
}: {
  cards: VocabularyWord[];
  isWiltedOverride?: boolean;
  emptyTitle: string;
  emptyDesc: string;
  presentWordDetail: (word: VocabularyWord) => void;
}) {
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto space-y-3">
        <Icons name="sparkles" className="h-10 w-10 text-muted-foreground/40" />
        <h3 className="text-base font-bold text-foreground">{emptyTitle}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {emptyDesc}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((flashcard) => (
        <VocabularyWordCard
          key={flashcard.id}
          word={{
            ...flashcard,
            isWilted: isWiltedOverride ?? flashcard.isWilted,
          }}
          onClick={presentWordDetail}
        />
      ))}
    </div>
  );
}

export function DueWordsListView({
  dueCards,
  learnedCards,
  onPractice,
  onFlashcards,
}: DueWordsListViewProps) {
  const t = useTranslations('Vocabulary.Folders');
  const tStudy = useTranslations('Vocabulary.Study');
  const [activeTab, setActiveTab] = useState<TabType>('due');
  const [presentWordDetail] = usePortal<VocabularyWord>(WordDetailSheet);

  const displayedCards = activeTab === 'due' ? dueCards : learnedCards;

  return (
    <div className="w-full space-y-6 pb-20 animate-in fade-in-50 duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          {t('viewDueWordsTitle')}
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)}>
        <TabsList variant="line">
          <TabsTrigger value="due">
            {t('tabDueOnly')}
            <span className="ml-1.5 text-xs text-muted-foreground">
              ({dueCards.length})
            </span>
          </TabsTrigger>
          <TabsTrigger value="learned">
            {t('tabLearnedAll')}
            <span className="ml-1.5 text-xs text-muted-foreground">
              ({learnedCards.length})
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="due">
          <WordGrid
            cards={dueCards}
            isWiltedOverride={true}
            emptyTitle={t('noDueWordsTitle')}
            emptyDesc={t('noDueWordsDesc')}
            presentWordDetail={presentWordDetail}
          />
        </TabsContent>

        <TabsContent value="learned">
          <WordGrid
            cards={learnedCards}
            emptyTitle={t('noLearnedWordsTitle')}
            emptyDesc={t('noLearnedWordsDesc')}
            presentWordDetail={presentWordDetail}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
