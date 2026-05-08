@extends('layouts.erp')
@section('title', 'Produk & Harga')

@section('content')
<div x-data="produkApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">

    {{-- Header --}}
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-xl font-bold text-gray-900">Produk & Harga Kledo</h1>
            <p class="text-sm text-gray-400 mt-0.5">Daftar produk beserta harga dari Kledo ERP</p>
        </div>
        <button @click="currentPage=1; load()" :disabled="loading"
            class="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition">
            <svg class="w-4 h-4" :class="loading && 'animate-spin'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span x-text="loading ? 'Memuat...' : 'Refresh'"></span>
        </button>
    </div>

    {{-- Filter & Search --}}
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
        <div class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1">
                <input type="text" x-model="search" @input.debounce.500ms="currentPage=1; load()"
                    placeholder="Cari nama produk atau SKU..."
                    class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            </div>
        </div>
    </div>

    {{-- Summary Cards --}}
    <div class="grid grid-cols-3 gap-3 mb-5">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p class="text-xs text-gray-400 mb-1">Total Produk</p>
            <p class="text-2xl font-bold text-gray-900" x-text="total.toLocaleString('id-ID')"></p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p class="text-xs text-gray-400 mb-1">Ditampilkan</p>
            <p class="text-2xl font-bold text-blue-600" x-text="products.length"></p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p class="text-xs text-gray-400 mb-1">SPM Brand</p>
            <p class="text-2xl font-bold text-purple-600" x-text="products.filter(p => p.isSpm).length"></p>
        </div>
    </div>

    {{-- Error --}}
    <div x-show="error" x-cloak class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-sm text-red-700" x-text="error"></div>

    {{-- Table --}}
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="bg-gray-50 border-b border-gray-100">
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-8">#</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama Produk</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">SKU</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Brand</th>
                        <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Harga Kledo</th>
                        <th class="text-right px-4 py-3 text-xs font-semibold text-green-600 uppercase tracking-wide">Harga Jual +15%</th>
                        <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">HPP</th>
                    </tr>
                </thead>
                <tbody>
                    <template x-if="loading && products.length === 0">
                        <tr>
                            <td colspan="7" class="px-4 py-16 text-center text-gray-400">
                                <svg class="w-7 h-7 animate-spin mx-auto mb-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                </svg>
                                Memuat produk dari Kledo...
                            </td>
                        </tr>
                    </template>
                    <template x-if="!loading && products.length === 0">
                        <tr>
                            <td colspan="7" class="px-4 py-16 text-center text-gray-400">Tidak ada produk ditemukan</td>
                        </tr>
                    </template>
                    <template x-for="(p, i) in products" :key="p.kledoId">
                        <tr class="border-b border-gray-50 hover:bg-blue-50/30 transition">
                            <td class="px-4 py-3 text-gray-300 text-xs" x-text="((currentPage-1)*50)+i+1"></td>
                            <td class="px-4 py-3">
                                <div class="font-medium text-gray-900" x-text="p.nama"></div>
                                <span x-show="p.isSpm" class="inline-block text-xs text-purple-600 font-semibold bg-purple-50 px-1.5 py-0.5 rounded mt-0.5">SPM</span>
                            </td>
                            <td class="px-4 py-3 text-gray-500 font-mono text-xs" x-text="p.sku || '-'"></td>
                            <td class="px-4 py-3">
                                <span x-show="p.brand" class="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full capitalize" x-text="p.brand"></span>
                                <span x-show="!p.brand" class="text-gray-300 text-xs">-</span>
                            </td>
                            <td class="px-4 py-3 text-right font-medium text-gray-700" x-text="p.hargaAsli > 0 ? formatRp(p.hargaAsli) : '-'"></td>
                            <td class="px-4 py-3 text-right font-bold text-green-700" x-text="p.harga > 0 ? formatRp(p.harga) : '-'"></td>
                            <td class="px-4 py-3 text-right text-gray-500" x-text="p.hpp > 0 ? formatRp(p.hpp) : '-'"></td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        {{-- Pagination --}}
        <div x-show="lastPage > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p class="text-xs text-gray-400">Halaman <span x-text="currentPage"></span> dari <span x-text="lastPage"></span> &bull; Total <span x-text="total.toLocaleString('id-ID')"></span> produk</p>
            <div class="flex gap-2">
                <button @click="prevPage()" :disabled="currentPage <= 1 || loading"
                    class="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-40 transition">
                    ← Sebelumnya
                </button>
                <button @click="nextPage()" :disabled="currentPage >= lastPage || loading"
                    class="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 transition">
                    Selanjutnya →
                </button>
            </div>
        </div>
    </div>
</div>

<script>
function produkApp() {
    return {
        products: [],
        search: '',
        loading: false,
        error: '',
        total: 0,
        currentPage: 1,
        lastPage: 1,

        async init() {
            await this.load();
        },

        async load() {
            this.loading = true;
            this.error = '';
            try {
                const params = new URLSearchParams({
                    page: this.currentPage,
                    per_page: 50,
                    search: this.search,
                });

                const res = await fetch('/api/kledo/products?' + params);
                const data = await res.json();

                if (data.error) {
                    this.error = 'Gagal memuat: ' + data.error;
                    return;
                }

                this.products = data.products || [];
                this.total    = data.total || 0;
                this.currentPage = data.currentPage || 1;
                this.lastPage    = data.lastPage || 1;
            } catch (e) {
                this.error = 'Koneksi ke server gagal: ' + e.message;
            } finally {
                this.loading = false;
            }
        },

        async prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                await this.load();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },

        async nextPage() {
            if (this.currentPage < this.lastPage) {
                this.currentPage++;
                await this.load();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },

        formatRp(val) {
            if (!val || val === 0) return '-';
            return 'Rp\u00a0' + Number(val).toLocaleString('id-ID');
        },
    }
}
</script>
@endsection
