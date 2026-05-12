'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardSummary } from '../components/dashboard/DashboardSummary';
import { ModernLayout } from '../components/layout/ModernLayout';
import { useAuthStore } from '../lib/store/useAuthStore';
import { useDashboardStore } from '../lib/store/useDashboardStore';

export default function HomePage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const { summary, loadSummary, isLoading, error } = useDashboardStore();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    loadSummary();
  }, [loadSummary, router, token]);

  return (
    <ModernLayout>
      <div className="space-y-6 p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">ERP Modern</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-100 sm:text-4xl">Dashboard Ringkas</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
              Selamat datang di dashboard ERP baru. Dashboard ini terhubung ke backend modern untuk monitoring, notifikasi, dan akses role-based.
            </p>
          </div>
        </div>

        <DashboardSummary summary={summary} isLoading={isLoading} error={error} />
      </div>
    </ModernLayout>
  );
}
