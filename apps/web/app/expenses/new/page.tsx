'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { useAuthStore } from '../../lib/useAuthStore';
import { ArrowLeft, CheckCircle, FilePlus, UploadCloud } from 'lucide-react';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value || 0);
}

export default function NewExpensePage() {
  const router = useRouter();
  const { token, user, loadProfile, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [banks, setBanks] = useState<any[]>([]);
  const [taxes, setTaxes] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    contactId: '',
    accountId: '',
    paymentAccountId: '',
    amount: 0,
    taxId: '',
    taxAmount: 0,
    totalAmount: 0,
    description: '',
    attachment: '',
    tags: '',
    branchId: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectedTax = useMemo(() => taxes.find((tax) => tax.id === form.taxId), [taxes, form.taxId]);

  useEffect(() => {
    if (!token) { router.replace('/login'); return; }
    const init = async () => {
      try {
        if (!user) await loadProfile();
        const [contactRes, accountRes, bankRes, taxRes, branchRes] = await Promise.all([
          api.get('/contacts'),
          api.get('/finance/accounts', { params: { type: 'EXPENSE' } }),
          api.get('/finance/bank-accounts'),
          api.get('/tax'),
          api.get('/branch'),
        ]);
        setContacts(contactRes.data ?? []);
        setAccounts(accountRes.data ?? []);
        setBanks(bankRes.data ?? []);
        setTaxes(taxRes.data ?? []);
        setBranches(branchRes.data ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [token]);

  useEffect(() => {
    const amount = Number(form.amount || 0);
    const taxAmount = selectedTax ? Number((amount * Number(selectedTax.rate || 0)) / 100) : Number(form.taxAmount || 0);
    setForm((current) => ({ ...current, taxAmount, totalAmount: amount + taxAmount }));
  }, [form.amount, form.taxId, selectedTax]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.accountId) return setError('Akun beban wajib dipilih');
    try {
      setError(null);
      const result = await api.post('/expenses', {
        date: form.date,
        contactId: form.contactId || undefined,
        accountId: form.accountId,
        paymentAccountId: form.paymentAccountId || undefined,
        amount: Number(form.amount || 0),
        taxId: form.taxId || undefined,
        taxAmount: Number(form.taxAmount || 0),
        totalAmount: Number(form.totalAmount || 0),
        description: form.description,
        attachment: form.attachment,
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        branchId: form.branchId || undefined,
        createdBy: user?.id || 'system',
      });
      setSuccess('Expense berhasil dibuat');
      setTimeout(() => router.push(`/expenses/${result.data?.id || result?.id || ''}`), 600);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Gagal membuat expense');
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, attachment: String(reader.result || '') }));
    };
    reader.readAsDataURL(file);
  }

  if (!token || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center text-slate-600">Memuat form expense...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <button type="button" onClick={() => router.push('/expenses')} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900">
          <ArrowLeft size={16} /> Kembali ke Daftar Expense
        </button>
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-slate-900">Buat Expense Baru</h1>
          <p className="mt-2 text-sm text-slate-600">Isi informasi expense, akun beban, pajak, cabang, dan lampirkan bukti jika perlu.</p>
        </div>

        {error ? <div className="mb-4 rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        {success ? <div className="mb-4 rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}

        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Tanggal</span>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Vendor</span>
              <select value={form.contactId} onChange={(e) => setForm({ ...form, contactId: e.target.value })} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500">
                <option value="">Pilih vendor</option>
                {contacts.map((contact) => (<option key={contact.id} value={contact.id}>{contact.name}</option>))}
              </select>
            </label>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Akun Beban</span>
              <select value={form.accountId} onChange={(e) => setForm({ ...form, accountId: e.target.value })} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500">
                <option value="">Pilih akun beban</option>
                {accounts.map((account) => (<option key={account.id} value={account.id}>{account.code} - {account.name}</option>))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Rekening Pembayaran</span>
              <select value={form.paymentAccountId} onChange={(e) => setForm({ ...form, paymentAccountId: e.target.value })} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500">
                <option value="">Pilih rekening bank</option>
                {banks.map((bank) => (<option key={bank.id} value={bank.id}>{bank.bankName} - {bank.accountNo}</option>))}
              </select>
            </label>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Nominal</span>
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Pajak</span>
              <select value={form.taxId} onChange={(e) => setForm({ ...form, taxId: e.target.value })} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500">
                <option value="">Tanpa pajak</option>
                {taxes.map((tax) => (<option key={tax.id} value={tax.id}>{tax.kode} - {tax.nama} ({tax.rate}%)</option>))}
              </select>
            </label>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Jumlah Pajak</span>
              <input readOnly value={formatCurrency(form.taxAmount)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-900" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Total Pembayaran</span>
              <input readOnly value={formatCurrency(form.totalAmount)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-900" />
            </label>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Cabang</span>
              <select value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500">
                <option value="">Pilih cabang</option>
                {branches.map((branch) => (<option key={branch.id} value={branch.id}>{branch.nama}</option>))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Tag transaksi</span>
              <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Contoh: operasional,gas" className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500" />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Deskripsi</span>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500" />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Lampirkan bukti</span>
            <div className="mt-2 flex items-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-700">
              <UploadCloud size={18} />
              <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="w-full text-sm text-slate-900" />
            </div>
            {form.attachment ? <p className="mt-2 text-xs text-slate-500">File terlampir</p> : null}
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button type="button" onClick={() => router.push('/expenses')} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Kembali
            </button>
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
              <FilePlus size={16} /> Simpan Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
