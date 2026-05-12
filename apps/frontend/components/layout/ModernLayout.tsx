import { ReactNode } from 'react';
import { Sidebar } from '../sidebar/Sidebar';
import { Topbar } from '../topbar/Topbar';

interface ModernLayoutProps {
  children: ReactNode;
}

export function ModernLayout({ children }: ModernLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(27,120,151,0.24),_transparent_35%)] blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-28 h-[28rem] w-[28rem] bg-[radial-gradient(circle,_rgba(245,158,11,0.14),_transparent_55%)] blur-3xl" />
      <Sidebar />
      <div className="min-h-screen md:ml-[280px] transition-all duration-300">
        <Topbar />
        <main className="bg-transparent pb-10 pt-6 lg:pb-16">{children}</main>
      </div>
    </div>
  );
}
