'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import { Eye, EyeOff, ShoppingCart, Package, DollarSign, Users, BarChart2, Truck } from 'lucide-react';

const FEATURES = [
  { icon: ShoppingCart, label: 'Sales & CRM', desc: 'Order, faktur, pelanggan' },
  { icon: Package, label: 'Inventaris', desc: 'Stok, gudang, produk' },
  { icon: DollarSign, label: 'Keuangan', desc: 'Akuntansi & laporan' },
  { icon: Users, label: 'SDM & Payroll', desc: 'Karyawan & penggajian' },
  { icon: Truck, label: 'Pengiriman', desc: 'Driver & logistik' },
  { icon: BarChart2, label: 'Analitik', desc: 'Dashboard & laporan' },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, loadProfile, token, error, loading } = useAuthStore();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [showPass, setShowPass] = useState(false);

  if (token) { router.push('/'); return null; }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) { await loadProfile(); router.push('/'); }
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F0F2F5' }}>

      {/* ── Left panel: branding ── */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #5C3D57 0%, #714B67 45%, #9C6B8E 100%)' }}
      >
        {/* Decorative circles */}
        <div
          className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full opacity-10"
          style={{ backgroundColor: '#FFFFFF' }}
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-[32rem] w-[32rem] rounded-full opacity-[0.06] translate-x-1/3 translate-y-1/3"
          style={{ backgroundColor: '#FFFFFF' }}
        />
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 rounded-full opacity-[0.07] -translate-x-1/2 -translate-y-1/2"
          style={{ backgroundColor: '#FFFFFF' }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold text-lg flex-shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,.2)', backdropFilter: 'blur(4px)' }}
          >
            G
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Gentong Mas ERP</span>
        </div>

        {/* Hero text */}
        <div className="relative space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Kelola bisnis Anda<br />dalam satu platform
            </h1>
            <p className="mt-3 text-base leading-relaxed" style={{ color: 'rgba(255,255,255,.72)' }}>
              Sistem ERP lengkap untuk sales, keuangan, inventaris, SDM, dan pengiriman — terintegrasi penuh.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-3 rounded-xl p-3.5"
                style={{ backgroundColor: 'rgba(255,255,255,.1)', backdropFilter: 'blur(4px)' }}
              >
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: 'rgba(255,255,255,.15)' }}
                >
                  <f.icon className="h-4.5 w-4.5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{f.label}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,.6)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative text-xs" style={{ color: 'rgba(255,255,255,.45)' }}>
          © {new Date().getFullYear()} Gentong Mas — Enterprise Resource Planning
        </p>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">
        {/* Mobile logo */}
        <div className="flex flex-col items-center mb-8 lg:hidden">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-xl mb-3"
            style={{ background: 'linear-gradient(135deg, #714B67, #9C6B8E)' }}
          >
            G
          </div>
          <h1 className="text-xl font-bold" style={{ color: '#433C50' }}>Gentong Mas ERP</h1>
        </div>

        <div className="w-full max-w-[420px]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold" style={{ color: '#433C50' }}>Selamat datang!</h2>
            <p className="mt-1 text-sm" style={{ color: '#A5A3AE' }}>Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-8 space-y-5"
            style={{ boxShadow: '0 4px 24px rgba(47,43,61,.10)', border: '1px solid #E9E0F8' }}
          >
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: '#433C50' }}>
                Email
              </label>
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg px-4 py-2.5 text-sm transition-all"
                style={{ border: '1px solid #E2DAEE', color: '#433C50', outline: 'none', backgroundColor: '#FDFCFF' }}
                onFocus={(e) => { e.target.style.borderColor = '#714B67'; e.target.style.boxShadow = '0 0 0 3px rgba(113,75,103,.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E2DAEE'; e.target.style.boxShadow = 'none'; }}
                placeholder="admin@example.com"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium" style={{ color: '#433C50' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg px-4 py-2.5 pr-11 text-sm transition-all"
                  style={{ border: '1px solid #E2DAEE', color: '#433C50', outline: 'none', backgroundColor: '#FDFCFF' }}
                  onFocus={(e) => { e.target.style.borderColor = '#714B67'; e.target.style.boxShadow = '0 0 0 3px rgba(113,75,103,.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#E2DAEE'; e.target.style.boxShadow = 'none'; }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors"
                  style={{ color: '#A5A3AE' }}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-lg px-4 py-3 text-sm flex items-start gap-2"
                style={{ backgroundColor: 'rgba(234,84,85,.08)', color: '#EA5455', border: '1px solid rgba(234,84,85,.2)' }}
              >
                <span className="mt-0.5">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-60"
              style={{
                background: loading ? '#9C6B8E' : 'linear-gradient(135deg, #714B67, #9C6B8E)',
                boxShadow: '0 4px 12px rgba(113,75,103,.35)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Memproses...
                </span>
              ) : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: '#A5A3AE' }}>
            Butuh bantuan? Hubungi administrator sistem.
          </p>
        </div>
      </div>
    </div>
  );
}
