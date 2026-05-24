'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/store/useAuthStore';
import AppShell from '../../../components/layout/AppShell';
import { REPORTS_CONFIG, REPORTS_NAV } from '../../../lib/nav-configs';
import { Bot, TrendingUp, BarChart3, Sparkles } from 'lucide-react';

const INSIGHTS = [
  { title: 'Revenue Diprediksi Naik 12%',       desc: 'Berdasarkan tren 5 bulan terakhir, Juni 2026 diproyeksikan mencapai Rp 318 Jt.', icon: TrendingUp, color: '#4CAF50' },
  { title: 'Segmen Pelanggan Terbesar: B2B',     desc: '72% revenue berasal dari pelanggan B2B. Fokus retensi pelanggan korporat sangat disarankan.', icon: BarChart3, color: '#2196F3' },
  { title: 'Waktu Order Puncak: 09:00–11:00',    desc: 'Alokasikan lebih banyak staf sales pada jam tersebut untuk memaksimalkan konversi.', icon: BarChart3, color: '#FF9800' },
  { title: 'Produk dengan ROI Tertinggi: Semen', desc: 'Margin keuntungan semen portland 34%. Pertimbangkan menaikkan target penjualan 20%.', icon: TrendingUp, color: '#8E24AA' },
];

export default function AiAnalyticsPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;
  return (
    <AppShell {...REPORTS_CONFIG} navItems={REPORTS_NAV} activeHref="/ai/analytics">
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(123,31,162,.1)' }}>
            <Bot className="h-5 w-5" style={{ color: '#7B1FA2' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#433C50' }}>AI Business Insights</h1>
            <p className="text-sm" style={{ color: '#A5A3AE' }}>Analitik prediktif dan rekomendasi bisnis berbasis AI</p>
          </div>
          <span className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(123,31,162,.1)', color: '#7B1FA2' }}>
            <Sparkles className="h-3.5 w-3.5" /> AI Aktif
          </span>
        </div>
        <div className="grid gap-4">
          {INSIGHTS.map((ins, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 flex gap-4" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0" style={{ backgroundColor: `${ins.color}1A` }}>
                <ins.icon className="h-5 w-5" style={{ color: ins.color }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: '#433C50' }}>{ins.title}</p>
                <p className="text-sm mt-1" style={{ color: '#A5A3AE' }}>{ins.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
