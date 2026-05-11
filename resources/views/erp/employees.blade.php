@extends('layouts.erp')
@section('title', 'Data Karyawan')
@section('content')
<div x-data="empApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
<<<<<<< HEAD
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">Data Karyawan</h1>
            <p class="text-gray-500 mt-1">Database lengkap data karyawan</p>
        </div>
        <button @click="openCreate()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            Tambah Karyawan
        </button>
    </div>
    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4"><p class="text-xs text-gray-500 mb-1">Total Karyawan</p><p class="text-2xl font-bold text-gray-900" x-text="summary.total||0"></p></div>
        <div class="bg-green-50 rounded-xl border border-green-100 p-4"><p class="text-xs text-green-700 mb-1">Aktif</p><p class="text-2xl font-bold text-green-600" x-text="summary.aktif||0"></p></div>
        <div class="bg-red-50 rounded-xl border border-red-100 p-4"><p class="text-xs text-red-700 mb-1">Non-Aktif/Resign</p><p class="text-2xl font-bold text-red-500" x-text="summary.nonaktif||0"></p></div>
    </div>
    <!-- Filter -->
    <div class="bg-white rounded-xl border p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari nama, NIK, jabatan..." class="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
        <select x-model="filterStatus" @change="load()" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">Semua Status</option><option>Aktif</option><option>Resign</option><option>Cuti Panjang</option>
        </select>
    </div>
    <!-- Table -->
    <div class="bg-white rounded-xl border overflow-hidden">
        <div x-show="loading" class="flex justify-center py-12"><div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
        <div x-show="!loading && rows.length===0" class="text-center py-16 text-gray-400"><p>Belum ada karyawan terdaftar</p></div>
        <div x-show="!loading && rows.length>0" class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">NIK</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nama</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Jabatan</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Departemen</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Telepon</th>
                        <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Gaji Pokok</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    <template x-for="r in rows" :key="r.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3 text-xs font-mono text-gray-500" x-text="r.nik||'-'"></td>
                            <td class="px-4 py-3 font-semibold text-gray-900" x-text="r.nama"></td>
                            <td class="px-4 py-3 text-gray-600" x-text="r.jabatan||'-'"></td>
                            <td class="px-4 py-3 text-gray-600" x-text="r.departemen||'-'"></td>
                            <td class="px-4 py-3 text-gray-600" x-text="r.telepon||'-'"></td>
                            <td class="px-4 py-3 text-right font-medium" x-text="formatCurrency(r.gaji_pokok||0)"></td>
                            <td class="px-4 py-3">
                                <span :class="r.status==='Aktif'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'" class="px-2 py-0.5 rounded-full text-xs font-medium" x-text="r.status"></span>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <button @click="openEdit(r)" class="text-blue-600 hover:text-blue-800 text-xs font-medium mr-2">Edit</button>
                                <button @click="del(r.id)" class="text-red-500 hover:text-red-700 text-xs font-medium">Hapus</button>
                            </td>
=======
    <div x-show="toast.show" x-cloak x-transition :class="toast.type==='success'?'bg-green-600':'bg-red-600'" class="fixed top-4 right-4 z-50 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium" x-text="toast.msg"></div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Data Karyawan</h1><p class="text-gray-500 mt-1 text-sm">Manajemen database karyawan perusahaan</p></div>
        <button @click="openAdd()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>Tambah Karyawan
        </button>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Karyawan</p><p class="text-2xl font-bold text-gray-900" x-text="stats.total??0"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Aktif</p><p class="text-2xl font-bold text-green-600" x-text="stats.active??0"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Divisi</p><p class="text-2xl font-bold text-blue-600" x-text="stats.divisi??0"></p></div>
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
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Bergabung</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr></thead>
                <tbody class="divide-y divide-gray-50">
                    <template x-if="loading"><tr><td colspan="6" class="px-4 py-12 text-center text-gray-400">Memuat data...</td></tr></template>
                    <template x-if="!loading&&items.length===0"><tr><td colspan="6" class="px-4 py-12 text-center text-gray-400"><p class="font-medium">Belum ada karyawan</p><button @click="openAdd()" class="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">+ Tambah Karyawan</button></td></tr></template>
                    <template x-for="e in items" :key="e.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3"><div class="font-medium text-gray-900" x-text="e.nama"></div><div class="text-xs text-gray-400" x-text="e.nik?'NIK: '+e.nik:''"></div></td>
                            <td class="px-4 py-3 hidden md:table-cell"><div x-text="e.jabatan||'-'"></div><div class="text-xs text-gray-400" x-text="e.divisi||''"></div></td>
                            <td class="px-4 py-3 hidden lg:table-cell"><div x-text="e.telepon||'-'"></div><div class="text-xs text-gray-400" x-text="e.email||''"></div></td>
                            <td class="px-4 py-3"><span :class="e.status==='Aktif'?'bg-green-100 text-green-700':e.status==='Resign'?'bg-red-100 text-red-700':'bg-gray-100 text-gray-600'" class="px-2 py-0.5 text-xs font-semibold rounded-full" x-text="e.status||'Aktif'"></span></td>
                            <td class="px-4 py-3 hidden lg:table-cell text-gray-400 text-xs" x-text="fmt(e.tanggal_masuk||e.created_at)"></td>
                            <td class="px-4 py-3 text-right"><button @click="editItem(e)" class="text-blue-600 text-xs hover:underline mr-2">Edit</button><button @click="delItem(e)" class="text-red-500 text-xs hover:underline">Hapus</button></td>
>>>>>>> 62d477c (Activate non-AI related "Coming Soon" features in the sidebar)
                        </tr>
                    </template>
                </tbody>
            </table>
<<<<<<< HEAD
            <div class="px-4 py-3 border-t flex items-center justify-between text-sm text-gray-500">
                <span x-text="`${total} karyawan`"></span>
                <div class="flex gap-2">
                    <button @click="prevPage()" :disabled="page<=1" class="px-3 py-1 border rounded-lg disabled:opacity-40">‹</button>
                    <span x-text="`Hal ${page}`" class="px-2 py-1"></span>
                    <button @click="nextPage()" :disabled="rows.length<perPage" class="px-3 py-1 border rounded-lg disabled:opacity-40">›</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div x-show="modal" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" @click.self="modal=false">
        <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto" @click.stop>
            <div class="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
                <h2 class="font-semibold text-gray-900" x-text="editId ? 'Edit Karyawan' : 'Tambah Karyawan'"></h2>
                <button @click="modal=false" class="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form @submit.prevent="save()" class="p-6 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">NIK</label><input x-model="form.nik" type="text" placeholder="Nomor Induk Karyawan" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Nama *</label><input x-model="form.nama" required type="text" placeholder="Nama lengkap" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Jabatan</label><input x-model="form.jabatan" type="text" placeholder="Staff, Manager..." class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Departemen</label><select x-model="form.departemen" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"><option value="">-- Pilih --</option><option>Sales</option><option>Gudang</option><option>Driver</option><option>Admin</option><option>Finance</option><option>IT</option><option>HRD</option><option>Marketing</option></select></div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Telepon</label><input x-model="form.telepon" type="text" placeholder="08xxxxxxxxxx" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Jenis Kelamin</label><select x-model="form.jenis_kelamin" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"><option value="">--</option><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Tanggal Masuk</label><input x-model="form.tanggal_masuk" type="date" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Gaji Pokok</label><input x-model.number="form.gaji_pokok" type="number" min="0" placeholder="0" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                </div>
                <div><label class="block text-xs font-medium text-gray-700 mb-1">Alamat</label><textarea x-model="form.alamat" rows="2" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea></div>
                <div><label class="block text-xs font-medium text-gray-700 mb-1">Status</label><select x-model="form.status" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"><option>Aktif</option><option>Resign</option><option>Cuti Panjang</option></select></div>
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
function empApp() {
    return {
        rows:[], total:0, page:1, perPage:20, loading:true, search:'', filterStatus:'', summary:{},
        modal:false, editId:null, saving:false, toast:'',
        form:{nik:'',nama:'',jabatan:'',departemen:'',telepon:'',jenis_kelamin:'',tanggal_masuk:'',gaji_pokok:0,alamat:'',status:'Aktif'},
        async init() { await Promise.all([this.load(), this.loadSummary()]); },
        async load() {
            this.loading=true;
            try { const p=new URLSearchParams({search:this.search,status:this.filterStatus,page:this.page,per_page:this.perPage}); const d=await fetch('/api/erp/employees?'+p).then(r=>r.json()); this.rows=d.data||[]; this.total=d.total||0; }
            finally { this.loading=false; }
        },
        async loadSummary() { this.summary=await fetch('/api/erp/employees/summary').then(r=>r.json()); },
        openCreate() { this.editId=null; this.form={nik:'',nama:'',jabatan:'',departemen:'',telepon:'',jenis_kelamin:'',tanggal_masuk:'',gaji_pokok:0,alamat:'',status:'Aktif'}; this.modal=true; },
        openEdit(r) { this.editId=r.id; this.form={nik:r.nik||'',nama:r.nama,jabatan:r.jabatan||'',departemen:r.departemen||'',telepon:r.telepon||'',jenis_kelamin:r.jenis_kelamin||'',tanggal_masuk:r.tanggal_masuk||'',gaji_pokok:r.gaji_pokok||0,alamat:r.alamat||'',status:r.status}; this.modal=true; },
        async save() {
            this.saving=true;
            try { const url=this.editId?`/api/erp/employees/${this.editId}`:'/api/erp/employees'; const method=this.editId?'PUT':'POST'; const r=await fetch(url,{method,headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify(this.form)}); const d=await r.json(); if(d.ok||d.id){this.modal=false;this.showToast('Karyawan disimpan');this.load();this.loadSummary();}else this.showToast('Gagal: '+(d.message||'Error')); }
            finally { this.saving=false; }
        },
        async del(id) { if(!confirm('Hapus karyawan ini?'))return; await fetch(`/api/erp/employees/${id}`,{method:'DELETE',headers:{'X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''}}); this.showToast('Karyawan dihapus'); this.load(); this.loadSummary(); },
        prevPage(){if(this.page>1){this.page--;this.load();}},
        nextPage(){if(this.rows.length>=this.perPage){this.page++;this.load();}},
        showToast(msg){this.toast=msg;setTimeout(()=>this.toast='',3000);},
        formatCurrency(v){return'Rp '+Number(v||0).toLocaleString('id-ID');},
    };
}
=======
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
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Divisi</label>
                            <select x-model="form.divisi" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"><option>Sales</option><option>Operasional</option><option>Finance</option><option>HRD</option><option>IT</option><option>Gudang</option></select>
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
function empApp(){return{items:[],stats:{},loading:false,saving:false,search:'',filterDiv:'',filterStatus:'',page:1,total:0,showModal:false,editMode:false,toast:{show:false,msg:'',type:'success'},form:{nama:'',nik:'',tanggal_masuk:'',jabatan:'',divisi:'Sales',telepon:'',email:'',gaji_pokok:'',alamat:'',status:'Aktif'},
async init(){await this.load()},
async load(){this.loading=true;try{const p=new URLSearchParams({search:this.search,divisi:this.filterDiv,status:this.filterStatus,page:this.page});const r=await fetch(`/api/erp/employees?${p}`);if(r.ok){const d=await r.json();this.items=d.data||[];this.total=d.total||this.items.length;this.stats=d.stats||{total:this.items.length,active:this.items.filter(i=>i.status==='Aktif').length,divisi:new Set(this.items.map(i=>i.divisi)).size,new:0}}else this.items=[]}catch{this.items=[]}finally{this.loading=false}},
openAdd(){this.editMode=false;this.form={nama:'',nik:'',tanggal_masuk:'',jabatan:'',divisi:'Sales',telepon:'',email:'',gaji_pokok:'',alamat:'',status:'Aktif'};this.showModal=true},
editItem(e){this.editMode=true;this.form={...e};this.showModal=true},
delItem(e){if(!confirm('Hapus karyawan '+e.nama+'?'))return;this.items=this.items.filter(i=>i.id!==e.id);this.showToast('Karyawan dihapus','success')},
async save(){this.saving=true;try{const m=this.editMode?'PUT':'POST';const u=this.editMode?`/api/erp/employees/${this.form.id}`:'/api/erp/employees';await fetch(u,{method:m,headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify(this.form)});if(this.editMode){const i=this.items.findIndex(x=>x.id===this.form.id);if(i>=0)this.items[i]={...this.items[i],...this.form}}else{this.items.unshift({id:Date.now(),...this.form,created_at:new Date().toISOString()});this.stats.total=(this.stats.total||0)+1}this.showToast(this.editMode?'Data diupdate':'Karyawan disimpan','success')}catch{if(!this.editMode)this.items.unshift({id:Date.now(),...this.form,created_at:new Date().toISOString()});this.showToast('Tersimpan lokal','success')}finally{this.saving=false;this.showModal=false}},
fmt(v){if(!v)return'-';try{return new Date(v).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})}catch{return v}},
showToast(msg,type){this.toast={show:true,msg,type};setTimeout(()=>this.toast.show=false,3000)}
}}
>>>>>>> 62d477c (Activate non-AI related "Coming Soon" features in the sidebar)
</script>
@endsection
