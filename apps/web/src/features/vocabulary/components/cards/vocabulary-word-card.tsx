'use client';

import { MasteryFlowerBadge } from '@/features/vocabulary/components/mastery/mastery-flower-badge';
import type { VocabularyWord } from '@/services/vocabulary';

export interface VocabularyWordCardProps {
  word: VocabularyWord;
  onClick: (word: VocabularyWord) => void;
}

export function VocabularyWordCard({
  word,
  onClick,
}: VocabularyWordCardProps) {
  const primaryDef = word.definitions?.[0];
  const meaningVi =
    primaryDef?.translationVi || primaryDef?.definition?.vi || '';
  const partOfSpeech = primaryDef?.partOfSpeech || '';

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
      className="group flex flex-col items-center justify-center text-center p-3 sm:p-4 rounded-2xl hover:bg-muted/40 active:bg-muted/60 hover:scale-[1.02] transition-all cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/40 gap-2.5"
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
          {meaningVi}
        </p>
      </div>
    </div>
  );
}
