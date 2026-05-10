import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import MainLayout from './layouts/MainLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import KasirPage from './pages/KasirPage'
import ProductsPage from './pages/ProductsPage'
import CustomersPage from './pages/CustomersPage'
import SuppliersPage from './pages/SuppliersPage'
import SalesHistoryPage from './pages/SalesHistoryPage'
import PurchasesPage from './pages/PurchasesPage'
import InventoryPage from './pages/InventoryPage'
import ReportsPage from './pages/ReportsPage'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter basename="/pos">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="kasir" element={<KasirPage />} />
          <Route path="produk" element={<ProductsPage />} />
          <Route path="pelanggan" element={<CustomersPage />} />
          <Route path="supplier" element={<SuppliersPage />} />
          <Route path="penjualan" element={<SalesHistoryPage />} />
          <Route path="pembelian" element={<PurchasesPage />} />
          <Route path="stok" element={<InventoryPage />} />
          <Route path="laporan" element={<ReportsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
