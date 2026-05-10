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

  const { data: warehousesRes } = useQuery({ queryKey: ['pos-warehouses'], queryFn: () => api.get('/inventory/warehouses').then(r => r.data.data) })
  const { data: stock, isLoading } = useQuery({ queryKey: ['pos-stock', warehouseId], queryFn: () => api.get(`/inventory/stock?warehouse_id=${warehouseId}`).then(r => r.data.data) })
  const { data: productsRes } = useQuery({ queryKey: ['pos-products-simple'], queryFn: () => api.get('/products?per_page=100').then(r => r.data.data) })
  const { data: unitsRes } = useQuery({ queryKey: ['pos-units'], queryFn: () => api.get('/categories/units').then(r => r.data.data) })

  const { data: stockValue } = useQuery({ queryKey: ['pos-stock-value', warehouseId], queryFn: () => api.get(`/inventory/stock-value?warehouse_id=${warehouseId}`).then(r => r.data) })

  const adjustMutation = useMutation({
    mutationFn: (d: any) => api.post('/inventory/adjust', d),
    onSuccess: () => { toast.success('Stok berhasil disesuaikan!'); qc.invalidateQueries({ queryKey: ['pos-stock'] }); setShowAdjust(false); setAdjustForm({ product_id: '', warehouse_id: warehouseId, unit_id: '', type: 'in', qty: '', cost_price: '', notes: '' }) },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Gagal'),
  })

  const items = stock ?? []
  const lowItems = items.filter((i: any) => i.is_low)
  const totalValue = stockValue?.stock_value ?? 0

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Manajemen Stok</h1>
          <p className="text-sm text-gray-500">Stok barang per gudang</p>
        </div>
        <button onClick={() => setShowAdjust(true)} className="btn-primary">
          <Plus size={16} /> Penyesuaian Stok
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center"><Warehouse className="text-primary-600" size={20} /></div>
            <div>
              <div className="text-lg font-bold text-gray-900">{items.length}</div>
              <div className="text-xs text-gray-500">Total Jenis Produk</div>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center"><AlertTriangle className="text-amber-600" size={20} /></div>
            <div>
              <div className="text-lg font-bold text-red-600">{lowItems.length}</div>
              <div className="text-xs text-gray-500">Stok Menipis</div>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center"><ArrowUpDown className="text-emerald-600" size={20} /></div>
            <div>
              <div className="text-sm font-bold text-gray-900">{formatRupiah(totalValue)}</div>
              <div className="text-xs text-gray-500">Nilai Stok</div>
            </div>
          </div>
        </div>
      </div>

      {/* Warehouse selector */}
      <div className="card p-4 flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Gudang:</label>
        <select value={warehouseId} onChange={e => setWarehouseId(Number(e.target.value))} className="input w-52 text-sm">
          {(warehousesRes ?? []).map((w: any) => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
      </div>

      {/* Low stock alert */}
      {lowItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-semibold text-amber-800">{lowItems.length} produk stok menipis!</p>
            <p className="text-xs text-amber-600 mt-0.5">{lowItems.slice(0, 3).map((i: any) => i.product_name).join(', ')}{lowItems.length > 3 ? ` dan ${lowItems.length - 3} lainnya` : ''}</p>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Memuat...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Produk', 'SKU', 'Kategori', 'Satuan', 'Stok', 'Min. Stok', 'Nilai Stok', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">Tidak ada data stok</td></tr>
              ) : items.map((item: any) => (
                <tr key={item.product_id} className={clsx('hover:bg-gray-50 transition-colors', item.is_low && 'bg-red-50/50')}>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.product_name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{item.sku}</td>
                  <td className="px-4 py-3 text-gray-500">{item.category ?? '-'}</td>
                  <td className="px-4 py-3 text-gray-500">{item.unit}</td>
                  <td className="px-4 py-3">
                    <span className={clsx('font-bold', item.is_low ? 'text-red-600' : 'text-gray-900')}>
                      {formatNumber(item.qty_on_hand)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{item.min_stock}</td>
                  <td className="px-4 py-3 text-gray-600">{formatRupiah(item.stock_value)}</td>
                  <td className="px-4 py-3">
                    {item.is_low ? (
                      <span className="badge badge-red flex items-center gap-1 w-fit"><AlertTriangle size={10} /> Menipis</span>
                    ) : (
                      <span className="badge badge-green">Normal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Adjust Modal */}
      {showAdjust && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold">Penyesuaian Stok</h2>
              <button onClick={() => setShowAdjust(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); adjustMutation.mutate({ ...adjustForm, warehouse_id: warehouseId }) }} className="p-5 space-y-4">
              <div>
                <label className="label">Produk *</label>
                <select value={adjustForm.product_id} onChange={e => setAdjustForm({ ...adjustForm, product_id: e.target.value })} className="input" required>
                  <option value="">-- Pilih Produk --</option>
                  {(productsRes ?? []).map((p: any) => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                </select>
              </div>
              <div>
                <label className="label">Satuan *</label>
                <select value={adjustForm.unit_id} onChange={e => setAdjustForm({ ...adjustForm, unit_id: e.target.value })} className="input" required>
                  <option value="">-- Pilih Satuan --</option>
                  {(unitsRes ?? []).map((u: any) => <option key={u.id} value={u.id}>{u.name} ({u.abbreviation})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Tipe</label>
                  <select value={adjustForm.type} onChange={e => setAdjustForm({ ...adjustForm, type: e.target.value })} className="input">
                    <option value="in">Masuk (+)</option>
                    <option value="out">Keluar (-)</option>
                    <option value="adjustment">Penyesuaian</option>
                  </select>
                </div>
                <div>
                  <label className="label">Jumlah *</label>
                  <input type="number" min={0.0001} step="0.0001" value={adjustForm.qty} onChange={e => setAdjustForm({ ...adjustForm, qty: e.target.value })} className="input" required />
                </div>
              </div>
              <div>
                <label className="label">Harga Pokok</label>
                <input type="number" min={0} value={adjustForm.cost_price} onChange={e => setAdjustForm({ ...adjustForm, cost_price: e.target.value })} className="input" />
              </div>
              <div>
                <label className="label">Catatan</label>
                <textarea value={adjustForm.notes} onChange={e => setAdjustForm({ ...adjustForm, notes: e.target.value })} className="input" rows={2} />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowAdjust(false)} className="btn-secondary">Batal</button>
                <button type="submit" disabled={adjustMutation.isPending} className="btn-primary">
                  {adjustMutation.isPending ? 'Menyimpan...' : <><Check size={15} /> Simpan</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
