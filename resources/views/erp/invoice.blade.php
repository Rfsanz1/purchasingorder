@extends('layouts.erp')
@section('title', 'Invoice')

@section('content')
<div x-data="invoiceApp()" x-init="init()" class="p-4 md:p-6 max-w-5xl mx-auto">

    {{-- Page header --}}
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-xl font-bold text-gray-900">Invoice</h1>
            <p class="text-sm text-gray-400 mt-0.5">Daftar semua invoice pesanan</p>
        </div>
        <a href="/po-form" class="bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Buat Order Baru
        </a>
    </div>

    {{-- Stats --}}
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p class="text-2xl font-bold text-gray-900" x-text="orders.length"></p>
            <p class="text-xs text-gray-400 mt-0.5">Total Invoice</p>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p class="text-2xl font-bold text-yellow-600" x-text="orders.filter(o=>o.metodePembayaran==='BelumBayar').length"></p>
            <p class="text-xs text-gray-400 mt-0.5">Belum Bayar</p>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p class="text-2xl font-bold text-green-600" x-text="orders.filter(o=>o.metodePembayaran==='CASH').length"></p>
            <p class="text-xs text-gray-400 mt-0.5">Cash</p>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p class="text-sm font-bold text-blue-700" x-text="'Rp ' + formatRupiah(orders.reduce((s,o)=>s+(Number(o.totalHarga)||0),0))"></p>
            <p class="text-xs text-gray-400 mt-0.5">Total Nilai</p>
        </div>
    </div>

    {{-- Filter --}}
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <div class="flex flex-col sm:flex-row gap-3">
            <input type="text" x-model="search" placeholder="Cari nama, telepon, ID order..."
                class="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            <select x-model="filterPayment" class="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">Semua Pembayaran</option>
                <option>CASH</option><option>Transfer</option><option>Debit</option><option>BelumBayar</option><option>DP</option><option>Multi</option>
            </select>
            <button @click="search=''; filterPayment=''" class="border border-gray-200 text-gray-500 px-4 py-2 rounded-xl text-sm hover:bg-gray-50">Reset</button>
        </div>
    </div>

    {{-- Loading --}}
    <div x-show="loading" class="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
        <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p class="text-gray-400 text-sm">Memuat invoice...</p>
    </div>

    {{-- Table --}}
    <div x-show="!loading" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500">ID Order</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500">Customer</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell">Sales</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden sm:table-cell">Tanggal</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500">Total</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500">Pembayaran</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    <template x-if="filtered.length === 0">
                        <tr><td colspan="7" class="text-center py-12 text-gray-400">Tidak ada invoice ditemukan</td></tr>
                    </template>
                    <template x-for="o in filtered" :key="o.orderId">
                        <tr class="hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-3">
                                <span class="font-mono text-xs text-gray-500" x-text="'#' + (o.orderId||'').slice(-8).toUpperCase()"></span>
                            </td>
                            <td class="px-4 py-3">
                                <p class="font-medium text-gray-800" x-text="o.namaKontak || '-'"></p>
                                <p class="text-xs text-gray-400" x-text="o.nomorTelepon"></p>
                            </td>
                            <td class="px-4 py-3 hidden md:table-cell">
                                <span class="text-gray-600 capitalize" x-text="o.salesPerson || '-'"></span>
                            </td>
                            <td class="px-4 py-3 hidden sm:table-cell">
                                <span class="text-gray-500 text-xs" x-text="formatDate(o.createdAt)"></span>
                            </td>
                            <td class="px-4 py-3">
                                <span class="font-semibold text-gray-800" x-text="'Rp ' + formatRupiah(o.totalHarga)"></span>
                            </td>
                            <td class="px-4 py-3">
                                <span class="text-xs px-2 py-1 rounded-full font-medium"
                                    :class="{
                                        'bg-green-100 text-green-700': o.metodePembayaran==='CASH',
                                        'bg-blue-100 text-blue-700': o.metodePembayaran==='Transfer',
                                        'bg-purple-100 text-purple-700': o.metodePembayaran==='Debit',
                                        'bg-red-100 text-red-700': o.metodePembayaran==='BelumBayar',
                                        'bg-yellow-100 text-yellow-700': o.metodePembayaran==='DP',
                                        'bg-orange-100 text-orange-700': o.metodePembayaran==='Multi',
                                    }"
                                    x-text="o.metodePembayaran || '-'">
                                </span>
                            </td>
                            <td class="px-4 py-3">
                                <span class="text-xs px-2 py-1 rounded-full font-medium"
                                    :class="{
                                        'bg-yellow-100 text-yellow-700': !o.statusPengiriman || o.statusPengiriman==='Menunggu',
                                        'bg-blue-100 text-blue-700': o.statusPengiriman==='Diproses',
                                        'bg-purple-100 text-purple-700': o.statusPengiriman==='Dikirim',
                                        'bg-green-100 text-green-700': o.statusPengiriman==='Selesai',
                                    }"
                                    x-text="o.statusPengiriman || 'Menunggu'">
                                </span>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</div>

@push('scripts')
<script>
function invoiceApp() {
    return {
        orders: [],
        loading: false,
        search: '',
        filterPayment: '',

        get filtered() {
            return this.orders.filter(o => {
                if (this.search) {
                    const q = this.search.toLowerCase();
                    if (!(o.namaKontak?.toLowerCase().includes(q) || o.nomorTelepon?.includes(q) || o.orderId?.toLowerCase().includes(q))) return false;
                }
                if (this.filterPayment && o.metodePembayaran !== this.filterPayment) return false;
                return true;
            });
        },

        async init() {
            this.loading = true;
            try {
                const res = await fetch('/api/orders');
                this.orders = await res.json();
            } catch(e) {}
            finally { this.loading = false; }
        },

        formatRupiah(n) { return Number(n||0).toLocaleString('id-ID'); },
        formatDate(d) {
            if (!d) return '';
            return new Date(d).toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' });
        }
    }
}
</script>
@endpush
@endsection
