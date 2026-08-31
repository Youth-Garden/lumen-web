'use client';

import { Logo } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';

export default function GlobalLoading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground transition-all duration-300">
      <div className="relative flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="relative">
          <Logo showText={false} iconSize={72} />
          <div className="absolute -inset-3 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <h3 className="font-heading text-lg font-semibold tracking-wide text-foreground">
            Lumen
          </h3>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Icons name="loader-2" className="h-3.5 w-3.5 animate-spin text-primary" />
            <span>Loading experience...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
