'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../lib/store/useAuthStore';
import { YetiLayout } from './YetiLayout';

const PUBLIC_PATHS = ['/', '/login', '/install'];

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { token } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  const isPublic =
    PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/install');

  useEffect(() => {
    setMounted(true);
  }, []);

  // After mount: redirect to login if protected route and no token
  useEffect(() => {
    if (mounted && !isPublic && !token) {
      router.push('/login');
    }
  }, [mounted, token, isPublic, router]);

  // Public pages (login, root, install) — never show sidebar
  if (isPublic) {
    return <>{children}</>;
  }

  // During SSR / before hydration — render children without sidebar to avoid flash
  if (!mounted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F0F2F5' }}>
        {children}
      </div>
    );
  }

  // Not authenticated after mount → blank while redirecting
  if (!token) {
    return null;
  }

  return <YetiLayout>{children}</YetiLayout>;
}
