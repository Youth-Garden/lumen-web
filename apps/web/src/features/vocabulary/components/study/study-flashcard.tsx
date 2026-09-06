'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Icons } from '@lumen/uikit/icons';
import { Button } from '@lumen/uikit/components';
import { cn } from '@lumen/uikit/utils';
import { PronunciationAccent, type VocabularyWord } from '@/services/vocabulary/vocabulary.types';

interface StudyFlashcardProps {
  card: VocabularyWord;
  isFlipped: boolean;
  activePhonetic: string;
  playingAccent: PronunciationAccent | null;
  onFlip: () => void;
  onPlayUsAudio: (e: React.MouseEvent) => void;
  onPlayUkAudio: (e: React.MouseEvent) => void;
}

export function StudyFlashcard({
  card,
  isFlipped,
  activePhonetic,
  playingAccent,
  onFlip,
  onPlayUsAudio,
  onPlayUkAudio,
}: StudyFlashcardProps) {
  const t = useTranslations('Vocabulary.Study');
  const firstDef = card.definitions?.[0];
  const partOfSpeech = firstDef?.partOfSpeech || 'Word';
  const definitionText = firstDef?.translationVi || firstDef?.definitionEn || '';
  const exampleText = firstDef?.examples?.[0]?.sentenceEn || '';
  const hasUsAudio = Boolean(card.audioUsUrl || card.audioUrl);
  const hasUkAudio = Boolean(card.audioUkUrl);

  return (
    <div
      className="w-full h-[460px] relative cursor-pointer select-none [perspective:1000px]"
      onClick={onFlip}
    >
      <motion.div
        className="w-full h-full relative [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        {/* FRONT SIDE */}
        <div
          className={cn(
            'absolute inset-0 w-full h-full bg-card rounded-2xl border-2 border-border p-8 flex flex-col justify-between shadow-lg [backface-visibility:hidden]',
            isFlipped ? 'pointer-events-none' : 'pointer-events-auto'
          )}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground uppercase tracking-wider">
              {partOfSpeech}
            </span>
            <span className="text-xs text-muted-foreground">{t('clickToFlip')}</span>
          </div>

          <div className="flex flex-col items-center justify-center my-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight text-center">
              {card.term}
            </h1>
            {activePhonetic && (
              <p className="text-lg text-muted-foreground font-mono">{activePhonetic}</p>
            )}

            {/* Audio Buttons */}
            <div className="flex items-center space-x-2 pt-2" onClick={(e) => e.stopPropagation()}>
              {hasUsAudio && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPlayUsAudio}
                  className={cn(
                    'text-xs flex items-center space-x-1 border-border',
                    playingAccent === PronunciationAccent.US && 'border-primary text-primary bg-primary/10'
                  )}
                >
                  <Icons name="volume-2" className="w-3.5 h-3.5" />
                  <span>US</span>
                </Button>
              )}
              {hasUkAudio && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPlayUkAudio}
                  className={cn(
                    'text-xs flex items-center space-x-1 border-border',
                    playingAccent === PronunciationAccent.UK && 'border-primary text-primary bg-primary/10'
                  )}
                >
                  <Icons name="volume-2" className="w-3.5 h-3.5" />
                  <span>UK</span>
                </Button>
              )}
            </div>
          </div>

          <div className="text-center">
            <span className="text-xs text-muted-foreground/60">{t('spacebarHint')}</span>
          </div>
        </div>

        {/* BACK SIDE */}
        <div
          className={cn(
            'absolute inset-0 w-full h-full bg-card rounded-2xl border-2 border-primary/40 p-8 flex flex-col justify-between shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-y-auto',
            !isFlipped ? 'pointer-events-none' : 'pointer-events-auto'
          )}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
              {partOfSpeech}
            </span>
            <span className="text-xs text-muted-foreground">{t('clickToFlipBack')}</span>
          </div>

          <div className="my-auto space-y-4 py-2">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                {t('meaning')}
              </p>
              <p className="text-2xl font-bold text-foreground">{definitionText}</p>
            </div>

            {exampleText && (
              <div className="p-3.5 rounded-lg bg-muted/60 border border-border/50 text-left">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  {t('example')}
                </p>
                <p className="text-sm italic text-foreground">&quot;{exampleText}&quot;</p>
              </div>
            )}

            {card.imageUrl && (
              <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border">
                <Image src={card.imageUrl} alt={card.term} fill className="object-cover" />
              </div>
            )}
          </div>

          <div className="text-center">
            <span className="text-xs text-muted-foreground/60">{t('rateHint')}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
