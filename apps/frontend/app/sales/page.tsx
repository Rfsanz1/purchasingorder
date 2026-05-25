'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import AppShell, { NavItem } from '../../components/layout/AppShell';
import {
  ShoppingCart, FileText, Users, BarChart2, TrendingUp, Settings,
  Plus, Search, RefreshCw, ArrowUpRight, Clock, CheckCircle, XCircle, Package
} from 'lucide-react';
import FeatureHub from '../../components/FeatureHub';

const NAV: NavItem[] = [
  { label: 'Dashboard',    href: '/sales',               icon: BarChart2 },
  { label: 'Order Penjualan', href: '/sales/orders',    icon: ShoppingCart, badge: 5,
    children: [
      { label: 'Semua Order',    href: '/sales/orders' },
      { label: 'Draft',          href: '/sales/orders?status=draft' },
      { label: 'Dikonfirmasi',   href: '/sales/orders?status=confirmed' },
    ],
  },
  { label: 'Invoice',         href: '/sales/faktur',     icon: FileText, badge: 3 },
  { label: 'Pelanggan',       href: '/customers',        icon: Users },
  { label: 'Produk',          href: '/sales/products',   icon: Package },
  { label: 'Laporan',         href: '/sales/reports',    icon: TrendingUp },
  { label: 'Pengaturan',      href: '/sales/settings',   icon: Settings },
];

const STATS = [
  { label: 'Order Bulan Ini',   value: '128',      sub: '+12% vs bulan lalu', icon: ShoppingCart, color: '#00BCD4', bg: 'rgba(0,188,212,.1)' },
  { label: 'Revenue Bulan Ini', value: 'Rp 284 Jt', sub: '+8.3% vs bulan lalu', icon: TrendingUp,   color: '#4CAF50', bg: 'rgba(76,175,80,.1)' },
  { label: 'Invoice Belum Bayar', value: '23',     sub: 'Rp 48 Jt outstanding',  icon: FileText,     color: '#FF9800', bg: 'rgba(255,152,0,.1)' },
  { label: 'Pelanggan Aktif',   value: '342',       sub: '+5 bulan ini',        icon: Users,        color: '#9C27B0', bg: 'rgba(156,39,176,.1)' },
];

const RECENT_ORDERS = [
  { id: 'SO-0128', customer: 'PT Maju Jaya',     date: '24 Mei 2026', total: 'Rp 12.400.000', status: 'confirmed' },
  { id: 'SO-0127', customer: 'CV Berkah Abadi',  date: '23 Mei 2026', total: 'Rp 6.750.000',  status: 'draft' },
  { id: 'SO-0126', customer: 'Toko Sumber Rejeki', date: '23 Mei 2026', total: 'Rp 3.200.000', status: 'invoiced' },
  { id: 'SO-0125', customer: 'UD Karya Mandiri', date: '22 Mei 2026', total: 'Rp 9.850.000',  status: 'confirmed' },
  { id: 'SO-0124', customer: 'PT Global Niaga',  date: '21 Mei 2026', total: 'Rp 21.000.000', status: 'cancelled' },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  draft:     { label: 'Draft',       color: '#A5A3AE', bg: 'rgba(165,163,174,.12)', icon: Clock },
  confirmed: { label: 'Dikonfirmasi', color: '#00BCD4', bg: 'rgba(0,188,212,.1)',   icon: CheckCircle },
  invoiced:  { label: 'Ditagih',     color: '#4CAF50', bg: 'rgba(76,175,80,.1)',    icon: FileText },
  cancelled: { label: 'Dibatalkan',  color: '#EA5455', bg: 'rgba(234,84,85,.1)',    icon: XCircle },
};

export default function SalesDashboard() {
  const { token } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;

  return (
    <AppShell
      appName="Penjualan"
      appColor="#00ACC1"
      appGradient="from-cyan-500 to-cyan-700"
      appIcon={ShoppingCart}
      navItems={NAV}
      activeHref="/sales"
    >
      <div className="p-6 space-y-6 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#433C50' }}>Dashboard Penjualan</h1>
            <p className="text-sm mt-0.5" style={{ color: '#A5A3AE' }}>Ringkasan aktivitas penjualan hari ini</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium" style={{ border: '1px solid #EDE8F5', color: '#6D6777' }}>
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: '#00ACC1' }}
              onClick={() => router.push('/sales/orders')}
            >
              <Plus className="h-4 w-4" /> Order Baru
            </button>
          </div>
        </div>

        <FeatureHub moduleId="sales" color="#7C3AED" bgColor="#EDE9FE" gradient="linear-gradient(135deg, #7C3AED, #6D28D9)" />

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium" style={{ color: '#A5A3AE' }}>{s.label}</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: '#433C50' }}>{s.value}</p>
                  <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#4CAF50' }}>
                    <ArrowUpRight className="h-3 w-3" />{s.sub}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0" style={{ backgroundColor: s.bg }}>
                  <s.icon className="h-5 w-5" style={{ color: s.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
            <h2 className="text-sm font-bold" style={{ color: '#433C50' }}>Order Terbaru</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#B0AAB9' }} />
                <input className="rounded-lg pl-8 pr-3 py-1.5 text-xs" style={{ border: '1px solid #EDE8F5', color: '#433C50', outline: 'none', width: 160 }} placeholder="Cari order..." />
              </div>
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: '#00ACC1', border: '1px solid rgba(0,172,193,.2)', backgroundColor: 'rgba(0,172,193,.06)' }} onClick={() => router.push('/sales/orders')}>
                Lihat Semua
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #EDE8F5' }}>
                  {['No. Order', 'Pelanggan', 'Tanggal', 'Total', 'Status'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#A5A3AE' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((o, i) => {
                  const st = STATUS_MAP[o.status];
                  return (
                    <tr key={o.id} className="transition-colors" style={{ borderBottom: i < RECENT_ORDERS.length - 1 ? '1px solid #F5F2FB' : 'none' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FDFCFF'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <td className="px-6 py-3.5 text-sm font-semibold" style={{ color: '#00ACC1' }}>{o.id}</td>
                      <td className="px-6 py-3.5 text-sm" style={{ color: '#433C50' }}>{o.customer}</td>
                      <td className="px-6 py-3.5 text-sm" style={{ color: '#A5A3AE' }}>{o.date}</td>
                      <td className="px-6 py-3.5 text-sm font-semibold" style={{ color: '#433C50' }}>{o.total}</td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ color: st.color, backgroundColor: st.bg }}>
                          <st.icon className="h-3 w-3" />{st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
