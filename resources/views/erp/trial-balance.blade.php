@extends('layouts.erp')
@section('title', 'Neraca Saldo')
@section('content')
<div x-data="trialBalance()" x-init="init()" class="p-4 md:p-6 max-w-6xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Neraca Saldo</h1><p class="text-gray-500 mt-1 text-sm">Laporan neraca saldo semua akun — periode tertentu</p></div>
        <div class="flex gap-2">
            <input x-model="bulan" type="month" @change="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <button @click="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">↻ Refresh</button>
        </div>
    </div>

    <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Debet</p><p class="text-xl font-bold text-blue-600 mt-1" x-text="rp(total_debet)"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Kredit</p><p class="text-xl font-bold text-red-500 mt-1" x-text="rp(total_kredit)"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm" :class="Math.abs(total_debet-total_kredit)<1?'border-green-300':''">
            <p class="text-xs text-gray-500">Selisih</p>
            <p class="text-xl font-bold mt-1" :class="Math.abs(total_debet-total_kredit)<1?'text-green-600':'text-red-600'" x-text="rp(Math.abs(total_debet-total_kredit))"></p>
            <p class="text-xs mt-1" :class="Math.abs(total_debet-total_kredit)<1?'text-green-500':'text-red-500'" x-text="Math.abs(total_debet-total_kredit)<1?'Balance ✓':'Tidak Balance!'"></p>
        </div>
    </div>

    <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div class="p-4 border-b flex items-center justify-between">
            <h3 class="font-semibold text-gray-900 text-sm">Daftar Akun</h3>
            <input x-model="search" @input.debounce.300ms="filterItems()" type="text" placeholder="Cari akun..." class="border border-gray-200 rounded-lg px-3 py-2 text-sm w-48">
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b"><tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500">Kode Akun</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500">Nama Akun</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 hidden md:table-cell">Tipe</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500">Debet</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500">Kredit</th>
                </tr></thead>
                <tbody class="divide-y divide-gray-50">
                    <template x-if="filtered.length===0"><tr><td colspan="5" class="px-4 py-12 text-center text-gray-400">Belum ada data neraca saldo</td></tr></template>
                    <template x-for="a in filtered" :key="a.kode||a.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3 text-gray-500 font-mono text-xs" x-text="a.kode||a.kode_akun||'-'"></td>
                            <td class="px-4 py-3 font-medium text-gray-900" x-text="a.nama||a.nama_akun||'-'"></td>
                            <td class="px-4 py-3 hidden md:table-cell"><span class="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full" x-text="a.tipe||a.type||a.kategori||'-'"></span></td>
                            <td class="px-4 py-3 text-right text-blue-700 font-medium" x-text="(a.saldo_debet||a.debet)>0?rp(a.saldo_debet||a.debet):'-'"></td>
                            <td class="px-4 py-3 text-right text-red-600 font-medium" x-text="(a.saldo_kredit||a.kredit)>0?rp(a.saldo_kredit||a.kredit):'-'"></td>
                        </tr>
                    </template>
                </tbody>
                <tfoot class="bg-gray-50 border-t-2 border-gray-200">
                    <tr>
                        <td colspan="3" class="px-4 py-3 font-bold text-gray-900 text-sm">TOTAL</td>
                        <td class="px-4 py-3 text-right font-bold text-blue-700" x-text="rp(total_debet)"></td>
                        <td class="px-4 py-3 text-right font-bold text-red-600" x-text="rp(total_kredit)"></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</div>
<script>
function trialBalance() { return {
    bulan: new Date().toISOString().slice(0,7), search: '',
    items: [], filtered: [], total_debet: 0, total_kredit: 0,

    async init() { await this.load(); },
    async load() {
        try {
            const r = await fetch(`/api/erp/coa?per_page=200`);
            if (r.ok) {
                const d = await r.json();
                this.items = (d.data||d||[]).map(a => ({...a, saldo_debet: a.saldo_debet||a.debet||0, saldo_kredit: a.saldo_kredit||a.kredit||0}));
            }
        } catch {}
        if (this.items.length === 0) this.items = [];
        this.filterItems();
        this.total_debet = this.items.reduce((a,i)=>a+(+i.saldo_debet||0),0);
        this.total_kredit = this.items.reduce((a,i)=>a+(+i.saldo_kredit||0),0);
    },
    filterItems() {
        if (!this.search) { this.filtered = this.items; return; }
        const s = this.search.toLowerCase();
        this.filtered = this.items.filter(i=>(i.nama||'').toLowerCase().includes(s)||(i.kode||'').toLowerCase().includes(s));
    },
    rp(n){return'Rp '+Number(n||0).toLocaleString('id-ID');}
};}
</script>
@endsection
