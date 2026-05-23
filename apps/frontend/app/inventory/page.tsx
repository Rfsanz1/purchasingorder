'use client';

import { useEffect, useState } from 'react';
import { ModernLayout } from '../../components/layout/ModernLayout';
import { api } from '../../lib/api';
import { Package, Plus, Search, RefreshCw, AlertTriangle } from 'lucide-react';

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const [pRes, sRes] = await Promise.all([
        api.get('/inventory/products', { params: { search, page, limit: 20 } }),
        api.get('/inventory/stats'),
      ]);
      setProducts(pRes.data.data);
      setTotal(pRes.data.total);
      setStats(sRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search, page]);

  return (
    <ModernLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Package className="h-6 w-6 text-cyan-400" /> Inventory — Produk</h1>
            <p className="text-slate-400 mt-1">Kelola produk, stok, dan kategori</p>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-sm font-medium text-white transition">
            <Plus className="h-4 w-4" /> Tambah Produk
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
              <p className="text-xs text-slate-500">Total Produk</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalProducts}</p>
            </div>
            <div className="rounded-2xl bg-slate-900 border border-amber-800/40 p-4">
              <p className="text-xs text-amber-500 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Stok Kritis</p>
              <p className="text-3xl font-bold text-amber-400 mt-1">{stats.lowStock}</p>
            </div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
              <p className="text-xs text-slate-500">Total Stok</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalStok?.toLocaleString('id-ID')}</p>
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-3 p-4 border-b border-slate-800">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                className="w-full rounded-xl bg-slate-800 border border-slate-700 pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                placeholder="Cari produk..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <button onClick={load} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition text-slate-400">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-4 py-3">Produk</th>
                  <th className="text-left px-4 py-3">SKU</th>
                  <th className="text-left px-4 py-3">Kategori</th>
                  <th className="text-right px-4 py-3">Stok</th>
                  <th className="text-right px-4 py-3">Harga Jual</th>
                  <th className="text-center px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr><td colSpan={6} className="py-12 text-center text-slate-500">Memuat...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-slate-500">Belum ada produk</td></tr>
                ) : products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/50 transition">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.brand || '-'}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{p.sku}</td>
                    <td className="px-4 py-3 text-slate-400">{p.category?.name || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-medium ${p.stok <= p.stokMinimum ? 'text-red-400' : 'text-white'}`}>
                        {p.stok.toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-300">
                      {Number(p.hargaJual).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${p.active ? 'bg-emerald-900/50 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                        {p.active ? 'Aktif' : 'Arsip'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 text-sm text-slate-500">
            <span>Total: {total} produk</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition">←</button>
              <span className="px-3 py-1 text-white">Hal {page}</span>
              <button onClick={() => setPage(p => p+1)} disabled={products.length < 20} className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition">→</button>
            </div>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
}
