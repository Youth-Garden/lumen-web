'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';
import type { GrammarExerciseDto } from '@/services/grammar';
import { useSubmitExercise } from '../hooks/use-grammar';

interface GrammarExerciseProps {
  exercise: GrammarExerciseDto;
  onSuccess?: () => void;
}

export const GrammarExercise = ({ exercise, onSuccess }: GrammarExerciseProps) => {
  const t = useTranslations('Grammar');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<{ isCorrect: boolean; explanation: string; correctAnswer: string } | null>(null);

  const { mutate: submitExercise, isPending } = useSubmitExercise(exercise.id);

  const handleSubmit = () => {
    if (!selectedOption) return;

    submitExercise(
      { answer: selectedOption },
      {
        onSuccess: (data) => {
          setIsSubmitted(true);
          setResult(data);
          if (data.isCorrect && onSuccess) {
            // Optional: Auto-advance after a delay
            setTimeout(onSuccess, 2000);
          }
        },
      }
    );
  };

  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm">
      <h4 className="text-lg font-medium mb-6 leading-relaxed">
        {exercise.questionText}
      </h4>

      <div className="space-y-3 mb-6">
        {exercise.options.map((option, index) => {
          const isSelected = selectedOption === option;
          let optionClass = 'border-border hover:border-primary/50 hover:bg-primary/5';

          if (isSubmitted && result) {
            if (option === result.correctAnswer) {
              optionClass = 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400';
            } else if (isSelected && !result.isCorrect) {
              optionClass = 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400';
            } else {
              optionClass = 'border-border opacity-50';
            }
          } else if (isSelected) {
            optionClass = 'border-primary bg-primary/10 text-primary ring-1 ring-primary';
          }

          return (
            <button
              key={index}
              disabled={isSubmitted || isPending}
              onClick={() => setSelectedOption(option)}
              className={cn(
                'w-full text-left px-4 py-3 rounded-xl border transition-all duration-200',
                optionClass
              )}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {isSubmitted && result && option === result.correctAnswer && (
                  <Icons name="check-circle" className="h-5 w-5 text-green-500" />
                )}
                {isSubmitted && result && isSelected && !result.isCorrect && (
                  <Icons name="x-circle" className="h-5 w-5 text-red-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {!isSubmitted ? (
        <Button
          className="w-full rounded-xl"
          disabled={!selectedOption || isPending}
          onClick={handleSubmit}
        >
          {isPending ? <Icons name="loader-2" className="h-4 w-4 animate-spin mr-2" /> : null}
          {t('submit')}
        </Button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={cn(
            'p-4 rounded-xl border',
            result?.isCorrect
              ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30'
              : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30'
          )}
        >
          <div className="flex items-start gap-3">
            <div className={cn(
              'mt-0.5',
              result?.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            )}>
              {result?.isCorrect ? <Icons name="check-circle" /> : <Icons name="x-circle" />}
            </div>
            <div>
              <h5 className={cn(
                'font-semibold mb-1',
                result?.isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
              )}>
                {result?.isCorrect ? t('correct') : t('incorrect')}
              </h5>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">{t('explanation')}: </span>
                {result?.explanation}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
