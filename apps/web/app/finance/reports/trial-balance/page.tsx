'use client';
import React, { useEffect, useState } from 'react';

export default function TrialBalancePage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    fetch('/api/finance/trial-balance')
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ error: 'Gagal mengambil data' }));
  }, []);
  return (
    <div style={{padding:20}}>
      <h1>Trial Balance</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
