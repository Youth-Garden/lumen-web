'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PronunciationAccent } from '@/services/vocabulary';

export interface PronunciationOptions {
  term: string;
  audioUrl?: string;
  audioUsUrl?: string;
  audioUkUrl?: string;
  accent?: PronunciationAccent;
}

export function usePronunciation() {
  const [playingAccent, setPlayingAccent] =
    useState<PronunciationAccent | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakWithSynthesis = useCallback(
    (term: string, targetAccent: PronunciationAccent) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setPlayingAccent(null);
        return;
      }

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(term);
        const targetLanguage = targetAccent === 'uk' ? 'en-GB' : 'en-US';
        utterance.lang = targetLanguage;
        utterance.rate = 0.88;

        const availableVoices = window.speechSynthesis.getVoices();
        const matchedVoice = availableVoices.find(
          (voice) =>
            voice.lang.toLowerCase() === targetLanguage.toLowerCase() ||
            voice.lang
              .toLowerCase()
              .replace('_', '-')
              .startsWith(targetLanguage.toLowerCase()),
        );

        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }

        utterance.onstart = () => setPlayingAccent(targetAccent);
        utterance.onend = () => setPlayingAccent(null);
        utterance.onerror = () => setPlayingAccent(null);

        window.speechSynthesis.speak(utterance);
      } catch {
        setPlayingAccent(null);
      }
    },
    [],
  );

  const stopPronunciation = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingAccent(null);
  }, []);

  const playPronunciation = useCallback(
    (options: PronunciationOptions) => {
      const selectedAccent = options.accent || PronunciationAccent.US;
      const remoteAudioUrl =
        selectedAccent === PronunciationAccent.UK
          ? options.audioUkUrl
          : options.audioUsUrl || options.audioUrl;

      stopPronunciation();

      if (!remoteAudioUrl) {
        speakWithSynthesis(options.term, selectedAccent);
        return;
      }

      setPlayingAccent(selectedAccent);

      const audio = new Audio();
      audioRef.current = audio;
      audio.preload = 'auto';
      audio.src = remoteAudioUrl;

      audio.onended = () => {
        setPlayingAccent(null);
      };

      audio.onerror = () => {
        setPlayingAccent(null);
        speakWithSynthesis(options.term, selectedAccent);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err: unknown) => {
          const errorName = (err as Error)?.name;
          if (errorName === 'AbortError') {
            return;
          }
          speakWithSynthesis(options.term, selectedAccent);
        });
      }
    },
    [speakWithSynthesis, stopPronunciation],
  );

  return {
    playPronunciation,
    stopPronunciation,
    isPlaying: Boolean(playingAccent),
    playingAccent,
  };
}
