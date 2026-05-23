'use client';
import { useEffect, useState } from 'react';
import { ModernLayout } from '../../components/layout/ModernLayout';
import { api } from '../../lib/api';
import { Zap, RefreshCw, CheckCircle, XCircle, Package, Users, FileText } from 'lucide-react';

export default function KledoPage() {
  const [status, setStatus] = useState<any>(null);
  const [brands, setBrands] = useState<any[]>([]);
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [st, br, logs] = await Promise.all([
        api.get('/kledo/status'),
        api.get('/kledo/spm-brands'),
        api.get('/kledo/sync-logs', { params: { limit: 10 } }),
      ]);
      setStatus(st.data);
      setBrands(br.data ?? []);
      setSyncLogs(logs.data.data ?? []);
    } catch {} finally { setLoading(false); }
  };

  const syncNow = async () => {
    setSyncing(true);
    try {
      const r = await api.post('/kledo/sync');
      alert(`Sync berhasil: ${r.data.synced ?? 0} produk disinkronkan`);
      load();
    } catch (e: any) {
      alert('Sync gagal: ' + (e.response?.data?.message || e.message));
    } finally { setSyncing(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <ModernLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-white flex items-center gap-2"><Zap className="h-6 w-6 text-yellow-400" /> Integrasi Kledo ERP</h1><p className="text-slate-400 mt-1">Sinkronisasi produk, pelanggan, dan invoice dengan Kledo</p></div>
          <button onClick={syncNow} disabled={syncing || !status?.connected} className="flex items-center gap-2 rounded-xl bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 px-4 py-2 text-sm font-medium text-white transition">
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} /> {syncing ? 'Syncing...' : 'Sync Sekarang'}
          </button>
        </div>

        <div className={`rounded-2xl border p-5 flex items-center gap-4 ${status?.connected ? 'bg-emerald-900/20 border-emerald-800/40' : 'bg-red-900/20 border-red-800/40'}`}>
          {status?.connected ? <CheckCircle className="h-8 w-8 text-emerald-400 flex-shrink-0" /> : <XCircle className="h-8 w-8 text-red-400 flex-shrink-0" />}
          <div>
            <p className={`font-semibold text-lg ${status?.connected ? 'text-emerald-300' : 'text-red-300'}`}>{status?.connected ? 'Kledo Terhubung' : 'Kledo Tidak Terhubung'}</p>
            <p className="text-sm text-slate-400 mt-0.5">{status?.message || 'Mengecek koneksi...'}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <a href="/kledo/products" className="rounded-2xl bg-slate-900 border border-slate-800 p-5 hover:border-yellow-700 transition">
            <Package className="h-6 w-6 text-yellow-400 mb-3" /><p className="font-semibold text-white">Produk Kledo</p><p className="text-xs text-slate-500 mt-1">Lihat & sinkronisasi produk dari Kledo</p>
          </a>
          <a href="/kledo/contacts" className="rounded-2xl bg-slate-900 border border-slate-800 p-5 hover:border-yellow-700 transition">
            <Users className="h-6 w-6 text-yellow-400 mb-3" /><p className="font-semibold text-white">Kontak Kledo</p><p className="text-xs text-slate-500 mt-1">Sinkronisasi customer & supplier</p>
          </a>
          <a href="/kledo/invoices" className="rounded-2xl bg-slate-900 border border-slate-800 p-5 hover:border-yellow-700 transition">
            <FileText className="h-6 w-6 text-yellow-400 mb-3" /><p className="font-semibold text-white">Invoice Kledo</p><p className="text-xs text-slate-500 mt-1">Lihat invoice & faktur di Kledo</p>
          </a>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
            <h3 className="font-semibold text-white mb-4">SPM Brand & PIC</h3>
            <div className="space-y-2">
              {brands.map((b: any) => (
                <div key={b.brand} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                  <span className="text-sm font-medium text-white">{b.brand}</span>
                  <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">{b.pic}</span>
                </div>
              ))}
              {brands.length === 0 && <p className="text-sm text-slate-500">Belum ada data</p>}
            </div>
          </div>
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
            <h3 className="font-semibold text-white mb-4">Riwayat Sync</h3>
            <div className="space-y-2">
              {syncLogs.map((log: any) => (
                <div key={log.id} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                  <div>
                    <p className="text-xs text-white">{log.type}</p>
                    <p className="text-xs text-slate-500">{new Date(log.createdAt).toLocaleString('id-ID')}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${log.status==='success'?'bg-emerald-900/50 text-emerald-400':log.status==='error'?'bg-red-900/50 text-red-400':'bg-slate-800 text-slate-400'}`}>{log.status}</span>
                </div>
              ))}
              {syncLogs.length === 0 && <p className="text-sm text-slate-500">Belum ada riwayat sync</p>}
            </div>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
}
