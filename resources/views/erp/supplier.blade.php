@extends('layouts.erp')
@section('title', 'Supplier')
@section('content')
<div x-data="supplierApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
<<<<<<< HEAD
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">Data Supplier</h1>
            <p class="text-gray-500 mt-1">Kelola database supplier dan vendor</p>
        </div>
        <button @click="openCreate()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            Tambah Supplier
        </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4">
            <p class="text-xs text-gray-500 mb-1">Total Supplier</p>
            <p class="text-2xl font-bold text-gray-900" x-text="summary.total || 0"></p>
        </div>
        <div class="bg-white rounded-xl border p-4">
            <p class="text-xs text-gray-500 mb-1">Aktif</p>
            <p class="text-2xl font-bold text-green-600" x-text="summary.aktif || 0"></p>
        </div>
        <div class="bg-white rounded-xl border p-4">
            <p class="text-xs text-gray-500 mb-1">Non-Aktif</p>
            <p class="text-2xl font-bold text-red-500" x-text="summary.nonaktif || 0"></p>
        </div>
        <div class="bg-white rounded-xl border p-4">
            <p class="text-xs text-gray-500 mb-1">Total Pembelian</p>
            <p class="text-xl font-bold text-blue-600" x-text="formatCurrency(summary.total_pembelian || 0)"></p>
        </div>
    </div>

    <!-- Filter -->
    <div class="bg-white rounded-xl border p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari nama, kode, telepon..."
            class="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
        <select x-model="filterStatus" @change="load()" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">Semua Status</option>
            <option>Aktif</option><option>Non-Aktif</option>
        </select>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border overflow-hidden">
        <div x-show="loading" class="flex justify-center py-12">
            <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div x-show="!loading && rows.length === 0" class="text-center py-16 text-gray-400">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            <p>Belum ada supplier. Tambah supplier pertama!</p>
        </div>
        <div x-show="!loading && rows.length > 0" class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Kode</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nama</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Kontak</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Kota</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">TOP</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    <template x-for="r in rows" :key="r.id">
                        <tr class="hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-3 font-mono text-xs text-gray-500" x-text="r.kode || '-'"></td>
                            <td class="px-4 py-3 font-semibold text-gray-900" x-text="r.nama"></td>
                            <td class="px-4 py-3">
                                <div x-text="r.kontak || '-'" class="text-gray-700"></div>
                                <div x-text="r.telepon || ''" class="text-xs text-gray-400"></div>
                            </td>
                            <td class="px-4 py-3 text-gray-600" x-text="r.kota || '-'"></td>
                            <td class="px-4 py-3 text-gray-600" x-text="r.top ? r.top + ' hari' : '-'"></td>
                            <td class="px-4 py-3">
                                <span :class="r.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="px-2 py-0.5 rounded-full text-xs font-medium" x-text="r.status"></span>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <button @click="openEdit(r)" class="text-blue-600 hover:text-blue-800 text-xs font-medium mr-2">Edit</button>
                                <button @click="del(r.id)" class="text-red-500 hover:text-red-700 text-xs font-medium">Hapus</button>
                            </td>
=======
    <div x-show="toast.show" x-cloak x-transition :class="toast.type==='success'?'bg-green-600':'bg-red-600'" class="fixed top-4 right-4 z-50 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium" x-text="toast.msg"></div>

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Data Supplier</h1><p class="text-gray-500 mt-1 text-sm">Manajemen database supplier dan vendor</p></div>
        <button @click="openAdd()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>Tambah Supplier
        </button>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Supplier</p><p class="text-2xl font-bold text-gray-900" x-text="stats.total??0"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Aktif</p><p class="text-2xl font-bold text-green-600" x-text="stats.active??0"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Hutang</p><p class="text-2xl font-bold text-red-500" x-text="formatRp(stats.hutang??0)"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Transaksi Bulan Ini</p><p class="text-2xl font-bold text-blue-600" x-text="stats.txThisMonth??0"></p></div>
    </div>

    <div class="bg-white rounded-xl border shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari nama, kontak, kota..." class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
        <select x-model="filterStatus" @change="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">Semua Status</option><option>Aktif</option><option>Tidak Aktif</option><option>Blacklist</option>
        </select>
        <button @click="search='';filterStatus='';load()" class="bg-gray-50 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm">Reset</button>
    </div>

    <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Supplier</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Kontak</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Kota</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Saldo Hutang</th>
                        <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    <template x-if="loading"><tr><td colspan="6" class="px-4 py-12 text-center text-gray-400">Memuat data...</td></tr></template>
                    <template x-if="!loading && items.length===0"><tr><td colspan="6" class="px-4 py-12 text-center text-gray-400">
                        <p class="font-medium">Belum ada supplier</p>
                        <button @click="openAdd()" class="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">+ Tambah Supplier</button>
                    </td></tr></template>
                    <template x-for="s in items" :key="s.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3"><div class="font-medium text-gray-900" x-text="s.nama"></div><div class="text-xs text-gray-400" x-text="s.npwp?'NPWP: '+s.npwp:''"></div></td>
                            <td class="px-4 py-3 hidden md:table-cell"><div x-text="s.telepon||'-'"></div><div class="text-xs text-gray-400" x-text="s.email||''"></div></td>
                            <td class="px-4 py-3 hidden lg:table-cell text-gray-500" x-text="s.kota||'-'"></td>
                            <td class="px-4 py-3"><span :class="s.status==='Aktif'?'bg-green-100 text-green-700':s.status==='Blacklist'?'bg-red-100 text-red-700':'bg-gray-100 text-gray-600'" class="px-2 py-0.5 text-xs font-semibold rounded-full" x-text="s.status||'Aktif'"></span></td>
                            <td class="px-4 py-3 hidden lg:table-cell text-sm" x-text="formatRp(s.saldo_hutang||0)"></td>
                            <td class="px-4 py-3 text-right"><button @click="editItem(s)" class="text-blue-600 text-xs hover:underline mr-2">Edit</button><button @click="delItem(s)" class="text-red-500 text-xs hover:underline">Hapus</button></td>
>>>>>>> 62d477c (Activate non-AI related "Coming Soon" features in the sidebar)
                        </tr>
                    </template>
                </tbody>
            </table>
<<<<<<< HEAD
            <!-- Pagination -->
            <div class="px-4 py-3 border-t flex items-center justify-between text-sm text-gray-500">
                <span x-text="`${total} supplier`"></span>
                <div class="flex gap-2">
                    <button @click="prevPage()" :disabled="page <= 1" class="px-3 py-1 border rounded-lg disabled:opacity-40">‹</button>
                    <span x-text="`Hal ${page}`" class="px-2 py-1"></span>
                    <button @click="nextPage()" :disabled="rows.length < perPage" class="px-3 py-1 border rounded-lg disabled:opacity-40">›</button>
                </div>
=======
        </div>
        <div class="px-4 py-3 border-t flex items-center justify-between text-xs text-gray-400">
            <span>Total <span x-text="total"></span> supplier</span>
            <div class="flex gap-1">
                <button @click="page--;load()" :disabled="page<=1" class="px-3 py-1.5 border rounded-lg disabled:opacity-40">← Prev</button>
                <button @click="page++;load()" :disabled="page*10>=total" class="px-3 py-1.5 border rounded-lg disabled:opacity-40">Next →</button>
>>>>>>> 62d477c (Activate non-AI related "Coming Soon" features in the sidebar)
            </div>
        </div>
    </div>

<<<<<<< HEAD
    <!-- Modal -->
    <div x-show="modal" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" @click.self="modal=false">
        <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl" @click.stop>
            <div class="flex items-center justify-between px-6 py-4 border-b">
                <h2 class="font-semibold text-gray-900" x-text="editId ? 'Edit Supplier' : 'Tambah Supplier'"></h2>
                <button @click="modal=false" class="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form @submit.prevent="save()" class="p-6 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Kode Supplier</label>
                        <input x-model="form.kode" type="text" placeholder="SUP-001" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Nama Supplier *</label>
                        <input x-model="form.nama" required type="text" placeholder="Nama perusahaan" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Nama Kontak</label>
                        <input x-model="form.kontak" type="text" placeholder="Nama PIC" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Telepon</label>
                        <input x-model="form.telepon" type="text" placeholder="08xxxxxxxxxx" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Email</label>
                    <input x-model="form.email" type="email" placeholder="email@supplier.com" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Alamat</label>
                    <textarea x-model="form.alamat" rows="2" placeholder="Alamat lengkap" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Kota</label>
                        <input x-model="form.kota" type="text" placeholder="Jakarta" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">TOP (hari)</label>
                        <input x-model="form.top" type="number" placeholder="30" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Status</label>
                    <select x-model="form.status" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <option>Aktif</option><option>Non-Aktif</option>
                    </select>
                </div>
                <div class="flex gap-3 pt-2">
                    <button type="submit" :disabled="saving" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm disabled:opacity-50" x-text="saving ? 'Menyimpan...' : 'Simpan'"></button>
                    <button type="button" @click="modal=false" class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium text-sm">Batal</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Toast -->
    <div x-show="toast" x-transition x-cloak class="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl text-sm shadow-xl" x-text="toast"></div>
</div>

<script>
function supplierApp() {
    return {
        rows: [], total: 0, page: 1, perPage: 20, loading: true,
        search: '', filterStatus: '',
        summary: {},
        modal: false, editId: null, saving: false,
        form: { kode: '', nama: '', kontak: '', telepon: '', email: '', alamat: '', kota: '', top: '', status: 'Aktif' },
        toast: '',
        async init() {
            await Promise.all([this.load(), this.loadSummary()]);
        },
        async load() {
            this.loading = true;
            try {
                const p = new URLSearchParams({ search: this.search, status: this.filterStatus, page: this.page, per_page: this.perPage });
                const r = await fetch('/api/erp/suppliers?' + p);
                const d = await r.json();
                this.rows = d.data || [];
                this.total = d.total || 0;
            } finally { this.loading = false; }
        },
        async loadSummary() {
            const r = await fetch('/api/erp/suppliers/summary');
            this.summary = await r.json();
        },
        openCreate() { this.editId = null; this.form = { kode: '', nama: '', kontak: '', telepon: '', email: '', alamat: '', kota: '', top: '', status: 'Aktif' }; this.modal = true; },
        openEdit(r) { this.editId = r.id; this.form = { kode: r.kode||'', nama: r.nama, kontak: r.kontak||'', telepon: r.telepon||'', email: r.email||'', alamat: r.alamat||'', kota: r.kota||'', top: r.top||'', status: r.status }; this.modal = true; },
        async save() {
            this.saving = true;
            try {
                const url = this.editId ? `/api/erp/suppliers/${this.editId}` : '/api/erp/suppliers';
                const method = this.editId ? 'PUT' : 'POST';
                const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content || '' }, body: JSON.stringify(this.form) });
                const d = await r.json();
                if (d.ok || d.id) { this.modal = false; this.showToast(this.editId ? 'Supplier diperbarui' : 'Supplier ditambahkan'); await this.load(); await this.loadSummary(); }
                else this.showToast('Gagal menyimpan: ' + (d.message || JSON.stringify(d)));
            } catch(e) { this.showToast('Error: ' + e.message); }
            finally { this.saving = false; }
        },
        async del(id) {
            if (!confirm('Hapus supplier ini?')) return;
            await fetch(`/api/erp/suppliers/${id}`, { method: 'DELETE', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content || '' } });
            this.showToast('Supplier dihapus'); this.load(); this.loadSummary();
        },
        prevPage() { if (this.page > 1) { this.page--; this.load(); } },
        nextPage() { if (this.rows.length >= this.perPage) { this.page++; this.load(); } },
        showToast(msg) { this.toast = msg; setTimeout(() => this.toast = '', 3000); },
        formatCurrency(v) { return 'Rp ' + Number(v).toLocaleString('id-ID'); },
    };
}
=======
    {{-- Modal --}}
    <div x-show="showModal" x-cloak class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showModal=false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" @click.stop>
            <div class="p-6">
                <div class="flex items-center justify-between mb-5">
                    <h3 class="text-lg font-bold text-gray-900" x-text="editMode?'Edit Supplier':'Tambah Supplier'"></h3>
                    <button @click="showModal=false" class="text-gray-400 hover:text-gray-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
                </div>
                <form @submit.prevent="save()" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Nama Supplier *</label><input x-model="form.nama" type="text" required class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Telepon</label><input x-model="form.telepon" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Email</label><input x-model="form.email" type="email" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Kota</label><input x-model="form.kota" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select x-model="form.status" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"><option>Aktif</option><option>Tidak Aktif</option><option>Blacklist</option></select>
                        </div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">NPWP</label><input x-model="form.npwp" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Nama Bank</label><input x-model="form.bank" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label><textarea x-model="form.alamat" rows="2" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 resize-none"></textarea></div>
                        <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Catatan</label><textarea x-model="form.catatan" rows="2" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 resize-none"></textarea></div>
                    </div>
                    <div class="flex justify-end gap-3 pt-2">
                        <button type="button" @click="showModal=false" class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600">Batal</button>
                        <button type="submit" :disabled="saving" class="px-6 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50">
                            <span x-show="saving">Menyimpan...</span><span x-show="!saving" x-text="editMode?'Update':'Simpan'"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div x-show="showDel" x-cloak class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showDel=false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center" @click.stop>
            <p class="font-bold text-gray-900 mb-2">Hapus Supplier?</p>
            <p class="text-sm text-gray-500 mb-4">"<span x-text="delTarget?.nama"></span>" akan dihapus permanen.</p>
            <div class="flex gap-3"><button @click="showDel=false" class="flex-1 py-2 border rounded-lg text-sm">Batal</button><button @click="confirmDel()" class="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm">Hapus</button></div>
        </div>
    </div>
</div>
<script>
function supplierApp(){return{items:[],stats:{},loading:false,saving:false,search:'',filterStatus:'',page:1,total:0,showModal:false,showDel:false,editMode:false,delTarget:null,toast:{show:false,msg:'',type:'success'},form:{nama:'',telepon:'',email:'',kota:'',alamat:'',status:'Aktif',npwp:'',bank:'',catatan:''},
async init(){await this.load()},
async load(){this.loading=true;try{const p=new URLSearchParams({search:this.search,status:this.filterStatus,page:this.page,per_page:10});const r=await fetch(`/api/erp/supplier?${p}`);if(r.ok){const d=await r.json();this.items=d.data||d.items||[];this.total=d.total||this.items.length;this.stats=d.stats||{total:this.items.length,active:this.items.filter(i=>i.status==='Aktif').length}}else this.items=[]}catch{this.items=[]}finally{this.loading=false}},
openAdd(){this.editMode=false;this.form={nama:'',telepon:'',email:'',kota:'',alamat:'',status:'Aktif',npwp:'',bank:'',catatan:''};this.showModal=true},
editItem(s){this.editMode=true;this.form={...s};this.showModal=true},
delItem(s){this.delTarget=s;this.showDel=true},
async save(){this.saving=true;try{const m=this.editMode?'PUT':'POST';const u=this.editMode?`/api/erp/supplier/${this.form.id}`:'/api/erp/supplier';const r=await fetch(u,{method:m,headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify(this.form)});if(this.editMode){const idx=this.items.findIndex(i=>i.id===this.form.id);if(idx>=0)this.items[idx]={...this.items[idx],...this.form}}else{this.items.unshift({id:Date.now(),...this.form,created_at:new Date().toISOString()});this.stats.total=(this.stats.total||0)+1}this.showToast(this.editMode?'Supplier diupdate':'Supplier disimpan','success')}catch{if(!this.editMode){this.items.unshift({id:Date.now(),...this.form,created_at:new Date().toISOString()})}this.showToast('Tersimpan lokal','success')}finally{this.saving=false;this.showModal=false}},
async confirmDel(){this.items=this.items.filter(i=>i.id!==this.delTarget.id);this.stats.total=Math.max(0,(this.stats.total||1)-1);try{await fetch(`/api/erp/supplier/${this.delTarget.id}`,{method:'DELETE',headers:{'X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''}})}catch{}this.showDel=false;this.delTarget=null;this.showToast('Supplier dihapus','success')},
formatRp(n){return'Rp '+Number(n||0).toLocaleString('id-ID')},
showToast(msg,type){this.toast={show:true,msg,type};setTimeout(()=>this.toast.show=false,3000)}
}}
>>>>>>> 62d477c (Activate non-AI related "Coming Soon" features in the sidebar)
</script>
@endsection
