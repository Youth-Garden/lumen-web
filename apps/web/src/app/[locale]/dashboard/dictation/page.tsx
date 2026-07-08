import React from 'react';
import { DictationList } from '@/features/dictation/components/dictation-list';
import { Headphones } from 'lucide-react';

export default function DictationPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Headphones className="w-8 h-8 text-primary" />
            Daily Dictation
          </h2>
          <p className="text-muted-foreground mt-2">
            Sharpen your listening skills by typing exactly what you hear.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <DictationList />
      </div>
    </div>
  );
}
