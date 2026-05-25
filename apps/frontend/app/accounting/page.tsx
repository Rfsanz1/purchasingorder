'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import AppShell, { NavItem } from '../../components/layout/AppShell';
import {
  DollarSign, BarChart2, FileText, BookOpen, Landmark, Receipt,
  TrendingUp, TrendingDown, Settings, Plus, ArrowUpRight, CheckCircle, Clock,
} from 'lucide-react';

const NAV: NavItem[] = [
  { label: 'Dashboard',    href: '/accounting',              icon: BarChart2 },
  { label: 'Invoice',      href: '/invoice',                 icon: FileText, badge: 8 },
  { label: 'Jurnal',       href: '/finance/journal-entries', icon: BookOpen,
    children: [
      { label: 'Semua Jurnal', href: '/finance/journal-entries' },
      { label: 'Jurnal Umum',  href: '/finance/journal-entries?type=general' },
      { label: 'Penjualan',    href: '/finance/journal-entries?type=sales' },
      { label: 'Pembelian',    href: '/finance/journal-entries?type=purchase' },
    ],
  },
  { label: 'Bagan Akun',   href: '/finance/coa',            icon: BookOpen },
  { label: 'Rekening Bank', href: '/finance/bank-accounts', icon: Landmark },
  { label: 'Pengeluaran',  href: '/finance/expenses',        icon: Receipt },
  { label: 'Pajak',        href: '/finance',                 icon: FileText },
  { label: 'Laporan',      href: '/finance/reports',         icon: TrendingUp },
  { label: 'Pengaturan',   href: '/accounting/settings',     icon: Settings },
];

const STATS = [
  { label: 'Pendapatan Bulan Ini',  value: 'Rp 348 Jt', sub: '+11.2% vs bulan lalu', color: '#4CAF50', bg: 'rgba(76,175,80,.1)',   icon: TrendingUp },
  { label: 'Pengeluaran Bulan Ini', value: 'Rp 198 Jt', sub: '-3.4% vs bulan lalu',  color: '#EA5455', bg: 'rgba(234,84,85,.1)',   icon: TrendingDown },
  { label: 'Laba Bersih',           value: 'Rp 150 Jt', sub: 'Margin 43.1%',          color: '#2196F3', bg: 'rgba(33,150,243,.1)', icon: DollarSign },
  { label: 'Invoice Jatuh Tempo',   value: '12',         sub: 'Rp 34 Jt overdue',     color: '#FF9800', bg: 'rgba(255,152,0,.1)',  icon: FileText },
];

const RECENT_TX = [
  { ref: 'JRN-0892', desc: 'Penjualan SO-0128 – PT Maju Jaya',      debit: 'Rp 12.400.000', credit: '',             date: '24 Mei', type: 'income' },
  { ref: 'JRN-0891', desc: 'Pembelian PO-0056 – Supplier ABC',       debit: '',              credit: 'Rp 7.800.000', date: '24 Mei', type: 'expense' },
  { ref: 'JRN-0890', desc: 'Penerimaan Bank – Transfer CV Berkah',   debit: 'Rp 6.750.000',  credit: '',             date: '23 Mei', type: 'income' },
  { ref: 'JRN-0889', desc: 'Biaya Operasional – Listrik & Air',      debit: '',              credit: 'Rp 1.200.000', date: '23 Mei', type: 'expense' },
  { ref: 'JRN-0888', desc: 'Penjualan SO-0126 – Toko Sumber Rejeki', debit: 'Rp 3.200.000',  credit: '',             date: '22 Mei', type: 'income' },
];

const CASHFLOW = [
  { month: 'Jan', in: 280, out: 190 },
  { month: 'Feb', in: 310, out: 205 },
  { month: 'Mar', in: 295, out: 198 },
  { month: 'Apr', in: 330, out: 212 },
  { month: 'Mei', in: 348, out: 198 },
];
const MAX_VAL = Math.max(...CASHFLOW.flatMap((c) => [c.in, c.out]));

const BANK_ACCOUNTS = [
  { name: 'BCA - Operasional',    no: '1234-5678-90', balance: 'Rp 284.600.000', color: '#1565C0' },
  { name: 'Mandiri - Gaji',       no: '8765-4321-00', balance: 'Rp 121.400.000', color: '#00695C' },
  { name: 'BNI - Investasi',      no: '5678-1234-44', balance: 'Rp 500.000.000', color: '#4527A0' },
];

const EXPENSES = [
  { category: 'Gaji & Tunjangan',   amount: 'Rp 412 Jt', pct: 68, color: '#E91E63' },
  { category: 'Operasional Kantor', amount: 'Rp 38 Jt',  pct: 19, color: '#FF9800' },
  { category: 'Marketing',          amount: 'Rp 24 Jt',  pct: 12, color: '#2196F3' },
  { category: 'Utilities',          amount: 'Rp 8 Jt',   pct: 4,  color: '#9C27B0' },
];

const TAX_SUMMARY = [
  { label: 'PPN Keluaran',  value: 'Rp 34.8 Jt', sub: 'Mei 2026', status: 'belum dilaporkan' },
  { label: 'PPN Masukan',   value: 'Rp 19.8 Jt', sub: 'Mei 2026', status: 'belum dilaporkan' },
  { label: 'PPh 21',        value: 'Rp 8.2 Jt',  sub: 'Mei 2026', status: 'sudah dibayar' },
  { label: 'PPh Badan',     value: 'Rp 37.5 Jt', sub: 'Q1 2026',  status: 'sudah dibayar' },
];

export default function AccountingDashboard() {
  const { token } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;

  return (
    <AppShell appName="Akuntansi & Keuangan" appColor="#388E3C" appGradient="from-green-500 to-emerald-700" appIcon={DollarSign} navItems={NAV} activeHref="/accounting">
      <div className="p-6 space-y-6 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#433C50' }}>Dashboard Keuangan</h1>
            <p className="text-sm mt-0.5" style={{ color: '#A5A3AE' }}>Laporan keuangan, kas, pajak, dan pengeluaran</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#388E3C' }}>
            <Plus className="h-4 w-4" /> Jurnal Baru
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium" style={{ color: '#A5A3AE' }}>{s.label}</p>
                  <p className="text-xl font-bold mt-1 leading-tight" style={{ color: '#433C50' }}>{s.value}</p>
                  <p className="text-xs mt-1 flex items-center gap-0.5" style={{ color: s.color }}><ArrowUpRight className="h-3 w-3" />{s.sub}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: s.bg }}>
                  <s.icon className="h-5 w-5" style={{ color: s.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Arus Kas + Transaksi */}
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
            <h2 className="text-sm font-bold mb-1" style={{ color: '#433C50' }}>Arus Kas (Juta Rp)</h2>
            <p className="text-xs mb-5" style={{ color: '#A5A3AE' }}>5 bulan terakhir</p>
            <div className="flex items-end justify-between gap-2 h-36">
              {CASHFLOW.map((c) => (
                <div key={c.month} className="flex flex-col items-center gap-1 flex-1">
                  <div className="flex items-end gap-0.5 w-full justify-center" style={{ height: 120 }}>
                    <div className="w-4 rounded-t-sm" style={{ height: `${(c.in / MAX_VAL) * 100}%`, backgroundColor: '#4CAF50' }} />
                    <div className="w-4 rounded-t-sm" style={{ height: `${(c.out / MAX_VAL) * 100}%`, backgroundColor: '#EA5455' }} />
                  </div>
                  <span className="text-[10px] font-medium" style={{ color: '#A5A3AE' }}>{c.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: '#4CAF50' }} /><span className="text-xs" style={{ color: '#A5A3AE' }}>Masuk</span></div>
              <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: '#EA5455' }} /><span className="text-xs" style={{ color: '#A5A3AE' }}>Keluar</span></div>
            </div>
          </div>
          <div className="lg:col-span-3 bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
              <h2 className="text-sm font-bold" style={{ color: '#433C50' }}>Jurnal Terbaru</h2>
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: '#388E3C', border: '1px solid rgba(56,142,60,.2)', backgroundColor: 'rgba(56,142,60,.06)' }} onClick={() => router.push('/finance/journal-entries')}>Lihat Semua</button>
            </div>
            <div className="divide-y" style={{ '--tw-divide-color': '#F5F2FB' } as React.CSSProperties}>
              {RECENT_TX.map((tx) => (
                <div key={tx.ref} className="flex items-center justify-between px-6 py-3.5 transition-colors" onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FDFCFF'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0" style={{ backgroundColor: tx.type === 'income' ? 'rgba(76,175,80,.1)' : 'rgba(234,84,85,.1)' }}>
                      {tx.type === 'income' ? <TrendingUp className="h-4 w-4" style={{ color: '#4CAF50' }} /> : <TrendingDown className="h-4 w-4" style={{ color: '#EA5455' }} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold" style={{ color: '#433C50' }}>{tx.ref}</p>
                      <p className="text-xs truncate" style={{ color: '#A5A3AE' }}>{tx.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                    <p className="text-xs font-bold" style={{ color: tx.type === 'income' ? '#4CAF50' : '#EA5455' }}>{tx.type === 'income' ? tx.debit : tx.credit}</p>
                    <p className="text-xs" style={{ color: '#A5A3AE' }}>{tx.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kas & Bank + Pengeluaran */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Kas & Bank */}
          <div className="bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
              <div className="flex items-center gap-2">
                <Landmark className="h-4 w-4" style={{ color: '#1565C0' }} />
                <h2 className="text-sm font-bold" style={{ color: '#433C50' }}>Kas & Bank</h2>
              </div>
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: '#1565C0', border: '1px solid rgba(21,101,192,.2)', backgroundColor: 'rgba(21,101,192,.06)' }} onClick={() => router.push('/finance/bank-accounts')}>Lihat Semua</button>
            </div>
            <div className="p-4 space-y-3">
              {BANK_ACCOUNTS.map((acc) => (
                <div key={acc.name} className="flex items-center gap-3 rounded-xl p-3.5" style={{ backgroundColor: '#FDFCFF', border: '1px solid #F5F2FB' }}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0" style={{ backgroundColor: acc.color + '15' }}>
                    <Landmark className="h-5 w-5" style={{ color: acc.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold" style={{ color: '#433C50' }}>{acc.name}</p>
                    <p className="text-[10px]" style={{ color: '#A5A3AE' }}>{acc.no}</p>
                  </div>
                  <p className="text-sm font-bold flex-shrink-0" style={{ color: '#388E3C' }}>{acc.balance}</p>
                </div>
              ))}
              <div className="rounded-xl p-3.5" style={{ backgroundColor: '#E8F5E9', border: '1px solid #C8E6C9' }}>
                <p className="text-[10px]" style={{ color: '#388E3C' }}>Total Saldo</p>
                <p className="text-lg font-bold mt-0.5" style={{ color: '#2E7D32' }}>Rp 906.000.000</p>
              </div>
            </div>
          </div>

          {/* Pengeluaran + Pajak */}
          <div className="space-y-4">
            {/* Pengeluaran */}
            <div className="bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" style={{ color: '#EA5455' }} />
                  <h2 className="text-sm font-bold" style={{ color: '#433C50' }}>Pengeluaran Bulan Ini</h2>
                </div>
                <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: '#EA5455', border: '1px solid rgba(234,84,85,.2)', backgroundColor: 'rgba(234,84,85,.06)' }} onClick={() => router.push('/finance/expenses')}>Detail</button>
              </div>
              <div className="p-4 space-y-2.5">
                {EXPENSES.map((exp) => (
                  <div key={exp.category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ color: '#433C50' }}>{exp.category}</span>
                      <span className="text-xs font-bold" style={{ color: '#433C50' }}>{exp.amount}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ backgroundColor: '#F5F2FB' }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${exp.pct}%`, backgroundColor: exp.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pajak */}
            <div className="bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" style={{ color: '#FF9800' }} />
                  <h2 className="text-sm font-bold" style={{ color: '#433C50' }}>Pajak (PPN & PPh)</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 p-4">
                {TAX_SUMMARY.map((tax) => (
                  <div key={tax.label} className="rounded-xl p-3" style={{ backgroundColor: '#FDFCFF', border: '1px solid #F5F2FB' }}>
                    <p className="text-[10px]" style={{ color: '#A5A3AE' }}>{tax.label}</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: '#433C50' }}>{tax.value}</p>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: tax.status === 'sudah dibayar' ? 'rgba(76,175,80,.1)' : 'rgba(255,152,0,.1)', color: tax.status === 'sudah dibayar' ? '#4CAF50' : '#FF9800' }}>
                      {tax.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
