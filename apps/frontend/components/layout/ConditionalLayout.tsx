'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '../../lib/store/useAuthStore';
import { MaterioLayout } from './MaterioLayout';

const PUBLIC_PATHS = ['/', '/login', '/install'];

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { token } = useAuthStore();

  const isPublic =
    PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/install');

  // Rehydrate auth from localStorage on first mount
  useEffect(() => {
    useAuthStore.getState().rehydrate();
  }, []);

  // Redirect to login if protected route and no token (runs after rehydrate)
  useEffect(() => {
    if (!isPublic && !token) {
      const stored =
        typeof window !== 'undefined'
          ? window.localStorage.getItem('erp_token')
          : null;
      if (!stored) {
        router.push('/login');
      }
    }
  }, [token, isPublic, router]);

  // Public pages — never wrap with sidebar layout
  if (isPublic) {
    return <>{children}</>;
  }

  // Protected pages — always render MaterioLayout (same on server + client = no hydration error)
  return <MaterioLayout>{children}</MaterioLayout>;
}
