'use client';

import { useState, useEffect } from 'react';
import ModernLayout from '@/components/layout/ModernLayout';
import api from '@/lib/api';

const STAGES = [
  { key: 'new', label: 'Baru', color: 'bg-slate-500' },
  { key: 'qualified', label: 'Qualified', color: 'bg-blue-500' },
  { key: 'proposition', label: 'Penawaran', color: 'bg-violet-500' },
  { key: 'won', label: 'Menang', color: 'bg-emerald-500' },
  { key: 'lost', label: 'Kalah', color: 'bg-red-500' },
];

const PRIORITY_LABELS = ['Normal', 'Tinggi', 'Sangat Tinggi'];
const PRIORITY_COLORS = ['text-slate-400', 'text-yellow-400', 'text-red-400'];

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}

export default function CrmPage() {
  const [pipeline, setPipeline] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'opportunity', stage: 'new', expectedRevenue: '', phone: '', email: '', company: '', source: '', notes: '' });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [pipeRes, statsRes] = await Promise.all([api.get('/crm/pipeline'), api.get('/crm/stats')]);
      setPipeline(pipeRes.data);
      setStats(statsRes.data);
    } catch { } finally { setLoading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post('/crm/leads', { ...form, expectedRevenue: parseFloat(form.expectedRevenue) || 0 });
      setShowForm(false);
      setForm({ name: '', type: 'opportunity', stage: 'new', expectedRevenue: '', phone: '', email: '', company: '', source: '', notes: '' });
      fetchData();
    } catch (err) { console.error(err); }
  }

  async function handleWon(id: string) {
    if (!confirm('Tandai sebagai WON?')) return;
    await api.post(`/crm/leads/${id}/won`);
    fetchData();
  }

  async function handleLost(id: string) {
    const reason = prompt('Alasan kehilangan:');
    if (reason === null) return;
    await api.post(`/crm/leads/${id}/lost`, { reason });
    fetchData();
  }

  const fmt = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  return (
    <ModernLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">CRM — Pipeline Penjualan</h1>
            <p className="text-slate-400 text-sm mt-1">Kelola leads & opportunities</p>
          </div>
          <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            + Tambah Lead
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard label="Total Leads" value={stats.total} />
            <StatCard label="Opportunities" value={stats.opportunities} />
            <StatCard label="Menang" value={stats.won} />
            <StatCard label="Kalah" value={stats.lost} />
            <StatCard label="Nilai Pipeline" value={fmt(Number(stats.pipelineValue))} />
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-48 text-slate-400">Memuat pipeline...</div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {STAGES.map((stage) => {
              const col = pipeline.find(p => p.stage === stage.key);
              const leads = col?.leads ?? [];
              const total = col?.total ?? 0;
              return (
                <div key={stage.key} className="flex-shrink-0 w-72 bg-slate-800/60 rounded-xl border border-slate-700">
                  <div className="p-3 border-b border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${stage.color}`} />
                      <span className="text-white font-medium text-sm">{stage.label}</span>
                      <span className="bg-slate-700 text-slate-300 text-xs px-1.5 py-0.5 rounded-full">{leads.length}</span>
                    </div>
                    {total > 0 && <span className="text-slate-400 text-xs">{fmt(total)}</span>}
                  </div>
                  <div className="p-2 space-y-2 min-h-32 max-h-[60vh] overflow-y-auto">
                    {leads.map((lead: any) => (
                      <div key={lead.id} className="bg-slate-700/60 rounded-lg p-3 border border-slate-600 hover:border-slate-500 cursor-pointer group">
                        <p className="text-white text-sm font-medium leading-tight">{lead.name}</p>
                        {lead.company && <p className="text-slate-400 text-xs mt-0.5">{lead.company}</p>}
                        {lead.expectedRevenue > 0 && <p className="text-emerald-400 text-xs font-medium mt-1">{fmt(Number(lead.expectedRevenue))}</p>}
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs ${PRIORITY_COLORS[lead.priority] ?? 'text-slate-400'}`}>★ {PRIORITY_LABELS[lead.priority] ?? 'Normal'}</span>
                          {stage.key !== 'won' && stage.key !== 'lost' && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleWon(lead.id)} className="text-xs bg-emerald-600/30 text-emerald-400 px-1.5 py-0.5 rounded hover:bg-emerald-600/50">✓</button>
                              <button onClick={() => handleLost(lead.id)} className="text-xs bg-red-600/30 text-red-400 px-1.5 py-0.5 rounded hover:bg-red-600/50">✗</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {leads.length === 0 && <p className="text-slate-600 text-xs text-center py-4">Tidak ada leads</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl w-full max-w-lg border border-slate-700 shadow-2xl">
              <div className="p-5 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-white font-semibold">Tambah Lead / Opportunity</h2>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-slate-400 text-xs mb-1 block">Nama Lead *</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" placeholder="Nama opportunity" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">Tipe</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                      <option value="lead">Lead</option>
                      <option value="opportunity">Opportunity</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">Stage</label>
                    <select value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                      {STAGES.slice(0, 3).map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">Perusahaan</label>
                    <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" placeholder="PT. ..." />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">Estimasi Revenue</label>
                    <input type="number" value={form.expectedRevenue} onChange={e => setForm(f => ({ ...f, expectedRevenue: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">No. HP</label>
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-slate-400 text-xs mb-1 block">Catatan</label>
                    <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm">Batal</button>
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
