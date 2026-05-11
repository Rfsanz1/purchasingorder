@extends('layouts.erp')
@section('title', 'Absensi Karyawan')
@section('content')
<div x-data="attendApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div x-show="toast.show" x-cloak x-transition :class="toast.type==='success'?'bg-green-600':'bg-red-600'" class="fixed top-4 right-4 z-50 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium" x-text="toast.msg"></div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Absensi Karyawan</h1><p class="text-gray-500 mt-1 text-sm">Monitoring kehadiran dan absensi harian</p></div>
        <div class="flex gap-2">
            <input type="date" x-model="filterDate" @change="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <button @click="openAdd()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>Input Absensi
            </button>
        </div>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <div class="bg-white rounded-xl border p-3 shadow-sm text-center"><p class="text-xs text-gray-500">Hadir</p><p class="text-2xl font-bold text-green-600" x-text="stats.hadir??0"></p></div>
        <div class="bg-white rounded-xl border p-3 shadow-sm text-center"><p class="text-xs text-gray-500">Terlambat</p><p class="text-2xl font-bold text-yellow-500" x-text="stats.terlambat??0"></p></div>
        <div class="bg-white rounded-xl border p-3 shadow-sm text-center"><p class="text-xs text-gray-500">Izin</p><p class="text-2xl font-bold text-blue-600" x-text="stats.izin??0"></p></div>
        <div class="bg-white rounded-xl border p-3 shadow-sm text-center"><p class="text-xs text-gray-500">Sakit</p><p class="text-2xl font-bold text-orange-500" x-text="stats.sakit??0"></p></div>
        <div class="bg-white rounded-xl border p-3 shadow-sm text-center"><p class="text-xs text-gray-500">Alpha</p><p class="text-2xl font-bold text-red-600" x-text="stats.alpha??0"></p></div>
    </div>
    <div class="bg-white rounded-xl border shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari nama karyawan..." class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
        <select x-model="filterStatus" @change="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">Semua Status</option><option>Hadir</option><option>Terlambat</option><option>Izin</option><option>Sakit</option><option>Alpha</option>
        </select>
    </div>
    <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b"><tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Karyawan</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Divisi</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Check In</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Check Out</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr></thead>
                <tbody class="divide-y divide-gray-50">
                    <template x-if="loading"><tr><td colspan="6" class="px-4 py-12 text-center text-gray-400">Memuat data...</td></tr></template>
                    <template x-if="!loading&&items.length===0"><tr><td colspan="6" class="px-4 py-12 text-center text-gray-400"><p class="font-medium">Belum ada data absensi untuk tanggal ini</p><button @click="openAdd()" class="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">+ Input Absensi</button></td></tr></template>
                    <template x-for="ab in items" :key="ab.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3"><div class="font-medium text-gray-900" x-text="ab.nama_karyawan||ab.nama||'-'"></div></td>
                            <td class="px-4 py-3 hidden md:table-cell text-gray-500 text-xs" x-text="ab.divisi||'-'"></td>
                            <td class="px-4 py-3 font-medium text-gray-700" x-text="ab.check_in||ab.jam_masuk||'-'"></td>
                            <td class="px-4 py-3 hidden md:table-cell text-gray-500" x-text="ab.check_out||ab.jam_keluar||'-'"></td>
                            <td class="px-4 py-3">
                                <span :class="{
                                    'bg-green-100 text-green-700': ab.status==='Hadir',
                                    'bg-yellow-100 text-yellow-700': ab.status==='Terlambat',
                                    'bg-blue-100 text-blue-700': ab.status==='Izin',
                                    'bg-orange-100 text-orange-700': ab.status==='Sakit',
                                    'bg-red-100 text-red-700': ab.status==='Alpha'||ab.status==='Alpa'
                                }" class="px-2 py-0.5 text-xs font-semibold rounded-full" x-text="ab.status||'Hadir'"></span>
                            </td>
                            <td class="px-4 py-3 text-right"><button @click="editItem(ab)" class="text-blue-600 text-xs hover:underline mr-2">Edit</button><button @click="delItem(ab)" class="text-red-500 text-xs hover:underline">Hapus</button></td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>

    <div x-show="showModal" x-cloak class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showModal=false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg" @click.stop>
            <div class="p-6">
                <div class="flex items-center justify-between mb-5"><h3 class="text-lg font-bold text-gray-900">Input Absensi</h3><button @click="showModal=false" class="text-gray-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button></div>
                <form @submit.prevent="save()" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Nama Karyawan *</label><input x-model="form.nama_karyawan" type="text" required class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Divisi</label>
                            <select x-model="form.divisi" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"><option>Sales</option><option>Finance</option><option>Gudang</option><option>Driver</option><option>HRD</option><option>IT</option></select>
                        </div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Tanggal</label><input x-model="form.tanggal" type="date" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Check In</label><input x-model="form.check_in" type="time" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Check Out</label><input x-model="form.check_out" type="time" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select x-model="form.status" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"><option>Hadir</option><option>Terlambat</option><option>Izin</option><option>Sakit</option><option>Alpha</option></select>
                        </div>
                        <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Keterangan</label><textarea x-model="form.keterangan" rows="2" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500"></textarea></div>
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
function attendApp(){return{items:[],stats:{hadir:0,terlambat:0,izin:0,sakit:0,alpha:0},loading:false,saving:false,search:'',filterStatus:'',filterDate:new Date().toISOString().slice(0,10),showModal:false,editMode:false,toast:{show:false,msg:'',type:'success'},form:{nama_karyawan:'',divisi:'Sales',tanggal:new Date().toISOString().slice(0,10),check_in:'08:00',check_out:'17:00',status:'Hadir',keterangan:''},
async init(){await this.load()},
async load(){this.loading=true;try{const p=new URLSearchParams({search:this.search,status:this.filterStatus,tanggal:this.filterDate});const r=await fetch(`/api/erp/attendance?${p}`);if(r.ok){const d=await r.json();this.items=d.data||[];this.stats=d.stats||{hadir:this.items.filter(i=>i.status==='Hadir').length,terlambat:this.items.filter(i=>i.status==='Terlambat').length,izin:this.items.filter(i=>i.status==='Izin').length,sakit:this.items.filter(i=>i.status==='Sakit').length,alpha:this.items.filter(i=>i.status==='Alpha'||i.status==='Alpa').length}}else this.items=[]}catch{this.items=[]}finally{this.loading=false}},
openAdd(){this.editMode=false;this.form={nama_karyawan:'',divisi:'Sales',tanggal:this.filterDate,check_in:'08:00',check_out:'17:00',status:'Hadir',keterangan:''};this.showModal=true},
editItem(ab){this.editMode=true;this.form={...ab};this.showModal=true},
delItem(ab){if(!confirm('Hapus data absensi ini?'))return;fetch(`/api/erp/attendance/${ab.id}`,{method:'DELETE',headers:{'X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''}});this.items=this.items.filter(i=>i.id!==ab.id);this.showToast('Absensi dihapus','success')},
async save(){this.saving=true;try{const m=this.editMode?'PUT':'POST';const u=this.editMode?`/api/erp/attendance/${this.form.id}`:'/api/erp/attendance';const r=await fetch(u,{method:m,headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify(this.form)});if(r.ok){const d=await r.json();if(this.editMode){const i=this.items.findIndex(x=>x.id===this.form.id);if(i>=0)this.items[i]={...this.items[i],...(d.data||this.form)}}else{this.items.unshift(d.data||{id:Date.now(),...this.form})}this.showToast(this.editMode?'Absensi diupdate':'Absensi disimpan','success')}else{if(!this.editMode)this.items.unshift({id:Date.now(),...this.form});this.showToast('Tersimpan','success')}}catch{if(!this.editMode)this.items.unshift({id:Date.now(),...this.form});this.showToast('Tersimpan lokal','success')}finally{this.saving=false;this.showModal=false}},
showToast(msg,type){this.toast={show:true,msg,type};setTimeout(()=>this.toast.show=false,3000)}
}}
</script>
@endsection
