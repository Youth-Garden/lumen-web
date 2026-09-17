'use client';

import { useTranslations } from 'next-intl';

import { Button, Card } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useToggle } from '@lumen/hooks';

export function NotificationPromptCard() {
  const t = useTranslations('Vocabulary.Folders');
  const [isEnabled, toggleEnabled] = useToggle(false);
  const [isDismissed, , setIsDismissed] = useToggle(false);

  if (isDismissed) return null;

  return (
    <Card className="rounded-3xl border-none bg-card p-5 shadow-sm space-y-3.5 relative overflow-hidden">
      <div className="flex items-start gap-3.5">
        <div className="h-10 w-10 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
          <Icons name="bell" className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-foreground leading-relaxed">
            {t('notificationPromptDesc')}
          </p>
        </div>
      </div>

      <Button
        size="sm"
        variant={isEnabled ? 'ghost' : 'default'}
        onClick={toggleEnabled}
        className="w-full text-xs font-bold h-9 cursor-pointer"
      >
        {isEnabled ? t('notificationEnabled') : t('notificationEnableAction')}
      </Button>
    </Card>
  );
}
