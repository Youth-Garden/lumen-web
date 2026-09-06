'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Icons } from '@lumen/uikit/icons';
import { Button } from '@lumen/uikit/components';
import { type VocabularyWord } from '@/services/vocabulary/vocabulary.types';

interface StudyFlashcardProps {
  card: VocabularyWord;
  isFlipped: boolean;
  showShortcuts: boolean;
  onFlip: () => void;
  onPlayUsAudio: (e: React.MouseEvent) => void;
  onPlayUkAudio: (e: React.MouseEvent) => void;
}

export function StudyFlashcard({
  card,
  isFlipped,
  showShortcuts,
  onFlip,
  onPlayUsAudio,
  onPlayUkAudio,
}: StudyFlashcardProps) {
  const definitions = card.definitions || [];
  const primaryDef = definitions[0];

  // Vietnamese translation/meaning
  const viMeaning =
    primaryDef?.translationVi ||
    primaryDef?.definition?.vi ||
    primaryDef?.definitionEn ||
    card.term;

  // English definition / explanation
  const rawEnDef = primaryDef?.definition?.en || primaryDef?.definitionEn || '';
  const enDefinition = rawEnDef !== viMeaning ? rawEnDef : '';

  // First example sentence (bilingual)
  const firstExample = primaryDef?.examples?.[0];
  const exampleEn =
    firstExample?.sentence?.en ||
    firstExample?.sentenceEn ||
    (typeof firstExample?.sentence === 'string' ? firstExample.sentence : '');
  const exampleVi =
    firstExample?.sentence?.vi ||
    firstExample?.translationVi ||
    '';

  const phoneticUs = card.phoneticUs || card.phonetic || '';
  const phoneticUk = card.phoneticUk || card.phonetic || '';

  return (
    <div
      className="w-full max-w-[520px] h-[370px] sm:h-[390px] relative cursor-pointer select-none [perspective:1200px]"
      onClick={onFlip}
    >
      <motion.div
        className="w-full h-full relative [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {/* FRONT SIDE */}
        <div
          className="absolute inset-0 w-full h-full bg-card/90 backdrop-blur-md text-card-foreground rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-sm hover:shadow-md transition-shadow [backface-visibility:hidden] overflow-hidden"
          style={{
            pointerEvents: isFlipped ? 'none' : 'auto',
          }}
        >
          {/* Top spacer */}
          <div className="w-full h-2" />

          {/* Center Content: Term & Pronunciations */}
          <div className="flex flex-col items-center justify-center space-y-4 my-auto w-full">
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              {card.term}
            </h1>

            {/* US & UK Audio Buttons */}
            <div
              className="flex flex-col items-center space-y-2 pt-1"
              onClick={(event) => event.stopPropagation()}
            >
              {/* US Audio */}
              <Button
                variant="subtle"
                type="button"
                onClick={onPlayUsAudio}
                className="h-auto py-1.5 px-4 rounded-full text-foreground hover:bg-muted/70 transition-colors cursor-pointer group border-none shadow-none gap-2.5"
                title="Nghe phát âm US (Phím U)"
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <Icons name="volume-2" className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-xs sm:text-sm font-medium font-mono text-muted-foreground">
                  <span className="font-sans font-bold text-foreground mr-1">US</span>
                  {phoneticUs ? `/${phoneticUs.replace(/^\/|\/$/g, '')}/` : ''}
                </span>
              </Button>

              {/* UK Audio */}
              <Button
                variant="subtle"
                type="button"
                onClick={onPlayUkAudio}
                className="h-auto py-1.5 px-4 rounded-full text-foreground hover:bg-muted/70 transition-colors cursor-pointer group border-none shadow-none gap-2.5"
                title="Nghe phát âm UK (Phím K)"
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <Icons name="volume-2" className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-xs sm:text-sm font-medium font-mono text-muted-foreground">
                  <span className="font-sans font-bold text-foreground mr-1">UK</span>
                  {phoneticUk ? `/${phoneticUk.replace(/^\/|\/$/g, '')}/` : ''}
                </span>
              </Button>
            </div>
          </div>

          {/* Bottom hint: Lật - Nhấn Space */}
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-primary pb-1 tracking-wide">
            <Icons name="book-open" className="w-4 h-4 text-primary" />
            <span>Lật {showShortcuts ? '- Nhấn Space' : ''}</span>
          </div>
        </div>

        {/* BACK SIDE: Detailed Explanation & Examples */}
        <div
          className="absolute inset-0 w-full h-full bg-card/90 backdrop-blur-md text-card-foreground rounded-3xl p-5 sm:p-7 flex flex-col justify-between items-center text-center shadow-sm hover:shadow-md transition-shadow [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-y-auto"
          style={{
            pointerEvents: !isFlipped ? 'none' : 'auto',
          }}
        >
          {/* Main content */}
          <div className="w-full flex flex-col items-center my-auto space-y-2.5">
            {/* Image (if available, compact) */}
            {card.imageUrl ? (
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-muted/30 shrink-0 mb-1">
                <Image
                  src={card.imageUrl}
                  alt={card.term}
                  fill
                  sizes="80px"
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : null}

            {/* Term & Part of speech */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg sm:text-xl font-bold text-foreground">
                {card.term}
              </span>
              {primaryDef?.partOfSpeech && (
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {primaryDef.partOfSpeech}
                </span>
              )}
            </div>

            {/* Vietnamese Meaning */}
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              {viMeaning}
            </h2>

            {/* English Definition / Explanation */}
            {enDefinition && (
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                {enDefinition}
              </p>
            )}

            {/* Example Box (Bilingual) */}
            {exampleEn && (
              <div className="w-full max-w-md p-3 rounded-2xl bg-muted/40 text-left space-y-1 border-none mt-1">
                <p className="text-xs sm:text-sm font-medium text-foreground italic leading-relaxed">
                  &ldquo;{exampleEn}&rdquo;
                </p>
                {exampleVi && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {exampleVi}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Bottom hint: Lật - Nhấn Space */}
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-primary pt-1 pb-1 tracking-wide shrink-0">
            <Icons name="book-open" className="w-4 h-4 text-primary" />
            <span>Lật {showShortcuts ? '- Nhấn Space' : ''}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
