import React from 'react';
import { cn } from '@lumen/uikit/utils';

interface BackdropProps {
  isOpen?: boolean;
  onPress?: () => void;
  className?: string;
}

export const Backdrop = ({ isOpen, onPress, className }: BackdropProps) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onPress}
      className={cn(
        'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
      aria-hidden="true"
    />
  );
};
