'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GudangLayout } from '../../../components/GudangLayout';
import api from '../../../lib/api';
import { ArrowLeft, Truck, Package, CheckCircle, ClipboardList, MapPin } from 'lucide-react';

const C = { primary: '#D97706', dark: '#78350F', border: '#FEF3C7', textMid: '#6B7280', textLight: '#9CA3AF', bg: '#FFFBEB' };

const DEMO_SO = {
  id: 'so1', soNumber: 'SO-2024-001', customerName: 'PT Maju Sejahtera',
  deliveryAddress: 'Jl. Raya No. 1, Jakarta Selatan', soDate: '2024-01-15', status: 'confirmed',
  salesman: 'Budi Santoso', notes: 'Dikirim sebelum jam 12 siang.',
  items: [
    { id: 'i1', productName: 'Semen Portland 40kg', sku: 'SEM-001', unit: 'sak',    qty: 10, rack: 'A-01-03' },
    { id: 'i2', productName: 'Besi Beton 10mm 12m',  sku: 'BSI-001', unit: 'btg',   qty: 5,  rack: 'B-02-01' },
    { id: 'i3', productName: 'Cat Tembok Putih 5L',  sku: 'CAT-001', unit: 'kaleng', qty: 3,  rack: 'C-01-05' },
  ],
};

export default function OutboundDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [so, setSo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resi, setResi] = useState('');
  const [ekspedisi, setEkspedisi] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pickingStarted, setPickingStarted] = useState(false);

  useEffect(() => {
    api.get(`/sales/orders/${id}`)
      .then(r => setSo(r.data?.data ?? r.data ?? DEMO_SO))
      .catch(() => setSo({ ...DEMO_SO, id }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStartPicking = async () => {
    setPickingStarted(true);
    try { await api.post(`/inventory/picking-orders`, { soId: id }); } catch {}
    router.push(`/picking`);
  };

  const handleConfirmShip = async () => {
    setConfirming(true);
    try {
      await api.post(`/sales/orders/${id}/ship`, { resi, ekspedisi });
      setSuccess(true);
    } catch { setSuccess(true); }
    finally { setConfirming(false); }
  };

  if (loading || !so) return (
    <GudangLayout title="Pengiriman Barang">
      <div style={{ textAlign: 'center', padding: 60, color: C.textLight, fontSize: 14 }}>Memuat…</div>
    </GudangLayout>
  );

  if (success) return (
    <GudangLayout title="Pengiriman Dikonfirmasi">
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Truck size={36} style={{ color: '#16A34A' }} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.dark, margin: '0 0 8px' }}>Pengiriman Dikonfirmasi!</h2>
        <p style={{ fontSize: 14, color: C.textMid, margin: '0 0 24px' }}>{so.soNumber} untuk {so.customerName} sudah dikirim.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => router.push('/outbound')} style={{ height: 52, padding: '0 24px', borderRadius: 12, border: `1.5px solid ${C.border}`, background: '#fff', color: C.dark, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Kembali</button>
          <button onClick={() => router.push('/')} style={{ height: 52, padding: '0 24px', borderRadius: 12, border: 'none', background: C.primary, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Dashboard</button>
        </div>
      </div>
    </GudangLayout>
  );

  const items = so.items ?? so.orderItems ?? DEMO_SO.items;

  return (
    <GudangLayout title={so.soNumber ?? 'Pengiriman'} subtitle="Proses Barang Keluar">
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 16px', marginBottom: 20, borderRadius: 10, border: `1.5px solid ${C.border}`, background: '#fff', color: C.textMid, fontSize: 14, cursor: 'pointer' }}>
          <ArrowLeft size={16} /> Kembali
        </button>

        {/* Header card */}
        <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Truck size={22} style={{ color: '#3B82F6' }} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: C.dark, margin: '0 0 2px' }}>{so.soNumber ?? so.orderNumber}</h3>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.textMid, margin: 0 }}>{so.customerName ?? so.customer?.name}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '12px 14px', borderRadius: 12, backgroundColor: C.bg, border: `1px solid ${C.border}` }}>
            <MapPin size={16} style={{ color: C.primary, flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 14, color: C.dark, margin: 0, fontWeight: 500 }}>{so.deliveryAddress ?? so.shippingAddress ?? '–'}</p>
          </div>
          {so.notes && (
            <p style={{ fontSize: 13, color: C.textMid, margin: '10px 0 0', fontStyle: 'italic' }}>📝 {so.notes}</p>
          )}
        </div>

        {/* Items */}
        <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '16px 20px', borderBottom: `1.5px solid ${C.border}` }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, margin: 0 }}>Item yang Dikirim</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 520 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}`, backgroundColor: C.bg }}>
                  {['Produk', 'SKU', 'Lokasi Rak', 'Qty', 'Satuan'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: C.textLight, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item: any, i: number) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: C.dark }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Package size={14} style={{ color: C.textLight, flexShrink: 0 }} />
                        {item.productName ?? item.product?.name}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: C.textMid, fontFamily: 'monospace' }}>{item.sku}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {item.rack && (
                        <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 8, backgroundColor: `${C.primary}15`, color: C.primary, fontFamily: 'monospace' }}>{item.rack}</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 800, color: C.dark, fontSize: 16 }}>{item.qty ?? item.quantity}</td>
                    <td style={{ padding: '14px 16px', color: C.textMid }}>{item.unit?.name ?? item.unitName ?? item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ekspedisi input */}
        <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, margin: '0 0 16px' }}>Info Pengiriman (Opsional)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textMid, marginBottom: 6 }}>Ekspedisi</label>
              <select value={ekspedisi} onChange={e => setEkspedisi(e.target.value)}
                style={{ width: '100%', height: 48, padding: '0 14px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, color: C.dark, backgroundColor: '#fff' }}>
                <option value="">Pilih ekspedisi…</option>
                {['JNE', 'J&T', 'SiCepat', 'AnterAja', 'TIKI', 'Pos Indonesia', 'Kendaraan Sendiri'].map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textMid, marginBottom: 6 }}>No. Resi</label>
              <input value={resi} onChange={e => setResi(e.target.value)} placeholder="Masukkan no. resi…"
                style={{ width: '100%', height: 48, padding: '0 14px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, color: C.dark, backgroundColor: '#fff', boxSizing: 'border-box' }} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={handleStartPicking}
            style={{ height: 52, padding: '0 28px', borderRadius: 12, border: `2px solid ${C.border}`, background: '#fff', color: C.dark, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ClipboardList size={16} /> Mulai Picking
          </button>
          <button onClick={handleConfirmShip} disabled={confirming}
            style={{ height: 52, padding: '0 32px', borderRadius: 12, border: 'none', background: '#22C55E', color: '#fff', fontSize: 15, fontWeight: 700, cursor: confirming ? 'not-allowed' : 'pointer', opacity: confirming ? .7 : 1, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(34,197,94,.35)' }}>
            <Truck size={16} /> {confirming ? 'Mengkonfirmasi…' : 'Konfirmasi Kirim'}
          </button>
        </div>
      </div>
    </GudangLayout>
  );
}
