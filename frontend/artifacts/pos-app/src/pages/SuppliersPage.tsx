import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Edit2, Trash2, Truck, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import api from '../api/client'
import { formatRupiah } from '../utils/format'

const EMPTY_FORM = { name: '', company: '', phone: '', email: '', address: '', city: '', province: '', credit_limit: 0, payment_term_days: 30, notes: '', is_active: true }

export default function SuppliersPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(EMPTY_FORM)

  const { data, isLoading } = useQuery({
    queryKey: ['pos-suppliers', search, page],
    queryFn: () => api.get('/suppliers', { params: { search, page } }).then(r => r.data),
  })

  const saveMutation = useMutation({
    mutationFn: (d: any) => editing ? api.put(`/suppliers/${editing.id}`, d) : api.post('/suppliers', d),
    onSuccess: () => { toast.success(editing ? 'Supplier diupdate!' : 'Supplier ditambahkan!'); qc.invalidateQueries({ queryKey: ['pos-suppliers'] }); setShowModal(false); setEditing(null) },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Gagal menyimpan'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/suppliers/${id}`),
    onSuccess: () => { toast.success('Supplier dihapus'); qc.invalidateQueries({ queryKey: ['pos-suppliers'] }) },
  })

  const suppliers = data?.data ?? []
  const meta = data?.meta ?? {}

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Supplier</h1>
          <p className="text-sm text-gray-500">Data pemasok barang</p>
        </div>
        <button onClick={() => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true) }} className="btn-primary">
          <Plus size={16} /> Tambah Supplier
        </button>
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input type="text" placeholder="Cari supplier..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} className="input pl-9 text-sm w-80" />
        </div>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Memuat...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Kode', 'Nama', 'Perusahaan', 'Telepon', 'Kota', 'Jatuh Tempo', 'Hutang', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {suppliers.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">
                  <Truck size={32} className="mx-auto mb-2 opacity-30" />Belum ada supplier
                </td></tr>
              ) : suppliers.map((s: any) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.code}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-gray-500">{s.company ?? '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{s.phone ?? '-'}</td>
                  <td className="px-4 py-3 text-gray-500">{s.city ?? '-'}</td>
                  <td className="px-4 py-3 text-gray-500">{s.payment_term_days} hari</td>
                  <td className="px-4 py-3 text-red-600 font-medium">{formatRupiah(s.total_payable ?? 0)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setEditing(s); setForm(s); setShowModal(true) }} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => { if (confirm(`Hapus ${s.name}?`)) deleteMutation.mutate(s.id) }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b z-10">
              <h2 className="text-lg font-bold">{editing ? 'Edit Supplier' : 'Tambah Supplier'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); saveMutation.mutate(form) }} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="label">Nama *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" required /></div>
                <div className="col-span-2"><label className="label">Perusahaan</label><input value={form.company ?? ''} onChange={e => setForm({ ...form, company: e.target.value })} className="input" /></div>
                <div><label className="label">Telepon</label><input value={form.phone ?? ''} onChange={e => setForm({ ...form, phone: e.target.value })} className="input" /></div>
                <div><label className="label">Email</label><input type="email" value={form.email ?? ''} onChange={e => setForm({ ...form, email: e.target.value })} className="input" /></div>
                <div><label className="label">Kota</label><input value={form.city ?? ''} onChange={e => setForm({ ...form, city: e.target.value })} className="input" /></div>
                <div><label className="label">Jatuh Tempo (hari)</label><input type="number" min={0} value={form.payment_term_days} onChange={e => setForm({ ...form, payment_term_days: e.target.value })} className="input" /></div>
                <div className="col-span-2"><label className="label">Alamat</label><textarea value={form.address ?? ''} onChange={e => setForm({ ...form, address: e.target.value })} className="input" rows={2} /></div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Batal</button>
                <button type="submit" disabled={saveMutation.isPending} className="btn-primary">{saveMutation.isPending ? 'Menyimpan...' : <><Check size={15} /> Simpan</>}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
