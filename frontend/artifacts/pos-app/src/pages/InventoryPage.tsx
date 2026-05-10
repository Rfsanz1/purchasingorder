import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Warehouse, AlertTriangle, Plus, ArrowUpDown, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import api from '../api/client'
import { formatNumber, formatRupiah } from '../utils/format'

export default function InventoryPage() {
  const qc = useQueryClient()
  const [warehouseId, setWarehouseId] = useState(1)
  const [showAdjust, setShowAdjust] = useState(false)
  const [adjustForm, setAdjustForm] = useState({ product_id: '', warehouse_id: 1, unit_id: '', type: 'in', qty: '', cost_price: '', notes: '' })

  const { data: warehousesRes } = useQuery({ queryKey: ['pos-warehouses'], queryFn: () => api.get('/inventory/warehouses').then((r) => r.data.data) })
  const { data: stock, isLoading } = useQuery({ queryKey: ['pos-stock', warehouseId], queryFn: () => api.get('/inventory/stock', { params: { warehouse_id: warehouseId } }).then((r) => r.data.data) })
  const { data: productsRes } = useQuery({ queryKey: ['pos-products-simple'], queryFn: () => api.get('/products', { params: { per_page: 100 } }).then((r) => r.data.data) })
  const { data: unitsRes } = useQuery({ queryKey: ['pos-units'], queryFn: () => api.get('/categories/units').then((r) => r.data.data) })
  const { data: stockValue } = useQuery({ queryKey: ['pos-stock-value', warehouseId], queryFn: () => api.get('/inventory/stock-value', { params: { warehouse_id: warehouseId } }).then((r) => r.data) })

  const adjustMutation = useMutation({
    mutationFn: (payload: any) => api.post('/inventory/adjust', payload),
    onSuccess: () => { toast.success('Stok berhasil disesuaikan!'); qc.invalidateQueries({ queryKey: ['pos-stock'] }); setShowAdjust(false); setAdjustForm({ product_id: '', warehouse_id: warehouseId, unit_id: '', type: 'in', qty: '', cost_price: '', notes: '' }) },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Gagal'),
  })

  const items = stock ?? []
  const lowItems = items.filter((item: any) => item.is_low)
  const totalValue = stockValue?.stock_value ?? 0

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Manajemen Stok</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Pantau stok, nilai inventory, dan mutasi gudang.</p>
        </div>
        <button onClick={() => setShowAdjust(true)} className="btn-primary inline-flex items-center gap-2">
          <Plus size={16} /> Penyesuaian Stok
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-3xl bg-sky-100 text-sky-700"><Warehouse size={20} /></div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Produk</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{items.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-3xl bg-amber-100 text-amber-700"><AlertTriangle size={20} /></div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Stok Menipis</p>
              <p className="mt-2 text-2xl font-semibold text-rose-700">{lowItems.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-3xl bg-emerald-100 text-emerald-700"><ArrowUpDown size={20} /></div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Nilai Stok</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{formatRupiah(totalValue)}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-3xl bg-slate-100 text-slate-700"><Warehouse size={20} /></div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Gudang Aktif</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{warehousesRes?.length ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Filter Gudang</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pilih gudang untuk melihat stok per lokasi.</p>
          </div>
          <select value={warehouseId} onChange={(e) => setWarehouseId(Number(e.target.value))} className="input w-full max-w-xs">
            {(warehousesRes ?? []).map((warehouse: any) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}
          </select>
        </div>
      </div>

      {lowItems.length > 0 && (
        <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 shadow-sm dark:border-amber-300/30 dark:bg-amber-950/20 dark:text-amber-200">
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} />
            <div>
              <p className="font-semibold">{lowItems.length} produk stok menipis</p>
              <p className="text-slate-700 dark:text-amber-200">{lowItems.slice(0, 3).map((item: any) => item.product_name).join(', ')}{lowItems.length > 3 ? ` dan ${lowItems.length - 3} lainnya` : ''}</p>
            </div>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="grid gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
          <div className="rounded-[28px] bg-slate-50 p-4 dark:bg-slate-950">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Produk</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">{items.length}</p>
          </div>
          <div className="rounded-[28px] bg-slate-50 p-4 dark:bg-slate-950">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Stok Menipis</p>
            <p className="mt-3 text-2xl font-semibold text-rose-700">{lowItems.length}</p>
          </div>
          <div className="rounded-[28px] bg-slate-50 p-4 dark:bg-slate-950">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Nilai Gudang</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">{formatRupiah(totalValue)}</p>
          </div>
          <div className="rounded-[28px] bg-slate-50 p-4 dark:bg-slate-950">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Transfer & Mutasi</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">Realtime</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                {['Produk', 'SKU', 'Kategori', 'Satuan', 'Stok', 'Min. Stok', 'Nilai', 'Status'].map((label) => (
                  <th key={label} className="whitespace-nowrap px-4 py-4 text-left font-semibold uppercase tracking-wider">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr><td colSpan={8} className="py-10 text-center">Memuat...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={8} className="py-10 text-center">Tidak ada stok</td></tr>
              ) : items.map((item: any) => (
                <tr key={item.product_id} className={clsx('hover:bg-slate-50 dark:hover:bg-slate-900', item.is_low && 'bg-rose-50/50 dark:bg-rose-900/30')}>
                  <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-100">{item.product_name}</td>
                  <td className="px-4 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{item.sku}</td>
                  <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{item.category ?? '-'}</td>
                  <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{item.unit}</td>
                  <td className="px-4 py-4 font-semibold text-slate-900 dark:text-slate-100">{formatNumber(item.qty_on_hand)}</td>
                  <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{item.min_stock}</td>
                  <td className="px-4 py-4 text-slate-900 dark:text-slate-100">{formatRupiah(item.stock_value)}</td>
                  <td className="px-4 py-4">
                    <span className={clsx('badge text-xs', item.is_low ? 'badge-red' : 'badge-green')}>
                      {item.is_low ? 'Habis / Menipis' : 'Normal'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdjust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[32px] bg-white p-6 shadow-2xl dark:bg-slate-950">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Penyesuaian Stok</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Ubah stok atau catat mutasi gudang.</p>
              </div>
              <button onClick={() => setShowAdjust(false)} className="rounded-2xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); adjustMutation.mutate({ ...adjustForm, warehouse_id: warehouseId }) }} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Produk *</label>
                  <select className="input w-full" value={adjustForm.product_id} onChange={(e) => setAdjustForm({ ...adjustForm, product_id: e.target.value })} required>
                    <option value="">Pilih produk</option>
                    {(productsRes ?? []).map((product: any) => <option key={product.id} value={product.id}>{product.name} ({product.sku})</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Satuan *</label>
                  <select className="input w-full" value={adjustForm.unit_id} onChange={(e) => setAdjustForm({ ...adjustForm, unit_id: e.target.value })} required>
                    <option value="">Pilih satuan</option>
                    {(unitsRes ?? []).map((unit: any) => <option key={unit.id} value={unit.id}>{unit.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Tipe</label>
                  <select className="input w-full" value={adjustForm.type} onChange={(e) => setAdjustForm({ ...adjustForm, type: e.target.value })}>
                    <option value="in">Masuk</option>
                    <option value="out">Keluar</option>
                    <option value="adjustment">Penyesuaian</option>
                  </select>
                </div>
                <div>
                  <label className="label">Jumlah *</label>
                  <input type="number" min="0" className="input w-full" value={adjustForm.qty} onChange={(e) => setAdjustForm({ ...adjustForm, qty: e.target.value })} required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Harga Pokok</label>
                  <input type="number" min="0" className="input w-full" value={adjustForm.cost_price} onChange={(e) => setAdjustForm({ ...adjustForm, cost_price: e.target.value })} />
                </div>
                <div>
                  <label className="label">Gudang</label>
                  <select className="input w-full" value={warehouseId} disabled>
                    {(warehousesRes ?? []).map((warehouse: any) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Catatan</label>
                <textarea value={adjustForm.notes} onChange={(e) => setAdjustForm({ ...adjustForm, notes: e.target.value })} rows={3} className="input w-full resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAdjust(false)} className="btn-secondary">Batal</button>
                <button type="submit" className="btn-primary">Simpan Penyesuaian</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
