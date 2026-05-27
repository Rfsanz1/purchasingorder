'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import {
  Eye, EyeOff, BarChart2, ShoppingCart, Package,
  Users, Truck, DollarSign, TrendingUp, Bell, Settings,
  ChevronRight, Zap, ArrowUpRight,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loadProfile, token, error, loading } = useAuthStore();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => { if (token) router.push('/'); }, [token]);
  if (token) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) { await loadProfile(); router.push('/'); }
  }

  return (
    <div className="flex min-h-screen bg-[#F5F3FF] font-sans">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[58%] relative overflow-hidden flex-col justify-between p-10"
        style={{ background: 'linear-gradient(145deg, #4B42C8 0%, #6C63F6 50%, #8B80F9 100%)' }}>

        {/* Animated background blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #A78BFA, transparent 70%)' }} />
          <div className="absolute -bottom-24 -right-24 h-[520px] w-[520px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #C4B5FD, transparent 70%)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #E9D5FF, transparent 70%)' }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        {/* Top bar */}
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl font-bold text-[#6C63F6]"
              style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
              G
            </div>
            <span className="text-white font-semibold text-[15px] tracking-tight">Gentong Mas ERP</span>
          </div>
          {/* Dummy nav */}
          <div className="flex items-center gap-1">
            {['Fitur', 'Harga', 'Bantuan'].map((item) => (
              <button key={item} className="px-3 py-1.5 rounded-lg text-[13px] font-medium transition"
                style={{ color: 'rgba(255,255,255,0.7)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="relative flex flex-col gap-8">
          {/* Headline */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold mb-5"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}>
              <Zap className="h-3 w-3" />
              Platform ERP Terintegrasi Penuh
            </div>
            <h1 className="text-[2.6rem] font-bold text-white leading-[1.15] tracking-tight">
              Semua operasi bisnis<br />
              <span style={{ color: '#C4B5FD' }}>dalam satu platform.</span>
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed max-w-md" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Sales, inventaris, keuangan, SDM, dan pengiriman — terintegrasi real-time dengan dashboard analitik canggih.
            </p>
          </div>

          {/* Dashboard mockup card */}
          <div className="rounded-[20px] p-5 max-w-[520px]"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.2)' }}>

            {/* Mockup top bar */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white text-[13px] font-semibold">Dashboard Overview</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Mei 2026 — Real-time</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg cursor-pointer transition"
                  style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
                  <Bell className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg cursor-pointer transition"
                  style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
                  <Settings className="h-3.5 w-3.5 text-white" />
                </div>
              </div>
            </div>

            {/* Stat cards row */}
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {[
                { label: 'Revenue', value: 'Rp 2.4M', change: '+12%', icon: TrendingUp, color: '#A78BFA' },
                { label: 'Orders', value: '348', change: '+8%', icon: ShoppingCart, color: '#67E8F9' },
                { label: 'Stok SKU', value: '1,204', change: '+3%', icon: Package, color: '#86EFAC' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl p-3"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className="h-3.5 w-3.5" style={{ color: stat.color }} />
                    <span className="text-[10px] font-semibold rounded-full px-1.5 py-0.5"
                      style={{ backgroundColor: 'rgba(134,239,172,0.15)', color: '#86EFAC' }}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-white text-[13px] font-bold">{stat.value}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Sidebar + chart mockup */}
            <div className="flex gap-2.5">
              {/* Mini sidebar */}
              <div className="flex flex-col gap-1.5 w-8">
                {[BarChart2, ShoppingCart, Package, DollarSign, Users, Truck].map((Icon, i) => (
                  <div key={i} className="flex h-7 w-7 items-center justify-center rounded-lg transition"
                    style={{ backgroundColor: i === 0 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)' }}>
                    <Icon className="h-3 w-3" style={{ color: i === 0 ? '#fff' : 'rgba(255,255,255,0.45)' }} />
                  </div>
                ))}
              </div>

              {/* Bar chart mockup */}
              <div className="flex-1 rounded-xl p-3"
                style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p className="text-[10px] font-medium mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>Penjualan Bulanan</p>
                <div className="flex items-end gap-1.5 h-16">
                  {[40, 65, 50, 80, 60, 90, 75, 55, 70, 85, 65, 95].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm transition-all"
                      style={{
                        height: `${h}%`,
                        background: i === 11
                          ? 'linear-gradient(to top, #A78BFA, #C4B5FD)'
                          : 'rgba(255,255,255,0.18)',
                      }} />
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {['Jan', 'Mar', 'Mei', 'Jul', 'Sep', 'Nov'].map((m) => (
                    <span key={m} className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="relative flex items-center justify-between">
          <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            © 2026 Gentong Mas — Enterprise Resource Planning
          </p>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.45)' }}>Semua sistem aktif</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 relative overflow-hidden">

        {/* Subtle bg decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, #EDE9FE, transparent 70%)' }} />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #DDD6FE, transparent 70%)' }} />
        </div>

        {/* Mobile logo */}
        <div className="flex flex-col items-center mb-8 lg:hidden relative">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-white font-bold text-xl mb-3 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #5B52D1, #8B80F9)' }}>G</div>
          <h1 className="text-xl font-bold" style={{ color: '#3730A3' }}>Gentong Mas ERP</h1>
        </div>

        {/* Card */}
        <div className="relative w-full max-w-[420px]">
          {/* Glow behind card */}
          <div className="absolute -inset-4 rounded-[40px] opacity-40 blur-2xl"
            style={{ background: 'linear-gradient(135deg, #C4B5FD, #E9D5FF)' }} />

          <div className="relative rounded-[32px] bg-white p-9"
            style={{ boxShadow: '0 8px 40px rgba(91,82,209,0.12), 0 1px 3px rgba(91,82,209,0.08)', border: '1px solid #EDE9FE' }}>

            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold mb-5"
                style={{ backgroundColor: '#F5F3FF', color: '#7C3AED', border: '1px solid #EDE9FE' }}>
                <Zap className="h-3 w-3" />
                Gentong Mas ERP
              </div>
              <h2 className="text-[1.75rem] font-bold tracking-tight" style={{ color: '#1E1B4B' }}>
                Welcome back 👋
              </h2>
              <p className="mt-1.5 text-[14px]" style={{ color: '#6B7280' }}>
                Masuk untuk melanjutkan ke dashboard Anda
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-[13px] font-semibold mb-1.5" style={{ color: '#374151' }}>
                  Email
                </label>
                <input
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="nama@perusahaan.com"
                  className="w-full rounded-2xl px-4 py-3 text-sm outline-none transition-all duration-200"
                  style={{
                    border: focusedField === 'email' ? '1.5px solid #8B80F9' : '1.5px solid #E5E7EB',
                    boxShadow: focusedField === 'email' ? '0 0 0 4px rgba(139,128,249,0.12)' : 'none',
                    color: '#111827',
                    backgroundColor: focusedField === 'email' ? '#FAFAFE' : '#F9FAFB',
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[13px] font-semibold" style={{ color: '#374151' }}>
                    Password
                  </label>
                  <button type="button" className="text-[12px] font-medium transition"
                    style={{ color: '#7C3AED' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#5B52D1')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#7C3AED')}>
                    Lupa password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl px-4 py-3 pr-12 text-sm outline-none transition-all duration-200"
                    style={{
                      border: focusedField === 'password' ? '1.5px solid #8B80F9' : '1.5px solid #E5E7EB',
                      boxShadow: focusedField === 'password' ? '0 0 0 4px rgba(139,128,249,0.12)' : 'none',
                      color: '#111827',
                      backgroundColor: focusedField === 'password' ? '#FAFAFE' : '#F9FAFB',
                    }}
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 transition"
                    style={{ color: '#9CA3AF' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#7C3AED')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}>
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2.5">
                <button type="button" onClick={() => setRemember(v => !v)}
                  className="flex-shrink-0 h-5 w-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center"
                  style={{
                    borderColor: remember ? '#7C3AED' : '#D1D5DB',
                    backgroundColor: remember ? '#7C3AED' : 'transparent',
                  }}>
                  {remember && (
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <span className="text-[13px]" style={{ color: '#6B7280' }}>Ingat saya selama 30 hari</span>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-2xl px-4 py-3 text-[13px] flex items-start gap-2.5"
                  style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
                  <span className="mt-0.5 flex-shrink-0">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl text-[14px] font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 mt-2"
                style={{
                  background: 'linear-gradient(135deg, #5B52D1 0%, #8B80F9 100%)',
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(91,82,209,0.4)',
                  opacity: loading ? 0.75 : 1,
                  transform: loading ? 'none' : undefined,
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(91,82,209,0.5)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(91,82,209,0.4)'; }}>
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Memproses...
                  </>
                ) : (
                  <>
                    Masuk ke Dashboard
                    <ArrowUpRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
                <span className="text-[12px] font-medium" style={{ color: '#9CA3AF' }}>atau</span>
                <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
              </div>

              {/* Google button */}
              <button
                type="button"
                className="w-full py-3 rounded-2xl text-[13px] font-semibold flex items-center justify-center gap-3 transition-all duration-200"
                style={{ backgroundColor: '#F9FAFB', border: '1.5px solid #E5E7EB', color: '#374151' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.borderColor = '#D1D5DB'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F9FAFB'; e.currentTarget.style.borderColor = '#E5E7EB'; }}>
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Lanjutkan dengan Google
              </button>
            </form>

            {/* Footer hint */}
            <p className="text-center text-[12px] mt-7" style={{ color: '#9CA3AF' }}>
              Butuh akses? Hubungi{' '}
              <span className="font-medium cursor-pointer transition" style={{ color: '#7C3AED' }}>
                administrator sistem
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
