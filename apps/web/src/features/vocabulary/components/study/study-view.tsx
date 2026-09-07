'use client';

import { useTranslations } from 'next-intl';

import { type VocabularyWord } from '@/services/vocabulary/vocabulary.types';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { PortalProps, usePortal } from '@lumen/uikit/portal';
import { useState } from 'react';
import { useStudySession } from '../../hooks/use-study-session';
import { MasteryFlowerBadge } from '../mastery/mastery-flower-badge';
import {
  MasteryFlowerDialog,
  MasteryFlowerDialogData,
} from '../mastery/mastery-flower-dialog';
import { StudyCompleted } from './study-completed';
import { StudyFlashcard } from './study-flashcard';
import { StudySettingsDialog } from './study-settings-dialog';

export interface StudyViewData {
  cards: VocabularyWord[];
  selectedTopic?: string | null;
  folderName?: string;
}

export function StudyView({
  // Hook translations

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

  const t = useTranslations('Vocabulary.Study');
  const {
    poolCards,
    masteredIds,
    currentCard,
    isReviewPhase,
    isFlipped,
    isFinished,
    progressPercent,
    currentCardMastery,
    missedWordsList,
    handleFlip,
    handleMastered,
    handleReview,
    handleDontKnow,
    handleRestart,
    handlePlayUsAudio,
    handlePlayUkAudio,
    handleSaveProgress,
  } = useStudySession({
    cards,
    selectedTopic,
    isOpen: Boolean(isOpen),
    onClose: () => onDismiss?.(),
  });

  if (!isOpen && !data) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-background flex flex-col justify-between select-none overflow-hidden transition-opacity duration-200 ${
        isOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Glassmorphism ambient glows matching DashboardLayout */}
      <div className="absolute top-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/20 opacity-40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-blue-500/10 opacity-30 blur-[100px] pointer-events-none" />

      {/* Main content wrapper matching main-content-wrapper from DashboardLayout */}
      <div className="relative flex flex-col flex-1 overflow-hidden z-10 bg-muted/50 backdrop-blur-2xl">
        {/* 1. TOP BAR */}
        <header className="relative w-full flex items-center justify-between px-4 sm:px-8 py-3.5 shrink-0">
          {/* Left: Save icon + Toggle shortcuts button */}
          <div className="flex items-center gap-2 z-10">
            <Button
              variant="subtle"
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
              variant="subtle"
              size="sm"
              type="button"
              onClick={() => setShowShortcuts((prev) => !prev)}
            >
              {showShortcuts ? t('hideShortcuts') : t('showShortcuts')}
            </Button>
          </div>

          {/* Center: Long horizontal progress bar (Mathematically 100% dead-center) */}
          <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-[240px] sm:max-w-[360px] md:max-w-[440px] px-2 pointer-events-none">
            <div className="w-full h-2 rounded-full bg-muted/90 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>


          {/* Right: Settings modal trigger only */}
          <div className="flex items-center gap-2 z-10">
            <Button
              variant="subtle"
              size="icon-sm"
              type="button"
              onClick={() => presentSettings({})}
              title={t('settingsTitle')}
            >
              <Icons name="settings" className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* 2. CENTER CONTENT (Flashcard elevated over soft canvas background) */}
        <main className="flex-1 flex flex-col items-center justify-start pt-6 sm:pt-8 md:pt-10 px-4 pb-4 w-full overflow-y-auto">
          {!isFinished && currentCard ? (
            <div className="w-full max-w-[500px] flex flex-col items-center">
              {/* Top Bar above card */}
              <div className="w-full flex items-center justify-between mb-3 px-1">
                <span className="text-base sm:text-lg font-bold text-foreground">
                  {isReviewPhase ? t('reviewWord') : t('newWord')}
                </span>

                <MasteryFlowerBadge
                  level={currentCardMastery}
                  onClick={() => {
                    presentMastery({
                      term: currentCard.term,
                      level: currentCardMastery,
                    });
                  }}
                />
              </div>

              {/* Flashcard */}
              <StudyFlashcard
                card={currentCard}
                isFlipped={isFlipped}
                showShortcuts={showShortcuts}
                onFlip={handleFlip}
                onPlayUsAudio={handlePlayUsAudio}
                onPlayUkAudio={handlePlayUkAudio}
              />

              {/* Action Buttons Below Flashcard */}
              <div className={`w-full max-w-[440px] flex flex-col items-center space-y-3 mt-4 h-[94px] transition-opacity duration-200 ${isFlipped ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Row 1: Mastered & Familiar */}
                <div className="w-full flex items-center justify-center gap-3 sm:gap-4">
                  <Button
                    variant="outline"
                    onClick={handleMastered}
                    className="flex-1 max-w-[210px] h-10 rounded-full font-bold border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 cursor-pointer shadow-xs text-xs sm:text-sm"
                  >
                    <span>{t('masteredBtn')}</span>
                    {showShortcuts && (
                      <span className="text-xs font-normal opacity-70 ml-1">
                        - {t('pressKey', { key: '1' })}
                      </span>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleReview}
                    className="flex-1 max-w-[210px] h-10 rounded-full font-bold border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b]/10 cursor-pointer shadow-xs text-xs sm:text-sm"
                  >
                    <span>{t('familiarBtn')}</span>
                    {showShortcuts && (
                      <span className="text-xs font-normal opacity-70 ml-1">
                        - {t('pressKey', { key: '3' })}
                      </span>
                    )}
                  </Button>
                </div>

                {/* Row 2: Unknown */}
                <Button
                  variant="default"
                  onClick={handleDontKnow}
                  className="w-64 sm:w-72 h-10 rounded-full font-bold cursor-pointer shadow-md bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm"
                >
                  <span>{t('dontKnow')}</span>
                  {showShortcuts && (
                    <span className="text-xs font-normal opacity-85 ml-1.5">
                      - {t('pressEnter')}
                    </span>
                  )}
                </Button>
              </div>
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

        {/* 3. BOTTOM SPACER */}
        <footer className="h-4 w-full shrink-0" />
      </div>
    </div>
  );
}
