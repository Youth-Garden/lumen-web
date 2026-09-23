'use client';

import { useToggle } from '@lumen/hooks';
import { IconButton } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';
import { ComponentProps, useCallback, useEffect, useRef } from 'react';

export interface AudioButtonProps extends Omit<
  ComponentProps<typeof IconButton>,
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const handlePlay = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onClick?.(event);

      if (!url) return;

      const now = Date.now();
      if (now - lastPlayTimeRef.current < 350) {
        return;
      }
      lastPlayTimeRef.current = now;

      try {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }

        const audio = new Audio(url);
        audioRef.current = audio;
        setIsPlaying(true);
        audio.play().catch((err) => {
          if ((err as Error)?.name !== 'AbortError') {
            console.error(err);
          }
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
    <IconButton
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
    </IconButton>
  );
}
