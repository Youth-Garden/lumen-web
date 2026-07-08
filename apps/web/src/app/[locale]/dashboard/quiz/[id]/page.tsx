import React, { use } from 'react';
import { QuizDetail } from '@/features/quiz/pages/quiz-detail';

export default function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <QuizDetail id={id} />;
}
