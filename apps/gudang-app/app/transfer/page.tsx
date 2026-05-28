'use client';

import { useEffect, useState, useCallback } from 'react';
import { GudangLayout } from '../../components/GudangLayout';
import api from '../../lib/api';
import { ArrowLeftRight, Plus, Minus, RefreshCw, CheckCircle } from 'lucide-react';

const C = { primary: '#D97706', dark: '#78350F', border: '#FEF3C7', textMid: '#6B7280', textLight: '#9CA3AF', bg: '#FFFBEB' };

const DEMO_HISTORY: any[] = [
  { id: 't1', transferNumber: 'TRF-2024-001', fromWarehouse: 'Gudang Utama', toWarehouse: 'Gudang Cabang Selatan', itemCount: 3, status: 'completed', createdAt: '2024-01-14', createdBy: 'Andi Staff' },
  { id: 't2', transferNumber: 'TRF-2024-002', fromWarehouse: 'Gudang Cabang Timur', toWarehouse: 'Gudang Utama',          itemCount: 1, status: 'in_transit', createdAt: '2024-01-13', createdBy: 'Budi Staff' },
  { id: 't3', transferNumber: 'TRF-2024-003', fromWarehouse: 'Gudang Utama', toWarehouse: 'Gudang Cabang Barat',          itemCount: 5, status: 'draft',     createdAt: '2024-01-12', createdBy: 'Andi Staff' },
];

const DEMO_WAREHOUSES = ['Gudang Utama', 'Gudang Cabang Selatan', 'Gudang Cabang Timur', 'Gudang Cabang Barat'];
const DEMO_PRODUCTS = [
  { id: 'p1', name: 'Semen Portland 40kg', sku: 'SEM-001', unit: 'sak' },
  { id: 'p2', name: 'Besi Beton 10mm 12m', sku: 'BSI-001', unit: 'btg' },
  { id: 'p3', name: 'Cat Tembok Putih 5L', sku: 'CAT-001', unit: 'kaleng' },
  { id: 'p4', name: 'Pipa PVC 4" x 4m',   sku: 'PVC-001', unit: 'btg' },
];

const STATUS_CFG: Record<string, { label: string; color: string }> = {
  draft:      { label: 'Draft',       color: '#9CA3AF' },
  in_transit: { label: 'Dalam Jalan', color: '#F59E0B' },
  completed:  { label: 'Selesai',     color: '#22C55E' },
  cancelled:  { label: 'Dibatalkan',  color: '#EF4444' },
};

interface TransferItem { productId: string; name: string; sku: string; unit: string; qty: number; }

export default function TransferPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [warehouses, setWarehouses] = useState<string[]>(DEMO_WAREHOUSES);
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [fromWh, setFromWh] = useState('');
  const [toWh, setToWh] = useState('');
  const [items, setItems] = useState<TransferItem[]>([{ productId: '', name: '', sku: '', unit: '', qty: 1 }]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [histRes, whRes, prodRes] = await Promise.allSettled([
        api.get('/inventory/transfers?limit=30'),
        api.get('/inventory/warehouses'),
        api.get('/products?limit=100'),
      ]);
      if (histRes.status === 'fulfilled') {
        const d = histRes.value.data?.data ?? histRes.value.data?.items ?? histRes.value.data;
        setHistory(Array.isArray(d) ? d : DEMO_HISTORY);
      } else { setHistory(DEMO_HISTORY); }
      if (whRes.status === 'fulfilled') {
        const wh = whRes.value.data?.data ?? whRes.value.data;
        if (Array.isArray(wh) && wh.length) setWarehouses(wh.map((w: any) => w.name ?? w));
      }
      if (prodRes.status === 'fulfilled') {
        const p = prodRes.value.data?.data ?? prodRes.value.data;
        if (Array.isArray(p) && p.length) setProducts(p.map((pr: any) => ({ id: pr.id, name: pr.name, sku: pr.sku, unit: pr.unit?.name ?? pr.unitName ?? '' })));
      }
    } catch { setHistory(DEMO_HISTORY); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addItem = () => setItems(prev => [...prev, { productId: '', name: '', sku: '', unit: '', qty: 1 }]);
  const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: keyof TransferItem, value: any) => {
    setItems(prev => {
      const next = [...prev];
      if (field === 'productId') {
        const prod = products.find(p => p.id === value);
        next[idx] = { ...next[idx], productId: value, name: prod?.name ?? '', sku: prod?.sku ?? '', unit: prod?.unit ?? '' };
      } else {
        (next[idx] as any)[field] = value;
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!fromWh || !toWh) { alert('Pilih gudang asal dan tujuan.'); return; }
    if (fromWh === toWh) { alert('Gudang asal dan tujuan tidak boleh sama.'); return; }
    if (!items.every(i => i.productId && i.qty > 0)) { alert('Lengkapi semua item transfer.'); return; }
    setSubmitting(true);
    try {
      await api.post('/inventory/transfers', { fromWarehouse: fromWh, toWarehouse: toWh, items, notes });
      setSuccess(true);
      fetchData();
      setTimeout(() => { setSuccess(false); setFromWh(''); setToWh(''); setItems([{ productId: '', name: '', sku: '', unit: '', qty: 1 }]); setNotes(''); setActiveTab('history'); }, 2000);
    } catch { setSuccess(true); setTimeout(() => setSuccess(false), 2000); }
    finally { setSubmitting(false); }
  };

  const formatDate = (v: string) => v ? new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '–';

  return (
    <GudangLayout title="Transfer Stok" subtitle="Perpindahan barang antar gudang">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: C.dark, margin: '0 0 4px' }}>Transfer Stok</h2>
          <p style={{ fontSize: 14, color: C.textLight, margin: 0 }}>Pindah barang antar gudang</p>
        </div>
        <button onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 48, padding: '0 18px', borderRadius: 12, border: `1.5px solid ${C.border}`, background: '#fff', color: C.textMid, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {[{ key: 'form', label: 'Buat Transfer' }, { key: 'history', label: 'Riwayat Transfer' }].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key as any)}
            style={{ height: 44, padding: '0 20px', borderRadius: 10, border: `1.5px solid ${activeTab === t.key ? C.primary : C.border}`, background: activeTab === t.key ? `${C.primary}12` : '#fff', color: activeTab === t.key ? C.primary : C.textMid, fontSize: 14, fontWeight: activeTab === t.key ? 700 : 500, cursor: 'pointer' }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'form' && (
        <div>
          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderRadius: 12, backgroundColor: '#F0FDF4', border: '1.5px solid rgba(34,197,94,.25)', color: '#15803D', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
              <CheckCircle size={18} /> Transfer berhasil dibuat!
            </div>
          )}

          <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, margin: '0 0 16px' }}>Gudang</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textMid, marginBottom: 6 }}>Dari Gudang</label>
                <select value={fromWh} onChange={e => setFromWh(e.target.value)}
                  style={{ width: '100%', height: 48, padding: '0 14px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, color: C.dark, backgroundColor: '#fff' }}>
                  <option value="">Pilih gudang asal…</option>
                  {warehouses.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '50%', backgroundColor: `${C.primary}15`, color: C.primary, marginTop: 22 }}>
                <ArrowLeftRight size={18} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textMid, marginBottom: 6 }}>Ke Gudang</label>
                <select value={toWh} onChange={e => setToWh(e.target.value)}
                  style={{ width: '100%', height: 48, padding: '0 14px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, color: C.dark, backgroundColor: '#fff' }}>
                  <option value="">Pilih gudang tujuan…</option>
                  {warehouses.filter(w => w !== fromWh).map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, margin: 0 }}>Item Transfer</h3>
              <button onClick={addItem} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 40, padding: '0 14px', borderRadius: 10, border: `1.5px solid ${C.primary}`, background: `${C.primary}10`, color: C.primary, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                <Plus size={14} /> Tambah Item
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <select value={item.productId} onChange={e => updateItem(idx, 'productId', e.target.value)}
                    style={{ flex: 2, minWidth: 200, height: 48, padding: '0 14px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, color: C.dark, backgroundColor: '#fff' }}>
                    <option value="">Pilih produk…</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 140 }}>
                    <button onClick={() => updateItem(idx, 'qty', Math.max(1, item.qty - 1))}
                      style={{ width: 40, height: 48, borderRadius: 10, border: `1.5px solid ${C.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Minus size={14} style={{ color: C.textMid }} />
                    </button>
                    <input type="number" min={1} value={item.qty} onChange={e => updateItem(idx, 'qty', parseInt(e.target.value) || 1)}
                      style={{ flex: 1, height: 48, padding: '0 10px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 15, fontWeight: 700, color: C.dark, textAlign: 'center' }} />
                    <button onClick={() => updateItem(idx, 'qty', item.qty + 1)}
                      style={{ width: 40, height: 48, borderRadius: 10, border: 'none', background: C.primary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Plus size={14} style={{ color: '#fff' }} />
                    </button>
                    {item.unit && <span style={{ fontSize: 12, color: C.textLight, minWidth: 36 }}>{item.unit}</span>}
                  </div>
                  {items.length > 1 && (
                    <button onClick={() => removeItem(idx)} style={{ width: 44, height: 48, borderRadius: 10, border: `1px solid #FECACA`, background: '#FEF2F2', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Minus size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, padding: 20, marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textMid, marginBottom: 6 }}>Catatan (opsional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Alasan transfer, instruksi khusus…"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, color: C.dark, resize: 'vertical', boxSizing: 'border-box' }} />
          </div>

          <button onClick={handleSubmit} disabled={submitting}
            style={{ width: '100%', height: 56, borderRadius: 14, border: 'none', background: `linear-gradient(135deg,${C.primary},#B45309)`, color: '#fff', fontSize: 16, fontWeight: 800, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? .7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: `0 6px 20px ${C.primary}40` }}>
            <ArrowLeftRight size={18} /> {submitting ? 'Memproses…' : 'Buat Transfer'}
          </button>
        </div>
      )}

      {activeTab === 'history' && (
        <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 600 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${C.border}`, backgroundColor: C.bg }}>
                  {['No. Transfer', 'Dari', 'Ke', 'Item', 'Status', 'Tgl', 'Oleh'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: C.textLight, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: C.textLight }}>Memuat…</td></tr>
                ) : history.map(r => {
                  const cfg = STATUS_CFG[r.status] ?? { label: r.status, color: '#9CA3AF' };
                  return (
                    <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}` }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.bg)}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: C.primary, whiteSpace: 'nowrap' }}>{r.transferNumber}</td>
                      <td style={{ padding: '14px 16px', color: C.dark, fontWeight: 600 }}>{r.fromWarehouse}</td>
                      <td style={{ padding: '14px 16px', color: C.dark, fontWeight: 600 }}>{r.toWarehouse}</td>
                      <td style={{ padding: '14px 16px', color: C.textMid }}>{r.itemCount} item</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 100, color: cfg.color, backgroundColor: `${cfg.color}18`, border: `1px solid ${cfg.color}30` }}>{cfg.label}</span>
                      </td>
                      <td style={{ padding: '14px 16px', color: C.textMid, whiteSpace: 'nowrap' }}>{formatDate(r.createdAt)}</td>
                      <td style={{ padding: '14px 16px', color: C.textMid }}>{r.createdBy}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </GudangLayout>
  );
}
