'use client';

import { useState, useEffect } from 'react';
import ModernLayout from '@/components/layout/ModernLayout';
import api from '@/lib/api';

const MO_STATUS = {
  draft: { label: 'Draft', color: 'bg-slate-600 text-slate-200' },
  confirmed: { label: 'Konfirmasi', color: 'bg-blue-600/30 text-blue-300' },
  in_progress: { label: 'Produksi', color: 'bg-yellow-600/30 text-yellow-300' },
  done: { label: 'Selesai', color: 'bg-emerald-600/30 text-emerald-300' },
  scrap: { label: 'Scrap', color: 'bg-red-600/30 text-red-300' },
};

type Tab = 'orders' | 'bom' | 'workcenters';

export default function ManufacturingPage() {
  const [tab, setTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [boms, setBoms] = useState<any[]>([]);
  const [workCenters, setWorkCenters] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showMoForm, setShowMoForm] = useState(false);
  const [showBomForm, setShowBomForm] = useState(false);
  const [showWcForm, setShowWcForm] = useState(false);
  const [moForm, setMoForm] = useState({ productId: '', qty: '1', scheduledDate: new Date().toISOString().split('T')[0] });
  const [bomForm, setBomForm] = useState({ productId: '', qty: '1', type: 'manufacture', reference: '' });
  const [wcForm, setWcForm] = useState({ name: '', code: '', capacity: '1', timeEff: '100' });

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [ordRes, bomRes, wcRes, statsRes] = await Promise.all([
        api.get('/manufacturing/orders'),
        api.get('/manufacturing/bom'),
        api.get('/manufacturing/work-centers'),
        api.get('/manufacturing/stats'),
      ]);
      setOrders(ordRes.data.data ?? []);
      setBoms(bomRes.data.data ?? []);
      setWorkCenters(wcRes.data ?? []);
      setStats(statsRes.data);
    } catch { } finally { setLoading(false); }
  }

  async function handleCreateMo(e: React.FormEvent) {
    e.preventDefault();
    try { await api.post('/manufacturing/orders', { ...moForm, qty: parseFloat(moForm.qty) }); setShowMoForm(false); fetchAll(); } catch { }
  }

  async function handleCreateBom(e: React.FormEvent) {
    e.preventDefault();
    try { await api.post('/manufacturing/bom', { ...bomForm, qty: parseFloat(bomForm.qty) }); setShowBomForm(false); fetchAll(); } catch { }
  }

  async function handleCreateWc(e: React.FormEvent) {
    e.preventDefault();
    try { await api.post('/manufacturing/work-centers', { ...wcForm, capacity: parseFloat(wcForm.capacity), timeEff: parseFloat(wcForm.timeEff) }); setShowWcForm(false); fetchAll(); } catch { }
  }

  async function changeStatus(id: string, action: string) {
    await api.post(`/manufacturing/orders/${id}/${action}`);
    fetchAll();
  }

  return (
    <ModernLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Manufacturing (MRP)</h1>
            <p className="text-slate-400 text-sm mt-1">Kelola produksi, BoM & work center</p>
          </div>
          <div className="flex gap-2">
            {tab === 'orders' && <button onClick={() => setShowMoForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Manufacturing Order</button>}
            {tab === 'bom' && <button onClick={() => setShowBomForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Bill of Materials</button>}
            {tab === 'workcenters' && <button onClick={() => setShowWcForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Work Center</button>}
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700"><p className="text-slate-400 text-sm">Total MO</p><p className="text-2xl font-bold text-white mt-1">{stats.total}</p></div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700"><p className="text-slate-400 text-sm">Draft</p><p className="text-2xl font-bold text-slate-400 mt-1">{stats.draft}</p></div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700"><p className="text-slate-400 text-sm">Produksi</p><p className="text-2xl font-bold text-yellow-400 mt-1">{stats.inProgress}</p></div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700"><p className="text-slate-400 text-sm">Selesai</p><p className="text-2xl font-bold text-emerald-400 mt-1">{stats.done}</p></div>
          </div>
        )}

        <div className="flex gap-1 bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-700">
          {([['orders', 'Manufacturing Orders'], ['bom', 'Bill of Materials'], ['workcenters', 'Work Centers']] as [Tab, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === key ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>{label}</button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48 text-slate-400">Memuat data...</div>
        ) : (
          <>
            {tab === 'orders' && (
              <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-slate-700 text-slate-400">
                    <th className="text-left p-4">No. MO</th>
                    <th className="text-left p-4">Produk</th>
                    <th className="text-left p-4">Qty</th>
                    <th className="text-left p-4">Jadwal</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Aksi</th>
                  </tr></thead>
                  <tbody>
                    {orders.map(o => {
                      const st = MO_STATUS[o.status as keyof typeof MO_STATUS] ?? MO_STATUS.draft;
                      return (
                        <tr key={o.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                          <td className="p-4 font-mono text-xs text-slate-300">{o.noMo}</td>
                          <td className="p-4 text-white">{o.productId}</td>
                          <td className="p-4 text-white">{Number(o.qty).toLocaleString('id-ID')} {o.qtyProduced > 0 && <span className="text-slate-400 text-xs">({Number(o.qtyProduced)} done)</span>}</td>
                          <td className="p-4 text-slate-400 text-xs">{new Date(o.scheduledDate).toLocaleDateString('id-ID')}</td>
                          <td className="p-4"><span className={`text-xs px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span></td>
                          <td className="p-4 flex gap-1">
                            {o.status === 'draft' && <button onClick={() => changeStatus(o.id, 'confirm')} className="text-xs bg-blue-600/30 text-blue-300 px-2 py-1 rounded hover:bg-blue-600/50">Konfirmasi</button>}
                            {o.status === 'confirmed' && <button onClick={() => changeStatus(o.id, 'start')} className="text-xs bg-yellow-600/30 text-yellow-300 px-2 py-1 rounded hover:bg-yellow-600/50">Mulai</button>}
                            {o.status === 'in_progress' && <button onClick={() => changeStatus(o.id, 'complete')} className="text-xs bg-emerald-600/30 text-emerald-300 px-2 py-1 rounded hover:bg-emerald-600/50">Selesai</button>}
                          </td>
                        </tr>
                      );
                    })}
                    {orders.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-slate-500">Belum ada manufacturing order</td></tr>}
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'bom' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {boms.map(b => (
                  <div key={b.id} className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-white font-medium">{b.reference ?? b.productId}</p>
                      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{b.type}</span>
                    </div>
                    <p className="text-slate-400 text-sm">Qty: {Number(b.qty)}</p>
                    <p className="text-slate-500 text-xs mt-2">{b.components?.length ?? 0} komponen</p>
                  </div>
                ))}
                {boms.length === 0 && <p className="text-slate-500 text-center py-10 col-span-3">Belum ada Bill of Materials</p>}
              </div>
            )}

            {tab === 'workcenters' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workCenters.map(wc => (
                  <div key={wc.id} className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                    <p className="text-white font-medium">{wc.name}</p>
                    <p className="text-slate-500 text-xs font-mono mt-0.5">{wc.code}</p>
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-sm"><span className="text-slate-400">Kapasitas</span><span className="text-white">{Number(wc.capacity)}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-slate-400">Efisiensi</span><span className="text-emerald-400">{Number(wc.timeEff)}%</span></div>
                    </div>
                  </div>
                ))}
                {workCenters.length === 0 && <p className="text-slate-500 text-center py-10 col-span-3">Belum ada work center</p>}
              </div>
            )}
          </>
        )}

        {showMoForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700">
              <div className="p-5 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-white font-semibold">Buat Manufacturing Order</h2>
                <button onClick={() => setShowMoForm(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleCreateMo} className="p-5 space-y-3">
                <div><label className="text-slate-400 text-xs mb-1 block">ID Produk *</label><input required value={moForm.productId} onChange={e => setMoForm(f => ({ ...f, productId: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-slate-400 text-xs mb-1 block">Qty *</label><input required type="number" min="0.1" step="0.1" value={moForm.qty} onChange={e => setMoForm(f => ({ ...f, qty: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                  <div><label className="text-slate-400 text-xs mb-1 block">Jadwal *</label><input required type="date" value={moForm.scheduledDate} onChange={e => setMoForm(f => ({ ...f, scheduledDate: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowMoForm(false)} className="flex-1 bg-slate-700 text-white py-2 rounded-lg text-sm">Batal</button>
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium">Buat</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showBomForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700">
              <div className="p-5 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-white font-semibold">Buat Bill of Materials</h2>
                <button onClick={() => setShowBomForm(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleCreateBom} className="p-5 space-y-3">
                <div><label className="text-slate-400 text-xs mb-1 block">ID Produk *</label><input required value={bomForm.productId} onChange={e => setBomForm(f => ({ ...f, productId: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-slate-400 text-xs mb-1 block">Qty</label><input type="number" value={bomForm.qty} onChange={e => setBomForm(f => ({ ...f, qty: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">Tipe</label>
                    <select value={bomForm.type} onChange={e => setBomForm(f => ({ ...f, type: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                      <option value="manufacture">Manufacture</option><option value="phantom">Phantom</option><option value="subcontract">Subcontract</option>
                    </select>
                  </div>
                </div>
                <div><label className="text-slate-400 text-xs mb-1 block">Referensi</label><input value={bomForm.reference} onChange={e => setBomForm(f => ({ ...f, reference: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowBomForm(false)} className="flex-1 bg-slate-700 text-white py-2 rounded-lg text-sm">Batal</button>
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium">Buat</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showWcForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700">
              <div className="p-5 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-white font-semibold">Tambah Work Center</h2>
                <button onClick={() => setShowWcForm(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleCreateWc} className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2"><label className="text-slate-400 text-xs mb-1 block">Nama *</label><input required value={wcForm.name} onChange={e => setWcForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                  <div><label className="text-slate-400 text-xs mb-1 block">Kode *</label><input required value={wcForm.code} onChange={e => setWcForm(f => ({ ...f, code: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                  <div><label className="text-slate-400 text-xs mb-1 block">Kapasitas</label><input type="number" value={wcForm.capacity} onChange={e => setWcForm(f => ({ ...f, capacity: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                  <div><label className="text-slate-400 text-xs mb-1 block">Efisiensi (%)</label><input type="number" value={wcForm.timeEff} onChange={e => setWcForm(f => ({ ...f, timeEff: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowWcForm(false)} className="flex-1 bg-slate-700 text-white py-2 rounded-lg text-sm">Batal</button>
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
