'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, ChevronRight, Zap } from 'lucide-react';
import { useAuthStore } from '../lib/store/useAuthStore';
import { APPS, canAccessApp } from '../lib/app-configs';

export default function RootPage() {
  const { token, user, loadProfile, logout } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { router.replace('/login'); return; }
    const init = async () => {
      if (!user) {
        await loadProfile().catch(() => { logout(); router.replace('/login'); });
      }
      setLoading(false);
    };
    init();
  }, [token, user, loadProfile, logout, router]);

  if (!token || loading) return null;

  const accessibleApps = APPS.filter((app) => canAccessApp(user?.roles ?? [], app.roles));

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#F5F3FF' }}>

      {/* Ambient blobs — seragam dengan login */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #EDE9FE, transparent 70%)' }} />
        <div className="absolute -bottom-24 -right-24 h-[520px] w-[520px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #DDD6FE, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #C4B5FD, transparent 70%)' }} />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Top bar */}
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl font-bold text-[15px]"
              style={{ background: 'linear-gradient(135deg, #5B52D1, #8B80F9)', color: '#fff', boxShadow: '0 4px 14px rgba(91,82,209,0.35)' }}>
              G
            </div>
            <span className="text-[14px] font-semibold tracking-tight" style={{ color: '#3730A3' }}>Gentong Mas ERP</span>
          </div>
          <button
            onClick={() => { logout(); router.replace('/login'); }}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200"
            style={{ border: '1.5px solid #EDE9FE', backgroundColor: '#fff', color: '#6B7280' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C4B5FD'; e.currentTarget.style.color = '#5B52D1'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#EDE9FE'; e.currentTarget.style.color = '#6B7280'; }}
          >
            <LogOut className="h-3.5 w-3.5" />
            Keluar
          </button>
        </div>

        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold"
            style={{ backgroundColor: 'rgba(91,82,209,0.08)', color: '#5B52D1', border: '1px solid rgba(91,82,209,0.15)' }}>
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#8B80F9' }} />
            Sistem Terintegrasi Real-time
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl" style={{ color: '#1E1B4B' }}>
            Selamat datang,{' '}
            <span style={{ background: 'linear-gradient(135deg, #5B52D1, #8B80F9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {user?.name?.split(' ')[0] ?? 'Pengguna'}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base" style={{ color: '#6B7280' }}>
            Pilih aplikasi yang sesuai dengan peran Anda. Semua terhubung ke satu database yang sama.
          </p>

          {/* User badge */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl px-5 py-3"
            style={{ backgroundColor: '#fff', border: '1.5px solid #EDE9FE', boxShadow: '0 2px 12px rgba(91,82,209,0.08)' }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #5B52D1, #8B80F9)' }}>
              {(user?.name ?? user?.email ?? 'U')[0].toUpperCase()}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold" style={{ color: '#1E1B4B' }}>{user?.name ?? user?.email}</p>
              <p className="text-xs" style={{ color: '#9CA3AF' }}>{user?.roles?.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* App cards grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {accessibleApps.map((app, i) => (
            <AppCard key={app.href} app={app} index={i} />
          ))}
        </div>

        {/* Footer */}
        <p className="mt-12 text-center text-xs" style={{ color: '#9CA3AF' }}>
          © {new Date().getFullYear()} Gentong Mas — Enterprise Resource Planning
        </p>
      </div>
    </div>
  );
}

function AppCard({ app, index }: { app: any; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={app.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative overflow-hidden rounded-[28px] block transition-all duration-300"
      style={{
        backgroundColor: '#fff',
        border: `1.5px solid ${hovered ? app.color + '55' : '#EDE9FE'}`,
        boxShadow: hovered
          ? `0 16px 48px -12px ${app.color}33, 0 2px 8px rgba(91,82,209,0.06)`
          : '0 2px 12px rgba(91,82,209,0.06)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        padding: '24px',
      }}
    >
      {/* Top-right glow accent */}
      <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle, ${app.color}18, transparent 70%)` }} />

      {/* Subtle dot grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(${app.color} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }} />

      <div className="relative">
        {/* Icon + number */}
        <div className="mb-5 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200"
            style={{
              backgroundColor: app.color + '12',
              boxShadow: `0 0 0 1.5px ${app.color}30`,
            }}>
            <app.icon className="h-6 w-6" style={{ color: app.color }} />
          </div>
          <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
            style={{
              backgroundColor: app.color + '10',
              color: app.color,
              border: `1px solid ${app.color}30`,
            }}>
            0{index + 1}
          </span>
        </div>

        {/* Text */}
        <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: app.color }}>
          {app.title}
        </p>
        <h2 className="mt-2 text-[17px] font-semibold leading-snug" style={{ color: '#1E1B4B' }}>
          {app.description}
        </h2>

        {/* CTA */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-[13px] font-medium transition-colors duration-200"
            style={{ color: hovered ? app.color : '#9CA3AF' }}>
            Buka aplikasi
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200"
            style={{
              backgroundColor: hovered ? app.color + '18' : '#F5F3FF',
              transform: hovered ? 'translateX(3px)' : 'none',
            }}>
            <ChevronRight className="h-4 w-4" style={{ color: app.color }} />
          </div>
        </div>
      </div>
    </Link>
  );
}
