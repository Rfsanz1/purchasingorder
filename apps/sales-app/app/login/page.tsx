'use client';
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/useAuthStore';
import { Eye, EyeOff, ArrowUpRight, Target, TrendingUp, ShoppingCart, Users, Zap } from 'lucide-react';

const ALLOWED_ROLES = ['SALES', 'ADMIN', 'OWNER', 'SUPER_ADMIN'];

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
      const hasAccess = roles.some(r => ALLOWED_ROLES.includes(r));
      if (!hasAccess) {
        logout();
        setRoleError('Akun ini tidak memiliki akses Sales App');
        return;
      }
      await loadProfile();
      router.replace('/');
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', opacity: mounted ? 1 : 0, transition:'opacity .4s' }}>
      <div className="hidden lg:flex lg:w-[48%]" style={{ background:'linear-gradient(145deg,#0284C7 0%,#0891B2 50%,#22D3EE 100%)', flexDirection:'column', justifyContent:'space-between', padding:'40px 36px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)', backgroundSize:'36px 36px', pointerEvents:'none' }} />
        <div style={{ position:'relative', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,.95)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:'#0891B2', fontSize:15 }}>G</div>
          <div><span style={{ color:'#fff', fontWeight:700, fontSize:15, display:'block' }}>Sales App</span><span style={{ color:'rgba(255,255,255,.55)', fontSize:11 }}>Gentong Mas ERP</span></div>
        </div>
        <div style={{ position:'relative' }}>
          <h1 style={{ color:'#fff', fontSize:'1.9rem', fontWeight:800, lineHeight:1.2, margin:'0 0 12px' }}>Tingkatkan<br /><span style={{ color:'#BAE6FD' }}>performa sales Anda.</span></h1>
          <p style={{ color:'rgba(255,255,255,.65)', fontSize:13.5, lineHeight:1.6, margin:0 }}>Kelola quotation, order, leads, dan target sales langsung dari genggaman.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
          {[
            { icon: ShoppingCart, label:'Sales Order', color:'#7DD3FC' },
            { icon: Target, label:'Target & Komisi', color:'#67E8F9' },
            { icon: TrendingUp, label:'Pipeline CRM', color:'#BAE6FD' },
            { icon: Users, label:'Data Pelanggan', color:'#E0F2FE' },
          ].map(({ icon: Icon, label, color }, i) => (
            <div key={i} style={{ padding:14, borderRadius:14, backgroundColor:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.15)', display:'flex', alignItems:'center', gap:10 }}>
              <Icon size={16} style={{ color }} /><span style={{ fontSize:12, color:'rgba(255,255,255,.85)', fontWeight:500 }}>{label}</span>
            </div>
          ))}
        </div>
        <p style={{ position:'relative', fontSize:10.5, color:'rgba(255,255,255,.3)', margin:0 }}>© 2026 Gentong Mas — Sales App</p>
      </div>
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#fff', padding:'40px 44px' }}>
        <div style={{ width:'100%', maxWidth:360 }}>
          <div style={{ marginBottom:32 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, borderRadius:100, padding:'4px 12px', backgroundColor:'#ECFEFF', border:'1px solid #A5F3FC', color:'#0891B2', fontSize:11, fontWeight:600, marginBottom:16 }}>
              <Zap size={10} style={{ color:'#0EA5E9' }} /> Sales App — Tim Penjualan
            </div>
            <h2 style={{ fontSize:'2rem', fontWeight:800, color:'#0C4A6E', margin:'0 0 8px', letterSpacing:'-0.5px' }}>Selamat Datang</h2>
            <p style={{ color:'#9CA3AF', fontSize:13.5, margin:0 }}>Login untuk akses dashboard penjualan Anda</p>
          </div>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <label style={{ display:'block', fontSize:12.5, fontWeight:600, color:'#374151', marginBottom:6 }}>Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} placeholder="sales@perusahaan.com"
                style={{ width:'100%', outline:'none', fontSize:13.5, borderRadius:12, padding:'11px 16px', border: focused==='email' ? '1.5px solid #22D3EE' : '1.5px solid #E5E7EB', boxShadow: focused==='email' ? '0 0 0 4px rgba(34,211,238,.1)' : '0 1px 3px rgba(0,0,0,.04)', backgroundColor:'#FAFAFA', color:'#111827', transition:'all .2s', boxSizing:'border-box' }} />
            </div>
            <div>
              <label style={{ display:'block', fontSize:12.5, fontWeight:600, color:'#374151', marginBottom:6 }}>Password</label>
              <div style={{ position:'relative' }}>
                <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('pass')} onBlur={() => setFocused(null)} placeholder="••••••••"
                  style={{ width:'100%', outline:'none', fontSize:13.5, borderRadius:12, padding:'11px 44px 11px 16px', border: focused==='pass' ? '1.5px solid #22D3EE' : '1.5px solid #E5E7EB', boxShadow: focused==='pass' ? '0 0 0 4px rgba(34,211,238,.1)' : '0 1px 3px rgba(0,0,0,.04)', backgroundColor:'#FAFAFA', color:'#111827', transition:'all .2s', boxSizing:'border-box' }} />
                <button type="button" onClick={() => setShowPass(v => !v)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', border:'none', background:'none', cursor:'pointer', color:'#C4C9D4', padding:4 }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {(error || roleError) && <div style={{ borderRadius:12, padding:'10px 14px', backgroundColor:'#FEF2F2', color:'#DC2626', border:'1px solid #FECACA', fontSize:12.5 }}>⚠ {roleError || error}</div>}
            <button type="submit" disabled={loading} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'13px 20px', borderRadius:14, background:'linear-gradient(135deg,#0284C7,#22D3EE)', color:'#fff', fontSize:14, fontWeight:700, border:'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .75 : 1, boxShadow:'0 6px 24px rgba(8,145,178,.4)', marginTop:4 }}>
              {loading ? '⏳ Memproses…' : <><ArrowUpRight size={16} /> Masuk ke Sales App</>}
            </button>
          </form>
          <p style={{ textAlign:'center', fontSize:12, color:'#C4C9D4', marginTop:28 }}>Untuk Tim Sales — Hubungi admin jika belum punya akses</p>
        </div>
      </div>
    </div>
  );
}
