'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/useAuthStore';
import api from '../../../lib/api';
import { ArrowLeft, MapPin, Package, Phone, Camera, CheckCircle, XCircle, Navigation, Clock } from 'lucide-react';

interface DeliveryDetail {
  id: string; soNumber: string; customerName: string; phone: string; address: string; items: { name: string; qty: number; unit: string; }[];
  status: string; distance?: string; notes?: string;
}

const APP_COLOR = '#1D4ED8';

export default function DeliveryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuthStore();
  const router = useRouter();
  const [delivery, setDelivery] = useState<DeliveryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => { if (!token) { router.replace('/login'); return; } }, [token]);
  useEffect(() => {
    api.get(`/delivery/tasks/${id}`).then(r => setDelivery(r.data)).catch(() => {
      setDelivery({
        id: id as string, soNumber:'SO-2024-001', customerName:'PT Maju Sejahtera', phone:'0812-3456-7890',
        address:'Jl. Sudirman No.45, Blok B2, Jakarta Pusat 10220', notes:'Hubungi security terlebih dahulu',
        status:'pending', distance:'4.2 km',
        items:[{ name:'Semen Portland 40kg', qty:10, unit:'sak' }, { name:'Besi Beton 10mm', qty:50, unit:'btg' }],
      });
    }).finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    try {
      await api.patch(`/delivery/tasks/${id}/status`, { status });
      setDelivery(prev => prev ? { ...prev, status } : prev);
    } catch { if (delivery) setDelivery({ ...delivery, status }); }
    finally { setUpdating(false); }
  };

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#EFF6FF' }}>
      <p style={{ color:'#9CA3AF' }}>Memuat detail pengiriman…</p>
    </div>
  );
  if (!delivery) return <div style={{ textAlign:'center', padding:40 }}><p>Pengiriman tidak ditemukan</p></div>;

  return (
    <div style={{ minHeight:'100vh', backgroundColor:'#EFF6FF' }}>
      <header style={{ background:`linear-gradient(135deg,${APP_COLOR},#3B82F6)`, padding:'14px 20px', display:'flex', alignItems:'center', gap:14 }}>
        <button onClick={() => router.back()} style={{ padding:8, border:'none', background:'rgba(255,255,255,.15)', borderRadius:8, cursor:'pointer', color:'#fff', display:'flex' }}><ArrowLeft size={18} /></button>
        <h1 style={{ fontSize:16, fontWeight:700, color:'#fff', margin:0, flex:1 }}>Detail Pengiriman</h1>
        <span style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,.8)' }}>{delivery.soNumber}</span>
      </header>

      <div style={{ padding:16, maxWidth:600, margin:'0 auto' }}>
        {/* Customer Card */}
        <div style={{ backgroundColor:'#fff', borderRadius:16, padding:20, marginBottom:14, boxShadow:'0 2px 12px rgba(29,78,216,.08)' }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:'#1E3A5F', margin:'0 0 14px' }}>Informasi Penerima</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:8, backgroundColor:'rgba(29,78,216,.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <MapPin size={15} style={{ color:APP_COLOR }} />
              </div>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:'#1E3A5F', margin:'0 0 2px' }}>{delivery.customerName}</p>
                <p style={{ fontSize:12.5, color:'#6B7280', margin:0, lineHeight:1.5 }}>{delivery.address}</p>
              </div>
            </div>
            {delivery.phone && (
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:8, backgroundColor:'rgba(29,78,216,.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Phone size={15} style={{ color:APP_COLOR }} />
                </div>
                <p style={{ fontSize:13, color:'#6B7280', margin:0 }}>{delivery.phone}</p>
              </div>
            )}
            {delivery.distance && (
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:8, backgroundColor:'rgba(29,78,216,.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Navigation size={15} style={{ color:APP_COLOR }} />
                </div>
                <p style={{ fontSize:13, color:'#6B7280', margin:0 }}>Jarak: {delivery.distance}</p>
              </div>
            )}
          </div>
          {delivery.notes && (
            <div style={{ marginTop:12, padding:10, borderRadius:10, backgroundColor:'#FFF7ED', border:'1px solid #FED7AA' }}>
              <p style={{ fontSize:12, color:'#92400E', margin:0 }}>⚠ Catatan: {delivery.notes}</p>
            </div>
          )}
        </div>

        {/* Items */}
        <div style={{ backgroundColor:'#fff', borderRadius:16, padding:20, marginBottom:14, boxShadow:'0 2px 12px rgba(29,78,216,.08)' }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:'#1E3A5F', margin:'0 0 14px', display:'flex', alignItems:'center', gap:8 }}>
            <Package size={15} style={{ color:APP_COLOR }} /> Daftar Barang ({delivery.items.length})
          </h3>
          {delivery.items.map((item, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom: i < delivery.items.length - 1 ? '1px solid #F0F9FF' : 'none' }}>
              <p style={{ fontSize:13, color:'#374151', margin:0 }}>{item.name}</p>
              <span style={{ fontSize:13, fontWeight:700, color:'#1E3A5F' }}>{item.qty} {item.unit}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        {delivery.status !== 'delivered' && delivery.status !== 'failed' && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {delivery.status === 'pending' && (
              <button onClick={() => updateStatus('on_way')} disabled={updating}
                style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background:`linear-gradient(135deg,${APP_COLOR},#3B82F6)`, color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                <Navigation size={18} /> Mulai Pengiriman
              </button>
            )}
            {delivery.status === 'on_way' && (<>
              <button onClick={() => router.push(`/delivery/${id}/upload-bukti`)}
                style={{ width:'100%', padding:'14px', borderRadius:14, border:`2px solid ${APP_COLOR}`, background:'#fff', color:APP_COLOR, fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                <Camera size={18} /> Upload Bukti Kirim
              </button>
              <button onClick={() => updateStatus('delivered')} disabled={updating}
                style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background:'linear-gradient(135deg,#16A34A,#22C55E)', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                <CheckCircle size={18} /> Konfirmasi Terkirim
              </button>
              <button onClick={() => updateStatus('failed')} disabled={updating}
                style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', backgroundColor:'#FEF2F2', color:'#DC2626', fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                <XCircle size={16} /> Tandai Gagal
              </button>
            </>)}
          </div>
        )}

        {delivery.status === 'delivered' && (
          <div style={{ padding:20, borderRadius:14, backgroundColor:'#DCFCE7', border:'1px solid #BBF7D0', textAlign:'center' }}>
            <CheckCircle size={32} style={{ color:'#16A34A', margin:'0 auto 8px', display:'block' }} />
            <p style={{ fontSize:14, fontWeight:700, color:'#15803D', margin:0 }}>Pengiriman Berhasil!</p>
          </div>
        )}
        {delivery.status === 'failed' && (
          <div style={{ padding:20, borderRadius:14, backgroundColor:'#FEF2F2', border:'1px solid #FECACA', textAlign:'center' }}>
            <XCircle size={32} style={{ color:'#DC2626', margin:'0 auto 8px', display:'block' }} />
            <p style={{ fontSize:14, fontWeight:700, color:'#DC2626', margin:0 }}>Pengiriman Gagal</p>
          </div>
        )}
      </div>
    </div>
  );
}
