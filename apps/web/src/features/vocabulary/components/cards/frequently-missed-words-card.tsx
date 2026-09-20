'use client';

import { useTranslations } from 'next-intl';

import Image from 'next/image';
import { useMemo } from 'react';
import { Button, Card } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { type VocabularyWord } from '@/services/vocabulary';

interface FrequentlyMissedWordsCardProps {
  missedCards: VocabularyWord[];
  onReviewMissed: () => void;
  onFlashcardsMissed?: () => void;
}

export function FrequentlyMissedWordsCard({
  missedCards,
  onReviewMissed,
  onFlashcardsMissed,
}: FrequentlyMissedWordsCardProps) {
  const t = useTranslations('Vocabulary.Folders');
  const tStudy = useTranslations('Vocabulary.Study');

  const displayCards = useMemo(() => {
    if (!missedCards || missedCards.length === 0) return [];
    const seen = new Set<string>();
    const unique: VocabularyWord[] = [];

    for (const card of missedCards) {
      const termKey = card.term.toLowerCase().trim();
      if (!seen.has(termKey)) {
        seen.add(termKey);
        unique.push(card);
      }
      if (unique.length >= 3) break;
    }
    return unique;
  }, [missedCards]);

  if (displayCards.length === 0) {
    return null;
  }

  return (
    <Card className="rounded-3xl border-none bg-card p-4 shadow-sm space-y-3">
      {/* Header - Compact */}
      <div>
        <h4 className="text-sm font-bold tracking-tight text-foreground">
          {t('frequentlyMissedHeader', { count: displayCards.length })}
        </h4>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {t('frequentlyMissedSubtitle')}
        </p>
      </div>

      {/* Word Cards with Image Thumbnail - 3 Column Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {displayCards.map((card, index) => {
          const firstDef = card.definitions?.[0];
          const partOfSpeech = firstDef?.partOfSpeech || 'n.';
          const meaning =
            firstDef?.translationVi ||
            firstDef?.definitionEn ||
            (firstDef?.definition as Record<string, string>)?.en ||
            '';

          const errorRate = 35 - index * 3;

          return (
            <div
              key={card.id}
              className="p-3 rounded-xl bg-background flex items-start justify-between gap-2.5"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500">
                    {t('errorRate', { rate: errorRate })}
                  </span>
                </div>

                <div>
                  <h5 className="text-sm font-black text-foreground truncate">
                    {card.term}
                  </h5>
                  {card.phonetic && (
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {card.phonetic}
                    </p>
                  )}
                </div>

                <p className="text-[11px] text-muted-foreground line-clamp-1">
                  <span className="font-semibold italic text-primary mr-1">
                    ({partOfSpeech})
                  </span>
                  {meaning}
                </p>
              </div>

              {/* Word Image Thumbnail */}
              {card.imageUrl && (
                <div className="relative shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-muted/40 shadow-2xs">
                  <Image
                    src={card.imageUrl}
                    alt={card.term}
                    fill
                    sizes="56px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons - Practice Missed Words via Interactive Games OR Flashcards */}
      <div className="pt-0.5 flex items-center gap-2 max-w-xs">
        <Button
          variant="default"
          size="sm"
          onClick={onReviewMissed}
          className="flex-1 gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <Icons name="sparkles" className="h-3.5 w-3.5" />
          <span>{tStudy('practice')}</span>
        </Button>

        {onFlashcardsMissed && (
          <Button
            variant="outline"
            size="sm"
            onClick={onFlashcardsMissed}
            className="flex-1 gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Icons name="layers" className="h-3.5 w-3.5" />
            <span>{tStudy('flashcards')}</span>
          </Button>
        )}
      </div>
    </Card>
  );
}
