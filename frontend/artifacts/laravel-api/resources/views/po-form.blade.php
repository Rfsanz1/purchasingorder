@extends('layouts.app')
@section('title', 'Buat Purchase Order')

@section('content')
<div x-data="poFormApp()" x-init="init()" class="min-h-screen bg-gray-50">

    {{-- Header --}}
    <div class="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-4 pt-8 pb-6">
        <div class="max-w-lg mx-auto flex items-center gap-3">
            <a href="/" class="text-blue-200 hover:text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </a>
            <div>
                <p class="text-blue-200 text-xs">Form Pemesanan</p>
                <h1 class="text-xl font-bold">Buat Purchase Order</h1>
            </div>
        </div>
    </div>

    {{-- Sales login gate --}}
    <div x-show="!salesLoggedIn" class="max-w-lg mx-auto px-4 py-6">
        <div class="bg-white rounded-2xl shadow-sm p-5">
            <h2 class="font-bold text-gray-800 mb-1">Login Sales</h2>
            <p class="text-sm text-gray-500 mb-4">Pilih nama dan masukkan password Anda</p>
            <div class="space-y-3">
                <div>
                    <label class="text-sm font-medium text-gray-700 block mb-1">Username</label>
                    <select x-model="salesLoginUser" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option value="">-- Pilih Sales --</option>
                        <option>lehan</option><option>wiwid</option><option>priyanto</option>
                        <option>agus</option><option>agung</option><option>andre</option>
                        <option>imam</option><option>dhani</option><option>rio brandon</option>
                        <option>ivan</option><option>dias</option>
                    </select>
                </div>
                <div>
                    <label class="text-sm font-medium text-gray-700 block mb-1">Password</label>
                    <input type="password" x-model="salesLoginPass" @keydown.enter="salesLogin()"
                        class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                </div>
                <p x-show="salesLoginErr" class="text-sm text-red-600" x-text="salesLoginErr"></p>
                <button @click="salesLogin()" :disabled="salesLoginLoading"
                    class="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50">
                    <span x-text="salesLoginLoading ? 'Masuk...' : 'Masuk'"></span>
                </button>
            </div>
        </div>
    </div>

    {{-- Main Form --}}
    <div x-show="salesLoggedIn" x-cloak class="max-w-lg mx-auto px-4 py-6 space-y-4 pb-32">

        {{-- Sales info --}}
        <div class="bg-blue-50 rounded-xl px-4 py-2.5 flex items-center justify-between">
            <p class="text-sm text-blue-700">Sales: <span class="font-bold capitalize" x-text="form.salesPerson"></span></p>
            <button @click="salesLogout()" class="text-xs text-blue-500 hover:text-blue-700">Ganti</button>
        </div>

        {{-- Customer Info --}}
        <div class="bg-white rounded-2xl shadow-sm p-5">
            <h2 class="font-bold text-gray-800 mb-4">Informasi Customer</h2>

            {{-- Contact search --}}
            <div class="mb-4 relative" x-data="{ focused: false }">
                <label class="text-sm font-medium text-gray-700 block mb-1">Cari Kontak (nama atau no. telp)</label>
                <input type="text" x-model="contactSearch" @input.debounce.400ms="searchContacts()" @focus="focused=true" @blur="setTimeout(()=>focused=false,200)"
                    class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Ketik nama atau nomor telepon...">
                <div x-show="contactResults.length > 0 && focused" class="absolute z-20 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 max-h-48 overflow-y-auto">
                    <template x-for="c in contactResults" :key="c.id">
                        <button @click="selectContact(c)" class="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm border-b border-gray-50 last:border-0">
                            <p class="font-medium text-gray-800" x-text="c.name"></p>
                            <p class="text-xs text-gray-500" x-text="c.mobile_phone"></p>
                            <p x-show="c.address" class="text-xs text-gray-400" x-text="c.address"></p>
                        </button>
                    </template>
                </div>
                <div x-show="contactLoading" class="absolute right-3 top-9">
                    <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>

            <div class="space-y-3">
                <div>
                    <label class="text-sm font-medium text-gray-700 block mb-1">Nama Kontak <span class="text-red-500">*</span></label>
                    <input type="text" x-model="form.namaKontak" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Nama lengkap customer">
                    <p x-show="errors.namaKontak" class="text-xs text-red-500 mt-1" x-text="errors.namaKontak"></p>
                </div>
                <div>
                    <label class="text-sm font-medium text-gray-700 block mb-1">Nomor Telepon <span class="text-red-500">*</span></label>
                    <input type="tel" x-model="form.nomorTelepon" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="08xx atau +62xx">
                    <p x-show="errors.nomorTelepon" class="text-xs text-red-500 mt-1" x-text="errors.nomorTelepon"></p>
                </div>
                <div>
                    <label class="text-sm font-medium text-gray-700 block mb-1">Alamat <span class="text-red-500">*</span></label>
                    <textarea x-model="form.alamat" rows="2" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" placeholder="Alamat lengkap pengiriman"></textarea>
                    <p x-show="errors.alamat" class="text-xs text-red-500 mt-1" x-text="errors.alamat"></p>
                </div>
                <div>
                    <label class="text-sm font-medium text-gray-700 block mb-1">Patokan Lokasi</label>
                    <input type="text" x-model="form.patokanLokasi" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Dekat masjid, sebelah toko...">
                </div>
            </div>
        </div>

        {{-- Products --}}
        <div class="bg-white rounded-2xl shadow-sm p-5">
            <div class="flex items-center justify-between mb-4">
                <h2 class="font-bold text-gray-800">Produk</h2>
                <button @click="addItem()" class="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 font-medium">+ Tambah Produk</button>
            </div>

            <template x-for="(item, idx) in form.items" :key="idx">
                <div class="mb-4 pb-4 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
                    <div class="flex items-center justify-between mb-2">
                        <p class="text-sm font-medium text-gray-600">Produk <span x-text="idx+1"></span></p>
                        <button x-show="form.items.length > 1" @click="removeItem(idx)" class="text-red-400 hover:text-red-600 text-xs">Hapus</button>
                    </div>

                    {{-- Product search --}}
                    <div class="relative mb-2" x-data="{ pFocused: false }">
                        <input type="text" :x-model="`productSearch_${idx}`" x-model="item._search"
                            @input.debounce.400ms="searchProducts(idx)" @focus="pFocused=true" @blur="setTimeout(()=>pFocused=false,200)"
                            class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" :placeholder="'Cari produk ' + (idx+1)">
                        <div x-show="item._results && item._results.length > 0 && pFocused" class="absolute z-20 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 max-h-48 overflow-y-auto">
                            <template x-for="p in item._results" :key="p.id">
                                <button @click="selectProduct(idx, p)" class="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm border-b border-gray-50 last:border-0">
                                    <p class="font-medium text-gray-800" x-text="p.name"></p>
                                    <p class="text-xs text-gray-500" x-text="p.code ? ('Kode: ' + p.code) : ''"></p>
                                </button>
                            </template>
                        </div>
                        <div x-show="item._loading" class="absolute right-3 top-2.5">
                            <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    </div>

                    <div>
                        <label class="text-xs text-gray-500 mb-1 block">Nama Produk <span class="text-red-500">*</span></label>
                        <input type="text" x-model="item.namaProduk" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Nama produk">
                    </div>
                    <div class="grid grid-cols-2 gap-3 mt-2">
                        <div>
                            <label class="text-xs text-gray-500 mb-1 block">Jumlah <span class="text-red-500">*</span></label>
                            <input type="number" x-model.number="item.jumlahProduk" min="1" @change="calcTotal()" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                        </div>
                        <div>
                            <label class="text-xs text-gray-500 mb-1 block">Harga Satuan <span class="text-red-500">*</span></label>
                            <input type="number" x-model.number="item.hargaProduk" min="0" @change="calcTotal()" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="0">
                        </div>
                    </div>
                    <div class="text-right mt-1">
                        <span class="text-xs text-gray-500">Subtotal: </span>
                        <span class="text-sm font-semibold text-blue-700" x-text="'Rp ' + formatRupiah(item.jumlahProduk * item.hargaProduk)"></span>
                    </div>
                </div>
            </template>

            {{-- Ongkir --}}
            <div class="mt-4 pt-4 border-t border-gray-100">
                <label class="text-sm font-medium text-gray-700 block mb-1">Biaya Pengiriman (Ongkir)</label>
                <input type="number" x-model.number="form.biayaPengiriman" min="0" @change="calcTotal()" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="0 (gratis)">
            </div>

            {{-- Total --}}
            <div class="mt-3 bg-blue-50 rounded-xl px-4 py-3 flex items-center justify-between">
                <span class="text-sm text-blue-700 font-medium">Total Harga</span>
                <span class="text-lg font-bold text-blue-800" x-text="'Rp ' + formatRupiah(totalHarga)"></span>
            </div>

            {{-- Metode pengiriman --}}
            <div class="mt-4">
                <label class="text-sm font-medium text-gray-700 block mb-2">Metode Pengiriman <span class="text-red-500">*</span></label>
                <div class="flex gap-3">
                    <button @click="form.metodePengiriman='Dikirim'" :class="form.metodePengiriman==='Dikirim' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'"
                        class="flex-1 border-2 rounded-xl py-2.5 text-sm font-medium transition-colors">🚚 Dikirim</button>
                    <button @click="form.metodePengiriman='BawaSendiri'" :class="form.metodePengiriman==='BawaSendiri' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'"
                        class="flex-1 border-2 rounded-xl py-2.5 text-sm font-medium transition-colors">🏪 Bawa Sendiri</button>
                </div>
            </div>
        </div>

        {{-- Payment --}}
        <div class="bg-white rounded-2xl shadow-sm p-5">
            <div class="flex items-center justify-between mb-4">
                <h2 class="font-bold text-gray-800">Pembayaran</h2>
                <button x-show="form.paymentSplits.length < 4" @click="addSplit()" class="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 font-medium">+ Split</button>
            </div>

            <template x-for="(split, idx) in form.paymentSplits" :key="idx">
                <div class="mb-4 pb-4 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
                    <div class="flex items-center justify-between mb-2">
                        <p class="text-sm font-medium text-gray-600">Pembayaran <span x-text="idx+1"></span></p>
                        <button x-show="form.paymentSplits.length > 1" @click="removeSplit(idx)" class="text-red-400 hover:text-red-600 text-xs">Hapus</button>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="text-xs text-gray-500 mb-1 block">Metode</label>
                            <select x-model="split.method" @change="calcTotal()" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                                <option value="CASH">CASH</option>
                                <option value="Transfer">Transfer</option>
                                <option value="Debit">Debit</option>
                                <option value="BelumBayar">Belum Bayar</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-xs text-gray-500 mb-1 block">Jumlah (Rp)</label>
                            <input type="number" x-model.number="split.amount" min="0" @change="calcTotal()" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="0">
                        </div>
                    </div>

                    {{-- Bank selector for Transfer/Debit --}}
                    <div x-show="split.method === 'Transfer' || split.method === 'Debit'" class="mt-2">
                        <label class="text-xs text-gray-500 mb-1 block">Bank / Rekening</label>
                        <select x-model.number="split.bankAccountId" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                            <option value="">-- Pilih Bank --</option>
                            <option value="1470">BCA GIRO – 155 91 99999 (Indarto)</option>
                            <option value="3">MANDIRI – 136 000 4780612 (Dian Purnama)</option>
                            <option value="1456">BNI – 0822 705 836 (Indarto)</option>
                            <option value="1464">BRI – 0262 01 000031 562 (Dian Purnama)</option>
                            <option value="1465">BCA EDC (mesin di toko)</option>
                            <option value="1457">BRI EDC (mesin di toko)</option>
                        </select>
                    </div>

                    {{-- Bukti Transfer upload --}}
                    <div x-show="split.method === 'Transfer'" class="mt-2">
                        <label class="text-xs text-gray-500 mb-1 block">Bukti Transfer</label>
                        <label class="flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-200 rounded-xl px-3 py-2.5 hover:border-blue-300 transition-colors">
                            <input type="file" accept="image/*" class="hidden" @change="uploadBukti($event, idx)">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            <span class="text-sm text-gray-500" x-text="split._buktiName || 'Upload bukti transfer'"></span>
                        </label>
                        <div x-show="split._buktiPreview" class="mt-2">
                            <img :src="split._buktiPreview" class="h-20 rounded-lg object-cover">
                        </div>
                    </div>
                </div>
            </template>

            <div class="mt-3">
                <label class="text-sm font-medium text-gray-700 block mb-1">Keterangan Pembayaran</label>
                <input type="text" x-model="form.keteranganPembayaran" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Catatan tambahan pembayaran...">
            </div>

            {{-- Payment summary --}}
            <div class="mt-3 bg-gray-50 rounded-xl px-4 py-3 text-sm">
                <div class="flex justify-between mb-1">
                    <span class="text-gray-500">Dibayar</span>
                    <span class="font-semibold text-gray-800" x-text="'Rp ' + formatRupiah(paidAmount)"></span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Sisa</span>
                    <span :class="sisaPembayaran > 0 ? 'text-red-600 font-bold' : 'text-green-600 font-semibold'" x-text="sisaPembayaran > 0 ? 'Rp ' + formatRupiah(sisaPembayaran) : 'Lunas ✅'"></span>
                </div>
            </div>
        </div>

        {{-- Error & submit --}}
        <div x-show="submitError" class="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm" x-text="submitError"></div>
        <div x-show="submitSuccess" class="bg-green-50 text-green-700 rounded-xl px-4 py-4 text-center">
            <p class="text-2xl mb-2">✅</p>
            <p class="font-bold">Order Berhasil Dikirim!</p>
            <p class="text-sm mt-1">ID Order: <span class="font-mono font-bold" x-text="submittedOrderId"></span></p>
            <p class="text-xs text-green-600 mt-1">Notifikasi WA & invoice sedang diproses.</p>
            <button @click="resetForm()" class="mt-3 bg-green-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-green-700">Buat Order Baru</button>
        </div>
    </div>

    {{-- Fixed bottom submit --}}
    <div x-show="salesLoggedIn && !submitSuccess" x-cloak class="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div class="max-w-lg mx-auto">
            <button @click="submitOrder()" :disabled="submitting"
                class="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-base hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                <span x-show="submitting" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span x-text="submitting ? 'Mengirim Order...' : 'Kirim Order'"></span>
            </button>
        </div>
    </div>
</div>

@push('scripts')
<script>
function poFormApp() {
    return {
        salesLoggedIn: false,
        salesLoginUser: '',
        salesLoginPass: '',
        salesLoginErr: '',
        salesLoginLoading: false,
        contactSearch: '',
        contactResults: [],
        contactLoading: false,
        form: {
            salesPerson: '',
            namaKontak: '',
            nomorTelepon: '',
            alamat: '',
            patokanLokasi: '',
            keteranganPembayaran: '',
            biayaPengiriman: 0,
            metodePengiriman: 'Dikirim',
            items: [{ namaProduk: '', jumlahProduk: 1, hargaProduk: 0, _search: '', _results: [], _loading: false, kledoProductId: null, kledoUnitId: null }],
            paymentSplits: [{ method: 'CASH', amount: 0, bankAccountId: '', _buktiBase64: null, _buktiName: '', _buktiPreview: null }],
        },
        errors: {},
        submitting: false,
        submitError: '',
        submitSuccess: false,
        submittedOrderId: '',

        get totalHarga() {
            const prodTotal = this.form.items.reduce((s, i) => s + (i.jumlahProduk * i.hargaProduk), 0);
            return prodTotal + (this.form.biayaPengiriman || 0);
        },
        get paidAmount() {
            return this.form.paymentSplits.filter(s => s.method !== 'BelumBayar').reduce((s, p) => s + (p.amount || 0), 0);
        },
        get sisaPembayaran() {
            return Math.max(0, this.totalHarga - this.paidAmount);
        },

        init() {
            const savedSales = sessionStorage.getItem('salesUsername');
            if (savedSales) {
                this.salesLoggedIn = true;
                this.form.salesPerson = savedSales;
                this.form.paymentSplits[0].amount = this.totalHarga;
            }
            this.loadDraft();
        },

        async salesLogin() {
            if (!this.salesLoginUser) { this.salesLoginErr = 'Pilih username'; return; }
            this.salesLoginErr = '';
            this.salesLoginLoading = true;
            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ role: 'sales', username: this.salesLoginUser, password: this.salesLoginPass }),
                });
                const data = await res.json();
                if (data.ok) {
                    this.salesLoggedIn = true;
                    this.form.salesPerson = data.username;
                    sessionStorage.setItem('salesUsername', data.username);
                } else {
                    this.salesLoginErr = data.error || 'Login gagal';
                }
            } catch(e) {
                this.salesLoginErr = 'Koneksi gagal';
            } finally {
                this.salesLoginLoading = false;
            }
        },

        salesLogout() {
            sessionStorage.removeItem('salesUsername');
            this.salesLoggedIn = false;
            this.form.salesPerson = '';
        },

        addItem() {
            this.form.items.push({ namaProduk: '', jumlahProduk: 1, hargaProduk: 0, _search: '', _results: [], _loading: false, kledoProductId: null, kledoUnitId: null });
        },
        removeItem(idx) {
            this.form.items.splice(idx, 1);
            this.calcTotal();
        },
        addSplit() {
            this.form.paymentSplits.push({ method: 'CASH', amount: 0, bankAccountId: '', _buktiBase64: null, _buktiName: '', _buktiPreview: null });
        },
        removeSplit(idx) {
            this.form.paymentSplits.splice(idx, 1);
        },

        calcTotal() {
            if (this.form.paymentSplits.length === 1 && this.form.paymentSplits[0].method !== 'BelumBayar') {
                this.form.paymentSplits[0].amount = this.totalHarga;
            }
        },

        async searchContacts() {
            const q = this.contactSearch.trim();
            if (q.length < 2) { this.contactResults = []; return; }
            this.contactLoading = true;
            try {
                const res = await fetch(`/api/kledo/contacts?search=${encodeURIComponent(q)}`);
                const data = await res.json();
                this.contactResults = data.contacts || [];
            } catch(e) {
                this.contactResults = [];
            } finally {
                this.contactLoading = false;
            }
        },

        selectContact(c) {
            this.form.namaKontak = c.name;
            this.form.nomorTelepon = c.mobile_phone || '';
            this.form.alamat = c.address || '';
            this.contactResults = [];
            this.contactSearch = '';
        },

        async searchProducts(idx) {
            const item = this.form.items[idx];
            const q = item._search?.trim();
            if (!q || q.length < 2) { item._results = []; return; }
            item._loading = true;
            try {
                const res = await fetch(`/api/kledo/products?search=${encodeURIComponent(q)}`);
                const data = await res.json();
                item._results = data.products || [];
            } catch(e) {
                item._results = [];
            } finally {
                item._loading = false;
            }
        },

        selectProduct(idx, p) {
            const item = this.form.items[idx];
            item.namaProduk = p.name;
            item.kledoProductId = p.id;
            item.kledoUnitId = p.unit_id || 73;
            item._search = p.name;
            item._results = [];
            this.calcTotal();
        },

        async uploadBukti(event, idx) {
            const file = event.target.files[0];
            if (!file) return;
            const split = this.form.paymentSplits[idx];
            split._buktiName = file.name;
            split._buktiBase64 = await this.fileToBase64(file);
            split._buktiPreview = split._buktiBase64;
        },

        fileToBase64(file) {
            return new Promise((resolve, reject) => {
                const r = new FileReader();
                r.onload = e => resolve(e.target.result);
                r.onerror = reject;
                r.readAsDataURL(file);
            });
        },

        validate() {
            this.errors = {};
            if (!this.form.namaKontak) this.errors.namaKontak = 'Nama kontak wajib diisi';
            if (!this.form.nomorTelepon) this.errors.nomorTelepon = 'Nomor telepon wajib diisi';
            if (!this.form.alamat) this.errors.alamat = 'Alamat wajib diisi';
            for (const item of this.form.items) {
                if (!item.namaProduk) { this.submitError = 'Nama produk wajib diisi'; return false; }
                if (!item.jumlahProduk || item.jumlahProduk < 1) { this.submitError = 'Jumlah produk minimal 1'; return false; }
                if (!item.hargaProduk || item.hargaProduk < 0) { this.submitError = 'Harga produk tidak valid'; return false; }
            }
            return Object.keys(this.errors).length === 0;
        },

        async submitOrder() {
            this.submitError = '';
            if (!this.validate()) return;
            this.submitting = true;
            try {
                const paymentSplits = this.form.paymentSplits.map(s => ({
                    method: s.method,
                    amount: s.amount || 0,
                    bankAccountId: s.bankAccountId ? parseInt(s.bankAccountId) : null,
                }));
                const buktiTfList = this.form.paymentSplits.map(s => s._buktiBase64 || '');

                const body = {
                    namaKontak: this.form.namaKontak,
                    nomorTelepon: this.form.nomorTelepon,
                    alamat: this.form.alamat,
                    patokanLokasi: this.form.patokanLokasi,
                    salesPerson: this.form.salesPerson,
                    metodePembayaran: paymentSplits[0]?.method || 'CASH',
                    keteranganPembayaran: this.form.keteranganPembayaran,
                    biayaPengiriman: this.form.biayaPengiriman || 0,
                    metodePengiriman: this.form.metodePengiriman,
                    paymentSplits,
                    buktiTfList,
                    items: this.form.items.map(i => ({
                        namaProduk: i.namaProduk,
                        jumlahProduk: i.jumlahProduk,
                        hargaProduk: i.hargaProduk,
                        kledoProductId: i.kledoProductId || null,
                        kledoUnitId: i.kledoUnitId || 73,
                    })),
                };

                const res = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                const data = await res.json();
                if (data.success) {
                    this.submittedOrderId = data.orderId;
                    this.submitSuccess = true;
                    this.clearDraft();
                } else {
                    this.submitError = data.error || 'Gagal mengirim order';
                }
            } catch(e) {
                this.submitError = 'Koneksi gagal. Coba lagi.';
            } finally {
                this.submitting = false;
            }
        },

        resetForm() {
            this.submitSuccess = false;
            this.submittedOrderId = '';
            this.form.namaKontak = '';
            this.form.nomorTelepon = '';
            this.form.alamat = '';
            this.form.patokanLokasi = '';
            this.form.keteranganPembayaran = '';
            this.form.biayaPengiriman = 0;
            this.form.metodePengiriman = 'Dikirim';
            this.form.items = [{ namaProduk: '', jumlahProduk: 1, hargaProduk: 0, _search: '', _results: [], _loading: false }];
            this.form.paymentSplits = [{ method: 'CASH', amount: 0, bankAccountId: '', _buktiBase64: null, _buktiName: '', _buktiPreview: null }];
        },

        saveDraft() {
            const draft = { namaKontak: this.form.namaKontak, nomorTelepon: this.form.nomorTelepon, alamat: this.form.alamat };
            localStorage.setItem('po_draft', JSON.stringify(draft));
        },

        loadDraft() {
            try {
                const d = JSON.parse(localStorage.getItem('po_draft') || 'null');
                if (d) {
                    this.form.namaKontak = d.namaKontak || '';
                    this.form.nomorTelepon = d.nomorTelepon || '';
                    this.form.alamat = d.alamat || '';
                }
            } catch(e) {}
        },

        clearDraft() {
            localStorage.removeItem('po_draft');
        },

        formatRupiah(n) {
            return Number(n || 0).toLocaleString('id-ID');
        }
    }
}
</script>
@endpush
@endsection
