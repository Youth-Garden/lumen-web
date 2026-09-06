'use client';

import { useTranslations } from 'next-intl';
import { Button, Card } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { usePronunciation } from '@/shared/hooks';
import { PronunciationAccent, type VocabularyWord } from '@/services/vocabulary/vocabulary.types';

interface FrequentlyMissedWordsCardProps {
  missedCards: VocabularyWord[];
  onReviewMissed: () => void;
}

export function FrequentlyMissedWordsCard({
  missedCards,
  onReviewMissed,
}: FrequentlyMissedWordsCardProps) {
  const t = useTranslations('Vocabulary.Folders');
  const { playPronunciation, isPlaying } = usePronunciation();

  if (!missedCards || missedCards.length === 0) {
    return null;
  }

  // Display top 4 words in a clean 2x2 grid
  const displayCards = missedCards.slice(0, 4);

  return (
    <Card className="rounded-3xl border border-border/70 bg-card p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold tracking-tight text-foreground">
              {t('frequentlyMissedTitle')}
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              {displayCards.length} {t('cards')}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('frequentlyMissedSubtitle')}
          </p>
        </div>

        <Button
          onClick={onReviewMissed}
          variant="outline"
          size="sm"
          className="gap-1.5 rounded-2xl font-semibold border-border/80 hover:border-primary/50 text-xs shrink-0"
        >
          <Icons name="rotate-ccw" className="h-3.5 w-3.5" />
          <span>{t('reviewMissed')}</span>
        </Button>
      </div>

      {/* Grid of 4 Word Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {displayCards.map((card) => {
          const firstDef = card.definitions?.[0];
          const partOfSpeech = firstDef?.partOfSpeech || 'noun';
          const meaning =
            firstDef?.translationVi ||
            firstDef?.definitionEn ||
            (firstDef?.definition as Record<string, string>)?.en ||
            '';

          return (
            <div
              key={card.id}
              className="flex flex-col justify-between p-4 rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-all duration-200 space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h5 className="text-base font-black text-foreground group-hover:text-primary transition-colors truncate">
                    {card.term}
                  </h5>

                  {/* Audio Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        playPronunciation({
                          term: card.term,
                          accent: PronunciationAccent.US,
                          audioUsUrl: card.audioUsUrl || undefined,
                          audioUrl: card.audioUrl || undefined,
                        });
                      }}
                      disabled={isPlaying}
                      className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-background/80 hover:bg-primary/10 hover:text-primary border border-border/60 transition-colors"
                    >
                      US
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        playPronunciation({
                          term: card.term,
                          accent: PronunciationAccent.UK,
                          audioUkUrl: card.audioUkUrl || undefined,
                        });
                      }}
                      disabled={isPlaying}
                      className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-background/80 hover:bg-primary/10 hover:text-primary border border-border/60 transition-colors"
                    >
                      UK
                    </button>
                  </div>
                </div>

                {card.phonetic && (
                  <p className="text-[11px] text-muted-foreground font-mono">
                    {card.phonetic}
                  </p>
                )}

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  <span className="font-semibold italic text-primary/90 mr-1">
                    ({partOfSpeech})
                  </span>
                  {meaning}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
