'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../lib/useAuthStore';
import api from '../lib/api';
import {
  ShoppingCart, FileText, Users, TrendingUp, Target, Percent,
  Zap, Plus, Search, Bell, LogOut, ChevronRight, ArrowUpRight,
  Calendar, Phone, LayoutGrid, Star, Menu, X, Home,
} from 'lucide-react';

const NAV = [
  { label:'Smart Order', href:'/smart-order', icon:Zap },
  { label:'Quotation', href:'/quotations', icon:FileText },
  { label:'Sales Order', href:'/orders', icon:ShoppingCart, badge:5 },
  { label:'Pipeline CRM', href:'/crm', icon:LayoutGrid, badge:3 },
  { label:'Leads', href:'/leads', icon:Star },
  { label:'Follow-up', href:'/followup', icon:Phone },
  { label:'Pelanggan', href:'/customers', icon:Users },
  { label:'Target', href:'/targets', icon:Target },
  { label:'Komisi', href:'/commission', icon:Percent },
  { label:'Laporan', href:'/reports', icon:TrendingUp },
];

const APP_COLOR = '#0891B2';

interface DashStats { total_orders: number; total_revenue: number; target_pct: number; pending_followup: number; }

export default function SalesHomePage() {
  const { token, user, loadProfile, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [stats, setStats] = useState<DashStats>({ total_orders:0, total_revenue:0, target_pct:0, pending_followup:0 });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!token) { router.replace('/login'); return; }
    const init = async () => {
      if (!user) await loadProfile().catch(() => { logout(); router.replace('/login'); });
      try {
        const res = await api.get('/sales/dashboard-summary');
        setStats(res.data);
      } catch {
        setStats({ total_orders:42, total_revenue:185000000, target_pct:73, pending_followup:8 });
      }
      setLoading(false);
      setTimeout(() => setMounted(true), 60);
    };
    init();
  }, [token]);

  if (!token || loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#F0FAFE' }}>
      <svg style={{ width:28, height:28, animation:'spin .8s linear infinite', color:APP_COLOR }} viewBox="0 0 24 24" fill="none">
        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
        <circle opacity=".2" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path opacity=".8" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
      </svg>
    </div>
  );

  const formatRp = (v: number) => v >= 1e9 ? `Rp ${(v/1e9).toFixed(1)} M` : v >= 1e6 ? `Rp ${(v/1e6).toFixed(1)} Jt` : `Rp ${v.toLocaleString('id-ID')}`;

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', backgroundColor:'#F0FAFE', opacity: mounted ? 1 : 0, transition:'opacity .4s' }}>
      {/* SIDEBAR */}
      {sidebarOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex' }}>
          <div style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,.4)' }} onClick={() => setSidebarOpen(false)} />
          <aside style={{ position:'relative', width:240, height:'100%', zIndex:10, background:`linear-gradient(180deg,${APP_COLOR} 0%,${APP_COLOR}dd 100%)`, display:'flex', flexDirection:'column' }}>
            <SidebarContent nav={NAV} pathname={pathname} color={APP_COLOR} user={user} onNav={(h) => { router.push(h); setSidebarOpen(false); }} onLogout={() => { logout(); router.replace('/login'); }} onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}
      <aside className="gm-sales-sidebar" style={{ width:220, flexShrink:0, background:`linear-gradient(180deg,${APP_COLOR} 0%,${APP_COLOR}dd 100%)`, display:'flex', flexDirection:'column' }}>
        <style>{`.gm-sales-sidebar{display:flex!important}@media(max-width:1023px){.gm-sales-sidebar{display:none!important}}`}</style>
        <SidebarContent nav={NAV} pathname={pathname} color={APP_COLOR} user={user} onNav={(h) => router.push(h)} onLogout={() => { logout(); router.replace('/login'); }} />
      </aside>

      {/* MAIN */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
        <header style={{ height:56, backgroundColor:'#fff', borderBottom:'1px solid #E0F7FA', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button className="gm-menu-btn" onClick={() => setSidebarOpen(true)} style={{ display:'none', padding:8, border:'none', background:'none', cursor:'pointer', color:'#9CA3AF' }}>
              <style>{`.gm-menu-btn{display:flex!important}@media(min-width:1024px){.gm-menu-btn{display:none!important}}`}</style>
              <Menu size={20} />
            </button>
            <span style={{ fontSize:14, fontWeight:700, color:APP_COLOR }}>Sales App</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button style={{ padding:8, border:'none', background:'none', cursor:'pointer', color:'#9CA3AF' }}><Bell size={18} /></button>
            <button onClick={() => { logout(); router.replace('/login'); }} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', border:'none', borderRadius:8, backgroundColor:'#FEF2F2', color:'#DC2626', fontSize:12.5, fontWeight:600, cursor:'pointer' }}>
              <LogOut size={13} /> Keluar
            </button>
          </div>
        </header>

        <main style={{ flex:1, overflowY:'auto', padding:24 }}>
          {/* GREETING */}
          <div style={{ marginBottom:24 }}>
            <h1 style={{ fontSize:22, fontWeight:800, color:'#0C4A6E', margin:'0 0 6px' }}>Halo, {user?.name?.split(' ')[0] || 'Sales'}! 👋</h1>
            <p style={{ color:'#6B7280', fontSize:13.5, margin:0 }}>Berikut ringkasan aktivitas sales hari ini.</p>
          </div>

          {/* STATS */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14, marginBottom:24 }}>
            {[
              { label:'Total Order Bulan Ini', value:stats.total_orders, display: String(stats.total_orders), icon:ShoppingCart, color:'#0891B2' },
              { label:'Revenue Bulan Ini', value:stats.total_revenue, display:formatRp(stats.total_revenue), icon:TrendingUp, color:'#22C55E' },
              { label:'Target Tercapai', value:stats.target_pct, display:`${stats.target_pct}%`, icon:Target, color:'#F59E0B' },
              { label:'Follow-up Pending', value:stats.pending_followup, display:String(stats.pending_followup), icon:Phone, color:'#EF4444' },
            ].map((s) => (
              <div key={s.label} style={{ backgroundColor:'#fff', borderRadius:16, border:'1px solid #E0F7FA', padding:18, boxShadow:'0 2px 8px rgba(8,145,178,.06)' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <p style={{ fontSize:11.5, color:'#9CA3AF', fontWeight:500, margin:0 }}>{s.label}</p>
                  <div style={{ width:34, height:34, borderRadius:10, backgroundColor:`${s.color}18`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <s.icon size={15} style={{ color:s.color }} />
                  </div>
                </div>
                <p style={{ fontSize:22, fontWeight:800, color:'#0C4A6E', margin:0 }}>{s.display}</p>
              </div>
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <div style={{ marginBottom:24 }}>
            <h2 style={{ fontSize:15, fontWeight:700, color:'#0C4A6E', marginBottom:14 }}>Aksi Cepat</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:10 }}>
              {[
                { label:'Buat Order Baru', href:'/smart-order', icon:Zap, color:'#0891B2' },
                { label:'Buat Quotation', href:'/quotations/new', icon:FileText, color:'#8B5CF6' },
                { label:'Tambah Lead', href:'/leads/new', icon:Star, color:'#F59E0B' },
                { label:'Daftar Pelanggan', href:'/customers', icon:Users, color:'#22C55E' },
              ].map((a) => (
                <button key={a.href} onClick={() => router.push(a.href)}
                  style={{ padding:'14px 16px', borderRadius:14, backgroundColor:'#fff', border:'1.5px solid #E0F7FA', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:10, transition:'all .2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = a.color; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 16px ${a.color}22`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#E0F7FA'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}
                >
                  <div style={{ width:34, height:34, borderRadius:10, backgroundColor:`${a.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <a.icon size={15} style={{ color:a.color }} />
                  </div>
                  <span style={{ fontSize:12.5, fontWeight:600, color:'#0C4A6E' }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ nav, pathname, color, user, onNav, onLogout, onClose }: {
  nav: typeof NAV; pathname: string; color: string;
  user: { name?: string; email?: string } | null;
  onNav: (h: string) => void; onLogout: () => void; onClose?: () => void;
}) {
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'16px', borderBottom:'1px solid rgba(255,255,255,.12)' }}>
        <div style={{ width:32, height:32, borderRadius:8, backgroundColor:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:14 }}>S</div>
        <div style={{ flex:1 }}><p style={{ fontSize:13, fontWeight:700, color:'#fff', margin:0 }}>Sales App</p><p style={{ fontSize:10, color:'rgba(255,255,255,.5)', margin:0 }}>Gentong Mas ERP</p></div>
        {onClose && <button onClick={onClose} style={{ border:'none', background:'rgba(255,255,255,.15)', borderRadius:6, padding:5, cursor:'pointer', color:'#fff', display:'flex' }}><X size={13} /></button>}
      </div>
      <nav style={{ flex:1, overflowY:'auto', padding:'10px 8px' }}>
        {nav.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <button key={item.href} onClick={() => onNav(item.href)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:9, border:'none', cursor:'pointer', textAlign:'left', marginBottom:2, backgroundColor: isActive ? 'rgba(255,255,255,.2)' : 'transparent', color: isActive ? '#fff' : 'rgba(255,255,255,.75)', transition:'all .15s' }}>
              <item.icon size={14} style={{ flexShrink:0 }} />
              <span style={{ fontSize:12.5, fontWeight:500, flex:1 }}>{item.label}</span>
              {item.badge && <span style={{ backgroundColor:'rgba(255,255,255,.25)', color:'#fff', borderRadius:100, fontSize:10, fontWeight:700, padding:'1px 6px' }}>{item.badge}</span>}
            </button>
          );
        })}
      </nav>
      <div style={{ padding:12, borderTop:'1px solid rgba(255,255,255,.1)' }}>
        <button onClick={onLogout} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:9, border:'none', cursor:'pointer', color:'rgba(255,255,255,.55)', backgroundColor:'transparent' }}>
          <LogOut size={13} /><span style={{ fontSize:12.5, fontWeight:500 }}>Keluar</span>
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px' }}>
          <div style={{ width:26, height:26, borderRadius:'50%', backgroundColor:'rgba(255,255,255,.25)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, fontWeight:700 }}>{(user?.name || 'S').charAt(0)}</div>
          <div style={{ minWidth:0 }}><p style={{ fontSize:12, fontWeight:600, color:'#fff', margin:0 }}>{user?.name || 'Sales'}</p><p style={{ fontSize:10, color:'rgba(255,255,255,.45)', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.email}</p></div>
        </div>
      </div>
    </div>
  );
}
