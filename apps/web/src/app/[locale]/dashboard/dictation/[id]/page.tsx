import React from 'react';
import { DictationPlayer } from '@/features/dictation/components/dictation-player';
import { Icons } from '@lumen/uikit/icons';
import Link from 'next/link';

export default function DictationExercisePage({ params }: { params: { id: string } }) {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/dashboard/dictation" className="text-muted-foreground hover:text-primary transition-colors">
          &larr; Back to List
        </Link>
      </div>
      <DictationPlayer materialId={params.id} />
    </div>
  );
}
