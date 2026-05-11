@extends('layouts.erp')
@section('title', 'Data Karyawan')
@section('content')
<div x-data="empApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
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
                        </tr>
                    </template>
                </tbody>
            </table>
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
</script>
@endsection
