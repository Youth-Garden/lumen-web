import * as React from 'react';
import { Card } from '@lumen/uikit/components';
import { cn } from '@lumen/uikit/utils';

export const SettingsCard = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Card>
>(({ className, ...props }, ref) => {
  return (
    <Card
      ref={ref}
      className={cn('bg-muted/40', className)}
      {...props}
    />
  );
});
SettingsCard.displayName = 'SettingsCard';
