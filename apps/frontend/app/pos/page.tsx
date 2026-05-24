'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import AppShell, { NavItem } from '../../components/layout/AppShell';
import {
  Monitor, BarChart2, ShoppingCart, Package, DollarSign,
  Users, Settings, TrendingUp, Clock, CheckCircle,
} from 'lucide-react';

const NAV: NavItem[] = [
  { label: 'Dashboard',   href: '/pos',             icon: BarChart2 },
  { label: 'Buka Kasir',  href: '/pos/cashier',     icon: Monitor },
  { label: 'Sesi Kasir',  href: '/pos/sessions',    icon: Clock },
  { label: 'Order',       href: '/pos/orders',      icon: ShoppingCart },
  { label: 'Produk',      href: '/pos/products',    icon: Package },
  { label: 'Pelanggan',   href: '/customers',       icon: Users },
  { label: 'Laporan',     href: '/pos/reports',     icon: TrendingUp },
  { label: 'Pengaturan',  href: '/pos/settings',    icon: Settings },
];

const STATS = [
  { label: 'Transaksi Hari Ini',  value: '87',         sub: '+12 vs kemarin', color: '#FF5722', bg: 'rgba(255,87,34,.1)',  icon: ShoppingCart },
  { label: 'Revenue Hari Ini',    value: 'Rp 14.2 Jt', sub: '+8% vs kemarin', color: '#4CAF50', bg: 'rgba(76,175,80,.1)', icon: DollarSign },
  { label: 'Rata-rata Transaksi', value: 'Rp 163 Rb',  sub: 'Per transaksi',  color: '#2196F3', bg: 'rgba(33,150,243,.1)', icon: TrendingUp },
  { label: 'Kasir Aktif',         value: '3',           sub: 'Dari 5 kasir',   color: '#FF9800', bg: 'rgba(255,152,0,.1)', icon: Monitor },
];

const SESSIONS = [
  { kasir: 'Kasir 1 – Andi',  status: 'open',   open: '08:00', tx: 34, total: 'Rp 5.240.000' },
  { kasir: 'Kasir 2 – Budi',  status: 'open',   open: '08:05', tx: 28, total: 'Rp 4.180.000' },
  { kasir: 'Kasir 3 – Citra', status: 'open',   open: '09:30', tx: 25, total: 'Rp 4.780.000' },
  { kasir: 'Kasir 4 – Deni',  status: 'closed', open: '–',     tx: 0,  total: '–' },
  { kasir: 'Kasir 5 – Eka',   status: 'closed', open: '–',     tx: 0,  total: '–' },
];

const TOP_PRODUCTS = [
  { name: 'Semen Portland 40kg', qty: 42, revenue: 'Rp 2.100.000' },
  { name: 'Cat Tembok Dulux 5L', qty: 28, revenue: 'Rp 1.540.000' },
  { name: 'Pipa PVC 4 inch',     qty: 35, revenue: 'Rp 875.000' },
  { name: 'Keramik 60x60',       qty: 18, revenue: 'Rp 720.000' },
  { name: 'Besi Beton 10mm',     qty: 24, revenue: 'Rp 1.200.000' },
];

export default function PosDashboard() {
  const { token } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;

  return (
    <AppShell appName="Kasir (POS)" appColor="#E64A19" appGradient="from-orange-500 to-red-600" appIcon={Monitor} navItems={NAV} activeHref="/pos">
      <div className="p-6 space-y-6 max-w-6xl mx-auto">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#433C50' }}>Dashboard Kasir</h1>
            <p className="text-sm mt-0.5" style={{ color: '#A5A3AE' }}>Pantau transaksi dan sesi kasir hari ini</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#E64A19' }}>
            <Monitor className="h-4 w-4" /> Buka Kasir
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium" style={{ color: '#A5A3AE' }}>{s.label}</p>
                  <p className="text-xl font-bold mt-1 leading-tight" style={{ color: '#433C50' }}>{s.value}</p>
                  <p className="text-xs mt-1" style={{ color: '#4CAF50' }}>{s.sub}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: s.bg }}>
                  <s.icon className="h-5 w-5" style={{ color: s.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
              <h2 className="text-sm font-bold" style={{ color: '#433C50' }}>Status Kasir Hari Ini</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #EDE8F5' }}>
                    {['Kasir', 'Status', 'Jam Buka', 'Transaksi', 'Total'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#A5A3AE' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SESSIONS.map((s, i) => (
                    <tr key={s.kasir} style={{ borderBottom: i < SESSIONS.length - 1 ? '1px solid #F5F2FB' : 'none' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FDFCFF'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <td className="px-6 py-3.5 text-sm font-medium" style={{ color: '#433C50' }}>{s.kasir}</td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ color: s.status === 'open' ? '#4CAF50' : '#A5A3AE', backgroundColor: s.status === 'open' ? 'rgba(76,175,80,.1)' : 'rgba(165,163,174,.12)' }}>
                          {s.status === 'open' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {s.status === 'open' ? 'Buka' : 'Tutup'}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-sm" style={{ color: '#A5A3AE' }}>{s.open}</td>
                      <td className="px-6 py-3.5 text-sm font-semibold" style={{ color: '#433C50' }}>{s.tx || '–'}</td>
                      <td className="px-6 py-3.5 text-sm font-semibold" style={{ color: s.status === 'open' ? '#433C50' : '#A5A3AE' }}>{s.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
              <h2 className="text-sm font-bold" style={{ color: '#433C50' }}>Produk Terlaris Hari Ini</h2>
            </div>
            <div className="p-4 space-y-3">
              {TOP_PRODUCTS.map((p, i) => (
                <div key={p.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold w-4" style={{ color: '#A5A3AE' }}>{i + 1}</span>
                      <span className="text-xs font-medium truncate max-w-[120px]" style={{ color: '#433C50' }}>{p.name}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold" style={{ color: '#433C50' }}>{p.qty} pcs</p>
                      <p className="text-[10px]" style={{ color: '#A5A3AE' }}>{p.revenue}</p>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full ml-6" style={{ backgroundColor: '#F5F2FB' }}>
                    <div className="h-1.5 rounded-full" style={{ backgroundColor: '#E64A19', width: `${(p.qty / TOP_PRODUCTS[0].qty) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
