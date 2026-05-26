'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Truck, DollarSign,
  UserCheck, BarChart2, Settings, Bell, ShieldCheck, Store,
  ChevronRight, Zap, Search, Menu, X, LogOut, User, Monitor,
  FileText, Warehouse, ClipboardList, CreditCard, BookOpen, Building2, MapPin,
  Factory, Wrench, Car, UserPlus, ShoppingBag, Heart, RefreshCw, Globe,
} from 'lucide-react';
import { useAuthStore } from '../../lib/store/useAuthStore';
import { useNotificationStore } from '../../lib/store/useNotificationStore';

interface NavChild {
  href: string;
  label: string;
}

interface NavItem {
  href?: string;
  label: string;
  icon: React.ElementType;
  children?: NavChild[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'UTAMA',
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/notifications', label: 'Notifikasi', icon: Bell },
    ],
  },
  {
    label: 'PENJUALAN & CRM',
    items: [
      {
        label: 'Penjualan', icon: ShoppingCart,
        children: [
          { href: '/sales/quotations', label: 'Quotation' },
          { href: '/sales/orders', label: 'Sales Orders' },
          { href: '/sales/pricelists', label: 'Price List' },
          { href: '/sales/teams', label: 'Sales Team' },
          { href: '/sales/commission', label: 'Komisi Sales' },
        ],
      },
      {
        label: 'CRM', icon: Users,
        children: [
          { href: '/crm/leads', label: 'Leads' },
          { href: '/crm/pipeline', label: 'Pipeline Kanban' },
          { href: '/crm/opportunities', label: 'Opportunity' },
          { href: '/crm/activities', label: 'Aktivitas' },
          { href: '/crm/followup', label: 'Follow-up' },
        ],
      },
      {
        label: 'Invoice', icon: FileText,
        children: [
          { href: '/invoice/list', label: 'Invoice' },
          { href: '/invoice/down-payment', label: 'Down Payment' },
          { href: '/invoice/recurring', label: 'Recurring Invoice' },
          { href: '/invoice/payments', label: 'Pembayaran' },
          { href: '/invoice/aging', label: 'Aging Report' },
          { href: '/invoice/credit-notes', label: 'Kredit Nota' },
        ],
      },
      { href: '/pos/orders', label: 'Point of Sale', icon: Monitor },
      { href: '/customers', label: 'Pelanggan', icon: Users },
    ],
  },
  {
    label: 'OPERASIONAL',
    items: [
      {
        label: 'Inventory', icon: Package,
        children: [
          { href: '/inventory/products', label: 'Produk' },
          { href: '/inventory/lots', label: 'Lot & Serial Number' },
          { href: '/inventory/transfers', label: 'Transfer Stok' },
          { href: '/inventory/stock-movements', label: 'Mutasi Stok' },
          { href: '/inventory/stock-opnames', label: 'Stock Opname' },
          { href: '/inventory/warehouses', label: 'Gudang' },
          { href: '/inventory/reorder-rules', label: 'Reorder Rules' },
        ],
      },
      {
        label: 'Pembelian', icon: Truck,
        children: [
          { href: '/purchasing/rfq', label: 'RFQ' },
          { href: '/purchasing/purchase-orders', label: 'Purchase Orders' },
          { href: '/purchasing/goods-receipts', label: 'Penerimaan Barang' },
          { href: '/purchasing/price-comparison', label: 'Perbandingan Harga' },
          { href: '/purchasing/approval-matrix', label: 'Approval Matrix' },
          { href: '/purchasing/suppliers', label: 'Supplier' },
        ],
      },
      {
        label: 'Manufaktur', icon: Factory,
        children: [
          { href: '/manufacturing/bom', label: 'Bill of Materials' },
          { href: '/manufacturing/orders', label: 'Work Order' },
          { href: '/manufacturing/mrp', label: 'MRP' },
          { href: '/manufacturing/work-centers', label: 'Work Center' },
          { href: '/manufacturing/scrap', label: 'Scrap' },
          { href: '/manufacturing/production-cost', label: 'Biaya Produksi' },
        ],
      },
      {
        label: 'Servis', icon: Wrench,
        children: [
          { href: '/service/work-orders', label: 'Work Order Servis' },
          { href: '/service/estimates', label: 'Estimasi Biaya' },
          { href: '/service/history', label: 'Riwayat Servis' },
          { href: '/service/warranties', label: 'Garansi Jasa' },
        ],
      },
      {
        label: 'Pengiriman', icon: MapPin,
        children: [
          { href: '/delivery/areas', label: 'Wilayah Pengiriman' },
          { href: '/driver', label: 'Dashboard Driver' },
          { href: '/delivery/settings', label: 'Pengaturan Pengiriman' },
        ],
      },
      {
        label: 'Armada', icon: Car,
        children: [
          { href: '/fleet/vehicles', label: 'Kendaraan' },
          { href: '/fleet/documents', label: 'Dokumen Kendaraan' },
          { href: '/fleet/reminders', label: 'Reminder STNK/KIR' },
          { href: '/fleet/fuel-tracking', label: 'Tracking BBM' },
          { href: '/fleet/assignments', label: 'Penugasan Driver' },
        ],
      },
      {
        label: 'Marketplace', icon: ShoppingBag,
        children: [
          { href: '/marketplace/price-sync', label: 'Sinkronisasi Harga' },
          { href: '/marketplace/stock-reservation', label: 'Reservasi Stok' },
          { href: '/marketplace/returns', label: 'Retur' },
          { href: '/marketplace/commissions', label: 'Komisi Platform' },
        ],
      },
    ],
  },
  {
    label: 'KEUANGAN',
    items: [
      {
        label: 'Akuntansi', icon: DollarSign,
        children: [
          { href: '/finance/journal-entries', label: 'Jurnal Entry' },
          { href: '/finance/bank-reconciliation', label: 'Rekonsiliasi Bank' },
          { href: '/finance/coa', label: 'Chart of Accounts' },
          { href: '/finance/bank-accounts', label: 'Bank & Kas' },
          { href: '/finance/fixed-assets', label: 'Aset Tetap' },
          { href: '/finance/budget', label: 'Budget' },
          { href: '/finance/aged-receivable', label: 'Piutang Aging' },
          { href: '/finance/aged-payable', label: 'Hutang Aging' },
          { href: '/finance/tax-config', label: 'Konfigurasi Pajak' },
          { href: '/finance/currencies', label: 'Multi Mata Uang' },
        ],
      },
      {
        label: 'Laporan Keuangan', icon: BarChart2,
        children: [
          { href: '/finance/reports?type=pl', label: 'Laba & Rugi' },
          { href: '/finance/reports?type=bs', label: 'Neraca' },
          { href: '/finance/reports?type=cf', label: 'Cash Flow' },
          { href: '/finance/reports?type=tb', label: 'Trial Balance' },
          { href: '/finance/reports?type=gl', label: 'Buku Besar' },
        ],
      },
    ],
  },
  {
    label: 'SDM & PAYROLL',
    items: [
      {
        label: 'HR & Karyawan', icon: UserCheck,
        children: [
          { href: '/hr/employees', label: 'Data Karyawan' },
          { href: '/hr/organization', label: 'Struktur Organisasi' },
          { href: '/hr/attendances', label: 'Absensi' },
          { href: '/hr/leaves', label: 'Cuti & Izin' },
          { href: '/hr/training', label: 'Training' },
          { href: '/hr/certifications', label: 'Sertifikasi' },
          { href: '/hr/loans', label: 'Pinjaman Karyawan' },
          { href: '/hr/bpjs', label: 'BPJS' },
          { href: '/hr/appraisals', label: 'Penilaian KPI' },
        ],
      },
      {
        label: 'Payroll', icon: DollarSign,
        children: [
          { href: '/hr/payrolls/components', label: 'Komponen Gaji' },
          { href: '/hr/payrolls/batch', label: 'Slip Gaji Massal' },
          { href: '/hr/payrolls/bpjs-calc', label: 'Kalkulator BPJS' },
          { href: '/hr/payrolls/pph21-calc', label: 'Kalkulator PPh21' },
          { href: '/hr/payrolls/bank-export', label: 'Export Bank' },
        ],
      },
      {
        label: 'Rekrutmen', icon: UserPlus,
        children: [
          { href: '/recruitment/positions', label: 'Lowongan' },
          { href: '/recruitment/applications', label: 'Pelamar' },
          { href: '/recruitment/scoring', label: 'Scoring Pelamar' },
          { href: '/recruitment/onboarding', label: 'Onboarding' },
          { href: '/recruitment/contract-generator', label: 'Generator Kontrak' },
        ],
      },
    ],
  },
  {
    label: 'LAPORAN & AI',
    items: [
      {
        label: 'Reports', icon: BarChart2,
        children: [
          { href: '/reports/sales', label: 'Lap. Penjualan' },
          { href: '/reports/finance', label: 'Lap. Keuangan' },
          { href: '/reports/inventory', label: 'Lap. Inventaris' },
          { href: '/reports/hr', label: 'Lap. SDM' },
          { href: '/reports/payroll', label: 'Lap. Payroll' },
          { href: '/reports/manufacturing', label: 'Lap. Manufaktur' },
          { href: '/reports/analytics', label: 'Analytics' },
        ],
      },
      {
        label: 'AI Features', icon: Zap,
        children: [
          { href: '/ai/inventory', label: 'AI Inventory' },
          { href: '/ai/analytics', label: 'AI Analytics' },
          { href: '/ai/chatbot', label: 'Chatbot' },
        ],
      },
    ],
  },
  {
    label: 'SISTEM',
    items: [
      {
        label: 'Pengaturan', icon: Settings,
        children: [
          { href: '/settings', label: 'Pengaturan Umum' },
          { href: '/settings/users', label: 'User Management' },
          { href: '/settings/roles', label: 'Role & Permission' },
          { href: '/settings/companies', label: 'Multi Perusahaan' },
          { href: '/settings/email-gateway', label: 'Email Gateway' },
          { href: '/settings/wa-gateway', label: 'WA Gateway' },
          { href: '/settings/document-numbers', label: 'Format Nomor Dok' },
          { href: '/settings/backup', label: 'Backup & Restore' },
          { href: '/settings/activity-log', label: 'Activity Log' },
        ],
      },
      { href: '/access', label: 'Users & Roles', icon: ShieldCheck },
      { href: '/kledo', label: 'Integrasi', icon: Building2 },
    ],
  },
];

function NavItemComponent({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isChildActive = item.children?.some((c) => pathname.startsWith(c.href)) ?? false;
  const [open, setOpen] = useState(isChildActive);

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors group"
          style={{
            backgroundColor: open ? 'rgba(113,75,103,.06)' : 'transparent',
            color: open ? '#714B67' : '#6D6777',
          }}
        >
          <item.icon className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1 text-left font-medium">{item.label}</span>
          <ChevronRight
            className="h-3.5 w-3.5 transition-transform duration-200 flex-shrink-0"
            style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
          />
        </button>

        <div
          className="overflow-hidden transition-all duration-200"
          style={{ maxHeight: open ? '600px' : '0px' }}
        >
          <div className="ml-4 mt-0.5 pl-3 pb-1 space-y-0.5" style={{ borderLeft: '2px solid #E9E0F8' }}>
            {item.children.map((child) => {
              const active = pathname === child.href || pathname.startsWith(child.href + '/');
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors"
                  style={{
                    backgroundColor: active ? 'rgba(113,75,103,.12)' : 'transparent',
                    color: active ? '#714B67' : '#6D6777',
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: active ? '#714B67' : '#E9E0F8' }}
                  />
                  {child.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const active = pathname === item.href;
  return (
    <Link
      href={item.href!}
      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors"
      style={{
        backgroundColor: active ? 'rgba(113,75,103,.12)' : 'transparent',
        color: active ? '#714B67' : '#6D6777',
        fontWeight: active ? 600 : 400,
      }}
    >
      <item.icon className="h-4 w-4 flex-shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

interface OdooLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function OdooLayout({ children, title, subtitle }: OdooLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const { user, logout } = useAuthStore();
  const { notifications } = useNotificationStore();
  const router = useRouter();
  const unreadCount = notifications.length;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F9' }}>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className="fixed left-0 top-0 z-50 h-full flex flex-col overflow-hidden transition-transform duration-300 lg:translate-x-0"
        style={{
          width: '260px',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E9E0F8',
          transform: sidebarOpen ? 'translateX(0)' : undefined,
        }}
      >
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid #E9E0F8' }}>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white font-bold text-base flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #714B67, #9C6B8E)' }}
          >
            G
          </div>
          <div>
            <h2 className="text-sm font-bold leading-tight" style={{ color: '#433C50' }}>Gentong Mas</h2>
            <p className="text-xs" style={{ color: '#A5A3AE' }}>ERP System</p>
          </div>
          <button
            className="ml-auto lg:hidden"
            onClick={() => setSidebarOpen(false)}
            style={{ color: '#A5A3AE' }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-thin">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p
                className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest"
                style={{ color: '#A5A3AE' }}
              >
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavItemComponent key={item.label} item={item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-3 py-3" style={{ borderTop: '1px solid #E9E0F8' }}>
          <div className="relative">
            <button
              onClick={() => setUserDropdown(!userDropdown)}
              className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors"
              style={{ backgroundColor: 'rgba(113,75,103,.06)' }}
            >
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #714B67, #9C6B8E)' }}
              >
                {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-xs font-semibold truncate" style={{ color: '#433C50' }}>{user?.name ?? 'User'}</p>
                <p className="text-[10px] truncate" style={{ color: '#A5A3AE' }}>{user?.role ?? 'Staff'}</p>
              </div>
              <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#A5A3AE', transform: userDropdown ? 'rotate(90deg)' : 'rotate(0deg)' }} />
            </button>

            {userDropdown && (
              <div
                className="absolute bottom-full left-0 right-0 mb-1 rounded-xl overflow-hidden shadow-lg"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E9E0F8' }}
              >
                <Link href="/settings/users" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors" style={{ color: '#433C50' }} onClick={() => setUserDropdown(false)}>
                  <User className="h-4 w-4" style={{ color: '#A5A3AE' }} /> Profil Saya
                </Link>
                <Link href="/settings" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors" style={{ color: '#433C50' }} onClick={() => setUserDropdown(false)}>
                  <Settings className="h-4 w-4" style={{ color: '#A5A3AE' }} /> Pengaturan
                </Link>
                <div style={{ borderTop: '1px solid #E9E0F8' }} />
                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors" style={{ color: '#EA5455' }}>
                  <LogOut className="h-4 w-4" /> Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div style={{ marginLeft: '260px' }} className="hidden lg:block" />

      <main style={{ paddingLeft: '0' }} className="lg:pl-[260px] min-h-screen">
        <header
          className="sticky top-0 z-30 flex items-center gap-4 px-6 py-3"
          style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E9E0F8', boxShadow: '0 1px 4px rgba(47,43,61,.04)' }}
        >
          <button className="lg:hidden p-1.5 rounded-lg" style={{ color: '#6D6777' }} onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>

          {(title || subtitle) && (
            <div className="hidden sm:block">
              {title && <h1 className="text-sm font-semibold" style={{ color: '#433C50' }}>{title}</h1>}
              {subtitle && <p className="text-xs" style={{ color: '#A5A3AE' }}>{subtitle}</p>}
            </div>
          )}

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <Link href="/notifications" className="relative p-2 rounded-lg transition-colors hover:bg-gray-50" style={{ color: '#6D6777' }}>
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: '#EA5455' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            <Link href="/settings" className="p-2 rounded-lg transition-colors hover:bg-gray-50" style={{ color: '#6D6777' }}>
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </header>

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default OdooLayout;
