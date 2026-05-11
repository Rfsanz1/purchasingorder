@extends('layouts.erp')
@section('title', 'Chart of Accounts (COA)')
@section('content')
<div x-data="coaApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div x-show="toast.show" x-cloak x-transition :class="toast.type==='success'?'bg-green-600':'bg-red-600'" class="fixed top-4 right-4 z-50 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium" x-text="toast.msg"></div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Chart of Accounts (COA)</h1><p class="text-gray-500 mt-1 text-sm">Struktur akun untuk pembukuan lengkap perusahaan</p></div>
        <button @click="openAdd()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>Tambah Akun
        </button>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <template x-for="type in accountTypes" :key="type.code">
            <div class="bg-white rounded-xl border p-3 shadow-sm text-center cursor-pointer" :class="filterType===type.code?'border-blue-500 bg-blue-50':''" @click="filterType=filterType===type.code?'':type.code;load()">
                <p class="text-xs text-gray-500 mb-1" x-text="type.label"></p>
                <p class="text-xl font-bold" :class="type.color" x-text="accounts.filter(a=>a.type===type.code).length"></p>
                <p class="text-xs text-gray-400">akun</p>
            </div>
        </template>
    </div>
    <div class="bg-white rounded-xl border shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari kode atau nama akun..." class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
        <select x-model="filterType" @change="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">Semua Tipe</option>
            <template x-for="t in accountTypes" :key="t.code"><option :value="t.code" x-text="t.label"></option></template>
        </select>
        <button @click="search='';filterType='';load()" class="bg-gray-50 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm">Reset</button>
    </div>
    <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b"><tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Kode</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nama Akun</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Tipe</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Normal Balance</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Saldo</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr></thead>
                <tbody class="divide-y divide-gray-50">
                    <template x-if="loading"><tr><td colspan="7" class="px-4 py-12 text-center text-gray-400">Memuat COA...</td></tr></template>
                    <template x-for="acc in filteredAccounts" :key="acc.id">
                        <tr class="hover:bg-gray-50" :class="acc.isHeader?'bg-gray-50/50 font-semibold':''">
                            <td class="px-4 py-3 font-mono text-xs font-semibold text-gray-700" x-text="acc.kode"></td>
                            <td class="px-4 py-3">
                                <div :class="acc.level===2?'pl-4':acc.level===3?'pl-8':''" class="font-medium text-gray-900" x-text="acc.nama"></div>
                                <div x-show="acc.deskripsi" class="text-xs text-gray-400 pl-0" x-text="acc.deskripsi||''"></div>
                            </td>
                            <td class="px-4 py-3 hidden md:table-cell"><span :class="getTypeClass(acc.type)" class="px-2 py-0.5 text-xs font-semibold rounded-full" x-text="getTypeLabel(acc.type)"></span></td>
                            <td class="px-4 py-3 hidden md:table-cell text-xs text-gray-500" x-text="acc.normalBalance||'-'"></td>
                            <td class="px-4 py-3 hidden lg:table-cell text-right font-medium text-sm" x-text="formatRp(acc.saldo||0)"></td>
                            <td class="px-4 py-3 text-center"><span :class="acc.aktif?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'" class="px-2 py-0.5 text-xs rounded-full" x-text="acc.aktif?'Aktif':'Nonaktif'"></span></td>
                            <td class="px-4 py-3 text-right"><button @click="editAcc(acc)" class="text-blue-600 text-xs hover:underline mr-2">Edit</button></td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>

    <div x-show="showModal" x-cloak class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showModal=false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg" @click.stop>
            <div class="p-6">
                <div class="flex items-center justify-between mb-5"><h3 class="text-lg font-bold text-gray-900" x-text="editMode?'Edit Akun':'Tambah Akun Baru'"></h3><button @click="showModal=false" class="text-gray-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button></div>
                <form @submit.prevent="save()" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Kode Akun *</label><input x-model="form.kode" type="text" required placeholder="1-1000" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Tipe Akun *</label>
                            <select x-model="form.type" required class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                                <template x-for="t in accountTypes" :key="t.code"><option :value="t.code" x-text="t.label"></option></template>
                            </select>
                        </div>
                        <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Nama Akun *</label><input x-model="form.nama" type="text" required class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Normal Balance</label><select x-model="form.normalBalance" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"><option>Debit</option><option>Kredit</option></select></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Status</label><select x-model="form.aktif" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"><option :value="true">Aktif</option><option :value="false">Nonaktif</option></select></div>
                        <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label><input x-model="form.deskripsi" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
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
function coaApp(){const defaultAccounts=[
    {id:1,kode:'1',nama:'AKTIVA',type:'1',level:1,isHeader:true,normalBalance:'Debit',aktif:true,saldo:0},
    {id:2,kode:'1-1',nama:'Aktiva Lancar',type:'1',level:2,isHeader:true,normalBalance:'Debit',aktif:true,saldo:0},
    {id:3,kode:'1-1-0001',nama:'Kas Besar',type:'1',level:3,normalBalance:'Debit',aktif:true,saldo:25000000,deskripsi:'Uang tunai di brankas'},
    {id:4,kode:'1-1-0002',nama:'Kas Kecil',type:'1',level:3,normalBalance:'Debit',aktif:true,saldo:5000000},
    {id:5,kode:'1-1-0010',nama:'Bank BCA',type:'1',level:3,normalBalance:'Debit',aktif:true,saldo:120000000},
    {id:6,kode:'1-1-0020',nama:'Piutang Dagang',type:'1',level:3,normalBalance:'Debit',aktif:true,saldo:45000000},
    {id:7,kode:'1-2',nama:'Aktiva Tetap',type:'1',level:2,isHeader:true,normalBalance:'Debit',aktif:true,saldo:0},
    {id:8,kode:'1-2-0001',nama:'Kendaraan',type:'1',level:3,normalBalance:'Debit',aktif:true,saldo:200000000},
    {id:9,kode:'2',nama:'KEWAJIBAN',type:'2',level:1,isHeader:true,normalBalance:'Kredit',aktif:true,saldo:0},
    {id:10,kode:'2-1-0001',nama:'Hutang Dagang',type:'2',level:3,normalBalance:'Kredit',aktif:true,saldo:30000000},
    {id:11,kode:'2-1-0002',nama:'Hutang Bank',type:'2',level:3,normalBalance:'Kredit',aktif:true,saldo:50000000},
    {id:12,kode:'3',nama:'EKUITAS',type:'3',level:1,isHeader:true,normalBalance:'Kredit',aktif:true,saldo:0},
    {id:13,kode:'3-1-0001',nama:'Modal Awal',type:'3',level:3,normalBalance:'Kredit',aktif:true,saldo:200000000},
    {id:14,kode:'4',nama:'PENDAPATAN',type:'4',level:1,isHeader:true,normalBalance:'Kredit',aktif:true,saldo:0},
    {id:15,kode:'4-1-0001',nama:'Pendapatan Penjualan',type:'4',level:3,normalBalance:'Kredit',aktif:true,saldo:580000000},
    {id:16,kode:'5',nama:'BIAYA',type:'5',level:1,isHeader:true,normalBalance:'Debit',aktif:true,saldo:0},
    {id:17,kode:'5-1-0001',nama:'HPP',type:'5',level:3,normalBalance:'Debit',aktif:true,saldo:380000000},
    {id:18,kode:'5-2-0001',nama:'Biaya Operasional',type:'5',level:3,normalBalance:'Debit',aktif:true,saldo:45000000},
    {id:19,kode:'5-2-0002',nama:'Biaya Gaji',type:'5',level:3,normalBalance:'Debit',aktif:true,saldo:80000000},
];
return{accounts:defaultAccounts,loading:false,search:'',filterType:'',showModal:false,editMode:false,toast:{show:false,msg:'',type:'success'},form:{kode:'',nama:'',type:'1',normalBalance:'Debit',aktif:true,deskripsi:''},
accountTypes:[{code:'1',label:'Aktiva',color:'text-blue-600'},{code:'2',label:'Kewajiban',color:'text-red-600'},{code:'3',label:'Ekuitas',color:'text-purple-600'},{code:'4',label:'Pendapatan',color:'text-green-600'},{code:'5',label:'Biaya',color:'text-orange-600'}],
get filteredAccounts(){let a=this.accounts;if(this.search)a=a.filter(x=>x.kode.includes(this.search)||x.nama.toLowerCase().includes(this.search.toLowerCase()));if(this.filterType)a=a.filter(x=>x.type===this.filterType);return a},
async init(){await this.load()},
async load(){this.loading=true;try{const r=await fetch('/api/erp/chart-of-accounts');if(r.ok){const d=await r.json();if(d.data&&d.data.length)this.accounts=d.data}}catch{}finally{this.loading=false}},
openAdd(){this.editMode=false;this.form={kode:'',nama:'',type:'1',normalBalance:'Debit',aktif:true,deskripsi:''};this.showModal=true},
editAcc(acc){this.editMode=true;this.form={...acc};this.showModal=true},
save(){if(this.editMode){const i=this.accounts.findIndex(x=>x.id===this.form.id);if(i>=0)this.accounts[i]={...this.accounts[i],...this.form}}else{this.accounts.push({id:Date.now(),level:3,...this.form})}this.showModal=false;this.showToast(this.editMode?'Akun diupdate':'Akun ditambahkan','success')},
getTypeLabel(t){return this.accountTypes.find(x=>x.code===t)?.label||t},
getTypeClass(t){const c={1:'bg-blue-100 text-blue-700',2:'bg-red-100 text-red-700',3:'bg-purple-100 text-purple-700',4:'bg-green-100 text-green-700',5:'bg-orange-100 text-orange-700'};return c[t]||'bg-gray-100 text-gray-600'},
formatRp(n){if(!n)return'-';return'Rp '+Number(n).toLocaleString('id-ID')},
showToast(msg,type){this.toast={show:true,msg,type};setTimeout(()=>this.toast.show=false,3000)}
}}
</script>
@endsection
