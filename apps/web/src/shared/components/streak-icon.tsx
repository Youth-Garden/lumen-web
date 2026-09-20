import Image from 'next/image';
import { cn } from '@lumen/uikit/utils';

export interface StreakIconProps {
  size?: number;
  className?: string;
  alt?: string;
}

export function StreakIcon({
  size = 16,
  className,
  alt = 'Streak',
}: StreakIconProps) {
  return (
    <Image
      src="/images/common/streak.png"
      alt={alt}
      width={size}
      height={size}
      className={cn('object-contain select-none shrink-0', className)}
      style={{ width: size, height: size }}
    />
  );
}

export function StreakFreezeIcon({
  size = 24,
  className,
  alt = 'Streak Freeze',
}: StreakIconProps) {
  return (
    <Image
      src="/images/common/streak-freeze.png"
      alt={alt}
      width={size}
      height={size}
      className={cn('object-contain select-none shrink-0', className)}
      style={{ width: size, height: size }}
    />
  );
}

export function LongestStreakIcon({
  size = 16,
  className,
  alt = 'Longest Streak',
}: StreakIconProps) {
  return (
    <Image
      src="/images/common/longest-streak.png"
      alt={alt}
      width={size}
      height={size}
      className={cn('object-contain select-none shrink-0', className)}
      style={{ width: size, height: size }}
    />
  );
}
