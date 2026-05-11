@extends('layouts.erp')
@section('title', 'Laporan Keuangan')
@section('content')
<div x-data="reportFinanceApp()" x-init="init()" class="p-4 md:p-6 max-w-5xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Laporan Keuangan</h1><p class="text-gray-500 mt-1">Ringkasan keuangan perusahaan</p></div>
        <div class="flex gap-2">
            <input x-model="from" @change="load()" type="date" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <input x-model="to" @change="load()" type="date" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <button @click="load()" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Tampilkan</button>
        </div>
    </div>
    <div x-show="loading" class="flex justify-center py-16"><div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
    <div x-show="!loading" class="space-y-4">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div class="bg-green-50 border border-green-100 rounded-xl p-5">
                <p class="text-xs text-green-700 mb-1">Pendapatan</p>
                <p class="text-xl font-bold text-green-700" x-text="formatCurrency(data.pendapatan||0)"></p>
            </div>
            <div class="bg-red-50 border border-red-100 rounded-xl p-5">
                <p class="text-xs text-red-700 mb-1">Beban Operasional</p>
                <p class="text-xl font-bold text-red-600" x-text="formatCurrency(data.beban_operasional||0)"></p>
            </div>
            <div class="rounded-xl border-2 p-5" :class="(data.laba_bersih||0)>=0?'border-green-300 bg-green-50':'border-red-300 bg-red-50'">
                <p class="text-xs mb-1" :class="(data.laba_bersih||0)>=0?'text-green-700':'text-red-700'">Laba Bersih</p>
                <p class="text-xl font-bold" :class="(data.laba_bersih||0)>=0?'text-green-700':'text-red-600'" x-text="formatCurrency(data.laba_bersih||0)"></p>
            </div>
            <div class="bg-blue-50 border border-blue-100 rounded-xl p-5">
                <p class="text-xs text-blue-700 mb-1">Kas Masuk</p>
                <p class="text-xl font-bold text-blue-700" x-text="formatCurrency(data.kas_masuk||0)"></p>
            </div>
            <div class="bg-orange-50 border border-orange-100 rounded-xl p-5">
                <p class="text-xs text-orange-700 mb-1">Kas Keluar</p>
                <p class="text-xl font-bold text-orange-600" x-text="formatCurrency(data.kas_keluar||0)"></p>
            </div>
            <div class="bg-purple-50 border border-purple-100 rounded-xl p-5">
                <p class="text-xs text-purple-700 mb-1">Total Pembelian</p>
                <p class="text-xl font-bold text-purple-700" x-text="formatCurrency(data.total_pembelian||0)"></p>
            </div>
        </div>
        <!-- Rincian Biaya -->
        <div class="bg-white rounded-xl border p-5">
            <h3 class="font-semibold text-gray-900 mb-4">Rincian Pengeluaran</h3>
            <div x-show="(data.detail_biaya||[]).length===0" class="text-center text-gray-400 py-6">Tidak ada pengeluaran tercatat</div>
            <div x-show="(data.detail_biaya||[]).length>0" class="space-y-2">
                <template x-for="b in (data.detail_biaya||[])" :key="b.kategori">
                    <div class="flex items-center justify-between py-2 border-b last:border-0">
                        <span class="text-gray-700" x-text="b.kategori||'Lainnya'"></span>
                        <span class="font-semibold text-red-600" x-text="formatCurrency(b.total)"></span>
                    </div>
                </template>
            </div>
        </div>
    </div>
</div>
<script>
function reportFinanceApp() {
    return {
        data:{}, loading:false,
        from:new Date(new Date().getFullYear(),new Date().getMonth(),1).toISOString().slice(0,10),
        to:new Date().toISOString().slice(0,10),
        async init(){await this.load();},
        async load(){this.loading=true;try{this.data=await fetch(`/api/erp/report/finance?from=${this.from}&to=${this.to}`).then(r=>r.json());}finally{this.loading=false;}},
        formatCurrency(v){return'Rp '+Number(v||0).toLocaleString('id-ID');},
    };
}
</script>
@endsection
