<div x-show="modal" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" @click.self="modal=false">
    <div class="bg-white rounded-2xl w-full max-w-md shadow-xl" @click.stop>
        <div class="flex items-center justify-between px-6 py-4 border-b">
            <h2 class="font-semibold text-gray-900" x-text="jenis==='masuk'?'Input Stok Masuk':'Input Stok Keluar'"></h2>
            <button @click="modal=false" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form @submit.prevent="save()" class="p-6 space-y-4">
            <div><label class="block text-xs font-medium text-gray-700 mb-1">Nama Produk *</label><input x-model="form.nama_produk" required type="text" placeholder="Nama produk" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
            <div class="grid grid-cols-2 gap-4">
                <div><label class="block text-xs font-medium text-gray-700 mb-1">SKU</label><input x-model="form.sku" type="text" placeholder="SKU-001" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                <div><label class="block text-xs font-medium text-gray-700 mb-1">Tanggal *</label><input x-model="form.tanggal" required type="date" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div><label class="block text-xs font-medium text-gray-700 mb-1">Qty *</label><input x-model.number="form.qty" required type="number" min="0.01" step="0.01" placeholder="0" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
                <div><label class="block text-xs font-medium text-gray-700 mb-1">Satuan</label><input x-model="form.satuan" type="text" placeholder="pcs, kg, box..." class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
            </div>
            <div><label class="block text-xs font-medium text-gray-700 mb-1">Gudang</label><select x-model="form.gudang_asal" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"><option value="Gudang Utama">Gudang Utama</option><option value="Gudang 2">Gudang 2</option><option value="Toko">Toko</option></select></div>
            <div><label class="block text-xs font-medium text-gray-700 mb-1">Referensi (No PO/Invoice)</label><input x-model="form.referensi" type="text" placeholder="PO-XXXX" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></div>
            <div><label class="block text-xs font-medium text-gray-700 mb-1">Keterangan</label><textarea x-model="form.keterangan" rows="2" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea></div>
            <div class="flex gap-3 pt-2">
                <button type="submit" :disabled="saving" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm disabled:opacity-50" x-text="saving?'Menyimpan...':'Simpan'"></button>
                <button type="button" @click="modal=false" class="flex-1 border text-gray-700 py-2 rounded-lg font-medium text-sm">Batal</button>
            </div>
        </form>
    </div>
</div>
<div x-show="toast" x-transition x-cloak class="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl text-sm shadow-xl" x-text="toast"></div>
