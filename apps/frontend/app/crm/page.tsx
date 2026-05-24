'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import AppShell, { NavItem } from '../../components/layout/AppShell';
import { Users, BarChart2, TrendingUp, Settings, Plus, ArrowUpRight, Star, Phone, Mail, Calendar } from 'lucide-react';

const NAV: NavItem[] = [
  { label: 'Dashboard',   href: '/crm',              icon: BarChart2 },
  { label: 'Pipeline',    href: '/crm/pipeline',     icon: TrendingUp, badge: 12 },
  { label: 'Prospek',     href: '/crm/leads',        icon: Star },
  { label: 'Pelanggan',   href: '/customers',        icon: Users },
  { label: 'Aktivitas',   href: '/crm/activities',   icon: Calendar },
  { label: 'Laporan',     href: '/crm/reports',      icon: BarChart2 },
  { label: 'Pengaturan',  href: '/crm/settings',     icon: Settings },
];

const STATS = [
  { label: 'Prospek Aktif',     value: '84',   sub: '+7 minggu ini',      color: '#9C27B0', bg: 'rgba(156,39,176,.1)',  icon: Star },
  { label: 'Deal Won Bulan Ini', value: '23',  sub: 'Rp 156 Jt revenue',  color: '#4CAF50', bg: 'rgba(76,175,80,.1)',   icon: TrendingUp },
  { label: 'Pelanggan Baru',    value: '18',   sub: '+3 minggu ini',      color: '#9C27B0', bg: 'rgba(156,39,176,.1)',  icon: Users },
  { label: 'Aktivitas Hari Ini', value: '11',  sub: '4 panggilan, 7 email', color: '#FF9800', bg: 'rgba(255,152,0,.1)', icon: Phone },
];

const PIPELINE = [
  { stage: 'Baru',          count: 24, value: 'Rp 48 Jt',  color: '#B0AAB9' },
  { stage: 'Kualifikasi',   count: 18, value: 'Rp 72 Jt',  color: '#2196F3' },
  { stage: 'Proposal',      count: 14, value: 'Rp 112 Jt', color: '#FF9800' },
  { stage: 'Negosiasi',     count: 9,  value: 'Rp 90 Jt',  color: '#9C27B0' },
  { stage: 'Won',           count: 23, value: 'Rp 156 Jt', color: '#4CAF50' },
];

const LEADS = [
  { name: 'Budi Santoso',    company: 'PT Maju Sejahtera', stage: 'Negosiasi', value: 'Rp 24 Jt', probability: 80 },
  { name: 'Siti Rahayu',     company: 'CV Berkah Utama',   stage: 'Proposal',  value: 'Rp 18 Jt', probability: 60 },
  { name: 'Ahmad Fauzi',     company: 'UD Karya Bersama',  stage: 'Kualifikasi', value: 'Rp 9 Jt', probability: 35 },
  { name: 'Dewi Kusuma',     company: 'PT Global Mandiri', stage: 'Proposal',  value: 'Rp 32 Jt', probability: 55 },
];

export default function CrmDashboard() {
  const { token } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;

  return (
    <AppShell appName="CRM" appColor="#8E24AA" appGradient="from-purple-500 to-purple-700" appIcon={Users} navItems={NAV} activeHref="/crm">
      <div className="p-6 space-y-6 max-w-6xl mx-auto">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#433C50' }}>Dashboard CRM</h1>
            <p className="text-sm mt-0.5" style={{ color: '#A5A3AE' }}>Pantau pipeline dan aktivitas penjualan</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#8E24AA' }}>
            <Plus className="h-4 w-4" /> Prospek Baru
          </button>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium" style={{ color: '#A5A3AE' }}>{s.label}</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: '#433C50' }}>{s.value}</p>
                  <p className="text-xs mt-1" style={{ color: '#4CAF50' }}>{s.sub}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: s.bg }}>
                  <s.icon className="h-5 w-5" style={{ color: s.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-4">
          {/* Pipeline funnel */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
            <h2 className="text-sm font-bold mb-4" style={{ color: '#433C50' }}>Pipeline Penjualan</h2>
            <div className="space-y-3">
              {PIPELINE.map((p) => (
                <div key={p.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: '#433C50' }}>{p.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: '#A5A3AE' }}>{p.count} deal</span>
                      <span className="text-xs font-semibold" style={{ color: '#433C50' }}>{p.value}</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: '#F5F2FB' }}>
                    <div className="h-2 rounded-full" style={{ backgroundColor: p.color, width: `${(p.count / 24) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hot leads */}
          <div className="lg:col-span-3 bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
              <h2 className="text-sm font-bold" style={{ color: '#433C50' }}>Prospek Unggulan</h2>
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: '#8E24AA', border: '1px solid rgba(142,36,170,.2)', backgroundColor: 'rgba(142,36,170,.06)' }}>
                Lihat Semua
              </button>
            </div>
            <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
              {LEADS.map((l) => (
                <div key={l.name} className="flex items-center justify-between px-6 py-4 transition-colors"
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FDFCFF'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: '#8E24AA' }}>
                      {l.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#433C50' }}>{l.name}</p>
                      <p className="text-xs" style={{ color: '#A5A3AE' }}>{l.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: '#433C50' }}>{l.value}</p>
                      <p className="text-xs" style={{ color: '#A5A3AE' }}>{l.stage}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs font-bold" style={{ color: '#4CAF50' }}>{l.probability}%</span>
                      <div className="h-1.5 w-14 rounded-full" style={{ backgroundColor: '#F5F2FB' }}>
                        <div className="h-1.5 rounded-full" style={{ backgroundColor: '#4CAF50', width: `${l.probability}%` }} />
                      </div>
                    </div>
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
