import { ReactNode } from 'react';
import { Sidebar } from '../sidebar/Sidebar';
import { Topbar } from '../topbar/Topbar';

interface ModernLayoutProps {
  children: ReactNode;
}

export function ModernLayout({ children }: ModernLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="ml-0 md:ml-[280px] min-h-screen transition-all duration-300">
        <Topbar />
        <main className="bg-slate-950 pb-10 pt-6 lg:pb-16">{children}</main>
      </div>
    </div>
  );
}
