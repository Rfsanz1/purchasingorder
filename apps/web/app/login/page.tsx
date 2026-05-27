'use client';
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/useAuthStore';
import { Eye, EyeOff, ArrowUpRight, Zap, BarChart2, Package, Users, DollarSign, ShoppingCart } from 'lucide-react';

const APP_COLOR = '#5B52D1';
const ALLOWED = ['ADMIN', 'OWNER'];

export default function LoginPage() {
  const router = useRouter();
  const { login, loadProfile, token, error, loading } = useAuthStore();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (token) router.replace('/'); }, [token, router]);
  if (token) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) {
      await loadProfile();
      router.replace('/');
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', opacity: mounted ? 1 : 0, transition:'opacity .4s' }}>
      {/* LEFT */}
      <div className="hidden lg:flex lg:w-[52%]" style={{ background:'linear-gradient(145deg,#4338CA 0%,#5B52D1 35%,#7C6FF5 65%,#8B80F9 100%)', flexDirection:'column', justifyContent:'space-between', padding:'40px 36px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)', backgroundSize:'36px 36px', pointerEvents:'none' }} />
        <div style={{ position:'relative', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,.95)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:APP_COLOR, fontSize:15 }}>G</div>
          <div><span style={{ color:'#fff', fontWeight:700, fontSize:15, display:'block' }}>Gentong Mas</span><span style={{ color:'rgba(255,255,255,.55)', fontSize:11 }}>Enterprise ERP — Core</span></div>
        </div>
        <div style={{ position:'relative' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, borderRadius:100, padding:'6px 12px', backgroundColor:'rgba(255,255,255,.14)', border:'1px solid rgba(255,255,255,.15)', color:'rgba(255,255,255,.9)', fontSize:11, fontWeight:600, marginBottom:16 }}>
            <Zap size={12} style={{ color:'#FCD34D' }} /> Platform ERP Terintegrasi — Owner & Admin
          </div>
          <h1 style={{ color:'#fff', fontSize:'2rem', fontWeight:800, lineHeight:1.2, margin:'0 0 12px' }}>Kelola semua modul<br /><span style={{ color:'#C4B5FD' }}>dari satu dashboard.</span></h1>
          <p style={{ color:'rgba(255,255,255,.6)', fontSize:13.5, lineHeight:1.6, margin:0 }}>Akses penuh ke Penjualan, Keuangan, HR, Inventaris, dan semua modul ERP.</p>
        </div>
        <div style={{ position:'relative', borderRadius:20, background:'rgba(255,255,255,.1)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,.18)', padding:'18px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:12 }}>
            {[
              { icon: BarChart2, label:'Analytics', color:'#A78BFA' },
              { icon: ShoppingCart, label:'Sales', color:'#67E8F9' },
              { icon: Package, label:'Inventory', color:'#86EFAC' },
              { icon: DollarSign, label:'Finance', color:'#FCD34D' },
              { icon: Users, label:'HR', color:'#FB7185' },
              { icon: Zap, label:'AI Suite', color:'#C4B5FD' },
            ].map(({ icon: Icon, label, color }, i) => (
              <div key={i} style={{ padding:10, borderRadius:12, backgroundColor:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.1)', display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <Icon size={16} style={{ color }} />
                <span style={{ fontSize:9.5, color:'rgba(255,255,255,.7)', fontWeight:500 }}>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:12, borderTop:'1px solid rgba(255,255,255,.1)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}><div style={{ width:6, height:6, borderRadius:'50%', backgroundColor:'#34D399', boxShadow:'0 0 6px rgba(52,211,153,.8)' }} /><span style={{ fontSize:9.5, color:'rgba(255,255,255,.45)' }}>Semua sistem aktif</span></div>
            <span style={{ fontSize:9.5, color:'rgba(255,255,255,.3)' }}>Admin & Owner Access</span>
          </div>
        </div>
        <p style={{ position:'relative', fontSize:10.5, color:'rgba(255,255,255,.3)', margin:0 }}>© 2026 Gentong Mas — ERP Core</p>
      </div>

      {/* RIGHT */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#fff', padding:'40px 44px' }}>
        <div style={{ width:'100%', maxWidth:360 }}>
          <div style={{ marginBottom:32 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, borderRadius:100, padding:'4px 12px', backgroundColor:'#F5F3FF', border:'1px solid #EDE9FE', color:'#6D28D9', fontSize:11, fontWeight:600, marginBottom:16 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', backgroundColor:'#7C3AED', display:'inline-block' }} /> ERP Core — Admin & Owner
            </div>
            <h2 style={{ fontSize:'2rem', fontWeight:800, color:'#1E1B4B', margin:'0 0 8px', letterSpacing:'-0.5px' }}>Selamat Datang</h2>
            <p style={{ color:'#9CA3AF', fontSize:13.5, margin:0 }}>Masuk untuk akses penuh ke semua modul ERP</p>
          </div>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <label style={{ display:'block', fontSize:12.5, fontWeight:600, color:'#374151', marginBottom:6 }}>Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                placeholder="admin@perusahaan.com"
                style={{ width:'100%', outline:'none', fontSize:13.5, borderRadius:12, padding:'11px 16px', border: focused==='email' ? '1.5px solid #8B80F9' : '1.5px solid #E5E7EB', boxShadow: focused==='email' ? '0 0 0 4px rgba(139,128,249,.1)' : '0 1px 3px rgba(0,0,0,.04)', backgroundColor:'#FAFAFA', color:'#111827', transition:'all .2s', boxSizing:'border-box' }} />
            </div>
            <div>
              <label style={{ display:'block', fontSize:12.5, fontWeight:600, color:'#374151', marginBottom:6 }}>Password</label>
              <div style={{ position:'relative' }}>
                <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('pass')} onBlur={() => setFocused(null)} placeholder="••••••••"
                  style={{ width:'100%', outline:'none', fontSize:13.5, borderRadius:12, padding:'11px 44px 11px 16px', border: focused==='pass' ? '1.5px solid #8B80F9' : '1.5px solid #E5E7EB', boxShadow: focused==='pass' ? '0 0 0 4px rgba(139,128,249,.1)' : '0 1px 3px rgba(0,0,0,.04)', backgroundColor:'#FAFAFA', color:'#111827', transition:'all .2s', boxSizing:'border-box' }} />
                <button type="button" onClick={() => setShowPass(v => !v)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', border:'none', background:'none', cursor:'pointer', color:'#C4C9D4', padding:4 }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <div style={{ borderRadius:12, padding:'10px 14px', backgroundColor:'#FEF2F2', color:'#DC2626', border:'1px solid #FECACA', fontSize:12.5 }}>⚠ {error}</div>}
            <button type="submit" disabled={loading} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'13px 20px', borderRadius:14, background:'linear-gradient(135deg,#5B52D1,#8B80F9)', color:'#fff', fontSize:14, fontWeight:700, border:'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .75 : 1, boxShadow:'0 6px 24px rgba(91,82,209,.4)', marginTop:4 }}>
              {loading ? '⏳ Memproses…' : <><ArrowUpRight size={16} /> Masuk ke ERP Core</>}
            </button>
          </form>
          <p style={{ textAlign:'center', fontSize:12, color:'#C4C9D4', marginTop:28 }}>Hanya untuk Administrator & Owner</p>
        </div>
      </div>
    </div>
  );
}
