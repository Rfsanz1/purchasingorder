'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import AppShell, { NavItem } from '../../components/layout/AppShell';
import {
  Factory, BarChart2, ClipboardList, Layers, Cpu, Settings,
  CheckCircle, Clock, Play, AlertTriangle, TrendingUp, Package,
} from 'lucide-react';
import FeatureHub from '../../components/FeatureHub';

const NAV: NavItem[] = [
  { label: 'Dashboard',        href: '/manufacturing',           icon: BarChart2 },
  { label: 'Work Order',       href: '/manufacturing/orders',    icon: ClipboardList, badge: 4,
    children: [
      { label: 'Semua',         href: '/manufacturing/orders' },
      { label: 'Produksi',      href: '/manufacturing/orders?status=in_progress' },
      { label: 'Terjadwal',     href: '/manufacturing/orders?status=confirmed' },
    ],
  },
  { label: 'Bill of Material', href: '/manufacturing/bom',       icon: Layers },
  { label: 'Work Center',      href: '/manufacturing/workcenters', icon: Cpu },
  { label: 'Produk Jadi',      href: '/manufacturing/products',  icon: Package },
  { label: 'Laporan',          href: '/manufacturing/reports',   icon: TrendingUp },
  { label: 'Pengaturan',       href: '/manufacturing/settings',  icon: Settings },
];

const STATS = [
  { label: 'Work Order Aktif',   value: '14',       sub: '4 terjadwal hari ini',  color: '#546E7A', bg: 'rgba(84,110,122,.1)',   icon: ClipboardList },
  { label: 'Selesai Bulan Ini',  value: '89',        sub: '+15% vs bulan lalu',   color: '#4CAF50', bg: 'rgba(76,175,80,.1)',    icon: CheckCircle },
  { label: 'Produksi Hari Ini',  value: '1.240 pcs', sub: '82% dari target',      color: '#2196F3', bg: 'rgba(33,150,243,.1)',   icon: Factory },
  { label: 'Efisiensi OEE',      value: '78.4%',     sub: '+2.1% vs minggu lalu', color: '#FF9800', bg: 'rgba(255,152,0,.1)',    icon: TrendingUp },
];

const WORK_ORDERS = [
  { id: 'WO-0124', product: 'Semen Custom Blend 25kg', qty: 500, done: 320, workcenter: 'Mixing Line 1',  status: 'in_progress', deadline: '25 Mei 2026' },
  { id: 'WO-0123', product: 'Cat Interior Premium 5L', qty: 200, done: 200, workcenter: 'Filling Line',    status: 'done',        deadline: '24 Mei 2026' },
  { id: 'WO-0122', product: 'Pipa Komposit 3 inch',    qty: 300, done: 0,   workcenter: 'Extrusion Line',  status: 'confirmed',   deadline: '26 Mei 2026' },
  { id: 'WO-0121', product: 'Bata Ringan AAC 60x20',   qty: 800, done: 800, workcenter: 'Autoclave',       status: 'done',        deadline: '23 Mei 2026' },
  { id: 'WO-0120', product: 'Keramik Floor 60x60',     qty: 150, done: 60,  workcenter: 'Kiln Line 2',    status: 'in_progress', deadline: '27 Mei 2026' },
];

const WORKCENTERS = [
  { name: 'Mixing Line 1',  capacity: '500 kg/jam', utilization: 76, status: 'running' },
  { name: 'Filling Line',   capacity: '200 unit/jam', utilization: 92, status: 'running' },
  { name: 'Extrusion Line', capacity: '300 m/jam',  utilization: 45, status: 'idle' },
  { name: 'Kiln Line 2',    capacity: '150 unit/jam', utilization: 58, status: 'running' },
  { name: 'Autoclave',      capacity: '1 batch/8jam', utilization: 0, status: 'maintenance' },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  in_progress: { label: 'Produksi',  color: '#2196F3', bg: 'rgba(33,150,243,.1)',  icon: Play },
  confirmed:   { label: 'Terjadwal', color: '#FF9800', bg: 'rgba(255,152,0,.1)',   icon: Clock },
  done:        { label: 'Selesai',   color: '#4CAF50', bg: 'rgba(76,175,80,.1)',   icon: CheckCircle },
};

const WC_STATUS: Record<string, { color: string; bg: string; label: string }> = {
  running:     { color: '#4CAF50', bg: 'rgba(76,175,80,.1)',   label: 'Berjalan' },
  idle:        { color: '#A5A3AE', bg: 'rgba(165,163,174,.12)', label: 'Idle' },
  maintenance: { color: '#EA5455', bg: 'rgba(234,84,85,.1)',   label: 'Maintenance' },
};

export default function ManufacturingDashboard() {
  const { token } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;

  return (
    <AppShell
      appName="Manufaktur"
      appColor="#546E7A"
      appGradient="from-slate-500 to-slate-700"
      appIcon={Factory}
      navItems={NAV}
      activeHref="/manufacturing"
    >
      <div className="p-6 space-y-6">
        <FeatureHub moduleId="manufacturing" color="#6D28D9" bgColor="#EDE9FE" gradient="linear-gradient(135deg, #6D28D9, #5B21B6)" />
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Work Orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl border" style={{ borderColor: '#EDE8F5' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#EDE8F5' }}>
              <h2 className="font-bold text-sm" style={{ color: '#2F2B3D' }}>Work Order Aktif</h2>
              <button className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white" style={{ backgroundColor: '#546E7A' }}>+ Buat WO</button>
            </div>
            <div className="divide-y" style={{ borderColor: '#EDE8F5' }}>
              {WORK_ORDERS.map(wo => {
                const st = STATUS_MAP[wo.status];
                const Icon = st.icon;
                const pct = wo.qty > 0 ? Math.round((wo.done / wo.qty) * 100) : 0;
                return (
                  <div key={wo.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold" style={{ color: '#546E7A' }}>{wo.id}</span>
                          <span className="text-xs font-medium truncate" style={{ color: '#2F2B3D' }}>{wo.product}</span>
                        </div>
                        <p className="text-[11px] mt-0.5" style={{ color: '#A5A3AE' }}>{wo.workcenter} · Deadline: {wo.deadline}</p>
                      </div>
                      <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: st.bg, color: st.color }}>
                        <Icon className="h-3 w-3" />{st.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: '#EDE8F5' }}>
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: st.color }} />
                      </div>
                      <span className="text-[10px] font-bold flex-shrink-0" style={{ color: '#A5A3AE' }}>{wo.done}/{wo.qty} · {pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Work Centers */}
          <div className="bg-white rounded-2xl border" style={{ borderColor: '#EDE8F5' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: '#EDE8F5' }}>
              <h2 className="font-bold text-sm" style={{ color: '#2F2B3D' }}>Work Center</h2>
            </div>
            <div className="divide-y" style={{ borderColor: '#EDE8F5' }}>
              {WORKCENTERS.map(wc => {
                const st = WC_STATUS[wc.status];
                return (
                  <div key={wc.name} className="px-5 py-3.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-semibold" style={{ color: '#2F2B3D' }}>{wc.name}</p>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: st.bg, color: st.color }}>{st.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: '#EDE8F5' }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${wc.utilization}%`, backgroundColor: st.color }} />
                      </div>
                      <span className="text-[10px]" style={{ color: '#A5A3AE' }}>{wc.utilization}%</span>
                    </div>
                    <p className="text-[10px] mt-0.5" style={{ color: '#B0AAB9' }}>{wc.capacity}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
