'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ModernLayout } from '../components/layout/ModernLayout';
import { useAuthStore } from '../lib/store/useAuthStore';
import { useDashboardStore } from '../lib/store/useDashboardStore';
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, Activity, Zap, AlertTriangle } from 'lucide-react';

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex items-center gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { token, user, loadProfile } = useAuthStore();
  const { summary, fetchSummary } = useDashboardStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    loadProfile();
    fetchSummary();
  }, [token]);

  if (!token) return null;

  const stats = [
    { label: 'Total Users', value: summary?.users ?? '-', icon: Users, color: 'bg-blue-600' },
    { label: 'Roles', value: summary?.roles ?? '-', icon: ShieldIcon, color: 'bg-purple-600' },
    { label: 'Notifikasi', value: summary?.notifications ?? '-', icon: BellIcon, color: 'bg-amber-500' },
    { label: 'Permissions', value: summary?.permissions ?? '-', icon: Activity, color: 'bg-emerald-600' },
  ];

  const modules = [
    { label: 'Inventory', href: '/inventory', icon: Package, desc: 'Produk & stok', color: 'from-blue-600 to-blue-800' },
    { label: 'Sales Order', href: '/sales/orders', icon: ShoppingCart, desc: 'Order penjualan', color: 'from-emerald-600 to-emerald-800' },
    { label: 'Purchasing', href: '/purchasing/purchase-orders', icon: TrendingUp, desc: 'Purchase Order', color: 'from-orange-500 to-orange-700' },
    { label: 'Pelanggan', href: '/customers', icon: Users, desc: 'Data pelanggan', color: 'from-purple-600 to-purple-800' },
    { label: 'Finance', href: '/finance/journal-entries', icon: DollarSign, desc: 'Akuntansi', color: 'from-cyan-600 to-cyan-800' },
    { label: 'HR & Payroll', href: '/hr/employees', icon: Activity, desc: 'Karyawan & gaji', color: 'from-pink-600 to-pink-800' },
    { label: 'Kledo ERP', href: '/kledo', icon: Zap, desc: 'Integrasi Kledo', color: 'from-yellow-500 to-yellow-700' },
    { label: 'POS / Kasir', href: '/pos', icon: AlertTriangle, desc: 'Point of Sale', color: 'from-red-600 to-red-800' },
  ];

  return (
    <ModernLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Selamat datang, {user?.name ?? 'Admin'} 👋</h1>
          <p className="text-slate-400 mt-1">Gentong Mas ERP — {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Modul ERP</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {modules.map(m => (
              <a key={m.href} href={m.href} className={`rounded-2xl bg-gradient-to-br ${m.color} p-5 flex flex-col gap-3 hover:scale-[1.02] transition-transform`}>
                <m.icon className="h-7 w-7 text-white/80" />
                <div>
                  <p className="font-semibold text-white">{m.label}</p>
                  <p className="text-xs text-white/60 mt-0.5">{m.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><Activity className="h-4 w-4 text-cyan-400" /> System Info</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><p className="text-slate-500">Backend</p><p className="text-white font-medium">NestJS v11</p></div>
            <div><p className="text-slate-500">Frontend</p><p className="text-white font-medium">Next.js 14</p></div>
            <div><p className="text-slate-500">Database</p><p className="text-white font-medium">PostgreSQL</p></div>
            <div><p className="text-slate-500">ORM</p><p className="text-white font-medium">Prisma</p></div>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
}
function BellIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
}
