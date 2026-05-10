import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { FileText, TrendingUp, Package, CreditCard, Users, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import api from '../api/client'
import { formatRupiah, formatDate, formatNumber } from '../utils/format'

const TABS = [
  { id: 'sales', label: 'Penjualan', icon: TrendingUp },
  { id: 'stock', label: 'Stok', icon: Package },
  { id: 'receivables', label: 'Piutang', icon: CreditCard },
  { id: 'payables', label: 'Hutang', icon: Users },
]
const PIE_COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export default function ReportsPage() {
  const [tab, setTab] = useState('sales')
  const [dateFrom, setDateFrom] = useState(new Date(new Date().setDate(1)).toISOString().slice(0, 10))
  const [dateTo, setDateTo] = useState(new Date().toISOString().slice(0, 10))

  const { data: salesReport, isLoading: loadingSales } = useQuery({
    queryKey: ['pos-report-sales', dateFrom, dateTo],
    queryFn: () => api.get('/reports/sales', { params: { date_from: dateFrom, date_to: dateTo } }).then((r) => r.data),
    enabled: tab === 'sales',
  })

  const { data: stockReport, isLoading: loadingStock } = useQuery({
    queryKey: ['pos-report-stock'],
    queryFn: () => api.get('/reports/stock').then((r) => r.data.data),
    enabled: tab === 'stock',
  })

  const { data: receivablesReport } = useQuery({
    queryKey: ['pos-report-receivables'],
    queryFn: () => api.get('/reports/receivables').then((r) => r.data.data),
    enabled: tab === 'receivables',
  })

  const { data: payablesReport } = useQuery({
    queryKey: ['pos-report-payables'],
    queryFn: () => api.get('/reports/payables').then((r) => r.data.data),
    enabled: tab === 'payables',
  })

  const totals = salesReport?.totals
  const sales = salesReport?.data ?? []
  const stockItems = stockReport ?? []
  const receivables = receivablesReport ?? []
  const payables = payablesReport ?? []

  const exportReport = (type: string) => {
    toast(`Ekspor ${type} sedang diproses...`)
  }

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
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Laporan</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Analisa penjualan, stok, piutang, dan hutang toko.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => exportReport('PDF')} className="btn-secondary inline-flex items-center gap-2">
            <Download size={16} /> Ekspor PDF
          </button>
          <button onClick={() => exportReport('Excel')} className="btn-secondary inline-flex items-center gap-2">
            <Download size={16} /> Ekspor Excel
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-3xl bg-slate-100 p-2 dark:bg-slate-900">
        {TABS.map((tabItem) => (
          <button key={tabItem.id} onClick={() => setTab(tabItem.id)} className={clsx('flex items-center gap-2 rounded-3xl px-4 py-3 text-sm font-semibold transition', tab === tabItem.id ? 'bg-white text-primary-700 shadow-md dark:bg-slate-950 dark:text-white' : 'text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800')}>
            <tabItem.icon size={16} /> {tabItem.label}
          </button>
        ))}
      </div>

      {tab === 'sales' && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Total Transaksi', value: formatNumber(totals?.count ?? 0), color: 'bg-sky-50 text-sky-700' },
              { label: 'Total Omzet', value: formatRupiah(totals?.grand_total ?? 0), color: 'bg-emerald-50 text-emerald-700' },
              { label: 'Total Diskon', value: formatRupiah(totals?.discount_amount ?? 0), color: 'bg-amber-50 text-amber-700' },
              { label: 'Laba Kotor', value: formatRupiah(totals?.gross_profit ?? 0), color: 'bg-violet-50 text-violet-700' },
            ].map((item) => (
              <div key={item.label} className={`rounded-[28px] p-5 ${item.color}`}>
                <p className="text-xs uppercase tracking-[0.24em] font-semibold">{item.label}</p>
                <p className="mt-3 text-2xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Detail Transaksi</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Filter tanggal: {dateFrom} – {dateTo}</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-100 px-3 py-2 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  <span>{sales.length}</span> Transaksi
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                    <tr>
                      {['Invoice', 'Tanggal', 'Customer', 'Subtotal', 'Diskon', 'Total', 'Status'].map((heading) => (
                        <th key={heading} className="whitespace-nowrap px-4 py-3 text-left font-semibold uppercase tracking-wider">{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {loadingSales ? (
                      <tr><td colSpan={7} className="py-10 text-center">Memuat...</td></tr>
                    ) : sales.length === 0 ? (
                      <tr><td colSpan={7} className="py-10 text-center">Tidak ada data</td></tr>
                    ) : sales.slice(0, 50).map((sale: any) => (
                      <tr key={sale.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                        <td className="px-4 py-3 font-mono text-xs text-primary-700">{sale.invoice_number}</td>
                        <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{formatDate(sale.created_at)}</td>
                        <td className="px-4 py-3">{sale.customer?.name ?? sale.customer_name ?? 'Umum'}</td>
                        <td className="px-4 py-3">{formatRupiah(sale.subtotal)}</td>
                        <td className="px-4 py-3 text-rose-600">{formatRupiah(sale.discount_amount)}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{formatRupiah(sale.grand_total)}</td>
                        <td className="px-4 py-3"><span className={sale.status === 'completed' ? 'badge badge-green' : 'badge badge-red'}>{sale.status === 'completed' ? 'Selesai' : 'Batal'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Ringkasan Bulanan</h2>
                <button onClick={() => exportReport('Sales')} className="btn-secondary btn-sm inline-flex items-center gap-2"><Download size={14} /> Ekspor</button>
              </div>
              <div className="space-y-3">
                <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-900">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Omzet</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{formatRupiah(totals?.grand_total ?? 0)}</p>
                </div>
                <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-900">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Laba Kotor</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{formatRupiah(totals?.gross_profit ?? 0)}</p>
                </div>
                <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-900">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Jumlah Transaksi</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{formatNumber(totals?.count ?? 0)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'stock' && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[28px] bg-slate-100 p-5 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Total Produk</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">{formatNumber(stockItems.length)}</p>
            </div>
            <div className="rounded-[28px] bg-slate-100 p-5 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Stok Menipis</p>
              <p className="mt-3 text-2xl font-semibold text-rose-700">{stockItems.filter((item: any) => Number(item.qty_on_hand) <= Number(item.min_stock_alert)).length}</p>
            </div>
            <div className="rounded-[28px] bg-slate-100 p-5 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Nilai Stok</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">{formatRupiah(stockItems.reduce((sum: number, item: any) => sum + Number(item.stock_value), 0))}</p>
            </div>
            <div className="rounded-[28px] bg-slate-100 p-5 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Export</p>
              <button onClick={() => exportReport('Stock')} className="btn-secondary btn-sm mt-3 inline-flex items-center gap-2"><Download size={14} /> Export</button>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Detail Stok</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Daftar produk dan status stok saat ini.</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  <tr>{['SKU', 'Produk', 'Kategori', 'Stok', 'Min Stok', 'Nilai', 'Status'].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold uppercase tracking-wide">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {stockItems.map((item: any) => {
                    const isLow = Number(item.qty_on_hand) <= Number(item.min_stock_alert)
                    return (
                      <tr key={item.id} className={clsx('hover:bg-slate-50 dark:hover:bg-slate-900', isLow && 'bg-rose-50/50 dark:bg-rose-900/30')}>
                        <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">{item.sku}</td>
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{item.name}</td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{item.category ?? '-'}</td>
                        <td className="px-4 py-3">{formatNumber(item.qty_on_hand)}</td>
                        <td className="px-4 py-3">{item.min_stock_alert}</td>
                        <td className="px-4 py-3">{formatRupiah(item.stock_value)}</td>
                        <td className="px-4 py-3"><span className={clsx('badge text-xs', isLow ? 'badge-red' : 'badge-green')}>{isLow ? 'Menipis' : 'Stabil'}</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'receivables' && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Piutang Customer</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Daftar piutang yang belum lunas.</p>
            </div>
            <button onClick={() => exportReport('Receivables')} className="btn-secondary btn-sm inline-flex items-center gap-2"><Download size={14} /> Ekspor</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                <tr>{['Kode', 'Customer', 'Invoice', 'Total', 'Dibayar', 'Sisa', 'Jatuh Tempo', 'Status'].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold uppercase tracking-wide">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {receivables.length === 0 ? (
                  <tr><td colSpan={8} className="py-10 text-center">Tidak ada piutang</td></tr>
                ) : receivables.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">{item.code}</td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{item.customer?.name}</td>
                    <td className="px-4 py-3 text-xs text-primary-600 dark:text-primary-300">{item.sale?.invoice_number ?? '-'}</td>
                    <td className="px-4 py-3">{formatRupiah(item.amount)}</td>
                    <td className="px-4 py-3 text-emerald-600">{formatRupiah(item.paid_amount)}</td>
                    <td className="px-4 py-3 font-semibold text-rose-600">{formatRupiah(item.remaining)}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{formatDate(item.due_date)}</td>
                    <td className="px-4 py-3"><span className={clsx('badge text-xs', item.status === 'paid' ? 'badge-green' : item.status === 'partial' ? 'badge-yellow' : 'badge-red')}>{item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'payables' && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Hutang Supplier</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Hutang pembelian dan waktu jatuh tempo.</p>
            </div>
            <button onClick={() => exportReport('Payables')} className="btn-secondary btn-sm inline-flex items-center gap-2"><Download size={14} /> Ekspor</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                <tr>{['Kode', 'Supplier', 'No. PO', 'Total', 'Dibayar', 'Sisa', 'Jatuh Tempo', 'Status'].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold uppercase tracking-wide">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {payables.length === 0 ? (
                  <tr><td colSpan={8} className="py-10 text-center">Tidak ada hutang</td></tr>
                ) : payables.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">{item.code}</td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{item.supplier?.name}</td>
                    <td className="px-4 py-3 text-xs text-primary-600 dark:text-primary-300">{item.purchase?.po_number ?? '-'}</td>
                    <td className="px-4 py-3">{formatRupiah(item.amount)}</td>
                    <td className="px-4 py-3 text-emerald-600">{formatRupiah(item.paid_amount)}</td>
                    <td className="px-4 py-3 font-semibold text-rose-600">{formatRupiah(item.remaining)}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{formatDate(item.due_date)}</td>
                    <td className="px-4 py-3"><span className={clsx('badge text-xs', item.status === 'paid' ? 'badge-green' : item.status === 'partial' ? 'badge-yellow' : 'badge-red')}>{item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
