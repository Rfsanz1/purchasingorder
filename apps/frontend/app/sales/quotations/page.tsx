'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/store/useAuthStore';
import AppShell from '../../../components/layout/AppShell';
import { SALES_CONFIG, SALES_NAV } from '../../../lib/nav-configs';
import { api } from '../../../lib/api';
import { FileText, Plus, Search, RefreshCw, X, Send, Check, Trash2, FileCheck, MessageSquare } from 'lucide-react';

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  draft:     { label: 'Draft',        color: '#9E9E9E', bg: 'rgba(158,158,158,.1)' },
  sent:      { label: 'Terkirim',     color: '#2196F3', bg: 'rgba(33,150,243,.1)' },
  confirmed: { label: 'Dikonfirmasi', color: '#4CAF50', bg: 'rgba(76,175,80,.1)' },
  converted: { label: 'Dikonversi',   color: '#7367F0', bg: 'rgba(115,103,240,.1)' },
  expired:   { label: 'Kadaluarsa',   color: '#FF9800', bg: 'rgba(255,152,0,.1)' },
  cancelled: { label: 'Dibatalkan',   color: '#EA5455', bg: 'rgba(234,84,85,.1)' },
};

const C = SALES_CONFIG.appColor;
const fmt = (v: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(v ?? 0));
const fmtDate = (d: any) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '–';

export default function QuotationsPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [msg, setMsg] = useState('');
  const [actionId, setActionId] = useState('');

  useEffect(() => { if (!token) router.push('/login'); }, [token]);

  const load = async () => {
    setLoading(true);
    try {
      const params: any = { search, page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      const r = await api.get('/sales/quotations', { params });
      setItems(r.data.data ?? []);
      setTotal(r.data.meta?.total ?? 0);
    } catch { setItems([]); } finally { setLoading(false); }
  };

  useEffect(() => { if (token) load(); }, [search, statusFilter, page, token]);

  const doAction = async (id: string, action: string, label: string) => {
    setActionId(id + action);
    try {
      if (action === 'confirm')   { await api.post(`/sales/quotations/${id}/confirm`); setMsg('Quotation dikonfirmasi'); }
      if (action === 'invoice')   { const r = await api.post(`/sales/quotations/${id}/convert-invoice`); setMsg('Berhasil dikonversi ke invoice'); router.push(`/sales/invoices/${r.data.data?.id}`); return; }
      if (action === 'wa')        { await api.post(`/sales/quotations/${id}/send-whatsapp`); setMsg('WhatsApp terkirim'); }
      if (action === 'delete')    { await api.delete(`/sales/quotations/${id}`); setMsg('Quotation dihapus'); }
      load();
    } catch (e: any) { setMsg(e?.response?.data?.message ?? 'Terjadi kesalahan'); }
    finally { setActionId(''); }
  };

  if (!token) return null;

  const STATUS_FILTERS = [
    { v: '', l: 'Semua' }, { v: 'draft', l: 'Draft' }, { v: 'sent', l: 'Terkirim' },
    { v: 'confirmed', l: 'Konfirmasi' }, { v: 'converted', l: 'Dikonversi' },
  ];

  return (
    <AppShell {...SALES_CONFIG} navItems={SALES_NAV} activeHref="/sales/quotations">
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#1E1B4B' }}>Quotation</h1>
            <p className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>Buat dan kelola penawaran harga ke pelanggan</p>
          </div>
          <button onClick={() => router.push('/sales/quotations/new')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: C }}>
            <Plus className="h-4 w-4" /> Buat Quotation
          </button>
        </div>

        {msg && (
          <div className="rounded-xl px-4 py-3 text-sm flex items-center justify-between" style={{ backgroundColor: 'rgba(76,175,80,.1)', border: '1px solid rgba(76,175,80,.3)', color: '#388E3C' }}>
            <span>{msg}</span>
            <button onClick={() => setMsg('')} className="text-lg leading-none">×</button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: total, color: C },
            { label: 'Draft', value: items.filter(i => i.status === 'draft').length, color: '#9E9E9E' },
            { label: 'Terkirim', value: items.filter(i => i.status === 'sent').length, color: '#2196F3' },
            { label: 'Dikonfirmasi', value: items.filter(i => i.status === 'confirmed').length, color: '#4CAF50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
              <p className="text-xs font-medium" style={{ color: '#9CA3AF' }}>{s.label}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: '#F5F2FB' }}>
            {STATUS_FILTERS.map(f => (
              <button key={f.v} onClick={() => { setStatusFilter(f.v); setPage(1); }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                style={statusFilter === f.v ? { backgroundColor: 'white', color: '#1E1B4B', boxShadow: '0 1px 3px rgba(47,43,61,.1)' } : { color: '#9CA3AF' }}>
                {f.l}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#B0AAB9' }} />
            <input className="w-full rounded-lg pl-9 pr-4 py-2 text-sm outline-none"
              style={{ border: '1px solid #EDE8F5', color: '#1E1B4B', backgroundColor: 'white' }}
              placeholder="Cari nomor atau pelanggan..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <button onClick={load} className="p-2 rounded-lg" style={{ border: '1px solid #EDE8F5', color: '#9CA3AF', backgroundColor: 'white' }}>
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
          {loading ? (
            <div className="p-8 text-center text-sm" style={{ color: '#9CA3AF' }}>Memuat data...</div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" style={{ color: C }} />
              <p className="text-sm font-medium" style={{ color: '#9CA3AF' }}>Belum ada quotation</p>
              <button onClick={() => router.push('/sales/quotations/new')} className="mt-3 text-sm font-semibold" style={{ color: C }}>+ Buat Quotation Pertama</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid #EDE8F5', backgroundColor: '#FDFCFF' }}>
                    {['No. Quotation', 'Pelanggan', 'Tanggal', 'Berlaku Hingga', 'Total', 'Status', 'Aksi'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#9CA3AF' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => {
                    const s = STATUS_MAP[item.status] ?? STATUS_MAP.draft;
                    const busy = (a: string) => actionId === item.id + a;
                    return (
                      <tr key={item.id} style={{ borderBottom: i < items.length - 1 ? '1px solid #F5F3FF' : 'none' }}
                        className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 font-mono font-semibold text-xs" style={{ color: C }}>{item.nomorQuotation}</td>
                        <td className="px-5 py-3.5 text-sm font-medium" style={{ color: '#1E1B4B' }}>{item.customer?.name ?? '–'}</td>
                        <td className="px-5 py-3.5 text-xs" style={{ color: '#9CA3AF' }}>{fmtDate(item.tanggal ?? item.createdAt)}</td>
                        <td className="px-5 py-3.5 text-xs" style={{ color: '#9CA3AF' }}>{fmtDate(item.validUntil)}</td>
                        <td className="px-5 py-3.5 font-semibold text-sm" style={{ color: '#1E1B4B' }}>{fmt(item.total)}</td>
                        <td className="px-5 py-3.5">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ color: s.color, backgroundColor: s.bg }}>{s.label}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex gap-1">
                            {item.status !== 'converted' && item.status !== 'cancelled' && (
                              <>
                                <button onClick={() => doAction(item.id, 'confirm', 'Konfirmasi')} disabled={item.status === 'confirmed' || busy('confirm')}
                                  title="Konfirmasi sebagai Sales Order" className="p-1.5 rounded-lg disabled:opacity-40"
                                  style={{ color: '#4CAF50', backgroundColor: 'rgba(76,175,80,.08)' }}>
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => doAction(item.id, 'invoice', 'Konversi Invoice')} disabled={busy('invoice')}
                                  title="Konversi langsung ke Invoice" className="p-1.5 rounded-lg disabled:opacity-40"
                                  style={{ color: '#7367F0', backgroundColor: 'rgba(115,103,240,.08)' }}>
                                  <FileCheck className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => doAction(item.id, 'wa', 'WhatsApp')} disabled={busy('wa')}
                                  title="Kirim via WhatsApp" className="p-1.5 rounded-lg disabled:opacity-40"
                                  style={{ color: '#25D366', backgroundColor: 'rgba(37,211,102,.08)' }}>
                                  <MessageSquare className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}
                            <button onClick={() => doAction(item.id, 'delete', 'Hapus')} disabled={busy('delete')}
                              title="Hapus" className="p-1.5 rounded-lg disabled:opacity-40"
                              style={{ color: '#EA5455', backgroundColor: 'rgba(234,84,85,.08)' }}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid #EDE8F5' }}>
            <span className="text-xs" style={{ color: '#9CA3AF' }}>Total: {total}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded-lg text-xs disabled:opacity-40" style={{ border: '1px solid #EDE8F5', color: '#1E1B4B' }}>← Prev</button>
              <span className="px-3 py-1 text-xs" style={{ color: '#1E1B4B' }}>Hal {page}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={items.length < 20} className="px-3 py-1 rounded-lg text-xs disabled:opacity-40" style={{ border: '1px solid #EDE8F5', color: '#1E1B4B' }}>Next →</button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
