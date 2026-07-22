'use client';

import { motion } from 'framer-motion';
import { Icons } from '@lumen/uikit/icons';
import { Button } from '@lumen/uikit/components';

interface AchievementModalProps {
  title: string;
  description: string;
  badgeName?: string;
  badgeIcon?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementModal({
  title = 'Achievement Unlocked! 🏆',
  description = 'Congratulations on completing your daily learning goal.',
  badgeName = '7-Day Streak Master',
  badgeIcon = 'trophy',
  isOpen,
  onClose,
}: AchievementModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-in fade-in-0">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative flex flex-col items-center text-center w-full max-w-sm rounded-3xl border border-primary/30 bg-card p-6 shadow-2xl space-y-4"
      >
        {/* Glow Halo */}
        <div className="absolute -top-12 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 p-1 shadow-lg ring-4 ring-amber-500/30 animate-bounce">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-card text-amber-500">
            <Icons name={badgeIcon as any || 'trophy'} className="h-10 w-10" />
          </div>
        </div>

        <div className="pt-10">
          <h3 className="text-xl font-black text-foreground">{title}</h3>
          <p className="text-sm font-semibold text-primary mt-1">{badgeName}</p>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            {description}
          </p>
        </div>

        <Button
          className="w-full rounded-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          onClick={onClose}
        >
          Awesome!
        </Button>
      </motion.div>
    </div>
  );
}
