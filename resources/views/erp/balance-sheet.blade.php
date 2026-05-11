@extends('layouts.erp')
@section('title', 'Neraca Keuangan')
@section('content')
<div x-data="balanceSheet()" x-init="init()" class="p-4 md:p-6 max-w-6xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Neraca Keuangan</h1><p class="text-gray-500 mt-1 text-sm">Laporan posisi keuangan perusahaan</p></div>
        <div class="flex gap-2">
            <input x-model="tanggal" type="date" @change="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <button @click="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">↻ Refresh</button>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Aktiva</p><p class="text-xl font-bold text-gray-900 mt-1" x-text="rp(aktiva_total)"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Kewajiban</p><p class="text-xl font-bold text-red-500 mt-1" x-text="rp(kewajiban_total)"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm" :class="ekuitas>=0?'border-green-200':''"><p class="text-xs text-gray-500">Ekuitas</p><p class="text-xl font-bold mt-1" :class="ekuitas>=0?'text-green-600':'text-red-600'" x-text="rp(ekuitas)"></p></div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {{-- Aktiva --}}
        <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div class="p-4 border-b bg-blue-50"><h3 class="font-bold text-blue-900 text-sm">AKTIVA</h3></div>
            <div class="p-4 space-y-4">
                <div>
                    <p class="text-xs font-bold text-gray-500 uppercase mb-2">Aktiva Lancar</p>
                    <template x-for="a in aktiva_lancar" :key="a.nama">
                        <div class="flex justify-between py-1.5 border-b border-gray-50">
                            <span class="text-sm text-gray-700 pl-3" x-text="a.nama"></span>
                            <span class="text-sm font-medium text-gray-900" x-text="rp(a.nilai)"></span>
                        </div>
                    </template>
                    <div class="flex justify-between py-2 bg-blue-50 rounded px-2 mt-1">
                        <span class="text-xs font-bold text-blue-800">Jumlah Aktiva Lancar</span>
                        <span class="text-sm font-bold text-blue-800" x-text="rp(aktiva_lancar.reduce((a,i)=>a+(+i.nilai||0),0))"></span>
                    </div>
                </div>
                <div>
                    <p class="text-xs font-bold text-gray-500 uppercase mb-2">Aktiva Tetap</p>
                    <template x-for="a in aktiva_tetap" :key="a.nama">
                        <div class="flex justify-between py-1.5 border-b border-gray-50">
                            <span class="text-sm text-gray-700 pl-3" x-text="a.nama"></span>
                            <span class="text-sm font-medium text-gray-900" x-text="rp(a.nilai)"></span>
                        </div>
                    </template>
                    <div class="flex justify-between py-2 bg-blue-50 rounded px-2 mt-1">
                        <span class="text-xs font-bold text-blue-800">Jumlah Aktiva Tetap</span>
                        <span class="text-sm font-bold text-blue-800" x-text="rp(aktiva_tetap.reduce((a,i)=>a+(+i.nilai||0),0))"></span>
                    </div>
                </div>
                <div class="flex justify-between py-3 bg-blue-600 rounded-lg px-3 mt-2">
                    <span class="text-sm font-bold text-white">TOTAL AKTIVA</span>
                    <span class="text-sm font-bold text-white" x-text="rp(aktiva_total)"></span>
                </div>
            </div>
        </div>

        {{-- Kewajiban & Ekuitas --}}
        <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div class="p-4 border-b bg-red-50"><h3 class="font-bold text-red-900 text-sm">KEWAJIBAN & EKUITAS</h3></div>
            <div class="p-4 space-y-4">
                <div>
                    <p class="text-xs font-bold text-gray-500 uppercase mb-2">Kewajiban Lancar</p>
                    <template x-for="k in kewajiban_lancar" :key="k.nama">
                        <div class="flex justify-between py-1.5 border-b border-gray-50">
                            <span class="text-sm text-gray-700 pl-3" x-text="k.nama"></span>
                            <span class="text-sm font-medium text-gray-900" x-text="rp(k.nilai)"></span>
                        </div>
                    </template>
                    <div class="flex justify-between py-2 bg-red-50 rounded px-2 mt-1">
                        <span class="text-xs font-bold text-red-800">Jumlah Kewajiban Lancar</span>
                        <span class="text-sm font-bold text-red-800" x-text="rp(kewajiban_lancar.reduce((a,i)=>a+(+i.nilai||0),0))"></span>
                    </div>
                </div>
                <div>
                    <p class="text-xs font-bold text-gray-500 uppercase mb-2">Ekuitas</p>
                    <template x-for="e in ekuitas_items" :key="e.nama">
                        <div class="flex justify-between py-1.5 border-b border-gray-50">
                            <span class="text-sm text-gray-700 pl-3" x-text="e.nama"></span>
                            <span class="text-sm font-medium text-gray-900" x-text="rp(e.nilai)"></span>
                        </div>
                    </template>
                    <div class="flex justify-between py-2 bg-green-50 rounded px-2 mt-1">
                        <span class="text-xs font-bold text-green-800">Jumlah Ekuitas</span>
                        <span class="text-sm font-bold text-green-800" x-text="rp(ekuitas_items.reduce((a,i)=>a+(+i.nilai||0),0))"></span>
                    </div>
                </div>
                <div class="flex justify-between py-3 bg-red-600 rounded-lg px-3 mt-2">
                    <span class="text-sm font-bold text-white">TOTAL KEWAJIBAN + EKUITAS</span>
                    <span class="text-sm font-bold text-white" x-text="rp(aktiva_total)"></span>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
function balanceSheet() { return {
    tanggal: new Date().toISOString().split('T')[0],
    aktiva_lancar: [], aktiva_tetap: [], kewajiban_lancar: [], ekuitas_items: [],
    aktiva_total: 0, kewajiban_total: 0, ekuitas: 0,

    async init() { await this.load(); },
    async load() {
        try {
            const r = await fetch(`/api/erp/module/balance-sheet?tanggal=${this.tanggal}`);
            if (r.ok) {
                const d = await r.json();
                const items = d.data || [];
                this.aktiva_lancar = items.filter(i=>(i.kategori||'').includes('Aktiva Lancar')).map(i=>({nama:i.nama||i.akun,nilai:i.nilai||i.saldo||0}));
                this.aktiva_tetap = items.filter(i=>(i.kategori||'').includes('Aktiva Tetap')).map(i=>({nama:i.nama||i.akun,nilai:i.nilai||i.saldo||0}));
                this.kewajiban_lancar = items.filter(i=>(i.kategori||'').includes('Kewajiban')).map(i=>({nama:i.nama||i.akun,nilai:i.nilai||i.saldo||0}));
                this.ekuitas_items = items.filter(i=>(i.kategori||'').includes('Ekuitas')).map(i=>({nama:i.nama||i.akun,nilai:i.nilai||i.saldo||0}));
            }
        } catch {}
        if (this.aktiva_lancar.length === 0) this.aktiva_lancar = [{nama:'Kas & Bank',nilai:0},{nama:'Piutang Dagang',nilai:0},{nama:'Persediaan Barang',nilai:0}];
        if (this.aktiva_tetap.length === 0) this.aktiva_tetap = [{nama:'Peralatan & Mesin',nilai:0},{nama:'Kendaraan',nilai:0}];
        if (this.kewajiban_lancar.length === 0) this.kewajiban_lancar = [{nama:'Hutang Dagang',nilai:0},{nama:'Hutang Pajak',nilai:0}];
        if (this.ekuitas_items.length === 0) this.ekuitas_items = [{nama:'Modal Pemilik',nilai:0},{nama:'Laba Ditahan',nilai:0}];
        this.aktiva_total = [...this.aktiva_lancar,...this.aktiva_tetap].reduce((a,i)=>a+(+i.nilai||0),0);
        this.kewajiban_total = this.kewajiban_lancar.reduce((a,i)=>a+(+i.nilai||0),0);
        this.ekuitas = this.aktiva_total - this.kewajiban_total;
    },
    rp(n){return'Rp '+Number(n||0).toLocaleString('id-ID');}
};}
</script>
@endsection
