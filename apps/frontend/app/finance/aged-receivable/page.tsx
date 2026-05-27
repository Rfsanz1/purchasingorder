'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/store/useAuthStore';
import AppShell from '../../../components/layout/AppShell';
import { ACCOUNTING_CONFIG, ACCOUNTING_NAV } from '../../../lib/nav-configs';
import { TrendingUp, Search, RefreshCw, Download, AlertTriangle } from 'lucide-react';

const C = ACCOUNTING_CONFIG.appColor;

const SAMPLE_DATA = [
  { customer: 'PT. Maju Jaya', current: 15000000, days1_30: 8000000, days31_60: 5000000, days61_90: 2000000, over90: 0, total: 30000000 },
  { customer: 'CV. Berkah Abadi', current: 25000000, days1_30: 0, days31_60: 12000000, days61_90: 8000000, over90: 5000000, total: 50000000 },
  { customer: 'Toko Sejahtera', current: 8000000, days1_30: 3000000, days31_60: 0, days61_90: 0, over90: 0, total: 11000000 },
  { customer: 'PT. Karya Mandiri', current: 45000000, days1_30: 20000000, days31_60: 0, days61_90: 0, over90: 0, total: 65000000 },
  { customer: 'UD. Makmur Sentosa', current: 5000000, days1_30: 5000000, days31_60: 8000000, days61_90: 12000000, over90: 15000000, total: 45000000 },
];

const fmt = (v: number) => v.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

export default function AgedReceivablePage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;

  const filtered = SAMPLE_DATA.filter(d => d.customer.toLowerCase().includes(search.toLowerCase()));

  const totals = {
    current: filtered.reduce((s, d) => s + d.current, 0),
    days1_30: filtered.reduce((s, d) => s + d.days1_30, 0),
    days31_60: filtered.reduce((s, d) => s + d.days31_60, 0),
    days61_90: filtered.reduce((s, d) => s + d.days61_90, 0),
    over90: filtered.reduce((s, d) => s + d.over90, 0),
    total: filtered.reduce((s, d) => s + d.total, 0),
  };

  const grandTotal = totals.total;
  const overdue = totals.days31_60 + totals.days61_90 + totals.over90;
  const overdueRate = grandTotal > 0 ? Math.round(overdue / grandTotal * 100) : 0;

  const COLUMNS = [
    { key: 'current', label: 'Belum Jatuh Tempo', color: '#4CAF50' },
    { key: 'days1_30', label: '1-30 Hari', color: '#FF9800' },
    { key: 'days31_60', label: '31-60 Hari', color: '#FF5722' },
    { key: 'days61_90', label: '61-90 Hari', color: '#F44336' },
    { key: 'over90', label: '> 90 Hari', color: '#B71C1C' },
  ];

  return (
    <AppShell {...ACCOUNTING_CONFIG} navItems={ACCOUNTING_NAV} activeHref="/finance/aged-receivable">
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#1E1B4B' }}>Aging Piutang (Aged Receivable)</h1>
            <p className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>Analisa umur piutang pelanggan berdasarkan tanggal jatuh tempo</p>
          </div>
          <div className="flex gap-2">
            <input type="date" value={asOfDate} onChange={e => setAsOfDate(e.target.value)} className="rounded-lg px-3 py-2 text-sm" style={{ border: '1px solid #EDE8F5', color: '#1E1B4B', outline: 'none' }} />
            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold" style={{ border: '1.5px solid #EDE8F5', color: '#6B7280' }}>
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Piutang', value: fmt(grandTotal), color: C },
            { label: 'Belum Jatuh Tempo', value: fmt(totals.current), color: '#4CAF50' },
            { label: 'Jatuh Tempo', value: fmt(overdue), color: '#EA5455' },
            { label: 'Persentase Overdue', value: `${overdueRate}%`, color: overdueRate > 20 ? '#EA5455' : '#FF9800' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
              <p className="text-xs font-medium" style={{ color: '#9CA3AF' }}>{s.label}</p>
              <p className="text-lg font-bold mt-1 truncate" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
          <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#B0AAB9' }} />
              <input className="w-full rounded-lg pl-9 pr-4 py-2 text-sm" style={{ border: '1px solid #EDE8F5', color: '#1E1B4B', outline: 'none' }} placeholder="Cari pelanggan..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #EDE8F5', backgroundColor: '#F5F3FF' }}>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#9CA3AF' }}>Pelanggan</th>
                  {COLUMNS.map(col => (
                    <th key={col.key} className="px-4 py-3 text-right text-xs font-semibold" style={{ color: col.color }}>{col.label}</th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-semibold" style={{ color: '#1E1B4B' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d.customer} style={{ borderBottom: '1px solid #F5F3FF' }} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium" style={{ color: '#1E1B4B' }}>
                      <div className="flex items-center gap-2">
                        {d.over90 > 0 && <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#B71C1C' }} />}
                        {d.customer}
                      </div>
                    </td>
                    {COLUMNS.map(col => (
                      <td key={col.key} className="px-4 py-3 text-right text-xs" style={{ color: (d as any)[col.key] > 0 ? col.color : '#9CA3AF' }}>
                        {(d as any)[col.key] > 0 ? fmt((d as any)[col.key]) : '-'}
                      </td>
                    ))}
                    <td className="px-6 py-3 text-right font-bold text-sm" style={{ color: '#1E1B4B' }}>{fmt(d.total)}</td>
                  </tr>
                ))}
                <tr style={{ borderTop: '2px solid #EDE8F5', backgroundColor: '#F5F3FF' }}>
                  <td className="px-6 py-3 font-bold text-sm" style={{ color: '#1E1B4B' }}>TOTAL</td>
                  {COLUMNS.map(col => (
                    <td key={col.key} className="px-4 py-3 text-right font-bold text-sm" style={{ color: col.color }}>{fmt((totals as any)[col.key])}</td>
                  ))}
                  <td className="px-6 py-3 text-right font-bold text-sm" style={{ color: '#1E1B4B' }}>{fmt(totals.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
