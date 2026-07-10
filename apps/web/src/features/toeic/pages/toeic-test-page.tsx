'use client';

import { useParams } from 'next/navigation';
import { ToeicTestPlayer } from '../components/toeic-test-player';

export default function ToeicTestPage() {
  const params = useParams<{ testId?: string; id?: string }>();
  const testId = params.testId || params.id;

  if (!testId) return null;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <ToeicTestPlayer testId={testId} />
    </div>
  );
}
