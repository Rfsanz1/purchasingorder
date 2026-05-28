'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SalesLayout } from '../../../components/SalesLayout';
import api from '../../../lib/api';
import { ArrowLeft, ShoppingCart, Package, User, MapPin, Calendar, CheckCircle, Clock, Truck, XCircle, FileText } from 'lucide-react';

const C = { primary: '#7C3AED', border: '#EDE9FE', textDark: '#1E1B4B', textMid: '#6B7280', textLight: '#9CA3AF' };

const STATUS_CFG: Record<string, { label: string; color: string; icon: any }> = {
  DRAFT:      { label: 'Draft',        color: '#9CA3AF', icon: Clock },
  PENDING:    { label: 'Menunggu',     color: '#F59E0B', icon: Clock },
  CONFIRMED:  { label: 'Dikonfirmasi', color: '#3B82F6', icon: CheckCircle },
  PROCESSING: { label: 'Diproses',     color: '#8B5CF6', icon: Package },
  SHIPPED:    { label: 'Dikirim',      color: '#0891B2', icon: Truck },
  DELIVERED:  { label: 'Terkirim',     color: '#22C55E', icon: CheckCircle },
  INVOICED:   { label: 'Ditagih',      color: '#7C3AED', icon: FileText },
  CANCELLED:  { label: 'Dibatalkan',   color: '#EF4444', icon: XCircle },
};

const TIMELINE = ['DRAFT', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'INVOICED'];

const DEMO = {
  id: 'demo', orderNumber: 'SO-2024-001', status: 'CONFIRMED',
  customerName: 'PT Maju Sejahtera', deliveryAddress: 'Jl. Raya No. 1, Jakarta Selatan',
  salesman: 'Budi Santoso', createdAt: '2024-01-15', deliveryDate: '2024-01-20',
  notes: 'Mohon konfirmasi sebelum pengiriman.',
  items: [
    { id: 1, productName: 'Semen Portland 40kg', qty: 10, unit: 'sak',  price: 52000, discount: 0 },
    { id: 2, productName: 'Besi Beton 10mm 12m',  qty: 5,  unit: 'btg', price: 97000, discount: 5 },
    { id: 3, productName: 'Cat Tembok Putih 5L',  qty: 3,  unit: 'kaleng', price: 58000, discount: 0 },
  ],
  discount: 0, tax: 11, shippingCost: 50000,
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || id === 'demo') { setOrder(DEMO); setLoading(false); return; }
    api.get(`/sales/orders/${id}`)
      .then(r => setOrder(r.data?.data ?? r.data ?? DEMO))
      .catch(() => setOrder({ ...DEMO, id, orderNumber: `SO-${id}` }))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !order) return (
    <SalesLayout title="Detail Order">
      <div style={{ display: 'flex', justifyContent: 'center', padding: 60, color: C.textLight }}>Memuat…</div>
    </SalesLayout>
  );

  const items = order.items ?? order.orderItems ?? [];
  const subtotal = items.reduce((s: number, i: any) => s + (i.price ?? i.unitPrice ?? 0) * (i.qty ?? i.quantity ?? 0) * (1 - (i.discount ?? 0) / 100), 0);
  const discAmt = (order.discount ?? 0) > 0 ? subtotal * (order.discount / 100) : 0;
  const taxAmt = ((order.tax ?? order.taxRate ?? 0) / 100) * (subtotal - discAmt);
  const shipping = order.shippingCost ?? 0;
  const grand = subtotal - discAmt + taxAmt + shipping;

  const statusCfg = STATUS_CFG[order.status] ?? STATUS_CFG.DRAFT;
  const StatusIcon = statusCfg.icon;
  const currentStep = TIMELINE.indexOf(order.status);

  return (
    <SalesLayout title={order.orderNumber ?? 'Detail Order'} subtitle="Sales Order">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Back */}
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', marginBottom: 20, borderRadius: 10, border: `1.5px solid ${C.border}`, background: '#fff', color: C.textMid, fontSize: 13, cursor: 'pointer' }}>
          <ArrowLeft size={14} /> Kembali
        </button>

        {/* Header card */}
        <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, padding: 24, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: `${C.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingCart size={18} style={{ color: C.primary }} />
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: C.textDark, margin: 0 }}>{order.orderNumber ?? order.number}</h2>
                  <p style={{ fontSize: 12, color: C.textLight, margin: 0 }}>Sales Order</p>
                </div>
              </div>
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, padding: '7px 14px', borderRadius: 100, color: statusCfg.color, backgroundColor: `${statusCfg.color}15`, border: `1px solid ${statusCfg.color}30` }}>
              <StatusIcon size={13} /> {statusCfg.label}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16, marginTop: 20 }}>
            {[
              { icon: User, label: 'Pelanggan', value: order.customerName ?? order.customer?.name },
              { icon: MapPin, label: 'Alamat Kirim', value: order.deliveryAddress ?? order.shippingAddress ?? '–' },
              { icon: Calendar, label: 'Tanggal Order', value: order.createdAt ? new Date(order.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '–' },
              { icon: Truck, label: 'Tanggal Kirim', value: order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '–' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <p style={{ fontSize: 11, color: C.textLight, fontWeight: 600, textTransform: 'uppercase', margin: '0 0 4px' }}>{label}</p>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <Icon size={13} style={{ color: C.primary, marginTop: 2, flexShrink: 0 }} />
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.textDark, margin: 0 }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, padding: '20px 24px', marginBottom: 16 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: C.textLight, textTransform: 'uppercase', margin: '0 0 16px' }}>Timeline Status</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {TIMELINE.map((step, idx) => {
              const cfg = STATUS_CFG[step];
              const done = idx <= currentStep;
              const active = idx === currentStep;
              const Icon = cfg.icon;
              return (
                <div key={step} style={{ display: 'flex', alignItems: 'center', flex: idx < TIMELINE.length - 1 ? 1 : undefined }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: done ? (active ? C.primary : '#22C55E') : '#F3F4F6', border: active ? `2px solid ${C.primary}` : 'none', transition: 'all .2s' }}>
                      <Icon size={14} style={{ color: done ? '#fff' : C.textLight }} />
                    </div>
                    <p style={{ fontSize: 10, fontWeight: active ? 700 : 400, color: active ? C.primary : done ? '#22C55E' : C.textLight, margin: 0, whiteSpace: 'nowrap' }}>{cfg.label}</p>
                  </div>
                  {idx < TIMELINE.length - 1 && (
                    <div style={{ flex: 1, height: 2, backgroundColor: idx < currentStep ? '#22C55E' : C.border, margin: '0 4px', marginTop: -20 }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Items table */}
        <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '16px 20px', borderBottom: `1.5px solid ${C.border}` }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.textDark, margin: 0 }}>Item Pesanan</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {['Produk', 'Qty', 'Satuan', 'Harga', 'Diskon', 'Subtotal'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item: any, i: number) => {
                const price = item.price ?? item.unitPrice ?? 0;
                const qty = item.qty ?? item.quantity ?? 0;
                const disc = item.discount ?? 0;
                const sub = price * qty * (1 - disc / 100);
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: C.textDark }}>{item.productName ?? item.product?.name ?? `Item ${i + 1}`}</td>
                    <td style={{ padding: '12px 16px', color: C.textMid }}>{qty}</td>
                    <td style={{ padding: '12px 16px', color: C.textMid }}>{item.unit?.name ?? item.unitName ?? 'pcs'}</td>
                    <td style={{ padding: '12px 16px', color: C.textMid }}>Rp {price.toLocaleString('id-ID')}</td>
                    <td style={{ padding: '12px 16px', color: disc > 0 ? '#F59E0B' : C.textLight }}>{disc > 0 ? `${disc}%` : '–'}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: C.textDark }}>Rp {sub.toLocaleString('id-ID')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: 280 }}>
              {[
                { label: 'Subtotal', value: subtotal },
                ...(discAmt > 0 ? [{ label: `Diskon (${order.discount}%)`, value: -discAmt }] : []),
                ...(taxAmt > 0 ? [{ label: `Pajak (${order.tax ?? order.taxRate}%)`, value: taxAmt }] : []),
                ...(shipping > 0 ? [{ label: 'Ongkir', value: shipping }] : []),
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: C.textMid }}>{row.label}</span>
                  <span style={{ fontSize: 13, color: row.value < 0 ? '#22C55E' : C.textDark }}>
                    {row.value < 0 ? `- Rp ${Math.abs(row.value).toLocaleString('id-ID')}` : `Rp ${row.value.toLocaleString('id-ID')}`}
                  </span>
                </div>
              ))}
              <div style={{ borderTop: `2px solid ${C.border}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.textDark }}>Grand Total</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: C.primary }}>Rp {grand.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes + actions */}
        {order.notes && (
          <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.textLight, textTransform: 'uppercase', margin: '0 0 8px' }}>Catatan</h3>
            <p style={{ fontSize: 13, color: C.textDark, margin: 0 }}>{order.notes}</p>
          </div>
        )}

        {/* Action buttons by status */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {order.status === 'DRAFT' && (
            <button style={{ padding: '10px 20px', borderRadius: 12, border: 'none', background: C.primary, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Konfirmasi Order</button>
          )}
          {order.status === 'CONFIRMED' && (
            <button style={{ padding: '10px 20px', borderRadius: 12, border: 'none', background: '#22C55E', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Proses Order</button>
          )}
          {['DRAFT', 'PENDING', 'CONFIRMED'].includes(order.status) && (
            <button style={{ padding: '10px 20px', borderRadius: 12, border: `1.5px solid #EF4444`, background: '#fff', color: '#EF4444', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Batalkan</button>
          )}
          <button onClick={() => router.push(`/orders/${id}/print`)} style={{ padding: '10px 20px', borderRadius: 12, border: `1.5px solid ${C.border}`, background: '#fff', color: C.textMid, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cetak SO</button>
        </div>
      </div>
    </SalesLayout>
  );
}
