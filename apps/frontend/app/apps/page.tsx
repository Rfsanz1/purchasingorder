'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import { useModulesStore } from '../../lib/store/useModulesStore';
import {
  ShoppingCart, Users, Package, FileText, DollarSign, Truck,
  BarChart2, Settings, ShieldCheck, Monitor, UserCheck, Star,
  Search, CheckCircle2, Download, ChevronRight, Zap, Globe,
  Clock, MessageSquare, Wrench, Factory, Award, BookOpen,
  HeartHandshake, Car, Layers, Building2, X, ArrowLeft, LogOut,
} from 'lucide-react';

interface ERPApp {
  id: string;
  name: string;
  desc: string;
  longDesc: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  category: string;
  version: string;
  installs: string;
  rating: number;
  deps: string[];
  featured?: boolean;
  href?: string;
}

const APP_DEFS: ERPApp[] = [
  { id: 'sales', name: 'Penjualan', desc: 'Kelola order & penawaran harga', longDesc: 'Modul penjualan lengkap untuk mengelola order, penawaran, dan pipeline penjualan. Integrasikan dengan inventaris dan akuntansi secara otomatis.', icon: ShoppingCart, color: '#00BCD4', bgColor: '#E0F7FA', category: 'Penjualan', version: '17.0', installs: '12.4K', rating: 4.8, deps: [], featured: true, href: '/sales' },
  { id: 'crm', name: 'CRM', desc: 'Prospek, pipeline & pelanggan', longDesc: 'Kelola hubungan pelanggan, prospek, dan pipeline penjualan dari satu tempat. Lacak setiap interaksi dan tingkatkan konversi.', icon: Users, color: '#9C27B0', bgColor: '#F3E5F5', category: 'Penjualan', version: '17.0', installs: '9.1K', rating: 4.7, deps: ['sales'], featured: true, href: '/crm' },
  { id: 'pos', name: 'Point of Sale', desc: 'Kasir & transaksi toko', longDesc: 'Sistem kasir modern untuk toko fisik. Mendukung barcode, printer struk, dan sinkronisasi stok real-time.', icon: Monitor, color: '#FF5722', bgColor: '#FBE9E7', category: 'Penjualan', version: '17.0', installs: '8.3K', rating: 4.9, deps: ['inventory'], featured: true, href: '/pos' },
  { id: 'invoice', name: 'Invoice', desc: 'Tagihan & faktur otomatis', longDesc: 'Buat, kirim, dan pantau invoice secara otomatis. Dukungan multi-mata uang, pajak, dan pengingat pembayaran.', icon: FileText, color: '#2196F3', bgColor: '#E3F2FD', category: 'Keuangan', version: '17.0', installs: '11.2K', rating: 4.6, deps: ['accounting'], href: '/invoice' },
  { id: 'accounting', name: 'Akuntansi', desc: 'Jurnal, COA & laporan keuangan', longDesc: 'Akuntansi double-entry lengkap dengan Chart of Accounts, jurnal otomatis, rekonsiliasi bank, dan laporan keuangan standar.', icon: DollarSign, color: '#4CAF50', bgColor: '#E8F5E9', category: 'Keuangan', version: '17.0', installs: '10.5K', rating: 4.8, deps: [], featured: true, href: '/accounting' },
  { id: 'inventory', name: 'Inventaris', desc: 'Stok, gudang & produk', longDesc: 'Manajemen stok multi-gudang dengan tracking lot/serial number, FIFO/FEFO, dan peringatan stok minimum otomatis.', icon: Package, color: '#FF9800', bgColor: '#FFF3E0', category: 'Operasional', version: '17.0', installs: '13.8K', rating: 4.9, deps: [], featured: true, href: '/inventory' },
  { id: 'purchase', name: 'Pembelian', desc: 'Purchase Order & supplier', longDesc: 'Kelola pembelian dari permintaan hingga penerimaan barang. Bandingkan penawaran supplier dan otomatisasi PO berulang.', icon: Truck, color: '#795548', bgColor: '#EFEBE9', category: 'Operasional', version: '17.0', installs: '7.6K', rating: 4.5, deps: ['inventory'], href: '/purchasing' },
  { id: 'hr', name: 'Karyawan', desc: 'Profil & data SDM', longDesc: 'Kelola data karyawan, departemen, jabatan, dan dokumen HR dari satu platform yang terintegrasi.', icon: UserCheck, color: '#E91E63', bgColor: '#FCE4EC', category: 'SDM', version: '17.0', installs: '8.9K', rating: 4.7, deps: [], href: '/hr' },
  { id: 'payroll', name: 'Penggajian', desc: 'Gaji, tunjangan & slip gaji', longDesc: 'Hitung gaji otomatis dengan aturan gaji yang fleksibel, tunjangan, potongan, dan integrasi BPJS serta pajak PPh 21.', icon: DollarSign, color: '#673AB7', bgColor: '#EDE7F6', category: 'SDM', version: '17.0', installs: '6.2K', rating: 4.6, deps: ['hr'] },
  { id: 'attendance', name: 'Kehadiran', desc: 'Absensi & jam kerja', longDesc: 'Lacak kehadiran karyawan dengan integrasi mesin fingerprint, aplikasi mobile, dan pelaporan lembur otomatis.', icon: Clock, color: '#009688', bgColor: '#E0F2F1', category: 'SDM', version: '17.0', installs: '5.8K', rating: 4.5, deps: ['hr'] },
  { id: 'leave', name: 'Cuti & Izin', desc: 'Manajemen cuti karyawan', longDesc: 'Kelola pengajuan cuti, persetujuan atasan, saldo cuti, dan jenis cuti sesuai kebijakan perusahaan.', icon: BookOpen, color: '#FF7043', bgColor: '#FBE9E7', category: 'SDM', version: '17.0', installs: '4.9K', rating: 4.4, deps: ['hr', 'attendance'] },
  { id: 'fleet', name: 'Armada', desc: 'Manajemen kendaraan & driver', longDesc: 'Kelola armada kendaraan, jadwal pengiriman, biaya bahan bakar, dan performa driver dalam satu dashboard.', icon: Car, color: '#00ACC1', bgColor: '#E0F7FA', category: 'Operasional', version: '17.0', installs: '3.4K', rating: 4.3, deps: ['hr'], href: '/fleet' },
  { id: 'manufacturing', name: 'Manufaktur', desc: 'BOM, work order & produksi', longDesc: 'Rencanakan dan pantau proses produksi dengan Bill of Materials, work center, dan work order yang terintegrasi dengan inventaris.', icon: Factory, color: '#546E7A', bgColor: '#ECEFF1', category: 'Produksi', version: '17.0', installs: '4.1K', rating: 4.5, deps: ['inventory'], featured: true, href: '/manufacturing' },
  { id: 'quality', name: 'Kontrol Kualitas', desc: 'QC, inspeksi & alert kualitas', longDesc: 'Buat quality control points, jadwalkan inspeksi, dan pantau alert kualitas untuk memastikan standar produk terpenuhi.', icon: Award, color: '#1976D2', bgColor: '#E3F2FD', category: 'Produksi', version: '17.0', installs: '2.8K', rating: 4.4, deps: ['manufacturing'] },
  { id: 'maintenance', name: 'Pemeliharaan', desc: 'Perawatan mesin & aset', longDesc: 'Jadwalkan maintenance preventif, kelola work order perbaikan, dan pantau riwayat perawatan semua aset dan mesin.', icon: Wrench, color: '#F57F17', bgColor: '#FFFDE7', category: 'Produksi', version: '17.0', installs: '2.3K', rating: 4.3, deps: ['manufacturing'] },
  { id: 'helpdesk', name: 'Helpdesk', desc: 'Tiket & dukungan pelanggan', longDesc: 'Kelola tiket dukungan pelanggan dengan SLA, eskalasi otomatis, dan laporan kinerja tim support.', icon: MessageSquare, color: '#E53935', bgColor: '#FFEBEE', category: 'Layanan', version: '17.0', installs: '3.7K', rating: 4.6, deps: ['crm'], href: '/helpdesk' },
  { id: 'project', name: 'Proyek', desc: 'Tugas, milestone & Kanban', longDesc: 'Kelola proyek dengan tampilan Kanban, Gantt, dan list. Lacak kemajuan, deadline, dan beban kerja tim secara real-time.', icon: Layers, color: '#5C6BC0', bgColor: '#E8EAF6', category: 'Layanan', version: '17.0', installs: '5.1K', rating: 4.7, deps: [] },
  { id: 'reports', name: 'Laporan & BI', desc: 'Analitik & dashboard bisnis', longDesc: 'Dashboard bisnis dengan chart interaktif, laporan kustom, dan analitik mendalam untuk semua modul yang terinstal.', icon: BarChart2, color: '#607D8B', bgColor: '#ECEFF1', category: 'Sistem', version: '17.0', installs: '9.3K', rating: 4.8, deps: [], href: '/reports' },
  { id: 'ecommerce', name: 'E-Commerce', desc: 'Toko online & katalog produk', longDesc: 'Buat toko online terintegrasi dengan inventaris dan pembayaran. Kelola produk, harga, dan order dari satu dashboard.', icon: Globe, color: '#00897B', bgColor: '#E0F2F1', category: 'Penjualan', version: '17.0', installs: '4.5K', rating: 4.5, deps: ['inventory', 'sales'] },
  { id: 'recruitment', name: 'Rekrutmen', desc: 'Lowongan & proses seleksi', longDesc: 'Publikasikan lowongan, kelola lamaran, dan pantau proses seleksi dari screening hingga onboarding.', icon: HeartHandshake, color: '#AD1457', bgColor: '#FCE4EC', category: 'SDM', version: '17.0', installs: '2.1K', rating: 4.3, deps: ['hr'], href: '/recruitment' },
  { id: 'kledo', name: 'Integrasi Kledo', desc: 'Sinkronisasi akuntansi Kledo', longDesc: 'Sinkronisasi data akuntansi antara ERP Gentong Mas dan platform Kledo secara otomatis dan real-time.', icon: Building2, color: '#1565C0', bgColor: '#E3F2FD', category: 'Integrasi', version: '17.0', installs: '1.2K', rating: 4.2, deps: ['accounting'], href: '/kledo' },
  { id: 'settings', name: 'Pengaturan', desc: 'Konfigurasi sistem ERP', longDesc: 'Kelola konfigurasi sistem, pengaturan perusahaan, lokalisasi, dan preferensi global ERP.', icon: Settings, color: '#9E9E9E', bgColor: '#F5F5F5', category: 'Sistem', version: '17.0', installs: '15.0K', rating: 4.5, deps: [], href: '/settings' },
  { id: 'access', name: 'Akses & Peran', desc: 'User, role & permission', longDesc: 'Kelola pengguna, peran, dan hak akses secara granular untuk setiap modul di seluruh sistem ERP.', icon: ShieldCheck, color: '#F44336', bgColor: '#FFEBEE', category: 'Sistem', version: '17.0', installs: '14.2K', rating: 4.7, deps: [], href: '/access' },
];

const CATEGORIES = ['Semua', 'Penjualan', 'Keuangan', 'Operasional', 'SDM', 'Produksi', 'Layanan', 'Sistem', 'Integrasi'];

export default function AppStorePage() {
  const { token, user, logout } = useAuthStore();
  const { installed, install, uninstall, hydrate } = useModulesStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [installing, setInstalling] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [selectedApp, setSelectedApp] = useState<ERPApp | null>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!mounted) return;
    if (!token) { router.push('/login'); return; }
    hydrate();
  }, [mounted, token]);

  const getStatus = useCallback((id: string) => {
    if (installing[id] !== undefined) return 'installing';
    if (installed.includes(id)) return 'installed';
    return 'not_installed';
  }, [installing, installed]);

  const handleInstall = useCallback((appId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (getStatus(appId) !== 'not_installed') return;
    const app = APP_DEFS.find(a => a.id === appId)!;
    const missingDeps = app.deps.filter(d => !installed.includes(d));
    const toInstall = [appId, ...missingDeps];

    const initial: Record<string, number> = {};
    toInstall.forEach(id => { initial[id] = 0; });
    setInstalling(prev => ({ ...prev, ...initial }));

    toInstall.forEach((id, idx) => {
      // Stagger deps slightly
      const delay = idx * 200;
      setTimeout(() => {
        let progress = 0;
        const iv = setInterval(() => {
          progress += Math.random() * 14 + 6;
          if (progress >= 100) {
            progress = 100;
            clearInterval(iv);
            setTimeout(() => {
              install(id);
              setInstalling(prev => { const n = { ...prev }; delete n[id]; return n; });
            }, 300);
          }
          setInstalling(prev => ({ ...prev, [id]: Math.min(progress, 100) }));
        }, 80);
      }, delay);
    });
  }, [getStatus, installed, install]);

  const handleUninstall = useCallback((appId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    uninstall(appId);
    if (selectedApp?.id === appId) setSelectedApp(null);
  }, [uninstall, selectedApp]);

  if (!mounted || !token) return null;

  const featured = APP_DEFS.filter(a => a.featured);
  const filtered = APP_DEFS.filter(a => {
    const matchCat = activeCategory === 'Semua' || a.category === activeCategory;
    const q = search.toLowerCase();
    return matchCat && (!q || a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q));
  });

  /* ── Detail view ── */
  if (selectedApp) {
    const status = getStatus(selectedApp.id);
    const progress = installing[selectedApp.id];
    const Icon = selectedApp.icon;
    const depApps = selectedApp.deps.map(d => APP_DEFS.find(a => a.id === d)).filter(Boolean) as ERPApp[];

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F5F4F9' }}>
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 h-14 bg-white border-b" style={{ borderColor: '#EDE8F5' }}>
          <button onClick={() => setSelectedApp(null)} className="flex items-center gap-2 text-sm font-medium" style={{ color: '#714B67' }}>
            <ArrowLeft className="h-4 w-4" /> Kembali ke App Store
          </button>
          <button onClick={() => router.push('/')} className="text-xs px-3 py-1.5 rounded-lg border" style={{ color: '#A5A3AE', borderColor: '#EDE8F5' }}>
            Dashboard
          </button>
        </header>

        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="bg-white rounded-2xl p-8 border" style={{ borderColor: '#EDE8F5' }}>
            <div className="flex items-start gap-6 flex-wrap">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl flex-shrink-0" style={{ backgroundColor: selectedApp.bgColor }}>
                <Icon className="h-10 w-10" style={{ color: selectedApp.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold" style={{ color: '#2F2B3D' }}>{selectedApp.name}</h1>
                  {selectedApp.featured && <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: '#FFF3E0', color: '#E65100' }}>⭐ Unggulan</span>}
                  {status === 'installed' && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}><CheckCircle2 className="h-3 w-3" /> Terinstal</span>}
                </div>
                <p className="text-sm mt-1" style={{ color: '#A5A3AE' }}>{selectedApp.category} · v{selectedApp.version}</p>
                <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: '#A5A3AE' }}>
                  <span className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3" fill={i <= Math.round(selectedApp.rating) ? selectedApp.color : 'none'} style={{ color: selectedApp.color }} />)}
                    {selectedApp.rating}
                  </span>
                  · {selectedApp.installs} instalasi
                </div>
              </div>

              {/* Action button */}
              <div className="flex-shrink-0">
                {status === 'not_installed' && (
                  <button onClick={() => handleInstall(selectedApp.id)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: '#714B67' }}>
                    <Download className="h-4 w-4" /> Install
                  </button>
                )}
                {status === 'installing' && (
                  <div className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: '#714B67', minWidth: 140 }}>
                    <div className="flex justify-between mb-1.5"><span>Menginstal...</span><span className="text-xs">{Math.round(progress ?? 0)}%</span></div>
                    <div className="h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,.3)' }}>
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${progress ?? 0}%`, backgroundColor: '#fff' }} />
                    </div>
                  </div>
                )}
                {status === 'installed' && (
                  <div className="flex flex-col gap-2">
                    {selectedApp.href && (
                      <button onClick={() => router.push(selectedApp.href!)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: '#714B67' }}>
                        <ChevronRight className="h-4 w-4" /> Buka Modul
                      </button>
                    )}
                    {selectedApp.id !== 'settings' && selectedApp.id !== 'access' && (
                      <button onClick={e => handleUninstall(selectedApp.id, e)} className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium border" style={{ color: '#EA5455', borderColor: '#FFCDD2', backgroundColor: '#FFF5F5' }}>
                        <X className="h-4 w-4" /> Uninstall
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t" style={{ borderColor: '#EDE8F5' }}>
              <h2 className="text-sm font-semibold mb-2" style={{ color: '#433C50' }}>Tentang Modul</h2>
              <p className="text-sm leading-relaxed" style={{ color: '#6D6777' }}>{selectedApp.longDesc}</p>
            </div>

            {depApps.length > 0 && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: '#EDE8F5' }}>
                <h2 className="text-sm font-semibold mb-3" style={{ color: '#433C50' }}>Dependensi (terinstal otomatis bersama modul ini)</h2>
                <div className="flex flex-wrap gap-2">
                  {depApps.map(dep => {
                    const DepIcon = dep.icon;
                    const depStatus = getStatus(dep.id);
                    const depProgress = installing[dep.id];
                    return (
                      <div key={dep.id} className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ backgroundColor: dep.bgColor, borderColor: dep.color + '30' }}>
                        <DepIcon className="h-4 w-4 flex-shrink-0" style={{ color: dep.color }} />
                        <span className="text-xs font-semibold" style={{ color: dep.color }}>{dep.name}</span>
                        {depStatus === 'installed' && <CheckCircle2 className="h-3.5 w-3.5" style={{ color: '#2E7D32' }} />}
                        {depStatus === 'installing' && (
                          <div className="w-12 h-1 rounded-full" style={{ backgroundColor: 'rgba(0,0,0,.1)' }}>
                            <div className="h-1 rounded-full transition-all" style={{ width: `${depProgress ?? 0}%`, backgroundColor: dep.color }} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── List view ── */
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F4F9' }}>
      <header className="sticky top-0 z-30 border-b bg-white" style={{ borderColor: '#EDE8F5' }}>
        <div className="flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/')} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white font-extrabold text-sm" style={{ background: 'linear-gradient(135deg, #714B67, #9C6B8E)' }}>G</div>
              <span className="font-bold text-sm hidden sm:block" style={{ color: '#433C50' }}>Gentong Mas ERP</span>
            </button>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: '#EDE8F5', color: '#714B67' }}>App Store</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs hidden sm:block" style={{ color: '#A5A3AE' }}>
              <span className="font-bold" style={{ color: '#433C50' }}>{installed.length}</span> terinstal
            </span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#B0AAB9' }} />
              <input
                className="rounded-lg pl-8 pr-4 py-1.5 text-sm w-40 sm:w-52 focus:outline-none"
                style={{ backgroundColor: '#F5F4F9', border: '1px solid #EDE8F5', color: '#433C50' }}
                placeholder="Cari modul..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button onClick={() => { logout(); router.push('/login'); }} className="p-2 rounded-lg" style={{ color: '#A5A3AE' }}>
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex gap-1 px-6 pb-3 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
              style={{ backgroundColor: activeCategory === cat ? '#714B67' : 'transparent', color: activeCategory === cat ? '#fff' : '#6D6777' }}>
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Featured section */}
        {!search && activeCategory === 'Semua' && (
          <section className="mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#A5A3AE' }}>Modul Unggulan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map(app => {
                const Icon = app.icon;
                const status = getStatus(app.id);
                const progress = installing[app.id];
                return (
                  <div key={app.id} onClick={() => setSelectedApp(app)} className="bg-white rounded-2xl p-5 cursor-pointer border hover:shadow-md transition-all" style={{ borderColor: '#EDE8F5' }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: app.bgColor }}>
                        <Icon className="h-6 w-6" style={{ color: app.color }} />
                      </div>
                      {status === 'installed' ? (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}>
                          <CheckCircle2 className="h-3 w-3" /> Terinstal
                        </span>
                      ) : status === 'installing' ? (
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs font-medium" style={{ color: '#714B67' }}>{Math.round(progress ?? 0)}%</span>
                          <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: '#EDE8F5' }}>
                            <div className="h-1.5 rounded-full transition-all" style={{ width: `${progress ?? 0}%`, backgroundColor: '#714B67' }} />
                          </div>
                        </div>
                      ) : (
                        <button onClick={e => handleInstall(app.id, e)} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white hover:opacity-90 transition-all" style={{ backgroundColor: '#714B67' }}>
                          <Download className="h-3 w-3" /> Install
                        </button>
                      )}
                    </div>
                    <h3 className="font-bold text-sm" style={{ color: '#2F2B3D' }}>{app.name}</h3>
                    <p className="text-xs mt-0.5" style={{ color: '#A5A3AE' }}>{app.desc}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs" style={{ color: '#B0AAB9' }}>
                      <Star className="h-3 w-3" fill={app.color} style={{ color: app.color }} />
                      {app.rating} · {app.installs} instalasi
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* All modules grid */}
        <section>
          {!search && activeCategory === 'Semua' && (
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#A5A3AE' }}>Semua Modul</h2>
          )}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-24" style={{ color: '#B0AAB9' }}>
              <Search className="h-12 w-12 mb-4 opacity-30" />
              <p className="font-semibold">Modul tidak ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map(app => {
                const Icon = app.icon;
                const status = getStatus(app.id);
                const progress = installing[app.id];
                return (
                  <div key={app.id} onClick={() => setSelectedApp(app)} className="bg-white rounded-xl p-4 cursor-pointer border hover:shadow-md transition-all" style={{ borderColor: '#EDE8F5' }}>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: app.bgColor }}>
                        <Icon className="h-5 w-5" style={{ color: app.color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs truncate" style={{ color: '#2F2B3D' }}>{app.name}</p>
                        <p className="text-[10px] truncate" style={{ color: '#A5A3AE' }}>{app.category}</p>
                      </div>
                    </div>
                    <p className="text-[11px] leading-relaxed mb-3" style={{ color: '#6D6777' }}>{app.desc}</p>
                    {status === 'installed' ? (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#2E7D32' }}>
                          <CheckCircle2 className="h-3 w-3" /> Aktif
                        </span>
                        {app.id !== 'settings' && app.id !== 'access' && (
                          <button onClick={e => handleUninstall(app.id, e)} className="text-[10px] px-2 py-0.5 rounded-md border" style={{ color: '#EA5455', borderColor: '#FFCDD2' }}>
                            Hapus
                          </button>
                        )}
                      </div>
                    ) : status === 'installing' ? (
                      <div>
                        <div className="flex justify-between mb-1 text-[10px] font-medium" style={{ color: '#714B67' }}>
                          <span>Menginstal...</span><span>{Math.round(progress ?? 0)}%</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ backgroundColor: '#EDE8F5' }}>
                          <div className="h-1.5 rounded-full transition-all" style={{ width: `${progress ?? 0}%`, backgroundColor: '#714B67' }} />
                        </div>
                      </div>
                    ) : (
                      <button onClick={e => handleInstall(app.id, e)} className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-all" style={{ backgroundColor: '#714B67' }}>
                        <Download className="h-3 w-3" /> Install
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Custom module CTA */}
        <div className="mt-10 rounded-2xl p-6 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, #714B67 0%, #9C6B8E 100%)' }}>
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,.15)' }}>
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Punya modul kustom?</h3>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,.75)' }}>Upload modul buatan sendiri dan integrasikan ke ERP Gentong Mas</p>
          </div>
          <button className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,.2)', color: '#fff', border: '1px solid rgba(255,255,255,.3)' }}>
            Pelajari lebih <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </main>
    </div>
  );
}
