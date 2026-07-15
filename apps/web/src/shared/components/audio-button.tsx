import { ComponentProps, useCallback } from 'react';

import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';

import { playAudio } from '@/shared/utils/audio';

export interface AudioButtonProps extends Omit<
  ComponentProps<typeof Button>,
  'onClick'
> {
  url: string;
  iconClassName?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function AudioButton({
  url,
  className,
  iconClassName,
  onClick,
  ...props
}: AudioButtonProps) {
  const handlePlay = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      playAudio(url);
      onClick?.(e);
    },
    [url, onClick],
  );

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('rounded-full', className)}
      onClick={handlePlay}
      {...props}
    >
      <Icons name="volume-2" className={cn('h-5 w-5', iconClassName)} />
    </Button>
  );
}
