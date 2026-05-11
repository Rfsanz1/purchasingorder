@extends('layouts.erp')
@section('title', 'Role & Hak Akses')
@section('content')
<div x-data="rolesApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div x-show="toast.show" x-cloak x-transition :class="toast.type==='success'?'bg-green-600':'bg-red-600'" class="fixed top-4 right-4 z-50 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium" x-text="toast.msg"></div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Role & Hak Akses</h1><p class="text-gray-500 mt-1 text-sm">Kelola peran dan permission untuk setiap user</p></div>
        <button @click="openAdd()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>Tambah Role
        </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <template x-for="role in roles" :key="role.name">
            <div class="bg-white rounded-xl border shadow-sm p-5">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                        <div :class="role.color" class="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs" x-text="role.name.charAt(0)"></div>
                        <div>
                            <h3 class="font-bold text-gray-900 text-sm" x-text="role.name"></h3>
                            <p class="text-xs text-gray-400" x-text="role.users+' user'"></p>
                        </div>
                    </div>
                    <div class="flex gap-1">
                        <button @click="editRole(role)" class="text-blue-600 text-xs hover:underline">Edit</button>
                    </div>
                </div>
                <div class="space-y-1">
                    <template x-for="perm in role.permissions.slice(0,4)" :key="perm">
                        <div class="flex items-center gap-2 text-xs text-gray-600">
                            <svg class="w-3.5 h-3.5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                            <span x-text="perm"></span>
                        </div>
                    </template>
                    <template x-if="role.permissions.length>4"><p class="text-xs text-gray-400 pl-5" x-text="'+'+(role.permissions.length-4)+' permission lainnya'"></p></template>
                </div>
            </div>
        </template>
    </div>

    <div class="bg-white rounded-xl border shadow-sm">
        <div class="p-4 border-b flex items-center justify-between">
            <h2 class="font-bold text-gray-900">Permission Matrix</h2>
            <p class="text-xs text-gray-400">✓ = Diizinkan</p>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-xs">
                <thead class="bg-gray-50"><tr>
                    <th class="px-4 py-2 text-left font-semibold text-gray-500">Modul</th>
                    <template x-for="role in roles" :key="role.name"><th class="px-3 py-2 text-center font-semibold text-gray-500" x-text="role.name"></th></template>
                </tr></thead>
                <tbody class="divide-y divide-gray-50">
                    <template x-for="mod in modules" :key="mod.name">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-2 font-medium text-gray-700" x-text="mod.name"></td>
                            <template x-for="role in roles" :key="role.name">
                                <td class="px-3 py-2 text-center">
                                    <span x-show="mod.roles.includes(role.name)" class="text-green-600 font-bold">✓</span>
                                    <span x-show="!mod.roles.includes(role.name)" class="text-gray-300">—</span>
                                </td>
                            </template>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>

    <div x-show="showModal" x-cloak class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showModal=false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" @click.stop>
            <div class="p-6">
                <div class="flex items-center justify-between mb-5"><h3 class="text-lg font-bold text-gray-900" x-text="editMode?'Edit Role':'Tambah Role Baru'"></h3><button @click="showModal=false" class="text-gray-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button></div>
                <form @submit.prevent="save()" class="space-y-4">
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Nama Role *</label><input x-model="form.name" type="text" required class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label><textarea x-model="form.desc" rows="2" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500"></textarea></div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                        <div class="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                            <template x-for="perm in allPerms" :key="perm">
                                <label class="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" :value="perm" x-model="form.permissions" class="rounded border-gray-300 text-blue-600">
                                    <span x-text="perm"></span>
                                </label>
                            </template>
                        </div>
                    </div>
                    <div class="flex justify-end gap-3 pt-2">
                        <button type="button" @click="showModal=false" class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600">Batal</button>
                        <button type="submit" class="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium" x-text="editMode?'Update':'Simpan'"></button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<script>
function rolesApp(){return{
roles:[
    {name:'Admin',color:'bg-red-500',users:2,permissions:['Dashboard','Sales','Inventory','Finance','Accounting','HR','Settings','Users','Reports','Marketplace']},
    {name:'Manager',color:'bg-purple-500',users:3,permissions:['Dashboard','Sales','Inventory','Finance','Reports','Marketplace']},
    {name:'Sales',color:'bg-blue-500',users:5,permissions:['Dashboard','Sales','Customers','Reports']},
    {name:'Finance',color:'bg-green-500',users:2,permissions:['Dashboard','Finance','Accounting','Reports']},
    {name:'Gudang',color:'bg-orange-500',users:4,permissions:['Dashboard','Inventory','Stock Opname']},
    {name:'Driver',color:'bg-gray-500',users:6,permissions:['Driver App','Delivery']}
],
modules:[
    {name:'Dashboard',roles:['Admin','Manager','Sales','Finance','Gudang','Driver']},
    {name:'Sales & Order',roles:['Admin','Manager','Sales']},
    {name:'Inventory',roles:['Admin','Manager','Gudang']},
    {name:'Purchase',roles:['Admin','Manager']},
    {name:'Finance',roles:['Admin','Manager','Finance']},
    {name:'Accounting',roles:['Admin','Finance']},
    {name:'HR & Payroll',roles:['Admin']},
    {name:'CRM & Customer',roles:['Admin','Manager','Sales']},
    {name:'Marketplace',roles:['Admin','Manager']},
    {name:'Reports',roles:['Admin','Manager','Finance']},
    {name:'System Settings',roles:['Admin']}
],
allPerms:['Dashboard','Sales','Purchase','Inventory','Finance','Accounting','HR','CRM','Marketplace','Reports','Settings','Users','Roles','Backup','API Access'],
showModal:false,editMode:false,toast:{show:false,msg:'',type:'success'},form:{name:'',desc:'',permissions:[]},
async init(){},
openAdd(){this.editMode=false;this.form={name:'',desc:'',permissions:[]};this.showModal=true},
editRole(role){this.editMode=true;this.form={name:role.name,desc:'',permissions:[...role.permissions]};this.showModal=true},
async save(){if(this.editMode){const r=this.roles.find(x=>x.name===this.form.name);if(r){r.permissions=this.form.permissions}}else{this.roles.push({name:this.form.name,color:'bg-gray-500',users:0,permissions:this.form.permissions})}this.showModal=false;this.showToast(this.editMode?'Role diupdate':'Role ditambahkan','success')},
showToast(msg,type){this.toast={show:true,msg,type};setTimeout(()=>this.toast.show=false,3000)}
}}
</script>
@endsection
