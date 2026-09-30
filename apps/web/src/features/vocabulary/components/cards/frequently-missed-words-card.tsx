'use client';

import { useTranslations } from 'next-intl';

import { useLocale } from '@/shared/hooks';

import { type VocabularyWord } from '@/services/vocabulary';
import { formatPartOfSpeechShort, i18nText } from '@/shared/utils';
import { Badge, Button, Card } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import Image from 'next/image';
import { useMemo } from 'react';

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
  const locale = useLocale();
  const t = useTranslations('Vocabulary.Folders');
  const tStudy = useTranslations('Vocabulary.Study');

  const displayCards = useMemo(() => {
    return missedCards.slice(0, 3);
  }, [missedCards]);

  if (!missedCards || missedCards.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 sm:p-5 space-y-4">
      {/* Header & Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Icons
            name="trendingDown"
            className="h-5 w-5 text-destructive shrink-0"
          />
          <div>
            <h4 className="text-sm font-bold font-heading text-foreground">
              {t('frequentlyMissedTitle')}
            </h4>
            <p className="text-xs text-muted-foreground">
              {t('frequentlyMissedSubtitle')}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="default"
            size="sm"
            onClick={onReviewMissed}
            className="gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Icons name="sparkles" className="h-3.5 w-3.5" />
            <span>{tStudy('practice')}</span>
          </Button>

          {onFlashcardsMissed && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onFlashcardsMissed}
              className="gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Icons name="layers" className="h-3.5 w-3.5" />
              <span>{tStudy('flashcards')}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Horizontal Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {displayCards.map((card) => {
          const firstDef = card.definitions?.[0];
          const partOfSpeech =
            formatPartOfSpeechShort(firstDef?.partOfSpeech) || 'n.';
          const meaning = i18nText(firstDef?.definition, locale) || card.term;

          const errorRate =
            card.errorRate ?? Math.round(100 - (card.masteryScore ?? 0));

          return (
            <div
              key={card.id}
              className="p-3.5 rounded-xl bg-muted/30 dark:bg-muted/20 flex items-start justify-between gap-2.5 h-full"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge variant="destructive" size="sm">
                    {t('errorRate', { rate: errorRate })}
                  </Badge>
                </div>

                <div>
                  <h5 className="text-sm font-bold text-foreground truncate">
                    {card.term}
                  </h5>
                  {card.phonetic && (
                    <p className="text-[11px] text-muted-foreground font-mono">
                      {card.phonetic}
                    </p>
                  )}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  <span className="font-semibold italic text-primary mr-1">
                    ({partOfSpeech})
                  </span>
                  {meaning}
                </p>
              </div>

              {/* Word Image Thumbnail */}
              {card.imageUrl && (
                <div className="relative shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-muted/40">
                  <Image
                    src={card.imageUrl}
                    alt={card.term}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
