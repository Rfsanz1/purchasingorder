'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Bell, Box, LayoutDashboard, ShieldCheck } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/inventory', label: 'Inventory', icon: Box },
  { href: '/warehouse', label: 'Warehouse', icon: Activity },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/access', label: 'Role & Permission', icon: ShieldCheck },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-full w-full max-w-[280px] border-r border-slate-800 bg-slate-950/95 shadow-2xl shadow-slate-950/20 backdrop-blur-xl md:block">
      <div className="flex h-full min-h-screen flex-col px-5 py-6">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[var(--primary)] text-white shadow-[0_18px_45px_-30px_rgba(27,120,151,1)]">
            <span className="text-lg font-bold">G</span>
          </div>
          <div>
            <p className="text-sm text-slate-400">Gentong Mas</p>
            <h2 className="text-lg font-semibold text-white">ERP Enterprise</h2>
          </div>
        </div>

        <nav className="space-y-2 text-sm text-slate-300">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-3xl px-4 py-3 transition ${
                  active
                    ? 'border border-[rgba(27,120,151,0.35)] bg-slate-900 text-white shadow-xl shadow-[rgba(27,120,151,0.12)]'
                    : 'border border-transparent hover:border-[rgba(27,120,151,0.18)] hover:bg-slate-900/90 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 transition ${active ? 'text-[var(--primary)]' : 'text-cyan-300 group-hover:text-[var(--primary-soft)]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-[32px] bg-slate-900/75 p-5 shadow-inner shadow-slate-950/30">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Enterprise status</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Modular ERP dengan legacy bridge, incremental migration, dan API-first architecture.
          </p>
        </div>
      </div>
    </aside>
  );
}
