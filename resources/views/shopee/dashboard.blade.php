@extends('layouts.shopee')
@section('title', 'Manajemen Stok Shopee')

@section('breadcrumb')
    <svg class="w-3.5 h-3.5 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
    <span class="text-gray-600 truncate">
        @if(request('page') === 'produk') Daftar Produk
        @elseif(request('page') === 'update') Update Stok
        @elseif(request('page') === 'sinkron') Sinkronisasi
        @elseif(request('page') === 'riwayat') Riwayat Perubahan
        @elseif(request('page') === 'pengaturan') Pengaturan Toko
        @else Ringkasan Stok
        @endif
    </span>
@endsection

@section('content')
<div class="p-4 md:p-6">

    @php $page = request('page', ''); @endphp

    {{-- ===== RINGKASAN STOK (default) ===== --}}
    @if(!$page)
    <div class="mb-6">
        <h1 class="text-xl font-bold text-gray-900">Ringkasan Stok Shopee</h1>
        <p class="text-sm text-gray-400 mt-0.5">Overview stok produk toko Shopee Anda</p>
    </div>

    {{-- Stat Cards --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                    <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                </div>
                <div>
                    <p class="text-2xl font-bold text-gray-900">—</p>
                    <p class="text-xs text-gray-400">Total Produk</p>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                    <p class="text-2xl font-bold text-gray-900">—</p>
                    <p class="text-xs text-gray-400">Stok Aman</p>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center shrink-0">
                    <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
                <div>
                    <p class="text-2xl font-bold text-gray-900">—</p>
                    <p class="text-xs text-gray-400">Stok Menipis</p>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                    <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </div>
                <div>
                    <p class="text-2xl font-bold text-gray-900">—</p>
                    <p class="text-xs text-gray-400">Habis</p>
                </div>
            </div>
        </div>
    </div>

    {{-- Quick Actions --}}
    <h2 class="text-sm font-semibold text-gray-700 mb-3">Menu Cepat</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <a href="/shopee/dashboard?page=produk" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-orange-200 hover:shadow-md transition-all group">
            <div class="w-10 h-10 bg-orange-50 group-hover:bg-orange-100 rounded-xl flex items-center justify-center mb-3 transition-colors">
                <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
            </div>
            <h3 class="font-semibold text-gray-800 text-sm">Daftar Produk</h3>
            <p class="text-xs text-gray-400 mt-1">Lihat dan kelola semua produk Shopee</p>
        </a>
        <a href="/shopee/dashboard?page=update" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-orange-200 hover:shadow-md transition-all group">
            <div class="w-10 h-10 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center mb-3 transition-colors">
                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </div>
            <h3 class="font-semibold text-gray-800 text-sm">Update Stok</h3>
            <p class="text-xs text-gray-400 mt-1">Perbarui jumlah stok produk</p>
        </a>
        <a href="/shopee/dashboard?page=sinkron" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-orange-200 hover:shadow-md transition-all group">
            <div class="w-10 h-10 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center mb-3 transition-colors">
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </div>
            <h3 class="font-semibold text-gray-800 text-sm">Sinkronisasi</h3>
            <p class="text-xs text-gray-400 mt-1">Sinkron stok antara Shopee dan gudang</p>
        </a>
        <a href="/shopee/dashboard?page=riwayat" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-orange-200 hover:shadow-md transition-all group">
            <div class="w-10 h-10 bg-purple-50 group-hover:bg-purple-100 rounded-xl flex items-center justify-center mb-3 transition-colors">
                <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <h3 class="font-semibold text-gray-800 text-sm">Riwayat Perubahan</h3>
            <p class="text-xs text-gray-400 mt-1">Log semua perubahan stok</p>
        </a>
        <a href="/shopee/dashboard?page=pengaturan" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-orange-200 hover:shadow-md transition-all group">
            <div class="w-10 h-10 bg-gray-100 group-hover:bg-gray-200 rounded-xl flex items-center justify-center mb-3 transition-colors">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <h3 class="font-semibold text-gray-800 text-sm">Pengaturan Toko</h3>
            <p class="text-xs text-gray-400 mt-1">Konfigurasi koneksi toko Shopee</p>
        </a>
    </div>

    {{-- ===== DAFTAR PRODUK ===== --}}
    @elseif($page === 'produk')
    <div class="flex items-center gap-3 mb-6">
        <a href="/shopee/dashboard" class="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </a>
        <div>
            <h1 class="text-xl font-bold text-gray-900">Daftar Produk</h1>
            <p class="text-sm text-gray-400 mt-0.5">Kelola produk dan stok toko Shopee</p>
        </div>
    </div>
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div class="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
        </div>
        <h3 class="font-semibold text-gray-800 mb-1">Daftar Produk Shopee</h3>
        <p class="text-sm text-gray-400">Fitur ini akan menampilkan semua produk dari toko Shopee Anda beserta stok terkini.</p>
        <p class="text-xs text-orange-400 mt-3">Hubungkan toko Shopee di menu Pengaturan untuk mulai.</p>
    </div>

    {{-- ===== UPDATE STOK ===== --}}
    @elseif($page === 'update')
    <div class="flex items-center gap-3 mb-6">
        <a href="/shopee/dashboard" class="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </a>
        <div>
            <h1 class="text-xl font-bold text-gray-900">Update Stok</h1>
            <p class="text-sm text-gray-400 mt-0.5">Perbarui jumlah stok produk Shopee</p>
        </div>
    </div>
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div class="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
        </div>
        <h3 class="font-semibold text-gray-800 mb-1">Update Stok Produk</h3>
        <p class="text-sm text-gray-400">Fitur ini memungkinkan Anda memperbarui jumlah stok produk secara langsung ke Shopee.</p>
        <p class="text-xs text-orange-400 mt-3">Hubungkan toko Shopee di menu Pengaturan untuk mulai.</p>
    </div>

    {{-- ===== SINKRONISASI ===== --}}
    @elseif($page === 'sinkron')
    <div class="flex items-center gap-3 mb-6">
        <a href="/shopee/dashboard" class="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </a>
        <div>
            <h1 class="text-xl font-bold text-gray-900">Sinkronisasi Stok</h1>
            <p class="text-sm text-gray-400 mt-0.5">Sinkron stok antara Shopee dan sistem gudang</p>
        </div>
    </div>
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
        </div>
        <h3 class="font-semibold text-gray-800 mb-1">Sinkronisasi Stok</h3>
        <p class="text-sm text-gray-400">Fitur ini akan menyinkronkan stok antara sistem gudang internal dengan toko Shopee secara otomatis.</p>
        <p class="text-xs text-orange-400 mt-3">Hubungkan toko Shopee di menu Pengaturan untuk mulai.</p>
    </div>

    {{-- ===== RIWAYAT PERUBAHAN ===== --}}
    @elseif($page === 'riwayat')
    <div class="flex items-center gap-3 mb-6">
        <a href="/shopee/dashboard" class="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </a>
        <div>
            <h1 class="text-xl font-bold text-gray-900">Riwayat Perubahan</h1>
            <p class="text-sm text-gray-400 mt-0.5">Log semua perubahan stok produk Shopee</p>
        </div>
    </div>
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div class="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <h3 class="font-semibold text-gray-800 mb-1">Riwayat Perubahan Stok</h3>
        <p class="text-sm text-gray-400">Semua log perubahan stok akan ditampilkan di sini, termasuk siapa yang mengubah dan kapan.</p>
        <p class="text-xs text-orange-400 mt-3">Belum ada riwayat perubahan stok.</p>
    </div>

    {{-- ===== PENGATURAN TOKO ===== --}}
    @elseif($page === 'pengaturan')
    <div class="flex items-center gap-3 mb-6">
        <a href="/shopee/dashboard" class="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </a>
        <div>
            <h1 class="text-xl font-bold text-gray-900">Pengaturan Toko</h1>
            <p class="text-sm text-gray-400 mt-0.5">Konfigurasi koneksi toko Shopee</p>
        </div>
    </div>
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 class="font-semibold text-gray-800 text-sm mb-4">Status Koneksi Shopee</h3>
        <div class="space-y-3">
            @foreach(['SHOPEE_PARTNER_ID' => 'Partner ID', 'SHOPEE_PARTNER_KEY' => 'Partner Key', 'SHOPEE_ACCESS_TOKEN' => 'Access Token', 'SHOPEE_SHOP_ID' => 'Shop ID'] as $envKey => $label)
            <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div class="flex items-center gap-3">
                    <span class="w-2.5 h-2.5 rounded-full {{ env($envKey) ? 'bg-green-500' : 'bg-red-400' }} shrink-0"></span>
                    <span class="text-sm text-gray-700">{{ $label }}</span>
                </div>
                <span class="text-xs {{ env($envKey) ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50' }} px-2 py-0.5 rounded-full font-medium">
                    {{ env($envKey) ? 'Terkonfigurasi' : 'Belum diset' }}
                </span>
            </div>
            @endforeach
        </div>
        <p class="text-xs text-gray-400 mt-4">Set variabel di atas melalui Secrets / environment untuk menghubungkan toko Shopee.</p>
    </div>
    @endif

</div>
@endsection
