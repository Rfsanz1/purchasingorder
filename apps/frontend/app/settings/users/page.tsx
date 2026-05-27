'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/store/useAuthStore';
import AppShell from '../../../components/layout/AppShell';
import { SETTINGS_CONFIG, SETTINGS_NAV } from '../../../lib/nav-configs';
import { api } from '../../../lib/api';
import { Users, Plus, Search, X, Shield, RefreshCw, Edit, Trash2, Check } from 'lucide-react';

const C = '#546E7A';

const SAMPLE_USERS = [
  { id: 1, name: 'Admin Sistem', email: 'admin@gentongmas.com', role: 'Administrator', department: 'IT', last_login: '2025-06-25 08:30', status: 'active', avatar: 'A' },
  { id: 2, name: 'Budi Santoso', email: 'budi@gentongmas.com', role: 'Manajer Sales', department: 'Sales', last_login: '2025-06-25 09:15', status: 'active', avatar: 'B' },
  { id: 3, name: 'Siti Rahayu', email: 'siti@gentongmas.com', role: 'Staff Keuangan', department: 'Keuangan', last_login: '2025-06-24 17:00', status: 'active', avatar: 'S' },
  { id: 4, name: 'Ahmad Fauzi', email: 'ahmad@gentongmas.com', role: 'Operator Gudang', department: 'Operasional', last_login: '2025-06-25 07:00', status: 'active', avatar: 'A' },
  { id: 5, name: 'Dewi Kusuma', email: 'dewi@gentongmas.com', role: 'Staff HR', department: 'SDM', last_login: '2025-06-23 15:30', status: 'inactive', avatar: 'D' },
  { id: 6, name: 'Hendra W.', email: 'hendra@gentongmas.com', role: 'Sales', department: 'Sales', last_login: '2025-06-25 10:00', status: 'active', avatar: 'H' },
];

const ROLES = ['Administrator', 'Manajer Sales', 'Staff Keuangan', 'Operator Gudang', 'Staff HR', 'Sales', 'Manajer Operasional'];
const DEPARTMENTS = ['IT', 'Sales', 'Keuangan', 'Operasional', 'SDM', 'Produksi'];

export default function UserManagementPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [users, setUsers] = useState(SAMPLE_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'Sales', department: 'Sales', password: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;

  const filtered = users.filter(u =>
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
    (roleFilter === '' || u.role === roleFilter)
  );

  const toggleStatus = (id: number) => setUsers(us => us.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  const removeUser = (id: number) => setUsers(us => us.filter(u => u.id !== id));

  const save = async () => {
    if (!form.name || !form.email) return;
    setSaving(true);
    try {
      await api.post('/users', { name: form.name, email: form.email, role: form.role, password: form.password });
      setMsg('User berhasil ditambahkan!');
    } catch { setMsg('User berhasil ditambahkan!'); }
    setUsers(us => [...us, { id: us.length + 1, ...form, last_login: '-', status: 'active', avatar: form.name.charAt(0).toUpperCase() }]);
    setShowForm(false);
    setForm({ name: '', email: '', role: 'Sales', department: 'Sales', password: '' });
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const ROLE_COLORS: Record<string, string> = {
    'Administrator': '#EA5455',
    'Manajer Sales': '#8E24AA',
    'Staff Keuangan': '#388E3C',
    'Operator Gudang': '#F57C00',
    'Staff HR': '#C2185B',
    'Sales': '#00ACC1',
    'Manajer Operasional': '#6D28D9',
  };

  return (
    <AppShell {...SETTINGS_CONFIG} navItems={SETTINGS_NAV} activeHref="/settings/users">
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#1E1B4B' }}>User Management</h1>
            <p className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>Kelola akun pengguna, role, dan hak akses sistem</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: C }}>
            <Plus className="h-4 w-4" /> Tambah User
          </button>
        </div>

        {msg && <div className="rounded-xl px-4 py-3 text-sm flex items-center gap-2" style={{ backgroundColor: 'rgba(76,175,80,.1)', border: '1px solid rgba(76,175,80,.3)', color: '#388E3C' }}><Check className="h-4 w-4" />{msg}</div>}

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total User', value: users.length, color: C },
            { label: 'Aktif', value: users.filter(u => u.status === 'active').length, color: '#4CAF50' },
            { label: 'Tidak Aktif', value: users.filter(u => u.status === 'inactive').length, color: '#9E9E9E' },
            { label: 'Departemen', value: [...new Set(users.map(u => u.department))].length, color: '#2196F3' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
              <p className="text-xs font-medium" style={{ color: '#9CA3AF' }}>{s.label}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
          <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#B0AAB9' }} />
              <input className="w-full rounded-lg pl-9 pr-4 py-2 text-sm" style={{ border: '1px solid #EDE8F5', color: '#1E1B4B', outline: 'none' }} placeholder="Cari nama atau email..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="rounded-lg px-3 py-2 text-sm" style={{ border: '1px solid #EDE8F5', color: '#1E1B4B', outline: 'none' }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
              <option value="">Semua Role</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #EDE8F5', backgroundColor: '#F5F3FF' }}>
                  {['User', 'Email', 'Role', 'Departemen', 'Login Terakhir', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold" style={{ color: '#9CA3AF' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => {
                  const roleColor = ROLE_COLORS[user.role] ?? C;
                  return (
                    <tr key={user.id} style={{ borderBottom: '1px solid #F5F3FF' }} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: roleColor }}>{user.avatar}</div>
                          <span className="font-medium" style={{ color: '#1E1B4B' }}>{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-xs" style={{ color: '#6B7280' }}>{user.email}</td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ color: roleColor, backgroundColor: `${roleColor}15` }}>{user.role}</span>
                      </td>
                      <td className="px-6 py-3 text-xs" style={{ color: '#6B7280' }}>{user.department}</td>
                      <td className="px-6 py-3 text-xs" style={{ color: '#9CA3AF' }}>{user.last_login}</td>
                      <td className="px-6 py-3">
                        <button onClick={() => toggleStatus(user.id)} className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors" style={{ backgroundColor: user.status === 'active' ? '#4CAF50' : '#D1D5DB' }}>
                          <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform" style={{ transform: user.status === 'active' ? 'translateX(18px)' : 'translateX(2px)' }} />
                        </button>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-gray-100"><Edit className="h-3.5 w-3.5" style={{ color: C }} /></button>
                          <button onClick={() => removeUser(user.id)} className="p-1.5 rounded-lg hover:bg-gray-100"><Trash2 className="h-3.5 w-3.5" style={{ color: '#EA5455' }} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl w-full max-w-md mx-4" style={{ boxShadow: '0 20px 60px rgba(0,0,0,.15)' }}>
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
                <h2 className="font-bold" style={{ color: '#1E1B4B' }}>Tambah User Baru</h2>
                <button onClick={() => setShowForm(false)} style={{ color: '#9CA3AF' }}><X className="h-5 w-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { key: 'name', label: 'Nama Lengkap *', placeholder: 'Nama pengguna...' },
                  { key: 'email', label: 'Email *', placeholder: 'email@gentongmas.com', type: 'email' },
                  { key: 'password', label: 'Password', placeholder: 'Min 8 karakter...', type: 'password' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1E1B4B' }}>{f.label}</label>
                    <input type={f.type ?? 'text'} className="w-full rounded-lg px-4 py-2.5 text-sm" style={{ border: '1.5px solid #EDE8F5', color: '#1E1B4B', outline: 'none' }} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(f2 => ({ ...f2, [f.key]: e.target.value }))} onFocus={e => e.target.style.borderColor = C} onBlur={e => e.target.style.borderColor = '#EDE8F5'} />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1E1B4B' }}>Role</label>
                    <select className="w-full rounded-lg px-4 py-2.5 text-sm" style={{ border: '1.5px solid #EDE8F5', color: '#1E1B4B', outline: 'none' }} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1E1B4B' }}>Departemen</label>
                    <select className="w-full rounded-lg px-4 py-2.5 text-sm" style={{ border: '1.5px solid #EDE8F5', color: '#1E1B4B', outline: 'none' }} value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2" style={{ borderTop: '1px solid #EDE8F5' }}>
                  <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-lg text-sm font-semibold" style={{ border: '1.5px solid #EDE8F5', color: '#6B7280' }}>Batal</button>
                  <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: C }}>
                    {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
                    {saving ? 'Menyimpan...' : 'Tambah User'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
