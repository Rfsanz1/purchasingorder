'use client';

import { useEffect, useState } from 'react';
import { OdooLayout } from '../../components/layout/OdooLayout';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ModuleTab } from '../../components/ui/ModuleTab';
import { api } from '../../lib/api';
import {
  Package, Plus, Search, RefreshCw, Filter, MoreVertical,
  DollarSign, AlertTriangle, CheckCircle, ArrowUpDown, ChevronLeft, ChevronRight,
  LayoutList
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  category?: { name: string };
  brand?: string;
  stok: number;
  stokMinimum: number;
  hargaJual: number;
  uom?: string;
  active: boolean;
}

interface Stats {
  totalProducts: number;
  lowStock: number;
  totalStok: number;
  activeProducts: number;
  nilaiInventori?: number;
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Aqua Galon 19L', sku: 'AQ-19L', category: { name: 'Air Minum' }, brand: 'Aqua', stok: 245, stokMinimum: 50, hargaJual: 21000, uom: 'Galon', active: true },
  { id: '2', name: 'Le Minerale 600ml', sku: 'LM-600', category: { name: 'Air Minum' }, brand: 'Le Minerale', stok: 12, stokMinimum: 50, hargaJual: 3500, uom: 'Botol', active: true },
  { id: '3', name: 'Indomie Goreng', sku: 'IM-GRG', category: { name: 'Mie Instan' }, brand: 'Indofood', stok: 480, stokMinimum: 100, hargaJual: 3800, uom: 'Pcs', active: true },
  { id: '4', name: 'Minyak Goreng Bimoli 2L', sku: 'BML-2L', category: { name: 'Minyak' }, brand: 'Bimoli', stok: 0, stokMinimum: 20, hargaJual: 38000, uom: 'Botol', active: true },
  { id: '5', name: 'Gula Pasir 1kg', sku: 'GP-1KG', category: { name: 'Sembako' }, brand: 'Gulaku', stok: 85, stokMinimum: 30, hargaJual: 15000, uom: 'Kg', active: true },
  { id: '6', name: 'Tepung Terigu Segitiga', sku: 'TT-SGB', category: { name: 'Sembako' }, brand: 'Bogasari', stok: 160, stokMinimum: 40, hargaJual: 13500, uom: 'Kg', active: false },
  { id: '7', name: 'Kecap Manis ABC 250ml', sku: 'ABC-250', category: { name: 'Bumbu' }, brand: 'ABC', stok: 72, stokMinimum: 20, hargaJual: 9500, uom: 'Botol', active: true },
  { id: '8', name: 'Sabun Lifebuoy 85gr', sku: 'LFB-85', category: { name: 'Kebersihan' }, brand: 'Lifebuoy', stok: 200, stokMinimum: 50, hargaJual: 5500, uom: 'Pcs', active: true },
];

const MOCK_STATS: Stats = {
  totalProducts: 245,
  lowStock: 18,
  totalStok: 12450,
  activeProducts: 230,
  nilaiInventori: 187500000,
};

const TABS = [
  { key: 'products', label: 'Produk' },
  { key: 'movements', label: 'Mutasi Stok' },
  { key: 'opnames', label: 'Stock Opname' },
  { key: 'warehouses', label: 'Gudang' },
];

function getProductStatus(p: Product): { label: string; variant: 'success' | 'warning' | 'danger' | 'default' } {
  if (!p.active) return { label: 'Nonaktif', variant: 'default' };
  if (p.stok === 0) return { label: 'Habis', variant: 'danger' };
  if (p.stok <= p.stokMinimum) return { label: 'Stok Rendah', variant: 'warning' };
  return { label: 'Aktif', variant: 'success' };
}

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [stats] = useState<Stats>(MOCK_STATS);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const perPage = 10;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const SortIcon = ({ field }: { field: string }) => (
    <ArrowUpDown
      className="h-3 w-3 ml-1 inline-block opacity-40"
      style={{ color: sortField === field ? '#714B67' : undefined, opacity: sortField === field ? 1 : 0.4 }}
    />
  );

  return (
    <OdooLayout title="Inventory">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Produk" value={stats.totalProducts.toLocaleString('id-ID')} icon={Package} iconColor="#714B67" />
        <StatCard label="Stok Rendah" value={stats.lowStock} icon={AlertTriangle} iconColor="#FF9F43" />
        <StatCard
          label="Nilai Inventori"
          value={`Rp ${(stats.nilaiInventori ?? 0 / 1e6).toFixed(0)}jt`}
          icon={DollarSign}
          iconColor="#28C76F"
        />
        <StatCard label="Produk Aktif" value={stats.activeProducts} icon={CheckCircle} iconColor="#00CFE8" />
      </div>

      {/* Card */}
      <div className="bg-white rounded-lg" style={{ boxShadow: '0 2px 6px rgba(47,43,61,.12)', border: '1px solid #E9E0F8' }}>
        {/* Tabs */}
        <div className="px-5 pt-4">
          <ModuleTab tabs={TABS} active={activeTab} onChange={setActiveTab} />
        </div>

        {activeTab === 'products' && (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 px-5 py-4">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#714B67' }}
              >
                <Plus className="h-4 w-4" />
                New Product
              </button>

              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#A5A3AE' }} />
                <input
                  className="w-full rounded-md pl-9 pr-4 py-2 text-sm transition-all"
                  style={{
                    border: '1px solid #E9E0F8',
                    color: '#433C50',
                    outline: 'none',
                  }}
                  placeholder="Cari produk..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  onFocus={(e) => { e.target.style.borderColor = '#714B67'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#E9E0F8'; }}
                />
              </div>

              <button
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors"
                style={{ border: '1px solid #E9E0F8', color: '#6D6777' }}
              >
                <Filter className="h-4 w-4" />
                Filter
              </button>

              <button
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors"
                style={{ border: '1px solid #E9E0F8', color: '#6D6777' }}
              >
                <LayoutList className="h-4 w-4" />
                List
              </button>

              <button
                onClick={() => setLoading(!loading)}
                className="p-2 rounded-md transition-colors ml-auto"
                style={{ border: '1px solid #E9E0F8', color: '#A5A3AE' }}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderTop: '1px solid #E9E0F8', borderBottom: '1px solid #E9E0F8', backgroundColor: '#FAFAFA' }}>
                    <th className="w-10 px-4 py-3">
                      <input type="checkbox" className="rounded" style={{ accentColor: '#714B67' }} />
                    </th>
                    <th
                      className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide cursor-pointer select-none"
                      style={{ color: '#A5A3AE' }}
                      onClick={() => handleSort('name')}
                    >
                      Nama Produk <SortIcon field="name" />
                    </th>
                    <th
                      className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide cursor-pointer select-none"
                      style={{ color: '#A5A3AE' }}
                      onClick={() => handleSort('category')}
                    >
                      Kategori <SortIcon field="category" />
                    </th>
                    <th
                      className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wide cursor-pointer select-none"
                      style={{ color: '#A5A3AE' }}
                      onClick={() => handleSort('stok')}
                    >
                      Stok <SortIcon field="stok" />
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: '#A5A3AE' }}>UoM</th>
                    <th
                      className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wide cursor-pointer select-none"
                      style={{ color: '#A5A3AE' }}
                      onClick={() => handleSort('hargaJual')}
                    >
                      Harga Jual <SortIcon field="hargaJual" />
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: '#A5A3AE' }}>Status</th>
                    <th className="w-10 px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-sm" style={{ color: '#A5A3AE' }}>
                        <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
                        <p>Belum ada produk</p>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((p) => {
                      const status = getProductStatus(p);
                      return (
                        <tr
                          key={p.id}
                          className="transition-colors"
                          style={{ borderBottom: '1px solid #F5F5F9' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#FAFAFA'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = ''; }}
                        >
                          <td className="px-4 py-3">
                            <input type="checkbox" className="rounded" style={{ accentColor: '#714B67' }} />
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium" style={{ color: '#433C50' }}>{p.name}</p>
                            <p className="text-xs font-mono mt-0.5" style={{ color: '#A5A3AE' }}>{p.sku}</p>
                          </td>
                          <td className="px-4 py-3" style={{ color: '#6D6777' }}>{p.category?.name ?? '-'}</td>
                          <td className="px-4 py-3 text-right">
                            <span
                              className="font-semibold"
                              style={{ color: p.stok === 0 ? '#EA5455' : p.stok <= p.stokMinimum ? '#FF9F43' : '#433C50' }}
                            >
                              {p.stok.toLocaleString('id-ID')}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm" style={{ color: '#6D6777' }}>{p.uom ?? '-'}</td>
                          <td className="px-4 py-3 text-right" style={{ color: '#433C50' }}>
                            {Number(p.hargaJual).toLocaleString('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              maximumFractionDigits: 0,
                            })}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <StatusBadge label={status.label} variant={status.variant} />
                          </td>
                          <td className="px-4 py-3 relative">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                              className="p-1 rounded-md transition-colors"
                              style={{ color: '#A5A3AE' }}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            {openMenuId === p.id && (
                              <div
                                className="absolute right-8 top-8 z-10 w-36 rounded-lg overflow-hidden"
                                style={{ backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(47,43,61,.16)', border: '1px solid #E9E0F8' }}
                              >
                                {['Edit', 'Duplicate', 'Hapus'].map((action) => (
                                  <button
                                    key={action}
                                    className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-[rgba(113,75,103,.06)]"
                                    style={{ color: action === 'Hapus' ? '#EA5455' : '#6D6777' }}
                                    onClick={() => setOpenMenuId(null)}
                                  >
                                    {action}
                                  </button>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderTop: '1px solid #E9E0F8' }}
            >
              <span className="text-xs" style={{ color: '#A5A3AE' }}>
                {((page - 1) * perPage) + 1}–{Math.min(page * perPage, filtered.length)} / {filtered.length} produk
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-md transition-colors disabled:opacity-40"
                  style={{ border: '1px solid #E9E0F8', color: '#6D6777' }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<React.ReactNode[]>((acc, p, idx, arr) => {
                    if (idx > 0 && arr[idx - 1] !== p - 1) {
                      acc.push(<span key={`ellipsis-${p}`} className="px-2 text-xs" style={{ color: '#A5A3AE' }}>…</span>);
                    }
                    acc.push(
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className="h-7 w-7 rounded-md text-xs font-medium transition-colors"
                        style={{
                          backgroundColor: p === page ? '#714B67' : 'transparent',
                          color: p === page ? '#FFFFFF' : '#6D6777',
                          border: p === page ? 'none' : '1px solid #E9E0F8',
                        }}
                      >
                        {p}
                      </button>
                    );
                    return acc;
                  }, [])}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-md transition-colors disabled:opacity-40"
                  style={{ border: '1px solid #E9E0F8', color: '#6D6777' }}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab !== 'products' && (
          <div className="flex flex-col items-center justify-center py-20" style={{ color: '#A5A3AE' }}>
            <Package className="h-12 w-12 mb-3 opacity-30" />
            <p className="font-medium">Segera hadir</p>
            <p className="text-sm mt-1">Fitur {TABS.find(t => t.key === activeTab)?.label} sedang dalam pengembangan</p>
          </div>
        )}
      </div>
    </OdooLayout>
  );
}
