'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/useAuthStore';
import api from '../../lib/api';
import { ClipboardList, Search, ArrowLeft, CheckCircle, Clock, ArrowRight, Package } from 'lucide-react';

interface PickingOrder { id: string; soNumber: string; customerName: string; itemCount: number; status: string; priority: string; dueTime: string; }

const DEMO: PickingOrder[] = [
  { id:'1', soNumber:'SO-2024-001', customerName:'PT Maju Sejahtera', itemCount:5, status:'PENDING', priority:'HIGH', dueTime:'10:00' },
  { id:'2', soNumber:'SO-2024-002', customerName:'CV Berkah Jaya', itemCount:3, status:'IN_PROGRESS', priority:'NORMAL', dueTime:'11:30' },
  { id:'3', soNumber:'SO-2024-003', customerName:'Toko Bangunan Sejuk', itemCount:8, status:'COMPLETED', priority:'NORMAL', dueTime:'09:00' },
  { id:'4', soNumber:'SO-2024-004', customerName:'UD Subur Makmur', itemCount:2, status:'PENDING', priority:'URGENT', dueTime:'08:30' },
];

export default function PickingPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<PickingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { if (!token) { router.replace('/login'); return; } }, [token]);
  useEffect(() => {
    api.get('/inventory/picking-orders').then(r => setOrders(r.data ?? [])).catch(() => setOrders(DEMO)).finally(() => setLoading(false));
  }, []);

  const STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
    PENDING:     { label:'Menunggu', color:'#F59E0B', bg:'rgba(245,158,11,.12)' },
    IN_PROGRESS: { label:'Sedang Dipicking', color:'#3B82F6', bg:'rgba(59,130,246,.12)' },
    COMPLETED:   { label:'Selesai', color:'#16A34A', bg:'rgba(22,163,74,.12)' },
  };
  const PRIORITY_STYLE: Record<string, { label: string; color: string }> = {
    URGENT: { label:'URGENT', color:'#DC2626' },
    HIGH:   { label:'HIGH', color:'#F59E0B' },
    NORMAL: { label:'NORMAL', color:'#6B7280' },
  };

  const filtered = orders.filter(o =>
    o.soNumber.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight:'100vh', backgroundColor:'#FFFBEB' }}>
      <header style={{ backgroundColor:'#fff', borderBottom:'1px solid #FEF3C7', padding:'14px 20px', display:'flex', alignItems:'center', gap:14, position:'sticky', top:0, zIndex:30 }}>
        <button onClick={() => router.back()} style={{ padding:8, border:'none', background:'none', cursor:'pointer', color:'#9CA3AF' }}><ArrowLeft size={18} /></button>
        <ClipboardList size={18} style={{ color:'#D97706' }} />
        <h1 style={{ fontSize:16, fontWeight:700, color:'#78350F', margin:0, flex:1 }}>Picking Order</h1>
        <span style={{ fontSize:12, color:'#D97706', fontWeight:600 }}>{orders.filter(o => o.status !== 'COMPLETED').length} aktif</span>
      </header>

      <div style={{ maxWidth:720, margin:'0 auto', padding:20 }}>
        <div style={{ position:'relative', marginBottom:16 }}>
          <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nomor SO / pelanggan…"
            style={{ width:'100%', padding:'9px 12px 9px 36px', borderRadius:12, border:'1.5px solid #FEF3C7', outline:'none', fontSize:13.5, boxSizing:'border-box' }} />
        </div>

        {loading ? <p style={{ textAlign:'center', color:'#9CA3AF' }}>Memuat…</p> : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {filtered.map(order => {
              const ss = STATUS_STYLE[order.status] ?? STATUS_STYLE.PENDING;
              const ps = PRIORITY_STYLE[order.priority] ?? PRIORITY_STYLE.NORMAL;
              return (
                <div key={order.id} onClick={() => router.push(`/picking/${order.id}`)}
                  style={{ backgroundColor:'#fff', borderRadius:14, border:'1.5px solid #FEF3C7', padding:'16px 20px', display:'flex', alignItems:'center', gap:16, cursor:'pointer', transition:'all .2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#D97706'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(217,119,6,.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#FEF3C7'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
                >
                  <div style={{ width:44, height:44, borderRadius:12, backgroundColor:'rgba(217,119,6,.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {order.status === 'COMPLETED' ? <CheckCircle size={20} style={{ color:'#16A34A' }} /> : <Package size={20} style={{ color:'#D97706' }} />}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                      <span style={{ fontSize:13.5, fontWeight:700, color:'#78350F' }}>{order.soNumber}</span>
                      <span style={{ fontSize:10, fontWeight:700, color:ps.color }}>{ps.label}</span>
                      <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:100, color:ss.color, backgroundColor:ss.bg }}>{ss.label}</span>
                    </div>
                    <p style={{ fontSize:12.5, color:'#6B7280', margin:'0 0 3px' }}>{order.customerName}</p>
                    <p style={{ fontSize:11.5, color:'#9CA3AF', margin:0, display:'flex', alignItems:'center', gap:8 }}>
                      <span><Package size={10} /> {order.itemCount} item</span>
                      <span><Clock size={10} /> Batas: {order.dueTime}</span>
                    </p>
                  </div>
                  <ArrowRight size={16} style={{ color:'#C4C9D4', flexShrink:0 }} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
