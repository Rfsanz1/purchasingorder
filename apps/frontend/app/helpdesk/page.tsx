'use client';

import { useState, useEffect } from 'react';
import ModernLayout from '@/components/layout/ModernLayout';
import api from '@/lib/api';

const STAGES = [
  { key: 'new', label: 'Baru', color: 'bg-slate-600 text-slate-200' },
  { key: 'in_progress', label: 'Diproses', color: 'bg-blue-600/30 text-blue-300' },
  { key: 'solved', label: 'Solved', color: 'bg-emerald-600/30 text-emerald-300' },
  { key: 'closed', label: 'Closed', color: 'bg-slate-700 text-slate-400' },
];

const PRIORITY_MAP = [
  { label: 'Rendah', color: 'text-slate-400' },
  { label: 'Normal', color: 'text-blue-400' },
  { label: 'Tinggi', color: 'text-yellow-400' },
  { label: 'Urgent', color: 'text-red-400' },
];

export default function HelpdeskPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ stage: '', teamId: '' });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: '', description: '', teamId: '', priority: '1', tags: '' });

  useEffect(() => { fetchAll(); }, [filter]);

  async function fetchAll() {
    setLoading(true);
    try {
      const [tickRes, teamRes, statsRes] = await Promise.all([
        api.get('/helpdesk/tickets', { params: { stage: filter.stage || undefined, teamId: filter.teamId || undefined } }),
        api.get('/helpdesk/teams'),
        api.get('/helpdesk/stats'),
      ]);
      setTickets(tickRes.data.data ?? []);
      setTeams(teamRes.data ?? []);
      setStats(statsRes.data);
    } catch { } finally { setLoading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post('/helpdesk/tickets', { ...form, priority: parseInt(form.priority), tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] });
      setShowForm(false);
      setForm({ subject: '', description: '', teamId: '', priority: '1', tags: '' });
      fetchAll();
    } catch { }
  }

  async function updateStage(id: string, stage: string) {
    if (stage === 'closed') { await api.post(`/helpdesk/tickets/${id}/close`); }
    else { await api.put(`/helpdesk/tickets/${id}`, { stage }); }
    fetchAll();
  }

  return (
    <ModernLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Helpdesk</h1>
            <p className="text-slate-400 text-sm mt-1">Manajemen tiket dukungan pelanggan</p>
          </div>
          <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Buat Tiket</button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {[
              { label: 'Total', value: stats.total, color: 'text-white' },
              { label: 'Baru', value: stats.open, color: 'text-slate-300' },
              { label: 'Diproses', value: stats.inProgress, color: 'text-blue-400' },
              { label: 'Solved', value: stats.solved, color: 'text-emerald-400' },
              { label: 'Closed', value: stats.closed, color: 'text-slate-500' },
              { label: 'Urgent', value: stats.urgent, color: 'text-red-400' },
            ].map(s => (
              <div key={s.label} className="bg-slate-800 rounded-xl p-3 border border-slate-700 text-center">
                <p className="text-slate-400 text-xs">{s.label}</p>
                <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          <select value={filter.stage} onChange={e => setFilter(f => ({ ...f, stage: e.target.value }))} className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
            <option value="">Semua Stage</option>
            {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
          <select value={filter.teamId} onChange={e => setFilter(f => ({ ...f, teamId: e.target.value }))} className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
            <option value="">Semua Tim</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48 text-slate-400">Memuat tiket...</div>
        ) : (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-700 text-slate-400">
                <th className="text-left p-4">No. Tiket</th>
                <th className="text-left p-4">Subjek</th>
                <th className="text-left p-4 hidden md:table-cell">Tim</th>
                <th className="text-left p-4">Prioritas</th>
                <th className="text-left p-4">Stage</th>
                <th className="text-left p-4">SLA</th>
                <th className="text-left p-4">Aksi</th>
              </tr></thead>
              <tbody>
                {tickets.map(t => {
                  const prio = PRIORITY_MAP[t.priority] ?? PRIORITY_MAP[1];
                  const stage = STAGES.find(s => s.key === t.stage);
                  const slaOk = !t.slaDeadline || new Date(t.slaDeadline) > new Date();
                  return (
                    <tr key={t.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="p-4 text-slate-300 font-mono text-xs">{t.noTicket}</td>
                      <td className="p-4">
                        <p className="text-white font-medium">{t.subject}</p>
                        {t.description && <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{t.description}</p>}
                      </td>
                      <td className="p-4 text-slate-400 hidden md:table-cell">{t.team?.name ?? '—'}</td>
                      <td className={`p-4 font-medium ${prio.color}`}>{prio.label}</td>
                      <td className="p-4"><span className={`text-xs px-2 py-0.5 rounded-full ${stage?.color ?? ''}`}>{stage?.label ?? t.stage}</span></td>
                      <td className="p-4">{t.slaDeadline ? <span className={slaOk ? 'text-emerald-400 text-xs' : 'text-red-400 text-xs'}>{slaOk ? '✓ OK' : '⚠ Overdue'}</span> : <span className="text-slate-600 text-xs">—</span>}</td>
                      <td className="p-4">
                        <select value={t.stage} onChange={e => updateStage(t.id, e.target.value)} className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-white">
                          {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
                {tickets.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-slate-500">Tidak ada tiket</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700">
              <div className="p-5 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-white font-semibold">Buat Tiket Baru</h2>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-3">
                <div><label className="text-slate-400 text-xs mb-1 block">Subjek *</label><input required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Tim</label>
                  <select value={form.teamId} onChange={e => setForm(f => ({ ...f, teamId: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                    <option value="">-- Pilih Tim --</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Prioritas</label>
                  <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                    {PRIORITY_MAP.map((p, i) => <option key={i} value={String(i)}>{p.label}</option>)}
                  </select>
                </div>
                <div><label className="text-slate-400 text-xs mb-1 block">Deskripsi</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none" /></div>
                <div><label className="text-slate-400 text-xs mb-1 block">Tags (pisah koma)</label><input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" placeholder="bug, urgent, billing" /></div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-slate-700 text-white py-2 rounded-lg text-sm">Batal</button>
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ModernLayout>
  );
}
