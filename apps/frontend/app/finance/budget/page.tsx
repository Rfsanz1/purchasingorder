'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../lib/store/useAuthStore';
import AppShell from '../../../components/layout/AppShell';
import { ACCOUNTING_CONFIG, ACCOUNTING_NAV } from '../../../lib/nav-configs';
import { Target, Plus, Search, RefreshCw, X, TrendingUp, AlertTriangle } from 'lucide-react';

const C = ACCOUNTING_CONFIG.appColor;

const SAMPLE_BUDGETS = [
  { id: 1, name: 'Budget Operasional Q1 2025', period: 'Q1 2025', department: 'Operasional', total_budget: 500000000, used: 320000000, status: 'active' },
  { id: 2, name: 'Budget Marketing Q1 2025', period: 'Q1 2025', department: 'Marketing', total_budget: 150000000, used: 98000000, status: 'active' },
  { id: 3, name: 'Budget HR & Payroll Q1 2025', period: 'Q1 2025', department: 'HR', total_budget: 800000000, used: 790000000, status: 'warning' },
  { id: 4, name: 'Budget IT & Infrastruktur 2025', period: 'FY 2025', department: 'IT', total_budget: 200000000, used: 45000000, status: 'active' },
];

const BUDGET_LINES = [
  { account: '5.1.1.001', name: 'Gaji Pokok', budget: 600000000, actual: 590000000 },
  { account: '5.1.2.001', name: 'BPJS Ketenagakerjaan', budget: 60000000, actual: 59000000 },
  { account: '5.1.3.001', name: 'Tunjangan Transportasi', budget: 36000000, actual: 35000000 },
  { account: '5.2.1.001', name: 'Biaya Sewa Kantor', budget: 120000000, actual: 120000000 },
  { account: '5.2.2.001', name: 'Utilitas & Listrik', budget: 30000000, actual: 28000000 },
  { account: '5.3.1.001', name: 'Biaya Pemasaran', budget: 150000000, actual: 98000000 },
];

export default function BudgetPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ name: '', period: '', department: '', total_budget: '' });

  useEffect(() => { if (!token) router.push('/login'); }, [token]);
  if (!token) return null;

  const totalBudget = SAMPLE_BUDGETS.reduce((s, b) => s + b.total_budget, 0);
  const totalUsed = SAMPLE_BUDGETS.reduce((s, b) => s + b.used, 0);

  return (
    <AppShell {...ACCOUNTING_CONFIG} navItems={ACCOUNTING_NAV} activeHref="/finance/budget">
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#1E1B4B' }}>Budget Management</h1>
            <p className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>Kelola anggaran per departemen dan periode</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: C }}>
            <Plus className="h-4 w-4" /> Buat Budget
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Anggaran', value: totalBudget.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }), color: C },
            { label: 'Terpakai', value: totalUsed.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }), color: '#FF9800' },
            { label: 'Sisa Anggaran', value: (totalBudget - totalUsed).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }), color: '#4CAF50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
              <p className="text-xs font-medium" style={{ color: '#9CA3AF' }}>{s.label}</p>
              <p className="text-lg font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
              <h3 className="font-semibold text-sm" style={{ color: '#1E1B4B' }}>Daftar Budget</h3>
            </div>
            <div className="p-4 space-y-3">
              {SAMPLE_BUDGETS.map(b => {
                const pct = Math.round(b.used / b.total_budget * 100);
                const isWarning = pct >= 90;
                return (
                  <div key={b.id} onClick={() => setSelected(b)} className="p-4 rounded-xl cursor-pointer transition-colors" style={{ border: `1.5px solid ${selected?.id === b.id ? C : '#EDE8F5'}`, backgroundColor: selected?.id === b.id ? `rgba(56,142,60,.04)` : 'transparent' }}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#1E1B4B' }}>{b.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{b.department} • {b.period}</p>
                      </div>
                      {isWarning && <AlertTriangle className="h-4 w-4 flex-shrink-0" style={{ color: '#FF9800' }} />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs" style={{ color: '#6B7280' }}>
                        <span>{b.used.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}</span>
                        <span className="font-semibold" style={{ color: isWarning ? '#FF9800' : C }}>{pct}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#EDE8F5' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: isWarning ? '#FF9800' : C }} />
                      </div>
                      <p className="text-xs text-right" style={{ color: '#9CA3AF' }}>dari {b.total_budget.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl" style={{ border: '1.5px solid #EDE8F5', boxShadow: '0 1px 4px rgba(47,43,61,.06)' }}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
              <h3 className="font-semibold text-sm" style={{ color: '#1E1B4B' }}>Detail Baris Anggaran</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid #EDE8F5' }}>
                    {['Akun', 'Nama', 'Anggaran', 'Realisasi', '%'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: '#9CA3AF' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BUDGET_LINES.map(line => {
                    const pct = Math.round(line.actual / line.budget * 100);
                    return (
                      <tr key={line.account} style={{ borderBottom: '1px solid #F5F3FF' }}>
                        <td className="px-4 py-2.5 font-mono" style={{ color: C }}>{line.account}</td>
                        <td className="px-4 py-2.5" style={{ color: '#1E1B4B' }}>{line.name}</td>
                        <td className="px-4 py-2.5" style={{ color: '#1E1B4B' }}>{line.budget.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}</td>
                        <td className="px-4 py-2.5" style={{ color: pct > 95 ? '#EA5455' : '#1E1B4B' }}>{line.actual.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}</td>
                        <td className="px-4 py-2.5">
                          <span className="font-semibold" style={{ color: pct > 95 ? '#EA5455' : pct > 80 ? '#FF9800' : '#4CAF50' }}>{pct}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl w-full max-w-md mx-4" style={{ boxShadow: '0 20px 60px rgba(0,0,0,.15)' }}>
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EDE8F5' }}>
                <h2 className="font-bold" style={{ color: '#1E1B4B' }}>Buat Budget Baru</h2>
                <button onClick={() => setShowForm(false)} style={{ color: '#9CA3AF' }}><X className="h-5 w-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { key: 'name', label: 'Nama Budget', placeholder: 'Budget Q1 2025...' },
                  { key: 'period', label: 'Periode', placeholder: 'Q1 2025 / FY 2025' },
                  { key: 'department', label: 'Departemen', placeholder: 'Operasional...' },
                  { key: 'total_budget', label: 'Total Anggaran (Rp)', placeholder: '0', type: 'number' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1E1B4B' }}>{f.label}</label>
                    <input type={f.type ?? 'text'} className="w-full rounded-lg px-4 py-2.5 text-sm" style={{ border: '1.5px solid #EDE8F5', color: '#1E1B4B', outline: 'none' }} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(f2 => ({ ...f2, [f.key]: e.target.value }))} onFocus={e => e.target.style.borderColor = C} onBlur={e => e.target.style.borderColor = '#EDE8F5'} />
                  </div>
                ))}
                <div className="flex justify-end gap-3 pt-2" style={{ borderTop: '1px solid #EDE8F5' }}>
                  <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-lg text-sm font-semibold" style={{ border: '1.5px solid #EDE8F5', color: '#6B7280' }}>Batal</button>
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: C }}>
                    <Plus className="h-4 w-4" /> Simpan Budget
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
