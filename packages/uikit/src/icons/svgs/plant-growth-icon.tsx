import React from 'react';
import type { IconProps } from '../types';
import { PlantStage0Icon } from './plant-stage-0-icon';
import { PlantStage1Icon } from './plant-stage-1-icon';
import { PlantStage2Icon } from './plant-stage-2-icon';
import { PlantStage3Icon } from './plant-stage-3-icon';
import { PlantStage4Icon } from './plant-stage-4-icon';
import { PlantStage5Icon } from './plant-stage-5-icon';
import { PlantWiltedIcon } from './plant-wilted-icon';

export interface PlantGrowthIconProps extends Omit<IconProps, 'size'> {
  stage?: number;
  isWilted?: boolean;
  useStepIcon?: boolean;
  size?: number | string;
}

export function PlantGrowthIcon({
  stage = 1,
  isWilted = false,
  useStepIcon = false,
  ...props
}: PlantGrowthIconProps) {
  if (isWilted) {
    return <PlantWiltedIcon {...props} />;
  }

  const clampedStage = Math.max(0, Math.min(5, Math.round(stage)));

  if (clampedStage === 0) {
    return <PlantStage0Icon {...props} />;
  }

  if (useStepIcon) {
    switch (clampedStage) {
      case 1:
        return <PlantStage1Icon {...props} />;
      case 2:
        return <PlantStage2Icon {...props} />;
      case 3:
        return <PlantStage3Icon {...props} />;
      case 4:
        return <PlantStage4Icon {...props} />;
      case 5:
      default:
        return <PlantStage5Icon {...props} />;
    }
  }

  return <PlantStage5Icon {...props} />;
}
