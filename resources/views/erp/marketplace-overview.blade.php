@extends('layouts.erp')
@section('title', 'Overview Marketplace')
@section('content')
<div x-data="mktOverviewApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Overview Marketplace</h1><p class="text-gray-500 mt-1 text-sm">Ringkasan performa semua marketplace channel</p></div>
        <div class="flex gap-2">
            <select x-model="period" @change="loadData()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option value="7">7 Hari</option><option value="30">30 Hari</option><option value="90">3 Bulan</option>
            </select>
            <a href="/erp/marketplace-sync" class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>Sync Semua
            </a>
        </div>
    </div>

    {{-- Platform Cards --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <template x-for="p in platforms" :key="p.name">
            <div class="bg-white rounded-xl border shadow-sm p-4">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm" :style="'background:'+p.color" x-text="p.name.charAt(0)"></div>
                    <div><h3 class="font-bold text-gray-900 text-sm" x-text="p.name"></h3><span :class="p.connected?'text-green-600':'text-red-500'" class="text-xs" x-text="p.connected?'● Terhubung':'● Tidak Terhubung'"></span></div>
                </div>
                <div class="space-y-1.5">
                    <div class="flex justify-between text-xs"><span class="text-gray-500">Order</span><span class="font-bold text-gray-900" x-text="p.orders"></span></div>
                    <div class="flex justify-between text-xs"><span class="text-gray-500">Revenue</span><span class="font-bold text-green-600" x-text="formatRp(p.revenue)"></span></div>
                    <div class="flex justify-between text-xs"><span class="text-gray-500">Pending</span><span class="font-bold text-yellow-600" x-text="p.pending"></span></div>
                    <div class="flex justify-between text-xs"><span class="text-gray-500">Rating Toko</span><span class="font-bold text-blue-600" x-text="p.rating+' ⭐'"></span></div>
                </div>
                <a :href="'/erp/'+p.slug+'/dashboard'" class="mt-3 block text-center py-1.5 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg border border-gray-200 transition-colors">Kelola →</a>
            </div>
        </template>
    </div>

    {{-- Combined Metrics --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Order Semua Platform</p><p class="text-2xl font-bold text-gray-900" x-text="platforms.reduce((a,p)=>a+p.orders,0)"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Revenue</p><p class="text-xl font-bold text-green-600" x-text="formatRp(platforms.reduce((a,p)=>a+p.revenue,0))"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Order Pending</p><p class="text-2xl font-bold text-yellow-500" x-text="platforms.reduce((a,p)=>a+p.pending,0)"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Platform Terhubung</p><p class="text-2xl font-bold text-blue-600" x-text="platforms.filter(p=>p.connected).length+'/'+platforms.length"></p></div>
    </div>

    {{-- Recent Orders --}}
    <div class="bg-white rounded-xl border shadow-sm">
        <div class="p-4 border-b flex items-center justify-between">
            <h3 class="font-bold text-gray-900">Order Terbaru (Semua Platform)</h3>
            <a href="/erp/multi-channel-order" class="text-xs text-blue-600 hover:underline">Lihat Semua →</a>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50"><tr>
                    <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500">Platform</th>
                    <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500">No. Order</th>
                    <th class="px-4 py-2 text-left text-xs font-semibold text-gray-500 hidden md:table-cell">Produk</th>
                    <th class="px-4 py-2 text-right text-xs font-semibold text-gray-500">Total</th>
                    <th class="px-4 py-2 text-center text-xs font-semibold text-gray-500">Status</th>
                </tr></thead>
                <tbody class="divide-y divide-gray-50">
                    <template x-for="o in recentOrders" :key="o.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-2.5"><span class="px-2 py-0.5 text-xs font-bold rounded-full text-white" :style="'background:'+getPlatformColor(o.platform)" x-text="o.platform"></span></td>
                            <td class="px-4 py-2.5 font-medium text-xs" x-text="o.no_order"></td>
                            <td class="px-4 py-2.5 text-gray-500 text-xs hidden md:table-cell" x-text="o.produk"></td>
                            <td class="px-4 py-2.5 text-right font-bold text-xs" x-text="formatRp(o.total)"></td>
                            <td class="px-4 py-2.5 text-center">
                                <span :class="o.status==='Selesai'?'bg-green-100 text-green-700':o.status==='Diproses'?'bg-blue-100 text-blue-700':'bg-yellow-100 text-yellow-700'" class="px-2 py-0.5 text-xs rounded-full font-medium" x-text="o.status"></span>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</div>
<script>
function mktOverviewApp(){return{period:'30',platforms:[
    {name:'Shopee',slug:'shopee',color:'#EE4D2D',connected:true,orders:234,revenue:45800000,pending:12,rating:4.9},
    {name:'TikTok',slug:'tiktok',color:'#010101',connected:true,orders:89,revenue:18200000,pending:5,rating:4.8},
    {name:'Tokopedia',slug:'tokopedia',color:'#00AA5B',connected:false,orders:0,revenue:0,pending:0,rating:0},
    {name:'Lazada',slug:'lazada',color:'#0F146D',connected:false,orders:0,revenue:0,pending:0,rating:0}
],recentOrders:[
    {id:1,platform:'Shopee',no_order:'SPX-20241201-001',produk:'TV LED Samsung 43"',total:3200000,status:'Diproses'},
    {id:2,platform:'TikTok',no_order:'TT-20241201-045',produk:'HP Realme C55',total:1850000,status:'Selesai'},
    {id:3,platform:'Shopee',no_order:'SPX-20241201-002',produk:'Kulkas Polytron 2 Pintu',total:4500000,status:'Pending'},
    {id:4,platform:'Shopee',no_order:'SPX-20241130-099',produk:'AC 1PK Daikin',total:3800000,status:'Selesai'},
    {id:5,platform:'TikTok',no_order:'TT-20241130-032',produk:'Mesin Cuci LG',total:3200000,status:'Diproses'},
],
async init(){await this.loadData()},
async loadData(){try{const r=await fetch(`/api/erp/marketplace-overview?period=${this.period}`);if(r.ok){const d=await r.json();if(d.platforms)this.platforms=d.platforms;if(d.recentOrders)this.recentOrders=d.recentOrders}}catch{}},
getPlatformColor(name){const c={Shopee:'#EE4D2D',TikTok:'#010101',Tokopedia:'#00AA5B',Lazada:'#0F146D'};return c[name]||'#666'},
formatRp(n){if(!n)return'Rp 0';if(n>=1000000)return'Rp '+Math.round(n/100000)/10+'Jt';return'Rp '+Number(n).toLocaleString('id-ID')}
}}
</script>
@endsection
