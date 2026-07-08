"use client";

import { useState } from 'react';
import { useGetToeicTestById } from '../hooks';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@lumen/uikit/components';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';

interface ToeicTestPlayerProps {
  testId: string;
}

export const ToeicTestPlayer = ({ testId }: ToeicTestPlayerProps) => {
  const { data: test, isLoading, isError } = useGetToeicTestById(testId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isPlaying, setIsPlaying] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Icons name="loader-2" className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !test) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-destructive">
        <p>Failed to load test data.</p>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const totalQuestions = test.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleSelectOption = (option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header / Progress */}
      <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{test.title}</h2>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          </div>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300 ease-in-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden border-none shadow-lg">
            <div className="flex flex-col md:flex-row">
              {/* Media Section (Left) */}
              <div className="bg-slate-50 p-6 dark:bg-slate-950 md:w-1/2">
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                    Part {currentQuestion.part}
                  </span>
                  <Button variant="ghost" size="sm" className="text-slate-500">
                    <Icons name="flag" className="mr-2 h-4 w-4" /> Flag for review
                  </Button>
                </div>

                {currentQuestion.imageUrl && (
                  <div className="mb-6 overflow-hidden rounded-xl shadow-md relative w-full h-64">
                    <Image
                      src={currentQuestion.imageUrl}
                      alt="Question Context"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}

                {currentQuestion.audioUrl && (
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-2 text-sm font-medium text-slate-500">Audio Track</div>
                    <audio
                      controls
                      className="w-full"
                      src={currentQuestion.audioUrl}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  </div>
                )}
              </div>

              {/* Question Section (Right) */}
              <div className="p-6 md:w-1/2 md:p-8">
                {currentQuestion.questionText && (
                  <h3 className="mb-6 text-lg font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                    {currentQuestion.questionNumber}. {currentQuestion.questionText}
                  </h3>
                )}
                
                {!currentQuestion.questionText && (
                  <h3 className="mb-6 text-lg font-medium text-slate-500">
                    {currentQuestion.questionNumber}. Listen to the audio and select the best response.
                  </h3>
                )}

                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = answers[currentQuestion.id] === option;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(option)}
                        className={cn(
                          "flex w-full items-center rounded-xl border p-4 text-left transition-all duration-200",
                          isSelected
                            ? "border-indigo-500 bg-indigo-50 shadow-sm dark:border-indigo-400 dark:bg-indigo-950/50"
                            : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/50"
                        )}
                      >
                        <div
                          className={cn(
                            "mr-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors",
                            isSelected
                              ? "border-indigo-500 bg-indigo-500 text-white"
                              : "border-slate-300 text-slate-500 dark:border-slate-600"
                          )}
                        >
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className={cn("text-base", isSelected ? "font-medium text-indigo-900 dark:text-indigo-100" : "")}>
                          {option}
                        </span>
                        {isSelected && (
                          <Icons name="check-circle" className="ml-auto h-5 w-5 text-indigo-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className="rounded-full px-6"
        >
          <Icons name="chevron-left" className="mr-2 h-4 w-4" /> Previous
        </Button>
        
        {currentQuestionIndex === totalQuestions - 1 ? (
          <Button size="lg" className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-8 text-white shadow-lg hover:from-green-600 hover:to-emerald-700">
            Submit Test <Icons name="check-circle" className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={nextQuestion}
            className="rounded-full bg-slate-900 px-8 text-white shadow-lg hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700"
          >
            Next <Icons name="chevron-right" className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
