'use client';

import { useToggle } from '@lumen/hooks';
import { useTranslations } from 'next-intl';
import { Button, Card } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';

export function SpacedRepetitionCard() {
  const t = useTranslations('Vocabulary.Folders');
  const [dismissed, , setDismissed] = useToggle(false);

  if (dismissed) return null;

  return (
    <Card className="relative rounded-3xl border-none bg-card p-5 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-black text-foreground">
          {t('studyLessTitle')}
        </h5>
        <Button
          variant="ghost"
          size="icon-xs"
          type="button"
          onClick={() => setDismissed(true)}
        >
          <Icons name="close" className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {t('studyLessDescription')}
      </p>
    </Card>
  );
}
