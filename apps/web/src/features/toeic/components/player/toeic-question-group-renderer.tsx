'use client';

import React, { useRef, useState, useEffect } from 'react';
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
  transcript?: string;
  options?: string[];
}

export interface ToeicQuestionGroupRendererProps {
  questions: ToeicQuestionData[];
  userAnswers: Record<string, string>;
  onSelectOption: (questionId: string, option: string) => void;
  onNextGroup?: () => void;
  onPrevGroup?: () => void;
  isFirstGroup: boolean;
  isLastGroup: boolean;
}

export const ToeicQuestionGroupRenderer = ({
  questions,
  userAnswers,
  onSelectOption,
  onNextGroup,
  onPrevGroup,
  isFirstGroup,
  isLastGroup,
}: ToeicQuestionGroupRendererProps) => {
  const t = useTranslations('ToeicTestPlayer');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Use the first question to determine context (audio, image, transcript)
  const contextQuestion = questions[0];

  useEffect(() => {
    // Reset audio when context changes
    setIsPlaying(false);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [contextQuestion?.id]);

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

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      if (duration > 0) {
        setProgress((currentTime / duration) * 100);
      }
    }
  };

  const renderAudioPlayer = () => {
    if (!contextQuestion?.audioUrl) return null;
    return (
      <div className="mb-6 rounded-xl border bg-slate-50 p-4 dark:bg-slate-900 shadow-sm">
        <audio
          ref={audioRef}
          src={contextQuestion.audioUrl}
          onEnded={() => {
            setIsPlaying(false);
            setProgress(100);
          }}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onTimeUpdate={handleTimeUpdate}
          className="hidden"
        />
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full shadow-sm shrink-0"
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
                className="h-full bg-primary transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
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

  const renderQuestionOptions = (question: ToeicQuestionData) => (
    <div className="space-y-3">
      {(question.options || []).map((option, index) => {
        const letter = String.fromCharCode(65 + index);
        const isSelected = userAnswers[question.id] === option;

        return (
          <Button
            key={index}
            variant="outline"
            onClick={() => onSelectOption(question.id, option)}
            className={cn(
              'flex w-full h-auto min-h-[44px] items-center justify-start gap-4 rounded-xl p-4 text-left font-normal transition-all hover:bg-slate-50 dark:hover:bg-slate-900 whitespace-normal',
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
          </Button>
        );
      })}
    </div>
  );

  if (!contextQuestion) return null;

  const isListening = contextQuestion.part <= 4;
  const hasReadingPassage = contextQuestion.part >= 6 && contextQuestion.transcript;
  const hasContext = contextQuestion.imageUrl || hasReadingPassage || isListening;

  return (
    <Card className="overflow-hidden border-none shadow-none bg-transparent flex flex-col h-full">
      <div
        className={cn(
          'flex flex-col gap-6 flex-1',
          hasContext && (hasReadingPassage || questions.length > 1) ? 'lg:flex-row' : '',
        )}
      >
        {/* Left Side: Context (Image / Audio / Passage) */}
        {hasContext && (
          <div
            className={cn(
              'space-y-6',
              hasContext && (hasReadingPassage || questions.length > 1) ? 'lg:w-1/2' : 'w-full',
            )}
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                {t('part')} {contextQuestion.part}
              </span>
            </div>

            {contextQuestion.imageUrl && (
              <div className="relative w-full max-w-xl mx-auto h-64 md:h-96 overflow-hidden rounded-xl shadow-md bg-white">
                <Image
                  src={contextQuestion.imageUrl}
                  alt="Question Context"
                  fill
                  className="object-contain"
                />
              </div>
            )}

            {renderAudioPlayer()}

            {hasReadingPassage && (
              <div className="prose dark:prose-invert max-w-none rounded-xl border bg-card p-6 shadow-sm overflow-y-auto max-h-[60vh]">
                <div className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                  {contextQuestion.transcript}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Side: Questions & Options */}
        <div
          className={cn(
            'flex-1 flex flex-col',
            hasContext && (hasReadingPassage || questions.length > 1) ? 'lg:w-1/2 h-[calc(100vh-16rem)] overflow-y-auto pr-2 pb-10' : 'max-w-3xl mx-auto w-full pb-10',
          )}
        >
          <div className="space-y-8 flex-1">
            {questions.map((question) => (
              <div key={question.id} className="space-y-4 bg-card p-6 rounded-2xl border shadow-sm">
                <h3 className="text-xl font-medium flex gap-2">
                  <span className="text-muted-foreground shrink-0">
                    {question.questionNumber}.
                  </span>
                  <span>
                    {question.questionText ? question.questionText : t('listenAndChoose')}
                  </span>
                </h3>

                {renderQuestionOptions(question)}
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-8 pt-4 border-t">
            <Button
              variant="outline"
              disabled={isFirstGroup}
              onClick={onPrevGroup}
              className="w-32"
            >
              <Icons name="arrow-left" className="mr-2 h-4 w-4" />
              {t('previousGroup')}
            </Button>
            <Button
              variant="default"
              disabled={isLastGroup}
              onClick={onNextGroup}
              className="w-32"
            >
              {t('nextGroup')}
              <Icons name="arrow-right" className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
