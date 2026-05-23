'use client';
import { ModernLayout } from '../../components/layout/ModernLayout';
import { BarChart3, TrendingUp, FileText, DollarSign, Users, Package } from 'lucide-react';

const reports = [
  { href: '/reports/sales', icon: TrendingUp, label: 'Laporan Penjualan', desc: 'Revenue, order, dan performa sales per periode', color: 'from-emerald-600 to-emerald-800' },
  { href: '/reports/inventory', icon: Package, label: 'Laporan Inventory', desc: 'Stok masuk/keluar, nilai inventory, & perputaran', color: 'from-blue-600 to-blue-800' },
  { href: '/reports/finance', icon: DollarSign, label: 'Laporan Keuangan', desc: 'Neraca, laba rugi, arus kas', color: 'from-cyan-600 to-cyan-800' },
  { href: '/reports/customers', icon: Users, label: 'Laporan Pelanggan', desc: 'Analisis pelanggan, repeat order, CRM', color: 'from-purple-600 to-purple-800' },
  { href: '/reports/purchasing', icon: FileText, label: 'Laporan Pembelian', desc: 'PO, penerimaan barang, supplier analysis', color: 'from-orange-600 to-orange-800' },
  { href: '/reports/hr', icon: BarChart3, label: 'Laporan HR & Payroll', desc: 'Absensi, gaji, dan kinerja karyawan', color: 'from-pink-600 to-pink-800' },
];

export default function ReportsPage() {
  return (
    <ModernLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div><h1 className="text-2xl font-bold text-white flex items-center gap-2"><BarChart3 className="h-6 w-6 text-slate-400" /> Laporan</h1><p className="text-slate-400 mt-1">Analitik & laporan bisnis lengkap</p></div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {reports.map(r => (
            <a key={r.href} href={r.href} className={`rounded-2xl bg-gradient-to-br ${r.color} p-5 flex flex-col gap-3 hover:scale-[1.02] transition-transform`}>
              <r.icon className="h-7 w-7 text-white/80" />
              <div><p className="font-semibold text-white">{r.label}</p><p className="text-xs text-white/60 mt-1">{r.desc}</p></div>
            </a>
          ))}
        </div>
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-slate-400" /> Info Laporan</h3>
          <p className="text-sm text-slate-400">Pilih laporan di atas untuk melihat analitik detail. Semua laporan dapat diekspor ke format Excel (xlsx) atau PDF.</p>
        </div>
      </div>
    </ModernLayout>
  );
}
