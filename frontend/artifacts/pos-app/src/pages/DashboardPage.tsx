import { useQuery } from '@tanstack/react-query'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'
import { TrendingUp, ShoppingCart, Users, AlertTriangle, CreditCard, Package, ArrowUpRight } from 'lucide-react'
import api from '../api/client'
import { formatRupiah, formatDate } from '../utils/format'
import { useAuthStore } from '../store/authStore'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  const { data: summary } = useQuery({
    queryKey: ['pos-dashboard-summary'],
    queryFn: () => api.get('/dashboard/summary').then((r) => r.data),
  })

  const { data: chartData } = useQuery({
    queryKey: ['pos-dashboard-chart'],
    queryFn: () => api.get('/dashboard/chart?days=30').then((r) => r.data),
  })

  const { data: topProducts } = useQuery({
    queryKey: ['pos-top-products'],
    queryFn: () => api.get('/dashboard/top-products?limit=6&period=month').then((r) => r.data),
  })

  const { data: recent } = useQuery({
    queryKey: ['pos-recent-transactions'],
    queryFn: () => api.get('/dashboard/recent-transactions?limit=8').then((r) => r.data),
  })

  const { data: monthly } = useQuery({
    queryKey: ['pos-monthly-revenue'],
    queryFn: () => api.get('/dashboard/monthly-revenue?months=6').then((r) => r.data),
  })

  const stats = [
    {
      label: 'Omzet Hari Ini',
      value: formatRupiah(summary?.today?.revenue ?? 0),
      sub: `${summary?.today?.transactions ?? 0} transaksi`,
      icon: TrendingUp,
      color: 'bg-primary-500',
      trend: '+12%',
    },
    {
      label: 'Omzet Bulan Ini',
      value: formatRupiah(summary?.this_month?.revenue ?? 0),
      sub: `${summary?.this_month?.transactions ?? 0} transaksi`,
      icon: ShoppingCart,
      color: 'bg-emerald-500',
      trend: '+8%',
    },
    {
      label: 'Total Piutang',
      value: formatRupiah(summary?.receivables ?? 0),
      sub: 'Belum lunas',
      icon: CreditCard,
      color: 'bg-amber-500',
      trend: null,
    },
    {
      label: 'Total Hutang',
      value: formatRupiah(summary?.payables ?? 0),
      sub: 'Ke supplier',
      icon: Users,
      color: 'bg-purple-500',
      trend: null,
    },
    {
      label: 'Stok Menipis',
      value: `${summary?.low_stock ?? 0} produk`,
      sub: 'Di bawah minimum',
      icon: AlertTriangle,
      color: 'bg-red-500',
      trend: null,
    },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg text-xs">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {formatRupiah(p.value)}</p>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Selamat datang, {user?.name} 👋</h1>
        <p className="text-sm text-gray-500 mt-0.5">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 ${s.color} rounded-lg flex items-center justify-center`}>
                <s.icon className="w-4.5 h-4.5 text-white" size={18} />
              </div>
              {s.trend && (
                <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                  <ArrowUpRight size={12} />{s.trend}
                </span>
              )}
            </div>
            <div className="text-lg font-bold text-gray-900 leading-tight">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Grafik Penjualan 30 Hari</h2>
              <p className="text-xs text-gray-500">Omzet harian</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData ?? []}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}jt`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Omzet" stroke="#2563EB" fill="url(#revGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Bar */}
        <div className="card p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Omzet Bulanan</h2>
            <p className="text-xs text-gray-500">6 bulan terakhir</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthly ?? []} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}jt`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Omzet" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Produk Terlaris</h2>
              <p className="text-xs text-gray-500">Bulan ini</p>
            </div>
            <Package size={16} className="text-gray-400" />
          </div>
          <div className="space-y-3">
            {(topProducts ?? []).length === 0 && (
              <p className="text-xs text-gray-400 text-center py-6">Belum ada data penjualan</p>
            )}
            {(topProducts ?? []).map((p: any, i: number) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-900 truncate">{p.name}</div>
                  <div className="text-xs text-gray-400">{p.total_qty} terjual</div>
                </div>
                <div className="text-xs font-semibold text-gray-700">{formatRupiah(p.total_revenue)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Transaksi Terbaru</h2>
            </div>
            <ShoppingCart size={16} className="text-gray-400" />
          </div>
          <div className="space-y-2.5">
            {(recent ?? []).length === 0 && (
              <p className="text-xs text-gray-400 text-center py-6">Belum ada transaksi</p>
            )}
            {(recent ?? []).map((t: any) => (
              <div key={t.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <div>
                  <div className="text-xs font-medium text-gray-900">{t.invoice_number}</div>
                  <div className="text-xs text-gray-400">{t.customer_name} · {t.created_at}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-gray-900">{formatRupiah(t.grand_total)}</div>
                  <span className={`badge text-xs ${t.payment_status === 'paid' ? 'badge-green' : t.payment_status === 'partial' ? 'badge-yellow' : 'badge-red'}`}>
                    {t.payment_status === 'paid' ? 'Lunas' : t.payment_status === 'partial' ? 'Sebagian' : 'Belum Bayar'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
