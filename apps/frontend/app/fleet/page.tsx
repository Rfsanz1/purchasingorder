'use client';

import { useState, useEffect } from 'react';
import ModernLayout from '@/components/layout/ModernLayout';
import api from '@/lib/api';

const FUEL_TYPES = ['bensin', 'solar', 'listrik', 'hybrid', 'lpg'];

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [tab, setTab] = useState<'vehicles' | 'services'>('vehicles');
  const [loading, setLoading] = useState(true);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [vForm, setVForm] = useState({ licensePlate: '', brand: '', model: '', year: '', fuelType: 'bensin', currentOdometer: '0' });
  const [sForm, setSForm] = useState({ vehicleId: '', type: 'service rutin', vendor: '', date: new Date().toISOString().split('T')[0], odometer: '', cost: '0', notes: '', nextService: '' });

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [vRes, sRes, statsRes] = await Promise.all([
        api.get('/fleet/vehicles'),
        api.get('/fleet/services'),
        api.get('/fleet/stats'),
      ]);
      setVehicles(vRes.data ?? []);
      setServices(sRes.data.data ?? []);
      setStats(statsRes.data);
    } catch { } finally { setLoading(false); }
  }

  async function handleCreateVehicle(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post('/fleet/vehicles', { ...vForm, year: parseInt(vForm.year) || null, currentOdometer: parseFloat(vForm.currentOdometer) });
      setShowVehicleForm(false);
      setVForm({ licensePlate: '', brand: '', model: '', year: '', fuelType: 'bensin', currentOdometer: '0' });
      fetchAll();
    } catch { }
  }

  async function handleCreateService(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post('/fleet/services', { ...sForm, cost: parseFloat(sForm.cost), odometer: sForm.odometer ? parseFloat(sForm.odometer) : null });
      setShowServiceForm(false);
      setSForm({ vehicleId: '', type: 'service rutin', vendor: '', date: new Date().toISOString().split('T')[0], odometer: '', cost: '0', notes: '', nextService: '' });
      fetchAll();
    } catch { }
  }

  const fmt = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  return (
    <ModernLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Fleet — Manajemen Kendaraan</h1>
            <p className="text-slate-400 text-sm mt-1">Kelola armada & riwayat servis kendaraan</p>
          </div>
          <div className="flex gap-2">
            {tab === 'vehicles' && <button onClick={() => setShowVehicleForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Kendaraan</button>}
            {tab === 'services' && <button onClick={() => setShowServiceForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Riwayat Servis</button>}
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700"><p className="text-slate-400 text-sm">Total Kendaraan</p><p className="text-2xl font-bold text-white mt-1">{stats.total}</p></div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700"><p className="text-slate-400 text-sm">Aktif</p><p className="text-2xl font-bold text-emerald-400 mt-1">{stats.active}</p></div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700"><p className="text-slate-400 text-sm">Perlu Servis</p><p className="text-2xl font-bold text-yellow-400 mt-1">{stats.needService}</p></div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700"><p className="text-slate-400 text-sm">Total Biaya Servis</p><p className="text-lg font-bold text-blue-400 mt-1">{fmt(Number(stats.totalServiceCost))}</p></div>
          </div>
        )}

        <div className="flex gap-1 bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-700">
          {([['vehicles', 'Kendaraan'], ['services', 'Riwayat Servis']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === key ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>{label}</button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48 text-slate-400">Memuat data...</div>
        ) : tab === 'vehicles' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map(v => (
              <div key={v.id} className="bg-slate-800 rounded-xl border border-slate-700 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-bold text-lg">{v.licensePlate}</p>
                    <p className="text-slate-400 text-sm">{v.brand} {v.model} {v.year ? `(${v.year})` : ''}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${v.active ? 'bg-emerald-600/30 text-emerald-300' : 'bg-slate-600 text-slate-400'}`}>{v.active ? 'Aktif' : 'Nonaktif'}</span>
                </div>
                <div className="space-y-1 text-sm border-t border-slate-700 pt-3">
                  <div className="flex justify-between"><span className="text-slate-400">Bahan Bakar</span><span className="text-white capitalize">{v.fuelType}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Odometer</span><span className="text-white">{Number(v.currentOdometer).toLocaleString('id-ID')} km</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Total Servis</span><span className="text-slate-300">{v._count?.services ?? 0}x</span></div>
                </div>
              </div>
            ))}
            {vehicles.length === 0 && <p className="text-slate-500 text-center py-10 col-span-3">Belum ada kendaraan terdaftar</p>}
          </div>
        ) : (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-700 text-slate-400">
                <th className="text-left p-4">Kendaraan</th><th className="text-left p-4">Tipe Servis</th>
                <th className="text-left p-4">Tanggal</th><th className="text-left p-4 hidden md:table-cell">Vendor</th>
                <th className="text-left p-4">Biaya</th><th className="text-left p-4">Servis Berikutnya</th>
              </tr></thead>
              <tbody>
                {services.map(s => (
                  <tr key={s.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="p-4"><p className="text-white font-medium">{s.vehicle?.licensePlate ?? '—'}</p><p className="text-slate-400 text-xs">{s.vehicle?.brand} {s.vehicle?.model}</p></td>
                    <td className="p-4 text-slate-300 capitalize">{s.type}</td>
                    <td className="p-4 text-slate-400 text-xs">{new Date(s.date).toLocaleDateString('id-ID')}</td>
                    <td className="p-4 text-slate-400 hidden md:table-cell">{s.vendor ?? '—'}</td>
                    <td className="p-4 text-white font-medium">{fmt(Number(s.cost))}</td>
                    <td className="p-4 text-slate-400 text-xs">{s.nextService ? new Date(s.nextService).toLocaleDateString('id-ID') : '—'}</td>
                  </tr>
                ))}
                {services.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-slate-500">Belum ada riwayat servis</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {showVehicleForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700">
              <div className="p-5 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-white font-semibold">Tambah Kendaraan</h2>
                <button onClick={() => setShowVehicleForm(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleCreateVehicle} className="p-5 space-y-3">
                <div><label className="text-slate-400 text-xs mb-1 block">Plat Nomor *</label><input required value={vForm.licensePlate} onChange={e => setVForm(f => ({ ...f, licensePlate: e.target.value.toUpperCase() }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm uppercase" placeholder="B 1234 XYZ" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-slate-400 text-xs mb-1 block">Merk *</label><input required value={vForm.brand} onChange={e => setVForm(f => ({ ...f, brand: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" placeholder="Toyota" /></div>
                  <div><label className="text-slate-400 text-xs mb-1 block">Model *</label><input required value={vForm.model} onChange={e => setVForm(f => ({ ...f, model: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" placeholder="Avanza" /></div>
                  <div><label className="text-slate-400 text-xs mb-1 block">Tahun</label><input type="number" value={vForm.year} onChange={e => setVForm(f => ({ ...f, year: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" placeholder="2022" /></div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">Bahan Bakar</label>
                    <select value={vForm.fuelType} onChange={e => setVForm(f => ({ ...f, fuelType: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                      {FUEL_TYPES.map(ft => <option key={ft} value={ft} className="capitalize">{ft}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2"><label className="text-slate-400 text-xs mb-1 block">Odometer Awal (km)</label><input type="number" value={vForm.currentOdometer} onChange={e => setVForm(f => ({ ...f, currentOdometer: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowVehicleForm(false)} className="flex-1 bg-slate-700 text-white py-2 rounded-lg text-sm">Batal</button>
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showServiceForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700">
              <div className="p-5 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-white font-semibold">Tambah Riwayat Servis</h2>
                <button onClick={() => setShowServiceForm(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleCreateService} className="p-5 space-y-3">
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">Kendaraan *</label>
                  <select required value={sForm.vehicleId} onChange={e => setSForm(f => ({ ...f, vehicleId: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                    <option value="">-- Pilih Kendaraan --</option>
                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.licensePlate} — {v.brand} {v.model}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">Tipe Servis</label>
                    <select value={sForm.type} onChange={e => setSForm(f => ({ ...f, type: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                      <option value="service rutin">Service Rutin</option>
                      <option value="perbaikan">Perbaikan</option>
                      <option value="asuransi">Asuransi</option>
                      <option value="pajak">Pajak</option>
                    </select>
                  </div>
                  <div><label className="text-slate-400 text-xs mb-1 block">Tanggal *</label><input required type="date" value={sForm.date} onChange={e => setSForm(f => ({ ...f, date: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                  <div><label className="text-slate-400 text-xs mb-1 block">Vendor</label><input value={sForm.vendor} onChange={e => setSForm(f => ({ ...f, vendor: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                  <div><label className="text-slate-400 text-xs mb-1 block">Odometer (km)</label><input type="number" value={sForm.odometer} onChange={e => setSForm(f => ({ ...f, odometer: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                  <div><label className="text-slate-400 text-xs mb-1 block">Biaya (Rp) *</label><input required type="number" value={sForm.cost} onChange={e => setSForm(f => ({ ...f, cost: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                  <div><label className="text-slate-400 text-xs mb-1 block">Servis Berikutnya</label><input type="date" value={sForm.nextService} onChange={e => setSForm(f => ({ ...f, nextService: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                </div>
                <div><label className="text-slate-400 text-xs mb-1 block">Catatan</label><textarea value={sForm.notes} onChange={e => setSForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none" /></div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowServiceForm(false)} className="flex-1 bg-slate-700 text-white py-2 rounded-lg text-sm">Batal</button>
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
