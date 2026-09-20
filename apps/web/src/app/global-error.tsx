'use client';

import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import './globals.css';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
}) {
  return (
    <html lang="vi">
      <body className="bg-background text-foreground antialiased flex flex-col items-center justify-center min-h-screen p-4">
        <div className="relative flex max-w-md flex-col items-center space-y-6 text-center">
          {/* Ambient Glow */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-destructive/10 blur-[80px] rounded-full pointer-events-none -z-10" />

          {/* Icon Badge */}
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 shadow-inner">
            <Icons name="danger" className="h-10 w-10" />
          </div>

          {/* Text */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-destructive">
              500 Error
            </span>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl text-foreground">
              Đã có lỗi xảy ra!
            </h1>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
              Đã xảy ra sự cố trong quá trình xử lý. Vui lòng thử lại hoặc quay về trang trước.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-2">
            <Button
              variant="outline"
              size="default"
              onClick={() => window.history.back()}
              className="cursor-pointer"
            >
              <Icons name="chevron-left" className="h-4 w-4" />
              <span>Quay lại</span>
            </Button>
            <Button
              variant="default"
              size="default"
              onClick={() => (reset ? reset() : window.location.reload())}
              className="cursor-pointer"
            >
              <Icons name="rotate-ccw" className="h-4 w-4" />
              <span>Thử lại</span>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
