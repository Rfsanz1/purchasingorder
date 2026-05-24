'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/store/useAuthStore';
import AppShell from '../../../components/layout/AppShell';
import { HR_CONFIG, HR_NAV } from '../../../lib/nav-configs';
import { UserPlus, Plus, Briefcase } from 'lucide-react';

const JOBS = [
  { title: 'Sales Executive',     dept: 'Sales',     open: 2, applicants: 14, status: 'active' },
  { title: 'Admin Gudang',        dept: 'Warehouse', open: 1, applicants: 8,  status: 'active' },
  { title: 'Driver Pengiriman',   dept: 'Delivery',  open: 2, applicants: 23, status: 'active' },
  { title: 'Accounting Staff',    dept: 'Finance',   open: 1, applicants: 11, status: 'reviewing' },
  { title: 'IT Support',          dept: 'IT',        open: 1, applicants: 6,  status: 'closed' },
];

export default function HrRecruitmentPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;
  return (
    <AppShell {...HR_CONFIG} navItems={HR_NAV} activeHref="/hr/recruitment">
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div><h1 className="text-xl font-bold" style={{ color: '#433C50' }}>Rekrutmen</h1><p className="text-sm mt-0.5" style={{ color: '#A5A3AE' }}>Lowongan pekerjaan dan pelamar</p></div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: HR_CONFIG.appColor }}><Plus className="h-4 w-4" /> Lowongan Baru</button>
        </div>
        <div className="grid gap-3">
          {JOBS.map((j) => (
            <div key={j.title} className="bg-white rounded-2xl p-5 flex items-center justify-between" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(194,24,91,.1)' }}>
                  <Briefcase className="h-5 w-5" style={{ color: HR_CONFIG.appColor }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: '#433C50' }}>{j.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#A5A3AE' }}>{j.dept} · {j.open} posisi terbuka</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-lg font-bold" style={{ color: HR_CONFIG.appColor }}>{j.applicants}</p>
                  <p className="text-xs" style={{ color: '#A5A3AE' }}>Pelamar</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{
                  color: j.status === 'active' ? '#4CAF50' : j.status === 'reviewing' ? '#FF9800' : '#A5A3AE',
                  backgroundColor: j.status === 'active' ? 'rgba(76,175,80,.1)' : j.status === 'reviewing' ? 'rgba(255,152,0,.1)' : 'rgba(165,163,174,.12)',
                }}>
                  {j.status === 'active' ? 'Aktif' : j.status === 'reviewing' ? 'Review' : 'Ditutup'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
