'use client';

import { useState, useRef, useEffect } from 'react';
import { Icons } from '@lumen/uikit/icons';
import { Button, Input } from '@lumen/uikit/components';

interface DictationSentence {
  id: string;
  text: string;
  startTime?: number;
  endTime?: number;
}

interface DictationPlayerProps {
  title: string;
  audioUrl?: string;
  sentences: DictationSentence[];
  onComplete?: (score: number) => void;
}

export function DictationPlayer({
  title,
  audioUrl,
  sentences,
  onComplete,
}: DictationPlayerProps) {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPause, setAutoPause] = useState(true);
  const [showResult, setShowResult] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSentence = sentences[currentSentenceIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleReplaySentence = () => {
    if (!audioRef.current || !currentSentence) return;
    if (currentSentence.startTime !== undefined) {
      audioRef.current.currentTime = currentSentence.startTime;
    }
    audioRef.current.play().catch(console.error);
    setIsPlaying(true);
  };

  // Compare userInput with target sentence word-by-word
  const targetWords = currentSentence ? currentSentence.text.trim().split(/\s+/) : [];
  const typedWords = userInput.trim().split(/\s+/);

  const getWordAccuracy = () => {
    if (targetWords.length === 0) return 0;
    let correct = 0;
    targetWords.forEach((word, idx) => {
      if (typedWords[idx] && typedWords[idx].toLowerCase() === word.toLowerCase()) {
        correct += 1;
      }
    });
    return Math.round((correct / targetWords.length) * 100);
  };

  const handleNextSentence = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex((prev) => prev + 1);
      setUserInput('');
      setShowResult(false);
    } else {
      setShowResult(true);
      if (onComplete) onComplete(getWordAccuracy());
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto rounded-3xl border border-border/80 bg-card p-6 shadow-xl space-y-6">
      {/* Audio Element */}
      {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />}

      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground">
            Sentence {currentSentenceIndex + 1} of {sentences.length}
          </p>
        </div>

        {/* Speed & Auto-pause Settings */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-full text-xs border border-border/40">
            {[0.5, 0.75, 1.0, 1.25].map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => setPlaybackRate(speed)}
                className={`px-2.5 py-1 rounded-full transition-colors font-medium ${
                  playbackRate === speed
                    ? 'bg-primary text-primary-foreground font-bold shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setAutoPause((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              autoPause
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            <Icons name="clock" className="h-3.5 w-3.5" />
            Auto-Pause: {autoPause ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Audio Player Controller Bar */}
      <div className="flex items-center justify-center gap-4 py-4 rounded-2xl bg-muted/30 border border-border/40">
        <Button
          variant="outline"
          size="icon"
          onClick={handleReplaySentence}
          className="rounded-full shadow-xs"
        >
          <Icons name="undo" className="h-4 w-4" />
        </Button>

        <Button
          variant="default"
          size="icon-lg"
          onClick={togglePlay}
          className="rounded-full shadow-md bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Icons name={isPlaying ? 'close' : 'play'} className="h-6 w-6" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNextSentence}
          className="rounded-full shadow-xs"
        >
          <Icons name="redo" className="h-4 w-4" />
        </Button>
      </div>

      {/* Typing & Comparison Area */}
      {!showResult ? (
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Type what you hear:
          </label>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Listen closely and type here..."
            rows={4}
            className="w-full rounded-2xl border border-border/80 bg-background/80 p-4 text-base focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 outline-none transition-all resize-none shadow-xs"
          />

          {/* Word-by-Word Live Diff Comparison */}
          {userInput.length > 0 && (
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 space-y-2">
              <span className="text-xs font-semibold text-muted-foreground">Accuracy Feedback:</span>
              <div className="flex flex-wrap gap-1.5 text-sm font-medium">
                {targetWords.map((word, idx) => {
                  const typed = typedWords[idx];
                  const isCorrect = typed && typed.toLowerCase() === word.toLowerCase();
                  return (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded-md ${
                        isCorrect
                          ? 'bg-emerald-500/20 text-emerald-600 font-semibold'
                          : typed
                          ? 'bg-red-500/20 text-red-600 line-through'
                          : 'bg-muted text-muted-foreground/50'
                      }`}
                    >
                      {typed || '___'}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              className="rounded-full px-6"
              onClick={handleNextSentence}
            >
              Check & Next Sentence
            </Button>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icons name="trophy" className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-black text-foreground">Dictation Complete!</h3>
          <p className="text-sm text-muted-foreground">
            Accuracy Score: <span className="font-bold text-primary text-lg">{getWordAccuracy()}%</span>
          </p>
          <Button
            className="rounded-full px-8 mt-4"
            onClick={() => {
              setCurrentSentenceIndex(0);
              setUserInput('');
              setShowResult(false);
            }}
          >
            Practice Again
          </Button>
        </div>
      )}
    </div>
  );
}
