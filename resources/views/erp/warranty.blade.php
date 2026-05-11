@extends('layouts.erp')
@section('title', 'Klaim Garansi')
@section('content')
<div x-data="warrantyApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div x-show="toast.show" x-cloak x-transition :class="toast.type==='success'?'bg-green-600':'bg-red-600'" class="fixed top-4 right-4 z-50 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium" x-text="toast.msg"></div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Klaim Garansi</h1><p class="text-gray-500 mt-1 text-sm">Proses dan kelola klaim garansi produk elektronik</p></div>
        <button @click="openAdd()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>Tambah Klaim
        </button>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Klaim</p><p class="text-2xl font-bold text-gray-900" x-text="items.length"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Diproses</p><p class="text-2xl font-bold text-blue-600" x-text="items.filter(i=>i.status==='Diproses').length"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Disetujui</p><p class="text-2xl font-bold text-green-600" x-text="items.filter(i=>i.status==='Disetujui').length"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Ditolak</p><p class="text-2xl font-bold text-red-500" x-text="items.filter(i=>i.status==='Ditolak').length"></p></div>
    </div>
    <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div class="p-4 border-b flex flex-col sm:flex-row gap-3">
            <input x-model="search" @input.debounce.300ms="filter()" type="text" placeholder="Cari customer, produk, no. garansi..." class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
            <select x-model="filterStatus" @change="filter()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option value="">Semua Status</option><option>Diproses</option><option>Disetujui</option><option>Ditolak</option><option>Selesai</option>
            </select>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b"><tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">No. Klaim</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer & Produk</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">No. Garansi</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Alasan Klaim</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr></thead>
                <tbody class="divide-y divide-gray-50">
                    <template x-if="loading"><tr><td colspan="6" class="px-4 py-12 text-center text-gray-400">Memuat data...</td></tr></template>
                    <template x-if="!loading&&filtered.length===0"><tr><td colspan="6" class="px-4 py-12 text-center text-gray-400"><p class="font-medium">Belum ada klaim garansi</p><button @click="openAdd()" class="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">+ Tambah Klaim</button></td></tr></template>
                    <template x-for="w in filtered" :key="w.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3"><div class="font-medium text-blue-600" x-text="w.no_klaim||'WRN-'+w.id"></div><div class="text-xs text-gray-400" x-text="fmt(w.tanggal||w.created_at)"></div></td>
                            <td class="px-4 py-3"><div class="font-medium text-gray-900" x-text="w.customer||'-'"></div><div class="text-xs text-gray-500" x-text="w.produk||''"></div></td>
                            <td class="px-4 py-3 hidden md:table-cell text-xs font-mono text-gray-500" x-text="w.no_garansi||'-'"></td>
                            <td class="px-4 py-3 hidden lg:table-cell text-xs text-gray-400 max-w-xs"><span class="truncate block" x-text="w.alasan||'-'"></span></td>
                            <td class="px-4 py-3">
                                <span :class="{
                                    'bg-blue-100 text-blue-700': w.status==='Diproses',
                                    'bg-green-100 text-green-700': w.status==='Disetujui'||w.status==='Selesai',
                                    'bg-red-100 text-red-700': w.status==='Ditolak'
                                }" class="px-2 py-0.5 text-xs font-semibold rounded-full" x-text="w.status||'Diproses'"></span>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <button @click="editItem(w)" class="text-blue-600 text-xs hover:underline mr-2">Edit</button>
                                <button @click="approveItem(w)" x-show="w.status==='Diproses'" class="text-green-600 text-xs hover:underline">Setujui</button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>

    <div x-show="showModal" x-cloak class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showModal=false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg" @click.stop>
            <div class="p-6">
                <div class="flex items-center justify-between mb-5"><h3 class="text-lg font-bold text-gray-900" x-text="editMode?'Edit Klaim':'Tambah Klaim Garansi'"></h3><button @click="showModal=false" class="text-gray-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button></div>
                <form @submit.prevent="save()" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Customer *</label><input x-model="form.customer" type="text" required class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Telepon</label><input x-model="form.telepon" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Produk *</label><input x-model="form.produk" type="text" required class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">No. Garansi</label><input x-model="form.no_garansi" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Status</label><select x-model="form.status" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"><option>Diproses</option><option>Disetujui</option><option>Ditolak</option><option>Selesai</option></select></div>
                        <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Alasan Klaim</label><textarea x-model="form.alasan" rows="3" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500"></textarea></div>
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
function warrantyApp(){return{items:[],filtered:[],loading:false,saving:false,search:'',filterStatus:'',showModal:false,editMode:false,toast:{show:false,msg:'',type:'success'},form:{customer:'',telepon:'',produk:'',no_garansi:'',alasan:'',status:'Diproses'},
async init(){await this.load()},
async load(){this.loading=true;try{const r=await fetch('/api/erp/warranty');if(r.ok){const d=await r.json();this.items=d.data||[]}else this.items=[]}catch{this.items=[]}finally{this.loading=false;this.filter()}},
filter(){let a=this.items;if(this.search){const s=this.search.toLowerCase();a=a.filter(i=>(i.customer||'').toLowerCase().includes(s)||(i.produk||'').toLowerCase().includes(s)||(i.no_garansi||'').toLowerCase().includes(s))}if(this.filterStatus)a=a.filter(i=>i.status===this.filterStatus);this.filtered=a},
openAdd(){this.editMode=false;this.form={customer:'',telepon:'',produk:'',no_garansi:'',alasan:'',status:'Diproses'};this.showModal=true},
editItem(w){this.editMode=true;this.form={...w};this.showModal=true},
approveItem(w){w.status='Disetujui';this.filter();this.showToast('Klaim disetujui','success')},
async save(){this.saving=true;try{await fetch(this.editMode?`/api/erp/warranty/${this.form.id}`:'/api/erp/warranty',{method:this.editMode?'PUT':'POST',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify(this.form)});if(this.editMode){const i=this.items.findIndex(x=>x.id===this.form.id);if(i>=0)this.items[i]={...this.items[i],...this.form}}else this.items.unshift({id:Date.now(),no_klaim:'WRN-'+Date.now(),...this.form,created_at:new Date().toISOString()});this.showToast('Klaim disimpan','success')}catch{if(!this.editMode)this.items.unshift({id:Date.now(),no_klaim:'WRN-'+Date.now(),...this.form,created_at:new Date().toISOString()});this.showToast('Tersimpan lokal','success')}finally{this.saving=false;this.showModal=false;this.filter()}},
fmt(v){if(!v)return'-';try{return new Date(v).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})}catch{return v}},
showToast(msg,type){this.toast={show:true,msg,type};setTimeout(()=>this.toast.show=false,3000)}
}}
</script>
@endsection
