<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'ERP Gentong Mas')</title>

    {{-- PWA Meta Tags --}}
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#1d4ed8">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Gentong Mas">
    <meta name="application-name" content="ERP Gentong Mas">
    <meta name="msapplication-TileColor" content="#1d4ed8">
    <meta name="msapplication-TileImage" content="/icons/icon-144.png">
    <link rel="apple-touch-icon" href="/icons/icon-192.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144.png">
    <link rel="apple-touch-icon" sizes="128x128" href="/icons/icon-128.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png">
    <link rel="icon" type="image/png" sizes="96x96" href="/icons/icon-96.png">
    <link rel="shortcut icon" href="/icons/icon-96.png">

    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/collapse@3.x.x/dist/cdn.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        [x-cloak] { display: none !important; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        /* ─── SIDEBAR ITEM ─────────────────────────────────────────────────── */
        .sidebar-item {
            display: flex; align-items: center; gap: 9px;
            padding: 7px 10px; border-radius: 8px;
            font-size: 0.8125rem; font-weight: 500;
            transition: all 0.15s; cursor: pointer; user-select: none; text-decoration: none;
        }
        .sidebar-item.active {
            background: #2563eb; color: #fff;
            box-shadow: 0 1px 4px rgba(37,99,235,.3);
        }
        .sidebar-item.normal { color: #94a3b8; }
        .sidebar-item.normal:hover { background: #1e293b; color: #e2e8f0; }

        /* ─── GROUP HEADER ─────────────────────────────────────────────────── */
        .group-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 6px 10px; border-radius: 8px; cursor: pointer;
            font-size: 0.75rem; font-weight: 600;
            color: #64748b;
            transition: background 0.15s, color 0.15s; user-select: none;
        }
        .group-header:hover { background: #1e293b; color: #94a3b8; }
        .group-header.has-active { color: #60a5fa; }

        /* ─── SECTION LABEL ────────────────────────────────────────────────── */
        .section-label {
            font-size: 0.6rem; font-weight: 700; text-transform: uppercase;
            letter-spacing: 0.1em; color: #334155;
            padding: 12px 10px 3px 10px; display: block;
        }

        /* ─── CHEVRON ──────────────────────────────────────────────────────── */
        .chevron { transition: transform 0.2s ease; }
        .chevron.open { transform: rotate(90deg); }

        /* ─── COLLAPSIBLE GROUPS ───────────────────────────────────────────── */
        .group-items {
            overflow: hidden;
            transition: max-height 0.25s ease, opacity 0.2s ease;
        }
        .group-items.open { max-height: 1000px; opacity: 1; }
        .group-items.closed { max-height: 0; opacity: 0; }

        /* ─── LAYOUT ───────────────────────────────────────────────────────── */
        html { overflow-x: hidden; }
        body { overflow-x: hidden; }

        aside {
            position: fixed;
            top: 0; left: 0; bottom: 0; right: auto;
            width: 15rem;
            z-index: 40;
            background: #0f172a;
            border-right: 1px solid #1e293b;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            overflow-x: hidden;
            transform: translateX(-100%);
            transition: transform 0.2s ease;
        }

        @media (min-width: 1024px) {
            aside {
                position: relative;
                top: auto; left: auto; bottom: auto; right: auto;
                transform: translateX(0);
                z-index: auto;
                overflow-y: auto;
            }
        }

        .erp-wrapper {
            display: flex;
            min-height: 100vh;
            min-height: 100dvh;
        }

        .erp-main {
            flex: 1 1 0%;
            display: flex;
            flex-direction: column;
            min-width: 0;
            width: 100%;
            max-width: 100%;
        }

        main { overflow-x: hidden; }
    </style>
    @stack('head')
</head>
@php
    $sidebarConfigVersion = config('sidebar.version') ?? 'unknown';
    $sidebarSource = config('sidebar.source') ?? 'config/sidebar.php';
@endphp

<body class="bg-gray-50 min-h-screen" data-sidebar-source="{{ $sidebarSource }}" x-data="erpLayout()" x-init="initLayout()">

    {{-- PWA Install Banner --}}
    <div id="pwa-install-banner" class="hidden fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
        <div class="bg-slate-900 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 border border-slate-700">
            <div class="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold leading-tight">Install Gentong Mas ERP</p>
                <p class="text-xs text-slate-400 mt-0.5">Akses lebih cepat seperti aplikasi</p>
            </div>
            <div class="flex flex-col gap-1.5">
                <button id="pwa-install-btn" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                    Install
                </button>
                <button id="pwa-install-dismiss" class="text-slate-500 hover:text-slate-300 text-xs px-3 py-1 rounded-lg transition-colors">
                    Nanti
                </button>
            </div>
        </div>
    </div>

    {{-- Mobile overlay --}}
    <div x-show="sidebarOpen" x-cloak class="fixed inset-0 z-30 bg-black/60 lg:hidden" @click="sidebarOpen=false"></div>

    <div class="flex erp-wrapper">

        {{-- ===== SIDEBAR ===== --}}
        <aside
            :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
            class="fixed inset-y-0 left-0 z-40 w-60 flex flex-col transition-transform duration-200 lg:relative lg:translate-x-0 lg:z-auto">

            {{-- Logo --}}
            <div class="px-4 py-4 border-b border-slate-800 shrink-0">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
                    </div>
                    <div>
                        <p class="font-bold text-white text-sm leading-tight">Gentong Mas</p>
                        <p class="text-xs text-slate-500">ERP System</p>
                    </div>
                </div>
            </div>

            {{-- Kledo Status Bar --}}
            <div class="px-3 py-2 border-b border-slate-800 shrink-0 bg-slate-900/50">
                <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-1.5 min-w-0">
                        {{-- Dot indikator --}}
                        <span class="w-2 h-2 rounded-full shrink-0 transition-colors"
                            :class="kledoStatus==='connected'?'bg-green-400 animate-pulse':kledoStatus==='no_token'?'bg-red-400':'bg-yellow-400'">
                        </span>
                        <span class="text-xs truncate transition-colors"
                            :class="kledoStatus==='connected'?'text-green-400':kledoStatus==='no_token'?'text-red-400':'text-yellow-400'"
                            x-text="kledoStatus==='connected'?'Kledo Terhubung':kledoStatus==='no_token'?'Kledo: Belum Setup':'Kledo: Memeriksa...'">
                        </span>
                    </div>
                    {{-- Tombol sync global --}}
                    <button @click="globalSyncKledo()" :disabled="kledoSyncing"
                        class="shrink-0 text-slate-400 hover:text-white transition p-1 rounded hover:bg-slate-700 disabled:opacity-40"
                        title="Sync Kledo Sekarang">
                        <svg :class="kledoSyncing?'animate-spin':''" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                    </button>
                </div>
                {{-- Last sync info --}}
                <p class="text-xs text-slate-600 mt-0.5 truncate" x-show="kledoLastSync" x-text="'Sync: '+kledoLastSyncLabel"></p>
                {{-- Cache count --}}
                <p class="text-xs text-slate-600 truncate" x-show="kledoCacheCount>0" x-text="kledoCacheCount+' data di cache'"></p>
            </div>

            {{-- Nav --}}
            <nav class="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 scrollbar-hide">

                {{-- ══════════════════════════════════════════════════════════
                     DASHBOARD
                ══════════════════════════════════════════════════════════ --}}
                <span class="section-label">Dashboard</span>
                <a href="/erp/dashboard" class="sidebar-item {{ request()->is('erp/dashboard','erp') ? 'active' : 'normal' }}">
                    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                    <span>Dashboard Utama</span>
                </a>

                {{-- ══════════════════════════════════════════════════════════
                     OPERASIONAL
                ══════════════════════════════════════════════════════════ --}}
                <span class="section-label" style="padding-top:14px">Operasional</span>

                {{-- SALES --}}
                @php $salesActive = request()->is('po-form','erp/invoice','erp/riwayat-penjualan','erp/retur','erp/discount','erp/quotation','erp/sales-target','erp/sales-commission','erp/sales-receivable','erp/order-tracking'); @endphp
                <div x-data="{ open: {{ $salesActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $salesActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                            <span>Sales</span>
                        </div>
                        <svg class="w-3 h-3 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/po-form" class="sidebar-item {{ request()->is('po-form') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                            <span>Buat Order</span>
                        </a>
                        <a href="/erp/riwayat-penjualan" class="sidebar-item {{ request()->is('erp/riwayat-penjualan') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
                            <span>Riwayat Penjualan</span>
                        </a>
                        <a href="/erp/invoice" class="sidebar-item {{ request()->is('erp/invoice') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            <span>Invoice</span>
                        </a>
                        <a href="/erp/quotation" class="sidebar-item {{ request()->is('erp/quotation') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            <span>Quotation</span>
                        </a>
                        <a href="/erp/retur" class="sidebar-item {{ request()->is('erp/retur') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
                            <span>Retur</span>
                        </a>
                        <a href="/erp/discount" class="sidebar-item {{ request()->is('erp/discount') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M17 17h.01M7 17L17 7"/></svg>
                            <span>Diskon & Promo</span>
                        </a>
                        <a href="/erp/sales-target" class="sidebar-item {{ request()->is('erp/sales-target') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                            <span>Sales Target</span>
                        </a>
                    </div>
                </div>

                {{-- INVENTORY --}}
                @php $invActive = request()->is('products','erp/stock-in','erp/stock-out','erp/stock-opname','erp/warehouse','erp/stock-mutation','erp/warehouse-transfer','erp/min-stock','erp/stock-history'); @endphp
                <div x-data="{ open: {{ $invActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $invActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                            <span>Inventory</span>
                        </div>
                        <svg class="w-3 h-3 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/products" class="sidebar-item {{ request()->is('products') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                            <span>Produk & Stok</span>
                        </a>
                        <a href="/erp/stock-in" class="sidebar-item {{ request()->is('erp/stock-in') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                            <span>Stok Masuk</span>
                        </a>
                        <a href="/erp/stock-out" class="sidebar-item {{ request()->is('erp/stock-out') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                            <span>Stok Keluar</span>
                        </a>
                        <a href="/erp/stock-opname" class="sidebar-item {{ request()->is('erp/stock-opname') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                            <span>Stock Opname</span>
                        </a>
                        <a href="/erp/warehouse" class="sidebar-item {{ request()->is('erp/warehouse') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/></svg>
                            <span>Gudang</span>
                        </a>
                        <a href="/erp/stock-mutation" class="sidebar-item {{ request()->is('erp/stock-mutation') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                            <span>Mutasi Stok</span>
                        </a>
                    </div>
                </div>

                {{-- PURCHASE --}}
                @php $purActive = request()->is('erp/supplier','erp/purchase-order','erp/goods-receipt','erp/purchase-request','erp/purchase-approval','erp/supplier-invoice','erp/payable-due'); @endphp
                <div x-data="{ open: {{ $purActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $purActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                            <span>Purchase</span>
                        </div>
                        <svg class="w-3 h-3 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/erp/supplier" class="sidebar-item {{ request()->is('erp/supplier') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            <span>Supplier</span>
                        </a>
                        <a href="/erp/purchase-order" class="sidebar-item {{ request()->is('erp/purchase-order') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                            <span>Purchase Order</span>
                        </a>
                        <a href="/erp/goods-receipt" class="sidebar-item {{ request()->is('erp/goods-receipt') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span>Penerimaan Barang</span>
                        </a>
                        <a href="/erp/purchase-request" class="sidebar-item {{ request()->is('erp/purchase-request') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            <span>Permintaan Pembelian</span>
                        </a>
                        <a href="/erp/payable-due" class="sidebar-item {{ request()->is('erp/payable-due') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span>Hutang Jatuh Tempo</span>
                        </a>
                    </div>
                </div>

                {{-- ══════════════════════════════════════════════════════════
                     FINANCE
                ══════════════════════════════════════════════════════════ --}}
                <span class="section-label" style="padding-top:14px">Finance</span>

                @php $finActive = request()->is('erp/cash-in','erp/cash-out','erp/profit-loss','erp/expense','erp/cash','erp/chart-of-accounts','erp/journal','erp/general-ledger','erp/balance-sheet','erp/cash-flow','erp/account-payable','erp/account-receivable','erp/bank-reconciliation','erp/trial-balance'); @endphp
                <div x-data="{ open: {{ $finActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $finActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span>Finance</span>
                        </div>
                        <svg class="w-3 h-3 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/erp/cash-in" class="sidebar-item {{ request()->is('erp/cash-in') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>
                            <span>Kas Masuk</span>
                        </a>
                        <a href="/erp/cash-out" class="sidebar-item {{ request()->is('erp/cash-out') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                            <span>Kas Keluar</span>
                        </a>
                        <a href="/erp/expense" class="sidebar-item {{ request()->is('erp/expense') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                            <span>Pengeluaran</span>
                        </a>
                        <a href="/erp/profit-loss" class="sidebar-item {{ request()->is('erp/profit-loss') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                            <span>Laba Rugi</span>
                        </a>
                        <a href="/erp/account-receivable" class="sidebar-item {{ request()->is('erp/account-receivable') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                            <span>Piutang Customer</span>
                        </a>
                        <a href="/erp/account-payable" class="sidebar-item {{ request()->is('erp/account-payable') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                            <span>Hutang Supplier</span>
                        </a>
                        <a href="/erp/chart-of-accounts" class="sidebar-item {{ request()->is('erp/chart-of-accounts') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                            <span>Chart of Accounts</span>
                        </a>
                        <a href="/erp/bank-reconciliation" class="sidebar-item {{ request()->is('erp/bank-reconciliation') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                            <span>Rekonsiliasi Bank</span>
                        </a>
                    </div>
                </div>

                {{-- ══════════════════════════════════════════════════════════
                     CUSTOMER & DISTRIBUSI
                ══════════════════════════════════════════════════════════ --}}
                <span class="section-label" style="padding-top:14px">Customer & Distribusi</span>

                {{-- CRM --}}
                @php $crmActive = request()->is('erp/customers','erp/loyalty','erp/wa-logs'); @endphp
                <div x-data="{ open: {{ $crmActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $crmActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            <span>CRM</span>
                        </div>
                        <svg class="w-3 h-3 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/erp/customers" class="sidebar-item {{ request()->is('erp/customers') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                            <span>Data Customer</span>
                        </a>
                        <a href="/erp/loyalty" class="sidebar-item {{ request()->is('erp/loyalty') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                            <span>Program Loyalty</span>
                        </a>
                        <a href="/erp/wa-logs" class="sidebar-item {{ request()->is('erp/wa-logs') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                            <span>Log WhatsApp</span>
                        </a>
                    </div>
                </div>

                {{-- PENGIRIMAN --}}
                @php $delActive = request()->is('admin','driver','erp/delivery-proof'); @endphp
                <div x-data="{ open: {{ $delActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $delActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1"/></svg>
                            <span>Pengiriman</span>
                        </div>
                        <svg class="w-3 h-3 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/admin" class="sidebar-item {{ request()->is('admin') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
                            <span>Kelola Pengiriman</span>
                        </a>
                        <a href="/driver" class="sidebar-item {{ request()->is('driver') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                            <span>Dashboard Driver</span>
                        </a>
                        <a href="/erp/delivery-proof" class="sidebar-item {{ request()->is('erp/delivery-proof') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/></svg>
                            <span>Bukti Pengiriman</span>
                        </a>
                    </div>
                </div>

                {{-- ══════════════════════════════════════════════════════════
                     REPORTS
                ══════════════════════════════════════════════════════════ --}}
                <span class="section-label" style="padding-top:14px">Reports</span>

                @php $repActive = request()->is('erp/report-sales','erp/report-finance','erp/report-driver','erp/laporan-divisi','erp/laporan-penjualan','erp/data-penjualan-kledo','erp/analytics','erp/trial-balance'); @endphp
                <div x-data="{ open: {{ $repActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $repActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                            <span>Reports</span>
                        </div>
                        <svg class="w-3 h-3 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/erp/laporan-divisi" class="sidebar-item {{ request()->is('erp/laporan-divisi') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                            <span>Laporan Per Divisi</span>
                        </a>
                        <a href="/erp/laporan-penjualan" class="sidebar-item {{ request()->is('erp/laporan-penjualan') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>
                            <span>Laporan Penjualan</span>
                        </a>
                        <a href="/erp/data-penjualan-kledo" class="sidebar-item {{ request()->is('erp/data-penjualan-kledo') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                            <span>Data Kledo</span>
                        </a>
                        <a href="/erp/report-finance" class="sidebar-item {{ request()->is('erp/report-finance') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                            <span>Laporan Keuangan</span>
                        </a>
                        <a href="/erp/report-driver" class="sidebar-item {{ request()->is('erp/report-driver') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span>Laporan Driver</span>
                        </a>
                        <a href="/erp/analytics" class="sidebar-item {{ request()->is('erp/analytics') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            <span>Analytics Dashboard</span>
                        </a>
                        <a href="/erp/trial-balance" class="sidebar-item {{ request()->is('erp/trial-balance') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                            <span>Trial Balance</span>
                        </a>
                    </div>
                </div>

                {{-- ══════════════════════════════════════════════════════════
                     AI & AUTOMATION
                ══════════════════════════════════════════════════════════ --}}
                <span class="section-label" style="padding-top:14px">AI & Automation</span>

                @php $aiActive = request()->is('erp/ai-inventory','erp/ai-analytics','erp/chatbot','erp/workflow-automation','erp/mobile-sync'); @endphp
                <div x-data="{ open: {{ $aiActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $aiActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                            <span>AI Features</span>
                        </div>
                        <svg class="w-3 h-3 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/erp/ai-inventory" class="sidebar-item {{ request()->is('erp/ai-inventory') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                            <span>AI Inventory</span>
                        </a>
                        <a href="/erp/ai-analytics" class="sidebar-item {{ request()->is('erp/ai-analytics') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            <span>AI Analytics</span>
                        </a>
                        <a href="/erp/chatbot" class="sidebar-item {{ request()->is('erp/chatbot') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                            <span>Chatbot AI</span>
                        </a>
                        <a href="/erp/workflow-automation" class="sidebar-item {{ request()->is('erp/workflow-automation') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            <span>Workflow Automation</span>
                        </a>
                        <a href="/erp/mobile-sync" class="sidebar-item {{ request()->is('erp/mobile-sync') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                            <span>Mobile Sync</span>
                        </a>
                    </div>
                </div>

                {{-- ══════════════════════════════════════════════════════════
                     SYSTEM
                ══════════════════════════════════════════════════════════ --}}
                <span class="section-label" style="padding-top:14px">System</span>

                @php $sysActive = request()->is('erp/users','erp/notifications','erp/integrasi','erp/roles','erp/audit-log','erp/employees','erp/payroll'); @endphp
                <div x-data="{ open: {{ $sysActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $sysActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            <span>Sistem</span>
                        </div>
                        <svg class="w-3 h-3 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/erp/users" class="sidebar-item {{ request()->is('erp/users') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                            <span>Manajemen User</span>
                        </a>
                        <a href="/erp/roles" class="sidebar-item {{ request()->is('erp/roles') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                            <span>Role & Hak Akses</span>
                        </a>
                        <a href="/erp/employees" class="sidebar-item {{ request()->is('erp/employees') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            <span>Data Karyawan</span>
                        </a>
                        <a href="/erp/payroll" class="sidebar-item {{ request()->is('erp/payroll') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                            <span>Penggajian</span>
                        </a>
                        <a href="/erp/integrasi" class="sidebar-item {{ request()->is('erp/integrasi') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                            <span>Integrasi</span>
                        </a>
                        <a href="/erp/notifications" class="sidebar-item {{ request()->is('erp/notifications') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                            <span>Notifikasi WA</span>
                        </a>
                        <a href="/erp/audit-log" class="sidebar-item {{ request()->is('erp/audit-log') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                            <span>Audit Log</span>
                        </a>
                        <a href="/admin" class="sidebar-item {{ request()->is('admin') && !request()->is('admin/*') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            <span>Pengaturan</span>
                        </a>
                        <a href="/erp/install-app" class="sidebar-item {{ request()->is('erp/install-app') ? 'active' : 'normal' }}"
                            style="{{ request()->is('erp/install-app') ? '' : 'background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                            <span>📲 Install Aplikasi</span>
                        </a>
                    </div>
                </div>

                {{-- ══════════════════════════════════════════════════════════
                     POS KASIR — Green
                ══════════════════════════════════════════════════════════ --}}
                <div class="h-2"></div>
                <a href="/pos" class="sidebar-item {{ request()->is('pos*') ? 'active' : '' }}"
                    style="{{ request()->is('pos*') ? '' : 'background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;box-shadow:0 2px 8px rgba(22,163,74,.3);' }}font-weight:700;">
                    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    <span>POS / Kasir</span>
                    <svg class="w-3.5 h-3.5 ml-auto opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                </a>

                {{-- ══════════════════════════════════════════════════════════
                     MARKETPLACE CENTER — Orange
                ══════════════════════════════════════════════════════════ --}}
                <a href="/marketplace/login"
                    class="sidebar-item"
                    style="background:linear-gradient(135deg,#ea580c,#f97316);color:#fff;box-shadow:0 2px 8px rgba(234,88,12,.3);font-weight:700;margin-top:4px;">
                    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V5a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2zM9 21h6M12 17v4"/></svg>
                    <span>Marketplace Center</span>
                    <svg class="w-3.5 h-3.5 ml-auto opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                </a>

                <div class="h-3"></div>
            </nav>

            {{-- Bottom user info --}}
            <div class="px-3 py-3 border-t border-slate-800 shrink-0">
                <div class="flex items-center gap-2 px-2 py-2 rounded-lg bg-slate-800">
                    <div class="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </div>
                    <div class="min-w-0">
                        <p class="text-xs font-semibold text-slate-200 truncate" x-text="currentUser || 'Gentong Mas'"></p>
                        <p class="text-xs text-slate-500">ERP v1.0</p>
                    </div>
                </div>
            </div>
        </aside>

        {{-- ===== MAIN CONTENT ===== --}}
        <div class="erp-main">

            {{-- Top bar (mobile) --}}
            <div class="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-20">
                <button @click="sidebarOpen=!sidebarOpen" class="p-2 rounded-xl hover:bg-gray-100 text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
                <div class="flex items-center gap-2 flex-1 min-w-0">
                    <div class="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                        <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
                    </div>
                    <span class="font-bold text-gray-900 text-sm truncate">@yield('title', 'ERP Gentong Mas')</span>
                </div>
            </div>

            {{-- Page content --}}
            <main class="flex-1">
                @yield('content')
            </main>
        </div>
    </div>

    <script>
        console.log('BUILD VERSION:', '{{ app()->environment() }}');
        console.log('SIDEBAR SOURCE:', '{{ $sidebarSource }}');
    </script>
    @stack('scripts')
    <script>
    function erpLayout() {
        return {
            sidebarOpen: false,
            currentUser: '',

            // ── Kledo global state ──────────────────────────────────
            kledoStatus: 'checking',   // 'connected' | 'error' | 'no_token' | 'checking'
            kledoSyncing: false,
            kledoCacheCount: 0,
            kledoLastSync: null,

            get kledoLastSyncLabel() {
                if (!this.kledoLastSync) return '';
                try {
                    const d = new Date(this.kledoLastSync);
                    return d.toLocaleDateString('id-ID',{day:'2-digit',month:'short'}) + ' ' +
                           d.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
                } catch { return ''; }
            },

            initLayout() {
                this.currentUser = sessionStorage.getItem('salesUsername') || sessionStorage.getItem('username') || '';

                // Cek status Kledo saat load (non-blocking)
                setTimeout(() => this.checkKledoStatus(), 300);

                // Auto-check tiap 60 detik
                setInterval(() => this.checkKledoStatus(), 60000);

                // Dengar event sync dari tab lain (cross-tab via localStorage)
                window.addEventListener('storage', (e) => {
                    if (e.key === 'kledo_last_sync') {
                        this.kledoLastSync = new Date(parseInt(e.newValue)).toISOString();
                        this.kledoCacheCount = parseInt(localStorage.getItem('kledo_cache_count') || '0');
                        // Update status indicator jadi connected
                        if (this.kledoStatus !== 'connected') this.checkKledoStatus();
                    }
                });

                // Dengar event sync dari halaman ini sendiri
                window.addEventListener('kledo-synced', (e) => {
                    if (e.detail && !e.detail.error) {
                        this.kledoStatus = 'connected';
                        this.kledoLastSync = e.detail.last_sync || new Date().toISOString();
                    }
                });
            },

            async checkKledoStatus() {
                try {
                    const r = await fetch('/api/kledo/status');
                    const d = await r.json();
                    this.kledoStatus     = d.connected ? 'connected' : (d.token_set ? 'error' : 'no_token');
                    this.kledoCacheCount = d.cache_count || 0;
                    this.kledoLastSync   = d.last_sync || null;
                    // Simpan cache count ke localStorage supaya tab lain bisa baca
                    localStorage.setItem('kledo_cache_count', this.kledoCacheCount);
                } catch(e) {
                    this.kledoStatus = 'error';
                }
            },

            async globalSyncKledo() {
                if (this.kledoSyncing) return;
                this.kledoSyncing = true;
                try {
                    const r = await fetch('/api/kledo/sync-now', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content || '',
                        },
                        body: JSON.stringify({ period: 'month' }),
                    });
                    const data = await r.json();
                    if (!data.error) {
                        this.kledoStatus   = 'connected';
                        this.kledoLastSync = new Date().toISOString();
                        const now = Date.now();
                        // Broadcast ke semua tab via localStorage
                        localStorage.setItem('kledo_last_sync', now.toString());
                        // Dispatch custom event ke halaman aktif
                        window.dispatchEvent(new CustomEvent('kledo-synced', { detail: data }));
                    }
                    await this.checkKledoStatus();
                } catch(e) {
                    this.kledoStatus = 'error';
                } finally {
                    this.kledoSyncing = false;
                }
            },
        }
    }
    </script>

    {{-- PWA: Service Worker + Install Prompt --}}
    <script>
    (function() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('SW registered:', reg.scope))
                    .catch(err => console.log('SW error:', err));
            });
        }

        let deferredPrompt = null;
        const installBanner = document.getElementById('pwa-install-banner');
        const installBtn = document.getElementById('pwa-install-btn');
        const installDismiss = document.getElementById('pwa-install-dismiss');

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            if (installBanner && !localStorage.getItem('pwa-dismissed')) {
                installBanner.classList.remove('hidden');
            }
        });

        if (installBtn) {
            installBtn.addEventListener('click', async () => {
                if (!deferredPrompt) return;
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    installBanner.classList.add('hidden');
                    localStorage.setItem('pwa-installed', '1');
                }
                deferredPrompt = null;
            });
        }

        if (installDismiss) {
            installDismiss.addEventListener('click', () => {
                installBanner.classList.add('hidden');
                localStorage.setItem('pwa-dismissed', '1');
            });
        }

        window.addEventListener('appinstalled', () => {
            console.log('PWA installed!');
            if (installBanner) installBanner.classList.add('hidden');
        });
    })();
    </script>
</body>
</html>
