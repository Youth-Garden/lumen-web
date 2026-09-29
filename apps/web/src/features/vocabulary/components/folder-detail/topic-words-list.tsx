'use client';

import { VocabularyWordCard } from '@/features/vocabulary/components/cards/vocabulary-word-card';
import { type VocabularyWord } from '@/services/vocabulary';
import { usePortal } from '@lumen/uikit/portal';
import { WordDetailSheet } from './word-detail-sheet';

export interface TopicWordsListProps {
  words: VocabularyWord[];
}

export function TopicWordsList({ words }: TopicWordsListProps) {
  const [presentWordDetail] = usePortal<VocabularyWord>(WordDetailSheet);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {words.map((word) => (
          <VocabularyWordCard
            key={word.id}
            word={word}
            onClick={presentWordDetail}
          />
        ))}
      </div>
    </div>
  );
}
