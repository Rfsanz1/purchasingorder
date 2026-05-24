'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import AppShell, { NavItem } from '../../components/layout/AppShell';
import {
  DollarSign, BarChart2, Users, FileText, Calendar,
  CheckCircle, Clock, Settings, TrendingUp, Download,
} from 'lucide-react';

const NAV: NavItem[] = [
  { label: 'Dashboard',    href: '/payroll',              icon: BarChart2 },
  { label: 'Penggajian',   href: '/payroll/payslips',     icon: FileText, badge: 3,
    children: [
      { label: 'Semua Slip', href: '/payroll/payslips' },
      { label: 'Draft',      href: '/payroll/payslips?status=draft' },
      { label: 'Diverifikasi', href: '/payroll/payslips?status=done' },
    ],
  },
  { label: 'Karyawan',     href: '/hr/employees',         icon: Users },
  { label: 'Aturan Gaji',  href: '/payroll/rules',        icon: Settings },
  { label: 'Jadwal',       href: '/payroll/schedules',    icon: Calendar },
  { label: 'Laporan',      href: '/payroll/reports',      icon: TrendingUp },
  { label: 'Pengaturan',   href: '/payroll/settings',     icon: Settings },
];

const STATS = [
  { label: 'Total Gaji Mei 2026',   value: 'Rp 412 Jt', sub: '+3.2% vs bulan lalu',    color: '#673AB7', bg: 'rgba(103,58,183,.1)',  icon: DollarSign },
  { label: 'Karyawan Digaji',       value: '148',         sub: '2 lainnya tidak aktif',  color: '#4CAF50', bg: 'rgba(76,175,80,.1)',   icon: Users },
  { label: 'Slip Belum Dikirim',    value: '3',           sub: 'Perlu verifikasi',       color: '#FF9800', bg: 'rgba(255,152,0,.1)',   icon: FileText },
  { label: 'Rata-rata Gaji',        value: 'Rp 2.78 Jt', sub: 'Per karyawan',           color: '#2196F3', bg: 'rgba(33,150,243,.1)',  icon: TrendingUp },
];

const PAYROLL_RUNS = [
  { period: 'Mei 2026',    employees: 148, total: 'Rp 412.040.000', status: 'done',    date: '25 Mei 2026' },
  { period: 'Apr 2026',    employees: 146, total: 'Rp 399.280.000', status: 'done',    date: '25 Apr 2026' },
  { period: 'Mar 2026',    employees: 145, total: 'Rp 391.500.000', status: 'done',    date: '25 Mar 2026' },
  { period: 'Feb 2026',    employees: 143, total: 'Rp 382.750.000', status: 'done',    date: '25 Feb 2026' },
];

const EMPLOYEES = [
  { name: 'Rudi Hartono',   dept: 'Sales',      position: 'Sales Executive',    gross: 'Rp 4.200.000',  net: 'Rp 3.780.000',  status: 'done' },
  { name: 'Sari Dewi',      dept: 'Finance',    position: 'Accounting Staff',   gross: 'Rp 3.800.000',  net: 'Rp 3.430.000',  status: 'done' },
  { name: 'Agus Wijaya',    dept: 'Warehouse',  position: 'Supervisor',         gross: 'Rp 5.100.000',  net: 'Rp 4.560.000',  status: 'draft' },
  { name: 'Rina Kusuma',    dept: 'HR',         position: 'HR Officer',         gross: 'Rp 3.600.000',  net: 'Rp 3.240.000',  status: 'done' },
  { name: 'Budi Prasetyo',  dept: 'Delivery',   position: 'Driver',             gross: 'Rp 2.900.000',  net: 'Rp 2.640.000',  status: 'draft' },
];

const BREAKDOWN = [
  { label: 'Gaji Pokok',      amount: 'Rp 298.400.000', pct: 72.4 },
  { label: 'Tunjangan',       amount: 'Rp 64.800.000',  pct: 15.7 },
  { label: 'Lembur',          amount: 'Rp 28.400.000',  pct: 6.9 },
  { label: 'BPJS Ketenagakerjaan', amount: 'Rp 12.360.000', pct: 3.0 },
  { label: 'PPh 21',          amount: 'Rp 8.080.000',   pct: 2.0 },
];

export default function PayrollDashboard() {
  const { token } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;

  return (
    <AppShell
      appName="Penggajian"
      appColor="#673AB7"
      appGradient="from-purple-600 to-purple-800"
      appIcon={DollarSign}
      navItems={NAV}
      activeHref="/payroll"
    >
      <div className="p-6 space-y-6">
        {/* Action banner */}
        <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, #673AB7, #9C27B0)' }}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,.15)' }}>
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Penggajian Mei 2026</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,.75)' }}>148 karyawan · Rp 412.040.000 · Jatuh tempo 25 Mei 2026</p>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold" style={{ backgroundColor: 'rgba(255,255,255,.2)', color: '#fff', border: '1px solid rgba(255,255,255,.3)' }}>
              <Download className="h-3.5 w-3.5" /> Export
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white" style={{ color: '#673AB7' }}>
              <CheckCircle className="h-3.5 w-3.5" /> Proses Sekarang
            </button>
          </div>
        </div>

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
          {/* Employee payslips */}
          <div className="lg:col-span-2 bg-white rounded-2xl border" style={{ borderColor: '#EDE8F5' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#EDE8F5' }}>
              <h2 className="font-bold text-sm" style={{ color: '#2F2B3D' }}>Slip Gaji Karyawan — Mei 2026</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(103,58,183,.1)', color: '#673AB7' }}>148 karyawan</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid #EDE8F5' }}>
                    {['Karyawan', 'Departemen', 'Jabatan', 'Gaji Kotor', 'Gaji Bersih', 'Status'].map(h => (
                      <th key={h} className="px-5 py-3 text-left font-semibold" style={{ color: '#A5A3AE' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {EMPLOYEES.map(e => (
                    <tr key={e.name} className="border-b" style={{ borderColor: '#F5F4F9' }}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full font-bold text-[10px] text-white" style={{ background: 'linear-gradient(135deg, #673AB7, #9C27B0)' }}>
                            {e.name.charAt(0)}
                          </div>
                          <span className="font-semibold" style={{ color: '#2F2B3D' }}>{e.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5" style={{ color: '#6D6777' }}>{e.dept}</td>
                      <td className="px-5 py-3.5" style={{ color: '#6D6777' }}>{e.position}</td>
                      <td className="px-5 py-3.5 font-semibold" style={{ color: '#2F2B3D' }}>{e.gross}</td>
                      <td className="px-5 py-3.5 font-bold" style={{ color: '#673AB7' }}>{e.net}</td>
                      <td className="px-5 py-3.5">
                        {e.status === 'done'
                          ? <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: 'rgba(76,175,80,.1)', color: '#4CAF50' }}>Selesai</span>
                          : <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: 'rgba(255,152,0,.1)', color: '#FF9800' }}>Draft</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-white rounded-2xl border" style={{ borderColor: '#EDE8F5' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: '#EDE8F5' }}>
              <h2 className="font-bold text-sm" style={{ color: '#2F2B3D' }}>Rincian Pengeluaran</h2>
            </div>
            <div className="px-5 py-4 space-y-4">
              {BREAKDOWN.map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium" style={{ color: '#2F2B3D' }}>{item.label}</span>
                    <span className="font-bold" style={{ color: '#673AB7' }}>{item.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: '#EDE8F5' }}>
                    <div className="h-2 rounded-full" style={{ width: `${item.pct}%`, background: 'linear-gradient(90deg, #673AB7, #9C27B0)' }} />
                  </div>
                  <p className="text-[10px] mt-0.5" style={{ color: '#A5A3AE' }}>{item.amount}</p>
                </div>
              ))}
            </div>
            <div className="px-5 pb-5">
              <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'rgba(103,58,183,.06)', border: '1px solid rgba(103,58,183,.15)' }}>
                <p className="text-[10px] font-medium" style={{ color: '#A5A3AE' }}>Total Penggajian Mei</p>
                <p className="text-lg font-bold mt-0.5" style={{ color: '#673AB7' }}>Rp 412.040.000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
