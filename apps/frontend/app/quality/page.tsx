'use client';

import { useState, useEffect } from 'react';
import ModernLayout from '@/components/layout/ModernLayout';
import api from '@/lib/api';

const ALERT_STAGES = [
  { key: 'new', label: 'Baru', color: 'bg-slate-600 text-slate-200' },
  { key: 'in_progress', label: 'Diproses', color: 'bg-blue-600/30 text-blue-300' },
  { key: 'solved', label: 'Solved', color: 'bg-emerald-600/30 text-emerald-300' },
  { key: 'closed', label: 'Closed', color: 'bg-slate-700 text-slate-400' },
];

const CHECK_STATUS = {
  todo: { label: 'Belum', color: 'bg-slate-600 text-slate-200' },
  pass: { label: 'Lulus', color: 'bg-emerald-600/30 text-emerald-300' },
  fail: { label: 'Gagal', color: 'bg-red-600/30 text-red-300' },
};

type Tab = 'checks' | 'qcp' | 'alerts';

export default function QualityPage() {
  const [tab, setTab] = useState<Tab>('checks');
  const [checks, setChecks] = useState<any[]>([]);
  const [qcps, setQcps] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQcpForm, setShowQcpForm] = useState(false);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [qcpForm, setQcpForm] = useState({ name: '', operation: 'receipt', checkType: 'passfail', productId: '' });
  const [alertForm, setAlertForm] = useState({ title: '', productId: '', priority: '0', rootCause: '', corrective: '' });

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [checkRes, qcpRes, alertRes, statsRes] = await Promise.all([
        api.get('/quality/checks'),
        api.get('/quality/qcp'),
        api.get('/quality/alerts'),
        api.get('/quality/stats'),
      ]);
      setChecks(checkRes.data.data ?? []);
      setQcps(qcpRes.data ?? []);
      setAlerts(alertRes.data.data ?? alertRes.data ?? []);
      setStats(statsRes.data);
    } catch { } finally { setLoading(false); }
  }

  async function passCheck(id: string) { await api.post(`/quality/checks/${id}/pass`); fetchAll(); }
  async function failCheck(id: string) { const notes = prompt('Catatan kegagalan:') ?? ''; await api.post(`/quality/checks/${id}/fail`, { notes }); fetchAll(); }

  async function handleCreateQcp(e: React.FormEvent) {
    e.preventDefault();
    try { await api.post('/quality/qcp', qcpForm); setShowQcpForm(false); fetchAll(); } catch { }
  }

  async function handleCreateAlert(e: React.FormEvent) {
    e.preventDefault();
    try { await api.post('/quality/alerts', { ...alertForm, priority: parseInt(alertForm.priority) }); setShowAlertForm(false); fetchAll(); } catch { }
  }

  return (
    <ModernLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Quality Control</h1>
            <p className="text-slate-400 text-sm mt-1">Pemeriksaan kualitas produk & bahan</p>
          </div>
          <div className="flex gap-2">
            {tab === 'qcp' && <button onClick={() => setShowQcpForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Control Point</button>}
            {tab === 'alerts' && <button onClick={() => setShowAlertForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Quality Alert</button>}
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Total Checks', value: stats.totalChecks, color: 'text-white' },
              { label: 'Lulus', value: stats.passed, color: 'text-emerald-400' },
              { label: 'Gagal', value: stats.failed, color: 'text-red-400' },
              { label: 'Belum', value: stats.pending, color: 'text-yellow-400' },
              { label: 'Alert Aktif', value: stats.totalAlerts, color: 'text-orange-400' },
            ].map(s => (
              <div key={s.label} className="bg-slate-800 rounded-xl p-3 border border-slate-700 text-center">
                <p className="text-slate-400 text-xs">{s.label}</p>
                <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-1 bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-700">
          {([['checks', 'Quality Checks'], ['qcp', 'Control Points'], ['alerts', 'Quality Alerts']] as [Tab, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === key ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>{label}</button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48 text-slate-400">Memuat data...</div>
        ) : (
          <>
            {tab === 'checks' && (
              <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-slate-700 text-slate-400">
                    <th className="text-left p-4">Control Point</th><th className="text-left p-4">Tipe</th>
                    <th className="text-left p-4">Status</th><th className="text-left p-4">Nilai</th><th className="text-left p-4">Aksi</th>
                  </tr></thead>
                  <tbody>
                    {checks.map(c => {
                      const st = CHECK_STATUS[c.status as keyof typeof CHECK_STATUS] ?? CHECK_STATUS.todo;
                      return (
                        <tr key={c.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                          <td className="p-4 text-white">{c.qcp?.name ?? '—'}</td>
                          <td className="p-4 text-slate-400">{c.qcp?.checkType ?? '—'}</td>
                          <td className="p-4"><span className={`text-xs px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span></td>
                          <td className="p-4 text-slate-300">{c.measuredValue ?? '—'}</td>
                          <td className="p-4">
                            {c.status === 'todo' && (
                              <div className="flex gap-2">
                                <button onClick={() => passCheck(c.id)} className="text-xs bg-emerald-600/30 text-emerald-300 px-2 py-1 rounded hover:bg-emerald-600/50">✓ Lulus</button>
                                <button onClick={() => failCheck(c.id)} className="text-xs bg-red-600/30 text-red-300 px-2 py-1 rounded hover:bg-red-600/50">✗ Gagal</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {checks.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-500">Belum ada quality check</td></tr>}
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'qcp' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {qcps.map(q => (
                  <div key={q.id} className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-white font-medium">{q.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${q.active ? 'bg-emerald-600/30 text-emerald-300' : 'bg-slate-600 text-slate-400'}`}>{q.active ? 'Aktif' : 'Nonaktif'}</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between"><span className="text-slate-400">Operasi</span><span className="text-white">{q.operation}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Tipe Check</span><span className="text-white">{q.checkType}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Jumlah Check</span><span className="text-slate-300">{q._count?.checks ?? 0}</span></div>
                    </div>
                  </div>
                ))}
                {qcps.length === 0 && <p className="text-slate-500 text-center py-10 col-span-3">Belum ada control point</p>}
              </div>
            )}

            {tab === 'alerts' && (
              <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-slate-700 text-slate-400">
                    <th className="text-left p-4">Judul</th><th className="text-left p-4">Prioritas</th>
                    <th className="text-left p-4">Stage</th><th className="text-left p-4">Root Cause</th><th className="text-left p-4">Aksi</th>
                  </tr></thead>
                  <tbody>
                    {alerts.map(a => {
                      const stage = ALERT_STAGES.find(s => s.key === a.stage);
                      return (
                        <tr key={a.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                          <td className="p-4 text-white font-medium">{a.title}</td>
                          <td className="p-4"><span className={`text-xs ${a.priority >= 2 ? 'text-red-400' : a.priority === 1 ? 'text-yellow-400' : 'text-slate-400'}`}>{'★'.repeat(a.priority + 1)}</span></td>
                          <td className="p-4"><span className={`text-xs px-2 py-0.5 rounded-full ${stage?.color ?? ''}`}>{stage?.label ?? a.stage}</span></td>
                          <td className="p-4 text-slate-400 text-xs max-w-48 truncate">{a.rootCause ?? '—'}</td>
                          <td className="p-4">
                            <select value={a.stage} onChange={async e => { await api.put(`/quality/alerts/${a.id}`, { stage: e.target.value }); fetchAll(); }} className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-white">
                              {ALERT_STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                    {alerts.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-500">Tidak ada quality alert aktif</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {showQcpForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl w-full max-w-sm border border-slate-700">
              <div className="p-5 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-white font-semibold">Tambah Control Point</h2>
                <button onClick={() => setShowQcpForm(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleCreateQcp} className="p-5 space-y-3">
                <div><label className="text-slate-400 text-xs mb-1 block">Nama *</label><input required value={qcpForm.name} onChange={e => setQcpForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Operasi</label>
                  <select value={qcpForm.operation} onChange={e => setQcpForm(f => ({ ...f, operation: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                    <option value="receipt">Penerimaan (Receipt)</option>
                    <option value="delivery">Pengiriman (Delivery)</option>
                    <option value="manufacturing">Produksi (Manufacturing)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Tipe Check</label>
                  <select value={qcpForm.checkType} onChange={e => setQcpForm(f => ({ ...f, checkType: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                    <option value="passfail">Pass/Fail</option>
                    <option value="measure">Ukur</option>
                    <option value="instructions">Instruksi</option>
                    <option value="picture">Foto</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowQcpForm(false)} className="flex-1 bg-slate-700 text-white py-2 rounded-lg text-sm">Batal</button>
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAlertForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700">
              <div className="p-5 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-white font-semibold">Buat Quality Alert</h2>
                <button onClick={() => setShowAlertForm(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleCreateAlert} className="p-5 space-y-3">
                <div><label className="text-slate-400 text-xs mb-1 block">Judul *</label><input required value={alertForm.title} onChange={e => setAlertForm(f => ({ ...f, title: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Prioritas</label>
                  <select value={alertForm.priority} onChange={e => setAlertForm(f => ({ ...f, priority: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                    <option value="0">Normal</option><option value="1">Tinggi</option><option value="2">Sangat Tinggi</option>
                  </select>
                </div>
                <div><label className="text-slate-400 text-xs mb-1 block">Root Cause</label><textarea value={alertForm.rootCause} onChange={e => setAlertForm(f => ({ ...f, rootCause: e.target.value }))} rows={2} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none" /></div>
                <div><label className="text-slate-400 text-xs mb-1 block">Tindakan Korektif</label><textarea value={alertForm.corrective} onChange={e => setAlertForm(f => ({ ...f, corrective: e.target.value }))} rows={2} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none" /></div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAlertForm(false)} className="flex-1 bg-slate-700 text-white py-2 rounded-lg text-sm">Batal</button>
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
