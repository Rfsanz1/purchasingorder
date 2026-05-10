import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import {
  LayoutDashboard, ShoppingCart, Package, Users, Truck,
  FileText, ShoppingBag, Warehouse, BarChart3, LogOut,
  Building2, ChevronRight, Bell, Settings, Sun, Moon,
} from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

const nav = [
  { to: '/',          label: 'Dashboard',  icon: LayoutDashboard, exact: true },
  { to: '/kasir',     label: 'Kasir',      icon: ShoppingCart },
  { to: '/produk',    label: 'Produk',     icon: Package },
  { to: '/stok',      label: 'Stok',       icon: Warehouse },
  { to: '/penjualan', label: 'Penjualan',  icon: FileText },
  { to: '/pembelian', label: 'Pembelian',  icon: ShoppingBag },
  { to: '/pelanggan', label: 'Pelanggan',  icon: Users },
  { to: '/supplier',  label: 'Supplier',   icon: Truck },
  { to: '/laporan',   label: 'Laporan',    icon: BarChart3 },
]

export default function MainLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [dark, setDark] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleDark = () => {
    setDark(!dark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={clsx('flex h-screen overflow-hidden', dark && 'dark')}>
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-gray-900 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-700/50">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">Toko Bangunan</div>
            <div className="text-gray-400 text-xs">POS System</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin">
          {nav.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100',
                )
              }
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-3 border-t border-gray-700/50">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.charAt(0) ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-medium truncate">{user?.name}</div>
              <div className="text-gray-400 text-xs capitalize">{user?.role_label}</div>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded" title="Logout">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Topbar */}
        <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span className="text-gray-900 dark:text-white font-semibold">POS</span>
            <ChevronRight size={14} />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleDark} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors relative">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
              <Settings size={16} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
