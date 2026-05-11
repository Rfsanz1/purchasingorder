@extends('layouts.erp')
@section('title', 'Chart of Accounts')
@section('content')
<div x-data="coaApp()" x-init="init()" class="p-4 md:p-6 max-w-6xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Chart of Accounts (COA)</h1><p class="text-gray-500 mt-1">Struktur akun pembukuan perusahaan</p></div>
        <button @click="openCreate()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg> Tambah Akun
        </button>
    </div>
    <div class="bg-white rounded-xl border p-4 mb-4 flex gap-3">
        <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari kode, nama akun..." class="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
        <select x-model="filterJenis" @change="load()" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">Semua Jenis</option><option>Aktiva</option><option>Pasiva</option><option>Pendapatan</option><option>Biaya</option><option>Ekuitas</option>
        </select>
    </div>
    <div class="bg-white rounded-xl border overflow-hidden">
        <div x-show="loading" class="flex justify-center py-12"><div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
        <div x-show="!loading" class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Kode</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nama Akun</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Jenis</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Sub Jenis</th>
                        <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Saldo Awal</th>
                        <th class="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Aktif</th>
                        <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    <template x-for="r in filteredRows" :key="r.id">
                        <tr class="hover:bg-gray-50" :class="!r.kode_induk?'font-semibold bg-gray-50/50':''">
                            <td class="px-4 py-2.5 font-mono text-xs font-bold text-blue-700" x-text="r.kode"></td>
                            <td class="px-4 py-2.5 text-gray-900" :class="!r.kode_induk?'font-bold':'pl-8'" x-text="r.nama"></td>
                            <td class="px-4 py-2.5">
                                <span :class="{'bg-blue-100 text-blue-700':r.jenis==='Aktiva','bg-red-100 text-red-700':r.jenis==='Pasiva','bg-green-100 text-green-700':r.jenis==='Pendapatan','bg-orange-100 text-orange-700':r.jenis==='Biaya','bg-purple-100 text-purple-700':r.jenis==='Ekuitas'}" class="px-2 py-0.5 rounded-full text-xs font-medium" x-text="r.jenis"></span>
                            </td>
                            <td class="px-4 py-2.5 text-gray-500 text-xs" x-text="r.sub_jenis||'-'"></td>
                            <td class="px-4 py-2.5 text-right font-medium" x-text="formatCurrency(r.saldo_awal||0)"></td>
                            <td class="px-4 py-2.5 text-center"><span :class="r.is_active?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'" class="px-2 py-0.5 rounded-full text-xs font-medium" x-text="r.is_active?'Aktif':'Non-Aktif'"></span></td>
                            <td class="px-4 py-2.5 text-right">
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
            <div class="flex items-center justify-between px-6 py-4 border-b"><h2 class="font-semibold text-gray-900">Tambah Akun</h2><button @click="modal=false" class="text-gray-400 hover:text-gray-600">✕</button></div>
            <form @submit.prevent="save()" class="p-6 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Kode Akun *</label><input x-model="form.kode" required type="text" placeholder="1-1300" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                    <div><label class="block text-xs font-medium text-gray-700 mb-1">Jenis *</label><select x-model="form.jenis" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"><option>Aktiva</option><option>Pasiva</option><option>Pendapatan</option><option>Biaya</option><option>Ekuitas</option></select></div>
                </div>
                <div><label class="block text-xs font-medium text-gray-700 mb-1">Nama Akun *</label><input x-model="form.nama" required type="text" placeholder="Nama akun..." class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                <div><label class="block text-xs font-medium text-gray-700 mb-1">Sub Jenis</label><input x-model="form.sub_jenis" type="text" placeholder="Kas & Bank, Piutang..." class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                <div><label class="block text-xs font-medium text-gray-700 mb-1">Saldo Awal</label><input x-model.number="form.saldo_awal" type="number" min="0" placeholder="0" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
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
function coaApp() {
    return {
        rows:[], loading:true, search:'', filterJenis:'',
        modal:false, saving:false, toast:'',
        form:{kode:'',nama:'',jenis:'Aktiva',sub_jenis:'',saldo_awal:0},
        get filteredRows() {
            return this.rows.filter(r => {
                const s=this.search.toLowerCase();
                return (!s||(r.kode||'').toLowerCase().includes(s)||(r.nama||'').toLowerCase().includes(s)) && (!this.filterJenis||r.jenis===this.filterJenis);
            });
        },
        async init(){await this.load();},
        async load(){this.loading=true;try{const d=await fetch('/api/erp/coa').then(r=>r.json());this.rows=d.data||[];}finally{this.loading=false;}},
        openCreate(){this.form={kode:'',nama:'',jenis:'Aktiva',sub_jenis:'',saldo_awal:0};this.modal=true;},
        async save(){this.saving=true;try{const d=await fetch('/api/erp/coa',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''},body:JSON.stringify(this.form)}).then(r=>r.json());if(d.ok){this.modal=false;this.showToast('Akun ditambahkan');this.load();}else this.showToast('Gagal: '+(d.message||'Error'));}finally{this.saving=false;}},
        async del(id){if(!confirm('Hapus akun ini?'))return;await fetch(`/api/erp/coa/${id}`,{method:'DELETE',headers:{'X-CSRF-TOKEN':document.querySelector('meta[name=csrf-token]')?.content||''}});this.showToast('Akun dihapus');this.load();},
        showToast(msg){this.toast=msg;setTimeout(()=>this.toast='',3000);},
        formatCurrency(v){return'Rp '+Number(v||0).toLocaleString('id-ID');},
    };
}
</script>
@endsection
