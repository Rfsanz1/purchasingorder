@extends('layouts.erp')
@section('title', 'Laporan Penjualan')
@section('content')
<div x-data="reportSalesApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Laporan Penjualan</h1><p class="text-gray-500 mt-1">Analisis performa penjualan tim sales</p></div>
        <div class="flex gap-2">
            <input x-model="from" @change="load()" type="date" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <input x-model="to" @change="load()" type="date" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <button @click="load()" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Tampilkan</button>
        </div>
    </div>
    <div x-show="loading" class="flex justify-center py-16"><div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
    <div x-show="!loading" class="space-y-6">
        <!-- Summary -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white rounded-xl border p-5">
                <p class="text-sm text-gray-500 mb-1">Total Revenue</p>
                <p class="text-2xl font-bold text-green-600" x-text="formatCurrency(data.summary?.total_revenue||0)"></p>
            </div>
            <div class="bg-white rounded-xl border p-5">
                <p class="text-sm text-gray-500 mb-1">Total Order</p>
                <p class="text-2xl font-bold text-blue-600" x-text="Number(data.summary?.total_order||0).toLocaleString('id-ID')"></p>
            </div>
            <div class="bg-white rounded-xl border p-5">
                <p class="text-sm text-gray-500 mb-1">Rata-rata per Order</p>
                <p class="text-2xl font-bold text-purple-600" x-text="formatCurrency(data.summary?.avg_order||0)"></p>
            </div>
        </div>
        <!-- By Status -->
        <div class="bg-white rounded-xl border p-5">
            <h3 class="font-semibold text-gray-900 mb-4">Status Order</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <template x-for="s in (data.by_status||[])" :key="s.status">
                    <div class="bg-gray-50 rounded-lg p-3 text-center">
                        <p class="text-xs text-gray-500" x-text="s.status||'Lainnya'"></p>
                        <p class="text-xl font-bold text-gray-800" x-text="s.total"></p>
                    </div>
                </template>
            </div>
        </div>
        <!-- Top Sales -->
        <div class="bg-white rounded-xl border p-5">
            <h3 class="font-semibold text-gray-900 mb-4">Performa Sales</h3>
            <div x-show="(data.top_sales||[]).length===0" class="text-center text-gray-400 py-6">Tidak ada data sales ditemukan untuk periode ini</div>
            <div x-show="(data.top_sales||[]).length>0" class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead class="bg-gray-50"><tr>
                        <th class="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Nama Sales</th>
                        <th class="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Order</th>
                        <th class="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                    </tr></thead>
                    <tbody class="divide-y">
                        <template x-for="(s,i) in (data.top_sales||[])" :key="i">
                            <tr class="hover:bg-gray-50">
                                <td class="px-4 py-2 font-medium text-gray-900" x-text="s.nama_sales||'-'"></td>
                                <td class="px-4 py-2 text-right text-gray-700" x-text="s.total_order"></td>
                                <td class="px-4 py-2 text-right font-semibold text-green-700" x-text="formatCurrency(s.total_revenue)"></td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<script>
function reportSalesApp() {
    return {
        data:{}, loading:false,
        from:new Date(new Date().getFullYear(),new Date().getMonth(),1).toISOString().slice(0,10),
        to:new Date().toISOString().slice(0,10),
        async init() { await this.load(); },
        async load() { this.loading=true; try { this.data=await fetch(`/api/erp/report/sales?from=${this.from}&to=${this.to}`).then(r=>r.json()); } finally { this.loading=false; } },
        formatCurrency(v){return'Rp '+Number(v||0).toLocaleString('id-ID');},
    };
}
</script>
@endsection
