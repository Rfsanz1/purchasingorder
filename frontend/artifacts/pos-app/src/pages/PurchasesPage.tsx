import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Eye, ShoppingBag, X, Check, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import api from '../api/client'
import { formatRupiah, formatDate } from '../utils/format'

const STATUS_COLORS: Record<string, string> = { draft: 'badge-gray', ordered: 'badge-blue', received: 'badge-green', cancelled: 'badge-red', partial: 'badge-yellow' }
const STATUS_LABELS: Record<string, string> = { draft: 'Draft', ordered: 'Dipesan', received: 'Diterima', cancelled: 'Batal', partial: 'Sebagian' }

export default function PurchasesPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<any>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ supplier_id: '', warehouse_id: 1, order_date: new Date().toISOString().slice(0, 10), expected_date: '', notes: '', items: [{ product_id: '', product_name: '', unit_id: '', qty_ordered: 1, unit_price: 0 }] })

  const { data, isLoading } = useQuery({
    queryKey: ['pos-purchases', search, status, page],
    queryFn: () => api.get('/purchases', { params: { search, status: status || undefined, page } }).then(r => r.data),
  })

  const { data: detail } = useQuery({
    queryKey: ['pos-purchase-detail', selected?.id],
    queryFn: () => selected ? api.get(`/purchases/${selected.id}`).then(r => r.data.data) : null,
    enabled: !!selected,
  })

  const { data: suppliersRes } = useQuery({ queryKey: ['pos-suppliers-simple'], queryFn: () => api.get('/suppliers?per_page=100').then(r => r.data.data) })
  const { data: productsRes } = useQuery({ queryKey: ['pos-products-simple'], queryFn: () => api.get('/products?per_page=200').then(r => r.data.data) })
  const { data: unitsRes } = useQuery({ queryKey: ['pos-units'], queryFn: () => api.get('/categories/units').then(r => r.data.data) })
  const { data: warehousesRes } = useQuery({ queryKey: ['pos-warehouses'], queryFn: () => api.get('/inventory/warehouses').then(r => r.data.data) })

  const createMutation = useMutation({
    mutationFn: (d: any) => api.post('/purchases', d),
    onSuccess: () => { toast.success('PO berhasil dibuat!'); qc.invalidateQueries({ queryKey: ['pos-purchases'] }); setShowCreate(false) },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Gagal'),
  })

  const receiveMutation = useMutation({
    mutationFn: (id: number) => api.post(`/purchases/${id}/receive`),
    onSuccess: () => { toast.success('Barang diterima!'); qc.invalidateQueries({ queryKey: ['pos-purchases'] }); setSelected(null) },
    onError: () => toast.error('Gagal menerima'),
  })

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { product_id: '', product_name: '', unit_id: '', qty_ordered: 1, unit_price: 0 }] }))
  const removeItem = (i: number) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }))
  const updateItem = (i: number, field: string, value: any) => {
    setForm(f => {
      const items = [...f.items]
      if (field === 'product_id') {
        const product = (productsRes ?? []).find((p: any) => p.id == value)
        items[i] = { ...items[i], product_id: value, product_name: product?.name ?? '', unit_id: product?.unit_id ?? '', unit_price: parseFloat(product?.cost_price ?? 0) }
      } else {
        items[i] = { ...items[i], [field]: value }
      }
      return { ...f, items }
    })
  }

  const grandTotal = form.items.reduce((s, i) => s + (Number(i.qty_ordered) * Number(i.unit_price)), 0)
  const purchases = data?.data ?? []
  const meta = data?.meta ?? {}

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-gray-900">Pembelian</h1><p className="text-sm text-gray-500">Purchase Order & penerimaan barang</p></div>
        <button onClick={() => setShowCreate(true)} className="btn-primary"><Plus size={16} /> Buat PO</button>
      </div>

      <div className="card p-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input type="text" placeholder="Cari no. PO..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} className="input pl-9 text-sm" />
        </div>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }} className="input w-40 text-sm">
          <option value="">Semua Status</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Memuat...</div> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{['No. PO', 'Tanggal', 'Supplier', 'Gudang', 'Total', 'Status', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {purchases.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400"><ShoppingBag size={32} className="mx-auto mb-2 opacity-30" />Belum ada PO</td></tr>
              ) : purchases.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-primary-600">{p.po_number}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(p.order_date)}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.supplier?.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.warehouse?.name}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{formatRupiah(p.grand_total)}</td>
                  <td className="px-4 py-3"><span className={clsx('badge', STATUS_COLORS[p.status] ?? 'badge-gray')}>{STATUS_LABELS[p.status] ?? p.status}</span></td>
                  <td className="px-4 py-3"><button onClick={() => setSelected(p)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"><Eye size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selected && detail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b z-10">
              <div><h2 className="text-lg font-bold">{detail.po_number}</h2><p className="text-xs text-gray-400">{detail.supplier?.name}</p></div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500">Status: </span><span className={clsx('badge', STATUS_COLORS[detail.status])}>{STATUS_LABELS[detail.status]}</span></div>
                <div><span className="text-gray-500">Tanggal: </span><span className="font-medium">{formatDate(detail.order_date)}</span></div>
              </div>
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50"><tr>
                    <th className="text-left px-3 py-2">Produk</th>
                    <th className="text-right px-3 py-2">Dipesan</th>
                    <th className="text-right px-3 py-2">Diterima</th>
                    <th className="text-right px-3 py-2">Harga</th>
                    <th className="text-right px-3 py-2">Total</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {detail.items?.map((item: any) => (
                      <tr key={item.id}>
                        <td className="px-3 py-2">{item.product_name}</td>
                        <td className="px-3 py-2 text-right">{item.qty_ordered} {item.unit?.abbreviation}</td>
                        <td className="px-3 py-2 text-right text-emerald-600">{item.qty_received}</td>
                        <td className="px-3 py-2 text-right">{formatRupiah(item.unit_price)}</td>
                        <td className="px-3 py-2 text-right font-semibold">{formatRupiah(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between font-bold text-sm bg-gray-50 rounded-xl p-3">
                <span>Grand Total</span><span className="text-primary-600">{formatRupiah(detail.grand_total)}</span>
              </div>
              {detail.status === 'ordered' && (
                <button onClick={() => { if (confirm('Tandai semua barang telah diterima?')) receiveMutation.mutate(detail.id) }}
                  className="btn-success w-full"><Check size={16} /> Tandai Barang Diterima</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create PO Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b z-10">
              <h2 className="text-lg font-bold">Buat Purchase Order</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); createMutation.mutate(form) }} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Supplier *</label>
                  <select value={form.supplier_id} onChange={e => setForm({ ...form, supplier_id: e.target.value })} className="input" required>
                    <option value="">-- Pilih Supplier --</option>
                    {(suppliersRes ?? []).map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Gudang *</label>
                  <select value={form.warehouse_id} onChange={e => setForm({ ...form, warehouse_id: Number(e.target.value) })} className="input" required>
                    {(warehousesRes ?? []).map((w: any) => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Tanggal Order</label>
                  <input type="date" value={form.order_date} onChange={e => setForm({ ...form, order_date: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="label">Estimasi Tiba</label>
                  <input type="date" value={form.expected_date} onChange={e => setForm({ ...form, expected_date: e.target.value })} className="input" />
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">Item Produk *</label>
                  <button type="button" onClick={addItem} className="btn-secondary btn-sm"><Plus size={13} /> Tambah Item</button>
                </div>
                <div className="space-y-2">
                  {form.items.map((item, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center bg-gray-50 rounded-lg p-2">
                      <div className="col-span-5">
                        <select value={item.product_id} onChange={e => updateItem(i, 'product_id', e.target.value)} className="input text-xs" required>
                          <option value="">-- Produk --</option>
                          {(productsRes ?? []).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <select value={item.unit_id} onChange={e => updateItem(i, 'unit_id', e.target.value)} className="input text-xs" required>
                          <option value="">Satuan</option>
                          {(unitsRes ?? []).map((u: any) => <option key={u.id} value={u.id}>{u.abbreviation}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <input type="number" min={1} value={item.qty_ordered} onChange={e => updateItem(i, 'qty_ordered', e.target.value)} className="input text-xs" placeholder="Qty" required />
                      </div>
                      <div className="col-span-2">
                        <input type="number" min={0} value={item.unit_price} onChange={e => updateItem(i, 'unit_price', e.target.value)} className="input text-xs" placeholder="Harga" />
                      </div>
                      <button type="button" onClick={() => removeItem(i)} className="col-span-1 p-1 text-red-400 hover:text-red-600"><X size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center bg-primary-50 rounded-xl p-3">
                <span className="text-sm font-semibold text-primary-800">Total PO</span>
                <span className="text-xl font-extrabold text-primary-700">{formatRupiah(grandTotal)}</span>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Batal</button>
                <button type="submit" disabled={createMutation.isPending} className="btn-primary">
                  {createMutation.isPending ? 'Menyimpan...' : <><Check size={15} /> Buat PO</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
