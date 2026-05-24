'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/store/useAuthStore';
import {
  ShoppingCart, Users, Monitor, FileText, Package, Truck,
  DollarSign, BarChart2, Zap, Settings, ShieldCheck, Search,
  LogOut, Bell, ChevronRight, Grid,
} from 'lucide-react';

interface Module {
  label: string;
  desc: string;
  href: string;
  icon: React.ElementType;
  gradient: string;
}

const MODULE_CATEGORIES = [
  {
    category: 'Penjualan & CRM',
    modules: [
      { label: 'Penjualan', desc: 'Order & penawaran', href: '/sales/orders', icon: ShoppingCart, gradient: 'from-teal-400 to-teal-600' },
      { label: 'CRM', desc: 'Kelola pelanggan', href: '/crm', icon: Users, gradient: 'from-violet-400 to-purple-600' },
      { label: 'Point of Sale', desc: 'Kasir & transaksi', href: '/pos', icon: Monitor, gradient: 'from-orange-400 to-orange-600' },
      { label: 'Invoice', desc: 'Tagihan & pembayaran', href: '/sales/faktur', icon: FileText, gradient: 'from-blue-400 to-blue-600' },
    ],
  },
  {
    category: 'Operasional',
    modules: [
      { label: 'Inventaris', desc: 'Produk, stok & gudang', href: '/inventory', icon: Package, gradient: 'from-red-400 to-orange-500' },
      { label: 'Pembelian', desc: 'PO & supplier', href: '/purchasing/purchase-orders', icon: Truck, gradient: 'from-amber-400 to-orange-500' },
      { label: 'Pengiriman', desc: 'Driver & logistik', href: '/driver', icon: Truck, gradient: 'from-green-400 to-emerald-600' },
    ],
  },
  {
    category: 'Keuangan',
    modules: [
      { label: 'Akuntansi', desc: 'Jurnal, COA & kas', href: '/finance/journal-entries', icon: DollarSign, gradient: 'from-violet-500 to-purple-700' },
    ],
  },
  {
    category: 'SDM',
    modules: [
      { label: 'Karyawan', desc: 'Data & penggajian', href: '/hr/employees', icon: Users, gradient: 'from-pink-400 to-rose-500' },
    ],
  },
  {
    category: 'Laporan & Sistem',
    modules: [
      { label: 'Laporan', desc: 'Analitik bisnis', href: '/reports', icon: BarChart2, gradient: 'from-slate-400 to-slate-600' },
      { label: 'AI & Otomasi', desc: 'Fitur AI & analitik', href: '/ai', icon: Zap, gradient: 'from-yellow-400 to-amber-500' },
      { label: 'Pengaturan', desc: 'Konfigurasi sistem', href: '/settings', icon: Settings, gradient: 'from-gray-400 to-gray-600' },
      { label: 'Akses & Peran', desc: 'User & permission', href: '/access', icon: ShieldCheck, gradient: 'from-red-500 to-red-700' },
    ],
  },
];

function ModuleCard({ mod }: { mod: Module }) {
  return (
    <a
      href={mod.href}
      className="group flex flex-col items-center gap-3 rounded-xl bg-white px-4 py-5 text-center transition-all duration-200 focus:outline-none"
      style={{
        boxShadow: '0 1px 4px rgba(47,43,61,.07)',
        border: '1.5px solid #EDE8F5',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-3px)';
        el.style.boxShadow = '0 8px 24px rgba(113,75,103,.15)';
        el.style.borderColor = '#714B67';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = '0 1px 4px rgba(47,43,61,.07)';
        el.style.borderColor = '#EDE8F5';
      }}
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${mod.gradient} shadow-sm`}>
        <mod.icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-sm font-semibold leading-tight" style={{ color: '#433C50' }}>{mod.label}</p>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: '#B0AAB9' }}>{mod.desc}</p>
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

  const q = search.trim().toLowerCase();
  const filtered = q
    ? MODULE_CATEGORIES
        .map((cat) => ({ ...cat, modules: cat.modules.filter((m) => m.label.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q)) }))
        .filter((cat) => cat.modules.length > 0)
    : MODULE_CATEGORIES;

  const totalModules = MODULE_CATEGORIES.reduce((a, c) => a + c.modules.length, 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F4F9' }}>

      {/* ── Topbar ── */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-6 h-14"
        style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #EDE8F5', boxShadow: '0 1px 0 rgba(47,43,61,.06)' }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white font-bold text-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #714B67, #9C6B8E)' }}
          >
            G
          </div>
          <span className="font-bold text-sm" style={{ color: '#433C50' }}>Gentong Mas ERP</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            className="relative p-2 rounded-lg transition-colors"
            style={{ color: '#A5A3AE' }}
            title="Notifikasi"
          >
            <Bell className="h-5 w-5" />
          </button>
          <a
            href="/install"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{ backgroundColor: 'rgba(113,75,103,.08)', color: '#714B67', border: '1px solid rgba(113,75,103,.18)' }}
          >
            <Grid className="h-3.5 w-3.5" />
            Kelola Modul
          </a>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-default"
            style={{ border: '1px solid #EDE8F5' }}
          >
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #714B67, #9C6B8E)' }}
            >
              {(user?.name ?? user?.email ?? 'U').charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium hidden sm:block" style={{ color: '#433C50' }}>
              {user?.name ?? 'Admin'}
            </span>
          </div>
          <button
            onClick={() => { logout(); router.push('/login'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
            style={{ color: '#EA5455', border: '1px solid rgba(234,84,85,.18)' }}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:block text-xs font-medium">Keluar</span>
          </button>
        </div>
      </header>

      {/* ── Hero / Welcome ── */}
      <div
        className="px-6 py-8"
        style={{ background: 'linear-gradient(135deg, #714B67 0%, #9C6B8E 100%)' }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">
              Selamat datang, {user?.name ?? 'Admin'} 👋
            </h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,.7)' }}>
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-3">
            {[
              { label: 'Modul', value: totalModules },
              { label: 'Kategori', value: MODULE_CATEGORIES.length },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center px-5 py-3 rounded-xl"
                style={{ backgroundColor: 'rgba(255,255,255,.14)', backdropFilter: 'blur(4px)' }}
              >
                <span className="text-2xl font-bold text-white">{s.value}</span>
                <span className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,.7)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div
        className="sticky top-14 z-20 px-6 py-3"
        style={{ backgroundColor: '#F5F4F9', borderBottom: '1px solid #EDE8F5' }}
      >
        <div className="max-w-5xl mx-auto relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#B0AAB9' }} />
          <input
            className="w-full max-w-sm rounded-lg pl-10 pr-4 py-2.5 text-sm transition-all"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #EDE8F5',
              color: '#433C50',
              boxShadow: '0 1px 4px rgba(47,43,61,.06)',
              outline: 'none',
            }}
            placeholder="Cari modul..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={(e) => { e.target.style.borderColor = '#714B67'; }}
            onBlur={(e) => { e.target.style.borderColor = '#EDE8F5'; }}
          />
        </div>
      </div>

      {/* ── Module grid ── */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20" style={{ color: '#B0AAB9' }}>
            <Search className="h-12 w-12 mb-4 opacity-30" />
            <p className="font-semibold text-base">Modul tidak ditemukan</p>
            <p className="text-sm mt-1">Coba kata kunci yang berbeda</p>
          </div>
        ) : (
          filtered.map((cat) => (
            <section key={cat.category}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#A5A3AE' }}>
                  {cat.category}
                </h2>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#EDE8F5', color: '#714B67' }}
                >
                  {cat.modules.length} modul
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {cat.modules.map((mod) => (
                  <ModuleCard key={mod.href} mod={mod} />
                ))}
              </div>
            </section>
          ))
        )}

        {/* Quick link to install */}
        {!q && (
          <div
            className="flex items-center justify-between rounded-2xl px-6 py-4"
            style={{ backgroundColor: 'rgba(113,75,103,.06)', border: '1.5px dashed rgba(113,75,103,.25)' }}
          >
            <div>
              <p className="text-sm font-semibold" style={{ color: '#714B67' }}>Belum menemukan modul yang Anda cari?</p>
              <p className="text-xs mt-0.5" style={{ color: '#B0AAB9' }}>Aktifkan modul tambahan dari halaman Kelola Modul</p>
            </div>
            <a
              href="/install"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 flex-shrink-0"
              style={{ backgroundColor: '#714B67' }}
            >
              Kelola Modul
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
