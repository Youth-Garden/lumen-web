'use client';

import { useEffect, type RefObject } from 'react';

export interface UseStudyShortcutsProps {
  isOpen: boolean;
  isFinished: boolean;
  isFlipped: boolean;
  canFlipRef: RefObject<boolean | null>;
  onFlip: () => void;
  onMastered: () => void;
  onReview: () => void;
  onDontKnow: () => void;
  onPlayUsAudio: () => void;
  onPlayUkAudio: () => void;
  onClose: () => void;
}

export function useStudyShortcuts({
  isOpen,
  isFinished,
  isFlipped,
  canFlipRef,
  onFlip,
  onMastered,
  onReview,
  onDontKnow,
  onPlayUsAudio,
  onPlayUkAudio,
  onClose,
}: UseStudyShortcutsProps) {
  useEffect(() => {
    if (!isOpen || isFinished) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      // Audio shortcuts anytime
      if (event.key.toLowerCase() === 'u') {
        event.preventDefault();
        onPlayUsAudio();
        return;
      }
      if (event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onPlayUkAudio();
        return;
      }

      if (!isFlipped) {
        // Front side: Space or Enter to flip
        if (event.code === 'Space' || event.key === 'Enter') {
          if (!canFlipRef.current || event.repeat) return;
          event.preventDefault();
          onFlip();
        }
      } else {
        // Back side:
        if (event.code === 'Space') {
          // Space to flip back
          event.preventDefault();
          onFlip();
        } else if (event.key === '1') {
          // Thông thạo
          event.preventDefault();
          onMastered();
        } else if (event.key === '3') {
          // Nhớ tạm
          event.preventDefault();
          onReview();
        } else if (event.key === 'Enter') {
          // Chưa biết
          event.preventDefault();
          onDontKnow();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isOpen,
    isFinished,
    isFlipped,
    canFlipRef,
    onFlip,
    onMastered,
    onReview,
    onDontKnow,
    onPlayUsAudio,
    onPlayUkAudio,
    onClose,
  ]);
}
