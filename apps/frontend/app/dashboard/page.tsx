'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../lib/store/useAuthStore';
import { OdooLayout } from '../../components/layout/OdooLayout';
import {
  TrendingUp, TrendingDown, ShoppingCart, Package, DollarSign,
  Users, FileText, AlertTriangle, CheckCircle, Clock, BarChart2,
  ArrowUpRight, ArrowDownRight, Activity, Zap, RefreshCw,
  ShoppingBag, Truck, Brain, Target, Star,
} from 'lucide-react';

const KPI = [
  { label: 'Revenue Hari Ini', value: 'Rp 4,2 M', change: '+12.5%', up: true, icon: DollarSign, color: '#22C55E', bg: '#F0FDF4' },
  { label: 'Total Order', value: '547', change: '+8.3%', up: true, icon: ShoppingCart, color: '#3B82F6', bg: '#EFF6FF' },
  { label: 'Invoice Outstanding', value: 'Rp 18,7 M', change: '-5.2%', up: false, icon: FileText, color: '#F59E0B', bg: '#FFFBEB' },
  { label: 'Pelanggan Aktif', value: '1,284', change: '+3.1%', up: true, icon: Users, color: '#8B5CF6', bg: '#F5F3FF' },
  { label: 'Stok Rendah', value: '23 Item', change: '+4 baru', up: false, icon: Package, color: '#EF4444', bg: '#FEF2F2' },
  { label: 'PO Pending', value: '12', change: '+2 hari ini', up: true, icon: Truck, color: '#14B8A6', bg: '#F0FDFA' },
];

const RECENT_ORDERS = [
  { id: 'SO-2026-1842', customer: 'PT Sinar Jaya', amount: 'Rp 4.500.000', status: 'Dikonfirmasi', date: '26 Mei 2026', color: '#22C55E' },
  { id: 'SO-2026-1841', customer: 'CV Maju Bersama', amount: 'Rp 1.250.000', status: 'Menunggu', date: '26 Mei 2026', color: '#F59E0B' },
  { id: 'SO-2026-1840', customer: 'UD Berkah Jaya', amount: 'Rp 8.750.000', status: 'Terkirim', date: '25 Mei 2026', color: '#3B82F6' },
  { id: 'SO-2026-1839', customer: 'PT Indah Lestari', amount: 'Rp 2.100.000', status: 'Dikonfirmasi', date: '25 Mei 2026', color: '#22C55E' },
  { id: 'SO-2026-1838', customer: 'Toko Sejahtera', amount: 'Rp 675.000', status: 'Draft', date: '24 Mei 2026', color: '#6B7280' },
];

const ALERTS = [
  { msg: 'Stok Semen Portland hampir habis (5 sak tersisa)', type: 'danger', href: '/inventory/products' },
  { msg: '7 invoice jatuh tempo dalam 3 hari ke depan', type: 'warning', href: '/invoice/aging' },
  { msg: 'Approval PO-2026-0048 menunggu persetujuan', type: 'info', href: '/purchasing/approval-matrix' },
  { msg: '3 error sync Marketplace Shopee hari ini', type: 'danger', href: '/marketplace/sync-logs' },
];

const QUICK_ACTIONS = [
  { label: 'Buat Quotation', href: '/sales/quotations', icon: FileText, color: '#3B82F6' },
  { label: 'Terima Pembayaran', href: '/invoice/payments', icon: DollarSign, color: '#22C55E' },
  { label: 'Transfer Stok', href: '/inventory/transfers', icon: Package, color: '#8B5CF6' },
  { label: 'Buat Purchase Order', href: '/purchasing/purchase-orders', icon: Truck, color: '#F59E0B' },
  { label: 'AI Assistant', href: '/ai/chatbot', icon: Brain, color: '#714B67' },
  { label: 'Laporan Harian', href: '/reports/sales', icon: BarChart2, color: '#14B8A6' },
];

const TOP_PRODUCTS = [
  { name: 'Semen Portland 50kg', sold: 840, revenue: 'Rp 42 M', pct: 85 },
  { name: 'Bata Merah (ikat)', sold: 520, revenue: 'Rp 18,2 M', pct: 65 },
  { name: 'Pasir Cor (m³)', sold: 380, revenue: 'Rp 11,4 M', pct: 50 },
  { name: 'Cat Tembok 25kg', sold: 290, revenue: 'Rp 8,7 M', pct: 38 },
  { name: 'Besi Beton 10mm', sold: 210, revenue: 'Rp 6,3 M', pct: 28 },
];

const MONTHLY_DATA = [
  { month: 'Jan', revenue: 62, order: 48 },
  { month: 'Feb', revenue: 58, order: 44 },
  { month: 'Mar', revenue: 75, order: 62 },
  { month: 'Apr', revenue: 82, order: 71 },
  { month: 'Mei', revenue: 95, order: 84 },
  { month: 'Jun', revenue: 88, order: 78 },
];

function MiniBarChart({ data }: { data: { month: string; revenue: number; order: number }[] }) {
  const maxRev = Math.max(...data.map(d => d.revenue));
  return (
    <div className="flex items-end gap-2 h-24">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex gap-0.5 items-end" style={{ height: '72px' }}>
            <div
              className="flex-1 rounded-t transition-all"
              style={{ height: `${(d.revenue / maxRev) * 100}%`, backgroundColor: '#714B67', opacity: i === data.length - 1 ? 1 : 0.5 }}
            />
            <div
              className="flex-1 rounded-t transition-all"
              style={{ height: `${(d.order / maxRev) * 100}%`, backgroundColor: '#E9E0F8' }}
            />
          </div>
          <span className="text-[9px]" style={{ color: '#A5A3AE' }}>{d.month}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { token, user, loadProfile } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    loadProfile().catch(() => {});
    setMounted(true);
  }, [token]);

  if (!mounted || !token) return null;

  const displayName = user?.name ?? user?.email?.split('@')[0] ?? 'Admin';

  return (
    <OdooLayout title="Dashboard" subtitle="Ringkasan bisnis real-time">
      <div className="space-y-6">
        {/* Welcome + Date */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#433C50' }}>
              Selamat datang, {displayName} 👋
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#A5A3AE' }}>
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · Data diperbarui pukul {lastRefresh.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <button
            onClick={() => setLastRefresh(new Date())}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition hover:bg-gray-100"
            style={{ border: '1.5px solid #E9E0F8', color: '#6D6777' }}
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {KPI.map((k, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #E9E0F8', boxShadow: '0 1px 4px rgba(47,43,61,.04)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: k.bg }}>
                  <k.icon className="h-4.5 w-4.5" style={{ color: k.color }} />
                </div>
                <span
                  className="flex items-center gap-0.5 text-[11px] font-semibold"
                  style={{ color: k.up ? '#22C55E' : '#EF4444' }}
                >
                  {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {k.change}
                </span>
              </div>
              <div>
                <p className="text-lg font-bold leading-tight" style={{ color: '#433C50' }}>{k.value}</p>
                <p className="text-[11px] mt-0.5" style={{ color: '#A5A3AE' }}>{k.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart + Recent Orders (span 2) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Chart */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #E9E0F8', boxShadow: '0 1px 4px rgba(47,43,61,.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm" style={{ color: '#433C50' }}>Tren Revenue & Order</h3>
                  <p className="text-xs mt-0.5" style={{ color: '#A5A3AE' }}>6 bulan terakhir</p>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm inline-block" style={{ backgroundColor: '#714B67' }} /> Revenue</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm inline-block" style={{ backgroundColor: '#E9E0F8' }} /> Order</span>
                </div>
              </div>
              <MiniBarChart data={MONTHLY_DATA} />
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl" style={{ backgroundColor: '#F8F7FC' }}>
                  <p className="text-base font-bold" style={{ color: '#433C50' }}>Rp 460 M</p>
                  <p className="text-[10px]" style={{ color: '#A5A3AE' }}>Total Revenue YTD</p>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ backgroundColor: '#F8F7FC' }}>
                  <p className="text-base font-bold" style={{ color: '#433C50' }}>3,821</p>
                  <p className="text-[10px]" style={{ color: '#A5A3AE' }}>Total Order YTD</p>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ backgroundColor: '#F8F7FC' }}>
                  <p className="text-base font-bold" style={{ color: '#22C55E' }}>+18.4%</p>
                  <p className="text-[10px]" style={{ color: '#A5A3AE' }}>Growth vs Tahun Lalu</p>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="rounded-2xl" style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #E9E0F8', boxShadow: '0 1px 4px rgba(47,43,61,.04)' }}>
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #E9E0F8' }}>
                <h3 className="font-bold text-sm" style={{ color: '#433C50' }}>Order Terbaru</h3>
                <Link href="/sales/orders" className="text-xs font-semibold flex items-center gap-1" style={{ color: '#714B67' }}>
                  Lihat Semua <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="divide-y" style={{ borderColor: '#E9E0F8' }}>
                {RECENT_ORDERS.map((o, i) => (
                  <div key={i} className="flex items-center px-5 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold" style={{ color: '#433C50' }}>{o.id}</p>
                      <p className="text-[11px] mt-0.5 truncate" style={{ color: '#A5A3AE' }}>{o.customer}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-xs font-semibold" style={{ color: '#433C50' }}>{o.amount}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: '#A5A3AE' }}>{o.date}</p>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0"
                      style={{ backgroundColor: o.color + '15', color: o.color }}
                    >
                      {o.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Alerts */}
            <div className="rounded-2xl" style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #E9E0F8', boxShadow: '0 1px 4px rgba(47,43,61,.04)' }}>
              <div className="px-5 py-4" style={{ borderBottom: '1px solid #E9E0F8' }}>
                <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: '#433C50' }}>
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> Perhatian
                </h3>
              </div>
              <div className="p-4 space-y-2">
                {ALERTS.map((a, i) => (
                  <Link
                    key={i}
                    href={a.href}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                    style={{
                      backgroundColor: a.type === 'danger' ? 'rgba(239,68,68,.05)' : a.type === 'warning' ? 'rgba(245,158,11,.05)' : 'rgba(59,130,246,.05)',
                      border: `1px solid ${a.type === 'danger' ? 'rgba(239,68,68,.15)' : a.type === 'warning' ? 'rgba(245,158,11,.15)' : 'rgba(59,130,246,.15)'}`,
                    }}
                  >
                    <div className="h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: a.type === 'danger' ? '#EF4444' : a.type === 'warning' ? '#F59E0B' : '#3B82F6' }} />
                    <p className="text-xs leading-relaxed" style={{ color: '#433C50' }}>{a.msg}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl" style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #E9E0F8', boxShadow: '0 1px 4px rgba(47,43,61,.04)' }}>
              <div className="px-5 py-4" style={{ borderBottom: '1px solid #E9E0F8' }}>
                <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: '#433C50' }}>
                  <Zap className="h-4 w-4" style={{ color: '#714B67' }} /> Aksi Cepat
                </h3>
              </div>
              <div className="p-4 grid grid-cols-2 gap-2">
                {QUICK_ACTIONS.map((q, i) => (
                  <Link
                    key={i}
                    href={q.href}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl text-center hover:bg-gray-50 transition-colors"
                    style={{ border: '1.5px solid #E9E0F8' }}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: q.color + '15' }}>
                      <q.icon className="h-4 w-4" style={{ color: q.color }} />
                    </div>
                    <p className="text-[10px] font-semibold leading-snug" style={{ color: '#433C50' }}>{q.label}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="rounded-2xl" style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #E9E0F8', boxShadow: '0 1px 4px rgba(47,43,61,.04)' }}>
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #E9E0F8' }}>
                <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: '#433C50' }}>
                  <Star className="h-4 w-4 text-amber-400" /> Produk Terlaris
                </h3>
                <Link href="/reports/sales?type=product" className="text-xs font-semibold" style={{ color: '#714B67' }}>Semua</Link>
              </div>
              <div className="p-4 space-y-3">
                {TOP_PRODUCTS.map((p, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium truncate max-w-[160px]" style={{ color: '#433C50' }}>{p.name}</p>
                      <p className="text-[10px] font-semibold" style={{ color: '#714B67' }}>{p.revenue}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 rounded-full h-1.5" style={{ backgroundColor: '#E9E0F8' }}>
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${p.pct}%`, backgroundColor: '#714B67' }} />
                      </div>
                      <span className="text-[10px]" style={{ color: '#A5A3AE' }}>{p.sold} terjual</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="rounded-2xl" style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #E9E0F8', boxShadow: '0 1px 4px rgba(47,43,61,.04)' }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #E9E0F8' }}>
            <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: '#433C50' }}>
              <Activity className="h-4 w-4" style={{ color: '#714B67' }} /> Aktivitas Terkini
            </h3>
            <Link href="/settings/audit-log" className="text-xs font-semibold" style={{ color: '#714B67' }}>Lihat Audit Log</Link>
          </div>
          <div className="px-5 py-4">
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-px" style={{ backgroundColor: '#E9E0F8' }} />
              <div className="space-y-4">
                {[
                  { action: 'Sales Order SO-2026-1842 dibuat', user: 'Budi Santoso', time: '5 menit lalu', color: '#22C55E' },
                  { action: 'Invoice INV-2026-0842 dibayar (Rp 4.500.000)', user: 'Finance Team', time: '18 menit lalu', color: '#3B82F6' },
                  { action: 'Transfer stok TRF-001 divalidasi', user: 'Warehouse Staff', time: '32 menit lalu', color: '#8B5CF6' },
                  { action: 'Purchase Order PO-2026-0048 disetujui', user: 'Manager Pembelian', time: '1 jam lalu', color: '#F59E0B' },
                  { action: 'Karyawan baru Andi Wijaya ditambahkan', user: 'HR Admin', time: '2 jam lalu', color: '#14B8A6' },
                  { action: 'Backup database otomatis berhasil', user: 'Sistem', time: '3 jam lalu', color: '#6B7280' },
                ].map((a, i) => (
                  <div key={i} className="flex items-start gap-4 pl-6 relative">
                    <div className="absolute left-0 top-1 h-3 w-3 rounded-full border-2 border-white" style={{ backgroundColor: a.color, boxShadow: `0 0 0 1px ${a.color}` }} />
                    <div className="flex-1">
                      <p className="text-xs" style={{ color: '#433C50' }}>{a.action}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-semibold" style={{ color: '#714B67' }}>{a.user}</span>
                        <span className="text-[10px]" style={{ color: '#A5A3AE' }}>· {a.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </OdooLayout>
  );
}
