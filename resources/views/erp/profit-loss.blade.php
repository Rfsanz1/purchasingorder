@extends('layouts.erp')
@section('title', 'Laba Rugi')
@section('content')
<div x-data="plApp()" x-init="init()" class="p-4 md:p-6 max-w-5xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">Laporan Laba Rugi</h1>
            <p class="text-gray-500 mt-1">Ringkasan pendapatan dan pengeluaran perusahaan</p>
        </div>
        <div class="flex gap-2">
            <input x-model="from" @change="load()" type="date" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <input x-model="to" @change="load()" type="date" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <button @click="load()" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Tampilkan</button>
        </div>
    </div>

    <div x-show="loading" class="flex justify-center py-16"><div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>

    <div x-show="!loading" class="space-y-4">
        <!-- Pendapatan -->
        <div class="bg-white rounded-xl border overflow-hidden">
            <div class="bg-green-50 px-6 py-3 border-b border-green-100">
                <h3 class="font-semibold text-green-800">PENDAPATAN</h3>
            </div>
            <div class="p-6">
                <div class="flex justify-between items-center py-2 border-b">
                    <span class="text-gray-700">Penjualan Bersih</span>
                    <span class="font-semibold text-green-700" x-text="formatCurrency(data.pendapatan||0)"></span>
                </div>
                <div class="flex justify-between items-center py-2 font-bold text-green-700 mt-2">
                    <span>Total Pendapatan</span>
                    <span x-text="formatCurrency(data.pendapatan||0)"></span>
                </div>
            </div>
        </div>

        <!-- HPP -->
        <div class="bg-white rounded-xl border overflow-hidden">
            <div class="bg-orange-50 px-6 py-3 border-b border-orange-100">
                <h3 class="font-semibold text-orange-800">HARGA POKOK PENJUALAN (HPP)</h3>
            </div>
            <div class="p-6">
                <div class="flex justify-between items-center py-2 border-b">
                    <span class="text-gray-700">HPP Produk</span>
                    <span class="font-semibold text-orange-700" x-text="formatCurrency(data.hpp||0)"></span>
                </div>
                <div class="flex justify-between items-center py-2 mt-2 font-bold bg-orange-50 px-3 rounded-lg">
                    <span class="text-orange-800">Laba Kotor</span>
                    <span :class="(data.laba_kotor||0)>=0?'text-green-700':'text-red-600'" x-text="formatCurrency(data.laba_kotor||0)"></span>
                </div>
            </div>
        </div>

        <!-- Biaya Operasional -->
        <div class="bg-white rounded-xl border overflow-hidden">
            <div class="bg-red-50 px-6 py-3 border-b border-red-100">
                <h3 class="font-semibold text-red-800">BIAYA OPERASIONAL</h3>
            </div>
            <div class="p-6">
                <template x-for="b in (data.detail_biaya||[])" :key="b.kategori">
                    <div class="flex justify-between items-center py-2 border-b last:border-0">
                        <span class="text-gray-700" x-text="b.kategori || 'Lainnya'"></span>
                        <span class="font-medium text-red-600" x-text="formatCurrency(b.total||0)"></span>
                    </div>
                </template>
                <div x-show="(data.detail_biaya||[]).length===0" class="text-gray-400 text-sm py-2">Belum ada pengeluaran</div>
                <div class="flex justify-between items-center py-2 mt-2 font-bold">
                    <span class="text-gray-800">Total Biaya Operasional</span>
                    <span class="text-red-600" x-text="formatCurrency(data.biaya_operasional||0)"></span>
                </div>
            </div>
        </div>

        <!-- Laba Bersih -->
        <div class="rounded-xl border-2 overflow-hidden" :class="(data.laba_bersih||0)>=0?'border-green-300 bg-green-50':'border-red-300 bg-red-50'">
            <div class="px-6 py-5 flex justify-between items-center">
                <div>
                    <h3 class="text-lg font-bold" :class="(data.laba_bersih||0)>=0?'text-green-800':'text-red-800'">LABA BERSIH</h3>
                    <p class="text-sm" :class="(data.laba_bersih||0)>=0?'text-green-600':'text-red-600'" x-text="`Margin: ${(data.margin_bersih||0).toFixed(1)}%`"></p>
                </div>
                <span class="text-3xl font-bold" :class="(data.laba_bersih||0)>=0?'text-green-700':'text-red-700'" x-text="formatCurrency(data.laba_bersih||0)"></span>
            </div>
        </div>
    </div>
</div>
<script>
function plApp() {
    return {
        data: {}, loading: false,
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10),
        to: new Date().toISOString().slice(0,10),
        async init() { await this.load(); },
        async load() {
            this.loading = true;
            try { this.data = await fetch(`/api/erp/profit-loss?from=${this.from}&to=${this.to}`).then(r=>r.json()); }
            finally { this.loading = false; }
        },
        formatCurrency(v) { return 'Rp ' + Number(v||0).toLocaleString('id-ID'); },
    };
}
</script>
@endsection
