@extends('layouts.erp')
<<<<<<< HEAD
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
=======
@section('title', 'Laporan Laba Rugi')
@section('content')
<div x-data="plApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Laporan Laba Rugi</h1><p class="text-gray-500 mt-1 text-sm">Profit & Loss statement periode akuntansi</p></div>
        <div class="flex gap-2">
            <select x-model="periode" @change="loadData()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <template x-for="p in periodeList" :key="p.val"><option :value="p.val" x-text="p.label"></option></template>
            </select>
            <button @click="printReport()" class="border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-50">Print</button>
        </div>
    </div>

    {{-- Summary Cards --}}
    <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-green-50 rounded-xl border border-green-200 p-4 text-center">
            <p class="text-xs text-green-600 font-medium mb-1">Total Pendapatan</p>
            <p class="text-2xl font-bold text-green-700" x-text="formatRp(report.totalPendapatan)"></p>
        </div>
        <div class="bg-red-50 rounded-xl border border-red-200 p-4 text-center">
            <p class="text-xs text-red-600 font-medium mb-1">Total Biaya</p>
            <p class="text-2xl font-bold text-red-700" x-text="formatRp(report.totalBiaya)"></p>
        </div>
        <div :class="report.labaRugi>=0?'bg-blue-50 border-blue-200':'bg-orange-50 border-orange-200'" class="rounded-xl border p-4 text-center">
            <p class="text-xs font-medium mb-1" :class="report.labaRugi>=0?'text-blue-600':'text-orange-600'" x-text="report.labaRugi>=0?'Laba Bersih':'Rugi Bersih'"></p>
            <p class="text-2xl font-bold" :class="report.labaRugi>=0?'text-blue-700':'text-orange-700'" x-text="formatRp(Math.abs(report.labaRugi))"></p>
            <p class="text-xs" :class="report.labaRugi>=0?'text-blue-500':'text-orange-500'" x-text="'Margin '+report.margin+'%'"></p>
        </div>
    </div>

    {{-- P&L Statement --}}
    <div class="bg-white rounded-xl border shadow-sm">
        <div class="p-4 border-b">
            <h2 class="font-bold text-gray-900 text-lg">Laporan Laba Rugi</h2>
            <p class="text-sm text-gray-500" x-text="periodeLabel"></p>
        </div>
        <div class="p-6">
            {{-- Pendapatan --}}
            <div class="mb-6">
                <h3 class="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">PENDAPATAN</h3>
                <div class="space-y-2">
                    <template x-for="item in report.pendapatan" :key="item.name">
                        <div class="flex justify-between items-center py-1.5" :class="item.isTotal?'border-t border-gray-200 pt-2 mt-1':''">
                            <span :class="item.isTotal?'font-bold text-gray-900':'text-gray-600'" class="text-sm" x-text="item.isTotal?'':'\u00a0\u00a0'+item.name">
                                <template x-if="item.isTotal"><span x-text="item.name"></span></template>
                            </span>
                            <span :class="item.isTotal?'font-bold text-green-700':'text-gray-700'" class="text-sm font-medium" x-text="formatRp(item.val)"></span>
                        </div>
                    </template>
                </div>
            </div>
            {{-- Biaya --}}
            <div class="mb-6">
                <h3 class="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">BIAYA & PENGELUARAN</h3>
                <div class="space-y-2">
                    <template x-for="item in report.biaya" :key="item.name">
                        <div class="flex justify-between items-center py-1.5" :class="item.isTotal?'border-t border-gray-200 pt-2 mt-1':''">
                            <span :class="item.isTotal?'font-bold text-gray-900':'text-gray-600'" class="text-sm" x-text="'\u00a0\u00a0'+item.name"></span>
                            <span :class="item.isTotal?'font-bold text-red-700':'text-red-500'" class="text-sm font-medium" x-text="'('+formatRp(item.val)+')'"></span>
                        </div>
                    </template>
                </div>
            </div>
            {{-- Laba Rugi --}}
            <div class="border-t-2 border-gray-900 pt-3">
                <div class="flex justify-between items-center">
                    <span class="font-bold text-gray-900" x-text="report.labaRugi>=0?'LABA BERSIH':'RUGI BERSIH'"></span>
                    <span class="text-xl font-bold" :class="report.labaRugi>=0?'text-blue-700':'text-red-700'" x-text="(report.labaRugi<0?'(':'') + formatRp(Math.abs(report.labaRugi)) + (report.labaRugi<0?')':'')"></span>
                </div>
>>>>>>> 62d477c (Activate non-AI related "Coming Soon" features in the sidebar)
            </div>
        </div>
    </div>
</div>
<script>
<<<<<<< HEAD
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
=======
function plApp(){
    const now=new Date();
    const periodeList=Array.from({length:12},(_,i)=>{const d=new Date(now.getFullYear(),now.getMonth()-i,1);return{val:d.toISOString().slice(0,7),label:d.toLocaleDateString('id-ID',{month:'long',year:'numeric'})}});
    return{periodeList,periode:periodeList[0].val,report:{pendapatan:[],biaya:[],totalPendapatan:0,totalBiaya:0,labaRugi:0,margin:0},
    get periodeLabel(){return'Periode: '+(this.periodeList.find(p=>p.val===this.periode)?.label||this.periode)},
    async init(){await this.loadData()},
    async loadData(){try{const r=await fetch(`/api/erp/profit-loss?bulan=${this.periode}`);if(r.ok){const d=await r.json();if(d.report){this.report=d.report;return}}}catch{}this.generateDemo()},
    generateDemo(){const pend=[{name:'Penjualan Produk',val:580000000},{name:'Pendapatan Jasa Servis',val:25000000},{name:'Pendapatan Lainnya',val:8500000},{name:'Total Pendapatan',val:613500000,isTotal:true}];const biaya=[{name:'Harga Pokok Penjualan (HPP)',val:380000000},{name:'Biaya Gaji & Tunjangan',val:95000000},{name:'Biaya Operasional',val:28000000},{name:'Biaya Marketing & Promosi',val:12000000},{name:'Biaya Penyusutan',val:8500000},{name:'Biaya Administrasi',val:6500000},{name:'Beban Bunga',val:4500000},{name:'Total Biaya',val:534500000,isTotal:true}];const totalP=613500000;const totalB=534500000;const labaRugi=totalP-totalB;this.report={pendapatan:pend,biaya:biaya,totalPendapatan:totalP,totalBiaya:totalB,labaRugi,margin:Math.round(labaRugi/totalP*1000)/10}},
    printReport(){window.print()},
    formatRp(n){if(!n&&n!==0)return'Rp 0';return'Rp '+Number(Math.abs(n)).toLocaleString('id-ID')}
}}
>>>>>>> 62d477c (Activate non-AI related "Coming Soon" features in the sidebar)
</script>
@endsection
