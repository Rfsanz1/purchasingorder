'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { useAuthStore } from '../../../lib/useAuthStore';
import { ArrowLeft, CalendarDays, ClipboardList, CheckSquare2, FileText, CircleDashed } from 'lucide-react';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value || 0);
}

export default function ExpenseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { token, user, loadProfile } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [expense, setExpense] = useState<any>(null);
  const [journals, setJournals] = useState<any[]>([]);

  useEffect(() => {
    if (!token) { router.replace('/login'); return; }
    const init = async () => {
      try {
        if (!user) await loadProfile();
        const [expenseRes, journalRes] = await Promise.all([
          api.get(`/expenses/${params.id}`),
          api.get('/finance/journals', { params: { referensi: params.id, limit: 10 } }),
        ]);
        setExpense(expenseRes.data);
        setJournals(journalRes.data.data || journalRes.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [token, params.id]);

  if (!token || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-slate-600">Memuat detail expense...</div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 text-center">
          <p className="text-slate-600">Expense tidak ditemukan.</p>
          <button onClick={() => router.push('/expenses')} className="mt-6 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700">Kembali ke daftar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button type="button" onClick={() => router.push('/expenses')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900">
              <ArrowLeft size={16} /> Kembali
            </button>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">Detail Expense</h1>
            <p className="mt-2 text-sm text-slate-500">{expense.number} · {new Date(expense.date).toLocaleDateString('id-ID')}</p>
          </div>
          <div className="space-y-2 text-right">
            <div className="text-sm text-slate-500">Status</div>
            <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold uppercase text-slate-800">{expense.status}</div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Vendor</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{expense.contact?.name || 'Tidak ada vendor'}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Akun Beban</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{expense.account?.name || '-'}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Rekening Bayar</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{expense.paymentAccount?.bankName ? `${expense.paymentAccount.bankName} - ${expense.paymentAccount.accountNo}` : '-'}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Cabang</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{expense.branch?.nama || '-'}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Jumlah</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{formatCurrency(expense.amount)}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Pajak</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{formatCurrency(expense.taxAmount)}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Total Bayar</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{formatCurrency(expense.totalAmount)}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Deskripsi</p>
                <p className="mt-2 text-sm text-slate-700">{expense.description || '-'}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Tag</p>
                <p className="mt-2 text-sm text-slate-700">{(expense.tags || []).join(', ') || '-'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Timeline Approval</h2>
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-full bg-indigo-100 p-2 text-indigo-600"><CalendarDays size={18} /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Dibuat</p>
                    <p className="text-sm text-slate-600">{new Date(expense.createdAt).toLocaleString('id-ID')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-full bg-amber-100 p-2 text-amber-600"><CheckSquare2 size={18} /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Disetujui</p>
                    <p className="text-sm text-slate-600">{expense.approvedAt ? new Date(expense.approvedAt).toLocaleString('id-ID') : 'Belum disetujui'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-full bg-emerald-100 p-2 text-emerald-600"><FileText size={18} /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Dibayar</p>
                    <p className="text-sm text-slate-600">{expense.paidAt ? new Date(expense.paidAt).toLocaleString('id-ID') : 'Belum dibayar'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Status Expense</h2>
              <div className="mt-4 space-y-3">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Dibuat oleh</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{expense.createdBy}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Disetujui oleh</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{expense.approvedBy || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Jurnal Terkait</h2>
              <p className="mt-1 text-sm text-slate-500">Catatan jurnal untuk pembayaran expense ini.</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{journals.length} entri</span>
          </div>
          <div className="mt-6 space-y-4">
            {journals.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-600">Belum ada jurnal terkait expense ini.</div>
            ) : journals.map((journal) => (
              <div key={journal.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{journal.nomor}</p>
                    <p className="text-sm text-slate-500">{new Date(journal.tanggal).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase text-slate-600">{journal.status}</div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {journal.lines.map((line) => (
                    <div key={line.id} className="rounded-3xl bg-white p-4 shadow-sm">
                      <p className="text-sm font-semibold text-slate-900">{line.account?.name || line.accountId}</p>
                      <p className="mt-2 text-sm text-slate-600">Debit: {formatCurrency(Number(line.debit))}</p>
                      <p className="text-sm text-slate-600">Kredit: {formatCurrency(Number(line.kredit))}</p>
                      <p className="mt-2 text-xs text-slate-500">{line.deskripsi || '-'}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
