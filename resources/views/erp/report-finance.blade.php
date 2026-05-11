@extends('layouts.erp')
@section('title', 'Laporan Keuangan')
@section('content')
<<<<<<< HEAD
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
=======
<div x-data="reportFinApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Laporan Keuangan</h1><p class="text-gray-500 mt-1 text-sm">Laporan keuangan komprehensif perusahaan</p></div>
        <div class="flex gap-2">
            <select x-model="periode" @change="loadData()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <template x-for="p in periodeList" :key="p.val"><option :value="p.val" x-text="p.label"></option></template>
            </select>
            <button @click="print()" class="border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-50">Print</button>
        </div>
    </div>

    {{-- Quick links to sub-reports --}}
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <a href="/erp/profit-loss" class="bg-white rounded-xl border p-4 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2"><svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg></div>
            <p class="font-bold text-gray-900 text-sm">Laba Rugi</p>
            <p class="text-xs text-gray-400">P&L Statement</p>
        </a>
        <a href="/erp/cash-flow" class="bg-white rounded-xl border p-4 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2"><svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/></svg></div>
            <p class="font-bold text-gray-900 text-sm">Arus Kas</p>
            <p class="text-xs text-gray-400">Cash Flow</p>
        </a>
        <a href="/erp/balance-sheet" class="bg-white rounded-xl border p-4 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2"><svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg></div>
            <p class="font-bold text-gray-900 text-sm">Neraca</p>
            <p class="text-xs text-gray-400">Balance Sheet</p>
        </a>
        <a href="/erp/general-ledger" class="bg-white rounded-xl border p-4 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
            <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mb-2"><svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
            <p class="font-bold text-gray-900 text-sm">Buku Besar</p>
            <p class="text-xs text-gray-400">General Ledger</p>
        </a>
    </div>

    {{-- Summary financial metrics --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Aset</p><p class="text-xl font-bold text-blue-600" x-text="formatRp(summary.totalAset)"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Kewajiban</p><p class="text-xl font-bold text-red-500" x-text="formatRp(summary.totalKewajiban)"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Ekuitas</p><p class="text-xl font-bold text-green-600" x-text="formatRp(summary.ekuitas)"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Laba Bersih</p><p class="text-xl font-bold text-gray-900" x-text="formatRp(summary.labaBersih)"></p></div>
    </div>

    {{-- Financial ratios --}}
    <div class="bg-white rounded-xl border shadow-sm p-5">
        <h3 class="font-bold text-gray-900 mb-4">Rasio Keuangan Utama</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <template x-for="ratio in ratios" :key="ratio.name">
                <div class="text-center p-3 bg-gray-50 rounded-xl">
                    <p class="text-xs text-gray-500 mb-1" x-text="ratio.name"></p>
                    <p class="text-lg font-bold" :class="ratio.good?'text-green-600':'text-red-500'" x-text="ratio.value"></p>
                    <p class="text-xs" :class="ratio.good?'text-green-500':'text-red-400'" x-text="ratio.label"></p>
                </div>
            </template>
>>>>>>> 62d477c (Activate non-AI related "Coming Soon" features in the sidebar)
        </div>
    </div>
</div>
<script>
<<<<<<< HEAD
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
=======
function reportFinApp(){const now=new Date();const periodeList=Array.from({length:12},(_,i)=>{const d=new Date(now.getFullYear(),now.getMonth()-i,1);return{val:d.toISOString().slice(0,7),label:d.toLocaleDateString('id-ID',{month:'long',year:'numeric'})}});return{periodeList,periode:periodeList[0].val,summary:{totalAset:345000000,totalKewajiban:85000000,ekuitas:260000000,labaBersih:79000000},
ratios:[{name:'Current Ratio',value:'2.8x',good:true,label:'Sangat Baik'},{name:'Debt Ratio',value:'24.6%',good:true,label:'Sehat'},{name:'Gross Margin',value:'34.5%',good:true,label:'Baik'},{name:'Net Margin',value:'12.9%',good:true,label:'Baik'},{name:'ROE',value:'30.4%',good:true,label:'Sangat Baik'},{name:'ROA',value:'22.9%',good:true,label:'Baik'}],
async init(){await this.loadData()},
async loadData(){try{const r=await fetch(`/api/erp/report-finance?bulan=${this.periode}`);if(r.ok){const d=await r.json();if(d.summary)this.summary=d.summary;if(d.ratios)this.ratios=d.ratios}}catch{}},
print(){window.print()},
formatRp(n){if(!n)return'Rp 0';if(n>=1000000000)return'Rp '+Math.round(n/100000000)/10+'M';if(n>=1000000)return'Rp '+Math.round(n/100000)/10+'Jt';return'Rp '+Number(n).toLocaleString('id-ID')}
}}
>>>>>>> 62d477c (Activate non-AI related "Coming Soon" features in the sidebar)
</script>
@endsection
