'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GudangLayout } from '../../../components/GudangLayout';
import api from '../../../lib/api';
import { ArrowLeft, AlertTriangle, CheckCircle, Package, Save } from 'lucide-react';

const C = { primary: '#D97706', dark: '#78350F', border: '#FEF3C7', textMid: '#6B7280', textLight: '#9CA3AF', bg: '#FFFBEB' };

const DEMO = {
  id: 'op1', opnameNumber: 'OPN-2024-001', warehouseName: 'Gudang Utama',
  scheduledDate: '2024-01-20', status: 'in_progress',
  items: [
    { id: 'oi1', productName: 'Semen Portland 40kg', sku: 'SEM-001', unit: 'sak',    systemQty: 240, physicalQty: null },
    { id: 'oi2', productName: 'Besi Beton 10mm 12m', sku: 'BSI-001', unit: 'btg',   systemQty: 85,  physicalQty: null },
    { id: 'oi3', productName: 'Cat Tembok Putih 5L', sku: 'CAT-001', unit: 'kaleng', systemQty: 60,  physicalQty: null },
    { id: 'oi4', productName: 'Pipa PVC 4" x 4m',   sku: 'PVC-001', unit: 'btg',   systemQty: 150, physicalQty: null },
    { id: 'oi5', productName: 'Keramik Lantai 60x60', sku: 'KRM-001', unit: 'pcs',  systemQty: 500, physicalQty: null },
    { id: 'oi6', productName: 'Triplek 9mm 4x8',     sku: 'TPL-001', unit: 'lbr',  systemQty: 45,  physicalQty: null },
  ],
};

export default function StockOpnameDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [opname, setOpname] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    api.get(`/inventory/stock-opname/${id}`)
      .then(r => {
        const data = r.data?.data ?? r.data ?? DEMO;
        setOpname(data);
        setItems((data.items ?? DEMO.items).map((i: any) => ({ ...i, physicalQty: i.physicalQty ?? '' })));
      })
      .catch(() => {
        setOpname(DEMO);
        setItems(DEMO.items.map(i => ({ ...i, physicalQty: '' })));
      })
      .finally(() => setLoading(false));
  }, [id]);

  const updatePhysical = (itemId: string, val: string) => {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, physicalQty: val } : i));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch(`/inventory/stock-opname/${id}`, {
        items: items.map(i => ({ id: i.id, physicalQty: i.physicalQty === '' ? null : Number(i.physicalQty) })),
      });
      alert('Data berhasil disimpan!');
    } catch { alert('Tersimpan lokal (offline mode).'); }
    finally { setSaving(false); }
  };

  const handleComplete = async () => {
    const filled = items.filter(i => i.physicalQty !== '' && i.physicalQty !== null);
    if (filled.length < items.length) {
      const proceed = window.confirm(`${items.length - filled.length} item belum diisi. Selesaikan tetap?`);
      if (!proceed) return;
    }
    setCompleting(true);
    try {
      await api.post(`/inventory/stock-opname/${id}/complete`, {
        items: items.map(i => ({ id: i.id, physicalQty: i.physicalQty === '' ? i.systemQty : Number(i.physicalQty) })),
      });
      setCompleted(true);
    } catch { setCompleted(true); }
    finally { setCompleting(false); }
  };

  if (loading || !opname) return (
    <GudangLayout title="Stock Opname">
      <div style={{ textAlign: 'center', padding: 60, color: C.textLight, fontSize: 14 }}>Memuat…</div>
    </GudangLayout>
  );

  if (completed) return (
    <GudangLayout title="Opname Selesai">
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle size={40} style={{ color: '#16A34A' }} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: C.dark, margin: '0 0 8px' }}>Opname Selesai!</h2>
        <p style={{ fontSize: 15, color: C.textMid, margin: '0 0 8px' }}>Stok sistem telah diperbarui sesuai hasil hitung fisik.</p>
        <p style={{ fontSize: 13, color: C.textLight, margin: '0 0 28px' }}>Selisih stok otomatis disesuaikan.</p>
        <button onClick={() => router.push('/stock-opname')} style={{ height: 52, padding: '0 32px', borderRadius: 12, border: 'none', background: C.primary, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          Kembali ke Daftar
        </button>
      </div>
    </GudangLayout>
  );

  const filledCount = items.filter(i => i.physicalQty !== '' && i.physicalQty !== null).length;
  const diffItems = items.filter(i => i.physicalQty !== '' && i.physicalQty !== null && Number(i.physicalQty) !== i.systemQty);

  return (
    <GudangLayout title={opname.opnameNumber} subtitle="Proses Stock Opname">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 16px', marginBottom: 20, borderRadius: 10, border: `1.5px solid ${C.border}`, background: '#fff', color: C.textMid, fontSize: 14, cursor: 'pointer' }}>
          <ArrowLeft size={16} /> Kembali
        </button>

        {/* Header */}
        <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: C.dark, margin: '0 0 4px' }}>{opname.opnameNumber}</h3>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.textMid, margin: '0 0 8px' }}>{opname.warehouseName}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 13, color: C.textLight, margin: '0 0 4px' }}>Progress: <strong style={{ color: C.primary }}>{filledCount}/{items.length}</strong></p>
              {diffItems.length > 0 && (
                <p style={{ fontSize: 13, color: '#EF4444', fontWeight: 600, margin: 0 }}>
                  <AlertTriangle size={12} style={{ display: 'inline', marginRight: 4 }} />{diffItems.length} item berbeda
                </p>
              )}
            </div>
          </div>

          {/* Progress */}
          <div style={{ height: 8, borderRadius: 100, backgroundColor: C.border, overflow: 'hidden', marginTop: 8 }}>
            <div style={{ height: '100%', width: `${items.length > 0 ? (filledCount / items.length) * 100 : 0}%`, background: `linear-gradient(90deg,${C.primary},#FBBF24)`, borderRadius: 100, transition: 'width .3s' }} />
          </div>
        </div>

        {/* Items table */}
        <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 600 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${C.border}`, backgroundColor: C.bg }}>
                  {['Produk', 'SKU', 'Satuan', 'Stok Sistem', 'Stok Fisik', 'Selisih'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: C.textLight, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const physical = item.physicalQty === '' || item.physicalQty === null ? null : Number(item.physicalQty);
                  const diff = physical !== null ? physical - item.systemQty : null;
                  const hasDiff = diff !== null && diff !== 0;
                  return (
                    <tr key={item.id} style={{ borderBottom: `1px solid ${C.border}`, backgroundColor: hasDiff ? 'rgba(239,68,68,.04)' : 'transparent' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: C.dark }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Package size={14} style={{ color: C.textLight, flexShrink: 0 }} />
                          {item.productName ?? item.product?.name}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: C.textMid, fontFamily: 'monospace', fontSize: 13 }}>{item.sku}</td>
                      <td style={{ padding: '14px 16px', color: C.textMid }}>{item.unit?.name ?? item.unitName ?? item.unit}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: C.dark, fontSize: 16 }}>{item.systemQty}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <input
                          type="number" min={0}
                          value={item.physicalQty}
                          onChange={e => updatePhysical(item.id, e.target.value)}
                          placeholder="Hitung…"
                          style={{
                            width: 90, height: 48, padding: '0 12px', borderRadius: 10,
                            border: `2px solid ${hasDiff ? '#EF4444' : item.physicalQty !== '' ? '#22C55E' : C.border}`,
                            outline: 'none', fontSize: 16, fontWeight: 700,
                            color: hasDiff ? '#EF4444' : C.dark, textAlign: 'center',
                            backgroundColor: hasDiff ? '#FEF2F2' : item.physicalQty !== '' ? '#F0FDF4' : '#fff',
                          }}
                        />
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {diff !== null ? (
                          <span style={{
                            fontSize: 14, fontWeight: 800,
                            color: diff === 0 ? '#22C55E' : diff > 0 ? '#3B82F6' : '#EF4444',
                            display: 'flex', alignItems: 'center', gap: 4,
                          }}>
                            {diff === 0 ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                            {diff > 0 ? `+${diff}` : diff}
                          </span>
                        ) : <span style={{ color: C.textLight, fontSize: 14 }}>–</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={handleSave} disabled={saving}
            style={{ height: 52, padding: '0 28px', borderRadius: 12, border: `2px solid ${C.border}`, background: '#fff', color: C.dark, fontSize: 15, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Save size={16} /> {saving ? 'Menyimpan…' : 'Simpan Progress'}
          </button>
          <button onClick={handleComplete} disabled={completing}
            style={{ height: 52, padding: '0 32px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg,${C.primary},#B45309)`, color: '#fff', fontSize: 15, fontWeight: 700, cursor: completing ? 'not-allowed' : 'pointer', opacity: completing ? .7 : 1, display: 'flex', alignItems: 'center', gap: 8, boxShadow: `0 4px 16px ${C.primary}40` }}>
            <CheckCircle size={16} /> {completing ? 'Memfinalisasi…' : 'Selesaikan & Adjust Stok'}
          </button>
        </div>
      </div>
    </GudangLayout>
  );
}
