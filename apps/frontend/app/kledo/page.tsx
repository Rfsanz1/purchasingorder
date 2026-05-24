'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import AppShell from '../../components/layout/AppShell';
import { SETTINGS_CONFIG, SETTINGS_NAV } from '../../lib/nav-configs';
import { api } from '../../lib/api';
import { Zap, RefreshCw, CheckCircle, XCircle, Package, Users, FileText } from 'lucide-react';

export default function KledoPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [status, setStatus] = useState<any>(null);
  const [brands, setBrands] = useState<any[]>([]);
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => { if (!token) router.push('/login'); }, [token]);

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

  useEffect(() => { if (token) load(); }, [token]);
  if (!token) return null;

  return (
    <AppShell {...SETTINGS_CONFIG} navItems={SETTINGS_NAV} activeHref="/kledo">
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#433C50' }}>Integrasi Kledo ERP</h1>
            <p className="text-sm mt-0.5" style={{ color: '#A5A3AE' }}>Sinkronisasi produk, pelanggan, dan invoice dengan Kledo</p>
          </div>
          <button onClick={syncNow} disabled={syncing || !status?.connected} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition" style={{ backgroundColor: '#F59E0B' }}>
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} /> {syncing ? 'Syncing...' : 'Sync Sekarang'}
          </button>
        </div>

        <div className="rounded-2xl p-5 flex items-center gap-4" style={{ backgroundColor: status?.connected ? 'rgba(76,175,80,.08)' : 'rgba(234,84,85,.08)', border: `1.5px solid ${status?.connected ? 'rgba(76,175,80,.3)' : 'rgba(234,84,85,.3)'}` }}>
          {status?.connected
            ? <CheckCircle className="h-8 w-8 flex-shrink-0" style={{ color: '#4CAF50' }} />
            : <XCircle className="h-8 w-8 flex-shrink-0" style={{ color: '#EA5455' }} />}
          <div>
            <p className="font-semibold" style={{ color: status?.connected ? '#388E3C' : '#C62828' }}>{status?.connected ? 'Kledo Terhubung' : 'Kledo Tidak Terhubung'}</p>
            <p className="text-sm mt-0.5" style={{ color: '#A5A3AE' }}>{status?.message || 'Mengecek koneksi...'}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { href: '/kledo/products',  icon: Package,  label: 'Produk Kledo',   desc: 'Lihat & sinkronisasi produk dari Kledo' },
            { href: '/kledo/contacts',  icon: Users,    label: 'Kontak Kledo',   desc: 'Sinkronisasi customer & supplier' },
            { href: '/kledo/invoices',  icon: FileText, label: 'Invoice Kledo',  desc: 'Lihat invoice & faktur di Kledo' },
          ].map((item) => (
            <a key={item.href} href={item.href} className="bg-white rounded-2xl p-5 transition" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F59E0B'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#EDE8F5'; }}>
              <item.icon className="h-6 w-6 mb-3" style={{ color: '#F59E0B' }} />
              <p className="font-semibold text-sm" style={{ color: '#433C50' }}>{item.label}</p>
              <p className="text-xs mt-1" style={{ color: '#A5A3AE' }}>{item.desc}</p>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-5" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
            <h3 className="text-sm font-bold mb-4" style={{ color: '#433C50' }}>SPM Brand & PIC</h3>
            <div className="space-y-2">
              {brands.map((b: any) => (
                <div key={b.brand} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #F5F2FB' }}>
                  <span className="text-sm font-medium" style={{ color: '#433C50' }}>{b.brand}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F5F2FB', color: '#A5A3AE' }}>{b.pic}</span>
                </div>
              ))}
              {brands.length === 0 && <p className="text-sm" style={{ color: '#A5A3AE' }}>Belum ada data</p>}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
            <h3 className="text-sm font-bold mb-4" style={{ color: '#433C50' }}>Riwayat Sync</h3>
            <div className="space-y-2">
              {syncLogs.map((log: any) => (
                <div key={log.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #F5F2FB' }}>
                  <div>
                    <p className="text-xs font-medium" style={{ color: '#433C50' }}>{log.type}</p>
                    <p className="text-xs" style={{ color: '#A5A3AE' }}>{new Date(log.createdAt).toLocaleString('id-ID')}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: log.status === 'success' ? 'rgba(76,175,80,.1)' : log.status === 'error' ? 'rgba(234,84,85,.1)' : 'rgba(165,163,174,.12)', color: log.status === 'success' ? '#4CAF50' : log.status === 'error' ? '#EA5455' : '#A5A3AE' }}>{log.status}</span>
                </div>
              ))}
              {syncLogs.length === 0 && <p className="text-sm" style={{ color: '#A5A3AE' }}>Belum ada riwayat sync</p>}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
