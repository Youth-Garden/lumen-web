'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { StudyChoiceMeaning } from '@/features/study/components/study-choice-meaning';
import { StudyChoiceTerm } from '@/features/study/components/study-choice-term';
import { StudyCompleted } from '@/features/study/components/study-completed';
import { StudyFlashcard } from '@/features/study/components/study-flashcard';
import { StudyRatingButton } from '@/features/study/components/study-rating-button';
import { StudySettingsDialog } from '@/features/study/components/study-settings-dialog';
import { StudyTyping } from '@/features/study/components/study-typing';
import { useStudySession } from '@/features/study/hooks/use-study-session';
import {
  StudyExerciseType,
  StudySessionMode,
} from '@/features/study/types/study.types';
import { MasteryFlowerBadge } from '@/features/vocabulary/components/mastery/mastery-flower-badge';
import {
  MasteryFlowerDialog,
  MasteryFlowerDialogData,
} from '@/features/vocabulary/components/mastery/mastery-flower-dialog';
import { type VocabularyWord } from '@/services/vocabulary';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import {
  PortalProps,
  usePortal,
} from '@lumen/uikit/portal';

export interface StudyViewData {
  cards: VocabularyWord[];
  selectedTopic?: string;
  folderName?: string;
  isReviewMode?: boolean;
  mode?: StudySessionMode;
}

export function StudyView({
  isOpen,
  onDismiss,
  data,
}: PortalProps<StudyViewData>) {
  const [presentSettings] = usePortal(StudySettingsDialog);
  const [presentMastery] =
    usePortal<MasteryFlowerDialogData>(MasteryFlowerDialog);
  const [showShortcuts, setShowShortcuts] = useState(true);

  const cards = data?.cards || [];
  const selectedTopic = data?.selectedTopic || null;
  const isReviewMode = Boolean(data?.isReviewMode);
  const mode = data?.mode;

  const t = useTranslations('Vocabulary.Study');

  const {
    mode: sessionMode,
    poolCards,
    masteredIds,
    currentItem,
    currentCard,
    isFlipped,
    isFinished,
    selectedOptionIndex,
    progressPercent,
    currentCardMastery,
    currentCardLearningStep,
    isPlaying,
    missedWordsList,
    handleFlip,
    handleMastered,
    handleReview,
    handleDontKnow,
    handleFlashcardAgain,
    handleFlashcardKnown,
    handleSelectChoiceOption,
    handleSubmitTyping,
    handleContinueFeedback,
    handleRestart,
    handlePlayUsAudio,
    handlePlayUkAudio,
    handlePlayAudio,
    handleSaveProgress,
    dismissFeedback,
  } = useStudySession({
    cards,
    selectedTopic,
    isReviewMode,
    mode,
    isOpen: Boolean(isOpen),
    onClose: () => onDismiss?.(),
  });

  if (!isOpen && !data) return null;

  const handleOpenMastery = () => {
    if (!currentCard) return;
    presentMastery({
      term: currentCard.term,
      level: currentCardMastery,
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          dismissFeedback();
          handleSaveProgress();
          onDismiss?.();
        }
      }}
    >
      <DialogContent variant="fullscreen">
        <DialogTitle className="sr-only">
          {sessionMode === StudySessionMode.FLASHCARD
            ? t('flashcards')
            : t('newWord')}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {t('flashcards')}
        </DialogDescription>

        <div className="absolute top-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/20 opacity-40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-blue-500/10 opacity-30 blur-[100px] pointer-events-none" />

      <div className="relative flex flex-col flex-1 overflow-hidden z-10 bg-background">
        <header className="relative w-full flex items-center justify-between px-4 sm:px-8 py-3.5 shrink-0">
          <div className="flex items-center gap-2 z-10">
            <Button
              variant="ghost"
              size="icon-sm"
              type="button"
              onClick={() => {
                handleSaveProgress();
                onDismiss?.();
              }}
              title={t('saveAndClose')}
            >
              <Icons name="save" className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setShowShortcuts((prev) => !prev)}
            >
              {showShortcuts ? t('hideShortcuts') : t('showShortcuts')}
            </Button>
          </div>

          {/* Center: Long horizontal progress bar */}
          <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-[240px] sm:max-w-[360px] md:max-w-[440px] px-2 pointer-events-none">
            <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={false}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Right: Settings modal trigger only */}
          <div className="flex items-center gap-2 z-10">
            <Button
              variant="ghost"
              size="icon-sm"
              type="button"
              onClick={() => presentSettings({})}
              title={t('settingsTitle')}
            >
              <Icons name="settings" className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* 2. CENTER CONTENT */}
        <main className="flex-1 flex flex-col items-center justify-start pt-6 sm:px-4 pb-16 w-full overflow-y-auto">
          {!isFinished && currentItem && currentCard ? (
            <div className="w-full max-w-2xl flex flex-col items-center">
              {/* Exercise Type 1: Flashcard (Brand new words) */}
              {currentItem.exerciseType === StudyExerciseType.FLASHCARD && (
                <div className="w-full max-w-[500px] flex flex-col items-center">
                  {/* Top Bar above card */}
                  <div className="w-full flex items-center justify-between mb-3 px-1">
                    <span className="text-base sm:text-lg font-bold text-foreground">
                      {sessionMode === StudySessionMode.FLASHCARD
                        ? t('flashcards')
                        : t('newWord')}
                    </span>

                    <MasteryFlowerBadge
                      level={currentCardMastery}
                      learningStep={currentCardLearningStep}
                      onClick={handleOpenMastery}
                    />
                  </div>

                  <StudyFlashcard
                    card={currentCard}
                    isFlipped={isFlipped}
                    showShortcuts={showShortcuts}
                    onFlip={handleFlip}
                    onPlayUsAudio={handlePlayUsAudio}
                    onPlayUkAudio={handlePlayUkAudio}
                  />

                  {/* Action Buttons Below Flashcard */}
                  <div
                    className={
                      'w-full max-w-[440px] flex flex-col items-center space-y-3 mt-4 h-[94px] transition-opacity duration-200 ' +
                      (isFlipped
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none')
                    }
                  >
                    {sessionMode === StudySessionMode.FLASHCARD ? (
                      <div className="w-full flex items-center justify-center gap-3 sm:gap-4 my-auto">
                        <StudyRatingButton
                          sentiment="negative"
                          size="default"
                          onClick={handleFlashcardAgain}
                          className="flex-1 max-w-[210px]"
                          shortcut={
                            showShortcuts
                              ? t('pressKey', { key: '1' })
                              : undefined
                          }
                        >
                          {t('flashcardAgain')}
                        </StudyRatingButton>

                        <StudyRatingButton
                          sentiment="positive"
                          size="default"
                          onClick={handleFlashcardKnown}
                          className="flex-1 max-w-[210px]"
                          shortcut={
                            showShortcuts
                              ? t('pressKey', { key: '2' })
                              : undefined
                          }
                        >
                          {t('flashcardKnown')}
                        </StudyRatingButton>
                      </div>
                    ) : (
                      <>
                        {/* Row 1: Mastered & Familiar */}
                        <div className="w-full flex items-center justify-center gap-3 sm:gap-4">
                          <StudyRatingButton
                            sentiment="positive"
                            size="default"
                            onClick={handleMastered}
                            className="flex-1 max-w-[210px]"
                            shortcut={
                              showShortcuts
                                ? t('pressKey', { key: '1' })
                                : undefined
                            }
                          >
                            {t('masteredBtn')}
                          </StudyRatingButton>

                          <StudyRatingButton
                            sentiment="neutral"
                            size="default"
                            onClick={handleReview}
                            className="flex-1 max-w-[210px]"
                            shortcut={
                              showShortcuts
                                ? t('pressKey', { key: '3' })
                                : undefined
                            }
                          >
                            {t('familiarBtn')}
                          </StudyRatingButton>
                        </div>

                        {/* Row 2: Unknown */}
                        <StudyRatingButton
                          sentiment="negative"
                          size="default"
                          onClick={handleDontKnow}
                          className="w-64 sm:w-72"
                          shortcut={showShortcuts ? t('pressEnter') : undefined}
                        >
                          {t('dontKnow')}
                        </StudyRatingButton>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Exercise Type 2: Choice Term (4 English words) */}
              {currentItem.exerciseType === StudyExerciseType.CHOICE_TERM && (
                <StudyChoiceTerm
                  item={currentItem}
                  masteryLevel={currentCardMastery}
                  learningStep={currentCardLearningStep}
                  selectedIndex={selectedOptionIndex}
                  onSelectOption={handleSelectChoiceOption}
                  onOpenMastery={handleOpenMastery}
                />
              )}

              {/* Exercise Type 3: Choice Meaning (Audio + 4 Vietnamese meanings) */}
              {currentItem.exerciseType ===
                StudyExerciseType.CHOICE_MEANING && (
                <StudyChoiceMeaning
                  item={currentItem}
                  masteryLevel={currentCardMastery}
                  learningStep={currentCardLearningStep}
                  selectedIndex={selectedOptionIndex}
                  isPlayingAudio={isPlaying}
                  onPlayAudio={handlePlayAudio}
                  onSelectOption={handleSelectChoiceOption}
                  onOpenMastery={handleOpenMastery}
                />
              )}

              {/* Exercise Type 4: Typing */}
              {currentItem.exerciseType === StudyExerciseType.TYPING && (
                <StudyTyping
                  item={currentItem}
                  masteryLevel={currentCardMastery}
                  learningStep={currentCardLearningStep}
                  onSubmitAnswer={handleSubmitTyping}
                  onOpenMastery={handleOpenMastery}
                />
              )}
            </div>
          ) : (
            <div className="w-full max-w-xl my-auto">
              <StudyCompleted
                totalInBatch={poolCards.length}
                masteredCount={masteredIds.length}
                missedWords={missedWordsList}
                onRestart={handleRestart}
                onClose={() => onDismiss?.()}
              />
            </div>
          )}
        </main>
      </div>
    </DialogContent>
  </Dialog>
);
}
