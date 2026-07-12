import { Sidebar } from '../components/sidebar';
import { Header } from '../components/header';
import { PropsWithChildren } from 'react';

export function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative flex h-screen overflow-hidden bg-background">
      {/* Glassmorphism ambient glows */}
      <div className="absolute top-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/20 opacity-40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-blue-500/10 opacity-30 blur-[100px] pointer-events-none" />

      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden z-10 bg-muted dark:bg-muted/20 my-2 mr-2 rounded-2xl md:rounded-[2rem] shadow-sm">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto w-full max-w-6xl animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
