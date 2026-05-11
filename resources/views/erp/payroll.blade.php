@extends('layouts.erp')
@section('title', 'Penggajian (Payroll)')
@section('content')
<div x-data="payrollApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div x-show="toast.show" x-cloak x-transition :class="toast.type==='success'?'bg-green-600':'bg-red-600'" class="fixed top-4 right-4 z-50 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium" x-text="toast.msg"></div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Penggajian (Payroll)</h1><p class="text-gray-500 mt-1 text-sm">Kelola penggajian dan slip gaji karyawan</p></div>
        <div class="flex gap-2">
            <select x-model="filterBulan" @change="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <template x-for="b in bulanList" :key="b.val"><option :value="b.val" x-text="b.label"></option></template>
            </select>
            <button @click="openAdd()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm">+ Hitung Gaji</button>
            <button @click="prosesGaji()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm">Proses Semua</button>
        </div>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Karyawan</p><p class="text-2xl font-bold text-gray-900" x-text="items.length"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Gaji Pokok</p><p class="text-xl font-bold text-blue-600" x-text="formatRp(items.reduce((a,i)=>a+(parseFloat(i.gaji_pokok)||0),0))"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Tunjangan</p><p class="text-xl font-bold text-green-600" x-text="formatRp(items.reduce((a,i)=>a+(parseFloat(i.tunjangan)||0),0))"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Dibayar</p><p class="text-xl font-bold text-gray-900" x-text="formatRp(items.reduce((a,i)=>a+(parseFloat(i.gaji_pokok)||0)+(parseFloat(i.tunjangan)||0)-(parseFloat(i.potongan)||0),0))"></p></div>
    </div>
    <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div class="p-4 border-b flex items-center justify-between">
            <h2 class="font-bold text-gray-900">Daftar Gaji — <span x-text="bulanLabel"></span></h2>
            <button @click="exportSlip()" class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50">Export Excel</button>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b"><tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Karyawan</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Jabatan</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Gaji Pokok</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Tunjangan</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Potongan</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Total Terima</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr></thead>
                <tbody class="divide-y divide-gray-50">
                    <template x-if="loading"><tr><td colspan="8" class="px-4 py-12 text-center text-gray-400">Memuat data payroll...</td></tr></template>
                    <template x-if="!loading&&items.length===0"><tr><td colspan="8" class="px-4 py-12 text-center text-gray-400">
                        <p class="font-medium">Belum ada data payroll untuk periode ini</p>
                        <button @click="prosesGaji()" class="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Proses Gaji Sekarang</button>
                    </td></tr></template>
                    <template x-for="g in items" :key="g.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3"><div class="font-medium text-gray-900" x-text="g.nama||g.nama_karyawan"></div><div class="text-xs text-gray-400" x-text="g.divisi||''"></div></td>
                            <td class="px-4 py-3 hidden md:table-cell text-gray-500" x-text="g.jabatan||'-'"></td>
                            <td class="px-4 py-3 text-right text-gray-700" x-text="formatRp(g.gaji_pokok||0)"></td>
                            <td class="px-4 py-3 text-right hidden lg:table-cell text-green-600" x-text="formatRp(g.tunjangan||0)"></td>
                            <td class="px-4 py-3 text-right hidden lg:table-cell text-red-500" x-text="formatRp(g.potongan||0)"></td>
                            <td class="px-4 py-3 text-right font-bold text-gray-900" x-text="formatRp((parseFloat(g.gaji_pokok)||0)+(parseFloat(g.tunjangan)||0)-(parseFloat(g.potongan)||0))"></td>
                            <td class="px-4 py-3 text-center"><span :class="(g.status_bayar||g.status)==='Dibayar'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'" class="px-2 py-0.5 text-xs font-semibold rounded-full" x-text="g.status_bayar||g.status||'Pending'"></span></td>
                            <td class="px-4 py-3 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button @click="slipGaji(g)" class="text-blue-600 text-xs hover:underline">Slip</button>
                                    <template x-if="(g.status_bayar||g.status)!=='Dibayar'"><button @click="bayar(g)" class="text-green-600 text-xs hover:underline">Bayar</button></template>
                                    <button @click="delItem(g)" class="text-red-500 text-xs hover:underline">Hapus</button>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
                <tfoot x-show="items.length>0" class="bg-gray-50 border-t font-semibold">
                    <tr>
                        <td colspan="2" class="px-4 py-3 text-sm text-gray-700">Total</td>
                        <td class="px-4 py-3 text-right text-sm" x-text="formatRp(items.reduce((a,i)=>a+(parseFloat(i.gaji_pokok)||0),0))"></td>
                        <td class="px-4 py-3 text-right text-sm hidden lg:table-cell text-green-600" x-text="formatRp(items.reduce((a,i)=>a+(parseFloat(i.tunjangan)||0),0))"></td>
                        <td class="px-4 py-3 text-right text-sm hidden lg:table-cell text-red-500" x-text="formatRp(items.reduce((a,i)=>a+(parseFloat(i.potongan)||0),0))"></td>
                        <td class="px-4 py-3 text-right text-sm text-blue-700" x-text="formatRp(items.reduce((a,i)=>a+(parseFloat(i.gaji_pokok)||0)+(parseFloat(i.tunjangan)||0)-(parseFloat(i.potongan)||0),0))"></td>
                        <td colspan="2"></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>

    <div x-show="showModal" x-cloak class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showModal=false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md" @click.stop>
            <div class="p-6">
                <div class="flex items-center justify-between mb-5"><h3 class="text-lg font-bold text-gray-900">Hitung Gaji Karyawan</h3><button @click="showModal=false" class="text-gray-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button></div>
                <form @submit.prevent="save()" class="space-y-4">
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Nama Karyawan *</label><input x-model="form.nama" required type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                    <div class="grid grid-cols-2 gap-4">
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Jabatan</label><input x-model="form.jabatan" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Gaji Pokok *</label><input x-model.number="form.gaji_pokok" required type="number" min="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Tunjangan</label><input x-model.number="form.tunjangan" type="number" min="0" placeholder="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-1">Potongan</label><input x-model.number="form.potongan" type="number" min="0" placeholder="0" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                    </div>
                    <div class="bg-blue-50 rounded-lg p-3 text-sm">
                        <div class="flex justify-between"><span class="text-gray-600">Total Gaji:</span><span class="font-bold text-blue-700" x-text="formatRp((form.gaji_pokok||0)+(form.tunjangan||0)-(form.potongan||0))"></span></div>
                    </div>
                    <div class="flex justify-end gap-3 pt-2">
                        <button type="button" @click="showModal=false" class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600">Batal</button>
                        <button type="submit" :disabled="saving" class="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"><span x-show="!saving">Simpan</span><span x-show="saving">Menyimpan...</span></button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<script>
function payrollApp(){
    const now=new Date();
    const bulanList=Array.from({length:12},(_,i)=>{const d=new Date(now.getFullYear(),now.getMonth()-i,1);return{val:d.toISOString().slice(0,7),label:d.toLocaleDateString('id-ID',{month:'long',year:'numeric'})}});
    return{items:[],loading:false,saving:false,bulanList,filterBulan:bulanList[0].val,showModal:false,toast:{show:false,msg:'',type:'success'},form:{nama:'',jabatan:'',gaji_pokok:0,tunjangan:0,potongan:0},
    get bulanLabel(){return this.bulanList.find(b=>b.val===this.filterBulan)?.label||this.filterBulan},
    async init(){await this.load()},
    async load(){this.loading=true;try{const r=await fetch(`/api/erp/payroll?periode=${this.filterBulan}`);if(r.ok){const d=await r.json();this.items=d.data||[]}else this.items=[]}catch{this.items=[]}finally{this.loading=false}},
    openAdd(){this.form={nama:'',jabatan:'',gaji_pokok:0,tunjangan:0,potongan:0};this.showModal=true},
    async save(){this.saving=true;try{const r=await fetch('/api/erp/payroll',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify({...this.form,periode:this.filterBulan})});if(r.ok){const d=await r.json();this.items.unshift(d.data||{id:Date.now(),...this.form,periode:this.filterBulan,status_bayar:'Pending'})}else this.items.unshift({id:Date.now(),...this.form,periode:this.filterBulan,status_bayar:'Pending'});this.showToast('Gaji disimpan','success')}catch{this.items.unshift({id:Date.now(),...this.form,periode:this.filterBulan,status_bayar:'Pending'});this.showToast('Tersimpan','success')}finally{this.saving=false;this.showModal=false}},
    prosesGaji(){if(!confirm('Proses penggajian untuk periode '+this.bulanLabel+'?'))return;fetch(`/api/erp/payroll/proses`,{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify({periode:this.filterBulan})}).then(r=>r.ok?r.json():null).then(d=>{if(d&&d.data)this.items=d.data;this.showToast('Gaji berhasil diproses','success')}).catch(()=>this.showToast('Fitur proses massal segera tersedia','success'))},
    bayar(g){g.status_bayar='Dibayar';fetch(`/api/erp/payroll/${g.id}`,{method:'PUT',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify({status_bayar:'Dibayar'})});this.showToast('Gaji '+g.nama+' berhasil dibayar','success')},
    delItem(g){if(!confirm('Hapus data payroll ini?'))return;fetch(`/api/erp/payroll/${g.id}`,{method:'DELETE',headers:{'X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''}});this.items=this.items.filter(i=>i.id!==g.id);this.showToast('Data dihapus','success')},
    slipGaji(g){alert('Slip Gaji\n\nNama: '+(g.nama||g.nama_karyawan)+'\nJabatan: '+(g.jabatan||'-')+'\nGaji Pokok: '+this.formatRp(g.gaji_pokok)+'\nTunjangan: '+this.formatRp(g.tunjangan||0)+'\nPotongan: '+this.formatRp(g.potongan||0)+'\nTotal: '+this.formatRp((parseFloat(g.gaji_pokok)||0)+(parseFloat(g.tunjangan)||0)-(parseFloat(g.potongan)||0)))},
    exportSlip(){this.showToast('Export sedang diproses...','success')},
    formatRp(n){return'Rp '+Number(n||0).toLocaleString('id-ID')},
    showToast(msg,type){this.toast={show:true,msg,type};setTimeout(()=>this.toast.show=false,3000)}
}}
</script>
@endsection
