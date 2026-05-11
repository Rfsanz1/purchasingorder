@extends('layouts.erp')
@section('title', 'Log Notifikasi WhatsApp')
@section('content')
<div x-data="waApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Log Notifikasi WhatsApp</h1>
        <p class="text-gray-500 mt-1">Riwayat pengiriman pesan WhatsApp via Fonnte</p>
    </div>
    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4"><p class="text-xs text-gray-500 mb-1">Total Pesan</p><p class="text-2xl font-bold text-gray-900" x-text="total"></p></div>
        <div class="bg-green-50 rounded-xl border border-green-100 p-4"><p class="text-xs text-green-700 mb-1">Terkirim</p><p class="text-2xl font-bold text-green-600" x-text="terkirim"></p></div>
        <div class="bg-red-50 rounded-xl border border-red-100 p-4"><p class="text-xs text-red-700 mb-1">Gagal</p><p class="text-2xl font-bold text-red-500" x-text="gagal"></p></div>
    </div>
    <div class="bg-white rounded-xl border p-4 mb-4">
        <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari nomor, tipe pesan..." class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
    </div>
    <div class="bg-white rounded-xl border overflow-hidden">
        <div x-show="loading" class="flex justify-center py-12"><div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
        <div x-show="!loading && rows.length===0" class="text-center py-16 text-gray-400"><p>Belum ada log notifikasi WhatsApp</p></div>
        <div x-show="!loading && rows.length>0" class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b"><tr>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Waktu</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tujuan</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tipe</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Pesan</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Referensi</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr></thead>
                <tbody class="divide-y">
                    <template x-for="r in rows" :key="r.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3 text-xs text-gray-500" x-text="r.created_at?.slice(0,16).replace('T',' ')"></td>
                            <td class="px-4 py-3 font-mono text-sm" x-text="r.tujuan"></td>
                            <td class="px-4 py-3 text-gray-600 text-xs" x-text="r.tipe||'-'"></td>
                            <td class="px-4 py-3 text-gray-700 text-xs max-w-xs truncate" x-text="r.pesan"></td>
                            <td class="px-4 py-3 text-gray-500 text-xs" x-text="r.referensi||'-'"></td>
                            <td class="px-4 py-3"><span :class="r.status==='Terkirim'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'" class="px-2 py-0.5 rounded-full text-xs font-medium" x-text="r.status"></span></td>
                        </tr>
                    </template>
                </tbody>
            </table>
            <div class="px-4 py-3 border-t flex items-center justify-between text-sm text-gray-500">
                <span x-text="`${total} log`"></span>
                <div class="flex gap-2">
                    <button @click="prevPage()" :disabled="page<=1" class="px-3 py-1 border rounded-lg disabled:opacity-40">‹</button>
                    <span x-text="`Hal ${page}`" class="px-2 py-1"></span>
                    <button @click="nextPage()" :disabled="rows.length<perPage" class="px-3 py-1 border rounded-lg disabled:opacity-40">›</button>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
function waApp() {
    return {
        rows:[], total:0, terkirim:0, gagal:0, page:1, perPage:20, loading:true, search:'',
        async init(){await this.load();},
        async load(){this.loading=true;try{const p=new URLSearchParams({search:this.search,page:this.page,per_page:this.perPage});const d=await fetch('/api/erp/wa-logs?'+p).then(r=>r.json());this.rows=d.data||[];this.total=d.total||0;this.terkirim=d.terkirim||0;this.gagal=d.gagal||0;}finally{this.loading=false;}},
        prevPage(){if(this.page>1){this.page--;this.load();}},
        nextPage(){if(this.rows.length>=this.perPage){this.page++;this.load();}},
    };
}
</script>
@endsection
