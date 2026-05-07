@extends('layouts.erp')
@section('title', 'Laporan Penjualan per Sales')

@section('content')
<div x-data="laporanSalesApp()" x-init="init()" class="p-4 md:p-6 max-w-6xl mx-auto">

    {{-- Header --}}
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-xl font-bold text-gray-900">Laporan Penjualan per Sales</h1>
            <p class="text-sm text-gray-400 mt-0.5">Data invoice dari Kledo berdasarkan periode & nama sales</p>
        </div>
        <button @click="load()" :disabled="loading"
            class="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition">
            <svg class="w-4 h-4" :class="loading && 'animate-spin'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span x-text="loading ? 'Memuat...' : 'Tampilkan'"></span>
        </button>
    </div>

    {{-- Filter --}}
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Filter</p>
        <div class="flex flex-col sm:flex-row gap-3 items-end">
            <div class="flex-1">
                <label class="text-xs text-gray-500 block mb-1">Dari Tanggal</label>
                <input type="date" x-model="dari"
                    class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            </div>
            <div class="flex-1">
                <label class="text-xs text-gray-500 block mb-1">Sampai Tanggal</label>
                <input type="date" x-model="sampai"
                    class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            </div>
            <div class="flex-1">
                <label class="text-xs text-gray-500 block mb-1">Filter Sales (opsional)</label>
                <select x-model="filterSales"
                    class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value="">-- Semua Sales --</option>
                    @foreach(\App\Http\Controllers\SalesController::SALES_LIST as $s)
                        <option value="{{ $s['nama'] }}">{{ $s['nama'] }}</option>
                    @endforeach
                </select>
            </div>
            <button @click="load()" :disabled="loading"
                class="bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap transition">
                Cari
            </button>
        </div>
    </div>

    {{-- Error --}}
    <div x-show="error" x-cloak class="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm" x-text="error"></div>

    {{-- Loading --}}
    <div x-show="loading" x-cloak class="flex justify-center py-16">
        <div class="flex flex-col items-center gap-3">
            <svg class="w-8 h-8 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <p class="text-sm text-gray-400">Mengambil data dari Kledo...</p>
        </div>
    </div>

    {{-- Ringkasan Total --}}
    <div x-show="data && !loading" x-cloak>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p class="text-xs text-gray-400 mb-1">Total Invoice</p>
                <p class="text-2xl font-bold text-gray-900" x-text="data?.total_invoice ?? 0"></p>
            </div>
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p class="text-xs text-gray-400 mb-1">Total Penjualan</p>
                <p class="text-xl font-bold text-green-600" x-text="'Rp ' + formatRupiah(data?.grand_total ?? 0)"></p>
            </div>
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 col-span-2 sm:col-span-1">
                <p class="text-xs text-gray-400 mb-1">Periode</p>
                <p class="text-sm font-semibold text-gray-700" x-text="(data?.periode?.dari ?? '-') + ' s/d ' + (data?.periode?.sampai ?? '-')"></p>
            </div>
        </div>

        {{-- Tabel Rekap per Sales --}}
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 class="font-semibold text-gray-800">Rekap per Sales</h2>
                <span class="text-xs text-gray-400" x-text="(data?.rekap?.length ?? 0) + ' sales'"></span>
            </div>

            <div x-show="!data?.rekap?.length" class="text-center py-12 text-gray-400 text-sm">
                Tidak ada data untuk periode ini
            </div>

            <div x-show="data?.rekap?.length" class="divide-y divide-gray-50">
                <template x-for="(row, idx) in data?.rekap ?? []" :key="idx">
                    <div class="px-5 py-0">
                        {{-- Header Sales --}}
                        <button @click="row._open = !row._open"
                            class="w-full flex items-center justify-between py-3.5 text-left hover:bg-gray-50 transition rounded-xl -mx-2 px-2">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold uppercase"
                                    x-text="(row.sales ?? '?').charAt(0)"></div>
                                <div>
                                    <p class="font-semibold text-gray-800 text-sm" x-text="row.sales"></p>
                                    <p class="text-xs text-gray-400" x-text="row.jumlah_invoice + ' invoice'"></p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <p class="font-bold text-green-600 text-sm" x-text="'Rp ' + formatRupiah(row.total_penjualan)"></p>
                                <svg class="w-4 h-4 text-gray-400 transition-transform" :class="row._open ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                </svg>
                            </div>
                        </button>

                        {{-- Detail Invoice --}}
                        <div x-show="row._open" x-collapse class="pb-3">
                            <div class="overflow-x-auto rounded-xl border border-gray-100">
                                <table class="w-full text-xs">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th class="text-left px-3 py-2 text-gray-500 font-semibold">No. Invoice</th>
                                            <th class="text-left px-3 py-2 text-gray-500 font-semibold">Tanggal</th>
                                            <th class="text-left px-3 py-2 text-gray-500 font-semibold">Customer</th>
                                            <th class="text-right px-3 py-2 text-gray-500 font-semibold">Total</th>
                                            <th class="text-left px-3 py-2 text-gray-500 font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-50">
                                        <template x-for="(inv, i) in row.invoices" :key="i">
                                            <tr class="hover:bg-gray-50">
                                                <td class="px-3 py-2 font-mono text-blue-600" x-text="inv.ref_number"></td>
                                                <td class="px-3 py-2 text-gray-600" x-text="inv.trans_date"></td>
                                                <td class="px-3 py-2 text-gray-800 max-w-[160px] truncate" x-text="inv.contact_name"></td>
                                                <td class="px-3 py-2 text-right font-semibold text-gray-800" x-text="'Rp ' + formatRupiah(inv.total)"></td>
                                                <td class="px-3 py-2">
                                                    <span class="px-2 py-0.5 rounded-full text-xs font-semibold"
                                                        :class="{
                                                            'bg-green-100 text-green-700': inv.status === 'paid' || inv.status === 'settle',
                                                            'bg-yellow-100 text-yellow-700': inv.status === 'partial',
                                                            'bg-red-100 text-red-700': inv.status === 'unpaid' || inv.status === 'overdue',
                                                            'bg-gray-100 text-gray-600': !['paid','settle','partial','unpaid','overdue'].includes(inv.status)
                                                        }"
                                                        x-text="inv.status"></span>
                                                </td>
                                            </tr>
                                        </template>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>

</div>

<script>
function laporanSalesApp() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    return {
        dari: firstDay,
        sampai: todayStr,
        filterSales: '',
        loading: false,
        data: null,
        error: '',

        init() {},

        async load() {
            this.loading = true;
            this.error = '';
            this.data = null;
            try {
                const params = new URLSearchParams({
                    start_date: this.dari,
                    end_date: this.sampai,
                    sales: this.filterSales,
                });
                const res = await fetch('/api/kledo/laporan-penjualan?' + params);
                const json = await res.json();
                if (json.error) {
                    this.error = json.error;
                } else {
                    // Tambah _open flag untuk accordion
                    (json.rekap || []).forEach(r => r._open = false);
                    this.data = json;
                }
            } catch (e) {
                this.error = 'Gagal terhubung ke server.';
            } finally {
                this.loading = false;
            }
        },

        formatRupiah(n) {
            return Number(n).toLocaleString('id-ID');
        }
    };
}
</script>
@endsection
