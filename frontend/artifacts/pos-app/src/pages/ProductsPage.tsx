import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Edit2, Trash2, Package, AlertTriangle, X, Check, ImagePlus, Barcode, Grid, List } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import api from '../api/client'
import { formatRupiah, formatNumber } from '../utils/format'

const EMPTY_FORM = {
  name: '',
  sku: '',
  barcode: '',
  category_id: '',
  unit_id: '',
  supplier_id: '',
  cost_price: '',
  selling_price: '',
  wholesale_price: '',
  min_stock_alert: 5,
  brand: '',
  image_url: '',
  is_active: true,
  track_stock: true,
  tax_rate: 0,
}

export default function ProductsPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(EMPTY_FORM)

  const { data, isLoading } = useQuery({
    queryKey: ['pos-products', search, categoryId, page],
    queryFn: () => api.get('/products', { params: { search, category_id: categoryId || undefined, page, per_page: 20 } }).then((r) => r.data),
  })

  const { data: categoriesRes } = useQuery({
    queryKey: ['pos-categories-all'],
    queryFn: () => api.get('/categories/all').then((r) => r.data.data),
  })

  const { data: unitsRes } = useQuery({
    queryKey: ['pos-units'],
    queryFn: () => api.get('/categories/units').then((r) => r.data.data),
  })

  const saveMutation = useMutation({
    mutationFn: (payload: any) => (editing ? api.put(`/products/${editing.id}`, payload) : api.post('/products', payload)),
    onSuccess: () => {
      toast.success(editing ? 'Produk diupdate!' : 'Produk ditambahkan!')
      qc.invalidateQueries({ queryKey: ['pos-products'] })
      closeModal()
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Gagal menyimpan'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/products/${id}`),
    onSuccess: () => { toast.success('Produk dihapus'); qc.invalidateQueries({ queryKey: ['pos-products'] }) },
    onError: () => toast.error('Gagal menghapus'),
  })

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true) }
  const openEdit = (product: any) => {
    setEditing(product)
    setForm({ ...product, image_url: (product as any).image_url ?? '', category_id: product.category_id ?? '', unit_id: product.unit_id ?? '', supplier_id: product.supplier_id ?? '' })
    setShowModal(true)
  }
  const closeModal = () => { setShowModal(false); setEditing(null) }

  const products = data?.data ?? []
  const meta = data?.meta ?? {}

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Produk</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Kelola katalog produk toko bangunan.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={openCreate} className="btn-primary">
            <Plus size={16} /> Tambah Produk
          </button>
          <div className="inline-flex overflow-hidden rounded-full border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <button onClick={() => setViewMode('grid')} className={clsx('px-4 py-2 text-sm transition', viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900')}>
              <Grid size={16} />
            </button>
            <button onClick={() => setViewMode('table')} className={clsx('px-4 py-2 text-sm transition', viewMode === 'table' ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900')}>
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="card p-4 sm:p-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Cari produk, SKU, kategori..." className="input pl-12 shadow-sm" />
        </div>
        <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(1) }} className="input w-full max-w-[240px] text-sm">
          <option value="">Semua Kategori</option>
          {(categoriesRes ?? []).map((category: any) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="card animate-pulse p-5"></div>
            ))
          ) : products.length === 0 ? (
            <div className="card p-10 text-center text-slate-500 dark:text-slate-400">Belum ada produk untuk ditampilkan.</div>
          ) : (
            products.map((product: any) => {
              const stock = product.total_stock ?? 0
              const isLow = stock <= product.min_stock_alert
              return (
                <div key={product.id} className="card overflow-hidden rounded-[28px] border-slate-200 border shadow-sm transition hover:-translate-y-0.5 dark:border-slate-800">
                  <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-5 text-white">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-300">{product.category?.name ?? 'Umum'}</p>
                        <p className="mt-3 text-lg font-semibold">{product.name}</p>
                      </div>
                      <div className="rounded-3xl bg-white/10 px-3 py-2 text-xs font-semibold">{product.unit?.abbreviation}</div>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">SKU</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{product.sku}</p>
                      </div>
                      <span className={clsx('rounded-full px-3 py-1 text-xs font-semibold', isLow ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700')}>
                        {isLow ? 'Stok Rendah' : 'Stok Aman'}
                      </span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-900">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Harga Jual</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{formatRupiah(product.selling_price)}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-900">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Stok Tersedia</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{formatNumber(stock)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <button onClick={() => openEdit(product)} className="btn-secondary btn-sm w-full">
                        <Edit2 size={16} /> Edit
                      </button>
                      <button onClick={() => deleteMutation.mutate(product.id)} className="btn-danger btn-sm w-full">
                        <Trash2 size={16} /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                {['Produk', 'SKU', 'Kategori', 'Satuan', 'Harga Jual', 'Harga Pokok', 'Stok', 'Status', 'Aksi'].map((heading) => (
                  <th key={heading} className="whitespace-nowrap px-4 py-4 text-left font-semibold uppercase tracking-wider">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr><td colSpan={9} className="py-10 text-center">Memuat...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={9} className="py-10 text-center">Tidak ada produk</td></tr>
              ) : products.map((product: any) => {
                const stock = product.total_stock ?? 0
                return (
                  <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                    <td className="px-4 py-4 font-semibold text-slate-900 dark:text-slate-100">{product.name}</td>
                    <td className="px-4 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{product.sku}</td>
                    <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{product.category?.name ?? '-'}</td>
                    <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{product.unit?.abbreviation ?? '-'}</td>
                    <td className="px-4 py-4 font-semibold text-slate-900 dark:text-slate-100">{formatRupiah(product.selling_price)}</td>
                    <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{formatRupiah(product.cost_price)}</td>
                    <td className="px-4 py-4">
                      <span className={clsx('rounded-full px-2 py-1 text-xs font-semibold', stock <= product.min_stock_alert ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700')}>
                        {formatNumber(stock)}
                      </span>
                    </td>
                    <td className="px-4 py-4">{product.is_active ? <span className="badge badge-green">Aktif</span> : <span className="badge badge-gray">Nonaktif</span>}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(product)} className="rounded-2xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">Edit</button>
                        <button onClick={() => deleteMutation.mutate(product.id)} className="rounded-2xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700">Hapus</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {meta.last_page > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400">Menampilkan {meta.from}–{meta.to} dari {meta.total} produk</div>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(meta.last_page, 5) }, (_, index) => index + 1).map((pageNumber) => (
                  <button key={pageNumber} onClick={() => setPage(pageNumber)} className={clsx('h-9 w-9 rounded-2xl text-sm transition', pageNumber === page ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800')}>
                    {pageNumber}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[32px] bg-white p-6 shadow-2xl dark:bg-slate-950">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{editing ? 'Edit Produk' : 'Tambah Produk'}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Kelola detail produk, barcode, dan harga grosir.</p>
              </div>
              <button onClick={closeModal} className="rounded-2xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form) }} className="mt-5 grid gap-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <label className="label">Nama Produk *</label>
                  <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <label className="label">SKU</label>
                  <input className="input" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <label className="label">Barcode</label>
                  <div className="relative">
                    <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input className="input pl-12" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
                  </div>
                  {form.barcode && <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">Preview barcode: {form.barcode}</div>}
                </div>
                <div className="space-y-2">
                  <label className="label">Kategori</label>
                  <select className="input" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                    <option value="">Pilih kategori</option>
                    {(categoriesRes ?? []).map((category: any) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div className="space-y-2">
                  <label className="label">Satuan *</label>
                  <select className="input" value={form.unit_id} onChange={(e) => setForm({ ...form, unit_id: e.target.value })} required>
                    <option value="">Pilih satuan</option>
                    {(unitsRes ?? []).map((unit: any) => <option key={unit.id} value={unit.id}>{unit.name} ({unit.abbreviation})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="label">Harga Jual *</label>
                  <input type="number" min="0" className="input" value={form.selling_price} onChange={(e) => setForm({ ...form, selling_price: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <label className="label">Harga Grosir</label>
                  <input type="number" min="0" className="input" value={form.wholesale_price} onChange={(e) => setForm({ ...form, wholesale_price: e.target.value })} />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div className="space-y-2">
                  <label className="label">Harga Pokok</label>
                  <input type="number" min="0" className="input" value={form.cost_price} onChange={(e) => setForm({ ...form, cost_price: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="label">Stok Minimum</label>
                  <input type="number" min="0" className="input" value={form.min_stock_alert} onChange={(e) => setForm({ ...form, min_stock_alert: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="label">Brand</label>
                  <input className="input" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <label className="label">URL Gambar</label>
                  <div className="relative">
                    <ImagePlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input className="input pl-12" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="label">Pajak %</label>
                  <input type="number" min="0" max="100" className="input" value={form.tax_rate} onChange={(e) => setForm({ ...form, tax_rate: e.target.value })} />
                </div>
              </div>

              {form.image_url && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Preview Gambar Produk</p>
                  <img src={form.image_url} alt="Preview" className="mt-3 h-44 w-full rounded-3xl object-cover" />
                </div>
              )}

              <div className="flex flex-wrap gap-3 justify-end pt-2">
                <button type="button" onClick={closeModal} className="btn-secondary">Batal</button>
                <button type="submit" disabled={saveMutation.isPending} className="btn-primary">
                  {saveMutation.isPending ? 'Menyimpan...' : <><Check size={16} /> Simpan</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
