@extends('layouts.erp')
@section('title', $title ?? 'Kas')
@section('content')
<div x-data="cashApp('{{ $jenis ?? '' }}')" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900" x-text="jenis === 'masuk' ? 'Kas Masuk' : jenis === 'keluar' ? 'Kas Keluar' : 'Kas & Bank'"></h1>
            <p class="text-gray-500 mt-1">Pencatatan transaksi kas perusahaan</p>
        </div>
        <button @click="openCreate()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            Tambah Transaksi
        </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-green-50 border border-green-100 rounded-xl p-4">
            <p class="text-xs text-green-700 mb-1">Total Kas Masuk</p>
            <p class="text-2xl font-bold text-green-600" x-text="formatCurrency(sumMasuk)"></p>
        </div>
        <div class="bg-red-50 border border-red-100 rounded-xl p-4">
            <p class="text-xs text-red-700 mb-1">Total Kas Keluar</p>
            <p class="text-2xl font-bold text-red-500" x-text="formatCurrency(sumKeluar)"></p>
        </div>
        <div class="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p class="text-xs text-blue-700 mb-1">Saldo Bersih</p>
            <p class="text-2xl font-bold" :class="saldo >= 0 ? 'text-blue-600' : 'text-red-600'" x-text="formatCurrency(saldo)"></p>
        </div>
    </div>

    <!-- Filter -->
    <div class="bg-white rounded-xl border p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari keterangan, no transaksi..." class="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
        <div x-show="!jenis">
            <select x-model="filterJenis" @change="load()" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="">Semua</option><option value="masuk">Masuk</option><option value="keluar">Keluar</option>
            </select>
        </div>
        <input x-model="fromDate" @change="load()" type="date" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
        <input x-model="toDate" @change="load()" type="date" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border overflow-hidden">
        <div x-show="loading" class="flex justify-center py-12"><div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
        <div x-show="!loading && rows.length === 0" class="text-center py-16 text-gray-400">
            <p>Belum ada transaksi kas. Tambah transaksi pertama!</p>
        </div>
        <div x-show="!loading && rows.length > 0" class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">No</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Jenis</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Kategori</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Keterangan</th>
                        <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Jumlah</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Metode</th>
                        <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    <template x-for="r in rows" :key="r.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3 text-xs text-gray-400 font-mono" x-text="r.no_transaksi"></td>
                            <td class="px-4 py-3 text-gray-600" x-text="r.tanggal"></td>
                            <td class="px-4 py-3">
                                <span :class="r.jenis==='masuk' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="px-2 py-0.5 rounded-full text-xs font-medium" x-text="r.jenis==='masuk' ? 'Masuk' : 'Keluar'"></span>
                            </td>
                            <td class="px-4 py-3 text-gray-600" x-text="r.kategori || '-'"></td>
                            <td class="px-4 py-3 text-gray-700" x-text="r.keterangan || '-'"></td>
                            <td class="px-4 py-3 text-right font-semibold" :class="r.jenis==='masuk' ? 'text-green-600' : 'text-red-500'" x-text="formatCurrency(r.jumlah)"></td>
                            <td class="px-4 py-3 text-gray-600 text-xs" x-text="r.metode_pembayaran || 'Cash'"></td>
                            <td class="px-4 py-3 text-right">
                                <button @click="del(r.id)" class="text-red-500 hover:text-red-700 text-xs font-medium">Hapus</button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
            <div class="px-4 py-3 border-t flex items-center justify-between text-sm text-gray-500">
                <span x-text="`${total} transaksi`"></span>
                <div class="flex gap-2">
                    <button @click="prevPage()" :disabled="page<=1" class="px-3 py-1 border rounded-lg disabled:opacity-40">‹</button>
                    <span x-text="`Hal ${page}`" class="px-2 py-1"></span>
                    <button @click="nextPage()" :disabled="rows.length<perPage" class="px-3 py-1 border rounded-lg disabled:opacity-40">›</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div x-show="modal" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" @click.self="modal=false">
        <div class="bg-white rounded-2xl w-full max-w-md shadow-xl" @click.stop>
            <div class="flex items-center justify-between px-6 py-4 border-b">
                <h2 class="font-semibold text-gray-900">Tambah Transaksi Kas</h2>
                <button @click="modal=false" class="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form @submit.prevent="save()" class="p-6 space-y-4">
                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Jenis *</label>
                    <select x-model="form.jenis" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <option value="masuk">Kas Masuk</option>
                        <option value="keluar">Kas Keluar</option>
                    </select>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Tanggal *</label>
                        <input x-model="form.tanggal" required type="date" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Jumlah *</label>
                        <input x-model.number="form.jumlah" required type="number" min="1" placeholder="0" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Kategori</label>
                    <select x-model="form.kategori" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <option value="">-- Pilih Kategori --</option>
                        <optgroup label="Masuk">
                            <option>Penjualan</option><option>Piutang Masuk</option><option>Modal</option><option>Investasi</option>
                        </optgroup>
                        <optgroup label="Keluar">
                            <option>Pembelian</option><option>Gaji</option><option>Utilitas</option><option>Operasional</option><option>Pajak</option>
                        </optgroup>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Metode Pembayaran</label>
                    <select x-model="form.metode_pembayaran" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <option>Cash</option><option>Transfer Bank</option><option>E-Wallet</option><option>Cek/Giro</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Referensi</label>
                    <input x-model="form.referensi" type="text" placeholder="No invoice, no bukti..." class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Keterangan</label>
                    <textarea x-model="form.keterangan" rows="2" placeholder="Keterangan transaksi" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
                </div>
                <div class="flex gap-3 pt-2">
                    <button type="submit" :disabled="saving" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm disabled:opacity-50" x-text="saving ? 'Menyimpan...' : 'Simpan'"></button>
                    <button type="button" @click="modal=false" class="flex-1 border text-gray-700 py-2 rounded-lg font-medium text-sm">Batal</button>
                </div>
            </form>
        </div>
    </div>
    <div x-show="toast" x-transition x-cloak class="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl text-sm shadow-xl" x-text="toast"></div>
</div>
<script>
function cashApp(initialJenis) {
    return {
        jenis: initialJenis, rows: [], total: 0, page: 1, perPage: 20, loading: true,
        search: '', filterJenis: initialJenis, fromDate: '', toDate: '',
        sumMasuk: 0, sumKeluar: 0, saldo: 0,
        modal: false, saving: false, toast: '',
        form: { jenis: initialJenis || 'masuk', tanggal: new Date().toISOString().slice(0,10), jumlah: '', kategori: '', metode_pembayaran: 'Cash', referensi: '', keterangan: '' },
        async init() { await this.load(); },
        async load() {
            this.loading = true;
            try {
                const p = new URLSearchParams({ search: this.search, jenis: this.filterJenis, from: this.fromDate, to: this.toDate, page: this.page, per_page: this.perPage });
                const d = await fetch('/api/erp/cash?' + p).then(r => r.json());
                this.rows = d.data || []; this.total = d.total || 0;
                this.sumMasuk = d.sum_masuk || 0; this.sumKeluar = d.sum_keluar || 0; this.saldo = d.saldo || 0;
            } finally { this.loading = false; }
        },
        openCreate() { this.form = { jenis: this.jenis || 'masuk', tanggal: new Date().toISOString().slice(0,10), jumlah: '', kategori: '', metode_pembayaran: 'Cash', referensi: '', keterangan: '' }; this.modal = true; },
        async save() {
            this.saving = true;
            try {
                const r = await fetch('/api/erp/cash', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content||'' }, body: JSON.stringify(this.form) });
                const d = await r.json();
                if (d.ok) { this.modal = false; this.showToast('Transaksi berhasil disimpan'); this.load(); }
                else this.showToast('Gagal: ' + (d.message||'Error'));
            } finally { this.saving = false; }
        },
        async del(id) {
            if (!confirm('Hapus transaksi ini?')) return;
            await fetch(`/api/erp/cash/${id}`, { method: 'DELETE', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content||'' } });
            this.showToast('Transaksi dihapus'); this.load();
        },
        prevPage() { if (this.page>1) { this.page--; this.load(); } },
        nextPage() { if (this.rows.length>=this.perPage) { this.page++; this.load(); } },
        showToast(msg) { this.toast = msg; setTimeout(() => this.toast='', 3000); },
        formatCurrency(v) { return 'Rp ' + Number(v||0).toLocaleString('id-ID'); },
    };
}
</script>
@endsection
