'use client';

import { MasteryFlowerBadge } from '@/features/vocabulary/components/mastery/mastery-flower-badge';
import { useLocale } from '@/shared/hooks';
import { i18nText, normalizePartOfSpeech } from '@/shared/utils';
import type { VocabularyWord } from '@/services/vocabulary';

export interface VocabularyWordCardProps {
  word: VocabularyWord;
  onClick: (word: VocabularyWord) => void;
}

export function VocabularyWordCard({ word, onClick }: VocabularyWordCardProps) {
  const locale = useLocale();
  const primaryDef = word.definitions?.[0];
  const meaningText = i18nText(primaryDef?.definition, locale) || word.term;
  const partOfSpeech = normalizePartOfSpeech(primaryDef?.partOfSpeech);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(word)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick(word);
        }
      }}
      className="flex flex-col items-center justify-center text-center p-3 sm:p-4 rounded-2xl hover:bg-muted/40 active:bg-muted/60 transition-colors cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/40 gap-2.5"
    >
      <MasteryFlowerBadge
        level={word.level ?? 0}
        learningStep={word.learningStep ?? 0}
        isWilted={word.isWilted ?? false}
        size={50}
      />

      <div className="w-full min-w-0 px-1">
        <p className="text-sm sm:text-base font-bold text-primary truncate">
          {word.term}
        </p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {partOfSpeech && (
            <span className="italic mr-1 font-medium">{partOfSpeech}</span>
          )}
          {meaningText}
        </p>
      </div>
    </div>
  );
}
