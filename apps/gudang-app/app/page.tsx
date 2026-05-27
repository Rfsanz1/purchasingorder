'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../lib/useAuthStore';
import api from '../lib/api';
import {
  Package, ArrowDownRight, ArrowUpRight, ClipboardList,
  ClipboardCheck, ArrowLeftRight, Clock, Bell, LogOut, Menu, X,
} from 'lucide-react';

const APP_COLOR = '#D97706';
const NAV = [
  { label:'Dashboard', href:'/', icon:Package },
  { label:'Picking Order', href:'/picking', icon:ClipboardList, badge:0 },
  { label:'Barang Masuk', href:'/inbound', icon:ArrowDownRight },
  { label:'Barang Keluar', href:'/outbound', icon:ArrowUpRight },
  { label:'Transfer Stok', href:'/transfer', icon:ArrowLeftRight },
  { label:'Stock Opname', href:'/stock-opname', icon:ClipboardCheck },
  { label:'Lihat Stok', href:'/stok', icon:Package },
  { label:'Riwayat', href:'/history', icon:Clock },
];

interface GudangStats { picking: number; incoming: number; outgoing: number; transfers: number; stockOpname: number; pending: number; }

export default function GudangHomePage() {
  const { token, user, loadProfile, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [stats, setStats] = useState<GudangStats>({ picking:5, incoming:12, outgoing:8, transfers:3, stockOpname:2, pending:4 });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!token) { router.replace('/login'); return; }
    const init = async () => {
      if (!user) await loadProfile().catch(() => { logout(); router.replace('/login'); });
      try {
        const res = await api.get('/inventory/summary');
        const d = res.data ?? {};
        setStats({ picking: d.picking_orders ?? 5, incoming: d.incoming_orders ?? 12, outgoing: d.outgoing_orders ?? 8, transfers: d.transfers ?? 3, stockOpname: d.stock_opname ?? 2, pending: d.pending_orders ?? 4 });
      } catch { /* use defaults */ }
      setLoading(false);
      setTimeout(() => setMounted(true), 60);
    };
    init();
  }, [token]);

  if (!token || loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#FFFBEB' }}>
      <svg style={{ width:28, height:28, animation:'spin .8s linear infinite', color:APP_COLOR }} viewBox="0 0 24 24" fill="none">
        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
        <circle opacity=".2" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path opacity=".8" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
      </svg>
    </div>
  );

  const CARDS = [
    { label:'Picking Order', value:stats.picking, icon:ClipboardList, color:'#F57C00', bg:'rgba(245,124,0,.1)', href:'/picking' },
    { label:'Barang Masuk', value:stats.incoming, icon:ArrowDownRight, color:'#2563EB', bg:'rgba(37,99,235,.1)', href:'/inbound' },
    { label:'Barang Keluar', value:stats.outgoing, icon:ArrowUpRight, color:'#16A34A', bg:'rgba(22,163,74,.1)', href:'/outbound' },
    { label:'Transfer Stok', value:stats.transfers, icon:ArrowLeftRight, color:'#D97706', bg:'rgba(217,119,6,.1)', href:'/transfer' },
    { label:'Stock Opname', value:stats.stockOpname, icon:ClipboardCheck, color:'#7C3AED', bg:'rgba(124,58,237,.1)', href:'/stock-opname' },
    { label:'Order Pending', value:stats.pending, icon:Clock, color:'#DC2626', bg:'rgba(220,38,38,.1)', href:'/picking' },
  ];

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', backgroundColor:'#FFFBEB', opacity: mounted ? 1 : 0, transition:'opacity .4s' }}>
      {sidebarOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex' }}>
          <div style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,.4)' }} onClick={() => setSidebarOpen(false)} />
          <aside style={{ position:'relative', width:240, height:'100%', zIndex:10, background:`linear-gradient(180deg,${APP_COLOR} 0%,${APP_COLOR}dd 100%)`, display:'flex', flexDirection:'column' }}>
            <GudangSidebar nav={NAV} pathname={pathname} user={user} onNav={h => { router.push(h); setSidebarOpen(false); }} onLogout={() => { logout(); router.replace('/login'); }} onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}
      <aside className="gm-sidebar" style={{ width:220, flexShrink:0, background:`linear-gradient(180deg,${APP_COLOR} 0%,${APP_COLOR}dd 100%)`, display:'flex', flexDirection:'column' }}>
        <style>{`.gm-sidebar{display:flex!important}@media(max-width:1023px){.gm-sidebar{display:none!important}}`}</style>
        <GudangSidebar nav={NAV} pathname={pathname} user={user} onNav={h => router.push(h)} onLogout={() => { logout(); router.replace('/login'); }} />
      </aside>

      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
        <header style={{ height:56, backgroundColor:'#fff', borderBottom:'1px solid #FEF3C7', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button className="gm-menu-btn2" onClick={() => setSidebarOpen(true)} style={{ display:'none', padding:8, border:'none', background:'none', cursor:'pointer', color:'#9CA3AF' }}>
              <style>{`.gm-menu-btn2{display:flex!important}@media(min-width:1024px){.gm-menu-btn2{display:none!important}}`}</style>
              <Menu size={20} />
            </button>
            <span style={{ fontSize:14, fontWeight:700, color:APP_COLOR }}>Gudang App</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button style={{ padding:8, border:'none', background:'none', cursor:'pointer', color:'#9CA3AF' }}><Bell size={18} /></button>
            <button onClick={() => { logout(); router.replace('/login'); }} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', border:'none', borderRadius:8, backgroundColor:'#FEF2F2', color:'#DC2626', fontSize:12.5, fontWeight:600, cursor:'pointer' }}>
              <LogOut size={13} /> Keluar
            </button>
          </div>
        </header>

        <main style={{ flex:1, overflowY:'auto', padding:24 }}>
          <div style={{ marginBottom:24 }}>
            <p style={{ fontSize:11.5, fontWeight:600, color:APP_COLOR, textTransform:'uppercase', letterSpacing:'0.15em', margin:'0 0 4px' }}>Gudang App</p>
            <h1 style={{ fontSize:22, fontWeight:800, color:'#78350F', margin:'0 0 6px' }}>Dashboard Gudang</h1>
            <p style={{ color:'#6B7280', fontSize:13.5, margin:0 }}>Selamat datang, {user?.name?.split(' ')[0] || 'Staff'}. Berikut ringkasan aktivitas gudang hari ini.</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14, marginBottom:24 }}>
            {CARDS.map((card) => (
              <button key={card.label} onClick={() => router.push(card.href)}
                style={{ padding:20, borderRadius:16, backgroundColor:'#fff', border:'1.5px solid #FEF3C7', cursor:'pointer', textAlign:'left', transition:'all .2s', display:'flex', alignItems:'flex-start', gap:14 }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = card.color; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 20px ${card.color}22`; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#FEF3C7'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
              >
                <div style={{ width:42, height:42, borderRadius:12, backgroundColor:card.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <card.icon size={18} style={{ color:card.color }} />
                </div>
                <div>
                  <p style={{ fontSize:11.5, color:'#9CA3AF', fontWeight:500, margin:'0 0 4px' }}>{card.label}</p>
                  <p style={{ fontSize:26, fontWeight:800, color:'#78350F', margin:0, lineHeight:1 }}>{card.value}</p>
                </div>
              </button>
            ))}
          </div>

          <div style={{ backgroundColor:'#fff', borderRadius:16, border:'1px solid #FEF3C7', padding:20 }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:'#78350F', margin:'0 0 16px' }}>Aksi Cepat</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:10 }}>
              {[
                { label:'Buat Picking Order', href:'/picking/new', icon:ClipboardList, color:'#F57C00' },
                { label:'Terima Barang', href:'/inbound/new', icon:ArrowDownRight, color:'#2563EB' },
                { label:'Kirim Barang', href:'/outbound/new', icon:ArrowUpRight, color:'#16A34A' },
                { label:'Transfer Stok', href:'/transfer/new', icon:ArrowLeftRight, color:'#7C3AED' },
              ].map((a) => (
                <button key={a.href} onClick={() => router.push(a.href)}
                  style={{ padding:'12px 14px', borderRadius:12, backgroundColor:`${a.color}10`, border:`1.5px solid ${a.color}25`, cursor:'pointer', display:'flex', alignItems:'center', gap:10, transition:'all .2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${a.color}20`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${a.color}10`; }}
                >
                  <a.icon size={16} style={{ color:a.color, flexShrink:0 }} />
                  <span style={{ fontSize:12.5, fontWeight:600, color:'#374151' }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function GudangSidebar({ nav, pathname, user, onNav, onLogout, onClose }: {
  nav: typeof NAV; pathname: string;
  user: { name?: string; email?: string } | null;
  onNav: (h: string) => void; onLogout: () => void; onClose?: () => void;
}) {
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'16px', borderBottom:'1px solid rgba(255,255,255,.12)' }}>
        <div style={{ width:32, height:32, borderRadius:8, backgroundColor:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:14 }}>G</div>
        <div style={{ flex:1 }}><p style={{ fontSize:13, fontWeight:700, color:'#fff', margin:0 }}>Gudang App</p><p style={{ fontSize:10, color:'rgba(255,255,255,.5)', margin:0 }}>Gentong Mas ERP</p></div>
        {onClose && <button onClick={onClose} style={{ border:'none', background:'rgba(255,255,255,.15)', borderRadius:6, padding:5, cursor:'pointer', color:'#fff', display:'flex' }}><X size={13} /></button>}
      </div>
      <nav style={{ flex:1, overflowY:'auto', padding:'10px 8px' }}>
        {nav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <button key={item.href} onClick={() => onNav(item.href)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:9, border:'none', cursor:'pointer', textAlign:'left', marginBottom:2, backgroundColor: isActive ? 'rgba(255,255,255,.2)' : 'transparent', color: isActive ? '#fff' : 'rgba(255,255,255,.75)' }}>
              <item.icon size={14} style={{ flexShrink:0 }} />
              <span style={{ fontSize:12.5, fontWeight:500 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div style={{ padding:12, borderTop:'1px solid rgba(255,255,255,.1)' }}>
        <button onClick={onLogout} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:9, border:'none', cursor:'pointer', color:'rgba(255,255,255,.55)', backgroundColor:'transparent' }}>
          <LogOut size={13} /><span style={{ fontSize:12.5, fontWeight:500 }}>Keluar</span>
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px' }}>
          <div style={{ width:26, height:26, borderRadius:'50%', backgroundColor:'rgba(255,255,255,.25)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, fontWeight:700 }}>{(user?.name || 'G').charAt(0)}</div>
          <div style={{ minWidth:0 }}><p style={{ fontSize:12, fontWeight:600, color:'#fff', margin:0 }}>{user?.name || 'Staff'}</p><p style={{ fontSize:10, color:'rgba(255,255,255,.45)', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.email}</p></div>
        </div>
      </div>
    </div>
  );
}
