import './globals.css';
import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-background text-foreground antialiased flex flex-col items-center justify-center p-4">
        <div className="relative flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-6">
          {/* Ambient Glow */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10" />

          {/* 404 Badge */}
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-semibold tracking-wide">
            404 • Page Not Found
          </div>

          {/* Large Number */}
          <h1 className="text-8xl font-black tracking-tight text-foreground sm:text-9xl">
            404
          </h1>

          {/* Title & Description */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
              Lost in space?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              The page you are looking for doesn&apos;t exist, has been removed,
              or the link is incorrect.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
