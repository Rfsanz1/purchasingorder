'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import { api } from '../../lib/api';
import AppShell, { NavItem } from '../../components/layout/AppShell';
import {
  Truck, BarChart2, FileText, Building2, PackageCheck,
  Clock, CheckCircle, XCircle, Settings, Plus, Search, TrendingDown,
} from 'lucide-react';

const NAV: NavItem[] = [
  { label: 'Dashboard',       href: '/purchasing',                         icon: BarChart2 },
  { label: 'Purchase Order',  href: '/purchasing/purchase-orders',         icon: FileText,
    children: [
      { label: 'Semua PO',     href: '/purchasing/purchase-orders' },
      { label: 'Draft',        href: '/purchasing/purchase-orders?status=draft' },
      { label: 'Dikonfirmasi', href: '/purchasing/purchase-orders?status=confirmed' },
    ],
  },
  { label: 'Penerimaan',  href: '/purchasing/goods-receipts', icon: PackageCheck },
  { label: 'Supplier',    href: '/purchasing/suppliers',      icon: Building2 },
  { label: 'Laporan',     href: '/purchasing/reports',        icon: TrendingDown },
  { label: 'Pengaturan',  href: '/purchasing/settings',       icon: Settings },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  draft:     { label: 'Draft',        color: '#A5A3AE', bg: 'rgba(165,163,174,.12)', icon: Clock },
  sent:      { label: 'Terkirim',     color: '#2196F3', bg: 'rgba(33,150,243,.1)',   icon: FileText },
  approved:  { label: 'Disetujui',    color: '#FF9800', bg: 'rgba(255,152,0,.1)',    icon: CheckCircle },
  partial:   { label: 'Sebagian',     color: '#9C27B0', bg: 'rgba(156,39,176,.1)',   icon: Clock },
  received:  { label: 'Diterima',     color: '#4CAF50', bg: 'rgba(76,175,80,.1)',    icon: PackageCheck },
  cancelled: { label: 'Dibatalkan',   color: '#EA5455', bg: 'rgba(234,84,85,.1)',    icon: XCircle },
};

const fmt = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

interface PurchaseOrder {
  id: string; noPo: string;
  supplier?: { name: string };
  tanggal?: string; totalHarga: number; status: string;
}
interface Stats { total: number; pending: number; approved: number; totalValue: number }

export default function PurchasingDashboard() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, totalValue: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => { if (!token) router.push('/login'); }, [token]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, statsRes] = await Promise.all([
        api.get('/purchasing/purchase-orders', { params: { limit: 5 } }),
        api.get('/purchasing/stats'),
      ]);
      setOrders(ordersRes.data.data ?? []);
      setStats(statsRes.data);
    } catch { /* silently ignore — may not be logged in yet */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (token) fetchData(); }, [token]);

  const handleApprove = async (id: string) => {
    setActionId(id);
    try { await api.post(`/purchasing/purchase-orders/${id}/approve`); await fetchData(); }
    finally { setActionId(null); }
  };

  if (!token) return null;

  const STAT_CARDS = [
    { label: 'Total PO',            value: String(stats.total),      sub: 'Semua waktu',       color: '#795548', bg: 'rgba(121,85,72,.1)',  icon: FileText },
    { label: 'Total Nilai',          value: fmt(Number(stats.totalValue)), sub: 'Semua PO',     color: '#EA5455', bg: 'rgba(234,84,85,.1)', icon: TrendingDown },
    { label: 'Menunggu Persetujuan', value: String(stats.pending),   sub: 'Status draft',      color: '#FF9800', bg: 'rgba(255,152,0,.1)', icon: Clock },
    { label: 'Disetujui',            value: String(stats.approved),  sub: 'Status approved',   color: '#4CAF50', bg: 'rgba(76,175,80,.1)', icon: CheckCircle },
  ];

  return (
    <AppShell appName="Pembelian" appColor="#5D4037" appGradient="from-stone-500 to-stone-700" appIcon={Truck} navItems={NAV} activeHref="/purchasing">
      <div className="p-6 space-y-6 max-w-6xl mx-auto">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#433C50' }}>Dashboard Pembelian</h1>
            <p className="text-sm mt-0.5" style={{ color: '#A5A3AE' }}>Pantau purchase order dan supplier</p>
          </div>
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: '#5D4037' }}
            onClick={() => router.push('/purchasing/purchase-orders')}
          >
            <Plus className="h-4 w-4" /> PO Baru
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium" style={{ color: '#A5A3AE' }}>{s.label}</p>
                  <p className="text-xl font-bold mt-1 leading-tight" style={{ color: '#433C50' }}>
                    {loading ? <span className="inline-block w-12 h-5 bg-gray-100 rounded animate-pulse" /> : s.value}
                  </p>
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
            <h2 className="text-sm font-bold" style={{ color: '#433C50' }}>Purchase Order Terbaru</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#B0AAB9' }} />
                <input
                  className="rounded-lg pl-8 pr-3 py-1.5 text-xs"
                  style={{ border: '1px solid #EDE8F5', color: '#433C50', outline: 'none', width: 160 }}
                  placeholder="Cari PO..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                className="text-xs font-medium px-3 py-1.5 rounded-lg"
                style={{ color: '#5D4037', border: '1px solid rgba(93,64,55,.2)', backgroundColor: 'rgba(93,64,55,.06)' }}
                onClick={() => router.push('/purchasing/purchase-orders')}
              >
                Lihat Semua
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-10 text-center text-sm" style={{ color: '#A5A3AE' }}>
              <div className="inline-block w-5 h-5 border-2 border-stone-400 border-t-transparent rounded-full animate-spin mb-2" />
              <p>Memuat data...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-10 text-center text-sm" style={{ color: '#A5A3AE' }}>Belum ada Purchase Order</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #EDE8F5' }}>
                    {['No. PO', 'Supplier', 'Tanggal', 'Total', 'Status', 'Aksi'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#A5A3AE' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .filter((po) => !search || po.noPo.toLowerCase().includes(search.toLowerCase()) || po.supplier?.name?.toLowerCase().includes(search.toLowerCase()))
                    .map((po, i) => {
                      const st = STATUS_MAP[po.status] ?? STATUS_MAP.draft;
                      return (
                        <tr
                          key={po.id}
                          style={{ borderBottom: i < orders.length - 1 ? '1px solid #F5F2FB' : 'none' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FDFCFF'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          <td className="px-6 py-3.5 text-sm font-semibold font-mono" style={{ color: '#5D4037' }}>{po.noPo}</td>
                          <td className="px-6 py-3.5 text-sm" style={{ color: '#433C50' }}>{po.supplier?.name ?? '-'}</td>
                          <td className="px-6 py-3.5 text-sm" style={{ color: '#A5A3AE' }}>
                            {po.tanggal ? new Date(po.tanggal).toLocaleDateString('id-ID') : '-'}
                          </td>
                          <td className="px-6 py-3.5 text-sm font-semibold" style={{ color: '#433C50' }}>{fmt(Number(po.totalHarga))}</td>
                          <td className="px-6 py-3.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ color: st.color, backgroundColor: st.bg }}>
                              <st.icon className="h-3 w-3" />{st.label}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-sm space-x-2">
                            {po.status === 'draft' && (
                              <button
                                onClick={() => handleApprove(po.id)}
                                disabled={actionId === po.id}
                                className="text-xs font-medium px-2 py-1 rounded-lg disabled:opacity-50"
                                style={{ color: '#4CAF50', backgroundColor: 'rgba(76,175,80,.1)', border: '1px solid rgba(76,175,80,.2)' }}
                              >
                                {actionId === po.id ? '...' : 'Approve'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Supplier + Penerimaan Barang */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Top Supplier */}
          <div className="bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" style={{ color: '#5D4037' }} />
                <h2 className="text-sm font-bold" style={{ color: '#433C50' }}>Supplier Aktif</h2>
              </div>
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: '#5D4037', border: '1px solid rgba(93,64,55,.2)', backgroundColor: 'rgba(93,64,55,.06)' }} onClick={() => router.push('/purchasing/suppliers')}>Lihat Semua</button>
            </div>
            <div className="p-4 space-y-2.5">
              {[
                { name: 'PT Semen Indonesia',    category: 'Bahan Bangunan', total: 'Rp 148 Jt', orders: 12, rating: 4.8 },
                { name: 'CV Kimia Farma Supply', category: 'Bahan Kimia',   total: 'Rp 92 Jt',  orders: 8,  rating: 4.6 },
                { name: 'UD Perkasa Material',   category: 'Material Kasar', total: 'Rp 74 Jt',  orders: 6,  rating: 4.5 },
                { name: 'PT Aneka Logam',        category: 'Logam & Besi',   total: 'Rp 56 Jt',  orders: 5,  rating: 4.7 },
              ].map((sup) => (
                <div key={sup.name} className="flex items-center gap-3 rounded-xl p-3.5" style={{ backgroundColor: '#FDFCFF', border: '1px solid #F5F2FB' }}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl flex-shrink-0 text-white text-sm font-bold" style={{ backgroundColor: '#5D4037' }}>
                    {sup.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: '#433C50' }}>{sup.name}</p>
                    <p className="text-[10px]" style={{ color: '#A5A3AE' }}>{sup.category} · {sup.orders} PO</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold" style={{ color: '#433C50' }}>{sup.total}</p>
                    <p className="text-[10px]" style={{ color: '#FF9800' }}>⭐ {sup.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Penerimaan Barang */}
          <div className="bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
              <div className="flex items-center gap-2">
                <PackageCheck className="h-4 w-4" style={{ color: '#4CAF50' }} />
                <h2 className="text-sm font-bold" style={{ color: '#433C50' }}>Penerimaan Barang</h2>
              </div>
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: '#4CAF50', border: '1px solid rgba(76,175,80,.2)', backgroundColor: 'rgba(76,175,80,.06)' }} onClick={() => router.push('/purchasing/goods-receipts')}>Lihat Semua</button>
            </div>
            <div className="p-4 space-y-2.5">
              {[
                { ref: 'GR-0092', po: 'PO-0124', supplier: 'PT Semen Indonesia',    date: '24 Mei 2026', items: 5, status: 'selesai' },
                { ref: 'GR-0091', po: 'PO-0122', supplier: 'CV Kimia Farma Supply', date: '23 Mei 2026', items: 3, status: 'selesai' },
                { ref: 'GR-0090', po: 'PO-0121', supplier: 'UD Perkasa Material',   date: '23 Mei 2026', items: 8, status: 'sebagian' },
                { ref: 'GR-0089', po: 'PO-0119', supplier: 'PT Aneka Logam',        date: '22 Mei 2026', items: 4, status: 'pending' },
              ].map((gr) => (
                <div key={gr.ref} className="flex items-center gap-3 rounded-xl p-3.5" style={{ backgroundColor: '#FDFCFF', border: '1px solid #F5F2FB' }}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl flex-shrink-0" style={{ backgroundColor: gr.status === 'selesai' ? 'rgba(76,175,80,.12)' : gr.status === 'sebagian' ? 'rgba(255,152,0,.12)' : 'rgba(165,163,174,.12)' }}>
                    <PackageCheck className="h-4 w-4" style={{ color: gr.status === 'selesai' ? '#4CAF50' : gr.status === 'sebagian' ? '#FF9800' : '#A5A3AE' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: '#433C50' }}>{gr.ref}</span>
                      <span className="text-[10px]" style={{ color: '#A5A3AE' }}>← {gr.po}</span>
                    </div>
                    <p className="text-[10px] truncate" style={{ color: '#A5A3AE' }}>{gr.supplier} · {gr.items} item</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: gr.status === 'selesai' ? 'rgba(76,175,80,.1)' : gr.status === 'sebagian' ? 'rgba(255,152,0,.1)' : 'rgba(165,163,174,.12)', color: gr.status === 'selesai' ? '#4CAF50' : gr.status === 'sebagian' ? '#FF9800' : '#A5A3AE' }}>
                      {gr.status}
                    </span>
                    <p className="text-[10px] mt-0.5" style={{ color: '#B0AAB9' }}>{gr.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
