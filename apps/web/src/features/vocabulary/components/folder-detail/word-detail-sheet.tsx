'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import {
  Button,
  ScrollArea,
  Sheet,
  SheetClose,
  SheetContent,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import type { PortalProps } from '@lumen/uikit/portal';

import { useReviewFlashcard } from '@/features/study/hooks';
import { MasteryFlowerBadge } from '@/features/vocabulary/components/mastery/mastery-flower-badge';
import { FlashcardRating } from '@/services/study';
import {
  PronunciationAccent,
  type VocabularyWord,
} from '@/services/vocabulary';
import { usePronunciation } from '@/shared/hooks';

function renderHighlightedSentence(sentence: string, term: string) {
  if (!sentence || !term) return sentence;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = sentence.split(regex);
  if (parts.length === 1) return sentence;

  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="font-bold text-primary">
        {part}
      </span>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

export function WordDetailSheet({
  isOpen,
  onDismiss,
  data: word,
}: PortalProps<VocabularyWord>) {
  const t = useTranslations('Vocabulary.Folders');
  const { playPronunciation } = usePronunciation();
  const { mutate: reviewFlashcard, isPending } = useReviewFlashcard();

  const flashcardId = word?.flashcardId ?? word?.id ?? '';
  const hasPassedFirstLevel = (word?.level ?? 0) >= 1;

  const handleMarkKnown = () => {
    reviewFlashcard(
      {
        flashcardId,
        quality: FlashcardRating.FAST_TRACK_KNOWN,
        isFastTrackKnown: true,
      },
      { onSuccess: () => onDismiss?.() },
    );
  };

  const handleMarkUnknown = () => {
    reviewFlashcard(
      { flashcardId, quality: FlashcardRating.WRONG, isCorrect: false },
      { onSuccess: () => onDismiss?.() },
    );
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onDismiss?.();
      }}
    >
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="w-full max-w-lg mx-auto rounded-t-3xl max-h-[88dvh] sm:max-h-[85vh] gap-0 p-0 border-t border-border/60 shadow-2xl"
      >
        <ScrollArea className="overflow-y-auto max-h-[88dvh] sm:max-h-[85vh]">
          <div className="flex items-center gap-3.5 px-6 pt-6 pb-2">
            <MasteryFlowerBadge
              level={word?.level ?? 0}
              learningStep={word?.learningStep ?? 0}
              isWilted={word?.isWilted ?? false}
              size={48}
            />
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-heading">
              {word?.term ?? ''}
            </h2>
            {word?.cefrLevel && (
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-primary/10 text-primary uppercase shrink-0 select-none">
                {word.cefrLevel}
              </span>
            )}
            <div className="flex-1" />
            <SheetClose
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:text-foreground"
                />
              }
            >
              <Icons name="x" className="h-4 w-4" />
            </SheetClose>
          </div>

          {word && (
            <div className="flex items-center justify-between gap-4 px-6 pt-2 pb-4">
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() =>
                    playPronunciation({
                      term: word.term,
                      audioUrl: word.audioUrl ?? undefined,
                      audioUsUrl: word.audioUsUrl ?? undefined,
                      accent: PronunciationAccent.US,
                    })
                  }
                  className="justify-start gap-2 h-8 px-2 text-muted-foreground hover:text-foreground"
                >
                  <Icons
                    name="volume-2"
                    className="h-4 w-4 text-primary shrink-0"
                  />
                  <span className="font-bold text-xs text-foreground/80">
                    US
                  </span>
                  <span className="font-sans text-sm">
                    {word.phoneticUs || word.phonetic || ''}
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() =>
                    playPronunciation({
                      term: word.term,
                      audioUkUrl: word.audioUkUrl ?? undefined,
                      accent: PronunciationAccent.UK,
                    })
                  }
                  className="justify-start gap-2 h-8 px-2 text-muted-foreground hover:text-foreground"
                >
                  <Icons
                    name="volume-2"
                    className="h-4 w-4 text-sky-500 shrink-0"
                  />
                  <span className="font-bold text-xs text-foreground/80">
                    UK
                  </span>
                  <span className="font-sans text-sm">
                    {word.phoneticUk || word.phonetic || ''}
                  </span>
                </Button>
              </div>

              <div>
                {hasPassedFirstLevel ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleMarkUnknown}
                    disabled={isPending}
                  >
                    {t('markUnknown')}
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleMarkKnown}
                    disabled={isPending}
                  >
                    {t('markKnown')}
                  </Button>
                )}
              </div>
            </div>
          )}

          {word?.imageUrl && (
            <div className="flex justify-center px-6 my-3">
              <div className="relative w-44 h-44 rounded-2xl overflow-hidden shadow-xs border border-border/40">
                <Image
                  src={word.imageUrl}
                  alt={word.term}
                  fill
                  sizes="176px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          )}

          <div className="px-6 pb-8 space-y-6">
            {word?.definitions.map((def, defIdx) => (
              <div key={def.id} className="space-y-2">
                {def.partOfSpeech && (
                  <p className="text-xs font-semibold italic text-muted-foreground uppercase tracking-wide">
                    {def.partOfSpeech}
                  </p>
                )}

                {def.translationVi && (
                  <p className="text-base font-bold text-primary leading-snug">
                    {def.translationVi}
                  </p>
                )}

                {def.definitionEn && (
                  <div className="flex items-start gap-2 text-sm text-foreground/90 leading-relaxed">
                    <span className="shrink-0 font-semibold text-muted-foreground">
                      {defIdx + 1}.
                    </span>
                    <span>{def.definitionEn}</span>
                  </div>
                )}

                {def.examples.length > 0 && (
                  <div className="mt-3 space-y-2.5">
                    <p className="text-xs font-medium italic text-muted-foreground">
                      {t('examples')}:
                    </p>
                    {def.examples.map((example) => (
                      <div key={example.id} className="space-y-0.5">
                        <p className="text-sm font-medium text-foreground leading-normal">
                          {renderHighlightedSentence(
                            example.sentenceEn,
                            word.term,
                          )}
                        </p>
                        {example.translationVi && (
                          <p className="text-sm text-muted-foreground leading-normal">
                            {example.translationVi}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
