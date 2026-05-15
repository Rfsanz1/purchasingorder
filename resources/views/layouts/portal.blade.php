<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Portal — Gentong Mas ERP')</title>

    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#714fff">
    <link rel="apple-touch-icon" href="/icons/icon-192.png">
    <link rel="shortcut icon" href="/icons/icon-96.png">

    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <style>
        :root {
            --brand: #714fff;
            --brand-light: rgba(113,79,255,.12);
        }
        * { box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; margin: 0; }
        [x-cloak] { display: none !important; }
    </style>
    @stack('head')
</head>
<body style="background:#f0f2f5">

{{-- ═══════════════════════════════════════════════════
     TOP NAV BAR
═══════════════════════════════════════════════════ --}}
<header class="sticky top-0 z-30 flex items-center gap-3 px-4 py-0" style="height:56px;background:#fff;border-bottom:1px solid #e8eaf0;box-shadow:0 1px 6px rgba(0,0,0,.07)">

    {{-- Logo --}}
    <a href="/portal" class="flex items-center gap-2.5 shrink-0 mr-2">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style="background:linear-gradient(135deg,#714fff,#9155fd)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
        </div>
        <span class="font-bold text-sm leading-tight hidden sm:block" style="color:#1e1e2d">Gentong Mas<br><span class="font-normal text-xs" style="color:#9095a0">ERP System</span></span>
    </a>

    {{-- Nav pills --}}
    <nav class="hidden md:flex items-center gap-1 flex-1">
        <a href="/portal"
           class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors {{ request()->is('portal') ? 'text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700' }}"
           style="{{ request()->is('portal') ? 'background:var(--brand)' : '' }}">
            🏠 Portal Home
        </a>
        <a href="/erp/dashboard"
           class="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            📊 Dashboard
        </a>
        <a href="/po-form"
           class="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            ➕ Buat Order
        </a>
        <a href="/products"
           class="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            📦 Produk
        </a>
        <a href="/admin"
           class="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            🚚 Admin
        </a>
        <a href="/pos"
           class="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            🖥️ POS
        </a>
    </nav>

    {{-- Spacer --}}
    <div class="flex-1 md:flex-none"></div>

    {{-- Right side --}}
    <div class="flex items-center gap-2 shrink-0">

        {{-- Kledo status dot --}}
        <div x-data="{ status: 'checking' }" x-init="
            fetch('/api/kledo/status').then(r=>r.json()).then(d=>{
                status = d.connected ? 'ok' : (d.no_token ? 'no_token' : 'error');
            }).catch(()=>{ status='error'; })
        " class="hidden sm:flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full"
                :class="status==='ok' ? 'bg-green-400 animate-pulse' : status==='no_token' ? 'bg-red-400' : 'bg-yellow-400'">
            </span>
            <span class="text-xs font-medium"
                :class="status==='ok' ? 'text-green-600' : status==='no_token' ? 'text-red-500' : 'text-yellow-600'"
                x-text="status==='ok' ? 'Kledo OK' : status==='no_token' ? 'Setup Kledo' : 'Kledo...'">
            </span>
        </div>

        <div class="w-px h-5 bg-gray-200 hidden sm:block"></div>

        {{-- User avatar --}}
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style="background:linear-gradient(135deg,#714fff,#9155fd)">
            GM
        </div>

        {{-- Mobile menu --}}
        <button class="md:hidden p-2 rounded-lg hover:bg-gray-100" x-data @click="$dispatch('open-mobile-menu')">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
        </button>
    </div>
</header>

{{-- Mobile menu drawer --}}
<div x-data="{ open: false }" @open-mobile-menu.window="open=true">
    <div x-show="open" x-cloak class="fixed inset-0 z-40 bg-black/50" @click="open=false"></div>
    <div x-show="open" x-cloak
         class="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl flex flex-col"
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="-translate-x-full"
         x-transition:enter-end="translate-x-0"
         x-transition:leave="transition ease-in duration-150"
         x-transition:leave-start="translate-x-0"
         x-transition:leave-end="-translate-x-full">
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span class="font-bold text-gray-800">Menu</span>
            <button @click="open=false" class="p-1 rounded-lg hover:bg-gray-100 text-gray-500">✕</button>
        </div>
        <nav class="flex-1 overflow-y-auto p-3 space-y-1">
            <a href="/portal" class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-50 hover:text-purple-700 transition-colors text-gray-700">🏠 Portal Home</a>
            <a href="/erp/dashboard" class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-50 hover:text-purple-700 transition-colors text-gray-700">📊 Dashboard</a>
            <a href="/po-form" class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-50 hover:text-purple-700 transition-colors text-gray-700">➕ Buat Order</a>
            <a href="/products" class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-50 hover:text-purple-700 transition-colors text-gray-700">📦 Produk & Stok</a>
            <a href="/admin" class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-50 hover:text-purple-700 transition-colors text-gray-700">🚚 Admin Pengiriman</a>
            <a href="/driver" class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-50 hover:text-purple-700 transition-colors text-gray-700">🚗 Driver</a>
            <a href="/pos" class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-50 hover:text-purple-700 transition-colors text-gray-700">🖥️ Point of Sale</a>
            <a href="/marketplace" class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-50 hover:text-purple-700 transition-colors text-gray-700">🌐 Marketplace</a>
            <hr class="my-2 border-gray-100">
            <a href="/erp/integrasi" class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-50 hover:text-purple-700 transition-colors text-gray-700">🔗 Integrasi</a>
            <a href="/erp/install-app" class="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-50 hover:text-purple-700 transition-colors text-gray-700">📲 Install App</a>
        </nav>
    </div>
</div>

{{-- MAIN CONTENT --}}
<main>
    @yield('content')
</main>

@stack('scripts')
</body>
</html>
