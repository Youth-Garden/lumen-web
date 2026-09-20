'use client';

import { RouteEnum } from '@/shared/constants';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface HeroActionCardProps {
  dueCount: number;
  totalLearnedWords: number;
  isLoading?: boolean;
}

export function HeroActionCard({
  dueCount,
  totalLearnedWords,
  isLoading = false,
}: HeroActionCardProps) {
  const t = useTranslations('Dashboard.Overview');
  const router = useRouter();

  if (isLoading) {
    return (
      <Card className="rounded-3xl border-none bg-card shadow-xs p-5 space-y-4">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <Skeleton className="h-28 w-full rounded-2xl" />
      </Card>
    );
  }

  const hasDueCards = dueCount > 0;

  return (
    <Card className="rounded-3xl border-none bg-card shadow-xs overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="p-5 pb-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Icons name="sparkles" className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold font-heading text-foreground">
                {hasDueCards ? t('dueTodayCount') : t('allCaughtUp')}
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground">
                {hasDueCards ? t('needReviewPrompt') : t('allDonePrompt')}
              </CardDescription>
            </div>
          </div>

          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
              hasDueCards
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {hasDueCards ? `${dueCount} ${t('cards')}` : '0 ' + t('cards')}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 flex-1 flex flex-col justify-between gap-3">
        {/* Core Metric Display */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-heading font-black tracking-tight text-foreground">
                {dueCount}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                /{totalLearnedWords} {t('totalWordsCount', { count: '' }).trim()}
              </span>
            </div>
            <p className="text-[11px] font-medium text-muted-foreground">
              {hasDueCards ? t('needReviewPrompt') : t('allDonePrompt')}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-muted/30 px-3 py-1.5 rounded-2xl shrink-0">
            <Icons name="book-open" className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] font-bold text-foreground">
              {t('totalWordsCount', { count: totalLearnedWords })}
            </span>
          </div>
        </div>

        {/* Action Button at the bottom */}
        <Button
          variant={hasDueCards ? 'default' : 'secondary'}
          size="default"
          onClick={() => router.push(RouteEnum.VOCABULARY)}
          className="w-full font-bold shadow-xs cursor-pointer"
        >
          {hasDueCards ? (
            <>
              <Icons name="play" className="h-4 w-4 mr-2" />
              <span>{t('startReview', { count: dueCount })}</span>
            </>
          ) : (
            <>
              <Icons name="book-open" className="h-4 w-4 mr-2" />
              <span>{t('exploreNewWords')}</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
