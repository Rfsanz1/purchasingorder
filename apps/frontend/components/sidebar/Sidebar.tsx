'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Truck, DollarSign,
  UserCheck, BarChart2, Settings, Bell, ShieldCheck, Store,
  ChevronDown, ChevronRight, Zap
} from 'lucide-react';
import { useState } from 'react';

const navGroups = [
  {
    label: 'Utama',
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/notifications', label: 'Notifikasi', icon: Bell },
    ],
  },
  {
    label: 'Operasional',
    items: [
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
        label: 'Sales & Order', icon: ShoppingCart,
        children: [
          { href: '/sales/orders', label: 'Sales Orders' },
          { href: '/sales/faktur', label: 'Faktur Penjualan' },
          { href: '/sales/summary', label: 'Ringkasan Sales' },
        ],
      },
      {
        label: 'Purchasing', icon: Truck,
        children: [
          { href: '/purchasing/purchase-orders', label: 'Purchase Orders' },
          { href: '/purchasing/goods-receipts', label: 'Penerimaan Barang' },
          { href: '/purchasing/suppliers', label: 'Supplier' },
        ],
      },
      { href: '/pos', label: 'POS / Kasir', icon: Store },
    ],
  },
  {
    label: 'CRM',
    items: [
      { href: '/customers', label: 'Pelanggan', icon: Users },
      { href: '/driver', label: 'Driver & Wilayah', icon: Truck },
    ],
  },
  {
    label: 'Keuangan & SDM',
    items: [
      {
        label: 'Finance', icon: DollarSign,
        children: [
          { href: '/finance/journal-entries', label: 'Jurnal' },
          { href: '/finance/coa', label: 'Chart of Accounts' },
          { href: '/finance/bank-accounts', label: 'Bank & Kas' },
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
    ],
  },
  {
    label: 'Integrasi',
    items: [
      { href: '/kledo', label: 'Kledo ERP', icon: Zap },
      { href: '/reports', label: 'Laporan', icon: BarChart2 },
    ],
  },
  {
    label: 'Sistem',
    items: [
      { href: '/access', label: 'Role & Permission', icon: ShieldCheck },
      { href: '/settings', label: 'Pengaturan', icon: Settings },
    ],
  },
];

function NavItem({ item, depth = 0 }: { item: any; depth?: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(() => item.children?.some((c: any) => pathname.startsWith(c.href)));

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center gap-3 rounded-2xl px-4 py-2.5 transition text-sm ${
            open ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          {item.icon && <item.icon className="h-4 w-4 flex-shrink-0 text-cyan-400" />}
          <span className="flex-1 text-left">{item.label}</span>
          {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
        {open && (
          <div className="ml-4 mt-1 space-y-0.5 border-l border-slate-800 pl-3">
            {item.children.map((child: any) => {
              const active = pathname === child.href;
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                    active ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <span className={`h-1 w-1 rounded-full ${active ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                  {child.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const active = pathname === item.href;
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm transition ${
        active
          ? 'text-white bg-slate-900 border border-cyan-900/40 shadow-lg'
          : 'text-slate-400 hover:text-white hover:bg-slate-900'
      }`}
    >
      {Icon && <Icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-cyan-400' : 'text-slate-500'}`} />}
      <span>{item.label}</span>
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-full w-[260px] border-r border-slate-800 bg-slate-950/98 shadow-2xl flex flex-col">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-900/30">
          <span className="text-base font-bold">G</span>
        </div>
        <div>
          <p className="text-xs text-slate-500">ERP Modern</p>
          <h2 className="text-sm font-semibold text-white leading-tight">Gentong Mas</h2>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-4 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItem key={item.href ?? item.label} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-slate-800">
        <div className="rounded-2xl bg-slate-900 p-3 text-xs text-slate-500">
          <p className="font-medium text-slate-400 mb-1">Gentong Mas ERP</p>
          <p>NestJS · Next.js · PostgreSQL</p>
        </div>
      </div>
    </aside>
  );
}
