@extends('layouts.erp')
@section('title', 'Diskon & Promo')
@section('content')
<div x-data="promoApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Diskon & Promo</h1><p class="text-gray-500 mt-1">Manajemen program diskon dan promosi penjualan</p></div>
        <button @click="openCreate()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg> Buat Promo
        </button>
    </div>
    <!-- Filter -->
    <div class="bg-white rounded-xl border p-4 mb-4 flex gap-3">
        <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari nama, kode promo..." class="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
        <select x-model="filterStatus" @change="load()" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">Semua Status</option><option>Aktif</option><option>Non-Aktif</option><option>Expired</option>
        </select>
    </div>
    <!-- Table -->
    <div class="bg-white rounded-xl border overflow-hidden">
        <div x-show="loading" class="flex justify-center py-12"><div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
        <div x-show="!loading && rows.length===0" class="text-center py-16 text-gray-400"><p>Belum ada promo. Buat promo pertama!</p></div>
        <div x-show="!loading && rows.length>0" class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Kode</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nama Promo</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Jenis</th>
                        <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nilai</th>
                        <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Min. Transaksi</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Berlaku</th>
                        <th class="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Terpakai</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    <template x-for="r in rows" :key="r.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3 font-mono font-bold text-blue-700" x-text="r.kode"></td>
                            <td class="px-4 py-3 font-medium text-gray-900" x-text="r.nama"></td>
                            <td class="px-4 py-3 text-gray-600 capitalize" x-text="r.jenis === 'persen' ? 'Persen (%)' : r.jenis === 'nominal' ? 'Nominal (Rp)' : 'Gratis Ongkir'"></td>
                            <td class="px-4 py-3 text-right font-semibold" x-text="r.jenis==='persen' ? r.nilai+'%' : formatCurrency(r.nilai)"></td>
                            <td class="px-4 py-3 text-right text-gray-600" x-text="formatCurrency(r.min_transaksi)"></td>
                            <td class="px-4 py-3 text-xs text-gray-600" x-text="(r.mulai||'-') + ' s/d ' + (r.berakhir||'∞')"></td>
                            <td class="px-4 py-3 text-center" x-text="(r.terpakai||0) + ' / ' + (r.kuota > 0 ? r.kuota : '∞')"></td>
                            <td class="px-4 py-3"><span :class="r.status==='Aktif'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-600'" class="px-2 py-0.5 rounded-full text-xs font-medium" x-text="r.status"></span></td>
                            <td class="px-4 py-3 text-right">
                                <button @click="toggle(r)" class="text-blue-600 hover:text-blue-800 text-xs font-medium mr-2" x-text="r.status==='Aktif'?'Nonaktifkan':'Aktifkan'"></button>
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
            <div class="flex items-center justify-between px-6 py-4 border-b"><h2 class="font-semibold text-gray-900">Buat Promo Baru</h2><button @click="modal=false" class="text-gray-400 hover:text-gray-600">✕</button></div>
            <form @submit.prevent="save()" class="p-6 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Kode Promo *</label><input x-model="form.kode" required type="text" placeholder="DISC50" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"></div>
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Jenis *</label><select x-model="form.jenis" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"><option value="persen">Persen (%)</option><option value="nominal">Nominal (Rp)</option><option value="gratis_ongkir">Gratis Ongkir</option></select></div>
                </div>
                <div><label class="block text-xs font-medium text-gray-700 mb-1">Nama Promo *</label><input x-model="form.nama" required type="text" placeholder="Diskon Akhir Bulan" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Nilai *</label><input x-model.number="form.nilai" required type="number" min="0" placeholder="10" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Min. Transaksi</label><input x-model.number="form.min_transaksi" type="number" min="0" placeholder="0" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Berlaku Mulai</label><input x-model="form.mulai" type="date" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Berlaku Sampai</label><input x-model="form.berakhir" type="date" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                </div>
                <div><label class="block text-xs font-medium text-gray-700 mb-1">Kuota (0 = unlimited)</label><input x-model.number="form.kuota" type="number" min="0" placeholder="0" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
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
function promoApp() {
    return {
        rows:[], total:0, page:1, perPage:20, loading:true, search:'', filterStatus:'',
        modal:false, saving:false, toast:'',
        form:{kode:'',nama:'',jenis:'persen',nilai:0,min_transaksi:0,mulai:'',berakhir:'',kuota:0},
        async init() { await this.load(); },
        async load() { this.loading=true; try { const p=new URLSearchParams({search:this.search,status:this.filterStatus,page:this.page,per_page:this.perPage}); const d=await fetch('/api/erp/promos?'+p).then(r=>r.json()); this.rows=d.data||[]; this.total=d.total||0; } finally { this.loading=false; } },
        openCreate() { this.form={kode:'',nama:'',jenis:'persen',nilai:0,min_transaksi:0,mulai:'',berakhir:'',kuota:0}; this.modal=true; },
        async save() { this.saving=true; try { const d=await fetch('/api/erp/promos',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify(this.form)}).then(r=>r.json()); if(d.ok){this.modal=false;this.showToast('Promo berhasil dibuat');this.load();}else this.showToast('Gagal: '+(d.message||'Error')); } finally { this.saving=false; } },
        async toggle(r) { await fetch(`/api/erp/promos/${r.id}`,{method:'PUT',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify({status:r.status==='Aktif'?'Non-Aktif':'Aktif'})}); this.showToast('Status diperbarui'); this.load(); },
        async del(id) { if(!confirm('Hapus promo ini?'))return; await fetch(`/api/erp/promos/${id}`,{method:'DELETE',headers:{'X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''}}); this.showToast('Promo dihapus'); this.load(); },
        showToast(msg){this.toast=msg;setTimeout(()=>this.toast='',3000);},
        formatCurrency(v){return'Rp '+Number(v||0).toLocaleString('id-ID');},
    };
}
</script>
@endsection
