'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import AppShell, { NavItem } from '../../components/layout/AppShell';
import {
  Truck, BarChart2, FileText, Building2, PackageCheck,
  Clock, CheckCircle, XCircle, Settings, Plus, Search, TrendingDown,
} from 'lucide-react';

const NAV: NavItem[] = [
  { label: 'Dashboard',       href: '/purchasing',                         icon: BarChart2 },
  { label: 'Purchase Order',  href: '/purchasing/purchase-orders',         icon: FileText, badge: 4,
    children: [
      { label: 'Semua PO',    href: '/purchasing/purchase-orders' },
      { label: 'Draft',       href: '/purchasing/purchase-orders?status=draft' },
      { label: 'Dikonfirmasi', href: '/purchasing/purchase-orders?status=confirmed' },
    ],
  },
  { label: 'Penerimaan',      href: '/purchasing/goods-receipts',          icon: PackageCheck },
  { label: 'Supplier',        href: '/purchasing/suppliers',               icon: Building2 },
  { label: 'Laporan',         href: '/purchasing/reports',                 icon: TrendingDown },
  { label: 'Pengaturan',      href: '/purchasing/settings',                icon: Settings },
];

const STATS = [
  { label: 'PO Bulan Ini',       value: '42',       sub: '+6 vs bulan lalu',    color: '#795548', bg: 'rgba(121,85,72,.1)',  icon: FileText },
  { label: 'Total Spend',         value: 'Rp 198 Jt', sub: 'Bulan ini',          color: '#EA5455', bg: 'rgba(234,84,85,.1)', icon: TrendingDown },
  { label: 'PO Menunggu Konfirm', value: '8',        sub: '3 urgent',            color: '#FF9800', bg: 'rgba(255,152,0,.1)', icon: Clock },
  { label: 'Supplier Aktif',      value: '67',       sub: '5 baru bulan ini',    color: '#4CAF50', bg: 'rgba(76,175,80,.1)', icon: Building2 },
];

const POS = [
  { id: 'PO-0056', supplier: 'PT Bahan Baku Utama',  date: '24 Mei 2026', total: 'Rp 24.800.000', status: 'confirmed' },
  { id: 'PO-0055', supplier: 'CV Material Prima',     date: '23 Mei 2026', total: 'Rp 8.500.000',  status: 'draft' },
  { id: 'PO-0054', supplier: 'UD Sumber Material',    date: '22 Mei 2026', total: 'Rp 15.200.000', status: 'received' },
  { id: 'PO-0053', supplier: 'PT Karya Supplier',     date: '21 Mei 2026', total: 'Rp 6.750.000',  status: 'confirmed' },
  { id: 'PO-0052', supplier: 'CV Berkah Supplier',    date: '20 Mei 2026', total: 'Rp 32.000.000', status: 'cancelled' },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  draft:     { label: 'Draft',       color: '#A5A3AE', bg: 'rgba(165,163,174,.12)', icon: Clock },
  confirmed: { label: 'Dikonfirmasi', color: '#FF9800', bg: 'rgba(255,152,0,.1)',   icon: CheckCircle },
  received:  { label: 'Diterima',    color: '#4CAF50', bg: 'rgba(76,175,80,.1)',    icon: PackageCheck },
  cancelled: { label: 'Dibatalkan',  color: '#EA5455', bg: 'rgba(234,84,85,.1)',    icon: XCircle },
};

export default function PurchasingDashboard() {
  const { token } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;

  return (
    <AppShell appName="Pembelian" appColor="#5D4037" appGradient="from-stone-500 to-stone-700" appIcon={Truck} navItems={NAV} activeHref="/purchasing">
      <div className="p-6 space-y-6 max-w-6xl mx-auto">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#433C50' }}>Dashboard Pembelian</h1>
            <p className="text-sm mt-0.5" style={{ color: '#A5A3AE' }}>Pantau purchase order dan supplier</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#5D4037' }}
            onClick={() => router.push('/purchasing/purchase-orders')}>
            <Plus className="h-4 w-4" /> PO Baru
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium" style={{ color: '#A5A3AE' }}>{s.label}</p>
                  <p className="text-xl font-bold mt-1 leading-tight" style={{ color: '#433C50' }}>{s.value}</p>
                  <p className="text-xs mt-1" style={{ color: '#A5A3AE' }}>{s.sub}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: s.bg }}>
                  <s.icon className="h-5 w-5" style={{ color: s.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
            <h2 className="text-sm font-bold" style={{ color: '#433C50' }}>Purchase Order Terbaru</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#B0AAB9' }} />
                <input className="rounded-lg pl-8 pr-3 py-1.5 text-xs" style={{ border: '1px solid #EDE8F5', color: '#433C50', outline: 'none', width: 160 }} placeholder="Cari PO..." />
              </div>
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: '#5D4037', border: '1px solid rgba(93,64,55,.2)', backgroundColor: 'rgba(93,64,55,.06)' }}
                onClick={() => router.push('/purchasing/purchase-orders')}>
                Lihat Semua
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #EDE8F5' }}>
                  {['No. PO', 'Supplier', 'Tanggal', 'Total', 'Status'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#A5A3AE' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {POS.map((po, i) => {
                  const st = STATUS_MAP[po.status];
                  return (
                    <tr key={po.id} style={{ borderBottom: i < POS.length - 1 ? '1px solid #F5F2FB' : 'none' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FDFCFF'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <td className="px-6 py-3.5 text-sm font-semibold" style={{ color: '#5D4037' }}>{po.id}</td>
                      <td className="px-6 py-3.5 text-sm" style={{ color: '#433C50' }}>{po.supplier}</td>
                      <td className="px-6 py-3.5 text-sm" style={{ color: '#A5A3AE' }}>{po.date}</td>
                      <td className="px-6 py-3.5 text-sm font-semibold" style={{ color: '#433C50' }}>{po.total}</td>
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
