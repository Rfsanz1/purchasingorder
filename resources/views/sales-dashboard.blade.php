@extends('layouts.erp')
@section('title', 'Riwayat Pesanan')

@section('content')
<div x-data="salesDashApp()" x-init="init()" class="p-4 md:p-6 max-w-4xl mx-auto">

    {{-- Page header --}}
    <div class="flex items-center justify-between mb-4">
        <div>
            <h1 class="text-xl font-bold text-gray-900">Riwayat Pesanan</h1>
            <p class="text-sm text-gray-400 mt-0.5">Semua pesanan yang masuk</p>
        </div>
        <a href="/po-form"
            class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Buat Order
        </a>
    </div>

    {{-- Statistik ringkas --}}
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p class="text-2xl font-bold text-gray-800" x-text="orders.length"></p>
            <p class="text-xs text-gray-400 mt-0.5">Total PO</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p class="text-2xl font-bold text-yellow-500" x-text="orders.filter(o => !o.statusPengiriman || o.statusPengiriman === 'Menunggu' || o.statusPengiriman === 'Baru').length"></p>
            <p class="text-xs text-gray-400 mt-0.5">Menunggu</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p class="text-2xl font-bold text-blue-500" x-text="orders.filter(o => o.statusPengiriman === 'Diproses' || o.statusPengiriman === 'Dikirim').length"></p>
            <p class="text-xs text-gray-400 mt-0.5">Diproses</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p class="text-2xl font-bold text-green-600" x-text="orders.filter(o => o.statusPengiriman === 'Selesai').length"></p>
            <p class="text-xs text-gray-400 mt-0.5">Selesai</p>
        </div>
    </div>

    {{-- Tab toggle --}}
    <div class="flex bg-gray-100 rounded-xl p-1 mb-4">
        <button @click="viewMode = 'sales'"
            :class="viewMode === 'sales' ? 'bg-white text-blue-700 shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-700'"
            class="flex-1 py-2 text-sm rounded-lg transition-all flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            Per Sales
        </button>
        <button @click="viewMode = 'list'"
            :class="viewMode === 'list' ? 'bg-white text-blue-700 shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-700'"
            class="flex-1 py-2 text-sm rounded-lg transition-all flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
            Semua Order
        </button>
    </div>

    {{-- Loading --}}
    <div x-show="loading" class="text-center py-16 text-gray-400 text-sm">
        <div class="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Memuat pesanan...
    </div>

    {{-- ======================== PER SALES VIEW ======================== --}}
    <div x-show="!loading && viewMode === 'sales'">

        {{-- Custom dropdown pilih sales --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-4 mb-4" x-data="{ dropOpen: false }" @click.outside="dropOpen = false">
            <label class="text-sm font-medium text-gray-700 block mb-2">Pilih Sales</label>

            {{-- Trigger button --}}
            <button type="button" @click="dropOpen = !dropOpen"
                class="w-full flex items-center justify-between gap-3 border-2 rounded-xl px-4 py-3 text-sm transition-all"
                :class="selectedSales ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'">

                {{-- Placeholder --}}
                <span x-show="!selectedSales" class="text-gray-400">-- Pilih nama sales --</span>

                {{-- Sales terpilih --}}
                <span x-show="selectedSales" class="flex items-center gap-2.5">
                    <span class="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span class="text-white font-bold text-xs" x-text="(selectedSales||'').charAt(0)"></span>
                    </span>
                    <span class="font-semibold text-gray-800 capitalize" x-text="selectedSales"></span>
                    <span class="text-xs bg-blue-100 text-blue-600 font-semibold px-2 py-0.5 rounded-full"
                        x-text="selectedGroup ? selectedGroup.totalOrders + ' order' : ''"></span>
                </span>

                <span class="flex items-center gap-1 shrink-0">
                    <span x-show="selectedSales" @click.stop="selectedSales = ''; dropOpen = false"
                        class="text-gray-300 hover:text-red-400 transition-colors p-0.5 rounded">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                    </span>
                    <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="dropOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </span>
            </button>

            {{-- Dropdown panel --}}
            <div x-show="dropOpen"
                x-transition:enter="transition ease-out duration-150"
                x-transition:enter-start="opacity-0 -translate-y-2"
                x-transition:enter-end="opacity-100 translate-y-0"
                x-transition:leave="transition ease-in duration-100"
                x-transition:leave-start="opacity-100 translate-y-0"
                x-transition:leave-end="opacity-0 -translate-y-2"
                class="mt-2 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden z-20 relative">

                {{-- Kosong --}}
                <div x-show="groupedBySales.length === 0" class="px-4 py-6 text-center text-gray-400 text-sm">
                    Belum ada data pesanan
                </div>

                {{-- List sales --}}
                <div class="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                    <template x-for="group in groupedBySales" :key="group.sales">
                        <button type="button"
                            @click="selectedSales = group.sales; dropOpen = false"
                            class="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left"
                            :class="selectedSales === group.sales ? 'bg-blue-50' : ''">

                            {{-- Avatar --}}
                            <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                                :style="'background: linear-gradient(135deg,' + brandColor(group.sales) + ', ' + brandColor(group.sales + '2') + ')'">
                                <span class="text-white font-bold text-sm" x-text="group.sales.charAt(0)"></span>
                            </div>

                            {{-- Info --}}
                            <div class="flex-1 min-w-0">
                                <p class="font-semibold text-gray-800 capitalize text-sm" x-text="group.sales"></p>
                                <p class="text-xs text-gray-400 mt-0.5">
                                    <span x-text="group.totalOrders"></span> order ·
                                    <span x-text="group.totalUnits"></span> unit ·
                                    <span x-text="'Rp ' + formatRupiah(group.totalRevenue)"></span>
                                </p>
                            </div>

                            {{-- Centang jika terpilih --}}
                            <svg x-show="selectedSales === group.sales"
                                class="w-5 h-5 text-blue-500 shrink-0"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                            </svg>
                        </button>
                    </template>
                </div>
            </div>
        </div>

        {{-- Placeholder saat belum pilih --}}
        <div x-show="!selectedSales" class="bg-white rounded-2xl border border-gray-100 text-center py-16">
            <svg class="w-10 h-10 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <p class="text-gray-400 text-sm">Pilih sales dari dropdown untuk melihat data</p>
        </div>

        {{-- Data sales terpilih --}}
        <template x-if="selectedSales && selectedGroup">
            <div class="space-y-4" x-data="{ ordersOpen: false }">

                {{-- Header ringkasan sales --}}
                <div class="bg-white rounded-2xl border border-gray-100 p-4">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <span class="text-white font-bold text-lg" x-text="selectedGroup.sales.charAt(0)"></span>
                        </div>
                        <div class="flex-1">
                            <p class="font-bold text-gray-900 text-base capitalize" x-text="selectedGroup.sales"></p>
                            <p class="text-xs text-gray-400">Sales Representative</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-3 gap-3">
                        <div class="bg-blue-50 rounded-xl p-3 text-center">
                            <p class="text-xl font-bold text-blue-700" x-text="selectedGroup.totalOrders"></p>
                            <p class="text-xs text-blue-500 mt-0.5">Total Order</p>
                        </div>
                        <div class="bg-green-50 rounded-xl p-3 text-center">
                            <p class="text-xl font-bold text-green-700" x-text="selectedGroup.totalUnits"></p>
                            <p class="text-xs text-green-500 mt-0.5">Unit Terjual</p>
                        </div>
                        <div class="bg-purple-50 rounded-xl p-3 text-center">
                            <p class="text-sm font-bold text-purple-700" x-text="'Rp ' + formatRupiah(selectedGroup.totalRevenue)"></p>
                            <p class="text-xs text-purple-500 mt-0.5">Total Omzet</p>
                        </div>
                    </div>
                </div>

                {{-- Breakdown per Brand --}}
                <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div class="px-4 pt-4 pb-2 border-b border-gray-100">
                        <p class="font-semibold text-gray-800">Breakdown per Brand</p>
                        <p class="text-xs text-gray-400 mt-0.5">Produk yang terjual berdasarkan brand</p>
                    </div>
                    <table class="w-full text-sm">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="text-left px-4 py-2.5 text-xs text-gray-500 font-semibold">Brand / Produk</th>
                                <th class="text-center px-3 py-2.5 text-xs text-gray-500 font-semibold">Unit</th>
                                <th class="text-right px-4 py-2.5 text-xs text-gray-500 font-semibold">Omzet</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template x-for="(brand, bi) in selectedGroup.brands" :key="brand.brand">
                                <tr :class="bi % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'" class="border-t border-gray-50">
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-2.5">
                                            <div class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                                :style="'background:' + brandColor(brand.brand)">
                                                <span x-text="brand.brand.charAt(0)"></span>
                                            </div>
                                            <span class="font-medium text-gray-800" x-text="brand.brand"></span>
                                        </div>
                                    </td>
                                    <td class="px-3 py-3 text-center">
                                        <span class="bg-blue-100 text-blue-700 font-semibold text-xs px-2.5 py-1 rounded-full" x-text="brand.units + ' unit'"></span>
                                    </td>
                                    <td class="px-4 py-3 text-right font-semibold text-gray-700" x-text="'Rp ' + formatRupiah(brand.revenue)"></td>
                                </tr>
                            </template>
                        </tbody>
                        <tfoot class="border-t-2 border-blue-100 bg-blue-50">
                            <tr>
                                <td class="px-4 py-3 text-sm font-bold text-blue-800">TOTAL</td>
                                <td class="px-3 py-3 text-center text-sm font-bold text-blue-800" x-text="selectedGroup.totalUnits + ' unit'"></td>
                                <td class="px-4 py-3 text-right text-sm font-bold text-blue-800" x-text="'Rp ' + formatRupiah(selectedGroup.totalRevenue)"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {{-- Daftar Order --}}
                <div>
                    <div class="flex items-center gap-2 mb-2 px-1">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                        <span class="font-semibold text-gray-800 text-sm">Daftar Order</span>
                        <span class="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full" x-text="selectedGroup.orders.length"></span>
                    </div>
                    <div class="space-y-2.5">
                        <template x-for="order in selectedGroup.orders" :key="order.orderId">
                            <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden" x-data="{ open: false }">

                                <div @click="open = !open" class="px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors select-none">
                                    <div class="flex items-center justify-between gap-3">
                                        <div class="flex items-center gap-2 min-w-0 flex-1">
                                            <span class="shrink-0 text-xs px-2 py-0.5 rounded-full font-semibold"
                                                :class="{
                                                    'bg-yellow-100 text-yellow-700': !order.statusPengiriman || order.statusPengiriman==='Menunggu'||order.statusPengiriman==='Baru',
                                                    'bg-blue-100 text-blue-700': order.statusPengiriman==='Diproses',
                                                    'bg-orange-100 text-orange-700': order.statusPengiriman==='Dikirim',
                                                    'bg-green-100 text-green-700': order.statusPengiriman==='Selesai',
                                                    'bg-red-100 text-red-700': order.statusPengiriman==='Dibatalkan',
                                                }"
                                                x-text="order.statusPengiriman || 'Menunggu'">
                                            </span>
                                            <span class="font-semibold text-gray-800 text-sm truncate" x-text="order.namaKontak || '-'"></span>
                                        </div>
                                        <div class="flex items-center gap-3 shrink-0">
                                            <div class="text-right">
                                                <p class="text-sm font-bold text-blue-700" x-text="'Rp ' + formatRupiah(order.totalHarga)"></p>
                                                <p class="text-xs text-gray-400" x-text="formatTanggal(order.createdAt)"></p>
                                            </div>
                                            <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="open ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                                        </div>
                                    </div>
                                    <p class="text-xs text-gray-400 mt-1 truncate"
                                        x-text="(Array.isArray(order.namaProduk) ? order.namaProduk.join(', ') : (order.namaProduk||'')) + ' • ' + (order.metodePembayaran||'Cash')">
                                    </p>
                                </div>

                                <div x-show="open" x-collapse class="border-t border-gray-100">
                                    <div class="px-4 py-4 space-y-4">
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <span class="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded" x-text="'#' + (order.orderId||'').slice(-8).toUpperCase()"></span>
                                            <span x-text="order.metodePembayaran || 'CASH'"
                                                :class="(order.metodePembayaran||'').toLowerCase().includes('cash') ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'"
                                                class="text-xs font-semibold px-2 py-0.5 rounded-full"></span>
                                            <span x-show="order.whatsappSent" class="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">WA ✓</span>
                                            <span x-show="order.keteranganPembayaran" class="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full" x-text="order.keteranganPembayaran"></span>
                                        </div>

                                        <div class="bg-gray-50 rounded-xl p-3 space-y-2">
                                            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</p>
                                            <div class="flex gap-2 text-sm">
                                                <span class="text-gray-400 w-20 shrink-0">Nama</span>
                                                <span class="font-medium text-gray-800" x-text="order.namaKontak || '-'"></span>
                                            </div>
                                            <div class="flex gap-2 text-sm" x-show="order.nomorTelepon">
                                                <span class="text-gray-400 w-20 shrink-0">Telepon</span>
                                                <a :href="'tel:' + order.nomorTelepon" class="text-blue-600 hover:underline" x-text="order.nomorTelepon"></a>
                                            </div>
                                            <div class="flex gap-2 text-sm" x-show="order.alamat">
                                                <span class="text-gray-400 w-20 shrink-0">Alamat</span>
                                                <span class="text-gray-700" x-text="order.alamat"></span>
                                            </div>
                                            <div class="flex gap-2 text-sm" x-show="order.patokanLokasi">
                                                <span class="text-gray-400 w-20 shrink-0">Patokan</span>
                                                <span class="text-gray-700" x-text="order.patokanLokasi"></span>
                                            </div>
                                        </div>

                                        <div>
                                            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Produk</p>
                                            <template x-if="Array.isArray(order.namaProduk)">
                                                <div class="space-y-1.5">
                                                    <template x-for="(nama, i) in order.namaProduk" :key="i">
                                                        <div class="bg-gray-50 rounded-xl px-3 py-2.5 flex items-center justify-between">
                                                            <div>
                                                                <p class="text-sm font-medium text-gray-800" x-text="nama"></p>
                                                                <p class="text-xs text-gray-400" x-text="(order.jumlahProduk?.[i]??1) + ' pcs × Rp ' + formatRupiah(order.hargaProduk?.[i]??0)"></p>
                                                            </div>
                                                            <span class="text-sm font-semibold text-gray-700" x-text="'Rp ' + formatRupiah((order.jumlahProduk?.[i]??1)*(order.hargaProduk?.[i]??0))"></span>
                                                        </div>
                                                    </template>
                                                </div>
                                            </template>
                                            <template x-if="!Array.isArray(order.namaProduk)">
                                                <div class="bg-gray-50 rounded-xl px-3 py-2.5 flex items-center justify-between">
                                                    <div>
                                                        <p class="text-sm font-medium text-gray-800" x-text="order.namaProduk || '-'"></p>
                                                        <p class="text-xs text-gray-400" x-text="(order.jumlahProduk??1) + ' pcs × Rp ' + formatRupiah(order.hargaProduk??0)"></p>
                                                    </div>
                                                    <span class="text-sm font-semibold text-gray-700" x-text="'Rp ' + formatRupiah((order.jumlahProduk??1)*(order.hargaProduk??0))"></span>
                                                </div>
                                            </template>
                                        </div>

                                        <div class="bg-gray-50 rounded-xl p-3 space-y-2">
                                            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pengiriman & Pembayaran</p>
                                            <div class="flex gap-2 text-sm" x-show="order.metodePengiriman">
                                                <span class="text-gray-400 w-24 shrink-0">Metode Kirim</span>
                                                <span class="text-gray-700" x-text="order.metodePengiriman"></span>
                                            </div>
                                            <div class="flex gap-2 text-sm" x-show="order.driverName">
                                                <span class="text-gray-400 w-24 shrink-0">Driver</span>
                                                <span class="font-medium text-gray-800" x-text="order.driverName"></span>
                                            </div>
                                            <div class="flex gap-2 text-sm">
                                                <span class="text-gray-400 w-24 shrink-0">Ongkir</span>
                                                <span class="text-gray-700" x-text="'Rp ' + formatRupiah(order.biayaPengiriman??0)"></span>
                                            </div>
                                            <div class="border-t border-gray-200 pt-2 flex justify-between text-sm">
                                                <span class="font-semibold text-gray-700">Total</span>
                                                <span class="font-bold text-blue-700 text-base" x-text="'Rp ' + formatRupiah(order.totalHarga)"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>

            </div>
        </template>
    </div>

    {{-- ======================== SEMUA ORDER VIEW ======================== --}}
    <div x-show="!loading && viewMode === 'list'">

        {{-- Filter: cari + status --}}
        <div class="bg-white rounded-xl border border-gray-100 px-4 py-3 mb-3 flex flex-col sm:flex-row gap-2 items-center">
            <input type="text" x-model="search" placeholder="Cari nama, telepon, produk..."
                class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full">
            <div class="relative w-full sm:w-auto">
                <select x-model="filterStatus"
                    class="w-full sm:w-auto border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white appearance-none">
                    <option value="">Semua Status</option>
                    <option value="Menunggu">Menunggu</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Dikirim">Dikirim</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                </select>
                <div class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                    <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
            </div>
            <button @click="search=''; filterStatus=''; filterSalesName=''"
                class="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 shrink-0 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                Reset
            </button>
        </div>

        {{-- Filter: sales person --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
            <label class="text-sm font-medium text-gray-700 block mb-2">Filter Sales Person</label>
            <div class="flex gap-2 items-center">
                <div class="relative flex-1">
                    <select x-model="filterSalesName"
                        class="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white appearance-none">
                        <option value="">-- Semua Sales --</option>
                        <template x-for="s in salesNames" :key="s">
                            <option :value="s" x-text="s"></option>
                        </template>
                    </select>
                    <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
                {{-- Badge sales terpilih --}}
                <div x-show="filterSalesName"
                    class="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2.5 shrink-0">
                    <div class="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                        <span class="text-white font-bold text-xs" x-text="(filterSalesName||'').charAt(0)"></span>
                    </div>
                    <span class="text-sm font-semibold text-indigo-700 capitalize" x-text="filterSalesName"></span>
                    <button @click="filterSalesName=''" class="text-indigo-300 hover:text-indigo-600 transition-colors ml-1">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
            </div>
            {{-- Jumlah hasil filter --}}
            <p class="text-xs text-gray-400 mt-2"
                x-text="filterSalesName ? filteredOrders.length + ' order ditemukan untuk ' + filterSalesName : filteredOrders.length + ' total order'">
            </p>
        </div>

        {{-- Empty --}}
        <div x-show="filteredOrders.length === 0" class="bg-white rounded-2xl border border-gray-100 text-center py-16">
            <svg class="w-10 h-10 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            <p class="text-gray-400 text-sm">Belum ada pesanan</p>
            <a href="/po-form" class="mt-4 inline-block bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700">Buat Order Pertama</a>
        </div>

        {{-- Order list --}}
        <div class="space-y-2.5">
            <template x-for="order in filteredOrders" :key="order.orderId">
                <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden" x-data="{ open: false }">

                    <div @click="open = !open" class="px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors select-none">
                        <div class="flex items-center justify-between gap-3">
                            <div class="flex items-center gap-2 min-w-0 flex-1">
                                <span class="shrink-0 text-xs px-2 py-0.5 rounded-full font-semibold"
                                    :class="{
                                        'bg-yellow-100 text-yellow-700': !order.statusPengiriman || order.statusPengiriman==='Menunggu'||order.statusPengiriman==='Baru',
                                        'bg-blue-100 text-blue-700': order.statusPengiriman==='Diproses',
                                        'bg-orange-100 text-orange-700': order.statusPengiriman==='Dikirim',
                                        'bg-green-100 text-green-700': order.statusPengiriman==='Selesai',
                                        'bg-red-100 text-red-700': order.statusPengiriman==='Dibatalkan',
                                    }"
                                    x-text="order.statusPengiriman || 'Menunggu'">
                                </span>
                                <span class="font-semibold text-gray-800 text-sm truncate" x-text="order.namaKontak || '-'"></span>
                                <span x-show="order.salesPerson"
                                    class="shrink-0 text-xs bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full capitalize font-medium"
                                    x-text="order.salesPerson"></span>
                            </div>
                            <div class="flex items-center gap-3 shrink-0">
                                <div class="text-right">
                                    <p class="text-sm font-bold text-blue-700" x-text="'Rp ' + formatRupiah(order.totalHarga)"></p>
                                    <p class="text-xs text-gray-400" x-text="formatTanggal(order.createdAt)"></p>
                                </div>
                                <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="open ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                            </div>
                        </div>
                        <p class="text-xs text-gray-400 mt-1 truncate"
                            x-text="(Array.isArray(order.namaProduk) ? order.namaProduk.join(', ') : (order.namaProduk||'')) + ' • ' + (order.metodePembayaran||'Cash')">
                        </p>
                    </div>

                    <div x-show="open" x-collapse class="border-t border-gray-100">
                        <div class="px-4 py-4 space-y-4">
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded" x-text="'#' + (order.orderId||'').slice(-8).toUpperCase()"></span>
                                <span x-text="order.metodePembayaran || 'CASH'"
                                    :class="(order.metodePembayaran||'').toLowerCase().includes('cash') ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'"
                                    class="text-xs font-semibold px-2 py-0.5 rounded-full"></span>
                                <span x-show="order.whatsappSent" class="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">WA ✓</span>
                                <span x-show="order.salesPerson" class="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full capitalize font-medium" x-text="order.salesPerson"></span>
                                <span x-show="order.keteranganPembayaran" class="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full" x-text="order.keteranganPembayaran"></span>
                            </div>

                            <div class="bg-gray-50 rounded-xl p-3 space-y-2">
                                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</p>
                                <div class="flex gap-2 text-sm">
                                    <span class="text-gray-400 w-20 shrink-0">Nama</span>
                                    <span class="font-medium text-gray-800" x-text="order.namaKontak || '-'"></span>
                                </div>
                                <div class="flex gap-2 text-sm" x-show="order.nomorTelepon">
                                    <span class="text-gray-400 w-20 shrink-0">Telepon</span>
                                    <a :href="'tel:' + order.nomorTelepon" class="text-blue-600 hover:underline" x-text="order.nomorTelepon"></a>
                                </div>
                                <div class="flex gap-2 text-sm" x-show="order.alamat">
                                    <span class="text-gray-400 w-20 shrink-0">Alamat</span>
                                    <span class="text-gray-700" x-text="order.alamat"></span>
                                </div>
                                <div class="flex gap-2 text-sm" x-show="order.patokanLokasi">
                                    <span class="text-gray-400 w-20 shrink-0">Patokan</span>
                                    <span class="text-gray-700" x-text="order.patokanLokasi"></span>
                                </div>
                            </div>

                            <div>
                                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Produk</p>
                                <template x-if="Array.isArray(order.namaProduk)">
                                    <div class="space-y-1.5">
                                        <template x-for="(nama, i) in order.namaProduk" :key="i">
                                            <div class="bg-gray-50 rounded-xl px-3 py-2.5 flex items-center justify-between">
                                                <div>
                                                    <p class="text-sm font-medium text-gray-800" x-text="nama"></p>
                                                    <p class="text-xs text-gray-400" x-text="(order.jumlahProduk?.[i]??1) + ' pcs × Rp ' + formatRupiah(order.hargaProduk?.[i]??0)"></p>
                                                </div>
                                                <span class="text-sm font-semibold text-gray-700" x-text="'Rp ' + formatRupiah((order.jumlahProduk?.[i]??1)*(order.hargaProduk?.[i]??0))"></span>
                                            </div>
                                        </template>
                                    </div>
                                </template>
                                <template x-if="!Array.isArray(order.namaProduk)">
                                    <div class="bg-gray-50 rounded-xl px-3 py-2.5 flex items-center justify-between">
                                        <div>
                                            <p class="text-sm font-medium text-gray-800" x-text="order.namaProduk || '-'"></p>
                                            <p class="text-xs text-gray-400" x-text="(order.jumlahProduk??1) + ' pcs × Rp ' + formatRupiah(order.hargaProduk??0)"></p>
                                        </div>
                                        <span class="text-sm font-semibold text-gray-700" x-text="'Rp ' + formatRupiah((order.jumlahProduk??1)*(order.hargaProduk??0))"></span>
                                    </div>
                                </template>
                            </div>

                            <div class="bg-gray-50 rounded-xl p-3 space-y-2">
                                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pengiriman & Pembayaran</p>
                                <div class="flex gap-2 text-sm" x-show="order.metodePengiriman">
                                    <span class="text-gray-400 w-24 shrink-0">Metode Kirim</span>
                                    <span class="text-gray-700" x-text="order.metodePengiriman"></span>
                                </div>
                                <div class="flex gap-2 text-sm" x-show="order.driverName">
                                    <span class="text-gray-400 w-24 shrink-0">Driver</span>
                                    <span class="font-medium text-gray-800" x-text="order.driverName"></span>
                                </div>
                                <div class="flex gap-2 text-sm">
                                    <span class="text-gray-400 w-24 shrink-0">Ongkir</span>
                                    <span class="text-gray-700" x-text="'Rp ' + formatRupiah(order.biayaPengiriman??0)"></span>
                                </div>
                                <div class="border-t border-gray-200 pt-2 flex justify-between text-sm">
                                    <span class="font-semibold text-gray-700">Total</span>
                                    <span class="font-bold text-blue-700 text-base" x-text="'Rp ' + formatRupiah(order.totalHarga)"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>

</div>

@push('scripts')
<script>
function salesDashApp() {
    return {
        loading: false,
        orders: [],
        viewMode: 'sales',

        // List mode filters
        search: '',
        filterStatus: '',
        filterSalesName: '',

        // Sales mode
        selectedSales: '',

        // --- Computed: list of unique sales names for filter dropdown ---
        get salesNames() {
            const names = [...new Set(this.orders.map(o => o.salesPerson).filter(Boolean))];
            return names.sort();
        },

        // --- Computed: filtered orders for list mode ---
        get filteredOrders() {
            return this.orders.filter(o => {
                const q = this.search.toLowerCase().trim();
                const matchSearch = !q ||
                    (o.namaKontak||'').toLowerCase().includes(q) ||
                    (o.nomorTelepon||'').includes(q) ||
                    (Array.isArray(o.namaProduk) ? o.namaProduk.join(' ') : (o.namaProduk||'')).toLowerCase().includes(q) ||
                    (o.salesPerson||'').toLowerCase().includes(q);
                const matchStatus = !this.filterStatus || (o.statusPengiriman||'Menunggu') === this.filterStatus;
                const matchSales  = !this.filterSalesName || (o.salesPerson||'') === this.filterSalesName;
                return matchSearch && matchStatus && matchSales;
            });
        },

        // --- Computed: grouped by sales for per-sales mode ---
        get groupedBySales() {
            const map = {};
            for (const order of this.orders) {
                const sales = (order.salesPerson || 'Tidak Diketahui').toUpperCase();
                if (!map[sales]) {
                    map[sales] = { sales, orders: [], totalRevenue: 0, totalOrders: 0, totalUnits: 0, brands: {} };
                }
                map[sales].orders.push(order);
                map[sales].totalOrders++;
                map[sales].totalRevenue += order.totalHarga || 0;

                const names  = Array.isArray(order.namaProduk)  ? order.namaProduk  : [order.namaProduk  || ''];
                const qtys   = Array.isArray(order.jumlahProduk) ? order.jumlahProduk : [order.jumlahProduk ?? 1];
                const prices = Array.isArray(order.hargaProduk)  ? order.hargaProduk  : [order.hargaProduk  ?? 0];

                names.forEach((nama, i) => {
                    const brand = this.extractBrand(nama);
                    const qty   = Number(qtys[i] ?? 1);
                    const price = Number(prices[i] ?? 0);
                    if (!map[sales].brands[brand]) {
                        map[sales].brands[brand] = { brand, units: 0, revenue: 0 };
                    }
                    map[sales].brands[brand].units   += qty;
                    map[sales].brands[brand].revenue += qty * price;
                    map[sales].totalUnits += qty;
                });
            }

            return Object.values(map)
                .sort((a, b) => b.totalRevenue - a.totalRevenue)
                .map(s => ({
                    ...s,
                    brands: Object.values(s.brands).sort((a, b) => b.revenue - a.revenue),
                }));
        },

        // --- Computed: data sales yang dipilih di dropdown ---
        get selectedGroup() {
            if (!this.selectedSales) return null;
            return this.groupedBySales.find(g => g.sales === this.selectedSales) || null;
        },

        // --- Extract brand = first word of product name ---
        extractBrand(nama) {
            if (!nama) return 'Lainnya';
            return nama.trim().split(/\s+/)[0].toUpperCase();
        },

        // --- Deterministic color per brand ---
        brandColor(brand) {
            const colors = [
                '#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6',
                '#06B6D4','#F97316','#84CC16','#EC4899','#6B7280',
            ];
            let hash = 0;
            for (let i = 0; i < brand.length; i++) hash = brand.charCodeAt(i) + ((hash << 5) - hash);
            return colors[Math.abs(hash) % colors.length];
        },

        async init() {
            await this.loadOrders();
        },

        async loadOrders() {
            this.loading = true;
            try {
                const res  = await fetch('/api/orders');
                const data = await res.json();
                this.orders = Array.isArray(data) ? data : [];
            } catch(e) {
                this.orders = [];
            } finally {
                this.loading = false;
            }
        },

        formatRupiah(n) { return Number(n || 0).toLocaleString('id-ID'); },

        formatTanggal(dt) {
            if (!dt) return '';
            const d = new Date(dt);
            return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        },
    }
}
</script>
@endpush
@endsection
