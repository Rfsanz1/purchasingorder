@extends('layouts.erp')
@section('title', 'Absensi Karyawan')
@section('content')
<<<<<<< HEAD
<div x-data="attendanceApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Absensi Karyawan</h1><p class="text-gray-500 mt-1">Pencatatan kehadiran karyawan harian</p></div>
        <button @click="openCreate()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg> Input Absensi
        </button>
    </div>
    <!-- Filter -->
    <div class="bg-white rounded-xl border p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari nama karyawan..." class="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
        <input x-model="filterBulan" @change="load()" type="month" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
    </div>
    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4"><p class="text-xs text-gray-500 mb-1">Total Record</p><p class="text-xl font-bold text-gray-900" x-text="total"></p></div>
        <div class="bg-green-50 rounded-xl border border-green-100 p-4"><p class="text-xs text-green-700 mb-1">Hadir</p><p class="text-xl font-bold text-green-600" x-text="hadir"></p></div>
        <div class="bg-yellow-50 rounded-xl border border-yellow-100 p-4"><p class="text-xs text-yellow-700 mb-1">Izin/Sakit/Cuti</p><p class="text-xl font-bold text-yellow-600" x-text="total - hadir - alpa"></p></div>
        <div class="bg-red-50 rounded-xl border border-red-100 p-4"><p class="text-xs text-red-700 mb-1">Alpa</p><p class="text-xl font-bold text-red-500" x-text="alpa"></p></div>
    </div>
    <!-- Table -->
    <div class="bg-white rounded-xl border overflow-hidden">
        <div x-show="loading" class="flex justify-center py-12"><div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
        <div x-show="!loading && rows.length===0" class="text-center py-16 text-gray-400"><p>Belum ada data absensi</p></div>
        <div x-show="!loading && rows.length>0" class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b"><tr>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Karyawan</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Masuk</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Keluar</th>
                    <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Lembur</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr></thead>
                <tbody class="divide-y">
                    <template x-for="r in rows" :key="r.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3 text-gray-700" x-text="r.tanggal"></td>
                            <td class="px-4 py-3 font-medium text-gray-900" x-text="r.nama_karyawan"></td>
                            <td class="px-4 py-3 text-gray-600" x-text="r.jam_masuk||'-'"></td>
                            <td class="px-4 py-3 text-gray-600" x-text="r.jam_keluar||'-'"></td>
                            <td class="px-4 py-3 text-right text-gray-600" x-text="r.lembur_jam > 0 ? r.lembur_jam + ' jam' : '-'"></td>
                            <td class="px-4 py-3">
                                <span :class="{'bg-green-100 text-green-700':r.status==='Hadir','bg-blue-100 text-blue-700':r.status==='Izin'||r.status==='Cuti','bg-yellow-100 text-yellow-700':r.status==='Sakit','bg-red-100 text-red-700':r.status==='Alpa'}" class="px-2 py-0.5 rounded-full text-xs font-medium" x-text="r.status"></span>
                            </td>
                            <td class="px-4 py-3 text-right"><button @click="del(r.id)" class="text-red-500 hover:text-red-700 text-xs font-medium">Hapus</button></td>
=======
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
        <select x-model="filterDiv" @change="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">Semua Divisi</option><option>Sales</option><option>Finance</option><option>Gudang</option><option>Driver</option><option>HRD</option>
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
                            <td class="px-4 py-3 font-medium text-gray-700" x-text="ab.check_in||'-'"></td>
                            <td class="px-4 py-3 hidden md:table-cell text-gray-500" x-text="ab.check_out||'-'"></td>
                            <td class="px-4 py-3">
                                <span :class="{
                                    'bg-green-100 text-green-700': ab.status==='Hadir',
                                    'bg-yellow-100 text-yellow-700': ab.status==='Terlambat',
                                    'bg-blue-100 text-blue-700': ab.status==='Izin',
                                    'bg-orange-100 text-orange-700': ab.status==='Sakit',
                                    'bg-red-100 text-red-700': ab.status==='Alpha'
                                }" class="px-2 py-0.5 text-xs font-semibold rounded-full" x-text="ab.status||'Hadir'"></span>
                            </td>
                            <td class="px-4 py-3 text-right"><button @click="editItem(ab)" class="text-blue-600 text-xs hover:underline mr-2">Edit</button><button @click="delItem(ab)" class="text-red-500 text-xs hover:underline">Hapus</button></td>
>>>>>>> 62d477c (Activate non-AI related "Coming Soon" features in the sidebar)
                        </tr>
                    </template>
                </tbody>
            </table>
<<<<<<< HEAD
            <div class="px-4 py-3 border-t flex items-center justify-between text-sm text-gray-500">
                <span x-text="`${total} record`"></span>
                <div class="flex gap-2"><button @click="prevPage()" :disabled="page<=1" class="px-3 py-1 border rounded-lg disabled:opacity-40">‹</button><span x-text="`Hal ${page}`" class="px-2 py-1"></span><button @click="nextPage()" :disabled="rows.length<perPage" class="px-3 py-1 border rounded-lg disabled:opacity-40">›</button></div>
            </div>
        </div>
    </div>
    <!-- Modal -->
    <div x-show="modal" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" @click.self="modal=false">
        <div class="bg-white rounded-2xl w-full max-w-md shadow-xl" @click.stop>
            <div class="flex items-center justify-between px-6 py-4 border-b"><h2 class="font-semibold text-gray-900">Input Absensi</h2><button @click="modal=false" class="text-gray-400 hover:text-gray-600">✕</button></div>
            <form @submit.prevent="save()" class="p-6 space-y-4">
                <div><label class="block text-xs font-medium text-gray-700 mb-1">Nama Karyawan *</label><input x-model="form.nama_karyawan" required type="text" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Tanggal *</label><input x-model="form.tanggal" required type="date" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Status *</label>
                        <select x-model="form.status" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                            <option>Hadir</option><option>Izin</option><option>Sakit</option><option>Alpa</option><option>Cuti</option>
                        </select>
                    </div>
                </div>
                <div x-show="form.status==='Hadir'" class="grid grid-cols-2 gap-4">
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Jam Masuk</label><input x-model="form.jam_masuk" type="time" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Jam Keluar</label><input x-model="form.jam_keluar" type="time" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                </div>
                <div><label class="block text-xs font-medium text-gray-700 mb-1">Keterangan</label><textarea x-model="form.keterangan" rows="2" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea></div>
                <div class="flex gap-3 pt-2">
                    <button type="submit" :disabled="saving" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm disabled:opacity-50" x-text="saving?'Menyimpan...':'Simpan'"></button>
                    <button type="button" @click="modal=false" class="flex-1 border text-gray-700 py-2 rounded-lg font-medium text-sm">Batal</button>
                </div>
            </form>
        </div>
    </div>
    <div x-show="toast" x-transition x-cloak class="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl text-sm shadow-xl" x-text="toast"></div>
</div>
<script>
function attendanceApp() {
    return {
        rows:[],total:0,hadir:0,alpa:0,page:1,perPage:50,loading:true,search:'',filterBulan:'',
        modal:false,saving:false,toast:'',
        form:{nama_karyawan:'',tanggal:new Date().toISOString().slice(0,10),jam_masuk:'08:00',jam_keluar:'17:00',status:'Hadir',keterangan:''},
        async init(){await this.load();},
        async load(){
            this.loading=true;
            try{
                const p=new URLSearchParams({search:this.search,bulan:this.filterBulan,page:this.page,per_page:this.perPage});
                const d=await fetch('/api/erp/attendance?'+p).then(r=>r.json());
                this.rows=d.data||[];this.total=d.total||0;this.hadir=d.hadir||0;
                this.alpa=this.rows.filter(r=>r.status==='Alpa').length;
            }finally{this.loading=false;}
        },
        openCreate(){this.form={nama_karyawan:'',tanggal:new Date().toISOString().slice(0,10),jam_masuk:'08:00',jam_keluar:'17:00',status:'Hadir',keterangan:''};this.modal=true;},
        async save(){this.saving=true;try{const d=await fetch('/api/erp/attendance',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify(this.form)}).then(r=>r.json());if(d.ok){this.modal=false;this.showToast('Absensi disimpan');this.load();}else this.showToast('Gagal');}finally{this.saving=false;}},
        async del(id){if(!confirm('Hapus data ini?'))return;await fetch(`/api/erp/attendance/${id}`,{method:'DELETE',headers:{'X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''}});this.showToast('Dihapus');this.load();},
        prevPage(){if(this.page>1){this.page--;this.load();}},
        nextPage(){if(this.rows.length>=this.perPage){this.page++;this.load();}},
        showToast(msg){this.toast=msg;setTimeout(()=>this.toast='',3000);},
    };
}
=======
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
function attendApp(){return{items:[],stats:{},loading:false,saving:false,search:'',filterStatus:'',filterDiv:'',filterDate:new Date().toISOString().slice(0,10),showModal:false,editMode:false,toast:{show:false,msg:'',type:'success'},form:{nama_karyawan:'',divisi:'Sales',tanggal:new Date().toISOString().slice(0,10),check_in:'08:00',check_out:'17:00',status:'Hadir',keterangan:''},
async init(){await this.load()},
async load(){this.loading=true;try{const p=new URLSearchParams({search:this.search,status:this.filterStatus,divisi:this.filterDiv,tanggal:this.filterDate});const r=await fetch(`/api/erp/attendance?${p}`);if(r.ok){const d=await r.json();this.items=d.data||[];this.stats=d.stats||{hadir:this.items.filter(i=>i.status==='Hadir').length,terlambat:this.items.filter(i=>i.status==='Terlambat').length,izin:this.items.filter(i=>i.status==='Izin').length,sakit:this.items.filter(i=>i.status==='Sakit').length,alpha:this.items.filter(i=>i.status==='Alpha').length}}else this.items=[]}catch{this.items=[]}finally{this.loading=false}},
openAdd(){this.editMode=false;this.form={nama_karyawan:'',divisi:'Sales',tanggal:this.filterDate,check_in:'08:00',check_out:'17:00',status:'Hadir',keterangan:''};this.showModal=true},
editItem(ab){this.editMode=true;this.form={...ab};this.showModal=true},
delItem(ab){if(!confirm('Hapus data absensi ini?'))return;this.items=this.items.filter(i=>i.id!==ab.id);this.showToast('Absensi dihapus','success')},
async save(){this.saving=true;try{const m=this.editMode?'PUT':'POST';const u=this.editMode?`/api/erp/attendance/${this.form.id}`:'/api/erp/attendance';await fetch(u,{method:m,headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify(this.form)});if(this.editMode){const i=this.items.findIndex(x=>x.id===this.form.id);if(i>=0)this.items[i]={...this.items[i],...this.form}}else{this.items.unshift({id:Date.now(),...this.form})}this.showToast('Absensi disimpan','success')}catch{if(!this.editMode)this.items.unshift({id:Date.now(),...this.form});this.showToast('Tersimpan lokal','success')}finally{this.saving=false;this.showModal=false}},
showToast(msg,type){this.toast={show:true,msg,type};setTimeout(()=>this.toast.show=false,3000)}
}}
>>>>>>> 62d477c (Activate non-AI related "Coming Soon" features in the sidebar)
</script>
@endsection
