'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/useAuthStore';
import api from '../../lib/api';
import BottomNav from '../../components/BottomNav';
import { Truck, MapPin, Package, CheckCircle, XCircle, ChevronRight, ChevronDown } from 'lucide-react';

const C = '#475569';

interface HistoryItem {
  id: string; customerName: string; address: string; items: number;
  status: 'delivered' | 'failed'; date: string; soNumber: string;
}

const DEMO_HISTORY: HistoryItem[] = [
  { id:'DEL-003', customerName:'Toko Bangunan Sejuk', address:'Jl. Gatot Subroto No.78', items:2, status:'delivered', date:'2026-05-28', soNumber:'SO-2026-003' },
  { id:'DEL-010', customerName:'PT Sinar Harapan', address:'Jl. Kebon Jeruk No.15', items:4, status:'delivered', date:'2026-05-27', soNumber:'SO-2026-010' },
  { id:'DEL-011', customerName:'CV Mandiri Abadi', address:'Jl. Raya Bogor No.88', items:6, status:'failed', date:'2026-05-27', soNumber:'SO-2026-011' },
  { id:'DEL-015', customerName:'UD Jaya Makmur', address:'Jl. Pemuda No.22', items:3, status:'delivered', date:'2026-05-26', soNumber:'SO-2026-015' },
  { id:'DEL-016', customerName:'PT Berkah Utama', address:'Jl. Daan Mogot No.45', items:7, status:'delivered', date:'2026-05-26', soNumber:'SO-2026-016' },
  { id:'DEL-020', customerName:'CV Subur Jaya', address:'Jl. Ciledug Raya No.10', items:5, status:'delivered', date:'2026-05-25', soNumber:'SO-2026-020' },
];

const MONTHS = ['Mei 2026','April 2026','Maret 2026'];

export default function HistoryPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>(DEMO_HISTORY);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  useEffect(() => {
    if (!token) { router.replace('/login'); return; }
    api.get('/delivery/history').then(r => { if (r.data?.length) setHistory(r.data); }).catch(() => {}).finally(() => setLoading(false));
  }, [token]);

  const totalDelivered = history.filter(h => h.status==='delivered').length;
  const totalFailed = history.filter(h => h.status==='failed').length;

  return (
    <div style={{ minHeight:'100vh', backgroundColor:'#F8FAFC', paddingBottom:80, fontFamily:'Inter,sans-serif', maxWidth:430, margin:'0 auto' }}>
      <div style={{ background:`linear-gradient(135deg,#334155,${C})`, padding:'20px 20px 16px' }}>
        <h1 style={{ fontSize:18, fontWeight:800, color:'#fff', margin:'0 0 12px' }}>Riwayat Pengiriman</h1>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <div style={{ backgroundColor:'rgba(255,255,255,.15)', borderRadius:12, padding:'10px 14px' }}>
            <p style={{ fontSize:18, fontWeight:800, color:'#fff', margin:'0 0 2px' }}>{totalDelivered}</p>
            <p style={{ fontSize:11, color:'rgba(255,255,255,.65)', margin:0 }}>Berhasil Dikirim</p>
          </div>
          <div style={{ backgroundColor:'rgba(255,255,255,.15)', borderRadius:12, padding:'10px 14px' }}>
            <p style={{ fontSize:18, fontWeight:800, color:'#fff', margin:'0 0 2px' }}>{totalFailed}</p>
            <p style={{ fontSize:11, color:'rgba(255,255,255,.65)', margin:0 }}>Gagal Antar</p>
          </div>
        </div>
      </div>

      <div style={{ padding:'16px 16px 0' }}>
        {/* Month filter */}
        <div style={{ position:'relative', marginBottom:14 }}>
          <button onClick={() => setShowMonthPicker(v => !v)}
            style={{ width:'100%', padding:'10px 16px', borderRadius:12, border:'1.5px solid #E2E8F0', background:'#fff', display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:13.5, fontWeight:600, color:'#1E293B', cursor:'pointer' }}>
            {selectedMonth} <ChevronDown size={16} style={{ color:'#94A3B8' }}/>
          </button>
          {showMonthPicker && (
            <div style={{ position:'absolute', top:'calc(100% + 6px)', left:0, right:0, backgroundColor:'#fff', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,.1)', overflow:'hidden', zIndex:10, border:'1px solid #E2E8F0' }}>
              {MONTHS.map(m => (
                <button key={m} onClick={() => { setSelectedMonth(m); setShowMonthPicker(false); }}
                  style={{ width:'100%', padding:'12px 16px', border:'none', background: selectedMonth===m ? '#F1F5F9' : '#fff', color: selectedMonth===m ? C : '#374151', fontSize:13.5, fontWeight: selectedMonth===m ? 700 : 500, cursor:'pointer', textAlign:'left' }}>
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* History list */}
        {loading ? (
          <div style={{ textAlign:'center', padding:40, color:'#94A3B8' }}>Memuat…</div>
        ) : history.map((h, i) => (
          <button key={h.id} onClick={() => router.push(`/delivery/${h.id}`)}
            style={{ width:'100%', padding:'14px 16px', border:'none', background:'#fff', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'flex-start', gap:12, borderRadius:14, marginBottom:10, boxShadow:'0 2px 12px rgba(71,85,105,.06)' }}>
            <div style={{ width:44, height:44, borderRadius:12, backgroundColor: h.status==='delivered' ? '#DCFCE7' : '#FEF2F2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {h.status==='delivered' ? <CheckCircle size={18} style={{ color:'#16A34A' }}/> : <XCircle size={18} style={{ color:'#DC2626' }}/>}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                <p style={{ fontSize:13.5, fontWeight:700, color:'#1E293B', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:170 }}>{h.customerName}</p>
                <span style={{ fontSize:11, fontWeight:700, color: h.status==='delivered' ? '#16A34A' : '#DC2626', backgroundColor: h.status==='delivered' ? '#DCFCE7' : '#FEF2F2', borderRadius:100, padding:'2px 8px', flexShrink:0 }}>
                  {h.status==='delivered' ? 'Terkirim' : 'Gagal'}
                </span>
              </div>
              <p style={{ fontSize:11.5, color:'#64748B', margin:'0 0 4px', display:'flex', alignItems:'center', gap:3 }}><MapPin size={10}/> {h.address}</p>
              <div style={{ display:'flex', gap:10 }}>
                <span style={{ fontSize:11, color:'#94A3B8' }}>{h.soNumber}</span>
                <span style={{ fontSize:11, color:'#94A3B8', display:'flex', alignItems:'center', gap:3 }}><Package size={10}/> {h.items} item</span>
                <span style={{ fontSize:11, color:'#94A3B8' }}>{new Date(h.date).toLocaleDateString('id-ID', { day:'numeric', month:'short' })}</span>
              </div>
            </div>
            <ChevronRight size={16} style={{ color:'#CBD5E1', marginTop:4 }}/>
          </button>
        ))}
      </div>

      <BottomNav/>
    </div>
  );
}
