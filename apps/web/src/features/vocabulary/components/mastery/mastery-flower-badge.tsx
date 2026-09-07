'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { PlantMasteryRing } from './plant-mastery-ring';

interface MasteryFlowerBadgeProps {
  level: number; // 0 to 5
  learningStep?: number;
  isWilted?: boolean;
  onClick?: () => void;
  className?: string;
  size?: number;
}

export function MasteryFlowerBadge({
  level = 0,
  learningStep = 0,
  isWilted = false,
  onClick,
  className = '',
  size = 40,
}: MasteryFlowerBadgeProps) {
  const t = useTranslations('Vocabulary.Mastery');
  const currentLevel = Math.max(0, Math.min(5, Math.round(level)));

  const title =
    currentLevel === 0
      ? t('seedBadgeTooltip')
      : t('levelBadgeTooltip', { level: currentLevel });

  return (
    <PlantMasteryRing
      level={currentLevel}
      learningStep={learningStep}
      isWilted={isWilted}
      size={size}
      onClick={onClick}
      title={title}
      className={className}
    />
  );
}
