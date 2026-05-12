'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ModernLayout } from '../../components/layout/ModernLayout';
import { NotificationList } from '../../components/notifications/NotificationList';
import { useAuthStore } from '../../lib/store/useAuthStore';
import { useNotificationStore } from '../../lib/store/useNotificationStore';

export default function NotificationsPage() {
  const router = useRouter();
  const { token, loadProfile } = useAuthStore();
  const { loadNotifications } = useNotificationStore();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    void loadProfile();
    void loadNotifications();
  }, [loadNotifications, loadProfile, router, token]);

  return (
    <ModernLayout>
      <div className="space-y-6 p-6 lg:p-8">
        <div className="flex flex-col gap-3">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Notifikasi ERP</p>
          <h1 className="text-3xl font-semibold text-white">Daftar Notifikasi</h1>
          <p className="max-w-2xl text-sm text-slate-400">Semua notifikasi penting sistem dan event ERP realtime akan muncul di sini.</p>
        </div>
        <NotificationList />
      </div>
    </ModernLayout>
  );
}
