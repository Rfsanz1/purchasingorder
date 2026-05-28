'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { GudangLayout } from '../../components/GudangLayout';
import api from '../../lib/api';
import { ArrowUpRight, Search, RefreshCw, ShoppingCart } from 'lucide-react';

const C = { primary: '#D97706', dark: '#78350F', border: '#FEF3C7', textMid: '#6B7280', textLight: '#9CA3AF', bg: '#FFFBEB' };

const STATUS_CFG: Record<string, { label: string; color: string }> = {
  confirmed:    { label: 'Dikonfirmasi',    color: '#3B82F6' },
  picking:      { label: 'Dipicking',       color: '#F59E0B' },
  ready:        { label: 'Siap Kirim',      color: '#22C55E' },
  shipped:      { label: 'Dikirim',         color: '#8B5CF6' },
  delivered:    { label: 'Terkirim',        color: '#16A34A' },
};

const DEMO: any[] = [
  { id: 'so1', soNumber: 'SO-2024-001', customerName: 'PT Maju Sejahtera',    itemCount: 5, status: 'confirmed', soDate: '2024-01-15', deliveryAddress: 'Jl. Raya No. 1, Jakarta' },
  { id: 'so2', soNumber: 'SO-2024-002', customerName: 'CV Berkah Jaya',       itemCount: 3, status: 'picking',   soDate: '2024-01-14', deliveryAddress: 'Jl. Sudirman No. 5, Bandung' },
  { id: 'so3', soNumber: 'SO-2024-003', customerName: 'Toko Bangunan Sejuk',  itemCount: 8, status: 'ready',     soDate: '2024-01-13', deliveryAddress: 'Jl. Ahmad Yani No. 22, Surabaya' },
  { id: 'so4', soNumber: 'SO-2024-004', customerName: 'UD Subur Makmur',      itemCount: 2, status: 'confirmed', soDate: '2024-01-12', deliveryAddress: 'Jl. Pemuda No. 8, Semarang' },
];

function Badge({ status }: { status: string }) {
  const cfg = STATUS_CFG[status] ?? { label: status, color: '#9CA3AF' };
  return (
    <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 100, color: cfg.color, backgroundColor: `${cfg.color}18`, border: `1px solid ${cfg.color}30`, whiteSpace: 'nowrap' }}>
      {cfg.label}
    </span>
  );
}

export default function OutboundPage() {
  const router = useRouter();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/sales/orders?status=confirmed,picking,ready&limit=50');
      const data = res.data?.data ?? res.data?.items ?? res.data;
      setRows(Array.isArray(data) ? data : DEMO);
    } catch { setRows(DEMO); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = rows.filter(r =>
    (!statusFilter || r.status === statusFilter) &&
    (!search || (r.soNumber + (r.customerName ?? '')).toLowerCase().includes(search.toLowerCase()))
  );

  const formatDate = (v: string) => v ? new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '–';

  return (
    <GudangLayout title="Barang Keluar" subtitle="Pengiriman Sales Order">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: C.dark, margin: '0 0 4px' }}>Barang Keluar</h2>
          <p style={{ fontSize: 14, color: C.textLight, margin: 0 }}>{filtered.length} SO menunggu pengiriman</p>
        </div>
        <button onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 48, padding: '0 18px', borderRadius: 12, border: `1.5px solid ${C.border}`, background: '#fff', color: C.textMid, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: C.textLight }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari no. SO / pelanggan…"
            style={{ width: '100%', height: 48, padding: '0 14px 0 42px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, boxSizing: 'border-box', color: C.dark, backgroundColor: '#fff' }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ height: 48, padding: '0 16px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, cursor: 'pointer', color: C.textMid, backgroundColor: '#fff' }}>
          <option value="">Semua Status</option>
          {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 640 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}`, backgroundColor: C.bg }}>
                {['No. SO', 'Pelanggan', 'Alamat Kirim', 'Tgl SO', 'Item', 'Status', 'Aksi'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: C.textLight, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: 48, textAlign: 'center', color: C.textLight, fontSize: 14 }}>Memuat data…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 48, textAlign: 'center', color: C.textLight, fontSize: 14 }}>Tidak ada SO ditemukan</td></tr>
              ) : filtered.map(r => (
                <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}`, cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.bg)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  onClick={() => router.push(`/outbound/${r.id}`)}>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: C.primary, whiteSpace: 'nowrap' }}>{r.soNumber ?? r.orderNumber}</td>
                  <td style={{ padding: '14px 16px', color: C.dark, fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <ShoppingCart size={14} style={{ color: '#3B82F6' }} />
                      </div>
                      {r.customerName ?? r.customer?.name ?? '–'}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: C.textMid, maxWidth: 180 }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                      {r.deliveryAddress ?? r.shippingAddress ?? '–'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: C.textMid, whiteSpace: 'nowrap' }}>{formatDate(r.soDate ?? r.createdAt)}</td>
                  <td style={{ padding: '14px 16px', color: C.textMid }}>{r.itemCount ?? r.items?.length ?? '–'} item</td>
                  <td style={{ padding: '14px 16px' }}><Badge status={r.status} /></td>
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={e => { e.stopPropagation(); router.push(`/outbound/${r.id}`); }}
                      style={{ height: 40, padding: '0 16px', borderRadius: 10, border: 'none', background: '#22C55E', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      Proses
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </GudangLayout>
  );
}
