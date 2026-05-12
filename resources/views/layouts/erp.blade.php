<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'ERP Gentong Mas')</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/collapse@3.x.x/dist/cdn.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        [x-cloak] { display: none !important; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        .sidebar-item {
            display: flex; align-items: center; gap: 10px;
            padding: 8px 10px; border-radius: 10px;
            font-size: 0.8125rem; font-weight: 500;
            transition: all 0.15s; cursor: pointer; user-select: none; text-decoration: none;
        }
        .sidebar-item.active { background: #2563eb; color: #fff; box-shadow: 0 1px 4px rgba(37,99,235,.25); }
        .sidebar-item.normal { color: #4b5563; }
        .sidebar-item.normal:hover { background: #f3f4f6; color: #111827; }
        .sidebar-item.coming { color: #9ca3af; cursor: default; }

        .group-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 7px 10px; border-radius: 10px; cursor: pointer;
            font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
            letter-spacing: 0.06em; color: #6b7280;
            transition: background 0.15s, color 0.15s; user-select: none;
        }
        .group-header:hover { background: #f9fafb; color: #374151; }
        .group-header.has-active { color: #2563eb; }

        .chevron { transition: transform 0.2s ease; }
        .chevron.open { transform: rotate(90deg); }

        .group-items {
            overflow: hidden;
            transition: max-height 0.25s ease, opacity 0.2s ease;
        }
        .group-items.open { max-height: 1000px; opacity: 1; }
        .group-items.closed { max-height: 0; opacity: 0; }

        /* ─── CRITICAL MOBILE LAYOUT ─────────────────────────────────────────────
           CSS ini memastikan sidebar tetap fixed di mobile SEBELUM Tailwind CDN
           selesai dimuat, mencegah blank white space besar di atas konten.
           Selector element (aside) memiliki specificity rendah sehingga class
           Tailwind (.translate-x-0, .fixed, dll) tetap bisa override.
        ─────────────────────────────────────────────────────────────────────── */
        html { overflow-x: hidden; }
        body { overflow-x: hidden; }

        /* Sidebar: selalu fixed di mobile agar tidak mendorong konten ke bawah */
        aside {
            position: fixed;
            top: 0; left: 0; bottom: 0; right: auto;
            width: 15rem;           /* w-60 */
            z-index: 40;
            background: #ffffff;
            border-right: 1px solid #f3f4f6;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            overflow-x: hidden;
            transform: translateX(-100%);
            transition: transform 0.2s ease;
        }

        /* Desktop: sidebar kembali ke posisi relatif dalam flex */
        @media (min-width: 1024px) {
            aside {
                position: relative;
                top: auto; left: auto; bottom: auto; right: auto;
                transform: translateX(0);
                z-index: auto;
                overflow-y: auto;
            }
        }

        /* Wrapper utama: flex row */
        .erp-wrapper {
            display: flex;
            min-height: 100vh;
            /* Gunakan dvh jika browser mendukung (fix Android address bar) */
            min-height: 100dvh;
        }

        /* Main content: flex column, isi sisa ruang */
        .erp-main {
            flex: 1 1 0%;
            display: flex;
            flex-direction: column;
            min-width: 0;
            width: 100%;
            /* Pada mobile, pastikan mengambil lebar penuh */
            max-width: 100%;
        }

        /* Fix overflow konten pada mobile */
        main { overflow-x: hidden; }
    </style>
    @stack('head')
</head>
@php
    $sidebarConfigVersion = config('sidebar.version') ?? 'unknown';
    $sidebarSource = config('sidebar.source') ?? 'config/sidebar.php';
@endphp

<body class="bg-gray-50 min-h-screen" data-sidebar-source="{{ $sidebarSource }}" x-data="erpLayout()" x-init="initLayout()">

    {{-- Mobile overlay --}}
    <div x-show="sidebarOpen" x-cloak class="fixed inset-0 z-30 bg-black/40 lg:hidden" @click="sidebarOpen=false"></div>

    <div class="flex erp-wrapper">

        {{-- ===== SIDEBAR ===== --}}
        <aside
            :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
            class="fixed inset-y-0 left-0 z-40 w-60 bg-white border-r border-gray-100 shadow-xl flex flex-col transition-transform duration-200 lg:relative lg:translate-x-0 lg:shadow-none lg:z-auto">

            {{-- Logo --}}
            <div class="px-4 py-4 border-b border-gray-100">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
                    </div>
                    <div>
                        <p class="font-bold text-gray-900 text-sm leading-tight">Gentong Mas</p>
                        <p class="text-xs text-gray-400">ERP System</p>
                    </div>
                </div>
            </div>

            {{-- Nav --}}
            <nav class="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 scrollbar-hide">

                @php
                $sidebarConfig = config('sidebar.groups', []);
                $sidebarMatches = function (array $patterns) {
                    foreach ($patterns as $pattern) {
                        if (request()->is($pattern)) {
                            return true;
                        }
                    }
                    return false;
                };

                $salesActive        = $sidebarMatches($sidebarConfig['sales']['active_patterns'] ?? []);
                $inventoryActive    = $sidebarMatches($sidebarConfig['inventory']['active_patterns'] ?? []);
                $purchaseActive     = $sidebarMatches($sidebarConfig['purchase']['active_patterns'] ?? []);
                $financeActive      = $sidebarMatches($sidebarConfig['finance']['active_patterns'] ?? []);
                $accountingActive   = $sidebarMatches($sidebarConfig['accounting']['active_patterns'] ?? []);
                $taxActive          = $sidebarMatches($sidebarConfig['tax']['active_patterns'] ?? []);
                $crmActive          = $sidebarMatches($sidebarConfig['crm']['active_patterns'] ?? []);
                $deliveryActive     = $sidebarMatches($sidebarConfig['delivery']['active_patterns'] ?? []);
                $mktDashboardActive = $sidebarMatches($sidebarConfig['marketplace']['active_patterns'] ?? []);
                $mktShopeeActive    = request()->is('erp/shopee/*');
                $mktTiktokActive    = request()->is('erp/tiktok/*');
                $mktTokopediaActive = request()->is('erp/tokopedia/*');
                $mktLazadaActive    = request()->is('erp/lazada/*');
                $mktActive          = request()->is('marketplace*','shopee*') || $mktDashboardActive || $mktShopeeActive || $mktTiktokActive || $mktTokopediaActive || $mktLazadaActive;
                $serviceActive      = $sidebarMatches($sidebarConfig['service']['active_patterns'] ?? []);
                $reportsActive      = $sidebarMatches($sidebarConfig['reports']['active_patterns'] ?? []);
                $aiActive           = $sidebarMatches($sidebarConfig['ai']['active_patterns'] ?? []);
                $hrdActive          = $sidebarMatches($sidebarConfig['hrd']['active_patterns'] ?? []);
                $systemActive       = $sidebarMatches($sidebarConfig['system']['active_patterns'] ?? []);
                @endphp

                {{-- ══ DASHBOARD ══ --}}
                <div class="section-divider">Dashboard</div>
                <a href="/" class="sidebar-item {{ request()->is('/') ? 'active' : 'normal' }}">
                    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                    <span>Dashboard</span>
                </a>


                <div class="h-1"></div>

                {{-- ===== SALES ===== --}}
                @php $salesActive = request()->is('po-form','sales-dashboard','erp/invoice','erp/riwayat-penjualan','erp/retur','erp/discount'); @endphp
                <div x-data="{ open: {{ $salesActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $salesActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                            <span>Sales</span>
                        </div>
                        <svg class="w-3.5 h-3.5 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/po-form" class="sidebar-item {{ request()->is('po-form') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                            <span>Buat Order</span>
                        </a>
                        <a href="/sales-dashboard" class="sidebar-item {{ request()->is('sales-dashboard') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                            <span>Riwayat Pesanan</span>
                        </a>
                        <a href="/erp/riwayat-penjualan" class="sidebar-item {{ request()->is('erp/riwayat-penjualan') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
                            <span>Riwayat Penjualan</span>
                        </a>
                        <a href="/erp/invoice" class="sidebar-item {{ request()->is('erp/invoice') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            <span>Invoice</span>
                        </a>
                        <a href="/erp/retur" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
                            <span>Retur</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/discount" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M17 17h.01M7 17L17 7M9.5 9.5a2.5 2.5 0 105 0 2.5 2.5 0 10-5 0m5 5a2.5 2.5 0 105 0 2.5 2.5 0 10-5 0"/></svg>
                            <span>Diskon & Promo</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                    </div>
                </div>

                {{-- ===== INVENTORY ===== --}}
                @php $invActive = request()->is('products','erp/stock-in','erp/stock-out','erp/stock-opname','erp/warehouse'); @endphp
                <div x-data="{ open: {{ $invActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $invActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                            <span>Inventory</span>
                        </div>
                        <svg class="w-3.5 h-3.5 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/products" class="sidebar-item {{ request()->is('products') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                            <span>Produk</span>
                        </a>
                        <a href="/erp/stock-in" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                            <span>Stok Masuk</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/stock-out" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                            <span>Stok Keluar</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/stock-opname" class="sidebar-item {{ request()->is('erp/stock-opname') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                            <span>Stock Opname</span>
                        </a>
                        <a href="/erp/warehouse" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/></svg>
                            <span>Gudang</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                    </div>
                </div>

                {{-- ===== PURCHASE ===== --}}
                @php $purActive = request()->is('erp/supplier','erp/purchase-order','erp/goods-receipt'); @endphp
                <div x-data="{ open: {{ $purActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $purActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                            <span>Purchase</span>
                        </div>
                        <svg class="w-3.5 h-3.5 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/erp/supplier" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            <span>Supplier</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/purchase-order" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                            <span>Purchase Order</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/goods-receipt" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span>Penerimaan Barang</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                    </div>
                </div>

                {{-- ===== FINANCE ===== --}}
                @php $finActive = request()->is('erp/cash-in','erp/cash-out','erp/profit-loss','erp/expense'); @endphp
                <div x-data="{ open: {{ $finActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $finActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span>Finance</span>
                        </div>
                        <svg class="w-3.5 h-3.5 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/erp/cash-in" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>
                            <span>Kas Masuk</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/cash-out" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                            <span>Kas Keluar</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/profit-loss" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                            <span>Laba Rugi</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/expense" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                            <span>Pengeluaran</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                    </div>
                </div>

                {{-- ===== CRM ===== --}}
                @php $crmActive = request()->is('erp/customers','erp/loyalty'); @endphp
                <div x-data="{ open: {{ $crmActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $crmActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            <span>CRM</span>
                        </div>
                        <svg class="w-3.5 h-3.5 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/erp/customers" class="sidebar-item">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                            <span>Data Customer</span>
                        </a>
                        <a href="/erp/loyalty" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                            <span>Loyalty Points</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                    </div>
                </div>

                {{-- ===== PENGIRIMAN ===== --}}
                @php $delActive = request()->is('admin','driver','erp/delivery-proof'); @endphp
                <div x-data="{ open: {{ $delActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $delActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1"/></svg>
                            <span>Pengiriman</span>
                        </div>
                        <svg class="w-3.5 h-3.5 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
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
                        <a href="/erp/delivery-proof" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            <span>Bukti Pengiriman</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                    </div>
                </div>

                {{-- ===== LAPORAN ===== --}}
                @php $repActive = request()->is('erp/report-sales','erp/report-finance','erp/report-driver','erp/laporan-divisi','erp/laporan-penjualan','erp/data-penjualan-kledo'); @endphp
                <div x-data="{ open: {{ $repActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $repActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                            <span>Laporan</span>
                        </div>
                        <svg class="w-3.5 h-3.5 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
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
                            <span class="ml-auto text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full font-semibold">Live</span>
                        </a>
                        <a href="/erp/report-finance" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                            <span>Laporan Keuangan</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/report-driver" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span>Laporan Driver</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                    </div>
                </div>

                {{-- ===== SISTEM ===== --}}
                @php $sysActive = request()->is('erp/users','erp/notifications','erp/integrasi','admin'); @endphp
                <div x-data="{ open: {{ $sysActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $sysActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            <span>Sistem</span>
                        </div>
                        <svg class="w-3.5 h-3.5 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/erp/integrasi" class="sidebar-item {{ request()->is('erp/integrasi') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                            <span>Integrasi</span>
                        </a>
                        <a href="/erp/users" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                            <span>Manajemen User</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/notifications" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                            <span>Notifikasi WA</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/admin" class="sidebar-item {{ request()->is('admin') ? 'active' : 'normal' }}">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            <span>Pengaturan</span>
                        </a>
                    </div>
                </div>

                {{-- ===== FITUR LANJUTAN ===== --}}
                @php $advActive = request()->is('erp/ai-inventory','erp/ai-analytics','erp/multi-branch','erp/payment-gateway','erp/mobile-sync','erp/chatbot','erp/tax-accounting'); @endphp
                <div x-data="{ open: {{ $advActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $advActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                            <span>Fitur Lanjutan</span>
                        </div>
                        <svg class="w-3.5 h-3.5 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/erp/ai-inventory" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                            <span>AI Inventory</span>
                            <span class="ml-auto text-xs bg-blue-50 text-blue-400 px-1.5 py-0.5 rounded-full">AI</span>
                        </a>
                        <a href="/erp/ai-analytics" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            <span>AI Analytics</span>
                            <span class="ml-auto text-xs bg-blue-50 text-blue-400 px-1.5 py-0.5 rounded-full">AI</span>
                        </a>
                        <a href="/erp/multi-branch" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                            <span>Multi Cabang</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/payment-gateway" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                            <span>Payment Gateway</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/mobile-sync" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                            <span>Mobile Sync</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/chatbot" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                            <span>Chatbot AI</span>
                            <span class="ml-auto text-xs bg-blue-50 text-blue-400 px-1.5 py-0.5 rounded-full">AI</span>
                        </a>
                        <a href="/erp/tax-accounting" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"/></svg>
                            <span>Pajak & Akuntansi</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                    </div>
                </div>

                {{-- ===== FITUR ENTERPRISE ===== --}}
                @php $enterpriseActive = request()->is('erp/approval-system','erp/workflow-automation','erp/export-pdf-excel','erp/template-invoice','erp/multi-currency','erp/multi-tax','erp/backup-system','erp/api-public','erp/webhook','erp/activity-timeline'); @endphp
                <div x-data="{ open: {{ $enterpriseActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $enterpriseActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                            <span>Fitur Enterprise</span>
                        </div>
                        <svg class="w-3.5 h-3.5 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/erp/approval-system" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span>Approval System</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/workflow-automation" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            <span>Workflow Automation</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/export-pdf-excel" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            <span>Export PDF/Excel</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/template-invoice" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            <span>Template Invoice</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/multi-currency" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span>Multi Currency</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/multi-tax" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"/></svg>
                            <span>Multi Pajak</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/backup-system" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/></svg>
                            <span>Backup System</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/api-public" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            <span>API Public</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/webhook" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                            <span>Webhook</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/activity-timeline" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span>Activity Timeline</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                    </div>
                </div>

                {{-- ===== MASTER DATA ===== --}}
                @php $masterDataActive = request()->is('erp/product-categories','erp/brands','erp/units','erp/price-types','erp/taxes','erp/branches','erp/salesman','erp/payment-methods'); @endphp
                <div x-data="{ open: {{ $masterDataActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $masterDataActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                            <span>Master Data</span>
                        </div>
                        <svg class="w-3.5 h-3.5 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/erp/product-categories" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                            <span>Kategori Produk</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/brands" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z"/></svg>
                            <span>Brand Produk</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/units" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                            <span>Satuan Barang</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/price-types" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span>Tipe Harga</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/taxes" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"/></svg>
                            <span>Pajak</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/branches" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                            <span>Data Cabang</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/salesman" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                            <span>Data Salesman</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/payment-methods" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                            <span>Metode Pembayaran</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                    </div>
                </div>

                {{-- ===== AKUNTANSI ===== --}}
                @php $accountingActive = request()->is('erp/chart-of-accounts','erp/journal','erp/general-ledger','erp/balance-sheet','erp/cash-flow','erp/account-payable','erp/account-receivable','erp/bank-reconciliation'); @endphp
                <div x-data="{ open: {{ $accountingActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $accountingActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                            <span>Akuntansi</span>
                        </div>
                        <svg class="w-3.5 h-3.5 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/erp/chart-of-accounts" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                            <span>Chart of Accounts (COA)</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/journal" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                            <span>Jurnal Umum</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/general-ledger" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                            <span>Buku Besar</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/balance-sheet" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                            <span>Neraca</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/cash-flow" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                            <span>Arus Kas</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/account-payable" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                            <span>Hutang Supplier</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/account-receivable" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                            <span>Piutang Customer</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/bank-reconciliation" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                            <span>Rekonsiliasi Bank</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                    </div>
                </div>

                {{-- ===== MANAJEMEN STOK ===== --}}
                @php $inventoryActive = request()->is('erp/stock-mutation','erp/warehouse-transfer','erp/min-stock','erp/serial-number','erp/product-batch','erp/stock-history'); @endphp
                <div x-data="{ open: {{ $inventoryActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $inventoryActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                            <span>Manajemen Stok</span>
                        </div>
                        <svg class="w-3.5 h-3.5 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/erp/stock-mutation" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                            <span>Mutasi Stok</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/warehouse-transfer" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                            <span>Transfer Antar Gudang</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/min-stock" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
                            <span>Minimum Stock Alert</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/serial-number" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                            <span>Serial Number / IMEI</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/product-batch" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                            <span>Batch Produk</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/stock-history" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span>History Pergerakan Barang</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                    </div>
                </div>

                {{-- ===== PURCHASE FLOW ===== --}}
                @php $purchaseFlowActive = request()->is('erp/purchase-request','erp/purchase-approval','erp/supplier-invoice','erp/payable-due'); @endphp
                <div x-data="{ open: {{ $purchaseFlowActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $purchaseFlowActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                            <span>Purchase Flow</span>
                        </div>
                        <svg class="w-3.5 h-3.5 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/erp/purchase-request" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            <span>Permintaan Pembelian</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/purchase-approval" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span>Approval Purchase</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/supplier-invoice" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            <span>Invoice Supplier</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/payable-due" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span>Hutang Jatuh Tempo</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                    </div>
                </div>

                {{-- ===== SALES FLOW ===== --}}
                @php $salesFlowActive = request()->is('erp/quotation','erp/sales-target','erp/sales-commission','erp/sales-receivable','erp/order-tracking'); @endphp
                <div x-data="{ open: {{ $salesFlowActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $salesFlowActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                            <span>Sales Flow</span>
                        </div>
                        <svg class="w-3.5 h-3.5 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/erp/quotation" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            <span>Quotation / Penawaran</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/sales-target" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                            <span>Sales Target</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/sales-commission" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span>Komisi Sales</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/sales-receivable" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                            <span>Piutang Penjualan</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/order-tracking" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                            <span>Tracking Status Order</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                    </div>
                </div>

                {{-- ===== HR / KARYAWAN ===== --}}
                @php $hrActive = request()->is('erp/employees','erp/attendance','erp/payroll','erp/roles','erp/audit-log'); @endphp
                <div x-data="{ open: {{ $hrActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $hrActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            <span>HR / Karyawan</span>
                        </div>
                        <svg class="w-3.5 h-3.5 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/erp/employees" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                            <span>Data Karyawan</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/attendance" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span>Absensi</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/payroll" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                            <span>Gaji</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/roles" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                            <span>Role & Hak Akses</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/audit-log" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                            <span>Aktivitas User / Audit Log</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                    </div>
                </div>

                {{-- ===== DASHBOARD ANALYTICS ===== --}}
                @php $analyticsActive = request()->is('erp/analytics'); @endphp
                <div x-data="{ open: {{ $analyticsActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $analyticsActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                            <span>Dashboard Analytics</span>
                        </div>
                        <svg class="w-3.5 h-3.5 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/erp/analytics" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                            <span>Analytics Dashboard</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                    </div>
                </div>

                {{-- ===== FITUR TOKO ELEKTRONIK ===== --}}
                @php $electronicStoreActive = request()->is('erp/service','erp/warranty','erp/service-tracking','erp/installment','erp/installment-due'); @endphp
                <div x-data="{ open: {{ $electronicStoreActive ? 'true' : 'false' }} }">
                    <button @click="open=!open" class="group-header w-full {{ $electronicStoreActive ? 'has-active' : '' }}">
                        <div class="flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            <span>Fitur Toko Elektronik</span>
                        </div>
                        <svg class="w-3.5 h-3.5 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <div class="group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                        <a href="/erp/service" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            <span>Servis Barang</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/warranty" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span>Klaim Garansi</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/service-tracking" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                            <span>Tracking Perbaikan</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/installment" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span>Kredit Customer</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                        <a href="/erp/installment-due" class="sidebar-item coming">
                            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span>Jatuh Tempo Cicilan</span>
                            <span class="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Soon</span>
                        </a>
                    </div>
                </div>

                {{-- ===== MARKETPLACE — Single orange button ===== --}}
                <a href="/marketplace/login"
                    class="sidebar-item"
                    style="background:linear-gradient(135deg,#ea580c,#f97316);color:#fff;box-shadow:0 2px 8px rgba(234,88,12,0.3);font-weight:700;margin-top:4px;">
                    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V5a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2zM9 21h6M12 17v4"/></svg>
                    <span>Marketplace</span>
                    <svg class="w-3.5 h-3.5 ml-auto opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                </a>

                <div class="h-4"></div>
            </nav>

            {{-- Bottom user info --}}
            <div class="px-3 py-3 border-t border-gray-100">
                <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50">
                    <div class="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </div>
                    <div class="min-w-0">
                        <p class="text-xs font-semibold text-gray-700 truncate" x-text="currentUser || 'Gentong Mas'"></p>
                        <p class="text-xs text-gray-400">ERP v1.0</p>
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
        console.log('SIDEBAR CONFIG VERSION:', '{{ $sidebarConfigVersion }}');
    </script>
    @stack('scripts')
    <script>
    function erpLayout() {
        return {
            sidebarOpen: false,
            currentUser: '',
            initLayout() {
                this.currentUser = sessionStorage.getItem('salesUsername') || sessionStorage.getItem('username') || '';
            }
        }
    }
    </script>
</body>
</html>
