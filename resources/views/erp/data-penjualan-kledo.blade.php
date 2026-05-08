@extends('layouts.erp')
@section('title', 'Data Penjualan Kledo')

@section('content')
<div x-data="dataPenjualanKledo()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">

    {{-- Header --}}
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
            <h1 class="text-xl font-bold text-gray-900">Data Penjualan Kledo</h1>
            <p class="text-sm text-gray-400 mt-0.5">Data invoice langsung dari Kledo — tidak disimpan di database lokal</p>
        </div>
        <button @click="muat()" :disabled="loading"
            class="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition shrink-0">
            <svg class="w-4 h-4" :class="loading && 'animate-spin'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span x-text="loading ? 'Memuat...' : 'Refresh Data'"></span>
        </button>
    </div>

    {{-- Filter Tanggal --}}
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 mb-5">
        <div class="flex flex-wrap items-end gap-4">
            <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1">Dari Tanggal</label>
                <input type="date" x-model="startDate"
                    class="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            </div>
            <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1">Sampai Tanggal</label>
                <input type="date" x-model="endDate"
                    class="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            </div>
            <div class="flex-1 min-w-[160px]">
                <label class="block text-xs font-semibold text-gray-500 mb-1">Filter Sales</label>
                <input type="text" x-model="filterSales" placeholder="Cari nama sales..."
                    class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            </div>
            <div class="flex-1 min-w-[160px]">
                <label class="block text-xs font-semibold text-gray-500 mb-1">Filter Customer</label>
                <input type="text" x-model="filterCustomer" placeholder="Cari nama customer..."
                    class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            </div>
            <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1">Status</label>
                <select x-model="filterStatus"
                    class="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value="">Semua Status</option>
                    <template x-for="st in statusList" :key="st">
                        <option :value="st" x-text="st"></option>
                    </template>
                </select>
            </div>
            <button @click="muat()" :disabled="loading"
                class="bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition">
                Tampilkan
            </button>
        </div>
    </div>

    {{-- Error --}}
    <div x-show="error" x-cloak class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm text-red-700" x-text="error"></div>

    {{-- Loading --}}
    <div x-show="loading" x-cloak class="flex justify-center py-20">
        <div class="flex flex-col items-center gap-3">
            <svg class="w-8 h-8 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <p class="text-sm text-gray-400">Mengambil data dari Kledo...</p>
        </div>
    </div>

    {{-- Konten utama --}}
    <div x-show="!loading && loaded" x-cloak>

        {{-- KPI Cards --}}
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4">
                <p class="text-xs text-gray-400 font-medium">Total Invoice</p>
                <p class="text-2xl font-bold text-gray-900 mt-1" x-text="invoiceFiltered.length"></p>
                <p class="text-xs text-gray-400 mt-0.5" x-text="'dari ' + totalInvoice + ' invoice'"></p>
            </div>
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4">
                <p class="text-xs text-gray-400 font-medium">Total Penjualan</p>
                <p class="text-xl font-bold text-green-600 mt-1" x-text="'Rp ' + formatRupiah(totalFiltered)"></p>
                <p class="text-xs text-gray-400 mt-0.5">nilai invoice</p>
            </div>
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4">
                <p class="text-xs text-gray-400 font-medium">Rata-rata per Invoice</p>
                <p class="text-xl font-bold text-blue-600 mt-1" x-text="'Rp ' + formatRupiah(invoiceFiltered.length > 0 ? Math.round(totalFiltered / invoiceFiltered.length) : 0)"></p>
                <p class="text-xs text-gray-400 mt-0.5">average order value</p>
            </div>
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4">
                <p class="text-xs text-gray-400 font-medium">Periode</p>
                <p class="text-sm font-bold text-gray-900 mt-1" x-text="formatTgl(startDate) + ' – ' + formatTgl(endDate)"></p>
                <p class="text-xs text-green-500 mt-0.5 font-medium">● Live dari Kledo</p>
            </div>
        </div>

        {{-- Rekap per Sales --}}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div class="px-5 py-4 border-b border-gray-50">
                    <h2 class="font-bold text-gray-900 text-sm">Rekap per Sales</h2>
                    <p class="text-xs text-gray-400 mt-0.5">Berdasarkan data yang difilter</p>
                </div>
                <div class="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                    <template x-for="(s, i) in rekapSalesFiltered" :key="s.sales">
                        <div class="px-5 py-3 flex items-center gap-3">
                            <div class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <span class="text-xs font-bold text-blue-600" x-text="i + 1"></span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-semibold text-gray-800 truncate" x-text="s.sales"></p>
                                <p class="text-xs text-gray-400" x-text="s.jumlah + ' invoice'"></p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-bold text-gray-900" x-text="'Rp ' + formatRupiah(s.total)"></p>
                                <div class="w-20 h-1.5 bg-gray-100 rounded-full mt-1 ml-auto">
                                    <div class="h-1.5 bg-blue-500 rounded-full"
                                        :style="'width:' + (rekapSalesFiltered[0].total > 0 ? Math.round(s.total / rekapSalesFiltered[0].total * 100) : 0) + '%'"></div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div x-show="rekapSalesFiltered.length === 0" class="px-5 py-8 text-center text-sm text-gray-400">
                        Tidak ada data
                    </div>
                </div>
            </div>

            {{-- Rekap per Status --}}
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div class="px-5 py-4 border-b border-gray-50">
                    <h2 class="font-bold text-gray-900 text-sm">Rekap per Status</h2>
                    <p class="text-xs text-gray-400 mt-0.5">Distribusi status invoice</p>
                </div>
                <div class="divide-y divide-gray-50">
                    <template x-for="st in rekapStatusFiltered" :key="st.status">
                        <div class="px-5 py-3 flex items-center gap-3">
                            <span class="text-xs px-2.5 py-1 rounded-full font-semibold shrink-0"
                                :class="{
                                    'bg-green-100 text-green-700': st.status === 'Paid' || st.status === 'Lunas',
                                    'bg-yellow-100 text-yellow-700': st.status === 'Partial' || st.status === 'DP',
                                    'bg-red-100 text-red-700': st.status === 'Unpaid' || st.status === 'Belum Bayar',
                                    'bg-gray-100 text-gray-600': !['Paid','Lunas','Partial','DP','Unpaid','Belum Bayar'].includes(st.status),
                                }"
                                x-text="st.status"></span>
                            <div class="flex-1">
                                <p class="text-xs text-gray-500" x-text="st.jumlah + ' invoice'"></p>
                            </div>
                            <p class="text-sm font-bold text-gray-900" x-text="'Rp ' + formatRupiah(st.total)"></p>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        {{-- Tabel Invoice --}}
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                <div>
                    <h2 class="font-bold text-gray-900 text-sm">Daftar Invoice</h2>
                    <p class="text-xs text-gray-400 mt-0.5" x-text="invoiceFiltered.length + ' invoice ditampilkan'"></p>
                </div>
                <div class="flex items-center gap-2">
                    <input type="text" x-model="searchInvoice" placeholder="Cari no. invoice / customer..."
                        class="border border-gray-200 rounded-xl px-3 py-1.5 text-xs w-48 focus:outline-none focus:ring-2 focus:ring-blue-400">
                </div>
            </div>

            {{-- Desktop table --}}
            <div class="hidden md:block overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 text-left">
                            <th class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">No. Invoice</th>
                            <th class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tanggal</th>
                            <th class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                            <th class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Sales</th>
                            <th class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                            <th class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                            <th class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Memo</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <template x-for="inv in invoicePaginated" :key="inv.id">
                            <tr class="hover:bg-gray-50/70 transition">
                                <td class="px-4 py-3 font-mono text-xs text-blue-600 font-semibold" x-text="inv.ref_number"></td>
                                <td class="px-4 py-3 text-xs text-gray-600" x-text="formatTgl(inv.trans_date)"></td>
                                <td class="px-4 py-3 text-sm font-medium text-gray-800 max-w-[180px] truncate" x-text="inv.contact_name"></td>
                                <td class="px-4 py-3 text-xs text-gray-600">
                                    <span x-show="inv.sales" class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold text-xs" x-text="inv.sales"></span>
                                    <span x-show="!inv.sales" class="text-gray-300">—</span>
                                </td>
                                <td class="px-4 py-3 text-sm font-bold text-gray-900" x-text="'Rp ' + formatRupiah(inv.total)"></td>
                                <td class="px-4 py-3">
                                    <span class="text-xs px-2 py-0.5 rounded-full font-semibold"
                                        :class="{
                                            'bg-green-100 text-green-700': inv.status === 'Paid' || inv.status === 'Lunas',
                                            'bg-yellow-100 text-yellow-700': inv.status === 'Partial' || inv.status === 'DP',
                                            'bg-red-100 text-red-700': inv.status === 'Unpaid' || inv.status === 'Belum Bayar',
                                            'bg-gray-100 text-gray-600': !['Paid','Lunas','Partial','DP','Unpaid','Belum Bayar'].includes(inv.status),
                                        }"
                                        x-text="inv.status"></span>
                                </td>
                                <td class="px-4 py-3 text-xs text-gray-400 max-w-[200px] truncate" x-text="inv.memo || '—'"></td>
                            </tr>
                        </template>
                        <tr x-show="invoiceFiltered.length === 0">
                            <td colspan="7" class="px-4 py-12 text-center text-sm text-gray-400">Tidak ada data yang cocok dengan filter</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {{-- Mobile cards --}}
            <div class="md:hidden divide-y divide-gray-50">
                <template x-for="inv in invoicePaginated" :key="inv.id">
                    <div class="px-4 py-4">
                        <div class="flex items-start justify-between gap-2 mb-1">
                            <span class="font-mono text-xs text-blue-600 font-semibold" x-text="inv.ref_number"></span>
                            <span class="text-xs px-2 py-0.5 rounded-full font-semibold shrink-0"
                                :class="{
                                    'bg-green-100 text-green-700': inv.status === 'Paid' || inv.status === 'Lunas',
                                    'bg-yellow-100 text-yellow-700': inv.status === 'Partial' || inv.status === 'DP',
                                    'bg-red-100 text-red-700': inv.status === 'Unpaid' || inv.status === 'Belum Bayar',
                                    'bg-gray-100 text-gray-600': !['Paid','Lunas','Partial','DP','Unpaid','Belum Bayar'].includes(inv.status),
                                }"
                                x-text="inv.status"></span>
                        </div>
                        <p class="text-sm font-semibold text-gray-800" x-text="inv.contact_name"></p>
                        <div class="flex items-center justify-between mt-1">
                            <div class="flex items-center gap-2">
                                <span class="text-xs text-gray-400" x-text="formatTgl(inv.trans_date)"></span>
                                <span x-show="inv.sales" class="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold text-xs" x-text="inv.sales"></span>
                            </div>
                            <p class="text-sm font-bold text-gray-900" x-text="'Rp ' + formatRupiah(inv.total)"></p>
                        </div>
                    </div>
                </template>
                <div x-show="invoiceFiltered.length === 0" class="px-4 py-12 text-center text-sm text-gray-400">
                    Tidak ada data
                </div>
            </div>

            {{-- Pagination --}}
            <div x-show="totalPages > 1" class="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
                <p class="text-xs text-gray-400" x-text="'Halaman ' + currentPage + ' dari ' + totalPages + ' (' + invoiceFiltered.length + ' data)'"></p>
                <div class="flex gap-1">
                    <button @click="currentPage = Math.max(1, currentPage - 1)"
                        :disabled="currentPage === 1"
                        class="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">
                        ← Prev
                    </button>
                    <button @click="currentPage = Math.min(totalPages, currentPage + 1)"
                        :disabled="currentPage === totalPages"
                        class="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">
                        Next →
                    </button>
                </div>
            </div>
        </div>

        {{-- Info Badge --}}
        <div class="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <svg class="w-3.5 h-3.5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Data diambil langsung dari Kledo API. ERP tidak menyimpan data ini ke database — Kledo adalah satu-satunya database penjualan.</span>
        </div>
    </div>

    {{-- Empty state --}}
    <div x-show="!loading && !loaded" x-cloak class="flex flex-col items-center justify-center py-24 text-center">
        <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
        </div>
        <h3 class="font-semibold text-gray-700 mb-1">Belum ada data dimuat</h3>
        <p class="text-sm text-gray-400 mb-5">Klik "Tampilkan" untuk mengambil data penjualan dari Kledo</p>
        <button @click="muat()"
            class="bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition">
            Ambil Data dari Kledo
        </button>
    </div>

</div>

<script>
function dataPenjualanKledo() {
    return {
        startDate: '2026-04-08',
        endDate:   '2026-05-08',
        filterSales:    '',
        filterCustomer: '',
        filterStatus:   '',
        searchInvoice:  '',
        loading: false,
        loaded:  false,
        error:   '',

        invoices:     [],
        totalInvoice: 0,
        grandTotal:   0,
        rekapSales:   [],
        rekapStatus:  [],
        statusList:   [],

        currentPage:  1,
        perPage:      50,

        async init() {
            await this.muat();
        },

        async muat() {
            this.loading = true;
            this.error   = '';
            this.loaded  = false;
            this.currentPage = 1;
            try {
                const params = new URLSearchParams({
                    start_date: this.startDate,
                    end_date:   this.endDate,
                });
                const res  = await fetch('/api/kledo/data-penjualan?' + params);
                const json = await res.json();

                if (json.error) {
                    this.error = json.error;
                    return;
                }

                this.invoices     = json.invoices     || [];
                this.totalInvoice = json.total_invoice || 0;
                this.grandTotal   = json.grand_total   || 0;
                this.rekapSales   = json.rekap_sales   || [];
                this.rekapStatus  = json.rekap_status  || [];
                this.statusList   = [...new Set(this.invoices.map(i => i.status).filter(Boolean))];
                this.loaded = true;
            } catch (e) {
                this.error = 'Gagal terhubung ke server. Pastikan koneksi internet aktif.';
            } finally {
                this.loading = false;
            }
        },

        get invoiceFiltered() {
            let list = this.invoices;
            const fSales = this.filterSales.trim().toLowerCase();
            const fCust  = this.filterCustomer.trim().toLowerCase();
            const fStat  = this.filterStatus;
            const fSearch = this.searchInvoice.trim().toLowerCase();

            if (fSales)  list = list.filter(i => (i.sales  || '').toLowerCase().includes(fSales));
            if (fCust)   list = list.filter(i => (i.contact_name || '').toLowerCase().includes(fCust));
            if (fStat)   list = list.filter(i => i.status === fStat);
            if (fSearch) list = list.filter(i =>
                (i.ref_number    || '').toLowerCase().includes(fSearch) ||
                (i.contact_name  || '').toLowerCase().includes(fSearch) ||
                (i.memo          || '').toLowerCase().includes(fSearch)
            );
            return list;
        },

        get totalFiltered() {
            return this.invoiceFiltered.reduce((s, i) => s + i.total, 0);
        },

        get rekapSalesFiltered() {
            const map = {};
            for (const inv of this.invoiceFiltered) {
                const s = inv.sales || 'Tidak Diketahui';
                if (!map[s]) map[s] = { sales: s, jumlah: 0, total: 0 };
                map[s].jumlah++;
                map[s].total += inv.total;
            }
            return Object.values(map).sort((a, b) => b.total - a.total);
        },

        get rekapStatusFiltered() {
            const map = {};
            for (const inv of this.invoiceFiltered) {
                const s = inv.status || '-';
                if (!map[s]) map[s] = { status: s, jumlah: 0, total: 0 };
                map[s].jumlah++;
                map[s].total += inv.total;
            }
            return Object.values(map).sort((a, b) => b.total - a.total);
        },

        get totalPages() {
            return Math.max(1, Math.ceil(this.invoiceFiltered.length / this.perPage));
        },

        get invoicePaginated() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.invoiceFiltered.slice(start, start + this.perPage);
        },

        formatRupiah(n) {
            if (!n) return '0';
            return Number(n).toLocaleString('id-ID');
        },

        formatTgl(d) {
            if (!d) return '—';
            const dt = new Date(d);
            if (isNaN(dt)) return d;
            return dt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        },
    };
}
</script>
@endsection
