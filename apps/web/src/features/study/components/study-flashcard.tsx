'use client';

import { useTranslations } from 'next-intl';

import type {
  VocabularyDefinition,
  VocabularyWord,
} from '@/services/vocabulary';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface StudyFlashcardProps {
  card: VocabularyWord;
  isFlipped: boolean;
  showShortcuts: boolean;
  onFlip: () => void;
  onPlayUsAudio: (event: React.MouseEvent) => void;
  onPlayUkAudio: (event: React.MouseEvent) => void;
}

const formatPartOfSpeech = (pos?: string): string => {
  if (!pos) return '';
  const trimmed = pos.trim().toLowerCase().replace(/\.$/, '');
  if (trimmed === 'n' || trimmed === 'noun') return 'noun';
  if (trimmed === 'v' || trimmed === 'verb') return 'verb';
  if (trimmed === 'adj' || trimmed === 'adjective') return 'adjective';
  if (trimmed === 'adv' || trimmed === 'adverb') return 'adverb';
  if (trimmed === 'prep' || trimmed === 'preposition') return 'preposition';
  return pos;
};

const getViMeaning = (definition?: VocabularyDefinition | null): string => {
  if (!definition) return '';
  return (
    definition.definition?.vi ||
    definition.translationVi ||
    definition.definitionEn ||
    definition.definition?.en ||
    ''
  );
};

export function StudyFlashcard({
  card,
  isFlipped,
  showShortcuts,
  onFlip,
  onPlayUsAudio,
  onPlayUkAudio,
}: StudyFlashcardProps) {
  const t = useTranslations('Vocabulary.Study');
  const definitions = card.definitions || [];
  const phoneticUs = card.phoneticUs || card.phonetic || '';
  const phoneticUk = card.phoneticUk || card.phonetic || '';

  return (
    <div
      className="w-full max-w-[500px] h-[370px] sm:h-[390px] relative cursor-pointer select-none [perspective:1200px]"
      onClick={onFlip}
    >
      <motion.div
        className="w-full h-full relative [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? -180 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div
          className="absolute inset-0 w-full h-full bg-card text-card-foreground shadow-xl rounded-2xl p-6 sm:p-8 flex flex-col justify-center items-center text-center overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            pointerEvents: isFlipped ? 'none' : 'auto',
          }}
        >
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
                variant="ghost"
                type="button"
                onClick={onPlayUsAudio}
                size="sm"
                className="h-auto py-1 px-2.5 gap-2.5 group"
                title={t('listenUsHint')}
              >
                <div className="w-7 h-7 rounded-md bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <Icons name="volume-2" className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-xs sm:text-sm font-medium font-mono text-muted-foreground">
                  <span className="font-sans font-bold text-foreground mr-1">
                    US
                  </span>
                  {phoneticUs ? `/${phoneticUs.replace(/^\/|\/$/g, '')}/` : ''}
                </span>
              </Button>

              {/* UK Audio */}
              <Button
                variant="ghost"
                type="button"
                onClick={onPlayUkAudio}
                size="sm"
                className="h-auto py-1 px-2.5 gap-2.5 group"
                title={t('listenUkHint')}
              >
                <div className="w-7 h-7 rounded-md bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <Icons name="volume-2" className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-xs sm:text-sm font-medium font-mono text-muted-foreground">
                  <span className="font-sans font-bold text-foreground mr-1">
                    UK
                  </span>
                  {phoneticUk ? `/${phoneticUk.replace(/^\/|\/$/g, '')}/` : ''}
                </span>
              </Button>
            </div>
          </div>

          {/* Bottom note hint: Pinned to the bottom */}
          <div className="absolute bottom-2.5 sm:bottom-3 inset-x-0 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground/50 font-normal select-none pointer-events-none">
            <Icons
              name="rotate-cw"
              className="w-3 h-3 text-muted-foreground/40"
            />
            <span>
              {t('flip')}
              {showShortcuts ? ` - ${t('pressSpace')}` : ''}
            </span>
          </div>
        </div>

        <div
          className="absolute inset-0 w-full h-full bg-card text-card-foreground shadow-xl rounded-2xl p-6 sm:p-8 flex flex-col justify-center items-center text-center overflow-hidden"
          style={{
            transform: 'rotateY(-180deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            pointerEvents: !isFlipped ? 'none' : 'auto',
          }}
        >
          {/* Center Content: Image + Parts of Speech with Vietnamese Meanings */}
          <div className="flex flex-col items-center justify-center space-y-3.5 my-auto w-full max-w-sm">
            {/* Image (if available) */}
            {card.imageUrl ? (
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-transparent shrink-0">
                <Image
                  src={card.imageUrl}
                  alt={card.term}
                  fill
                  sizes="150px"
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : null}

            {/* Definitions (grouped by part of speech) */}
            <div className="space-y-2.5 w-full">
              {definitions.length > 0 ? (
                definitions.map((def, idx) => {
                  const pos = formatPartOfSpeech(def.partOfSpeech);
                  const meaning = getViMeaning(def);
                  if (!meaning) return null;

                  return (
                    <div key={def.id || idx} className="space-y-0.5">
                      {pos && (
                        <p className="italic text-xs sm:text-sm text-muted-foreground underline underline-offset-4 decoration-muted-foreground/30">
                          {pos}
                        </p>
                      )}
                      <p className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                        {meaning}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                  {card.term}
                </p>
              )}
            </div>
          </div>

          {/* Bottom note hint: Pinned to the bottom */}
          <div className="absolute bottom-2.5 sm:bottom-3 inset-x-0 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground/50 font-normal select-none pointer-events-none">
            <Icons
              name="rotate-cw"
              className="w-3 h-3 text-muted-foreground/40"
            />
            <span>
              {t('flip')}
              {showShortcuts ? ` - ${t('pressSpace')}` : ''}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
