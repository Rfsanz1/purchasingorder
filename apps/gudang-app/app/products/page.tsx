'use client';

import { useEffect, useState, useCallback } from 'react';
import { GudangLayout } from '../../components/GudangLayout';
import api from '../../lib/api';
import { Search, Package, RefreshCw, MapPin, Hash } from 'lucide-react';

const C = { primary: '#D97706', dark: '#78350F', border: '#FEF3C7', textMid: '#6B7280', textLight: '#9CA3AF', bg: '#FFFBEB' };

const DEMO: any[] = [
  { id: 'p1', name: 'Semen Portland 40kg', sku: 'SEM-001', barcode: '8991234560001', category: 'Material', unit: 'sak',    reorderPoint: 50, stocks: [{ warehouse: 'Gudang Utama', qty: 240, rack: 'A-01-03', lot: 'LOT-2024-01' }, { warehouse: 'Gudang Cabang', qty: 80, rack: 'A-02-01', lot: 'LOT-2024-01' }] },
  { id: 'p2', name: 'Besi Beton 10mm 12m', sku: 'BSI-001', barcode: '8991234560002', category: 'Material', unit: 'btg',   reorderPoint: 30, stocks: [{ warehouse: 'Gudang Utama', qty: 85, rack: 'B-02-01', lot: 'LOT-2023-12' }] },
  { id: 'p3', name: 'Cat Tembok Putih 5L', sku: 'CAT-001', barcode: '8991234560003', category: 'Finishing', unit: 'kaleng', reorderPoint: 20, stocks: [{ warehouse: 'Gudang Utama', qty: 60, rack: 'C-01-05', lot: '' }, { warehouse: 'Gudang Cabang', qty: 5, rack: 'C-01-01', lot: '' }] },
  { id: 'p4', name: 'Pipa PVC 4" x 4m',   sku: 'PVC-001', barcode: '8991234560004', category: 'Plumbing', unit: 'btg',   reorderPoint: 40, stocks: [{ warehouse: 'Gudang Utama', qty: 150, rack: 'B-03-02', lot: '' }] },
  { id: 'p5', name: 'Keramik Lantai 60x60', sku: 'KRM-001', barcode: '8991234560005', category: 'Finishing', unit: 'pcs', reorderPoint: 100, stocks: [{ warehouse: 'Gudang Utama', qty: 500, rack: 'D-01-01', lot: 'LOT-2024-01' }, { warehouse: 'Gudang Cabang', qty: 12, rack: 'D-01-02', lot: 'LOT-2023-11' }] },
  { id: 'p6', name: 'Triplek 9mm 4x8',     sku: 'TPL-001', barcode: '8991234560006', category: 'Kayu',     unit: 'lbr',  reorderPoint: 20, stocks: [{ warehouse: 'Gudang Utama', qty: 45, rack: 'E-01-01', lot: '' }] },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/products?limit=100&include=stocks');
      const data = res.data?.data ?? res.data?.items ?? res.data;
      setProducts(Array.isArray(data) ? data : DEMO);
    } catch { setProducts(DEMO); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const filtered = products.filter(p =>
    (!categoryFilter || p.category === categoryFilter) &&
    (!search || (p.name + (p.sku ?? '') + (p.barcode ?? '')).toLowerCase().includes(search.toLowerCase()))
  );

  const totalStock = (p: any) => (p.stocks ?? []).reduce((s: number, st: any) => s + (st.qty ?? 0), 0);
  const isCritical = (p: any) => totalStock(p) <= (p.reorderPoint ?? 0);

  return (
    <GudangLayout title="Cek Stok" subtitle="Informasi stok produk per gudang">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: C.dark, margin: '0 0 4px' }}>Cek Stok</h2>
          <p style={{ fontSize: 14, color: C.textLight, margin: 0 }}>{products.length} produk terdaftar</p>
        </div>
        <button onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 48, padding: '0 16px', borderRadius: 12, border: `1.5px solid ${C.border}`, background: '#fff', color: C.textMid, fontSize: 14, cursor: 'pointer' }}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: C.textLight }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama produk / SKU / barcode…" autoFocus
            style={{ width: '100%', height: 48, padding: '0 14px 0 42px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, boxSizing: 'border-box', color: C.dark, backgroundColor: '#fff' }} />
        </div>
        {categories.length > 0 && (
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            style={{ height: 48, padding: '0 16px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, cursor: 'pointer', color: C.textMid, backgroundColor: '#fff' }}>
            <option value="">Semua Kategori</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>

      {/* Product cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: C.textLight, fontSize: 14 }}>Memuat…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: C.textLight, fontSize: 14 }}>Produk tidak ditemukan</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(p => {
            const total = totalStock(p);
            const critical = isCritical(p);
            const expanded = expandedId === p.id;
            return (
              <div key={p.id} style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${critical ? 'rgba(239,68,68,.4)' : C.border}`, overflow: 'hidden', transition: 'all .2s' }}>
                {/* Row */}
                <button onClick={() => setExpandedId(expanded ? null : p.id)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: critical ? '#FEF2F2' : `${C.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Package size={22} style={{ color: critical ? '#EF4444' : C.primary }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: C.dark }}>{p.name}</span>
                      {critical && <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 100, backgroundColor: '#FEF2F2', color: '#EF4444', border: '1px solid rgba(239,68,68,.2)' }}>STOK KRITIS</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, color: C.textLight, fontFamily: 'monospace' }}>{p.sku}</span>
                      {p.barcode && <span style={{ fontSize: 13, color: C.textLight }}>Barcode: {p.barcode}</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: 22, fontWeight: 800, color: critical ? '#EF4444' : C.dark, margin: '0 0 2px', lineHeight: 1 }}>{total}</p>
                    <p style={{ fontSize: 12, color: C.textLight, margin: 0 }}>{p.unit?.name ?? p.unit}</p>
                  </div>
                  <div style={{ fontSize: 18, color: C.textLight, flexShrink: 0 }}>{expanded ? '▲' : '▼'}</div>
                </button>

                {/* Expanded details */}
                {expanded && (
                  <div style={{ borderTop: `1px solid ${C.border}`, backgroundColor: C.bg, padding: '14px 20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 10 }}>
                      {(p.stocks ?? []).map((st: any, i: number) => (
                        <div key={i} style={{ backgroundColor: '#fff', borderRadius: 12, border: `1px solid ${C.border}`, padding: '12px 16px' }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: C.dark, margin: '0 0 8px' }}>{st.warehouse ?? st.warehouseName}</p>
                          <p style={{ fontSize: 22, fontWeight: 800, color: C.primary, margin: '0 0 6px' }}>{st.qty} <span style={{ fontSize: 12, fontWeight: 400, color: C.textLight }}>{p.unit?.name ?? p.unit}</span></p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {st.rack && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <MapPin size={12} style={{ color: C.textLight }} />
                                <span style={{ fontSize: 12, fontWeight: 700, color: C.primary, fontFamily: 'monospace' }}>{st.rack}</span>
                              </div>
                            )}
                            {st.lot && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Hash size={12} style={{ color: C.textLight }} />
                                <span style={{ fontSize: 12, color: C.textMid }}>{st.lot}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {(!p.stocks || p.stocks.length === 0) && (
                        <p style={{ fontSize: 13, color: C.textLight }}>Tidak ada data stok per gudang.</p>
                      )}
                    </div>
                    {p.reorderPoint && (
                      <p style={{ fontSize: 12, color: critical ? '#EF4444' : C.textLight, margin: '10px 0 0', fontWeight: critical ? 700 : 400 }}>
                        Reorder point: {p.reorderPoint} {p.unit?.name ?? p.unit} {critical ? '— Segera reorder!' : ''}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </GudangLayout>
  );
}
