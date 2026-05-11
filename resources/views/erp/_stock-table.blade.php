<div class="bg-white rounded-xl border p-4 mb-4 flex flex-col sm:flex-row gap-3">
    <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari produk, no mutasi..." class="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
</div>
<div class="bg-white rounded-xl border overflow-hidden">
    <div x-show="loading" class="flex justify-center py-12"><div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
    <div x-show="!loading && rows.length===0" class="text-center py-16 text-gray-400"><p>Belum ada mutasi stok</p></div>
    <div x-show="!loading && rows.length>0" class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b">
                <tr>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">No Mutasi</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Produk</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Gudang</th>
                    <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Qty</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Referensi</th>
                    <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr>
            </thead>
            <tbody class="divide-y">
                <template x-for="r in rows" :key="r.id">
                    <tr class="hover:bg-gray-50">
                        <td class="px-4 py-3 text-xs font-mono text-blue-600" x-text="r.no_mutasi"></td>
                        <td class="px-4 py-3"><div class="font-medium text-gray-900" x-text="r.nama_produk"></div><div class="text-xs text-gray-400" x-text="r.sku||''"></div></td>
                        <td class="px-4 py-3 text-gray-600 text-xs" x-text="r.gudang_asal || r.gudang_tujuan || 'Gudang Utama'"></td>
                        <td class="px-4 py-3 text-right font-bold" :class="r.jenis==='masuk'?'text-green-600':'text-red-500'" x-text="(r.jenis==='masuk'?'+':'-') + r.qty + ' ' + (r.satuan||'pcs')"></td>
                        <td class="px-4 py-3 text-gray-600" x-text="r.tanggal"></td>
                        <td class="px-4 py-3 text-gray-500 text-xs" x-text="r.referensi||'-'"></td>
                        <td class="px-4 py-3 text-right"><button @click="del(r.id)" class="text-red-500 hover:text-red-700 text-xs font-medium">Hapus</button></td>
                    </tr>
                </template>
            </tbody>
        </table>
        <div class="px-4 py-3 border-t flex items-center justify-between text-sm text-gray-500">
            <span x-text="`${total} mutasi`"></span>
            <div class="flex gap-2">
                <button @click="prevPage()" :disabled="page<=1" class="px-3 py-1 border rounded-lg disabled:opacity-40">‹</button>
                <span x-text="`Hal ${page}`" class="px-2 py-1"></span>
                <button @click="nextPage()" :disabled="rows.length<perPage" class="px-3 py-1 border rounded-lg disabled:opacity-40">›</button>
            </div>
        </div>
    </div>
</div>
