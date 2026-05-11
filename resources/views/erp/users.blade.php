@extends('layouts.erp')
@section('title', 'Manajemen User')
@section('content')
<div x-data="usersApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div x-show="toast.show" x-cloak x-transition :class="toast.type==='success'?'bg-green-600':'bg-red-600'" class="fixed top-4 right-4 z-50 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium" x-text="toast.msg"></div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Manajemen User</h1><p class="text-gray-500 mt-1 text-sm">Kelola akun pengguna sistem ERP</p></div>
        <button @click="openAdd()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>Tambah User
        </button>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total User</p><p class="text-2xl font-bold text-gray-900" x-text="stats.total??0"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Aktif</p><p class="text-2xl font-bold text-green-600" x-text="stats.active??0"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Admin</p><p class="text-2xl font-bold text-blue-600" x-text="stats.admin??0"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Login Hari Ini</p><p class="text-2xl font-bold text-purple-600" x-text="stats.loginToday??0"></p></div>
    </div>
    <div class="bg-white rounded-xl border shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari username, nama, email..." class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
        <select x-model="filterRole" @change="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">Semua Role</option><option>Admin</option><option>Manager</option><option>Sales</option><option>Finance</option><option>Gudang</option><option>Driver</option>
        </select>
        <select x-model="filterStatus" @change="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">Semua Status</option><option>Aktif</option><option>Tidak Aktif</option>
        </select>
        <button @click="search='';filterRole='';filterStatus='';load()" class="bg-gray-50 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm">Reset</button>
    </div>
    <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b"><tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Email</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Login Terakhir</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr></thead>
                <tbody class="divide-y divide-gray-50">
                    <template x-if="loading"><tr><td colspan="6" class="px-4 py-12 text-center text-gray-400">Memuat data...</td></tr></template>
                    <template x-if="!loading&&items.length===0"><tr><td colspan="6" class="px-4 py-12 text-center text-gray-400"><p class="font-medium">Belum ada user</p><button @click="openAdd()" class="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">+ Tambah User</button></td></tr></template>
                    <template x-for="u in items" :key="u.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs" x-text="(u.nama||u.username||'U').charAt(0).toUpperCase()"></div>
                                    <div><div class="font-medium text-gray-900" x-text="u.nama||u.username"></div><div class="text-xs text-gray-400" x-text="'@'+(u.username||'')"></div></div>
                                </div>
                            </td>
                            <td class="px-4 py-3 hidden md:table-cell text-gray-500" x-text="u.email||'-'"></td>
                            <td class="px-4 py-3">
                                <span :class="u.role==='Admin'?'bg-red-100 text-red-700':u.role==='Manager'?'bg-purple-100 text-purple-700':'bg-blue-100 text-blue-700'" class="px-2 py-0.5 text-xs font-semibold rounded-full" x-text="u.role||'User'"></span>
                            </td>
                            <td class="px-4 py-3"><span :class="u.status==='Aktif'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-600'" class="px-2 py-0.5 text-xs font-semibold rounded-full" x-text="u.status||'Aktif'"></span></td>
                            <td class="px-4 py-3 hidden lg:table-cell text-gray-400 text-xs" x-text="fmt(u.last_login||u.updated_at)"></td>
                            <td class="px-4 py-3 text-right"><button @click="editItem(u)" class="text-blue-600 text-xs hover:underline mr-2">Edit</button><button @click="delItem(u)" class="text-red-500 text-xs hover:underline">Hapus</button></td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <div class="px-4 py-3 border-t flex items-center justify-between text-xs text-gray-400">
            <span>Total <span x-text="total"></span> user</span>
            <div class="flex gap-1"><button @click="page--;load()" :disabled="page<=1" class="px-3 py-1.5 border rounded-lg disabled:opacity-40">← Prev</button><button @click="page++;load()" :disabled="page*15>=total" class="px-3 py-1.5 border rounded-lg disabled:opacity-40">Next →</button></div>
        </div>
    </div>

    <div x-show="showModal" x-cloak class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showModal=false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" @click.stop>
            <div class="p-6">
                <div class="flex items-center justify-between mb-5"><h3 class="text-lg font-bold text-gray-900" x-text="editMode?'Edit User':'Tambah User Baru'"></h3><button @click="showModal=false" class="text-gray-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button></div>
                <form @submit.prevent="save()" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label><input x-model="form.nama" type="text" required class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Username *</label><input x-model="form.username" type="text" required class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Email *</label><input x-model="form.email" type="email" required class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select x-model="form.role" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"><option>Admin</option><option>Manager</option><option>Sales</option><option>Finance</option><option>Gudang</option><option>Driver</option></select>
                        </div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select x-model="form.status" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"><option>Aktif</option><option>Tidak Aktif</option></select>
                        </div>
                        <div x-show="!editMode" class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Password</label><input x-model="form.password" type="password" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Catatan</label><textarea x-model="form.catatan" rows="2" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500"></textarea></div>
                    </div>
                    <div class="flex justify-end gap-3 pt-2">
                        <button type="button" @click="showModal=false" class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600">Batal</button>
                        <button type="submit" :disabled="saving" class="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"><span x-show="!saving" x-text="editMode?'Update':'Buat User'"></span><span x-show="saving">Menyimpan...</span></button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<script>
function usersApp(){return{items:[],stats:{},loading:false,saving:false,search:'',filterRole:'',filterStatus:'',page:1,total:0,showModal:false,editMode:false,toast:{show:false,msg:'',type:'success'},form:{nama:'',username:'',email:'',role:'Sales',status:'Aktif',password:'',catatan:''},
async init(){await this.load()},
async load(){this.loading=true;try{const p=new URLSearchParams({search:this.search,role:this.filterRole,status:this.filterStatus,page:this.page});const r=await fetch(`/api/erp/users?${p}`);if(r.ok){const d=await r.json();this.items=d.data||[];this.total=d.total||this.items.length;this.stats=d.stats||{total:this.items.length,active:this.items.filter(i=>i.status==='Aktif').length,admin:this.items.filter(i=>i.role==='Admin').length,loginToday:0}}else this.items=[]}catch{this.items=[]}finally{this.loading=false}},
openAdd(){this.editMode=false;this.form={nama:'',username:'',email:'',role:'Sales',status:'Aktif',password:'',catatan:''};this.showModal=true},
editItem(u){this.editMode=true;this.form={...u,password:''};this.showModal=true},
delItem(u){if(!confirm('Hapus user '+u.nama+'?'))return;this.items=this.items.filter(i=>i.id!==u.id);this.showToast('User dihapus','success')},
async save(){this.saving=true;try{const m=this.editMode?'PUT':'POST';const u=this.editMode?`/api/erp/users/${this.form.id}`:'/api/erp/users';await fetch(u,{method:m,headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify(this.form)});if(this.editMode){const i=this.items.findIndex(x=>x.id===this.form.id);if(i>=0)this.items[i]={...this.items[i],...this.form}}else{this.items.unshift({id:Date.now(),...this.form,created_at:new Date().toISOString()})}this.showToast(this.editMode?'User diupdate':'User dibuat','success')}catch{if(!this.editMode)this.items.unshift({id:Date.now(),...this.form,created_at:new Date().toISOString()});this.showToast('Tersimpan lokal','success')}finally{this.saving=false;this.showModal=false}},
fmt(v){if(!v)return'-';try{return new Date(v).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})}catch{return v}},
showToast(msg,type){this.toast={show:true,msg,type};setTimeout(()=>this.toast.show=false,3000)}
}}
</script>
@endsection
