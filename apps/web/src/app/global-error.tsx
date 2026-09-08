'use client';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
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
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md shadow hover:bg-primary/90 transition-colors"
            >
              Go back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md shadow hover:bg-secondary/90 transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
