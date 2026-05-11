@extends('layouts.erp')
@section('title', 'Arus Kas')
@section('content')
<div x-data="cashFlowApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Arus Kas</h1><p class="text-gray-500 mt-1 text-sm">Laporan arus kas masuk dan keluar perusahaan</p></div>
        <div class="flex gap-2">
            <input x-model="bulan" type="month" @change="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <button @click="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">↻ Refresh</button>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-5 shadow-sm">
            <p class="text-xs text-gray-500">Total Kas Masuk</p>
            <p class="text-2xl font-bold text-green-600 mt-1" x-text="rp(summary.total_masuk)"></p>
            <p class="text-xs text-gray-400 mt-1" x-text="summary.count_masuk+' transaksi'"></p>
        </div>
        <div class="bg-white rounded-xl border p-5 shadow-sm">
            <p class="text-xs text-gray-500">Total Kas Keluar</p>
            <p class="text-2xl font-bold text-red-500 mt-1" x-text="rp(summary.total_keluar)"></p>
            <p class="text-xs text-gray-400 mt-1" x-text="summary.count_keluar+' transaksi'"></p>
        </div>
        <div class="bg-white rounded-xl border p-5 shadow-sm" :class="summary.net>=0?'border-green-200':'border-red-200'">
            <p class="text-xs text-gray-500">Net Cash Flow</p>
            <p class="text-2xl font-bold mt-1" :class="summary.net>=0?'text-green-600':'text-red-600'" x-text="rp(summary.net)"></p>
            <p class="text-xs mt-1" :class="summary.net>=0?'text-green-500':'text-red-500'" x-text="summary.net>=0?'Surplus':'Defisit'"></p>
        </div>
    </div>

    {{-- Kas Masuk --}}
    <div class="bg-white rounded-xl border shadow-sm overflow-hidden mb-5">
        <div class="p-4 border-b bg-green-50"><h3 class="font-semibold text-green-800 text-sm">Kas Masuk</h3></div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b"><tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500">Tanggal</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500">Kategori</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 hidden md:table-cell">Deskripsi</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500">Jumlah</th>
                </tr></thead>
                <tbody class="divide-y divide-gray-50">
                    <template x-if="kasmasuk.length===0"><tr><td colspan="4" class="px-4 py-8 text-center text-gray-400">Belum ada kas masuk periode ini</td></tr></template>
                    <template x-for="t in kasmasuk" :key="t.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3 text-gray-500 text-xs" x-text="fmt(t.tanggal||t.created_at)"></td>
                            <td class="px-4 py-3"><span class="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full" x-text="t.kategori||t.jenis||'Umum'"></span></td>
                            <td class="px-4 py-3 text-gray-600 hidden md:table-cell" x-text="t.deskripsi||t.keterangan||'-'"></td>
                            <td class="px-4 py-3 text-right font-semibold text-green-600" x-text="rp(t.jumlah||t.amount||0)"></td>
                        </tr>
                    </template>
                    <template x-if="kasmasuk.length>0">
                        <tr class="bg-green-50 border-t-2 border-green-200"><td colspan="3" class="px-4 py-3 font-bold text-green-800 text-sm">Total Masuk</td><td class="px-4 py-3 text-right font-bold text-green-600" x-text="rp(summary.total_masuk)"></td></tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>

    {{-- Kas Keluar --}}
    <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div class="p-4 border-b bg-red-50"><h3 class="font-semibold text-red-800 text-sm">Kas Keluar</h3></div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b"><tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500">Tanggal</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500">Kategori</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 hidden md:table-cell">Deskripsi</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500">Jumlah</th>
                </tr></thead>
                <tbody class="divide-y divide-gray-50">
                    <template x-if="kaskeluar.length===0"><tr><td colspan="4" class="px-4 py-8 text-center text-gray-400">Belum ada kas keluar periode ini</td></tr></template>
                    <template x-for="t in kaskeluar" :key="t.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3 text-gray-500 text-xs" x-text="fmt(t.tanggal||t.created_at)"></td>
                            <td class="px-4 py-3"><span class="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full" x-text="t.kategori||t.jenis||'Umum'"></span></td>
                            <td class="px-4 py-3 text-gray-600 hidden md:table-cell" x-text="t.deskripsi||t.keterangan||'-'"></td>
                            <td class="px-4 py-3 text-right font-semibold text-red-600" x-text="rp(t.jumlah||t.amount||0)"></td>
                        </tr>
                    </template>
                    <template x-if="kaskeluar.length>0">
                        <tr class="bg-red-50 border-t-2 border-red-200"><td colspan="3" class="px-4 py-3 font-bold text-red-800 text-sm">Total Keluar</td><td class="px-4 py-3 text-right font-bold text-red-600" x-text="rp(summary.total_keluar)"></td></tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</div>
<script>
function cashFlowApp() { return {
    bulan: new Date().toISOString().slice(0,7),
    kasmasuk: [], kaskeluar: [],
    summary: {total_masuk:0,total_keluar:0,net:0,count_masuk:0,count_keluar:0},

    async init() { await this.load(); },
    async load() {
        try {
            const r = await fetch(`/api/erp/cash?bulan=${this.bulan}&per_page=200`);
            if (r.ok) {
                const d = await r.json();
                const all = d.data || d || [];
                this.kasmasuk = all.filter(t => (t.jenis||t.type||'masuk')==='masuk'||(t.jenis||'masuk').includes('masuk'));
                this.kaskeluar = all.filter(t => (t.jenis||t.type||'masuk')==='keluar'||(t.jenis||'').includes('keluar'));
                this.summary = {
                    total_masuk: this.kasmasuk.reduce((a,t)=>a+(parseFloat(t.jumlah||t.amount)||0),0),
                    total_keluar: this.kaskeluar.reduce((a,t)=>a+(parseFloat(t.jumlah||t.amount)||0),0),
                    count_masuk: this.kasmasuk.length,
                    count_keluar: this.kaskeluar.length,
                    net: 0,
                };
                this.summary.net = this.summary.total_masuk - this.summary.total_keluar;
            }
        } catch {}
    },
    rp(n) { return 'Rp '+Number(n||0).toLocaleString('id-ID'); },
    fmt(v) { try { return v ? new Date(v).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}) : '-'; } catch { return v||'-'; } }
};}
</script>
@endsection
