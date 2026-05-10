import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Edit2, Trash2, User, X, Check, Crown } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import api from '../api/client'
import { formatRupiah } from '../utils/format'

const TYPES = [{ v: 'retail', l: 'Eceran' }, { v: 'contractor', l: 'Kontraktor' }, { v: 'store', l: 'Toko' }, { v: 'reseller', l: 'Reseller' }]
const TIERS = [{ v: 'regular', l: 'Regular' }, { v: 'silver', l: 'Silver' }, { v: 'gold', l: 'Gold' }, { v: 'platinum', l: 'Platinum' }]
const TIER_COLORS: Record<string, string> = { regular: 'badge-gray', silver: 'badge-blue', gold: 'badge-yellow', platinum: 'badge-purple' }
const EMPTY_FORM = { name: '', phone: '', email: '', address: '', city: '', type: 'retail', membership_tier: 'regular', credit_limit: 0, payment_term_days: 0, notes: '', is_active: true }

export default function CustomersPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(EMPTY_FORM)

  const { data, isLoading } = useQuery({
    queryKey: ['pos-customers', search, type, page],
    queryFn: () => api.get('/customers', { params: { search, type: type || undefined, page } }).then(r => r.data),
  })

  const saveMutation = useMutation({
    mutationFn: (d: any) => editing ? api.put(`/customers/${editing.id}`, d) : api.post('/customers', d),
    onSuccess: () => { toast.success(editing ? 'Customer diupdate!' : 'Customer ditambahkan!'); qc.invalidateQueries({ queryKey: ['pos-customers'] }); closeModal() },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Gagal menyimpan'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/customers/${id}`),
    onSuccess: () => { toast.success('Customer dihapus'); qc.invalidateQueries({ queryKey: ['pos-customers'] }) },
  })

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true) }
  const openEdit = (c: any) => { setEditing(c); setForm(c); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditing(null) }

  const customers = data?.data ?? []
  const meta = data?.meta ?? {}

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pelanggan</h1>
          <p className="text-sm text-gray-500">Data customer & kontraktor</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Tambah Customer</button>
      </div>

      <div className="card p-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input type="text" placeholder="Cari nama, telepon, kode..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }} className="input pl-9 text-sm" />
        </div>
        <select value={type} onChange={e => { setType(e.target.value); setPage(1) }} className="input w-40 text-sm">
          <option value="">Semua Tipe</option>
          {TYPES.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Memuat...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Kode', 'Nama', 'Tipe', 'Telepon', 'Kota', 'Membership', 'Piutang', 'Limit Kredit', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400">
                  <User size={32} className="mx-auto mb-2 opacity-30" />Belum ada customer
                </td></tr>
              ) : customers.map((c: any) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{c.code}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{c.name}</div>
                    {c.email && <div className="text-xs text-gray-400">{c.email}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 capitalize">{c.type}</td>
                  <td className="px-4 py-3 text-gray-600">{c.phone ?? '-'}</td>
                  <td className="px-4 py-3 text-gray-500">{c.city ?? '-'}</td>
                  <td className="px-4 py-3">
                    <span className={clsx('badge', TIER_COLORS[c.membership_tier] ?? 'badge-gray')}>
                      {c.membership_tier === 'platinum' && <Crown size={10} className="mr-0.5" />}
                      {c.membership_tier}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-red-600 font-medium">{formatRupiah(c.total_receivable ?? 0)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatRupiah(c.credit_limit)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => { if (confirm(`Hapus ${c.name}?`)) deleteMutation.mutate(c.id) }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {meta.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Total {meta.total} customer</p>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(meta.last_page, 5) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={clsx('w-8 h-8 rounded-lg text-xs font-medium', p === page ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>{p}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b z-10">
              <h2 className="text-lg font-bold">{editing ? 'Edit Customer' : 'Tambah Customer'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); saveMutation.mutate(form) }} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="label">Nama *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" required /></div>
                <div><label className="label">Telepon</label><input value={form.phone ?? ''} onChange={e => setForm({ ...form, phone: e.target.value })} className="input" /></div>
                <div><label className="label">Email</label><input type="email" value={form.email ?? ''} onChange={e => setForm({ ...form, email: e.target.value })} className="input" /></div>
                <div><label className="label">Tipe</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input">
                    {TYPES.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
                  </select>
                </div>
                <div><label className="label">Membership</label>
                  <select value={form.membership_tier} onChange={e => setForm({ ...form, membership_tier: e.target.value })} className="input">
                    {TIERS.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
                  </select>
                </div>
                <div><label className="label">Limit Kredit (Rp)</label><input type="number" min={0} value={form.credit_limit} onChange={e => setForm({ ...form, credit_limit: e.target.value })} className="input" /></div>
                <div><label className="label">Jatuh Tempo (hari)</label><input type="number" min={0} value={form.payment_term_days} onChange={e => setForm({ ...form, payment_term_days: e.target.value })} className="input" /></div>
                <div><label className="label">Kota</label><input value={form.city ?? ''} onChange={e => setForm({ ...form, city: e.target.value })} className="input" /></div>
                <div><label className="label">Diskon Khusus %</label><input type="number" min={0} max={100} value={form.custom_discount_pct ?? 0} onChange={e => setForm({ ...form, custom_discount_pct: e.target.value })} className="input" /></div>
                <div className="col-span-2"><label className="label">Alamat</label><textarea value={form.address ?? ''} onChange={e => setForm({ ...form, address: e.target.value })} className="input" rows={2} /></div>
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
