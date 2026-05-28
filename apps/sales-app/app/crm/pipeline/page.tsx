'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { SalesLayout } from '../../../components/SalesLayout';
import api from '../../../lib/api';
import { RefreshCw, Plus, DollarSign } from 'lucide-react';

const C = { primary: '#7C3AED', border: '#EDE9FE', textDark: '#1E1B4B', textMid: '#6B7280', textLight: '#9CA3AF' };

interface Deal {
  id: string; title: string; company: string; value: number;
  stage: string; probability: number; salesman: string; updatedAt: string;
}

const STAGES: { key: string; label: string; color: string }[] = [
  { key: 'prospek',   label: 'Prospek',    color: '#9CA3AF' },
  { key: 'demo',      label: 'Demo',       color: '#3B82F6' },
  { key: 'proposal',  label: 'Proposal',   color: '#F59E0B' },
  { key: 'negosiasi', label: 'Negosiasi',  color: '#8B5CF6' },
  { key: 'won',       label: 'Won ✓',      color: '#22C55E' },
  { key: 'lost',      label: 'Lost ✗',     color: '#EF4444' },
];

const DEMO_DEALS: Deal[] = [
  { id: 'd1', title: 'Supply Semen 500 Sak',    company: 'PT Konstruksi Prima', value: 26000000, stage: 'prospek',   probability: 20, salesman: 'Budi S.', updatedAt: '2024-01-15' },
  { id: 'd2', title: 'Material Bangunan Gedung', company: 'CV Maju Bersama',    value: 85000000, stage: 'demo',      probability: 40, salesman: 'Sari D.', updatedAt: '2024-01-14' },
  { id: 'd3', title: 'Pipa dan Fitting PVC',     company: 'Toko Jaya Makmur',   value: 12500000, stage: 'proposal',  probability: 60, salesman: 'Budi S.', updatedAt: '2024-01-13' },
  { id: 'd4', title: 'Cat dan Material Finishing', company: 'PT Karya Sejati',  value: 34000000, stage: 'negosiasi', probability: 75, salesman: 'Andi P.', updatedAt: '2024-01-12' },
  { id: 'd5', title: 'Besi Beton Proyek Jalan',  company: 'CV Bangun Kuat',     value: 120000000, stage: 'won',      probability: 100, salesman: 'Sari D.', updatedAt: '2024-01-11' },
  { id: 'd6', title: 'Keramik Lantai Perumahan', company: 'UD Sentosa Abadi',   value: 28000000, stage: 'prospek',   probability: 20, salesman: 'Andi P.', updatedAt: '2024-01-10' },
  { id: 'd7', title: 'Supply Pasir & Batu',      company: 'PT Mitra Bangun',    value: 15000000, stage: 'demo',      probability: 40, salesman: 'Budi S.', updatedAt: '2024-01-09' },
  { id: 'd8', title: 'Genteng & Atap Metal',     company: 'Toko Bangunan Jaya', value: 9500000,  stage: 'lost',      probability: 0,  salesman: 'Sari D.', updatedAt: '2024-01-08' },
];

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const dragCard = useRef<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/crm/opportunities?limit=100');
      const data = res.data?.data ?? res.data?.items ?? res.data;
      setDeals(Array.isArray(data) && data.length > 0 ? data : DEMO_DEALS);
    } catch { setDeals(DEMO_DEALS); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const formatRp = (v: number) => v >= 1e9 ? `Rp ${(v / 1e9).toFixed(1)} M` : v >= 1e6 ? `Rp ${(v / 1e6).toFixed(1)} Jt` : `Rp ${Number(v).toLocaleString('id-ID')}`;

  const handleDragStart = (id: string) => { setDragging(id); dragCard.current = id; };
  const handleDragEnd = () => { setDragging(null); setDragOver(null); dragCard.current = null; };
  const handleDrop = async (stageKey: string) => {
    if (!dragCard.current) return;
    const id = dragCard.current;
    setDeals(prev => prev.map(d => d.id === id ? { ...d, stage: stageKey } : d));
    setDragOver(null);
    try { await api.patch(`/crm/opportunities/${id}`, { stage: stageKey }); } catch {}
  };

  const stageDeals = (key: string) => deals.filter(d => d.stage === key);
  const stageTotal = (key: string) => stageDeals(key).reduce((s, d) => s + (d.value ?? 0), 0);

  return (
    <SalesLayout title="Pipeline CRM" subtitle="Kanban peluang penjualan">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: C.textDark, margin: '0 0 4px' }}>Pipeline CRM</h2>
          <p style={{ fontSize: 13, color: C.textLight, margin: 0 }}>
            {deals.length} peluang · Total: {formatRp(deals.reduce((s, d) => s + (d.value ?? 0), 0))}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: '#fff', color: C.textMid, fontSize: 13, cursor: 'pointer' }}>
            <RefreshCw size={13} /> Refresh
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: 'none', background: C.primary, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={14} /> Tambah Deal
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: C.textLight }}>Memuat pipeline…</div>
      ) : (
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 12 }}>
          {STAGES.map(stage => {
            const cards = stageDeals(stage.key);
            const total = stageTotal(stage.key);
            const isOver = dragOver === stage.key;
            return (
              <div
                key={stage.key}
                style={{ minWidth: 240, flex: '0 0 240px', display: 'flex', flexDirection: 'column', gap: 0 }}
                onDragOver={e => { e.preventDefault(); setDragOver(stage.key); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => handleDrop(stage.key)}
              >
                {/* Column header */}
                <div style={{ backgroundColor: '#fff', borderRadius: '12px 12px 0 0', border: `1.5px solid ${C.border}`, borderBottom: 'none', padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: stage.color }} />
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: C.textDark }}>{stage.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 100, backgroundColor: `${stage.color}18`, color: stage.color }}>{cards.length}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <DollarSign size={10} style={{ color: C.textLight }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.textMid }}>{formatRp(total)}</span>
                  </div>
                </div>

                {/* Cards area */}
                <div style={{
                  flex: 1, minHeight: 200, backgroundColor: isOver ? `${stage.color}08` : '#F9F8FF',
                  border: `1.5px solid ${isOver ? stage.color : C.border}`, borderTop: 'none',
                  borderRadius: '0 0 12px 12px', padding: 8, display: 'flex', flexDirection: 'column', gap: 8,
                  transition: 'all .15s',
                }}>
                  {cards.map(deal => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={() => handleDragStart(deal.id)}
                      onDragEnd={handleDragEnd}
                      style={{
                        backgroundColor: '#fff', borderRadius: 12, border: `1.5px solid ${C.border}`,
                        padding: '12px 14px', cursor: 'grab', opacity: dragging === deal.id ? 0.5 : 1,
                        boxShadow: dragging === deal.id ? `0 8px 24px ${C.primary}30` : '0 1px 4px rgba(0,0,0,.06)',
                        transition: 'all .15s', userSelect: 'none',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = stage.color; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 14px ${stage.color}20`; }}
                      onMouseLeave={e => { if (dragging !== deal.id) { (e.currentTarget as HTMLDivElement).style.borderColor = C.border; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,.06)'; } }}
                    >
                      <p style={{ fontSize: 12.5, fontWeight: 700, color: C.textDark, margin: '0 0 4px', lineHeight: 1.3 }}>{deal.title}</p>
                      <p style={{ fontSize: 11.5, color: C.textMid, margin: '0 0 8px' }}>{deal.company}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: stage.color }}>{formatRp(deal.value)}</span>
                        <span style={{ fontSize: 10, color: C.textLight }}>{deal.salesman}</span>
                      </div>
                      {deal.probability > 0 && deal.probability < 100 && (
                        <div style={{ marginTop: 8 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                            <span style={{ fontSize: 9, color: C.textLight, fontWeight: 600 }}>PROBABILITAS</span>
                            <span style={{ fontSize: 9, fontWeight: 700, color: stage.color }}>{deal.probability}%</span>
                          </div>
                          <div style={{ height: 3, borderRadius: 100, backgroundColor: '#F3F4F6', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${deal.probability}%`, backgroundColor: stage.color, borderRadius: 100 }} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {cards.length === 0 && (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textLight, fontSize: 12 }}>
                      Kosong
                    </div>
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
