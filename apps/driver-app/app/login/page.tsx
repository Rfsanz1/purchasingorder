'use client';
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/useAuthStore';
import { Eye, EyeOff, ArrowUpRight, Truck, MapPin, CheckCircle, Clock } from 'lucide-react';

const C = '#475569';
const ALLOWED_ROLES = ['DRIVER', 'ADMIN', 'OWNER', 'SUPER_ADMIN'];

export default function LoginPage() {
  const router = useRouter();
  const { login, loadProfile, logout, token, error, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [roleError, setRoleError] = useState('');

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (token) router.replace('/'); }, [token, router]);
  if (token) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setRoleError('');
    const ok = await login(email, password);
    if (ok) {
      const currentUser = useAuthStore.getState().user;
      const roles: string[] = currentUser?.roles ?? [];
      if (!roles.some(r => ALLOWED_ROLES.includes(r))) {
        logout();
        setRoleError('Akun ini tidak memiliki akses Driver App.');
        return;
      }
      await loadProfile();
      router.replace('/');
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', backgroundColor:'#F8FAFC', padding:'32px 20px', opacity: mounted?1:0, transition:'opacity .4s', fontFamily:'Inter,sans-serif' }}>
      {/* Logo */}
      <div style={{ marginBottom:32, textAlign:'center' }}>
        <div style={{ width:64, height:64, borderRadius:20, background:`linear-gradient(135deg,#334155,${C})`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', boxShadow:`0 8px 24px ${C}30` }}>
          <Truck size={28} style={{ color:'#fff' }}/>
        </div>
        <p style={{ fontSize:18, fontWeight:800, color:'#1E293B', margin:'0 0 4px' }}>Driver App</p>
        <p style={{ fontSize:12, color:'#94A3B8', margin:0 }}>Gentong Mas ERP</p>
      </div>

      {/* Card */}
      <div style={{ backgroundColor:'#fff', borderRadius:20, padding:'28px 24px', width:'100%', maxWidth:420, boxShadow:'0 4px 24px rgba(71,85,105,.1)' }}>
        <h2 style={{ fontSize:'1.5rem', fontWeight:800, color:'#1E293B', margin:'0 0 6px' }}>Selamat Datang</h2>
        <p style={{ color:'#94A3B8', fontSize:13.5, margin:'0 0 24px' }}>Login untuk melihat daftar pengiriman hari ini</p>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:8 }}>Email / ID Driver</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
              placeholder="driver@perusahaan.com"
              style={{ width:'100%', outline:'none', fontSize:15, borderRadius:14, padding:'14px 16px', border: focused==='email' ? `2px solid ${C}` : '2px solid #E2E8F0', backgroundColor:'#F8FAFC', color:'#1E293B', transition:'all .2s', boxSizing:'border-box' }}/>
          </div>
          <div>
            <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#374151', marginBottom:8 }}>Password</label>
            <div style={{ position:'relative' }}>
              <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused('pass')} onBlur={() => setFocused(null)}
                placeholder="••••••••"
                style={{ width:'100%', outline:'none', fontSize:15, borderRadius:14, padding:'14px 48px 14px 16px', border: focused==='pass' ? `2px solid ${C}` : '2px solid #E2E8F0', backgroundColor:'#F8FAFC', color:'#1E293B', transition:'all .2s', boxSizing:'border-box' }}/>
              <button type="button" onClick={() => setShowPass(v => !v)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', border:'none', background:'none', cursor:'pointer', color:'#94A3B8', padding:4 }}>
                {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>
          {(error || roleError) && (
            <div style={{ borderRadius:12, padding:'12px 14px', backgroundColor:'#FEF2F2', color:'#DC2626', border:'1px solid #FECACA', fontSize:13 }}>⚠ {roleError || error}</div>
          )}
          <button type="submit" disabled={loading}
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'16px', borderRadius:14, background:`linear-gradient(135deg,#334155,${C})`, color:'#fff', fontSize:15, fontWeight:700, border:'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .75 : 1, boxShadow:`0 6px 24px ${C}40`, marginTop:4 }}>
            {loading ? '⏳ Memproses…' : <><ArrowUpRight size={18}/> Masuk</>}
          </button>
        </form>
      </div>

      {/* Features */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, width:'100%', maxWidth:420, marginTop:16 }}>
        {[
          { icon: MapPin, label:'Lihat Rute' },
          { icon: CheckCircle, label:'Update Status' },
          { icon: Truck, label:'Daftar Tugas' },
          { icon: Clock, label:'Riwayat' },
        ].map(({ icon: Icon, label }, i) => (
          <div key={i} style={{ backgroundColor:'#fff', borderRadius:12, padding:'10px 14px', display:'flex', alignItems:'center', gap:8, border:'1px solid #E2E8F0' }}>
            <Icon size={14} style={{ color:C }}/><span style={{ fontSize:12, color:'#64748B', fontWeight:500 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
