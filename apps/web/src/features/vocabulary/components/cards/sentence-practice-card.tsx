'use client';

import { useTranslations } from 'next-intl';

import { Badge, Button, Card } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';

interface SentencePracticeCardProps {
  usedCount?: number;
  totalWords?: number;
  onClick?: () => void;
}

export function SentencePracticeCard({
  usedCount = 0,
  totalWords = 608,
  onClick,
}: SentencePracticeCardProps) {
  const t = useTranslations('Vocabulary.Folders');
  return (
    <Card className="p-5 space-y-3">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-foreground font-heading">
            {t('sentencePracticeTitle')}
          </h4>
          <Badge variant="default" size="sm">
            {t('comingSoonBadge')}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground">
          {t('sentencePracticeDesc', { used: usedCount, total: totalWords })}
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled
        onClick={onClick}
        className="w-full gap-2 font-bold cursor-not-allowed"
      >
        <Icons name="edit-3" className="h-3.5 w-3.5 text-primary" />
        <span>{t('sentencePracticeAction')}</span>
      </Button>
    </Card>
  );
}
