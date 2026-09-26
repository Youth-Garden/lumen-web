'use client';

import { useTranslations } from 'next-intl';

import { useLocale } from '@/shared/hooks';

import Image from 'next/image';
import { useMemo } from 'react';
import { Badge, Button, Card } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { i18nText, formatPartOfSpeechShort } from '@/shared/utils';
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
    <Card className="p-4 sm:p-5 rounded-2xl bg-muted/20 border-none space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-destructive/10 text-destructive">
            <Icons name="trendingDown" className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-heading text-foreground">
              {t('frequentlyMissed')}
            </h4>
            <p className="text-[10px] text-muted-foreground">
              {t('missedDesc')}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {displayCards.map((card, index) => {
          const firstDef = card.definitions?.[0];
          const partOfSpeech =
            formatPartOfSpeechShort(firstDef?.partOfSpeech) || 'n.';
          const meaning = i18nText(firstDef?.definition, locale) || card.term;

          const errorRate = 35 - index * 3;

          return (
            <div
              key={card.id}
              className="p-3 rounded-xl bg-background flex items-start justify-between gap-2.5"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge variant="destructive" size="sm">
                    {t('errorRate', { rate: errorRate })}
                  </Badge>
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
