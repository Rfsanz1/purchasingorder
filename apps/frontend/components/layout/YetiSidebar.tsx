'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, ShoppingCart, Package, FileText,
  BarChart2, Settings, Bell, ChevronDown, ChevronRight,
  Truck, DollarSign, UserCheck, Factory, Wrench, Building2,
  BookOpen, CreditCard, Target, Brain, Megaphone, Globe,
  ShieldCheck, HelpCircle, LogOut, Star,
} from 'lucide-react';
import { useAuthStore } from '../../lib/store/useAuthStore';

interface NavChild {
  href: string;
  label: string;
}

interface NavItem {
  href?: string;
  label: string;
  icon: React.ElementType;
  children?: NavChild[];
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'MENU UTAMA',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/notifications', label: 'Notifikasi', icon: Bell, badge: '5', badgeColor: '#EA5455' },
    ],
  },
  {
    label: 'CRM & PENJUALAN',
    items: [
      {
        label: 'CRM', icon: Users,
        children: [
          { href: '/crm/leads', label: 'Leads' },
          { href: '/crm/pipeline', label: 'Pipeline' },
          { href: '/crm/opportunities', label: 'Opportunity' },
          { href: '/crm/activities', label: 'Aktivitas' },
        ],
      },
      {
        label: 'Penjualan', icon: ShoppingCart,
        children: [
          { href: '/sales/quotations', label: 'Quotation' },
          { href: '/sales/orders', label: 'Sales Orders' },
          { href: '/sales/pricelists', label: 'Price List' },
          { href: '/sales/teams', label: 'Sales Team' },
        ],
      },
      {
        label: 'Invoice', icon: FileText,
        children: [
          { href: '/invoice/list', label: 'Daftar Invoice' },
          { href: '/invoice/payments', label: 'Pembayaran' },
          { href: '/invoice/credit-notes', label: 'Kredit Nota' },
        ],
      },
      { href: '/customers', label: 'Pelanggan', icon: UserCheck },
    ],
  },
  {
    label: 'OPERASIONAL',
    items: [
      {
        label: 'Inventory', icon: Package,
        children: [
          { href: '/inventory/products', label: 'Produk' },
          { href: '/inventory/transfers', label: 'Transfer Stok' },
          { href: '/inventory/stock-opnames', label: 'Stock Opname' },
          { href: '/inventory/warehouses', label: 'Multi Gudang' },
        ],
      },
      {
        label: 'Pembelian', icon: Truck,
        children: [
          { href: '/purchasing/purchase-orders', label: 'Purchase Orders' },
          { href: '/purchasing/vendors', label: 'Vendor' },
        ],
      },
      { href: '/pos/orders', label: 'Point of Sale', icon: CreditCard },
      { href: '/gudang', label: 'Gudang', icon: Building2 },
    ],
  },
  {
    label: 'KEUANGAN',
    items: [
      {
        label: 'Finance', icon: DollarSign,
        children: [
          { href: '/finance/journal', label: 'Jurnal' },
          { href: '/finance/accounts', label: 'Chart of Accounts' },
          { href: '/finance/bank', label: 'Rekonsiliasi Bank' },
        ],
      },
      {
        label: 'Laporan', icon: BarChart2,
        children: [
          { href: '/reports/sales', label: 'Laporan Penjualan' },
          { href: '/reports/finance', label: 'Laporan Keuangan' },
          { href: '/reports/inventory', label: 'Laporan Stok' },
        ],
      },
    ],
  },
  {
    label: 'HR & PAYROLL',
    items: [
      { href: '/hr', label: 'Karyawan', icon: Users },
      { href: '/payroll', label: 'Payroll', icon: BookOpen },
    ],
  },
  {
    label: 'LAINNYA',
    items: [
      { href: '/ai/chatbot', label: 'AI Assistant', icon: Brain, badge: 'AI', badgeColor: '#8B5CF6' },
      { href: '/marketing', label: 'Marketing', icon: Megaphone },
      { href: '/website', label: 'Website', icon: Globe },
      { href: '/settings', label: 'Pengaturan', icon: Settings },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function YetiSidebar({ collapsed, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href?: string) => href && (pathname === href || pathname.startsWith(href + '/'));
  const isChildActive = (children?: NavChild[]) =>
    children?.some((c) => isActive(c.href));

  return (
    <aside
      className={`
        fixed top-0 left-0 z-50 h-full flex flex-col
        transition-all duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        ${collapsed ? 'lg:w-[64px]' : 'lg:w-[240px]'}
        w-[240px]
      `}
      style={{ backgroundColor: '#1B2A3B', color: '#CBD5E1' }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-4 border-b flex-shrink-0"
        style={{ borderColor: '#243447', minHeight: '64px' }}
      >
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg font-bold text-white text-sm"
          style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)' }}
        >
          GM
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">Gentong Mas</p>
            <p className="text-[10px] truncate" style={{ color: '#64748B' }}>Enterprise ERP</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin" style={{ scrollbarColor: '#243447 transparent' }}>
        {navGroups.map((group) => (
          <div key={group.label} className="mb-1">
            {!collapsed && (
              <p className="px-4 py-1.5 text-[10px] font-semibold tracking-widest" style={{ color: '#475569' }}>
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon ?? LayoutDashboard;
              const hasChildren = item.children && item.children.length > 0;
              const active = hasChildren ? isChildActive(item.children) : isActive(item.href);
              const groupKey = item.label;
              const isOpen = openGroups[groupKey] || isChildActive(item.children);

              if (hasChildren) {
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => toggleGroup(groupKey)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150 rounded-none
                        ${active ? 'text-white' : 'hover:text-white hover:bg-white/5'}
                      `}
                      style={active ? { backgroundColor: 'rgba(59,130,246,0.15)', color: '#60A5FA' } : {}}
                    >
                      <Icon className="h-[18px] w-[18px] flex-shrink-0" style={{ color: active ? '#60A5FA' : '#64748B' }} />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {isOpen
                            ? <ChevronDown className="h-3.5 w-3.5" style={{ color: '#64748B' }} />
                            : <ChevronRight className="h-3.5 w-3.5" style={{ color: '#64748B' }} />
                          }
                        </>
                      )}
                    </button>
                    {!collapsed && isOpen && (
                      <div className="pb-1" style={{ backgroundColor: '#162031' }}>
                        {item.children!.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={onMobileClose}
                            className={`
                              flex items-center gap-2 pl-11 pr-4 py-2 text-[13px] transition-colors duration-150
                              ${isActive(child.href) ? 'text-blue-400 font-medium' : 'hover:text-white'}
                            `}
                            style={{ color: isActive(child.href) ? '#60A5FA' : '#94A3B8' }}
                          >
                            <span
                              className="h-1 w-1 rounded-full flex-shrink-0"
                              style={{ backgroundColor: isActive(child.href) ? '#60A5FA' : '#475569' }}
                            />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href!}
                  onClick={onMobileClose}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150
                    ${active ? 'text-white' : 'hover:text-white hover:bg-white/5'}
                  `}
                  style={active ? { backgroundColor: 'rgba(59,130,246,0.15)', color: '#60A5FA', borderLeft: '3px solid #3B82F6' } : {}}
                >
                  <Icon
                    className="h-[18px] w-[18px] flex-shrink-0"
                    style={{ color: active ? '#60A5FA' : '#64748B' }}
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: item.badgeColor || '#3B82F6' }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User profile at bottom */}
      <div className="flex-shrink-0 border-t p-3" style={{ borderColor: '#243447' }}>
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div
            className="h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}
          >
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name ?? user?.email ?? 'User'}</p>
              <p className="text-[11px] truncate" style={{ color: '#64748B' }}>
                {Array.isArray(user?.roles) ? user.roles[0] : 'Admin'}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logout}
              className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
              title="Logout"
            >
              <LogOut className="h-4 w-4" style={{ color: '#64748B' }} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
