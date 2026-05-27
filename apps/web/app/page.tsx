'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/useAuthStore';
import {
  BarChart2, ShoppingCart, Package, DollarSign, Users, Truck,
  Settings, TrendingUp, FileText, UserCheck, Monitor, Factory,
  Zap, Bell, ArrowUpRight, Activity, Shield, LogOut,
  ChevronRight, Brain, Target,
} from 'lucide-react';

const MODULES = [
  { label:'Dashboard', href:'/dashboard', icon:BarChart2, color:'#5B52D1', bg:'rgba(91,82,209,.1)', desc:'Analitik & monitoring' },
  { label:'Penjualan', href:'/sales', icon:ShoppingCart, color:'#0891B2', bg:'rgba(8,145,178,.1)', desc:'Order, quotation, invoice' },
  { label:'CRM', href:'/crm', icon:Users, color:'#8E24AA', bg:'rgba(142,36,170,.1)', desc:'Pipeline & leads' },
  { label:'Inventaris', href:'/inventory', icon:Package, color:'#F57C00', bg:'rgba(245,124,0,.1)', desc:'Stok & gudang' },
  { label:'Pembelian', href:'/purchasing', icon:Truck, color:'#5D4037', bg:'rgba(93,64,55,.1)', desc:'PO & supplier' },
  { label:'Akuntansi', href:'/accounting', icon:DollarSign, color:'#388E3C', bg:'rgba(56,142,60,.1)', desc:'Jurnal & laporan keuangan' },
  { label:'HR & SDM', href:'/hr', icon:UserCheck, color:'#C2185B', bg:'rgba(194,24,91,.1)', desc:'Karyawan & absensi' },
  { label:'Penggajian', href:'/hr/payrolls', icon:DollarSign, color:'#7B1FA2', bg:'rgba(123,31,162,.1)', desc:'Slip gaji & komponen' },
  { label:'Kasir (POS)', href:'/pos', icon:Monitor, color:'#E64A19', bg:'rgba(230,74,25,.1)', desc:'Point of sale' },
  { label:'Manufaktur', href:'/manufacturing', icon:Factory, color:'#6D28D9', bg:'rgba(109,40,217,.1)', desc:'BOM & work order' },
  { label:'Tax Engine', href:'/tax', icon:FileText, color:'#0F766E', bg:'rgba(15,118,110,.1)', desc:'E-faktur & PPh' },
  { label:'AI Suite', href:'/ai', icon:Brain, color:'#EC4899', bg:'rgba(236,72,153,.1)', desc:'Analitik & prediksi AI' },
  { label:'Laporan', href:'/reports', icon:TrendingUp, color:'#7B1FA2', bg:'rgba(123,31,162,.1)', desc:'Semua laporan' },
  { label:'Pengaturan', href:'/settings', icon:Settings, color:'#546E7A', bg:'rgba(84,110,122,.1)', desc:'Konfigurasi sistem' },
];

const QUICK_STATS = [
  { label:'Revenue Hari Ini', value:'Rp 24.5 Jt', icon:TrendingUp, color:'#22C55E', trend:'+12%' },
  { label:'Order Aktif', value:'87', icon:ShoppingCart, color:'#3B82F6', trend:'+5' },
  { label:'Stock Alert', value:'12', icon:Package, color:'#F59E0B', trend:'Low stock' },
  { label:'Sales Online', value:'23', icon:Activity, color:'#8B5CF6', trend:'Aktif' },
];

export default function WebHomePage() {
  const { token, user, loadProfile, logout } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!token) { router.replace('/login'); return; }
    const init = async () => {
      if (!user) await loadProfile().catch(() => { logout(); router.replace('/login'); });
      setLoading(false);
      setTimeout(() => setMounted(true), 60);
    };
    init();
  }, [token]);

  if (!token || loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#F5F3FF' }}>
      <div style={{ textAlign:'center' }}>
        <svg style={{ width:32, height:32, animation:'spin .8s linear infinite', color:'#5B52D1' }} viewBox="0 0 24 24" fill="none">
          <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
          <circle opacity=".2" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path opacity=".8" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
        </svg>
        <p style={{ fontSize:13, color:'#9CA3AF', marginTop:12 }}>Memuat ERP Core…</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', backgroundColor:'#F5F3FF', opacity: mounted ? 1 : 0, transition:'opacity .4s' }}>
      {/* TOP NAV */}
      <header style={{ backgroundColor:'#fff', borderBottom:'1px solid #EDE9FE', position:'sticky', top:0, zIndex:40, boxShadow:'0 1px 4px rgba(91,82,209,.06)' }}>
        <div style={{ maxWidth:1400, margin:'0 auto', padding:'0 24px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#5B52D1,#8B80F9)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:14 }}>G</div>
            <div>
              <span style={{ fontSize:15, fontWeight:700, color:'#1E1B4B' }}>Gentong Mas ERP</span>
              <span style={{ fontSize:11, color:'#9CA3AF', marginLeft:8 }}>Core Platform</span>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button style={{ padding:8, borderRadius:8, border:'none', backgroundColor:'transparent', cursor:'pointer', color:'#9CA3AF' }}><Bell size={18} /></button>
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 12px', border:'1px solid #EDE9FE', borderRadius:10 }}>
              <div style={{ width:26, height:26, borderRadius:'50%', background:'linear-gradient(135deg,#5B52D1,#8B80F9)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, fontWeight:700 }}>{(user?.name || 'A').charAt(0).toUpperCase()}</div>
              <div style={{ lineHeight:1.2 }}>
                <p style={{ fontSize:12.5, fontWeight:600, color:'#1E1B4B', margin:0 }}>{user?.name || 'Admin'}</p>
                <p style={{ fontSize:10, color:'#9CA3AF', margin:0 }}>{user?.roles?.[0] ?? 'ADMIN'}</p>
              </div>
            </div>
            <button onClick={() => { logout(); router.replace('/login'); }} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:10, border:'none', backgroundColor:'#FEF2F2', color:'#DC2626', fontSize:12.5, fontWeight:600, cursor:'pointer' }}>
              <LogOut size={14} /> Keluar
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth:1400, margin:'0 auto', padding:'32px 24px' }}>
        {/* HERO */}
        <div style={{ marginBottom:32 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:100, backgroundColor:'rgba(91,82,209,.1)', border:'1px solid rgba(91,82,209,.2)', color:'#5B52D1', fontSize:11.5, fontWeight:600, marginBottom:12 }}>
            <Shield size={11} /> Admin & Owner Access
          </div>
          <h1 style={{ fontSize:'2rem', fontWeight:800, color:'#1E1B4B', margin:'0 0 8px', letterSpacing:'-0.5px' }}>Selamat Datang, {user?.name?.split(' ')[0] || 'Admin'}!</h1>
          <p style={{ fontSize:14, color:'#6B7280', margin:0 }}>Pantau semua operasi bisnis dari satu dashboard terintegrasi.</p>
        </div>

        {/* QUICK STATS */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16, marginBottom:32 }}>
          {QUICK_STATS.map((stat) => (
            <div key={stat.label} style={{ backgroundColor:'#fff', borderRadius:16, border:'1px solid #EDE9FE', padding:20, boxShadow:'0 2px 8px rgba(91,82,209,.06)', display:'flex', alignItems:'flex-start', gap:14 }}>
              <div style={{ width:42, height:42, borderRadius:12, backgroundColor:`${stat.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <stat.icon size={18} style={{ color:stat.color }} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:11.5, color:'#9CA3AF', margin:'0 0 3px', fontWeight:500 }}>{stat.label}</p>
                <p style={{ fontSize:20, fontWeight:800, color:'#1E1B4B', margin:'0 0 3px', lineHeight:1 }}>{stat.value}</p>
                <p style={{ fontSize:11, color:stat.color, fontWeight:600, margin:0 }}>{stat.trend}</p>
              </div>
            </div>
          ))}
        </div>

        {/* MODULES GRID */}
        <div>
          <h2 style={{ fontSize:16, fontWeight:700, color:'#1E1B4B', marginBottom:16 }}>Modul ERP</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12 }}>
            {MODULES.map((mod) => (
              <button key={mod.href} onClick={() => router.push(mod.href)}
                style={{ padding:20, borderRadius:16, backgroundColor:'#fff', border:'1.5px solid #EDE9FE', cursor:'pointer', textAlign:'left', transition:'all .2s', display:'flex', flexDirection:'column', gap:12 }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = mod.color; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 24px ${mod.color}22`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#EDE9FE'; (e.currentTarget as HTMLButtonElement).style.transform = 'none'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}
              >
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ width:40, height:40, borderRadius:12, backgroundColor:mod.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <mod.icon size={18} style={{ color:mod.color }} />
                  </div>
                  <ArrowUpRight size={14} style={{ color:'#C4C9D4' }} />
                </div>
                <div>
                  <p style={{ fontSize:14, fontWeight:700, color:'#1E1B4B', margin:'0 0 3px' }}>{mod.label}</p>
                  <p style={{ fontSize:11.5, color:'#9CA3AF', margin:0 }}>{mod.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* APP LINKS */}
        <div style={{ marginTop:32 }}>
          <h2 style={{ fontSize:16, fontWeight:700, color:'#1E1B4B', marginBottom:16 }}>Aplikasi Terhubung</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:12 }}>
            {[
              { label:'Sales App', desc:'Tim Sales — Quotation & Order', port:3002, color:'#0891B2', icon:ShoppingCart },
              { label:'Gudang App', desc:'Staff Gudang — Barang & Stok', port:3003, color:'#D97706', icon:Package },
              { label:'Driver App', desc:'Driver — Pengiriman & Rute', port:3004, color:'#1D4ED8', icon:Truck },
              { label:'POS Kasir', desc:'Kasir — Transaksi & Sesi', port:3005, color:'#E64A19', icon:Monitor },
            ].map((app) => (
              <a key={app.label} href={`http://localhost:${app.port}`} target="_blank" rel="noreferrer"
                style={{ padding:16, borderRadius:14, backgroundColor:'#fff', border:'1.5px solid #EDE9FE', textDecoration:'none', display:'flex', alignItems:'center', gap:14, transition:'all .2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = app.color; (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 4px 16px ${app.color}22`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#EDE9FE'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'; }}
              >
                <div style={{ width:42, height:42, borderRadius:12, backgroundColor:`${app.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <app.icon size={18} style={{ color:app.color }} />
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13.5, fontWeight:700, color:'#1E1B4B', margin:'0 0 2px' }}>{app.label}</p>
                  <p style={{ fontSize:11.5, color:'#9CA3AF', margin:0 }}>{app.desc} · :{app.port}</p>
                </div>
                <ChevronRight size={14} style={{ color:'#C4C9D4' }} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
