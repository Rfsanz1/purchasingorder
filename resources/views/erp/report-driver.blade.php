@extends('layouts.erp')
@section('title', 'Laporan Driver')
@section('content')
<div x-data="reportDriverApp()" x-init="init()" class="p-4 md:p-6 max-w-5xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Laporan Driver</h1><p class="text-gray-500 mt-1">Performa dan produktivitas driver pengiriman</p></div>
        <div class="flex gap-2">
            <input x-model="from" @change="load()" type="date" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <input x-model="to" @change="load()" type="date" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <button @click="load()" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Tampilkan</button>
        </div>
    </div>
    <div x-show="loading" class="flex justify-center py-16"><div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
    <div x-show="!loading" class="space-y-6">
        <div class="bg-white rounded-xl border p-5">
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-900">Performa Per Driver</h3>
                <span class="text-sm text-gray-500" x-text="`Total ${data.total_pengiriman||0} pengiriman`"></span>
            </div>
            <div x-show="(data.per_driver||[]).length===0" class="text-center text-gray-400 py-8">Belum ada data pengiriman untuk periode ini</div>
            <div x-show="(data.per_driver||[]).length>0" class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead class="bg-gray-50"><tr>
                        <th class="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Driver</th>
                        <th class="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Total Order</th>
                        <th class="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Terkirim</th>
                        <th class="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Terlambat</th>
                        <th class="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Success Rate</th>
                    </tr></thead>
                    <tbody class="divide-y">
                        <template x-for="(d,i) in (data.per_driver||[])" :key="i">
                            <tr class="hover:bg-gray-50">
                                <td class="px-4 py-3 font-medium text-gray-900" x-text="d.nama_driver||'-'"></td>
                                <td class="px-4 py-3 text-right font-bold" x-text="d.total_order"></td>
                                <td class="px-4 py-3 text-right text-green-600 font-medium" x-text="d.terkirim||0"></td>
                                <td class="px-4 py-3 text-right text-red-500" x-text="d.terlambat||0"></td>
                                <td class="px-4 py-3 text-right">
                                    <span class="text-xs font-semibold px-2 py-1 rounded-full" :class="(d.terkirim/d.total_order*100)>=90?'bg-green-100 text-green-700':(d.terkirim/d.total_order*100)>=70?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700'" x-text="d.total_order>0?Math.round(d.terkirim/d.total_order*100)+'%':'N/A'"></span>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<script>
function reportDriverApp() {
    return {
        data:{},loading:false,
        from:new Date(new Date().getFullYear(),new Date().getMonth(),1).toISOString().slice(0,10),
        to:new Date().toISOString().slice(0,10),
        async init(){await this.load();},
        async load(){this.loading=true;try{this.data=await fetch(`/api/erp/report/driver?from=${this.from}&to=${this.to}`).then(r=>r.json());}finally{this.loading=false;}},
    };
}
</script>
@endsection
