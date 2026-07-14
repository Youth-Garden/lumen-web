'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { ToeicTestPlayer } from '../components/toeic-test-player';

export default function ToeicTestPage() {
  const params = useParams<{ testId?: string; id?: string }>();
  const searchParams = useSearchParams();
  const testId = params.testId || params.id;
  const attemptId = searchParams.get('attemptId');
  const mode = searchParams.get('mode');

  if (!testId) return null;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <ToeicTestPlayer
        testId={testId}
        initialAttemptId={attemptId || undefined}
        isReviewMode={mode === 'review'}
      />
    </div>
  );
}
