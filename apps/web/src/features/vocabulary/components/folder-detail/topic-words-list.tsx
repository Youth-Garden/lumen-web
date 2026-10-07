'use client';

import { useEffect } from 'react';
import { useIntersectionObserver } from '@lumen/hooks';
import { VocabularyWordCard } from '@/features/vocabulary/components/cards/vocabulary-word-card';
import { type VocabularyWord } from '@/services/vocabulary';
import { Icons } from '@lumen/uikit/icons';
import { usePortal } from '@lumen/uikit/portal';
import { WordDetailSheet } from './word-detail-sheet';

export interface TopicWordsListProps {
  words: VocabularyWord[];
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onFetchNextPage?: () => void;
}

export function TopicWordsList({
  words,
  hasNextPage = false,
  isFetchingNextPage = false,
  onFetchNextPage,
}: TopicWordsListProps) {
  const [presentWordDetail] = usePortal<VocabularyWord>(WordDetailSheet);
  const [sentinelRef, entry] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && onFetchNextPage) {
      onFetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, onFetchNextPage]);

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {words
          .filter((word) => Boolean(word && word.id))
          .map((word) => (
            <VocabularyWordCard
              key={word.id}
              word={word}
              onClick={presentWordDetail}
            />
          ))}
      </div>

      <div ref={sentinelRef} className="h-1" />

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Icons
            name="loader-2"
            className="h-6 w-6 animate-spin text-muted-foreground"
          />
        </div>
      )}
    </div>
  );
}
