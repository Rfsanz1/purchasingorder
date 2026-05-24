'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/store/useAuthStore';
import {
  ShoppingCart, Users, Package, FileText, DollarSign, Truck,
  BarChart2, Settings, ShieldCheck, Monitor, UserCheck, LogOut,
  Bell, Search, Grid, ChevronDown,
} from 'lucide-react';

interface App {
  id: string;
  name: string;
  desc: string;
  href: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  category: string;
}

const APPS: App[] = [
  { id: 'sales',       name: 'Penjualan',    desc: 'Order & penawaran',        href: '/sales',        icon: ShoppingCart, color: '#00BCD4', gradient: 'from-cyan-400 to-cyan-600',       category: 'Penjualan' },
  { id: 'crm',         name: 'CRM',           desc: 'Prospek & pelanggan',      href: '/crm',          icon: Users,        color: '#9C27B0', gradient: 'from-purple-400 to-purple-600',   category: 'Penjualan' },
  { id: 'pos',         name: 'Kasir (POS)',   desc: 'Kasir & transaksi',        href: '/pos',          icon: Monitor,      color: '#FF5722', gradient: 'from-orange-400 to-orange-600',   category: 'Penjualan' },
  { id: 'invoice',     name: 'Invoice',       desc: 'Tagihan & faktur',         href: '/invoice',      icon: FileText,     color: '#2196F3', gradient: 'from-blue-400 to-blue-600',       category: 'Keuangan' },
  { id: 'accounting',  name: 'Akuntansi',     desc: 'Jurnal, COA & kas',        href: '/accounting',   icon: DollarSign,   color: '#4CAF50', gradient: 'from-green-500 to-emerald-600',   category: 'Keuangan' },
  { id: 'inventory',   name: 'Inventaris',    desc: 'Stok, gudang & produk',    href: '/inventory',    icon: Package,      color: '#FF9800', gradient: 'from-amber-400 to-orange-500',    category: 'Operasional' },
  { id: 'purchase',    name: 'Pembelian',     desc: 'PO & supplier',            href: '/purchasing',   icon: Truck,        color: '#795548', gradient: 'from-stone-400 to-stone-600',     category: 'Operasional' },
  { id: 'hr',          name: 'Karyawan',      desc: 'SDM & penggajian',         href: '/hr',           icon: UserCheck,    color: '#E91E63', gradient: 'from-pink-400 to-rose-500',       category: 'SDM' },
  { id: 'driver',      name: 'Pengiriman',    desc: 'Driver & logistik',        href: '/driver',       icon: Truck,        color: '#009688', gradient: 'from-teal-400 to-teal-600',       category: 'Operasional' },
  { id: 'reports',     name: 'Laporan',       desc: 'Analitik & laporan',       href: '/reports',      icon: BarChart2,    color: '#607D8B', gradient: 'from-slate-400 to-slate-600',     category: 'Sistem' },
  { id: 'settings',    name: 'Pengaturan',    desc: 'Konfigurasi sistem',       href: '/settings',     icon: Settings,     color: '#9E9E9E', gradient: 'from-gray-400 to-gray-600',       category: 'Sistem' },
  { id: 'access',      name: 'Akses & Peran', desc: 'User & permission',        href: '/access',       icon: ShieldCheck,  color: '#F44336', gradient: 'from-red-400 to-red-600',         category: 'Sistem' },
];

const CATEGORIES = ['Semua', ...Array.from(new Set(APPS.map((a) => a.category)))];

export default function AppSwitcher() {
  const { token, user, logout, loadProfile } = useAuthStore();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!token) { router.push('/login'); return; }
    loadProfile();
  }, [mounted, token]);

  // Render nothing until client is mounted — prevents server/client HTML mismatch
  if (!mounted || !token) return null;

  const filtered = APPS.filter((a) => {
    const matchCat = activeCategory === 'Semua' || a.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const grouped = CATEGORIES.slice(1).reduce<Record<string, App[]>>((acc, cat) => {
    const apps = filtered.filter((a) => a.category === cat);
    if (apps.length) acc[cat] = apps;
    return acc;
  }, {});

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F4F9' }}>

      {/* ── Topbar ── */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 h-14"
        style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #EDE8F5', boxShadow: '0 1px 0 rgba(47,43,61,.06)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white font-extrabold text-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #714B67, #9C6B8E)' }}
          >
            G
          </div>
          <span className="font-bold text-sm hidden sm:block" style={{ color: '#433C50' }}>Gentong Mas ERP</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg" style={{ color: '#A5A3AE' }}>
            <Bell className="h-5 w-5" />
          </button>
          <a
            href="/apps"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ backgroundColor: 'rgba(113,75,103,.07)', color: '#714B67', border: '1px solid rgba(113,75,103,.15)' }}
          >
            <Grid className="h-3.5 w-3.5" />
            App Store
          </a>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ border: '1px solid #EDE8F5' }}
            >
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #714B67, #9C6B8E)' }}
              >
                {(user?.name ?? 'A').charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium hidden sm:block" style={{ color: '#433C50' }}>{user?.name ?? 'Admin'}</span>
              <ChevronDown className="h-3.5 w-3.5 hidden sm:block" style={{ color: '#A5A3AE' }} />
            </button>
            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                <div
                  className="absolute right-0 top-full mt-1 w-48 rounded-xl py-1 z-20"
                  style={{ backgroundColor: '#fff', border: '1px solid #EDE8F5', boxShadow: '0 8px 24px rgba(47,43,61,.14)' }}
                >
                  <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #EDE8F5' }}>
                    <p className="text-xs font-semibold" style={{ color: '#433C50' }}>{user?.name ?? 'Admin'}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: '#A5A3AE' }}>{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { logout(); router.push('/login'); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors"
                    style={{ color: '#EA5455' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(234,84,85,.06)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(135deg, #714B67 0%, #9C6B8E 100%)' }} className="px-6 sm:px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-white">
            Selamat datang, {user?.name ?? 'Admin'} 👋
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,.7)' }}>
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="mt-3 text-sm font-medium" style={{ color: 'rgba(255,255,255,.8)' }}>
            Pilih aplikasi yang ingin Anda buka
          </p>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div
        className="sticky top-14 z-20 px-6 sm:px-8 py-3 flex flex-col sm:flex-row gap-3 sm:items-center"
        style={{ backgroundColor: '#F5F4F9', borderBottom: '1px solid #EDE8F5' }}
      >
        {/* Search */}
        <div className="relative flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#B0AAB9' }} />
          <input
            className="rounded-lg pl-9 pr-4 py-2 text-sm w-full sm:w-56 transition-all"
            style={{ backgroundColor: '#fff', border: '1px solid #EDE8F5', color: '#433C50', outline: 'none' }}
            placeholder="Cari aplikasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={(e) => { e.target.style.borderColor = '#714B67'; }}
            onBlur={(e) => { e.target.style.borderColor = '#EDE8F5'; }}
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: activeCategory === cat ? '#714B67' : '#FFFFFF',
                color: activeCategory === cat ? '#FFFFFF' : '#6D6777',
                border: `1px solid ${activeCategory === cat ? '#714B67' : '#EDE8F5'}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── App grid ── */}
      <main className="max-w-5xl mx-auto px-6 sm:px-8 py-8 space-y-10">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20" style={{ color: '#B0AAB9' }}>
            <Search className="h-12 w-12 mb-4 opacity-30" />
            <p className="font-semibold">Aplikasi tidak ditemukan</p>
          </div>
        ) : activeCategory !== 'Semua' ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {filtered.map((app) => <AppCard key={app.id} app={app} />)}
          </div>
        ) : (
          Object.entries(grouped).map(([cat, apps]) => (
            <section key={cat}>
              <h2
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: '#A5A3AE' }}
              >
                {cat}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {apps.map((app) => <AppCard key={app.id} app={app} />)}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}

function AppCard({ app }: { app: App }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(app.href)}
      className="group flex flex-col items-center gap-3 rounded-2xl bg-white p-5 text-center transition-all duration-200 focus:outline-none w-full"
      style={{
        boxShadow: '0 1px 4px rgba(47,43,61,.07)',
        border: '1.5px solid #EDE8F5',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-4px)';
        el.style.boxShadow = `0 12px 28px ${app.color}28`;
        el.style.borderColor = app.color;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = '0 1px 4px rgba(47,43,61,.07)';
        el.style.borderColor = '#EDE8F5';
      }}
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${app.gradient}`}
        style={{ boxShadow: `0 4px 12px ${app.color}40` }}
      >
        <app.icon className="h-7 w-7 text-white" />
      </div>
      <div>
        <p className="text-xs font-bold leading-tight" style={{ color: '#433C50' }}>{app.name}</p>
        <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: '#B0AAB9' }}>{app.desc}</p>
      </div>
    </button>
  );
}
