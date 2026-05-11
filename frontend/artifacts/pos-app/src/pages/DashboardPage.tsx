import { useQuery } from '@tanstack/react-query'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import {
  TrendingUp,
  ShoppingCart,
  Users,
  AlertTriangle,
  CreditCard,
  ArrowUpRight,
} from 'lucide-react'
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
      <div className="bg-white border border-slate-200 rounded-3xl p-3 shadow-lg text-xs dark:bg-slate-900 dark:border-slate-700">
        <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="text-[11px]">
            {p.name}: {formatRupiah(p.value)}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in pb-24 md:pb-0">
      <div className="space-y-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-100">Halo {user?.name},</h1>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400">Dashboard untuk memantau omzet, stok, hutang, piutang, dan performa kasir.</p>
          </div>
          <div className="rounded-3xl bg-slate-100 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-200 whitespace-nowrap">
            {new Date().toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="card p-3 sm:p-4 transition hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`grid h-9 sm:h-11 w-9 sm:w-11 place-items-center rounded-3xl ${s.color} text-white`}>
                <s.icon size={16} className="sm:block" />
              </div>
              {s.trend ? (
                <span className="rounded-full bg-emerald-50 px-2 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-semibold text-emerald-700">{s.trend}</span>
              ) : null}
            </div>
            <p className="text-lg sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">{s.value}</p>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{s.label}</p>
            <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-slate-400 line-clamp-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Grafik Penjualan 30 Hari</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Lihat tren omzet dan performa penjualan untuk periode terakhir.</p>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData ?? []}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(value) => String(value).slice(5)} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(value) => `${(value / 1_000_000).toFixed(0)}jt`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Omzet" stroke="#2563EB" fill="url(#revGrad)" strokeWidth={3} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Quick Action</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Kumpulan akses cepat untuk fitur kasir dan laporan.</p>
            </div>
            <div className="grid gap-3">
              {[
                { label: 'Buka Kasir', description: 'Mulai transaksi baru', color: 'bg-sky-50 text-sky-700' },
                { label: 'Tambah Produk', description: 'Perbarui katalog produk', color: 'bg-emerald-50 text-emerald-700' },
                { label: 'Stok Menipis', description: 'Pantau inventory low stock', color: 'bg-amber-50 text-amber-700' },
                { label: 'Laporan PDF', description: 'Ekspor data lengkap', color: 'bg-violet-50 text-violet-700' },
              ].map((action) => (
                <button key={action.label} className={`rounded-3xl border border-slate-200 p-4 text-left text-sm font-semibold transition ${action.color} hover:shadow-lg`}> 
                  <div>{action.label}</div>
                  <div className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{action.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Aktivitas Terbaru</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ringkasan transaksi terbaru.</p>
            </div>
            <div className="space-y-3">
              {(recent ?? []).map((item: any) => (
                <div key={item.id} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{item.invoice_number}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.customer_name || 'Umum'} · {formatDate(item.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{formatRupiah(item.grand_total)}</p>
                      <span className={`badge ${item.payment_status === 'paid' ? 'badge-green' : item.payment_status === 'partial' ? 'badge-yellow' : 'badge-red'}`}>
                        {item.payment_status === 'paid' ? 'Lunas' : item.payment_status === 'partial' ? 'Sebagian' : 'Belum Bayar'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Statistik Realtime</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pantau kondisi operasional toko.</p>
            </div>
            <div className="grid gap-3">
              <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-900">
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Pelanggan Aktif</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{summary?.customer_count ?? 0}</p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-900">
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Sesi Kasir</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{summary?.open_sessions ?? 0}</p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-900">
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Produk Tersedia</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{summary?.products ?? 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
