'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useBuyStreakFreeze } from '../hooks/use-gamification';

interface StreakCardProps {
  streak: number;
  streakFreezes: number;
  totalPoints: number;
}

export const StreakCard = ({
  streak,
  streakFreezes,
  totalPoints,
}: StreakCardProps) => {
  const t = useTranslations('Gamification');
  const { mutate: buyFreeze, isPending } = useBuyStreakFreeze();

  const handleBuyFreeze = () => {
    if (totalPoints >= 500) {
      buyFreeze();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm">
      {/* Background glow effect */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 3, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/20"
          >
            <Icons name="flame" className="h-9 w-9 fill-current" />
          </motion.div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold tracking-tight text-foreground">
                {t('daysStreak', { count: streak })}
              </h3>
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {t('streakActive')}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t('points', { xp: totalPoints })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l pt-4 sm:pt-0 sm:pl-6 border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Icons name="shield" className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                {t('freezeShields')}
              </div>
              <div className="text-lg font-bold text-foreground">
                {streakFreezes}
              </div>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="ml-auto sm:ml-2 rounded-xl font-medium"
            onClick={handleBuyFreeze}
            disabled={isPending || totalPoints < 500}
          >
            {isPending ? (
              <Icons name="loader-2" className="h-4 w-4 animate-spin mr-1.5" />
            ) : (
              <Icons
                name="credit-card"
                className="h-4 w-4 mr-1.5 text-amber-500"
              />
            )}
            {t('buyFreeze')}
          </Button>
        </div>
      </div>
    </div>
  );
};
