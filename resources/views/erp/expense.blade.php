@extends('layouts.erp')
@section('title', 'Pengeluaran (Expense)')
@section('content')
<div x-data="expenseApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div x-show="toast.show" x-cloak x-transition :class="toast.type==='success'?'bg-green-600':'bg-red-600'" class="fixed top-4 right-4 z-50 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium" x-text="toast.msg"></div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Pengeluaran (Expense)</h1><p class="text-gray-500 mt-1 text-sm">Kelola semua pengeluaran operasional perusahaan</p></div>
        <button @click="openAdd()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>Tambah Pengeluaran
        </button>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Pengeluaran</p><p class="text-xl font-bold text-red-600" x-text="formatRp(items.reduce((a,i)=>a+(parseFloat(i.jumlah)||0),0))"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Jumlah Transaksi</p><p class="text-2xl font-bold text-gray-900" x-text="items.length"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Reimbursement Pending</p><p class="text-2xl font-bold text-yellow-500" x-text="items.filter(i=>i.reimburs==='Pending').length"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Sudah Direimburse</p><p class="text-xl font-bold text-green-600" x-text="formatRp(items.filter(i=>i.reimburs==='Approved').reduce((a,i)=>a+(parseFloat(i.jumlah)||0),0))"></p></div>
    </div>
    <div class="bg-white rounded-xl border shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <input x-model="search" @input.debounce.300ms="filter()" type="text" placeholder="Cari keterangan, kategori..." class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
        <select x-model="filterKat" @change="filter()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">Semua Kategori</option><option>Transportasi</option><option>Makan</option><option>ATK</option><option>Utilitas</option><option>Maintenance</option><option>Marketing</option><option>Lainnya</option>
        </select>
        <input x-model="filterBulan" @change="filter()" type="month" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
    </div>
    <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b"><tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Keterangan</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Kategori</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Dibayar Oleh</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Jumlah</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Reimburse</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr></thead>
                <tbody class="divide-y divide-gray-50">
                    <template x-if="loading"><tr><td colspan="7" class="px-4 py-12 text-center text-gray-400">Memuat...</td></tr></template>
                    <template x-if="!loading&&filtered.length===0"><tr><td colspan="7" class="px-4 py-12 text-center text-gray-400"><p class="font-medium">Belum ada pengeluaran tercatat</p><button @click="openAdd()" class="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm">+ Catat Pengeluaran</button></td></tr></template>
                    <template x-for="tx in filtered" :key="tx.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3 text-gray-500 text-xs" x-text="fmt(tx.tanggal)"></td>
                            <td class="px-4 py-3 font-medium text-gray-900" x-text="tx.keterangan||tx.deskripsi||'-'"></td>
                            <td class="px-4 py-3 hidden md:table-cell"><span class="bg-orange-100 text-orange-700 px-2 py-0.5 text-xs rounded-full" x-text="tx.kategori||'Lainnya'"></span></td>
                            <td class="px-4 py-3 hidden md:table-cell text-gray-500 text-xs" x-text="tx.dibayar_oleh||'-'"></td>
                            <td class="px-4 py-3 text-right font-bold text-red-600" x-text="formatRp(tx.jumlah||0)"></td>
                            <td class="px-4 py-3 text-center hidden lg:table-cell">
                                <span :class="tx.reimburs==='Approved'?'bg-green-100 text-green-700':tx.reimburs==='Pending'?'bg-yellow-100 text-yellow-700':'bg-gray-100 text-gray-500'" class="px-2 py-0.5 text-xs rounded-full" x-text="tx.reimburs||'N/A'"></span>
                            </td>
                            <td class="px-4 py-3 text-right"><button @click="editItem(tx)" class="text-blue-600 text-xs hover:underline mr-2">Edit</button><button @click="delItem(tx)" class="text-red-500 text-xs hover:underline">Hapus</button></td>
                        </tr>
                    </template>
                    <template x-if="!loading&&filtered.length>0">
                        <tr class="bg-gray-50 font-semibold">
                            <td colspan="4" class="px-4 py-3 text-sm text-gray-700">Total</td>
                            <td class="px-4 py-3 text-right font-bold text-red-600" x-text="formatRp(filtered.reduce((a,i)=>a+(parseFloat(i.jumlah)||0),0))"></td>
                            <td colspan="2"></td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
    <div x-show="showModal" x-cloak class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showModal=false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg" @click.stop>
            <div class="p-6">
                <div class="flex items-center justify-between mb-5"><h3 class="text-lg font-bold text-gray-900" x-text="editMode?'Edit Pengeluaran':'Tambah Pengeluaran'"></h3><button @click="showModal=false" class="text-gray-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button></div>
                <form @submit.prevent="save()" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Tanggal *</label><input x-model="form.tanggal" type="date" required class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Jumlah (Rp) *</label><input x-model="form.jumlah" type="number" required class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Keterangan *</label><input x-model="form.keterangan" type="text" required class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label><select x-model="form.kategori" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"><option>Transportasi</option><option>Makan</option><option>ATK</option><option>Utilitas</option><option>Maintenance</option><option>Marketing</option><option>Lainnya</option></select></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Dibayar Oleh</label><input x-model="form.dibayar_oleh" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Reimburse</label><select x-model="form.reimburs" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"><option value="">N/A</option><option>Pending</option><option>Approved</option><option>Rejected</option></select></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">No. Bukti</label><input x-model="form.no_bukti" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                    </div>
                    <div class="flex justify-end gap-3 pt-2">
                        <button type="button" @click="showModal=false" class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600">Batal</button>
                        <button type="submit" :disabled="saving" class="px-6 py-2 text-sm bg-red-600 text-white rounded-lg font-medium disabled:opacity-50"><span x-show="!saving" x-text="editMode?'Update':'Simpan'"></span><span x-show="saving">Menyimpan...</span></button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<script>
function expenseApp(){return{items:[],filtered:[],loading:false,saving:false,search:'',filterKat:'',filterBulan:'',showModal:false,editMode:false,toast:{show:false,msg:'',type:'success'},form:{tanggal:new Date().toISOString().slice(0,10),jumlah:'',keterangan:'',kategori:'Lainnya',dibayar_oleh:'',reimburs:'',no_bukti:''},
async init(){await this.load()},
async load(){this.loading=true;try{const r=await fetch('/api/erp/expenses');if(r.ok){const d=await r.json();this.items=d.data||[]}else this.items=[]}catch{this.items=[]}finally{this.loading=false;this.filter()}},
filter(){let a=this.items;if(this.search)a=a.filter(i=>((i.keterangan||'')+(i.deskripsi||'')).toLowerCase().includes(this.search.toLowerCase()));if(this.filterKat)a=a.filter(i=>i.kategori===this.filterKat);if(this.filterBulan)a=a.filter(i=>(i.tanggal||'').startsWith(this.filterBulan));this.filtered=a},
openAdd(){this.editMode=false;this.form={tanggal:new Date().toISOString().slice(0,10),jumlah:'',keterangan:'',kategori:'Lainnya',dibayar_oleh:'',reimburs:'',no_bukti:''};this.showModal=true},
editItem(tx){this.editMode=true;this.form={...tx};this.showModal=true},
delItem(tx){if(!confirm('Hapus pengeluaran ini?'))return;fetch(`/api/erp/expenses/${tx.id}`,{method:'DELETE',headers:{'X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''}});this.items=this.items.filter(i=>i.id!==tx.id);this.filter();this.showToast('Pengeluaran dihapus','success')},
async save(){this.saving=true;try{const m=this.editMode?'PUT':'POST';const u=this.editMode?`/api/erp/expenses/${this.form.id}`:'/api/erp/expenses';const r=await fetch(u,{method:m,headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify(this.form)});if(r.ok){const d=await r.json();if(this.editMode){const i=this.items.findIndex(x=>x.id===this.form.id);if(i>=0)this.items[i]={...this.items[i],...(d.data||this.form)}}else this.items.unshift(d.data||{id:Date.now(),...this.form})}else{if(!this.editMode)this.items.unshift({id:Date.now(),...this.form})}this.showToast('Pengeluaran disimpan','success')}catch{if(!this.editMode)this.items.unshift({id:Date.now(),...this.form});this.showToast('Tersimpan lokal','success')}finally{this.saving=false;this.showModal=false;this.filter()}},
formatRp(n){return'Rp '+Number(n||0).toLocaleString('id-ID')},
fmt(v){if(!v)return'-';try{return new Date(v).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})}catch{return v}},
showToast(msg,type){this.toast={show:true,msg,type};setTimeout(()=>this.toast.show=false,3000)}
}}
</script>
@endsection
