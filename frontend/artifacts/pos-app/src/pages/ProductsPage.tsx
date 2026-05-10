import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Edit2, Trash2, Package, AlertTriangle, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import api from '../api/client'
import { formatRupiah, formatNumber } from '../utils/format'

interface Product { id: number; sku: string; name: string; selling_price: string; cost_price: string; category?: { name: string }; unit?: { abbreviation: string }; is_active: boolean; min_stock_alert: number; total_stock?: number; brand?: string }

const EMPTY_FORM = { name: '', sku: '', barcode: '', category_id: '', unit_id: '', supplier_id: '', cost_price: '', selling_price: '', wholesale_price: '', min_stock_alert: 5, brand: '', is_active: true, track_stock: true, tax_rate: 0 }

export default function ProductsPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<any>(EMPTY_FORM)

  const { data, isLoading } = useQuery({
    queryKey: ['pos-products', search, categoryId, page],
    queryFn: () => api.get('/products', { params: { search, category_id: categoryId || undefined, page, per_page: 20 } }).then(r => r.data),
  })

  const { data: categoriesRes } = useQuery({
    queryKey: ['pos-categories-all'],
    queryFn: () => api.get('/categories/all').then(r => r.data.data),
  })

  const { data: unitsRes } = useQuery({
    queryKey: ['pos-units'],
    queryFn: () => api.get('/categories/units').then(r => r.data.data),
  })

  const saveMutation = useMutation({
    mutationFn: (d: any) => editing ? api.put(`/products/${editing.id}`, d) : api.post('/products', d),
    onSuccess: () => {
      toast.success(editing ? 'Produk diupdate!' : 'Produk ditambahkan!')
      qc.invalidateQueries({ queryKey: ['pos-products'] })
      closeModal()
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Gagal menyimpan'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/products/${id}`),
    onSuccess: () => { toast.success('Produk dihapus'); qc.invalidateQueries({ queryKey: ['pos-products'] }) },
    onError: () => toast.error('Gagal menghapus'),
  })

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true) }
  const openEdit = (p: Product) => { setEditing(p); setForm({ ...p, category_id: (p as any).category_id ?? '', unit_id: (p as any).unit_id ?? '', supplier_id: (p as any).supplier_id ?? '' }); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditing(null) }

  const products = data?.data ?? []
  const meta = data?.meta ?? {}

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Produk</h1>
          <p className="text-sm text-gray-500">Kelola katalog produk toko</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} /> Tambah Produk
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input type="text" placeholder="Cari produk, SKU, barcode..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="input pl-9 text-sm" />
        </div>
        <select value={categoryId} onChange={e => { setCategoryId(e.target.value); setPage(1) }}
          className="input w-44 text-sm">
          <option value="">Semua Kategori</option>
          {(categoriesRes ?? []).map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Memuat...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['SKU', 'Nama Produk', 'Kategori', 'Satuan', 'Harga Jual', 'Harga Pokok', 'Stok', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400">
                  <Package size={32} className="mx-auto mb-2 opacity-30" />
                  Belum ada produk
                </td></tr>
              ) : products.map((p: Product) => {
                const stock = (p as any).inventories?.reduce((s: number, i: any) => s + parseFloat(i.qty_on_hand), 0) ?? 0
                const isLow = stock <= p.min_stock_alert
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.sku}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{p.name}</div>
                      {p.brand && <div className="text-xs text-gray-400">{p.brand}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.category?.name ?? '-'}</td>
                    <td className="px-4 py-3 text-gray-500">{p.unit?.abbreviation ?? '-'}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{formatRupiah(p.selling_price)}</td>
                    <td className="px-4 py-3 text-gray-500">{formatRupiah(p.cost_price)}</td>
                    <td className="px-4 py-3">
                      <span className={clsx('flex items-center gap-1 text-xs font-medium', isLow ? 'text-red-600' : 'text-gray-700')}>
                        {isLow && <AlertTriangle size={12} />}
                        {formatNumber(stock)} {p.unit?.abbreviation}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={p.is_active ? 'badge-green' : 'badge-gray'}>{p.is_active ? 'Aktif' : 'Nonaktif'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => { if (confirm(`Hapus ${p.name}?`)) deleteMutation.mutate(p.id) }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Menampilkan {meta.from}–{meta.to} dari {meta.total} produk</p>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(meta.last_page, 5) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={clsx('w-8 h-8 rounded-lg text-xs font-medium transition-colors',
                    p === page ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b z-10">
              <h2 className="text-lg font-bold">{editing ? 'Edit Produk' : 'Tambah Produk'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); saveMutation.mutate(form) }} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Nama Produk *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" required />
                </div>
                <div>
                  <label className="label">SKU</label>
                  <input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} className="input" placeholder="Auto-generate" />
                </div>
                <div>
                  <label className="label">Barcode</label>
                  <input value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="label">Kategori</label>
                  <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className="input">
                    <option value="">-- Pilih Kategori --</option>
                    {(categoriesRes ?? []).map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Satuan *</label>
                  <select value={form.unit_id} onChange={e => setForm({ ...form, unit_id: e.target.value })} className="input" required>
                    <option value="">-- Pilih Satuan --</option>
                    {(unitsRes ?? []).map((u: any) => <option key={u.id} value={u.id}>{u.name} ({u.abbreviation})</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Harga Pokok</label>
                  <input type="number" min={0} value={form.cost_price} onChange={e => setForm({ ...form, cost_price: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="label">Harga Jual *</label>
                  <input type="number" min={0} value={form.selling_price} onChange={e => setForm({ ...form, selling_price: e.target.value })} className="input" required />
                </div>
                <div>
                  <label className="label">Harga Grosir</label>
                  <input type="number" min={0} value={form.wholesale_price} onChange={e => setForm({ ...form, wholesale_price: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="label">Stok Minimum Alert</label>
                  <input type="number" min={0} value={form.min_stock_alert} onChange={e => setForm({ ...form, min_stock_alert: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="label">Brand</label>
                  <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="label">Pajak %</label>
                  <input type="number" min={0} max={100} value={form.tax_rate} onChange={e => setForm({ ...form, tax_rate: e.target.value })} className="input" />
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded text-primary-600" />
                    <span className="text-sm text-gray-700">Produk Aktif</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.track_stock} onChange={e => setForm({ ...form, track_stock: e.target.checked })} className="w-4 h-4 rounded text-primary-600" />
                    <span className="text-sm text-gray-700">Pantau Stok</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={closeModal} className="btn-secondary">Batal</button>
                <button type="submit" disabled={saveMutation.isPending} className="btn-primary">
                  {saveMutation.isPending ? 'Menyimpan...' : <><Check size={15} /> Simpan</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
