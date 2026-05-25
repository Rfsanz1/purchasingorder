import type { LucideIcon } from 'lucide-react';
import {
  Globe, ShoppingCart, Users, FileText, Monitor, Store, Truck, Star,
  DollarSign, Landmark, Receipt, BarChart2,
  MessageSquare, Wrench, Calendar, Layers, BookOpen,
  FileBox, Bell, CheckSquare, MessageCircle, Workflow,
  Package, Warehouse, ShoppingBag, Factory, Award,
  Mail, Megaphone, Tag, Gift,
  UserCheck, Clock, CreditCard, CalendarX,
  Settings, Shield, Building2, GitBranch, Database,
  Activity, Lock, Code, Zap, Camera, Car,
  TrendingUp, HeartHandshake, ClipboardList,
  BarChart, LayoutDashboard, Cpu, ClipboardCheck,
  PackageCheck, Boxes, Hammer, ListChecks, Banknote,
  Receipt as ReceiptIcon, BadgeCheck, UserCog, BriefcaseBusiness,
  HelpCircle, Ticket, Globe2, ShoppingBasket, Search, Rss,
  MessageSquareMore, LayoutTemplate, UserCircle, KeyRound, ServerCog,
  HardDrive, BotMessageSquare, FileSearch, Network,
} from 'lucide-react';

export type ModuleStatus = 'core' | 'coming-soon' | null;

export interface ERP_Module {
  id: string;
  name: string;
  desc: string;
  longDesc: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  category: string;
  appCategory: string;
  group: string;
  version: string;
  installs: string;
  rating: number;
  deps: string[];
  featured?: boolean;
  href?: string;
  isCore?: boolean;
  status?: ModuleStatus;
}

export interface AppStoreCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  bgColor: string;
  gradient: string;
  modules: string[];
}

export const APP_STORE_CATEGORIES: AppStoreCategory[] = [
  {
    id: 'dashboard',
    name: 'Dashboard & Reports',
    emoji: '📊',
    description: 'Pantau bisnis secara real-time dengan dashboard interaktif dan laporan mendalam.',
    color: '#0891B2',
    bgColor: '#E0F7FA',
    gradient: 'linear-gradient(135deg, #0891B2, #0E7490)',
    modules: ['finance_bi', 'sales_report', 'marketing_analytics', 'reports', 'activity_log'],
  },
  {
    id: 'sales',
    name: 'Sales',
    emoji: '🛒',
    description: 'Kelola penjualan, CRM, pelanggan, invoice, POS, marketplace, dan pengiriman.',
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    gradient: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
    modules: ['sales', 'crm', 'customers', 'invoice', 'pos', 'marketplace', 'fleet'],
  },
  {
    id: 'purchase',
    name: 'Purchase',
    emoji: '🛍',
    description: 'Kelola pembelian, RFQ, supplier, dan penerimaan barang secara efisien.',
    color: '#0D9488',
    bgColor: '#CCFBF1',
    gradient: 'linear-gradient(135deg, #0D9488, #0F766E)',
    modules: ['purchase', 'rfq', 'supplier_mgmt', 'goods_receipt'],
  },
  {
    id: 'inventory',
    name: 'Inventory Management',
    emoji: '📦',
    description: 'Manajemen stok, gudang, quality control, maintenance, dan aset tetap.',
    color: '#D97706',
    bgColor: '#FEF3C7',
    gradient: 'linear-gradient(135deg, #D97706, #B45309)',
    modules: ['inventory', 'warehouse', 'multi_warehouse', 'quality', 'maintenance', 'assets'],
  },
  {
    id: 'manufacturing',
    name: 'Production / Manufacturing',
    emoji: '🏭',
    description: 'Rencanakan dan kelola produksi dengan BOM, work order, dan jadwal produksi.',
    color: '#6D28D9',
    bgColor: '#EDE9FE',
    gradient: 'linear-gradient(135deg, #6D28D9, #5B21B6)',
    modules: ['manufacturing', 'bom', 'work_order', 'production_planning'],
  },
  {
    id: 'accounting',
    name: 'Accounting & Finance',
    emoji: '💰',
    description: 'Akuntansi lengkap, kas & bank, pajak, pengeluaran, dan approval keuangan.',
    color: '#059669',
    bgColor: '#D1FAE5',
    gradient: 'linear-gradient(135deg, #059669, #047857)',
    modules: ['accounting', 'bank_cash', 'tax', 'expenses', 'finance_approval'],
  },
  {
    id: 'hrm',
    name: 'Human Resource (HRM)',
    emoji: '👨‍💼',
    description: 'Kelola karyawan, absensi, cuti, payroll, rekrutmen, dan penilaian kinerja.',
    color: '#DB2777',
    bgColor: '#FCE7F3',
    gradient: 'linear-gradient(135deg, #DB2777, #BE185D)',
    modules: ['hr', 'attendance', 'leave', 'payroll', 'recruitment', 'appraisal'],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    emoji: '📢',
    description: 'WhatsApp & email marketing, campaign, loyalty program, voucher, dan survey.',
    color: '#EA580C',
    bgColor: '#FFEDD5',
    gradient: 'linear-gradient(135deg, #EA580C, #C2410C)',
    modules: ['whatsapp_marketing', 'email_marketing', 'campaign', 'loyalty', 'voucher', 'survey'],
  },
  {
    id: 'service',
    name: 'Service & Support',
    emoji: '🛠',
    description: 'Kelola servis, appointment, helpdesk, dan tiket dukungan pelanggan.',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    gradient: 'linear-gradient(135deg, #DC2626, #B91C1C)',
    modules: ['service_repair', 'appointment', 'helpdesk', 'ticket_support'],
  },
  {
    id: 'productivity',
    name: 'Productivity & Collaboration',
    emoji: '👥',
    description: 'Chat internal, kalender, dokumen, knowledge base, approval, dan workflow.',
    color: '#2563EB',
    bgColor: '#DBEAFE',
    gradient: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
    modules: ['internal_chat', 'calendar_app', 'documents', 'knowledge', 'announcements', 'approval', 'workflow_engine'],
  },
  {
    id: 'website',
    name: 'Website & Commerce',
    emoji: '🌐',
    description: 'Website builder, e-commerce, blog, SEO, live chat, dan customer portal.',
    color: '#0891B2',
    bgColor: '#CFFAFE',
    gradient: 'linear-gradient(135deg, #0891B2, #0E7490)',
    modules: ['website_builder', 'ecommerce', 'blog', 'seo', 'live_chat', 'banner_slider', 'customer_portal'],
  },
  {
    id: 'system',
    name: 'System & Administration',
    emoji: '⚙️',
    description: 'Pengaturan, user & role, integrasi, API, backup, automation, dan audit log.',
    color: '#475569',
    bgColor: '#F1F5F9',
    gradient: 'linear-gradient(135deg, #475569, #334155)',
    modules: ['settings', 'access', 'integrations', 'api_management', 'queue_monitor', 'backup', 'automation', 'audit_log'],
  },
  {
    id: 'multi_branch',
    name: 'Multi Branch',
    emoji: '🏬',
    description: 'Kelola semua cabang bisnis dengan konsolidasi laporan dan pemisahan data.',
    color: '#1D4ED8',
    bgColor: '#DBEAFE',
    gradient: 'linear-gradient(135deg, #1D4ED8, #1E40AF)',
    modules: ['multi_branch'],
  },
];

export const MODULE_CATEGORIES = [
  'Semua', 'Website', 'Sales', 'Keuangan', 'Layanan',
  'Produktivitas', 'Supply Chain', 'Marketing', 'SDM', 'Sistem',
];

export const MODULES: ERP_Module[] = [

  // ── DASHBOARD & REPORTS ──────────────────────────────────────────────────
  { id: 'finance_bi', name: 'BI & Analytics', desc: 'Dashboard keuangan & forecast', longDesc: 'Business intelligence keuangan dengan forecasting, dashboard eksekutif, dan laporan kustom.', icon: BarChart2, color: '#00838F', bgColor: '#E0F7FA', category: 'Keuangan', appCategory: 'dashboard', group: 'BI', version: '17.0', installs: '4.7K', rating: 4.7, deps: ['accounting'], href: '/reports/finance' },
  { id: 'sales_report', name: 'Laporan Penjualan', desc: 'Analytics penjualan lengkap', longDesc: 'Laporan penjualan per produk, sales person, wilayah, periode, dan channel dengan grafik interaktif.', icon: BarChart2, color: '#607D8B', bgColor: '#ECEFF1', category: 'Sales', appCategory: 'dashboard', group: 'Laporan', version: '17.0', installs: '8.1K', rating: 4.7, deps: ['sales'], href: '/reports/sales' },
  { id: 'marketing_analytics', name: 'Analytics Marketing', desc: 'ROI campaign & conversion', longDesc: 'Pantau ROI setiap campaign, conversion rate, customer acquisition cost, dan CLV.', icon: BarChart, color: '#1565C0', bgColor: '#E3F2FD', category: 'Marketing', appCategory: 'dashboard', group: 'Analytics', version: '17.0', installs: '2.7K', rating: 4.6, deps: ['campaign'], href: '/reports' },
  { id: 'reports', name: 'Laporan & BI', desc: 'Analitik bisnis menyeluruh', longDesc: 'Dashboard BI dengan grafik interaktif, laporan kustom, dan analitik mendalam semua modul.', icon: LayoutDashboard, color: '#7C3AED', bgColor: '#EDE9FE', category: 'Sistem', appCategory: 'dashboard', group: 'BI', version: '17.0', installs: '9.3K', rating: 4.8, deps: [], href: '/reports' },
  { id: 'activity_log', name: 'Activity Log', desc: 'Log aktivitas pengguna', longDesc: 'Pantau semua aktivitas pengguna di sistem: login, perubahan data, aksi penting.', icon: Activity, color: '#00838F', bgColor: '#E0F7FA', category: 'Produktivitas', appCategory: 'dashboard', group: 'Log', version: '17.0', installs: '4.8K', rating: 4.7, deps: [], href: '/productivity/activity' },

  // ── SALES ─────────────────────────────────────────────────────────────────
  { id: 'sales', name: 'Penjualan', desc: 'Quotation, SO & DO', longDesc: 'Kelola seluruh proses penjualan: quotation, sales order, delivery order, retur, dan approval.', icon: ShoppingCart, color: '#00BCD4', bgColor: '#E0F7FA', category: 'Sales', appCategory: 'sales', group: 'Penjualan', version: '17.0', installs: '12.4K', rating: 4.8, deps: [], href: '/sales', featured: true },
  { id: 'crm', name: 'CRM', desc: 'Pipeline & prospek pelanggan', longDesc: 'Kelola leads, prospek, pipeline penjualan, follow up, dan aktivitas tim sales dalam satu tempat.', icon: Users, color: '#9C27B0', bgColor: '#F3E5F5', category: 'Sales', appCategory: 'sales', group: 'CRM', version: '17.0', installs: '9.1K', rating: 4.7, deps: ['sales'], href: '/crm', featured: true },
  { id: 'customers', name: 'Pelanggan', desc: 'Data, membership & loyalty', longDesc: 'Kelola data pelanggan, membership, loyalty point, histori pembelian, dan blacklist customer.', icon: UserCircle, color: '#FF9800', bgColor: '#FFF3E0', category: 'Sales', appCategory: 'sales', group: 'Pelanggan', version: '17.0', installs: '7.2K', rating: 4.5, deps: [], href: '/customers' },
  { id: 'invoice', name: 'Invoice', desc: 'Invoice, piutang & pembayaran', longDesc: 'Buat dan kirim invoice, pantau piutang, histori pembayaran, dan reminder otomatis.', icon: FileText, color: '#2196F3', bgColor: '#E3F2FD', category: 'Sales', appCategory: 'sales', group: 'Invoice', version: '17.0', installs: '11.2K', rating: 4.6, deps: ['accounting'], href: '/invoice' },
  { id: 'pos', name: 'Point Of Sale (POS)', desc: 'Kasir, shift & promo', longDesc: 'Sistem kasir modern dengan shift kasir, refund, closing kasir, dan promo POS.', icon: Monitor, color: '#FF5722', bgColor: '#FBE9E7', category: 'Sales', appCategory: 'sales', group: 'POS', version: '17.0', installs: '8.3K', rating: 4.9, deps: ['inventory'], href: '/pos', featured: true },
  { id: 'marketplace', name: 'Marketplace', desc: 'Shopee, Tokopedia, TikTok', longDesc: 'Sinkronisasi produk, stok, dan order dari Shopee, Tokopedia, dan TikTok Shop ke dalam satu dashboard.', icon: Store, color: '#E91E63', bgColor: '#FCE4EC', category: 'Sales', appCategory: 'sales', group: 'Marketplace', version: '17.0', installs: '6.8K', rating: 4.7, deps: ['inventory', 'sales'], href: '/marketplace', featured: true },
  { id: 'fleet', name: 'Pengiriman & Armada', desc: 'Driver, surat jalan & tracking', longDesc: 'Kelola armada, driver, surat jalan, tracking pengiriman, dan bukti kirim digital.', icon: Truck, color: '#009688', bgColor: '#E0F2F1', category: 'Sales', appCategory: 'sales', group: 'Pengiriman', version: '17.0', installs: '3.4K', rating: 4.3, deps: [], href: '/fleet' },

  // ── PURCHASE ──────────────────────────────────────────────────────────────
  { id: 'purchase', name: 'Pembelian', desc: 'RFQ, PO & penerimaan', longDesc: 'Kelola supplier, RFQ, purchase order, penerimaan barang, retur supplier, dan hutang.', icon: ShoppingBag, color: '#546E7A', bgColor: '#ECEFF1', category: 'Supply Chain', appCategory: 'purchase', group: 'Pembelian', version: '17.0', installs: '7.6K', rating: 4.5, deps: ['inventory'], href: '/purchasing' },
  { id: 'rfq', name: 'RFQ', desc: 'Request for Quotation', longDesc: 'Buat dan kelola permintaan penawaran ke supplier, bandingkan harga, dan tentukan supplier terbaik.', icon: ClipboardList, color: '#0891B2', bgColor: '#CFFAFE', category: 'Supply Chain', appCategory: 'purchase', group: 'RFQ', version: '17.0', installs: '3.1K', rating: 4.4, deps: ['purchase'], status: 'coming-soon' },
  { id: 'supplier_mgmt', name: 'Supplier', desc: 'Data & performa supplier', longDesc: 'Kelola data supplier, histori transaksi, rating performa, dan perjanjian kontrak supplier.', icon: BriefcaseBusiness, color: '#7C3AED', bgColor: '#EDE9FE', category: 'Supply Chain', appCategory: 'purchase', group: 'Supplier', version: '17.0', installs: '4.2K', rating: 4.5, deps: ['purchase'], status: 'coming-soon' },
  { id: 'goods_receipt', name: 'Penerimaan Barang', desc: 'GR, inspeksi & konfirmasi', longDesc: 'Proses penerimaan barang dari supplier dengan inspeksi, pencocokan PO, dan konfirmasi stok masuk.', icon: PackageCheck, color: '#059669', bgColor: '#D1FAE5', category: 'Supply Chain', appCategory: 'purchase', group: 'GR', version: '17.0', installs: '3.8K', rating: 4.4, deps: ['purchase'], status: 'coming-soon' },

  // ── INVENTORY MANAGEMENT ──────────────────────────────────────────────────
  { id: 'inventory', name: 'Inventaris', desc: 'Produk, stok & barcode', longDesc: 'Manajemen produk lengkap: kategori, brand, barcode, bundle produk, dan riwayat stok.', icon: Package, color: '#FF9800', bgColor: '#FFF3E0', category: 'Supply Chain', appCategory: 'inventory', group: 'Inventaris', version: '17.0', installs: '13.8K', rating: 4.9, deps: [], href: '/inventory', featured: true },
  { id: 'warehouse', name: 'Gudang', desc: 'Multi gudang & stock opname', longDesc: 'Kelola multi gudang, transfer antar gudang, stock opname, penyesuaian stok, dan mutasi barang.', icon: Warehouse, color: '#795548', bgColor: '#EFEBE9', category: 'Supply Chain', appCategory: 'inventory', group: 'Gudang', version: '17.0', installs: '7.4K', rating: 4.7, deps: ['inventory'], href: '/inventory/warehouses' },
  { id: 'multi_warehouse', name: 'Multi Gudang', desc: 'Konsolidasi stok semua gudang', longDesc: 'Pantau dan konsolidasikan stok dari semua gudang dalam satu dashboard terpusat dengan transfer antar lokasi.', icon: Boxes, color: '#D97706', bgColor: '#FEF3C7', category: 'Supply Chain', appCategory: 'inventory', group: 'Gudang', version: '17.0', installs: '2.8K', rating: 4.5, deps: ['warehouse'], status: 'coming-soon' },
  { id: 'quality', name: 'Quality Control', desc: 'QC produk & standar mutu', longDesc: 'Lakukan QC produk dan gudang, catat reject, dan tetapkan standar QC per produk.', icon: Award, color: '#1976D2', bgColor: '#E3F2FD', category: 'Supply Chain', appCategory: 'inventory', group: 'QC', version: '17.0', installs: '2.8K', rating: 4.4, deps: ['manufacturing'], href: '/quality' },
  { id: 'maintenance', name: 'Maintenance', desc: 'Mesin, jadwal & sparepart', longDesc: 'Jadwalkan dan catat maintenance mesin, kelola sparepart mesin, dan pantau histori perawatan.', icon: Wrench, color: '#F57F17', bgColor: '#FFFDE7', category: 'Supply Chain', appCategory: 'inventory', group: 'Maintenance', version: '17.0', installs: '2.3K', rating: 4.3, deps: ['manufacturing'], href: '/maintenance' },
  { id: 'assets', name: 'Aset Tetap', desc: 'Aset, depresiasi & maintenance', longDesc: 'Kelola aset tetap perusahaan dengan depresiasi otomatis, maintenance aset, dan histori perpindahan.', icon: Database, color: '#6A1B9A', bgColor: '#F3E5F5', category: 'Keuangan', appCategory: 'inventory', group: 'Asset', version: '17.0', installs: '4.1K', rating: 4.4, deps: ['accounting'] },

  // ── PRODUCTION / MANUFACTURING ────────────────────────────────────────────
  { id: 'manufacturing', name: 'Manufaktur', desc: 'BOM, work order & produksi', longDesc: 'Rencanakan produksi dengan BOM, work order, jadwal produksi, dan cost produksi otomatis.', icon: Factory, color: '#546E7A', bgColor: '#ECEFF1', category: 'Supply Chain', appCategory: 'manufacturing', group: 'Manufaktur', version: '17.0', installs: '4.1K', rating: 4.5, deps: ['inventory'], href: '/manufacturing', featured: true },
  { id: 'bom', name: 'BOM', desc: 'Bill of Materials', longDesc: 'Kelola Bill of Materials (BOM) multi-level untuk setiap produk manufaktur dengan komponen dan sub-assembly.', icon: ListChecks, color: '#7C3AED', bgColor: '#EDE9FE', category: 'Supply Chain', appCategory: 'manufacturing', group: 'BOM', version: '17.0', installs: '2.1K', rating: 4.4, deps: ['manufacturing'], status: 'coming-soon' },
  { id: 'work_order', name: 'Work Order', desc: 'Perintah produksi & tracking', longDesc: 'Buat dan kelola work order produksi, assign ke mesin/operator, dan tracking progress secara real-time.', icon: ClipboardCheck, color: '#059669', bgColor: '#D1FAE5', category: 'Supply Chain', appCategory: 'manufacturing', group: 'Work Order', version: '17.0', installs: '1.9K', rating: 4.3, deps: ['manufacturing'], status: 'coming-soon' },
  { id: 'production_planning', name: 'Production Planning', desc: 'MRP & jadwal produksi', longDesc: 'Material Requirements Planning (MRP), jadwal kapasitas produksi, dan perencanaan kebutuhan bahan baku.', icon: Cpu, color: '#D97706', bgColor: '#FEF3C7', category: 'Supply Chain', appCategory: 'manufacturing', group: 'Planning', version: '17.0', installs: '1.5K', rating: 4.3, deps: ['manufacturing', 'bom'], status: 'coming-soon' },

  // ── ACCOUNTING & FINANCE ──────────────────────────────────────────────────
  { id: 'accounting', name: 'Akuntansi', desc: 'COA, jurnal & laporan keuangan', longDesc: 'Akuntansi double-entry lengkap dengan COA, jurnal umum, buku besar, neraca, L/R, dan arus kas.', icon: DollarSign, color: '#4CAF50', bgColor: '#E8F5E9', category: 'Keuangan', appCategory: 'accounting', group: 'Akuntansi', version: '17.0', installs: '10.5K', rating: 4.8, deps: [], href: '/accounting', featured: true },
  { id: 'bank_cash', name: 'Kas & Bank', desc: 'Rekening, mutasi & rekonsiliasi', longDesc: 'Kelola rekening bank, catat mutasi, lakukan rekonsiliasi bank, dan transfer antar rekening.', icon: Landmark, color: '#1565C0', bgColor: '#E3F2FD', category: 'Keuangan', appCategory: 'accounting', group: 'Kas & Bank', version: '17.0', installs: '7.8K', rating: 4.6, deps: ['accounting'] },
  { id: 'tax', name: 'Pajak', desc: 'PPN, PPh & e-Faktur', longDesc: 'Kelola PPN, PPh, cetak e-Faktur, dan buat laporan pajak sesuai format DJP.', icon: FileBox, color: '#C62828', bgColor: '#FFEBEE', category: 'Keuangan', appCategory: 'accounting', group: 'Pajak', version: '17.0', installs: '5.2K', rating: 4.6, deps: ['accounting'] },
  { id: 'expenses', name: 'Pengeluaran', desc: 'Biaya, approval & reimburse', longDesc: 'Catat biaya operasional, proses approval pengeluaran, cash advance, dan reimbursement karyawan.', icon: Receipt, color: '#F57F17', bgColor: '#FFFDE7', category: 'Keuangan', appCategory: 'accounting', group: 'Pengeluaran', version: '17.0', installs: '6.3K', rating: 4.5, deps: ['accounting'] },
  { id: 'finance_approval', name: 'Approval Keuangan', desc: 'Workflow persetujuan keuangan', longDesc: 'Workflow approval multi-level untuk transaksi keuangan, pengeluaran besar, dan PO dengan limit approval.', icon: BadgeCheck, color: '#0D9488', bgColor: '#CCFBF1', category: 'Keuangan', appCategory: 'accounting', group: 'Approval', version: '17.0', installs: '3.2K', rating: 4.5, deps: ['accounting', 'expenses'], status: 'coming-soon' },

  // ── HUMAN RESOURCE (HRM) ──────────────────────────────────────────────────
  { id: 'hr', name: 'Karyawan', desc: 'Data SDM, departemen & jabatan', longDesc: 'Kelola data karyawan, struktur departemen, jabatan, dan dokumen karyawan secara terpusat.', icon: UserCheck, color: '#E91E63', bgColor: '#FCE4EC', category: 'SDM', appCategory: 'hrm', group: 'Karyawan', version: '17.0', installs: '8.9K', rating: 4.7, deps: [], href: '/hr' },
  { id: 'attendance', name: 'Kehadiran / Absensi', desc: 'Absensi, shift & fingerprint', longDesc: 'Lacak kehadiran dengan integrasi fingerprint/face, kelola shift kerja dan monitoring real-time.', icon: Clock, color: '#009688', bgColor: '#E0F2F1', category: 'SDM', appCategory: 'hrm', group: 'Kehadiran', version: '17.0', installs: '5.8K', rating: 4.5, deps: ['hr'], href: '/hr/attendances' },
  { id: 'leave', name: 'Cuti & Izin', desc: 'Pengajuan, approval & histori', longDesc: 'Kelola pengajuan cuti, persetujuan atasan, saldo cuti, dan jenis cuti sesuai kebijakan.', icon: CalendarX, color: '#FF7043', bgColor: '#FBE9E7', category: 'SDM', appCategory: 'hrm', group: 'Cuti', version: '17.0', installs: '4.9K', rating: 4.4, deps: ['hr', 'attendance'], href: '/hr/leaves' },
  { id: 'payroll', name: 'Payroll', desc: 'Gaji, BPJS & PPh21', longDesc: 'Hitung gaji otomatis dengan komponen BPJS, PPh21, bonus, dan potongan sesuai peraturan.', icon: CreditCard, color: '#673AB7', bgColor: '#EDE7F6', category: 'SDM', appCategory: 'hrm', group: 'Payroll', version: '17.0', installs: '6.2K', rating: 4.6, deps: ['hr'], href: '/payroll' },
  { id: 'recruitment', name: 'Rekrutmen', desc: 'Lowongan, kandidat & hiring', longDesc: 'Publikasikan lowongan, kelola kandidat, jadwalkan interview, dan proses hiring dari satu platform.', icon: HeartHandshake, color: '#AD1457', bgColor: '#FCE4EC', category: 'SDM', appCategory: 'hrm', group: 'Rekrutmen', version: '17.0', installs: '2.1K', rating: 4.3, deps: ['hr'], href: '/recruitment' },
  { id: 'appraisal', name: 'Appraisal', desc: 'Penilaian kinerja karyawan', longDesc: 'Lakukan penilaian kinerja 360°, tetapkan KPI, pantau pencapaian, dan buat laporan appraisal.', icon: Star, color: '#F9A825', bgColor: '#FFFDE7', category: 'SDM', appCategory: 'hrm', group: 'Appraisal', version: '17.0', installs: '2.4K', rating: 4.4, deps: ['hr'], href: '/hr/appraisals' },

  // ── MARKETING ─────────────────────────────────────────────────────────────
  { id: 'whatsapp_marketing', name: 'WhatsApp Marketing', desc: 'Blast WA & auto reply', longDesc: 'Kirim pesan WhatsApp massal, atur auto reply, dan pantau statistik pesan terkirim/terbaca.', icon: MessageCircle, color: '#2E7D32', bgColor: '#E8F5E9', category: 'Marketing', appCategory: 'marketing', group: 'WhatsApp', version: '17.0', installs: '4.8K', rating: 4.8, deps: [], href: '/marketing', featured: true },
  { id: 'email_marketing', name: 'Email Marketing', desc: 'Campaign & blast email', longDesc: 'Buat dan kirim campaign email massal dengan template, segmentasi, dan laporan open rate.', icon: Mail, color: '#E53935', bgColor: '#FFEBEE', category: 'Marketing', appCategory: 'marketing', group: 'Email', version: '17.0', installs: '3.2K', rating: 4.5, deps: [], href: '/marketing' },
  { id: 'campaign', name: 'Campaign Manager', desc: 'Kelola campaign multi-channel', longDesc: 'Rencanakan, jalankan, dan pantau campaign pemasaran di semua channel dari satu dashboard.', icon: Megaphone, color: '#F57F17', bgColor: '#FFFDE7', category: 'Marketing', appCategory: 'marketing', group: 'Campaign', version: '17.0', installs: '2.9K', rating: 4.6, deps: [] },
  { id: 'loyalty', name: 'Loyalty Program', desc: 'Poin reward & membership', longDesc: 'Buat program loyalty dengan poin reward, tier membership, dan penukaran hadiah otomatis.', icon: Gift, color: '#6A1B9A', bgColor: '#F3E5F5', category: 'Marketing', appCategory: 'marketing', group: 'Loyalty', version: '17.0', installs: '3.6K', rating: 4.5, deps: ['customers'] },
  { id: 'voucher', name: 'Voucher & Promo', desc: 'Diskon, voucher & cashback', longDesc: 'Buat kode voucher, cashback, diskon otomatis, dan batas penggunaan per customer.', icon: Tag, color: '#AD1457', bgColor: '#FCE4EC', category: 'Marketing', appCategory: 'marketing', group: 'Voucher', version: '17.0', installs: '5.1K', rating: 4.7, deps: ['sales'] },
  { id: 'survey', name: 'Survey', desc: 'Kuesioner & feedback pelanggan', longDesc: 'Buat survey kepuasan pelanggan, Net Promoter Score (NPS), dan analitik hasil survey.', icon: CheckSquare, color: '#00838F', bgColor: '#E0F7FA', category: 'Marketing', appCategory: 'marketing', group: 'Survey', version: '17.0', installs: '2.0K', rating: 4.3, deps: [] },

  // ── SERVICE & SUPPORT ─────────────────────────────────────────────────────
  { id: 'service_repair', name: 'Service Elektronik', desc: 'Garansi, perbaikan & teknisi', longDesc: 'Kelola klaim garansi, unit masuk servis, penggantian sparepart, assign teknisi, dan status perbaikan.', icon: Wrench, color: '#F57F17', bgColor: '#FFFDE7', category: 'Layanan', appCategory: 'service', group: 'Service', version: '17.0', installs: '2.4K', rating: 4.5, deps: ['helpdesk'], href: '/service', featured: true },
  { id: 'appointment', name: 'Appointment', desc: 'Jadwal, booking & reminder', longDesc: 'Buat jadwal konsultasi/service, terima booking online, kirim reminder ke pelanggan.', icon: Calendar, color: '#00897B', bgColor: '#E0F2F1', category: 'Layanan', appCategory: 'service', group: 'Appointment', version: '17.0', installs: '2.1K', rating: 4.3, deps: [] },
  { id: 'helpdesk', name: 'Helpdesk', desc: 'Tiket, SLA & dukungan', longDesc: 'Kelola tiket dukungan dengan SLA, prioritas, eskalasi otomatis, dan laporan performa tim.', icon: MessageSquare, color: '#E53935', bgColor: '#FFEBEE', category: 'Layanan', appCategory: 'service', group: 'Helpdesk', version: '17.0', installs: '3.7K', rating: 4.6, deps: ['crm'], href: '/helpdesk' },
  { id: 'ticket_support', name: 'Ticket Support', desc: 'Manajemen tiket dukungan', longDesc: 'Sistem tiket dukungan pelanggan dengan kategorisasi, prioritas, assignment, dan tracking resolusi.', icon: Ticket, color: '#7C3AED', bgColor: '#EDE9FE', category: 'Layanan', appCategory: 'service', group: 'Ticket', version: '17.0', installs: '1.8K', rating: 4.3, deps: ['helpdesk'], status: 'coming-soon' },

  // ── PRODUCTIVITY & COLLABORATION ──────────────────────────────────────────
  { id: 'internal_chat', name: 'Chat Internal', desc: 'Komunikasi tim real-time', longDesc: 'Fitur chat internal antar karyawan, channel per departemen, dan notifikasi real-time.', icon: MessageCircle, color: '#1976D2', bgColor: '#E3F2FD', category: 'Produktivitas', appCategory: 'productivity', group: 'Chat', version: '17.0', installs: '5.1K', rating: 4.8, deps: [], href: '/productivity/chat' },
  { id: 'calendar_app', name: 'Kalender', desc: 'Jadwal & agenda tim', longDesc: 'Kalender bersama untuk tim, sinkronisasi jadwal, meeting, dan event perusahaan.', icon: Calendar, color: '#E64A19', bgColor: '#FBE9E7', category: 'Produktivitas', appCategory: 'productivity', group: 'Kalender', version: '17.0', installs: '3.5K', rating: 4.6, deps: [], href: '/productivity/calendar' },
  { id: 'documents', name: 'Dokumen', desc: 'DMS & manajemen file', longDesc: 'Simpan, kelola, dan bagikan dokumen perusahaan dengan folder hierarki dan hak akses per dokumen.', icon: FileBox, color: '#0097A7', bgColor: '#E0F7FA', category: 'Produktivitas', appCategory: 'productivity', group: 'Dokumen', version: '17.0', installs: '3.9K', rating: 4.5, deps: [], href: '/productivity/documents' },
  { id: 'knowledge', name: 'Knowledge Base', desc: 'SOP, panduan & wiki internal', longDesc: 'Buat dan kelola wiki internal, SOP, panduan produk, dan artikel pengetahuan untuk tim.', icon: BookOpen, color: '#5C6BC0', bgColor: '#E8EAF6', category: 'Produktivitas', appCategory: 'productivity', group: 'Knowledge', version: '17.0', installs: '2.6K', rating: 4.4, deps: [], href: '/productivity/knowledge' },
  { id: 'announcements', name: 'Pengumuman', desc: 'Broadcast & info perusahaan', longDesc: 'Kirim pengumuman penting ke seluruh karyawan atau per departemen dengan notifikasi.', icon: Bell, color: '#F57F17', bgColor: '#FFFDE7', category: 'Produktivitas', appCategory: 'productivity', group: 'Pengumuman', version: '17.0', installs: '2.3K', rating: 4.3, deps: [], href: '/productivity' },
  { id: 'approval', name: 'Approval', desc: 'Workflow persetujuan', longDesc: 'Buat flow approval multi-level untuk pembelian, pengeluaran, cuti, dan dokumen penting lainnya.', icon: CheckSquare, color: '#43A047', bgColor: '#E8F5E9', category: 'Produktivitas', appCategory: 'productivity', group: 'Approval', version: '17.0', installs: '4.2K', rating: 4.7, deps: [], href: '/productivity/approvals' },
  { id: 'workflow_engine', name: 'Workflow Engine', desc: 'Automasi proses bisnis', longDesc: 'Buat workflow otomatis berbasis trigger dan kondisi untuk mengotomasi proses bisnis.', icon: Workflow, color: '#7B1FA2', bgColor: '#F3E5F5', category: 'Produktivitas', appCategory: 'productivity', group: 'Workflow', version: '17.0', installs: '3.1K', rating: 4.6, deps: [], href: '/productivity/workflows' },

  // ── WEBSITE & COMMERCE ────────────────────────────────────────────────────
  { id: 'website_builder', name: 'Website Builder', desc: 'Buat website drag & drop', longDesc: 'Bangun halaman website profesional dengan drag & drop editor. Tidak perlu coding.', icon: Globe, color: '#0097A7', bgColor: '#E0F7FA', category: 'Website', appCategory: 'website', group: 'Website', version: '17.0', installs: '3.2K', rating: 4.6, deps: [], href: '/website', featured: true },
  { id: 'ecommerce', name: 'E-Commerce', desc: 'Toko online terintegrasi', longDesc: 'Kelola produk, harga, stok, dan order toko online dalam satu dashboard.', icon: Store, color: '#00897B', bgColor: '#E0F2F1', category: 'Website', appCategory: 'website', group: 'Website', version: '17.0', installs: '4.5K', rating: 4.7, deps: ['inventory', 'sales'], href: '/ecommerce', featured: true },
  { id: 'blog', name: 'Blog', desc: 'Konten & artikel', longDesc: 'Tulis, edit, dan publikasikan artikel blog dengan SEO-friendly editor.', icon: Rss, color: '#5C6BC0', bgColor: '#E8EAF6', category: 'Website', appCategory: 'website', group: 'Website', version: '17.0', installs: '2.1K', rating: 4.4, deps: ['website_builder'] },
  { id: 'seo', name: 'SEO Tools', desc: 'Optimasi mesin pencari', longDesc: 'Kelola meta tags, sitemap, structured data, dan analitik SEO langsung dari ERP.', icon: TrendingUp, color: '#43A047', bgColor: '#E8F5E9', category: 'Website', appCategory: 'website', group: 'Website', version: '17.0', installs: '1.9K', rating: 4.3, deps: ['website_builder'] },
  { id: 'live_chat', name: 'Live Chat', desc: 'Chat realtime dengan pelanggan', longDesc: 'Widget live chat yang bisa dipasang di website dan terhubung ke helpdesk.', icon: MessageSquareMore, color: '#F4511E', bgColor: '#FBE9E7', category: 'Website', appCategory: 'website', group: 'Website', version: '17.0', installs: '2.8K', rating: 4.5, deps: ['website_builder'] },
  { id: 'banner_slider', name: 'Banner & Slider', desc: 'Manajemen banner & promo', longDesc: 'Buat dan kelola banner promosi, slider, dan pop-up untuk website dan toko online.', icon: LayoutTemplate, color: '#E64A19', bgColor: '#FBE9E7', category: 'Website', appCategory: 'website', group: 'Website', version: '17.0', installs: '1.4K', rating: 4.2, deps: ['website_builder'] },
  { id: 'customer_portal', name: 'Customer Portal', desc: 'Portal mandiri pelanggan', longDesc: 'Pelanggan bisa pantau order, invoice, dan status layanan dari portal khusus.', icon: UserCog, color: '#1976D2', bgColor: '#E3F2FD', category: 'Website', appCategory: 'website', group: 'Website', version: '17.0', installs: '3.1K', rating: 4.6, deps: ['sales'] },

  // ── SYSTEM & ADMINISTRATION ────────────────────────────────────────────────
  { id: 'settings', name: 'Pengaturan', desc: 'Konfigurasi sistem ERP', longDesc: 'Pengaturan umum sistem: info perusahaan, lokalisasi, mata uang, dan konfigurasi global.', icon: Settings, color: '#9E9E9E', bgColor: '#F5F5F5', category: 'Sistem', appCategory: 'system', group: 'Sistem', version: '17.0', installs: '15.0K', rating: 4.5, deps: [], href: '/settings', isCore: true, status: 'core' },
  { id: 'access', name: 'User & Role', desc: 'User, role & permission', longDesc: 'Kelola pengguna, peran, dan hak akses granular per modul di seluruh sistem ERP.', icon: Shield, color: '#F44336', bgColor: '#FFEBEE', category: 'Sistem', appCategory: 'system', group: 'Sistem', version: '17.0', installs: '14.2K', rating: 4.7, deps: [], href: '/access', isCore: true, status: 'core' },
  { id: 'integrations', name: 'Integrasi', desc: 'API, webhook & third-party', longDesc: 'Kelola integrasi dengan Kledo, Shopee, Tokopedia, TikTok, WhatsApp Gateway, dan payment gateway.', icon: GitBranch, color: '#00838F', bgColor: '#E0F7FA', category: 'Sistem', appCategory: 'system', group: 'Sistem', version: '17.0', installs: '5.9K', rating: 4.7, deps: [], href: '/kledo' },
  { id: 'api_management', name: 'API Management', desc: 'API key & dokumentasi', longDesc: 'Kelola API key, pantau penggunaan API, rate limiting, dan akses dokumentasi API ERP.', icon: Code, color: '#212121', bgColor: '#F5F5F5', category: 'Sistem', appCategory: 'system', group: 'Dev', version: '17.0', installs: '2.8K', rating: 4.5, deps: [] },
  { id: 'queue_monitor', name: 'Queue Monitor', desc: 'Monitor antrian proses', longDesc: 'Pantau antrian background jobs, status sync marketplace, dan proses otomatis yang berjalan.', icon: ServerCog, color: '#7B1FA2', bgColor: '#F3E5F5', category: 'Sistem', appCategory: 'system', group: 'Dev', version: '17.0', installs: '2.1K', rating: 4.3, deps: [] },
  { id: 'backup', name: 'Backup Database', desc: 'Backup & restore data', longDesc: 'Jadwalkan backup database otomatis, download backup manual, dan restore data jika diperlukan.', icon: HardDrive, color: '#1B5E20', bgColor: '#E8F5E9', category: 'Sistem', appCategory: 'system', group: 'Security', version: '17.0', installs: '3.5K', rating: 4.7, deps: [] },
  { id: 'automation', name: 'Automation', desc: 'Cronjob & task otomatis', longDesc: 'Buat cronjob, trigger automasi, dan jadwal task otomatis berbasis waktu maupun event.', icon: Zap, color: '#F57F17', bgColor: '#FFFDE7', category: 'Sistem', appCategory: 'system', group: 'Dev', version: '17.0', installs: '3.2K', rating: 4.6, deps: ['workflow_engine'] },
  { id: 'audit_log', name: 'Audit Log', desc: 'Log perubahan & akses data', longDesc: 'Rekam semua perubahan data penting di sistem: siapa mengubah apa, kapan, dan dari mana.', icon: FileSearch, color: '#B71C1C', bgColor: '#FFEBEE', category: 'Sistem', appCategory: 'system', group: 'Security', version: '17.0', installs: '4.3K', rating: 4.8, deps: [] },

  // ── MULTI BRANCH ──────────────────────────────────────────────────────────
  { id: 'multi_branch', name: 'Multi Cabang', desc: 'Kelola semua cabang', longDesc: 'Kelola multiple cabang/lokasi bisnis dengan konsolidasi laporan dan pemisahan data per cabang.', icon: Building2, color: '#1565C0', bgColor: '#E3F2FD', category: 'Sistem', appCategory: 'multi_branch', group: 'Sistem', version: '17.0', installs: '3.8K', rating: 4.6, deps: [], featured: true },
];

export const FEATURED_MODULES = MODULES.filter(m => m.featured);
export const CORE_MODULES = MODULES.filter(m => m.isCore);
export const DEFAULT_INSTALLED_IDS = CORE_MODULES.map(m => m.id);
