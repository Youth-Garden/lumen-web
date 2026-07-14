'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Button, Card } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';
import { useTranslations } from 'next-intl';
import { ToeicQuestionDto } from '@/services/toeic';

export interface ToeicQuestionGroupRendererProps {
  questions: ToeicQuestionDto[];
  userAnswers: Record<string, string>;
  flaggedQuestions: Set<string>;
  isReviewMode?: boolean;
  onSelectOption: (questionId: string, option: string) => void;
  onToggleFlag: (questionId: string) => void;
  onNextGroup?: () => void;
  onPrevGroup?: () => void;
  isFirstGroup: boolean;
  isLastGroup: boolean;
}

export const ToeicQuestionGroupRenderer = ({
  questions,
  userAnswers,
  flaggedQuestions,
  isReviewMode = false,
  onSelectOption,
  onToggleFlag,
  onNextGroup,
  onPrevGroup,
  isFirstGroup,
  isLastGroup,
}: ToeicQuestionGroupRendererProps) => {
  const t = useTranslations('ToeicTestPlayer');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
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
      audioRef.current.playbackRate = playbackRate;
    }
  }, [contextQuestion?.id]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.playbackRate = playbackRate;
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

          <div className="flex items-center gap-2 border-l pl-4 dark:border-slate-800 shrink-0">
            <span className="text-[11px] font-semibold text-muted-foreground">Speed</span>
            <select
              value={playbackRate}
              onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
              className="rounded bg-background border px-1.5 py-1 text-xs font-semibold focus:outline-none dark:border-slate-800 cursor-pointer"
            >
              <option value="0.75">0.75x</option>
              <option value="1.0">1.0x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  const renderQuestionOptions = (question: ToeicQuestionDto) => (
    <div className="space-y-3">
      {(question.options || []).map((option, index) => {
        const letter = String.fromCharCode(65 + index);
        const isSelected = userAnswers[question.id] === option;
        const isCorrect = isReviewMode && question.correctAnswer === option;
        const isWrong = isReviewMode && isSelected && question.correctAnswer !== option;

        return (
          <Button
            key={index}
            variant="outline"
            className={cn(
              'h-auto min-h-[3rem] px-4 py-3 justify-start text-left whitespace-normal font-normal',
              isSelected && !isReviewMode && 'border-primary bg-primary/5 text-primary',
              isCorrect && 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400',
              isWrong && 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-400',
            )}
            disabled={isReviewMode}
            onClick={() => {
              if (!isReviewMode) onSelectOption(question.id, option);
            }}
          >
            <span className="font-semibold mr-3 shrink-0">
              {letter}.
            </span>
            <span>{option}</span>
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
              <div key={question.id} className="space-y-4 bg-card p-6 rounded-2xl border shadow-sm relative">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-medium flex gap-2">
                    <span className="text-muted-foreground shrink-0">
                      {question.questionNumber}.
                    </span>
                    <span>
                      {question.questionText ? question.questionText : t('listenAndChoose')}
                    </span>
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleFlag(question.id)}
                    className={cn(
                      'shrink-0 h-8 w-8',
                      flaggedQuestions.has(question.id)
                        ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                    title={t('flagForReview')}
                  >
                    <Icons name="flag" className={cn('h-4 w-4', flaggedQuestions.has(question.id) && 'fill-current')} />
                  </Button>
                </div>

                {renderQuestionOptions(question)}

                {isReviewMode && (question.explanation || question.transcript || (question.mediaUrls && question.mediaUrls.length > 0)) && (
                  <div className="mt-4 p-4 rounded-xl bg-muted/50 text-sm space-y-3">
                    {question.transcript && (
                      <div>
                        <span className="font-semibold text-primary">{t('transcript')}:</span>
                        <p className="mt-1 text-muted-foreground whitespace-pre-wrap">{question.transcript}</p>
                      </div>
                    )}
                    {question.explanation && (
                      <div>
                        <span className="font-semibold text-primary">{t('explanation')}:</span>
                        <div
                          className="mt-1 text-muted-foreground leading-relaxed prose dark:prose-invert max-w-none text-sm"
                          dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(question.explanation) }}
                        />
                      </div>
                    )}
                    {question.mediaUrls && question.mediaUrls.length > 0 && (
                      <div className="pt-1">
                        <span className="font-semibold text-primary block mb-2">Explanatory Graphics:</span>
                        <div className="flex flex-wrap gap-3">
                          {question.mediaUrls.map((url, idx) => (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="relative inline-block rounded-lg overflow-hidden border bg-background hover:opacity-90 transition-opacity max-w-xs"
                            >
                              <img
                                src={url}
                                alt={`Explanation Media ${idx + 1}`}
                                className="max-h-40 object-contain mx-auto"
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
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

// Simple helper to parse basic markdown format into HTML safely
const renderMarkdownToHtml = (markdown: string): string => {
  if (!markdown) return '';
  let html = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic *text*
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Links [text](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">$1</a>');

  // Lists - item
  const lines = html.split('\n');
  let inList = false;
  const processedLines = lines.map((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      const content = trimmed.substring(2);
      if (!inList) {
        inList = true;
        return `<ul class="list-disc pl-5 space-y-1 my-2"><li>${content}</li>`;
      }
      return `<li>${content}</li>`;
    } else {
      if (inList) {
        inList = false;
        return `</ul>${line}`;
      }
      return line;
    }
  });
  
  if (inList) {
    processedLines.push('</ul>');
  }

  return processedLines.join('<br />');
};

