'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-6xl font-bold text-destructive">500</h1>
          <h2 className="text-2xl font-semibold">Something went wrong!</h2>
          <p className="text-muted-foreground max-w-md text-center">
            A critical error occurred while rendering the application. We have
            been notified and are looking into it.
          </p>
          <button
            onClick={() => reset()}
            className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-md shadow hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
