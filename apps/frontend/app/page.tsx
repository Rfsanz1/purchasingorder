'use client';

import Link from 'next/link';
import { Briefcase, Database, Package, ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardSummary } from '../components/dashboard/DashboardSummary';
import { ModernLayout } from '../components/layout/ModernLayout';
import { useAuthStore } from '../lib/store/useAuthStore';
import { useDashboardStore } from '../lib/store/useDashboardStore';

const actionCards = [
  {
    href: '/inventory',
    label: 'Inventory overview',
    description: 'Pantau stok dan mutasi barang secara real time.',
    icon: Briefcase,
  },
  {
    href: '/warehouse',
    label: 'Warehouse map',
    description: 'Kelola gudang dan lokasi penyimpanan secara modular.',
    icon: Database,
  },
  {
    href: '/notifications',
    label: 'Notifications',
    description: 'Lihat event notifikasi ERP enterprise.',
    icon: Package,
  },
  {
    href: '/access',
    label: 'Roles & Permissions',
    description: 'Atur akses dan hak pengguna dengan RBAC.',
    icon: ShieldCheck,
  },
];

export default function HomePage() {
  const router = useRouter();
  const { token, loadProfile } = useAuthStore();
  const { summary, loadSummary, isLoading, error } = useDashboardStore();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    void loadProfile();
    loadSummary();
  }, [loadProfile, loadSummary, router, token]);

  return (
    <ModernLayout>
      <div className="space-y-8 p-6 lg:p-8">
        <section className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[32px] border border-[rgba(148,163,184,0.12)] bg-slate-900/80 p-8 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.7)]">
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--primary-soft)]">ERP Modern Enterprise</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Selamat datang di Gentong Mas ERP</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Platform ERP modern dengan legacy bridge, API-first architecture, dan modular workflow untuk inventory, purchasing, sales, dan reporting.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {actionCards.slice(0, 2).map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="group rounded-3xl border border-slate-800 bg-slate-950/80 p-5 transition hover:border-[var(--primary)] hover:bg-slate-900"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-[var(--primary)]/10 text-[var(--primary)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{action.label}</p>
                        <p className="mt-1 text-xs text-slate-400">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <DashboardSummary summary={summary} isLoading={isLoading} error={error} />
            <div className="rounded-[32px] border border-[rgba(148,163,184,0.12)] bg-slate-900/80 p-6 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.7)]">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--primary-soft)]">Legacy Bridge</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Dual-read dan incremental migration</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Backend baru berjalan paralel dengan Laravel legacy, menjaga data existing dan memulai migrasi modul demi modul.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {actionCards.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group rounded-[32px] border border-slate-800 bg-slate-900/90 p-6 text-sm transition hover:border-[var(--primary)] hover:bg-slate-950"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--primary-soft)]">{action.label}</p>
                      <p className="mt-3 text-base font-semibold text-white">{action.description}</p>
                    </div>
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[var(--primary)]/10 text-[var(--primary)]">
                      <Icon className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-5 text-xs text-slate-500">Buka modul</div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </ModernLayout>
  );
}
