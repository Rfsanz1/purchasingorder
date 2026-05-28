'use client';

import { useEffect, useState, useCallback } from 'react';
import { GudangLayout } from '../../components/GudangLayout';
import api from '../../lib/api';
import { Clock, Search, RefreshCw, ArrowDownRight, ArrowUpRight, ArrowLeftRight, ClipboardCheck, Package } from 'lucide-react';

const C = { primary: '#D97706', dark: '#78350F', border: '#FEF3C7', textMid: '#6B7280', textLight: '#9CA3AF', bg: '#FFFBEB' };

const TYPE_CFG: Record<string, { label: string; color: string; icon: any; sign: string }> = {
  inbound:     { label: 'Barang Masuk',   color: '#22C55E', icon: ArrowDownRight, sign: '+' },
  outbound:    { label: 'Barang Keluar',  color: '#EF4444', icon: ArrowUpRight,   sign: '−' },
  transfer_in: { label: 'Transfer Masuk', color: '#3B82F6', icon: ArrowLeftRight, sign: '+' },
  transfer_out:{ label: 'Transfer Keluar',color: '#8B5CF6', icon: ArrowLeftRight, sign: '−' },
  adjustment:  { label: 'Adjustment',     color: '#F59E0B', icon: ClipboardCheck, sign: '±' },
  opname:      { label: 'Stock Opname',   color: '#D97706', icon: ClipboardCheck, sign: '±' },
};

const DEMO: any[] = [
  { id: 'm1', productName: 'Semen Portland 40kg', type: 'inbound',      qty: 100, warehouse: 'Gudang Utama',         reference: 'PO-2024-001', createdAt: '2024-01-15T10:30:00', createdBy: 'Andi' },
  { id: 'm2', productName: 'Besi Beton 10mm 12m', type: 'outbound',     qty: 5,   warehouse: 'Gudang Utama',         reference: 'SO-2024-001', createdAt: '2024-01-15T09:15:00', createdBy: 'Budi' },
  { id: 'm3', productName: 'Cat Tembok Putih 5L', type: 'transfer_out', qty: 10,  warehouse: 'Gudang Utama',         reference: 'TRF-2024-001', createdAt: '2024-01-14T14:00:00', createdBy: 'Andi' },
  { id: 'm4', productName: 'Cat Tembok Putih 5L', type: 'transfer_in',  qty: 10,  warehouse: 'Gudang Cabang Selatan', reference: 'TRF-2024-001', createdAt: '2024-01-14T14:05:00', createdBy: 'Andi' },
  { id: 'm5', productName: 'Pipa PVC 4" x 4m',   type: 'inbound',      qty: 50,  warehouse: 'Gudang Utama',         reference: 'PO-2024-002', createdAt: '2024-01-13T11:00:00', createdBy: 'Budi' },
  { id: 'm6', productName: 'Keramik Lantai 60x60', type: 'adjustment',  qty: -3,  warehouse: 'Gudang Utama',         reference: 'OPN-2023-012', createdAt: '2024-01-10T16:00:00', createdBy: 'Andi' },
  { id: 'm7', productName: 'Triplek 9mm 4x8',     type: 'outbound',     qty: 5,   warehouse: 'Gudang Utama',         reference: 'SO-2024-003', createdAt: '2024-01-09T08:30:00', createdBy: 'Budi' },
];

export default function HistoryPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '100', ...(typeFilter && { type: typeFilter }), ...(dateFrom && { dateFrom }), ...(dateTo && { dateTo }) });
      const res = await api.get(`/inventory/mutations?${params}`);
      const data = res.data?.data ?? res.data?.items ?? res.data;
      setRows(Array.isArray(data) ? data : DEMO);
    } catch { setRows(DEMO); }
    finally { setLoading(false); }
  }, [typeFilter, dateFrom, dateTo]);

  useEffect(() => { fetchData(); setPage(1); }, [fetchData]);

  const filtered = rows.filter(r =>
    !search || (r.productName + (r.reference ?? '')).toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice(0, page * PAGE_SIZE);

  const formatDT = (v: string) => v ? new Date(v).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '–';

  return (
    <GudangLayout title="Riwayat Mutasi" subtitle="Log pergerakan stok">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: C.dark, margin: '0 0 4px' }}>Riwayat Mutasi Stok</h2>
          <p style={{ fontSize: 14, color: C.textLight, margin: 0 }}>{filtered.length} transaksi</p>
        </div>
        <button onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 48, padding: '0 16px', borderRadius: 12, border: `1.5px solid ${C.border}`, background: '#fff', color: C.textMid, fontSize: 14, cursor: 'pointer' }}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: C.textLight }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari produk / referensi…"
            style={{ width: '100%', height: 48, padding: '0 14px 0 42px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, boxSizing: 'border-box', color: C.dark, backgroundColor: '#fff' }} />
        </div>
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); }}
          style={{ height: 48, padding: '0 16px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, cursor: 'pointer', color: C.textMid, backgroundColor: '#fff' }}>
          <option value="">Semua Tipe</option>
          {Object.entries(TYPE_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
          style={{ height: 48, padding: '0 14px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, color: C.textMid, backgroundColor: '#fff' }} />
        <span style={{ fontSize: 13, color: C.textLight }}>s/d</span>
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
          style={{ height: 48, padding: '0 14px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, color: C.textMid, backgroundColor: '#fff' }} />
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 680 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}`, backgroundColor: C.bg }}>
                {['Waktu', 'Produk', 'Tipe Mutasi', 'Qty', 'Gudang', 'Referensi', 'Oleh'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: C.textLight, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: 48, textAlign: 'center', color: C.textLight }}>Memuat…</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 48, textAlign: 'center', color: C.textLight }}>Tidak ada mutasi ditemukan</td></tr>
              ) : paginated.map(r => {
                const cfg = TYPE_CFG[r.type] ?? { label: r.type, color: '#9CA3AF', icon: Package, sign: '' };
                const Icon = cfg.icon;
                const qty = r.qty ?? 0;
                return (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}` }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.bg)}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                    <td style={{ padding: '13px 16px', color: C.textMid, fontSize: 13, whiteSpace: 'nowrap' }}>{formatDT(r.createdAt)}</td>
                    <td style={{ padding: '13px 16px', fontWeight: 600, color: C.dark }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Package size={14} style={{ color: C.textLight, flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{r.productName ?? r.product?.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 100, color: cfg.color, backgroundColor: `${cfg.color}15`, width: 'fit-content', whiteSpace: 'nowrap' }}>
                        <Icon size={12} /> {cfg.label}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px', fontWeight: 800, fontSize: 16, color: r.type === 'outbound' || r.type === 'transfer_out' ? '#EF4444' : qty < 0 ? '#EF4444' : '#22C55E', whiteSpace: 'nowrap' }}>
                      {cfg.sign}{Math.abs(qty)}
                    </td>
                    <td style={{ padding: '13px 16px', color: C.textMid, fontSize: 13 }}>{r.warehouse ?? r.warehouseName ?? '–'}</td>
                    <td style={{ padding: '13px 16px', fontWeight: 600, color: C.primary, fontFamily: 'monospace', fontSize: 13 }}>{r.reference ?? '–'}</td>
                    <td style={{ padding: '13px 16px', color: C.textMid, fontSize: 13 }}>{r.createdBy ?? '–'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Load more */}
        {paginated.length < filtered.length && (
          <div style={{ padding: '14px 20px', borderTop: `1px solid ${C.border}`, textAlign: 'center' }}>
            <button onClick={() => setPage(p => p + 1)}
              style={{ height: 44, padding: '0 24px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: '#fff', color: C.textMid, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Tampilkan lebih banyak ({filtered.length - paginated.length} tersisa)
            </button>
          </div>
        )}
        {filtered.length > 0 && (
          <div style={{ padding: '10px 16px', borderTop: `1px solid ${C.border}`, color: C.textLight, fontSize: 12 }}>
            Menampilkan {paginated.length} dari {filtered.length} mutasi
          </div>
        )}
      </div>
    </GudangLayout>
  );
}
