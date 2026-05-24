'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import AppShell, { NavItem } from '../../components/layout/AppShell';
import { FileText, BarChart2, DollarSign, Clock, CheckCircle, XCircle, Settings, Plus, Search } from 'lucide-react';

const NAV: NavItem[] = [
  { label: 'Dashboard',    href: '/invoice',             icon: BarChart2 },
  { label: 'Invoice',      href: '/invoice/list',        icon: FileText, badge: 8,
    children: [
      { label: 'Semua',       href: '/invoice/list' },
      { label: 'Draft',       href: '/invoice/list?status=draft' },
      { label: 'Dikirim',     href: '/invoice/list?status=posted' },
      { label: 'Lunas',       href: '/invoice/list?status=paid' },
      { label: 'Jatuh Tempo', href: '/invoice/list?status=overdue' },
    ],
  },
  { label: 'Kredit Nota',  href: '/invoice/credit-notes', icon: DollarSign },
  { label: 'Pembayaran',   href: '/invoice/payments',     icon: CheckCircle },
  { label: 'Pengaturan',   href: '/invoice/settings',     icon: Settings },
];

const STATS = [
  { label: 'Draft',        value: '5',         sub: 'Belum dikirim',     color: '#A5A3AE', bg: 'rgba(165,163,174,.12)', icon: FileText },
  { label: 'Dikirim',      value: '18',        sub: 'Menunggu bayar',    color: '#2196F3', bg: 'rgba(33,150,243,.1)',   icon: Clock },
  { label: 'Lunas',        value: 'Rp 186 Jt', sub: 'Bulan ini',        color: '#4CAF50', bg: 'rgba(76,175,80,.1)',    icon: CheckCircle },
  { label: 'Jatuh Tempo',  value: '12',        sub: 'Rp 34 Jt overdue', color: '#EA5455', bg: 'rgba(234,84,85,.1)',    icon: XCircle },
];

const INVOICES = [
  { no: 'INV-2026-0892', customer: 'PT Maju Jaya',       due: '31 Mei 2026', amount: 'Rp 12.400.000', status: 'posted' },
  { no: 'INV-2026-0891', customer: 'CV Berkah Abadi',     due: '28 Mei 2026', amount: 'Rp 6.750.000',  status: 'overdue' },
  { no: 'INV-2026-0890', customer: 'Toko Sumber Rejeki',  due: '25 Mei 2026', amount: 'Rp 3.200.000',  status: 'paid' },
  { no: 'INV-2026-0889', customer: 'UD Karya Mandiri',    due: '20 Jun 2026', amount: 'Rp 9.850.000',  status: 'draft' },
  { no: 'INV-2026-0888', customer: 'PT Global Niaga',     due: '15 Jun 2026', amount: 'Rp 21.000.000', status: 'posted' },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  draft:   { label: 'Draft',       color: '#A5A3AE', bg: 'rgba(165,163,174,.12)', icon: FileText },
  posted:  { label: 'Dikirim',     color: '#2196F3', bg: 'rgba(33,150,243,.1)',   icon: Clock },
  paid:    { label: 'Lunas',       color: '#4CAF50', bg: 'rgba(76,175,80,.1)',    icon: CheckCircle },
  overdue: { label: 'Jatuh Tempo', color: '#EA5455', bg: 'rgba(234,84,85,.1)',    icon: XCircle },
};

export default function InvoiceDashboard() {
  const { token } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;

  return (
    <AppShell appName="Invoice" appColor="#1976D2" appGradient="from-blue-500 to-blue-700" appIcon={FileText} navItems={NAV} activeHref="/invoice">
      <div className="p-6 space-y-6 max-w-6xl mx-auto">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#433C50' }}>Dashboard Invoice</h1>
            <p className="text-sm mt-0.5" style={{ color: '#A5A3AE' }}>Kelola tagihan dan status pembayaran</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#1976D2' }}>
            <Plus className="h-4 w-4" /> Invoice Baru
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium" style={{ color: '#A5A3AE' }}>{s.label}</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: '#433C50' }}>{s.value}</p>
                  <p className="text-xs mt-1" style={{ color: '#A5A3AE' }}>{s.sub}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: s.bg }}>
                  <s.icon className="h-5 w-5" style={{ color: s.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
            <h2 className="text-sm font-bold" style={{ color: '#433C50' }}>Daftar Invoice</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#B0AAB9' }} />
              <input className="rounded-lg pl-8 pr-3 py-1.5 text-xs" style={{ border: '1px solid #EDE8F5', color: '#433C50', outline: 'none', width: 180 }} placeholder="Cari invoice..." />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #EDE8F5' }}>
                  {['No. Invoice', 'Pelanggan', 'Jatuh Tempo', 'Jumlah', 'Status'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#A5A3AE' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((inv, i) => {
                  const st = STATUS_MAP[inv.status];
                  return (
                    <tr key={inv.no} style={{ borderBottom: i < INVOICES.length - 1 ? '1px solid #F5F2FB' : 'none' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FDFCFF'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <td className="px-6 py-3.5 text-sm font-semibold" style={{ color: '#1976D2' }}>{inv.no}</td>
                      <td className="px-6 py-3.5 text-sm" style={{ color: '#433C50' }}>{inv.customer}</td>
                      <td className="px-6 py-3.5 text-sm" style={{ color: '#A5A3AE' }}>{inv.due}</td>
                      <td className="px-6 py-3.5 text-sm font-semibold" style={{ color: '#433C50' }}>{inv.amount}</td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ color: st.color, backgroundColor: st.bg }}>
                          <st.icon className="h-3 w-3" />{st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
