'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/store/useAuthStore';
import { useModulesStore } from '../lib/store/useModulesStore';
import {
  ShoppingCart, Users, Package, FileText, DollarSign, Truck,
  BarChart2, Settings, ShieldCheck, Monitor, UserCheck, LogOut,
  Bell, Grid, ChevronDown, Lock, Store, Globe, Car, Factory,
  Award, Wrench, MessageSquare, Layers, HeartHandshake,
  Building2, Clock, BookOpen,
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

const ALL_APPS: App[] = [
  { id: 'sales',        name: 'Penjualan',       desc: 'Order & penawaran',        href: '/sales',           icon: ShoppingCart,  color: '#00BCD4', gradient: 'from-cyan-400 to-cyan-600',       category: 'Penjualan' },
  { id: 'crm',          name: 'CRM',              desc: 'Prospek & pelanggan',      href: '/crm',             icon: Users,         color: '#9C27B0', gradient: 'from-purple-400 to-purple-600',   category: 'Penjualan' },
  { id: 'pos',          name: 'Kasir (POS)',      desc: 'Kasir & transaksi',        href: '/pos',             icon: Monitor,       color: '#FF5722', gradient: 'from-orange-400 to-orange-600',   category: 'Penjualan' },
  { id: 'ecommerce',    name: 'E-Commerce',       desc: 'Toko online',              href: '/ecommerce',       icon: Globe,         color: '#00897B', gradient: 'from-teal-500 to-emerald-600',    category: 'Penjualan' },
  { id: 'invoice',      name: 'Invoice',          desc: 'Tagihan & faktur',         href: '/invoice',         icon: FileText,      color: '#2196F3', gradient: 'from-blue-400 to-blue-600',       category: 'Keuangan' },
  { id: 'accounting',   name: 'Akuntansi',        desc: 'Jurnal, COA & kas',        href: '/accounting',      icon: DollarSign,    color: '#4CAF50', gradient: 'from-green-500 to-emerald-600',   category: 'Keuangan' },
  { id: 'inventory',    name: 'Inventaris',       desc: 'Stok, gudang & produk',    href: '/inventory',       icon: Package,       color: '#FF9800', gradient: 'from-amber-400 to-orange-500',    category: 'Operasional' },
  { id: 'purchase',     name: 'Pembelian',        desc: 'PO & supplier',            href: '/purchasing',      icon: Truck,         color: '#795548', gradient: 'from-stone-400 to-stone-600',     category: 'Operasional' },
  { id: 'fleet',        name: 'Armada',           desc: 'Kendaraan & pengiriman',   href: '/fleet',           icon: Car,           color: '#009688', gradient: 'from-teal-400 to-teal-600',       category: 'Operasional' },
  { id: 'hr',           name: 'Karyawan',         desc: 'SDM & profil karyawan',    href: '/hr',              icon: UserCheck,     color: '#E91E63', gradient: 'from-pink-400 to-rose-500',       category: 'SDM' },
  { id: 'payroll',      name: 'Penggajian',       desc: 'Gaji & slip gaji',         href: '/payroll',         icon: DollarSign,    color: '#673AB7', gradient: 'from-purple-500 to-purple-700',   category: 'SDM' },
  { id: 'attendance',   name: 'Kehadiran',        desc: 'Absensi & jam kerja',      href: '/hr/attendances',  icon: Clock,         color: '#009688', gradient: 'from-teal-400 to-teal-600',       category: 'SDM' },
  { id: 'leave',        name: 'Cuti & Izin',      desc: 'Manajemen cuti',           href: '/hr/leaves',       icon: BookOpen,      color: '#FF7043', gradient: 'from-orange-400 to-red-500',      category: 'SDM' },
  { id: 'recruitment',  name: 'Rekrutmen',        desc: 'Lowongan & seleksi',       href: '/recruitment',     icon: HeartHandshake, color: '#AD1457', gradient: 'from-pink-600 to-rose-700',      category: 'SDM' },
  { id: 'manufacturing', name: 'Manufaktur',      desc: 'Produksi & BOM',           href: '/manufacturing',   icon: Factory,       color: '#546E7A', gradient: 'from-slate-500 to-slate-700',     category: 'Produksi' },
  { id: 'quality',      name: 'Kualitas',         desc: 'QC & inspeksi',            href: '/quality',         icon: Award,         color: '#1976D2', gradient: 'from-blue-600 to-blue-800',       category: 'Produksi' },
  { id: 'maintenance',  name: 'Pemeliharaan',     desc: 'Servis mesin & aset',      href: '/maintenance',     icon: Wrench,        color: '#F57F17', gradient: 'from-amber-500 to-amber-700',     category: 'Produksi' },
  { id: 'helpdesk',     name: 'Helpdesk',         desc: 'Tiket & support',          href: '/helpdesk',        icon: MessageSquare, color: '#E53935', gradient: 'from-red-500 to-red-700',         category: 'Layanan' },
  { id: 'project',      name: 'Proyek',           desc: 'Tugas & milestone',        href: '/project',         icon: Layers,        color: '#5C6BC0', gradient: 'from-indigo-500 to-indigo-700',   category: 'Layanan' },
  { id: 'kledo',        name: 'Integrasi Kledo',  desc: 'Sinkronisasi akuntansi',   href: '/kledo',           icon: Building2,     color: '#1565C0', gradient: 'from-blue-700 to-blue-900',       category: 'Integrasi' },
  { id: 'reports',      name: 'Laporan & BI',     desc: 'Analitik & dashboard',     href: '/reports',         icon: BarChart2,     color: '#607D8B', gradient: 'from-slate-400 to-slate-600',     category: 'Sistem' },
  { id: 'settings',     name: 'Pengaturan',       desc: 'Konfigurasi sistem',       href: '/settings',        icon: Settings,      color: '#9E9E9E', gradient: 'from-gray-400 to-gray-600',       category: 'Sistem' },
  { id: 'access',       name: 'Akses & Peran',    desc: 'User & permission',        href: '/access',          icon: ShieldCheck,   color: '#F44336', gradient: 'from-red-400 to-red-600',         category: 'Sistem' },
];

export default function AppSwitcher() {
  const { token, user, logout, loadProfile } = useAuthStore();
  const { installed, hydrate } = useModulesStore();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!token) { router.push('/login'); return; }
    hydrate();
    loadProfile();
  }, [mounted, token]);

  if (!mounted || !token) return null;

  // Only show apps that are installed
  const installedApps = ALL_APPS.filter(a => installed.includes(a.id));
  const categories = ['Semua', ...Array.from(new Set(installedApps.map(a => a.category)))];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F4F9' }}>

      {/* ── Topbar ── */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 h-14"
        style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #EDE8F5', boxShadow: '0 1px 0 rgba(47,43,61,.06)' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white font-extrabold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #714B67, #9C6B8E)' }}>
            G
          </div>
          <span className="font-bold text-sm hidden sm:block" style={{ color: '#433C50' }}>Gentong Mas ERP</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg" style={{ color: '#A5A3AE' }}>
            <Bell className="h-5 w-5" />
          </button>
          <a
            href="/apps"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ backgroundColor: 'rgba(113,75,103,.07)', color: '#714B67', border: '1px solid rgba(113,75,103,.15)' }}
          >
            <Store className="h-3.5 w-3.5" />
            App Store
          </a>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(v => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ border: '1px solid #EDE8F5' }}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #714B67, #9C6B8E)' }}>
                {(user?.name ?? 'A').charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium hidden sm:block" style={{ color: '#433C50' }}>{user?.name ?? 'Admin'}</span>
              <ChevronDown className="h-3.5 w-3.5 hidden sm:block" style={{ color: '#A5A3AE' }} />
            </button>
            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 rounded-xl py-1 z-20" style={{ backgroundColor: '#fff', border: '1px solid #EDE8F5', boxShadow: '0 8px 24px rgba(47,43,61,.14)' }}>
                  <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #EDE8F5' }}>
                    <p className="text-xs font-semibold" style={{ color: '#433C50' }}>{user?.name ?? 'Admin'}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: '#A5A3AE' }}>{user?.email}</p>
                  </div>
                  <a href="/apps" className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left" style={{ color: '#714B67' }}>
                    <Store className="h-4 w-4" /> App Store
                  </a>
                  <button
                    onClick={() => { logout(); router.push('/login'); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left"
                    style={{ color: '#EA5455' }}
                  >
                    <LogOut className="h-4 w-4" /> Keluar
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
            {installedApps.length} modul aktif · Pilih aplikasi yang ingin Anda buka
          </p>
        </div>
      </div>

      {/* ── App grid ── */}
      <main className="max-w-5xl mx-auto px-6 sm:px-8 py-8">
        {installedApps.length === 0 ? (
          /* Empty state — no modules installed */
          <div className="flex flex-col items-center py-24 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl mb-6" style={{ backgroundColor: '#EDE8F5' }}>
              <Grid className="h-10 w-10" style={{ color: '#714B67' }} />
            </div>
            <h2 className="text-lg font-bold mb-2" style={{ color: '#433C50' }}>Belum ada modul terinstall</h2>
            <p className="text-sm mb-6" style={{ color: '#A5A3AE' }}>Buka App Store untuk menginstall modul yang Anda butuhkan</p>
            <a
              href="/apps"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: '#714B67' }}
            >
              <Store className="h-4 w-4" /> Buka App Store
            </a>
          </div>
        ) : (
          Object.entries(
            categories.slice(1).reduce<Record<string, App[]>>((acc, cat) => {
              const apps = installedApps.filter(a => a.category === cat);
              if (apps.length) acc[cat] = apps;
              return acc;
            }, {})
          ).map(([cat, apps]) => (
            <section key={cat} className="mb-10">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#A5A3AE' }}>
                {cat}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {apps.map(app => <AppCard key={app.id} app={app} />)}
              </div>
            </section>
          ))
        )}

        {/* App Store CTA */}
        {installedApps.length > 0 && (
          <a
            href="/apps"
            className="flex items-center gap-4 rounded-2xl p-5 mt-4 transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #714B67 0%, #9C6B8E 100%)' }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,.15)' }}>
              <Store className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Tambah lebih banyak modul</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,.7)' }}>Kunjungi App Store untuk install fitur baru</p>
            </div>
            <Lock className="h-4 w-4 ml-auto text-white opacity-60" />
          </a>
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
      style={{ boxShadow: '0 1px 4px rgba(47,43,61,.07)', border: '1.5px solid #EDE8F5' }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-4px)';
        el.style.boxShadow = `0 12px 28px ${app.color}28`;
        el.style.borderColor = app.color;
      }}
      onMouseLeave={e => {
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
