'use client';

import { Badge, Card, CardContent, Skeleton } from '@lumen/uikit/components';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface HeroStreakCardProps {
  streak: number;
  todayStudyMinutes: number;
  isLoading?: boolean;
}

export function HeroStreakCard({
  streak,
  todayStudyMinutes,
  isLoading = false,
}: HeroStreakCardProps) {
  const t = useTranslations('Dashboard.Overview');

  const isStudiedToday = todayStudyMinutes > 0;
  // Display streak is at least 1 if user studied today
  const displayStreak = isStudiedToday && streak === 0 ? 1 : streak;

  return (
    <Card className="bg-linear-to-br from-amber-400 via-amber-500 to-orange-600 text-white overflow-hidden relative group min-h-37 backdrop-blur-3xl">
      <div className="absolute -bottom-3 right-2 w-32 h-32 sm:w-36 sm:h-36 pointer-events-none select-none z-0">
        <Image
          src="/images/common/streak.png"
          alt="Streak Flame"
          width={180}
          height={180}
          priority
          className="w-full h-full object-contain"
        />
      </div>

      <CardContent className="px-5 py-3.5 flex flex-col justify-between h-full relative z-10">
        {/* Top-Left: Big Number & Label */}
        <div className="space-y-0.5">
          {isLoading ? (
            <Skeleton className="h-9 w-20 rounded-lg bg-white/30" />
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-white drop-shadow-xs leading-none">
                {displayStreak}
              </span>
            </div>
          )}

          <p className="text-xs sm:text-sm font-bold tracking-tight">
            {t('studyStreak')}
          </p>
        </div>

        {/* Bottom-Left: Status Badge */}
        <div className="pt-1.5">
          <Badge variant="subtle" size="sm" className="bg-white/20 text-white font-bold backdrop-blur-xs">
            {isStudiedToday
              ? t('streakActive').replace('🔥', '').trim()
              : t('streakInactive')}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
