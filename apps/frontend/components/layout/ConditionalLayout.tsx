'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../lib/store/useAuthStore';
import { MaterioLayout } from './MaterioLayout';

const PUBLIC_PATHS = ['/', '/login', '/install'];

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { token } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  const isPublic =
    PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/install');

  useEffect(() => {
    useAuthStore.getState().rehydrate();
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

  // Before hydration: render a shell that mirrors MaterioLayout's structure
  // (sticky topbar 64px + same content padding) so there's no layout shift on refresh
  if (!mounted) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F0F2F5' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Topbar placeholder — same height as MaterioTopbar (64px) */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 99,
              height: 64,
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderBottom: '1px solid #E2E8F0',
              flexShrink: 0,
            }}
          />
          {/* Content area — matches MaterioLayout's Box padding (xs:16px, sm:24px) */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated after mount → blank while redirecting
  if (!token) {
    return null;
  }

  return <MaterioLayout>{children}</MaterioLayout>;
}
