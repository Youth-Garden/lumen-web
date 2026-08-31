import { PropsWithChildren } from 'react';
import { Header } from '../components/header';
import { Sidebar } from '../components/sidebar';

export function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div
      id="main-layout"
      className="relative flex h-screen overflow-hidden bg-background"
    >
      {/* Glassmorphism ambient glows */}
      <div className="absolute top-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/20 opacity-40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-blue-500/10 opacity-30 blur-[100px] pointer-events-none" />

      <Sidebar />
      <div
        id="main-content-wrapper"
        className="relative flex flex-col flex-1 overflow-hidden z-10 bg-muted/50 dark:bg-slate-900/50 backdrop-blur-2xl my-2 mr-2 rounded-2xl md:rounded-[2rem]"
      >
        <Header />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto px-6 pb-6 pt-20 md:px-10 md:pb-8 md:pt-24"
        >
          <div className="mx-auto w-full max-w-5xl animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
