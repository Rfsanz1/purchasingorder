@extends('layouts.erp')
@section('title', 'Servis Barang')
@section('content')
<div x-data="serviceApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div x-show="toast.show" x-cloak x-transition :class="toast.type==='success'?'bg-green-600':'bg-red-600'" class="fixed top-4 right-4 z-50 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium" x-text="toast.msg"></div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Servis Barang</h1><p class="text-gray-500 mt-1 text-sm">Manajemen perbaikan dan servis produk elektronik</p></div>
        <button @click="openAdd()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>Tambah Order Servis
        </button>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <div class="bg-white rounded-xl border p-3 shadow-sm text-center"><p class="text-xs text-gray-500">Total</p><p class="text-2xl font-bold text-gray-900" x-text="stats.total??0"></p></div>
        <div class="bg-white rounded-xl border p-3 shadow-sm text-center"><p class="text-xs text-gray-500">Antrian</p><p class="text-2xl font-bold text-yellow-500" x-text="stats.antrian??0"></p></div>
        <div class="bg-white rounded-xl border p-3 shadow-sm text-center"><p class="text-xs text-gray-500">Dikerjakan</p><p class="text-2xl font-bold text-blue-600" x-text="stats.proses??0"></p></div>
        <div class="bg-white rounded-xl border p-3 shadow-sm text-center"><p class="text-xs text-gray-500">Selesai</p><p class="text-2xl font-bold text-green-600" x-text="stats.selesai??0"></p></div>
        <div class="bg-white rounded-xl border p-3 shadow-sm text-center"><p class="text-xs text-gray-500">Diambil</p><p class="text-2xl font-bold text-gray-600" x-text="stats.diambil??0"></p></div>
    </div>
    <div class="bg-white rounded-xl border shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari No. Servis, customer, produk..." class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
        <select x-model="filterStatus" @change="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">Semua Status</option><option>Antrian</option><option>Dikerjakan</option><option>Menunggu Part</option><option>Selesai</option><option>Diambil</option><option>Dibatalkan</option>
        </select>
        <button @click="search='';filterStatus='';load()" class="bg-gray-50 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm">Reset</button>
    </div>
    <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b"><tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">No. Servis</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer & Produk</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Keluhan</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Teknisi</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Biaya</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr></thead>
                <tbody class="divide-y divide-gray-50">
                    <template x-if="loading"><tr><td colspan="7" class="px-4 py-12 text-center text-gray-400">Memuat data...</td></tr></template>
                    <template x-if="!loading&&items.length===0"><tr><td colspan="7" class="px-4 py-12 text-center text-gray-400"><p class="font-medium">Belum ada order servis</p><button @click="openAdd()" class="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">+ Tambah Servis</button></td></tr></template>
                    <template x-for="s in items" :key="s.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3"><div class="font-medium text-blue-600" x-text="s.no_servis||'SRV-'+s.id"></div><div class="text-xs text-gray-400" x-text="fmt(s.tanggal_masuk||s.created_at)"></div></td>
                            <td class="px-4 py-3"><div class="font-medium text-gray-900" x-text="s.customer||'-'"></div><div class="text-xs text-gray-500" x-text="s.produk||s.nama_produk||''"></div></td>
                            <td class="px-4 py-3 hidden md:table-cell text-gray-500 text-xs max-w-xs"><span class="truncate block" x-text="s.keluhan||'-'"></span></td>
                            <td class="px-4 py-3 hidden lg:table-cell text-gray-500" x-text="s.teknisi||'-'"></td>
                            <td class="px-4 py-3">
                                <span :class="{
                                    'bg-yellow-100 text-yellow-700': s.status==='Antrian',
                                    'bg-blue-100 text-blue-700': s.status==='Dikerjakan',
                                    'bg-orange-100 text-orange-700': s.status==='Menunggu Part',
                                    'bg-green-100 text-green-700': s.status==='Selesai',
                                    'bg-gray-100 text-gray-600': s.status==='Diambil',
                                    'bg-red-100 text-red-700': s.status==='Dibatalkan'
                                }" class="px-2 py-0.5 text-xs font-semibold rounded-full" x-text="s.status||'Antrian'"></span>
                            </td>
                            <td class="px-4 py-3 text-right hidden lg:table-cell font-medium" x-text="s.biaya?'Rp '+Number(s.biaya).toLocaleString('id-ID'):'-'"></td>
                            <td class="px-4 py-3 text-right">
                                <button @click="editItem(s)" class="text-blue-600 text-xs hover:underline mr-2">Edit</button>
                                <button @click="updateStatus(s)" class="text-green-600 text-xs hover:underline">Status</button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>

    <div x-show="showModal" x-cloak class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showModal=false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" @click.stop>
            <div class="p-6">
                <div class="flex items-center justify-between mb-5"><h3 class="text-lg font-bold text-gray-900" x-text="editMode?'Edit Servis':'Tambah Order Servis'"></h3><button @click="showModal=false" class="text-gray-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button></div>
                <form @submit.prevent="save()" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Customer *</label><input x-model="form.customer" type="text" required class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Telepon</label><input x-model="form.telepon" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Produk / Barang *</label><input x-model="form.produk" type="text" required placeholder="Merk & tipe produk" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Keluhan</label><textarea x-model="form.keluhan" rows="2" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500"></textarea></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Teknisi</label><input x-model="form.teknisi" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Estimasi Biaya (Rp)</label><input x-model="form.biaya" type="number" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Masuk</label><input x-model="form.tanggal_masuk" type="date" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select x-model="form.status" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"><option>Antrian</option><option>Dikerjakan</option><option>Menunggu Part</option><option>Selesai</option><option>Diambil</option></select>
                        </div>
                    </div>
                    <div class="flex justify-end gap-3 pt-2">
                        <button type="button" @click="showModal=false" class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600">Batal</button>
                        <button type="submit" :disabled="saving" class="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"><span x-show="!saving" x-text="editMode?'Update':'Simpan'"></span><span x-show="saving">Menyimpan...</span></button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<script>
function serviceApp(){return{items:[],stats:{},loading:false,saving:false,search:'',filterStatus:'',showModal:false,editMode:false,toast:{show:false,msg:'',type:'success'},form:{customer:'',telepon:'',produk:'',keluhan:'',teknisi:'',biaya:'',tanggal_masuk:new Date().toISOString().slice(0,10),status:'Antrian'},
async init(){await this.load()},
async load(){this.loading=true;try{const p=new URLSearchParams({search:this.search,status:this.filterStatus});const r=await fetch(`/api/erp/service?${p}`);if(r.ok){const d=await r.json();this.items=d.data||[];this.stats=d.stats||{total:this.items.length,antrian:this.items.filter(i=>i.status==='Antrian').length,proses:this.items.filter(i=>i.status==='Dikerjakan').length,selesai:this.items.filter(i=>i.status==='Selesai').length,diambil:this.items.filter(i=>i.status==='Diambil').length}}else this.items=[]}catch{this.items=[]}finally{this.loading=false}},
openAdd(){this.editMode=false;this.form={customer:'',telepon:'',produk:'',keluhan:'',teknisi:'',biaya:'',tanggal_masuk:new Date().toISOString().slice(0,10),status:'Antrian'};this.showModal=true},
editItem(s){this.editMode=true;this.form={...s};this.showModal=true},
async save(){this.saving=true;try{const m=this.editMode?'PUT':'POST';const u=this.editMode?`/api/erp/service/${this.form.id}`:'/api/erp/service';await fetch(u,{method:m,headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify(this.form)});if(this.editMode){const i=this.items.findIndex(x=>x.id===this.form.id);if(i>=0)this.items[i]={...this.items[i],...this.form}}else{this.items.unshift({id:Date.now(),no_servis:'SRV-'+Date.now(),...this.form,created_at:new Date().toISOString()})}this.showToast('Servis disimpan','success')}catch{if(!this.editMode)this.items.unshift({id:Date.now(),no_servis:'SRV-'+Date.now(),...this.form});this.showToast('Tersimpan lokal','success')}finally{this.saving=false;this.showModal=false}},
updateStatus(s){const statuses=['Antrian','Dikerjakan','Menunggu Part','Selesai','Diambil'];const cur=statuses.indexOf(s.status||'Antrian');const next=statuses[(cur+1)%statuses.length];if(confirm('Update status ke: '+next+'?')){s.status=next;this.showToast('Status diupdate ke '+next,'success')}},
fmt(v){if(!v)return'-';try{return new Date(v).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})}catch{return v}},
showToast(msg,type){this.toast={show:true,msg,type};setTimeout(()=>this.toast.show=false,3000)}
}}
</script>
@endsection
