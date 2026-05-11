@extends('layouts.erp')
@section('title', 'Retur Penjualan')
@section('content')
<div x-data="returApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Retur Penjualan</h1><p class="text-gray-500 mt-1">Manajemen pengembalian barang dari customer</p></div>
        <button @click="openCreate()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg> Tambah Retur
        </button>
    </div>
    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4"><p class="text-xs text-gray-500 mb-1">Total Retur</p><p class="text-2xl font-bold text-gray-900" x-text="total"></p></div>
        <div class="bg-yellow-50 rounded-xl border border-yellow-100 p-4"><p class="text-xs text-yellow-700 mb-1">Dalam Proses</p><p class="text-2xl font-bold text-yellow-600" x-text="(rows.filter(r=>r.status==='Proses')).length"></p></div>
        <div class="bg-red-50 rounded-xl border border-red-100 p-4"><p class="text-xs text-red-700 mb-1">Total Nilai Retur</p><p class="text-xl font-bold text-red-500" x-text="formatCurrency(totalNilai)"></p></div>
    </div>
    <!-- Filter -->
    <div class="bg-white rounded-xl border p-4 mb-4 flex gap-3">
        <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari no retur, customer..." class="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
        <select x-model="filterStatus" @change="load()" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">Semua</option><option>Proses</option><option>Disetujui</option><option>Selesai</option><option>Ditolak</option>
        </select>
    </div>
    <!-- Table -->
    <div class="bg-white rounded-xl border overflow-hidden">
        <div x-show="loading" class="flex justify-center py-12"><div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
        <div x-show="!loading && rows.length===0" class="text-center py-16 text-gray-400"><p>Belum ada data retur</p></div>
        <div x-show="!loading && rows.length>0" class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">No Retur</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">No Order</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Alasan</th>
                        <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nilai</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    <template x-for="r in rows" :key="r.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3 font-mono text-xs text-blue-600" x-text="r.no_retur"></td>
                            <td class="px-4 py-3 text-gray-600 text-xs" x-text="r.no_order||'-'"></td>
                            <td class="px-4 py-3 text-gray-900" x-text="r.nama_customer||'-'"></td>
                            <td class="px-4 py-3 text-gray-600" x-text="r.tanggal"></td>
                            <td class="px-4 py-3 text-gray-600 text-xs max-w-32 truncate" x-text="r.alasan||'-'"></td>
                            <td class="px-4 py-3 text-right font-medium text-red-600" x-text="formatCurrency(r.nilai_retur||0)"></td>
                            <td class="px-4 py-3">
                                <span :class="{'bg-yellow-100 text-yellow-700':r.status==='Proses','bg-green-100 text-green-700':r.status==='Selesai','bg-red-100 text-red-700':r.status==='Ditolak','bg-blue-100 text-blue-700':r.status==='Disetujui'}" class="px-2 py-0.5 rounded-full text-xs font-medium" x-text="r.status"></span>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <button @click="approve(r.id)" x-show="r.status==='Proses'" class="text-green-600 hover:text-green-800 text-xs font-medium mr-2">Setujui</button>
                                <button @click="del(r.id)" class="text-red-500 hover:text-red-700 text-xs font-medium">Hapus</button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Modal -->
    <div x-show="modal" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" @click.self="modal=false">
        <div class="bg-white rounded-2xl w-full max-w-md shadow-xl" @click.stop>
            <div class="flex items-center justify-between px-6 py-4 border-b"><h2 class="font-semibold text-gray-900">Tambah Retur</h2><button @click="modal=false" class="text-gray-400 hover:text-gray-600">✕</button></div>
            <form @submit.prevent="save()" class="p-6 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">No Order</label><input x-model="form.no_order" type="text" placeholder="ORD-XXXX" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Tanggal *</label><input x-model="form.tanggal" required type="date" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                </div>
                <div><label class="block text-xs font-medium text-gray-700 mb-1">Nama Customer</label><input x-model="form.nama_customer" type="text" placeholder="Nama customer" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                <div><label class="block text-xs font-medium text-gray-700 mb-1">Alasan Retur</label>
                    <select x-model="form.alasan" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <option value="">-- Pilih Alasan --</option><option>Barang rusak</option><option>Barang tidak sesuai</option><option>Kelebihan order</option><option>Kualitas tidak sesuai</option><option>Lainnya</option>
                    </select>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Kondisi Barang</label><select x-model="form.kondisi_barang" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"><option>Baik</option><option>Rusak</option><option>Cacat</option></select></div>
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Tindakan</label><select x-model="form.tindakan" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"><option>Refund</option><option>Tukar Barang</option><option>Kredit</option></select></div>
                </div>
                <div><label class="block text-xs font-medium text-gray-700 mb-1">Nilai Retur (Rp)</label><input x-model.number="form.nilai_retur" type="number" min="0" placeholder="0" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
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
function returApp() {
    return {
        rows:[], total:0, totalNilai:0, page:1, perPage:20, loading:true, search:'', filterStatus:'',
        modal:false, saving:false, toast:'',
        form:{no_order:'',tanggal:new Date().toISOString().slice(0,10),nama_customer:'',alasan:'',kondisi_barang:'Baik',tindakan:'Refund',nilai_retur:0},
        async init() { await this.load(); },
        async load() {
            this.loading=true;
            try { const p=new URLSearchParams({search:this.search,status:this.filterStatus,page:this.page,per_page:this.perPage}); const d=await fetch('/api/erp/returns?'+p).then(r=>r.json()); this.rows=d.data||[]; this.total=d.total||0; this.totalNilai=d.total_nilai||0; }
            finally { this.loading=false; }
        },
        openCreate() { this.form={no_order:'',tanggal:new Date().toISOString().slice(0,10),nama_customer:'',alasan:'',kondisi_barang:'Baik',tindakan:'Refund',nilai_retur:0}; this.modal=true; },
        async save() {
            this.saving=true;
            try { const d=await fetch('/api/erp/returns',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify(this.form)}).then(r=>r.json()); if(d.ok){this.modal=false;this.showToast('Retur ditambahkan');this.load();}else this.showToast('Gagal'); }
            finally { this.saving=false; }
        },
        async approve(id) { await fetch(`/api/erp/returns/${id}`,{method:'PUT',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify({status:'Disetujui'})}); this.showToast('Retur disetujui'); this.load(); },
        async del(id) { if(!confirm('Hapus retur ini?'))return; await fetch(`/api/erp/returns/${id}`,{method:'DELETE',headers:{'X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''}}); this.showToast('Retur dihapus'); this.load(); },
        showToast(msg){this.toast=msg;setTimeout(()=>this.toast='',3000);},
        formatCurrency(v){return'Rp '+Number(v||0).toLocaleString('id-ID');},
    };
}
</script>
@endsection
