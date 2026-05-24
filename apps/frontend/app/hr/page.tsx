'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import AppShell, { NavItem } from '../../components/layout/AppShell';
import {
  UserCheck, BarChart2, Calendar, UserPlus, CalendarX,
  Star, Bus, DollarSign, Settings, Plus, ArrowUpRight, Clock,
} from 'lucide-react';

const NAV: NavItem[] = [
  { label: 'Dashboard',   href: '/hr',                    icon: BarChart2 },
  { label: 'Karyawan',    href: '/hr/employees',          icon: UserCheck },
  { label: 'Absensi',     href: '/hr/attendances',        icon: Calendar, badge: 3 },
  { label: 'Rekrutmen',   href: '/hr/recruitment',        icon: UserPlus },
  { label: 'Cuti',        href: '/hr/leaves',             icon: CalendarX, badge: 5 },
  { label: 'Penilaian',   href: '/hr/appraisals',         icon: Star },
  { label: 'Armada',      href: '/hr/fleet',              icon: Bus },
  { label: 'Payroll',     href: '/hr/payrolls',           icon: DollarSign },
  { label: 'Pengaturan',  href: '/hr/settings',           icon: Settings },
];

const STATS = [
  { label: 'Total Karyawan',     value: '148',  sub: '+3 bulan ini',         color: '#E91E63', bg: 'rgba(233,30,99,.1)',   icon: UserCheck },
  { label: 'Hadir Hari Ini',     value: '134',  sub: '14 tidak hadir',       color: '#4CAF50', bg: 'rgba(76,175,80,.1)',   icon: Calendar },
  { label: 'Pengajuan Cuti',     value: '5',    sub: 'Menunggu persetujuan', color: '#FF9800', bg: 'rgba(255,152,0,.1)',   icon: CalendarX },
  { label: 'Payroll Bulan Ini',  value: 'Rp 412 Jt', sub: 'Diproses 24 Mei',  color: '#9C27B0', bg: 'rgba(156,39,176,.1)', icon: DollarSign },
];

const EMPLOYEES = [
  { name: 'Rudi Hartono',    dept: 'Sales',      pos: 'Sales Executive',    status: 'hadir',    join: '2 Jan 2023' },
  { name: 'Sari Dewi',       dept: 'Finance',    pos: 'Accounting Staff',   status: 'hadir',    join: '15 Mar 2022' },
  { name: 'Agus Wijaya',     dept: 'Warehouse',  pos: 'Gudang Supervisor',  status: 'cuti',     join: '1 Jul 2021' },
  { name: 'Rina Kusuma',     dept: 'HR',         pos: 'HR Officer',         status: 'hadir',    join: '10 Nov 2023' },
  { name: 'Budi Prasetyo',   dept: 'Delivery',   pos: 'Driver',             status: 'tidak-hadir', join: '5 Feb 2020' },
];

const LEAVE_REQUESTS = [
  { name: 'Dian Pertiwi',    type: 'Cuti Tahunan',  dates: '26–28 Mei 2026', days: 3 },
  { name: 'Hendra Susanto',  type: 'Cuti Sakit',    dates: '25 Mei 2026',    days: 1 },
  { name: 'Lina Wulandari',  type: 'Cuti Tahunan',  dates: '1–3 Jun 2026',   days: 3 },
  { name: 'Toni Hidayat',    type: 'Cuti Tahunan',  dates: '9–11 Jun 2026',  days: 3 },
  { name: 'Mira Sanjaya',    type: 'Izin Khusus',   dates: '24 Mei 2026',    days: 1 },
];

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  'hadir':       { label: 'Hadir',      color: '#4CAF50', bg: 'rgba(76,175,80,.1)' },
  'cuti':        { label: 'Cuti',       color: '#FF9800', bg: 'rgba(255,152,0,.1)' },
  'tidak-hadir': { label: 'Absen',      color: '#EA5455', bg: 'rgba(234,84,85,.1)' },
};

export default function HrDashboard() {
  const { token } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;

  return (
    <AppShell appName="Sumber Daya Manusia" appColor="#C2185B" appGradient="from-pink-500 to-rose-600" appIcon={UserCheck} navItems={NAV} activeHref="/hr">
      <div className="p-6 space-y-6 max-w-6xl mx-auto">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#433C50' }}>Dashboard SDM</h1>
            <p className="text-sm mt-0.5" style={{ color: '#A5A3AE' }}>Kelola karyawan, absensi, dan penggajian</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#C2185B' }}
            onClick={() => router.push('/hr/employees')}>
            <Plus className="h-4 w-4" /> Karyawan Baru
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium" style={{ color: '#A5A3AE' }}>{s.label}</p>
                  <p className="text-xl font-bold mt-1 leading-tight" style={{ color: '#433C50' }}>{s.value}</p>
                  <p className="text-xs mt-1" style={{ color: '#A5A3AE' }}>{s.sub}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: s.bg }}>
                  <s.icon className="h-5 w-5" style={{ color: s.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-4">
          {/* Employee list */}
          <div className="lg:col-span-3 bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
              <h2 className="text-sm font-bold" style={{ color: '#433C50' }}>Daftar Karyawan</h2>
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: '#C2185B', border: '1px solid rgba(194,24,91,.2)', backgroundColor: 'rgba(194,24,91,.06)' }}
                onClick={() => router.push('/hr/employees')}>
                Lihat Semua
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #EDE8F5' }}>
                    {['Karyawan', 'Departemen', 'Jabatan', 'Status'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#A5A3AE' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {EMPLOYEES.map((e, i) => {
                    const st = STATUS_STYLE[e.status];
                    return (
                      <tr key={e.name} style={{ borderBottom: i < EMPLOYEES.length - 1 ? '1px solid #F5F2FB' : 'none' }}
                        onMouseEnter={(e2) => { e2.currentTarget.style.backgroundColor = '#FDFCFF'; }}
                        onMouseLeave={(e2) => { e2.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: '#C2185B' }}>
                              {e.name.charAt(0)}
                            </div>
                            <span className="text-sm font-medium" style={{ color: '#433C50' }}>{e.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-xs" style={{ color: '#A5A3AE' }}>{e.dept}</td>
                        <td className="px-6 py-3.5 text-xs" style={{ color: '#433C50' }}>{e.pos}</td>
                        <td className="px-6 py-3.5">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold" style={{ color: st.color, backgroundColor: st.bg }}>
                            {st.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Leave approvals */}
          <div className="lg:col-span-2 bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" style={{ color: '#FF9800' }} />
                <h2 className="text-sm font-bold" style={{ color: '#433C50' }}>Pengajuan Cuti</h2>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(255,152,0,.1)', color: '#FF9800' }}>
                {LEAVE_REQUESTS.length} pending
              </span>
            </div>
            <div className="p-4 space-y-3">
              {LEAVE_REQUESTS.map((lr) => (
                <div key={lr.name} className="rounded-xl p-3.5" style={{ backgroundColor: '#FDFCFF', border: '1px solid #F5F2FB' }}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold" style={{ color: '#433C50' }}>{lr.name}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(255,152,0,.1)', color: '#FF9800' }}>{lr.days} hari</span>
                  </div>
                  <p className="text-[10px] mt-0.5" style={{ color: '#A5A3AE' }}>{lr.type} · {lr.dates}</p>
                  <div className="flex gap-1.5 mt-2.5">
                    <button className="flex-1 py-1 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: '#4CAF50' }}>Setuju</button>
                    <button className="flex-1 py-1 rounded-lg text-xs font-semibold" style={{ color: '#EA5455', border: '1px solid rgba(234,84,85,.25)' }}>Tolak</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
