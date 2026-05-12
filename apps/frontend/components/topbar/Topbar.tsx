'use client';

import { Bell, LogOut, Menu, User } from 'lucide-react';
import { useAuthStore } from '../../lib/store/useAuthStore';

export function Topbar() {
  const { token, user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-cyan-400/25 hover:text-white">
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">ERP Control Panel</p>
            <p className="text-sm text-slate-300">Modular enterprise architecture</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-cyan-400/25 hover:text-white">
            <Bell className="h-5 w-5" />
          </button>
          {token ? (
            <div className="hidden items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300 sm:flex">
              <User className="h-5 w-5 text-cyan-300" />
              <div>
                <p className="font-medium text-slate-100">{user?.name ?? user?.email ?? 'User'}</p>
                <p className="text-xs text-slate-500">{user?.roles?.join(', ') || 'Guest'}</p>
              </div>
            </div>
          ) : null}
          {token ? (
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-4 text-sm text-slate-300 transition hover:border-rose-400/25 hover:text-white"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
