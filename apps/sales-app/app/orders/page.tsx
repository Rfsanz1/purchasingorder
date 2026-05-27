'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/useAuthStore';
import api from '../../lib/api';
import { ShoppingCart, Search, Filter, ArrowLeft, ArrowUpRight, Clock, CheckCircle, XCircle, Truck, Plus } from 'lucide-react';

interface Order { id: string; orderNumber: string; customerName: string; total: number; status: string; createdAt: string; itemCount: number; }

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  DRAFT:      { label:'Draft', color:'#6B7280', bg:'rgba(107,114,128,.12)', icon: Clock },
  PENDING:    { label:'Menunggu', color:'#F59E0B', bg:'rgba(245,158,11,.12)', icon: Clock },
  CONFIRMED:  { label:'Dikonfirmasi', color:'#3B82F6', bg:'rgba(59,130,246,.12)', icon: CheckCircle },
  PROCESSING: { label:'Diproses', color:'#8B5CF6', bg:'rgba(139,92,246,.12)', icon: Truck },
  SHIPPED:    { label:'Dikirim', color:'#0891B2', bg:'rgba(8,145,178,.12)', icon: Truck },
  DELIVERED:  { label:'Terkirim', color:'#16A34A', bg:'rgba(22,163,74,.12)', icon: CheckCircle },
  CANCELLED:  { label:'Dibatalkan', color:'#DC2626', bg:'rgba(220,38,38,.12)', icon: XCircle },
};

const DEMO_ORDERS: Order[] = [
  { id:'1', orderNumber:'SO-2024-001', customerName:'PT Maju Sejahtera', total:3250000, status:'CONFIRMED', createdAt:'2024-01-15', itemCount:5 },
  { id:'2', orderNumber:'SO-2024-002', customerName:'CV Berkah Jaya', total:1875000, status:'PROCESSING', createdAt:'2024-01-14', itemCount:3 },
  { id:'3', orderNumber:'SO-2024-003', customerName:'Toko Bangunan Sejuk', total:950000, status:'DELIVERED', createdAt:'2024-01-13', itemCount:2 },
  { id:'4', orderNumber:'SO-2024-004', customerName:'UD Subur Makmur', total:5100000, status:'PENDING', createdAt:'2024-01-12', itemCount:8 },
  { id:'5', orderNumber:'SO-2024-005', customerName:'PT Karya Abadi', total:2200000, status:'DRAFT', createdAt:'2024-01-11', itemCount:4 },
];

export default function OrdersPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => { if (!token) { router.replace('/login'); return; } }, [token]);

  useEffect(() => {
    api.get('/sales/orders').then(r => {
      setOrders(r.data?.data ?? r.data ?? []);
    }).catch(() => setOrders(DEMO_ORDERS)).finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter(o =>
    (filterStatus === 'ALL' || o.status === filterStatus) &&
    (o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ minHeight:'100vh', backgroundColor:'#F0FAFE' }}>
      <header style={{ backgroundColor:'#fff', borderBottom:'1px solid #E0F7FA', padding:'14px 20px', display:'flex', alignItems:'center', gap:14, position:'sticky', top:0, zIndex:30 }}>
        <button onClick={() => router.back()} style={{ padding:8, border:'none', background:'none', cursor:'pointer', color:'#9CA3AF' }}><ArrowLeft size={18} /></button>
        <ShoppingCart size={18} style={{ color:'#0891B2' }} />
        <h1 style={{ fontSize:16, fontWeight:700, color:'#0C4A6E', margin:0, flex:1 }}>Sales Order</h1>
        <button onClick={() => router.push('/smart-order')} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:10, border:'none', backgroundColor:'#0891B2', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>
          <Plus size={14} /> Order Baru
        </button>
      </header>

      <div style={{ maxWidth:960, margin:'0 auto', padding:20 }}>
        <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1, minWidth:220 }}>
            <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari order / pelanggan…"
              style={{ width:'100%', padding:'9px 12px 9px 36px', borderRadius:12, border:'1.5px solid #E0F7FA', outline:'none', fontSize:13.5, boxSizing:'border-box' }} />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ padding:'9px 14px', borderRadius:12, border:'1.5px solid #E0F7FA', outline:'none', fontSize:13, cursor:'pointer' }}>
            <option value="ALL">Semua Status</option>
            {Object.entries(STATUS_STYLES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>

        {loading ? <p style={{ textAlign:'center', color:'#9CA3AF', fontSize:13.5 }}>Memuat order…</p>
          : filtered.length === 0 ? <p style={{ textAlign:'center', color:'#9CA3AF', fontSize:13.5, marginTop:40 }}>Tidak ada order ditemukan</p>
          : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {filtered.map(order => {
              const statusStyle = STATUS_STYLES[order.status] ?? STATUS_STYLES.PENDING;
              const StatusIcon = statusStyle.icon;
              return (
                <div key={order.id}
                  style={{ backgroundColor:'#fff', borderRadius:14, border:'1.5px solid #E0F7FA', padding:'16px 20px', display:'flex', alignItems:'center', gap:16, cursor:'pointer', transition:'all .2s' }}
                  onClick={() => router.push(`/orders/${order.id}`)}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#0891B2'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(8,145,178,.1)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#E0F7FA'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
                >
                  <div style={{ width:44, height:44, borderRadius:12, backgroundColor:'rgba(8,145,178,.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <ShoppingCart size={18} style={{ color:'#0891B2' }} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                      <span style={{ fontSize:13.5, fontWeight:700, color:'#0C4A6E' }}>{order.orderNumber}</span>
                      <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:100, color:statusStyle.color, backgroundColor:statusStyle.bg, display:'flex', alignItems:'center', gap:4 }}>
                        <StatusIcon size={10} /> {statusStyle.label}
                      </span>
                    </div>
                    <p style={{ fontSize:12.5, color:'#6B7280', margin:'0 0 3px' }}>{order.customerName}</p>
                    <p style={{ fontSize:11.5, color:'#9CA3AF', margin:0 }}>{order.itemCount} item · {new Date(order.createdAt).toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' })}</p>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <p style={{ fontSize:16, fontWeight:800, color:'#0C4A6E', margin:'0 0 4px' }}>Rp {order.total.toLocaleString('id-ID')}</p>
                    <ArrowUpRight size={14} style={{ color:'#9CA3AF' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
