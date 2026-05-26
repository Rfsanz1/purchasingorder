'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/store/useAuthStore';
import AppShell from '../../../components/layout/AppShell';
import { SALES_CONFIG, SALES_NAV } from '../../../lib/nav-configs';
import { api } from '../../../lib/api';
import { ShoppingCart, Plus, Search, RefreshCw, Zap } from 'lucide-react';

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Pending',    color: '#FF9800', bg: 'rgba(255,152,0,.1)' },
  confirmed: { label: 'Dikonfirmasi', color: '#2196F3', bg: 'rgba(33,150,243,.1)' },
  delivered: { label: 'Terkirim',   color: '#4CAF50', bg: 'rgba(76,175,80,.1)' },
  cancelled: { label: 'Dibatalkan', color: '#EA5455', bg: 'rgba(234,84,85,.1)' },
};

export default function SalesOrdersPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => { if (!token) router.push('/login'); }, [token]);

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
  useEffect(() => { if (token) load(); }, [search, status, page, token]);

  if (!token) return null;

  return (
    <AppShell {...SALES_CONFIG} navItems={SALES_NAV} activeHref="/sales/orders">
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#433C50' }}>Order Penjualan</h1>
            <p className="text-sm mt-0.5" style={{ color: '#A5A3AE' }}>Kelola semua order dari pelanggan</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => router.push('/sales/smart-order')} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition" style={{ borderColor: SALES_CONFIG.appColor, color: SALES_CONFIG.appColor }}>
              <Zap className="h-4 w-4" /> Smart Input
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: SALES_CONFIG.appColor }}>
              <Plus className="h-4 w-4" /> Buat Order
            </button>
          </div>
        </div>

        {summary && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Order', value: summary.totalOrders, color: '#00ACC1', bg: 'rgba(0,172,193,.1)' },
              { label: 'Total Revenue', value: Number(summary.totalRevenue || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }), color: '#4CAF50', bg: 'rgba(76,175,80,.1)' },
              { label: 'Pending', value: summary.pendingOrders, color: '#FF9800', bg: 'rgba(255,152,0,.1)' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-5" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
                <p className="text-xs font-medium" style={{ color: '#A5A3AE' }}>{s.label}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#433C50' }}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
          <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#B0AAB9' }} />
              <input className="w-full rounded-lg pl-9 pr-4 py-2 text-sm" style={{ border: '1px solid #EDE8F5', color: '#433C50', outline: 'none' }} placeholder="Cari customer..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <select className="rounded-lg px-3 py-2 text-sm" style={{ border: '1px solid #EDE8F5', color: '#433C50', outline: 'none' }} value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Dikonfirmasi</option>
              <option value="delivered">Terkirim</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
            <button onClick={load} className="p-2 rounded-lg transition" style={{ border: '1px solid #EDE8F5', color: '#A5A3AE' }}>
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #EDE8F5' }}>
                  {['ID', 'Customer', 'Sales', 'Total', 'Status', 'Tanggal'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#A5A3AE' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-sm" style={{ color: '#A5A3AE' }}>Memuat data...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-sm" style={{ color: '#A5A3AE' }}>Belum ada order</td></tr>
                ) : orders.map((o, i) => {
                  const st = STATUS_MAP[o.status] ?? { label: o.status, color: '#A5A3AE', bg: 'rgba(165,163,174,.12)' };
                  return (
                    <tr key={o.id} style={{ borderBottom: i < orders.length - 1 ? '1px solid #F5F2FB' : 'none' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FDFCFF'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                      <td className="px-6 py-3.5 text-xs font-mono" style={{ color: '#A5A3AE' }}>#{o.id}</td>
                      <td className="px-6 py-3.5">
                        <p className="text-sm font-medium" style={{ color: '#433C50' }}>{o.namaCustomer}</p>
                        <p className="text-xs" style={{ color: '#A5A3AE' }}>{o.noHp || '–'}</p>
                      </td>
                      <td className="px-6 py-3.5 text-sm" style={{ color: '#A5A3AE' }}>{o.salesName || '–'}</td>
                      <td className="px-6 py-3.5 text-sm font-semibold" style={{ color: '#433C50' }}>{Number(o.totalHarga || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}</td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold" style={{ color: st.color, backgroundColor: st.bg }}>{st.label}</span>
                      </td>
                      <td className="px-6 py-3.5 text-xs" style={{ color: '#A5A3AE' }}>{new Date(o.createdAt).toLocaleDateString('id-ID')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-3" style={{ borderTop: '1px solid #EDE8F5' }}>
            <span className="text-xs" style={{ color: '#A5A3AE' }}>Total: {total}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded-lg text-xs disabled:opacity-40" style={{ border: '1px solid #EDE8F5', color: '#433C50' }}>← Prev</button>
              <span className="px-3 py-1 text-xs" style={{ color: '#433C50' }}>Hal {page}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={orders.length < 20} className="px-3 py-1 rounded-lg text-xs disabled:opacity-40" style={{ border: '1px solid #EDE8F5', color: '#433C50' }}>Next →</button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
