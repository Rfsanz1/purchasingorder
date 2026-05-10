import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Eye, XCircle, Receipt, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import api from '../api/client'
import { formatRupiah, formatDateTime } from '../utils/format'

const STATUS_COLORS: Record<string, string> = { completed: 'badge-green', cancelled: 'badge-red', draft: 'badge-yellow' }
const PAY_COLORS: Record<string, string> = { paid: 'badge-green', partial: 'badge-yellow', unpaid: 'badge-red' }

export default function SalesHistoryPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [payStatus, setPayStatus] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<any>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['pos-sales', search, status, payStatus, dateFrom, dateTo, page],
    queryFn: () => api.get('/sales', { params: { search, status: status || undefined, payment_status: payStatus || undefined, date_from: dateFrom || undefined, date_to: dateTo || undefined, page } }).then(r => r.data),
  })

  const { data: detail } = useQuery({
    queryKey: ['pos-sale-detail', selected?.id],
    queryFn: () => selected ? api.get(`/sales/${selected.id}`).then(r => r.data.data) : null,
    enabled: !!selected,
  })

  const cancelMutation = useMutation({
    mutationFn: (id: number) => api.post(`/sales/${id}/cancel`),
    onSuccess: () => { toast.success('Transaksi dibatalkan'); qc.invalidateQueries({ queryKey: ['pos-sales'] }); setSelected(null) },
    onError: () => toast.error('Gagal membatalkan'),
  })

  const sales = data?.data ?? []
  const meta = data?.meta ?? {}

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Riwayat Penjualan</h1>
          <p className="text-sm text-gray-500">Semua transaksi penjualan</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Receipt size={16} />
          <span className="font-semibold text-gray-700">{meta.total ?? 0}</span> transaksi
        </div>
      </div>

      <div className="card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input type="text" placeholder="Cari no. invoice..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} className="input pl-9 text-sm" />
        </div>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }} className="input w-36 text-sm">
          <option value="">Semua Status</option>
          <option value="completed">Selesai</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
        <select value={payStatus} onChange={e => { setPayStatus(e.target.value); setPage(1) }} className="input w-40 text-sm">
          <option value="">Semua Pembayaran</option>
          <option value="paid">Lunas</option>
          <option value="partial">Sebagian</option>
          <option value="unpaid">Belum Bayar</option>
        </select>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="input w-38 text-sm" />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="input w-38 text-sm" />
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Memuat...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['No. Invoice', 'Tanggal', 'Customer', 'Kasir', 'Total', 'Dibayar', 'Status', 'Pembayaran', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sales.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400">
                  <Receipt size={32} className="mx-auto mb-2 opacity-30" />Belum ada transaksi
                </td></tr>
              ) : sales.map((s: any) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-primary-600">{s.invoice_number}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDateTime(s.created_at)}</td>
                  <td className="px-4 py-3"><div className="font-medium text-gray-900">{s.customer?.name ?? s.customer_name ?? 'Umum'}</div></td>
                  <td className="px-4 py-3 text-gray-500">{s.cashier?.name}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{formatRupiah(s.grand_total)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatRupiah(s.paid_amount)}</td>
                  <td className="px-4 py-3"><span className={clsx('badge', STATUS_COLORS[s.status] ?? 'badge-gray')}>{s.status === 'completed' ? 'Selesai' : s.status === 'cancelled' ? 'Batal' : s.status}</span></td>
                  <td className="px-4 py-3"><span className={clsx('badge', PAY_COLORS[s.payment_status] ?? 'badge-gray')}>{s.payment_status === 'paid' ? 'Lunas' : s.payment_status === 'partial' ? 'Sebagian' : 'Belum'}</span></td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(s)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><Eye size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {meta.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Total {meta.total} transaksi</p>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(meta.last_page, 5) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={clsx('w-8 h-8 rounded-lg text-xs font-medium', p === page ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>{p}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && detail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b z-10">
              <div>
                <h2 className="text-lg font-bold">{detail.invoice_number}</h2>
                <p className="text-xs text-gray-400">{formatDateTime(detail.created_at)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg"><XCircle size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Customer:</span> <span className="font-medium">{detail.customer?.name ?? detail.customer_name ?? 'Umum'}</span></div>
                <div><span className="text-gray-500">Kasir:</span> <span className="font-medium">{detail.cashier?.name}</span></div>
              </div>
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50"><tr>
                    <th className="text-left px-3 py-2">Produk</th>
                    <th className="text-right px-3 py-2">Qty</th>
                    <th className="text-right px-3 py-2">Harga</th>
                    <th className="text-right px-3 py-2">Total</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {detail.items?.map((item: any) => (
                      <tr key={item.id}>
                        <td className="px-3 py-2">{item.product_name}</td>
                        <td className="px-3 py-2 text-right">{item.qty} {item.unit?.abbreviation}</td>
                        <td className="px-3 py-2 text-right">{formatRupiah(item.unit_price)}</td>
                        <td className="px-3 py-2 text-right font-semibold">{formatRupiah(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatRupiah(detail.subtotal)}</span></div>
                {parseFloat(detail.discount_amount) > 0 && <div className="flex justify-between text-red-500"><span>Diskon</span><span>-{formatRupiah(detail.discount_amount)}</span></div>}
                {parseFloat(detail.tax_amount) > 0 && <div className="flex justify-between text-gray-500"><span>Pajak</span><span>{formatRupiah(detail.tax_amount)}</span></div>}
                <div className="flex justify-between font-bold border-t pt-1"><span>Total</span><span className="text-primary-600">{formatRupiah(detail.grand_total)}</span></div>
                <div className="flex justify-between text-gray-500"><span>Dibayar</span><span>{formatRupiah(detail.paid_amount)}</span></div>
                {parseFloat(detail.change_amount) > 0 && <div className="flex justify-between text-emerald-600"><span>Kembalian</span><span>{formatRupiah(detail.change_amount)}</span></div>}
              </div>
              <div className="flex gap-2">
                {detail.payments?.map((p: any, i: number) => (
                  <span key={i} className="badge badge-blue capitalize">{p.method}: {formatRupiah(p.amount)}</span>
                ))}
              </div>
              {detail.status === 'completed' && (
                <button onClick={() => { if (confirm('Batalkan transaksi ini?')) cancelMutation.mutate(detail.id) }}
                  className="btn-danger w-full btn-sm">
                  <XCircle size={14} /> Batalkan Transaksi
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
