import Link from 'next/link';
import { Activity, Bell, Box, LayoutDashboard, ShieldCheck } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/inventory', label: 'Inventory', icon: Box },
  { href: '/warehouse', label: 'Warehouse', icon: Activity },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/access', label: 'Role & Permission', icon: ShieldCheck },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-full w-full max-w-[280px] border-r border-slate-800 bg-slate-950/95 shadow-2xl shadow-slate-950/20 backdrop-blur-xl md:block">
      <div className="flex h-full min-h-screen flex-col px-5 py-6">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-700 text-white shadow-lg shadow-cyan-700/20">
            <span className="text-lg font-bold">ERP</span>
          </div>
          <div>
            <p className="text-sm text-slate-400">Gentong Mas</p>
            <h2 className="text-lg font-semibold text-white">Enterprise</h2>
          </div>
        </div>

        <nav className="space-y-1 text-sm text-slate-300">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 transition hover:border-cyan-500/30 hover:bg-slate-900/80 hover:text-white"
              >
                <Icon className="h-5 w-5 text-cyan-300 transition group-hover:text-cyan-100" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-3xl bg-slate-900/80 p-4 shadow-inner shadow-slate-950/30">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Quick overview</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            ERP modern siap melangkah ke modular migration dengan legacy fallback dan API-first architecture.
          </p>
        </div>
      </div>
    </aside>
  );
}
