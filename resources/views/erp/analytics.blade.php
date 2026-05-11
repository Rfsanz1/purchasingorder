@extends('layouts.erp')
@section('title', 'Analytics Dashboard')
@section('content')
<div x-data="analyticsApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Analytics Dashboard</h1><p class="text-gray-500 mt-1 text-sm">Analitik komprehensif performa bisnis real-time</p></div>
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
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
            </div>
            <p class="text-xl font-bold text-gray-900" x-text="formatRp(kpi.omzet)"></p>
            <p class="text-xs text-gray-400 mt-1">periode ini</p>
        </div>
        <div class="bg-white rounded-xl border p-4 shadow-sm">
            <div class="flex items-center justify-between mb-2">
                <p class="text-xs text-gray-500 font-medium">Total Order</p>
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"><svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg></div>
            </div>
            <p class="text-2xl font-bold text-gray-900" x-text="kpi.orders"></p>
            <p class="text-xs text-gray-400 mt-1">transaksi berhasil</p>
        </div>
        <div class="bg-white rounded-xl border p-4 shadow-sm">
            <div class="flex items-center justify-between mb-2">
                <p class="text-xs text-gray-500 font-medium">Avg. Order Value</p>
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
            </div>
            <p class="text-xl font-bold text-gray-900" x-text="formatRp(kpi.avgOrder)"></p>
            <p class="text-xs text-gray-400 mt-1">rata-rata per transaksi</p>
        </div>
        <div class="bg-white rounded-xl border p-4 shadow-sm">
            <div class="flex items-center justify-between mb-2">
                <p class="text-xs text-gray-500 font-medium">Gross Profit</p>
                <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center"><svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg></div>
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
            <div x-show="loading" class="flex justify-center py-8"><div class="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
            <div x-show="!loading" class="flex items-end gap-1 h-40">
                <template x-for="(bar, idx) in chartBars" :key="idx">
                    <div class="flex-1 flex flex-col items-center gap-1">
                        <div class="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer" :style="'height:'+(bar.pct*100)+'%'" :title="formatRp(bar.val)"></div>
                        <span class="text-xs text-gray-400 truncate w-full text-center" x-text="bar.label" style="font-size:9px"></span>
                    </div>
                </template>
            </div>
        </div>

        {{-- Top Sales --}}
        <div class="bg-white rounded-xl border shadow-sm p-5">
            <h3 class="font-bold text-gray-900 mb-4">Top Sales</h3>
            <div x-show="loading" class="flex justify-center py-8"><div class="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
            <div x-show="!loading" class="space-y-3">
                <template x-for="div in topSales" :key="div.name">
                    <div>
                        <div class="flex justify-between text-xs mb-1">
                            <span class="font-medium text-gray-700" x-text="div.name"></span>
                            <span class="text-gray-500" x-text="formatRp(div.val)"></span>
                        </div>
                        <div class="w-full bg-gray-100 rounded-full h-2"><div class="h-2 rounded-full bg-blue-500" :style="'width:'+div.pct+'%'"></div></div>
                    </div>
                </template>
                <div x-show="topSales.length===0" class="text-center text-gray-400 py-4 text-sm">Belum ada data</div>
            </div>
        </div>
    </div>

    {{-- Bottom Row --}}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {{-- Top Products --}}
        <div class="bg-white rounded-xl border shadow-sm p-5">
            <h3 class="font-bold text-gray-900 mb-4">Top 5 Produk Terlaris</h3>
            <div x-show="loading" class="flex justify-center py-8"><div class="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
            <div x-show="!loading" class="space-y-3">
                <template x-for="(p, i) in topProducts" :key="p.name">
                    <div class="flex items-center gap-3">
                        <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0" x-text="i+1"></span>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate" x-text="p.name"></p>
                            <p class="text-xs text-gray-400" x-text="(p.qty||0)+' unit terjual'"></p>
                        </div>
                        <p class="text-sm font-bold text-gray-900" x-text="formatRp(p.val)"></p>
                    </div>
                </template>
                <div x-show="topProducts.length===0" class="text-center text-gray-400 py-4 text-sm">Belum ada data</div>
            </div>
        </div>

        {{-- Recent Metrics --}}
        <div class="bg-white rounded-xl border shadow-sm p-5">
            <h3 class="font-bold text-gray-900 mb-4">Metrik Lainnya</h3>
            <div class="space-y-4">
                <div class="flex justify-between items-center py-2 border-b border-gray-50">
                    <span class="text-sm text-gray-600">Customer Baru</span>
                    <span class="font-bold text-gray-900" x-text="kpi.customers||0"></span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-50">
                    <span class="text-sm text-gray-600">Total Produk</span>
                    <span class="font-bold text-green-600" x-text="kpi.products||0"></span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-50">
                    <span class="text-sm text-gray-600">Total Karyawan</span>
                    <span class="font-bold text-blue-600" x-text="kpi.employees||0"></span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-50">
                    <span class="text-sm text-gray-600">Total Supplier</span>
                    <span class="font-bold text-purple-600" x-text="kpi.suppliers||0"></span>
                </div>
                <div class="flex justify-between items-center py-2">
                    <span class="text-sm text-gray-600">Pertumbuhan Omzet</span>
                    <span class="font-bold" :class="(kpi.growth||0)>=0?'text-green-600':'text-red-500'" x-text="(kpi.growth||0)+'%'"></span>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
function analyticsApp(){
    return {
        period:'30', kpi:{omzet:0,orders:0,avgOrder:0,profit:0,margin:0,customers:0,products:0,employees:0,suppliers:0,growth:0},
        chartBars:[], topSales:[], topProducts:[], loading:false,
        async init(){ await this.loadData(); },
        async loadData(){
            this.loading=true;
            try {
                const r=await fetch(`/api/erp/analytics?period=${this.period}`);
                if(r.ok){
                    const d=await r.json();
                    this.kpi=d.kpi||this.kpi;
                    this.chartBars=d.chartBars||this.buildChart(d);
                    this.topSales=d.topSales||[];
                    this.topProducts=d.topProducts||[];
                    return;
                }
            } catch(e){}
            // Fallback: build from analytics summary
            try {
                const r2=await fetch(`/api/erp/analytics/summary?period=month`);
                if(r2.ok){
                    const d=await r2.json();
                    this.kpi={omzet:d.revenue||0,orders:d.orders||0,avgOrder:d.orders>0?(d.revenue/d.orders):0,profit:d.revenue*0.25,margin:25,customers:d.customers||0,products:d.total_products||0,employees:0,suppliers:0,growth:d.revenue_growth||0};
                    this.chartBars=this.buildChartFromMonthly(d.monthly_trend||[]);
                    this.topSales=(d.top_sales||[]).map((s,i,a)=>({name:s.nama_sales,val:s.revenue,pct:Math.round(s.revenue/Math.max(...a.map(x=>x.revenue))*100)}));
                    this.topProducts=[];
                }
            } catch(e){}
            this.loading=false;
        },
        buildChart(d){
            const trend=d.monthly_trend||[];
            if(!trend.length) return [];
            const max=Math.max(...trend.map(t=>t.revenue||0),1);
            return trend.map(t=>({val:t.revenue||0,pct:(t.revenue||0)/max,label:t.label||''}));
        },
        buildChartFromMonthly(trend){
            if(!trend.length) return [];
            const max=Math.max(...trend.map(t=>t.revenue||0),1);
            return trend.map(t=>({val:t.revenue||0,pct:(t.revenue||0)/max,label:t.label||''}));
        },
        formatRp(n){if(!n)return'Rp 0';if(n>=1000000000)return'Rp '+Math.round(n/100000000)/10+'M';if(n>=1000000)return'Rp '+Math.round(n/100000)/10+'Jt';return'Rp '+Number(Math.round(n)).toLocaleString('id-ID')}
    }
}
</script>
@endsection
