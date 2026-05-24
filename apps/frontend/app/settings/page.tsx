'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import AppShell from '../../components/layout/AppShell';
import { SETTINGS_CONFIG, SETTINGS_NAV } from '../../lib/nav-configs';
import { api } from '../../lib/api';
import { Settings, Save, RefreshCw } from 'lucide-react';

const FIELDS = [
  { key: 'company_name',    label: 'Nama Perusahaan' },
  { key: 'company_address', label: 'Alamat Perusahaan' },
  { key: 'company_phone',   label: 'Telepon' },
  { key: 'company_email',   label: 'Email Perusahaan' },
  { key: 'company_npwp',    label: 'NPWP' },
  { key: 'kledo_token',     label: 'Kledo Token' },
  { key: 'fonnte_token',    label: 'Fonnte Token (WhatsApp)' },
  { key: 'toko_online_url', label: 'URL Toko Online' },
];

export default function SettingsPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { if (!token) router.push('/login'); }, [token]);

  const load = async () => {
    setLoading(true);
    try { const r = await api.get('/settings'); setSettings(r.data); } catch {} finally { setLoading(false); }
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/settings', settings);
      setMsg('Pengaturan berhasil disimpan!');
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('Gagal menyimpan pengaturan.'); }
    finally { setSaving(false); }
  };

  useEffect(() => { if (token) load(); }, [token]);
  if (!token) return null;

  return (
    <AppShell {...SETTINGS_CONFIG} navItems={SETTINGS_NAV} activeHref="/settings">
      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#433C50' }}>Pengaturan Sistem</h1>
            <p className="text-sm mt-0.5" style={{ color: '#A5A3AE' }}>Konfigurasi perusahaan dan integrasi</p>
          </div>
          <button onClick={load} className="p-2 rounded-lg transition" style={{ border: '1px solid #EDE8F5', color: '#A5A3AE' }}>
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {msg && (
          <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(76,175,80,.1)', border: '1px solid rgba(76,175,80,.3)', color: '#388E3C' }}>{msg}</div>
        )}

        <div className="bg-white rounded-2xl p-6 space-y-4" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
          {loading ? (
            <p className="text-sm" style={{ color: '#A5A3AE' }}>Memuat pengaturan...</p>
          ) : FIELDS.map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#433C50' }}>{f.label}</label>
              <input
                className="w-full rounded-lg px-4 py-2.5 text-sm transition"
                style={{ border: '1.5px solid #EDE8F5', color: '#433C50', outline: 'none' }}
                value={settings[f.key] || ''}
                onChange={e => setSettings(s => ({ ...s, [f.key]: e.target.value }))}
                placeholder={`Masukkan ${f.label.toLowerCase()}...`}
                onFocus={(e) => { e.target.style.borderColor = SETTINGS_CONFIG.appColor; }}
                onBlur={(e) => { e.target.style.borderColor = '#EDE8F5'; }}
              />
            </div>
          ))}
          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition mt-2" style={{ backgroundColor: SETTINGS_CONFIG.appColor }}>
            <Save className="h-4 w-4" /> {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
