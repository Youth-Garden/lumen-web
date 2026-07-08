"use client";

import React from 'react';
import { useQuizzes, useGenerateQuiz } from '../hooks';
import { useTranslations } from 'next-intl';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@lumen/uikit/components';
import { RouteEnum } from '@/shared/constants';
import { useRouter } from 'next/navigation';

export const QuizList = () => {
  const t = useTranslations('quiz');
  const router = useRouter();
  const { data: quizzes, isLoading } = useQuizzes({ page: 1, limit: 10 });
  const { mutate: generateQuiz, isPending } = useGenerateQuiz();

  const handleStartQuiz = () => {
    generateQuiz({ limit: 10 }, {
      onSuccess: (data) => {
        router.push(RouteEnum.QUIZ + '/' + data.id);
      },
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('quizTitle', { fallback: 'Your Quizzes' })}
        </h1>
        <Button onClick={handleStartQuiz} disabled={isPending}>
          {t('startNewQuiz', { fallback: 'Start New Quiz' })}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quizzes?.items.map((quiz) => (
          <Card key={quiz.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => router.push(RouteEnum.QUIZ + '/' + quiz.id)}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quiz - {new Date(quiz.createdAt).toLocaleDateString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium">{quiz.status}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-muted-foreground">Score:</span>
                <span className="font-bold text-primary">{quiz.score.toFixed(0)}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {quizzes?.items.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            {t('noQuizzes', { fallback: 'No quizzes yet. Start one now!' })}
          </div>
        )}
      </div>
    </div>
  );
};
