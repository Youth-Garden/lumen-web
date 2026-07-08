import React from 'react';
import { Card, CardContent, Button } from '@lumen/uikit/components';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { QuizDetailResponseDto } from '@/services/quiz';
import { useRouter } from 'next/navigation';
import { RouteEnum } from '@/shared/constants';

interface QuizResultsProps {
  quiz: QuizDetailResponseDto;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ quiz }) => {
  const router = useRouter();

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <Card className="border-2 border-primary overflow-hidden">
        <div className="bg-primary p-8 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
          <div className="text-6xl font-black">{quiz.score.toFixed(0)}%</div>
        </div>
        <CardContent className="p-8">
          <div className="space-y-6">
            {quiz.questions.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-lg border bg-card flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-semibold text-lg">{idx + 1}. {q.questionText}</span>
                  {q.isCorrect ? (
                    <CheckCircle2 className="text-green-500 shrink-0 w-6 h-6" />
                  ) : (
                    <XCircle className="text-destructive shrink-0 w-6 h-6" />
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mt-2">
                  <div className="bg-muted/50 p-3 rounded">
                    <span className="text-sm text-muted-foreground block mb-1">Your Answer</span>
                    <span className={q.isCorrect ? "text-green-600 font-medium" : "text-destructive font-medium"}>
                      {q.userAnswer}
                    </span>
                  </div>
                  {!q.isCorrect && (
                    <div className="bg-green-500/10 p-3 rounded border border-green-500/20">
                      <span className="text-sm text-green-600/80 block mb-1">Correct Answer</span>
                      <span className="text-green-600 font-medium">
                        {q.correctAnswer}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button size="lg" onClick={() => router.push(RouteEnum.QUIZ)}>
              Back to Quizzes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
