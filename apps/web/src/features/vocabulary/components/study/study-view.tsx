'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Icons } from '@lumen/uikit/icons';
import { Button } from '@lumen/uikit/components';
import { usePortal } from '@lumen/uikit/portal';
import { type VocabularyWord } from '@/services/vocabulary/vocabulary.types';
import { useStudySession } from '../../hooks/use-study-session';
import { StudySettingsDialog } from './study-settings-dialog';
import { MasteryFlowerBadge } from '../mastery/mastery-flower-badge';
import { MasteryFlowerDialog, MasteryFlowerDialogData } from '../mastery/mastery-flower-dialog';
import { KeyboardShortcutsDialog, KeyboardShortcutsDialogProps } from './keyboard-shortcuts-dialog';
import { StudyFlashcard } from './study-flashcard';
import { StudyCompleted } from './study-completed';

interface StudyViewProps {
  cards: VocabularyWord[];
  isOpen: boolean;
  onClose: () => void;
  folderName?: string;
}

export function StudyView({ cards, isOpen, onClose, folderName = 'Vocabulary Folder' }: StudyViewProps) {
  const t = useTranslations('Vocabulary.Study');
  const [mounted, setMounted] = useState(false);
  const [presentSettings] = usePortal(StudySettingsDialog);
  const [presentMastery] = usePortal<MasteryFlowerDialogData>(MasteryFlowerDialog);
  const [presentShortcuts] = usePortal<KeyboardShortcutsDialogProps>(KeyboardShortcutsDialog);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    queue,
    totalInBatch,
    currentCard,
    isFlipped,
    activePhonetic,
    playingAccent,
    currentCardMastery,
    gotItCount,
    reviewCount,
    isFinished,
    handleFlip,
    handleGotIt,
    handleReview,
    handleRestart,
    handlePlayUsAudio,
    handlePlayUkAudio,
  } = useStudySession({ cards, isOpen, onClose });

  if (!isOpen || !mounted) return null;

  const currentNumber = totalInBatch - queue.length + 1;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={onClose} aria-label={t('close')}>
            <Icons name="x" className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-base font-bold text-foreground leading-none">{folderName}</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {!isFinished
                ? t('cardProgress', { current: currentNumber, total: totalInBatch })
                : t('sessionComplete')}
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-2">
          {currentCard && (
            <MasteryFlowerBadge
              level={currentCardMastery}
              onClick={() => {
                presentMastery({
                  term: currentCard.term,
                  level: currentCardMastery,
                });
              }}
            />
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              presentShortcuts({
                shortcuts: [
                  { keys: ['Space'], description: t('shortcutFlip') },
                  { keys: ['1'], description: t('shortcutReview') },
                  { keys: ['2'], description: t('shortcutGotIt') },
                  { keys: ['U'], description: t('shortcutUsAudio') },
                  { keys: ['K'], description: t('shortcutUkAudio') },
                  { keys: ['Esc'], description: t('shortcutExit') },
                ],
              });
            }}
            aria-label={t('shortcuts')}
          >
            <Icons name="keyboard" className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={() => presentSettings({})} aria-label={t('settings')}>
            <Icons name="settings" className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main card area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        {!isFinished && currentCard ? (
          <StudyFlashcard
            card={currentCard}
            isFlipped={isFlipped}
            activePhonetic={activePhonetic}
            playingAccent={playingAccent}
            onFlip={handleFlip}
            onPlayUsAudio={handlePlayUsAudio}
            onPlayUkAudio={handlePlayUkAudio}
          />
        ) : (
          <StudyCompleted
            totalInBatch={totalInBatch}
            gotItCount={gotItCount}
            reviewCount={reviewCount}
            onRestart={handleRestart}
            onClose={onClose}
          />
        )}
      </div>

      {/* Footer controls */}
      {!isFinished && currentCard && (
        <footer className="p-6 border-t border-border bg-card/50 flex items-center justify-center space-x-4 max-w-2xl mx-auto w-full">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 border-rose-500/30 text-rose-600 hover:bg-rose-500/10 hover:text-rose-700"
            onClick={handleReview}
          >
            <Icons name="rotate-ccw" className="w-4 h-4 mr-2" />
            {t('stillLearning')}
          </Button>

          <Button
            size="lg"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={handleGotIt}
          >
            <Icons name="check" className="w-4 h-4 mr-2" />
            {t('gotIt')}
          </Button>
        </footer>
      )}
    </div>,
    document.body
  );
}
