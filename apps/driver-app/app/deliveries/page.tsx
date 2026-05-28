'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/useAuthStore';
import api from '../../lib/api';
import BottomNav from '../../components/BottomNav';
import { Truck, MapPin, Package, Clock, Navigation, ChevronRight, RefreshCw } from 'lucide-react';

const C = '#475569';

type Status = 'assigned' | 'on_the_way' | 'arrived' | 'delivered' | 'failed';

interface Delivery {
  id: string; customerName: string; address: string; items: number;
  status: Status; time: string; distance?: string; date?: string;
}

const STATUS_MAP: Record<Status, { label: string; color: string; bg: string }> = {
  assigned:   { label:'Menunggu', color:'#F59E0B', bg:'rgba(245,158,11,.12)' },
  on_the_way: { label:'Dalam Jalan', color:'#3B82F6', bg:'rgba(59,130,246,.12)' },
  arrived:    { label:'Sudah Tiba', color:'#8B5CF6', bg:'rgba(139,92,246,.12)' },
  delivered:  { label:'Selesai', color:'#16A34A', bg:'rgba(22,163,74,.12)' },
  failed:     { label:'Gagal', color:'#DC2626', bg:'rgba(220,38,38,.12)' },
};

const TODAY: Delivery[] = [
  { id:'DEL-001', customerName:'PT Maju Sejahtera', address:'Jl. Sudirman No.45, Jakarta', items:3, status:'assigned', time:'08:30', distance:'4.2 km' },
  { id:'DEL-002', customerName:'CV Berkah Jaya', address:'Jl. Thamrin No.12, Jakarta', items:5, status:'on_the_way', time:'10:00', distance:'7.8 km' },
  { id:'DEL-003', customerName:'Toko Bangunan Sejuk', address:'Jl. Gatot Subroto No.78', items:2, status:'delivered', time:'11:30', distance:'2.1 km' },
  { id:'DEL-004', customerName:'UD Subur Makmur', address:'Jl. HR Rasuna Said No.22', items:8, status:'assigned', time:'14:00', distance:'5.5 km' },
];

const UPCOMING: Delivery[] = [
  { id:'DEL-005', customerName:'PT Sentosa Indah', address:'Jl. Kenangan No.10, Depok', items:4, status:'assigned', time:'Besok 09:00', distance:'12 km' },
  { id:'DEL-006', customerName:'CV Mandiri Jaya', address:'Jl. Permata No.7, Bekasi', items:6, status:'assigned', time:'Besok 11:00', distance:'18 km' },
];

export default function DeliveriesPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [tab, setTab] = useState<'today' | 'upcoming' | 'done'>('today');
  const [todayList, setTodayList] = useState<Delivery[]>(TODAY);
  const [upcomingList] = useState<Delivery[]>(UPCOMING);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!token) { router.replace('/login'); return; }
    fetchDeliveries().finally(() => setLoading(false));
  }, [token]);

  const fetchDeliveries = async () => {
    try {
      const res = await api.get('/delivery/my-tasks');
      if (res.data?.length) setTodayList(res.data);
    } catch {}
  };

  const refresh = async () => {
    setRefreshing(true);
    await fetchDeliveries();
    setTimeout(() => setRefreshing(false), 600);
  };

  const doneList = todayList.filter(d => d.status === 'delivered' || d.status === 'failed');
  const displayList = tab === 'today' ? todayList.filter(d => !['delivered','failed'].includes(d.status))
    : tab === 'upcoming' ? upcomingList : doneList;

  const DeliveryCard = ({ d }: { d: Delivery }) => {
    const st = STATUS_MAP[d.status];
    return (
      <button onClick={() => router.push(`/delivery/${d.id}`)}
        style={{ width:'100%', padding:'14px 16px', border:'none', background:'#fff', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'flex-start', gap:12, borderRadius:14, marginBottom:10, boxShadow:'0 2px 12px rgba(71,85,105,.08)' }}>
        <div style={{ width:44, height:44, borderRadius:12, backgroundColor:`${C}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Truck size={18} style={{ color:C }}/>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
            <p style={{ fontSize:13.5, fontWeight:700, color:'#1E293B', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:160 }}>{d.customerName}</p>
            <span style={{ fontSize:10.5, fontWeight:600, padding:'2px 8px', borderRadius:100, color:st.color, backgroundColor:st.bg, flexShrink:0 }}>{st.label}</span>
          </div>
          <p style={{ fontSize:11.5, color:'#64748B', margin:'0 0 6px', display:'flex', alignItems:'center', gap:3 }}>
            <MapPin size={10}/> {d.address}
          </p>
          <div style={{ display:'flex', gap:10 }}>
            <span style={{ fontSize:11, color:'#94A3B8', display:'flex', alignItems:'center', gap:3 }}><Package size={10}/> {d.items} item</span>
            <span style={{ fontSize:11, color:'#94A3B8', display:'flex', alignItems:'center', gap:3 }}><Clock size={10}/> {d.time}</span>
            {d.distance && <span style={{ fontSize:11, color:'#94A3B8', display:'flex', alignItems:'center', gap:3 }}><Navigation size={10}/> {d.distance}</span>}
          </div>
        </div>
        <ChevronRight size={16} style={{ color:'#CBD5E1', marginTop:4 }}/>
      </button>
    );
  };

  return (
    <div style={{ minHeight:'100vh', backgroundColor:'#F8FAFC', paddingBottom:80, fontFamily:'Inter,sans-serif', maxWidth:430, margin:'0 auto' }}>
      <div style={{ background:`linear-gradient(135deg,#334155,${C})`, padding:'20px 20px 16px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <h1 style={{ fontSize:18, fontWeight:800, color:'#fff', margin:0 }}>Semua Pengiriman</h1>
          <button onClick={refresh} style={{ padding:8, border:'none', background:'rgba(255,255,255,.15)', borderRadius:10, cursor:'pointer', color:'#fff', display:'flex' }}>
            <RefreshCw size={16} style={{ animation: refreshing ? 'spin .6s linear infinite' : 'none' }}/>
            <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
          </button>
        </div>
        {/* Tabs */}
        <div style={{ display:'flex', gap:6 }}>
          {([
            { key:'today', label:`Hari Ini (${todayList.filter(d=>!['delivered','failed'].includes(d.status)).length})` },
            { key:'upcoming', label:'Mendatang' },
            { key:'done', label:`Selesai (${doneList.length})` },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ padding:'7px 14px', borderRadius:100, border:'none', cursor:'pointer', fontSize:12.5, fontWeight:600,
                backgroundColor: tab===t.key ? '#fff' : 'rgba(255,255,255,.15)',
                color: tab===t.key ? C : 'rgba(255,255,255,.8)' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:'16px 16px 0' }}>
        {loading ? (
          <div style={{ textAlign:'center', padding:40, color:'#94A3B8' }}>Memuat…</div>
        ) : displayList.length === 0 ? (
          <div style={{ textAlign:'center', padding:40, color:'#94A3B8' }}>
            <Truck size={36} style={{ margin:'0 auto 10px', display:'block', opacity:.3 }}/>
            <p style={{ fontSize:14, fontWeight:600, margin:0 }}>Tidak ada pengiriman</p>
          </div>
        ) : (
          displayList.map(d => <DeliveryCard key={d.id} d={d}/>)
        )}
      </div>

      <BottomNav/>
    </div>
  );
}
