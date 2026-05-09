@extends('layouts.marketplace')

@section('title', 'Dashboard Marketplace')
@section('breadcrumb', 'Dashboard')

@section('content')
<div class="p-4 lg:p-6 max-w-7xl mx-auto">

    {{-- Welcome Banner --}}
    <div class="rounded-2xl p-5 lg:p-6 mb-6 relative overflow-hidden"
        style="background:linear-gradient(135deg,#ea580c 0%,#f97316 50%,#fb923c 100%)">
        <div class="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        <div class="absolute bottom-0 right-10 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
        <div class="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
            <div class="flex-1">
                <p class="text-orange-100 text-sm font-medium mb-1">
                    Selamat datang, {{ session('marketplace_name', 'Admin') }} 👋
                </p>
                <h1 class="text-2xl font-black text-white leading-tight">Dashboard Marketplace</h1>
                <p class="text-orange-100 text-sm mt-1">Kelola semua marketplace dari satu tempat</p>
            </div>
            <div class="shrink-0">
                <span class="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
                    <span class="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span>
                    Live Dashboard
                </span>
            </div>
        </div>
    </div>

    {{-- Stats Row --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        @foreach([
            ['Total Pesanan','—','bg-blue-50 text-blue-600','M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'],
            ['Total Produk','—','bg-green-50 text-green-600','M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'],
            ['Pending Sinkron','—','bg-yellow-50 text-yellow-600','M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'],
            ['Channel Aktif','—','bg-purple-50 text-purple-600','M13 10V3L4 14h7v7l9-11h-7z'],
        ] as [$label,$val,$colors,$path])
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:p-5">
            <div class="flex items-start justify-between mb-3">
                <div class="w-9 h-9 rounded-xl {{ $colors }} flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{{ $path }}"/>
                    </svg>
                </div>
                <span class="text-xs bg-gray-50 text-gray-400 px-2 py-0.5 rounded-full border border-gray-100">Soon</span>
            </div>
            <p class="text-2xl font-black text-gray-800 leading-none mb-1">{{ $val }}</p>
            <p class="text-xs text-gray-500 font-medium">{{ $label }}</p>
        </div>
        @endforeach
    </div>

    {{-- Platform Cards --}}
    <h2 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Platform Terhubung</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        @foreach([
            ['Shopee','🛍️','#ee4d2d','bg-orange-50','text-orange-600','border-orange-100','shopee'],
            ['TikTok Shop','🎵','#000000','bg-slate-50','text-slate-700','border-slate-100','tiktok-shop'],
            ['Tokopedia','🟢','#42b549','bg-green-50','text-green-600','border-green-100','tokopedia'],
            ['Lazada','🔵','#0f146d','bg-blue-50','text-blue-600','border-blue-100','lazada'],
        ] as [$name,$icon,$color,$bg,$text,$border,$slug])
        <div class="bg-white rounded-2xl border {{ $border }} shadow-sm p-4 hover:shadow-md transition-shadow">
            <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-xl {{ $bg }} {{ $text }} flex items-center justify-center text-xl border {{ $border }}">
                    {{ $icon }}
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-bold text-gray-900 text-sm">{{ $name }}</p>
                    <div class="flex items-center gap-1.5 mt-0.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        <span class="text-xs text-gray-400">Belum terhubung</span>
                    </div>
                </div>
            </div>
            <div class="space-y-1.5">
                <div class="flex justify-between text-xs">
                    <span class="text-gray-400">Pesanan</span>
                    <span class="font-semibold text-gray-600">—</span>
                </div>
                <div class="flex justify-between text-xs">
                    <span class="text-gray-400">Produk</span>
                    <span class="font-semibold text-gray-600">—</span>
                </div>
            </div>
            <a href="/marketplace/{{ $slug }}/dashboard"
                class="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold transition-colors {{ $bg }} {{ $text }} hover:opacity-80 border {{ $border }}">
                <span>Kelola {{ $name }}</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
            </a>
        </div>
        @endforeach
    </div>

    {{-- Quick Actions --}}
    <h2 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Akses Cepat Integrasi</h2>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        @foreach([
            ['Koneksi Marketplace','🔌','/marketplace/integrasi/connections'],
            ['Sinkronisasi','🔄','/marketplace/integrasi/sync'],
            ['Status API','📡','/marketplace/integrasi/status'],
            ['Pengaturan','⚙️','/marketplace/integrasi/config'],
        ] as [$label,$icon,$url])
        <a href="{{ $url }}"
            class="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center gap-2 hover:shadow-md hover:border-orange-100 transition-all group text-center">
            <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                {{ $icon }}
            </div>
            <span class="text-xs font-semibold text-gray-600 group-hover:text-orange-600 transition-colors leading-tight">{{ $label }}</span>
        </a>
        @endforeach
    </div>

    {{-- Coming Soon Notice --}}
    <div class="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-5 flex items-start gap-4">
        <div class="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl shrink-0">🚀</div>
        <div>
            <h3 class="font-bold text-orange-800 mb-1">Modul Marketplace Sedang Dikembangkan</h3>
            <p class="text-sm text-orange-600 leading-relaxed">
                Integrasi API marketplace (Shopee, TikTok Shop, Tokopedia, Lazada) sedang dalam proses pengembangan.
                Semua halaman tersedia dan dapat dinavigasi — koneksi API akan diaktifkan segera.
            </p>
        </div>
    </div>

</div>
@endsection
