'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/useAuthStore';
import api from '../lib/api';
import {
  Truck, MapPin, CheckCircle, Clock, Camera, FileText,
  Package, Bell, LogOut, ChevronRight, Navigation,
} from 'lucide-react';

const APP_COLOR = '#1D4ED8';

interface Delivery {
  id: string; customerName: string; address: string; items: number;
  status: 'pending' | 'on_way' | 'delivered' | 'failed';
  time: string; distance?: string;
}

const STATUS_MAP = {
  pending:   { label:'Menunggu', color:'#F59E0B', bg:'rgba(245,158,11,.12)' },
  on_way:    { label:'Dalam Perjalanan', color:'#3B82F6', bg:'rgba(59,130,246,.12)' },
  delivered: { label:'Terkirim', color:'#16A34A', bg:'rgba(22,163,74,.12)' },
  failed:    { label:'Gagal', color:'#DC2626', bg:'rgba(220,38,38,.12)' },
};

export default function DriverHomePage() {
  const { token, user, loadProfile, logout } = useAuthStore();
  const router = useRouter();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!token) { router.replace('/login'); return; }
    const init = async () => {
      if (!user) await loadProfile().catch(() => { logout(); router.replace('/login'); });
      try {
        const res = await api.get('/delivery/my-tasks');
        setDeliveries(res.data ?? []);
      } catch {
        setDeliveries([
          { id:'DEL-001', customerName:'PT Maju Sejahtera', address:'Jl. Sudirman No.45, Jakarta', items:3, status:'pending', time:'08:30', distance:'4.2 km' },
          { id:'DEL-002', customerName:'CV Berkah Jaya', address:'Jl. Thamrin No.12, Jakarta', items:5, status:'on_way', time:'10:00', distance:'7.8 km' },
          { id:'DEL-003', customerName:'Toko Bangunan Sejuk', address:'Jl. Gatot Subroto No.78', items:2, status:'delivered', time:'11:30', distance:'2.1 km' },
          { id:'DEL-004', customerName:'UD Subur Makmur', address:'Jl. HR Rasuna Said No.22', items:8, status:'pending', time:'14:00', distance:'5.5 km' },
        ]);
      }
      setLoading(false);
      setTimeout(() => setMounted(true), 60);
    };
    init();
  }, [token]);

  if (!token || loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#EFF6FF' }}>
      <svg style={{ width:28, height:28, animation:'spin .8s linear infinite', color:APP_COLOR }} viewBox="0 0 24 24" fill="none">
        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
        <circle opacity=".2" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path opacity=".8" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
      </svg>
    </div>
  );

  const counts = { total: deliveries.length, delivered: deliveries.filter(d => d.status === 'delivered').length, onWay: deliveries.filter(d => d.status === 'on_way').length, pending: deliveries.filter(d => d.status === 'pending').length };

  return (
    <div style={{ minHeight:'100vh', backgroundColor:'#EFF6FF', opacity: mounted ? 1 : 0, transition:'opacity .4s' }}>
      {/* HEADER */}
      <header style={{ background:`linear-gradient(135deg,${APP_COLOR},#3B82F6)`, padding:'20px 20px 80px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', backgroundColor:'rgba(255,255,255,.08)' }} />
        <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div>
            <p style={{ fontSize:12, color:'rgba(255,255,255,.65)', margin:'0 0 3px' }}>Selamat datang,</p>
            <h1 style={{ fontSize:18, fontWeight:700, color:'#fff', margin:0 }}>{user?.name || 'Driver'}</h1>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button style={{ padding:8, border:'none', background:'rgba(255,255,255,.15)', borderRadius:10, cursor:'pointer', color:'#fff', display:'flex' }}><Bell size={18} /></button>
            <button onClick={() => { logout(); router.replace('/login'); }} style={{ padding:8, border:'none', background:'rgba(255,255,255,.15)', borderRadius:10, cursor:'pointer', color:'#fff', display:'flex' }}><LogOut size={18} /></button>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
          {[
            { label:'Total Tugas', value:counts.total, color:'#BFDBFE' },
            { label:'Terkirim', value:counts.delivered, color:'#86EFAC' },
            { label:'Pending', value:counts.pending, color:'#FDE68A' },
          ].map(s => (
            <div key={s.label} style={{ backgroundColor:'rgba(255,255,255,.15)', borderRadius:14, padding:'12px', textAlign:'center', backdropFilter:'blur(10px)' }}>
              <p style={{ fontSize:22, fontWeight:800, color:'#fff', margin:'0 0 3px' }}>{s.value}</p>
              <p style={{ fontSize:10.5, color:'rgba(255,255,255,.7)', margin:0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </header>

      {/* DELIVERIES */}
      <div style={{ padding:'0 16px', marginTop:-50, position:'relative' }}>
        <div style={{ backgroundColor:'#fff', borderRadius:20, boxShadow:'0 8px 32px rgba(29,78,216,.1)', overflow:'hidden' }}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid #EFF6FF', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <h2 style={{ fontSize:15, fontWeight:700, color:'#1E3A5F', margin:0 }}>Tugas Pengiriman Hari Ini</h2>
            <span style={{ fontSize:12, color:APP_COLOR, fontWeight:600 }}>{deliveries.length} tugas</span>
          </div>
          <div>
            {deliveries.map((d, i) => {
              const status = STATUS_MAP[d.status];
              return (
                <button key={d.id} onClick={() => router.push(`/delivery/${d.id}`)}
                  style={{ width:'100%', padding:'16px 20px', border:'none', background:'transparent', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'flex-start', gap:14, borderBottom: i < deliveries.length-1 ? '1px solid #F0F9FF' : 'none', transition:'background .15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F0F9FF'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
                >
                  <div style={{ width:44, height:44, borderRadius:12, backgroundColor:`${APP_COLOR}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Truck size={18} style={{ color:APP_COLOR }} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                      <p style={{ fontSize:13.5, fontWeight:700, color:'#1E3A5F', margin:0 }}>{d.customerName}</p>
                      <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:100, color:status.color, backgroundColor:status.bg }}>{status.label}</span>
                    </div>
                    <p style={{ fontSize:12, color:'#6B7280', margin:'0 0 6px', display:'flex', alignItems:'center', gap:4 }}>
                      <MapPin size={11} /> {d.address}
                    </p>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <span style={{ fontSize:11, color:'#9CA3AF', display:'flex', alignItems:'center', gap:4 }}><Package size={11} /> {d.items} item</span>
                      <span style={{ fontSize:11, color:'#9CA3AF', display:'flex', alignItems:'center', gap:4 }}><Clock size={11} /> {d.time}</span>
                      {d.distance && <span style={{ fontSize:11, color:'#9CA3AF', display:'flex', alignItems:'center', gap:4 }}><Navigation size={11} /> {d.distance}</span>}
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color:'#C4C9D4', flexShrink:0, marginTop:4 }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div style={{ marginTop:20, display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12, paddingBottom:24 }}>
          {[
            { label:'Upload Bukti', icon:Camera, color:'#8B5CF6', href:'/upload-bukti' },
            { label:'Tanda Tangan', icon:FileText, color:'#10B981', href:'/signature' },
            { label:'Laporan Harian', icon:CheckCircle, color:'#F59E0B', href:'/reports' },
            { label:'Riwayat', icon:Clock, color:'#6B7280', href:'/history' },
          ].map(a => (
            <button key={a.href} onClick={() => router.push(a.href)}
              style={{ padding:'16px', borderRadius:16, backgroundColor:'#fff', border:'1.5px solid #EFF6FF', cursor:'pointer', display:'flex', alignItems:'center', gap:12, transition:'all .2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = a.color; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 16px ${a.color}22`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#EFF6FF'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}
            >
              <div style={{ width:40, height:40, borderRadius:12, backgroundColor:`${a.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <a.icon size={16} style={{ color:a.color }} />
              </div>
              <span style={{ fontSize:13, fontWeight:600, color:'#1E3A5F' }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
