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
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total PO</p><p class="text-2xl font-bold text-gray-900" x-text="total"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Draft / Pending</p><p class="text-2xl font-bold text-yellow-500" x-text="items.filter(i=>i.status==='draft'||i.status==='Draft').length"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Diproses</p><p class="text-2xl font-bold text-blue-600" x-text="items.filter(i=>['acknowledged','sent'].includes(i.status)).length"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Nilai PO</p><p class="text-xl font-bold text-green-600" x-text="formatRp(items.reduce((a,i)=>a+(parseFloat(i.total)||0),0))"></p></div>
    </div>
    <div class="bg-white rounded-xl border shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari No. PO, supplier..." class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
        <select x-model="filterStatus" @change="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">Semua Status</option><option value="draft">Draft</option><option value="sent">Sent</option><option value="acknowledged">Disetujui</option><option value="partial">Partial</option><option value="received">Diterima</option><option value="cancelled">Dibatalkan</option>
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
                            <td class="px-4 py-3"><div class="font-medium text-blue-600" x-text="po.no_po||'PO-'+po.id"></div></td>
                            <td class="px-4 py-3 hidden md:table-cell text-gray-700" x-text="po.nama_supplier||po.supplier||'-'"></td>
                            <td class="px-4 py-3 hidden lg:table-cell text-gray-400 text-xs" x-text="fmt(po.tanggal||po.created_at)"></td>
                            <td class="px-4 py-3">
                                <span :class="{
                                    'bg-gray-100 text-gray-600': po.status==='draft'||!po.status,
                                    'bg-yellow-100 text-yellow-700': po.status==='sent',
                                    'bg-blue-100 text-blue-700': po.status==='acknowledged',
                                    'bg-orange-100 text-orange-700': po.status==='partial',
                                    'bg-green-100 text-green-700': po.status==='received',
                                    'bg-red-100 text-red-700': po.status==='cancelled'
                                }" class="px-2 py-0.5 text-xs font-semibold rounded-full capitalize" x-text="po.status||'draft'"></span>
                            </td>
                            <td class="px-4 py-3 hidden lg:table-cell font-medium text-gray-900 text-right" x-text="formatRp(po.total||0)"></td>
                            <td class="px-4 py-3 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <template x-if="po.status==='draft'||!po.status"><button @click="approve(po)" class="text-green-600 text-xs hover:underline">Setujui</button></template>
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

    <!-- Modal Buat/Edit PO -->
    <div x-show="showModal" x-cloak class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showModal=false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto" @click.stop>
            <div class="p-6">
                <div class="flex items-center justify-between mb-5">
                    <h3 class="text-lg font-bold text-gray-900" x-text="editMode?'Edit Purchase Order':'Buat Purchase Order'"></h3>
                    <button @click="showModal=false" class="text-gray-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
                </div>
                <template x-if="errMsg"><p class="text-red-600 text-sm mb-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2" x-text="errMsg"></p></template>
                <form @submit.prevent="save()" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <!-- Supplier -->
                        <div class="col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                            <div class="relative">
                                <input x-model="form.supplier" @input.debounce.300ms="cariSupplier()" type="text" placeholder="Ketik nama supplier..." class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" autocomplete="off">
                                <ul x-show="supplierResults.length>0" x-cloak class="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
                                    <template x-for="s in supplierResults" :key="s.id">
                                        <li @click="pilihSupplier(s)" class="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer">
                                            <span x-text="s.nama"></span>
                                            <span class="text-xs text-gray-400 ml-2" x-text="s.kota?'('+s.kota+')':''"></span>
                                        </li>
                                    </template>
                                </ul>
                            </div>
                        </div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Tanggal PO</label><input x-model="form.tanggal" type="date" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Exp. Pengiriman</label><input x-model="form.exp_delivery" type="date" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Catatan</label><textarea x-model="form.catatan" rows="2" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500"></textarea></div>
                    </div>

                    <!-- Items -->
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <label class="text-sm font-medium text-gray-700">Item Pesanan</label>
                            <button type="button" @click="addItem()" class="text-blue-600 text-xs hover:underline flex items-center gap-1">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>Tambah Item
                            </button>
                        </div>
                        <div class="border border-gray-200 rounded-lg overflow-hidden">
                            <table class="w-full text-sm">
                                <thead class="bg-gray-50 border-b">
                                    <tr>
                                        <th class="px-3 py-2 text-left text-xs font-semibold text-gray-500">Nama Produk</th>
                                        <th class="px-3 py-2 text-center text-xs font-semibold text-gray-500 w-20">Qty</th>
                                        <th class="px-3 py-2 text-right text-xs font-semibold text-gray-500 w-36">Harga Satuan</th>
                                        <th class="px-3 py-2 text-right text-xs font-semibold text-gray-500 w-36">Subtotal</th>
                                        <th class="px-3 py-2 w-8"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template x-for="(item, idx) in form.items" :key="idx">
                                        <tr class="border-b border-gray-100 last:border-0">
                                            <td class="px-3 py-2"><input x-model="item.nama_produk" type="text" required placeholder="Nama produk" class="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500"></td>
                                            <td class="px-3 py-2"><input x-model="item.quantity" type="number" min="1" required @input="hitungTotal()" class="w-full border border-gray-200 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500"></td>
                                            <td class="px-3 py-2"><input x-model="item.unit_price" type="number" min="0" @input="hitungTotal()" class="w-full border border-gray-200 rounded px-2 py-1 text-xs text-right focus:ring-1 focus:ring-blue-500"></td>
                                            <td class="px-3 py-2 text-right text-xs font-medium text-gray-700" x-text="formatRp((item.quantity||0)*(item.unit_price||0))"></td>
                                            <td class="px-3 py-2 text-center"><button type="button" @click="removeItem(idx)" class="text-red-400 hover:text-red-600"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button></td>
                                        </tr>
                                    </template>
                                    <template x-if="form.items.length===0">
                                        <tr><td colspan="5" class="px-3 py-4 text-center text-gray-400 text-xs">Belum ada item — klik "+ Tambah Item"</td></tr>
                                    </template>
                                </tbody>
                                <tfoot class="bg-gray-50 border-t">
                                    <tr>
                                        <td colspan="3" class="px-3 py-2 text-xs text-gray-500 text-right">Subtotal</td>
                                        <td class="px-3 py-2 text-right text-sm font-semibold" x-text="formatRp(subtotal)"></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" class="px-3 py-2 text-xs text-gray-500 text-right">PPN 11%</td>
                                        <td class="px-3 py-2 text-right text-sm" x-text="formatRp(subtotal*0.11)"></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" class="px-3 py-2 text-xs font-bold text-gray-700 text-right">Total</td>
                                        <td class="px-3 py-2 text-right font-bold text-blue-700" x-text="formatRp(subtotal*1.11)"></td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
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
function poApp(){return{
items:[],loading:false,saving:false,search:'',filterStatus:'',filterDate:'',page:1,total:0,
showModal:false,editMode:false,errMsg:'',subtotal:0,
supplierResults:[],
toast:{show:false,msg:'',type:'success'},
form:{supplier:'',supplier_id:null,tanggal:new Date().toISOString().slice(0,10),exp_delivery:'',catatan:'',items:[]},
async init(){await this.load()},
async load(){
    this.loading=true;
    try{
        const p=new URLSearchParams({search:this.search,status:this.filterStatus,bulan:this.filterDate,page:this.page,per_page:15});
        const r=await fetch(`/api/erp/purchase-orders?${p}`);
        if(r.ok){const d=await r.json();this.items=d.data||[];this.total=d.total||this.items.length}
        else this.items=[];
    }catch{this.items=[]}
    finally{this.loading=false}
},
openAdd(){
    this.editMode=false;this.errMsg='';this.supplierResults=[];this.subtotal=0;
    this.form={supplier:'',supplier_id:null,tanggal:new Date().toISOString().slice(0,10),exp_delivery:'',catatan:'',items:[{nama_produk:'',quantity:1,unit_price:0}]};
    this.showModal=true;
},
editItem(po){
    this.editMode=true;this.errMsg='';this.supplierResults=[];
    this.form={...po,supplier:po.nama_supplier||po.supplier||'',items:po.items||[]};
    if(!this.form.items||this.form.items.length===0)this.form.items=[{nama_produk:'',quantity:1,unit_price:0}];
    this.hitungTotal();
    this.showModal=true;
},
addItem(){this.form.items.push({nama_produk:'',quantity:1,unit_price:0});},
removeItem(idx){this.form.items.splice(idx,1);this.hitungTotal();},
hitungTotal(){this.subtotal=this.form.items.reduce((a,i)=>a+(parseFloat(i.quantity||0)*parseFloat(i.unit_price||0)),0);},
async cariSupplier(){
    if(!this.form.supplier||this.form.supplier.length<2){this.supplierResults=[];return;}
    try{
        const r=await fetch(`/api/erp/suppliers?search=${encodeURIComponent(this.form.supplier)}&per_page=10`);
        if(r.ok){const d=await r.json();this.supplierResults=d.data||[]}
    }catch{}
},
pilihSupplier(s){this.form.supplier=s.nama;this.form.supplier_id=s.id;this.supplierResults=[];},
approve(po){
    fetch(`/api/erp/purchase-orders/${po.id}`,{method:'PUT',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify({status:'acknowledged'})})
        .then(r=>{if(r.ok){po.status='acknowledged';this.showToast('PO disetujui','success')}});
},
delItem(po){
    if(!confirm('Hapus PO ini?'))return;
    fetch(`/api/erp/purchase-orders/${po.id}`,{method:'DELETE',headers:{'X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''}})
        .then(r=>{if(r.ok){this.items=this.items.filter(i=>i.id!==po.id);this.total--;this.showToast('PO dihapus','success')}});
},
async save(){
    this.saving=true;this.errMsg='';
    try{
        const url=this.editMode?`/api/erp/purchase-orders/${this.form.id}`:'/api/erp/purchase-orders';
        const method=this.editMode?'PUT':'POST';
        const payload={...this.form};
        const r=await fetch(url,{method,headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify(payload)});
        const d=await r.json();
        if(r.ok){
            if(this.editMode){const i=this.items.findIndex(x=>x.id===this.form.id);if(i>=0)this.items[i]={...this.items[i],...this.form,no_po:this.items[i].no_po}}
            else{this.items.unshift({id:d.id||Date.now(),no_po:d.no_po||'PO-'+Date.now(),nama_supplier:this.form.supplier,tanggal:this.form.tanggal,status:'draft',total:this.subtotal*1.11});this.total++}
            this.showToast('PO disimpan','success');
            this.showModal=false;
        }else{
            this.errMsg=d.message||JSON.stringify(d.errors||'Gagal menyimpan');
        }
    }catch(e){this.errMsg='Koneksi gagal: '+e.message}
    finally{this.saving=false}
},
formatRp(n){return'Rp '+Number(n||0).toLocaleString('id-ID')},
fmt(v){if(!v)return'-';try{return new Date(v).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})}catch{return v}},
showToast(msg,type){this.toast={show:true,msg,type};setTimeout(()=>this.toast.show=false,3000)}
}}
</script>
@endsection
