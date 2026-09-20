'use client';

import { Card, CardContent, Skeleton } from '@lumen/uikit/components';
import { useTranslations } from 'next-intl';

interface HeroStreakCardProps {
  streak: number;
  todayStudyMinutes: number;
  isLoading?: boolean;
}

const FLAME_PATH =
  'M 68 200 C 62 152 74 112 88 98 C 96 110 98 122 100 125 C 108 100 120 60 132 48 C 146 78 168 108 182 138 C 194 162 198 182 200 200 Z';

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
    <Card className="rounded-3xl border-none bg-linear-to-br from-amber-400 via-amber-500 to-orange-600 text-white shadow-xs overflow-hidden relative group min-h-[175px]">
      {/* High-fidelity Vector Flame Illustration with matching expanded contour layer */}
      <div className="absolute -bottom-1 -right-1 w-44 h-44 sm:w-52 sm:h-52 pointer-events-none select-none z-0">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full filter drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Layer 1: Expanded Yellow Contour matching the exact geometry of the flame */}
          <path
            d={FLAME_PATH}
            fill="#FEE440"
            stroke="#FEE440"
            strokeWidth="30"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.95"
          />

          {/* Layer 2: Main Vibrant Red-Orange Flame with Bold Crisp White Outline */}
          <path
            d={FLAME_PATH}
            fill="#FF4800"
            stroke="#FFFFFF"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Layer 3: Warm Golden Yellow Smile Arc */}
          <path
            d="M 98 168 C 118 186 156 182 178 145"
            stroke="#FFD000"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <CardContent className="p-5 flex flex-col justify-between h-full relative z-10">
        {/* Top-Left: Big Number & Label */}
        <div className="space-y-0.5">
          {isLoading ? (
            <Skeleton className="h-10 w-24 rounded-lg bg-white/30" />
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-white drop-shadow-xs leading-none">
                {displayStreak}
              </span>
            </div>
          )}

          <p className="text-sm font-bold text-white/90 tracking-tight">
            {t('studyStreak')}
          </p>
        </div>

        {/* Bottom-Left: Modern Status Pill (No icon, No border) */}
        <div className="pt-4">
          <div className="text-[11px] font-bold text-white bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full w-fit shadow-2xs">
            <span>
              {isStudiedToday
                ? t('streakActive').replace('🔥', '').trim()
                : t('streakInactive')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
