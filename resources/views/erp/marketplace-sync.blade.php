@extends('layouts.erp')
@section('title', 'Sinkronisasi Marketplace')
@section('content')
<div x-data="syncApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div x-show="toast.show" x-cloak x-transition :class="toast.type==='success'?'bg-green-600':'bg-red-600'" class="fixed top-4 right-4 z-50 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium" x-text="toast.msg"></div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Sinkronisasi Marketplace</h1><p class="text-gray-500 mt-1 text-sm">Sinkronkan produk, stok, dan harga ke semua marketplace</p></div>
        <button @click="syncAll()" :disabled="isSyncing" class="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" :class="isSyncing?'animate-spin':''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <span x-text="isSyncing?'Syncing...':'Sync Semua'"></span>
        </button>
    </div>

    {{-- Platform sync cards --}}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <template x-for="p in platforms" :key="p.slug">
            <div class="bg-white rounded-xl border shadow-sm p-5">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" :style="'background:'+p.color" x-text="p.name.charAt(0)"></div>
                        <div>
                            <h3 class="font-bold text-gray-900" x-text="p.name"></h3>
                            <span :class="p.connected?'text-green-600':'text-red-500'" class="text-xs font-medium" x-text="p.connected?'● Terhubung':'● Tidak Terhubung'"></span>
                        </div>
                    </div>
                    <span class="text-xs text-gray-400" x-text="'Sync: '+p.lastSync"></span>
                </div>
                <div class="grid grid-cols-3 gap-2 mb-4">
                    <div class="text-center bg-gray-50 rounded-lg p-2">
                        <p class="text-xs text-gray-500">Produk</p>
                        <p class="font-bold text-sm" x-text="p.products"></p>
                    </div>
                    <div class="text-center bg-gray-50 rounded-lg p-2">
                        <p class="text-xs text-gray-500">Stok Sync</p>
                        <p class="font-bold text-sm" x-text="p.stockSynced+'%'"></p>
                    </div>
                    <div class="text-center bg-gray-50 rounded-lg p-2">
                        <p class="text-xs text-gray-500">Harga Sync</p>
                        <p class="font-bold text-sm" x-text="p.priceSynced+'%'"></p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button @click="syncPlatform(p,'produk')" :disabled="p.syncing||!p.connected" class="flex-1 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-40 font-medium">Sync Produk</button>
                    <button @click="syncPlatform(p,'stok')" :disabled="p.syncing||!p.connected" class="flex-1 py-1.5 text-xs bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-40 font-medium">Sync Stok</button>
                    <button @click="syncPlatform(p,'harga')" :disabled="p.syncing||!p.connected" class="flex-1 py-1.5 text-xs bg-orange-600 hover:bg-orange-700 text-white rounded-lg disabled:opacity-40 font-medium">Sync Harga</button>
                </div>
                <div x-show="p.syncing" class="mt-3">
                    <div class="w-full bg-gray-100 rounded-full h-2"><div class="h-2 rounded-full bg-blue-500 transition-all duration-500" :style="'width:'+p.progress+'%'"></div></div>
                    <p class="text-xs text-gray-500 mt-1 text-center" x-text="p.progress+'% selesai'"></p>
                </div>
            </div>
        </template>
    </div>

    {{-- Sync Log --}}
    <div class="bg-white rounded-xl border shadow-sm">
        <div class="p-4 border-b flex items-center justify-between">
            <h3 class="font-bold text-gray-900">Log Sinkronisasi</h3>
            <button @click="logs=[]" class="text-xs text-gray-400 hover:text-gray-600">Bersihkan</button>
        </div>
        <div class="p-4 space-y-2 max-h-64 overflow-y-auto">
            <template x-if="logs.length===0">
                <p class="text-center text-gray-400 text-sm py-4">Belum ada log sinkronisasi</p>
            </template>
            <template x-for="(log,i) in logs" :key="i">
                <div class="flex items-start gap-2 text-xs">
                    <span :class="log.type==='success'?'text-green-600':log.type==='error'?'text-red-500':'text-blue-600'" class="font-bold shrink-0" x-text="log.type==='success'?'✓':log.type==='error'?'✗':'ℹ'"></span>
                    <span class="text-gray-400 shrink-0" x-text="log.time"></span>
                    <span class="text-gray-700" x-text="log.msg"></span>
                </div>
            </template>
        </div>
    </div>
</div>
<script>
function syncApp(){return{isSyncing:false,platforms:[
    {slug:'shopee',name:'Shopee',color:'#EE4D2D',connected:true,products:145,stockSynced:98,priceSynced:100,lastSync:'5 mnt lalu',syncing:false,progress:0},
    {slug:'tiktok',name:'TikTok Shop',color:'#010101',connected:true,products:89,stockSynced:95,priceSynced:100,lastSync:'12 mnt lalu',syncing:false,progress:0},
    {slug:'tokopedia',name:'Tokopedia',color:'#00AA5B',connected:false,products:0,stockSynced:0,priceSynced:0,lastSync:'Belum sync',syncing:false,progress:0},
    {slug:'lazada',name:'Lazada',color:'#0F146D',connected:false,products:0,stockSynced:0,priceSynced:0,lastSync:'Belum sync',syncing:false,progress:0},
],logs:[],toast:{show:false,msg:'',type:'success'},
async init(){this.addLog('info','Sistem sync siap')},
addLog(type,msg){this.logs.unshift({type,msg,time:new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'})});if(this.logs.length>20)this.logs.pop()},
async syncPlatform(p,type){if(!p.connected){this.showToast('Platform belum terhubung','error');return}p.syncing=true;p.progress=0;this.addLog('info','Memulai sync '+type+' ke '+p.name+'...');const interval=setInterval(()=>{p.progress=Math.min(p.progress+Math.random()*20+5,100);if(p.progress>=100){clearInterval(interval);p.syncing=false;p.lastSync='Baru saja';if(type==='stok')p.stockSynced=100;if(type==='harga')p.priceSynced=100;this.addLog('success','Sync '+type+' ke '+p.name+' berhasil');this.showToast('Sync '+type+' ke '+p.name+' selesai','success')}},300)},
async syncAll(){this.isSyncing=true;this.addLog('info','Memulai sync semua platform...');const connected=this.platforms.filter(p=>p.connected);for(const p of connected){await this.syncPlatform(p,'produk');await new Promise(r=>setTimeout(r,500));await this.syncPlatform(p,'stok')}setTimeout(()=>{this.isSyncing=false;this.showToast('Semua platform berhasil disync','success')},3000)},
showToast(msg,type){this.toast={show:true,msg,type};setTimeout(()=>this.toast.show=false,3000)}
}}
</script>
@endsection
