'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/store/useAuthStore';

export default function RootPage() {
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace('/login');
    } else {
      router.replace('/dashboard');
    }
  }, [token]);

  return null;
}
