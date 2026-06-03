'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp, TrendingDown, ShoppingCart, Package, DollarSign,
  Users, FileText, AlertTriangle, CheckCircle, Clock, BarChart2,
  RefreshCw, Truck, Target, MoreHorizontal, ChevronRight,
} from 'lucide-react';

const KPI_CARDS = [
  {
    title: 'Total Penjualan',
    value: 'Rp 1,24 M',
    sub: '+12.5% dari bulan lalu',
    trend: 'up',
    icon: DollarSign,
    color: '#3B82F6',
    bg: '#EFF6FF',
  },
  {
    title: 'Sales Orders',
    value: '284',
    sub: '+8 hari ini',
    trend: 'up',
    icon: ShoppingCart,
    color: '#8B5CF6',
    bg: '#F5F3FF',
  },
  {
    title: 'Total Pelanggan',
    value: '1,892',
    sub: '+24 bulan ini',
    trend: 'up',
    icon: Users,
    color: '#10B981',
    bg: '#ECFDF5',
  },
  {
    title: 'Invoice Pending',
    value: '47',
    sub: '-3 dari kemarin',
    trend: 'down',
    icon: FileText,
    color: '#F59E0B',
    bg: '#FFFBEB',
  },
];

const RECENT_ORDERS = [
  { id: 'SO-2024-0312', customer: 'PT Maju Jaya', amount: 'Rp 4,8 Jt', status: 'Confirmed', date: '2 jam lalu' },
  { id: 'SO-2024-0311', customer: 'CV Berkah Abadi', amount: 'Rp 2,1 Jt', status: 'In Progress', date: '4 jam lalu' },
  { id: 'SO-2024-0310', customer: 'Toko Sumber Rejeki', amount: 'Rp 870 rb', status: 'Done', date: '6 jam lalu' },
  { id: 'SO-2024-0309', customer: 'PT Anugrah Setia', amount: 'Rp 3,5 Jt', status: 'Confirmed', date: 'Kemarin' },
  { id: 'SO-2024-0308', customer: 'CV Sinar Mas', amount: 'Rp 1,2 Jt', status: 'Cancelled', date: 'Kemarin' },
];

const STATUS_STYLE: Record<string, { color: string; bg: string; label: string }> = {
  Confirmed: { color: '#3B82F6', bg: '#EFF6FF', label: 'Dikonfirmasi' },
  'In Progress': { color: '#F59E0B', bg: '#FFFBEB', label: 'Diproses' },
  Done: { color: '#10B981', bg: '#ECFDF5', label: 'Selesai' },
  Cancelled: { color: '#EA5455', bg: '#FFF5F5', label: 'Dibatalkan' },
};

const TOP_PRODUCTS = [
  { name: 'Semen Portland 50kg', sold: 840, pct: 85 },
  { name: 'Bata Merah (ikat)', sold: 520, pct: 62 },
  { name: 'Pipa PVC 4 inch', sold: 380, pct: 45 },
  { name: 'Cat Tembok Dulux 5L', sold: 290, pct: 35 },
  { name: 'Besi Beton 10mm', sold: 210, pct: 25 },
];

const PIPELINE_STAGES = [
  { label: 'Leads', count: 142, color: '#94A3B8' },
  { label: 'Qualified', count: 87, color: '#3B82F6' },
  { label: 'Proposal', count: 54, color: '#8B5CF6' },
  { label: 'Negotiation', count: 31, color: '#F59E0B' },
  { label: 'Won', count: 18, color: '#10B981' },
];

const QUICK_ACTIONS = [
  { label: 'Buat Order', href: '/sales/orders', icon: FileText, color: '#3B82F6', bg: '#EFF6FF' },
  { label: 'Smart Order', href: '/sales/orders', icon: DollarSign, color: '#10B981', bg: '#ECFDF5' },
  { label: 'Transfer Stok', href: '/inventory/transfers', icon: Package, color: '#8B5CF6', bg: '#F5F3FF' },
  { label: 'Purchase Order', href: '/purchasing/purchase-orders', icon: Truck, color: '#F59E0B', bg: '#FFFBEB' },
  { label: 'Laporan Penjualan', href: '/reports/sales', icon: BarChart2, color: '#6366F1', bg: '#EEF2FF' },
  { label: 'CRM Pipeline', href: '/crm/pipeline', icon: Target, color: '#14B8A6', bg: '#F0FDFA' },
];

const STOCK_ALERTS = [
  { product: 'Semen Portland 50kg', stock: 12, min: 50, unit: 'zak' },
  { product: 'Cat Tembok 5L', stock: 5, min: 20, unit: 'kaleng' },
  { product: 'Paku 5cm', stock: 3, min: 10, unit: 'kg' },
];

const MONTHLY_DATA = [
  { month: 'Jan', revenue: 820 },
  { month: 'Feb', revenue: 932 },
  { month: 'Mar', revenue: 901 },
  { month: 'Apr', revenue: 1134 },
  { month: 'Mei', revenue: 1290 },
  { month: 'Jun', revenue: 1100 },
  { month: 'Jul', revenue: 1240 },
];

function MiniBarChart({ data }: { data: { month: string; revenue: number }[] }) {
  const max = Math.max(...data.map((d) => d.revenue));
  return (
    <div className="flex items-end gap-1.5 h-20">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-sm transition-all"
            style={{
              height: `${(d.revenue / max) * 100}%`,
              backgroundColor: i === data.length - 1 ? '#3B82F6' : '#BFDBFE',
              minHeight: '4px',
            }}
          />
          <span className="text-[9px] text-slate-400">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'month'>('month');

  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">Selamat datang kembali — ringkasan bisnis Anda hari ini.</p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex rounded-lg border overflow-hidden text-xs font-medium"
            style={{ borderColor: '#E2E8F0' }}
          >
            {(['today', 'week', 'month'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className="px-3 py-1.5 transition-colors"
                style={{
                  backgroundColor: activeTab === t ? '#3B82F6' : '#FFFFFF',
                  color: activeTab === t ? '#FFFFFF' : '#64748B',
                }}
              >
                {t === 'today' ? 'Hari Ini' : t === 'week' ? 'Minggu' : 'Bulan'}
              </button>
            ))}
          </div>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-slate-50"
            style={{ borderColor: '#E2E8F0', color: '#64748B' }}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Aksi Cepat */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}
      >
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-2 p-3 rounded-xl border transition-all hover:shadow-sm hover:-translate-y-0.5"
                style={{ borderColor: '#E2E8F0' }}
              >
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: action.bg }}
                >
                  <Icon className="h-4 w-4" style={{ color: action.color }} />
                </div>
                <span className="text-[11px] font-medium text-slate-600 text-center leading-tight">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-xl p-5 border flex flex-col gap-4"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: card.bg }}
                >
                  <Icon className="h-5 w-5" style={{ color: card.color }} />
                </div>
                <span
                  className="flex items-center gap-1 text-xs font-medium"
                  style={{ color: card.trend === 'up' ? '#10B981' : '#EA5455' }}
                >
                  {card.trend === 'up'
                    ? <TrendingUp className="h-3.5 w-3.5" />
                    : <TrendingDown className="h-3.5 w-3.5" />
                  }
                  {card.sub.split(' ')[0]}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                <p className="text-sm text-slate-400 mt-0.5">{card.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main grid: Revenue chart + CRM Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          className="lg:col-span-2 rounded-xl border p-5"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-700">Tren Pendapatan</h2>
              <p className="text-xs text-slate-400">7 bulan terakhir</p>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-slate-100">
              <MoreHorizontal className="h-4 w-4 text-slate-400" />
            </button>
          </div>
          <MiniBarChart data={MONTHLY_DATA} />
          <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: '#F1F5F9' }}>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-800">Rp 1,24 M</p>
              <p className="text-xs text-slate-400">Total bulan ini</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-800">284</p>
              <p className="text-xs text-slate-400">Total order</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-emerald-500">+12.5%</p>
              <p className="text-xs text-slate-400">vs bulan lalu</p>
            </div>
          </div>
        </div>

        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-700">CRM Pipeline</h2>
              <p className="text-xs text-slate-400">Status prospek aktif</p>
            </div>
            <Link href="/crm/pipeline" className="text-xs font-medium" style={{ color: '#3B82F6' }}>
              Lihat semua
            </Link>
          </div>
          <div className="space-y-3">
            {PIPELINE_STAGES.map((stage) => (
              <div key={stage.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600">{stage.label}</span>
                  <span className="text-xs font-semibold text-slate-700">{stage.count}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ backgroundColor: '#F1F5F9' }}>
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: `${(stage.count / PIPELINE_STAGES[0].count) * 100}%`,
                      backgroundColor: stage.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t" style={{ borderColor: '#F1F5F9' }}>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">Win rate</p>
              <p className="text-sm font-bold" style={{ color: '#10B981' }}>12.7%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders + Alerts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          className="lg:col-span-2 rounded-xl border overflow-hidden"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
            <h2 className="text-sm font-semibold text-slate-700">Sales Order Terbaru</h2>
            <Link
              href="/sales/orders"
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color: '#3B82F6' }}
            >
              Lihat semua <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div>
            {RECENT_ORDERS.map((order, i) => {
              const s = STATUS_STYLE[order.status];
              return (
                <div
                  key={order.id}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors"
                  style={{ borderBottom: i < RECENT_ORDERS.length - 1 ? '1px solid #F8FAFC' : 'none' }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-700">{order.id}</p>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ color: s.color, backgroundColor: s.bg }}
                      >
                        {s.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-700">{order.amount}</p>
                    <p className="text-[11px] text-slate-400">{order.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Stock alerts */}
          <div
            className="rounded-xl border p-5"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-700">Stok Menipis</h2>
              <AlertTriangle className="h-4 w-4" style={{ color: '#F59E0B' }} />
            </div>
            <div className="space-y-3">
              {STOCK_ALERTS.map((item) => (
                <div key={item.product} className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#FFFBEB' }}
                  >
                    <Package className="h-4 w-4" style={{ color: '#F59E0B' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">{item.product}</p>
                    <p className="text-[11px] text-slate-400">
                      Sisa: <span className="font-semibold text-red-500">{item.stock}</span> / min {item.min} {item.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity summary */}
          <div
            className="rounded-xl border p-5"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}
          >
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Ringkasan Hari Ini</h2>
            <div className="space-y-2.5">
              {[
                { icon: CheckCircle, label: 'Order selesai', value: '23', color: '#10B981', bg: '#ECFDF5' },
                { icon: Clock, label: 'Menunggu konfirmasi', value: '8', color: '#F59E0B', bg: '#FFFBEB' },
                { icon: Truck, label: 'Dalam pengiriman', value: '14', color: '#3B82F6', bg: '#EFF6FF' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <div
                      className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: item.bg }}
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color: item.color }} />
                    </div>
                    <span className="flex-1 text-xs text-slate-600">{item.label}</span>
                    <span className="text-sm font-bold text-slate-700">{item.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: Top Products */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-700">Produk Terlaris</h2>
          <Link href="/reports/sales" className="text-xs font-medium" style={{ color: '#3B82F6' }}>
            Lihat semua
          </Link>
        </div>
        <div className="space-y-3">
          {TOP_PRODUCTS.map((product, i) => (
            <div key={product.name} className="flex items-center gap-3">
              <span className="text-xs font-bold w-5 text-slate-400">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 truncate">{product.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: '#F1F5F9' }}>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${product.pct}%`, backgroundColor: '#3B82F6' }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 w-16 text-right">{product.sold} terjual</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
