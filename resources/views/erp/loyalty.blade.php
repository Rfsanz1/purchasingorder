@extends('layouts.erp')
@section('title', 'Loyalty Points')
@section('content')
<div x-data="loyaltyApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div x-show="toast.show" x-cloak x-transition :class="toast.type==='success'?'bg-green-600':'bg-red-600'" class="fixed top-4 right-4 z-50 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium" x-text="toast.msg"></div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Loyalty Points</h1><p class="text-gray-500 mt-1 text-sm">Program poin reward untuk pelanggan setia Gentong Mas</p></div>
        <button @click="openAdd()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>Tambah Poin Manual
        </button>
    </div>

    {{-- Tier Cards --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl p-4 text-white shadow-sm">
            <p class="text-xs opacity-70 mb-1">Bronze</p>
            <p class="text-2xl font-bold" x-text="tiers.bronze??0"></p>
            <p class="text-xs opacity-60">0 - 999 poin</p>
        </div>
        <div class="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-4 text-white shadow-sm">
            <p class="text-xs opacity-70 mb-1">Silver</p>
            <p class="text-2xl font-bold" x-text="tiers.silver??0"></p>
            <p class="text-xs opacity-60">1.000 - 4.999 poin</p>
        </div>
        <div class="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-4 text-white shadow-sm">
            <p class="text-xs opacity-70 mb-1">Gold</p>
            <p class="text-2xl font-bold" x-text="tiers.gold??0"></p>
            <p class="text-xs opacity-60">5.000 - 19.999 poin</p>
        </div>
        <div class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 text-white shadow-sm">
            <p class="text-xs opacity-70 mb-1">Platinum</p>
            <p class="text-2xl font-bold" x-text="tiers.platinum??0"></p>
            <p class="text-xs opacity-60">20.000+ poin</p>
        </div>
    </div>

    <div class="bg-white rounded-xl border shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari nama customer..." class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
        <select x-model="filterTier" @change="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">Semua Tier</option><option>Bronze</option><option>Silver</option><option>Gold</option><option>Platinum</option>
        </select>
        <button @click="search='';filterTier='';load()" class="bg-gray-50 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm">Reset</button>
    </div>

    <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b"><tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Tier</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Total Poin</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Poin Digunakan</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Sisa Poin</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr></thead>
                <tbody class="divide-y divide-gray-50">
                    <template x-if="loading"><tr><td colspan="6" class="px-4 py-12 text-center text-gray-400">Memuat data...</td></tr></template>
                    <template x-if="!loading&&items.length===0"><tr><td colspan="6" class="px-4 py-12 text-center text-gray-400"><p class="font-medium">Belum ada data loyalty</p></td></tr></template>
                    <template x-for="m in items" :key="m.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3"><div class="font-medium text-gray-900" x-text="m.nama||m.customer"></div><div class="text-xs text-gray-400" x-text="m.telepon||''"></div></td>
                            <td class="px-4 py-3 text-center">
                                <span :class="{
                                    'bg-gray-100 text-gray-600': m.tier==='Bronze',
                                    'bg-yellow-100 text-yellow-700': m.tier==='Silver',
                                    'bg-yellow-50 text-yellow-600 border border-yellow-200': m.tier==='Gold',
                                    'bg-blue-100 text-blue-700': m.tier==='Platinum'
                                }" class="px-2 py-0.5 text-xs font-bold rounded-full" x-text="m.tier||'Bronze'"></span>
                            </td>
                            <td class="px-4 py-3 text-right font-medium" x-text="Number(m.total_poin||0).toLocaleString('id-ID')"></td>
                            <td class="px-4 py-3 text-right text-gray-400 hidden md:table-cell" x-text="Number(m.poin_digunakan||0).toLocaleString('id-ID')"></td>
                            <td class="px-4 py-3 text-right font-bold text-blue-600" x-text="Number((m.total_poin||0)-(m.poin_digunakan||0)).toLocaleString('id-ID')"></td>
                            <td class="px-4 py-3 text-right">
                                <button @click="redeemPoin(m)" class="text-blue-600 text-xs hover:underline mr-2">Redeem</button>
                                <button @click="addPoin(m)" class="text-green-600 text-xs hover:underline">+ Poin</button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>

    <div x-show="showModal" x-cloak class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showModal=false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md" @click.stop>
            <div class="p-6">
                <div class="flex items-center justify-between mb-5"><h3 class="text-lg font-bold text-gray-900" x-text="modalType==='redeem'?'Redeem Poin':modalType==='add'?'Tambah Poin':'Tambah Manual'"></h3><button @click="showModal=false" class="text-gray-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button></div>
                <div class="space-y-4">
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Customer</label><input x-model="form.customer" type="text" :readonly="modalType!=='manual'" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" :class="modalType!=='manual'?'bg-gray-50':''"></div>
                    <div><label class="block text-sm font-medium text-gray-700 mb-1" x-text="modalType==='redeem'?'Poin Diredeem':'Poin Ditambahkan'"></label><input x-model="form.poin" type="number" min="1" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                    <div><label class="block text-sm font-medium text-gray-700 mb-1">Keterangan</label><input x-model="form.keterangan" type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"></div>
                    <div class="flex justify-end gap-3 pt-2">
                        <button @click="showModal=false" class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600">Batal</button>
                        <button @click="savePoin()" class="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium">Simpan</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
function loyaltyApp(){return{items:[],tiers:{bronze:0,silver:0,gold:0,platinum:0},loading:false,search:'',filterTier:'',showModal:false,modalType:'manual',toast:{show:false,msg:'',type:'success'},form:{customer:'',poin:'',keterangan:''},
async init(){await this.load()},
async load(){this.loading=true;try{const p=new URLSearchParams({search:this.search,tier:this.filterTier});const r=await fetch(`/api/erp/loyalty?${p}`);if(r.ok){const d=await r.json();this.items=d.data||[];this.tiers=d.tiers||this.calcTiers()}else this.items=[]}catch{this.items=[]}finally{this.loading=false}},
calcTiers(){return{bronze:this.items.filter(i=>i.tier==='Bronze').length,silver:this.items.filter(i=>i.tier==='Silver').length,gold:this.items.filter(i=>i.tier==='Gold').length,platinum:this.items.filter(i=>i.tier==='Platinum').length}},
openAdd(){this.modalType='manual';this.form={customer:'',poin:'',keterangan:''};this.showModal=true},
addPoin(m){this.modalType='add';this.form={customer:m.nama||m.customer,poin:'',keterangan:'Tambah poin manual',memberId:m.id};this.showModal=true},
redeemPoin(m){this.modalType='redeem';this.form={customer:m.nama||m.customer,poin:'',keterangan:'Redeem poin',memberId:m.id};this.showModal=true},
savePoin(){const idx=this.items.findIndex(i=>i.id===this.form.memberId);if(idx>=0){const poin=parseInt(this.form.poin)||0;if(this.modalType==='redeem'){this.items[idx].poin_digunakan=(this.items[idx].poin_digunakan||0)+poin}else{this.items[idx].total_poin=(this.items[idx].total_poin||0)+poin}}else if(this.modalType==='manual'){this.items.unshift({id:Date.now(),nama:this.form.customer,tier:'Bronze',total_poin:parseInt(this.form.poin)||0,poin_digunakan:0})}this.showModal=false;this.showToast('Poin berhasil diproses','success')},
showToast(msg,type){this.toast={show:true,msg,type};setTimeout(()=>this.toast.show=false,3000)}
}}
</script>
@endsection
