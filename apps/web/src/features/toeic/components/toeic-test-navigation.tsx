'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  buttonVariants,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';
import { useTranslations } from 'next-intl';

interface ToeicTestNavigationProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  questions: Array<{ id: string; part: number }>;
  onNavigate: (index: number) => void;
}

export const ToeicTestNavigation = ({
  totalQuestions,
  currentQuestionIndex,
  answers,
  questions,
  onNavigate,
}: ToeicTestNavigationProps) => {
  const t = useTranslations('ToeicTestPlayer');

  return (
    <Popover>
      <PopoverTrigger
        className={buttonVariants({ variant: 'outline', className: 'gap-2' })}
      >
        <Icons name="list" className="h-4 w-4" />
        {t('question')} {currentQuestionIndex + 1} {t('of')} {totalQuestions}
        <Icons name="chevron-down" className="h-4 w-4 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="mb-3 font-medium text-sm">
          {t('questionNavigation')}
        </div>
        <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto pr-2">
          {questions.map((q, idx) => {
            const isAnswered = !!answers[q.id];
            const isCurrent = idx === currentQuestionIndex;

            return (
              <Button
                key={q.id}
                variant={
                  isCurrent ? 'default' : isAnswered ? 'outline' : 'ghost'
                }
                size="sm"
                onClick={() => onNavigate(idx)}
                className={cn(
                  'h-10 w-10 p-0',
                  isAnswered &&
                    !isCurrent &&
                    'border-indigo-500 text-indigo-700 bg-indigo-50 dark:bg-indigo-950/50',
                  !isAnswered && !isCurrent && 'bg-slate-100 dark:bg-slate-800',
                )}
              >
                {idx + 1}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
