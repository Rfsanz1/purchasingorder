@extends('layouts.erp')
@section('title', $title)
@section('content')
@php
$platformColors = ['shopee'=>'#EE4D2D','tiktok'=>'#010101','tokopedia'=>'#00AA5B','lazada'=>'#0F146D'];
$platformColor = $platformColors[$platform ?? 'shopee'] ?? '#2563eb';
$platformName = ucfirst($platform ?? 'Marketplace');
$pageName = $page ?? 'dashboard';
@endphp
<div x-data="platformApp('{{ $platform ?? "shopee" }}','{{ $pageName }}')" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div x-show="toast.show" x-cloak x-transition class="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium" x-text="toast.msg"></div>

    {{-- Header --}}
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style="background: {{ $platformColor }}">{{ strtoupper(substr($platformName,0,1)) }}</div>
            <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ $title }}</h1>
                <p class="text-gray-500 mt-0.5 text-sm">{{ $platformName }} — {{ ucwords(str_replace('-',' ', $pageName)) }}</p>
            </div>
        </div>
        <div class="flex gap-2">
            <button @click="syncData()" class="border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1.5">
                <svg class="w-4 h-4" :class="syncing?'animate-spin':''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                <span x-text="syncing?'Syncing...':'Sync Data'"></span>
            </button>
            <button @click="openAdd()" class="text-white px-4 py-2 rounded-lg font-medium text-sm" style="background: {{ $platformColor }}">+ Tambah</button>
        </div>
    </div>

    {{-- Stats --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500 mb-1" x-text="stats.card1label||'Total'"></p><p class="text-2xl font-bold text-gray-900" x-text="stats.card1val??0"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500 mb-1" x-text="stats.card2label||'Aktif'"></p><p class="text-2xl font-bold text-green-600" x-text="stats.card2val??0"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500 mb-1" x-text="stats.card3label||'Pending'"></p><p class="text-2xl font-bold text-yellow-500" x-text="stats.card3val??0"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500 mb-1" x-text="stats.card4label||'Revenue'"></p><p class="text-xl font-bold text-blue-600" x-text="typeof stats.card4val==='number'&&stats.card4val>999?formatRp(stats.card4val):(stats.card4val??0)"></p></div>
    </div>

    {{-- Sub-nav for marketplace pages --}}
    <div class="bg-white rounded-xl border shadow-sm p-2 mb-5 overflow-x-auto">
        <div class="flex gap-1 min-w-max">
            @foreach(['dashboard','orders','products','stocks','chat','shipping','voucher','customer','analytics','api-settings'] as $nav)
            <a href="/erp/{{ $platform ?? 'shopee' }}/{{ $nav }}"
               class="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors {{ ($pageName ?? '') === $nav ? 'text-white' : 'text-gray-600 hover:bg-gray-50' }}"
               @if(($pageName ?? '') === $nav) style="background: {{ $platformColor }}" @endif>
                {{ ucwords(str_replace('-',' ',$nav)) }}
            </a>
            @endforeach
        </div>
    </div>

    {{-- Content Table --}}
    <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div class="p-4 border-b flex items-center justify-between">
            <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari data..." class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 w-full max-w-sm">
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <template x-for="col in columns" :key="col"><th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase" x-text="col"></th></template>
                        <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    <template x-if="loading"><tr><td :colspan="columns.length+1" class="px-4 py-12 text-center text-gray-400">Memuat data...</td></tr></template>
                    <template x-if="!loading&&items.length===0">
                        <tr><td :colspan="columns.length+1" class="px-4 py-16 text-center">
                            <p class="text-gray-400 font-medium">Belum ada data</p>
                            <p class="text-gray-300 text-xs mt-1">Data akan muncul setelah API {{ '{{ platformName }}' }} terhubung</p>
                            <button @click="syncData()" class="mt-4 text-white px-4 py-2 rounded-lg text-sm font-medium" style="background: {{ $platformColor }}">Sync Data Sekarang</button>
                        </td></tr>
                    </template>
                    <template x-for="item in items" :key="item.id">
                        <tr class="hover:bg-gray-50">
                            <template x-for="col in columns" :key="col">
                                <td class="px-4 py-3 text-sm text-gray-700" x-text="item[col.toLowerCase().replace(/ /g,'_')]||'-'"></td>
                            </template>
                            <td class="px-4 py-3 text-right"><button @click="editItem(item)" class="text-blue-600 text-xs hover:underline">Edit</button></td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</div>
<script>
function platformApp(platform, page){
    const pageConfigs={
        dashboard:{cols:['Metrik','Nilai','Perubahan'],stats:{card1label:'Total Order',card1val:234,card2label:'Revenue',card2val:45800000,card3label:'Pending',card3val:12,card4label:'Rating',card4val:'4.9 ⭐'}},
        orders:{cols:['No. Order','Produk','Pembeli','Total','Status'],stats:{card1label:'Total Order',card1val:234,card2label:'Selesai',card2val:198,card3label:'Pending',card3val:12,card4label:'Revenue',card4val:45800000}},
        products:{cols:['SKU','Nama Produk','Harga','Stok','Status'],stats:{card1label:'Total Produk',card1val:145,card2label:'Aktif',card2val:132,card3label:'Nonaktif',card3val:13,card4label:'Avg. Harga',card4val:850000}},
        stocks:{cols:['SKU','Produk','Stok Tersedia','Stok Terjual','Alert'],stats:{card1label:'Total SKU',card1val:145,card2label:'Stok OK',card2val:130,card3label:'Stok Rendah',card3val:15,card4label:'Total Unit',card4val:2840}},
        chat:{cols:['Pembeli','Pesan','Waktu','Status'],stats:{card1label:'Total Chat',card1val:89,card2label:'Belum Dibaca',card2val:12,card3label:'Response Rate',card3val:'96%',card4label:'Avg Response',card4val:'< 1 jam'}},
        shipping:{cols:['No. Order','Kurir','Resi','Status'],stats:{card1label:'Total Pengiriman',card1val:198,card2label:'Dalam Perjalanan',card2val:24,card3label:'Pending Pickup',card3val:8,card4label:'Selesai',card4val:166}},
        voucher:{cols:['Kode Voucher','Tipe','Nilai','Digunakan','Exp. Date'],stats:{card1label:'Total Voucher',card1val:12,card2label:'Aktif',card2val:8,card3label:'Digunakan',card3val:245,card4label:'Total Diskon',card4val:12500000}},
        customer:{cols:['Nama','Order','Total Belanja','Terakhir Order'],stats:{card1label:'Total Pembeli',card1val:892,card2label:'Repeat Buyer',card2val:312,card3label:'New Buyer',card3val:45,card4label:'Avg. Nilai',card4val:680000}},
        analytics:{cols:['Metrik','Hari Ini','7 Hari','30 Hari'],stats:{card1label:'Visitors',card1val:1240,card2label:'Conversion',card2val:'3.2%',card3label:'Revenue',card3val:45800000,card4label:'Avg. Order',card4val:195000}},
        'api-settings':{cols:['Setting','Nilai','Status'],stats:{card1label:'API Status',card1val:'Online',card2label:'Calls/Hari',card2val:1250,card3label:'Errors',card3val:2,card4label:'Quota',card4val:'92%'}},
    };
    const cfg=pageConfigs[page]||pageConfigs.dashboard;
    return{platform,page,items:[],columns:cfg.cols,stats:cfg.stats,loading:false,syncing:false,search:'',showModal:false,toast:{show:false,msg:''},
    async init(){await this.load()},
    async load(){this.loading=true;try{const r=await fetch(`/api/erp/marketplace/${this.platform}/${this.page}?search=${this.search}`);if(r.ok){const d=await r.json();this.items=d.data||[]}}catch{}finally{this.loading=false}},
    async syncData(){this.syncing=true;this.showToast('Sinkronisasi dimulai...');try{await fetch(`/api/erp/marketplace/${this.platform}/sync`,{method:'POST',headers:{'X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''}})}catch{}setTimeout(()=>{this.syncing=false;this.showToast('Sync selesai — data diperbarui')},2000)},
    openAdd(){this.showToast('Gunakan platform '+this.platform+' langsung untuk menambah data')},
    editItem(item){alert(JSON.stringify(item,null,2))},
    formatRp(n){if(!n)return'Rp 0';if(n>=1000000)return'Rp '+Math.round(n/100000)/10+'Jt';return'Rp '+Number(n).toLocaleString('id-ID')},
    showToast(msg){this.toast={show:true,msg};setTimeout(()=>this.toast.show=false,3000)}
}}
</script>
@endsection
