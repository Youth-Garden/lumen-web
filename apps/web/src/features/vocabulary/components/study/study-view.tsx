'use client';

import { useState } from 'react';
import { Icons } from '@lumen/uikit/icons';
import { Button } from '@lumen/uikit/components';
import { PortalProps, usePortal } from '@lumen/uikit/portal';
import { type VocabularyWord } from '@/services/vocabulary/vocabulary.types';
import { useStudySession } from '../../hooks/use-study-session';
import { StudySettingsDialog } from './study-settings-dialog';
import { MasteryFlowerBadge } from '../mastery/mastery-flower-badge';
import {
  MasteryFlowerDialog,
  MasteryFlowerDialogData,
} from '../mastery/mastery-flower-dialog';
import { StudyFlashcard } from './study-flashcard';
import { StudyCompleted } from './study-completed';

export interface StudyViewData {
  cards: VocabularyWord[];
  selectedTopic?: string | null;
  folderName?: string;
}

export function StudyView({
  isOpen,
  onDismiss,
  data,
}: PortalProps<StudyViewData>) {
  const [presentSettings] = usePortal(StudySettingsDialog);
  const [presentMastery] = usePortal<MasteryFlowerDialogData>(MasteryFlowerDialog);
  const [showShortcuts, setShowShortcuts] = useState(true);

  const cards = data?.cards || [];
  const selectedTopic = data?.selectedTopic || null;

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
  } = useStudySession({
    cards,
    selectedTopic,
    isOpen: Boolean(isOpen),
    onClose: () => onDismiss?.(),
  });

  if (!isOpen && !data) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-background flex flex-col justify-between select-none transition-opacity duration-200 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Ambient background glows matching DashboardLayout */}
      <div className="absolute top-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/20 opacity-40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-blue-500/10 opacity-30 blur-[100px] pointer-events-none" />

      {/* 1. TOP BAR (Matching Image 1) */}
      <header className="w-full flex items-center justify-between px-4 sm:px-8 py-3.5 shrink-0">
        {/* Left: Save icon + Toggle shortcuts button */}
        <div className="flex items-center gap-2">
          <Button
            variant="subtle"
            size="icon-sm"
            type="button"
            title="Lưu từ vựng"
          >
            <Icons name="save" className="w-4 h-4" />
          </Button>

          <Button
            variant="subtle"
            size="sm"
            type="button"
            onClick={() => setShowShortcuts((prev) => !prev)}
          >
            {showShortcuts ? 'Ẩn phím tắt' : 'Hiện phím tắt'}
          </Button>
        </div>

        {/* Center: Long horizontal progress bar */}
        <div className="flex-1 max-w-xs sm:max-w-md md:max-w-lg mx-4">
          <div className="w-full h-1.5 bg-muted/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{
                width: `${Math.min(100, Math.max(0, progressPercent))}%`,
              }}
            />
          </div>
        </div>

        {/* Right: Settings icon */}
        <div className="flex items-center gap-2">
          <Button
            variant="subtle"
            size="icon-sm"
            type="button"
            onClick={() => presentSettings({})}
            title="Cài đặt bài học"
          >
            <Icons name="settings" className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* 2. CENTER CONTENT (Flashcard + Status Header + Rating Section) */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-auto w-full">
        {!isFinished && currentCard ? (
          <div className="w-full max-w-[500px] flex flex-col items-center">
            {/* Top Bar above card: "Từ mới" / "Từ ôn tập" on left, Sprout badge on right */}
            <div className="w-full flex items-center justify-between mb-3 px-1">
              <span className="text-base sm:text-lg font-bold text-foreground">
                {isReviewPhase ? 'Từ ôn tập' : 'Từ mới'}
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

            {/* Rating Buttons Container (Fixed 140px height so card never jumps vertically) */}
            <div
              className={`w-full mt-4 h-[140px] flex flex-col items-center justify-center transition-opacity duration-200 ${
                isFlipped
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none'
              }`}
            >
              <p className="text-sm font-semibold text-foreground/85 text-center mb-3">
                Bạn thuộc từ này ở mức nào?
              </p>

              {/* Row 1: Thông thạo (green) & Nhớ tạm (orange) */}
              <div className="flex items-center justify-center gap-3.5 w-full mb-2.5">
                <Button
                  variant="outline"
                  onClick={handleMastered}
                  className="flex-1 max-w-[210px] h-10 rounded-full font-bold border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e]/10 cursor-pointer shadow-xs text-xs sm:text-sm"
                >
                  <span>Thông thạo</span>
                  {showShortcuts && (
                    <span className="text-xs font-normal opacity-70 ml-1">
                      - Phím 1
                    </span>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleReview}
                  className="flex-1 max-w-[210px] h-10 rounded-full font-bold border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b]/10 cursor-pointer shadow-xs text-xs sm:text-sm"
                >
                  <span>Nhớ tạm</span>
                  {showShortcuts && (
                    <span className="text-xs font-normal opacity-70 ml-1">
                      - Phím 3
                    </span>
                  )}
                </Button>
              </div>

              {/* Row 2: Chưa biết (blue pill) */}
              <Button
                variant="default"
                onClick={handleDontKnow}
                className="w-64 sm:w-72 h-10 rounded-full font-bold cursor-pointer shadow-md bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm"
              >
                <span>Chưa biết</span>
                {showShortcuts && (
                  <span className="text-xs font-normal opacity-85 ml-1.5">
                    - Nhấn Enter
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

      {/* 3. BOTTOM SPACER (for perfect vertical centering) */}
      <footer className="h-6 w-full shrink-0" />
    </div>
  );
}
