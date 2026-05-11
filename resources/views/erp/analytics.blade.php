@extends('layouts.erp')
@section('title', 'Analytics Dashboard')
@section('content')
<div x-data="analyticsApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
<<<<<<< HEAD
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
=======
        <div><h1 class="text-2xl font-bold text-gray-900">Analytics Dashboard</h1><p class="text-gray-500 mt-1 text-sm">Analitik komprehensif performa bisnis Gentong Mas</p></div>
        <div class="flex gap-2">
            <select x-model="period" @change="loadData()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option value="7">7 Hari Terakhir</option>
                <option value="30">30 Hari Terakhir</option>
                <option value="90">3 Bulan Terakhir</option>
                <option value="365">1 Tahun Terakhir</option>
            </select>
            <button @click="loadData()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">↻ Refresh</button>
        </div>
    </div>

    {{-- KPI Cards --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4 shadow-sm">
            <div class="flex items-center justify-between mb-2">
                <p class="text-xs text-gray-500 font-medium">Total Omzet</p>
                <span class="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+12.5%</span>
            </div>
            <p class="text-xl font-bold text-gray-900" x-text="formatRp(kpi.omzet)"></p>
            <p class="text-xs text-gray-400 mt-1">vs periode sebelumnya</p>
        </div>
        <div class="bg-white rounded-xl border p-4 shadow-sm">
            <div class="flex items-center justify-between mb-2">
                <p class="text-xs text-gray-500 font-medium">Total Order</p>
                <span class="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+8.3%</span>
            </div>
            <p class="text-2xl font-bold text-gray-900" x-text="kpi.orders"></p>
            <p class="text-xs text-gray-400 mt-1">transaksi berhasil</p>
        </div>
        <div class="bg-white rounded-xl border p-4 shadow-sm">
            <div class="flex items-center justify-between mb-2">
                <p class="text-xs text-gray-500 font-medium">Avg. Order Value</p>
                <span class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">+3.1%</span>
            </div>
            <p class="text-xl font-bold text-gray-900" x-text="formatRp(kpi.avgOrder)"></p>
            <p class="text-xs text-gray-400 mt-1">rata-rata per transaksi</p>
        </div>
        <div class="bg-white rounded-xl border p-4 shadow-sm">
            <div class="flex items-center justify-between mb-2">
                <p class="text-xs text-gray-500 font-medium">Gross Profit</p>
                <span class="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+5.7%</span>
            </div>
            <p class="text-xl font-bold text-green-600" x-text="formatRp(kpi.profit)"></p>
            <p class="text-xs text-gray-400 mt-1">margin <span x-text="kpi.margin+'%'"></span></p>
        </div>
    </div>

    {{-- Charts Row --}}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {{-- Sales Trend --}}
        <div class="lg:col-span-2 bg-white rounded-xl border shadow-sm p-5">
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-gray-900">Tren Penjualan</h3>
                <span class="text-xs text-gray-400" x-text="period+' hari terakhir'"></span>
            </div>
            <div class="flex items-end gap-1 h-40">
                <template x-for="(bar, idx) in chartBars" :key="idx">
                    <div class="flex-1 flex flex-col items-center gap-1">
                        <div class="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer" :style="'height:'+(bar.pct*100)+'%'" :title="formatRp(bar.val)"></div>
                        <span class="text-xs text-gray-400 truncate w-full text-center" x-text="bar.label" style="font-size:9px"></span>
                    </div>
                </template>
            </div>
        </div>

        {{-- Top Divisi --}}
        <div class="bg-white rounded-xl border shadow-sm p-5">
            <h3 class="font-bold text-gray-900 mb-4">Omzet per Divisi</h3>
            <div class="space-y-3">
                <template x-for="div in topDivisi" :key="div.name">
                    <div>
                        <div class="flex justify-between text-xs mb-1">
                            <span class="font-medium text-gray-700" x-text="div.name"></span>
                            <span class="text-gray-500" x-text="formatRp(div.val)"></span>
                        </div>
                        <div class="w-full bg-gray-100 rounded-full h-2"><div class="h-2 rounded-full bg-blue-500" :style="'width:'+div.pct+'%'"></div></div>
                    </div>
                </template>
>>>>>>> 62d477c (Activate non-AI related "Coming Soon" features in the sidebar)
            </div>
        </div>
    </div>

<<<<<<< HEAD
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
=======
    {{-- Bottom Row --}}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {{-- Top Products --}}
        <div class="bg-white rounded-xl border shadow-sm p-5">
            <h3 class="font-bold text-gray-900 mb-4">Top 5 Produk Terlaris</h3>
            <div class="space-y-3">
                <template x-for="(p, i) in topProducts" :key="p.name">
                    <div class="flex items-center gap-3">
                        <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0" x-text="i+1"></span>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate" x-text="p.name"></p>
                            <p class="text-xs text-gray-400" x-text="p.qty+' unit terjual'"></p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-bold text-gray-900" x-text="formatRp(p.val)"></p>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        {{-- Recent Metrics --}}
        <div class="bg-white rounded-xl border shadow-sm p-5">
            <h3 class="font-bold text-gray-900 mb-4">Metrik Lainnya</h3>
            <div class="space-y-4">
                <div class="flex justify-between items-center py-2 border-b border-gray-50">
                    <span class="text-sm text-gray-600">Customer Baru</span>
                    <span class="font-bold text-gray-900" x-text="metrics.newCustomers"></span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-50">
                    <span class="text-sm text-gray-600">Order Berhasil</span>
                    <span class="font-bold text-green-600" x-text="metrics.successRate+'%'"></span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-50">
                    <span class="text-sm text-gray-600">Pengiriman Tepat Waktu</span>
                    <span class="font-bold text-blue-600" x-text="metrics.onTime+'%'"></span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-50">
                    <span class="text-sm text-gray-600">Stok Habis (SKU)</span>
                    <span class="font-bold text-red-500" x-text="metrics.outOfStock"></span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-50">
                    <span class="text-sm text-gray-600">Piutang Belum Lunas</span>
                    <span class="font-bold text-orange-500" x-text="formatRp(metrics.receivable)"></span>
                </div>
                <div class="flex justify-between items-center py-2">
                    <span class="text-sm text-gray-600">Return Rate</span>
                    <span class="font-bold text-gray-900" x-text="metrics.returnRate+'%'"></span>
                </div>
            </div>
>>>>>>> 62d477c (Activate non-AI related "Coming Soon" features in the sidebar)
        </div>
    </div>
</div>
<script>
<<<<<<< HEAD
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
=======
function analyticsApp(){return{period:'30',kpi:{omzet:0,orders:0,avgOrder:0,profit:0,margin:0},chartBars:[],topDivisi:[],topProducts:[],metrics:{},
async init(){await this.loadData()},
async loadData(){try{const r=await fetch(`/api/erp/analytics?period=${this.period}`);if(r.ok){const d=await r.json();this.kpi=d.kpi||this.getDemoKpi();this.chartBars=d.chartBars||this.getDemoChart();this.topDivisi=d.topDivisi||this.getDemoDivisi();this.topProducts=d.topProducts||this.getDemoProducts();this.metrics=d.metrics||this.getDemoMetrics();return}}catch{}this.kpi=this.getDemoKpi();this.chartBars=this.getDemoChart();this.topDivisi=this.getDemoDivisi();this.topProducts=this.getDemoProducts();this.metrics=this.getDemoMetrics()},
getDemoKpi(){const p=parseInt(this.period);return{omzet:p*850000+Math.random()*500000,orders:p*3+Math.floor(Math.random()*10),avgOrder:280000+Math.random()*100000,profit:p*210000+Math.random()*100000,margin:24.7}},
getDemoChart(){const n=Math.min(parseInt(this.period),12);const max=5000000;return Array.from({length:n},(_,i)=>{const val=1000000+Math.random()*4000000;return{val,pct:val/max,label:i===n-1?'Hari ini':(n-i)+'hr'}})},
getDemoDivisi(){const items=[{name:'Elektronik',val:18500000},{name:'Bahan Bangunan',val:12300000},{name:'Rumah Tangga',val:8700000},{name:'Lainnya',val:4200000}];const max=Math.max(...items.map(i=>i.val));return items.map(i=>({...i,pct:Math.round(i.val/max*100)}))},
getDemoProducts(){return[{name:'TV LED 43"',qty:24,val:28800000},{name:'Kulkas 2 Pintu',qty:18,val:21600000},{name:'AC 1 PK',qty:32,val:19200000},{name:'Mesin Cuci',qty:15,val:15000000},{name:'HP Samsung',qty:45,val:13500000}]},
getDemoMetrics(){return{newCustomers:23,successRate:96.4,onTime:89.2,outOfStock:7,receivable:15800000,returnRate:1.8}},
formatRp(n){if(!n)return'Rp 0';if(n>=1000000000)return'Rp '+Math.round(n/1000000000*10)/10+'M';if(n>=1000000)return'Rp '+Math.round(n/100000)/10+'Jt';return'Rp '+Number(Math.round(n)).toLocaleString('id-ID')}
}}
>>>>>>> 62d477c (Activate non-AI related "Coming Soon" features in the sidebar)
</script>
@endsection
