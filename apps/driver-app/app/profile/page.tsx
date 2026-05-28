'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/useAuthStore';
import api from '../../lib/api';
import BottomNav from '../../components/BottomNav';
import { User, Phone, Truck, Lock, Edit2, LogOut, Save, X, ChevronRight } from 'lucide-react';

const C = '#475569';

interface Profile {
  name: string; email: string; phone: string; vehicle: string; vehiclePlate: string; photo?: string;
}

export default function ProfilePage() {
  const { token, user, logout } = useAuthStore();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({
    name: user?.name ?? 'Driver',
    email: user?.email ?? '',
    phone: '0812-3456-7890',
    vehicle: 'Motor',
    vehiclePlate: 'B 1234 XYZ',
  });
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Profile>(profile);
  const [showPassModal, setShowPassModal] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) { router.replace('/login'); return; }
    api.get('/auth/me').then(r => {
      if (r.data) {
        const p: Profile = { name:r.data.name??'Driver', email:r.data.email??'', phone:r.data.phone??'', vehicle:r.data.vehicle??'Motor', vehiclePlate:r.data.vehiclePlate??'' };
        setProfile(p); setEditData(p);
      }
    }).catch(() => {});
  }, [token]);

  const handleLogout = () => { logout(); router.replace('/login'); };

  const saveProfile = async () => {
    setSaving(true);
    try { await api.patch('/auth/profile', editData); } catch {}
    setProfile(editData);
    setEditing(false);
    setSaving(false);
  };

  const changePassword = async () => {
    setSaving(true);
    try { await api.post('/auth/change-password', { oldPassword: oldPass, newPassword: newPass }); } catch {}
    setOldPass(''); setNewPass('');
    setShowPassModal(false);
    setSaving(false);
  };

  const initial = profile.name.charAt(0).toUpperCase();

  return (
    <div style={{ minHeight:'100vh', backgroundColor:'#F8FAFC', paddingBottom:80, fontFamily:'Inter,sans-serif', maxWidth:430, margin:'0 auto' }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,#334155,${C})`, padding:'24px 20px 64px', position:'relative' }}>
        <h1 style={{ fontSize:16, fontWeight:700, color:'#fff', margin:'0 0 0', textAlign:'center' }}>Profil Driver</h1>
      </div>

      {/* Avatar */}
      <div style={{ display:'flex', justifyContent:'center', marginTop:-44, marginBottom:16, position:'relative', zIndex:10 }}>
        <div style={{ width:88, height:88, borderRadius:'50%', background:`linear-gradient(135deg,#334155,${C})`, display:'flex', alignItems:'center', justifyContent:'center', border:'4px solid #fff', boxShadow:'0 4px 20px rgba(71,85,105,.2)' }}>
          <span style={{ fontSize:32, fontWeight:800, color:'#fff' }}>{initial}</span>
        </div>
      </div>

      <div style={{ textAlign:'center', marginBottom:24, padding:'0 20px' }}>
        <p style={{ fontSize:18, fontWeight:800, color:'#1E293B', margin:'0 0 4px' }}>{profile.name}</p>
        <p style={{ fontSize:13, color:'#64748B', margin:'0 0 2px' }}>{profile.email}</p>
        <span style={{ fontSize:11, backgroundColor:`${C}15`, color:C, borderRadius:100, padding:'3px 10px', fontWeight:700 }}>Driver</span>
      </div>

      <div style={{ padding:'0 16px' }}>
        {/* Profile Info */}
        <div style={{ backgroundColor:'#fff', borderRadius:16, overflow:'hidden', marginBottom:12, boxShadow:'0 2px 12px rgba(71,85,105,.06)' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #F1F5F9', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontSize:13, fontWeight:700, color:'#1E293B' }}>Informasi Pribadi</span>
            {!editing && (
              <button onClick={() => { setEditing(true); setEditData(profile); }} style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:C, fontWeight:600, border:'none', background:'none', cursor:'pointer' }}>
                <Edit2 size={13}/> Edit
              </button>
            )}
          </div>
          {[
            { icon:User, label:'Nama Lengkap', value:profile.name, key:'name' as const },
            { icon:Phone, label:'No. HP', value:profile.phone, key:'phone' as const },
            { icon:Truck, label:'Kendaraan', value:profile.vehicle, key:'vehicle' as const },
            { icon:Truck, label:'Plat Nomor', value:profile.vehiclePlate, key:'vehiclePlate' as const },
          ].map(row => (
            <div key={row.key} style={{ padding:'12px 20px', borderBottom:'1px solid #F1F5F9', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:32, height:32, borderRadius:8, backgroundColor:`${C}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <row.icon size={14} style={{ color:C }}/>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:11, color:'#94A3B8', margin:'0 0 2px', fontWeight:600 }}>{row.label}</p>
                {editing ? (
                  <input value={editData[row.key]} onChange={e => setEditData(prev => ({ ...prev, [row.key]: e.target.value }))}
                    style={{ width:'100%', padding:'6px 10px', borderRadius:8, border:'1.5px solid #CBD5E1', outline:'none', fontSize:13, fontWeight:600, boxSizing:'border-box' }}/>
                ) : (
                  <p style={{ fontSize:13, fontWeight:600, color:'#1E293B', margin:0 }}>{row.value || '—'}</p>
                )}
              </div>
            </div>
          ))}
          {editing && (
            <div style={{ padding:'12px 20px', display:'flex', gap:10 }}>
              <button onClick={() => setEditing(false)} style={{ flex:1, padding:'10px', borderRadius:10, border:'1.5px solid #E2E8F0', background:'#fff', color:'#64748B', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}><X size={13}/> Batal</button>
              <button onClick={saveProfile} disabled={saving} style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background:`linear-gradient(135deg,#334155,${C})`, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}><Save size={13}/> {saving ? '…' : 'Simpan'}</button>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ backgroundColor:'#fff', borderRadius:16, overflow:'hidden', marginBottom:12, boxShadow:'0 2px 12px rgba(71,85,105,.06)' }}>
          <button onClick={() => setShowPassModal(true)} style={{ width:'100%', padding:'14px 20px', border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', gap:12, textAlign:'left' }}>
            <div style={{ width:36, height:36, borderRadius:10, backgroundColor:'rgba(59,130,246,.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Lock size={16} style={{ color:'#3B82F6' }}/>
            </div>
            <span style={{ flex:1, fontSize:14, fontWeight:600, color:'#1E293B' }}>Ganti Password</span>
            <ChevronRight size={16} style={{ color:'#CBD5E1' }}/>
          </button>
        </div>

        <button onClick={handleLogout} style={{ width:'100%', padding:'14px', borderRadius:16, border:'none', background:'#FEF2F2', color:'#DC2626', fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          <LogOut size={16}/> Logout
        </button>
      </div>

      {/* Change Password Modal */}
      {showPassModal && (
        <div style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,.5)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:50 }}>
          <div style={{ backgroundColor:'#fff', borderRadius:'20px 20px 0 0', padding:24, width:'100%', maxWidth:430 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h3 style={{ fontSize:16, fontWeight:700, color:'#1E293B', margin:0 }}>Ganti Password</h3>
              <button onClick={() => setShowPassModal(false)} style={{ border:'none', background:'none', cursor:'pointer', color:'#94A3B8' }}><X size={20}/></button>
            </div>
            {[
              { label:'Password Lama', value:oldPass, set:setOldPass },
              { label:'Password Baru', value:newPass, set:setNewPass },
            ].map(f => (
              <div key={f.label} style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:12.5, fontWeight:600, color:'#374151', marginBottom:6 }}>{f.label}</label>
                <input type="password" value={f.value} onChange={e => f.set(e.target.value)} placeholder="••••••••"
                  style={{ width:'100%', padding:'12px 16px', borderRadius:12, border:'1.5px solid #E2E8F0', outline:'none', fontSize:14, boxSizing:'border-box' }}/>
              </div>
            ))}
            <div style={{ display:'flex', gap:10, marginTop:8 }}>
              <button onClick={() => setShowPassModal(false)} style={{ flex:1, padding:'12px', borderRadius:12, border:'1.5px solid #E2E8F0', background:'#fff', color:'#64748B', fontSize:13, fontWeight:600, cursor:'pointer' }}>Batal</button>
              <button onClick={changePassword} disabled={!oldPass || !newPass || saving} style={{ flex:1, padding:'12px', borderRadius:12, border:'none', background:`linear-gradient(135deg,#334155,${C})`, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', opacity: !oldPass||!newPass ? .5 : 1 }}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav/>
    </div>
  );
}
