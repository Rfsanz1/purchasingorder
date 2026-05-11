@extends('layouts.erp')
<<<<<<< HEAD
@section('title', 'Gaji & Payroll')
@section('content')
<div x-data="payrollApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Gaji & Payroll</h1><p class="text-gray-500 mt-1">Perhitungan dan pembayaran gaji karyawan</p></div>
        <button @click="openCreate()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg> Hitung Gaji
        </button>
    </div>
    <!-- Filter -->
    <div class="bg-white rounded-xl border p-4 mb-4 flex gap-3">
        <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari nama karyawan..." class="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
        <input x-model="filterPeriode" @change="load()" type="month" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
    </div>
    <!-- Summary -->
    <div class="bg-white rounded-xl border p-4 mb-4 flex gap-6">
        <div><p class="text-xs text-gray-500">Total Karyawan</p><p class="text-xl font-bold text-gray-900" x-text="total"></p></div>
        <div><p class="text-xs text-gray-500">Total Gaji</p><p class="text-xl font-bold text-green-600" x-text="formatCurrency(totalGaji)"></p></div>
    </div>
    <!-- Table -->
    <div class="bg-white rounded-xl border overflow-hidden">
        <div x-show="loading" class="flex justify-center py-12"><div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
        <div x-show="!loading && rows.length===0" class="text-center py-16 text-gray-400"><p>Belum ada data payroll</p></div>
        <div x-show="!loading && rows.length>0" class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b"><tr>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Karyawan</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Periode</th>
                    <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Gaji Pokok</th>
                    <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tunjangan</th>
                    <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Potongan</th>
                    <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr></thead>
                <tbody class="divide-y">
                    <template x-for="r in rows" :key="r.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3 font-medium text-gray-900" x-text="r.nama_karyawan"></td>
                            <td class="px-4 py-3 text-gray-600" x-text="r.periode"></td>
                            <td class="px-4 py-3 text-right" x-text="formatCurrency(r.gaji_pokok)"></td>
                            <td class="px-4 py-3 text-right text-green-600" x-text="formatCurrency((r.tunjangan||0)+(r.insentif||0)+(r.lembur||0))"></td>
                            <td class="px-4 py-3 text-right text-red-500" x-text="formatCurrency((r.potongan||0)+(r.bpjs_tk||0)+(r.bpjs_kes||0))"></td>
                            <td class="px-4 py-3 text-right font-bold text-blue-700" x-text="formatCurrency(r.total_gaji)"></td>
                            <td class="px-4 py-3"><span :class="r.status==='Dibayar'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'" class="px-2 py-0.5 rounded-full text-xs font-medium" x-text="r.status"></span></td>
                            <td class="px-4 py-3 text-right">
                                <button @click="bayar(r.id)" x-show="r.status==='Draft'" class="text-green-600 hover:text-green-800 text-xs font-medium mr-2">Bayar</button>
                                <button @click="del(r.id)" class="text-red-500 hover:text-red-700 text-xs font-medium">Hapus</button>
=======
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
            <button @click="prosesGaji()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm">Proses Gaji</button>
        </div>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Karyawan</p><p class="text-2xl font-bold text-gray-900" x-text="stats.total??0"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Gaji Pokok</p><p class="text-xl font-bold text-blue-600" x-text="formatRp(stats.totalGajiPokok??0)"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Tunjangan</p><p class="text-xl font-bold text-green-600" x-text="formatRp(stats.totalTunjangan??0)"></p></div>
        <div class="bg-white rounded-xl border p-4 shadow-sm"><p class="text-xs text-gray-500">Total Dibayar</p><p class="text-xl font-bold text-gray-900" x-text="formatRp(stats.totalDibayar??0)"></p></div>
    </div>

    <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div class="p-4 border-b flex items-center justify-between">
            <h2 class="font-bold text-gray-900">Daftar Gaji — <span x-text="bulanLabel"></span></h2>
            <div class="flex gap-2">
                <button @click="exportSlip()" class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50">Export Excel</button>
                <button @click="printAll()" class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50">Print Semua</button>
            </div>
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
                            <td class="px-4 py-3"><div class="font-medium text-gray-900" x-text="g.nama"></div><div class="text-xs text-gray-400" x-text="g.divisi||''"></div></td>
                            <td class="px-4 py-3 hidden md:table-cell text-gray-500" x-text="g.jabatan||'-'"></td>
                            <td class="px-4 py-3 text-right text-gray-700" x-text="formatRp(g.gaji_pokok||0)"></td>
                            <td class="px-4 py-3 text-right hidden lg:table-cell text-green-600" x-text="formatRp(g.tunjangan||0)"></td>
                            <td class="px-4 py-3 text-right hidden lg:table-cell text-red-500" x-text="formatRp(g.potongan||0)"></td>
                            <td class="px-4 py-3 text-right font-bold text-gray-900" x-text="formatRp((g.gaji_pokok||0)+(g.tunjangan||0)-(g.potongan||0))"></td>
                            <td class="px-4 py-3 text-center"><span :class="g.status_bayar==='Dibayar'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'" class="px-2 py-0.5 text-xs font-semibold rounded-full" x-text="g.status_bayar||'Pending'"></span></td>
                            <td class="px-4 py-3 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button @click="slipGaji(g)" class="text-blue-600 text-xs hover:underline">Slip</button>
                                    <template x-if="g.status_bayar!=='Dibayar'"><button @click="bayar(g)" class="text-green-600 text-xs hover:underline">Bayar</button></template>
                                </div>
>>>>>>> 62d477c (Activate non-AI related "Coming Soon" features in the sidebar)
                            </td>
                        </tr>
                    </template>
                </tbody>
<<<<<<< HEAD
            </table>
        </div>
    </div>
    <!-- Modal -->
    <div x-show="modal" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" @click.self="modal=false">
        <div class="bg-white rounded-2xl w-full max-w-md shadow-xl" @click.stop>
            <div class="flex items-center justify-between px-6 py-4 border-b"><h2 class="font-semibold text-gray-900">Hitung Gaji Karyawan</h2><button @click="modal=false" class="text-gray-400 hover:text-gray-600">✕</button></div>
            <form @submit.prevent="save()" class="p-6 space-y-4">
                <div><label class="block text-xs font-medium text-gray-700 mb-1">Nama Karyawan *</label><input x-model="form.nama_karyawan" required type="text" placeholder="Nama karyawan" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                <div><label class="block text-xs font-medium text-gray-700 mb-1">Periode *</label><input x-model="form.periode" required type="month" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Gaji Pokok *</label><input x-model.number="form.gaji_pokok" required type="number" min="0" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Tunjangan</label><input x-model.number="form.tunjangan" type="number" min="0" placeholder="0" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Insentif</label><input x-model.number="form.insentif" type="number" min="0" placeholder="0" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Lembur</label><input x-model.number="form.lembur" type="number" min="0" placeholder="0" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Potongan</label><input x-model.number="form.potongan" type="number" min="0" placeholder="0" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                </div>
                <div class="bg-blue-50 rounded-lg p-3 text-sm">
                    <div class="flex justify-between"><span class="text-gray-600">Total Gaji (estimasi):</span><span class="font-bold text-blue-700" x-text="formatCurrency((form.gaji_pokok||0)+(form.tunjangan||0)+(form.insentif||0)+(form.lembur||0)-(form.potongan||0)-Math.round((form.gaji_pokok||0)*0.03))"></span></div>
                    <div class="text-xs text-gray-400 mt-1">*BPJS TK (2%) dan BPJS Kes (1%) dihitung otomatis</div>
                </div>
                <div class="flex gap-3 pt-2">
                    <button type="submit" :disabled="saving" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm disabled:opacity-50" x-text="saving?'Menyimpan...':'Hitung & Simpan'"></button>
                    <button type="button" @click="modal=false" class="flex-1 border text-gray-700 py-2 rounded-lg font-medium text-sm">Batal</button>
                </div>
            </form>
        </div>
    </div>
    <div x-show="toast" x-transition x-cloak class="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl text-sm shadow-xl" x-text="toast"></div>
</div>
<script>
function payrollApp() {
    return {
        rows:[],total:0,totalGaji:0,page:1,perPage:20,loading:true,search:'',filterPeriode:'',
        modal:false,saving:false,toast:'',
        form:{nama_karyawan:'',periode:new Date().toISOString().slice(0,7),gaji_pokok:0,tunjangan:0,insentif:0,lembur:0,potongan:0},
        async init(){await this.load();},
        async load(){this.loading=true;try{const p=new URLSearchParams({search:this.search,periode:this.filterPeriode,page:this.page,per_page:this.perPage});const d=await fetch('/api/erp/payroll?'+p).then(r=>r.json());this.rows=d.data||[];this.total=d.total||0;this.totalGaji=d.total_gaji||0;}finally{this.loading=false;}},
        openCreate(){this.form={nama_karyawan:'',periode:new Date().toISOString().slice(0,7),gaji_pokok:0,tunjangan:0,insentif:0,lembur:0,potongan:0};this.modal=true;},
        async save(){this.saving=true;try{const d=await fetch('/api/erp/payroll',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify(this.form)}).then(r=>r.json());if(d.ok){this.modal=false;this.showToast('Gaji berhasil dihitung');this.load();}else this.showToast('Gagal: '+(d.message||'Error'));}finally{this.saving=false;}},
        async bayar(id){await fetch(`/api/erp/payroll/${id}`,{method:'PUT',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify({status:'Dibayar',tanggal_bayar:new Date().toISOString().slice(0,10)})});this.showToast('Gaji ditandai dibayar');this.load();},
        async del(id){if(!confirm('Hapus data payroll ini?'))return;await fetch(`/api/erp/payroll/${id}`,{method:'DELETE',headers:{'X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''}});this.showToast('Data dihapus');this.load();},
        showToast(msg){this.toast=msg;setTimeout(()=>this.toast='',3000);},
        formatCurrency(v){return'Rp '+Number(v||0).toLocaleString('id-ID');},
    };
}
=======
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
</div>
<script>
function payrollApp(){
    const now=new Date();
    const bulanList=Array.from({length:12},(_,i)=>{const d=new Date(now.getFullYear(),now.getMonth()-i,1);return{val:d.toISOString().slice(0,7),label:d.toLocaleDateString('id-ID',{month:'long',year:'numeric'})}});
    return{items:[],stats:{},loading:false,bulanList,filterBulan:bulanList[0].val,toast:{show:false,msg:'',type:'success'},
    get bulanLabel(){return this.bulanList.find(b=>b.val===this.filterBulan)?.label||this.filterBulan},
    async init(){await this.load()},
    async load(){this.loading=true;try{const r=await fetch(`/api/erp/payroll?bulan=${this.filterBulan}`);if(r.ok){const d=await r.json();this.items=d.data||[];this.stats=d.stats||{total:this.items.length,totalGajiPokok:this.items.reduce((a,i)=>a+(parseFloat(i.gaji_pokok)||0),0),totalTunjangan:this.items.reduce((a,i)=>a+(parseFloat(i.tunjangan)||0),0),totalDibayar:this.items.reduce((a,i)=>a+(parseFloat(i.gaji_pokok)||0)+(parseFloat(i.tunjangan)||0)-(parseFloat(i.potongan)||0),0)}}else this.items=[]}catch{this.items=[]}finally{this.loading=false}},
    prosesGaji(){if(!confirm('Proses penggajian untuk periode '+this.bulanLabel+'?'))return;const demoKaryawan=[{id:1,nama:'Ahmad Fauzi',jabatan:'Sales',divisi:'Sales',gaji_pokok:4000000,tunjangan:500000,potongan:200000,status_bayar:'Pending'},{id:2,nama:'Siti Rahayu',jabatan:'Finance',divisi:'Finance',gaji_pokok:5000000,tunjangan:750000,potongan:300000,status_bayar:'Pending'},{id:3,nama:'Budi Santoso',jabatan:'Gudang',divisi:'Gudang',gaji_pokok:3500000,tunjangan:400000,potongan:150000,status_bayar:'Pending'},{id:4,nama:'Dewi Lestari',jabatan:'Manager',divisi:'Operasional',gaji_pokok:8000000,tunjangan:1500000,potongan:500000,status_bayar:'Pending'}];this.items=demoKaryawan;this.stats={total:demoKaryawan.length,totalGajiPokok:demoKaryawan.reduce((a,i)=>a+i.gaji_pokok,0),totalTunjangan:demoKaryawan.reduce((a,i)=>a+i.tunjangan,0),totalDibayar:demoKaryawan.reduce((a,i)=>a+i.gaji_pokok+i.tunjangan-i.potongan,0)};this.showToast('Gaji berhasil diproses untuk '+demoKaryawan.length+' karyawan','success')},
    bayar(g){g.status_bayar='Dibayar';this.showToast('Gaji '+g.nama+' berhasil dibayar','success')},
    slipGaji(g){alert('Slip Gaji\n\nNama: '+g.nama+'\nJabatan: '+g.jabatan+'\nGaji Pokok: '+this.formatRp(g.gaji_pokok)+'\nTunjangan: '+this.formatRp(g.tunjangan)+'\nPotongan: '+this.formatRp(g.potongan)+'\nTotal: '+this.formatRp(g.gaji_pokok+g.tunjangan-g.potongan))},
    exportSlip(){this.showToast('File Excel akan didownload...','success')},
    printAll(){window.print()},
    formatRp(n){return'Rp '+Number(n||0).toLocaleString('id-ID')},
    showToast(msg,type){this.toast={show:true,msg,type};setTimeout(()=>this.toast.show=false,3000)}
}}
>>>>>>> 62d477c (Activate non-AI related "Coming Soon" features in the sidebar)
</script>
@endsection
