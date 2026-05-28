'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SalesLayout } from '../../../components/SalesLayout';
import api from '../../../lib/api';
import { ArrowLeft, User, Phone, MapPin, Mail, ShoppingCart, FileText, CreditCard, Star } from 'lucide-react';

const C = { primary: '#7C3AED', border: '#EDE9FE', textDark: '#1E1B4B', textMid: '#6B7280', textLight: '#9CA3AF' };

const DEMO_CUSTOMER = {
  id: 'c1', name: 'PT Maju Sejahtera', email: 'purchasing@majusejahtera.co.id',
  phone: '021-555-1234', city: 'Jakarta Selatan', address: 'Jl. Raya Pasar Minggu No. 100, Jakarta Selatan',
  taxNumber: '01.234.567.8-091.000', creditLimit: 50000000, paymentTerms: 'Net 30',
  notes: 'Pelanggan prioritas, biasanya order di awal bulan.',
  totalTransaction: 48500000, orderCount: 12, lastOrderDate: '2024-01-15',
  orders: [
    { id: 'o1', number: 'SO-2024-001', total: 3250000, status: 'DELIVERED', createdAt: '2024-01-15' },
    { id: 'o2', number: 'SO-2023-089', total: 8750000, status: 'INVOICED',  createdAt: '2023-12-20' },
    { id: 'o3', number: 'SO-2023-076', total: 5100000, status: 'DELIVERED', createdAt: '2023-11-05' },
  ],
  invoices: [
    { id: 'i1', number: 'INV-2024-001', total: 3250000, amountDue: 0,       status: 'paid',   dueDate: '2024-02-15' },
    { id: 'i2', number: 'INV-2023-089', total: 8750000, amountDue: 8750000, status: 'unpaid', dueDate: '2024-01-20' },
  ],
  quotations: [
    { id: 'q1', number: 'QUO-2024-001', total: 2100000, status: 'sent', createdAt: '2024-01-10' },
  ],
};

type TabKey = 'orders' | 'quotations' | 'invoices';

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    DRAFT: '#9CA3AF', CONFIRMED: '#3B82F6', DELIVERED: '#22C55E', INVOICED: '#7C3AED',
    CANCELLED: '#EF4444', paid: '#22C55E', unpaid: '#EF4444', partial: '#F59E0B',
    sent: '#3B82F6', draft: '#9CA3AF', confirmed: '#22C55E', expired: '#EF4444',
  };
  const color = colorMap[status] ?? '#9CA3AF';
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 100, color, backgroundColor: `${color}18`, border: `1px solid ${color}30` }}>
      {status}
    </span>
  );
}

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('orders');

  useEffect(() => {
    api.get(`/customers/${id}`)
      .then(r => setCustomer(r.data?.data ?? r.data ?? DEMO_CUSTOMER))
      .catch(() => setCustomer({ ...DEMO_CUSTOMER, id }))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !customer) return (
    <SalesLayout title="Detail Pelanggan">
      <div style={{ display: 'flex', justifyContent: 'center', padding: 60, color: C.textLight }}>Memuat…</div>
    </SalesLayout>
  );

  const formatRp = (v: number) => v >= 1e9 ? `Rp ${(v / 1e9).toFixed(1)} M` : v >= 1e6 ? `Rp ${(v / 1e6).toFixed(1)} Jt` : `Rp ${Number(v).toLocaleString('id-ID')}`;
  const formatDate = (v: string) => v ? new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '–';

  const TABS: { key: TabKey; label: string; icon: any; count: number }[] = [
    { key: 'orders',     label: 'Sales Order', icon: ShoppingCart, count: customer.orders?.length ?? 0 },
    { key: 'quotations', label: 'Quotation',   icon: FileText,     count: customer.quotations?.length ?? 0 },
    { key: 'invoices',   label: 'Invoice',     icon: CreditCard,   count: customer.invoices?.length ?? 0 },
  ];

  return (
    <SalesLayout title={customer.name} subtitle="Detail Pelanggan">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', marginBottom: 20, borderRadius: 10, border: `1.5px solid ${C.border}`, background: '#fff', color: C.textMid, fontSize: 13, cursor: 'pointer' }}>
          <ArrowLeft size={14} /> Kembali
        </button>

        {/* Profile card */}
        <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, padding: 24, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: `linear-gradient(135deg, ${C.primary}, #A78BFA)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 24, flexShrink: 0 }}>
              {customer.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: C.textDark, margin: '0 0 8px' }}>{customer.name}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
                {[
                  { icon: Mail,   label: customer.email ?? '–' },
                  { icon: Phone,  label: customer.phone ?? '–' },
                  { icon: MapPin, label: customer.city ?? '–' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon size={13} style={{ color: C.textLight }} />
                    <span style={{ fontSize: 12.5, color: C.textMid }}>{label}</span>
                  </div>
                ))}
              </div>
              {customer.address && (
                <p style={{ fontSize: 12.5, color: C.textLight, margin: '8px 0 0' }}>{customer.address}</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12, marginTop: 20, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
            {[
              { label: 'Total Transaksi',  value: formatRp(customer.totalTransaction ?? 0), color: C.primary },
              { label: 'Jumlah Order',     value: `${customer.orderCount ?? 0} order`,       color: '#22C55E' },
              { label: 'Order Terakhir',   value: formatDate(customer.lastOrderDate),         color: '#F59E0B' },
              { label: 'Limit Kredit',     value: formatRp(customer.creditLimit ?? 0),        color: '#3B82F6' },
            ].map(s => (
              <div key={s.label}>
                <p style={{ fontSize: 10, color: C.textLight, fontWeight: 600, textTransform: 'uppercase', margin: '0 0 4px' }}>{s.label}</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {customer.notes && (
          <div style={{ backgroundColor: '#FFFBEB', borderRadius: 12, border: '1.5px solid rgba(245,158,11,.2)', padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 10 }}>
            <Star size={14} style={{ color: '#F59E0B', flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 13, color: '#92400E', margin: 0 }}>{customer.notes}</p>
          </div>
        )}

        {/* Tabs */}
        <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: `1.5px solid ${C.border}`, padding: '0 16px' }}>
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: activeTab === t.key ? 700 : 500, color: activeTab === t.key ? C.primary : C.textMid, borderBottom: activeTab === t.key ? `2px solid ${C.primary}` : '2px solid transparent', marginBottom: -1.5, transition: 'all .15s' }}>
                  <Icon size={14} /> {t.label}
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 6px', borderRadius: 100, backgroundColor: activeTab === t.key ? `${C.primary}18` : '#F3F4F6', color: activeTab === t.key ? C.primary : C.textLight }}>
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {activeTab === 'orders' && ['No. Order', 'Total', 'Status', 'Tanggal'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                  {activeTab === 'quotations' && ['No. Quotation', 'Total', 'Status', 'Tanggal'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                  {activeTab === 'invoices' && ['No. Invoice', 'Total', 'Sisa Bayar', 'Status', 'Jatuh Tempo'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(customer[activeTab] ?? []).map((r: any) => (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}` }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F5F3FF')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                    {activeTab === 'invoices' ? (
                      <>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: C.primary }}>{r.number}</td>
                        <td style={{ padding: '12px 16px', color: C.textDark }}>{formatRp(r.total ?? r.totalAmount ?? 0)}</td>
                        <td style={{ padding: '12px 16px', color: (r.amountDue ?? 0) > 0 ? '#EF4444' : '#22C55E', fontWeight: 700 }}>{formatRp(r.amountDue ?? 0)}</td>
                        <td style={{ padding: '12px 16px' }}><StatusBadge status={r.status} /></td>
                        <td style={{ padding: '12px 16px', color: C.textMid }}>{formatDate(r.dueDate)}</td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: C.primary }}>{r.number}</td>
                        <td style={{ padding: '12px 16px', color: C.textDark }}>{formatRp(r.total ?? r.totalAmount ?? 0)}</td>
                        <td style={{ padding: '12px 16px' }}><StatusBadge status={r.status} /></td>
                        <td style={{ padding: '12px 16px', color: C.textMid }}>{formatDate(r.createdAt)}</td>
                      </>
                    )}
                  </tr>
                ))}
                {!(customer[activeTab] ?? []).length && (
                  <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: C.textLight }}>Belum ada data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SalesLayout>
  );
}
