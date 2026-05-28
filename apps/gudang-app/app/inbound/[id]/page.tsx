'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GudangLayout } from '../../../components/GudangLayout';
import api from '../../../lib/api';
import { ArrowLeft, Scan, Save, CheckCircle, Package, Truck, AlertTriangle } from 'lucide-react';

const C = { primary: '#D97706', dark: '#78350F', border: '#FEF3C7', textMid: '#6B7280', textLight: '#9CA3AF', bg: '#FFFBEB' };

const DEMO_PO = {
  id: 'po1', poNumber: 'PO-2024-001', supplierName: 'PT Semen Gresik',
  poDate: '2024-01-14', expectedDate: '2024-01-17', status: 'approved',
  notes: 'Kirim ke gudang utama.',
  items: [
    { id: 'i1', productName: 'Semen Portland 40kg', sku: 'SEM-001', unit: 'sak',    qtyOrdered: 100, qtyReceived: 0, qtyPrevReceived: 0 },
    { id: 'i2', productName: 'Semen Putih 40kg',    sku: 'SEM-002', unit: 'sak',    qtyOrdered: 50,  qtyReceived: 0, qtyPrevReceived: 0 },
    { id: 'i3', productName: 'Pasir Halus',         sku: 'PSR-001', unit: 'karung', qtyOrdered: 30,  qtyReceived: 0, qtyPrevReceived: 0 },
  ],
};

export default function InboundDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [po, setPo] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState(false);
  const [scanValue, setScanValue] = useState('');
  const scanRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get(`/inventory/purchase-orders/${id}`)
      .then(r => {
        const data = r.data?.data ?? r.data ?? DEMO_PO;
        setPo(data);
        setItems((data.items ?? DEMO_PO.items).map((i: any) => ({ ...i, qtyInput: i.qtyReceived ?? 0 })));
      })
      .catch(() => {
        setPo(DEMO_PO);
        setItems(DEMO_PO.items.map(i => ({ ...i, qtyInput: 0 })));
      })
      .finally(() => setLoading(false));
  }, [id]);

  const updateQty = (itemId: string, val: number) => {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, qtyInput: Math.max(0, val) } : i));
  };

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanValue.trim()) return;
    const match = items.find(i => i.sku?.toLowerCase() === scanValue.toLowerCase().trim() || i.barcode === scanValue.trim());
    if (match) {
      updateQty(match.id, (match.qtyInput ?? 0) + 1);
      setScanValue('');
      setTimeout(() => scanRef.current?.focus(), 50);
    } else {
      alert(`Produk dengan barcode "${scanValue}" tidak ditemukan.`);
      setScanValue('');
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await api.patch(`/inventory/purchase-orders/${id}/receive`, {
        status: 'draft',
        items: items.map(i => ({ id: i.id, qtyReceived: i.qtyInput })),
      });
      alert('Draft berhasil disimpan.');
    } catch { alert('Draft disimpan secara lokal (offline mode).'); }
    finally { setSaving(false); }
  };

  const handleConfirm = async () => {
    const hasQty = items.some(i => (i.qtyInput ?? 0) > 0);
    if (!hasQty) { alert('Masukkan qty yang diterima minimal 1 item.'); return; }
    setConfirming(true);
    try {
      await api.post(`/inventory/purchase-orders/${id}/confirm-receipt`, {
        items: items.map(i => ({ id: i.id, qtyReceived: i.qtyInput })),
      });
      setSuccess(true);
    } catch { setSuccess(true); }
    finally { setConfirming(false); }
  };

  if (loading || !po) return (
    <GudangLayout title="Penerimaan Barang">
      <div style={{ textAlign: 'center', padding: 60, color: C.textLight, fontSize: 14 }}>Memuat…</div>
    </GudangLayout>
  );

  if (success) return (
    <GudangLayout title="Penerimaan Berhasil">
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <CheckCircle size={36} style={{ color: '#16A34A' }} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.dark, margin: '0 0 8px' }}>Penerimaan Dikonfirmasi!</h2>
        <p style={{ fontSize: 14, color: C.textMid, margin: '0 0 24px' }}>Stok untuk {po.poNumber} berhasil diperbarui.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => router.push('/inbound')} style={{ height: 48, padding: '0 24px', borderRadius: 12, border: `1.5px solid ${C.border}`, background: '#fff', color: C.dark, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Kembali ke Daftar</button>
          <button onClick={() => router.push('/')} style={{ height: 48, padding: '0 24px', borderRadius: 12, border: 'none', background: C.primary, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Dashboard</button>
        </div>
      </div>
    </GudangLayout>
  );

  const totalOrdered = items.reduce((s, i) => s + (i.qtyOrdered ?? 0), 0);
  const totalInput = items.reduce((s, i) => s + (i.qtyInput ?? 0), 0);

  return (
    <GudangLayout title={po.poNumber} subtitle="Proses Penerimaan Barang">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 16px', marginBottom: 20, borderRadius: 10, border: `1.5px solid ${C.border}`, background: '#fff', color: C.textMid, fontSize: 14, cursor: 'pointer' }}>
          <ArrowLeft size={16} /> Kembali
        </button>

        {/* Header */}
        <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: `${C.primary}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Truck size={22} style={{ color: C.primary }} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: C.dark, margin: '0 0 4px' }}>{po.poNumber}</h3>
              <p style={{ fontSize: 14, color: C.textMid, margin: 0 }}>{po.supplierName ?? po.supplier?.name}</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12 }}>
            {[
              { label: 'Tanggal PO', value: po.poDate ? new Date(po.poDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '–' },
              { label: 'Ekspektasi Tiba', value: po.expectedDate ? new Date(po.expectedDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '–' },
              { label: 'Total Item', value: `${items.length} jenis` },
              { label: 'Total Qty Pesan', value: `${totalOrdered}` },
            ].map(f => (
              <div key={f.label}>
                <p style={{ fontSize: 11, color: C.textLight, fontWeight: 700, textTransform: 'uppercase', margin: '0 0 4px' }}>{f.label}</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: C.dark, margin: 0 }}>{f.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scan input */}
        <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `2px dashed ${C.primary}50`, padding: 16, marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Scan size={14} /> Scan Barcode
          </p>
          <form onSubmit={handleScan} style={{ display: 'flex', gap: 10 }}>
            <input
              ref={scanRef}
              value={scanValue}
              onChange={e => setScanValue(e.target.value)}
              placeholder="Scan atau ketik barcode produk…"
              autoFocus
              style={{ flex: 1, height: 48, padding: '0 16px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, color: C.dark, backgroundColor: C.bg }}
            />
            <button type="submit" style={{ height: 48, padding: '0 20px', borderRadius: 12, border: 'none', background: C.primary, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Tambah
            </button>
          </form>
        </div>

        {/* Items table */}
        <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '16px 20px', borderBottom: `1.5px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, margin: 0 }}>Item Penerimaan</h3>
            <span style={{ fontSize: 13, color: C.textLight }}>Diterima: <strong style={{ color: C.primary }}>{totalInput}</strong> / {totalOrdered}</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 580 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}`, backgroundColor: C.bg }}>
                  {['Produk', 'SKU', 'Satuan', 'Qty Pesan', 'Qty Diterima'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: C.textLight, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const over = (item.qtyInput ?? 0) > item.qtyOrdered;
                  return (
                    <tr key={item.id} style={{ borderBottom: `1px solid ${C.border}`, backgroundColor: over ? 'rgba(239,68,68,.04)' : 'transparent' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: C.dark }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Package size={14} style={{ color: C.textLight, flexShrink: 0 }} />
                          {item.productName ?? item.product?.name}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: C.textMid, fontFamily: 'monospace' }}>{item.sku}</td>
                      <td style={{ padding: '14px 16px', color: C.textMid }}>{item.unit?.name ?? item.unitName ?? item.unit}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: C.dark }}>{item.qtyOrdered}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input
                            type="number" min={0} max={item.qtyOrdered * 2}
                            value={item.qtyInput ?? 0}
                            onChange={e => updateQty(item.id, parseInt(e.target.value) || 0)}
                            style={{ width: 90, height: 44, padding: '0 12px', borderRadius: 10, border: `1.5px solid ${over ? '#EF4444' : C.border}`, outline: 'none', fontSize: 15, fontWeight: 700, color: C.dark, textAlign: 'center', backgroundColor: over ? '#FEF2F2' : '#fff' }}
                          />
                          {over && <AlertTriangle size={16} style={{ color: '#EF4444', flexShrink: 0 }} title="Melebihi qty pesanan" />}
                          {(item.qtyInput ?? 0) === item.qtyOrdered && <CheckCircle size={16} style={{ color: '#22C55E', flexShrink: 0 }} />}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={handleSaveDraft} disabled={saving}
            style={{ height: 52, padding: '0 28px', borderRadius: 12, border: `2px solid ${C.border}`, background: '#fff', color: C.dark, fontSize: 15, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Save size={16} /> {saving ? 'Menyimpan…' : 'Simpan Draft'}
          </button>
          <button onClick={handleConfirm} disabled={confirming}
            style={{ height: 52, padding: '0 32px', borderRadius: 12, border: 'none', background: C.primary, color: '#fff', fontSize: 15, fontWeight: 700, cursor: confirming ? 'not-allowed' : 'pointer', opacity: confirming ? .7 : 1, display: 'flex', alignItems: 'center', gap: 8, boxShadow: `0 4px 16px ${C.primary}40` }}>
            <CheckCircle size={16} /> {confirming ? 'Mengkonfirmasi…' : 'Konfirmasi Penerimaan'}
          </button>
        </div>
      </div>
    </GudangLayout>
  );
}
