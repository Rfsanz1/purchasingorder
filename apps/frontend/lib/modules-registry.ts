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
  BarChart,
} from 'lucide-react';

export interface ERP_Module {
  id: string;
  name: string;
  desc: string;
  longDesc: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  category: string;
  group: string;
  version: string;
  installs: string;
  rating: number;
  deps: string[];
  featured?: boolean;
  href?: string;
  isCore?: boolean;
}

// ─── CATEGORIES ────────────────────────────────────────────────────────────
export const MODULE_CATEGORIES = [
  'Semua', 'Website', 'Sales', 'Keuangan', 'Layanan',
  'Produktivitas', 'Supply Chain', 'Marketing', 'SDM', 'Sistem',
];

// ─── REGISTRY ───────────────────────────────────────────────────────────────
export const MODULES: ERP_Module[] = [

  // ── WEBSITE ───────────────────────────────────────────────────────────────
  { id: 'website_builder', name: 'Website Builder', desc: 'Buat website drag & drop', longDesc: 'Bangun halaman website profesional dengan drag & drop editor. Tidak perlu coding.', icon: Globe, color: '#0097A7', bgColor: '#E0F7FA', category: 'Website', group: 'Website', version: '17.0', installs: '3.2K', rating: 4.6, deps: [], href: '/website', featured: true },
  { id: 'ecommerce', name: 'E-Commerce', desc: 'Toko online terintegrasi', longDesc: 'Kelola produk, harga, stok, dan order toko online dalam satu dashboard.', icon: Store, color: '#00897B', bgColor: '#E0F2F1', category: 'Website', group: 'Website', version: '17.0', installs: '4.5K', rating: 4.7, deps: ['inventory', 'sales'], href: '/ecommerce', featured: true },
  { id: 'blog', name: 'Blog', desc: 'Konten & artikel', longDesc: 'Tulis, edit, dan publikasikan artikel blog dengan SEO-friendly editor.', icon: BookOpen, color: '#5C6BC0', bgColor: '#E8EAF6', category: 'Website', group: 'Website', version: '17.0', installs: '2.1K', rating: 4.4, deps: ['website_builder'] },
  { id: 'live_chat', name: 'Live Chat', desc: 'Chat realtime dengan pelanggan', longDesc: 'Widget live chat yang bisa dipasang di website dan terhubung ke helpdesk.', icon: MessageCircle, color: '#F4511E', bgColor: '#FBE9E7', category: 'Website', group: 'Website', version: '17.0', installs: '2.8K', rating: 4.5, deps: ['website_builder'] },
  { id: 'seo', name: 'SEO Tools', desc: 'Optimasi mesin pencari', longDesc: 'Kelola meta tags, sitemap, structured data, dan analitik SEO langsung dari ERP.', icon: TrendingUp, color: '#43A047', bgColor: '#E8F5E9', category: 'Website', group: 'Website', version: '17.0', installs: '1.9K', rating: 4.3, deps: ['website_builder'] },
  { id: 'customer_portal', name: 'Customer Portal', desc: 'Portal mandiri pelanggan', longDesc: 'Pelanggan bisa pantau order, invoice, dan status layanan dari portal khusus.', icon: Users, color: '#1976D2', bgColor: '#E3F2FD', category: 'Website', group: 'Website', version: '17.0', installs: '3.1K', rating: 4.6, deps: ['sales'] },
  { id: 'banner_slider', name: 'Banner & Slider', desc: 'Manajemen banner & promo', longDesc: 'Buat dan kelola banner promosi, slider, dan pop-up untuk website dan toko online.', icon: Camera, color: '#E64A19', bgColor: '#FBE9E7', category: 'Website', group: 'Website', version: '17.0', installs: '1.4K', rating: 4.2, deps: ['website_builder'] },

  // ── SALES ─────────────────────────────────────────────────────────────────
  { id: 'crm', name: 'CRM', desc: 'Pipeline & prospek pelanggan', longDesc: 'Kelola leads, prospek, pipeline penjualan, follow up, dan aktivitas tim sales dalam satu tempat.', icon: Users, color: '#9C27B0', bgColor: '#F3E5F5', category: 'Sales', group: 'CRM', version: '17.0', installs: '9.1K', rating: 4.7, deps: ['sales'], href: '/crm', featured: true },
  { id: 'sales', name: 'Penjualan', desc: 'Quotation, SO & DO', longDesc: 'Kelola seluruh proses penjualan: quotation, sales order, delivery order, retur, dan approval.', icon: ShoppingCart, color: '#00BCD4', bgColor: '#E0F7FA', category: 'Sales', group: 'Penjualan', version: '17.0', installs: '12.4K', rating: 4.8, deps: [], href: '/sales', featured: true },
  { id: 'invoice', name: 'Invoice', desc: 'Invoice, piutang & pembayaran', longDesc: 'Buat dan kirim invoice, pantau piutang, histori pembayaran, dan reminder otomatis.', icon: FileText, color: '#2196F3', bgColor: '#E3F2FD', category: 'Sales', group: 'Invoice', version: '17.0', installs: '11.2K', rating: 4.6, deps: ['accounting'], href: '/invoice' },
  { id: 'pos', name: 'Point of Sale', desc: 'Kasir, shift & promo', longDesc: 'Sistem kasir modern dengan shift kasir, refund, closing kasir, dan promo POS.', icon: Monitor, color: '#FF5722', bgColor: '#FBE9E7', category: 'Sales', group: 'POS', version: '17.0', installs: '8.3K', rating: 4.9, deps: ['inventory'], href: '/pos', featured: true },
  { id: 'marketplace', name: 'Marketplace', desc: 'Shopee, Tokopedia, TikTok', longDesc: 'Sinkronisasi produk, stok, dan order dari Shopee, Tokopedia, dan TikTok Shop ke dalam satu dashboard.', icon: Store, color: '#E91E63', bgColor: '#FCE4EC', category: 'Sales', group: 'Marketplace', version: '17.0', installs: '6.8K', rating: 4.7, deps: ['inventory', 'sales'], href: '/marketplace', featured: true },
  { id: 'customers', name: 'Pelanggan', desc: 'Data, membership & loyalty', longDesc: 'Kelola data pelanggan, membership, loyalty point, histori pembelian, dan blacklist customer.', icon: Users, color: '#FF9800', bgColor: '#FFF3E0', category: 'Sales', group: 'Pelanggan', version: '17.0', installs: '7.2K', rating: 4.5, deps: [], href: '/customers' },
  { id: 'fleet', name: 'Pengiriman & Armada', desc: 'Driver, surat jalan & tracking', longDesc: 'Kelola armada, driver, surat jalan, tracking pengiriman, dan bukti kirim digital.', icon: Truck, color: '#009688', bgColor: '#E0F2F1', category: 'Sales', group: 'Pengiriman', version: '17.0', installs: '3.4K', rating: 4.3, deps: [], href: '/fleet' },
  { id: 'sales_report', name: 'Laporan Penjualan', desc: 'Analytics penjualan lengkap', longDesc: 'Laporan penjualan per produk, sales person, wilayah, periode, dan channel dengan grafik interaktif.', icon: BarChart2, color: '#607D8B', bgColor: '#ECEFF1', category: 'Sales', group: 'Laporan', version: '17.0', installs: '8.1K', rating: 4.7, deps: ['sales'], href: '/reports/sales' },

  // ── KEUANGAN ──────────────────────────────────────────────────────────────
  { id: 'accounting', name: 'Akuntansi', desc: 'COA, jurnal & laporan keuangan', longDesc: 'Akuntansi double-entry lengkap dengan COA, jurnal umum, buku besar, neraca, L/R, dan arus kas.', icon: DollarSign, color: '#4CAF50', bgColor: '#E8F5E9', category: 'Keuangan', group: 'Akuntansi', version: '17.0', installs: '10.5K', rating: 4.8, deps: [], href: '/accounting', featured: true },
  { id: 'bank_cash', name: 'Kas & Bank', desc: 'Rekening, mutasi & rekonsiliasi', longDesc: 'Kelola rekening bank, catat mutasi, lakukan rekonsiliasi bank, dan transfer antar rekening.', icon: Landmark, color: '#1565C0', bgColor: '#E3F2FD', category: 'Keuangan', group: 'Kas & Bank', version: '17.0', installs: '7.8K', rating: 4.6, deps: ['accounting'] },
  { id: 'expenses', name: 'Pengeluaran', desc: 'Biaya, approval & reimburse', longDesc: 'Catat biaya operasional, proses approval pengeluaran, cash advance, dan reimbursement karyawan.', icon: Receipt, color: '#F57F17', bgColor: '#FFFDE7', category: 'Keuangan', group: 'Pengeluaran', version: '17.0', installs: '6.3K', rating: 4.5, deps: ['accounting'] },
  { id: 'tax', name: 'Pajak', desc: 'PPN, PPh & e-Faktur', longDesc: 'Kelola PPN, PPh, cetak e-Faktur, dan buat laporan pajak sesuai format DJP.', icon: FileBox, color: '#C62828', bgColor: '#FFEBEE', category: 'Keuangan', group: 'Pajak', version: '17.0', installs: '5.2K', rating: 4.6, deps: ['accounting'] },
  { id: 'assets', name: 'Aset Tetap', desc: 'Aset, depresiasi & maintenance', longDesc: 'Kelola aset tetap perusahaan dengan depresiasi otomatis, maintenance aset, dan histori perpindahan.', icon: Database, color: '#6A1B9A', bgColor: '#F3E5F5', category: 'Keuangan', group: 'Asset', version: '17.0', installs: '4.1K', rating: 4.4, deps: ['accounting'] },
  { id: 'finance_bi', name: 'BI & Analytics', desc: 'Dashboard keuangan & forecast', longDesc: 'Business intelligence keuangan dengan forecasting, dashboard eksekutif, dan laporan kustom.', icon: BarChart2, color: '#00838F', bgColor: '#E0F7FA', category: 'Keuangan', group: 'BI', version: '17.0', installs: '4.7K', rating: 4.7, deps: ['accounting'], href: '/reports/finance' },

  // ── LAYANAN ───────────────────────────────────────────────────────────────
  { id: 'helpdesk', name: 'Helpdesk', desc: 'Tiket, SLA & dukungan', longDesc: 'Kelola tiket dukungan dengan SLA, prioritas, eskalasi otomatis, dan laporan performa tim.', icon: MessageSquare, color: '#E53935', bgColor: '#FFEBEE', category: 'Layanan', group: 'Helpdesk', version: '17.0', installs: '3.7K', rating: 4.6, deps: ['crm'], href: '/helpdesk' },
  { id: 'service_repair', name: 'Service Elektronik', desc: 'Garansi, perbaikan & teknisi', longDesc: 'Kelola klaim garansi, unit masuk servis, penggantian sparepart, assign teknisi, dan status perbaikan.', icon: Wrench, color: '#F57F17', bgColor: '#FFFDE7', category: 'Layanan', group: 'Service', version: '17.0', installs: '2.4K', rating: 4.5, deps: ['helpdesk'], href: '/service', featured: true },
  { id: 'appointment', name: 'Appointment', desc: 'Jadwal, booking & reminder', longDesc: 'Buat jadwal konsultasi/service, terima booking online, kirim reminder ke pelanggan.', icon: Calendar, color: '#00897B', bgColor: '#E0F2F1', category: 'Layanan', group: 'Appointment', version: '17.0', installs: '2.1K', rating: 4.3, deps: [] },
  { id: 'project', name: 'Proyek', desc: 'Task, Kanban & timeline', longDesc: 'Kelola proyek internal dengan task, tampilan Kanban, Gantt timeline, dan progress tracking.', icon: Layers, color: '#5C6BC0', bgColor: '#E8EAF6', category: 'Layanan', group: 'Project', version: '17.0', installs: '5.1K', rating: 4.7, deps: [], href: '/project' },
  { id: 'planning', name: 'Planning', desc: 'Resource & kapasitas', longDesc: 'Rencanakan kapasitas tim dan resource, buat jadwal mingguan, dan pantau utilisasi tim.', icon: ClipboardList, color: '#546E7A', bgColor: '#ECEFF1', category: 'Layanan', group: 'Planning', version: '17.0', installs: '1.8K', rating: 4.2, deps: ['project'] },

  // ── PRODUKTIVITAS ─────────────────────────────────────────────────────────
  { id: 'documents', name: 'Dokumen', desc: 'DMS & manajemen file', longDesc: 'Simpan, kelola, dan bagikan dokumen perusahaan dengan folder hierarki dan hak akses per dokumen.', icon: FileBox, color: '#0097A7', bgColor: '#E0F7FA', category: 'Produktivitas', group: 'Dokumen', version: '17.0', installs: '3.9K', rating: 4.5, deps: [], href: '/productivity/documents' },
  { id: 'approval', name: 'Approval', desc: 'Workflow persetujuan', longDesc: 'Buat flow approval multi-level untuk pembelian, pengeluaran, cuti, dan dokumen penting lainnya.', icon: CheckSquare, color: '#43A047', bgColor: '#E8F5E9', category: 'Produktivitas', group: 'Approval', version: '17.0', installs: '4.2K', rating: 4.7, deps: [], href: '/productivity/approvals' },
  { id: 'knowledge', name: 'Knowledge Base', desc: 'SOP, panduan & wiki internal', longDesc: 'Buat dan kelola wiki internal, SOP, panduan produk, dan artikel pengetahuan untuk tim.', icon: BookOpen, color: '#5C6BC0', bgColor: '#E8EAF6', category: 'Produktivitas', group: 'Knowledge', version: '17.0', installs: '2.6K', rating: 4.4, deps: [], href: '/productivity/knowledge' },
  { id: 'calendar_app', name: 'Kalender', desc: 'Jadwal & agenda tim', longDesc: 'Kalender bersama untuk tim, sinkronisasi jadwal, meeting, dan event perusahaan.', icon: Calendar, color: '#E64A19', bgColor: '#FBE9E7', category: 'Produktivitas', group: 'Kalender', version: '17.0', installs: '3.5K', rating: 4.6, deps: [], href: '/productivity/calendar' },
  { id: 'internal_chat', name: 'Chat Internal', desc: 'Komunikasi tim real-time', longDesc: 'Fitur chat internal antar karyawan, channel per departemen, dan notifikasi real-time.', icon: MessageCircle, color: '#1976D2', bgColor: '#E3F2FD', category: 'Produktivitas', group: 'Chat', version: '17.0', installs: '5.1K', rating: 4.8, deps: [], href: '/productivity/chat' },
  { id: 'announcements', name: 'Pengumuman', desc: 'Broadcast & info perusahaan', longDesc: 'Kirim pengumuman penting ke seluruh karyawan atau per departemen dengan notifikasi.', icon: Bell, color: '#F57F17', bgColor: '#FFFDE7', category: 'Produktivitas', group: 'Pengumuman', version: '17.0', installs: '2.3K', rating: 4.3, deps: [], href: '/productivity' },
  { id: 'workflow_engine', name: 'Workflow Engine', desc: 'Automasi proses bisnis', longDesc: 'Buat workflow otomatis berbasis trigger dan kondisi untuk mengotomasi proses bisnis.', icon: Workflow, color: '#7B1FA2', bgColor: '#F3E5F5', category: 'Produktivitas', group: 'Workflow', version: '17.0', installs: '3.1K', rating: 4.6, deps: [], href: '/productivity/workflows' },
  { id: 'activity_log', name: 'Activity Log', desc: 'Log aktivitas pengguna', longDesc: 'Pantau semua aktivitas pengguna di sistem: login, perubahan data, aksi penting.', icon: Activity, color: '#00838F', bgColor: '#E0F7FA', category: 'Produktivitas', group: 'Log', version: '17.0', installs: '4.8K', rating: 4.7, deps: [], href: '/productivity/activity' },
  { id: 'notifications', name: 'Notifikasi', desc: 'Push, email & in-app notif', longDesc: 'Kelola notifikasi sistem: in-app, email, push notification untuk semua event penting ERP.', icon: Bell, color: '#FF9800', bgColor: '#FFF3E0', category: 'Produktivitas', group: 'Notifikasi', version: '17.0', installs: '6.2K', rating: 4.5, deps: [], href: '/notifications' },

  // ── SUPPLY CHAIN ──────────────────────────────────────────────────────────
  { id: 'inventory', name: 'Inventaris', desc: 'Produk, stok & barcode', longDesc: 'Manajemen produk lengkap: kategori, brand, barcode, bundle produk, dan riwayat stok.', icon: Package, color: '#FF9800', bgColor: '#FFF3E0', category: 'Supply Chain', group: 'Inventaris', version: '17.0', installs: '13.8K', rating: 4.9, deps: [], href: '/inventory', featured: true },
  { id: 'warehouse', name: 'Gudang', desc: 'Multi gudang & stock opname', longDesc: 'Kelola multi gudang, transfer antar gudang, stock opname, penyesuaian stok, dan mutasi barang.', icon: Warehouse, color: '#795548', bgColor: '#EFEBE9', category: 'Supply Chain', group: 'Gudang', version: '17.0', installs: '7.4K', rating: 4.7, deps: ['inventory'], href: '/inventory/warehouses' },
  { id: 'purchase', name: 'Pembelian', desc: 'RFQ, PO & penerimaan', longDesc: 'Kelola supplier, RFQ, purchase order, penerimaan barang, retur supplier, dan hutang.', icon: ShoppingBag, color: '#546E7A', bgColor: '#ECEFF1', category: 'Supply Chain', group: 'Pembelian', version: '17.0', installs: '7.6K', rating: 4.5, deps: ['inventory'], href: '/purchasing' },
  { id: 'manufacturing', name: 'Manufaktur', desc: 'BOM, work order & produksi', longDesc: 'Rencanakan produksi dengan BOM, work order, jadwal produksi, dan cost produksi otomatis.', icon: Factory, color: '#546E7A', bgColor: '#ECEFF1', category: 'Supply Chain', group: 'Manufaktur', version: '17.0', installs: '4.1K', rating: 4.5, deps: ['inventory'], href: '/manufacturing', featured: true },
  { id: 'quality', name: 'Quality Control', desc: 'QC produk & standar mutu', longDesc: 'Lakukan QC produk dan gudang, catat reject, dan tetapkan standar QC per produk.', icon: Award, color: '#1976D2', bgColor: '#E3F2FD', category: 'Supply Chain', group: 'QC', version: '17.0', installs: '2.8K', rating: 4.4, deps: ['manufacturing'], href: '/quality' },
  { id: 'maintenance', name: 'Maintenance', desc: 'Mesin, jadwal & sparepart', longDesc: 'Jadwalkan dan catat maintenance mesin, kelola sparepart mesin, dan pantau histori perawatan.', icon: Wrench, color: '#F57F17', bgColor: '#FFFDE7', category: 'Supply Chain', group: 'Maintenance', version: '17.0', installs: '2.3K', rating: 4.3, deps: ['manufacturing'], href: '/maintenance' },

  // ── MARKETING ─────────────────────────────────────────────────────────────
  { id: 'email_marketing', name: 'Email Marketing', desc: 'Campaign & blast email', longDesc: 'Buat dan kirim campaign email massal dengan template, segmentasi, dan laporan open rate.', icon: Mail, color: '#E53935', bgColor: '#FFEBEE', category: 'Marketing', group: 'Email', version: '17.0', installs: '3.2K', rating: 4.5, deps: [], href: '/marketing' },
  { id: 'whatsapp_marketing', name: 'WhatsApp Marketing', desc: 'Blast WA & auto reply', longDesc: 'Kirim pesan WhatsApp massal, atur auto reply, dan pantau statistik pesan terkirim/terbaca.', icon: MessageCircle, color: '#2E7D32', bgColor: '#E8F5E9', category: 'Marketing', group: 'WhatsApp', version: '17.0', installs: '4.8K', rating: 4.8, deps: [], href: '/marketing', featured: true },
  { id: 'campaign', name: 'Campaign Manager', desc: 'Kelola campaign multi-channel', longDesc: 'Rencanakan, jalankan, dan pantau campaign pemasaran di semua channel dari satu dashboard.', icon: Megaphone, color: '#F57F17', bgColor: '#FFFDE7', category: 'Marketing', group: 'Campaign', version: '17.0', installs: '2.9K', rating: 4.6, deps: [] },
  { id: 'voucher', name: 'Voucher & Promo', desc: 'Diskon, voucher & cashback', longDesc: 'Buat kode voucher, cashback, diskon otomatis, dan batas penggunaan per customer.', icon: Tag, color: '#AD1457', bgColor: '#FCE4EC', category: 'Marketing', group: 'Voucher', version: '17.0', installs: '5.1K', rating: 4.7, deps: ['sales'] },
  { id: 'loyalty', name: 'Loyalty Program', desc: 'Poin reward & membership', longDesc: 'Buat program loyalty dengan poin reward, tier membership, dan penukaran hadiah otomatis.', icon: Gift, color: '#6A1B9A', bgColor: '#F3E5F5', category: 'Marketing', group: 'Loyalty', version: '17.0', installs: '3.6K', rating: 4.5, deps: ['customers'] },
  { id: 'survey', name: 'Survey', desc: 'Kuesioner & feedback pelanggan', longDesc: 'Buat survey kepuasan pelanggan, Net Promoter Score (NPS), dan analitik hasil survey.', icon: CheckSquare, color: '#00838F', bgColor: '#E0F7FA', category: 'Marketing', group: 'Survey', version: '17.0', installs: '2.0K', rating: 4.3, deps: [] },
  { id: 'marketing_analytics', name: 'Analytics Marketing', desc: 'ROI campaign & conversion', longDesc: 'Pantau ROI setiap campaign, conversion rate, customer acquisition cost, dan CLV.', icon: BarChart, color: '#1565C0', bgColor: '#E3F2FD', category: 'Marketing', group: 'Analytics', version: '17.0', installs: '2.7K', rating: 4.6, deps: ['campaign'], href: '/reports' },

  // ── SDM ────────────────────────────────────────────────────────────────────
  { id: 'hr', name: 'Karyawan', desc: 'Data SDM, departemen & jabatan', longDesc: 'Kelola data karyawan, struktur departemen, jabatan, dan dokumen karyawan secara terpusat.', icon: UserCheck, color: '#E91E63', bgColor: '#FCE4EC', category: 'SDM', group: 'Karyawan', version: '17.0', installs: '8.9K', rating: 4.7, deps: [], href: '/hr' },
  { id: 'attendance', name: 'Kehadiran', desc: 'Absensi, shift & fingerprint', longDesc: 'Lacak kehadiran dengan integrasi fingerprint/face, kelola shift kerja dan monitoring real-time.', icon: Clock, color: '#009688', bgColor: '#E0F2F1', category: 'SDM', group: 'Kehadiran', version: '17.0', installs: '5.8K', rating: 4.5, deps: ['hr'], href: '/hr/attendances' },
  { id: 'payroll', name: 'Payroll', desc: 'Gaji, BPJS & PPh21', longDesc: 'Hitung gaji otomatis dengan komponen BPJS, PPh21, bonus, dan potongan sesuai peraturan.', icon: CreditCard, color: '#673AB7', bgColor: '#EDE7F6', category: 'SDM', group: 'Payroll', version: '17.0', installs: '6.2K', rating: 4.6, deps: ['hr'], href: '/payroll' },
  { id: 'recruitment', name: 'Rekrutmen', desc: 'Lowongan, kandidat & hiring', longDesc: 'Publikasikan lowongan, kelola kandidat, jadwalkan interview, dan proses hiring dari satu platform.', icon: HeartHandshake, color: '#AD1457', bgColor: '#FCE4EC', category: 'SDM', group: 'Rekrutmen', version: '17.0', installs: '2.1K', rating: 4.3, deps: ['hr'], href: '/recruitment' },
  { id: 'leave', name: 'Cuti & Izin', desc: 'Pengajuan, approval & histori', longDesc: 'Kelola pengajuan cuti, persetujuan atasan, saldo cuti, dan jenis cuti sesuai kebijakan.', icon: CalendarX, color: '#FF7043', bgColor: '#FBE9E7', category: 'SDM', group: 'Cuti', version: '17.0', installs: '4.9K', rating: 4.4, deps: ['hr', 'attendance'], href: '/hr/leaves' },
  { id: 'appraisal', name: 'Appraisal', desc: 'Penilaian kinerja karyawan', longDesc: 'Lakukan penilaian kinerja 360°, tetapkan KPI, pantau pencapaian, dan buat laporan appraisal.', icon: Star, color: '#F9A825', bgColor: '#FFFDE7', category: 'SDM', group: 'Appraisal', version: '17.0', installs: '2.4K', rating: 4.4, deps: ['hr'], href: '/hr/appraisals' },

  // ── SISTEM ────────────────────────────────────────────────────────────────
  { id: 'settings', name: 'Pengaturan', desc: 'Konfigurasi sistem ERP', longDesc: 'Pengaturan umum sistem: info perusahaan, lokalisasi, mata uang, dan konfigurasi global.', icon: Settings, color: '#9E9E9E', bgColor: '#F5F5F5', category: 'Sistem', group: 'Sistem', version: '17.0', installs: '15.0K', rating: 4.5, deps: [], href: '/settings', isCore: true },
  { id: 'access', name: 'User & Role', desc: 'User, role & permission', longDesc: 'Kelola pengguna, peran, dan hak akses granular per modul di seluruh sistem ERP.', icon: Shield, color: '#F44336', bgColor: '#FFEBEE', category: 'Sistem', group: 'Sistem', version: '17.0', installs: '14.2K', rating: 4.7, deps: [], href: '/access', isCore: true },
  { id: 'multi_branch', name: 'Multi Cabang', desc: 'Kelola semua cabang', longDesc: 'Kelola multiple cabang/lokasi bisnis dengan konsolidasi laporan dan pemisahan data per cabang.', icon: Building2, color: '#1565C0', bgColor: '#E3F2FD', category: 'Sistem', group: 'Sistem', version: '17.0', installs: '3.8K', rating: 4.6, deps: [], featured: true },
  { id: 'integrations', name: 'Integrasi', desc: 'API, webhook & third-party', longDesc: 'Kelola integrasi dengan Kledo, Shopee, Tokopedia, TikTok, WhatsApp Gateway, dan payment gateway.', icon: GitBranch, color: '#00838F', bgColor: '#E0F7FA', category: 'Sistem', group: 'Sistem', version: '17.0', installs: '5.9K', rating: 4.7, deps: [], href: '/kledo' },
  { id: 'queue_monitor', name: 'Queue Monitor', desc: 'Monitor antrian proses', longDesc: 'Pantau antrian background jobs, status sync marketplace, dan proses otomatis yang berjalan.', icon: Activity, color: '#7B1FA2', bgColor: '#F3E5F5', category: 'Sistem', group: 'Dev', version: '17.0', installs: '2.1K', rating: 4.3, deps: [] },
  { id: 'audit_log', name: 'Audit Log', desc: 'Log perubahan & akses data', longDesc: 'Rekam semua perubahan data penting di sistem: siapa mengubah apa, kapan, dan dari mana.', icon: Lock, color: '#B71C1C', bgColor: '#FFEBEE', category: 'Sistem', group: 'Security', version: '17.0', installs: '4.3K', rating: 4.8, deps: [] },
  { id: 'api_management', name: 'API Management', desc: 'API key & dokumentasi', longDesc: 'Kelola API key, pantau penggunaan API, rate limiting, dan akses dokumentasi API ERP.', icon: Code, color: '#212121', bgColor: '#F5F5F5', category: 'Sistem', group: 'Dev', version: '17.0', installs: '2.8K', rating: 4.5, deps: [] },
  { id: 'automation', name: 'Automation', desc: 'Cronjob & task otomatis', longDesc: 'Buat cronjob, trigger automasi, dan jadwal task otomatis berbasis waktu maupun event.', icon: Zap, color: '#F57F17', bgColor: '#FFFDE7', category: 'Sistem', group: 'Dev', version: '17.0', installs: '3.2K', rating: 4.6, deps: ['workflow_engine'] },
  { id: 'backup', name: 'Backup Database', desc: 'Backup & restore data', longDesc: 'Jadwalkan backup database otomatis, download backup manual, dan restore data jika diperlukan.', icon: Database, color: '#1B5E20', bgColor: '#E8F5E9', category: 'Sistem', group: 'Security', version: '17.0', installs: '3.5K', rating: 4.7, deps: [] },
  { id: 'reports', name: 'Laporan & BI', desc: 'Analitik bisnis menyeluruh', longDesc: 'Dashboard BI dengan grafik interaktif, laporan kustom, dan analitik mendalam semua modul.', icon: BarChart2, color: '#607D8B', bgColor: '#ECEFF1', category: 'Sistem', group: 'Sistem', version: '17.0', installs: '9.3K', rating: 4.8, deps: [], href: '/reports' },
];

export const FEATURED_MODULES = MODULES.filter(m => m.featured);
export const CORE_MODULES = MODULES.filter(m => m.isCore);
export const DEFAULT_INSTALLED_IDS = CORE_MODULES.map(m => m.id);
