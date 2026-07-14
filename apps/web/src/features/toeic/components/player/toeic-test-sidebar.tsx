'use client';

import React, { useState, useEffect } from 'react';
import { useWindowSize } from '@lumen/hooks';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Button,
  ScrollArea,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';
import { useTranslations } from 'next-intl';

interface ToeicQuestionStatus {
  id: string;
  questionNumber: number;
  part: number;
}

interface ToeicTestSidebarProps {
  questions: ToeicQuestionStatus[];
  answers: Record<string, string>;
  flaggedQuestions: Set<string>;
  currentQuestionIndices: number[];
  isReviewMode?: boolean;
  onNavigate: (index: number) => void;
}

export const ToeicTestSidebar = ({
  questions,
  answers,
  flaggedQuestions,
  currentQuestionIndices,
  isReviewMode = false,
  onNavigate,
}: ToeicTestSidebarProps) => {
  const t = useTranslations('ToeicTestPlayer');
  const { width } = useWindowSize();
  const isDesktop = width ? width >= 1024 : true;
  const [open, setOpen] = useState(false);

  // Group questions by part
  const parts = Array.from({ length: 7 }, (_, i) => i + 1);

  const getQuestionStyle = (q: any, index: number) => {
    const isCurrent = currentQuestionIndices.includes(index);
    if (isCurrent) {
      return 'border-primary bg-primary text-primary-foreground hover:bg-primary/90';
    }

    if (isReviewMode) {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      const hasAnswered = !!userAnswer;

      if (!hasAnswered) {
        return 'border-slate-200 bg-slate-100/50 text-slate-500 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-500';
      }
      if (isCorrect) {
        return 'border-green-300 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-400';
      }
      return 'border-red-300 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400';
    }

    // Normal Test mode
    if (answers[q.id]) {
      return 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300';
    }
    return 'bg-card text-card-foreground';
  };

  const SidebarContent = () => (
    <ScrollArea className="h-full w-full">
      <div className="space-y-8 p-4">
        {parts.map((part) => {
          const partQuestions = questions.filter((q) => q.part === part);
          if (partQuestions.length === 0) return null;

          return (
            <div key={`part-${part}`} className="space-y-3">
              <h3 className="font-semibold text-muted-foreground">
                {t('part')} {part}
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {partQuestions.map((q) => {
                  const index = questions.findIndex((xq) => xq.id === q.id);
                  const styleClasses = getQuestionStyle(q, index);

                  return (
                    <div key={q.id} className="relative">
                      <Button
                        variant="outline"
                        onClick={() => {
                          onNavigate(index);
                          if (!isDesktop) setOpen(false);
                        }}
                        className={cn(
                          'flex h-10 w-full p-0 items-center justify-center rounded-md border text-sm font-medium transition-colors hover:bg-muted',
                          styleClasses,
                        )}
                      >
                        {q.questionNumber}
                      </Button>
                      {flaggedQuestions.has(q.id) && (
                        <div className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 shadow-sm border-2 border-background">
                          <Icons name="flag" className="h-2 w-2 text-white fill-current" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );

  if (isDesktop) {
    return (
      <div className="hidden lg:block w-80 shrink-0 border-l bg-card h-[calc(100vh-64px)] sticky top-16">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">{t('questionNavigation')}</h2>
          {isReviewMode ? (
            <div className="mt-4 flex flex-wrap gap-2 text-[10px] text-muted-foreground font-semibold">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded border border-green-300 bg-green-50 dark:border-green-900/50 dark:bg-green-950/20" />
                <span>Correct</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded border border-red-300 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20" />
                <span>Incorrect</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded border border-slate-200 bg-slate-100/50 dark:border-slate-800 dark:bg-slate-900/30" />
                <span>Skipped</span>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-sm border bg-card" />
                <span>{t('unanswered')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-sm border border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950/50" />
                <span>{t('answered')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-sm border border-primary bg-primary" />
                <span>{t('current')}</span>
              </div>
            </div>
          )}
        </div>
        <div className="h-[calc(100%-120px)]">
          <SidebarContent />
        </div>
      </div>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl lg:hidden z-50"
          />
        }
      >
        <Icons name="layout-dashboard" className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] p-0 sm:w-[380px]">
        <SheetHeader className="border-b p-4 text-left">
          <SheetTitle>{t('questionNavigation')}</SheetTitle>
        </SheetHeader>
        <div className="h-[calc(100vh-80px)]">
          <SidebarContent />
        </div>
      </SheetContent>
    </Sheet>
  );
};
