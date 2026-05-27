'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    <div className="min-h-screen bg-[#F4F5F7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-[32px] border border-[#E8E6EF] bg-white px-6 py-6 shadow-sm sm:px-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#8A86A2]">Gentong Mas Ecosystem</p>
              <h1 className="mt-3 text-3xl font-semibold text-[#312E3B]">Pilih aplikasi yang sesuai dengan peran Anda</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B6880]">
                Semua aplikasi memakai satu backend dan database yang sama, real-time sinkronisasi, serta login role-based.
              </p>
            </div>
            <div className="rounded-3xl bg-[#F7F5FF] px-4 py-3 text-sm text-[#433C50] shadow-sm">
              <p className="font-semibold">Masuk sebagai</p>
              <p className="mt-1 text-base">{user?.name ?? user?.email}</p>
              <p className="text-sm text-[#7A7688]">{user?.roles?.join(', ')}</p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 xl:grid-cols-2">
          {accessibleApps.map((app) => (
            <Link
              key={app.href}
              href={app.href}
              className="group block rounded-[28px] border border-[#E9E7EF] bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[0_18px_60px_-30px_rgba(113,75,103,0.45)]"
              style={{ borderColor: app.color + '33' }}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[#8E8A9F]">{app.title}</p>
                  <h2 className="mt-3 text-2xl font-semibold text-[#302B3C]">{app.description}</h2>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl" style={{ backgroundColor: app.color + '22' }}>
                  <app.icon className="h-7 w-7 text-white" />
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-[#726E86]">Akses aplikasi ini untuk fitur yang dirancang khusus sesuai kebutuhan Anda.</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#433C50]">
                Buka aplikasi
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
