'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Button, Card } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';
import { useTranslations } from 'next-intl';

export interface ToeicQuestionData {
  id: string;
  part: number;
  questionNumber: number;
  questionText?: string;
  imageUrl?: string;
  audioUrl?: string;
  transcript?: string; // used for Reading passages in Part 6, 7
  options: string[];
}

interface ToeicQuestionRendererProps {
  question: ToeicQuestionData;
  userAnswer?: string;
  onSelectOption: (option: string) => void;
}

export const ToeicQuestionRenderer = ({
  question,
  userAnswer,
  onSelectOption,
}: ToeicQuestionRendererProps) => {
  const t = useTranslations('ToeicTestPlayer');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const renderAudioPlayer = () => {
    if (!question.audioUrl) return null;
    return (
      <div className="mb-6 rounded-xl border bg-slate-50 p-4 dark:bg-slate-900 shadow-sm">
        <audio
          ref={audioRef}
          src={question.audioUrl}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          className="hidden"
        />
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full shadow-sm"
            onClick={toggleAudio}
          >
            <Icons
              name={isPlaying ? 'pause' : 'play'}
              className="h-6 w-6 ml-0.5"
            />
          </Button>
          <div className="flex-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: isPlaying ? '100%' : '0%',
                  transitionDuration: isPlaying ? '10s' : '0s',
                }} // Dummy progress
              />
            </div>
            <div className="mt-2 text-xs text-muted-foreground font-medium">
              {t('audioPlayerHelp')}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOptions = () => (
    <div className="space-y-3">
      {question.options.map((option, index) => {
        // For Part 2, options are typically just A, B, C.
        // Or if the option text is full, we show it. If it's just 'A', we can format it nicely.
        const letter = String.fromCharCode(65 + index);
        const isSelected = userAnswer === option;

        return (
          <button
            key={index}
            onClick={() => onSelectOption(option)}
            className={cn(
              'flex w-full min-h-[44px] items-center gap-4 rounded-xl border p-4 text-left transition-all hover:bg-slate-50 dark:hover:bg-slate-900',
              {
                'border-primary bg-primary/5 ring-1 ring-primary': isSelected,
              },
            )}
          >
            <span
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-slate-300 text-slate-500 dark:border-slate-700',
              )}
            >
              {letter}
            </span>
            <span className={cn('text-base', isSelected ? 'font-medium' : '')}>
              {option !== letter ? option : `${t('option')} ${letter}`}
            </span>
          </button>
        );
      })}
    </div>
  );

  // Layouts based on Part
  const isListening = question.part <= 4;
  const hasReadingPassage = question.part >= 6 && question.transcript;

  return (
    <Card className="overflow-hidden border-none shadow-none bg-transparent">
      <div
        className={cn(
          'flex flex-col gap-6',
          hasReadingPassage ? 'lg:flex-row' : '',
        )}
      >
        {/* Left Side: Context (Image / Passage) */}
        {(question.imageUrl || hasReadingPassage || isListening) && (
          <div
            className={cn(
              'space-y-6',
              hasReadingPassage ? 'lg:w-1/2' : 'w-full',
            )}
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                {t('part')} {question.part}
              </span>
            </div>

            {question.imageUrl && (
              <div className="relative w-full max-w-xl mx-auto h-64 md:h-96 overflow-hidden rounded-xl shadow-md">
                <Image
                  src={question.imageUrl}
                  alt="Question Context"
                  fill
                  className="object-contain bg-slate-100 dark:bg-slate-900"
                />
              </div>
            )}

            {renderAudioPlayer()}

            {hasReadingPassage && (
              <div className="prose dark:prose-invert max-w-none rounded-xl border bg-card p-6 shadow-sm">
                <div className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                  {question.transcript}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Side: Question & Options */}
        <div
          className={cn(
            'flex-1 space-y-6',
            hasReadingPassage ? 'lg:w-1/2' : 'max-w-3xl mx-auto w-full',
          )}
        >
          <div className="space-y-4">
            <h3 className="text-xl font-medium">
              <span className="text-muted-foreground mr-2">
                {question.questionNumber}.
              </span>
              {/* Part 2 might not have questionText */}
              {question.questionText
                ? question.questionText
                : t('listenAndChoose')}
            </h3>

            {renderOptions()}
          </div>
        </div>
      </div>
    </Card>
  );
};
