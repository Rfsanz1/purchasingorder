import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Eye, EyeOff, Lock, User } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      setAuth(res.data.user, res.data.token)
      toast.success(`Selamat datang, ${res.data.user.name}!`)
      navigate('/')
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/90 shadow-[0_50px_120px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_1fr]">
          <div className="p-10 sm:p-14">
            <div className="mb-10">
              <div className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-blue-600 p-4 shadow-lg shadow-sky-500/20">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h1 className="mt-8 text-3xl font-semibold text-white">Selamat datang di POS Enterprise</h1>
              <p className="mt-3 max-w-xl text-sm text-slate-300">Masuk untuk mengelola kasir, produk, stok, penjualan, pembelian, dan laporan dalam satu aplikasi profesional.</p>
            </div>
            <div className="rounded-[28px] bg-slate-900/80 p-8 shadow-inner shadow-slate-950/20 border border-white/10">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label">Email / Username</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="admin@toko.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input pl-12 bg-slate-950/80 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type={showPw ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="input pl-12 pr-12 bg-slate-950/80 text-white placeholder:text-slate-500"
                      required
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full btn-lg">
                  {loading ? 'Memproses...' : 'Masuk ke POS'}
                </button>
              </form>
            </div>
            <div className="mt-8 rounded-[28px] border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300">
              <p className="font-semibold text-slate-100">Akun Demo</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  { label: 'Owner', email: 'owner@toko.com' },
                  { label: 'Admin', email: 'admin@toko.com' },
                  { label: 'Kasir', email: 'kasir@toko.com' },
                  { label: 'Gudang', email: 'gudang@toko.com' },
                ].map((acc) => (
                  <button key={acc.email} onClick={() => setForm({ email: acc.email, password: 'password' })} className="rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-left text-sm text-slate-300 hover:border-slate-700 hover:bg-slate-800 transition">
                    <p className="font-semibold text-slate-100">{acc.label}</p>
                    <p className="text-xs text-slate-500">{acc.email}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden lg:block bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.22),_transparent_30%),linear-gradient(180deg,_rgba(15,23,42,0.92),_rgba(15,23,42,0.98))] p-10 text-white">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
              <p className="text-sm uppercase tracking-[0.32em] text-sky-300">Enterprise POS</p>
              <h2 className="mt-5 text-2xl font-semibold">Antarmuka POS premium untuk toko bangunan</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">Dashboard intuitif, kasir layar penuh, manajemen stok, pelanggan, supplier, dan laporan akurat dalam satu aplikasi.</p>
              <div className="mt-8 space-y-4 text-sm text-slate-300">
                <div className="rounded-3xl bg-slate-900/70 p-4">
                  <p className="font-semibold text-slate-100">Dashboard bersih</p>
                  <p className="mt-1 text-slate-400">Ringkasan realtime dengan kartu analytics profesional.</p>
                </div>
                <div className="rounded-3xl bg-slate-900/70 p-4">
                  <p className="font-semibold text-slate-100">Kasir modern</p>
                  <p className="mt-1 text-slate-400">Panel transaksi dan pembayaran cepat di layar kasir.</p>
                </div>
                <div className="rounded-3xl bg-slate-900/70 p-4">
                  <p className="font-semibold text-slate-100">Responsif & touchscreen</p>
                  <p className="mt-1 text-slate-400">Cocok untuk tablet, monitor kasir, dan layar besar.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
