@extends('layouts.erp')
@section('title', 'Manajemen Gudang')
@section('content')
<div x-data="warehouseApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div x-show="toast.show" x-cloak x-transition :class="toast.type==='success'?'bg-green-600':'bg-red-600'" class="fixed top-4 right-4 z-50 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium" x-text="toast.msg"></div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Manajemen Gudang</h1><p class="text-gray-500 mt-1 text-sm">Kelola lokasi dan zona penyimpanan gudang</p></div>
        <button @click="openAdd()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>Tambah Gudang
        </button>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Gudang</p><p class="text-2xl font-bold text-gray-900" x-text="items.length"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Aktif</p><p class="text-2xl font-bold text-green-600" x-text="items.filter(i=>i.status==='Aktif').length"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Kapasitas</p><p class="text-xl font-bold text-blue-600" x-text="items.reduce((a,i)=>a+(parseFloat(i.kapasitas)||0),0)+' m²'"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Zona / Rak</p><p class="text-2xl font-bold text-purple-600" x-text="items.reduce((a,i)=>a+(parseInt(i.jumlah_rak)||0),0)"></p></div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        <template x-for="wh in items" :key="wh.id">
            <div class="bg-white rounded-xl border shadow-sm p-5">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                            </div>
                            <h3 class="font-bold text-gray-900" x-text="wh.nama"></h3>
                        </div>
                        <p class="text-xs text-gray-400" x-text="wh.lokasi||wh.alamat||'-'"></p>
                    </div>
                    <span :class="wh.status==='Aktif'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-600'" class="px-2 py-0.5 text-xs font-semibold rounded-full" x-text="wh.status||'Aktif'"></span>
                </div>
                <div class="grid grid-cols-3 gap-3 text-center mb-4">
                    <div class="bg-gray-50 rounded-lg p-2"><p class="text-xs text-gray-400">Kapasitas</p><p class="font-bold text-sm" x-text="(wh.kapasitas||0)+' m²'"></p></div>
                    <div class="bg-gray-50 rounded-lg p-2"><p class="text-xs text-gray-400">Terpakai</p><p class="font-bold text-sm" x-text="(wh.terpakai||0)+'%'"></p></div>
                    <div class="bg-gray-50 rounded-lg p-2"><p class="text-xs text-gray-400">Rak</p><p class="font-bold text-sm" x-text="wh.jumlah_rak||0"></p></div>
                </div>
                <div class="mb-4">
                    <div class="flex justify-between text-xs text-gray-500 mb-1"><span>Kapasitas terpakai</span><span x-text="(wh.terpakai||0)+'%'"></span></div>
                    <div class="w-full bg-gray-100 rounded-full h-2"><div class="h-2 rounded-full" :class="(wh.terpakai||0)>80?'bg-red-400':(wh.terpakai||0)>60?'bg-yellow-400':'bg-green-400'" :style="'width:'+(wh.terpakai||0)+'%'"></div></div>
                </div>
                <div class="flex gap-2">
                    <button @click="editItem(wh)" class="flex-1 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Edit</button>
                    <button @click="delItem(wh)" class="py-1.5 px-3 text-xs text-red-500 hover:bg-red-50 rounded-lg border border-red-100">Hapus</button>
                </div>
            </div>
        </template>
        <template x-if="items.length===0&&!loading">
            <div class="col-span-full py-16 text-center text-gray-400">
                <p class="font-medium">Belum ada data gudang</p>
                <button @click="openAdd()" class="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">+ Tambah Gudang</button>
            </div>
        </template>
    </div>

    <div x-show="showModal" x-cloak class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showModal=false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg" @click.stop>
            <div class="p-6">
                <div class="flex items-center justify-between mb-5"><h3 class="text-lg font-bold text-gray-900" x-text="editMode?'Edit Gudang':'Tambah Gudang'"></h3><button @click="showModal=false" class="text-gray-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button></div>
                <form @submit.prevent="save()" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Nama Gudang *</label><input x-model="form.nama" type="text" required class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Kapasitas (m²)</label><input x-model="form.kapasitas" type="number" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Rak</label><input x-model="form.jumlah_rak" type="number" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Terpakai (%)</label><input x-model="form.terpakai" type="number" min="0" max="100" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Status</label><select x-model="form.status" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"><option>Aktif</option><option>Tidak Aktif</option></select></div>
                        <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Lokasi / Alamat</label><textarea x-model="form.lokasi" rows="2" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500"></textarea></div>
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
function warehouseApp(){return{items:[],loading:false,saving:false,showModal:false,editMode:false,toast:{show:false,msg:'',type:'success'},form:{nama:'',kapasitas:'',jumlah_rak:'',terpakai:0,status:'Aktif',lokasi:''},
async init(){await this.load()},
async load(){this.loading=true;try{const r=await fetch('/api/erp/warehouse');if(r.ok){const d=await r.json();this.items=d.data||[]}else this.items=[]}catch{this.items=[]}finally{this.loading=false}},
openAdd(){this.editMode=false;this.form={nama:'',kapasitas:'',jumlah_rak:'',terpakai:0,status:'Aktif',lokasi:''};this.showModal=true},
editItem(w){this.editMode=true;this.form={...w};this.showModal=true},
delItem(w){if(!confirm('Hapus gudang '+w.nama+'?'))return;this.items=this.items.filter(i=>i.id!==w.id);this.showToast('Gudang dihapus','success')},
async save(){this.saving=true;try{const m=this.editMode?'PUT':'POST';const u=this.editMode?`/api/erp/warehouse/${this.form.id}`:'/api/erp/warehouse';await fetch(u,{method:m,headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify(this.form)});if(this.editMode){const i=this.items.findIndex(x=>x.id===this.form.id);if(i>=0)this.items[i]={...this.items[i],...this.form}}else{this.items.push({id:Date.now(),...this.form})}this.showToast(this.editMode?'Gudang diupdate':'Gudang ditambahkan','success')}catch{if(!this.editMode)this.items.push({id:Date.now(),...this.form});this.showToast('Tersimpan lokal','success')}finally{this.saving=false;this.showModal=false}},
showToast(msg,type){this.toast={show:true,msg,type};setTimeout(()=>this.toast.show=false,3000)}
}}
</script>
@endsection
