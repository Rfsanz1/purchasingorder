'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../lib/store/useAuthStore';
import { useModulesStore } from '../lib/store/useModulesStore';
import { MODULES, MODULE_CATEGORIES } from '../lib/modules-registry';
import {
  LogOut, Bell, Settings, Search, LayoutGrid, ChevronDown,
  Building2, Globe, Command, X, TrendingUp, Clock, Menu,
} from 'lucide-react';


const RECENT_ROUTES = [
  { name: 'Dashboard Penjualan', href: '/sales',       time: '2 mnt lalu' },
  { name: 'Inventaris',          href: '/inventory',   time: '15 mnt lalu' },
  { name: 'Marketplace',         href: '/marketplace', time: '1 jam lalu' },
];

export default function Dashboard() {
  const { token, user, logout, loadProfile } = useAuthStore();
  const { installed, hydrate } = useModulesStore();
  const router = useRouter();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [branch, setBranch] = useState('Pusat - Jakarta');

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    hydrate();
    loadProfile().catch(() => {});
    setMounted(true);

    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [token]);

  const installedModules = useMemo(
    () => MODULES.filter(m => installed.includes(m.id)),
    [installed, mounted],
  );


  const searchResults = useMemo(() => {
    if (!searchQuery) return installedModules.slice(0, 6);
    const q = searchQuery.toLowerCase();
    return MODULES.filter(m => m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q)).slice(0, 8);
  }, [searchQuery, installedModules]);

  if (!mounted) return null;

  const displayName = user?.name ?? user?.email?.split('@')[0] ?? 'Admin';
  const initials = displayName.charAt(0).toUpperCase();

  const NOTIFS = [
    { msg: '7 error sync Marketplace perlu diperhatikan', time: '5 mnt lalu', color: '#EA5455', dot: true },
    { msg: 'Stok Samsung S24 Ultra menipis (2 pcs tersisa)', time: '32 mnt lalu', color: '#FF9800', dot: true },
    { msg: 'Invoice INV-2026-0842 jatuh tempo hari ini', time: '1 jam lalu', color: '#2196F3', dot: false },
    { msg: '12 tiket helpdesk belum ditangani', time: '2 jam lalu', color: '#9C27B0', dot: false },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F4F9' }}>
      {/* Topbar */}
      <header className="sticky top-0 z-40 bg-white border-b px-6 py-3" style={{ borderColor: '#EDE8F5' }}>
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl text-white font-black text-sm select-none" style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>G</div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-none" style={{ color: '#2F2B3D' }}>Gentong Mas</p>
              <p className="text-[10px]" style={{ color: '#A5A3AE' }}>Enterprise ERP</p>
            </div>
          </div>

          {/* Branch selector */}
          <button className="hidden md:flex items-center gap-2 pl-3 pr-3 py-1.5 rounded-xl text-xs border font-medium transition-colors hover:bg-gray-50" style={{ borderColor: '#EDE8F5', color: '#6D6777' }}>
            <Building2 className="h-3.5 w-3.5" style={{ color: '#7C3AED' }} />
            {branch}
            <ChevronDown className="h-3 w-3" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-xs relative hidden md:block">
            <button onClick={() => setSearchOpen(true)} className="flex w-full items-center gap-2 pl-3 pr-3 py-2 rounded-xl text-xs border bg-gray-50 text-left" style={{ borderColor: '#EDE8F5', color: '#A5A3AE' }}>
              <Search className="h-3.5 w-3.5" />
              <span>Cari modul, fitur...</span>
              <span className="ml-auto flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: '#EDE8F5', color: '#A5A3AE' }}>⌘K</span>
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* App Store button */}
            <Link href="/apps" className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all hover:bg-purple-50" style={{ borderColor: '#7C3AED', color: '#7C3AED' }}>
              <LayoutGrid className="h-3.5 w-3.5" /> App Store
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); }} className="relative flex h-8 w-8 items-center justify-center rounded-xl border transition-all hover:bg-gray-50" style={{ borderColor: '#EDE8F5' }}>
                <Bell className="h-4 w-4" style={{ color: '#6D6777' }} />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full border-2 border-white" style={{ backgroundColor: '#EA5455' }} />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-xl border z-50 overflow-hidden" style={{ borderColor: '#EDE8F5' }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#EDE8F5' }}>
                    <p className="text-sm font-bold" style={{ color: '#2F2B3D' }}>Notifikasi</p>
                    <button className="text-[11px] font-semibold" style={{ color: '#7C3AED' }}>Tandai semua dibaca</button>
                  </div>
                  <div className="divide-y" style={{ borderColor: '#EDE8F5' }}>
                    {NOTIFS.map((n, i) => (
                      <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl mt-0.5" style={{ backgroundColor: n.color + '15' }}>
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: n.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs" style={{ color: '#2F2B3D' }}>{n.msg}</p>
                          <p className="text-[10px] mt-0.5" style={{ color: '#A5A3AE' }}>{n.time}</p>
                        </div>
                        {n.dot && <div className="h-2 w-2 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: n.color }} />}
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 text-center">
                    <Link href="/notifications" className="text-xs font-semibold" style={{ color: '#7C3AED' }}>Lihat semua notifikasi</Link>
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }} className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl border transition-all hover:bg-gray-50" style={{ borderColor: '#EDE8F5' }}>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>{initials}</div>
                <span className="hidden sm:block text-xs font-semibold" style={{ color: '#2F2B3D' }}>{displayName}</span>
                <ChevronDown className="h-3.5 w-3.5" style={{ color: '#A5A3AE' }} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-10 w-52 bg-white rounded-2xl shadow-xl border z-50 overflow-hidden" style={{ borderColor: '#EDE8F5' }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: '#EDE8F5' }}>
                    <p className="text-sm font-bold" style={{ color: '#2F2B3D' }}>{displayName}</p>
                    <p className="text-[11px]" style={{ color: '#A5A3AE' }}>{user?.email ?? 'admin@gentongmas.id'}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-gray-50 transition-colors" style={{ color: '#6D6777' }}>
                      <Settings className="h-4 w-4" /> Pengaturan
                    </Link>
                    <button onClick={() => { logout(); router.push('/login'); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-xs hover:bg-red-50 transition-colors" style={{ color: '#EA5455' }}>
                      <LogOut className="h-4 w-4" /> Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Command palette */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4" style={{ backgroundColor: 'rgba(0,0,0,.5)' }} onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3.5 border-b" style={{ borderColor: '#EDE8F5' }}>
              <Search className="h-4 w-4 flex-shrink-0" style={{ color: '#A5A3AE' }} />
              <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Cari modul, fitur, atau halaman..." className="flex-1 text-sm bg-transparent focus:outline-none" style={{ color: '#2F2B3D' }} />
              <button onClick={() => setSearchOpen(false)} className="flex-shrink-0 text-[11px] px-2 py-1 rounded font-mono" style={{ backgroundColor: '#F5F4F9', color: '#A5A3AE' }}>ESC</button>
            </div>
            {!searchQuery && (
              <div className="px-4 pt-3 pb-1">
                <p className="text-[11px] font-semibold mb-2" style={{ color: '#A5A3AE' }}>Terakhir dikunjungi</p>
                {RECENT_ROUTES.map(r => (
                  <Link key={r.href} href={r.href} onClick={() => setSearchOpen(false)} className="flex items-center gap-3 py-2.5 rounded-xl px-2 hover:bg-gray-50 transition-colors">
                    <Clock className="h-4 w-4 flex-shrink-0" style={{ color: '#A5A3AE' }} />
                    <span className="text-xs font-medium" style={{ color: '#2F2B3D' }}>{r.name}</span>
                    <span className="ml-auto text-[10px]" style={{ color: '#A5A3AE' }}>{r.time}</span>
                  </Link>
                ))}
              </div>
            )}
            <div className="px-4 pb-4">
              {searchQuery && <p className="text-[11px] font-semibold mb-2 mt-3" style={{ color: '#A5A3AE' }}>Hasil pencarian</p>}
              {!searchQuery && <p className="text-[11px] font-semibold mb-2 mt-3" style={{ color: '#A5A3AE' }}>Modul terinstal</p>}
              {searchResults.map(m => {
                const Icon = m.icon;
                return (
                  <Link key={m.id} href={m.href ?? '/apps'} onClick={() => setSearchOpen(false)} className="flex items-center gap-3 py-2.5 rounded-xl px-2 hover:bg-gray-50 transition-colors">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: m.bgColor }}>
                      <Icon className="h-4 w-4" style={{ color: m.color }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: '#2F2B3D' }}>{m.name}</p>
                      <p className="text-[10px]" style={{ color: '#A5A3AE' }}>{m.desc}</p>
                    </div>
                    {!installed.includes(m.id) && <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(124,58,237,.1)', color: '#7C3AED' }}>Install</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8" onClick={() => { setUserMenuOpen(false); setNotifOpen(false); }}>
        {/* Welcome banner */}
        <div className="rounded-2xl p-6 flex items-center justify-between overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 60%, #3730A3 100%)' }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-24 h-24 w-24 rounded-full border-2 border-white" />
            <div className="absolute -bottom-4 right-48 h-16 w-16 rounded-full border border-white" />
          </div>
          <div className="relative">
            <p className="text-sm font-medium mb-0.5" style={{ color: 'rgba(255,255,255,.75)' }}>Selamat datang kembali,</p>
            <h1 className="text-2xl font-bold text-white">{displayName} 👋</h1>
            <p className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,.7)' }}>Gentong Mas ERP · {installed.length} modul aktif · {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="relative hidden md:flex items-center gap-3">
            <div className="text-center bg-white/10 rounded-xl px-4 py-2.5">
              <p className="text-lg font-bold text-white">Rp 4.2 M</p>
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,.7)' }}>Revenue Hari Ini</p>
            </div>
            <div className="text-center bg-white/10 rounded-xl px-4 py-2.5">
              <p className="text-lg font-bold text-white">547</p>
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,.7)' }}>Order Hari Ini</p>
            </div>
          </div>
        </div>

        {/* Installed modules */}
        {installedModules.length === 0 ? (
          <div className="bg-white rounded-2xl border p-12 text-center" style={{ borderColor: '#EDE8F5' }}>
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
              <LayoutGrid className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-base font-bold mb-2" style={{ color: '#2F2B3D' }}>Mulai dengan menginstall modul</h2>
            <p className="text-sm mb-6" style={{ color: '#A5A3AE' }}>Kunjungi App Store untuk install modul ERP yang Anda butuhkan</p>
            <Link href="/apps" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
              <LayoutGrid className="h-4 w-4" /> Buka App Store
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold" style={{ color: '#2F2B3D' }}>Modul Terinstal</h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: '#EDE9FE', color: '#7C3AED' }}>{installedModules.length}</span>
              </div>
              <Link href="/apps" className="text-xs font-semibold" style={{ color: '#7C3AED' }}>+ Tambah Modul</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {installedModules.map(m => {
                const dest = m.href ?? '/apps';
                return (
                  <Link key={m.id} href={dest} className="bg-white rounded-2xl border p-4 flex flex-col items-center text-center gap-2.5 hover:shadow-md hover:-translate-y-0.5 transition-all group" style={{ borderColor: '#EDE8F5', borderTopColor: m.color, borderTopWidth: 2 }}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition-transform group-hover:scale-110" style={{ background: m.gradient }}>
                      {m.emoji}
                    </div>
                    <div className="w-full">
                      <p className="text-[11px] font-bold leading-snug" style={{ color: '#2F2B3D' }}>{m.name}</p>
                      <p className="text-[9px] mt-0.5 line-clamp-2" style={{ color: '#A5A3AE' }}>{m.desc}</p>
                    </div>
                  </Link>
                );
              })}
              {/* Add more tile */}
              <Link href="/apps" className="bg-white rounded-2xl border border-dashed p-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-purple-50 transition-all" style={{ borderColor: '#C4B5FD' }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: '#EDE9FE' }}>
                  <LayoutGrid className="h-6 w-6" style={{ color: '#7C3AED' }} />
                </div>
                <p className="text-[11px] font-bold" style={{ color: '#7C3AED' }}>App Store</p>
                <p className="text-[9px]" style={{ color: '#A5A3AE' }}>{MODULES.length - installedModules.length} modul lagi</p>
              </Link>
            </div>
          </div>
        )}

        {/* Quick links bottom */}
        <div className="flex items-center justify-between pt-2">
          <Link href="/apps" className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl border hover:bg-purple-50 transition-all" style={{ borderColor: '#7C3AED', color: '#7C3AED' }}>
            <LayoutGrid className="h-3.5 w-3.5" /> App Store ({MODULES.length - installed.length} belum terinstal)
          </Link>
          <Link href="/settings" className="flex items-center gap-2 text-xs font-medium hover:underline" style={{ color: '#A5A3AE' }}>
            <Settings className="h-3.5 w-3.5" /> Pengaturan
          </Link>
        </div>
      </div>
    </div>
  );
}
