'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import AppShell, { NavItem } from '../../components/layout/AppShell';
import {
  HeartHandshake, BarChart2, Users, Calendar, Briefcase,
  CheckCircle, Clock, XCircle, TrendingUp, Settings, UserPlus,
} from 'lucide-react';

const NAV: NavItem[] = [
  { label: 'Dashboard',    href: '/recruitment',              icon: BarChart2 },
  { label: 'Lowongan',     href: '/recruitment/jobs',         icon: Briefcase },
  { label: 'Pelamar',      href: '/recruitment/applicants',   icon: Users, badge: 18,
    children: [
      { label: 'Semua',         href: '/recruitment/applicants' },
      { label: 'Baru',          href: '/recruitment/applicants?stage=new' },
      { label: 'Wawancara',     href: '/recruitment/applicants?stage=interview' },
      { label: 'Penawaran',     href: '/recruitment/applicants?stage=offer' },
    ],
  },
  { label: 'Wawancara',    href: '/recruitment/interviews',   icon: Calendar, badge: 5 },
  { label: 'Onboarding',   href: '/recruitment/onboarding',  icon: UserPlus },
  { label: 'Laporan',      href: '/recruitment/reports',      icon: TrendingUp },
  { label: 'Pengaturan',   href: '/recruitment/settings',     icon: Settings },
];

const STATS = [
  { label: 'Lowongan Aktif',    value: '8',  sub: '3 urgent',              color: '#AD1457', bg: 'rgba(173,20,87,.1)',   icon: Briefcase },
  { label: 'Total Pelamar',     value: '74', sub: '18 minggu ini',         color: '#9C27B0', bg: 'rgba(156,39,176,.1)',  icon: Users },
  { label: 'Wawancara Minggu Ini', value: '11', sub: '5 belum terjadwal',  color: '#2196F3', bg: 'rgba(33,150,243,.1)', icon: Calendar },
  { label: 'Direkrut Bulan Ini', value: '4', sub: 'Dari 26 penawaran',     color: '#4CAF50', bg: 'rgba(76,175,80,.1)',   icon: CheckCircle },
];

const APPLICANTS = [
  { name: 'Arif Wicaksono',   position: 'Senior Sales Executive',    stage: 'interview',   source: 'LinkedIn',    date: '24 Mei 2026', exp: '5 thn' },
  { name: 'Bintang Nugroho',  position: 'Accounting Staff',          stage: 'offer',       source: 'Jobstreet',   date: '23 Mei 2026', exp: '3 thn' },
  { name: 'Clara Putri',      position: 'UI/UX Designer',            stage: 'new',         source: 'Website',     date: '23 Mei 2026', exp: '2 thn' },
  { name: 'Dika Pratama',     position: 'Backend Developer',         stage: 'interview',   source: 'Glassdoor',   date: '22 Mei 2026', exp: '4 thn' },
  { name: 'Eka Wulandari',    position: 'HR Generalist',             stage: 'rejected',    source: 'Jobstreet',   date: '21 Mei 2026', exp: '2 thn' },
  { name: 'Fauzan Hakim',     position: 'Warehouse Supervisor',      stage: 'new',         source: 'Referral',    date: '21 Mei 2026', exp: '6 thn' },
];

const JOBS = [
  { title: 'Senior Sales Executive',   dept: 'Sales',      applicants: 12, urgent: true,  deadline: '1 Jun 2026' },
  { title: 'Accounting Staff',         dept: 'Finance',    applicants: 8,  urgent: false, deadline: '15 Jun 2026' },
  { title: 'UI/UX Designer',           dept: 'Teknologi',  applicants: 21, urgent: false, deadline: '30 Jun 2026' },
  { title: 'Backend Developer',        dept: 'Teknologi',  applicants: 15, urgent: true,  deadline: '5 Jun 2026' },
  { title: 'Warehouse Supervisor',     dept: 'Operasional', applicants: 6, urgent: false, deadline: '20 Jun 2026' },
];

const STAGE_MAP: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  new:       { label: 'Baru',       color: '#A5A3AE', bg: 'rgba(165,163,174,.12)', icon: Clock },
  interview: { label: 'Wawancara',  color: '#2196F3', bg: 'rgba(33,150,243,.1)',   icon: Calendar },
  offer:     { label: 'Penawaran',  color: '#FF9800', bg: 'rgba(255,152,0,.1)',     icon: Briefcase },
  hired:     { label: 'Diterima',   color: '#4CAF50', bg: 'rgba(76,175,80,.1)',     icon: CheckCircle },
  rejected:  { label: 'Ditolak',   color: '#EA5455', bg: 'rgba(234,84,85,.1)',     icon: XCircle },
};

export default function RecruitmentDashboard() {
  const { token } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;

  return (
    <AppShell
      appName="Rekrutmen"
      appColor="#AD1457"
      appGradient="from-pink-600 to-rose-700"
      appIcon={HeartHandshake}
      navItems={NAV}
      activeHref="/recruitment"
    >
      <div className="p-6 space-y-6">
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
          {/* Applicants */}
          <div className="lg:col-span-2 bg-white rounded-2xl border" style={{ borderColor: '#EDE8F5' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#EDE8F5' }}>
              <h2 className="font-bold text-sm" style={{ color: '#2F2B3D' }}>Pelamar Terbaru</h2>
              <button className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white" style={{ backgroundColor: '#AD1457' }}>+ Tambah Pelamar</button>
            </div>
            <div className="divide-y" style={{ borderColor: '#EDE8F5' }}>
              {APPLICANTS.map(a => {
                const st = STAGE_MAP[a.stage];
                const Icon = st.icon;
                return (
                  <div key={a.name} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-bold text-sm text-white" style={{ background: 'linear-gradient(135deg, #AD1457, #E91E63)' }}>
                      {a.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold" style={{ color: '#2F2B3D' }}>{a.name}</p>
                      <p className="text-[11px] mt-0.5 truncate" style={{ color: '#A5A3AE' }}>{a.position} · {a.exp} pengalaman · {a.source}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: st.bg, color: st.color }}>
                        <Icon className="h-3 w-3" />{st.label}
                      </span>
                      <p className="text-[10px] mt-0.5" style={{ color: '#B0AAB9' }}>{a.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Open Positions */}
          <div className="bg-white rounded-2xl border" style={{ borderColor: '#EDE8F5' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#EDE8F5' }}>
              <h2 className="font-bold text-sm" style={{ color: '#2F2B3D' }}>Lowongan Aktif</h2>
              <button className="text-xs font-semibold" style={{ color: '#AD1457' }}>+ Buka Lowongan</button>
            </div>
            <div className="divide-y" style={{ borderColor: '#EDE8F5' }}>
              {JOBS.map(job => (
                <div key={job.title} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-xs font-bold" style={{ color: '#2F2B3D' }}>{job.title}</p>
                        {job.urgent && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(234,84,85,.1)', color: '#EA5455' }}>Urgent</span>
                        )}
                      </div>
                      <p className="text-[11px] mt-0.5" style={{ color: '#A5A3AE' }}>{job.dept} · Deadline: {job.deadline}</p>
                    </div>
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg font-bold text-xs" style={{ backgroundColor: 'rgba(173,20,87,.08)', color: '#AD1457' }}>
                      {job.applicants}
                    </div>
                  </div>
                  <p className="text-[10px] mt-1.5" style={{ color: '#B0AAB9' }}>{job.applicants} pelamar</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline summary */}
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#EDE8F5' }}>
          <h2 className="font-bold text-sm mb-4" style={{ color: '#2F2B3D' }}>Pipeline Rekrutmen</h2>
          <div className="grid grid-cols-5 gap-3">
            {[
              { stage: 'Baru',       count: 28, color: '#A5A3AE' },
              { stage: 'Screening',  count: 18, color: '#2196F3' },
              { stage: 'Wawancara',  count: 14, color: '#9C27B0' },
              { stage: 'Penawaran',  count: 8,  color: '#FF9800' },
              { stage: 'Diterima',   count: 4,  color: '#4CAF50' },
            ].map((p, i) => (
              <div key={p.stage} className="text-center">
                <div className="flex items-end justify-center gap-1 mb-1">
                  {i > 0 && <div className="h-px flex-1 mb-3" style={{ backgroundColor: '#EDE8F5' }} />}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xl font-bold" style={{ color: p.color }}>{p.count}</span>
                    <div className="h-2 w-full rounded-full" style={{ backgroundColor: `${p.color}20` }}>
                      <div className="h-2 rounded-full" style={{ width: `${(p.count / 28) * 100}%`, backgroundColor: p.color }} />
                    </div>
                  </div>
                </div>
                <p className="text-[10px] font-semibold mt-1" style={{ color: '#A5A3AE' }}>{p.stage}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
