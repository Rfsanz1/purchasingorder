'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import { useModulesStore } from '../../lib/store/useModulesStore';
import { MODULES, MODULE_CATEGORIES, ERP_Module } from '../../lib/modules-registry';
import {
  Search, Star, Download, Trash2, CheckCircle, ArrowLeft,
  Zap, Package, Globe, LayoutGrid, Filter, X,
} from 'lucide-react';
import Link from 'next/link';

const PROTECTED = ['settings', 'access'];

const CATEGORY_ICONS: Record<string, string> = {
  'Semua': '⊞',
  'Website': '🌐',
  'Sales': '💰',
  'Keuangan': '💳',
  'Layanan': '🛠',
  'Produktivitas': '📚',
  'Supply Chain': '📦',
  'Marketing': '📢',
  'SDM': '👥',
  'Sistem': '⚙️',
};

export default function AppStorePage() {
  const { token } = useAuthStore();
  const { installed, install, uninstall, hydrate } = useModulesStore();
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState('Semua');
  const [query, setQuery] = useState('');
  const [installing, setInstalling] = useState<string | null>(null);
  const [detail, setDetail] = useState<ERP_Module | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    hydrate();
    setMounted(true);
  }, [token]);

  const filtered = useMemo(() => {
    return MODULES.filter(m => {
      const matchCat = activeCategory === 'Semua' || m.category === activeCategory;
      const q = query.toLowerCase();
      const matchQ = !q || m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [activeCategory, query]);

  const featured = useMemo(() => MODULES.filter(m => m.featured), []);

  const handleInstall = async (mod: ERP_Module) => {
    setInstalling(mod.id);
    await new Promise(r => setTimeout(r, 900));
    install(mod.id, mod.deps);
    setInstalling(null);
  };

  const handleUninstall = (mod: ERP_Module) => {
    if (PROTECTED.includes(mod.id)) return;
    uninstall(mod.id);
  };

  if (!mounted) return null;

  const isInstalled = (id: string) => installed.includes(id);

  const counts = MODULE_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = cat === 'Semua' ? MODULES.length : MODULES.filter(m => m.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F4F9' }}>
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-white border-b px-6 py-3.5 flex items-center gap-4" style={{ borderColor: '#EDE8F5' }}>
        <Link href="/" className="flex items-center gap-2 text-xs font-semibold transition-colors" style={{ color: '#A5A3AE' }}>
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
        <div className="flex items-center gap-2 ml-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
            <LayoutGrid className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: '#2F2B3D' }}>App Store</p>
            <p className="text-[11px]" style={{ color: '#A5A3AE' }}>Gentong Mas ERP</p>
          </div>
        </div>
        <div className="flex-1 max-w-sm ml-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#A5A3AE' }} />
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Cari modul ERP..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border bg-gray-50 focus:outline-none focus:ring-2"
            style={{ borderColor: '#EDE8F5', focusRingColor: '#7C3AED' }}
          />
          {query && <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="h-3.5 w-3.5" style={{ color: '#A5A3AE' }} /></button>}
        </div>
        <div className="flex items-center gap-2 text-xs font-medium" style={{ color: '#A5A3AE' }}>
          <CheckCircle className="h-4 w-4" style={{ color: '#4CAF50' }} />
          {installed.length} terinstal
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* Hero */}
        {!query && activeCategory === 'Semua' && (
          <div className="rounded-2xl p-6 flex items-center justify-between overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 50%, #3730A3 100%)' }}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-20 h-32 w-32 rounded-full border-2 border-white" />
              <div className="absolute -bottom-4 right-40 h-20 w-20 rounded-full border-2 border-white" />
              <div className="absolute top-0 right-8 h-48 w-48 rounded-full border border-white" />
            </div>
            <div className="relative">
              <h1 className="text-2xl font-bold text-white mb-1">App Store ERP</h1>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,.8)' }}>Install modul yang Anda butuhkan. Bayar sesuai pemakaian.</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="text-center">
                  <p className="text-xl font-bold text-white">{MODULES.length}</p>
                  <p className="text-[11px]" style={{ color: 'rgba(255,255,255,.7)' }}>Total Modul</p>
                </div>
                <div className="h-8 border-l" style={{ borderColor: 'rgba(255,255,255,.2)' }} />
                <div className="text-center">
                  <p className="text-xl font-bold text-white">{installed.length}</p>
                  <p className="text-[11px]" style={{ color: 'rgba(255,255,255,.7)' }}>Terinstal</p>
                </div>
                <div className="h-8 border-l" style={{ borderColor: 'rgba(255,255,255,.2)' }} />
                <div className="text-center">
                  <p className="text-xl font-bold text-white">{MODULE_CATEGORIES.length - 1}</p>
                  <p className="text-[11px]" style={{ color: 'rgba(255,255,255,.7)' }}>Kategori</p>
                </div>
              </div>
            </div>
            <div className="relative hidden md:grid grid-cols-4 gap-2">
              {featured.slice(0, 8).map(m => {
                const Icon = m.icon;
                return (
                  <div key={m.id} className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: m.bgColor }}>
                    <Icon className="h-5 w-5" style={{ color: m.color }} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {MODULE_CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="flex items-center gap-1.5 flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                backgroundColor: activeCategory === cat ? '#7C3AED' : '#fff',
                color: activeCategory === cat ? '#fff' : '#6D6777',
                border: `1.5px solid ${activeCategory === cat ? '#7C3AED' : '#EDE8F5'}`,
              }}
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              {cat}
              <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold" style={{ backgroundColor: activeCategory === cat ? 'rgba(255,255,255,.2)' : '#F5F4F9', color: activeCategory === cat ? '#fff' : '#A5A3AE' }}>
                {counts[cat]}
              </span>
            </button>
          ))}
        </div>

        {/* Featured */}
        {!query && activeCategory === 'Semua' && (
          <div>
            <h2 className="text-sm font-bold mb-3" style={{ color: '#2F2B3D' }}>⭐ Modul Unggulan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {featured.map(m => {
                const Icon = m.icon;
                const installed_ = isInstalled(m.id);
                const installing_ = installing === m.id;
                return (
                  <div key={m.id} onClick={() => setDetail(m)}
                    className="bg-white rounded-2xl p-4 border cursor-pointer hover:shadow-md transition-all"
                    style={{ borderColor: '#EDE8F5' }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: m.bgColor }}>
                        <Icon className="h-5 w-5" style={{ color: m.color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate" style={{ color: '#2F2B3D' }}>{m.name}</p>
                        <p className="text-[10px]" style={{ color: '#A5A3AE' }}>{m.category}</p>
                      </div>
                    </div>
                    <p className="text-[11px] line-clamp-2 mb-3" style={{ color: '#6D6777' }}>{m.desc}</p>
                    <button
                      onClick={e => { e.stopPropagation(); installed_ ? handleUninstall(m) : handleInstall(m); }}
                      disabled={installing_ || PROTECTED.includes(m.id)}
                      className="w-full py-2 rounded-xl text-[11px] font-semibold transition-all"
                      style={{
                        backgroundColor: installed_ ? '#F5F4F9' : m.color,
                        color: installed_ ? '#A5A3AE' : '#fff',
                      }}
                    >
                      {installing_ ? '⏳ Menginstall...' : installed_ ? '✓ Terinstal' : '+ Install'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All modules grid */}
        <div>
          {(query || activeCategory !== 'Semua') && (
            <p className="text-xs font-semibold mb-3" style={{ color: '#A5A3AE' }}>
              {filtered.length} modul ditemukan{query ? ` untuk "${query}"` : ` di ${activeCategory}`}
            </p>
          )}
          {!query && activeCategory === 'Semua' && <h2 className="text-sm font-bold mb-3" style={{ color: '#2F2B3D' }}>Semua Modul</h2>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map(m => {
              const Icon = m.icon;
              const installed_ = isInstalled(m.id);
              const installing_ = installing === m.id;
              const isProtected = PROTECTED.includes(m.id);
              return (
                <div key={m.id} className="bg-white rounded-2xl border hover:shadow-md transition-all overflow-hidden cursor-pointer"
                  style={{ borderColor: installed_ ? m.color + '40' : '#EDE8F5' }}
                  onClick={() => setDetail(m)}
                >
                  {installed_ && !isProtected && (
                    <div className="h-0.5 w-full" style={{ backgroundColor: m.color }} />
                  )}
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: m.bgColor }}>
                        <Icon className="h-6 w-6" style={{ color: m.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold truncate" style={{ color: '#2F2B3D' }}>{m.name}</p>
                          {m.featured && <span className="text-[8px] px-1 py-0.5 rounded font-bold" style={{ backgroundColor: '#FFF8E1', color: '#F9A825' }}>TOP</span>}
                        </div>
                        <p className="text-[10px] mt-0.5" style={{ color: '#A5A3AE' }}>{m.category} · v{m.version}</p>
                      </div>
                    </div>
                    <p className="text-[11px] line-clamp-2 mb-3" style={{ color: '#6D6777', lineHeight: '1.5' }}>{m.desc}</p>
                    <div className="flex items-center justify-between text-[10px] mb-3" style={{ color: '#A5A3AE' }}>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3" style={{ color: '#F9A825', fill: '#F9A825' }} />{m.rating}</span>
                      <span>{m.installs} install</span>
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (isProtected) return;
                        installed_ ? handleUninstall(m) : handleInstall(m);
                      }}
                      disabled={installing_ || isProtected}
                      className="w-full py-2 rounded-xl text-[11px] font-semibold transition-all"
                      style={{
                        backgroundColor: isProtected ? '#F5F4F9' : installed_ ? 'rgba(234,84,85,.08)' : m.bgColor,
                        color: isProtected ? '#C0BBCA' : installed_ ? '#EA5455' : m.color,
                        border: `1.5px solid ${isProtected ? '#EDE8F5' : installed_ ? 'rgba(234,84,85,.2)' : m.color + '30'}`,
                      }}
                    >
                      {isProtected ? '🔒 Core' : installing_ ? '⏳ Menginstall...' : installed_ ? '× Uninstall' : '+ Install'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl mb-4" style={{ backgroundColor: '#F5F4F9' }}>
                <Search className="h-8 w-8" style={{ color: '#C0BBCA' }} />
              </div>
              <p className="font-semibold" style={{ color: '#6D6777' }}>Modul tidak ditemukan</p>
              <p className="text-sm mt-1" style={{ color: '#A5A3AE' }}>Coba kata kunci lain atau pilih kategori berbeda</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,.5)' }} onClick={() => setDetail(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b" style={{ borderColor: '#EDE8F5', background: `linear-gradient(135deg, ${detail.bgColor}, ${detail.bgColor}88)` }}>
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl flex-shrink-0" style={{ backgroundColor: detail.bgColor }}>
                  <detail.icon className="h-7 w-7" style={{ color: detail.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold" style={{ color: '#2F2B3D' }}>{detail.name}</h2>
                  <p className="text-xs mt-0.5" style={{ color: '#6D6777' }}>{detail.category} · v{detail.version}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: '#A5A3AE' }}>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3" style={{ color: '#F9A825', fill: '#F9A825' }} />{detail.rating}</span>
                    <span>{detail.installs} install</span>
                    {detail.featured && <span className="px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: '#FFF8E1', color: '#F9A825' }}>⭐ Featured</span>}
                  </div>
                </div>
                <button onClick={() => setDetail(null)} className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/50 transition-colors">
                  <X className="h-5 w-5" style={{ color: '#A5A3AE' }} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: '#6D6777' }}>{detail.longDesc}</p>
              {detail.deps.length > 0 && (
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#A5A3AE' }}>Memerlukan modul:</p>
                  <div className="flex flex-wrap gap-2">
                    {detail.deps.map(dep => {
                      const depMod = MODULES.find(m => m.id === dep);
                      return (
                        <span key={dep} className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#F5F4F9', color: '#6D6777' }}>
                          {depMod ? <depMod.icon className="h-3 w-3" /> : <Package className="h-3 w-3" />}
                          {depMod?.name ?? dep}
                          {isInstalled(dep) && <CheckCircle className="h-3 w-3" style={{ color: '#4CAF50' }} />}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              {detail.href && isInstalled(detail.id) && (
                <Link href={detail.href} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center border transition-all" style={{ borderColor: detail.color, color: detail.color }}>
                  Buka Modul
                </Link>
              )}
              {!PROTECTED.includes(detail.id) && (
                <button
                  onClick={() => { isInstalled(detail.id) ? handleUninstall(detail) : handleInstall(detail); setDetail(null); }}
                  disabled={installing === detail.id}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all text-white"
                  style={{ backgroundColor: isInstalled(detail.id) ? '#EA5455' : detail.color }}
                >
                  {installing === detail.id ? 'Menginstall...' : isInstalled(detail.id) ? 'Uninstall' : 'Install Sekarang'}
                </button>
              )}
              {PROTECTED.includes(detail.id) && (
                <div className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center" style={{ backgroundColor: '#F5F4F9', color: '#A5A3AE' }}>
                  🔒 Modul Inti (tidak bisa dihapus)
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
