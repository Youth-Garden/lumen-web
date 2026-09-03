'use client';

export default function GlobalLoading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground transition-all duration-300">
      <div className="relative flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="relative h-16 w-16 text-primary">
          {/* Spiked / Dashed rotating ring spinner */}
          <div className="absolute inset-0 animate-spin">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="8 10"
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
