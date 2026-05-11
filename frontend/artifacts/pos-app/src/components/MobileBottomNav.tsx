import { NavLink } from 'react-router-dom'
import { Home, ShoppingCart, Package, BarChart3, Users } from 'lucide-react'

export default function MobileBottomNav() {
  const items = [
    { to: '/', label: 'Dashboard', icon: Home },
    { to: '/kasir', label: 'Kasir', icon: ShoppingCart },
    { to: '/produk', label: 'Produk', icon: Package },
    { to: '/laporan', label: 'Laporan', icon: BarChart3 },
    { to: '/pelanggan', label: 'Pelanggan', icon: Users },
  ]

  return (
    <nav className="fixed bottom-3 left-1/2 z-50 w-[94%] -translate-x-1/2 rounded-3xl bg-white/90 px-2 py-2 shadow-lg backdrop-blur-sm dark:bg-slate-900/90 md:hidden">
      <div className="flex items-center justify-between">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) =>
              `inline-flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs ${isActive ? 'text-primary-600' : 'text-slate-600 dark:text-slate-300'}`
            }
          >
            <it.icon size={20} />
            <span className="truncate max-w-[56px]">{it.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
