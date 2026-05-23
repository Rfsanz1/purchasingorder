'use client';
import { useEffect, useState } from 'react';
import { ModernLayout } from '../../../components/layout/ModernLayout';
import { api } from '../../../lib/api';
import { ShoppingCart, Plus, Search, RefreshCw } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-900/50 text-yellow-400', confirmed: 'bg-blue-900/50 text-blue-400',
  delivered: 'bg-emerald-900/50 text-emerald-400', cancelled: 'bg-red-900/50 text-red-400',
};

export default function SalesOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const [oRes, sRes] = await Promise.all([
        api.get('/sales/orders', { params: { search, status, page, limit: 20 } }),
        api.get('/sales/summary'),
      ]);
      setOrders(oRes.data.data ?? []);
      setTotal(oRes.data.total ?? 0);
      setSummary(sRes.data);
    } catch { } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [search, status, page]);

  return (
    <ModernLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-white flex items-center gap-2"><ShoppingCart className="h-6 w-6 text-emerald-400" /> Sales Orders</h1><p className="text-slate-400 mt-1">Kelola order penjualan</p></div>
          <button className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition"><Plus className="h-4 w-4" /> Buat Order</button>
        </div>
        {summary && (
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4"><p className="text-xs text-slate-500">Total Order</p><p className="text-3xl font-bold text-white mt-1">{summary.totalOrders}</p></div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4"><p className="text-xs text-slate-500">Total Revenue</p><p className="text-2xl font-bold text-emerald-400 mt-1">{Number(summary.totalRevenue||0).toLocaleString('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 })}</p></div>
            <div className="rounded-2xl bg-yellow-900/20 border border-yellow-800/40 p-4"><p className="text-xs text-yellow-500">Pending</p><p className="text-3xl font-bold text-yellow-400 mt-1">{summary.pendingOrders}</p></div>
          </div>
        )}
        <div className="rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-3 p-4 border-b border-slate-800">
            <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" /><input className="w-full rounded-xl bg-slate-800 border border-slate-700 pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" placeholder="Cari customer..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
            <select className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-300 focus:outline-none" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
              <option value="">Semua Status</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
            </select>
            <button onClick={load} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition text-slate-400"><RefreshCw className="h-4 w-4" /></button>
          </div>
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead><tr className="border-b border-slate-800 text-slate-500 text-xs uppercase">
              <th className="text-left px-4 py-3">ID</th><th className="text-left px-4 py-3">Customer</th><th className="text-left px-4 py-3">Sales</th><th className="text-right px-4 py-3">Total</th><th className="text-center px-4 py-3">Status</th><th className="text-left px-4 py-3">Tanggal</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? <tr><td colSpan={6} className="py-12 text-center text-slate-500">Memuat...</td></tr>
              : orders.length === 0 ? <tr><td colSpan={6} className="py-12 text-center text-slate-500">Belum ada order</td></tr>
              : orders.map(o => (
                <tr key={o.id} className="hover:bg-slate-800/50 transition">
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">#{o.id}</td>
                  <td className="px-4 py-3"><p className="font-medium text-white">{o.namaCustomer}</p><p className="text-xs text-slate-500">{o.noHp||'-'}</p></td>
                  <td className="px-4 py-3 text-slate-400">{o.salesName||'-'}</td>
                  <td className="px-4 py-3 text-right text-white font-medium">{Number(o.totalHarga||0).toLocaleString('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 })}</td>
                  <td className="px-4 py-3 text-center"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[o.status]||'bg-slate-800 text-slate-400'}`}>{o.status}</span></td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{new Date(o.createdAt).toLocaleDateString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 text-sm text-slate-500">
            <span>Total: {total}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition">←</button>
              <span className="px-3 py-1 text-white">Hal {page}</span>
              <button onClick={() => setPage(p => p+1)} disabled={orders.length<20} className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition">→</button>
            </div>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
}
