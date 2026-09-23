'use client';

import { useToggle } from '@lumen/hooks';
import { useTranslations } from 'next-intl';
import { Card, IconButton } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';

export function SpacedRepetitionCard() {
  const t = useTranslations('Vocabulary.Folders');
  const [dismissed, , setDismissed] = useToggle(false);

  if (dismissed) return null;

  return (
    <Card className="relative p-5 space-y-2">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-black text-foreground">
          {t('studyLessTitle')}
        </h5>
        <IconButton type="button" onClick={() => setDismissed(true)}>
          <Icons name="close" className="h-4 w-4" />
        </IconButton>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {t('studyLessDescription')}
      </p>
    </Card>
  );
}
