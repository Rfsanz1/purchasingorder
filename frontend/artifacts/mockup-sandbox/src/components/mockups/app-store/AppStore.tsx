import { useState } from "react";
import {
  ShoppingCart, Users, Package, FileText, DollarSign, Truck,
  BarChart2, Settings, ShieldCheck, Monitor, UserCheck, Star,
  Search, CheckCircle2, Download, ChevronRight, Zap, Globe,
  Clock, MessageSquare, Wrench, Factory, Award, BookOpen,
  HeartHandshake, Car, Layers, Building2, X, ArrowLeft,
} from "lucide-react";

type AppStatus = "installed" | "installing" | "not_installed";

interface ERP_App {
  id: string;
  name: string;
  desc: string;
  longDesc: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  category: string;
  author: string;
  version: string;
  installs: string;
  rating: number;
  deps: string[];
  featured?: boolean;
  status: AppStatus;
}

const ALL_APPS: ERP_App[] = [
  {
    id: "sales", name: "Penjualan", desc: "Kelola order & penawaran harga",
    longDesc: "Modul penjualan lengkap untuk mengelola order, penawaran, dan pipeline penjualan. Integrasikan dengan inventaris dan akuntansi secara otomatis.",
    icon: ShoppingCart, color: "#00BCD4", bgColor: "#E0F7FA",
    category: "Penjualan", author: "Gentong Mas", version: "17.0", installs: "12.4K", rating: 4.8,
    deps: [], featured: true, status: "installed",
  },
  {
    id: "crm", name: "CRM", desc: "Prospek, pipeline & pelanggan",
    longDesc: "Kelola hubungan pelanggan, prospek, dan pipeline penjualan dari satu tempat. Lacak setiap interaksi dan tingkatkan konversi.",
    icon: Users, color: "#9C27B0", bgColor: "#F3E5F5",
    category: "Penjualan", author: "Gentong Mas", version: "17.0", installs: "9.1K", rating: 4.7,
    deps: ["sales"], featured: true, status: "installed",
  },
  {
    id: "pos", name: "Point of Sale", desc: "Kasir & transaksi toko",
    longDesc: "Sistem kasir modern untuk toko fisik. Mendukung barcode, printer struk, dan sinkronisasi stok real-time.",
    icon: Monitor, color: "#FF5722", bgColor: "#FBE9E7",
    category: "Penjualan", author: "Gentong Mas", version: "17.0", installs: "8.3K", rating: 4.9,
    deps: ["inventory"], featured: true, status: "installed",
  },
  {
    id: "invoice", name: "Invoice", desc: "Tagihan & faktur otomatis",
    longDesc: "Buat, kirim, dan pantau invoice secara otomatis. Dukungan multi-mata uang, pajak, dan pengingat pembayaran.",
    icon: FileText, color: "#2196F3", bgColor: "#E3F2FD",
    category: "Keuangan", author: "Gentong Mas", version: "17.0", installs: "11.2K", rating: 4.6,
    deps: ["accounting"], status: "installed",
  },
  {
    id: "accounting", name: "Akuntansi", desc: "Jurnal, COA & laporan keuangan",
    longDesc: "Akuntansi double-entry lengkap dengan Chart of Accounts, jurnal otomatis, rekonsiliasi bank, dan laporan keuangan standar.",
    icon: DollarSign, color: "#4CAF50", bgColor: "#E8F5E9",
    category: "Keuangan", author: "Gentong Mas", version: "17.0", installs: "10.5K", rating: 4.8,
    deps: [], featured: true, status: "installed",
  },
  {
    id: "inventory", name: "Inventaris", desc: "Stok, gudang & produk",
    longDesc: "Manajemen stok multi-gudang dengan tracking lot/serial number, FIFO/FEFO, dan peringatan stok minimum otomatis.",
    icon: Package, color: "#FF9800", bgColor: "#FFF3E0",
    category: "Operasional", author: "Gentong Mas", version: "17.0", installs: "13.8K", rating: 4.9,
    deps: [], featured: true, status: "installed",
  },
  {
    id: "purchase", name: "Pembelian", desc: "Purchase Order & supplier",
    longDesc: "Kelola pembelian dari permintaan hingga penerimaan barang. Bandingkan penawaran supplier dan otomatisasi PO berulang.",
    icon: Truck, color: "#795548", bgColor: "#EFEBE9",
    category: "Operasional", author: "Gentong Mas", version: "17.0", installs: "7.6K", rating: 4.5,
    deps: ["inventory"], status: "installed",
  },
  {
    id: "hr", name: "Karyawan", desc: "Profil & data SDM",
    longDesc: "Kelola data karyawan, departemen, jabatan, dan dokumen HR dari satu platform yang terintegrasi.",
    icon: UserCheck, color: "#E91E63", bgColor: "#FCE4EC",
    category: "SDM", author: "Gentong Mas", version: "17.0", installs: "8.9K", rating: 4.7,
    deps: [], status: "installed",
  },
  {
    id: "payroll", name: "Penggajian", desc: "Gaji, tunjangan & slip gaji",
    longDesc: "Hitung gaji otomatis dengan aturan gaji yang fleksibel, tunjangan, potongan, dan integrasi BPJS serta pajak PPh 21.",
    icon: DollarSign, color: "#673AB7", bgColor: "#EDE7F6",
    category: "SDM", author: "Gentong Mas", version: "17.0", installs: "6.2K", rating: 4.6,
    deps: ["hr"], status: "not_installed",
  },
  {
    id: "attendance", name: "Kehadiran", desc: "Absensi & jam kerja",
    longDesc: "Lacak kehadiran karyawan dengan integrasi mesin fingerprint, aplikasi mobile, dan pelaporan lembur otomatis.",
    icon: Clock, color: "#009688", bgColor: "#E0F2F1",
    category: "SDM", author: "Gentong Mas", version: "17.0", installs: "5.8K", rating: 4.5,
    deps: ["hr"], status: "not_installed",
  },
  {
    id: "leave", name: "Cuti & Izin", desc: "Manajemen cuti karyawan",
    longDesc: "Kelola pengajuan cuti, persetujuan atasan, saldo cuti, dan jenis cuti sesuai kebijakan perusahaan.",
    icon: BookOpen, color: "#FF7043", bgColor: "#FBE9E7",
    category: "SDM", author: "Gentong Mas", version: "17.0", installs: "4.9K", rating: 4.4,
    deps: ["hr", "attendance"], status: "not_installed",
  },
  {
    id: "fleet", name: "Armada", desc: "Manajemen kendaraan & driver",
    longDesc: "Kelola armada kendaraan, jadwal pengiriman, biaya bahan bakar, dan performa driver dalam satu dashboard.",
    icon: Car, color: "#00ACC1", bgColor: "#E0F7FA",
    category: "Operasional", author: "Gentong Mas", version: "17.0", installs: "3.4K", rating: 4.3,
    deps: ["hr"], status: "not_installed",
  },
  {
    id: "manufacturing", name: "Manufaktur", desc: "BOM, work order & produksi",
    longDesc: "Rencanakan dan pantau proses produksi dengan Bill of Materials, work center, dan work order yang terintegrasi dengan inventaris.",
    icon: Factory, color: "#546E7A", bgColor: "#ECEFF1",
    category: "Produksi", author: "Gentong Mas", version: "17.0", installs: "4.1K", rating: 4.5,
    deps: ["inventory"], featured: true, status: "not_installed",
  },
  {
    id: "quality", name: "Kontrol Kualitas", desc: "QC, inspeksi & alert kualitas",
    longDesc: "Buat quality control points, jadwalkan inspeksi, dan pantau alert kualitas untuk memastikan standar produk terpenuhi.",
    icon: Award, color: "#1976D2", bgColor: "#E3F2FD",
    category: "Produksi", author: "Gentong Mas", version: "17.0", installs: "2.8K", rating: 4.4,
    deps: ["manufacturing"], status: "not_installed",
  },
  {
    id: "maintenance", name: "Pemeliharaan", desc: "Perawatan mesin & aset",
    longDesc: "Jadwalkan maintenance preventif, kelola work order perbaikan, dan pantau riwayat perawatan semua aset dan mesin.",
    icon: Wrench, color: "#F57F17", bgColor: "#FFFDE7",
    category: "Produksi", author: "Gentong Mas", version: "17.0", installs: "2.3K", rating: 4.3,
    deps: ["manufacturing"], status: "not_installed",
  },
  {
    id: "helpdesk", name: "Helpdesk", desc: "Tiket & dukungan pelanggan",
    longDesc: "Kelola tiket dukungan pelanggan dengan SLA, eskalasi otomatis, dan laporan kinerja tim support.",
    icon: MessageSquare, color: "#E53935", bgColor: "#FFEBEE",
    category: "Layanan", author: "Gentong Mas", version: "17.0", installs: "3.7K", rating: 4.6,
    deps: ["crm"], status: "not_installed",
  },
  {
    id: "project", name: "Proyek", desc: "Tugas, milestone & Kanban",
    longDesc: "Kelola proyek dengan tampilan Kanban, Gantt, dan list. Lacak kemajuan, deadline, dan beban kerja tim secara real-time.",
    icon: Layers, color: "#5C6BC0", bgColor: "#E8EAF6",
    category: "Layanan", author: "Gentong Mas", version: "17.0", installs: "5.1K", rating: 4.7,
    deps: [], status: "not_installed",
  },
  {
    id: "reports", name: "Laporan & BI", desc: "Analitik & dashboard bisnis",
    longDesc: "Dashboard bisnis dengan chart interaktif, laporan kustom, dan analitik mendalam untuk semua modul yang terinstal.",
    icon: BarChart2, color: "#607D8B", bgColor: "#ECEFF1",
    category: "Sistem", author: "Gentong Mas", version: "17.0", installs: "9.3K", rating: 4.8,
    deps: [], status: "not_installed",
  },
  {
    id: "ecommerce", name: "E-Commerce", desc: "Toko online & katalog produk",
    longDesc: "Buat toko online terintegrasi dengan inventaris dan pembayaran. Kelola produk, harga, dan order dari satu dashboard.",
    icon: Globe, color: "#00897B", bgColor: "#E0F2F1",
    category: "Penjualan", author: "Gentong Mas", version: "17.0", installs: "4.5K", rating: 4.5,
    deps: ["inventory", "sales"], status: "not_installed",
  },
  {
    id: "recruitment", name: "Rekrutmen", desc: "Lowongan & proses seleksi",
    longDesc: "Publikasikan lowongan, kelola lamaran, dan pantau proses seleksi dari screening hingga onboarding.",
    icon: HeartHandshake, color: "#AD1457", bgColor: "#FCE4EC",
    category: "SDM", author: "Gentong Mas", version: "17.0", installs: "2.1K", rating: 4.3,
    deps: ["hr"], status: "not_installed",
  },
  {
    id: "accounting_kledo", name: "Integrasi Kledo", desc: "Sinkronisasi akuntansi Kledo",
    longDesc: "Sinkronisasi data akuntansi antara ERP Gentong Mas dan platform Kledo secara otomatis dan real-time.",
    icon: Building2, color: "#1565C0", bgColor: "#E3F2FD",
    category: "Integrasi", author: "Gentong Mas", version: "17.0", installs: "1.2K", rating: 4.2,
    deps: ["accounting"], status: "not_installed",
  },
];

const CATEGORIES = ["Semua", "Penjualan", "Keuangan", "Operasional", "SDM", "Produksi", "Layanan", "Sistem", "Integrasi"];

export function AppStore() {
  const [apps, setApps] = useState<ERP_App[]>(ALL_APPS);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedApp, setSelectedApp] = useState<ERP_App | null>(null);
  const [installProgress, setInstallProgress] = useState<Record<string, number>>({});

  const handleInstall = (appId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const app = apps.find(a => a.id === appId);
    if (!app || app.status !== "not_installed") return;

    setApps(prev => prev.map(a => a.id === appId ? { ...a, status: "installing" } : a));
    setInstallProgress(prev => ({ ...prev, [appId]: 0 }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setApps(prev => prev.map(a => a.id === appId ? { ...a, status: "installed" } : a));
          setInstallProgress(prev => { const n = { ...prev }; delete n[appId]; return n; });
          if (selectedApp?.id === appId) {
            setSelectedApp(prev => prev ? { ...prev, status: "installed" } : null);
          }
        }, 400);
      }
      setInstallProgress(prev => ({ ...prev, [appId]: Math.min(progress, 100) }));
    }, 120);
  };

  const handleUninstall = (appId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setApps(prev => prev.map(a => a.id === appId ? { ...a, status: "not_installed" } : a));
    if (selectedApp?.id === appId) {
      setSelectedApp(prev => prev ? { ...prev, status: "not_installed" } : null);
    }
  };

  const filtered = apps.filter(a => {
    const matchCat = activeCategory === "Semua" || a.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const featured = apps.filter(a => a.featured);
  const installedCount = apps.filter(a => a.status === "installed").length;

  if (selectedApp) {
    const live = apps.find(a => a.id === selectedApp.id)!;
    const Icon = live.icon;
    const progress = installProgress[live.id];
    const depApps = live.deps.map(d => apps.find(a => a.id === d)).filter(Boolean) as ERP_App[];

    return (
      <div className="min-h-screen" style={{ backgroundColor: "#F5F4F9", fontFamily: "'Inter', sans-serif" }}>
        <header className="sticky top-0 z-30 flex items-center gap-3 px-6 h-14 border-b" style={{ backgroundColor: "#fff", borderColor: "#EDE8F5" }}>
          <button onClick={() => setSelectedApp(null)} className="flex items-center gap-2 text-sm font-medium" style={{ color: "#714B67" }}>
            <ArrowLeft className="h-4 w-4" /> Kembali ke App Store
          </button>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="bg-white rounded-2xl p-8 shadow-sm border" style={{ borderColor: "#EDE8F5" }}>
            <div className="flex items-start gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl flex-shrink-0" style={{ backgroundColor: live.bgColor }}>
                <Icon className="h-10 w-10" style={{ color: live.color }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold" style={{ color: "#2F2B3D" }}>{live.name}</h1>
                  {live.featured && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: "#FFF3E0", color: "#E65100" }}>
                      ⭐ Unggulan
                    </span>
                  )}
                  {live.status === "installed" && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: "#E8F5E9", color: "#2E7D32" }}>
                      <CheckCircle2 className="h-3 w-3" /> Terinstal
                    </span>
                  )}
                </div>
                <p className="text-sm mt-1" style={{ color: "#A5A3AE" }}>{live.category} · oleh {live.author} · v{live.version}</p>
                <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: "#A5A3AE" }}>
                  <span className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3" fill={i <= Math.round(live.rating) ? live.color : "none"} style={{ color: live.color }} />)}
                    {live.rating}
                  </span>
                  <span>·</span>
                  <span>{live.installs} instalasi</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                {live.status === "not_installed" && (
                  <button onClick={() => handleInstall(live.id)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all" style={{ backgroundColor: "#714B67" }}>
                    <Download className="h-4 w-4" /> Install
                  </button>
                )}
                {live.status === "installing" && (
                  <div className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: "#714B67", minWidth: 110 }}>
                    <div className="flex items-center justify-between mb-1">
                      <span>Menginstal...</span>
                      <span className="text-xs">{Math.round(progress ?? 0)}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,.3)" }}>
                      <div className="h-1.5 rounded-full transition-all duration-200" style={{ width: `${progress ?? 0}%`, backgroundColor: "#fff" }} />
                    </div>
                  </div>
                )}
                {live.status === "installed" && (
                  <button onClick={(e) => handleUninstall(live.id, e)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all border" style={{ color: "#EA5455", borderColor: "#FFCDD2", backgroundColor: "#FFF5F5" }}>
                    <X className="h-4 w-4" /> Uninstall
                  </button>
                )}
              </div>
            </div>

            <div className="mt-8 border-t pt-6" style={{ borderColor: "#EDE8F5" }}>
              <h2 className="text-sm font-semibold mb-3" style={{ color: "#433C50" }}>Tentang Modul</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#6D6777" }}>{live.longDesc}</p>
            </div>

            {depApps.length > 0 && (
              <div className="mt-6 border-t pt-6" style={{ borderColor: "#EDE8F5" }}>
                <h2 className="text-sm font-semibold mb-3" style={{ color: "#433C50" }}>Dependensi (terinstal otomatis)</h2>
                <div className="flex flex-wrap gap-2">
                  {depApps.map(dep => {
                    const DepIcon = dep.icon;
                    return (
                      <span key={dep.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: dep.bgColor, color: dep.color }}>
                        <DepIcon className="h-3.5 w-3.5" /> {dep.name}
                        {dep.status === "installed" && <CheckCircle2 className="h-3 w-3" />}
                      </span>
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F4F9", fontFamily: "'Inter', sans-serif" }}>
      <header className="sticky top-0 z-30 border-b" style={{ backgroundColor: "#fff", borderColor: "#EDE8F5" }}>
        <div className="flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white font-extrabold text-sm" style={{ background: "linear-gradient(135deg, #714B67, #9C6B8E)" }}>G</div>
            <span className="font-bold text-sm" style={{ color: "#433C50" }}>Gentong Mas ERP</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "#EDE8F5", color: "#714B67" }}>App Store</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: "#A5A3AE" }}>
              <span className="font-bold" style={{ color: "#433C50" }}>{installedCount}</span> modul terinstal
            </span>
            <div className="h-4 w-px" style={{ backgroundColor: "#EDE8F5" }} />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "#B0AAB9" }} />
              <input
                className="rounded-lg pl-8 pr-4 py-1.5 text-sm w-56"
                style={{ backgroundColor: "#F5F4F9", border: "1px solid #EDE8F5", color: "#433C50", outline: "none" }}
                placeholder="Cari modul..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-1 px-6 pb-3 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
              style={{
                backgroundColor: activeCategory === cat ? "#714B67" : "transparent",
                color: activeCategory === cat ? "#fff" : "#6D6777",
              }}>
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {!search && activeCategory === "Semua" && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: "#A5A3AE" }}>Modul Unggulan</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map(app => {
                const Icon = app.icon;
                const progress = installProgress[app.id];
                return (
                  <div key={app.id} onClick={() => setSelectedApp(app)} className="bg-white rounded-2xl p-5 cursor-pointer transition-all border hover:shadow-md" style={{ borderColor: "#EDE8F5" }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: app.bgColor }}>
                        <Icon className="h-6 w-6" style={{ color: app.color }} />
                      </div>
                      {app.status === "installed" ? (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "#E8F5E9", color: "#2E7D32" }}>
                          <CheckCircle2 className="h-3 w-3" /> Terinstal
                        </span>
                      ) : app.status === "installing" ? (
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs font-medium" style={{ color: "#714B67" }}>{Math.round(progress ?? 0)}%</span>
                          <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: "#EDE8F5" }}>
                            <div className="h-1.5 rounded-full transition-all duration-200" style={{ width: `${progress ?? 0}%`, backgroundColor: "#714B67" }} />
                          </div>
                        </div>
                      ) : (
                        <button onClick={(e) => handleInstall(app.id, e)} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white transition-all" style={{ backgroundColor: "#714B67" }}>
                          <Download className="h-3 w-3" /> Install
                        </button>
                      )}
                    </div>
                    <h3 className="font-bold text-sm" style={{ color: "#2F2B3D" }}>{app.name}</h3>
                    <p className="text-xs mt-0.5" style={{ color: "#A5A3AE" }}>{app.desc}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs" style={{ color: "#B0AAB9" }}>
                      <span className="flex items-center gap-0.5">
                        <Star className="h-3 w-3" fill={app.color} style={{ color: app.color }} />
                        {app.rating}
                      </span>
                      <span>·</span>
                      <span>{app.installs} instalasi</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section>
          {!search && activeCategory === "Semua" && (
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "#A5A3AE" }}>Semua Modul</h2>
          )}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-24" style={{ color: "#B0AAB9" }}>
              <Search className="h-12 w-12 mb-4 opacity-30" />
              <p className="font-semibold">Modul tidak ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(app => {
                const Icon = app.icon;
                const progress = installProgress[app.id];
                return (
                  <div key={app.id} onClick={() => setSelectedApp(app)}
                    className="bg-white rounded-xl p-4 cursor-pointer border transition-all hover:shadow-md"
                    style={{ borderColor: "#EDE8F5" }}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: app.bgColor }}>
                        <Icon className="h-5 w-5" style={{ color: app.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-xs truncate" style={{ color: "#2F2B3D" }}>{app.name}</h3>
                        </div>
                        <p className="text-[11px] mt-0.5 truncate" style={{ color: "#A5A3AE" }}>{app.category}</p>
                      </div>
                    </div>
                    <p className="text-[11px] leading-relaxed mb-3" style={{ color: "#6D6777" }}>{app.desc}</p>

                    {app.status === "installed" ? (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#2E7D32" }}>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Terinstal
                        </span>
                        <button onClick={e => handleUninstall(app.id, e)} className="text-[10px] px-2 py-1 rounded-lg border transition-all" style={{ color: "#EA5455", borderColor: "#FFCDD2" }}>
                          Uninstall
                        </button>
                      </div>
                    ) : app.status === "installing" ? (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-medium" style={{ color: "#714B67" }}>Menginstal... {Math.round(progress ?? 0)}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: "#EDE8F5" }}>
                          <div className="h-1.5 rounded-full transition-all duration-200" style={{ width: `${progress ?? 0}%`, backgroundColor: "#714B67" }} />
                        </div>
                      </div>
                    ) : (
                      <button onClick={e => handleInstall(app.id, e)} className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-all" style={{ backgroundColor: "#714B67" }}>
                        <Download className="h-3.5 w-3.5" /> Install
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="mt-10 rounded-2xl p-6 flex items-center gap-4" style={{ background: "linear-gradient(135deg, #714B67 0%, #9C6B8E 100%)" }}>
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(255,255,255,.15)" }}>
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Punya modul kustom?</h3>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,.75)" }}>Upload modul buatan sendiri dan integrasikan ke ERP Gentong Mas</p>
          </div>
          <button className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold flex-shrink-0 transition-all" style={{ backgroundColor: "rgba(255,255,255,.2)", color: "#fff", border: "1px solid rgba(255,255,255,.3)" }}>
            Pelajari lebih <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </main>
    </div>
  );
}
