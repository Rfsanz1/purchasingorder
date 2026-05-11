@extends('layouts.erp')
@section('title', 'Purchase Order')
@section('content')
<div x-data="poApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div x-show="toast.show" x-cloak x-transition :class="toast.type==='success'?'bg-green-600':'bg-red-600'" class="fixed top-4 right-4 z-50 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium" x-text="toast.msg"></div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Purchase Order</h1><p class="text-gray-500 mt-1 text-sm">Buat dan kelola purchase order ke supplier</p></div>
        <button @click="openAdd()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>Buat PO Baru
        </button>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total PO</p><p class="text-2xl font-bold text-gray-900" x-text="stats.total??items.length"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Menunggu Approval</p><p class="text-2xl font-bold text-yellow-500" x-text="stats.pending??items.filter(i=>i.status==='Draft'||i.status==='Menunggu Approval').length"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Diproses</p><p class="text-2xl font-bold text-blue-600" x-text="stats.processing??items.filter(i=>i.status==='Disetujui'||i.status==='Approved').length"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Nilai PO</p><p class="text-xl font-bold text-green-600" x-text="formatRp(stats.totalNilai??items.reduce((a,i)=>a+(parseFloat(i.total)||0),0))"></p></div>
    </div>
    <div class="bg-white rounded-xl border shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari No. PO, supplier..." class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
        <select x-model="filterStatus" @change="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">Semua Status</option><option>Draft</option><option>Menunggu Approval</option><option>Disetujui</option><option>Dikirim</option><option>Diterima</option><option>Dibatalkan</option>
        </select>
        <input x-model="filterDate" @change="load()" type="month" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
        <button @click="search='';filterStatus='';filterDate='';load()" class="bg-gray-50 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm">Reset</button>
    </div>
    <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b"><tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">No. PO</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Supplier</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Tanggal</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Total Nilai</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr></thead>
                <tbody class="divide-y divide-gray-50">
                    <template x-if="loading"><tr><td colspan="6" class="px-4 py-12 text-center text-gray-400">Memuat data...</td></tr></template>
                    <template x-if="!loading&&items.length===0"><tr><td colspan="6" class="px-4 py-12 text-center text-gray-400"><p class="font-medium">Belum ada Purchase Order</p><button @click="openAdd()" class="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">+ Buat PO</button></td></tr></template>
                    <template x-for="po in items" :key="po.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3"><div class="font-medium text-blue-600 cursor-pointer hover:underline" x-text="po.no_po||'PO-'+po.id"></div></td>
                            <td class="px-4 py-3 hidden md:table-cell text-gray-700" x-text="po.supplier||po.nama_supplier||'-'"></td>
                            <td class="px-4 py-3 hidden lg:table-cell text-gray-400 text-xs" x-text="fmt(po.tanggal||po.created_at)"></td>
                            <td class="px-4 py-3">
                                <span :class="{
                                    'bg-gray-100 text-gray-600': po.status==='Draft'||!po.status,
                                    'bg-yellow-100 text-yellow-700': po.status==='Menunggu Approval'||po.status==='Pending',
                                    'bg-blue-100 text-blue-700': po.status==='Disetujui'||po.status==='Approved',
                                    'bg-purple-100 text-purple-700': po.status==='Dikirim',
                                    'bg-green-100 text-green-700': po.status==='Diterima',
                                    'bg-red-100 text-red-700': po.status==='Dibatalkan'
                                }" class="px-2 py-0.5 text-xs font-semibold rounded-full" x-text="po.status||'Draft'"></span>
                            </td>
                            <td class="px-4 py-3 hidden lg:table-cell font-medium text-gray-900 text-right" x-text="formatRp(po.total||0)"></td>
                            <td class="px-4 py-3 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <template x-if="po.status==='Draft'||!po.status"><button @click="approve(po)" class="text-green-600 text-xs hover:underline">Setujui</button></template>
                                    <button @click="editItem(po)" class="text-blue-600 text-xs hover:underline">Edit</button>
                                    <button @click="delItem(po)" class="text-red-500 text-xs hover:underline">Hapus</button>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <div class="px-4 py-3 border-t flex items-center justify-between text-xs text-gray-400">
            <span>Total <span x-text="total"></span> PO</span>
            <div class="flex gap-1"><button @click="page--;load()" :disabled="page<=1" class="px-3 py-1.5 border rounded-lg disabled:opacity-40">← Prev</button><button @click="page++;load()" :disabled="page*15>=total" class="px-3 py-1.5 border rounded-lg disabled:opacity-40">Next →</button></div>
        </div>
    </div>

    <div x-show="showModal" x-cloak class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showModal=false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" @click.stop>
            <div class="p-6">
                <div class="flex items-center justify-between mb-5"><h3 class="text-lg font-bold text-gray-900" x-text="editMode?'Edit PO':'Buat Purchase Order'"></h3><button @click="showModal=false" class="text-gray-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button></div>
                <form @submit.prevent="save()" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Supplier *</label><input x-model="form.supplier" type="text" required placeholder="Nama supplier" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Tanggal PO</label><input x-model="form.tanggal" type="date" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Exp. Pengiriman</label><input x-model="form.exp_delivery" type="date" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select x-model="form.status" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"><option>Draft</option><option>Menunggu Approval</option><option>Disetujui</option></select>
                        </div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Metode Bayar</label>
                            <select x-model="form.metode_bayar" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"><option>Transfer</option><option>Cash</option><option>Kredit 30 hari</option><option>Kredit 60 hari</option></select>
                        </div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Total Estimasi (Rp)</label><input x-model="form.total" type="number" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Produk / Deskripsi</label><textarea x-model="form.deskripsi" rows="3" placeholder="Daftar produk yang dipesan..." class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500"></textarea></div>
                        <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Catatan</label><textarea x-model="form.catatan" rows="2" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500"></textarea></div>
                    </div>
                    <div class="flex justify-end gap-3 pt-2">
                        <button type="button" @click="showModal=false" class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600">Batal</button>
                        <button type="submit" :disabled="saving" class="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"><span x-show="!saving" x-text="editMode?'Update':'Buat PO'"></span><span x-show="saving">Menyimpan...</span></button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<script>
function poApp(){return{items:[],stats:{},loading:false,saving:false,search:'',filterStatus:'',filterDate:'',page:1,total:0,showModal:false,editMode:false,toast:{show:false,msg:'',type:'success'},form:{supplier:'',tanggal:new Date().toISOString().slice(0,10),exp_delivery:'',status:'Draft',metode_bayar:'Transfer',total:'',deskripsi:'',catatan:''},
async init(){await this.load()},
async load(){this.loading=true;try{const p=new URLSearchParams({search:this.search,status:this.filterStatus,bulan:this.filterDate,page:this.page,per_page:15});const r=await fetch(`/api/erp/purchase-orders?${p}`);if(r.ok){const d=await r.json();this.items=d.data||[];this.total=d.total||this.items.length;this.stats=d.stats||{}}else this.items=[]}catch{this.items=[]}finally{this.loading=false}},
openAdd(){this.editMode=false;this.form={supplier:'',tanggal:new Date().toISOString().slice(0,10),exp_delivery:'',status:'Draft',metode_bayar:'Transfer',total:'',deskripsi:'',catatan:''};this.showModal=true},
editItem(po){this.editMode=true;this.form={...po};this.showModal=true},
approve(po){po.status='Disetujui';fetch(`/api/erp/purchase-orders/${po.id}`,{method:'PUT',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify({status:'Disetujui'})});this.showToast('PO disetujui','success')},
delItem(po){if(!confirm('Hapus PO ini?'))return;fetch(`/api/erp/purchase-orders/${po.id}`,{method:'DELETE',headers:{'X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''}});this.items=this.items.filter(i=>i.id!==po.id);this.total--;this.showToast('PO dihapus','success')},
async save(){this.saving=true;try{const m=this.editMode?'PUT':'POST';const u=this.editMode?`/api/erp/purchase-orders/${this.form.id}`:'/api/erp/purchase-orders';const r=await fetch(u,{method:m,headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify(this.form)});if(r.ok){const d=await r.json();if(this.editMode){const i=this.items.findIndex(x=>x.id===this.form.id);if(i>=0)this.items[i]={...this.items[i],...(d.data||this.form)}}else{this.items.unshift(d.data||{id:Date.now(),...this.form,no_po:'PO-'+Date.now()});this.total++}}else{if(!this.editMode){this.items.unshift({id:Date.now(),...this.form,no_po:'PO-'+Date.now()});this.total++}}this.showToast('PO disimpan','success')}catch{if(!this.editMode){this.items.unshift({id:Date.now(),...this.form,no_po:'PO-'+Date.now()});this.total++}this.showToast('Tersimpan','success')}finally{this.saving=false;this.showModal=false}},
fmt(v){if(!v)return'-';try{return new Date(v).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})}catch{return v}},
formatRp(n){return'Rp '+Number(n||0).toLocaleString('id-ID')},
showToast(msg,type){this.toast={show:true,msg,type};setTimeout(()=>this.toast.show=false,3000)}
}}
</script>
@endsection
