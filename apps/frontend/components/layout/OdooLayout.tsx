'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Truck, DollarSign,
  UserCheck, BarChart2, Settings, Bell, ShieldCheck, Store,
  ChevronRight, Zap, Search, Menu, X, LogOut, User, Monitor,
  FileText, Warehouse, ClipboardList, CreditCard, BookOpen, Building2, MapPin
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
    label: 'OPERASIONAL',
    items: [
      {
        label: 'Sales & CRM', icon: ShoppingCart,
        children: [
          { href: '/sales/orders', label: 'Sales Orders' },
          { href: '/sales/faktur', label: 'Invoice Penjualan' },
          { href: '/crm', label: 'CRM' },
          { href: '/pos', label: 'Point of Sale' },
        ],
      },
      {
        label: 'Inventory', icon: Package,
        children: [
          { href: '/inventory', label: 'Produk' },
          { href: '/inventory/stock-movements', label: 'Mutasi Stok' },
          { href: '/inventory/stock-opnames', label: 'Stock Opname' },
          { href: '/inventory/warehouses', label: 'Gudang' },
        ],
      },
      {
        label: 'Purchase', icon: Truck,
        children: [
          { href: '/purchasing/purchase-orders', label: 'Purchase Orders' },
          { href: '/purchasing/goods-receipts', label: 'Penerimaan Barang' },
          { href: '/purchasing/suppliers', label: 'Supplier' },
        ],
      },
      {
        label: 'Pengiriman', icon: MapPin,
        children: [
          { href: '/delivery', label: 'Kelola Pengiriman' },
          { href: '/driver', label: 'Dashboard Driver' },
        ],
      },
    ],
  },
  {
    label: 'KEUANGAN & SDM',
    items: [
      {
        label: 'Finance', icon: DollarSign,
        children: [
          { href: '/finance/journal-entries', label: 'Jurnal' },
          { href: '/finance/coa', label: 'Chart of Accounts' },
          { href: '/finance/bank-accounts', label: 'Bank & Kas' },
          { href: '/finance/cash', label: 'Cash In / Out' },
        ],
      },
      {
        label: 'HR & Payroll', icon: UserCheck,
        children: [
          { href: '/hr/employees', label: 'Karyawan' },
          { href: '/hr/payrolls', label: 'Penggajian' },
          { href: '/hr/attendances', label: 'Absensi' },
        ],
      },
      {
        label: 'Pelanggan', icon: Users,
        children: [
          { href: '/customers', label: 'Data Customer' },
          { href: '/customers/loyalty', label: 'Loyalty' },
          { href: '/customers/whatsapp-log', label: 'WhatsApp Log' },
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
      { href: '/settings', label: 'Pengaturan', icon: Settings },
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
          style={{ maxHeight: open ? '400px' : '0px' }}
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
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 z-50 h-full flex flex-col overflow-hidden transition-transform duration-300 lg:translate-x-0"
        style={{
          width: '260px',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E9E0F8',
          transform: sidebarOpen ? 'translateX(0)' : undefined,
        }}
      >
        {/* Logo */}
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

        {/* Nav */}
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
                  <NavItemComponent key={item.href ?? item.label} item={item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3" style={{ borderTop: '1px solid #E9E0F8' }}>
          <p className="text-xs text-center" style={{ color: '#A5A3AE' }}>
            Gentong Mas ERP v2.0
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        {/* Topbar */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-5 h-14"
          style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E9E0F8' }}
        >
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded-lg transition-colors"
              style={{ color: '#6D6777' }}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <nav className="flex items-center gap-1 text-sm">
              <a href="/" style={{ color: '#A5A3AE' }} className="hover:text-[#714B67] transition-colors">Home</a>
              {title && (
                <>
                  <ChevronRight className="h-3.5 w-3.5" style={{ color: '#A5A3AE' }} />
                  <span style={{ color: subtitle ? '#6D6777' : '#433C50' }} className="font-medium">{title}</span>
                </>
              )}
              {subtitle && (
                <>
                  <ChevronRight className="h-3.5 w-3.5" style={{ color: '#A5A3AE' }} />
                  <span style={{ color: '#433C50' }} className="font-medium">{subtitle}</span>
                </>
              )}
            </nav>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg transition-colors"
              style={{ color: '#6D6777' }}
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            <button
              className="relative p-2 rounded-lg transition-colors"
              style={{ color: '#6D6777' }}
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span
                  className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-white text-[9px] font-bold"
                  style={{ backgroundColor: '#EA5455' }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors"
                style={{ color: '#6D6777' }}
              >
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-semibold"
                  style={{ backgroundColor: '#714B67' }}
                >
                  {(user?.name ?? user?.email ?? 'U').charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium" style={{ color: '#433C50' }}>
                  {user?.name ?? user?.email ?? 'User'}
                </span>
                <ChevronRight
                  className="h-3.5 w-3.5 hidden sm:block transition-transform"
                  style={{ transform: userDropdown ? 'rotate(90deg)' : 'rotate(0deg)', color: '#A5A3AE' }}
                />
              </button>

              {userDropdown && (
                <div
                  className="absolute right-0 mt-1 w-48 rounded-lg overflow-hidden z-50"
                  style={{ backgroundColor: '#FFFFFF', boxShadow: '0 8px 24px rgba(47,43,61,.16)', border: '1px solid #E9E0F8' }}
                >
                  <a
                    href="/settings"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-[rgba(113,75,103,.06)]"
                    style={{ color: '#6D6777' }}
                    onClick={() => setUserDropdown(false)}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </a>
                  <a
                    href="/settings"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-[rgba(113,75,103,.06)]"
                    style={{ color: '#6D6777' }}
                    onClick={() => setUserDropdown(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Pengaturan
                  </a>
                  <div style={{ borderTop: '1px solid #E9E0F8' }}>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-[rgba(234,84,85,.06)]"
                      style={{ color: '#EA5455' }}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
