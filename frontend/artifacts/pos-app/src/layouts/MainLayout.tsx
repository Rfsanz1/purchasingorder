import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Truck,
  FileText,
  ShoppingBag,
  Warehouse,
  BarChart3,
  LogOut,
  Building2,
  ChevronRight,
  Bell,
  Settings,
  Sun,
  Moon,
  Search,
  Menu,
  ChevronLeft,
  User,
  Plus,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import clsx from 'clsx'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/kasir', label: 'Kasir', icon: ShoppingCart },
  { to: '/produk', label: 'Produk', icon: Package },
  { to: '/stok', label: 'Stok', icon: Warehouse },
  { to: '/penjualan', label: 'Penjualan', icon: FileText },
  { to: '/pembelian', label: 'Pembelian', icon: ShoppingBag },
  { to: '/pelanggan', label: 'Pelanggan', icon: Users },
  { to: '/supplier', label: 'Supplier', icon: Truck },
  { to: '/laporan', label: 'Laporan', icon: BarChart3 },
]

const notifications = [
  { title: 'Pembayaran baru diterima', subtitle: 'Invoice #AES123 berhasil terbayar.' },
  { title: 'Stok beton menipis', subtitle: 'Produk Beton Ringan tersisa 5 pcs.' },
  { title: 'Pesanan supplier baru', subtitle: 'PO #PO230 dikirim oleh Surya Material.' },
]

export default function MainLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [dark, setDark] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('pos_theme')
    const initialDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
    setDark(initialDark)
    document.documentElement.classList.toggle('dark', initialDark)
  }, [])

  useEffect(() => {
    localStorage.setItem('pos_theme', dark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className={clsx('fixed inset-0 bg-slate-950/50 z-30 transition-opacity md:hidden', sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')} onClick={() => setSidebarOpen(false)} />

      <aside className={clsx(
        'fixed inset-y-0 left-0 z-40 w-72 bg-slate-950 text-slate-100 shadow-xl transition-transform duration-300 md:static md:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      )}>
        <div className="flex items-center justify-between gap-3 px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-sky-500 to-blue-700 rounded-3xl flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Enterprise POS</p>
              <p className="text-xs text-slate-400">Toko Bangunan</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 transition">
            <ChevronLeft size={18} />
          </button>
        </div>

        <div className="px-4 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {nav.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                clsx(
                  'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg shadow-slate-950/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                )
              }
            >
              <span className="grid place-items-center w-11 h-11 rounded-2xl bg-slate-900 text-slate-100 transition group-hover:bg-slate-800">
                <Icon size={18} />
              </span>
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="mt-auto px-4 pb-5">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/90 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.25)]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-3xl bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">{user?.name?.charAt(0) ?? 'U'}</div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-400">{user?.role_label}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 transition">
              <LogOut size={14} /> Keluar
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden md:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/90 px-4 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/95">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
              <Menu size={18} />
            </button>
            <div className="hidden md:flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-100 px-3 py-2 text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <Search size={18} />
              <input type="search" placeholder="Cari global..." className="bg-transparent text-sm outline-none placeholder:text-slate-400 w-64" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
              <Bell size={18} />
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white">3</span>
            </button>
            <button className="inline-flex h-11 items-center gap-2 rounded-2xl bg-primary-600 px-4 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition">
              <Plus size={16} /> Aksi Cepat
            </button>
            <div className="relative">
              <button onClick={() => setShowProfile((prev) => !prev)} className="inline-flex h-11 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                <User size={16} />
                <span>{user?.name?.split(' ')[0]}</span>
              </button>
              {showProfile && (
                <div className="absolute right-0 mt-2 w-56 rounded-3xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <button className="w-full text-left rounded-2xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition">Profil</button>
                    <button className="w-full text-left rounded-2xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition">Pengaturan</button>
                    <button onClick={handleLogout} className="w-full text-left rounded-2xl px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition">Keluar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-4 py-5 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
