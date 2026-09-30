'use client';

import { ErrorView } from '@/shared/components/error-view';

export interface LocalizedErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LocalizedError({ reset }: LocalizedErrorProps) {
  return <ErrorView onReset={reset} />;
}
