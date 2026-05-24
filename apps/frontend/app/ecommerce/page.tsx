'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import AppShell, { NavItem } from '../../components/layout/AppShell';
import {
  Globe, BarChart2, ShoppingCart, Package, Users, Tag,
  TrendingUp, Settings, Star, Eye, CheckCircle, Clock,
} from 'lucide-react';

const NAV: NavItem[] = [
  { label: 'Dashboard',   href: '/ecommerce',            icon: BarChart2 },
  { label: 'Order Online', href: '/ecommerce/orders',    icon: ShoppingCart, badge: 15,
    children: [
      { label: 'Semua',     href: '/ecommerce/orders' },
      { label: 'Baru',      href: '/ecommerce/orders?status=new' },
      { label: 'Diproses',  href: '/ecommerce/orders?status=processing' },
      { label: 'Dikirim',   href: '/ecommerce/orders?status=shipped' },
    ],
  },
  { label: 'Produk',      href: '/ecommerce/products',   icon: Package },
  { label: 'Pelanggan',   href: '/ecommerce/customers',  icon: Users },
  { label: 'Promosi',     href: '/ecommerce/promotions', icon: Tag },
  { label: 'Ulasan',      href: '/ecommerce/reviews',    icon: Star, badge: 4 },
  { label: 'Laporan',     href: '/ecommerce/reports',    icon: TrendingUp },
  { label: 'Pengaturan',  href: '/ecommerce/settings',   icon: Settings },
];

const STATS = [
  { label: 'Order Hari Ini',    value: '47',         sub: '+8 vs kemarin',         color: '#00897B', bg: 'rgba(0,137,123,.1)',   icon: ShoppingCart },
  { label: 'Revenue Hari Ini',  value: 'Rp 28.4 Jt', sub: '+14.2% vs kemarin',    color: '#4CAF50', bg: 'rgba(76,175,80,.1)',   icon: TrendingUp },
  { label: 'Pengunjung',        value: '1.842',       sub: 'Hari ini',             color: '#2196F3', bg: 'rgba(33,150,243,.1)',  icon: Eye },
  { label: 'Konversi',          value: '2.55%',       sub: '+0.3% vs kemarin',     color: '#FF9800', bg: 'rgba(255,152,0,.1)',   icon: TrendingUp },
];

const ORDERS = [
  { id: 'OL-5521', customer: 'Hendra Gunawan',     items: 3, total: 'Rp 1.240.000', channel: 'Website',   status: 'new',        date: '24 Mei 11:32' },
  { id: 'OL-5520', customer: 'Maya Sari',           items: 1, total: 'Rp 450.000',  channel: 'Tokopedia', status: 'processing', date: '24 Mei 10:15' },
  { id: 'OL-5519', customer: 'Bambang Susilo',      items: 5, total: 'Rp 2.780.000', channel: 'Shopee',   status: 'shipped',    date: '24 Mei 09:42' },
  { id: 'OL-5518', customer: 'Dewi Rahayu',         items: 2, total: 'Rp 890.000',  channel: 'Website',   status: 'shipped',    date: '23 Mei 16:20' },
  { id: 'OL-5517', customer: 'Fajar Nugroho',       items: 4, total: 'Rp 3.120.000', channel: 'Lazada',   status: 'delivered',  date: '23 Mei 14:50' },
  { id: 'OL-5516', customer: 'Lia Permata',         items: 1, total: 'Rp 320.000',  channel: 'Shopee',   status: 'delivered',  date: '23 Mei 11:00' },
];

const TOP_PRODUCTS = [
  { name: 'Semen Portland 40kg',  sold: 124, revenue: 'Rp 6.200.000', rating: 4.8 },
  { name: 'Cat Tembok Dulux 5L',  sold: 87,  revenue: 'Rp 4.785.000', rating: 4.7 },
  { name: 'Keramik 60x60 Putih',  sold: 63,  revenue: 'Rp 5.040.000', rating: 4.5 },
  { name: 'Pipa PVC 4 inch',       sold: 58,  revenue: 'Rp 2.030.000', rating: 4.6 },
];

const CHANNELS = [
  { name: 'Website',   orders: 18, share: 38, color: '#00897B' },
  { name: 'Shopee',    orders: 14, share: 30, color: '#EE4D2D' },
  { name: 'Tokopedia', orders: 9,  share: 19, color: '#03AC0E' },
  { name: 'Lazada',    orders: 6,  share: 13, color: '#0F146D' },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  new:        { label: 'Baru',      color: '#2196F3', bg: 'rgba(33,150,243,.1)',  icon: Clock },
  processing: { label: 'Diproses',  color: '#FF9800', bg: 'rgba(255,152,0,.1)',   icon: Package },
  shipped:    { label: 'Dikirim',   color: '#9C27B0', bg: 'rgba(156,39,176,.1)',  icon: Globe },
  delivered:  { label: 'Terkirim',  color: '#4CAF50', bg: 'rgba(76,175,80,.1)',   icon: CheckCircle },
};

export default function EcommerceDashboard() {
  const { token } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;

  return (
    <AppShell
      appName="E-Commerce"
      appColor="#00897B"
      appGradient="from-teal-600 to-emerald-700"
      appIcon={Globe}
      navItems={NAV}
      activeHref="/ecommerce"
    >
      <div className="p-6 space-y-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl border" style={{ borderColor: '#EDE8F5' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#EDE8F5' }}>
              <h2 className="font-bold text-sm" style={{ color: '#2F2B3D' }}>Order Terbaru</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,137,123,.1)', color: '#00897B' }}>47 hari ini</span>
            </div>
            <div className="divide-y" style={{ borderColor: '#EDE8F5' }}>
              {ORDERS.map(o => {
                const st = STATUS_MAP[o.status];
                const Icon = st.icon;
                return (
                  <div key={o.id} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0" style={{ backgroundColor: st.bg }}>
                      <Icon className="h-4 w-4" style={{ color: st.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold" style={{ color: '#00897B' }}>{o.id}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: '#EDE8F5', color: '#714B67' }}>{o.channel}</span>
                      </div>
                      <p className="text-[11px] mt-0.5" style={{ color: '#A5A3AE' }}>{o.customer} · {o.items} item · {o.date}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold" style={{ color: '#2F2B3D' }}>{o.total}</p>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: st.bg, color: st.color }}>{st.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            {/* Channel breakdown */}
            <div className="bg-white rounded-2xl border" style={{ borderColor: '#EDE8F5' }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: '#EDE8F5' }}>
                <h2 className="font-bold text-sm" style={{ color: '#2F2B3D' }}>Channel Penjualan</h2>
              </div>
              <div className="px-5 py-4 space-y-3">
                {CHANNELS.map(ch => (
                  <div key={ch.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold" style={{ color: '#2F2B3D' }}>{ch.name}</span>
                      <span style={{ color: '#A5A3AE' }}>{ch.orders} order ({ch.share}%)</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ backgroundColor: '#EDE8F5' }}>
                      <div className="h-2 rounded-full" style={{ width: `${ch.share}%`, backgroundColor: ch.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top products */}
            <div className="bg-white rounded-2xl border" style={{ borderColor: '#EDE8F5' }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: '#EDE8F5' }}>
                <h2 className="font-bold text-sm" style={{ color: '#2F2B3D' }}>Produk Terlaris</h2>
              </div>
              <div className="divide-y" style={{ borderColor: '#EDE8F5' }}>
                {TOP_PRODUCTS.map(p => (
                  <div key={p.name} className="px-5 py-3">
                    <p className="text-xs font-semibold truncate" style={{ color: '#2F2B3D' }}>{p.name}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[11px]" style={{ color: '#A5A3AE' }}>{p.sold} terjual</span>
                      <div className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-[11px] font-semibold" style={{ color: '#FF9800' }}>{p.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
