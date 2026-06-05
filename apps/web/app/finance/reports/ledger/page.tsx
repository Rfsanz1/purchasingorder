'use client';
import React, { useEffect, useState } from 'react';

export default function LedgerPage({ params }: any) {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    // expecting query param accountId
    const accountId = new URLSearchParams(window.location.search).get('accountId');
    if (!accountId) return setData({ error: 'accountId required in query' });
    fetch(`/api/finance/ledger/${accountId}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ error: 'Gagal mengambil data' }));
  }, []);
  return (
    <div style={{padding:20}}>
      <h1>Ledger per Akun</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
