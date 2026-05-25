'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import AppShell, { NavItem } from '../../components/layout/AppShell';
import {
  Wrench, BarChart2, ShieldCheck, Package, Users, Calendar,
  CheckCircle, Clock, AlertTriangle, XCircle, Settings,
  TrendingUp, Smartphone, Star, Plus,
} from 'lucide-react';
import FeatureHub from '../../components/FeatureHub';

const NAV: NavItem[] = [
  { label: 'Dashboard',      href: '/service',               icon: BarChart2 },
  { label: 'Unit Masuk',     href: '/service/incoming',      icon: Smartphone, badge: 12 },
  { label: 'Klaim Garansi',  href: '/service/warranty',      icon: ShieldCheck, badge: 4 },
  { label: 'Perbaikan',      href: '/service/repairs',       icon: Wrench,
    children: [
      { label: 'Semua',          href: '/service/repairs' },
      { label: 'Diagnosa',       href: '/service/repairs?stage=diagnose' },
      { label: 'Perbaikan',      href: '/service/repairs?stage=repair' },
      { label: 'QC Perbaikan',   href: '/service/repairs?stage=qc' },
      { label: 'Selesai',        href: '/service/repairs?stage=done' },
    ],
  },
  { label: 'Sparepart',      href: '/service/spareparts',    icon: Package },
  { label: 'Teknisi',        href: '/service/technicians',   icon: Users },
  { label: 'Appointment',    href: '/service/appointments',  icon: Calendar },
  { label: 'Laporan',        href: '/service/reports',       icon: TrendingUp },
  { label: 'Pengaturan',     href: '/service/settings',      icon: Settings },
];

const STATS = [
  { label: 'Unit Diproses',     value: '47',  sub: '12 masuk hari ini',      color: '#F57F17', bg: 'rgba(245,127,23,.1)',  icon: Smartphone },
  { label: 'Klaim Garansi',     value: '8',   sub: '4 pending approval',     color: '#1976D2', bg: 'rgba(25,118,210,.1)',  icon: ShieldCheck },
  { label: 'Selesai Hari Ini',  value: '14',  sub: 'Rata-rata 2.4 hari',     color: '#4CAF50', bg: 'rgba(76,175,80,.1)',   icon: CheckCircle },
  { label: 'Rating Kepuasan',   value: '4.7', sub: 'Dari 5.0 bulan ini',     color: '#FF9800', bg: 'rgba(255,152,0,.1)',   icon: Star },
];

const SERVICE_UNITS = [
  { id: 'SVC-0892', customer: 'Andi Gunawan',  device: 'Samsung Galaxy S24 Ultra', issue: 'Layar retak, touch tidak responsif', technician: 'Budi T.',  stage: 'repair',   priority: 'urgent', in: '22 Mei', est: '25 Mei 2026' },
  { id: 'SVC-0891', customer: 'Maya Sari',     device: 'MacBook Pro M3 14"',       issue: 'Battery drain cepat, overheating',  technician: 'Candra P.', stage: 'diagnose', priority: 'normal', in: '23 Mei', est: '26 Mei 2026' },
  { id: 'SVC-0890', customer: 'Budi Pratama',  device: 'iPhone 15 Pro',            issue: 'Kamera belakang blur, autofokus error', technician: 'Budi T.', stage: 'qc',    priority: 'normal', in: '21 Mei', est: '24 Mei 2026' },
  { id: 'SVC-0889', customer: 'Lina Kusuma',   device: 'ASUS ROG Zephyrus G16',   issue: 'Keyboard tidak merespons beberapa tombol', technician: 'Eko W.', stage: 'done', priority: 'normal', in: '20 Mei', est: '24 Mei 2026' },
  { id: 'SVC-0888', customer: 'Eko Wibowo',    device: 'Sony PS5',                 issue: 'Overheating, fan noise berlebihan',  technician: 'Candra P.', stage: 'incoming', priority: 'normal', in: '24 Mei', est: '27 Mei 2026' },
  { id: 'SVC-0887', customer: 'Rini Dewi',     device: 'Samsung 65" Crystal UHD', issue: 'Backlight tidak merata, flickering', technician: 'Eko W.',   stage: 'diagnose', priority: 'urgent', in: '23 Mei', est: '28 Mei 2026' },
];

const WARRANTY_CLAIMS = [
  { id: 'WRT-0124', customer: 'Hendra S.',  device: 'Samsung Galaxy A55',   purchased: '5 Feb 2026', issue: 'Layar mati mendadak', status: 'approved', decision: 'Ganti unit' },
  { id: 'WRT-0123', customer: 'Siti R.',    device: 'Xiaomi Robot Vacuum',  purchased: '12 Jan 2026', issue: 'Error E2, tidak bisa charging', status: 'pending', decision: '–' },
  { id: 'WRT-0122', customer: 'Doni P.',    device: 'Earphone Sony WF-1000', purchased: '3 Mar 2026', issue: 'Suara kiri hilang', status: 'rejected', decision: 'Kerusakan fisik' },
  { id: 'WRT-0121', customer: 'Lia M.',     device: 'Powerbank Anker 26800', purchased: '20 Apr 2026', issue: 'Tidak bisa charging barang', status: 'approved', decision: 'Perbaikan gratis' },
];

const SPAREPARTS = [
  { name: 'LCD Samsung Galaxy A55',     code: 'SP-LCD-A55',    stock: 3,  min: 5,  price: 'Rp 580.000' },
  { name: 'Battery iPhone 15',         code: 'SP-BAT-IP15',   stock: 8,  min: 5,  price: 'Rp 425.000' },
  { name: 'Keyboard ASUS ROG',          code: 'SP-KEY-ROG16',  stock: 1,  min: 3,  price: 'Rp 1.200.000' },
  { name: 'Fan MacBook Pro M3',         code: 'SP-FAN-MBP3',   stock: 2,  min: 3,  price: 'Rp 780.000' },
];

const STAGE_MAP: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  incoming: { label: 'Diterima',  color: '#A5A3AE', bg: 'rgba(165,163,174,.12)', icon: Clock },
  diagnose: { label: 'Diagnosa',  color: '#2196F3', bg: 'rgba(33,150,243,.1)',   icon: Wrench },
  repair:   { label: 'Perbaikan', color: '#FF9800', bg: 'rgba(255,152,0,.1)',     icon: Wrench },
  qc:       { label: 'QC',        color: '#9C27B0', bg: 'rgba(156,39,176,.1)',   icon: CheckCircle },
  done:     { label: 'Selesai',   color: '#4CAF50', bg: 'rgba(76,175,80,.1)',    icon: CheckCircle },
};

const WARRANTY_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  pending:  { label: 'Pending',  color: '#FF9800', bg: 'rgba(255,152,0,.1)' },
  approved: { label: 'Disetujui', color: '#4CAF50', bg: 'rgba(76,175,80,.1)' },
  rejected: { label: 'Ditolak',  color: '#EA5455', bg: 'rgba(234,84,85,.1)' },
};

export default function ServiceDashboard() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'units' | 'warranty' | 'spareparts'>('units');
  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;

  return (
    <AppShell
      appName="Service Elektronik"
      appColor="#F57F17"
      appGradient="from-orange-500 to-amber-600"
      appIcon={Wrench}
      navItems={NAV}
      activeHref="/service"
    >
      <div className="p-6 space-y-6">
        <FeatureHub moduleId="service" color="#DC2626" bgColor="#FEE2E2" gradient="linear-gradient(135deg, #DC2626, #B91C1C)" />
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#EDE8F5' }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium" style={{ color: '#A5A3AE' }}>{s.label}</p>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: s.bg }}>
                    <Icon className="h-5 w-5" style={{ color: s.color }} />
                  </div>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#2F2B3D' }}>{s.value}</p>
                <p className="text-xs mt-1" style={{ color: '#A5A3AE' }}>{s.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Stage pipeline */}
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#EDE8F5' }}>
          <h2 className="font-bold text-sm mb-4" style={{ color: '#2F2B3D' }}>Pipeline Service</h2>
          <div className="grid grid-cols-5 gap-3">
            {[
              { stage: 'Diterima',  count: 12, color: '#A5A3AE' },
              { stage: 'Diagnosa',  count: 8,  color: '#2196F3' },
              { stage: 'Perbaikan', count: 18, color: '#FF9800' },
              { stage: 'QC',        count: 5,  color: '#9C27B0' },
              { stage: 'Selesai',   count: 4,  color: '#4CAF50' },
            ].map((p, i) => (
              <div key={p.stage} className="flex flex-col items-center gap-2">
                <div className="w-full rounded-xl py-4 text-center" style={{ backgroundColor: `${p.color}12`, border: `1.5px solid ${p.color}30` }}>
                  <p className="text-2xl font-bold" style={{ color: p.color }}>{p.count}</p>
                </div>
                <p className="text-[10px] font-semibold text-center" style={{ color: '#A5A3AE' }}>{p.stage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#EDE8F5' }}>
          <div className="flex items-center border-b" style={{ borderColor: '#EDE8F5' }}>
            {[
              { key: 'units',      label: 'Unit Service', count: 47 },
              { key: 'warranty',   label: 'Klaim Garansi', count: 4 },
              { key: 'spareparts', label: 'Stok Sparepart', count: null },
            ].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key as any)}
                className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all"
                style={{ borderBottomColor: activeTab === t.key ? '#F57F17' : 'transparent', color: activeTab === t.key ? '#F57F17' : '#A5A3AE' }}
              >
                {t.label}
                {t.count !== null && <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: activeTab === t.key ? 'rgba(245,127,23,.1)' : '#F5F4F9', color: activeTab === t.key ? '#F57F17' : '#A5A3AE' }}>{t.count}</span>}
              </button>
            ))}
            <div className="ml-auto px-5">
              <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white" style={{ backgroundColor: '#F57F17' }}>
                <Plus className="h-3.5 w-3.5" /> Terima Unit
              </button>
            </div>
          </div>

          {activeTab === 'units' && (
            <div className="divide-y" style={{ borderColor: '#EDE8F5' }}>
              {SERVICE_UNITS.map(u => {
                const st = STAGE_MAP[u.stage];
                const Icon = st.icon;
                return (
                  <div key={u.id} className="flex items-start gap-3 px-5 py-4">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl mt-0.5" style={{ backgroundColor: st.bg }}>
                      <Icon className="h-5 w-5" style={{ color: st.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-bold text-xs" style={{ color: '#F57F17' }}>{u.id}</span>
                        {u.priority === 'urgent' && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(234,84,85,.1)', color: '#EA5455' }}>Urgent</span>}
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: st.bg, color: st.color }}>{st.label}</span>
                      </div>
                      <p className="text-xs font-bold" style={{ color: '#2F2B3D' }}>{u.device}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: '#A5A3AE' }}>{u.issue}</p>
                      <p className="text-[11px]" style={{ color: '#B0AAB9' }}>
                        {u.customer} · Teknisi: {u.technician} · Masuk: {u.in} · Est. Selesai: {u.est}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'warranty' && (
            <div className="divide-y" style={{ borderColor: '#EDE8F5' }}>
              {WARRANTY_CLAIMS.map(w => {
                const st = WARRANTY_STATUS[w.status];
                return (
                  <div key={w.id} className="flex items-start gap-3 px-5 py-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: 'rgba(25,118,210,.1)' }}>
                      <ShieldCheck className="h-4 w-4" style={{ color: '#1976D2' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs" style={{ color: '#1976D2' }}>{w.id}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: st.bg, color: st.color }}>{st.label}</span>
                      </div>
                      <p className="text-xs font-semibold mt-0.5" style={{ color: '#2F2B3D' }}>{w.device}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: '#A5A3AE' }}>{w.customer} · Beli: {w.purchased} · Masalah: {w.issue}</p>
                      {w.decision !== '–' && <p className="text-[11px] font-medium mt-0.5" style={{ color: st.color }}>Keputusan: {w.decision}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'spareparts' && (
            <div className="divide-y" style={{ borderColor: '#EDE8F5' }}>
              {SPAREPARTS.map(s => {
                const isLow = s.stock < s.min;
                return (
                  <div key={s.code} className="flex items-center gap-3 px-5 py-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: isLow ? 'rgba(234,84,85,.1)' : 'rgba(255,152,0,.1)' }}>
                      <Package className="h-4 w-4" style={{ color: isLow ? '#EA5455' : '#FF9800' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold" style={{ color: '#2F2B3D' }}>{s.name}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: '#A5A3AE' }}>{s.code} · Harga: {s.price}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold" style={{ color: isLow ? '#EA5455' : '#2F2B3D' }}>{s.stock} pcs</p>
                      {isLow && <p className="text-[10px] font-semibold" style={{ color: '#EA5455' }}>Stok menipis!</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
