'use client';

import { useState, useEffect } from 'react';
import ModernLayout from '@/components/layout/ModernLayout';
import api from '@/lib/api';

const REQ_STATUS = {
  new: { label: 'Baru', color: 'bg-slate-600 text-slate-200' },
  in_progress: { label: 'Dikerjakan', color: 'bg-blue-600/30 text-blue-300' },
  done: { label: 'Selesai', color: 'bg-emerald-600/30 text-emerald-300' },
  cancelled: { label: 'Batal', color: 'bg-red-600/30 text-red-300' },
};

export default function MaintenancePage() {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [tab, setTab] = useState<'requests' | 'equipment'>('requests');
  const [loading, setLoading] = useState(true);
  const [showEqForm, setShowEqForm] = useState(false);
  const [showReqForm, setShowReqForm] = useState(false);
  const [eqForm, setEqForm] = useState({ name: '', category: '', serialNo: '', location: '', warrantyDate: '' });
  const [reqForm, setReqForm] = useState({ equipmentId: '', name: '', type: 'corrective', priority: '0', notes: '', scheduledDate: '' });

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [eqRes, reqRes, statsRes] = await Promise.all([
        api.get('/maintenance/equipment'),
        api.get('/maintenance/requests'),
        api.get('/maintenance/stats'),
      ]);
      setEquipment(eqRes.data ?? []);
      setRequests(reqRes.data.data ?? []);
      setStats(statsRes.data);
    } catch { } finally { setLoading(false); }
  }

  async function handleCreateEq(e: React.FormEvent) {
    e.preventDefault();
    try { await api.post('/maintenance/equipment', eqForm); setShowEqForm(false); fetchAll(); } catch { }
  }

  async function handleCreateReq(e: React.FormEvent) {
    e.preventDefault();
    try { await api.post('/maintenance/requests', { ...reqForm, priority: parseInt(reqForm.priority) }); setShowReqForm(false); fetchAll(); } catch { }
  }

  async function closeRequest(id: string) { await api.post(`/maintenance/requests/${id}/close`); fetchAll(); }

  return (
    <ModernLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Maintenance</h1>
            <p className="text-slate-400 text-sm mt-1">Kelola peralatan & permintaan pemeliharaan</p>
          </div>
          <div className="flex gap-2">
            {tab === 'equipment' && <button onClick={() => setShowEqForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Peralatan</button>}
            {tab === 'requests' && <button onClick={() => setShowReqForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Permintaan</button>}
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Total', value: stats.total, color: 'text-white' },
              { label: 'Baru', value: stats.open, color: 'text-slate-300' },
              { label: 'Dikerjakan', value: stats.inProgress, color: 'text-blue-400' },
              { label: 'Selesai', value: stats.done, color: 'text-emerald-400' },
              { label: 'Terlambat', value: stats.overdue, color: 'text-red-400' },
            ].map(s => (
              <div key={s.label} className="bg-slate-800 rounded-xl p-3 border border-slate-700 text-center">
                <p className="text-slate-400 text-xs">{s.label}</p>
                <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-1 bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-700">
          {([['requests', 'Permintaan Maintenance'], ['equipment', 'Daftar Peralatan']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === key ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>{label}</button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48 text-slate-400">Memuat data...</div>
        ) : tab === 'requests' ? (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-700 text-slate-400">
                <th className="text-left p-4">No. MR</th><th className="text-left p-4">Nama</th>
                <th className="text-left p-4">Peralatan</th><th className="text-left p-4">Tipe</th>
                <th className="text-left p-4">Status</th><th className="text-left p-4">Aksi</th>
              </tr></thead>
              <tbody>
                {requests.map(r => {
                  const st = REQ_STATUS[r.status as keyof typeof REQ_STATUS] ?? REQ_STATUS.new;
                  return (
                    <tr key={r.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="p-4 font-mono text-xs text-slate-300">{r.noMr}</td>
                      <td className="p-4 text-white">{r.name}</td>
                      <td className="p-4 text-slate-300">{r.equipment?.name ?? '—'}</td>
                      <td className="p-4"><span className="text-xs text-slate-400 capitalize">{r.type}</span></td>
                      <td className="p-4"><span className={`text-xs px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span></td>
                      <td className="p-4">
                        {(r.status === 'new' || r.status === 'in_progress') && (
                          <button onClick={() => closeRequest(r.id)} className="text-xs bg-emerald-600/30 text-emerald-300 px-2 py-1 rounded hover:bg-emerald-600/50">✓ Selesai</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {requests.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-slate-500">Belum ada permintaan maintenance</td></tr>}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.map(eq => (
              <div key={eq.id} className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-white font-semibold">{eq.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${eq.active ? 'bg-emerald-600/30 text-emerald-300' : 'bg-slate-600 text-slate-400'}`}>{eq.active ? 'Aktif' : 'Nonaktif'}</span>
                </div>
                <div className="space-y-1 text-sm">
                  {eq.category && <div className="flex justify-between"><span className="text-slate-400">Kategori</span><span className="text-white">{eq.category}</span></div>}
                  {eq.serialNo && <div className="flex justify-between"><span className="text-slate-400">S/N</span><span className="text-slate-300 font-mono text-xs">{eq.serialNo}</span></div>}
                  {eq.location && <div className="flex justify-between"><span className="text-slate-400">Lokasi</span><span className="text-white">{eq.location}</span></div>}
                  {eq.warrantyDate && <div className="flex justify-between"><span className="text-slate-400">Garansi</span><span className={`text-xs ${new Date(eq.warrantyDate) > new Date() ? 'text-emerald-400' : 'text-red-400'}`}>{new Date(eq.warrantyDate).toLocaleDateString('id-ID')}</span></div>}
                  <div className="flex justify-between"><span className="text-slate-400">Permintaan</span><span className="text-slate-300">{eq._count?.requests ?? 0}</span></div>
                </div>
              </div>
            ))}
            {equipment.length === 0 && <p className="text-slate-500 text-center py-10 col-span-3">Belum ada peralatan terdaftar</p>}
          </div>
        )}

        {showEqForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700">
              <div className="p-5 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-white font-semibold">Tambah Peralatan</h2>
                <button onClick={() => setShowEqForm(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleCreateEq} className="p-5 space-y-3">
                <div><label className="text-slate-400 text-xs mb-1 block">Nama Peralatan *</label><input required value={eqForm.name} onChange={e => setEqForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-slate-400 text-xs mb-1 block">Kategori</label><input value={eqForm.category} onChange={e => setEqForm(f => ({ ...f, category: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                  <div><label className="text-slate-400 text-xs mb-1 block">Serial No.</label><input value={eqForm.serialNo} onChange={e => setEqForm(f => ({ ...f, serialNo: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                  <div><label className="text-slate-400 text-xs mb-1 block">Lokasi</label><input value={eqForm.location} onChange={e => setEqForm(f => ({ ...f, location: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                  <div><label className="text-slate-400 text-xs mb-1 block">Tanggal Garansi</label><input type="date" value={eqForm.warrantyDate} onChange={e => setEqForm(f => ({ ...f, warrantyDate: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowEqForm(false)} className="flex-1 bg-slate-700 text-white py-2 rounded-lg text-sm">Batal</button>
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showReqForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700">
              <div className="p-5 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-white font-semibold">Permintaan Maintenance</h2>
                <button onClick={() => setShowReqForm(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleCreateReq} className="p-5 space-y-3">
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Peralatan *</label>
                  <select required value={reqForm.equipmentId} onChange={e => setReqForm(f => ({ ...f, equipmentId: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                    <option value="">-- Pilih Peralatan --</option>
                    {equipment.map(eq => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
                  </select>
                </div>
                <div><label className="text-slate-400 text-xs mb-1 block">Nama Pekerjaan *</label><input required value={reqForm.name} onChange={e => setReqForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">Tipe</label>
                    <select value={reqForm.type} onChange={e => setReqForm(f => ({ ...f, type: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                      <option value="corrective">Korektif</option><option value="preventive">Preventif</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">Prioritas</label>
                    <select value={reqForm.priority} onChange={e => setReqForm(f => ({ ...f, priority: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                      <option value="0">Normal</option><option value="1">Tinggi</option><option value="2">Urgent</option>
                    </select>
                  </div>
                </div>
                <div><label className="text-slate-400 text-xs mb-1 block">Jadwal</label><input type="date" value={reqForm.scheduledDate} onChange={e => setReqForm(f => ({ ...f, scheduledDate: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                <div><label className="text-slate-400 text-xs mb-1 block">Catatan</label><textarea value={reqForm.notes} onChange={e => setReqForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none" /></div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowReqForm(false)} className="flex-1 bg-slate-700 text-white py-2 rounded-lg text-sm">Batal</button>
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium">Buat</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ModernLayout>
  );
}
