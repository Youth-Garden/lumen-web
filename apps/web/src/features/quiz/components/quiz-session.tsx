import React, { useState, useMemo } from 'react';
import { Button, Card, CardContent } from '@lumen/uikit/components';
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
    const idx = quiz.questions.findIndex((q) => !q.userAnswer);
    return idx === -1 ? quiz.questions.length - 1 : idx;
  });

  const question = quiz.questions[currentQuestionIndex];
  const allAnswered = useMemo(() => quiz.questions.every((q) => q.userAnswer), [quiz.questions]);

  const handleSelectOption = (answer: string) => {
    if (question.userAnswer) return; // already answered
    submitAnswer({ id: quiz.id, questionId: question.id, dto: { answer } }, {
      onSuccess: () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
          setTimeout(() => setCurrentQuestionIndex((prev) => prev + 1), 500);
        }
      }
    });
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
              
              let buttonVariant: "default" | "outline" | "secondary" = "outline";
              let extraClasses = "h-16 text-lg border-2";

              if (isAnswered) {
                if (isSelected) {
                  // If we don't know correct answer yet, just highlight
                  buttonVariant = "default";
                }
                extraClasses += " opacity-70 cursor-not-allowed";
              } else {
                extraClasses += " hover:border-primary hover:bg-primary/5 transition-all";
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
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
