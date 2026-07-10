'use client';

import React from 'react';
import { useQuizDetail } from '../hooks';
import { QuizSession } from '../components/quiz-session';
import { QuizResults } from '../components/quiz-results';
import { QuizStatus } from '@/services/quiz';

import { useParams } from 'next/navigation';

export const QuizDetailPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = params.id as string;
  const { data: quiz, isLoading } = useQuizDetail(id);

  if (!id) return null;

  if (isLoading) return <div>Loading quiz...</div>;
  if (!quiz) return <div>Quiz not found.</div>;

  if (quiz.status === QuizStatus.COMPLETED) {
    return <QuizResults quiz={quiz} />;
  }

  return <QuizSession quiz={quiz} />;
};
