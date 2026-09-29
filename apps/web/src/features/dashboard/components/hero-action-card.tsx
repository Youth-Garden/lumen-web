'use client';

import { RouteEnum } from '@/shared/constants';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

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
      <Card className="h-full flex flex-col justify-between">
        <CardHeader className="px-5 pt-3.5 pb-0">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4.5 w-32 rounded-md" />
            <Skeleton className="h-5.5 w-16 rounded-full shrink-0" />
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-3.5 pt-1.5 flex-1 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-baseline gap-1.5">
                <Skeleton className="h-8 w-10 rounded-md" />
                <Skeleton className="h-3.5 w-16 rounded" />
              </div>
              <Skeleton className="h-3 w-24 rounded" />
            </div>
            <Skeleton className="h-7 w-20 rounded-xl shrink-0" />
          </div>

          <Skeleton className="w-full h-9 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  const hasDueCards = dueCount > 0;

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader className="px-5 pt-3.5 pb-0">
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-bold font-heading text-foreground">
              {hasDueCards ? t('dueTodayCount') : t('allCaughtUp')}
            </CardTitle>
          </div>

          <Badge variant={hasDueCards ? 'warning' : 'success'} size="sm">
            {hasDueCards ? `${dueCount} ${t('cards')}` : '0 ' + t('cards')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-3.5 pt-1.5 flex-1 flex flex-col justify-between gap-2">
        {/* Core Metric Display */}
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-heading font-black tracking-tight text-foreground">
                {dueCount}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                /{totalLearnedWords}{' '}
                {t('totalWordsCount', { count: '' }).trim()}
              </span>
            </div>
            <p className="text-[11px] font-medium text-muted-foreground">
              {hasDueCards ? t('needReviewPrompt') : t('allDonePrompt')}
            </p>
          </div>

          <Card
            variant="muted"
            size="sm"
            className="flex-row items-center gap-1.5 px-3 py-1.5 shrink-0"
          >
            <Icons name="book-open" className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] font-bold text-foreground">
              {t('totalWordsCount', { count: totalLearnedWords })}
            </span>
          </Card>
        </div>

        {/* Action Button at the bottom */}
        <Button
          variant={hasDueCards ? 'default' : 'secondary'}
          size="sm"
          onClick={() => router.push(RouteEnum.VOCABULARY)}
          className="w-full font-bold h-9"
        >
          {hasDueCards ? (
            <>
              <Icons name="play" className="h-3.5 w-3.5 fill-current mr-1.5" />
              <span>{t('startReview', { count: dueCount })}</span>
            </>
          ) : (
            <>
              <Icons name="book-open" className="h-3.5 w-3.5 mr-1.5" />
              <span>{t('exploreNewWords')}</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
