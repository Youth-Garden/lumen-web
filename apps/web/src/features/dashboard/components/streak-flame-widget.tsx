'use client';

import { motion } from 'framer-motion';

interface StreakFlameWidgetProps {
  streakDays?: number;
  isActiveToday?: boolean;
  className?: string;
}

export function StreakFlameWidget({
  streakDays = 7,
  isActiveToday = true,
  className = '',
}: StreakFlameWidgetProps) {
  return (
    <div
      className={`inline-flex items-center gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-amber-600 dark:text-amber-400 shadow-sm backdrop-blur-md ${className}`}
    >
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          rotate: [-3, 3, -3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative flex items-center justify-center text-xl"
      >
        🔥
      </motion.div>
      <div className="flex flex-col">
        <span className="text-base font-black leading-none tracking-tight">
          {streakDays} Days
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80 mt-0.5">
          {isActiveToday ? 'Streak Active!' : 'Keep it up!'}
        </span>
      </div>
    </div>
  );
}
