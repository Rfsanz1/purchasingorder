'use client';
import { useEffect, useState } from 'react';
import { ModernLayout } from '../../components/layout/ModernLayout';
import { api } from '../../lib/api';
import { Monitor, ShoppingCart, Package, TrendingUp } from 'lucide-react';

export default function PosPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/pos/dashboard').then(r => setDashboard(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <ModernLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-white flex items-center gap-2"><Monitor className="h-6 w-6 text-red-400" /> Point of Sale (POS)</h1><p className="text-slate-400 mt-1">Kasir & transaksi langsung</p></div>
          <a href="/pos/cashier" className="flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2 text-sm font-medium text-white transition"><ShoppingCart className="h-4 w-4" /> Buka Kasir</a>
        </div>
        {loading ? <p className="text-slate-500">Memuat...</p> : (
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5"><TrendingUp className="h-6 w-6 text-emerald-400 mb-3" /><p className="text-xs text-slate-500">Total Penjualan Hari Ini</p><p className="text-2xl font-bold text-white mt-1">{Number(dashboard?.todaySales||0).toLocaleString('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0})}</p></div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5"><ShoppingCart className="h-6 w-6 text-blue-400 mb-3" /><p className="text-xs text-slate-500">Transaksi Hari Ini</p><p className="text-2xl font-bold text-white mt-1">{dashboard?.todayTransactions||0}</p></div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5"><Package className="h-6 w-6 text-yellow-400 mb-3" /><p className="text-xs text-slate-500">Total Produk POS</p><p className="text-2xl font-bold text-white mt-1">{dashboard?.totalProducts||0}</p></div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <a href="/pos/cashier" className="rounded-2xl bg-gradient-to-br from-red-600 to-red-800 p-6 hover:scale-[1.02] transition-transform"><ShoppingCart className="h-8 w-8 text-white/80 mb-3" /><p className="text-lg font-bold text-white">Kasir / Transaksi</p><p className="text-sm text-white/60 mt-1">Buat transaksi penjualan baru</p></a>
          <a href="/pos/sessions" className="rounded-2xl bg-gradient-to-br from-orange-600 to-orange-800 p-6 hover:scale-[1.02] transition-transform"><Monitor className="h-8 w-8 text-white/80 mb-3" /><p className="text-lg font-bold text-white">Sesi Kasir</p><p className="text-sm text-white/60 mt-1">Kelola sesi & laporan per shift</p></a>
        </div>
      </div>
    </ModernLayout>
  );
}
