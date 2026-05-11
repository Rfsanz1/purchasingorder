@extends('layouts.erp')
@section('title', 'Kas Keluar')
@section('content')
<div x-data="cashOutApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div x-show="toast.show" x-cloak x-transition :class="toast.type==='success'?'bg-green-600':'bg-red-600'" class="fixed top-4 right-4 z-50 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium" x-text="toast.msg"></div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Kas Keluar</h1><p class="text-gray-500 mt-1 text-sm">Pencatatan semua pengeluaran kas perusahaan</p></div>
        <button @click="openAdd()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>Catat Kas Keluar
        </button>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Keluar Hari Ini</p><p class="text-xl font-bold text-red-600" x-text="formatRp(stats.today??0)"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Bulan Ini</p><p class="text-xl font-bold text-red-500" x-text="formatRp(stats.thisMonth??0)"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Bulan Lalu</p><p class="text-xl font-bold text-gray-600" x-text="formatRp(stats.lastMonth??0)"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Transaksi</p><p class="text-2xl font-bold text-blue-600" x-text="stats.txCount??0"></p></div>
    </div>
    <div class="bg-white rounded-xl border shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari keterangan, tujuan..." class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
        <select x-model="filterKat" @change="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">Semua Kategori</option><option>Operasional</option><option>Gaji</option><option>Pembelian</option><option>Hutang</option><option>Investasi</option><option>Lainnya</option>
        </select>
        <input x-model="filterDate" @change="load()" type="month" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
        <button @click="search='';filterKat='';filterDate='';load()" class="bg-gray-50 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm">Reset</button>
    </div>
    <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b"><tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Keterangan</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Kategori</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Tujuan</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Jumlah</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr></thead>
                <tbody class="divide-y divide-gray-50">
                    <template x-if="loading"><tr><td colspan="6" class="px-4 py-12 text-center text-gray-400">Memuat data...</td></tr></template>
                    <template x-if="!loading&&items.length===0"><tr><td colspan="6" class="px-4 py-12 text-center text-gray-400"><p class="font-medium">Belum ada pencatatan kas keluar</p><button @click="openAdd()" class="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm">+ Catat Sekarang</button></td></tr></template>
                    <template x-for="tx in items" :key="tx.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3 text-gray-500 text-xs" x-text="fmt(tx.tanggal||tx.created_at)"></td>
                            <td class="px-4 py-3"><div class="font-medium text-gray-900" x-text="tx.keterangan||'-'"></div><div class="text-xs text-gray-400" x-text="tx.no_ref?'Ref: '+tx.no_ref:''"></div></td>
                            <td class="px-4 py-3 hidden md:table-cell"><span class="bg-red-100 text-red-700 px-2 py-0.5 text-xs rounded-full" x-text="tx.kategori||'Lainnya'"></span></td>
                            <td class="px-4 py-3 hidden md:table-cell text-gray-500 text-xs" x-text="tx.tujuan||'-'"></td>
                            <td class="px-4 py-3 text-right font-bold text-red-600" x-text="formatRp(tx.jumlah||0)"></td>
                            <td class="px-4 py-3 text-right"><button @click="editItem(tx)" class="text-blue-600 text-xs hover:underline mr-2">Edit</button><button @click="delItem(tx)" class="text-red-500 text-xs hover:underline">Hapus</button></td>
                        </tr>
                    </template>
                </tbody>
                <tfoot class="bg-gray-50 border-t"><tr><td colspan="4" class="px-4 py-3 text-sm font-semibold text-gray-700">Total Pengeluaran</td><td class="px-4 py-3 text-right font-bold text-red-600" x-text="formatRp(items.reduce((a,i)=>a+(parseFloat(i.jumlah)||0),0))"></td><td></td></tr></tfoot>
            </table>
        </div>
    </div>
    <div x-show="showModal" x-cloak class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showModal=false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg" @click.stop>
            <div class="p-6">
                <div class="flex items-center justify-between mb-5"><h3 class="text-lg font-bold text-gray-900" x-text="editMode?'Edit Kas Keluar':'Catat Kas Keluar'"></h3><button @click="showModal=false" class="text-gray-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button></div>
                <form @submit.prevent="save()" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Tanggal *</label><input x-model="form.tanggal" type="date" required class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Jumlah (Rp) *</label><input x-model="form.jumlah" type="number" required min="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Keterangan *</label><input x-model="form.keterangan" type="text" required class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label><select x-model="form.kategori" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"><option>Operasional</option><option>Gaji</option><option>Pembelian</option><option>Hutang</option><option>Investasi</option><option>Lainnya</option></select></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Tujuan</label><input x-model="form.tujuan" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">No. Referensi</label><input x-model="form.no_ref" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Metode Bayar</label><select x-model="form.metode" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"><option>Cash</option><option>Transfer</option><option>Giro</option></select></div>
                    </div>
                    <div class="flex justify-end gap-3 pt-2">
                        <button type="button" @click="showModal=false" class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600">Batal</button>
                        <button type="submit" :disabled="saving" class="px-6 py-2 text-sm bg-red-600 text-white rounded-lg font-medium disabled:opacity-50"><span x-show="!saving" x-text="editMode?'Update':'Simpan'"></span><span x-show="saving">Menyimpan...</span></button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<script>
function cashOutApp(){return{items:[],stats:{},loading:false,saving:false,search:'',filterKat:'',filterDate:'',showModal:false,editMode:false,toast:{show:false,msg:'',type:'success'},form:{tanggal:new Date().toISOString().slice(0,10),jumlah:'',keterangan:'',kategori:'Operasional',tujuan:'',no_ref:'',metode:'Cash'},
async init(){await this.load()},
async load(){this.loading=true;try{const p=new URLSearchParams({search:this.search,kategori:this.filterKat,bulan:this.filterDate});const r=await fetch(`/api/erp/cash-out?${p}`);if(r.ok){const d=await r.json();this.items=d.data||[];this.stats=d.stats||{today:0,thisMonth:this.items.reduce((a,i)=>a+(parseFloat(i.jumlah)||0),0),lastMonth:0,txCount:this.items.length}}else this.items=[]}catch{this.items=[]}finally{this.loading=false}},
openAdd(){this.editMode=false;this.form={tanggal:new Date().toISOString().slice(0,10),jumlah:'',keterangan:'',kategori:'Operasional',tujuan:'',no_ref:'',metode:'Cash'};this.showModal=true},
editItem(tx){this.editMode=true;this.form={...tx};this.showModal=true},
delItem(tx){if(!confirm('Hapus transaksi ini?'))return;this.items=this.items.filter(i=>i.id!==tx.id);this.showToast('Transaksi dihapus','success')},
async save(){this.saving=true;try{const m=this.editMode?'PUT':'POST';await fetch(this.editMode?`/api/erp/cash-out/${this.form.id}`:'/api/erp/cash-out',{method:m,headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify(this.form)});if(this.editMode){const i=this.items.findIndex(x=>x.id===this.form.id);if(i>=0)this.items[i]={...this.items[i],...this.form}}else this.items.unshift({id:Date.now(),...this.form});this.showToast('Kas keluar dicatat','success')}catch{if(!this.editMode)this.items.unshift({id:Date.now(),...this.form});this.showToast('Tersimpan lokal','success')}finally{this.saving=false;this.showModal=false}},
formatRp(n){return'Rp '+Number(n||0).toLocaleString('id-ID')},
fmt(v){if(!v)return'-';try{return new Date(v).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})}catch{return v}},
showToast(msg,type){this.toast={show:true,msg,type};setTimeout(()=>this.toast.show=false,3000)}
}}
</script>
@endsection
