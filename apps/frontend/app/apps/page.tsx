'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import { useModulesStore } from '../../lib/store/useModulesStore';
import {
  MODULES, APP_STORE_CATEGORIES, AppStoreCategory, ERP_Module,
} from '../../lib/modules-registry';
import {
  Search, Star, Download, Trash2, CheckCircle, ArrowLeft,
  Zap, Package, LayoutGrid, X, ChevronRight, Clock, Lock,
  CheckCheck, Sparkles,
} from 'lucide-react';
import Link from 'next/link';

const PROTECTED = ['settings', 'access'];
const BRAND_COLOR = '#7C3AED';
const BRAND_DARK = '#5B21B6';

function StatusBadge({ status, isInstalled, isCore }: { status?: string | null; isInstalled?: boolean; isCore?: boolean }) {
  if (isCore || status === 'core') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: '#EDE9FE', color: '#7C3AED' }}>
        <Lock className="h-2.5 w-2.5" /> Core
      </span>
    );
  }
  if (status === 'coming-soon') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
        <Clock className="h-2.5 w-2.5" /> Coming Soon
      </span>
    );
  }
  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: '#D1FAE5', color: '#059669' }}>
        <CheckCheck className="h-2.5 w-2.5" /> Installed
      </span>
    );
  }
  return null;
}

export default function AppStorePage() {
  const { token } = useAuthStore();
  const { installed, install, uninstall, hydrate } = useModulesStore();
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState<AppStoreCategory | null>(null);
  const [query, setQuery] = useState('');
  const [installing, setInstalling] = useState<string | null>(null);
  const [detail, setDetail] = useState<ERP_Module | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    hydrate();
    setMounted(true);
  }, [token]);

  const searchResults = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return MODULES.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.desc.toLowerCase().includes(q) ||
      m.group.toLowerCase().includes(q)
    );
  }, [query]);

  const categoryModules = useMemo(() => {
    if (!activeCategory) return [];
    return activeCategory.modules
      .map(id => MODULES.find(m => m.id === id))
      .filter(Boolean) as ERP_Module[];
  }, [activeCategory]);

  const handleInstall = async (mod: ERP_Module) => {
    if (mod.status === 'coming-soon' || mod.status === 'core') return;
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

  const totalInstalled = installed.length;

  const getCategoryStats = (cat: AppStoreCategory) => {
    const mods = cat.modules.map(id => MODULES.find(m => m.id === id)).filter(Boolean) as ERP_Module[];
    const installedCount = mods.filter(m => isInstalled(m.id)).length;
    const total = mods.length;
    return { installedCount, total };
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F4F9' }}>

      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white border-b px-4 md:px-6 py-3.5 flex items-center gap-3" style={{ borderColor: '#EDE8F5' }}>
        <Link href="/" className="flex items-center gap-1.5 text-xs font-semibold transition-colors flex-shrink-0" style={{ color: '#A5A3AE' }}>
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        {activeCategory && (
          <button
            onClick={() => setActiveCategory(null)}
            className="flex items-center gap-1.5 text-xs font-semibold transition-colors flex-shrink-0"
            style={{ color: '#A5A3AE' }}
          >
            <ChevronRight className="h-3.5 w-3.5" />
            <span>{activeCategory.name}</span>
          </button>
        )}

        <div className="flex items-center gap-2 ml-1 flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `linear-gradient(135deg, ${BRAND_COLOR}, ${BRAND_DARK})` }}>
            <LayoutGrid className="h-4 w-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold leading-none" style={{ color: '#2F2B3D' }}>App Store</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#A5A3AE' }}>Gentong Mas ERP</p>
          </div>
        </div>

        <div className="flex-1 max-w-md ml-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#A5A3AE' }} />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveCategory(null); }}
            placeholder="Cari modul ERP..."
            className="w-full pl-9 pr-8 py-2 rounded-xl text-xs border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
            style={{ borderColor: '#EDE8F5' }}
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-3.5 w-3.5" style={{ color: '#A5A3AE' }} />
            </button>
          )}
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold flex-shrink-0" style={{ color: '#6D6777' }}>
          <CheckCircle className="h-4 w-4" style={{ color: '#059669' }} />
          {totalInstalled} terinstal
        </div>
      </div>

      {/* Search Results */}
      {query && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <p className="text-xs font-semibold mb-4" style={{ color: '#A5A3AE' }}>
            {searchResults.length} modul ditemukan untuk &ldquo;{query}&rdquo;
          </p>
          {searchResults.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl mb-4" style={{ backgroundColor: '#F5F4F9' }}>
                <Search className="h-8 w-8" style={{ color: '#C0BBCA' }} />
              </div>
              <p className="font-semibold" style={{ color: '#6D6777' }}>Modul tidak ditemukan</p>
              <p className="text-sm mt-1" style={{ color: '#A5A3AE' }}>Coba kata kunci lain</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {searchResults.map(m => (
                <ModuleCard
                  key={m.id}
                  mod={m}
                  isInstalled={isInstalled(m.id)}
                  installing={installing === m.id}
                  onDetail={() => setDetail(m)}
                  onInstall={() => handleInstall(m)}
                  onUninstall={() => handleUninstall(m)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category Detail View */}
      {!query && activeCategory && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          {/* Category Hero */}
          <div className="rounded-2xl p-6 mb-6 text-white relative overflow-hidden" style={{ background: activeCategory.gradient }}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 right-16 h-28 w-28 rounded-full border-2 border-white" />
              <div className="absolute -bottom-4 right-36 h-20 w-20 rounded-full border-2 border-white" />
            </div>
            <div className="relative flex items-center gap-4">
              <div className="text-4xl">{activeCategory.emoji}</div>
              <div>
                <h1 className="text-xl font-bold">{activeCategory.name}</h1>
                <p className="text-sm mt-0.5 opacity-80">{activeCategory.description}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="text-center">
                    <p className="text-lg font-bold">{categoryModules.length}</p>
                    <p className="text-[11px] opacity-70">Total Modul</p>
                  </div>
                  <div className="h-8 border-l border-white/20" />
                  <div className="text-center">
                    <p className="text-lg font-bold">{categoryModules.filter(m => isInstalled(m.id)).length}</p>
                    <p className="text-[11px] opacity-70">Terinstal</p>
                  </div>
                  <div className="h-8 border-l border-white/20" />
                  <div className="text-center">
                    <p className="text-lg font-bold">{categoryModules.filter(m => m.status === 'coming-soon').length}</p>
                    <p className="text-[11px] opacity-70">Coming Soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categoryModules.map(m => (
              <ModuleCard
                key={m.id}
                mod={m}
                isInstalled={isInstalled(m.id)}
                installing={installing === m.id}
                onDetail={() => setDetail(m)}
                onInstall={() => handleInstall(m)}
                onUninstall={() => handleUninstall(m)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Category Grid */}
      {!query && !activeCategory && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">

          {/* Hero Banner */}
          <div className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden relative" style={{ background: `linear-gradient(135deg, ${BRAND_COLOR} 0%, ${BRAND_DARK} 50%, #3730A3 100%)` }}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-20 h-32 w-32 rounded-full border-2 border-white" />
              <div className="absolute -bottom-4 right-40 h-20 w-20 rounded-full border-2 border-white" />
              <div className="absolute top-0 right-8 h-48 w-48 rounded-full border border-white" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span className="text-xs font-semibold text-yellow-300 uppercase tracking-wider">Gentong Mas ERP</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">App Store ERP</h1>
              <p className="text-sm md:text-base" style={{ color: 'rgba(255,255,255,.8)' }}>
                Pilih dan install modul yang Anda butuhkan. Bayar sesuai pemakaian.
              </p>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{MODULES.length}</p>
                  <p className="text-[11px]" style={{ color: 'rgba(255,255,255,.7)' }}>Total Modul</p>
                </div>
                <div className="h-8 border-l" style={{ borderColor: 'rgba(255,255,255,.2)' }} />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{totalInstalled}</p>
                  <p className="text-[11px]" style={{ color: 'rgba(255,255,255,.7)' }}>Terinstal</p>
                </div>
                <div className="h-8 border-l" style={{ borderColor: 'rgba(255,255,255,.2)' }} />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{APP_STORE_CATEGORIES.length}</p>
                  <p className="text-[11px]" style={{ color: 'rgba(255,255,255,.7)' }}>Kategori</p>
                </div>
              </div>
            </div>
            <div className="relative hidden md:grid grid-cols-3 gap-2">
              {APP_STORE_CATEGORIES.slice(0, 9).map(cat => (
                <div
                  key={cat.id}
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-xl cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat.emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Category Cards Grid */}
          <div>
            <h2 className="text-sm font-bold mb-4" style={{ color: '#2F2B3D' }}>Pilih Kategori</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {APP_STORE_CATEGORIES.map(cat => {
                const { installedCount, total } = getCategoryStats(cat);
                const percent = total > 0 ? Math.round((installedCount / total) * 100) : 0;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat)}
                    className="text-left bg-white rounded-2xl border p-5 hover:shadow-lg transition-all group relative overflow-hidden"
                    style={{ borderColor: '#EDE8F5' }}
                  >
                    <div className="absolute inset-x-0 bottom-0 h-0.5 transition-all group-hover:h-1" style={{ backgroundColor: cat.color }} />
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl flex-shrink-0 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: cat.bgColor }}
                      >
                        {cat.emoji}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: cat.bgColor, color: cat.color }}>
                        {total} modul
                      </div>
                    </div>
                    <h3 className="text-sm font-bold mb-1 leading-tight" style={{ color: '#2F2B3D' }}>{cat.name}</h3>
                    <p className="text-[11px] leading-relaxed line-clamp-2 mb-3" style={{ color: '#A5A3AE' }}>{cat.description}</p>

                    {/* Progress bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px]" style={{ color: '#A5A3AE' }}>
                        <span>{installedCount} dari {total} terinstal</span>
                        <span className="font-semibold" style={{ color: installedCount > 0 ? cat.color : '#C0BBCA' }}>{percent}%</span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#F5F4F9' }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${percent}%`, backgroundColor: cat.color }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: cat.color }}>
                        Lihat Modul
                        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Access: Recently Featured */}
          <div>
            <h2 className="text-sm font-bold mb-4" style={{ color: '#2F2B3D' }}>
              ⭐ Modul Unggulan
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {MODULES.filter(m => m.featured).slice(0, 8).map(m => {
                const Icon = m.icon;
                const inst = isInstalled(m.id);
                return (
                  <div
                    key={m.id}
                    onClick={() => setDetail(m)}
                    className="bg-white rounded-2xl p-4 border cursor-pointer hover:shadow-md transition-all"
                    style={{ borderColor: inst ? m.color + '50' : '#EDE8F5' }}
                  >
                    {inst && <div className="h-0.5 w-full -mt-4 mb-3 -mx-4 rounded-t-2xl" style={{ backgroundColor: m.color, width: 'calc(100% + 2rem)', marginLeft: '-1rem' }} />}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: m.bgColor }}>
                        <Icon className="h-5 w-5" style={{ color: m.color }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold truncate" style={{ color: '#2F2B3D' }}>{m.name}</p>
                        <StatusBadge isInstalled={inst} isCore={m.isCore} status={m.status} />
                      </div>
                    </div>
                    <p className="text-[11px] line-clamp-2" style={{ color: '#6D6777' }}>{m.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Module Detail Modal */}
      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setDetail(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="p-6 border-b relative" style={{ borderColor: '#EDE8F5', background: `linear-gradient(135deg, ${detail.bgColor}, ${detail.bgColor}66)` }}>
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl flex-shrink-0" style={{ backgroundColor: detail.bgColor, border: `2px solid ${detail.color}30` }}>
                  <detail.icon className="h-7 w-7" style={{ color: detail.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold" style={{ color: '#2F2B3D' }}>{detail.name}</h2>
                  <p className="text-xs mt-0.5" style={{ color: '#6D6777' }}>v{detail.version}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <StatusBadge isInstalled={isInstalled(detail.id)} isCore={detail.isCore} status={detail.status} />
                    <span className="inline-flex items-center gap-1 text-[10px]" style={{ color: '#A5A3AE' }}>
                      <Star className="h-3 w-3" style={{ color: '#F9A825', fill: '#F9A825' }} />
                      {detail.rating}
                    </span>
                    <span className="text-[10px]" style={{ color: '#A5A3AE' }}>{detail.installs} install</span>
                  </div>
                </div>
                <button onClick={() => setDetail(null)} className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/60 transition-colors">
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
                      const depInst = isInstalled(dep);
                      return (
                        <span key={dep} className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#F5F4F9', color: '#6D6777' }}>
                          {depMod ? <depMod.icon className="h-3 w-3" /> : <Package className="h-3 w-3" />}
                          {depMod?.name ?? dep}
                          {depInst && <CheckCircle className="h-3 w-3" style={{ color: '#059669' }} />}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 pb-6 flex gap-3">
              {detail.href && isInstalled(detail.id) && detail.status !== 'coming-soon' && (
                <Link
                  href={detail.href}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center border transition-all"
                  style={{ borderColor: detail.color, color: detail.color }}
                >
                  Buka Modul
                </Link>
              )}
              {detail.status === 'coming-soon' && (
                <div className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
                  🕐 Segera Hadir
                </div>
              )}
              {!PROTECTED.includes(detail.id) && detail.status !== 'coming-soon' && (
                <button
                  onClick={() => {
                    isInstalled(detail.id) ? handleUninstall(detail) : handleInstall(detail);
                    setDetail(null);
                  }}
                  disabled={installing === detail.id}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all text-white"
                  style={{ backgroundColor: isInstalled(detail.id) ? '#DC2626' : detail.color }}
                >
                  {installing === detail.id ? 'Menginstall...' : isInstalled(detail.id) ? 'Uninstall' : 'Install Sekarang'}
                </button>
              )}
              {PROTECTED.includes(detail.id) && (
                <div className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center" style={{ backgroundColor: '#EDE9FE', color: '#7C3AED' }}>
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

function ModuleCard({
  mod,
  isInstalled,
  installing,
  onDetail,
  onInstall,
  onUninstall,
}: {
  mod: ERP_Module;
  isInstalled: boolean;
  installing: boolean;
  onDetail: () => void;
  onInstall: () => void;
  onUninstall: () => void;
}) {
  const Icon = mod.icon;
  const isCore = PROTECTED.includes(mod.id);
  const isComingSoon = mod.status === 'coming-soon';

  return (
    <div
      className="bg-white rounded-2xl border hover:shadow-md transition-all overflow-hidden cursor-pointer"
      style={{ borderColor: isInstalled ? mod.color + '40' : '#EDE8F5' }}
      onClick={onDetail}
    >
      {isInstalled && !isCore && (
        <div className="h-0.5 w-full" style={{ backgroundColor: mod.color }} />
      )}
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: isComingSoon ? '#F5F4F9' : mod.bgColor }}
          >
            <Icon className="h-6 w-6" style={{ color: isComingSoon ? '#C0BBCA' : mod.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate" style={{ color: isComingSoon ? '#A5A3AE' : '#2F2B3D' }}>{mod.name}</p>
            <div className="mt-0.5">
              <StatusBadge isInstalled={isInstalled} isCore={isCore || mod.isCore} status={mod.status} />
            </div>
          </div>
        </div>

        <p className="text-[11px] line-clamp-2 mb-3" style={{ color: '#6D6777', lineHeight: '1.5' }}>{mod.desc}</p>

        <div className="flex items-center justify-between text-[10px] mb-3" style={{ color: '#A5A3AE' }}>
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3" style={{ color: '#F9A825', fill: '#F9A825' }} />
            {mod.rating}
          </span>
          <span>{mod.installs} install</span>
        </div>

        <button
          onClick={e => {
            e.stopPropagation();
            if (isCore || isComingSoon) return;
            isInstalled ? onUninstall() : onInstall();
          }}
          disabled={installing || isCore || isComingSoon}
          className="w-full py-2 rounded-xl text-[11px] font-semibold transition-all"
          style={
            isComingSoon
              ? { backgroundColor: '#FEF3C7', color: '#D97706' }
              : isCore
              ? { backgroundColor: '#EDE9FE', color: '#7C3AED' }
              : isInstalled
              ? { backgroundColor: 'rgba(220,38,38,.08)', color: '#DC2626', border: '1.5px solid rgba(220,38,38,.2)' }
              : { backgroundColor: mod.bgColor, color: mod.color, border: `1.5px solid ${mod.color}30` }
          }
        >
          {isComingSoon
            ? '🕐 Coming Soon'
            : isCore
            ? '🔒 Core'
            : installing
            ? '⏳ Menginstall...'
            : isInstalled
            ? '× Uninstall'
            : '+ Install'}
        </button>
      </div>
    </div>
  );
}
