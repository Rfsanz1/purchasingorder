'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ModernLayout } from '../../components/layout/ModernLayout';
import { RolePermissionPanel } from '../../components/access/RolePermissionPanel';
import { useAuthStore } from '../../lib/store/useAuthStore';

export default function AccessPage() {
  const router = useRouter();
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [router, token]);

  return (
    <ModernLayout>
      <div className="space-y-6 p-6 lg:p-8">
        <div className="flex flex-col gap-3">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Role & Permission</p>
          <h1 className="text-3xl font-semibold text-white">Pengaturan Akses</h1>
          <p className="max-w-2xl text-sm text-slate-400">Kelola roles dan permission ERP modern secara modular.</p>
        </div>
        <RolePermissionPanel />
      </div>
    </ModernLayout>
  );
}
