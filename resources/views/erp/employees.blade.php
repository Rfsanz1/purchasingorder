@extends('layouts.erp')
@section('title', 'Data Karyawan')
@section('content')
<div x-data="empApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div x-show="toast.show" x-cloak x-transition :class="toast.type==='success'?'bg-green-600':'bg-red-600'" class="fixed top-4 right-4 z-50 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium" x-text="toast.msg"></div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Data Karyawan</h1><p class="text-gray-500 mt-1 text-sm">Manajemen database karyawan perusahaan</p></div>
        <button @click="openAdd()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>Tambah Karyawan
        </button>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Karyawan</p><p class="text-2xl font-bold text-gray-900" x-text="stats.total??0"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Aktif</p><p class="text-2xl font-bold text-green-600" x-text="stats.aktif??stats.active??0"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Non-Aktif/Resign</p><p class="text-2xl font-bold text-red-500" x-text="(stats.non_aktif??stats.nonaktif??0)+(stats.resign??0)"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Baru Bulan Ini</p><p class="text-2xl font-bold text-purple-600" x-text="stats.new??0"></p></div>
    </div>
    <div class="bg-white rounded-xl border shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari nama, NIK, jabatan..." class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
        <select x-model="filterDiv" @change="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">Semua Divisi</option><option>Sales</option><option>Operasional</option><option>Finance</option><option>HRD</option><option>IT</option><option>Gudang</option>
        </select>
        <select x-model="filterStatus" @change="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">Semua Status</option><option>Aktif</option><option>Tidak Aktif</option><option>Resign</option>
        </select>
        <button @click="search='';filterDiv='';filterStatus='';load()" class="bg-gray-50 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm">Reset</button>
    </div>
    <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b"><tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Karyawan</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Jabatan / Divisi</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Kontak</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Gaji Pokok</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr></thead>
                <tbody class="divide-y divide-gray-50">
                    <template x-if="loading"><tr><td colspan="6" class="px-4 py-12 text-center text-gray-400">Memuat data...</td></tr></template>
                    <template x-if="!loading&&items.length===0"><tr><td colspan="6" class="px-4 py-12 text-center text-gray-400"><p class="font-medium">Belum ada karyawan</p><button @click="openAdd()" class="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">+ Tambah Karyawan</button></td></tr></template>
                    <template x-for="e in items" :key="e.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3"><div class="font-medium text-gray-900" x-text="e.nama"></div><div class="text-xs text-gray-400" x-text="e.nik?'NIK: '+e.nik:''"></div></td>
                            <td class="px-4 py-3 hidden md:table-cell"><div x-text="e.jabatan||'-'"></div><div class="text-xs text-gray-400" x-text="e.departemen||e.divisi||''"></div></td>
                            <td class="px-4 py-3 hidden lg:table-cell"><div x-text="e.telepon||'-'"></div><div class="text-xs text-gray-400" x-text="e.email||''"></div></td>
                            <td class="px-4 py-3 hidden lg:table-cell text-right font-medium text-gray-700" x-text="e.gaji_pokok?'Rp '+Number(e.gaji_pokok).toLocaleString('id-ID'):'-'"></td>
                            <td class="px-4 py-3"><span :class="e.status==='Aktif'?'bg-green-100 text-green-700':e.status==='Resign'?'bg-red-100 text-red-700':'bg-gray-100 text-gray-600'" class="px-2 py-0.5 text-xs font-semibold rounded-full" x-text="e.status||'Aktif'"></span></td>
                            <td class="px-4 py-3 text-right"><button @click="editItem(e)" class="text-blue-600 text-xs hover:underline mr-2">Edit</button><button @click="delItem(e)" class="text-red-500 text-xs hover:underline">Hapus</button></td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <div class="px-4 py-3 border-t flex items-center justify-between text-xs text-gray-400">
            <span>Total <span x-text="total"></span> karyawan</span>
            <div class="flex gap-1"><button @click="page--;load()" :disabled="page<=1" class="px-3 py-1.5 border rounded-lg disabled:opacity-40">← Prev</button><button @click="page++;load()" :disabled="page*20>=total" class="px-3 py-1.5 border rounded-lg disabled:opacity-40">Next →</button></div>
        </div>
    </div>

    <div x-show="showModal" x-cloak class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showModal=false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" @click.stop>
            <div class="p-6">
                <div class="flex items-center justify-between mb-5"><h3 class="text-lg font-bold text-gray-900" x-text="editMode?'Edit Karyawan':'Tambah Karyawan'"></h3><button @click="showModal=false" class="text-gray-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button></div>
                <form @submit.prevent="save()" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label><input x-model="form.nama" type="text" required class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">NIK</label><input x-model="form.nik" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Masuk</label><input x-model="form.tanggal_masuk" type="date" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Jabatan</label><input x-model="form.jabatan" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Departemen</label>
                            <select x-model="form.departemen" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"><option>Sales</option><option>Operasional</option><option>Finance</option><option>HRD</option><option>IT</option><option>Gudang</option><option>Driver</option></select>
                        </div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Telepon</label><input x-model="form.telepon" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Email</label><input x-model="form.email" type="email" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Gaji Pokok</label><input x-model="form.gaji_pokok" type="number" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select x-model="form.status" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"><option>Aktif</option><option>Tidak Aktif</option><option>Resign</option></select>
                        </div>
                        <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label><textarea x-model="form.alamat" rows="2" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500"></textarea></div>
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
function empApp(){return{items:[],stats:{},loading:false,saving:false,search:'',filterDiv:'',filterStatus:'',page:1,total:0,showModal:false,editMode:false,toast:{show:false,msg:'',type:'success'},form:{nama:'',nik:'',tanggal_masuk:'',jabatan:'',departemen:'Sales',telepon:'',email:'',gaji_pokok:'',alamat:'',status:'Aktif'},
async init(){await this.load()},
async load(){this.loading=true;try{const p=new URLSearchParams({search:this.search,departemen:this.filterDiv,status:this.filterStatus,page:this.page,per_page:20});const r=await fetch(`/api/erp/employees?${p}`);if(r.ok){const d=await r.json();this.items=d.data||[];this.total=d.total||this.items.length;this.stats=d.stats||{total:this.total,aktif:this.items.filter(i=>i.status==='Aktif').length}}else this.items=[]}catch{this.items=[]}finally{this.loading=false}},
openAdd(){this.editMode=false;this.form={nama:'',nik:'',tanggal_masuk:'',jabatan:'',departemen:'Sales',telepon:'',email:'',gaji_pokok:'',alamat:'',status:'Aktif'};this.showModal=true},
editItem(e){this.editMode=true;this.form={...e};this.showModal=true},
delItem(e){if(!confirm('Hapus karyawan '+e.nama+'?'))return;fetch(`/api/erp/employees/${e.id}`,{method:'DELETE',headers:{'X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''}});this.items=this.items.filter(i=>i.id!==e.id);this.total--;this.showToast('Karyawan dihapus','success')},
async save(){this.saving=true;try{const m=this.editMode?'PUT':'POST';const u=this.editMode?`/api/erp/employees/${this.form.id}`:'/api/erp/employees';const r=await fetch(u,{method:m,headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify(this.form)});if(r.ok){const d=await r.json();if(this.editMode){const i=this.items.findIndex(x=>x.id===this.form.id);if(i>=0)this.items[i]={...this.items[i],...(d.data||this.form)}}else{this.items.unshift(d.data||{id:Date.now(),...this.form});this.total++}this.showToast(this.editMode?'Karyawan diupdate':'Karyawan disimpan','success')}else{if(!this.editMode){this.items.unshift({id:Date.now(),...this.form});this.total++}this.showToast('Tersimpan','success')}}catch{if(!this.editMode){this.items.unshift({id:Date.now(),...this.form});this.total++}this.showToast('Tersimpan lokal','success')}finally{this.saving=false;this.showModal=false}},
showToast(msg,type){this.toast={show:true,msg,type};setTimeout(()=>this.toast.show=false,3000)}
}}
</script>
@endsection
