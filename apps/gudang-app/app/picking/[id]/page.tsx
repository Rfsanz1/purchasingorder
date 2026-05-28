'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GudangLayout } from '../../../components/GudangLayout';
import api from '../../../lib/api';
import { ArrowLeft, CheckCircle, Package, MapPin, Clock, Zap } from 'lucide-react';

const C = { primary: '#D97706', dark: '#78350F', border: '#FEF3C7', textMid: '#6B7280', textLight: '#9CA3AF', bg: '#FFFBEB' };

const DEMO = {
  id: 'pk1', pickingNumber: 'PK-2024-001', soNumber: 'SO-2024-001',
  customerName: 'PT Maju Sejahtera', status: 'PENDING', priority: 'HIGH',
  dueTime: '10:00', assignedTo: 'Staff A',
  items: [
    { id: 'pi1', productName: 'Semen Portland 40kg', sku: 'SEM-001', qty: 10, unit: 'sak',    rack: 'A-01-03', done: false },
    { id: 'pi2', productName: 'Besi Beton 10mm 12m', sku: 'BSI-001', qty: 5,  unit: 'btg',   rack: 'B-02-01', done: false },
    { id: 'pi3', productName: 'Cat Tembok Putih 5L', sku: 'CAT-001', qty: 3,  unit: 'kaleng', rack: 'C-01-05', done: false },
    { id: 'pi4', productName: 'Pipa PVC 4" x 4m',   sku: 'PVC-001', qty: 2,  unit: 'btg',   rack: 'B-03-02', done: false },
    { id: 'pi5', productName: 'Keramik Lantai 60x60', sku: 'KRM-001', qty: 20, unit: 'pcs',  rack: 'D-01-01', done: false },
  ],
};

export default function PickingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [picking, setPicking] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    api.get(`/inventory/picking-orders/${id}`)
      .then(r => {
        const data = r.data?.data ?? r.data ?? DEMO;
        setPicking(data);
        setItems((data.items ?? DEMO.items).map((i: any) => ({ ...i, done: i.done ?? false })));
      })
      .catch(() => {
        setPicking(DEMO);
        setItems(DEMO.items.map(i => ({ ...i, done: false })));
      })
      .finally(() => setLoading(false));
  }, [id]);

  const toggleItem = async (itemId: string) => {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, done: !i.done } : i));
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    try {
      await api.patch(`/inventory/picking-orders/${id}/items/${itemId}`, { done: !item.done });
    } catch {}
  };

  const handleComplete = async () => {
    const allDone = items.every(i => i.done);
    if (!allDone) {
      const proceed = window.confirm(`Masih ada ${items.filter(i => !i.done).length} item belum dicentang. Selesaikan tetap?`);
      if (!proceed) return;
    }
    setCompleting(true);
    try {
      await api.patch(`/inventory/picking-orders/${id}`, { status: 'COMPLETED' });
      setCompleted(true);
    } catch { setCompleted(true); }
    finally { setCompleting(false); }
  };

  if (loading || !picking) return (
    <GudangLayout title="Detail Picking">
      <div style={{ textAlign: 'center', padding: 60, color: C.textLight, fontSize: 14 }}>Memuat…</div>
    </GudangLayout>
  );

  if (completed) return (
    <GudangLayout title="Picking Selesai">
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle size={40} style={{ color: '#16A34A' }} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: C.dark, margin: '0 0 8px' }}>Picking Selesai!</h2>
        <p style={{ fontSize: 15, color: C.textMid, margin: '0 0 28px' }}>{picking.pickingNumber} sudah diselesaikan.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => router.push('/picking')} style={{ height: 52, padding: '0 28px', borderRadius: 12, border: `1.5px solid ${C.border}`, background: '#fff', color: C.dark, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Daftar Picking</button>
          <button onClick={() => router.push('/outbound')} style={{ height: 52, padding: '0 28px', borderRadius: 12, border: 'none', background: C.primary, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Proses Pengiriman</button>
        </div>
      </div>
    </GudangLayout>
  );

  const doneCount = items.filter(i => i.done).length;
  const totalCount = items.length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const PRIORITY_COLOR: Record<string, string> = { URGENT: '#EF4444', HIGH: '#F59E0B', NORMAL: '#6B7280' };

  return (
    <GudangLayout title={picking.pickingNumber} subtitle="Detail Picking Order">
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 16px', marginBottom: 20, borderRadius: 10, border: `1.5px solid ${C.border}`, background: '#fff', color: C.textMid, fontSize: 14, cursor: 'pointer' }}>
          <ArrowLeft size={16} /> Kembali
        </button>

        {/* Header */}
        <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: C.dark, margin: '0 0 4px' }}>{picking.pickingNumber}</h3>
              <p style={{ fontSize: 14, color: C.textMid, margin: 0 }}>SO: <strong>{picking.soNumber}</strong> — {picking.customerName}</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {picking.priority && (
                <span style={{ fontSize: 12, fontWeight: 800, padding: '4px 12px', borderRadius: 100, color: '#fff', backgroundColor: PRIORITY_COLOR[picking.priority] ?? '#9CA3AF' }}>
                  {picking.priority}
                </span>
              )}
              {picking.dueTime && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, padding: '4px 12px', borderRadius: 100, color: '#B45309', backgroundColor: C.bg, border: `1px solid ${C.border}` }}>
                  <Clock size={12} /> Batas: {picking.dueTime}
                </span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>Progress Picking</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: pct === 100 ? '#16A34A' : C.primary }}>{doneCount} / {totalCount} item ({pct}%)</span>
            </div>
            <div style={{ height: 10, borderRadius: 100, backgroundColor: C.border, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? 'linear-gradient(90deg,#22C55E,#16A34A)' : `linear-gradient(90deg,${C.primary},#FBBF24)`, borderRadius: 100, transition: 'width .4s ease' }} />
            </div>
          </div>
        </div>

        {/* Item checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {items.map((item, idx) => (
            <button key={item.id} onClick={() => toggleItem(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 14,
                border: `2px solid ${item.done ? '#22C55E' : C.border}`,
                backgroundColor: item.done ? '#F0FDF4' : '#fff',
                cursor: 'pointer', textAlign: 'left', transition: 'all .2s',
                boxShadow: item.done ? '0 2px 8px rgba(34,197,94,.12)' : '0 1px 4px rgba(0,0,0,.04)',
              }}
              onMouseEnter={e => { if (!item.done) (e.currentTarget as HTMLButtonElement).style.borderColor = C.primary; }}
              onMouseLeave={e => { if (!item.done) (e.currentTarget as HTMLButtonElement).style.borderColor = C.border; }}
            >
              {/* Checkbox */}
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: item.done ? '#22C55E' : C.bg,
                border: `2px solid ${item.done ? '#22C55E' : C.border}`,
                transition: 'all .2s',
              }}>
                {item.done
                  ? <CheckCircle size={20} style={{ color: '#fff' }} />
                  : <span style={{ fontSize: 13, fontWeight: 700, color: C.textLight }}>{idx + 1}</span>
                }
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: item.done ? '#15803D' : C.dark, margin: '0 0 4px', textDecoration: item.done ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.productName ?? item.product?.name}</p>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: C.textLight, fontFamily: 'monospace' }}>{item.sku}</span>
                  {item.rack && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: C.primary }}>
                      <MapPin size={11} /> {item.rack}
                    </span>
                  )}
                </div>
              </div>

              {/* Qty */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: 22, fontWeight: 800, color: item.done ? '#16A34A' : C.dark, margin: '0 0 2px', lineHeight: 1 }}>{item.qty ?? item.quantity}</p>
                <p style={{ fontSize: 12, color: C.textLight, margin: 0 }}>{item.unit?.name ?? item.unitName ?? item.unit}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Complete button */}
        <button onClick={handleComplete} disabled={completing}
          style={{
            width: '100%', height: 60, borderRadius: 16, border: 'none',
            background: doneCount === totalCount ? 'linear-gradient(135deg,#22C55E,#16A34A)' : `linear-gradient(135deg,${C.primary},#B45309)`,
            color: '#fff', fontSize: 17, fontWeight: 800, cursor: completing ? 'not-allowed' : 'pointer',
            opacity: completing ? .7 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: doneCount === totalCount ? '0 6px 24px rgba(34,197,94,.4)' : `0 6px 24px ${C.primary}40`,
            transition: 'all .3s',
          }}>
          {completing ? 'Menyelesaikan…' : doneCount === totalCount ? <><CheckCircle size={20} /> Selesaikan Picking</> : <><Zap size={20} /> Selesaikan ({doneCount}/{totalCount} selesai)</>}
        </button>
      </div>
    </GudangLayout>
  );
}
