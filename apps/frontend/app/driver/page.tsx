'use client';
import { useEffect, useState } from 'react';
import { ModernLayout } from '../../components/layout/ModernLayout';
import { api } from '../../lib/api';
import { Truck, MapPin, CheckCircle, Clock } from 'lucide-react';

export default function DriverPage() {
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/driver-areas').then(r => setAreas(r.data ?? [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <ModernLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div><h1 className="text-2xl font-bold text-white flex items-center gap-2"><Truck className="h-6 w-6 text-indigo-400" /> Dashboard Driver</h1><p className="text-slate-400 mt-1">Kelola wilayah pengiriman & driver</p></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5"><MapPin className="h-6 w-6 text-indigo-400 mb-3" /><p className="text-xs text-slate-500">Wilayah Aktif</p><p className="text-3xl font-bold text-white mt-1">{areas.length}</p></div>
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5"><Truck className="h-6 w-6 text-emerald-400 mb-3" /><p className="text-xs text-slate-500">Pengiriman Aktif</p><p className="text-3xl font-bold text-emerald-400 mt-1">0</p></div>
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5"><CheckCircle className="h-6 w-6 text-blue-400 mb-3" /><p className="text-xs text-slate-500">Selesai Hari Ini</p><p className="text-3xl font-bold text-blue-400 mt-1">0</p></div>
        </div>
        <div className="rounded-2xl bg-slate-900 border border-slate-800">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-white flex items-center gap-2"><MapPin className="h-4 w-4 text-indigo-400" /> Wilayah Pengiriman</h3>
          </div>
          {loading ? <p className="p-6 text-slate-500 text-sm">Memuat...</p> : areas.length === 0 ? (
            <p className="p-6 text-slate-500 text-sm">Belum ada wilayah</p>
          ) : (
            <div className="divide-y divide-slate-800">
              {areas.map((a: any) => (
                <div key={a.id} className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition">
                  <div><p className="font-medium text-white">{a.wilayah}</p><p className="text-xs text-slate-500 mt-0.5">{a.driver || 'Driver belum ditugaskan'}</p></div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span className="text-xs text-slate-400">{a.jadwal || '-'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ModernLayout>
  );
}
