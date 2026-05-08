@extends('layouts.erp')
@section('title', 'Riwayat Penjualan')

@section('content')
<div x-data="riwayatPenjualan()" x-init="init()">

{{-- ===== TOAST ===== --}}
<div x-show="toast.show" x-cloak
    x-transition:enter="transition ease-out duration-300"
    x-transition:enter-start="opacity-0 translate-y-2"
    x-transition:enter-end="opacity-100 translate-y-0"
    x-transition:leave="transition ease-in duration-200"
    x-transition:leave-end="opacity-0 translate-y-2"
    class="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium"
    :class="toast.type === 'success' ? 'bg-green-600 text-white' : (toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white')">
    <svg x-show="toast.type === 'success'" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
    <svg x-show="toast.type === 'error'" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    <svg x-show="toast.type === 'info'" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
    <span x-text="toast.message"></span>
</div>

{{-- ===== MODAL DETAIL ===== --}}
<div x-show="modal.open" x-cloak
    class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
    @keydown.escape.window="modal.open = false">
    <div class="fixed inset-0 bg-black/50" @click="modal.open = false"
        x-transition:enter="transition duration-200"
        x-transition:enter-start="opacity-0"
        x-transition:enter-end="opacity-100"></div>

    <div class="relative bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[92vh] flex flex-col"
        x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="opacity-0 translate-y-4 sm:scale-95"
        x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100"
        x-transition:leave="transition ease-in duration-200"
        x-transition:leave-end="opacity-0 translate-y-4 sm:scale-95">

        {{-- Modal Header --}}
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <div>
                <h2 class="font-bold text-gray-900">Detail Transaksi</h2>
                <p class="text-xs text-blue-600 font-mono font-semibold" x-text="modal.data ? modal.data.invoice : ''"></p>
            </div>
            <div class="flex gap-2 items-center">
                <button @click="printNotaDetail()" x-show="modal.data && !modal.loading"
                    class="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                    Print Nota
                </button>
                <button @click="modal.open = false" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
        </div>

        {{-- Modal Body --}}
        <div class="overflow-y-auto flex-1 px-5 py-4 space-y-4">
            <div x-show="modal.loading" class="flex justify-center py-10">
                <div class="flex flex-col items-center gap-3">
                    <svg class="w-8 h-8 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    <p class="text-sm text-gray-400">Memuat detail...</p>
                </div>
            </div>

            <div x-show="!modal.loading && modal.data" class="space-y-4">
                {{-- Info Transaksi --}}
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-gray-50 rounded-xl p-3">
                        <p class="text-xs text-gray-400 mb-1">Waktu Transaksi</p>
                        <p class="text-sm font-semibold text-gray-800" x-text="modal.data ? modal.data.tanggalFormatted : ''"></p>
                    </div>
                    <div class="bg-gray-50 rounded-xl p-3">
                        <p class="text-xs text-gray-400 mb-1">Kasir / Sales</p>
                        <p class="text-sm font-semibold text-gray-800" x-text="modal.data ? modal.data.kasir : ''"></p>
                    </div>
                    <div class="bg-gray-50 rounded-xl p-3">
                        <p class="text-xs text-gray-400 mb-1">Metode Pembayaran</p>
                        <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700" x-text="modal.data ? modal.data.metodePembayaran : ''"></span>
                    </div>
                    <div class="bg-gray-50 rounded-xl p-3">
                        <p class="text-xs text-gray-400 mb-1">Status</p>
                        <span class="px-2 py-0.5 rounded-full text-xs font-semibold"
                            :class="{
                                'bg-yellow-100 text-yellow-700': modal.data && modal.data.status === 'Menunggu',
                                'bg-blue-100 text-blue-700': modal.data && modal.data.status === 'Dikirim',
                                'bg-green-100 text-green-700': modal.data && modal.data.status === 'Selesai',
                                'bg-gray-100 text-gray-600': !modal.data || !['Menunggu','Dikirim','Selesai'].includes(modal.data.status),
                            }"
                            x-text="modal.data ? modal.data.status : ''"></span>
                    </div>
                </div>

                {{-- Data Customer --}}
                <div class="bg-blue-50 rounded-xl p-4">
                    <p class="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Data Customer</p>
                    <div class="space-y-1.5">
                        <div class="flex gap-2">
                            <svg class="w-4 h-4 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                            <p class="text-sm font-semibold text-gray-800" x-text="modal.data ? modal.data.customer : ''"></p>
                        </div>
                        <div class="flex gap-2" x-show="modal.data && modal.data.telepon && modal.data.telepon !== '-'">
                            <svg class="w-4 h-4 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                            <p class="text-sm text-gray-700" x-text="modal.data ? modal.data.telepon : ''"></p>
                        </div>
                        <div class="flex gap-2" x-show="modal.data && modal.data.alamat && modal.data.alamat !== '-'">
                            <svg class="w-4 h-4 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            <p class="text-sm text-gray-700" x-text="modal.data ? modal.data.alamat : ''"></p>
                        </div>
                    </div>
                </div>

                {{-- Item Produk --}}
                <div>
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Item Produk</p>
                    <div class="border border-gray-100 rounded-xl overflow-hidden">
                        <table class="w-full text-xs">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="text-left px-3 py-2 text-gray-500 font-semibold">Produk</th>
                                    <th class="text-center px-3 py-2 text-gray-500 font-semibold">Qty</th>
                                    <th class="text-right px-3 py-2 text-gray-500 font-semibold">Harga</th>
                                    <th class="text-right px-3 py-2 text-gray-500 font-semibold">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-50">
                                <template x-for="(item, idx) in (modal.data ? modal.data.items : [])" :key="idx">
                                    <tr>
                                        <td class="px-3 py-2.5 text-gray-800 font-medium" x-text="item.nama_produk"></td>
                                        <td class="px-3 py-2.5 text-center text-gray-600" x-text="item.qty + 'x'"></td>
                                        <td class="px-3 py-2.5 text-right text-gray-700" x-text="'Rp\u00a0' + formatRupiah(item.harga_satuan)"></td>
                                        <td class="px-3 py-2.5 text-right font-semibold text-gray-800" x-text="'Rp\u00a0' + formatRupiah(item.subtotal)"></td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>

                {{-- Ringkasan Harga --}}
                <div class="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div class="flex justify-between text-sm text-gray-600">
                        <span>Subtotal Produk</span>
                        <span x-text="'Rp\u00a0' + formatRupiah(modal.data ? modal.data.hargaProduk : 0)"></span>
                    </div>
                    <div class="flex justify-between text-sm text-gray-600" x-show="modal.data && modal.data.ongkir > 0">
                        <span>Ongkos Kirim</span>
                        <span x-text="'Rp\u00a0' + formatRupiah(modal.data ? modal.data.ongkir : 0)"></span>
                    </div>
                    <div class="flex justify-between font-bold text-gray-900 text-base border-t border-gray-200 pt-2 mt-2">
                        <span>Grand Total</span>
                        <span class="text-blue-600" x-text="'Rp\u00a0' + formatRupiah(modal.data ? modal.data.total : 0)"></span>
                    </div>
                    <div class="flex justify-between text-sm text-red-600 font-medium" x-show="modal.data && modal.data.sisaPembayaran > 0">
                        <span>Sisa Pembayaran</span>
                        <span x-text="'Rp\u00a0' + formatRupiah(modal.data ? modal.data.sisaPembayaran : 0)"></span>
                    </div>
                </div>

                {{-- Payment Splits --}}
                <div x-show="modal.data && modal.data.paymentSplits && modal.data.paymentSplits.length > 1">
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Rincian Pembayaran</p>
                    <div class="space-y-1.5">
                        <template x-for="(split, i) in (modal.data ? modal.data.paymentSplits : [])" :key="i">
                            <div class="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 text-sm">
                                <span class="text-gray-600" x-text="split.method"></span>
                                <span class="font-semibold text-gray-800" x-text="'Rp\u00a0' + formatRupiah(split.amount || 0)"></span>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- ===== PRINT NOTA (hidden from screen, shown on print) ===== --}}
<div id="notaPrint" class="hidden print:block" style="font-family: monospace; font-size: 12px; width: 320px; margin: 0 auto;"></div>

{{-- ===== MAIN CONTENT ===== --}}
<div class="p-4 md:p-6 max-w-7xl mx-auto">

    {{-- Header --}}
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
            <h1 class="text-xl font-bold text-gray-900">Riwayat Penjualan</h1>
            <p class="text-sm text-gray-400 mt-0.5">Semua transaksi penjualan dari sistem ERP</p>
        </div>
        <div class="flex gap-2 flex-wrap">
            <button @click="exportCsv()"
                class="flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-medium px-3 py-2 rounded-xl hover:bg-gray-50 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Export CSV
            </button>
            <button @click="load(1)"
                class="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition">
                <svg class="w-4 h-4" :class="loading ? 'animate-spin' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                <span x-text="loading ? 'Memuat...' : 'Refresh'"></span>
            </button>
        </div>
    </div>

    {{-- Summary Cards --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <template x-if="loadingSummary">
            <template x-for="i in [1,2,3,4]" :key="i">
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 animate-pulse">
                    <div class="h-3 bg-gray-200 rounded w-24 mb-3"></div>
                    <div class="h-7 bg-gray-200 rounded w-20 mb-1"></div>
                    <div class="h-2 bg-gray-100 rounded w-16"></div>
                </div>
            </template>
        </template>
        <template x-if="!loadingSummary">
            <div class="contents">
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div class="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
                        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                    </div>
                    <p class="text-2xl font-bold text-gray-900" x-text="summary ? summary.totalTransaksiHariIni : 0"></p>
                    <p class="text-xs text-gray-400 mt-0.5">Transaksi Hari Ini</p>
                </div>
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div class="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center mb-2">
                        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <p class="text-lg font-bold text-green-600" x-text="'Rp\u00a0' + formatRupiah(summary ? summary.omzetHariIni : 0)"></p>
                    <p class="text-xs text-gray-400 mt-0.5">Omzet Hari Ini</p>
                </div>
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div class="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center mb-2">
                        <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    </div>
                    <p class="text-2xl font-bold text-gray-900" x-text="summary ? summary.totalItemTerjual : 0"></p>
                    <p class="text-xs text-gray-400 mt-0.5">Item Terjual Hari Ini</p>
                </div>
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div class="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center mb-2">
                        <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                    </div>
                    <p class="text-sm font-bold text-gray-900 leading-tight" x-text="summary ? summary.metodeTerbanyak : '-'"></p>
                    <p class="text-xs text-gray-400 mt-0.5">Metode Terbanyak</p>
                </div>
            </div>
        </template>
    </div>

    {{-- Filter Panel --}}
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="col-span-2 md:col-span-1">
                <label class="text-xs text-gray-500 mb-1 block">Cari Invoice / Customer</label>
                <div class="relative">
                    <input type="text" x-model="filter.search" @input.debounce.400ms="load(1)"
                        placeholder="Ketik untuk cari..."
                        class="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <svg class="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
            </div>
            <div>
                <label class="text-xs text-gray-500 mb-1 block">Dari Tanggal</label>
                <input type="date" x-model="filter.dari" @change="load(1)"
                    class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            </div>
            <div>
                <label class="text-xs text-gray-500 mb-1 block">Sampai Tanggal</label>
                <input type="date" x-model="filter.sampai" @change="load(1)"
                    class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            </div>
            <div>
                <label class="text-xs text-gray-500 mb-1 block">Metode Pembayaran</label>
                <select x-model="filter.metode" @change="load(1)"
                    class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value="">Semua Metode</option>
                    <option>CASH</option>
                    <option>Transfer</option>
                    <option>Debit</option>
                    <option>DP</option>
                    <option>Multi</option>
                    <option>BelumBayar</option>
                </select>
            </div>
            <div>
                <label class="text-xs text-gray-500 mb-1 block">Status</label>
                <select x-model="filter.status" @change="load(1)"
                    class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value="">Semua Status</option>
                    <option>Menunggu</option>
                    <option>Dikirim</option>
                    <option>Selesai</option>
                </select>
            </div>
            <div>
                <label class="text-xs text-gray-500 mb-1 block">Per Halaman</label>
                <select x-model="filter.perPage" @change="load(1)"
                    class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                </select>
            </div>
            <div class="col-span-2 md:col-span-1 flex items-end">
                <button @click="resetFilter()"
                    class="w-full border border-gray-200 text-gray-500 text-sm py-2 rounded-xl hover:bg-gray-50 transition">
                    Reset Filter
                </button>
            </div>
        </div>
    </div>

    {{-- Table --}}
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {{-- Table Meta --}}
        <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div class="text-sm text-gray-500">
                <span x-show="!loading && meta.total > 0">
                    Menampilkan <span class="font-semibold text-gray-700" x-text="meta.from"></span>–<span class="font-semibold text-gray-700" x-text="meta.to"></span>
                    dari <span class="font-semibold text-gray-700" x-text="meta.total.toLocaleString('id-ID')"></span> transaksi
                </span>
                <span x-show="loading" class="text-gray-400">Memuat data...</span>
            </div>
            <div class="text-xs text-gray-400" x-show="!loading && meta.total > 0">
                Hal <span x-text="meta.current_page"></span> / <span x-text="meta.last_page"></span>
            </div>
        </div>

        {{-- Desktop Table --}}
        <div class="overflow-x-auto hidden md:block">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th class="text-left px-4 py-3">
                            <button @click="toggleSort('order_id')" class="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700">
                                Invoice
                                <svg class="w-3 h-3" :class="sort.field==='order_id' && sort.dir==='asc' ? 'rotate-180':' '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                            </button>
                        </th>
                        <th class="text-left px-4 py-3">
                            <button @click="toggleSort('created_at')" class="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700">
                                Tanggal
                                <svg class="w-3 h-3" :class="sort.field==='created_at' && sort.dir==='asc' ? 'rotate-180':' '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                            </button>
                        </th>
                        <th class="text-left px-4 py-3">
                            <button @click="toggleSort('nama_kontak')" class="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700">
                                Customer
                                <svg class="w-3 h-3" :class="sort.field==='nama_kontak' && sort.dir==='asc' ? 'rotate-180':' '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                            </button>
                        </th>
                        <th class="text-right px-4 py-3">
                            <button @click="toggleSort('total_harga')" class="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700 ml-auto">
                                Total
                                <svg class="w-3 h-3" :class="sort.field==='total_harga' && sort.dir==='asc' ? 'rotate-180':' '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                            </button>
                        </th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Metode</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Kasir</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    {{-- Loading Skeleton --}}
                    <template x-if="loading">
                        <template x-for="i in [1,2,3,4,5,6,7,8]" :key="i">
                            <tr class="animate-pulse">
                                <td class="px-4 py-3"><div class="h-4 bg-gray-200 rounded w-20"></div></td>
                                <td class="px-4 py-3"><div class="h-4 bg-gray-200 rounded w-28"></div></td>
                                <td class="px-4 py-3"><div class="h-4 bg-gray-200 rounded w-32"></div></td>
                                <td class="px-4 py-3 text-right"><div class="h-4 bg-gray-200 rounded w-24 ml-auto"></div></td>
                                <td class="px-4 py-3"><div class="h-5 bg-gray-200 rounded-full w-16"></div></td>
                                <td class="px-4 py-3"><div class="h-4 bg-gray-200 rounded w-20"></div></td>
                                <td class="px-4 py-3"><div class="h-5 bg-gray-200 rounded-full w-16"></div></td>
                                <td class="px-4 py-3"><div class="h-7 bg-gray-200 rounded-lg w-20"></div></td>
                            </tr>
                        </template>
                    </template>
                    {{-- Data Rows --}}
                    <template x-if="!loading">
                        <template x-for="row in rows" :key="row.id">
                            <tr class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3">
                                    <span class="font-mono text-blue-600 font-semibold text-xs" x-text="row.invoice"></span>
                                </td>
                                <td class="px-4 py-3 text-gray-600 text-xs whitespace-nowrap" x-text="row.tanggalFormatted"></td>
                                <td class="px-4 py-3">
                                    <div class="font-medium text-gray-800 text-xs" x-text="row.customer"></div>
                                    <div class="text-gray-400 text-xs" x-show="row.telepon && row.telepon !== '-'" x-text="row.telepon"></div>
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <div class="font-bold text-gray-900 text-sm" x-text="'Rp\u00a0' + formatRupiah(row.total)"></div>
                                    <div class="text-xs text-red-500" x-show="row.sisaPembayaran > 0" x-text="'Sisa: Rp\u00a0' + formatRupiah(row.sisaPembayaran)"></div>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="px-2 py-1 rounded-full text-xs font-semibold"
                                        :class="{
                                            'bg-green-100 text-green-700':  row.metodePembayaran === 'CASH',
                                            'bg-blue-100 text-blue-700':    row.metodePembayaran === 'Transfer',
                                            'bg-purple-100 text-purple-700':row.metodePembayaran === 'Debit',
                                            'bg-orange-100 text-orange-700':row.metodePembayaran === 'DP',
                                            'bg-teal-100 text-teal-700':    row.metodePembayaran === 'Multi',
                                            'bg-red-100 text-red-700':      row.metodePembayaran === 'BelumBayar',
                                            'bg-gray-100 text-gray-600':    !['CASH','Transfer','Debit','DP','Multi','BelumBayar'].includes(row.metodePembayaran),
                                        }"
                                        x-text="row.metodePembayaran"></span>
                                </td>
                                <td class="px-4 py-3 text-xs text-gray-700 font-medium" x-text="row.kasir"></td>
                                <td class="px-4 py-3">
                                    <span class="px-2 py-1 rounded-full text-xs font-semibold"
                                        :class="{
                                            'bg-yellow-100 text-yellow-700': row.status === 'Menunggu',
                                            'bg-blue-100 text-blue-700':    row.status === 'Dikirim',
                                            'bg-green-100 text-green-700':  row.status === 'Selesai',
                                            'bg-gray-100 text-gray-600':    !['Menunggu','Dikirim','Selesai'].includes(row.status),
                                        }"
                                        x-text="row.status"></span>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex gap-1.5">
                                        <button @click="showDetail(row.id)"
                                            class="flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-blue-100 transition">
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                            Detail
                                        </button>
                                        <button @click="printNota(row.id)"
                                            class="flex items-center gap-1 bg-gray-50 text-gray-600 text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition">
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                                            Print
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </template>
                </tbody>
            </table>
        </div>

        {{-- Mobile Card List --}}
        <div class="md:hidden divide-y divide-gray-50">
            <template x-if="loading">
                <template x-for="i in [1,2,3,4,5]" :key="i">
                    <div class="p-4 animate-pulse">
                        <div class="flex justify-between mb-2">
                            <div class="h-4 bg-gray-200 rounded w-20"></div>
                            <div class="h-5 bg-gray-200 rounded-full w-16"></div>
                        </div>
                        <div class="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                        <div class="h-5 bg-gray-200 rounded w-24"></div>
                    </div>
                </template>
            </template>
            <template x-if="!loading">
                <template x-for="row in rows" :key="row.id">
                    <div class="p-4">
                        <div class="flex items-start justify-between gap-2 mb-2">
                            <div>
                                <span class="font-mono text-blue-600 font-bold text-xs" x-text="row.invoice"></span>
                                <p class="text-xs text-gray-400 mt-0.5" x-text="row.tanggalFormatted"></p>
                            </div>
                            <span class="px-2 py-1 rounded-full text-xs font-semibold shrink-0"
                                :class="{
                                    'bg-yellow-100 text-yellow-700': row.status === 'Menunggu',
                                    'bg-blue-100 text-blue-700':    row.status === 'Dikirim',
                                    'bg-green-100 text-green-700':  row.status === 'Selesai',
                                    'bg-gray-100 text-gray-600':    !['Menunggu','Dikirim','Selesai'].includes(row.status),
                                }"
                                x-text="row.status"></span>
                        </div>
                        <p class="font-medium text-gray-800 text-sm" x-text="row.customer"></p>
                        <div class="flex items-center justify-between mt-2">
                            <div>
                                <p class="font-bold text-gray-900" x-text="'Rp\u00a0' + formatRupiah(row.total)"></p>
                                <span class="px-2 py-0.5 rounded-full text-xs font-semibold mt-1 inline-block bg-gray-100 text-gray-600"
                                    x-text="row.metodePembayaran"></span>
                            </div>
                            <div class="flex gap-1.5">
                                <button @click="showDetail(row.id)"
                                    class="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-blue-100">
                                    Detail
                                </button>
                                <button @click="printNota(row.id)"
                                    class="bg-gray-50 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100">
                                    Print
                                </button>
                            </div>
                        </div>
                    </div>
                </template>
            </template>
        </div>

        {{-- Empty State --}}
        <div x-show="!loading && rows.length === 0" x-cloak class="py-16 text-center">
            <svg class="w-14 h-14 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <p class="text-gray-500 font-medium">Tidak ada transaksi ditemukan</p>
            <p class="text-sm text-gray-400 mt-1">Coba ubah filter pencarian atau rentang tanggal</p>
            <button @click="resetFilter()" class="mt-4 text-sm text-blue-600 hover:underline">Reset filter</button>
        </div>

        {{-- Pagination --}}
        <div x-show="!loading && meta.last_page > 1" class="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
            <div class="text-xs text-gray-400">
                Halaman <span class="font-semibold text-gray-700" x-text="meta.current_page"></span>
                dari <span class="font-semibold text-gray-700" x-text="meta.last_page"></span>
            </div>
            <div class="flex gap-1.5 flex-wrap">
                <button @click="load(1)" :disabled="meta.current_page === 1"
                    class="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs disabled:opacity-40 hover:bg-gray-50 transition">«</button>
                <button @click="load(meta.current_page - 1)" :disabled="meta.current_page <= 1"
                    class="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs disabled:opacity-40 hover:bg-gray-50 transition">‹ Prev</button>
                <template x-for="page in pageNumbers" :key="page">
                    <button @click="page !== '...' && load(page)" :disabled="page === '...'"
                        class="px-2.5 py-1.5 border rounded-lg text-xs transition"
                        :class="page === meta.current_page
                            ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                            : (page === '...' ? 'border-transparent text-gray-400 cursor-default' : 'border-gray-200 hover:bg-gray-50')"
                        x-text="page"></button>
                </template>
                <button @click="load(meta.current_page + 1)" :disabled="meta.current_page >= meta.last_page"
                    class="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs disabled:opacity-40 hover:bg-gray-50 transition">Next ›</button>
                <button @click="load(meta.last_page)" :disabled="meta.current_page === meta.last_page"
                    class="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs disabled:opacity-40 hover:bg-gray-50 transition">»</button>
            </div>
        </div>
    </div>

</div>{{-- end main content --}}

</div>{{-- end x-data wrapper --}}

<style>
@media print {
    body > *:not(#notaPrint) { display: none !important; }
    #notaPrint { display: block !important; }
}
</style>

<script>
function riwayatPenjualan() {
    return {
        rows: [],
        loading: false,
        loadingSummary: true,
        summary: null,
        meta: { total: 0, per_page: 15, current_page: 1, last_page: 1, from: 0, to: 0 },
        filter: { search: '', dari: '', sampai: '', metode: '', status: '', perPage: 15 },
        sort: { field: 'created_at', dir: 'desc' },
        modal: { open: false, loading: false, data: null },
        toast: { show: false, message: '', type: 'success', timer: null },

        get pageNumbers() {
            const cur = this.meta.current_page;
            const last = this.meta.last_page;
            if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
            if (cur <= 4) return [1, 2, 3, 4, 5, '...', last];
            if (cur >= last - 3) return [1, '...', last - 4, last - 3, last - 2, last - 1, last];
            return [1, '...', cur - 1, cur, cur + 1, '...', last];
        },

        async init() {
            await Promise.all([this.loadSummary(), this.load(1)]);
        },

        async loadSummary() {
            this.loadingSummary = true;
            try {
                const res = await fetch('/api/riwayat-penjualan/summary');
                if (!res.ok) throw new Error();
                this.summary = await res.json();
            } catch (e) {
                this.summary = { totalTransaksiHariIni: 0, omzetHariIni: 0, totalItemTerjual: 0, metodeTerbanyak: '-' };
            } finally {
                this.loadingSummary = false;
            }
        },

        async load(page = 1) {
            this.loading = true;
            try {
                const params = new URLSearchParams({
                    page,
                    per_page: this.filter.perPage,
                    search:   this.filter.search,
                    dari:     this.filter.dari,
                    sampai:   this.filter.sampai,
                    metode:   this.filter.metode,
                    status:   this.filter.status,
                    sort:     this.sort.field,
                    dir:      this.sort.dir,
                });
                const res = await fetch('/api/riwayat-penjualan?' + params);
                if (!res.ok) throw new Error('Gagal memuat data');
                const json = await res.json();
                this.rows = json.data || [];
                this.meta = {
                    total:        json.total        || 0,
                    per_page:     json.per_page     || 15,
                    current_page: json.current_page || 1,
                    last_page:    json.last_page    || 1,
                    from:         json.from         || 0,
                    to:           json.to           || 0,
                };
            } catch (e) {
                this.showToast('Gagal memuat data: ' + e.message, 'error');
            } finally {
                this.loading = false;
            }
        },

        async showDetail(id) {
            this.modal.open    = true;
            this.modal.loading = true;
            this.modal.data    = null;
            try {
                const res = await fetch('/api/riwayat-penjualan/' + id);
                if (!res.ok) throw new Error('Tidak ditemukan');
                this.modal.data = await res.json();
            } catch (e) {
                this.showToast('Gagal memuat detail transaksi', 'error');
                this.modal.open = false;
            } finally {
                this.modal.loading = false;
            }
        },

        toggleSort(field) {
            if (this.sort.field === field) {
                this.sort.dir = this.sort.dir === 'desc' ? 'asc' : 'desc';
            } else {
                this.sort.field = field;
                this.sort.dir   = 'desc';
            }
            this.load(1);
        },

        resetFilter() {
            this.filter = { search: '', dari: '', sampai: '', metode: '', status: '', perPage: 15 };
            this.sort   = { field: 'created_at', dir: 'desc' };
            this.load(1);
        },

        exportCsv() {
            const params = new URLSearchParams({
                search: this.filter.search,
                dari:   this.filter.dari,
                sampai: this.filter.sampai,
                metode: this.filter.metode,
                status: this.filter.status,
            });
            window.location.href = '/api/riwayat-penjualan/export?' + params;
            this.showToast('File CSV sedang diunduh...', 'info');
        },

        buildNotaHtml(data) {
            const rp = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
            let itemsHtml = '';
            (data.items || []).forEach(it => {
                itemsHtml += `<div style="margin:2px 0;font-size:11px;">${it.nama_produk}</div>`;
                itemsHtml += `<div style="display:flex;justify-content:space-between;font-size:11px;">
                    <span>${it.qty}x @ ${rp(it.harga_satuan)}</span>
                    <span>${rp(it.subtotal)}</span></div>`;
            });
            return `<div style="text-align:center;margin-bottom:8px;">
                <div style="font-size:15px;font-weight:bold;letter-spacing:1px;">GENTONG MAS</div>
                <div style="font-size:10px;color:#666;">ERP System — Nota Penjualan</div>
                <div style="border-bottom:1px dashed #000;margin:6px 0;"></div>
            </div>
            <div style="font-size:11px;line-height:1.6;">
                <div>Invoice : <strong>${data.invoice || ''}</strong></div>
                <div>Tanggal : ${data.tanggalFormatted || ''}</div>
                <div>Kasir   : ${data.kasir || ''}</div>
                <div>Customer: ${data.customer || ''}</div>
                ${(data.telepon && data.telepon !== '-') ? `<div>Telp    : ${data.telepon}</div>` : ''}
                ${(data.alamat && data.alamat !== '-') ? `<div>Alamat  : ${data.alamat}</div>` : ''}
                <div style="border-bottom:1px dashed #000;margin:6px 0;"></div>
                ${itemsHtml}
                <div style="border-bottom:1px dashed #000;margin:6px 0;"></div>
                <div style="display:flex;justify-content:space-between;">
                    <span>Subtotal</span><span>${rp(data.hargaProduk || 0)}</span>
                </div>
                ${(data.ongkir > 0) ? `<div style="display:flex;justify-content:space-between;"><span>Ongkir</span><span>${rp(data.ongkir)}</span></div>` : ''}
                <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:13px;margin-top:4px;padding-top:4px;border-top:1px solid #000;">
                    <span>TOTAL</span><span>${rp(data.total || 0)}</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-top:2px;">
                    <span>Metode</span><span>${data.metodePembayaran || ''}</span>
                </div>
                ${(data.sisaPembayaran > 0) ? `<div style="display:flex;justify-content:space-between;color:red;font-weight:600;"><span>Sisa Bayar</span><span>${rp(data.sisaPembayaran)}</span></div>` : ''}
                <div style="border-bottom:1px dashed #000;margin:6px 0;"></div>
                <div style="text-align:center;font-size:10px;margin-top:4px;">Terima kasih atas kepercayaan Anda!</div>
            </div>`;
        },

        async printNota(id) {
            this.showToast('Menyiapkan nota...', 'info');
            try {
                const res  = await fetch('/api/riwayat-penjualan/' + id);
                if (!res.ok) throw new Error();
                const data = await res.json();
                const el   = document.getElementById('notaPrint');
                el.innerHTML = this.buildNotaHtml(data);
                setTimeout(() => window.print(), 200);
            } catch (e) {
                this.showToast('Gagal menyiapkan nota', 'error');
            }
        },

        printNotaDetail() {
            if (!this.modal.data) return;
            const el = document.getElementById('notaPrint');
            el.innerHTML = this.buildNotaHtml(this.modal.data);
            setTimeout(() => window.print(), 100);
        },

        showToast(message, type = 'success') {
            clearTimeout(this.toast.timer);
            this.toast.show    = true;
            this.toast.message = message;
            this.toast.type    = type;
            this.toast.timer   = setTimeout(() => { this.toast.show = false; }, 3500);
        },

        formatRupiah(n) {
            return Number(n || 0).toLocaleString('id-ID');
        },
    };
}
</script>
@endsection
