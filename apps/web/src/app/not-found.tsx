import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-background antialiased flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center p-8 max-w-2xl mx-auto space-y-6">
          <div className="relative">
            <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-orange-400">
              404
            </h1>
            <div className="absolute inset-0 bg-primary/20 blur-3xl -z-10 rounded-full scale-150"></div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-lg">
              The page you are looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Go Back Home
          </Link>
        </div>
      </body>
    </html>
  );
}
