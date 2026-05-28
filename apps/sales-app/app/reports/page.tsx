'use client';

import { useEffect, useState, useCallback } from 'react';
import { SalesLayout } from '../../components/SalesLayout';
import api from '../../lib/api';
import { BarChart2, RefreshCw, Download, TrendingUp, ShoppingCart, DollarSign, Users } from 'lucide-react';

const C = { primary: '#7C3AED', border: '#EDE9FE', textDark: '#1E1B4B', textMid: '#6B7280', textLight: '#9CA3AF' };

const DEMO_SUMMARY = {
  totalOmzet: 285000000, totalOrders: 147, avgOrderValue: 1938775, newCustomers: 12,
  omzetTrend: 8.5, ordersTrend: 12.3, avgTrend: -3.1, customersTrend: 20.0,
};

const DEMO_CHART = [
  { label: 'Jan', value: 32000000 }, { label: 'Feb', value: 28500000 },
  { label: 'Mar', value: 41000000 }, { label: 'Apr', value: 35500000 },
  { label: 'Mei', value: 48000000 }, { label: 'Jun', value: 38000000 },
  { label: 'Jul', value: 52000000 },
];

const DEMO_TOP_PRODUCTS = [
  { name: 'Semen Portland 40kg', qty: 840, revenue: 43680000, pct: 85 },
  { name: 'Besi Beton 10mm 12m', qty: 520, revenue: 50440000, pct: 70 },
  { name: 'Cat Tembok Putih 5L', qty: 380, revenue: 22040000, pct: 55 },
  { name: 'Pipa PVC 4" x 4m',   qty: 290, revenue: 8120000,  pct: 40 },
  { name: 'Keramik Lantai 60x60', qty: 210, revenue: 9450000, pct: 28 },
];

const DEMO_TOP_CUSTOMERS = [
  { name: 'PT Maju Sejahtera',     total: 85000000, orders: 12 },
  { name: 'CV Berkah Jaya',         total: 62000000, orders: 8  },
  { name: 'PT Karya Abadi Sentosa', total: 48500000, orders: 9  },
  { name: 'Toko Bangunan Sejuk',    total: 34000000, orders: 5  },
  { name: 'UD Subur Makmur',        total: 28000000, orders: 6  },
];

function MiniBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: '100%', borderRadius: '6px 6px 0 0', height: `${(d.value / max) * 100}%`, background: i === data.length - 1 ? C.primary : `${C.primary}50`, transition: 'height .3s', minHeight: 4 }} />
          <span style={{ fontSize: 9, color: C.textLight, fontWeight: 600 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function ReportsPage() {
  const [summary, setSummary] = useState(DEMO_SUMMARY);
  const [chartData, setChartData] = useState(DEMO_CHART);
  const [topProducts, setTopProducts] = useState(DEMO_TOP_PRODUCTS);
  const [topCustomers, setTopCustomers] = useState(DEMO_TOP_CUSTOMERS);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('this_month');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ period, ...(dateFrom && { dateFrom }), ...(dateTo && { dateTo }) });
      const res = await api.get(`/reports/sales?${params}`);
      if (res.data) {
        setSummary(res.data.summary ?? DEMO_SUMMARY);
        setChartData(res.data.chart ?? DEMO_CHART);
        setTopProducts(res.data.topProducts ?? DEMO_TOP_PRODUCTS);
        setTopCustomers(res.data.topCustomers ?? DEMO_TOP_CUSTOMERS);
      }
    } catch {
      setSummary(DEMO_SUMMARY); setChartData(DEMO_CHART);
      setTopProducts(DEMO_TOP_PRODUCTS); setTopCustomers(DEMO_TOP_CUSTOMERS);
    } finally { setLoading(false); }
  }, [period, dateFrom, dateTo]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const formatRp = (v: number) => v >= 1e9 ? `Rp ${(v / 1e9).toFixed(1)} M` : v >= 1e6 ? `Rp ${(v / 1e6).toFixed(1)} Jt` : `Rp ${Number(v).toLocaleString('id-ID')}`;

  const handleExport = async () => {
    try {
      const res = await api.get(`/reports/sales/export?period=${period}&format=csv`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a'); a.href = url; a.download = `laporan-sales-${period}.csv`; a.click();
    } catch { alert('Export belum tersedia. Hubungi admin.'); }
  };

  const STAT_CARDS = [
    { label: 'Total Omzet', value: formatRp(summary.totalOmzet), trend: summary.omzetTrend, icon: DollarSign, color: '#22C55E' },
    { label: 'Total Order', value: summary.totalOrders.toLocaleString('id-ID'), trend: summary.ordersTrend, icon: ShoppingCart, color: C.primary },
    { label: 'Rata-rata Order', value: formatRp(summary.avgOrderValue), trend: summary.avgTrend, icon: BarChart2, color: '#F59E0B' },
    { label: 'Pelanggan Baru', value: summary.newCustomers.toString(), trend: summary.customersTrend, icon: Users, color: '#0891B2' },
  ];

  return (
    <SalesLayout title="Laporan Sales" subtitle="Ringkasan performa penjualan">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: C.textDark, margin: '0 0 4px' }}>Laporan Sales</h2>
          <p style={{ fontSize: 13, color: C.textLight, margin: 0 }}>Ringkasan performa penjualan</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: '#fff', color: C.textMid, fontSize: 13, cursor: 'pointer' }}>
            <RefreshCw size={13} />
          </button>
          <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: 'none', background: '#22C55E', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Period filter */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {[
          { key: 'today',      label: 'Hari Ini' },
          { key: 'this_week',  label: 'Minggu Ini' },
          { key: 'this_month', label: 'Bulan Ini' },
          { key: 'this_year',  label: 'Tahun Ini' },
          { key: 'custom',     label: 'Custom' },
        ].map(p => (
          <button key={p.key} onClick={() => setPeriod(p.key)}
            style={{ padding: '7px 14px', borderRadius: 10, border: `1.5px solid ${period === p.key ? C.primary : C.border}`, background: period === p.key ? `${C.primary}10` : '#fff', color: period === p.key ? C.primary : C.textMid, fontSize: 12.5, fontWeight: period === p.key ? 700 : 500, cursor: 'pointer', transition: 'all .15s' }}>
            {p.label}
          </button>
        ))}
        {period === 'custom' && (
          <>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              style={{ padding: '7px 10px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 12, color: C.textMid }} />
            <span style={{ fontSize: 12, color: C.textLight }}>s/d</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              style={{ padding: '7px 10px', borderRadius: 10, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 12, color: C.textMid }} />
          </>
        )}
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14, marginBottom: 20 }}>
        {STAT_CARDS.map(s => {
          const Icon = s.icon;
          const up = s.trend >= 0;
          return (
            <div key={s.label} style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, padding: 18, boxShadow: '0 2px 8px rgba(124,58,237,.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <p style={{ fontSize: 11.5, color: C.textLight, fontWeight: 500, margin: 0 }}>{s.label}</p>
                <div style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} style={{ color: s.color }} />
                </div>
              </div>
              <p style={{ fontSize: 22, fontWeight: 800, color: C.textDark, margin: '0 0 6px' }}>{loading ? '…' : s.value}</p>
              <p style={{ fontSize: 11, margin: 0, fontWeight: 600, color: up ? '#22C55E' : '#EF4444' }}>
                {up ? '↑' : '↓'} {Math.abs(s.trend).toFixed(1)}% vs periode lalu
              </p>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Chart */}
        <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: C.textDark, margin: '0 0 16px' }}>Tren Omzet</h3>
          {loading ? <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textLight }}>Memuat…</div> : <MiniBarChart data={chartData} />}
        </div>

        {/* Top products */}
        <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: C.textDark, margin: '0 0 16px' }}>Produk Terlaris</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topProducts.slice(0, 5).map((p, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 12, color: C.textDark, fontWeight: 600 }}>{p.name}</span>
                  <span style={{ fontSize: 11, color: C.textLight }}>{p.qty} pcs</span>
                </div>
                <div style={{ height: 5, borderRadius: 100, backgroundColor: '#F3F4F6', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.pct}%`, background: `linear-gradient(90deg, ${C.primary}, #A78BFA)`, borderRadius: 100 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top customers */}
      <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1.5px solid ${C.border}` }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: C.textDark, margin: 0 }}>Top Pelanggan</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['#', 'Pelanggan', 'Total Belanja', 'Jumlah Order'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topCustomers.map((c, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F5F3FF')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                <td style={{ padding: '12px 16px', fontWeight: 800, color: i === 0 ? '#F59E0B' : i === 1 ? '#9CA3AF' : i === 2 ? '#CD7F32' : C.textLight }}>#{i + 1}</td>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: C.textDark }}>{c.name}</td>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: C.primary }}>{formatRp(c.total)}</td>
                <td style={{ padding: '12px 16px', color: C.textMid }}>{c.orders} order</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SalesLayout>
  );
}
