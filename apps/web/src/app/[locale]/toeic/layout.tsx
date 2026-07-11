import { ReactNode } from 'react';
import { Logo } from '@lumen/uikit/components';
export default function MockTestLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-green-500/30">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo textClassName="text-white" />
            <span className="font-bold text-xl tracking-tight text-green-500">
              Mock Test
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
