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
    if (!token) {
      router.replace('/login');
      return;
    }
    const init = async () => {
      if (!user) {
        await loadProfile().catch(() => {
          logout();
          router.replace('/login');
        });
      }
      setLoading(false);
    };
    init();
  }, [token, user, loadProfile, logout, router]);

  if (!token || loading) return null;

  const accessibleApps = APPS.filter((app) => canAccessApp(user?.roles ?? [], app.roles));

  return (
    <div className="min-h-screen bg-[#0D0B14] text-white">
      {/* Ambient background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#7B1FA2] opacity-[0.08] blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-[#00ACC1] opacity-[0.06] blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-[#1565C0] opacity-[0.07] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Top bar */}
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#9C27B0] to-[#7B1FA2] shadow-lg shadow-purple-900/40">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-wide text-white/70">Gentong Mas</span>
          </div>
          <button
            onClick={() => { logout(); router.replace('/login'); }}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/10 hover:text-white/90"
          >
            <LogOut className="h-3.5 w-3.5" />
            Keluar
          </button>
        </div>

        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-medium text-purple-300">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
            Sistem Terintegrasi Real-time
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Selamat datang,{' '}
            <span className="bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
              {user?.name?.split(' ')[0] ?? 'Pengguna'}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-white/50">
            Pilih aplikasi yang sesuai dengan peran Anda. Semua terhubung ke satu database yang sama.
          </p>

          {/* User badge */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-xs font-bold text-white">
              {(user?.name ?? user?.email ?? 'U')[0].toUpperCase()}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white/90">{user?.name ?? user?.email}</p>
              <p className="text-xs text-white/40">{user?.roles?.join(', ')}</p>
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
        <p className="mt-12 text-center text-xs text-white/20">
          © {new Date().getFullYear()} Gentong Mas — Enterprise Resource Planning
        </p>
      </div>
    </div>
  );
}

function AppCard({ app, index }: { app: any; index: number }) {
  const gradients: Record<string, string> = {
    '#7B1FA2': 'from-[#7B1FA2]/20 to-[#9C27B0]/5',
    '#00ACC1': 'from-[#00ACC1]/20 to-[#00BCD4]/5',
    '#F57C00': 'from-[#F57C00]/20 to-[#FF9800]/5',
    '#1565C0': 'from-[#1565C0]/20 to-[#1976D2]/5',
  };
  const glows: Record<string, string> = {
    '#7B1FA2': 'shadow-[0_20px_60px_-20px_rgba(123,31,162,0.5)]',
    '#00ACC1': 'shadow-[0_20px_60px_-20px_rgba(0,172,193,0.4)]',
    '#F57C00': 'shadow-[0_20px_60px_-20px_rgba(245,124,0,0.4)]',
    '#1565C0': 'shadow-[0_20px_60px_-20px_rgba(21,101,192,0.4)]',
  };
  const borders: Record<string, string> = {
    '#7B1FA2': 'border-[#7B1FA2]/30 hover:border-[#7B1FA2]/60',
    '#00ACC1': 'border-[#00ACC1]/30 hover:border-[#00ACC1]/60',
    '#F57C00': 'border-[#F57C00]/30 hover:border-[#F57C00]/60',
    '#1565C0': 'border-[#1565C0]/30 hover:border-[#1565C0]/60',
  };

  const gradient = gradients[app.color] ?? 'from-white/10 to-white/5';
  const glow = glows[app.color] ?? '';
  const border = borders[app.color] ?? 'border-white/10 hover:border-white/30';

  return (
    <Link
      href={app.href}
      className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-br ${gradient} ${border} p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:${glow}`}
    >
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(${app.color}88 1px, transparent 1px), linear-gradient(90deg, ${app.color}88 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative">
        {/* Icon + index */}
        <div className="mb-5 flex items-start justify-between">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: app.color + '22', boxShadow: `0 0 0 1px ${app.color}44` }}
          >
            <app.icon className="h-6 w-6" style={{ color: app.color }} />
          </div>
          <span className="rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest"
            style={{ borderColor: app.color + '44', color: app.color, backgroundColor: app.color + '11' }}>
            0{index + 1}
          </span>
        </div>

        {/* Text */}
        <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: app.color }}>
          {app.title}
        </p>
        <h2 className="mt-2 text-lg font-semibold leading-snug text-white/90">
          {app.description}
        </h2>

        {/* CTA */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm font-medium text-white/40 transition group-hover:text-white/70">
            Buka aplikasi
          </span>
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full transition-transform group-hover:translate-x-1"
            style={{ backgroundColor: app.color + '22' }}
          >
            <ChevronRight className="h-4 w-4" style={{ color: app.color }} />
          </div>
        </div>
      </div>
    </Link>
  );
}
