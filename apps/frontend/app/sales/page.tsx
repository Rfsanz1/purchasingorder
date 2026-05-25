'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import AppShell, { NavItem } from '../../components/layout/AppShell';
import {
  ShoppingCart, FileText, Users, BarChart2, TrendingUp, Settings,
  Plus, Search, RefreshCw, ArrowUpRight, Clock, CheckCircle, XCircle,
  Package, Store, Truck, DollarSign, Star, Monitor, Send,
} from 'lucide-react';

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
  { label: 'CRM',             href: '/crm',              icon: Star },
  { label: 'POS',             href: '/pos',              icon: Monitor },
  { label: 'Marketplace',     href: '/marketplace',      icon: Store },
  { label: 'Pengiriman',      href: '/delivery',         icon: Truck },
  { label: 'Laporan',         href: '/sales/reports',    icon: TrendingUp },
  { label: 'Pengaturan',      href: '/sales/settings',   icon: Settings },
];

const STATS = [
  { label: 'Order Bulan Ini',    value: '128',       sub: '+12% vs bulan lalu',      icon: ShoppingCart, color: '#00BCD4', bg: 'rgba(0,188,212,.1)' },
  { label: 'Revenue Bulan Ini',  value: 'Rp 284 Jt', sub: '+8.3% vs bulan lalu',    icon: TrendingUp,   color: '#4CAF50', bg: 'rgba(76,175,80,.1)' },
  { label: 'Invoice Belum Bayar', value: '23',       sub: 'Rp 48 Jt outstanding',   icon: FileText,     color: '#FF9800', bg: 'rgba(255,152,0,.1)' },
  { label: 'Pelanggan Aktif',    value: '342',        sub: '+5 bulan ini',           icon: Users,        color: '#9C27B0', bg: 'rgba(156,39,176,.1)' },
];

const RECENT_ORDERS = [
  { id: 'SO-0128', customer: 'PT Maju Jaya',       date: '24 Mei 2026', total: 'Rp 12.400.000', status: 'confirmed' },
  { id: 'SO-0127', customer: 'CV Berkah Abadi',    date: '23 Mei 2026', total: 'Rp 6.750.000',  status: 'draft' },
  { id: 'SO-0126', customer: 'Toko Sumber Rejeki', date: '23 Mei 2026', total: 'Rp 3.200.000',  status: 'invoiced' },
  { id: 'SO-0125', customer: 'UD Karya Mandiri',   date: '22 Mei 2026', total: 'Rp 9.850.000',  status: 'confirmed' },
  { id: 'SO-0124', customer: 'PT Global Niaga',    date: '21 Mei 2026', total: 'Rp 21.000.000', status: 'cancelled' },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  draft:     { label: 'Draft',        color: '#A5A3AE', bg: 'rgba(165,163,174,.12)', icon: Clock },
  confirmed: { label: 'Dikonfirmasi', color: '#00BCD4', bg: 'rgba(0,188,212,.1)',    icon: CheckCircle },
  invoiced:  { label: 'Ditagih',      color: '#4CAF50', bg: 'rgba(76,175,80,.1)',    icon: FileText },
  cancelled: { label: 'Dibatalkan',   color: '#EA5455', bg: 'rgba(234,84,85,.1)',    icon: XCircle },
};

const CRM_PIPELINE = [
  { stage: 'Prospek',     count: 24, value: 'Rp 84 Jt',  color: '#2196F3', pct: 100 },
  { stage: 'Kualifikasi', count: 16, value: 'Rp 62 Jt',  color: '#9C27B0', pct: 67 },
  { stage: 'Proposal',    count: 9,  value: 'Rp 41 Jt',  color: '#FF9800', pct: 38 },
  { stage: 'Negosiasi',   count: 5,  value: 'Rp 28 Jt',  color: '#E91E63', pct: 21 },
  { stage: 'Closing',     count: 3,  value: 'Rp 18 Jt',  color: '#4CAF50', pct: 13 },
];

const INVOICES = [
  { id: 'INV-0248', customer: 'PT Maju Jaya',    due: '28 Mei 2026', amount: 'Rp 12.400.000', overdue: false },
  { id: 'INV-0247', customer: 'CV Berkah Abadi', due: '20 Mei 2026', amount: 'Rp 6.750.000',  overdue: true },
  { id: 'INV-0246', customer: 'UD Karya Mandiri',due: '18 Mei 2026', amount: 'Rp 9.850.000',  overdue: true },
  { id: 'INV-0245', customer: 'PT Global Niaga', due: '30 Mei 2026', amount: 'Rp 21.000.000', overdue: false },
];

const MARKETPLACE = [
  { name: 'Shopee',    orders: 48, revenue: 'Rp 38 Jt', sync: 'ok',    badge: '⭐ 4.9' },
  { name: 'Tokopedia', orders: 32, revenue: 'Rp 26 Jt', sync: 'ok',    badge: '⭐ 4.8' },
  { name: 'TikTok Shop',orders: 18, revenue: 'Rp 14 Jt', sync: 'error', badge: '⭐ 4.7' },
];

const POS_TODAY = { transactions: 42, revenue: 'Rp 6.8 Jt', avg: 'Rp 162K', topItem: 'Cat Tembok 5L' };

export default function SalesDashboard() {
  const { token } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;

  return (
    <AppShell appName="Penjualan" appColor="#00ACC1" appGradient="from-cyan-500 to-cyan-700" appIcon={ShoppingCart} navItems={NAV} activeHref="/sales">
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
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#00ACC1' }} onClick={() => router.push('/sales/orders')}>
              <Plus className="h-4 w-4" /> Order Baru
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium" style={{ color: '#A5A3AE' }}>{s.label}</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: '#433C50' }}>{s.value}</p>
                  <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#4CAF50' }}><ArrowUpRight className="h-3 w-3" />{s.sub}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0" style={{ backgroundColor: s.bg }}>
                  <s.icon className="h-5 w-5" style={{ color: s.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: CRM Pipeline + POS Today */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* CRM Pipeline */}
          <div className="lg:col-span-2 bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" style={{ color: '#9C27B0' }} />
                <h2 className="text-sm font-bold" style={{ color: '#433C50' }}>CRM Pipeline</h2>
              </div>
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: '#9C27B0', border: '1px solid rgba(156,39,176,.2)', backgroundColor: 'rgba(156,39,176,.06)' }} onClick={() => router.push('/crm')}>
                Buka CRM
              </button>
            </div>
            <div className="p-6 space-y-3">
              {CRM_PIPELINE.map((p) => (
                <div key={p.stage}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold" style={{ color: '#433C50' }}>{p.stage}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: p.color + '15', color: p.color }}>{p.count} deal</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: '#433C50' }}>{p.value}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: '#F5F2FB' }}>
                    <div className="h-2 rounded-full transition-all" style={{ width: `${p.pct}%`, backgroundColor: p.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* POS Today */}
          <div className="bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4" style={{ color: '#00ACC1' }} />
                <h2 className="text-sm font-bold" style={{ color: '#433C50' }}>POS Hari Ini</h2>
              </div>
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: '#00ACC1', border: '1px solid rgba(0,172,193,.2)', backgroundColor: 'rgba(0,172,193,.06)' }} onClick={() => router.push('/pos')}>
                Buka POS
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Transaksi', value: String(POS_TODAY.transactions), icon: ShoppingCart, color: '#00ACC1' },
                { label: 'Revenue',   value: POS_TODAY.revenue,              icon: DollarSign,  color: '#4CAF50' },
                { label: 'Rata-rata', value: POS_TODAY.avg,                  icon: TrendingUp,  color: '#9C27B0' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between rounded-xl p-3" style={{ backgroundColor: '#FDFCFF', border: '1px solid #F5F2FB' }}>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: item.color + '15' }}>
                      <item.icon className="h-4 w-4" style={{ color: item.color }} />
                    </div>
                    <span className="text-xs" style={{ color: '#A5A3AE' }}>{item.label}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: '#433C50' }}>{item.value}</span>
                </div>
              ))}
              <div className="rounded-xl p-3" style={{ backgroundColor: '#E0F7FA', border: '1px solid #B2EBF2' }}>
                <p className="text-[10px]" style={{ color: '#00838F' }}>Produk Terlaris</p>
                <p className="text-xs font-bold mt-0.5" style={{ color: '#00ACC1' }}>{POS_TODAY.topItem}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Recent Orders + Invoice */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
              <h2 className="text-sm font-bold" style={{ color: '#433C50' }}>Order Terbaru</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#B0AAB9' }} />
                  <input className="rounded-lg pl-8 pr-3 py-1.5 text-xs" style={{ border: '1px solid #EDE8F5', color: '#433C50', outline: 'none', width: 140 }} placeholder="Cari order..." />
                </div>
                <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: '#00ACC1', border: '1px solid rgba(0,172,193,.2)', backgroundColor: 'rgba(0,172,193,.06)' }} onClick={() => router.push('/sales/orders')}>Lihat Semua</button>
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
                      <tr key={o.id} style={{ borderBottom: i < RECENT_ORDERS.length - 1 ? '1px solid #F5F2FB' : 'none' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FDFCFF'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                        <td className="px-6 py-3 text-sm font-semibold" style={{ color: '#00ACC1' }}>{o.id}</td>
                        <td className="px-6 py-3 text-sm" style={{ color: '#433C50' }}>{o.customer}</td>
                        <td className="px-6 py-3 text-xs" style={{ color: '#A5A3AE' }}>{o.date}</td>
                        <td className="px-6 py-3 text-sm font-semibold" style={{ color: '#433C50' }}>{o.total}</td>
                        <td className="px-6 py-3">
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

          {/* Invoice Piutang */}
          <div className="bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" style={{ color: '#FF9800' }} />
                <h2 className="text-sm font-bold" style={{ color: '#433C50' }}>Invoice & Piutang</h2>
              </div>
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: '#FF9800', border: '1px solid rgba(255,152,0,.2)', backgroundColor: 'rgba(255,152,0,.06)' }} onClick={() => router.push('/invoice')}>
                Lihat Semua
              </button>
            </div>
            <div className="p-4 space-y-2.5">
              {INVOICES.map((inv) => (
                <div key={inv.id} className="rounded-xl p-3.5" style={{ backgroundColor: inv.overdue ? 'rgba(234,84,85,.04)' : '#FDFCFF', border: `1px solid ${inv.overdue ? 'rgba(234,84,85,.2)' : '#F5F2FB'}` }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: inv.overdue ? '#EA5455' : '#433C50' }}>{inv.id}</span>
                    {inv.overdue && <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: 'rgba(234,84,85,.1)', color: '#EA5455' }}>Overdue</span>}
                  </div>
                  <p className="text-[10px] mt-0.5" style={{ color: '#A5A3AE' }}>{inv.customer}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs font-bold" style={{ color: '#433C50' }}>{inv.amount}</span>
                    <span className="text-[10px]" style={{ color: inv.overdue ? '#EA5455' : '#A5A3AE' }}>Jatuh {inv.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 4: Marketplace + Pengiriman */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Marketplace */}
          <div className="bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4" style={{ color: '#E91E63' }} />
                <h2 className="text-sm font-bold" style={{ color: '#433C50' }}>Marketplace Hari Ini</h2>
              </div>
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: '#E91E63', border: '1px solid rgba(233,30,99,.2)', backgroundColor: 'rgba(233,30,99,.06)' }} onClick={() => router.push('/marketplace')}>
                Kelola
              </button>
            </div>
            <div className="p-4 space-y-2">
              {MARKETPLACE.map((mp) => (
                <div key={mp.name} className="flex items-center justify-between rounded-xl p-3.5" style={{ backgroundColor: '#FDFCFF', border: '1px solid #F5F2FB' }}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(233,30,99,.08)' }}>
                      <Store className="h-4 w-4" style={{ color: '#E91E63' }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold" style={{ color: '#433C50' }}>{mp.name}</p>
                      <p className="text-[10px]" style={{ color: '#A5A3AE' }}>{mp.badge} · {mp.orders} order</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: '#433C50' }}>{mp.revenue}</p>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: mp.sync === 'ok' ? 'rgba(76,175,80,.1)' : 'rgba(234,84,85,.1)', color: mp.sync === 'ok' ? '#4CAF50' : '#EA5455' }}>
                      {mp.sync === 'ok' ? '● Sync' : '● Error sync'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pengiriman Hari Ini */}
          <div className="bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" style={{ color: '#2196F3' }} />
                <h2 className="text-sm font-bold" style={{ color: '#433C50' }}>Pengiriman & Armada</h2>
              </div>
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: '#2196F3', border: '1px solid rgba(33,150,243,.2)', backgroundColor: 'rgba(33,150,243,.06)' }} onClick={() => router.push('/delivery')}>
                Kelola
              </button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              {[
                { label: 'Perlu Dikirim',   value: '18', color: '#FF9800', bg: 'rgba(255,152,0,.1)',   icon: Send },
                { label: 'Dalam Perjalanan',value: '12', color: '#2196F3', bg: 'rgba(33,150,243,.1)',  icon: Truck },
                { label: 'Tiba Hari Ini',   value: '7',  color: '#4CAF50', bg: 'rgba(76,175,80,.1)',   icon: CheckCircle },
                { label: 'Armada Aktif',    value: '5',  color: '#9C27B0', bg: 'rgba(156,39,176,.1)',  icon: Users },
              ].map(item => (
                <div key={item.label} className="rounded-xl p-4 flex flex-col gap-2" style={{ backgroundColor: '#FDFCFF', border: '1px solid #F5F2FB' }}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: item.bg }}>
                    <item.icon className="h-4 w-4" style={{ color: item.color }} />
                  </div>
                  <p className="text-2xl font-bold" style={{ color: '#433C50' }}>{item.value}</p>
                  <p className="text-[10px] leading-tight" style={{ color: '#A5A3AE' }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
