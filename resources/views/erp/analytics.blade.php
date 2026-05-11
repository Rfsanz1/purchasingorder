@extends('layouts.erp')
@section('title', 'Analytics Dashboard')
@section('content')
<div x-data="analyticsApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p class="text-gray-500 mt-1">Overview performa bisnis secara real-time</p>
        </div>
        <div class="flex gap-2">
            <input x-model="from" @change="load()" type="date" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <input x-model="to" @change="load()" type="date" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <button @click="load()" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Refresh</button>
        </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4">
            <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <span class="text-xs text-gray-500">Pendapatan</span>
            </div>
            <p class="text-xl font-bold text-gray-900" x-text="formatCurrency(data.revenue||0)"></p>
        </div>
        <div class="bg-white rounded-xl border p-4">
            <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <span class="text-xs text-gray-500">Laba Bersih</span>
            </div>
            <p class="text-xl font-bold" :class="(data.profit||0)>=0?'text-green-600':'text-red-600'" x-text="formatCurrency(data.profit||0)"></p>
        </div>
        <div class="bg-white rounded-xl border p-4">
            <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                </div>
                <span class="text-xs text-gray-500">Total Order</span>
            </div>
            <p class="text-xl font-bold text-purple-600" x-text="(data.orders||0).toLocaleString('id-ID')"></p>
        </div>
        <div class="bg-white rounded-xl border p-4">
            <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                </div>
                <span class="text-xs text-gray-500">Saldo Kas</span>
            </div>
            <p class="text-xl font-bold" :class="(data.saldo_kas||0)>=0?'text-orange-600':'text-red-600'" x-text="formatCurrency(data.saldo_kas||0)"></p>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Revenue Chart (simple table) -->
        <div class="bg-white rounded-xl border p-5">
            <h3 class="font-semibold text-gray-900 mb-4">Tren Pendapatan Harian</h3>
            <div x-show="loading" class="flex justify-center py-8"><div class="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
            <div x-show="!loading">
                <div x-show="(data.daily_revenue||[]).length === 0" class="text-center text-gray-400 py-8">Belum ada data periode ini</div>
                <div x-show="(data.daily_revenue||[]).length > 0" class="space-y-2 max-h-64 overflow-y-auto">
                    <template x-for="d in (data.daily_revenue||[])" :key="d.date">
                        <div class="flex items-center gap-3">
                            <span class="text-xs text-gray-500 w-20 shrink-0" x-text="d.date"></span>
                            <div class="flex-1 bg-gray-100 rounded-full h-2">
                                <div class="bg-blue-500 h-2 rounded-full" :style="`width:${maxRevenue > 0 ? (d.revenue/maxRevenue*100) : 0}%`"></div>
                            </div>
                            <span class="text-xs font-medium text-gray-700 w-28 text-right" x-text="formatCurrency(d.revenue)"></span>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <!-- Top Products -->
        <div class="bg-white rounded-xl border p-5">
            <h3 class="font-semibold text-gray-900 mb-4">Produk Terlaris</h3>
            <div x-show="loading" class="flex justify-center py-8"><div class="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
            <div x-show="!loading">
                <div x-show="(data.top_products||[]).length===0" class="text-center text-gray-400 py-8">Belum ada data</div>
                <div x-show="(data.top_products||[]).length>0" class="space-y-3">
                    <template x-for="(p, i) in (data.top_products||[]).slice(0,8)" :key="i">
                        <div class="flex items-center gap-3">
                            <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0" x-text="i+1"></span>
                            <span class="text-sm text-gray-700 flex-1 truncate" x-text="p.nama_produk"></span>
                            <span class="text-xs font-semibold text-gray-900" x-text="formatCurrency(p.total_revenue)"></span>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>

    <!-- Finance Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-xl border p-5">
            <h4 class="text-sm font-semibold text-gray-700 mb-3">Kas Masuk</h4>
            <p class="text-2xl font-bold text-green-600" x-text="formatCurrency(data.cash_in||0)"></p>
        </div>
        <div class="bg-white rounded-xl border p-5">
            <h4 class="text-sm font-semibold text-gray-700 mb-3">Kas Keluar</h4>
            <p class="text-2xl font-bold text-red-500" x-text="formatCurrency(data.cash_out||0)"></p>
        </div>
        <div class="bg-white rounded-xl border p-5">
            <h4 class="text-sm font-semibold text-gray-700 mb-3">Total Pengeluaran</h4>
            <p class="text-2xl font-bold text-orange-600" x-text="formatCurrency(data.expenses||0)"></p>
        </div>
    </div>
</div>
<script>
function analyticsApp() {
    return {
        data: {}, loading: true,
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10),
        to: new Date().toISOString().slice(0,10),
        get maxRevenue() { return Math.max(...(this.data.daily_revenue||[]).map(d=>d.revenue||0), 1); },
        async init() { await this.load(); },
        async load() {
            this.loading = true;
            try {
                const p = new URLSearchParams({ from: this.from, to: this.to });
                this.data = await fetch('/api/erp/analytics/summary?' + p).then(r => r.json());
            } finally { this.loading = false; }
        },
        formatCurrency(v) { return 'Rp ' + Number(v||0).toLocaleString('id-ID'); },
    };
}
</script>
@endsection
