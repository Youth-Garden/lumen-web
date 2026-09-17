'use client';

import { useToggle } from '@lumen/hooks';
import { useVocabularyWordDetail } from '@/features/vocabulary/hooks';
import { DueFlashcard, FlashcardRating } from '@/services/study';
import { AudioButton } from '@/shared/components/audio-button';
import { useKeydownEventListener } from '@/shared/hooks/use-keydown-event-listener';
import { playAudio } from '@/shared/utils/audio';
import { Button, Card, CardContent, Skeleton } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { usePortal } from '@lumen/uikit/portal';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect } from 'react';
import { FlashcardGradeButtons } from '@/features/study/components/flashcard-grade-buttons';
import { KeyboardShortcutsDialog } from '@/features/study/components/keyboard-shortcuts-dialog';

export enum FlashcardShortcutKey {
  GradeAgain = '1',
  GradeHard = '2',
  GradeGood = '3',
  GradeEasy = '4',
  ReplayAudio = 'r',
  FlipSpace = 'Space',
  FlipEnter = 'Enter',
}

interface FlashcardReviewProps {
  flashcard: DueFlashcard;
  onGrade: (grade: FlashcardRating) => void;
  isSubmitting?: boolean;
}

export function FlashcardReview({
  flashcard,
  onGrade,
  isSubmitting = false,
}: FlashcardReviewProps) {
  const t = useTranslations('Vocabulary.Study');
  const [isFlipped, , setIsFlipped] = useToggle(false);
  const [presentShortcuts] = usePortal(KeyboardShortcutsDialog);

  const { data: wordDetailResponse, isLoading } = useVocabularyWordDetail(
    flashcard.wordId,
    {
      enabled: isFlipped,
    },
  );

  const word = wordDetailResponse?.data;

  const handleFlip = useCallback(() => {
    if (!isFlipped) setIsFlipped(true);
  }, [isFlipped]);

  useEffect(() => {
    if (isFlipped && word?.audioUrl) {
      playAudio(word.audioUrl);
    }
  }, [isFlipped, word?.audioUrl]);

  const handleGrade = useCallback(
    (grade: FlashcardRating) => {
      onGrade(grade);
      setTimeout(() => setIsFlipped(false), 200);
    },
    [onGrade],
  );

  useKeydownEventListener(
    (event) => {
      if (!isFlipped) {
        if (
          event.code === FlashcardShortcutKey.FlipSpace ||
          event.key === FlashcardShortcutKey.FlipEnter
        ) {
          event.preventDefault();
          handleFlip();
        }
        return;
      }

      if (
        event.key.toLowerCase() === FlashcardShortcutKey.ReplayAudio &&
        word?.audioUrl
      ) {
        event.preventDefault();
        playAudio(word.audioUrl);
      } else if (!isSubmitting) {
        switch (event.key) {
          case FlashcardShortcutKey.GradeAgain:
            event.preventDefault();
            handleGrade(FlashcardRating.WRONG);
            break;
          case FlashcardShortcutKey.GradeHard:
            event.preventDefault();
            handleGrade(FlashcardRating.CORRECT);
            break;
          case FlashcardShortcutKey.GradeGood:
            event.preventDefault();
            handleGrade(FlashcardRating.FAST_TRACK_TEMP);
            break;
          case FlashcardShortcutKey.GradeEasy:
            event.preventDefault();
            handleGrade(FlashcardRating.FAST_TRACK_KNOWN);
            break;
        }
      }
    },
    [isFlipped, word, isSubmitting, handleFlip, handleGrade],
  );

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-12 relative">
      <div className="absolute top-0 right-0 z-10 -mt-12">
        <Button
          variant="outline"
          size="icon-sm"
          title={t('shortcutsTitle')}
          onClick={() => {
            presentShortcuts({
              shortcuts: [
                { keys: ['Space', 'Enter'], description: t('shortcutFlip') },
                { keys: ['R'], description: t('shortcutAudio') },
                { keys: ['1'], description: t('shortcutAgain') },
                { keys: ['2'], description: t('shortcutHard') },
                { keys: ['3'], description: t('shortcutGood') },
                { keys: ['4'], description: t('shortcutEasy') },
              ],
            });
          }}
        >
          <Icons name="info" className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>
      <div
        className="w-full cursor-pointer perspective-[2000px]"
        onClick={handleFlip}
      >
        <motion.div
          className="relative w-full min-h-[500px]"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{
            duration: 0.6,
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Face */}
          <Card
            className="absolute inset-0 w-full min-h-[500px] border-2 border-border hover:border-primary/50 hover:shadow-lg"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <CardContent className="flex flex-col items-center justify-center min-h-[500px] h-full p-12 text-center relative">
              <h2 className="text-[clamp(3rem,8vw,6rem)] font-black tracking-tighter leading-none mb-6 text-foreground">
                {flashcard.term}
              </h2>
              <p className="text-muted-foreground/60 mt-12 text-lg font-medium tracking-wide uppercase">
                {t('tapToFlip')}{' '}
                <span className="text-sm lowercase ml-2 opacity-70">
                  (or press Space)
                </span>
              </p>
            </CardContent>
          </Card>

          {/* Back Face */}
          <Card
            className="absolute inset-0 w-full min-h-[500px] border-2 border-primary shadow-xl"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <CardContent className="flex flex-col items-center min-h-[500px] h-full p-12 text-center relative">
              <div className="flex flex-col items-center w-full">
                {isLoading ? (
                  <div className="space-y-4 w-full flex flex-col items-center">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-16 w-3/4" />
                  </div>
                ) : word ? (
                  <>
                    <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4 opacity-50">
                      {flashcard.term}
                    </h2>
                    <div className="flex items-center gap-2 mb-6">
                      {word.phonetic && (
                        <span className="text-xl text-muted-foreground">
                          {word.phonetic}
                        </span>
                      )}
                      {word.audioUrl && (
                        <AudioButton
                          url={word.audioUrl}
                          className="text-primary"
                          iconClassName="h-5 w-5"
                        />
                      )}
                    </div>

                    <div className="space-y-10 w-full text-left mt-8 max-w-2xl mx-auto">
                      {word.definitions.slice(0, 2).map((def, idx) => (
                        <div key={def.id || idx} className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-baseline gap-3">
                            <span className="text-sm font-bold uppercase tracking-widest text-primary px-3 py-1 bg-primary/5 rounded-none border-l-4 border-primary">
                              {def.partOfSpeech}
                            </span>
                            <span className="text-2xl font-semibold text-foreground">
                              {def.translationVi}
                            </span>
                          </div>
                          <p className="text-lg text-muted-foreground leading-relaxed">
                            {def.definitionEn}
                          </p>
                          {def.examples && def.examples.length > 0 && (
                            <div className="pl-6 border-l-2 border-primary/20 pt-2 pb-2">
                              <p className="mt-2 text-sm italic text-slate-500 dark:text-slate-400">
                                &quot;{def.examples[0].sentenceEn}&quot;
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-destructive">{t('failedLoadWord')}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <FlashcardGradeButtons
        isFlipped={isFlipped}
        isSubmitting={isSubmitting}
        onGrade={handleGrade}
      />
    </div>
  );
}
