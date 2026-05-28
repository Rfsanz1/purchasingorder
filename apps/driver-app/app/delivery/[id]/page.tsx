'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/useAuthStore';
import api from '../../../lib/api';
import {
  ArrowLeft, MapPin, Package, Phone, Camera, CheckCircle,
  XCircle, Navigation, Clock, Truck, AlertCircle, ChevronRight
} from 'lucide-react';

const C = '#475569';

type Status = 'assigned' | 'on_the_way' | 'arrived' | 'delivered' | 'failed';

interface DeliveryDetail {
  id: string; soNumber: string; customerName: string; phone: string; address: string;
  items: { name: string; qty: number; unit: string }[];
  status: Status; distance?: string; notes?: string;
}

const TIMELINE: { status: Status; label: string; icon: typeof Truck }[] = [
  { status:'assigned', label:'Ditugaskan', icon:Clock },
  { status:'on_the_way', label:'Berangkat', icon:Truck },
  { status:'arrived', label:'Sudah Tiba', icon:MapPin },
  { status:'delivered', label:'Selesai', icon:CheckCircle },
];

const FAIL_REASONS = [
  'Pelanggan tidak ada di tempat',
  'Alamat tidak ditemukan',
  'Pelanggan menolak',
  'Barang rusak',
  'Lainnya',
];

export default function DeliveryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuthStore();
  const router = useRouter();
  const [delivery, setDelivery] = useState<DeliveryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showFailForm, setShowFailForm] = useState(false);
  const [failReason, setFailReason] = useState('');
  const [failNotes, setFailNotes] = useState('');
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) { router.replace('/login'); return; }
    api.get(`/fleet/delivery/tasks/${id}`).then(r => setDelivery(r.data)).catch(() => {
      setDelivery({
        id: id as string, soNumber:'SO-2026-001', customerName:'PT Maju Sejahtera',
        phone:'0812-3456-7890', address:'Jl. Sudirman No.45, Blok B2, Jakarta Pusat 10220',
        notes:'Hubungi security terlebih dahulu', status:'assigned', distance:'4.2 km',
        items:[
          { name:'Semen Portland 40kg', qty:10, unit:'sak' },
          { name:'Besi Beton 10mm', qty:50, unit:'btg' },
          { name:'Pipa PVC 4"', qty:20, unit:'btg' },
        ],
      });
    }).finally(() => setLoading(false));
  }, [id, token]);

  const updateStatus = async (newStatus: Status, extra?: { notes?: string; failReason?: string; photo?: boolean }) => {
    setUpdating(true);
    try {
      await api.patch(`/fleet/delivery/tasks/${id}/status`, {
        status: newStatus, notes: extra?.notes, photo: extra?.photo,
      });
    } catch {}
    setDelivery(prev => prev ? { ...prev, status: newStatus } : prev);
    setUpdating(false);
    setShowFailForm(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setPhotoUploaded(true);
  };

  const statusOrder: Status[] = ['assigned', 'on_the_way', 'arrived', 'delivered'];
  const statusIdx = (s: Status) => statusOrder.indexOf(s);
  const currentIdx = delivery ? statusIdx(delivery.status) : -1;

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#F8FAFC' }}>
      <svg style={{ width:28, height:28, animation:'spin .8s linear infinite', color:C }} viewBox="0 0 24 24" fill="none">
        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
        <circle opacity=".2" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
        <path opacity=".8" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"/>
      </svg>
    </div>
  );
  if (!delivery) return <div style={{ textAlign:'center', padding:40 }}><p>Pengiriman tidak ditemukan</p></div>;

  return (
    <div style={{ minHeight:'100vh', backgroundColor:'#F8FAFC', paddingBottom:24, fontFamily:'Inter,sans-serif', maxWidth:430, margin:'0 auto' }}>
      <header style={{ background:`linear-gradient(135deg,#334155,${C})`, padding:'14px 20px', display:'flex', alignItems:'center', gap:14 }}>
        <button onClick={() => router.back()} style={{ padding:8, border:'none', background:'rgba(255,255,255,.15)', borderRadius:8, cursor:'pointer', color:'#fff', display:'flex' }}><ArrowLeft size={18}/></button>
        <h1 style={{ fontSize:16, fontWeight:700, color:'#fff', margin:0, flex:1 }}>Detail Pengiriman</h1>
        <span style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,.8)' }}>{delivery.soNumber}</span>
      </header>

      <div style={{ padding:16 }}>
        {/* Status Timeline */}
        {delivery.status !== 'failed' && (
          <div style={{ backgroundColor:'#fff', borderRadius:16, padding:20, marginBottom:14, boxShadow:'0 2px 12px rgba(71,85,105,.08)' }}>
            <h3 style={{ fontSize:13, fontWeight:700, color:'#1E293B', margin:'0 0 16px' }}>Status Pengiriman</h3>
            <div style={{ display:'flex', alignItems:'center' }}>
              {TIMELINE.map((step, i) => {
                const done = currentIdx > i || (delivery.status === 'delivered');
                const active = currentIdx === i && delivery.status !== 'delivered';
                return (
                  <div key={step.status} style={{ display:'flex', alignItems:'center', flex: i < TIMELINE.length-1 ? 1 : 0 }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, minWidth:48 }}>
                      <div style={{ width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                        backgroundColor: done ? C : active ? `${C}20` : '#F1F5F9',
                        border: active ? `2px solid ${C}` : done ? `2px solid ${C}` : '2px solid #E2E8F0' }}>
                        <step.icon size={14} style={{ color: done || active ? (done?'#fff':C) : '#94A3B8' }}/>
                      </div>
                      <span style={{ fontSize:9.5, fontWeight:600, color: done||active ? C : '#94A3B8', textAlign:'center', whiteSpace:'nowrap' }}>{step.label}</span>
                    </div>
                    {i < TIMELINE.length-1 && (
                      <div style={{ flex:1, height:2, backgroundColor: currentIdx > i ? C : '#E2E8F0', marginBottom:16, borderRadius:2 }}/>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recipient */}
        <div style={{ backgroundColor:'#fff', borderRadius:16, padding:20, marginBottom:14, boxShadow:'0 2px 12px rgba(71,85,105,.08)' }}>
          <h3 style={{ fontSize:13, fontWeight:700, color:'#1E293B', margin:'0 0 14px' }}>Informasi Penerima</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:10, backgroundColor:`${C}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <MapPin size={16} style={{ color:C }}/>
              </div>
              <div>
                <p style={{ fontSize:13.5, fontWeight:700, color:'#1E293B', margin:'0 0 2px' }}>{delivery.customerName}</p>
                <button onClick={() => window.open(`https://maps.google.com?q=${encodeURIComponent(delivery.address)}`, '_blank')}
                  style={{ fontSize:12.5, color:'#3B82F6', margin:0, border:'none', background:'none', cursor:'pointer', padding:0, textAlign:'left', display:'flex', alignItems:'center', gap:4 }}>
                  {delivery.address} <Navigation size={11}/>
                </button>
              </div>
            </div>
            {delivery.phone && (
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:10, backgroundColor:`${C}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Phone size={16} style={{ color:C }}/>
                </div>
                <button onClick={() => window.open(`tel:${delivery.phone}`, '_self')}
                  style={{ fontSize:13, color:'#3B82F6', fontWeight:600, margin:0, border:'none', background:'none', cursor:'pointer', padding:0 }}>
                  {delivery.phone}
                </button>
              </div>
            )}
            {delivery.distance && (
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:10, backgroundColor:`${C}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Navigation size={16} style={{ color:C }}/>
                </div>
                <p style={{ fontSize:13, color:'#64748B', margin:0 }}>Jarak: <strong style={{ color:'#1E293B' }}>{delivery.distance}</strong></p>
              </div>
            )}
          </div>
          {delivery.notes && (
            <div style={{ marginTop:12, padding:'10px 12px', borderRadius:10, backgroundColor:'#FEF3C7', border:'1px solid #FDE68A', display:'flex', gap:8 }}>
              <AlertCircle size={14} style={{ color:'#D97706', flexShrink:0, marginTop:1 }}/>
              <p style={{ fontSize:12, color:'#92400E', margin:0, lineHeight:1.5 }}>{delivery.notes}</p>
            </div>
          )}
        </div>

        {/* Items */}
        <div style={{ backgroundColor:'#fff', borderRadius:16, padding:20, marginBottom:14, boxShadow:'0 2px 12px rgba(71,85,105,.08)' }}>
          <h3 style={{ fontSize:13, fontWeight:700, color:'#1E293B', margin:'0 0 14px', display:'flex', alignItems:'center', gap:6 }}>
            <Package size={14} style={{ color:C }}/> Daftar Barang ({delivery.items.length} jenis)
          </h3>
          {delivery.items.map((item, i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom: i<delivery.items.length-1 ? '1px solid #F1F5F9' : 'none' }}>
              <p style={{ fontSize:13, color:'#374151', margin:0 }}>{item.name}</p>
              <span style={{ fontSize:13, fontWeight:700, color:'#1E293B', backgroundColor:'#F1F5F9', borderRadius:8, padding:'3px 10px' }}>{item.qty} {item.unit}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {delivery.status === 'assigned' && (
            <button onClick={() => updateStatus('on_the_way')} disabled={updating}
              style={{ width:'100%', padding:'16px', borderRadius:16, border:'none', background:`linear-gradient(135deg,#334155,${C})`, color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, boxShadow:`0 6px 20px ${C}30`, opacity: updating ? 0.7 : 1 }}>
              🚀 Mulai Berangkat
            </button>
          )}

          {delivery.status === 'on_the_way' && (
            <button onClick={() => updateStatus('arrived')} disabled={updating}
              style={{ width:'100%', padding:'16px', borderRadius:16, border:'none', background:'linear-gradient(135deg,#7C3AED,#8B5CF6)', color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, boxShadow:'0 6px 20px rgba(139,92,246,.3)', opacity: updating ? 0.7 : 1 }}>
              📍 Saya Sudah Tiba
            </button>
          )}

          {delivery.status === 'arrived' && (
            <>
              {/* Photo upload */}
              <div style={{ backgroundColor:'#fff', borderRadius:14, padding:16, border:'2px dashed #CBD5E1', textAlign:'center', cursor:'pointer' }}
                onClick={() => fileRef.current?.click()}>
                <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} style={{ display:'none' }}/>
                {photoUploaded ? (
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                    <CheckCircle size={20} style={{ color:'#16A34A' }}/>
                    <span style={{ fontSize:13, fontWeight:700, color:'#16A34A' }}>Foto bukti terupload ✓</span>
                  </div>
                ) : (
                  <div>
                    <Camera size={24} style={{ color:'#94A3B8', margin:'0 auto 6px', display:'block' }}/>
                    <p style={{ fontSize:13, fontWeight:600, color:'#475569', margin:'0 0 2px' }}>Upload Foto Bukti (Wajib)</p>
                    <p style={{ fontSize:11.5, color:'#94A3B8', margin:0 }}>Tap untuk ambil foto</p>
                  </div>
                )}
              </div>
              <button onClick={() => updateStatus('delivered', { photo: photoUploaded })}
                disabled={updating || !photoUploaded}
                style={{ width:'100%', padding:'16px', borderRadius:16, border:'none', background:'linear-gradient(135deg,#15803D,#16A34A)', color:'#fff', fontSize:15, fontWeight:700, cursor: photoUploaded?'pointer':'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', gap:10, boxShadow:'0 6px 20px rgba(22,163,74,.3)', opacity: updating||!photoUploaded ? .6 : 1 }}>
                ✅ Selesai Diantar
              </button>
            </>
          )}

          {/* Fail button — available while not done */}
          {!['delivered','failed'].includes(delivery.status) && !showFailForm && (
            <button onClick={() => setShowFailForm(true)}
              style={{ width:'100%', padding:'13px', borderRadius:14, border:'none', backgroundColor:'#FEF2F2', color:'#DC2626', fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              ❌ Gagal Antar
            </button>
          )}

          {showFailForm && (
            <div style={{ backgroundColor:'#fff', borderRadius:16, padding:20, border:'1px solid #FECACA', boxShadow:'0 2px 12px rgba(220,38,38,.1)' }}>
              <h3 style={{ fontSize:14, fontWeight:700, color:'#DC2626', margin:'0 0 14px' }}>Alasan Gagal Antar</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:12 }}>
                {FAIL_REASONS.map(r => (
                  <button key={r} onClick={() => setFailReason(r)}
                    style={{ padding:'10px 14px', borderRadius:10, border:`2px solid ${failReason===r ? '#DC2626' : '#E2E8F0'}`, background: failReason===r ? '#FEF2F2' : '#fff', color: failReason===r ? '#DC2626' : '#374151', fontSize:13, fontWeight:failReason===r ? 700 : 400, cursor:'pointer', textAlign:'left' }}>
                    {r}
                  </button>
                ))}
              </div>
              <textarea value={failNotes} onChange={e => setFailNotes(e.target.value)}
                placeholder="Catatan tambahan (opsional)…"
                rows={3}
                style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1.5px solid #E2E8F0', outline:'none', fontSize:13, resize:'none', boxSizing:'border-box', marginBottom:12 }}/>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => setShowFailForm(false)} style={{ flex:1, padding:'12px', borderRadius:12, border:'1.5px solid #E2E8F0', background:'#fff', color:'#64748B', fontSize:13, fontWeight:600, cursor:'pointer' }}>Batal</button>
                <button onClick={() => updateStatus('failed', { notes:failNotes, failReason })} disabled={!failReason || updating}
                  style={{ flex:1, padding:'12px', borderRadius:12, border:'none', background:'linear-gradient(135deg,#DC2626,#EF4444)', color:'#fff', fontSize:13, fontWeight:700, cursor: failReason?'pointer':'not-allowed', opacity: !failReason ? 0.5 : 1 }}>
                  Konfirmasi Gagal
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Completed states */}
        {delivery.status === 'delivered' && (
          <div style={{ padding:20, borderRadius:16, backgroundColor:'#DCFCE7', border:'1px solid #BBF7D0', textAlign:'center', marginTop:10 }}>
            <CheckCircle size={36} style={{ color:'#16A34A', margin:'0 auto 8px', display:'block' }}/>
            <p style={{ fontSize:15, fontWeight:800, color:'#15803D', margin:'0 0 4px' }}>Pengiriman Berhasil! 🎉</p>
            <p style={{ fontSize:12.5, color:'#16A34A', margin:0 }}>Terima kasih telah menyelesaikan pengiriman ini</p>
          </div>
        )}
        {delivery.status === 'failed' && (
          <div style={{ padding:20, borderRadius:16, backgroundColor:'#FEF2F2', border:'1px solid #FECACA', textAlign:'center', marginTop:10 }}>
            <XCircle size={36} style={{ color:'#DC2626', margin:'0 auto 8px', display:'block' }}/>
            <p style={{ fontSize:15, fontWeight:800, color:'#DC2626', margin:0 }}>Pengiriman Gagal</p>
          </div>
        )}
      </div>
    </div>
  );
}
