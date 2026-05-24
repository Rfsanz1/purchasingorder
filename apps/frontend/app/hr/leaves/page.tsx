'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/store/useAuthStore';
import AppShell from '../../../components/layout/AppShell';
import { HR_CONFIG, HR_NAV } from '../../../lib/nav-configs';
import { CalendarX, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';

const LEAVES = [
  { name: 'Dian Pertiwi',   type: 'Cuti Tahunan', dates: '26–28 Mei',  days: 3, status: 'pending',  sisa: 8 },
  { name: 'Hendra Susanto', type: 'Cuti Sakit',   dates: '25 Mei',     days: 1, status: 'approved', sisa: 12 },
  { name: 'Lina Wulandari', type: 'Cuti Tahunan', dates: '1–3 Jun',    days: 3, status: 'pending',  sisa: 6 },
  { name: 'Toni Hidayat',   type: 'Cuti Tahunan', dates: '9–11 Jun',   days: 3, status: 'approved', sisa: 9 },
  { name: 'Mira Sanjaya',   type: 'Izin Khusus',  dates: '24 Mei',     days: 1, status: 'rejected', sisa: 10 },
];

export default function HrLeavesPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;
  return (
    <AppShell {...HR_CONFIG} navItems={HR_NAV} activeHref="/hr/leaves">
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div><h1 className="text-xl font-bold" style={{ color: '#433C50' }}>Pengajuan Cuti</h1><p className="text-sm mt-0.5" style={{ color: '#A5A3AE' }}>Kelola pengajuan dan persetujuan cuti karyawan</p></div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: HR_CONFIG.appColor }}><Plus className="h-4 w-4" /> Ajukan Cuti</button>
        </div>
        <div className="bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr style={{ borderBottom: '1px solid #EDE8F5' }}>
                {['Karyawan', 'Jenis Cuti', 'Tanggal', 'Hari', 'Sisa Cuti', 'Status', 'Aksi'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#A5A3AE' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {LEAVES.map((l, i) => (
                  <tr key={l.name} style={{ borderBottom: i < LEAVES.length - 1 ? '1px solid #F5F2FB' : 'none' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FDFCFF'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: HR_CONFIG.appColor }}>{l.name.charAt(0)}</div>
                        <span className="text-sm font-medium" style={{ color: '#433C50' }}>{l.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-xs" style={{ color: '#433C50' }}>{l.type}</td>
                    <td className="px-6 py-3.5 text-xs" style={{ color: '#A5A3AE' }}>{l.dates}</td>
                    <td className="px-6 py-3.5 text-sm text-center font-semibold" style={{ color: '#433C50' }}>{l.days}</td>
                    <td className="px-6 py-3.5 text-sm text-center" style={{ color: '#A5A3AE' }}>{l.sisa}</td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{
                        color: l.status === 'approved' ? '#4CAF50' : l.status === 'rejected' ? '#EA5455' : '#FF9800',
                        backgroundColor: l.status === 'approved' ? 'rgba(76,175,80,.1)' : l.status === 'rejected' ? 'rgba(234,84,85,.1)' : 'rgba(255,152,0,.1)',
                      }}>
                        {l.status === 'approved' ? <CheckCircle className="h-3 w-3" /> : l.status === 'rejected' ? <XCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {l.status === 'approved' ? 'Disetujui' : l.status === 'rejected' ? 'Ditolak' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      {l.status === 'pending' && (
                        <div className="flex gap-1.5">
                          <button className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: '#4CAF50' }}>Setuju</button>
                          <button className="px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ color: '#EA5455', border: '1px solid rgba(234,84,85,.3)' }}>Tolak</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
