import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { FileText, TrendingUp, Package, CreditCard, Users } from 'lucide-react'
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
    queryFn: () => api.get('/reports/sales', { params: { date_from: dateFrom, date_to: dateTo } }).then(r => r.data),
    enabled: tab === 'sales',
  })

  const { data: stockReport, isLoading: loadingStock } = useQuery({
    queryKey: ['pos-report-stock'],
    queryFn: () => api.get('/reports/stock').then(r => r.data.data),
    enabled: tab === 'stock',
  })

  const { data: receivablesReport } = useQuery({
    queryKey: ['pos-report-receivables'],
    queryFn: () => api.get('/reports/receivables').then(r => r.data.data),
    enabled: tab === 'receivables',
  })

  const { data: payablesReport } = useQuery({
    queryKey: ['pos-report-payables'],
    queryFn: () => api.get('/reports/payables').then(r => r.data.data),
    enabled: tab === 'payables',
  })

  const totals = salesReport?.totals
  const sales = salesReport?.data ?? []
  const stockItems = stockReport ?? []
  const receivables = receivablesReport ?? []
  const payables = payablesReport ?? []

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg text-xs">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((p: any, i: number) => <p key={i} style={{ color: p.color }}>{p.name}: {formatRupiah(p.value)}</p>)}
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Laporan</h1>
        <p className="text-sm text-gray-500">Analisa bisnis & laporan keuangan</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={clsx('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === t.id ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
            <t.icon size={15} />{t.label}
          </button>
        ))}
      </div>

      {/* Date filter (sales only) */}
      {tab === 'sales' && (
        <div className="card p-4 flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Periode:</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="input w-40 text-sm" />
          <span className="text-gray-400">—</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="input w-40 text-sm" />
        </div>
      )}

      {/* Sales Report */}
      {tab === 'sales' && (
        <div className="space-y-5">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Transaksi', value: formatNumber(totals?.count ?? 0), color: 'bg-primary-500' },
              { label: 'Total Omzet', value: formatRupiah(totals?.grand_total ?? 0), color: 'bg-emerald-500' },
              { label: 'Total Diskon', value: formatRupiah(totals?.discount_amount ?? 0), color: 'bg-amber-500' },
              { label: 'Laba Kotor', value: formatRupiah(totals?.gross_profit ?? 0), color: 'bg-purple-500' },
            ].map(s => (
              <div key={s.label} className="card p-4">
                <div className={`w-2 h-2 rounded-full ${s.color} mb-2`} />
                <div className="text-lg font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Sales Table */}
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100"><h2 className="text-sm font-semibold">Detail Transaksi</h2></div>
            {loadingSales ? <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Memuat...</div> : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{['Invoice', 'Tanggal', 'Customer', 'Subtotal', 'Diskon', 'Total', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sales.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-8 text-gray-400">Tidak ada data</td></tr>
                  ) : sales.slice(0, 50).map((s: any) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 font-mono text-xs text-primary-600">{s.invoice_number}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-500">{formatDate(s.created_at)}</td>
                      <td className="px-4 py-2.5">{s.customer?.name ?? s.customer_name ?? 'Umum'}</td>
                      <td className="px-4 py-2.5">{formatRupiah(s.subtotal)}</td>
                      <td className="px-4 py-2.5 text-red-500">{formatRupiah(s.discount_amount)}</td>
                      <td className="px-4 py-2.5 font-bold">{formatRupiah(s.grand_total)}</td>
                      <td className="px-4 py-2.5"><span className={s.status === 'completed' ? 'badge-green' : 'badge-red'}>{s.status === 'completed' ? 'Selesai' : 'Batal'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Stock Report */}
      {tab === 'stock' && (
        <div className="space-y-4">
          <div className="card p-4 flex items-center gap-4">
            <div className="text-sm"><span className="text-gray-500">Total Produk: </span><span className="font-bold text-gray-900">{stockItems.length}</span></div>
            <div className="text-sm"><span className="text-gray-500">Nilai Stok: </span><span className="font-bold text-emerald-600">{formatRupiah(stockItems.reduce((s: number, i: any) => s + Number(i.stock_value), 0))}</span></div>
            <div className="text-sm"><span className="text-gray-500">Stok Menipis: </span><span className="font-bold text-red-600">{stockItems.filter((i: any) => Number(i.qty_on_hand) <= Number(i.min_stock_alert)).length}</span></div>
          </div>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>{['SKU', 'Produk', 'Kategori', 'Satuan', 'Stok', 'Min', 'H. Pokok', 'H. Jual', 'Nilai Stok'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stockItems.map((item: any) => {
                  const isLow = Number(item.qty_on_hand) <= Number(item.min_stock_alert)
                  return (
                    <tr key={item.id} className={clsx('hover:bg-gray-50', isLow && 'bg-red-50/30')}>
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-500">{item.sku}</td>
                      <td className="px-4 py-2.5 font-medium">{item.name}</td>
                      <td className="px-4 py-2.5 text-gray-500">{item.category ?? '-'}</td>
                      <td className="px-4 py-2.5 text-gray-500">{item.unit}</td>
                      <td className="px-4 py-2.5"><span className={clsx('font-bold', isLow ? 'text-red-600' : 'text-gray-900')}>{formatNumber(item.qty_on_hand)}</span></td>
                      <td className="px-4 py-2.5 text-gray-500">{item.min_stock_alert}</td>
                      <td className="px-4 py-2.5">{formatRupiah(item.cost_price)}</td>
                      <td className="px-4 py-2.5">{formatRupiah(item.selling_price)}</td>
                      <td className="px-4 py-2.5 font-semibold text-emerald-700">{formatRupiah(item.stock_value)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Receivables */}
      {tab === 'receivables' && (
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Piutang Customer</h2>
            <div className="text-sm font-bold text-red-600">{formatRupiah(receivables.reduce((s: number, r: any) => s + Number(r.remaining), 0))}</div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{['Kode', 'Customer', 'Invoice', 'Total', 'Dibayar', 'Sisa', 'Jatuh Tempo', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {receivables.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-gray-400">Tidak ada piutang</td></tr>
              ) : receivables.map((r: any) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-mono text-xs">{r.code}</td>
                  <td className="px-4 py-2.5 font-medium">{r.customer?.name}</td>
                  <td className="px-4 py-2.5 text-xs text-primary-600">{r.sale?.invoice_number ?? '-'}</td>
                  <td className="px-4 py-2.5">{formatRupiah(r.amount)}</td>
                  <td className="px-4 py-2.5 text-emerald-600">{formatRupiah(r.paid_amount)}</td>
                  <td className="px-4 py-2.5 font-bold text-red-600">{formatRupiah(r.remaining)}</td>
                  <td className="px-4 py-2.5 text-gray-500">{formatDate(r.due_date)}</td>
                  <td className="px-4 py-2.5"><span className={clsx('badge', r.status === 'paid' ? 'badge-green' : r.status === 'partial' ? 'badge-yellow' : 'badge-red')}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payables */}
      {tab === 'payables' && (
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Hutang Supplier</h2>
            <div className="text-sm font-bold text-red-600">{formatRupiah(payables.reduce((s: number, p: any) => s + Number(p.remaining), 0))}</div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{['Kode', 'Supplier', 'No. PO', 'Total', 'Dibayar', 'Sisa', 'Jatuh Tempo', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payables.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-gray-400">Tidak ada hutang</td></tr>
              ) : payables.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-mono text-xs">{p.code}</td>
                  <td className="px-4 py-2.5 font-medium">{p.supplier?.name}</td>
                  <td className="px-4 py-2.5 text-xs text-primary-600">{p.purchase?.po_number ?? '-'}</td>
                  <td className="px-4 py-2.5">{formatRupiah(p.amount)}</td>
                  <td className="px-4 py-2.5 text-emerald-600">{formatRupiah(p.paid_amount)}</td>
                  <td className="px-4 py-2.5 font-bold text-red-600">{formatRupiah(p.remaining)}</td>
                  <td className="px-4 py-2.5 text-gray-500">{formatDate(p.due_date)}</td>
                  <td className="px-4 py-2.5"><span className={clsx('badge', p.status === 'paid' ? 'badge-green' : p.status === 'partial' ? 'badge-yellow' : 'badge-red')}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
