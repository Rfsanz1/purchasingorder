'use client';
import { useEffect, useState } from 'react';
import { ModernLayout } from '../../components/layout/ModernLayout';
import { api } from '../../lib/api';
import { Settings, Save, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    setLoading(true);
    try { const r = await api.get('/settings'); setSettings(r.data); } catch {} finally { setLoading(false); }
  };

  const save = async () => {
    setSaving(true);
    try { await api.put('/settings', settings); setMsg('Pengaturan disimpan!'); setTimeout(() => setMsg(''), 3000); } catch { setMsg('Gagal menyimpan.'); }
    finally { setSaving(false); }
  };

  useEffect(() => { load(); }, []);

  const fields = [
    { key: 'company_name', label: 'Nama Perusahaan' },
    { key: 'company_address', label: 'Alamat' },
    { key: 'company_phone', label: 'Telepon' },
    { key: 'company_email', label: 'Email' },
    { key: 'company_npwp', label: 'NPWP' },
    { key: 'kledo_token', label: 'Kledo Token' },
    { key: 'fonnte_token', label: 'Fonnte Token (WhatsApp)' },
    { key: 'toko_online_url', label: 'URL Toko Online' },
  ];

  return (
    <ModernLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-white flex items-center gap-2"><Settings className="h-6 w-6 text-slate-400" /> Pengaturan Sistem</h1><p className="text-slate-400 mt-1">Konfigurasi perusahaan dan integrasi</p></div>
          <button onClick={load} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition text-slate-400"><RefreshCw className="h-4 w-4" /></button>
        </div>
        {msg && <div className="rounded-xl bg-emerald-900/50 border border-emerald-700 px-4 py-3 text-sm text-emerald-300">{msg}</div>}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          {loading ? <p className="text-slate-500 text-sm">Memuat...</p> : fields.map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">{f.label}</label>
              <input
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                value={settings[f.key] || ''}
                onChange={e => setSettings(s => ({ ...s, [f.key]: e.target.value }))}
                placeholder={`Masukkan ${f.label.toLowerCase()}...`}
              />
            </div>
          ))}
          <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 px-5 py-2.5 text-sm font-medium text-white transition mt-2">
            <Save className="h-4 w-4" /> {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </div>
    </ModernLayout>
  );
}
