'use client';
import { useEffect, useState } from 'react';
import { ModernLayout } from '../../components/layout/ModernLayout';
import { api } from '../../lib/api';
import { Users, Plus, Search, RefreshCw } from 'lucide-react';

export default function CustomersPage() {
  const [data, setData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const [r, s] = await Promise.all([
        api.get('/customers', { params: { search, page, limit: 20 } }),
        api.get('/customers/summary'),
      ]);
      setData(r.data.data ?? []);
      setTotal(r.data.total ?? 0);
      setSummary(s.data);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [search, page]);

  return (
    <ModernLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-white flex items-center gap-2"><Users className="h-6 w-6 text-purple-400" /> Pelanggan</h1><p className="text-slate-400 mt-1">Manajemen data pelanggan</p></div>
          <button className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 text-sm font-medium text-white transition"><Plus className="h-4 w-4" /> Tambah Pelanggan</button>
        </div>
        {summary && (
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4"><p className="text-xs text-slate-500">Total</p><p className="text-3xl font-bold text-white mt-1">{summary.total}</p></div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4"><p className="text-xs text-slate-500">Aktif</p><p className="text-3xl font-bold text-emerald-400 mt-1">{summary.active}</p></div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4"><p className="text-xs text-slate-500">Nonaktif</p><p className="text-3xl font-bold text-slate-400 mt-1">{summary.inactive}</p></div>
          </div>
        )}
        <div className="rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-3 p-4 border-b border-slate-800">
            <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" /><input className="w-full rounded-xl bg-slate-800 border border-slate-700 pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none" placeholder="Cari pelanggan..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
            <button onClick={load} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition text-slate-400"><RefreshCw className="h-4 w-4" /></button>
          </div>
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead><tr className="border-b border-slate-800 text-slate-500 text-xs uppercase">
              <th className="text-left px-4 py-3">Nama</th><th className="text-left px-4 py-3">Email</th><th className="text-left px-4 py-3">Telepon</th><th className="text-left px-4 py-3">Kota</th><th className="text-center px-4 py-3">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? <tr><td colSpan={5} className="py-12 text-center text-slate-500">Memuat...</td></tr>
              : data.length === 0 ? <tr><td colSpan={5} className="py-12 text-center text-slate-500">Belum ada pelanggan</td></tr>
              : data.map(c => (
                <tr key={c.id} className="hover:bg-slate-800/50 transition">
                  <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                  <td className="px-4 py-3 text-slate-400">{c.email||'-'}</td>
                  <td className="px-4 py-3 text-slate-400">{c.phone||'-'}</td>
                  <td className="px-4 py-3 text-slate-400">{c.city||'-'}</td>
                  <td className="px-4 py-3 text-center"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${c.active ? 'bg-emerald-900/50 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>{c.active ? 'Aktif' : 'Nonaktif'}</span></td>
                </tr>
              ))}
            </tbody>
          </table></div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 text-sm text-slate-500">
            <span>Total: {total}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition">←</button>
              <span className="px-3 py-1 text-white">Hal {page}</span>
              <button onClick={() => setPage(p => p+1)} disabled={data.length<20} className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition">→</button>
            </div>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
}
