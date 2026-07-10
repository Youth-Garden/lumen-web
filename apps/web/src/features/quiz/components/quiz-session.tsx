'use client';

import React, { useState, useMemo } from 'react';
import { Button, Card, CardContent } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useSubmitAnswer, useFinishQuiz } from '../hooks';
import type { QuizDetailResponseDto, QuestionDetailDto } from '@/services/quiz';

interface QuizSessionProps {
  quiz: QuizDetailResponseDto;
}

export const QuizSession: React.FC<QuizSessionProps> = ({ quiz }) => {
  const { mutate: submitAnswer, isPending: isSubmitting } = useSubmitAnswer();
  const { mutate: finishQuiz, isPending: isFinishing } = useFinishQuiz();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    // Find the first unanswered question
    const idx = quiz.questions.findIndex(
      (questionItem) => !questionItem.userAnswer,
    );
    return idx === -1 ? quiz.questions.length - 1 : idx;
  });

  const question = quiz.questions[currentQuestionIndex];
  const allAnswered = useMemo(
    () => quiz.questions.every((questionItem) => questionItem.userAnswer),
    [quiz.questions],
  );

  const handleSelectOption = (answer: string) => {
    if (question.userAnswer) return; // already answered
    submitAnswer(
      { id: quiz.id, questionId: question.id, dto: { answer } },
      {
        onSuccess: () => {
          if (currentQuestionIndex < quiz.questions.length - 1) {
            setTimeout(() => setCurrentQuestionIndex((prev) => prev + 1), 500);
          }
        },
      },
    );
  };

  const handleFinish = () => {
    finishQuiz(quiz.id);
  };

  if (!question) return null;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-muted-foreground">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </span>
        {allAnswered && (
          <Button onClick={handleFinish} disabled={isFinishing}>
            Finish Quiz
          </Button>
        )}
      </div>

      <Card className="min-h-[400px] flex flex-col justify-center border-2 border-primary/20">
        <CardContent className="p-8 text-center flex flex-col gap-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {question.questionText}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {question.options?.map((option, idx) => {
              const isSelected = question.userAnswer === option;
              const isAnswered = !!question.userAnswer;

              const buttonVariant: 'default' | 'outline' | 'secondary' =
                'outline';
              let extraClasses =
                'h-16 text-lg border-2 relative overflow-hidden transition-all duration-300';

              if (isAnswered) {
                if (isSelected) {
                  if (question.isCorrect) {
                    extraClasses +=
                      ' border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:border-green-500/50 dark:text-green-400';
                  } else {
                    extraClasses +=
                      ' border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:border-red-500/50 dark:text-red-400';
                  }
                } else if (option === question.correctAnswer) {
                  extraClasses +=
                    ' border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:border-green-500/50 dark:text-green-400';
                } else {
                  extraClasses += ' opacity-50 cursor-not-allowed';
                }
              } else {
                extraClasses += ' hover:border-primary hover:bg-primary/5';
              }

              return (
                <Button
                  key={idx}
                  variant={buttonVariant}
                  className={extraClasses}
                  onClick={() => handleSelectOption(option)}
                  disabled={isSubmitting || isAnswered}
                >
                  {option}
                  {isAnswered && isSelected && question.isCorrect && (
                    <span className="absolute right-4 text-green-600 dark:text-green-400">
                      <Icons
                        name="check-circle"
                        size={24}
                        className="w-6 h-6"
                      />
                    </span>
                  )}
                  {isAnswered && isSelected && !question.isCorrect && (
                    <span className="absolute right-4 text-red-600 dark:text-red-400">
                      <Icons
                        name="close-circle"
                        size={24}
                        className="w-6 h-6"
                      />
                    </span>
                  )}
                  {isAnswered &&
                    !isSelected &&
                    option === question.correctAnswer && (
                      <span className="absolute right-4 text-green-600 dark:text-green-400">
                        <Icons
                          name="check-circle"
                          size={24}
                          className="w-6 h-6"
                        />
                      </span>
                    )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
