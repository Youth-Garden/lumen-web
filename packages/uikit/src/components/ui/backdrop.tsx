'use client';

import { cn } from '@lumen/uikit/utils';
import React from 'react';

interface BackdropProps {
  isOpen?: boolean;
  onPress?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Backdrop = ({
  isOpen,
  onPress,
  className,
  style,
}: BackdropProps) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onPress?.();
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onPress?.();
      }}
      style={style}
      className={cn(
        'fixed inset-0 isolate z-50 bg-black/40 transition-all duration-200 cursor-pointer pointer-events-auto select-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className,
      )}
      aria-hidden="true"
    />
  );
};
