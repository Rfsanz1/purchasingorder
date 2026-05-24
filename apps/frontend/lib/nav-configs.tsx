import {
  ShoppingCart, FileText, Users, BarChart2, TrendingUp, Settings,
  Package, Star, Calendar, Phone,
  DollarSign, BookOpen, Landmark, Receipt,
  ArrowLeftRight, Warehouse, ClipboardCheck,
  UserCheck, UserPlus, CalendarX, Bus,
  Truck, Building2, PackageCheck,
  Monitor, ArrowUpRight, ArrowDownRight, Wrench,
  MapPin, Bell, Shield, Zap, BarChart3, MessageSquare, Bot,
  CreditCard, RotateCcw, ChevronRight,
} from 'lucide-react';
import { NavItem } from '../components/layout/AppShell';

export const SALES_CONFIG = { appName: 'Penjualan', appColor: '#00ACC1', appGradient: 'from-cyan-500 to-cyan-700', appIcon: ShoppingCart };
export const SALES_NAV: NavItem[] = [
  { label: 'Dashboard',      href: '/sales',               icon: BarChart2 },
  { label: 'Order Penjualan', href: '/sales/orders',       icon: ShoppingCart, badge: 5,
    children: [
      { label: 'Semua Order',    href: '/sales/orders' },
      { label: 'Draft',          href: '/sales/orders?status=draft' },
      { label: 'Dikonfirmasi',   href: '/sales/orders?status=confirmed' },
    ],
  },
  { label: 'Invoice',         href: '/sales/faktur',       icon: FileText, badge: 3 },
  { label: 'Pelanggan',       href: '/customers',          icon: Users },
  { label: 'Produk',          href: '/sales/products',     icon: Package },
  { label: 'Laporan',         href: '/sales/reports',      icon: TrendingUp },
  { label: 'Pengaturan',      href: '/sales/settings',     icon: Settings },
];

export const CRM_CONFIG = { appName: 'CRM', appColor: '#8E24AA', appGradient: 'from-purple-500 to-purple-700', appIcon: Users };
export const CRM_NAV: NavItem[] = [
  { label: 'Dashboard',   href: '/crm',              icon: BarChart2 },
  { label: 'Pipeline',    href: '/crm/pipeline',     icon: TrendingUp, badge: 12 },
  { label: 'Prospek',     href: '/crm/leads',        icon: Star },
  { label: 'Pelanggan',   href: '/customers',        icon: Users },
  { label: 'Aktivitas',   href: '/crm/activities',   icon: Calendar },
  { label: 'Laporan',     href: '/crm/reports',      icon: BarChart2 },
  { label: 'Pengaturan',  href: '/crm/settings',     icon: Settings },
];

export const INVOICE_CONFIG = { appName: 'Invoice', appColor: '#1976D2', appGradient: 'from-blue-500 to-blue-700', appIcon: FileText };
export const INVOICE_NAV: NavItem[] = [
  { label: 'Dashboard',    href: '/invoice',              icon: BarChart2 },
  { label: 'Invoice',      href: '/invoice/list',         icon: FileText, badge: 8,
    children: [
      { label: 'Semua',       href: '/invoice/list' },
      { label: 'Draft',       href: '/invoice/list?status=draft' },
      { label: 'Dikirim',     href: '/invoice/list?status=posted' },
      { label: 'Lunas',       href: '/invoice/list?status=paid' },
      { label: 'Jatuh Tempo', href: '/invoice/list?status=overdue' },
    ],
  },
  { label: 'Kredit Nota',  href: '/invoice/credit-notes', icon: RotateCcw },
  { label: 'Pembayaran',   href: '/invoice/payments',     icon: CreditCard },
  { label: 'Pengaturan',   href: '/invoice/settings',     icon: Settings },
];

export const ACCOUNTING_CONFIG = { appName: 'Akuntansi', appColor: '#388E3C', appGradient: 'from-green-500 to-emerald-700', appIcon: DollarSign };
export const ACCOUNTING_NAV: NavItem[] = [
  { label: 'Dashboard',     href: '/accounting',                 icon: BarChart2 },
  { label: 'Invoice',       href: '/invoice',                    icon: FileText, badge: 8 },
  { label: 'Jurnal',        href: '/finance/journal-entries',    icon: BookOpen,
    children: [
      { label: 'Semua Jurnal', href: '/finance/journal-entries' },
      { label: 'Jurnal Umum',  href: '/finance/journal-entries?type=general' },
      { label: 'Penjualan',    href: '/finance/journal-entries?type=sales' },
      { label: 'Pembelian',    href: '/finance/journal-entries?type=purchase' },
    ],
  },
  { label: 'Pengeluaran',   href: '/finance/expenses',           icon: Receipt },
  { label: 'Kas & Bank',    href: '/finance/bank-accounts',      icon: Landmark },
  { label: 'Bagan Akun',    href: '/finance/coa',                icon: BookOpen },
  { label: 'Kas Keluar',    href: '/finance/cash',               icon: ArrowUpRight },
  { label: 'Laporan',       href: '/finance/reports',            icon: TrendingUp },
  { label: 'Pengaturan',    href: '/accounting/settings',        icon: Settings },
];

export const INVENTORY_CONFIG = { appName: 'Inventaris', appColor: '#F57C00', appGradient: 'from-amber-500 to-orange-600', appIcon: Package };
export const INVENTORY_NAV: NavItem[] = [
  { label: 'Dashboard',        href: '/inventory',                         icon: BarChart2 },
  { label: 'Produk',           href: '/inventory/products',                icon: Package,
    children: [
      { label: 'Semua Produk',  href: '/inventory/products' },
      { label: 'Kategori',      href: '/inventory/products/categories' },
    ],
  },
  { label: 'Penerimaan',       href: '/purchasing/goods-receipts',         icon: ArrowDownRight },
  { label: 'Pengiriman',       href: '/inventory/deliveries',              icon: ArrowUpRight },
  { label: 'Perpindahan Stok', href: '/inventory/stock-movements',         icon: ArrowLeftRight },
  { label: 'Stock Opname',     href: '/inventory/stock-opnames',           icon: ClipboardCheck },
  { label: 'Gudang',           href: '/inventory/warehouses',              icon: Warehouse },
  { label: 'Pengaturan',       href: '/inventory/settings',                icon: Settings },
];

export const HR_CONFIG = { appName: 'Sumber Daya Manusia', appColor: '#C2185B', appGradient: 'from-pink-500 to-rose-600', appIcon: UserCheck };
export const HR_NAV: NavItem[] = [
  { label: 'Dashboard',  href: '/hr',                 icon: BarChart2 },
  { label: 'Karyawan',   href: '/hr/employees',       icon: UserCheck },
  { label: 'Absensi',    href: '/hr/attendances',     icon: Calendar, badge: 3 },
  { label: 'Rekrutmen',  href: '/hr/recruitment',     icon: UserPlus },
  { label: 'Cuti',       href: '/hr/leaves',          icon: CalendarX, badge: 5 },
  { label: 'Penilaian',  href: '/hr/appraisals',      icon: Star },
  { label: 'Armada',     href: '/hr/fleet',           icon: Bus },
  { label: 'Payroll',    href: '/hr/payrolls',        icon: DollarSign },
  { label: 'Pengaturan', href: '/hr/settings',        icon: Settings },
];

export const PURCHASING_CONFIG = { appName: 'Pembelian', appColor: '#5D4037', appGradient: 'from-stone-500 to-stone-700', appIcon: Truck };
export const PURCHASING_NAV: NavItem[] = [
  { label: 'Dashboard',       href: '/purchasing',                        icon: BarChart2 },
  { label: 'Purchase Order',  href: '/purchasing/purchase-orders',        icon: FileText, badge: 4,
    children: [
      { label: 'Semua PO',     href: '/purchasing/purchase-orders' },
      { label: 'Draft',        href: '/purchasing/purchase-orders?status=draft' },
      { label: 'Dikonfirmasi', href: '/purchasing/purchase-orders?status=confirmed' },
    ],
  },
  { label: 'Penerimaan',      href: '/purchasing/goods-receipts',         icon: PackageCheck },
  { label: 'Supplier',        href: '/purchasing/suppliers',              icon: Building2 },
  { label: 'Laporan',         href: '/purchasing/reports',                icon: TrendingUp },
  { label: 'Pengaturan',      href: '/purchasing/settings',               icon: Settings },
];

export const POS_CONFIG = { appName: 'Kasir (POS)', appColor: '#E64A19', appGradient: 'from-orange-500 to-red-600', appIcon: Monitor };
export const POS_NAV: NavItem[] = [
  { label: 'Dashboard',   href: '/pos',              icon: BarChart2 },
  { label: 'Buka Kasir',  href: '/pos/cashier',      icon: Monitor },
  { label: 'Sesi Kasir',  href: '/pos/sessions',     icon: Calendar },
  { label: 'Order',       href: '/pos/orders',        icon: ShoppingCart },
  { label: 'Produk',      href: '/pos/products',      icon: Package },
  { label: 'Pelanggan',   href: '/customers',         icon: Users },
  { label: 'Laporan',     href: '/pos/reports',       icon: TrendingUp },
  { label: 'Pengaturan',  href: '/pos/settings',      icon: Settings },
];

export const DELIVERY_CONFIG = { appName: 'Pengiriman', appColor: '#1565C0', appGradient: 'from-blue-700 to-indigo-700', appIcon: Truck };
export const DELIVERY_NAV: NavItem[] = [
  { label: 'Dashboard',    href: '/delivery',         icon: BarChart2 },
  { label: 'Pengiriman',   href: '/delivery',         icon: Truck },
  { label: 'Wilayah',      href: '/delivery/areas',   icon: MapPin },
  { label: 'Driver',       href: '/driver',           icon: UserCheck },
  { label: 'Pengaturan',   href: '/delivery/settings',icon: Settings },
];

export const SETTINGS_CONFIG = { appName: 'Pengaturan', appColor: '#546E7A', appGradient: 'from-slate-500 to-slate-700', appIcon: Settings };
export const SETTINGS_NAV: NavItem[] = [
  { label: 'Umum',         href: '/settings',         icon: Settings },
  { label: 'Users & Akses', href: '/access',          icon: Shield },
  { label: 'Integrasi',    href: '/kledo',            icon: Zap },
  { label: 'Notifikasi',   href: '/notifications',    icon: Bell },
];

export const REPORTS_CONFIG = { appName: 'Laporan & Analitik', appColor: '#7B1FA2', appGradient: 'from-purple-600 to-violet-700', appIcon: BarChart3 };
export const REPORTS_NAV: NavItem[] = [
  { label: 'Ringkasan',       href: '/reports',              icon: BarChart2 },
  { label: 'Lap. Penjualan',  href: '/reports/sales',        icon: ShoppingCart },
  { label: 'Lap. Inventaris', href: '/reports/inventory',    icon: Package },
  { label: 'Lap. Keuangan',   href: '/reports/finance',      icon: DollarSign },
  { label: 'Lap. Pelanggan',  href: '/reports/customers',    icon: Users },
  { label: 'Lap. Pembelian',  href: '/reports/purchasing',   icon: Truck },
  { label: 'Lap. SDM',        href: '/reports/hr',           icon: UserCheck },
];
