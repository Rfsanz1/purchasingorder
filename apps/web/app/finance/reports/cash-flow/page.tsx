'use client';
import React, { useEffect, useState } from 'react';

export default function CashFlowPage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    fetch('/api/finance/reports/cash-flow')
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ error: 'Gagal mengambil data' }));
  }, []);
  return (
    <div style={{padding:20}}>
      <h1>Cash Flow</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
