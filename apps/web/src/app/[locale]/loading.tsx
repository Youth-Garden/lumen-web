'use client';

import { Logo } from '@lumen/uikit/components';

export default function GlobalLoading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground transition-all duration-300">
      <div className="relative flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="relative p-3">
          <Logo showText={false} iconSize={72} />
          {/* Spiked / Dashed rotating ring around owl logo */}
          <div className="absolute inset-0 animate-spin text-primary">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray="6 8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <h3 className="font-heading text-lg font-semibold tracking-wide text-foreground">
            Lumen
          </h3>
          <p className="text-xs font-medium text-muted-foreground">
            Loading experience...
          </p>
        </div>
      </div>
    </div>
  );
}
