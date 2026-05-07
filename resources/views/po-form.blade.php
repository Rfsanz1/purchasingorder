@extends('layouts.erp')
@section('title', 'Buat Purchase Order')

@section('content')
<div x-data="poFormApp()" x-init="init()" class="min-h-screen bg-gray-50">

    {{-- Page header --}}
    <div class="max-w-lg mx-auto px-4 pt-4 pb-2">
        <h1 class="text-xl font-bold text-gray-900">Buat Purchase Order</h1>
        <p class="text-sm text-gray-400 mt-0.5">Form pemesanan produk</p>
    </div>

    {{-- Main Form --}}
    <div class="max-w-lg mx-auto px-4 py-4 space-y-4 pb-32">

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
                    <label class="text-sm font-medium text-gray-700 block mb-1">Nama Kontak <span class="text-gray-400 text-xs">(opsional)</span></label>
                    <input type="text" x-model="form.namaKontak" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Nama lengkap customer">
                </div>
                <div>
                    <label class="text-sm font-medium text-gray-700 block mb-1">Nomor Telepon <span class="text-gray-400 text-xs">(opsional, boleh kosong)</span></label>
                    <input type="tel" x-model="form.nomorTelepon" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="08xx atau +62xx">
                </div>
                <div x-data="{ showStruktur: false }">
                    <div class="flex items-center justify-between mb-1">
                        <label class="text-sm font-medium text-gray-700">Alamat <span class="text-gray-400 text-xs">(opsional, boleh kosong)</span></label>
                        <button type="button" @click="showStruktur=!showStruktur"
                            class="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                            <span x-text="showStruktur ? 'Format Bebas' : 'Format Terstruktur'"></span>
                        </button>
                    </div>

                    {{-- Format bebas --}}
                    <textarea x-show="!showStruktur" x-model="form.alamat" rows="2"
                        class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                        placeholder="Alamat lengkap pengiriman"></textarea>

                    {{-- Format terstruktur --}}
                    <div x-show="showStruktur" class="space-y-2">
                        <input type="text" x-model="form.alamatJalan" @input="buildAlamat()"
                            class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Jalan / Dusun / RT RW">
                        <div class="grid grid-cols-2 gap-2">
                            <input type="text" x-model="form.alamatDesa" @input="buildAlamat()"
                                class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Desa / Kelurahan">
                            <input type="text" x-model="form.alamatKecamatan" @input="buildAlamat()"
                                class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Kecamatan">
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <input type="text" x-model="form.alamatKabupaten" @input="buildAlamat()"
                                class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Kabupaten / Kota">
                            <input type="text" x-model="form.alamatKodepos" @input="buildAlamat()"
                                class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Kode Pos">
                        </div>
                        {{-- Temanggung auto-detect warning --}}
                        <div x-show="alamatWarningTemanggung"
                            class="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 flex items-start gap-2">
                            <svg class="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
                            <p class="text-xs text-yellow-700" x-text="alamatWarningTemanggung"></p>
                        </div>
                        {{-- Preview alamat gabungan --}}
                        <div x-show="form.alamat" class="bg-gray-50 rounded-lg px-3 py-2">
                            <p class="text-xs text-gray-400 mb-0.5">Alamat tersimpan:</p>
                            <p class="text-xs font-medium text-gray-700" x-text="form.alamat"></p>
                        </div>
                    </div>
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

            {{-- Mixed category warning --}}
            <div x-show="mixedDivisiWarning" x-cloak
                class="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
                <svg class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
                <div>
                    <p class="text-sm font-semibold text-amber-800">Produk Campuran Divisi Terdeteksi</p>
                    <p class="text-xs text-amber-600 mt-0.5">Order ini mengandung produk <strong>Elektronik</strong> dan <strong>Bahan Bangunan</strong>. Pembayaran CASH akan diproporsikan ke Kas Elektronik + Kas Sulawesi secara otomatis oleh sistem.</p>
                </div>
            </div>

            <template x-for="(item, idx) in form.items" :key="idx">
                <div class="mb-4 pb-4 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
                    <div class="flex items-center justify-between mb-2">
                        <p class="text-sm font-medium text-gray-600">Produk <span x-text="idx+1"></span></p>
                        <button x-show="form.items.length > 1" @click="removeItem(idx)" class="text-red-400 hover:text-red-600 text-xs">Hapus</button>
                    </div>

                    {{-- Product search dari Kledo --}}
                    <div class="relative mb-2" x-data="{ pFocused: false }">
                        <input type="text" x-model="item._search"
                            @input.debounce.400ms="searchProducts(idx)"
                            @focus="pFocused=true"
                            @blur="setTimeout(()=>pFocused=false,200)"
                            @keydown.escape="item._results=[]"
                            class="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Cari produk dari Kledo...">
                        <div x-show="item._results && item._results.length > 0 && pFocused"
                            class="absolute z-20 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 max-h-64 overflow-y-auto">
                            <template x-for="p in item._results" :key="p.kledoId">
                                <button @mousedown.prevent="selectProduct(idx, p)"
                                    class="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm border-b border-gray-50 last:border-0 transition-colors">
                                    <p class="font-semibold text-gray-800" x-text="p.nama"></p>
                                    <div class="flex items-center gap-2 mt-1 flex-wrap">
                                        <span x-show="p.sku" class="text-xs font-mono text-gray-400" x-text="p.sku"></span>
                                        <span x-show="p.brand" class="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-medium capitalize" x-text="p.brand"></span>
                                        <span class="text-xs text-green-600 font-medium" x-text="'Harga: Rp ' + formatRupiah(p.hargaSatuan || p.hpp || p.hargaAsli || 0)"></span>
                                    </div>
                                </button>
                            </template>
                        </div>
                        <div x-show="item._results && item._results.length===0 && item._search && item._search.length>=2 && !item._loading"
                            class="absolute z-20 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 text-xs text-gray-400">
                            Produk tidak ditemukan. Ketik nama produk secara manual di bawah.
                        </div>
                        <div x-show="item._loading" class="absolute right-3 top-2.5">
                            <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    </div>

                    {{-- Info harga setelah produk dipilih --}}
                    <div x-show="item._hargaSatuan > 0 || item._hpp > 0 || item._hargaAsli > 0" class="bg-blue-50 rounded-xl px-3 py-2.5 mb-2 space-y-1.5">
                        <div x-show="item._hargaAsli > 0" class="flex items-center justify-between text-xs">
                            <span class="text-gray-500">Harga Jual (Kledo):</span>
                            <span class="font-semibold text-gray-700" x-text="'Rp ' + formatRupiah(item._hargaAsli)"></span>
                        </div>
                        <div x-show="item._hpp > 0" class="flex items-center justify-between text-xs">
                            <span class="text-gray-500">Harga Beli / HPP:</span>
                            <span class="font-semibold text-gray-700" x-text="'Rp ' + formatRupiah(item._hpp)"></span>
                        </div>
                        <div class="flex items-center justify-between text-xs border-t border-blue-200 pt-1.5">
                            <span class="text-blue-700 font-medium">✓ Harga Dipakai:</span>
                            <span class="font-bold text-blue-800" x-text="'Rp ' + formatRupiah(item.hargaProduk)"></span>
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
                <label class="text-sm font-medium text-gray-700 block mb-2">Metode Pengiriman <span class="text-gray-400 text-xs">(opsional)</span></label>
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

                    <div class="mb-3">
                        <label class="text-xs text-gray-500 mb-2 block font-medium">Metode Pembayaran</label>
                        <div class="grid grid-cols-4 gap-1.5">
                            <button type="button" @click="split.method='CASH'; split.bankAccountId=''; calcTotal()"
                                :class="split.method==='CASH' ? 'bg-green-600 text-white border-green-600 shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:border-green-300'"
                                class="border-2 rounded-xl py-2.5 text-xs font-bold transition-all text-center flex flex-col items-center gap-0.5">
                                <span class="text-base leading-none">💵</span>
                                <span>CASH</span>
                            </button>
                            <button type="button" @click="split.method='Transfer'; split.bankAccountId=''; calcTotal()"
                                :class="split.method==='Transfer' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300'"
                                class="border-2 rounded-xl py-2.5 text-xs font-bold transition-all text-center flex flex-col items-center gap-0.5">
                                <span class="text-base leading-none">🏦</span>
                                <span>Transfer</span>
                            </button>
                            <button type="button" @click="split.method='Debit'; split.bankAccountId=''; calcTotal()"
                                :class="split.method==='Debit' ? 'bg-purple-600 text-white border-purple-600 shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:border-purple-300'"
                                class="border-2 rounded-xl py-2.5 text-xs font-bold transition-all text-center flex flex-col items-center gap-0.5">
                                <span class="text-base leading-none">💳</span>
                                <span>Debit</span>
                            </button>
                            <button type="button" @click="split.method='BelumBayar'; split.bankAccountId=''; calcTotal()"
                                :class="split.method==='BelumBayar' ? 'bg-gray-500 text-white border-gray-500 shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'"
                                class="border-2 rounded-xl py-2.5 text-xs font-bold transition-all text-center flex flex-col items-center gap-0.5">
                                <span class="text-base leading-none">⏳</span>
                                <span>Hutang</span>
                            </button>
                        </div>
                    </div>
                    <div>
                        <label class="text-xs text-gray-500 mb-1 block">Jumlah (Rp)</label>
                        <input type="number" x-model.number="split.amount" min="0" @change="calcTotal()" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="0">
                    </div>

                    {{-- Transfer: pilih bank tujuan --}}
                    <div x-show="split.method === 'Transfer'" class="mt-3">
                        <label class="text-xs text-gray-500 mb-2 block font-medium">Pilih Bank Tujuan Transfer</label>
                        <div class="grid grid-cols-2 gap-2">
                            <button type="button" @click="split.bankAccountId = 1470"
                                :class="split.bankAccountId == 1470 ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 bg-white hover:border-blue-300'"
                                class="flex items-center gap-2.5 border-2 rounded-xl px-3 py-2.5 text-left transition-all">
                                <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                                    <span class="text-white text-xs font-bold">BCA</span>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-xs font-bold text-gray-800 leading-tight">BCA GIRO</p>
                                    <p class="text-xs text-gray-500 leading-tight truncate">155 91 99999</p>
                                    <p class="text-xs text-gray-400 leading-tight truncate">Indarto Wibowo</p>
                                </div>
                            </button>
                            <button type="button" @click="split.bankAccountId = 1456"
                                :class="split.bankAccountId == 1456 ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200' : 'border-gray-200 bg-white hover:border-orange-300'"
                                class="flex items-center gap-2.5 border-2 rounded-xl px-3 py-2.5 text-left transition-all">
                                <div class="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                                    <span class="text-white text-xs font-bold">BNI</span>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-xs font-bold text-gray-800 leading-tight">BNI</p>
                                    <p class="text-xs text-gray-500 leading-tight truncate">0822 705 836</p>
                                    <p class="text-xs text-gray-400 leading-tight truncate">Indarto Wibowo</p>
                                </div>
                            </button>
                            <button type="button" @click="split.bankAccountId = 3"
                                :class="split.bankAccountId == 3 ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200' : 'border-gray-200 bg-white hover:border-yellow-300'"
                                class="flex items-center gap-2.5 border-2 rounded-xl px-3 py-2.5 text-left transition-all">
                                <div class="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center flex-shrink-0">
                                    <span class="text-white text-xs font-bold">MDR</span>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-xs font-bold text-gray-800 leading-tight">MANDIRI</p>
                                    <p class="text-xs text-gray-500 leading-tight truncate">136 000 4780612</p>
                                    <p class="text-xs text-gray-400 leading-tight truncate">Dian Purnama R.T.</p>
                                </div>
                            </button>
                            <button type="button" @click="split.bankAccountId = 1464"
                                :class="split.bankAccountId == 1464 ? 'border-blue-700 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 bg-white hover:border-blue-400'"
                                class="flex items-center gap-2.5 border-2 rounded-xl px-3 py-2.5 text-left transition-all">
                                <div class="w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center flex-shrink-0">
                                    <span class="text-white text-xs font-bold">BRI</span>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-xs font-bold text-gray-800 leading-tight">BRI</p>
                                    <p class="text-xs text-gray-500 leading-tight truncate">0262 01 000031 562</p>
                                    <p class="text-xs text-gray-400 leading-tight truncate">Dian Purnama R.T.</p>
                                </div>
                            </button>
                        </div>
                        <p x-show="split.method === 'Transfer' && !split.bankAccountId" class="text-xs text-red-400 mt-1">* Pilih bank tujuan</p>
                    </div>

                    {{-- Debit: pilih mesin EDC --}}
                    <div x-show="split.method === 'Debit'" class="mt-3">
                        <label class="text-xs text-gray-500 mb-2 block font-medium">Pilih Mesin EDC</label>
                        <div class="grid grid-cols-4 gap-2">
                            <button type="button" @click="split.bankAccountId = 1465"
                                :class="split.bankAccountId == 1465 ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 bg-white hover:border-blue-300'"
                                class="flex flex-col items-center gap-1.5 border-2 rounded-xl px-2 py-3 text-center transition-all">
                                <div class="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                                    <span class="text-white text-xs font-bold">BCA</span>
                                </div>
                                <p class="text-xs font-semibold text-gray-700 leading-tight">BCA EDC</p>
                            </button>
                            <button type="button" @click="split.bankAccountId = 1457"
                                :class="split.bankAccountId == 1457 ? 'border-blue-700 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 bg-white hover:border-blue-400'"
                                class="flex flex-col items-center gap-1.5 border-2 rounded-xl px-2 py-3 text-center transition-all">
                                <div class="w-9 h-9 rounded-xl bg-blue-800 flex items-center justify-center">
                                    <span class="text-white text-xs font-bold">BRI</span>
                                </div>
                                <p class="text-xs font-semibold text-gray-700 leading-tight">BRI EDC</p>
                            </button>
                            <button type="button" @click="split.bankAccountId = 1458"
                                :class="split.bankAccountId == 1458 ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200' : 'border-gray-200 bg-white hover:border-orange-300'"
                                class="flex flex-col items-center gap-1.5 border-2 rounded-xl px-2 py-3 text-center transition-all">
                                <div class="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center">
                                    <span class="text-white text-xs font-bold">BNI</span>
                                </div>
                                <p class="text-xs font-semibold text-gray-700 leading-tight">BNI EDC</p>
                            </button>
                            <button type="button" @click="split.bankAccountId = 1459"
                                :class="split.bankAccountId == 1459 ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200' : 'border-gray-200 bg-white hover:border-yellow-300'"
                                class="flex flex-col items-center gap-1.5 border-2 rounded-xl px-2 py-3 text-center transition-all">
                                <div class="w-9 h-9 rounded-xl bg-yellow-500 flex items-center justify-center">
                                    <span class="text-white text-xs font-bold">MDR</span>
                                </div>
                                <p class="text-xs font-semibold text-gray-700 leading-tight">Mandiri EDC</p>
                            </button>
                        </div>
                        <p x-show="split.method === 'Debit' && !split.bankAccountId" class="text-xs text-red-400 mt-1">* Pilih mesin EDC</p>
                    </div>

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


            {{-- Hint saat ada multiple split --}}
            <div x-show="form.paymentSplits.length > 1" class="mt-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 flex items-start gap-2">
                <svg class="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <p class="text-xs text-blue-700">Isi nominal masing-masing pembayaran. Total harus sama dengan total order.</p>
            </div>

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

        {{-- Sales picker --}}
        <div class="bg-white rounded-2xl shadow-sm p-5">
            <h2 class="font-bold text-gray-800 mb-3">Sales <span class="text-red-500">*</span></h2>

            <div x-show="salesLoading" class="flex justify-center py-3">
                <div class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <div x-show="!salesLoading" class="relative">
                <select
                    @change="selectSalesDirect(salesList.find(s => s.nama === $event.target.value))"
                    class="w-full border-2 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white appearance-none transition-colors"
                    :class="form.salesPerson ? 'border-blue-500 bg-blue-50 text-blue-800 font-semibold' : 'border-gray-200 text-gray-700'"
                >
                    <option value="">-- Pilih nama sales --</option>
                    <template x-for="s in salesList" :key="s.id">
                        <option :value="s.nama" :selected="form.salesPerson === s.nama" x-text="s.nama"></option>
                    </template>
                </select>
                <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
            </div>

            {{-- Auto-preview memo yang akan dikirim ke Kledo --}}
            <div x-show="form.salesPerson && salesMemo" class="mt-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
                <p class="text-xs text-blue-500 font-medium mb-0.5">Memo otomatis di Tagihan Kledo:</p>
                <p class="text-sm text-blue-800 font-semibold font-mono" x-text="salesMemo"></p>
            </div>
        </div>

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
    <div x-show="!submitSuccess" class="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 p-4 shadow-lg">
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
// Keyword Temanggung (untuk deteksi otomatis di frontend)
const TEMANGGUNG_KEYWORDS = [
    'parakan','ngadirejo','candiroto','kranggan','pringsurat','wonoboyo',
    'kledung','tembarak','selopampang','bansari','tlogomulyo','gemawang',
    'tretep','bejen','jumo','bulu temanggung','temanggung','kedu',
    'kaloran','kandangan',
];

// Kategori elektronik (berdasarkan kata kunci nama produk, sinkron dengan backend)
const ELEKTRONIK_KEYWORDS = [
    'ac','kulkas','mesin cuci','tv','televisi','speaker','kipas','dispenser',
    'water heater','pompa air','freezer','lemari es','microwave','blender',
    'rice cooker','setrika','vacuum','oven','hair dryer','charger',
];

function poFormApp() {
    return {
        // --- Sales ---
        salesList: [],
        salesLoading: false,

        // --- Contact search ---
        contactSearch: '',
        contactResults: [],
        contactLoading: false,

        // --- Address warning ---
        alamatWarningTemanggung: '',

        // --- Memo otomatis berdasarkan sales ---
        salesMemo: '',

        // --- Form ---
        form: {
            salesPerson: '',
            namaKontak: '',
            nomorTelepon: '',
            alamat: '',
            alamatJalan: '',
            alamatDesa: '',
            alamatKecamatan: '',
            alamatKabupaten: '',
            alamatKodepos: '',
            patokanLokasi: '',
            biayaPengiriman: 0,
            metodePengiriman: 'Dikirim',
            items: [{ namaProduk: '', jumlahProduk: 1, hargaProduk: 0, _search: '', _results: [], _loading: false, kledoProductId: null, kledoUnitId: null, kledoFinanceAccountId: null, _kategoriId: null, _hargaAsli: 0, _hpp: 0, _hargaSatuan: 0, _brand: '', _isSpm: false, _stok: null, _stokSrc: 'kledo' }],
            paymentSplits: [{ method: 'CASH', amount: 0, bankAccountId: '', _buktiBase64: null, _buktiName: '', _buktiPreview: null }],
        },
        errors: {},
        submitting: false,
        submitError: '',
        submitSuccess: false,
        submittedOrderId: '',

        // Computed: apakah ada produk campuran divisi (Elektronik + BB)
        get mixedDivisiWarning() {
            const itemsWithCat = this.form.items.filter(i => i._kategoriId || i.namaProduk);
            if (itemsWithCat.length < 2) return false;
            let hasElektronik = false, hasBB = false;
            for (const item of itemsWithCat) {
                const nama = (item.namaProduk || '').toLowerCase();
                const isElektronik = ELEKTRONIK_KEYWORDS.some(k => nama.includes(k));
                if (isElektronik) hasElektronik = true;
                else              hasBB         = true;
                if (hasElektronik && hasBB) return true;
            }
            return false;
        },

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

        async init() {
            await this.loadSales();
            const savedSales = sessionStorage.getItem('salesUsername');
            const savedTelp  = sessionStorage.getItem('salesTelp');
            if (savedSales) {
                this.form.salesPerson = savedSales;
                // Restore memo preview
                this.salesMemo = savedTelp ? `${savedSales} - ${savedTelp}` : savedSales;
            }
            this.loadDraft();
        },

        // ---- Sales ----
        async loadSales() {
            this.salesLoading = true;
            try {
                const res = await fetch('/api/sales');
                const data = await res.json();
                this.salesList = data.sales || [];
            } catch(e) {
                this.salesList = [];
            } finally {
                this.salesLoading = false;
            }
        },

        selectSalesDirect(s) {
            if (!s) return;
            this.form.salesPerson = s.nama;
            // Auto-generate memo format: "NamaSales - NomorHP"
            this.salesMemo = s.telp ? `${s.nama} - ${s.telp}` : s.nama;
            sessionStorage.setItem('salesUsername', s.nama);
            sessionStorage.setItem('salesTelp', s.telp || '');
        },

        clearSales() {
            this.form.salesPerson = '';
            this.salesMemo = '';
            sessionStorage.removeItem('salesUsername');
            sessionStorage.removeItem('salesTelp');
        },

        // ---- Items ----
        addItem() {
            this.form.items.push({ namaProduk: '', jumlahProduk: 1, hargaProduk: 0, _search: '', _results: [], _loading: false, kledoProductId: null, kledoUnitId: null, kledoFinanceAccountId: null, _kategoriId: null, _hargaAsli: 0, _hpp: 0, _hargaSatuan: 0, _brand: '', _isSpm: false, _stok: null, _stokSrc: 'kledo' });
        },
        removeItem(idx) {
            this.form.items.splice(idx, 1);
            this.calcTotal();
        },
        addSplit() {
            const sisa = this.sisaPembayaran;
            this.form.paymentSplits.push({ method: 'CASH', amount: sisa > 0 ? sisa : 0, bankAccountId: '', _buktiBase64: null, _buktiName: '', _buktiPreview: null });
        },
        removeSplit(idx) {
            this.form.paymentSplits.splice(idx, 1);
            if (this.form.paymentSplits.length === 1 && this.form.paymentSplits[0].method !== 'BelumBayar') {
                this.form.paymentSplits[0].amount = this.totalHarga;
            }
        },

        calcTotal() {
            if (this.form.paymentSplits.length === 1 && this.form.paymentSplits[0].method !== 'BelumBayar') {
                this.form.paymentSplits[0].amount = this.totalHarga;
            }
        },

        // ---- Contact search (Kledo) ----
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
            this.form.namaKontak   = c.name;
            this.form.nomorTelepon = c.mobile_phone || '';
            this.form.alamat       = c.address || '';
            this.contactResults    = [];
            this.contactSearch     = '';
            // Cek warning Temanggung dari alamat kontak
            if (c.address) this.checkTemanggungWarning(c.address, null);
        },

        // ---- Alamat terstruktur ----
        buildAlamat() {
            const parts = [
                this.form.alamatJalan,
                this.form.alamatDesa,
                this.form.alamatKecamatan,
                this.form.alamatKabupaten,
                'Jawa Tengah',
                this.form.alamatKodepos,
            ].filter(Boolean);
            this.form.alamat = parts.join(', ');

            // Cek auto-detect Temanggung
            this.checkTemanggungWarning(
                this.form.alamatKecamatan + ' ' + this.form.alamatKabupaten,
                this.form.alamatKabupaten
            );
        },

        checkTemanggungWarning(kecamatan, kabupaten) {
            const lowerKec = (kecamatan || '').toLowerCase();
            const lowerKab = (kabupaten || '').toLowerCase();

            const isTemanggungKec = TEMANGGUNG_KEYWORDS.some(k => lowerKec.includes(k));
            const hasWrongKab     = kabupaten && !lowerKab.includes('temanggung');

            if (isTemanggungKec && hasWrongKab && kabupaten) {
                this.alamatWarningTemanggung = `⚠️ Kecamatan "${kecamatan.trim()}" berada di Kabupaten Temanggung, bukan "${kabupaten.trim()}". Dikoreksi otomatis.`;
                this.form.alamatKabupaten = 'Temanggung';
                this.buildAlamat();
            } else if (isTemanggungKec && !lowerKab.includes('temanggung') && !kabupaten) {
                this.alamatWarningTemanggung = `ℹ️ Terdeteksi area Temanggung — kabupaten diatur ke "Temanggung".`;
                this.form.alamatKabupaten = 'Temanggung';
                this.buildAlamat();
            } else {
                this.alamatWarningTemanggung = '';
            }
        },

        // ---- Product search (Kledo + stok SPM/Kledo) ----
        async searchProducts(idx) {
            const item = this.form.items[idx];
            const q = item._search?.trim();
            if (!q || q.length < 2) { item._results = []; return; }
            item._loading = true;
            try {
                const res = await fetch(`/api/kledo/products/with-stock?search=${encodeURIComponent(q)}`);
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
            const hargaAsli  = p.hargaAsli ?? 0;
            const hpp        = p.hpp ?? 0;
            // Pakai yang tertinggi antara harga beli (Kledo) dan HPP
            const hargaSatuan = p.hargaSatuan ?? Math.max(hargaAsli, hpp);

            item.namaProduk             = p.nama;
            item.hargaProduk            = hargaSatuan;
            item._search                = p.nama;
            item._results               = [];
            item.kledoProductId         = p.kledoId ?? null;
            item.kledoUnitId            = p.satuan ?? 73;
            item.kledoFinanceAccountId  = p.financeAccountId ?? null;
            item._kategoriId            = p.kategoriId ?? null;
            item._hargaAsli             = hargaAsli;
            item._hpp                   = hpp;
            item._hargaSatuan           = hargaSatuan;
            item._brand                 = p.brand ?? '';
            item._isSpm                 = p.isSpm ?? false;
            item._stok                  = p.stok ?? null;
            item._stokSrc               = p.stokSrc ?? 'kledo';
            this.calcTotal();
        },

        // ---- Bukti transfer ----
        async uploadBukti(event, idx) {
            const file = event.target.files[0];
            if (!file) return;
            const split = this.form.paymentSplits[idx];
            split._buktiName    = file.name;
            split._buktiBase64  = await this.fileToBase64(file);
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

        // ---- Validation ----
        validate() {
            this.errors = {};
            if (!this.form.salesPerson) {
                this.submitError = 'Sales wajib dipilih sebelum mengirim order';
                return false;
            }
            for (const item of this.form.items) {
                if (!item.namaProduk) { this.submitError = 'Nama produk wajib diisi'; return false; }
                if (!item.jumlahProduk || item.jumlahProduk < 1) { this.submitError = 'Jumlah produk minimal 1'; return false; }
                if (item.hargaProduk === undefined || item.hargaProduk < 0) { this.submitError = 'Harga produk tidak valid'; return false; }
            }
            const nonHutang = this.form.paymentSplits.filter(s => s.method !== 'BelumBayar');
            for (let i = 0; i < nonHutang.length; i++) {
                const s = nonHutang[i];
                if (s.method === 'Transfer' && !s.bankAccountId) {
                    this.submitError = `Pembayaran ${i+1}: Pilih bank tujuan transfer terlebih dahulu`;
                    return false;
                }
                if (s.method === 'Debit' && !s.bankAccountId) {
                    this.submitError = `Pembayaran ${i+1}: Pilih mesin EDC terlebih dahulu`;
                    return false;
                }
            }
            if (this.form.paymentSplits.length > 1) {
                const totalDiisi = this.form.paymentSplits.filter(s => s.method !== 'BelumBayar' && (s.amount || 0) > 0);
                if (totalDiisi.length === 0) {
                    this.submitError = 'Isi jumlah nominal untuk setiap metode pembayaran';
                    return false;
                }
            }
            return true;
        },

        // ---- Submit ----
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
                        kledoFinanceAccountId: i.kledoFinanceAccountId || null,
                        kategoriId: i._kategoriId || null,
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
                    this.riwayatLoading = false;
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
            this.submitSuccess           = false;
            this.submittedOrderId        = '';
            this.submitError             = '';
            this.alamatWarningTemanggung = '';
            this.contactSearch           = '';
            this.contactResults          = [];
            this.form.namaKontak         = '';
            this.form.nomorTelepon       = '';
            this.form.alamat             = '';
            this.form.alamatJalan        = '';
            this.form.alamatDesa         = '';
            this.form.alamatKecamatan    = '';
            this.form.alamatKabupaten    = '';
            this.form.alamatKodepos      = '';
            this.form.patokanLokasi      = '';
            this.form.biayaPengiriman    = 0;
            this.form.metodePengiriman   = 'Dikirim';
            this.form.items = [{ namaProduk: '', jumlahProduk: 1, hargaProduk: 0, _search: '', _results: [], _loading: false, kledoProductId: null, kledoUnitId: null, kledoFinanceAccountId: null, _kategoriId: null, _hargaAsli: 0, _hpp: 0, _hargaSatuan: 0, _brand: '', _isSpm: false, _stok: null, _stokSrc: 'kledo' }];
            this.form.paymentSplits = [{ method: 'CASH', amount: 0, bankAccountId: '', _buktiBase64: null, _buktiName: '', _buktiPreview: null }];
        },

        saveDraft() {
            const draft = {
                namaKontak:      this.form.namaKontak,
                nomorTelepon:    this.form.nomorTelepon,
                alamat:          this.form.alamat,
                alamatJalan:     this.form.alamatJalan,
                alamatDesa:      this.form.alamatDesa,
                alamatKecamatan: this.form.alamatKecamatan,
                alamatKabupaten: this.form.alamatKabupaten,
                alamatKodepos:   this.form.alamatKodepos,
            };
            localStorage.setItem('po_draft', JSON.stringify(draft));
        },

        loadDraft() {
            try {
                const d = JSON.parse(localStorage.getItem('po_draft') || 'null');
                if (d) {
                    this.form.namaKontak      = d.namaKontak      || '';
                    this.form.nomorTelepon    = d.nomorTelepon    || '';
                    this.form.alamat          = d.alamat          || '';
                    this.form.alamatJalan     = d.alamatJalan     || '';
                    this.form.alamatDesa      = d.alamatDesa      || '';
                    this.form.alamatKecamatan = d.alamatKecamatan || '';
                    this.form.alamatKabupaten = d.alamatKabupaten || '';
                    this.form.alamatKodepos   = d.alamatKodepos   || '';
                }
            } catch(e) {}
        },

        clearDraft() { localStorage.removeItem('po_draft'); },

        formatRupiah(n) { return Number(n || 0).toLocaleString('id-ID'); },
    }
}
</script>
@endpush
@endsection
