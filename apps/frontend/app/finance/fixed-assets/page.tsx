'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/store/useAuthStore';
import AppShell from '../../../components/layout/AppShell';
import { ACCOUNTING_CONFIG, ACCOUNTING_NAV } from '../../../lib/nav-configs';
import { Building2, Plus, Search, RefreshCw, X, TrendingDown } from 'lucide-react';

const C = ACCOUNTING_CONFIG.appColor;

const DEPRECIATION_METHODS = ['Garis Lurus (Straight Line)', 'Saldo Menurun (Declining Balance)', 'Jumlah Angka Tahun'];
const ASSET_CATEGORIES = ['Tanah & Bangunan', 'Mesin & Peralatan', 'Kendaraan', 'Inventaris Kantor', 'Peralatan IT', 'Aset Tidak Berwujud'];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  active:    { label: 'Aktif',      color: '#4CAF50', bg: 'rgba(76,175,80,.1)' },
  disposed:  { label: 'Dilepas',    color: '#9E9E9E', bg: 'rgba(158,158,158,.1)' },
  in_repair: { label: 'Perbaikan',  color: '#FF9800', bg: 'rgba(255,152,0,.1)' },
};

const SAMPLE_ASSETS = [
  { id: 1, code: 'FA-0001', name: 'Mesin Produksi A', category: 'Mesin & Peralatan', acquisition_value: 150000000, useful_life: 5, method: 'Garis Lurus', accumulated_depreciation: 30000000, book_value: 120000000, status: 'active', acquisition_date: '2024-01-15' },
  { id: 2, code: 'FA-0002', name: 'Kendaraan Operasional', category: 'Kendaraan', acquisition_value: 350000000, useful_life: 8, method: 'Saldo Menurun', accumulated_depreciation: 43750000, book_value: 306250000, status: 'active', acquisition_date: '2024-03-01' },
  { id: 3, code: 'FA-0003', name: 'Komputer & Server', category: 'Peralatan IT', acquisition_value: 75000000, useful_life: 4, method: 'Garis Lurus', accumulated_depreciation: 18750000, book_value: 56250000, status: 'active', acquisition_date: '2023-07-10' },
];

export default function FixedAssetsPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [assets, setAssets] = useState(SAMPLE_ASSETS);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', category: '', acquisition_value: '', useful_life: '', method: 'Garis Lurus (Straight Line)',
    acquisition_date: '', account_asset: '', account_depreciation: '', notes: '',
  });

  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;

  const filtered = assets.filter(a =>
    (a.name.toLowerCase().includes(search.toLowerCase())) &&
    (category === '' || a.category === category)
  );

  const totalValue = filtered.reduce((s, a) => s + a.acquisition_value, 0);
  const totalDepreciation = filtered.reduce((s, a) => s + a.accumulated_depreciation, 0);
  const totalBookValue = filtered.reduce((s, a) => s + a.book_value, 0);

  return (
    <AppShell {...ACCOUNTING_CONFIG} navItems={ACCOUNTING_NAV} activeHref="/finance/fixed-assets">
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#1E1B4B' }}>Aset Tetap</h1>
            <p className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>Kelola aset tetap, depresiasi, dan nilai buku</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: C }}>
            <Plus className="h-4 w-4" /> Tambah Aset
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Nilai Perolehan', value: totalValue.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }), color: C },
            { label: 'Total Akumulasi Depresiasi', value: totalDepreciation.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }), color: '#FF9800' },
            { label: 'Total Nilai Buku', value: totalBookValue.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }), color: '#4CAF50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
              <p className="text-xs font-medium" style={{ color: '#9CA3AF' }}>{s.label}</p>
              <p className="text-lg font-bold mt-1 truncate" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
          <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#B0AAB9' }} />
              <input className="w-full rounded-lg pl-9 pr-4 py-2 text-sm" style={{ border: '1px solid #EDE8F5', color: '#1E1B4B', outline: 'none' }} placeholder="Cari aset..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="rounded-lg px-3 py-2 text-sm" style={{ border: '1px solid #EDE8F5', color: '#1E1B4B', outline: 'none' }} value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">Semua Kategori</option>
              {ASSET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #EDE8F5' }}>
                  {['Kode', 'Nama Aset', 'Kategori', 'Tgl Perolehan', 'Nilai Perolehan', 'Metode Depresiasi', 'Umur (Th)', 'Akum. Depresiasi', 'Nilai Buku', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap" style={{ color: '#9CA3AF' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => {
                  const s = STATUS_MAP[a.status] ?? STATUS_MAP.active;
                  const depPct = Math.round(a.accumulated_depreciation / a.acquisition_value * 100);
                  return (
                    <tr key={a.id} style={{ borderBottom: '1px solid #F5F3FF' }} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-xs" style={{ color: C }}>{a.code}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: '#1E1B4B' }}>{a.name}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#6B7280' }}>{a.category}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#6B7280' }}>{new Date(a.acquisition_date).toLocaleDateString('id-ID')}</td>
                      <td className="px-4 py-3 font-semibold text-xs" style={{ color: '#1E1B4B' }}>{a.acquisition_value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#6B7280' }}>{a.method}</td>
                      <td className="px-4 py-3 text-xs text-center" style={{ color: '#6B7280' }}>{a.useful_life}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-xs font-semibold" style={{ color: '#FF9800' }}>{a.accumulated_depreciation.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}</p>
                          <div className="h-1.5 w-20 rounded-full mt-1 overflow-hidden" style={{ backgroundColor: '#EDE8F5' }}>
                            <div className="h-full rounded-full" style={{ width: `${depPct}%`, backgroundColor: '#FF9800' }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-xs" style={{ color: '#4CAF50' }}>{a.book_value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ color: s.color, backgroundColor: s.bg }}>{s.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-y-auto" style={{ maxHeight: '90vh', boxShadow: '0 20px 60px rgba(0,0,0,.15)' }}>
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
                <h2 className="font-bold" style={{ color: '#1E1B4B' }}>Tambah Aset Tetap</h2>
                <button onClick={() => setShowForm(false)} style={{ color: '#9CA3AF' }}><X className="h-5 w-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { key: 'name', label: 'Nama Aset *', placeholder: 'Nama aset tetap...' },
                  { key: 'acquisition_value', label: 'Nilai Perolehan (Rp)', placeholder: '0', type: 'number' },
                  { key: 'acquisition_date', label: 'Tanggal Perolehan', placeholder: '', type: 'date' },
                  { key: 'useful_life', label: 'Umur Ekonomis (Tahun)', placeholder: '5', type: 'number' },
                  { key: 'account_asset', label: 'Akun Aset', placeholder: '1.2.1.001' },
                  { key: 'account_depreciation', label: 'Akun Depresiasi', placeholder: '5.1.1.001' },
                  { key: 'notes', label: 'Keterangan', placeholder: 'Keterangan tambahan...' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1E1B4B' }}>{f.label}</label>
                    <input type={f.type ?? 'text'} className="w-full rounded-lg px-4 py-2.5 text-sm" style={{ border: '1.5px solid #EDE8F5', color: '#1E1B4B', outline: 'none' }} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(f2 => ({ ...f2, [f.key]: e.target.value }))} onFocus={e => e.target.style.borderColor = C} onBlur={e => e.target.style.borderColor = '#EDE8F5'} />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1E1B4B' }}>Kategori</label>
                    <select className="w-full rounded-lg px-4 py-2.5 text-sm" style={{ border: '1.5px solid #EDE8F5', color: '#1E1B4B', outline: 'none' }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                      <option value="">Pilih kategori...</option>
                      {ASSET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1E1B4B' }}>Metode Depresiasi</label>
                    <select className="w-full rounded-lg px-4 py-2.5 text-sm" style={{ border: '1.5px solid #EDE8F5', color: '#1E1B4B', outline: 'none' }} value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value }))}>
                      {DEPRECIATION_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2" style={{ borderTop: '1px solid #EDE8F5' }}>
                  <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-lg text-sm font-semibold" style={{ border: '1.5px solid #EDE8F5', color: '#6B7280' }}>Batal</button>
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: C }}>
                    <Plus className="h-4 w-4" /> Simpan Aset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
