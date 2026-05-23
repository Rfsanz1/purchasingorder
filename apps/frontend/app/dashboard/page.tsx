'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';

export default function DashboardRedirect() {
  const { token } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    router.replace('/');
  }, []);
  return null;
}
