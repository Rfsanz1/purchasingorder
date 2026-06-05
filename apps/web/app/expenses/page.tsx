'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { useAuthStore } from '../../lib/useAuthStore';
import { PlusCircle, PieChart, Clock, DollarSign, ClipboardList, ArrowRight, RefreshCcw } from 'lucide-react';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value || 0);
}

function buildPieSegments(items: { account: any; totalAmount: number }[]) {
  const total = items.reduce((sum, item) => sum + item.totalAmount, 0) || 1;
  let startAngle = 0;
  return items.map((item, index) => {
    const fraction = item.totalAmount / total;
    const angle = fraction * Math.PI * 2;
    const endAngle = startAngle + angle;
    const largeArc = angle > Math.PI ? 1 : 0;
    const r = 70;
    const x1 = 90 + r * Math.cos(startAngle - Math.PI / 2);
    const y1 = 90 + r * Math.sin(startAngle - Math.PI / 2);
    const x2 = 90 + r * Math.cos(endAngle - Math.PI / 2);
    const y2 = 90 + r * Math.sin(endAngle - Math.PI / 2);
    const path = `M90 90 L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    const color = [`#4338CA`, `#0EA5E9`, `#10B981`, `#F59E0B`, `#EF4444`, `#8B5CF6`, `#EC4899`][index % 7];
    startAngle = endAngle;
    return { path, color, label: item.account?.name || item.accountId || 'Lainnya', value: item.totalAmount };
  });
}

export default function ExpensesPage() {
  const router = useRouter();
  const { token, user, loadProfile, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [summary, setSummary] = useState<{ totalAmount: number }>({ totalAmount: 0 });
  const [todayTotal, setTodayTotal] = useState<number>(0);
  const [waitingApproval, setWaitingApproval] = useState<number>(0);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [accountFilter, setAccountFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [startDate, setStartDate] = useState<string>(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [refreshing, setRefreshing] = useState(false);

  const pieSegments = useMemo(() => buildPieSegments(chartData), [chartData]);

  useEffect(() => {
    if (!token) { router.replace('/login'); return; }
    const init = async () => {
      try {
        if (!user) await loadProfile();
        await Promise.all([loadExpenses(), loadSummary(), loadTodayTotal(), loadWaitingApproval(), loadChartData(), loadLookupData()]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    loadExpenses();
    loadSummary();
    loadChartData();
  }, [statusFilter, accountFilter, branchFilter, startDate, endDate]);

  async function loadLookupData() {
    try {
      const [accountRes, branchRes] = await Promise.all([
        api.get('/finance/accounts', { params: { type: 'EXPENSE' } }),
        api.get('/branch'),
      ]);
      setAccounts(accountRes.data ?? []);
      setBranches(branchRes.data ?? []);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadExpenses() {
    setRefreshing(true);
    try {
      const res = await api.get('/expenses', {
        params: {
          status: statusFilter || undefined,
          accountId: accountFilter || undefined,
          branchId: branchFilter || undefined,
          startDate,
          endDate,
          limit: 30,
        },
      });
      setExpenses(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }

  async function loadSummary() {
    try {
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
      const monthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().slice(0, 10);
      const res = await api.get('/expenses/reports/summary', { params: { startDate: monthStart, endDate: monthEnd } });
      setSummary(res.data || { totalAmount: 0 });
    } catch (err) {
      console.error(err);
    }
  }

  async function loadTodayTotal() {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const res = await api.get('/expenses/reports/summary', { params: { startDate: today, endDate: today } });
      setTodayTotal(res.data?.totalAmount ?? 0);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadWaitingApproval() {
    try {
      const res = await api.get('/expenses', { params: { status: 'submitted', page: 1, limit: 1 } });
      setWaitingApproval(res.data?.total ?? 0);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadChartData() {
    try {
      const res = await api.get('/expenses/reports/by-account', { params: { startDate, endDate } });
      setChartData(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  if (!token || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 animate-spin">⏳</div>
          <p className="mt-4 text-sm text-slate-500">Memuat data Expense...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Expense</p>
            <h1 className="text-3xl font-semibold text-slate-900">Manajemen Biaya</h1>
            <p className="mt-2 text-sm text-slate-600">Lihat, buat, dan pantau expense sepanjang bulan dengan status approval.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => router.push('/expenses/new')} className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
              <PlusCircle size={16} /> Expense Baru
            </button>
            <button type="button" onClick={() => { loadExpenses(); loadSummary(); loadTodayTotal(); loadWaitingApproval(); loadChartData(); }} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <RefreshCcw size={16} /> Segarkan
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-3 text-slate-500"><Clock size={18} /> Total Biaya Bulan Ini</div>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{formatCurrency(summary.totalAmount ?? 0)}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-3 text-slate-500"><ClipboardList size={18} /> Menunggu Approval</div>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{waitingApproval}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-3 text-slate-500"><DollarSign size={18} /> Total Biaya Hari Ini</div>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{formatCurrency(todayTotal)}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-3 text-slate-500"><PieChart size={18} /> Grafik Biaya per Akun</div>
            <p className="mt-4 text-sm text-slate-500">Periode {startDate} sampai {endDate}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[320px_1fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Filter</h2>
            <div className="mt-4 space-y-4">
              <label className="block text-sm font-medium text-slate-700">Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500">
                <option value="">Semua status</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div className="mt-4 space-y-4">
              <label className="block text-sm font-medium text-slate-700">Akun Beban</label>
              <select value={accountFilter} onChange={(e) => setAccountFilter(e.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500">
                <option value="">Semua akun</option>
                {accounts.map((account) => (<option key={account.id} value={account.id}>{account.code} - {account.name}</option>))}
              </select>
            </div>
            <div className="mt-4 space-y-4">
              <label className="block text-sm font-medium text-slate-700">Cabang</label>
              <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500">
                <option value="">Semua cabang</option>
                {branches.map((branch) => (<option key={branch.id} value={branch.id}>{branch.nama}</option>))}
              </select>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700">Dari</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Sampai</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Detail Biaya per Akun</h2>
            <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-start">
              <div className="flex-1">
                <div className="mx-auto h-[180px] w-[180px]">
                  <svg viewBox="0 0 180 180" className="w-full h-full">
                    {pieSegments.map((segment, idx) => (
                      <path key={idx} d={segment.path} fill={segment.color} />
                    ))}
                    <circle cx="90" cy="90" r="42" fill="#f8fafc" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                {pieSegments.slice(0, 6).map((segment, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: segment.color }} />
                      <span className="text-sm font-medium text-slate-800">{segment.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{formatCurrency(segment.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Daftar Expense</h2>
                <p className="text-sm text-slate-500">{expenses.length} expense ditampilkan.</p>
              </div>
              <div className="text-sm text-slate-500">{refreshing ? 'Memperbarui...' : 'Siap'}</div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">No</th>
                  <th className="px-6 py-4 text-left font-medium">Nomor</th>
                  <th className="px-6 py-4 text-left font-medium">Tanggal</th>
                  <th className="px-6 py-4 text-left font-medium">Vendor</th>
                  <th className="px-6 py-4 text-left font-medium">Akun</th>
                  <th className="px-6 py-4 text-right font-medium">Jumlah</th>
                  <th className="px-6 py-4 text-right font-medium">Total</th>
                  <th className="px-6 py-4 text-left font-medium">Status</th>
                  <th className="px-6 py-4 text-left font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-slate-500">Tidak ada expense untuk filter saat ini.</td>
                  </tr>
                ) : expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">{expense.number}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{expense.number}</td>
                    <td className="px-6 py-4">{new Date(expense.date).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4">{expense.contact?.name || '-'}</td>
                    <td className="px-6 py-4">{expense.account?.name || '-'}</td>
                    <td className="px-6 py-4 text-right">{formatCurrency(expense.amount)}</td>
                    <td className="px-6 py-4 text-right">{formatCurrency(expense.totalAmount)}</td>
                    <td className="px-6 py-4 uppercase text-slate-600">{expense.status || '-'}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => router.push(`/expenses/${expense.id}`)} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                        <ArrowRight size={14} /> Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
