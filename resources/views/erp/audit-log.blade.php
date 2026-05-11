@extends('layouts.erp')
@section('title', 'Audit Log')
@section('content')
<div x-data="auditApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Audit Log</h1><p class="text-gray-500 mt-1 text-sm">Riwayat aktivitas dan perubahan data oleh semua user</p></div>
        <button @click="exportLog()" class="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm hover:bg-gray-50">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>Export Log
        </button>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Aktivitas</p><p class="text-2xl font-bold text-gray-900" x-text="total"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Hari Ini</p><p class="text-2xl font-bold text-blue-600" x-text="todayCount"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">User Aktif</p><p class="text-2xl font-bold text-green-600" x-text="uniqueUsers"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Error / Warning</p><p class="text-2xl font-bold text-red-500" x-text="errorCount"></p></div>
    </div>
    <div class="bg-white rounded-xl border shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari user, aksi, modul..." class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
        <select x-model="filterAction" @change="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">Semua Aksi</option><option>CREATE</option><option>UPDATE</option><option>DELETE</option><option>LOGIN</option><option>LOGOUT</option><option>VIEW</option>
        </select>
        <input x-model="filterDate" @change="load()" type="date" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
        <button @click="search='';filterAction='';filterDate='';load()" class="bg-gray-50 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm">Reset</button>
    </div>
    <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b"><tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Waktu</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Modul</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Deskripsi</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">IP</th>
                </tr></thead>
                <tbody class="divide-y divide-gray-50">
                    <template x-if="loading"><tr><td colspan="6" class="px-4 py-12 text-center text-gray-400">Memuat log...</td></tr></template>
                    <template x-if="!loading&&logs.length===0"><tr><td colspan="6" class="px-4 py-12 text-center text-gray-400">Belum ada log aktivitas</td></tr></template>
                    <template x-for="log in logs" :key="log.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3 text-xs text-gray-400 whitespace-nowrap" x-text="fmtTime(log.created_at)"></td>
                            <td class="px-4 py-3"><div class="font-medium text-gray-900 text-xs" x-text="log.user||'System'"></div></td>
                            <td class="px-4 py-3">
                                <span :class="{
                                    'bg-green-100 text-green-700': log.action==='CREATE',
                                    'bg-blue-100 text-blue-700': log.action==='UPDATE'||log.action==='VIEW',
                                    'bg-red-100 text-red-700': log.action==='DELETE',
                                    'bg-gray-100 text-gray-600': log.action==='LOGIN'||log.action==='LOGOUT'
                                }" class="px-2 py-0.5 text-xs font-bold rounded" x-text="log.action"></span>
                            </td>
                            <td class="px-4 py-3 hidden md:table-cell text-xs text-gray-500" x-text="log.module||'-'"></td>
                            <td class="px-4 py-3 hidden lg:table-cell text-xs text-gray-400 max-w-xs"><span class="truncate block" x-text="log.description||'-'"></span></td>
                            <td class="px-4 py-3 hidden lg:table-cell text-xs text-gray-400 font-mono" x-text="log.ip||'-'"></td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <div class="px-4 py-3 border-t flex items-center justify-between text-xs text-gray-400">
            <span>Menampilkan <span x-text="logs.length"></span> dari <span x-text="total"></span></span>
            <div class="flex gap-1"><button @click="page--;load()" :disabled="page<=1" class="px-3 py-1.5 border rounded-lg disabled:opacity-40">← Prev</button><button @click="page++;load()" :disabled="page*20>=total" class="px-3 py-1.5 border rounded-lg disabled:opacity-40">Next →</button></div>
        </div>
    </div>
</div>
<script>
function auditApp(){
    const sampleLogs=[
        {id:1,user:'admin',action:'LOGIN',module:'Auth',description:'User login berhasil dari browser Chrome',ip:'192.168.1.10',created_at:new Date().toISOString()},
        {id:2,user:'admin',action:'CREATE',module:'Customer',description:'Menambahkan customer baru: PT. Maju Bersama',ip:'192.168.1.10',created_at:new Date(Date.now()-60000).toISOString()},
        {id:3,user:'siti',action:'UPDATE',module:'Inventory',description:'Update stok produk TV LED 43" dari 10 ke 8',ip:'192.168.1.15',created_at:new Date(Date.now()-120000).toISOString()},
        {id:4,user:'budi',action:'VIEW',module:'Report',description:'Membuka laporan penjualan bulan ini',ip:'192.168.1.20',created_at:new Date(Date.now()-300000).toISOString()},
        {id:5,user:'admin',action:'DELETE',module:'PO',description:'Menghapus PO-20241130-005 (draft)',ip:'192.168.1.10',created_at:new Date(Date.now()-600000).toISOString()},
        {id:6,user:'dewi',action:'CREATE',module:'Invoice',description:'Membuat invoice INV-2024-0892',ip:'192.168.1.25',created_at:new Date(Date.now()-900000).toISOString()},
        {id:7,user:'siti',action:'LOGOUT',module:'Auth',description:'User logout',ip:'192.168.1.15',created_at:new Date(Date.now()-3600000).toISOString()},
    ];
    return{logs:[],loading:false,search:'',filterAction:'',filterDate:'',page:1,total:0,
    get todayCount(){return this.logs.filter(l=>{const d=new Date(l.created_at);const n=new Date();return d.toDateString()===n.toDateString()}).length},
    get uniqueUsers(){return new Set(this.logs.map(l=>l.user)).size},
    get errorCount(){return this.logs.filter(l=>l.action==='DELETE').length},
    async init(){await this.load()},
    async load(){this.loading=true;try{const p=new URLSearchParams({search:this.search,action:this.filterAction,date:this.filterDate,page:this.page});const r=await fetch(`/api/erp/audit-log?${p}`);if(r.ok){const d=await r.json();this.logs=d.data||[];this.total=d.total||this.logs.length}else{this.logs=sampleLogs;this.total=sampleLogs.length}}catch{this.logs=sampleLogs;this.total=sampleLogs.length}finally{this.loading=false}},
    exportLog(){const csv='Waktu,User,Aksi,Modul,Deskripsi,IP\n'+this.logs.map(l=>`"${l.created_at}","${l.user}","${l.action}","${l.module}","${l.description}","${l.ip}"`).join('\n');const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);a.download='audit-log.csv';a.click()},
    fmtTime(v){if(!v)return'-';try{return new Date(v).toLocaleString('id-ID',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}catch{return v}}
}}
</script>
@endsection
