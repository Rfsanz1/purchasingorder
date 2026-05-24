'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import AppShell, { NavItem } from '../../components/layout/AppShell';
import {
  Car, BarChart2, Users, Wrench, MapPin, Fuel, Settings,
  CheckCircle, AlertTriangle, Clock, TrendingUp,
} from 'lucide-react';

const NAV: NavItem[] = [
  { label: 'Dashboard',    href: '/fleet',              icon: BarChart2 },
  { label: 'Kendaraan',    href: '/fleet/vehicles',     icon: Car,
    children: [
      { label: 'Semua Kendaraan', href: '/fleet/vehicles' },
      { label: 'Aktif',           href: '/fleet/vehicles?status=active' },
      { label: 'Servis',          href: '/fleet/vehicles?status=service' },
    ],
  },
  { label: 'Driver',       href: '/fleet/drivers',      icon: Users },
  { label: 'Pengiriman',   href: '/fleet/deliveries',   icon: MapPin, badge: 7 },
  { label: 'Servis',       href: '/fleet/services',     icon: Wrench },
  { label: 'BBM',          href: '/fleet/fuel',         icon: Fuel },
  { label: 'Laporan',      href: '/fleet/reports',      icon: TrendingUp },
  { label: 'Pengaturan',   href: '/fleet/settings',     icon: Settings },
];

const STATS = [
  { label: 'Total Kendaraan',     value: '24',  sub: '18 aktif, 6 servis', color: '#009688', bg: 'rgba(0,150,136,.1)',   icon: Car },
  { label: 'Driver Aktif',        value: '21',  sub: '3 tidak hadir',      color: '#2196F3', bg: 'rgba(33,150,243,.1)',  icon: Users },
  { label: 'Pengiriman Hari Ini', value: '38',  sub: '7 belum berangkat',  color: '#FF9800', bg: 'rgba(255,152,0,.1)',   icon: MapPin },
  { label: 'Servis Mendatang',    value: '5',   sub: '2 mendesak',         color: '#EA5455', bg: 'rgba(234,84,85,.1)',   icon: Wrench },
];

const DELIVERIES = [
  { id: 'DEL-0241', driver: 'Andi Susanto',  vehicle: 'B 1234 XY', dest: 'PT Maju Jaya – Surabaya',     status: 'on_route',   eta: '14:30' },
  { id: 'DEL-0240', driver: 'Budi Santoso',  vehicle: 'B 5678 AB', dest: 'CV Berkah – Sidoarjo',        status: 'delivered',  eta: '–' },
  { id: 'DEL-0239', driver: 'Candra Putra',  vehicle: 'B 9012 CD', dest: 'Toko Sumber – Gresik',        status: 'on_route',   eta: '15:45' },
  { id: 'DEL-0238', driver: 'Doni Setiawan', vehicle: 'B 3456 EF', dest: 'UD Karya – Malang',           status: 'pending',    eta: '17:00' },
  { id: 'DEL-0237', driver: 'Eko Wibowo',    vehicle: 'B 7890 GH', dest: 'PT Global – Surabaya',        status: 'delivered',  eta: '–' },
];

const VEHICLES = [
  { plate: 'B 1234 XY', brand: 'Mitsubishi Colt', year: 2021, odometer: '48.200 km', fuel: 'Solar',  status: 'active' },
  { plate: 'B 5678 AB', brand: 'Isuzu Elf',        year: 2020, odometer: '62.800 km', fuel: 'Solar',  status: 'active' },
  { plate: 'B 9012 CD', brand: 'Toyota Dyna',      year: 2022, odometer: '31.400 km', fuel: 'Solar',  status: 'active' },
  { plate: 'B 3456 EF', brand: 'Hino 300',         year: 2019, odometer: '87.500 km', fuel: 'Solar',  status: 'service' },
  { plate: 'B 7890 GH', brand: 'Mitsubishi FE',    year: 2023, odometer: '18.900 km', fuel: 'Solar',  status: 'active' },
];

const STATUS_DELIVERY: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  on_route:  { label: 'Dalam Perjalanan', color: '#2196F3', bg: 'rgba(33,150,243,.1)',  icon: MapPin },
  delivered: { label: 'Terkirim',         color: '#4CAF50', bg: 'rgba(76,175,80,.1)',   icon: CheckCircle },
  pending:   { label: 'Menunggu',         color: '#FF9800', bg: 'rgba(255,152,0,.1)',   icon: Clock },
};

const STATUS_VEH: Record<string, { label: string; color: string; bg: string }> = {
  active:  { label: 'Aktif',       color: '#4CAF50', bg: 'rgba(76,175,80,.1)' },
  service: { label: 'Servis',      color: '#FF9800', bg: 'rgba(255,152,0,.1)' },
  idle:    { label: 'Tidak Aktif', color: '#A5A3AE', bg: 'rgba(165,163,174,.12)' },
};

export default function FleetDashboard() {
  const { token } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;

  return (
    <AppShell
      appName="Armada & Pengiriman"
      appColor="#009688"
      appGradient="from-teal-500 to-teal-700"
      appIcon={Car}
      navItems={NAV}
      activeHref="/fleet"
    >
      <div className="p-6 space-y-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deliveries */}
          <div className="bg-white rounded-2xl border" style={{ borderColor: '#EDE8F5' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#EDE8F5' }}>
              <h2 className="font-bold text-sm" style={{ color: '#2F2B3D' }}>Pengiriman Hari Ini</h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(0,150,136,.1)', color: '#009688' }}>38 total</span>
            </div>
            <div className="divide-y" style={{ borderColor: '#EDE8F5' }}>
              {DELIVERIES.map(d => {
                const st = STATUS_DELIVERY[d.status];
                const Icon = st.icon;
                return (
                  <div key={d.id} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0" style={{ backgroundColor: st.bg }}>
                      <Icon className="h-4 w-4" style={{ color: st.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: '#2F2B3D' }}>{d.dest}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: '#A5A3AE' }}>{d.driver} · {d.vehicle}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: st.bg, color: st.color }}>{st.label}</span>
                      {d.eta !== '–' && <p className="text-[10px] mt-0.5" style={{ color: '#A5A3AE' }}>ETA {d.eta}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vehicles */}
          <div className="bg-white rounded-2xl border" style={{ borderColor: '#EDE8F5' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#EDE8F5' }}>
              <h2 className="font-bold text-sm" style={{ color: '#2F2B3D' }}>Status Kendaraan</h2>
              <button className="text-xs font-semibold" style={{ color: '#009688' }}>Lihat Semua</button>
            </div>
            <div className="divide-y" style={{ borderColor: '#EDE8F5' }}>
              {VEHICLES.map(v => {
                const st = STATUS_VEH[v.status];
                return (
                  <div key={v.plate} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0" style={{ backgroundColor: 'rgba(0,150,136,.08)' }}>
                      <Car className="h-4 w-4" style={{ color: '#009688' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold" style={{ color: '#2F2B3D' }}>{v.plate}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: '#A5A3AE' }}>{v.brand} {v.year} · {v.odometer}</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: st.bg, color: st.color }}>
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Service alert */}
        <div className="rounded-2xl p-5 flex items-center gap-4" style={{ backgroundColor: 'rgba(234,84,85,.06)', border: '1px solid rgba(234,84,85,.2)' }}>
          <AlertTriangle className="h-6 w-6 flex-shrink-0" style={{ color: '#EA5455' }} />
          <div>
            <p className="text-sm font-bold" style={{ color: '#2F2B3D' }}>Peringatan Servis</p>
            <p className="text-xs mt-0.5" style={{ color: '#6D6777' }}>B 3456 EF (Hino 300) telah melewati jadwal servis. Segera jadwalkan perawatan.</p>
          </div>
          <button className="ml-auto text-xs font-semibold px-4 py-2 rounded-xl flex-shrink-0" style={{ backgroundColor: '#EA5455', color: '#fff' }}>
            Jadwalkan
          </button>
        </div>
      </div>
    </AppShell>
  );
}
