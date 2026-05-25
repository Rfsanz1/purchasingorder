'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import AppShell, { NavItem } from '../../components/layout/AppShell';
import {
  Package, BarChart2, ArrowLeftRight, Warehouse, ClipboardCheck,
  AlertTriangle, Settings, Plus, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';

const NAV: NavItem[] = [
  { label: 'Dashboard',        href: '/inventory',                       icon: BarChart2 },
  { label: 'Produk',           href: '/inventory/products',              icon: Package,
    children: [
      { label: 'Semua Produk',  href: '/inventory/products' },
      { label: 'Kategori',      href: '/inventory/products/categories' },
    ],
  },
  { label: 'Penerimaan',       href: '/purchasing/goods-receipts',       icon: ArrowDownRight },
  { label: 'Pengiriman',       href: '/inventory/deliveries',            icon: ArrowUpRight },
  { label: 'Perpindahan Stok', href: '/inventory/stock-movements',       icon: ArrowLeftRight },
  { label: 'Stock Opname',     href: '/inventory/stock-opnames',         icon: ClipboardCheck },
  { label: 'Gudang',           href: '/inventory/warehouses',            icon: Warehouse },
  { label: 'Pengaturan',       href: '/inventory/settings',              icon: Settings },
];

const STATS = [
  { label: 'Total Produk',        value: '1.248', sub: '12 kategori aktif',     color: '#F57C00', bg: 'rgba(245,124,0,.1)',   icon: Package },
  { label: 'Stok Menipis',        value: '34',    sub: 'Di bawah min. stok',    color: '#EA5455', bg: 'rgba(234,84,85,.1)',   icon: AlertTriangle },
  { label: 'Penerimaan Hari Ini', value: '8',     sub: 'Dari 5 supplier',       color: '#4CAF50', bg: 'rgba(76,175,80,.1)',   icon: ArrowDownRight },
  { label: 'Pengiriman Hari Ini', value: '14',    sub: '3 tertunda konfirmasi', color: '#2196F3', bg: 'rgba(33,150,243,.1)',  icon: ArrowUpRight },
];

const LOW_STOCK = [
  { name: 'Semen Portland 40kg', sku: 'SEM-001', stok: 12,  min: 50,  satuan: 'Sak' },
  { name: 'Cat Tembok Dulux 5L', sku: 'CAT-023', stok: 3,   min: 20,  satuan: 'Kaleng' },
  { name: 'Pipa PVC 4 inch',     sku: 'PIP-007', stok: 8,   min: 30,  satuan: 'Batang' },
  { name: 'Besi Beton 10mm',     sku: 'BES-012', stok: 25,  min: 100, satuan: 'Batang' },
  { name: 'Keramik 60x60 Putih', sku: 'KER-004', stok: 18,  min: 60,  satuan: 'Dus' },
];

const MOVEMENTS = [
  { type: 'in',  product: 'Semen Portland 40kg', qty: '+100', from: 'Supplier', date: '24 Mei 09:30' },
  { type: 'out', product: 'Cat Tembok Dulux 5L', qty: '-12',  from: 'SO-0128',  date: '24 Mei 08:45' },
  { type: 'in',  product: 'Pipa PVC 4 inch',     qty: '+50',  from: 'Supplier', date: '23 Mei 15:20' },
  { type: 'out', product: 'Besi Beton 10mm',      qty: '-30',  from: 'SO-0126',  date: '23 Mei 11:10' },
];

export default function InventoryDashboard() {
  const { token } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;

  return (
    <AppShell appName="Inventaris" appColor="#F57C00" appGradient="from-amber-500 to-orange-600" appIcon={Package} navItems={NAV} activeHref="/inventory">
      <div className="p-6 space-y-6 max-w-6xl mx-auto">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#433C50' }}>Dashboard Inventaris</h1>
            <p className="text-sm mt-0.5" style={{ color: '#A5A3AE' }}>Pantau stok, gudang, dan pergerakan barang</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#F57C00' }}>
            <Plus className="h-4 w-4" /> Produk Baru
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

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" style={{ color: '#EA5455' }} />
                <h2 className="text-sm font-bold" style={{ color: '#433C50' }}>Peringatan Stok Menipis</h2>
              </div>
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: '#F57C00', border: '1px solid rgba(245,124,0,.2)', backgroundColor: 'rgba(245,124,0,.06)' }}>
                Lihat Semua
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #EDE8F5' }}>
                    {['Produk', 'SKU', 'Stok Saat Ini', 'Min. Stok', 'Satuan'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#A5A3AE' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LOW_STOCK.map((p, i) => {
                    const pct = Math.round((p.stok / p.min) * 100);
                    return (
                      <tr key={p.sku} style={{ borderBottom: i < LOW_STOCK.length - 1 ? '1px solid #F5F2FB' : 'none' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FDFCFF'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <td className="px-6 py-3.5 text-sm font-medium" style={{ color: '#433C50' }}>{p.name}</td>
                        <td className="px-6 py-3.5 text-xs font-mono" style={{ color: '#A5A3AE' }}>{p.sku}</td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold" style={{ color: pct < 30 ? '#EA5455' : '#FF9800' }}>{p.stok}</span>
                            <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: '#F5F2FB' }}>
                              <div className="h-1.5 rounded-full" style={{ backgroundColor: pct < 30 ? '#EA5455' : '#FF9800', width: `${Math.min(pct, 100)}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-sm" style={{ color: '#A5A3AE' }}>{p.min}</td>
                        <td className="px-6 py-3.5 text-xs" style={{ color: '#A5A3AE' }}>{p.satuan}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
              <h2 className="text-sm font-bold" style={{ color: '#433C50' }}>Pergerakan Terbaru</h2>
            </div>
            <div className="p-4 space-y-3">
              {MOVEMENTS.map((m, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0"
                    style={{ backgroundColor: m.type === 'in' ? 'rgba(76,175,80,.12)' : 'rgba(234,84,85,.12)' }}>
                    {m.type === 'in'
                      ? <ArrowDownRight className="h-4 w-4" style={{ color: '#4CAF50' }} />
                      : <ArrowUpRight className="h-4 w-4" style={{ color: '#EA5455' }} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold leading-tight" style={{ color: '#433C50' }}>{m.product}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#A5A3AE' }}>{m.from} · {m.date}</p>
                  </div>
                  <span className="text-xs font-bold flex-shrink-0" style={{ color: m.type === 'in' ? '#4CAF50' : '#EA5455' }}>{m.qty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
