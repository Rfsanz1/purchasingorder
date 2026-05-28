'use client';

import { useEffect, useState, useCallback } from 'react';
import { SalesLayout } from '../../../components/SalesLayout';
import api from '../../../lib/api';
import { Phone, Mail, Users, Calendar, RefreshCw, Plus, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const C = { primary: '#7C3AED', border: '#EDE9FE', textDark: '#1E1B4B', textMid: '#6B7280', textLight: '#9CA3AF' };

const TYPE_CFG: Record<string, { label: string; icon: any; color: string }> = {
  call:    { label: 'Telepon',  icon: Phone,    color: '#3B82F6' },
  email:   { label: 'Email',   icon: Mail,     color: '#8B5CF6' },
  meeting: { label: 'Meeting', icon: Users,    color: '#22C55E' },
  task:    { label: 'Tugas',   icon: Calendar, color: '#F59E0B' },
};

const DEMO: any[] = [
  { id: 'a1', title: 'Follow-up quotation PT Maju', type: 'call',    customer: 'PT Maju Sejahtera', dueDate: new Date().toISOString(), done: false, overdue: false, notes: 'Konfirmasi keputusan pembelian.' },
  { id: 'a2', title: 'Kirim proposal CV Berkah',    type: 'email',   customer: 'CV Berkah Jaya',    dueDate: new Date().toISOString(), done: false, overdue: false, notes: 'Proposal terbaru dengan diskon spesial.' },
  { id: 'a3', title: 'Demo produk Toko Bangunan',   type: 'meeting', customer: 'Toko Bangunan Sejuk', dueDate: new Date(Date.now() - 86400000).toISOString(), done: false, overdue: true,  notes: 'Demo produk cat dan finishing.' },
  { id: 'a4', title: 'Update data pelanggan baru',  type: 'task',    customer: 'UD Subur Makmur',   dueDate: new Date().toISOString(), done: true,  overdue: false, notes: 'Input data lengkap ke sistem.' },
  { id: 'a5', title: 'Negosiasi harga PT Karya',    type: 'call',    customer: 'PT Karya Abadi',    dueDate: new Date(Date.now() + 3600000).toISOString(), done: false, overdue: false, notes: 'Diskusi volume discount untuk Q1.' },
];

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'today' | 'overdue' | 'done'>('all');
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/crm/activities?limit=50');
      const data = res.data?.data ?? res.data?.items ?? res.data;
      const parsed = (Array.isArray(data) && data.length > 0 ? data : DEMO).map((a: any) => ({
        ...a,
        overdue: !a.done && new Date(a.dueDate) < new Date(),
      }));
      setActivities(parsed);
    } catch { setActivities(DEMO); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const markDone = async (id: string) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, done: true } : a));
    try { await api.patch(`/crm/activities/${id}`, { done: true }); } catch {}
  };

  const reschedule = async (id: string) => {
    if (!newDate) return;
    setActivities(prev => prev.map(a => a.id === id ? { ...a, dueDate: newDate, overdue: false } : a));
    setRescheduleId(null);
    setNewDate('');
    try { await api.patch(`/crm/activities/${id}`, { dueDate: newDate }); } catch {}
  };

  const today = new Date().toDateString();
  const filtered = activities.filter(a => {
    if (filter === 'today') return new Date(a.dueDate).toDateString() === today && !a.done;
    if (filter === 'overdue') return a.overdue;
    if (filter === 'done') return a.done;
    return true;
  });

  const counts = {
    all: activities.length,
    today: activities.filter(a => new Date(a.dueDate).toDateString() === today && !a.done).length,
    overdue: activities.filter(a => a.overdue).length,
    done: activities.filter(a => a.done).length,
  };

  const formatTime = (v: string) => v ? new Date(v).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '–';

  return (
    <SalesLayout title="Aktivitas & Follow-up" subtitle="Tugas harian dan jadwal">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: C.textDark, margin: '0 0 4px' }}>Aktivitas & Follow-up</h2>
          <p style={{ fontSize: 13, color: C.textLight, margin: 0 }}>Tugas dan jadwal hari ini</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: '#fff', color: C.textMid, fontSize: 13, cursor: 'pointer' }}>
            <RefreshCw size={13} />
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: 'none', background: C.primary, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={14} /> Tambah Aktivitas
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {([
          { key: 'all',     label: 'Semua',           color: C.primary },
          { key: 'today',   label: 'Hari Ini',         color: '#22C55E' },
          { key: 'overdue', label: 'Terlambat',        color: '#EF4444' },
          { key: 'done',    label: 'Selesai',          color: '#9CA3AF' },
        ] as const).map(tab => {
          const active = filter === tab.key;
          return (
            <button key={tab.key} onClick={() => setFilter(tab.key)}
              style={{ padding: '7px 14px', borderRadius: 10, border: `1.5px solid ${active ? tab.color : C.border}`, background: active ? `${tab.color}12` : '#fff', color: active ? tab.color : C.textMid, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              {tab.label}
              <span style={{ fontSize: 11, fontWeight: 700, padding: '0px 6px', borderRadius: 100, backgroundColor: active ? `${tab.color}20` : '#F3F4F6', color: active ? tab.color : C.textLight }}>
                {counts[tab.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Activity list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: C.textLight }}>Memuat…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: C.textLight }}>
          <CheckCircle size={40} style={{ color: '#BBF7D0', marginBottom: 12 }} />
          <p>Tidak ada aktivitas di sini</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(a => {
            const typeCfg = TYPE_CFG[a.type] ?? { label: a.type, icon: Calendar, color: '#9CA3AF' };
            const Icon = typeCfg.icon;
            return (
              <div key={a.id} style={{ backgroundColor: '#fff', borderRadius: 14, border: `1.5px solid ${a.overdue ? 'rgba(239,68,68,.3)' : a.done ? 'rgba(34,197,94,.2)' : C.border}`, padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'flex-start', opacity: a.done ? 0.65 : 1 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: `${typeCfg.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} style={{ color: typeCfg.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ fontSize: 13.5, fontWeight: 700, color: a.done ? C.textLight : C.textDark, margin: '0 0 3px', textDecoration: a.done ? 'line-through' : 'none' }}>{a.title}</p>
                      <p style={{ fontSize: 12, color: C.textMid, margin: '0 0 4px' }}>{a.customer}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      {a.overdue && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#EF4444', backgroundColor: '#FEF2F2', padding: '3px 8px', borderRadius: 100 }}><AlertTriangle size={10} /> Terlambat</span>}
                      {a.done && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#22C55E', backgroundColor: '#F0FDF4', padding: '3px 8px', borderRadius: 100 }}><CheckCircle size={10} /> Selesai</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: a.notes ? 8 : 0 }}>
                    <Clock size={11} style={{ color: a.overdue ? '#EF4444' : C.textLight }} />
                    <span style={{ fontSize: 11.5, color: a.overdue ? '#EF4444' : C.textLight, fontWeight: a.overdue ? 700 : 400 }}>{formatTime(a.dueDate)}</span>
                  </div>
                  {a.notes && <p style={{ fontSize: 12, color: C.textLight, margin: 0, fontStyle: 'italic' }}>{a.notes}</p>}

                  {/* Reschedule form */}
                  {rescheduleId === a.id && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
                      <input type="datetime-local" value={newDate} onChange={e => setNewDate(e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: 8, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 12, color: C.textDark }} />
                      <button onClick={() => reschedule(a.id)} style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: C.primary, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Simpan</button>
                      <button onClick={() => setRescheduleId(null)} style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', color: C.textMid, fontSize: 12, cursor: 'pointer' }}>Batal</button>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {!a.done && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                    <button onClick={() => markDone(a.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: 'none', background: '#22C55E', color: '#fff', fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}>
                      <CheckCircle size={12} /> Selesai
                    </button>
                    <button onClick={() => { setRescheduleId(a.id); setNewDate(''); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', color: C.textMid, fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}>
                      <Clock size={12} /> Reschedule
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </SalesLayout>
  );
}
