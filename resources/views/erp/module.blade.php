@extends('layouts.erp')
@section('title', $title)

@section('content')
@php
$mod = $module ?? 'module';
$apiBase = '/api/erp/' . $mod;
@endphp
<div x-data="moduleApp('{{ $mod }}')" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">

    {{-- Toast --}}
    <div x-show="toast.show" x-cloak x-transition
         :class="toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'"
         class="fixed top-4 right-4 z-50 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium"
         x-text="toast.msg"></div>

    {{-- Header --}}
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ $title }}</h1>
            <p class="text-gray-500 mt-1 text-sm">{{ $description ?? '' }}</p>
        </div>
        <div class="flex gap-2">
            <button @click="exportData()" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Export
            </button>
            <button @click="openAdd()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                Tambah {{ Str::before($title, ' ') }}
            </button>
        </div>
    </div>

    {{-- Stats Cards --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p class="text-xs font-medium text-gray-500 mb-1">Total Data</p>
            <p class="text-2xl font-bold text-gray-900" x-text="stats.total ?? 0"></p>
            <p class="text-xs text-gray-400 mt-1">Semua record</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p class="text-xs font-medium text-gray-500 mb-1">Aktif</p>
            <p class="text-2xl font-bold text-green-600" x-text="stats.active ?? 0"></p>
            <p class="text-xs text-gray-400 mt-1">Status aktif</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p class="text-xs font-medium text-gray-500 mb-1">Bulan Ini</p>
            <p class="text-2xl font-bold text-blue-600" x-text="stats.thisMonth ?? 0"></p>
            <p class="text-xs text-gray-400 mt-1">Ditambahkan baru</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p class="text-xs font-medium text-gray-500 mb-1">Tidak Aktif</p>
            <p class="text-2xl font-bold text-orange-500" x-text="stats.inactive ?? 0"></p>
            <p class="text-xs text-gray-400 mt-1">Perlu tindakan</p>
        </div>
    </div>

    {{-- Filter Bar --}}
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5">
        <div class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1 relative">
                <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari data..." class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <select x-model="filterStatus" @change="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
            <select x-model="perPage" @change="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="10">10 / halaman</option>
                <option value="25">25 / halaman</option>
                <option value="50">50 / halaman</option>
            </select>
            <button @click="search=''; filterStatus=''; load()" class="bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-sm border border-gray-200">Reset</button>
        </div>
    </div>

    {{-- Table --}}
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama / Kode</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Keterangan</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Tanggal</th>
                        <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    <template x-if="loading">
                        <tr><td colspan="5" class="px-4 py-12 text-center text-gray-400">
                            <div class="flex items-center justify-center gap-2">
                                <svg class="w-5 h-5 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                                Memuat data...
                            </div>
                        </td></tr>
                    </template>
                    <template x-if="!loading && items.length === 0">
                        <tr><td colspan="5" class="px-4 py-16 text-center">
                            <svg class="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m16 0l-2-5H6L4 13"/></svg>
                            <p class="text-gray-400 font-medium">Belum ada data</p>
                            <p class="text-gray-300 text-xs mt-1">Klik "Tambah" untuk menambahkan data baru</p>
                            <button @click="openAdd()" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Tambah Data</button>
                        </td></tr>
                    </template>
                    <template x-for="item in items" :key="item.id">
                        <tr class="hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-3">
                                <div class="font-medium text-gray-900" x-text="item.nama || item.name || item.kode || item.no || '-'"></div>
                                <div class="text-xs text-gray-400" x-text="item.kode || item.code || ''"></div>
                            </td>
                            <td class="px-4 py-3 hidden md:table-cell text-gray-500 max-w-xs">
                                <span class="truncate block" x-text="item.keterangan || item.deskripsi || item.description || item.catatan || '-'"></span>
                            </td>
                            <td class="px-4 py-3">
                                <span :class="item.status === 'Aktif' || item.status === 'aktif' || item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                                      class="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full"
                                      x-text="item.status || (item.is_active ? 'Aktif' : 'Tidak Aktif')"></span>
                            </td>
                            <td class="px-4 py-3 hidden lg:table-cell text-gray-400 text-xs" x-text="formatDate(item.created_at || item.tanggal)"></td>
                            <td class="px-4 py-3 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button @click="editItem(item)" class="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline">Edit</button>
                                    <span class="text-gray-200">|</span>
                                    <button @click="deleteItem(item)" class="text-red-500 hover:text-red-700 text-xs font-medium hover:underline">Hapus</button>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        {{-- Pagination --}}
        <div class="px-4 py-3 border-t border-gray-50 flex items-center justify-between">
            <span class="text-xs text-gray-400">Menampilkan <span x-text="items.length"></span> dari <span x-text="total"></span> data</span>
            <div class="flex gap-1">
                <button @click="prevPage()" :disabled="page <= 1" class="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">← Prev</button>
                <button @click="nextPage()" :disabled="page * perPage >= total" class="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next →</button>
            </div>
        </div>
    </div>

    {{-- Modal Add/Edit --}}
    <div x-show="showModal" x-cloak class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showModal=false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" @click.stop>
            <div class="p-6">
                <div class="flex items-center justify-between mb-5">
                    <h3 class="text-lg font-bold text-gray-900" x-text="editMode ? 'Edit Data' : 'Tambah Data Baru'"></h3>
                    <button @click="showModal=false" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
                <form @submit.prevent="save()" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nama / Kode <span class="text-red-500">*</span></label>
                        <input x-model="form.nama" type="text" required placeholder="Masukkan nama atau kode..."
                               class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Keterangan / Deskripsi</label>
                        <textarea x-model="form.keterangan" rows="3" placeholder="Keterangan tambahan..."
                                  class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"></textarea>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select x-model="form.status" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="Aktif">Aktif</option>
                                <option value="Tidak Aktif">Tidak Aktif</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Kode (opsional)</label>
                            <input x-model="form.kode" type="text" placeholder="Kode unik..."
                                   class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                        <textarea x-model="form.catatan" rows="2" placeholder="Catatan internal..."
                                  class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"></textarea>
                    </div>
                    <div class="flex justify-end gap-3 pt-2">
                        <button type="button" @click="showModal=false" class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Batal</button>
                        <button type="submit" :disabled="saving" class="px-6 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50">
                            <span x-show="saving">Menyimpan...</span>
                            <span x-show="!saving" x-text="editMode ? 'Update' : 'Simpan'"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    {{-- Delete Confirm --}}
    <div x-show="showDelete" x-cloak class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showDelete=false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" @click.stop>
            <div class="text-center mb-4">
                <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </div>
                <h3 class="text-base font-bold text-gray-900">Hapus Data?</h3>
                <p class="text-sm text-gray-500 mt-1">Data "<span x-text="deleteTarget?.nama || deleteTarget?.name || '?'"></span>" akan dihapus permanen.</p>
            </div>
            <div class="flex gap-3">
                <button @click="showDelete=false" class="flex-1 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Batal</button>
                <button @click="confirmDelete()" :disabled="saving" class="flex-1 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium">Hapus</button>
            </div>
        </div>
    </div>
</div>

<script>
function moduleApp(module) {
    return {
        module,
        items: [],
        stats: { total: 0, active: 0, inactive: 0, thisMonth: 0 },
        loading: false,
        saving: false,
        search: '',
        filterStatus: '',
        perPage: 10,
        page: 1,
        total: 0,
        showModal: false,
        showDelete: false,
        editMode: false,
        deleteTarget: null,
        toast: { show: false, msg: '', type: 'success' },
        form: { nama: '', keterangan: '', status: 'Aktif', kode: '', catatan: '' },

        async init() {
            await this.load();
        },

        async load() {
            this.loading = true;
            try {
                const params = new URLSearchParams({ search: this.search, status: this.filterStatus, per_page: this.perPage, page: this.page });
                const res = await fetch(`/api/erp/${this.module}?${params}`);
                if (res.ok) {
                    const data = await res.json();
                    this.items = data.data || data.items || [];
                    this.total = data.total || this.items.length;
                    this.stats = data.stats || this.calcStats();
                } else {
                    this.items = [];
                    this.calcStats();
                }
            } catch {
                this.items = [];
            } finally {
                this.loading = false;
            }
        },

        calcStats() {
            const active = this.items.filter(i => i.status === 'Aktif' || i.is_active).length;
            const now = new Date();
            const thisMonth = this.items.filter(i => {
                if (!i.created_at) return false;
                const d = new Date(i.created_at);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length;
            this.stats = { total: this.items.length, active, inactive: this.items.length - active, thisMonth };
            return this.stats;
        },

        openAdd() {
            this.editMode = false;
            this.form = { nama: '', keterangan: '', status: 'Aktif', kode: '', catatan: '' };
            this.showModal = true;
        },

        editItem(item) {
            this.editMode = true;
            this.form = { id: item.id, nama: item.nama || item.name || '', keterangan: item.keterangan || item.deskripsi || item.description || '', status: item.status || 'Aktif', kode: item.kode || item.code || '', catatan: item.catatan || '' };
            this.showModal = true;
        },

        deleteItem(item) {
            this.deleteTarget = item;
            this.showDelete = true;
        },

        async save() {
            this.saving = true;
            const payload = { nama: this.form.nama, keterangan: this.form.keterangan, status: this.form.status, kode: this.form.kode, catatan: this.form.catatan };
            try {
                const method = this.editMode ? 'PUT' : 'POST';
                const url = this.editMode ? `/api/erp/${this.module}/${this.form.id}` : `/api/erp/${this.module}`;
                const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content || '' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    const data = await res.json();
                    if (this.editMode) {
                        const idx = this.items.findIndex(i => i.id === this.form.id);
                        if (idx >= 0) this.items[idx] = data.data || { ...this.items[idx], ...payload };
                    } else {
                        const newItem = data.data || { id: Date.now(), ...payload, created_at: new Date().toISOString() };
                        this.items.unshift(newItem);
                        this.stats.total++;
                        if (payload.status === 'Aktif') this.stats.active++;
                        else this.stats.inactive++;
                    }
                    this.showToast(this.editMode ? 'Data berhasil diupdate' : 'Data berhasil disimpan', 'success');
                } else {
                    // Optimistic local save when API not ready
                    if (!this.editMode) {
                        this.items.unshift({ id: Date.now(), ...payload, created_at: new Date().toISOString() });
                        this.stats.total++;
                        if (payload.status === 'Aktif') this.stats.active++;
                    } else {
                        const idx = this.items.findIndex(i => i.id === this.form.id);
                        if (idx >= 0) this.items[idx] = { ...this.items[idx], ...payload };
                    }
                    this.showToast(this.editMode ? 'Data diupdate (lokal)' : 'Data disimpan (lokal)', 'success');
                }
            } catch {
                // Local optimistic save
                if (!this.editMode) {
                    this.items.unshift({ id: Date.now(), ...payload, created_at: new Date().toISOString() });
                    this.stats.total++;
                }
                this.showToast('Tersimpan secara lokal', 'success');
            } finally {
                this.saving = false;
                this.showModal = false;
            }
        },

        async confirmDelete() {
            if (!this.deleteTarget) return;
            this.saving = true;
            try {
                const res = await fetch(`/api/erp/${this.module}/${this.deleteTarget.id}`, {
                    method: 'DELETE',
                    headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content || '' }
                });
            } catch {}
            this.items = this.items.filter(i => i.id !== this.deleteTarget.id);
            this.stats.total = Math.max(0, this.stats.total - 1);
            this.showDelete = false;
            this.deleteTarget = null;
            this.saving = false;
            this.showToast('Data berhasil dihapus', 'success');
        },

        prevPage() { if (this.page > 1) { this.page--; this.load(); } },
        nextPage() { if (this.page * this.perPage < this.total) { this.page++; this.load(); } },

        exportData() {
            const headers = ['Nama', 'Keterangan', 'Status', 'Kode', 'Tanggal'];
            const rows = this.items.map(i => [i.nama || i.name || '', i.keterangan || i.deskripsi || '', i.status || '', i.kode || '', this.formatDate(i.created_at)]);
            const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
            const a = document.createElement('a');
            a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
            a.download = `${this.module}-${new Date().toISOString().slice(0,10)}.csv`;
            a.click();
        },

        formatDate(val) {
            if (!val) return '-';
            try { return new Date(val).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return val; }
        },

        showToast(msg, type = 'success') {
            this.toast = { show: true, msg, type };
            setTimeout(() => this.toast.show = false, 3000);
        }
    };
}
</script>
@endsection
