'use client';
import React, { useEffect, useState } from 'react';

export default function TaxPage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    fetch('/api/finance/tax/summary')
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ error: 'Gagal mengambil data' }));
  }, []);
  return (
    <div style={{padding:20}}>
      <h1>Tax & e-Faktur</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
