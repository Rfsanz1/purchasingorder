@extends('layouts.erp')
@section('title', 'Purchase Order')
@section('content')
<div x-data="poApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">Purchase Order</h1>
            <p class="text-gray-500 mt-1">Buat dan kelola pesanan pembelian ke supplier</p>
        </div>
        <button @click="openCreate()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            Buat PO Baru
        </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4"><p class="text-xs text-gray-500 mb-1">Total PO</p><p class="text-2xl font-bold text-gray-900" x-text="summary.total||0"></p></div>
        <div class="bg-yellow-50 rounded-xl border border-yellow-100 p-4"><p class="text-xs text-yellow-700 mb-1">Pending</p><p class="text-2xl font-bold text-yellow-600" x-text="summary.pending||0"></p></div>
        <div class="bg-blue-50 rounded-xl border border-blue-100 p-4"><p class="text-xs text-blue-700 mb-1">Approved</p><p class="text-2xl font-bold text-blue-600" x-text="summary.approved||0"></p></div>
        <div class="bg-green-50 rounded-xl border border-green-100 p-4"><p class="text-xs text-green-700 mb-1">Nilai Total</p><p class="text-lg font-bold text-green-600" x-text="formatCurrency(summary.nilaiTotal||0)"></p></div>
    </div>

    <!-- Filter -->
    <div class="bg-white rounded-xl border p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari no PO, supplier..." class="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
        <select x-model="filterStatus" @change="load()" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">Semua Status</option>
            <option>Draft</option><option>Pending</option><option>Approved</option><option>Diterima</option><option>Dibatalkan</option>
        </select>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border overflow-hidden">
        <div x-show="loading" class="flex justify-center py-12"><div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
        <div x-show="!loading && rows.length === 0" class="text-center py-16 text-gray-400">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            <p>Belum ada Purchase Order</p>
        </div>
        <div x-show="!loading && rows.length > 0" class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">No PO</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Supplier</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                        <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Bayar</th>
                        <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    <template x-for="r in rows" :key="r.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3 font-mono text-xs font-semibold text-blue-600" x-text="r.no_po"></td>
                            <td class="px-4 py-3 text-gray-900" x-text="r.nama_supplier || '-'"></td>
                            <td class="px-4 py-3 text-gray-600" x-text="r.tanggal"></td>
                            <td class="px-4 py-3 text-right font-semibold" x-text="formatCurrency(r.total)"></td>
                            <td class="px-4 py-3">
                                <span :class="statusClass(r.status)" class="px-2 py-0.5 rounded-full text-xs font-medium" x-text="r.status"></span>
                            </td>
                            <td class="px-4 py-3">
                                <span :class="r.status_bayar === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'" class="px-2 py-0.5 rounded-full text-xs font-medium" x-text="r.status_bayar"></span>
                            </td>
                            <td class="px-4 py-3 text-right space-x-2">
                                <button @click="approve(r)" x-show="r.status === 'Draft' || r.status === 'Pending'" class="text-green-600 hover:text-green-800 text-xs font-medium">Approve</button>
                                <button @click="del(r.id)" class="text-red-500 hover:text-red-700 text-xs font-medium">Hapus</button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
            <div class="px-4 py-3 border-t flex items-center justify-between text-sm text-gray-500">
                <span x-text="`${total} PO`"></span>
                <div class="flex gap-2">
                    <button @click="prevPage()" :disabled="page<=1" class="px-3 py-1 border rounded-lg disabled:opacity-40">‹</button>
                    <span x-text="`Hal ${page}`" class="px-2 py-1"></span>
                    <button @click="nextPage()" :disabled="rows.length<perPage" class="px-3 py-1 border rounded-lg disabled:opacity-40">›</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Create Modal -->
    <div x-show="modal" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" @click.self="modal=false">
        <div class="bg-white rounded-2xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto" @click.stop>
            <div class="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
                <h2 class="font-semibold text-gray-900">Buat Purchase Order</h2>
                <button @click="modal=false" class="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form @submit.prevent="save()" class="p-6 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Tanggal PO *</label>
                        <input x-model="form.tanggal" required type="date" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Supplier</label>
                        <select x-model="form.supplier_id" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                            <option value="">-- Pilih Supplier --</option>
                            <template x-for="s in suppliers" :key="s.id">
                                <option :value="s.id" x-text="s.nama"></option>
                            </template>
                        </select>
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between mb-2">
                        <label class="text-xs font-medium text-gray-700">Item Produk *</label>
                        <button type="button" @click="addItem()" class="text-blue-600 text-xs font-medium">+ Tambah Item</button>
                    </div>
                    <div class="space-y-2">
                        <template x-for="(item, i) in form.items" :key="i">
                            <div class="grid grid-cols-12 gap-2 items-start">
                                <div class="col-span-5">
                                    <input x-model="item.nama_produk" required type="text" placeholder="Nama produk" class="w-full border rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                </div>
                                <div class="col-span-2">
                                    <input x-model.number="item.qty" required type="number" min="1" placeholder="Qty" class="w-full border rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                </div>
                                <div class="col-span-2">
                                    <input x-model="item.satuan" type="text" placeholder="pcs" class="w-full border rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                </div>
                                <div class="col-span-2">
                                    <input x-model.number="item.harga" required type="number" min="0" placeholder="Harga" class="w-full border rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                </div>
                                <div class="col-span-1 flex justify-center pt-1">
                                    <button type="button" @click="removeItem(i)" class="text-red-400 hover:text-red-600">✕</button>
                                </div>
                            </div>
                        </template>
                    </div>
                    <!-- Total -->
                    <div class="mt-3 pt-3 border-t text-right">
                        <div class="text-sm text-gray-600">Subtotal: <span class="font-semibold" x-text="formatCurrency(subtotal())"></span></div>
                        <div class="text-sm text-gray-600">PPN 11%: <span class="font-semibold" x-text="formatCurrency(subtotal()*0.11)"></span></div>
                        <div class="text-base font-bold text-gray-900 mt-1">Total: <span x-text="formatCurrency(subtotal()*1.11)"></span></div>
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Catatan</label>
                    <textarea x-model="form.catatan" rows="2" placeholder="Catatan tambahan..." class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
                </div>
                <div class="flex gap-3 pt-2">
                    <button type="submit" :disabled="saving" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm disabled:opacity-50" x-text="saving ? 'Menyimpan...' : 'Buat PO'"></button>
                    <button type="button" @click="modal=false" class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium text-sm">Batal</button>
                </div>
            </form>
        </div>
    </div>
    <div x-show="toast" x-transition x-cloak class="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl text-sm shadow-xl" x-text="toast"></div>
</div>
<script>
function poApp() {
    return {
        rows: [], total: 0, page: 1, perPage: 20, loading: true,
        search: '', filterStatus: '', summary: {}, suppliers: [],
        modal: false, saving: false, toast: '',
        form: { tanggal: new Date().toISOString().slice(0,10), supplier_id: '', catatan: '', items: [{ nama_produk: '', qty: 1, satuan: 'pcs', harga: 0 }] },
        async init() { await Promise.all([this.load(), this.loadSummary(), this.loadSuppliers()]); },
        async load() {
            this.loading = true;
            try {
                const p = new URLSearchParams({ search: this.search, status: this.filterStatus, page: this.page, per_page: this.perPage });
                const d = await fetch('/api/erp/purchase-orders?' + p).then(r => r.json());
                this.rows = d.data || []; this.total = d.total || 0;
            } finally { this.loading = false; }
        },
        async loadSummary() { this.summary = await fetch('/api/erp/purchase-orders/summary').then(r => r.json()); },
        async loadSuppliers() {
            const d = await fetch('/api/erp/suppliers?per_page=100').then(r => r.json());
            this.suppliers = d.data || [];
        },
        openCreate() {
            this.form = { tanggal: new Date().toISOString().slice(0,10), supplier_id: '', catatan: '', items: [{ nama_produk: '', qty: 1, satuan: 'pcs', harga: 0 }] };
            this.modal = true;
        },
        addItem() { this.form.items.push({ nama_produk: '', qty: 1, satuan: 'pcs', harga: 0 }); },
        removeItem(i) { if (this.form.items.length > 1) this.form.items.splice(i, 1); },
        subtotal() { return this.form.items.reduce((s, i) => s + (i.qty * i.harga), 0); },
        async save() {
            this.saving = true;
            try {
                const r = await fetch('/api/erp/purchase-orders', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content||'' }, body: JSON.stringify(this.form) });
                const d = await r.json();
                if (d.ok) { this.modal = false; this.showToast('PO ' + d.no_po + ' berhasil dibuat'); this.load(); this.loadSummary(); }
                else this.showToast('Gagal: ' + (d.message || 'Error'));
            } finally { this.saving = false; }
        },
        async approve(r) {
            await fetch(`/api/erp/purchase-orders/${r.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content||'' }, body: JSON.stringify({ status: 'Approved', disetujui_oleh: 'Admin' }) });
            this.showToast('PO disetujui'); this.load();
        },
        async del(id) {
            if (!confirm('Hapus PO ini?')) return;
            await fetch(`/api/erp/purchase-orders/${id}`, { method: 'DELETE', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content||'' } });
            this.showToast('PO dihapus'); this.load(); this.loadSummary();
        },
        statusClass(s) {
            const m = { Draft: 'bg-gray-100 text-gray-600', Pending: 'bg-yellow-100 text-yellow-700', Approved: 'bg-blue-100 text-blue-700', Diterima: 'bg-green-100 text-green-700', Dibatalkan: 'bg-red-100 text-red-700' };
            return m[s] || 'bg-gray-100 text-gray-600';
        },
        prevPage() { if (this.page>1) { this.page--; this.load(); } },
        nextPage() { if (this.rows.length>=this.perPage) { this.page++; this.load(); } },
        showToast(msg) { this.toast = msg; setTimeout(() => this.toast='', 3000); },
        formatCurrency(v) { return 'Rp ' + Number(v||0).toLocaleString('id-ID'); },
    };
}
</script>
@endsection
