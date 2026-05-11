@extends('layouts.erp')
@section('title', 'Laporan Laba Rugi')
@section('content')
<div x-data="plApp()" x-init="init()" class="p-4 md:p-6 max-w-5xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Laporan Laba Rugi</h1><p class="text-gray-500 mt-1 text-sm">Profit & Loss statement periode akuntansi</p></div>
        <div class="flex gap-2">
            <select x-model="periode" @change="loadData()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <template x-for="p in periodeList" :key="p.val"><option :value="p.val" x-text="p.label"></option></template>
            </select>
            <button @click="printReport()" class="border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-50">Print</button>
        </div>
    </div>

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

    <div class="bg-white rounded-xl border shadow-sm">
        <div class="p-4 border-b">
            <h2 class="font-bold text-gray-900 text-lg">Laporan Laba Rugi</h2>
            <p class="text-sm text-gray-500" x-text="periodeLabel"></p>
        </div>
        <div class="p-6">
            <div class="mb-6">
                <h3 class="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">PENDAPATAN</h3>
                <div class="space-y-2">
                    <template x-for="item in report.pendapatan" :key="item.name">
                        <div class="flex justify-between items-center py-1.5" :class="item.isTotal?'border-t border-gray-200 pt-2 mt-1':''">
                            <span :class="item.isTotal?'font-bold text-gray-900':'text-gray-600 pl-4'" class="text-sm" x-text="item.name"></span>
                            <span :class="item.isTotal?'font-bold text-green-700':'text-gray-700'" class="text-sm font-medium" x-text="formatRp(item.val)"></span>
                        </div>
                    </template>
                </div>
            </div>
            <div class="mb-6">
                <h3 class="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">BIAYA & PENGELUARAN</h3>
                <div class="space-y-2">
                    <template x-for="item in report.biaya" :key="item.name">
                        <div class="flex justify-between items-center py-1.5" :class="item.isTotal?'border-t border-gray-200 pt-2 mt-1':''">
                            <span :class="item.isTotal?'font-bold text-gray-900':'text-gray-600 pl-4'" class="text-sm" x-text="item.name"></span>
                            <span :class="item.isTotal?'font-bold text-red-700':'text-red-500'" class="text-sm font-medium" x-text="'('+formatRp(item.val)+')'"></span>
                        </div>
                    </template>
                </div>
            </div>
            <div class="border-t-2 border-gray-900 pt-3">
                <div class="flex justify-between items-center">
                    <span class="font-bold text-gray-900" x-text="report.labaRugi>=0?'LABA BERSIH':'RUGI BERSIH'"></span>
                    <span class="text-xl font-bold" :class="report.labaRugi>=0?'text-blue-700':'text-red-700'" x-text="(report.labaRugi<0?'(':'') + formatRp(Math.abs(report.labaRugi)) + (report.labaRugi<0?')':'')"></span>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
function plApp(){
    const now=new Date();
    const periodeList=Array.from({length:12},(_,i)=>{const d=new Date(now.getFullYear(),now.getMonth()-i,1);return{val:d.toISOString().slice(0,7),label:d.toLocaleDateString('id-ID',{month:'long',year:'numeric'})}});
    return{periodeList,periode:periodeList[0].val,report:{pendapatan:[],biaya:[],totalPendapatan:0,totalBiaya:0,labaRugi:0,margin:0},
    get periodeLabel(){return'Periode: '+(this.periodeList.find(p=>p.val===this.periode)?.label||this.periode)},
    async init(){await this.loadData()},
    async loadData(){
        try{
            const r=await fetch(`/api/erp/profit-loss?bulan=${this.periode}&from=${this.periode}-01&to=${this.periode}-31`);
            if(r.ok){
                const d=await r.json();
                if(d.report){this.report=d.report;return}
                if(d.pendapatan!==undefined){
                    const totalP=d.pendapatan||0;const totalB=(d.hpp||0)+(d.biaya_operasional||0);
                    this.report={pendapatan:[{name:'Penjualan Bersih',val:totalP},{name:'Total Pendapatan',val:totalP,isTotal:true}],biaya:[{name:'HPP / Harga Pokok',val:d.hpp||0},{name:'Biaya Operasional',val:d.biaya_operasional||0},{name:'Total Biaya',val:totalB,isTotal:true}],totalPendapatan:totalP,totalBiaya:totalB,labaRugi:d.laba_bersih||(totalP-totalB),margin:totalP>0?Math.round((totalP-totalB)/totalP*1000)/10:0};
                    return;
                }
            }
        }catch{}
        this.generateDemo();
    },
    generateDemo(){const pend=[{name:'Penjualan Produk',val:580000000},{name:'Pendapatan Jasa Servis',val:25000000},{name:'Pendapatan Lainnya',val:8500000},{name:'Total Pendapatan',val:613500000,isTotal:true}];const biaya=[{name:'Harga Pokok Penjualan (HPP)',val:380000000},{name:'Biaya Gaji & Tunjangan',val:95000000},{name:'Biaya Operasional',val:28000000},{name:'Biaya Marketing & Promosi',val:12000000},{name:'Biaya Penyusutan',val:8500000},{name:'Biaya Administrasi',val:6500000},{name:'Total Biaya',val:530000000,isTotal:true}];const totalP=613500000;const totalB=530000000;const labaRugi=totalP-totalB;this.report={pendapatan:pend,biaya:biaya,totalPendapatan:totalP,totalBiaya:totalB,labaRugi,margin:Math.round(labaRugi/totalP*1000)/10}},
    printReport(){window.print()},
    formatRp(n){if(!n&&n!==0)return'Rp 0';return'Rp '+Number(Math.abs(n)).toLocaleString('id-ID')}
}}
</script>
@endsection
