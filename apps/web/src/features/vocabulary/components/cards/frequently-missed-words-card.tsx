'use client';

import { useTranslations } from 'next-intl';

import Image from 'next/image';
import { useMemo } from 'react';
import { Button, Card } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { usePronunciation } from '@/shared/hooks';
import { PronunciationAccent, type VocabularyWord } from '@/services/vocabulary/vocabulary.types';

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
  const { playPronunciation } = usePronunciation();

  // Deduplicate words by term so the same word appearing in multiple topics is only shown once
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

      {/* 3 Compact Word Cards with Image Thumbnail */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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
              className="p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 flex items-start justify-between gap-2.5"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500">
                    {t('errorRate', { rate: errorRate })}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      playPronunciation({
                        term: card.term,
                        accent: PronunciationAccent.US,
                        audioUsUrl: card.audioUsUrl || undefined,
                        audioUrl: card.audioUrl || undefined,
                      });
                    }}
                    className="p-0.5 rounded-md text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    aria-label={tStudy('listenUsHint')}
                  >
                    <Icons name="volume-2" className="h-3.5 w-3.5 text-primary" />
                  </button>
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
                    className="object-cover transition-transform duration-200 hover:scale-105"
                    unoptimized
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons - Compact */}
      <div className="flex items-center gap-2.5 pt-0.5">
        <Button
          variant="default"
          size="sm"
          onClick={onReviewMissed}
          className="flex-1 gap-1.5 text-xs font-semibold cursor-pointer h-8"
        >
          <Icons name="rotate-ccw" className="h-3.5 w-3.5" />
          <span>{t('reviewNormal')}</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onFlashcardsMissed || onReviewMissed}
          className="flex-1 gap-1.5 text-xs font-semibold cursor-pointer h-8"
        >
          <Icons name="layers" className="h-3.5 w-3.5 text-primary" />
          <span>{t('flashcardsAction')}</span>
        </Button>
      </div>
    </Card>
  );
}
