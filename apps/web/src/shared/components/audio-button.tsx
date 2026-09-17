'use client';

import { useToggle } from '@lumen/hooks';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';
import { ComponentProps, useCallback } from 'react';

export interface AudioButtonProps extends Omit<
  ComponentProps<typeof Button>,
  'onClick'
> {
  url: string;
  iconClassName?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function AudioButton({
  url,
  className,
  iconClassName,
  onClick,
  ...props
}: AudioButtonProps) {
  const [isPlaying, , setIsPlaying] = useToggle(false);

  const handlePlay = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onClick?.(event);

      if (!url) return;

      try {
        const audio = new Audio(url);
        setIsPlaying(true);
        audio.play().catch((err) => {
          console.error(err);
          setIsPlaying(false);
        });
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
      } catch (error) {
        console.error(error);
        setIsPlaying(false);
      }
    },
    [url, onClick],
  );

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={cn(isPlaying && 'text-primary bg-muted', className)}
      onClick={handlePlay}
      {...props}
    >
      {isPlaying && (
        <span className="absolute inset-0 rounded-full animate-ping bg-primary/20 pointer-events-none" />
      )}
      <Icons
        name={isPlaying ? 'volume-2' : 'volume-2'}
        className={cn(
          'h-5 w-5 transition-transform',
          isPlaying && 'scale-110',
          iconClassName,
        )}
      />
    </Button>
  );
}
