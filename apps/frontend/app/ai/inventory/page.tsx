'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/store/useAuthStore';
import AppShell from '../../../components/layout/AppShell';
import { INVENTORY_CONFIG, INVENTORY_NAV } from '../../../lib/nav-configs';
import { Bot, Package, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';

const RECOMMENDATIONS = [
  { type: 'restock',  product: 'Cat Tembok Dulux 5L',  message: 'Stok tersisa 3 unit. Reorder diperlukan dalam 2–3 hari berdasarkan tren penjualan.', priority: 'high' },
  { type: 'surplus',  product: 'Genteng Beton',          message: 'Stok terlalu tinggi (320 unit). Perputaran lambat. Pertimbangkan promo atau renegotiasi PO berikutnya.', priority: 'medium' },
  { type: 'trend',    product: 'Pipa PVC 4 inch',        message: 'Penjualan naik 28% bulan ini. Siapkan buffer stok tambahan untuk antisipasi permintaan.', priority: 'medium' },
  { type: 'restock',  product: 'Besi Beton 10mm',        message: 'Proyeksi kehabisan stok dalam 8 hari. Segera buat PO ke supplier.', priority: 'high' },
];

const PRIORITY_STYLE: Record<string, { color: string; bg: string }> = {
  high:   { color: '#EA5455', bg: 'rgba(234,84,85,.1)' },
  medium: { color: '#FF9800', bg: 'rgba(255,152,0,.1)' },
  low:    { color: '#4CAF50', bg: 'rgba(76,175,80,.1)' },
};
const TYPE_ICON = { restock: AlertTriangle, surplus: Package, trend: TrendingUp };

export default function AiInventoryPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;

  return (
    <AppShell {...INVENTORY_CONFIG} navItems={INVENTORY_NAV} activeHref="/ai/inventory">
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(245,124,0,.12)' }}>
            <Bot className="h-5 w-5" style={{ color: INVENTORY_CONFIG.appColor }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#433C50' }}>AI Inventory Assistant</h1>
            <p className="text-sm" style={{ color: '#A5A3AE' }}>Rekomendasi otomatis berbasis analitik stok dan tren penjualan</p>
          </div>
          <span className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(245,124,0,.1)', color: INVENTORY_CONFIG.appColor }}>
            <Sparkles className="h-3.5 w-3.5" /> AI Aktif
          </span>
        </div>
        <div className="space-y-3">
          {RECOMMENDATIONS.map((r, i) => {
            const Icon = TYPE_ICON[r.type as keyof typeof TYPE_ICON] ?? AlertTriangle;
            const ps = PRIORITY_STYLE[r.priority];
            return (
              <div key={i} className="bg-white rounded-2xl p-5 flex gap-4" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0" style={{ backgroundColor: ps.bg }}>
                  <Icon className="h-5 w-5" style={{ color: ps.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold" style={{ color: '#433C50' }}>{r.product}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ color: ps.color, backgroundColor: ps.bg }}>{r.priority === 'high' ? 'Prioritas Tinggi' : 'Prioritas Sedang'}</span>
                  </div>
                  <p className="text-sm" style={{ color: '#A5A3AE' }}>{r.message}</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0" style={{ color: INVENTORY_CONFIG.appColor, border: `1px solid ${INVENTORY_CONFIG.appColor}`, backgroundColor: 'rgba(245,124,0,.05)' }}>
                  Tindak Lanjuti
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
