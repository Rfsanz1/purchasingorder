'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import AppShell, { NavItem } from '../../components/layout/AppShell';
import {
  Store, BarChart2, RefreshCw, Package, AlertTriangle,
  Settings, CheckCircle, Clock, XCircle, TrendingUp,
  ShoppingCart, Tag, Zap, Globe,
} from 'lucide-react';

const NAV: NavItem[] = [
  { label: 'Dashboard',     href: '/marketplace',              icon: BarChart2 },
  { label: 'Shopee',        href: '/marketplace/shopee',       icon: Store,
    children: [
      { label: 'Order Shopee',  href: '/marketplace/shopee/orders' },
      { label: 'Produk Shopee', href: '/marketplace/shopee/products' },
      { label: 'Sinkronisasi',  href: '/marketplace/shopee/sync' },
    ],
  },
  { label: 'Tokopedia',     href: '/marketplace/tokopedia',    icon: Store,
    children: [
      { label: 'Order Tokopedia',  href: '/marketplace/tokopedia/orders' },
      { label: 'Produk Tokopedia', href: '/marketplace/tokopedia/products' },
      { label: 'Sinkronisasi',     href: '/marketplace/tokopedia/sync' },
    ],
  },
  { label: 'TikTok Shop',   href: '/marketplace/tiktok',       icon: Store,
    children: [
      { label: 'Order TikTok',  href: '/marketplace/tiktok/orders' },
      { label: 'Produk TikTok', href: '/marketplace/tiktok/products' },
      { label: 'Live Commerce', href: '/marketplace/tiktok/live' },
    ],
  },
  { label: 'Mapping SKU',   href: '/marketplace/sku',          icon: Tag },
  { label: 'Queue Sync',    href: '/marketplace/queue',        icon: RefreshCw, badge: 3 },
  { label: 'Error Sync',    href: '/marketplace/errors',       icon: AlertTriangle, badge: 7 },
  { label: 'Laporan',       href: '/marketplace/reports',      icon: TrendingUp },
  { label: 'Pengaturan',    href: '/marketplace/settings',     icon: Settings },
];

const CHANNELS = [
  { name: 'Shopee',    color: '#EE4D2D', bg: 'rgba(238,77,45,.1)',   orders: 142, revenue: 'Rp 87.4 Jt',  products: 384, synced: true,  icon: '🛍️' },
  { name: 'Tokopedia', color: '#03AC0E', bg: 'rgba(3,172,14,.1)',    orders: 98,  revenue: 'Rp 62.1 Jt',  products: 391, synced: true,  icon: '🟢' },
  { name: 'TikTok Shop', color: '#212121', bg: 'rgba(33,33,33,.08)', orders: 67,  revenue: 'Rp 41.8 Jt',  products: 218, synced: false, icon: '🎵' },
];

const STATS = [
  { label: 'Total Order Hari Ini', value: '307',         sub: '+41 vs kemarin',         color: '#E91E63', bg: 'rgba(233,30,99,.1)',   icon: ShoppingCart },
  { label: 'Revenue Gabungan',     value: 'Rp 191.3 Jt', sub: '3 marketplace aktif',   color: '#4CAF50', bg: 'rgba(76,175,80,.1)',   icon: TrendingUp },
  { label: 'Stok Tersinkron',      value: '993',          sub: 'Dari 1.248 produk',     color: '#2196F3', bg: 'rgba(33,150,243,.1)',  icon: Package },
  { label: 'Error Sync',           value: '7',            sub: '3 perlu perhatian',     color: '#EA5455', bg: 'rgba(234,84,85,.1)',   icon: AlertTriangle },
];

const RECENT_ORDERS = [
  { id: 'SHP-88221', channel: 'Shopee',    customer: 'Budi S.',      product: 'Samsung Galaxy A55',  qty: 1, total: 'Rp 5.299.000', status: 'new',       time: '11:32' },
  { id: 'TKP-45112', channel: 'Tokopedia', customer: 'Maya R.',      product: 'Earphone TWS Pro',    qty: 2, total: 'Rp 598.000',   status: 'processing', time: '11:20' },
  { id: 'TTK-12034', channel: 'TikTok',   customer: 'Eko F.',        product: 'Powerbank 20000mAh',  qty: 1, total: 'Rp 249.000',   status: 'new',       time: '11:15' },
  { id: 'SHP-88220', channel: 'Shopee',    customer: 'Lina K.',      product: 'iPhone 15 Case',      qty: 3, total: 'Rp 447.000',   status: 'shipped',   time: '10:58' },
  { id: 'TKP-45111', channel: 'Tokopedia', customer: 'Dion P.',      product: 'Charger GaN 65W',     qty: 1, total: 'Rp 389.000',   status: 'shipped',   time: '10:42' },
  { id: 'SHP-88219', channel: 'Shopee',    customer: 'Sari W.',      product: 'Laptop Stand Aluminium', qty: 1, total: 'Rp 199.000', status: 'delivered', time: '09:30' },
];

const SYNC_QUEUE = [
  { id: 'Q-001', type: 'Stok Update',  channel: 'Shopee',    items: 48, status: 'running', progress: 72 },
  { id: 'Q-002', type: 'Harga Update', channel: 'Tokopedia', items: 120, status: 'queued', progress: 0 },
  { id: 'Q-003', type: 'Order Pull',   channel: 'TikTok',    items: 23, status: 'error',  progress: 0 },
];

const SYNC_ERRORS = [
  { sku: 'ELC-1024', product: 'Samsung 65" Crystal UHD TV', channel: 'TikTok',   error: 'Stok tidak valid (negatif)', time: '10:15' },
  { sku: 'ELC-0892', product: 'Xiaomi Robot Vacuum S10',   channel: 'Shopee',    error: 'Kategori tidak terpetakan', time: '09:42' },
  { sku: 'ELC-0441', product: 'Apple AirPods Pro 2nd Gen', channel: 'Tokopedia', error: 'Harga di bawah minimum', time: '08:55' },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  new:        { label: 'Baru',     color: '#2196F3', bg: 'rgba(33,150,243,.1)' },
  processing: { label: 'Diproses', color: '#FF9800', bg: 'rgba(255,152,0,.1)' },
  shipped:    { label: 'Dikirim',  color: '#9C27B0', bg: 'rgba(156,39,176,.1)' },
  delivered:  { label: 'Terkirim', color: '#4CAF50', bg: 'rgba(76,175,80,.1)' },
};

const CHANNEL_COLOR: Record<string, { color: string; bg: string }> = {
  Shopee:    { color: '#EE4D2D', bg: 'rgba(238,77,45,.08)' },
  Tokopedia: { color: '#03AC0E', bg: 'rgba(3,172,14,.08)' },
  TikTok:    { color: '#212121', bg: 'rgba(33,33,33,.06)' },
};

export default function MarketplaceDashboard() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'sync' | 'errors'>('orders');
  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;

  return (
    <AppShell
      appName="Marketplace"
      appColor="#E91E63"
      appGradient="from-pink-500 to-rose-600"
      appIcon={Store}
      navItems={NAV}
      activeHref="/marketplace"
    >
      <div className="p-6 space-y-6">
        {/* Channel status cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CHANNELS.map(ch => (
            <div key={ch.name} className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#EDE8F5' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{ch.icon}</span>
                  <span className="font-bold text-sm" style={{ color: '#2F2B3D' }}>{ch.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ch.synced ? '#4CAF50' : '#FF9800', boxShadow: `0 0 6px ${ch.synced ? '#4CAF50' : '#FF9800'}` }} />
                  <span className="text-[10px] font-semibold" style={{ color: ch.synced ? '#4CAF50' : '#FF9800' }}>{ch.synced ? 'Tersinkron' : 'Partial'}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl py-2" style={{ backgroundColor: ch.bg }}>
                  <p className="text-sm font-bold" style={{ color: ch.color }}>{ch.orders}</p>
                  <p className="text-[10px]" style={{ color: '#A5A3AE' }}>Order</p>
                </div>
                <div className="rounded-xl py-2" style={{ backgroundColor: ch.bg }}>
                  <p className="text-[10px] font-bold" style={{ color: ch.color }}>{ch.products}</p>
                  <p className="text-[10px]" style={{ color: '#A5A3AE' }}>Produk</p>
                </div>
                <div className="rounded-xl py-2" style={{ backgroundColor: ch.bg }}>
                  <p className="text-[9px] font-bold" style={{ color: ch.color }}>{ch.revenue}</p>
                  <p className="text-[10px]" style={{ color: '#A5A3AE' }}>Revenue</p>
                </div>
              </div>
              <button className="w-full mt-3 py-1.5 rounded-xl text-xs font-semibold border" style={{ borderColor: ch.color, color: ch.color, backgroundColor: ch.bg }}>
                <RefreshCw className="inline h-3 w-3 mr-1" /> Sync Sekarang
              </button>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#EDE8F5' }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium" style={{ color: '#A5A3AE' }}>{s.label}</p>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: s.bg }}>
                    <Icon className="h-5 w-5" style={{ color: s.color }} />
                  </div>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#2F2B3D' }}>{s.value}</p>
                <p className="text-xs mt-1" style={{ color: '#A5A3AE' }}>{s.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#EDE8F5' }}>
          <div className="flex border-b" style={{ borderColor: '#EDE8F5' }}>
            {[
              { key: 'orders', label: 'Order Terbaru', count: 307 },
              { key: 'sync',   label: 'Queue Sync',    count: 3 },
              { key: 'errors', label: 'Error Sync',    count: 7 },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all"
                style={{ borderBottomColor: activeTab === tab.key ? '#E91E63' : 'transparent', color: activeTab === tab.key ? '#E91E63' : '#A5A3AE' }}
              >
                {tab.label}
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: activeTab === tab.key ? 'rgba(233,30,99,.1)' : '#F5F4F9', color: activeTab === tab.key ? '#E91E63' : '#A5A3AE' }}>
                  {tab.count}
                </span>
              </button>
            ))}
            <div className="ml-auto flex items-center px-5">
              <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#E91E63', color: '#fff' }}>
                <RefreshCw className="h-3 w-3" /> Sync Semua
              </button>
            </div>
          </div>

          {activeTab === 'orders' && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid #EDE8F5' }}>
                    {['Order ID', 'Channel', 'Pelanggan', 'Produk', 'Qty', 'Total', 'Status', 'Waktu'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: '#A5A3AE' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_ORDERS.map(o => {
                    const st = STATUS_MAP[o.status];
                    const ch = CHANNEL_COLOR[o.channel];
                    return (
                      <tr key={o.id} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: '#F5F4F9' }}>
                        <td className="px-4 py-3 font-bold" style={{ color: '#E91E63' }}>{o.id}</td>
                        <td className="px-4 py-3"><span className="font-semibold px-2 py-0.5 rounded-full text-[10px]" style={{ backgroundColor: ch.bg, color: ch.color }}>{o.channel}</span></td>
                        <td className="px-4 py-3 font-medium" style={{ color: '#2F2B3D' }}>{o.customer}</td>
                        <td className="px-4 py-3 max-w-[200px] truncate" style={{ color: '#6D6777' }}>{o.product}</td>
                        <td className="px-4 py-3 text-center font-semibold" style={{ color: '#2F2B3D' }}>{o.qty}</td>
                        <td className="px-4 py-3 font-bold" style={{ color: '#2F2B3D' }}>{o.total}</td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full font-semibold text-[10px]" style={{ backgroundColor: st.bg, color: st.color }}>{st.label}</span></td>
                        <td className="px-4 py-3" style={{ color: '#A5A3AE' }}>{o.time}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="p-5 space-y-3">
              {SYNC_QUEUE.map(q => (
                <div key={q.id} className="rounded-xl border p-4 flex items-center gap-4" style={{ borderColor: '#EDE8F5' }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-bold text-xs" style={{ color: '#2F2B3D' }}>{q.type}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: CHANNEL_COLOR[q.channel].bg, color: CHANNEL_COLOR[q.channel].color }}>{q.channel}</span>
                      <span className="text-[10px]" style={{ color: '#A5A3AE' }}>{q.items} item</span>
                    </div>
                    {q.status === 'running' && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: '#EDE8F5' }}>
                          <div className="h-2 rounded-full animate-pulse" style={{ width: `${q.progress}%`, backgroundColor: '#E91E63' }} />
                        </div>
                        <span className="text-[10px] font-bold" style={{ color: '#E91E63' }}>{q.progress}%</span>
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${q.status === 'running' ? 'bg-blue-50 text-blue-600' : q.status === 'error' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                    {q.status === 'running' ? 'Berjalan' : q.status === 'error' ? 'Error' : 'Antrian'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'errors' && (
            <div className="p-5 space-y-3">
              {SYNC_ERRORS.map(e => (
                <div key={e.sku} className="rounded-xl border p-4 flex items-start gap-3" style={{ borderColor: '#FFCDD2', backgroundColor: '#FFF5F5' }}>
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: '#EA5455' }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xs" style={{ color: '#2F2B3D' }}>{e.sku}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: CHANNEL_COLOR[e.channel].bg, color: CHANNEL_COLOR[e.channel].color }}>{e.channel}</span>
                    </div>
                    <p className="text-xs truncate" style={{ color: '#6D6777' }}>{e.product}</p>
                    <p className="text-[11px] mt-0.5 font-medium" style={{ color: '#EA5455' }}>{e.error}</p>
                  </div>
                  <button className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#EA5455', color: '#fff' }}>Perbaiki</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
