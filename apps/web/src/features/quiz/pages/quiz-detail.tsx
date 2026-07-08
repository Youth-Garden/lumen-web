import React from 'react';
import { useQuizDetailQuery } from '../hooks';
import { QuizSession } from '../components/quiz-session';
import { QuizResults } from '../components/quiz-results';
import { QuizStatus } from '@/services/quiz';

interface QuizDetailProps {
  id: string;
}

export const QuizDetail: React.FC<QuizDetailProps> = ({ id }) => {
  const { data: quiz, isLoading } = useQuizDetailQuery(id);

  if (isLoading) return <div>Loading quiz...</div>;
  if (!quiz) return <div>Quiz not found.</div>;

  if (quiz.status === QuizStatus.COMPLETED) {
    return <QuizResults quiz={quiz} />;
  }

  return <QuizSession quiz={quiz} />;
};
