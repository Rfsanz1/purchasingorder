'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/store/useAuthStore';
import {
  ShoppingCart, Users, Monitor, FileText, Package, Truck,
  DollarSign, BarChart2, Zap, Settings, ShieldCheck, Search,
  ChevronRight, LogOut, Bell
} from 'lucide-react';

interface Module {
  label: string;
  desc: string;
  href: string;
  icon: React.ElementType;
  gradient: string;
  iconColor: string;
}

interface ModuleCategory {
  category: string;
  modules: Module[];
}

const moduleCategories: ModuleCategory[] = [
  {
    category: 'Sales & CRM',
    modules: [
      { label: 'Sales', desc: 'Order penjualan & faktur', href: '/sales/orders', icon: ShoppingCart, gradient: 'from-teal-400 to-teal-600', iconColor: '#0D9488' },
      { label: 'CRM', desc: 'Manajemen pelanggan', href: '/crm', icon: Users, gradient: 'from-purple-400 to-purple-600', iconColor: '#9333EA' },
      { label: 'Point of Sale', desc: 'Kasir & transaksi', href: '/pos', icon: Monitor, gradient: 'from-orange-400 to-orange-600', iconColor: '#EA580C' },
      { label: 'Invoice', desc: 'Tagihan & pembayaran', href: '/sales/faktur', icon: FileText, gradient: 'from-blue-400 to-blue-600', iconColor: '#2563EB' },
    ],
  },
  {
    category: 'Inventory',
    modules: [
      { label: 'Inventory', desc: 'Produk, stok & gudang', href: '/inventory', icon: Package, gradient: 'from-red-400 to-orange-500', iconColor: '#EA5455' },
    ],
  },
  {
    category: 'Purchase',
    modules: [
      { label: 'Purchase', desc: 'Purchase order & supplier', href: '/purchasing/purchase-orders', icon: Truck, gradient: 'from-amber-400 to-orange-500', iconColor: '#FF9F43' },
    ],
  },
  {
    category: 'Finance',
    modules: [
      { label: 'Accounting', desc: 'Jurnal, COA & kas bank', href: '/finance/journal-entries', icon: DollarSign, gradient: 'from-violet-500 to-purple-700', iconColor: '#7C3AED' },
    ],
  },
  {
    category: 'HR & Payroll',
    modules: [
      { label: 'Human Resources', desc: 'Karyawan & penggajian', href: '/hr/employees', icon: Users, gradient: 'from-pink-400 to-rose-500', iconColor: '#EC4899' },
    ],
  },
  {
    category: 'Pengiriman',
    modules: [
      { label: 'Delivery', desc: 'Kelola pengiriman & driver', href: '/driver', icon: Truck, gradient: 'from-green-400 to-emerald-600', iconColor: '#16A34A' },
    ],
  },
  {
    category: 'Reports',
    modules: [
      { label: 'Reports', desc: 'Analitik & laporan bisnis', href: '/reports', icon: BarChart2, gradient: 'from-slate-400 to-slate-600', iconColor: '#475569' },
    ],
  },
  {
    category: 'AI & Automation',
    modules: [
      { label: 'AI Features', desc: 'AI inventory & analytics', href: '/ai', icon: Zap, gradient: 'from-yellow-400 to-amber-500', iconColor: '#D97706' },
    ],
  },
  {
    category: 'System',
    modules: [
      { label: 'Settings', desc: 'Konfigurasi sistem', href: '/settings', icon: Settings, gradient: 'from-gray-400 to-gray-600', iconColor: '#6B7280' },
      { label: 'Users & Roles', desc: 'Akses & permission', href: '/access', icon: ShieldCheck, gradient: 'from-red-500 to-red-700', iconColor: '#DC2626' },
    ],
  },
];

function ModuleCard({ mod }: { mod: Module }) {
  return (
    <a
      href={mod.href}
      className="group flex flex-col items-center gap-3 rounded-lg bg-white p-5 text-center transition-all duration-200"
      style={{
        boxShadow: '0 2px 6px rgba(47,43,61,.08)',
        border: '1px solid #E9E0F8',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-3px)';
        el.style.boxShadow = '0 8px 20px rgba(113,75,103,.16)';
        el.style.borderColor = '#714B67';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = '0 2px 6px rgba(47,43,61,.08)';
        el.style.borderColor = '#E9E0F8';
      }}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${mod.gradient}`}
      >
        <mod.icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: '#433C50' }}>{mod.label}</p>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#A5A3AE' }}>{mod.desc}</p>
      </div>
    </a>
  );
}

export default function HomePage() {
  const { token, user, logout, loadProfile } = useAuthStore();
  const router = useRouter();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    loadProfile();
  }, [token]);

  if (!token) return null;

  const filtered = search.trim()
    ? moduleCategories
        .map((cat) => ({
          ...cat,
          modules: cat.modules.filter(
            (m) =>
              m.label.toLowerCase().includes(search.toLowerCase()) ||
              m.desc.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((cat) => cat.modules.length > 0)
    : moduleCategories;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F2F5' }}>
      {/* Topbar */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-6 h-14"
        style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E9E0F8' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #714B67, #9C6B8E)' }}
          >
            G
          </div>
          <span className="font-bold text-sm hidden sm:block" style={{ color: '#433C50' }}>Gentong Mas ERP</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg" style={{ color: '#6D6777' }}>
            <Bell className="h-4.5 w-4.5" />
          </button>
          <a
            href="/install"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: 'rgba(113,75,103,.08)', color: '#714B67', border: '1px solid rgba(113,75,103,.2)' }}
          >
            <Zap className="h-3.5 w-3.5" />
            Aplikasi
          </a>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ border: '1px solid #E9E0F8' }}>
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-semibold"
              style={{ backgroundColor: '#714B67' }}
            >
              {(user?.name ?? user?.email ?? 'U').charAt(0).toUpperCase()}
            </div>
            <span className="text-sm hidden sm:block" style={{ color: '#433C50' }}>{user?.name ?? 'Admin'}</span>
          </div>
          <button
            onClick={() => { logout(); router.push('/login'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
            style={{ color: '#EA5455', border: '1px solid rgba(234,84,85,.2)' }}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </header>

      {/* Sticky search */}
      <div className="sticky top-14 z-20 px-6 py-3" style={{ backgroundColor: '#F0F2F5', borderBottom: '1px solid #E9E0F8' }}>
        <div className="max-w-3xl mx-auto relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#A5A3AE' }} />
          <input
            className="w-full rounded-lg pl-10 pr-4 py-2.5 text-sm transition-all"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E9E0F8',
              color: '#433C50',
              boxShadow: '0 1px 4px rgba(47,43,61,.08)',
              outline: 'none',
            }}
            placeholder="Cari modul..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={(e) => { e.target.style.borderColor = '#714B67'; }}
            onBlur={(e) => { e.target.style.borderColor = '#E9E0F8'; }}
          />
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#433C50' }}>
            Selamat datang, {user?.name ?? 'Admin'} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: '#A5A3AE' }}>
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16" style={{ color: '#A5A3AE' }}>
            <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">Modul tidak ditemukan</p>
            <p className="text-sm mt-1">Coba kata kunci yang berbeda</p>
          </div>
        ) : (
          filtered.map((cat) => (
            <div key={cat.category}>
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#A5A3AE' }}>
                {cat.category}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {cat.modules.map((mod) => (
                  <ModuleCard key={mod.href} mod={mod} />
                ))}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
