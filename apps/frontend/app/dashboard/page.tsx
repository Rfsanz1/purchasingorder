'use client';

import { useEffect, useState } from 'react';
import DashboardContent from './_DashboardContent';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <DashboardContent />;
}
