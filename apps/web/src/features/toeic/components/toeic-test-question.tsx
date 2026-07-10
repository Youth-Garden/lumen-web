'use client';

import Image from 'next/image';
import {
  Card,
  Button,
  Form,
  FormField,
  FormItem,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { useState } from 'react';

export interface ToeicQuestionData {
  id: string;
  part: number;
  questionNumber: number;
  questionText?: string;
  imageUrl?: string;
  audioUrl?: string;
  options: string[];
}

interface ToeicTestQuestionProps {
  question: ToeicQuestionData;
  form: UseFormReturn<{ answers: Record<string, string> }>;
  onSelectOption: (option: string) => void;
}

export const ToeicTestQuestion = ({
  question,
  form,
  onSelectOption,
}: ToeicTestQuestionProps) => {
  const t = useTranslations('ToeicTestPlayer');
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <div className="flex flex-col md:flex-row">
        <div className="bg-slate-50 p-6 dark:bg-slate-950 md:w-1/2">
          <div className="mb-4 flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
              {t('part')} {question.part}
            </span>
            <Button variant="ghost" size="sm" className="text-slate-500">
              <Icons name="flag" className="mr-2 h-4 w-4" />{' '}
              {t('flagForReview')}
            </Button>
          </div>

          {question.imageUrl && (
            <div className="mb-6 overflow-hidden rounded-xl shadow-md relative w-full h-64">
              <Image
                src={question.imageUrl}
                alt="Question Context"
                fill
                className="object-contain"
              />
            </div>
          )}

          {question.audioUrl && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-2 text-sm font-medium text-slate-500">
                {t('audioTrack')}
              </div>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio
                controls
                className="w-full"
                src={question.audioUrl}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          )}
        </div>

        <div className="p-6 md:w-1/2 md:p-8">
          {question.questionText ? (
            <h3 className="mb-6 text-lg font-medium leading-relaxed text-slate-800 dark:text-slate-200">
              {question.questionNumber}. {question.questionText}
            </h3>
          ) : (
            <h3 className="mb-6 text-lg font-medium text-slate-500">
              {question.questionNumber}. {t('listenInstruction')}
            </h3>
          )}

          <Form {...form}>
            <form className="space-y-3">
              <FormField
                control={form.control}
                name={`answers.${question.id}`}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = field.value === option;
                      return (
                        <Button
                          type="button"
                          key={option}
                          variant="outline"
                          onClick={() => onSelectOption(option)}
                          className={cn(
                            'flex w-full items-center justify-start h-auto p-4 text-left whitespace-normal rounded-xl border transition-all duration-200',
                            isSelected
                              ? 'border-indigo-500 bg-indigo-50 shadow-sm dark:border-indigo-400 dark:bg-indigo-950/50'
                              : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/50',
                          )}
                        >
                          <div
                            className={cn(
                              'mr-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors',
                              isSelected
                                ? 'border-indigo-500 bg-indigo-500 text-white'
                                : 'border-slate-300 text-slate-500 dark:border-slate-600',
                            )}
                          >
                            {String.fromCharCode(65 + optionIndex)}
                          </div>
                          <span
                            className={cn(
                              'text-base',
                              isSelected
                                ? 'font-medium text-indigo-900 dark:text-indigo-100'
                                : '',
                            )}
                          >
                            {option}
                          </span>
                          {isSelected && (
                            <Icons
                              name="check-circle"
                              className="ml-auto h-5 w-5 text-indigo-500"
                            />
                          )}
                        </Button>
                      );
                    })}
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </Card>
  );
};
