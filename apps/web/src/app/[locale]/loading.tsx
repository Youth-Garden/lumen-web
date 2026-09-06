'use client';

import { SpinnerIcon } from '@lumen/uikit/icons';

export default function GlobalLoading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground transition-all duration-300">
      <div className="relative flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="relative h-16 w-16 text-primary animate-spin">
          <SpinnerIcon size={64} />
        </div>
      </div>
    </div>
  );
}
