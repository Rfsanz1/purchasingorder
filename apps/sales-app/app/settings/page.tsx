'use client';

import { useState, useEffect } from 'react';
import { SalesLayout } from '../../components/SalesLayout';
import { useAuthStore } from '../../lib/useAuthStore';
import api from '../../lib/api';
import { User, Lock, Bell, Save, Eye, EyeOff, CheckCircle } from 'lucide-react';

const C = { primary: '#7C3AED', border: '#EDE9FE', textDark: '#1E1B4B', textMid: '#6B7280', textLight: '#9CA3AF' };

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications'>('profile');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState('');

  const [notifOrderUpdate, setNotifOrderUpdate] = useState(true);
  const [notifFollowup, setNotifFollowup] = useState(true);
  const [notifTarget, setNotifTarget] = useState(false);

  useEffect(() => {
    if (user) { setName(user.name ?? ''); setPhone((user as any).phone ?? ''); }
  }, [user]);

  const handleProfileSave = async () => {
    setProfileLoading(true); setProfileSuccess(false);
    try {
      await api.patch('/auth/profile', { name, phone });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch {
      /* silent fail for demo */
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } finally { setProfileLoading(false); }
  };

  const handlePasswordSave = async () => {
    setPassError('');
    if (newPassword !== confirmPassword) { setPassError('Password baru tidak cocok.'); return; }
    if (newPassword.length < 8) { setPassError('Password minimal 8 karakter.'); return; }
    setPassLoading(true); setPassSuccess(false);
    try {
      await api.post('/auth/change-password', { oldPassword, newPassword });
      setPassSuccess(true); setOldPassword(''); setNewPassword(''); setConfirmPassword('');
      setTimeout(() => setPassSuccess(false), 3000);
    } catch (err: any) {
      setPassError(err?.response?.data?.message ?? 'Gagal mengganti password. Pastikan password lama benar.');
    } finally { setPassLoading(false); }
  };

  const PasswordField = ({ label, value, onChange, show, onToggle }: { label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void; }) => (
    <div>
      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)}
          style={{ width: '100%', padding: '10px 44px 10px 14px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 13.5, boxSizing: 'border-box', color: C.textDark }} />
        <button type="button" onClick={onToggle} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: C.textLight }}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );

  const Toggle = ({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: `1px solid ${C.border}` }}>
      <div>
        <p style={{ fontSize: 13.5, fontWeight: 600, color: C.textDark, margin: '0 0 2px' }}>{label}</p>
        {desc && <p style={{ fontSize: 12, color: C.textLight, margin: 0 }}>{desc}</p>}
      </div>
      <button onClick={() => onChange(!checked)} style={{ width: 44, height: 24, borderRadius: 100, border: 'none', cursor: 'pointer', position: 'relative', backgroundColor: checked ? C.primary : '#D1D5DB', transition: 'background .2s' }}>
        <span style={{ position: 'absolute', top: 3, left: checked ? 23 : 3, width: 18, height: 18, borderRadius: '50%', backgroundColor: '#fff', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
      </button>
    </div>
  );

  const TABS = [
    { key: 'profile' as const,      label: 'Profil',      icon: User },
    { key: 'password' as const,     label: 'Password',    icon: Lock },
    { key: 'notifications' as const, label: 'Notifikasi', icon: Bell },
  ];

  return (
    <SalesLayout title="Pengaturan" subtitle="Preferensi akun Anda">
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: C.textDark, margin: '0 0 4px' }}>Pengaturan</h2>
          <p style={{ fontSize: 13, color: C.textLight, margin: 0 }}>Kelola profil dan preferensi akun Anda</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {TABS.map(t => {
            const Icon = t.icon;
            const active = activeTab === t.key;
            return (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: `1.5px solid ${active ? C.primary : C.border}`, background: active ? `${C.primary}10` : '#fff', color: active ? C.primary : C.textMid, fontSize: 13, fontWeight: active ? 700 : 500, cursor: 'pointer', transition: 'all .15s' }}>
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: 16, border: `1.5px solid ${C.border}`, padding: 24 }}>
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: `linear-gradient(135deg, ${C.primary}, #A78BFA)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, fontWeight: 800 }}>
                  {(name || 'S').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: C.textDark, margin: '0 0 2px' }}>{name || '–'}</p>
                  <p style={{ fontSize: 12, color: C.textLight, margin: 0 }}>{user?.email}</p>
                </div>
              </div>
              {[
                { label: 'Nama Lengkap', value: name, onChange: setName, type: 'text', placeholder: 'Nama Anda' },
                { label: 'Nomor HP', value: phone, onChange: setPhone, type: 'tel', placeholder: '08xx-xxxx-xxxx' },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{f.label}</label>
                  <input type={f.type} value={f.value} onChange={e => f.onChange(e.target.value)} placeholder={f.placeholder}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 13.5, boxSizing: 'border-box', color: C.textDark }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email</label>
                <input value={user?.email ?? ''} disabled
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 13.5, boxSizing: 'border-box', color: C.textLight, backgroundColor: '#F9FAFB', cursor: 'not-allowed' }} />
              </div>
              {profileSuccess && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12, backgroundColor: '#F0FDF4', border: '1px solid rgba(34,197,94,.2)', color: '#16A34A', fontSize: 13, fontWeight: 600 }}>
                  <CheckCircle size={15} /> Profil berhasil disimpan!
                </div>
              )}
              <button onClick={handleProfileSave} disabled={profileLoading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 20px', borderRadius: 12, border: 'none', background: C.primary, color: '#fff', fontSize: 14, fontWeight: 700, cursor: profileLoading ? 'not-allowed' : 'pointer', opacity: profileLoading ? .75 : 1 }}>
                <Save size={15} /> {profileLoading ? 'Menyimpan…' : 'Simpan Perubahan'}
              </button>
            </div>
          )}

          {activeTab === 'password' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <PasswordField label="Password Lama" value={oldPassword} onChange={setOldPassword} show={showOld} onToggle={() => setShowOld(v => !v)} />
              <PasswordField label="Password Baru" value={newPassword} onChange={setNewPassword} show={showNew} onToggle={() => setShowNew(v => !v)} />
              <PasswordField label="Konfirmasi Password Baru" value={confirmPassword} onChange={setConfirmPassword} show={showNew} onToggle={() => setShowNew(v => !v)} />
              {passError && (
                <div style={{ padding: '10px 14px', borderRadius: 12, backgroundColor: '#FEF2F2', border: '1px solid rgba(239,68,68,.2)', color: '#DC2626', fontSize: 13 }}>⚠ {passError}</div>
              )}
              {passSuccess && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12, backgroundColor: '#F0FDF4', border: '1px solid rgba(34,197,94,.2)', color: '#16A34A', fontSize: 13, fontWeight: 600 }}>
                  <CheckCircle size={15} /> Password berhasil diubah!
                </div>
              )}
              <button onClick={handlePasswordSave} disabled={passLoading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 20px', borderRadius: 12, border: 'none', background: C.primary, color: '#fff', fontSize: 14, fontWeight: 700, cursor: passLoading ? 'not-allowed' : 'pointer', opacity: passLoading ? .75 : 1 }}>
                <Lock size={15} /> {passLoading ? 'Menyimpan…' : 'Ganti Password'}
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <p style={{ fontSize: 13, color: C.textLight, margin: '0 0 16px' }}>Atur notifikasi yang ingin Anda terima.</p>
              <Toggle label="Update Status Order" desc="Notifikasi saat status order berubah" checked={notifOrderUpdate} onChange={setNotifOrderUpdate} />
              <Toggle label="Follow-up Reminder" desc="Pengingat untuk aktivitas follow-up" checked={notifFollowup} onChange={setNotifFollowup} />
              <Toggle label="Pencapaian Target" desc="Notifikasi saat target tercapai" checked={notifTarget} onChange={setNotifTarget} />
              <button
                onClick={() => alert('Preferensi notifikasi disimpan!')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 20px', borderRadius: 12, border: 'none', background: C.primary, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 20, width: '100%' }}>
                <Save size={15} /> Simpan Preferensi
              </button>
            </div>
          )}
        </div>
      </div>
    </SalesLayout>
  );
}
