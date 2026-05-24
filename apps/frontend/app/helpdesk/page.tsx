'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/useAuthStore';
import AppShell, { NavItem } from '../../components/layout/AppShell';
import {
  MessageSquare, BarChart2, Users, Clock, Settings,
  CheckCircle, AlertTriangle, TrendingUp, Star, Zap,
} from 'lucide-react';

const NAV: NavItem[] = [
  { label: 'Dashboard',  href: '/helpdesk',          icon: BarChart2 },
  { label: 'Tiket',      href: '/helpdesk/tickets',  icon: MessageSquare, badge: 12,
    children: [
      { label: 'Semua',      href: '/helpdesk/tickets' },
      { label: 'Terbuka',    href: '/helpdesk/tickets?status=open' },
      { label: 'Diproses',   href: '/helpdesk/tickets?status=in_progress' },
      { label: 'Selesai',    href: '/helpdesk/tickets?status=solved' },
    ],
  },
  { label: 'Tim',        href: '/helpdesk/teams',    icon: Users },
  { label: 'SLA',        href: '/helpdesk/sla',      icon: Zap },
  { label: 'Laporan',    href: '/helpdesk/reports',  icon: TrendingUp },
  { label: 'Pengaturan', href: '/helpdesk/settings', icon: Settings },
];

const STATS = [
  { label: 'Tiket Terbuka',   value: '23',   sub: '5 mendesak',          color: '#E53935', bg: 'rgba(229,57,53,.1)',   icon: MessageSquare },
  { label: 'Diselesaikan',    value: '148',  sub: 'Bulan ini',            color: '#4CAF50', bg: 'rgba(76,175,80,.1)',   icon: CheckCircle },
  { label: 'Waktu Respons',   value: '1.4j', sub: 'Rata-rata hari ini',   color: '#2196F3', bg: 'rgba(33,150,243,.1)',  icon: Clock },
  { label: 'CSAT Score',      value: '4.6',  sub: 'Dari 5.0 (bulan ini)', color: '#FF9800', bg: 'rgba(255,152,0,.1)',   icon: Star },
];

const TICKETS = [
  { id: 'TKT-1234', customer: 'PT Maju Jaya',       subject: 'Invoice tidak muncul di portal',       priority: 3, team: 'Finance Support',  status: 'open',        created: '24 Mei 10:30', sla: 'ok' },
  { id: 'TKT-1233', customer: 'CV Berkah Abadi',     subject: 'Error saat ekspor laporan stok',       priority: 2, team: 'Teknis',            status: 'in_progress', created: '24 Mei 09:15', sla: 'warning' },
  { id: 'TKT-1232', customer: 'Toko Sumber Rejeki',  subject: 'Kasir tidak bisa print struk',         priority: 3, team: 'POS Support',       status: 'open',        created: '23 Mei 16:40', sla: 'breached' },
  { id: 'TKT-1231', customer: 'UD Karya Mandiri',    subject: 'Permintaan training modul akuntansi',  priority: 1, team: 'Customer Success',  status: 'in_progress', created: '23 Mei 11:00', sla: 'ok' },
  { id: 'TKT-1230', customer: 'PT Global Niaga',     subject: 'Integrasi Kledo gagal sinkronisasi',   priority: 2, team: 'Teknis',            status: 'solved',      created: '22 Mei 14:20', sla: 'ok' },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  open:        { label: 'Terbuka',  color: '#E53935', bg: 'rgba(229,57,53,.1)' },
  in_progress: { label: 'Diproses', color: '#2196F3', bg: 'rgba(33,150,243,.1)' },
  solved:      { label: 'Selesai',  color: '#4CAF50', bg: 'rgba(76,175,80,.1)' },
};

const SLA_MAP: Record<string, { color: string; label: string }> = {
  ok:       { color: '#4CAF50', label: 'OK' },
  warning:  { color: '#FF9800', label: 'Hampir' },
  breached: { color: '#EA5455', label: 'Lewat' },
};

const PRIORITY_LABELS = ['', 'Rendah', 'Normal', 'Tinggi', 'Kritis'];
const PRIORITY_COLORS = ['', '#A5A3AE', '#2196F3', '#FF9800', '#EA5455'];

export default function HelpdeskDashboard() {
  const { token } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;

  return (
    <AppShell
      appName="Helpdesk"
      appColor="#E53935"
      appGradient="from-red-500 to-red-700"
      appIcon={MessageSquare}
      navItems={NAV}
      activeHref="/helpdesk"
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

        <div className="bg-white rounded-2xl border" style={{ borderColor: '#EDE8F5' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#EDE8F5' }}>
            <h2 className="font-bold text-sm" style={{ color: '#2F2B3D' }}>Tiket Terbaru</h2>
            <button className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white" style={{ backgroundColor: '#E53935' }}>+ Tiket Baru</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid #EDE8F5' }}>
                  {['Tiket', 'Pelanggan', 'Subjek', 'Prioritas', 'Tim', 'SLA', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-semibold" style={{ color: '#A5A3AE' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TICKETS.map(t => {
                  const st = STATUS_MAP[t.status];
                  const sla = SLA_MAP[t.sla];
                  return (
                    <tr key={t.id} className="border-b" style={{ borderColor: '#F5F4F9' }}>
                      <td className="px-5 py-3.5 font-bold" style={{ color: '#E53935' }}>{t.id}</td>
                      <td className="px-5 py-3.5 font-medium" style={{ color: '#2F2B3D' }}>{t.customer}</td>
                      <td className="px-5 py-3.5 max-w-xs truncate" style={{ color: '#6D6777' }}>{t.subject}</td>
                      <td className="px-5 py-3.5 font-semibold" style={{ color: PRIORITY_COLORS[t.priority] }}>{PRIORITY_LABELS[t.priority]}</td>
                      <td className="px-5 py-3.5" style={{ color: '#6D6777' }}>{t.team}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold" style={{ color: sla.color }}>{sla.label}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded-full font-semibold text-[10px]" style={{ backgroundColor: st.bg, color: st.color }}>{st.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Teknis',          open: 8,  solved: 52, color: '#5C6BC0' },
            { label: 'Finance Support', open: 5,  solved: 38, color: '#00ACC1' },
            { label: 'POS Support',     open: 6,  solved: 31, color: '#F57F17' },
          ].map(team => {
            const total = team.open + team.solved;
            const pct = total > 0 ? Math.round((team.solved / total) * 100) : 0;
            return (
              <div key={team.label} className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#EDE8F5' }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold" style={{ color: '#2F2B3D' }}>{team.label}</p>
                  <Users className="h-4 w-4" style={{ color: team.color }} />
                </div>
                <div className="flex justify-between text-xs mb-2">
                  <span style={{ color: '#EA5455' }}>{team.open} terbuka</span>
                  <span style={{ color: '#4CAF50' }}>{team.solved} selesai</span>
                </div>
                <div className="h-2 rounded-full" style={{ backgroundColor: '#EDE8F5' }}>
                  <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: team.color }} />
                </div>
                <p className="text-[10px] mt-1.5 text-right font-semibold" style={{ color: '#A5A3AE' }}>{pct}% selesai</p>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
