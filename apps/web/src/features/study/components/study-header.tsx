'use client';

import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React from 'react';

interface StudyHeaderProps {
  progressPercent: number;
  showShortcuts: boolean;
  onToggleShortcuts: () => void;
  onSaveAndClose: () => void;
  onOpenSettings: () => void;
}

export function StudyHeader({
  progressPercent,
  showShortcuts,
  onToggleShortcuts,
  onSaveAndClose,
  onOpenSettings,
}: StudyHeaderProps) {
  const t = useTranslations('Vocabulary.Study');

  return (
    <header className="relative w-full flex items-center justify-between px-4 sm:px-8 py-3.5 shrink-0">
      <div className="flex items-center gap-2 z-10">
        <Button
          variant="ghost"
          size="icon-sm"
          type="button"
          onClick={onSaveAndClose}
          title={t('saveAndClose')}
        >
          <Icons name="save" className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={onToggleShortcuts}
        >
          {showShortcuts ? t('hideShortcuts') : t('showShortcuts')}
        </Button>
      </div>

      {/* Center: Long horizontal progress bar */}
      <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-[240px] sm:max-w-[360px] md:max-w-[440px] px-2 pointer-events-none">
        <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Right: Settings modal trigger only */}
      <div className="flex items-center gap-2 z-10">
        <Button
          variant="ghost"
          size="icon-sm"
          type="button"
          onClick={onOpenSettings}
          title={t('settingsTitle')}
        >
          <Icons name="settings" className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
