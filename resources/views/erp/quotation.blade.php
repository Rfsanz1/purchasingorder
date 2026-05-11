@extends('layouts.erp')
@section('title', 'Quotation / Penawaran')
@section('content')
<div x-data="quotationApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Quotation / Penawaran</h1><p class="text-gray-500 mt-1">Buat dan kirim penawaran harga ke customer</p></div>
        <button @click="openCreate()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg> Buat Penawaran
        </button>
    </div>
    <div class="bg-white rounded-xl border p-4 mb-4 flex gap-3">
        <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari no quotation, customer..." class="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
        <select x-model="filterStatus" @change="load()" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">Semua Status</option><option>Draft</option><option>Dikirim</option><option>Disetujui</option><option>Ditolak</option><option>Expired</option>
        </select>
    </div>
    <div class="bg-white rounded-xl border overflow-hidden">
        <div x-show="loading" class="flex justify-center py-12"><div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
        <div x-show="!loading && rows.length===0" class="text-center py-16 text-gray-400"><p>Belum ada quotation</p></div>
        <div x-show="!loading && rows.length>0" class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b"><tr>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">No Quotation</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Valid Sampai</th>
                    <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr></thead>
                <tbody class="divide-y">
                    <template x-for="r in rows" :key="r.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3 font-mono text-xs font-bold text-blue-600" x-text="r.no_quotation"></td>
                            <td class="px-4 py-3"><div class="font-medium text-gray-900" x-text="r.nama_customer"></div><div class="text-xs text-gray-400" x-text="r.telepon_customer||''"></div></td>
                            <td class="px-4 py-3 text-gray-600" x-text="r.tanggal"></td>
                            <td class="px-4 py-3 text-gray-600" x-text="r.valid_until||'-'"></td>
                            <td class="px-4 py-3 text-right font-semibold" x-text="formatCurrency(r.total)"></td>
                            <td class="px-4 py-3"><span :class="{'bg-yellow-100 text-yellow-700':r.status==='Dikirim','bg-green-100 text-green-700':r.status==='Disetujui','bg-red-100 text-red-700':r.status==='Ditolak','bg-gray-100 text-gray-600':r.status==='Draft'}" class="px-2 py-0.5 rounded-full text-xs font-medium" x-text="r.status"></span></td>
                            <td class="px-4 py-3 text-right"><button @click="del(r.id)" class="text-red-500 hover:text-red-700 text-xs font-medium">Hapus</button></td>
                        </tr>
                    </template>
                </tbody>
            </table>
            <div class="px-4 py-3 border-t flex items-center justify-between text-sm text-gray-500">
                <span x-text="`${total} quotation`"></span>
                <div class="flex gap-2"><button @click="prevPage()" :disabled="page<=1" class="px-3 py-1 border rounded-lg disabled:opacity-40">‹</button><span x-text="`Hal ${page}`" class="px-2 py-1"></span><button @click="nextPage()" :disabled="rows.length<perPage" class="px-3 py-1 border rounded-lg disabled:opacity-40">›</button></div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div x-show="modal" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" @click.self="modal=false">
        <div class="bg-white rounded-2xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto" @click.stop>
            <div class="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white"><h2 class="font-semibold text-gray-900">Buat Penawaran</h2><button @click="modal=false" class="text-gray-400 hover:text-gray-600">✕</button></div>
            <form @submit.prevent="save()" class="p-6 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Nama Customer *</label><input x-model="form.nama_customer" required type="text" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Telepon</label><input x-model="form.telepon_customer" type="text" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Tanggal *</label><input x-model="form.tanggal" required type="date" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Valid Sampai</label><input x-model="form.valid_until" type="date" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                </div>
                <div>
                    <div class="flex justify-between mb-2"><label class="text-xs font-medium text-gray-700">Item *</label><button type="button" @click="addItem()" class="text-blue-600 text-xs font-medium">+ Tambah</button></div>
                    <div class="space-y-2">
                        <template x-for="(item,i) in form.items" :key="i">
                            <div class="grid grid-cols-12 gap-2 items-start">
                                <div class="col-span-5"><input x-model="item.nama_produk" required type="text" placeholder="Nama produk" class="w-full border rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                                <div class="col-span-2"><input x-model.number="item.qty" type="number" min="1" placeholder="Qty" class="w-full border rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                                <div class="col-span-2"><input x-model="item.satuan" type="text" placeholder="pcs" class="w-full border rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                                <div class="col-span-2"><input x-model.number="item.harga" type="number" min="0" placeholder="Harga" class="w-full border rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                                <div class="col-span-1 flex justify-center pt-1"><button type="button" @click="form.items.splice(i,1)" class="text-red-400 hover:text-red-600">✕</button></div>
                            </div>
                        </template>
                    </div>
                    <div class="mt-2 text-right text-sm font-semibold text-gray-900">Total: <span x-text="formatCurrency(form.items.reduce((s,i)=>s+(i.qty||1)*(i.harga||0),0))"></span></div>
                </div>
                <div><label class="block text-xs font-medium text-gray-700 mb-1">Catatan</label><textarea x-model="form.catatan" rows="2" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea></div>
                <div class="flex gap-3 pt-2">
                    <button type="submit" :disabled="saving" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm disabled:opacity-50" x-text="saving?'Menyimpan...':'Buat Penawaran'"></button>
                    <button type="button" @click="modal=false" class="flex-1 border text-gray-700 py-2 rounded-lg font-medium text-sm">Batal</button>
                </div>
            </form>
        </div>
    </div>
    <div x-show="toast" x-transition x-cloak class="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl text-sm shadow-xl" x-text="toast"></div>
</div>
<script>
function quotationApp() {
    return {
        rows:[],total:0,page:1,perPage:20,loading:true,search:'',filterStatus:'',
        modal:false,saving:false,toast:'',
        form:{nama_customer:'',telepon_customer:'',tanggal:new Date().toISOString().slice(0,10),valid_until:'',catatan:'',items:[{nama_produk:'',qty:1,satuan:'pcs',harga:0}]},
        async init(){await this.load();},
        async load(){this.loading=true;try{const p=new URLSearchParams({search:this.search,status:this.filterStatus,page:this.page,per_page:this.perPage});const d=await fetch('/api/erp/quotations?'+p).then(r=>r.json());this.rows=d.data||[];this.total=d.total||0;}finally{this.loading=false;}},
        openCreate(){this.form={nama_customer:'',telepon_customer:'',tanggal:new Date().toISOString().slice(0,10),valid_until:'',catatan:'',items:[{nama_produk:'',qty:1,satuan:'pcs',harga:0}]};this.modal=true;},
        addItem(){this.form.items.push({nama_produk:'',qty:1,satuan:'pcs',harga:0});},
        async save(){this.saving=true;try{const d=await fetch('/api/erp/quotations',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify(this.form)}).then(r=>r.json());if(d.ok){this.modal=false;this.showToast('Quotation '+d.no_quotation+' dibuat');this.load();}else this.showToast('Gagal: '+(d.message||'Error'));}finally{this.saving=false;}},
        async del(id){if(!confirm('Hapus quotation ini?'))return;await fetch(`/api/erp/quotations/${id}`,{method:'DELETE',headers:{'X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''}});this.showToast('Quotation dihapus');this.load();},
        prevPage(){if(this.page>1){this.page--;this.load();}},
        nextPage(){if(this.rows.length>=this.perPage){this.page++;this.load();}},
        showToast(msg){this.toast=msg;setTimeout(()=>this.toast='',3000);},
        formatCurrency(v){return'Rp '+Number(v||0).toLocaleString('id-ID');},
    };
}
</script>
@endsection
