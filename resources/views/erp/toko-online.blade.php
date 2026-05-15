@extends('layouts.erp')

@section('title', 'Toko Online (Bagisto)')

@section('content')
<div class="max-w-3xl mx-auto py-8 px-4" x-data="{
    url: '{{ $tokoUrl }}',
    saved: false,
    saving: false,
    error: '',
    async save() {
        this.saving = true; this.error = '';
        try {
            const res = await fetch('/api/settings/toko-online', {
                method: 'POST',
                headers: {'Content-Type':'application/json','X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]').content},
                body: JSON.stringify({ toko_online_url: this.url })
            });
            const data = await res.json();
            if (data.ok) { this.saved = true; setTimeout(() => this.saved = false, 3000); }
            else { this.error = data.error || 'Gagal menyimpan'; }
        } catch(e) { this.error = 'Gagal terhubung ke server'; }
        this.saving = false;
    },
    openToko() {
        if (!this.url) { alert('Isi URL Bagisto dulu'); return; }
        window.open(this.url, '_blank');
    }
}">

    {{-- Header --}}
    <div class="flex items-center gap-4 mb-8">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center" style="background:linear-gradient(135deg,#7c3aed,#a855f7)">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
        </div>
        <div>
            <h1 class="text-2xl font-bold text-gray-900">Toko Online (Bagisto)</h1>
            <p class="text-gray-500 text-sm">Hubungkan dashboard admin Bagisto ke ERP Gentong Mas</p>
        </div>
    </div>

    {{-- Status Card --}}
    <div class="rounded-2xl border-2 p-5 mb-6 flex items-center gap-4"
        :class="url ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'">
        <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            :class="url ? 'bg-green-100' : 'bg-amber-100'">
            <span x-text="url ? '✅' : '⚠️'" class="text-lg"></span>
        </div>
        <div>
            <p class="font-semibold text-sm" :class="url ? 'text-green-800' : 'text-amber-800'"
                x-text="url ? 'Toko Online Terhubung' : 'Belum Terhubung'"></p>
            <p class="text-xs mt-0.5" :class="url ? 'text-green-600' : 'text-amber-600'"
                x-text="url ? url : 'Isi URL Bagisto kamu di bawah untuk menghubungkan'"></p>
        </div>
        <button x-show="url" @click="openToko()"
            class="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style="background:linear-gradient(135deg,#7c3aed,#a855f7)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            Buka Toko
        </button>
    </div>

    {{-- URL Setting --}}
    <div class="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
            URL Admin Bagisto
        </h2>
        <label class="block text-sm text-gray-600 mb-2">Masukkan URL dashboard admin Bagisto kamu</label>
        <div class="flex gap-3">
            <input type="url" x-model="url"
                placeholder="https://toko-kamu.com/admin"
                class="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
            <button @click="save()" :disabled="saving"
                class="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition"
                style="background:linear-gradient(135deg,#7c3aed,#a855f7)"
                :class="saving ? 'opacity-60 cursor-not-allowed' : ''">
                <span x-show="!saving">Simpan</span>
                <span x-show="saving">Menyimpan...</span>
            </button>
        </div>
        <p x-show="saved" class="mt-2 text-sm text-green-600 font-medium">✅ URL berhasil disimpan!</p>
        <p x-show="error" x-text="error" class="mt-2 text-sm text-red-600"></p>
        <p class="mt-3 text-xs text-gray-400">Contoh: <code class="bg-gray-100 px-1 rounded">https://tokomu.com/admin</code> atau <code class="bg-gray-100 px-1 rounded">http://localhost:8080/admin</code> (kalau lokal)</p>
    </div>

    {{-- Deploy Guide --}}
    <div class="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Cara Deploy Bagisto (Agar Bisa Diakses Online)
        </h2>
        <div class="space-y-4">
            <div class="flex gap-3">
                <div class="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                <div>
                    <p class="text-sm font-medium text-gray-800">Deploy ke Railway (Gratis / Murah)</p>
                    <p class="text-xs text-gray-500 mt-0.5">Pergi ke <a href="https://railway.app" target="_blank" class="text-blue-600 underline">railway.app</a> → New Project → Deploy from GitHub → pilih repo Bagisto kamu</p>
                </div>
            </div>
            <div class="flex gap-3">
                <div class="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                <div>
                    <p class="text-sm font-medium text-gray-800">Atau Upload ke Hosting Shared (cPanel)</p>
                    <p class="text-xs text-gray-500 mt-0.5">Upload folder Bagisto ke public_html, buat database MySQL, isi <code class="bg-gray-100 px-1 rounded">.env</code>, jalankan <code class="bg-gray-100 px-1 rounded">php artisan migrate</code></p>
                </div>
            </div>
            <div class="flex gap-3">
                <div class="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                <div>
                    <p class="text-sm font-medium text-gray-800">Setelah online, salin URL admin Bagisto</p>
                    <p class="text-xs text-gray-500 mt-0.5">Biasanya <code class="bg-gray-100 px-1 rounded">https://domain-kamu.com/admin</code> → tempel di kolom URL di atas → klik Simpan</p>
                </div>
            </div>
        </div>
    </div>

    {{-- Fitur Bagisto --}}
    <div class="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Fitur Bagisto
        </h2>
        <div class="grid grid-cols-2 gap-3">
            @foreach([
                ['🛒', 'Manajemen Produk', 'Katalog, variasi, harga, stok'],
                ['📦', 'Order Management', 'Terima & proses pesanan online'],
                ['🚚', 'Pengiriman', 'JNE, J&T, SiCepat terintegrasi'],
                ['💳', 'Pembayaran', 'Transfer, QRIS, COD'],
                ['👥', 'Customer', 'Akun, wishlist, review produk'],
                ['📊', 'Laporan', 'Penjualan, stok, revenue'],
            ] as [$icon, $title, $desc])
            <div class="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                <span class="text-lg">{{ $icon }}</span>
                <div>
                    <p class="text-sm font-medium text-gray-800">{{ $title }}</p>
                    <p class="text-xs text-gray-500">{{ $desc }}</p>
                </div>
            </div>
            @endforeach
        </div>
    </div>

</div>
@endsection
