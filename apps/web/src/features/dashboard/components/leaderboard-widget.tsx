'use client';

import { LeaderboardPeriodEnum } from '@/services/progress/progress.types';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useLeaderboard } from '../hooks/use-gamification';

export const LeaderboardWidget = () => {
  const t = useTranslations('Gamification');
  const [period, setPeriod] = useState<LeaderboardPeriodEnum>(
    LeaderboardPeriodEnum.ALL_TIME,
  );
  const { data, isLoading } = useLeaderboard(period);

  const topUsers = data?.topUsers ?? [];
  const currentUserRank = data?.currentUserRank;

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Icons name="trophy" className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground leading-none">
              {t('leaderboard')}
            </h3>
            {currentUserRank && (
              <span className="text-xs text-muted-foreground mt-1 inline-block">
                {t('yourRank')}: #{currentUserRank}
              </span>
            )}
          </div>
        </div>

        <div className="flex rounded-xl bg-muted p-1 gap-1 border">
          <Button
            size="sm"
            variant={
              period === LeaderboardPeriodEnum.WEEKLY ? 'default' : 'ghost'
            }
            className="h-8 px-3 text-xs rounded-lg font-medium"
            onClick={() => setPeriod(LeaderboardPeriodEnum.WEEKLY)}
          >
            {t('weekly')}
          </Button>
          <Button
            size="sm"
            variant={
              period === LeaderboardPeriodEnum.ALL_TIME ? 'default' : 'ghost'
            }
            className="h-8 px-3 text-xs rounded-lg font-medium"
            onClick={() => setPeriod(LeaderboardPeriodEnum.ALL_TIME)}
          >
            {t('allTime')}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Icons
            name="loader-2"
            className="h-6 w-6 animate-spin text-primary"
          />
        </div>
      ) : topUsers.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">
          No rankings available yet.
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1">
          {topUsers.map((user, indexItem) => {
            const rank = indexItem + 1;
            const isTop1 = rank === 1;
            const isTop2 = rank === 2;
            const isTop3 = rank === 3;

            return (
              <motion.div
                key={user.userId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: indexItem * 0.03 }}
                className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                  isTop1
                    ? 'bg-amber-500/5 border-amber-500/20'
                    : isTop2
                      ? 'bg-slate-400/5 border-slate-400/20'
                      : isTop3
                        ? 'bg-amber-700/5 border-amber-700/20'
                        : 'bg-card/50 border-border/60 hover:bg-muted/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-xs ${
                      isTop1
                        ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/40'
                        : isTop2
                          ? 'bg-slate-400 text-white shadow-sm'
                          : isTop3
                            ? 'bg-amber-700 text-white shadow-sm'
                            : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {rank}
                  </div>

                  <div>
                    <div className="font-semibold text-sm text-foreground line-clamp-1">
                      {user.fullName || `Learner ${user.userId.slice(0, 4)}`}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{t('daysStreak', { count: user.streak })}</span>
                    </div>
                  </div>
                </div>

                <div className="font-bold text-sm text-primary">
                  {user.totalPoints.toLocaleString()} XP
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
