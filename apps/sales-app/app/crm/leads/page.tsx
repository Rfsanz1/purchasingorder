'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SalesLayout } from '../../../components/SalesLayout';
import api from '../../../lib/api';
import { Star, Search, RefreshCw, Plus, Phone, Mail, ArrowUpRight } from 'lucide-react';

const C = { primary: '#7C3AED', border: '#EDE9FE', textDark: '#1E1B4B', textMid: '#6B7280', textLight: '#9CA3AF' };

const SOURCE_CFG: Record<string, { label: string; color: string }> = {
  website:   { label: 'Website',     color: '#3B82F6' },
  referral:  { label: 'Referral',    color: '#22C55E' },
  cold_call: { label: 'Cold Call',   color: '#F59E0B' },
  social:    { label: 'Sosial Media', color: '#8B5CF6' },
  event:     { label: 'Event',       color: '#0891B2' },
  other:     { label: 'Lainnya',     color: '#9CA3AF' },
};

const STAGE_CFG: Record<string, { label: string; color: string }> = {
  new:        { label: 'Baru',         color: '#3B82F6' },
  contacted:  { label: 'Dihubungi',    color: '#8B5CF6' },
  qualified:  { label: 'Qualified',    color: '#F59E0B' },
  converted:  { label: 'Converted',    color: '#22C55E' },
  lost:       { label: 'Lost',         color: '#EF4444' },
};

const DEMO: any[] = [
  { id: 'l1', name: 'Budi Hartono',    company: 'PT Konstruksi Prima', phone: '0812-3456-7890', email: 'budi@konstruksi.com', source: 'website',   stage: 'new',       value: 15000000, createdAt: '2024-01-15' },
  { id: 'l2', name: 'Sari Dewi',       company: 'CV Bangunan Maju',    phone: '0856-9876-5432', email: 'sari@bangunan.com',  source: 'referral',  stage: 'contacted', value: 8500000,  createdAt: '2024-01-14' },
  { id: 'l3', name: 'Ahmad Fauzi',     company: 'Toko Material Jaya',  phone: '0878-1234-5678', email: 'ahmad@material.com', source: 'cold_call', stage: 'qualified', value: 25000000, createdAt: '2024-01-12' },
  { id: 'l4', name: 'Diana Kusuma',    company: 'PT Mitra Bangun',     phone: '0821-9988-7766', email: 'diana@mitra.com',    source: 'social',   stage: 'converted', value: 42000000, createdAt: '2024-01-10' },
  { id: 'l5', name: 'Ricky Setiawan', company: 'UD Sentosa Abadi',    phone: '0813-5566-7788', email: 'ricky@sentosa.com',  source: 'event',    stage: 'lost',      value: 6000000,  createdAt: '2024-01-08' },
];

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, color, backgroundColor: `${color}18`, border: `1px solid ${color}30` }}>
      {label}
    </span>
  );
}

export default function LeadsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/crm/leads?limit=50');
      const data = res.data?.data ?? res.data?.items ?? res.data;
      setRows(Array.isArray(data) ? data : DEMO);
    } catch { setRows(DEMO); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = rows.filter(r =>
    (!stageFilter || r.stage === stageFilter) &&
    (!search || (r.name + (r.company ?? '') + (r.email ?? '')).toLowerCase().includes(search.toLowerCase()))
  );

  const formatRp = (v: number) => v >= 1e6 ? `Rp ${(v / 1e6).toFixed(1)} Jt` : `Rp ${Number(v).toLocaleString('id-ID')}`;

  const handleConvert = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.post(`/crm/leads/${id}/convert`);
      fetchData();
    } catch {
      alert('Gagal convert lead. Coba lagi.');
    }
  };

  return (
    <SalesLayout title="Leads" subtitle="Daftar prospek pelanggan">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: C.textDark, margin: '0 0 4px' }}>Leads</h2>
          <p style={{ fontSize: 13, color: C.textLight, margin: 0 }}>{rows.length} leads terdaftar</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: '#fff', color: C.textMid, fontSize: 13, cursor: 'pointer' }}>
            <RefreshCw size={13} /> Refresh
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: 'none', background: C.primary, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={14} /> Tambah Lead
          </button>
        </div>
      </div>

      {/* Stage summary */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {Object.entries(STAGE_CFG).map(([key, cfg]) => {
          const count = rows.filter(r => r.stage === key).length;
          const active = stageFilter === key;
          return (
            <button key={key} onClick={() => setStageFilter(active ? '' : key)}
              style={{ padding: '8px 16px', borderRadius: 10, border: `1.5px solid ${active ? cfg.color : C.border}`, background: active ? `${cfg.color}12` : '#fff', color: active ? cfg.color : C.textMid, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all .15s' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: cfg.color, flexShrink: 0 }} />
              {cfg.label}
              <span style={{ fontWeight: 700, color: active ? cfg.color : C.textLight }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16, maxWidth: 400 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.textLight }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama / perusahaan…"
          style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 13, boxSizing: 'border-box', color: C.textDark }} />
      </div>

      {/* Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: C.textLight }}>Memuat…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: C.textLight }}>Tidak ada lead ditemukan</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 14 }}>
          {filtered.map(r => {
            const stageCfg = STAGE_CFG[r.stage] ?? { label: r.stage, color: '#9CA3AF' };
            const sourceCfg = SOURCE_CFG[r.source] ?? { label: r.source, color: '#9CA3AF' };
            return (
              <div key={r.id}
                style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, padding: 18, transition: 'all .2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = stageCfg.color; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 16px ${stageCfg.color}18`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.border; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: C.textDark, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</p>
                    <p style={{ fontSize: 12, color: C.textMid, margin: 0 }}>{r.company ?? '–'}</p>
                  </div>
                  <Badge label={stageCfg.label} color={stageCfg.color} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                  {r.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Phone size={11} style={{ color: C.textLight }} />
                      <span style={{ fontSize: 12, color: C.textMid }}>{r.phone}</span>
                    </div>
                  )}
                  {r.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Mail size={11} style={{ color: C.textLight }} />
                      <span style={{ fontSize: 12, color: C.textMid }}>{r.email}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Badge label={sourceCfg.label} color={sourceCfg.color} />
                    {r.value > 0 && (
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.primary }}>{formatRp(r.value)}</span>
                    )}
                  </div>
                  {r.stage !== 'converted' && r.stage !== 'lost' && (
                    <button
                      onClick={(e) => handleConvert(r.id, e)}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 8, border: `1px solid ${C.primary}`, background: `${C.primary}10`, color: C.primary, cursor: 'pointer' }}
                    >
                      <ArrowUpRight size={11} /> Convert
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SalesLayout>
  );
}
