'use client';

import { Button, Card } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';

interface ToeicTestIntroProps {
  title: string;
  questionCount: number;
  isStarting: boolean;
  onStart: () => void;
}

export const ToeicTestIntro = ({
  title,
  questionCount,
  isStarting,
  onStart,
}: ToeicTestIntroProps) => {
  const t = useTranslations('ToeicTestPlayer');

  return (
    <Card className="mx-auto max-w-2xl p-8 text-center shadow-lg border-none">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-muted-foreground mb-8 text-lg">
        {t('questionsCount', { count: questionCount })}
      </p>
      <Button
        size="lg"
        className="rounded-full px-8"
        disabled={isStarting}
        onClick={onStart}
      >
        {isStarting ? (
          <Icons name="loader-2" className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Icons name="play" className="mr-2 h-5 w-5" />
        )}
        {t('startTest')}
      </Button>
    </Card>
  );
};
