'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '@lumen/uikit/icons';
import { Button } from '@lumen/uikit/components';
import { AudioButton } from '@/shared/components/audio-button';
import { useReviewFlashcard } from '../hooks';

export interface FlashcardItem {
  id: string; // flashcardId
  word: {
    id: string;
    term: string;
    phonetic?: string;
    audioUrl?: string;
    cefrLevel?: string;
    definitions?: Array<{
      partOfSpeech: string;
      meaning: string;
      examples?: string[];
    }>;
  };
}

interface FlashcardStudyModalProps {
  cards: FlashcardItem[];
  isOpen: boolean;
  onClose: () => void;
  deckName?: string;
}

export function FlashcardStudyModal({
  cards,
  isOpen,
  onClose,
  deckName = 'Flashcards',
}: FlashcardStudyModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const reviewMutation = useReviewFlashcard();

  if (!isOpen) return null;

  const currentCard = cards[currentIndex];
  const isFinished = currentIndex >= cards.length || !currentCard;

  const handleRating = async (quality: 1 | 2 | 3 | 4) => {
    if (!currentCard) return;

    try {
      await reviewMutation.mutateAsync({
        flashcardId: currentCard.id,
        quality,
      });
      setCompletedCount((prev) => prev + 1);
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } catch (err) {
      console.error('Failed to review flashcard:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-in fade-in-0">
      <div className="relative flex flex-col w-full max-w-lg rounded-3xl border border-border/80 bg-card p-6 shadow-2xl overflow-hidden min-h-[500px]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              {deckName}
            </h3>
            <p className="text-xs text-muted-foreground">
              {!isFinished ? `Card ${currentIndex + 1} of ${cards.length}` : 'Completed'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Icons name="close" className="h-5 w-5" />
          </button>
        </div>

        {/* Card Content or Completion */}
        {!isFinished ? (
          <div className="flex-1 flex flex-col items-center justify-center py-6">
            {/* 3D Flip Container */}
            <div
              className="w-full h-72 cursor-pointer [perspective:1000px]"
              onClick={() => setIsFlipped((prev) => !prev)}
            >
              <motion.div
                className="relative w-full h-full rounded-2xl border border-border/80 bg-gradient-to-br from-card to-muted/40 p-6 shadow-lg flex flex-col items-center justify-center text-center [transform-style:preserve-3d]"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                {/* Front Side */}
                <div
                  className={`absolute inset-0 p-6 flex flex-col items-center justify-center [backface-visibility:hidden] ${
                    isFlipped ? 'pointer-events-none' : ''
                  }`}
                >
                  {currentCard.word.cefrLevel && (
                    <span className="mb-3 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      {currentCard.word.cefrLevel}
                    </span>
                  )}
                  <h2 className="text-4xl font-black text-foreground tracking-tight">
                    {currentCard.word.term}
                  </h2>
                  {currentCard.word.phonetic && (
                    <p className="mt-2 text-sm text-muted-foreground font-mono">
                      {currentCard.word.phonetic}
                    </p>
                  )}

                  {currentCard.word.audioUrl && (
                    <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                      <AudioButton url={currentCard.word.audioUrl} />
                    </div>
                  )}

                  <p className="mt-6 text-xs text-muted-foreground/70 animate-pulse">
                    Tap to flip card 🔄
                  </p>
                </div>

                {/* Back Side */}
                <div
                  className={`absolute inset-0 p-6 flex flex-col items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    !isFlipped ? 'pointer-events-none' : ''
                  }`}
                >
                  <div className="w-full text-left space-y-3 overflow-y-auto max-h-56 pr-2">
                    {currentCard.word.definitions?.map((def, idx) => (
                      <div key={idx} className="rounded-xl bg-muted/60 p-3 text-xs border border-border/40">
                        <span className="font-bold text-primary capitalize mr-2">
                          {def.partOfSpeech}
                        </span>
                        <span className="text-foreground">{def.meaning}</span>
                        {def.examples && def.examples.length > 0 && (
                          <p className="mt-1 text-muted-foreground italic text-[11px]">
                            &quot;{def.examples[0]}&quot;
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* SRS Review Action Buttons */}
            {isFlipped && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-4 gap-2 w-full mt-6"
              >
                <Button
                  variant="destructive"
                  className="rounded-xl flex flex-col items-center py-2 h-auto text-xs"
                  onClick={() => handleRating(1)}
                  disabled={reviewMutation.isPending}
                >
                  <span className="font-bold">Again</span>
                  <span className="text-[10px] opacity-80">&lt; 1 min</span>
                </Button>

                <Button
                  variant="outline"
                  className="rounded-xl flex flex-col items-center py-2 h-auto text-xs border-amber-500/50 text-amber-600 hover:bg-amber-50"
                  onClick={() => handleRating(2)}
                  disabled={reviewMutation.isPending}
                >
                  <span className="font-bold">Hard</span>
                  <span className="text-[10px] opacity-80">1 day</span>
                </Button>

                <Button
                  variant="outline"
                  className="rounded-xl flex flex-col items-center py-2 h-auto text-xs border-blue-500/50 text-blue-600 hover:bg-blue-50"
                  onClick={() => handleRating(3)}
                  disabled={reviewMutation.isPending}
                >
                  <span className="font-bold">Good</span>
                  <span className="text-[10px] opacity-80">3 days</span>
                </Button>

                <Button
                  variant="default"
                  className="rounded-xl flex flex-col items-center py-2 h-auto text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => handleRating(4)}
                  disabled={reviewMutation.isPending}
                >
                  <span className="font-bold">Easy</span>
                  <span className="text-[10px] opacity-80">7 days</span>
                </Button>
              </motion.div>
            )}
          </div>
        ) : (
          /* Completion Screen */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <Icons name="check" className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              Great Job! 🎉
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              You reviewed {completedCount} flashcards in this session. Keep up your daily streak!
            </p>
            <Button
              className="mt-4 rounded-full px-8"
              onClick={onClose}
            >
              Finish Session
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
