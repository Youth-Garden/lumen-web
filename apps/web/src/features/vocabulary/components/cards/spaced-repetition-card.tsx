'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';

export function SpacedRepetitionCard() {
  const t = useTranslations('Vocabulary.Folders');
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <Card className="relative rounded-3xl border border-border/70 bg-card p-5 shadow-xs space-y-2">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-black text-foreground">
          {t('studyLessTitle')}
        </h5>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <Icons name="close" className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {t('studyLessDescription')}
      </p>
    </Card>
  );
}
