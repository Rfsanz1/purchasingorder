<!DOCTYPE html>
<html lang="id" x-data="marketplaceLayout()" x-init="init()">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Marketplace') — Gentong Mas</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/collapse@3.x.x/dist/cdn.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; }
        html, body { height: 100%; margin: 0; font-family: 'Inter', sans-serif; overflow: hidden; }
        [x-cloak] { display: none !important; }

        /* ── SCROLLBAR ── */
        .slim-scroll::-webkit-scrollbar { width: 4px; }
        .slim-scroll::-webkit-scrollbar-track { background: transparent; }
        .slim-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
        .slim-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.15) transparent; }

        /* ── SIDEBAR ── */
        .mp-sidebar {
            width: 256px; flex-shrink: 0;
            background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
            display: flex; flex-direction: column;
            height: 100%;
            border-right: 1px solid rgba(255,255,255,0.06);
        }

        /* ── SIDEBAR ITEMS ── */
        .mp-item {
            display: flex; align-items: center; gap: 9px;
            padding: 8px 10px; border-radius: 9px;
            font-size: 0.8125rem; font-weight: 500;
            color: #94a3b8; text-decoration: none;
            transition: all 0.15s; cursor: pointer; user-select: none;
        }
        .mp-item:hover { background: rgba(255,255,255,0.06); color: #e2e8f0; }
        .mp-item.active { background: linear-gradient(135deg,#ea580c,#f97316); color: #fff; box-shadow: 0 2px 8px rgba(234,88,12,0.35); }
        .mp-item .mp-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

        /* ── GROUP HEADER ── */
        .mp-group-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 7px 10px; border-radius: 9px;
            font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
            letter-spacing: 0.08em; color: #475569;
            cursor: pointer; user-select: none;
            transition: background 0.15s, color 0.15s;
        }
        .mp-group-header:hover { background: rgba(255,255,255,0.04); color: #64748b; }
        .mp-group-header.platform-active { color: #f97316 !important; }
        .mp-chevron { transition: transform 0.2s ease; }
        .mp-chevron.open { transform: rotate(90deg); }

        .mp-group-items {
            overflow: hidden;
            transition: max-height 0.25s ease, opacity 0.2s ease;
        }
        .mp-group-items.open { max-height: 800px; opacity: 1; }
        .mp-group-items.closed { max-height: 0; opacity: 0; }

        /* ── PLATFORM BADGE ── */
        .platform-badge {
            display: inline-flex; align-items: center; gap: 5px;
            padding: 3px 8px; border-radius: 6px;
            font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
            letter-spacing: 0.04em;
        }

        /* ── MOBILE SIDEBAR ── */
        @media (max-width: 1023px) {
            .mp-sidebar {
                position: fixed; top: 0; left: 0; bottom: 0; z-index: 40;
                transform: translateX(-100%); transition: transform 0.25s ease;
                width: 280px;
            }
            .mp-sidebar.open { transform: translateX(0); }
        }

        /* ── SKELETON ── */
        .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* ── COMING SOON BADGE ── */
        .cs-badge {
            display: inline-flex; align-items: center; gap: 5px;
            padding: 4px 10px; border-radius: 20px;
            background: linear-gradient(135deg, #ea580c, #f97316);
            color: #fff; font-size: 0.75rem; font-weight: 700;
        }

        /* ── CONTENT SCROLL ── */
        .mp-content { overflow-y: auto; scrollbar-width: thin; scrollbar-color: #e5e7eb transparent; }
        .mp-content::-webkit-scrollbar { width: 6px; }
        .mp-content::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 6px; }
    </style>
</head>
<body class="bg-slate-50">

<div class="flex" style="height:100vh;height:100dvh;overflow:hidden;">

    {{-- ===== MOBILE OVERLAY ===== --}}
    <div x-show="sidebarOpen" x-cloak
        class="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
        @click="sidebarOpen=false"
        x-transition:enter="transition-opacity ease-out duration-200"
        x-transition:enter-start="opacity-0"
        x-transition:enter-end="opacity-100"
        x-transition:leave="transition-opacity ease-in duration-150"
        x-transition:leave-start="opacity-100"
        x-transition:leave-end="opacity-0">
    </div>

    {{-- ===== SIDEBAR ===== --}}
    <aside class="mp-sidebar slim-scroll" :class="sidebarOpen ? 'open' : ''" style="overflow-y:auto;">

        {{-- Logo --}}
        <div class="px-4 py-4 border-b flex-shrink-0" style="border-color:rgba(255,255,255,0.08)">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style="background:linear-gradient(135deg,#ea580c,#f97316)">
                    <span class="text-lg">🛍️</span>
                </div>
                <div>
                    <p class="font-bold text-sm leading-tight text-white">Marketplace</p>
                    <p class="text-xs text-slate-500">Gentong Mas</p>
                </div>
                <button class="ml-auto lg:hidden text-slate-500 hover:text-slate-300 transition-colors p-1" @click="sidebarOpen=false">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        </div>

        {{-- Nav --}}
        <nav class="flex-1 px-2 py-3 space-y-0.5 slim-scroll" style="overflow-y:auto;">

            {{-- Dashboard --}}
            {{-- <a href="{{ route('marketplace.dashboard') }}"
                class="mp-item {{ request()->routeIs('marketplace.dashboard') ? 'active' : '' }}">
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <span>Dashboard Marketplace</span>
            </a> --}}
            {{-- Dashboard removed - keeping only main ERP dashboard --}}

            <div class="h-2"></div>

            {{-- ===== SHOPEE ===== --}}
            @php $shopeeActive = request()->is('marketplace/shopee*'); @endphp
            <div x-data="{ open: {{ $shopeeActive ? 'true' : 'false' }} }">
                <button @click="open=!open" class="mp-group-header w-full {{ $shopeeActive ? 'platform-active' : '' }}">
                    <div class="flex items-center gap-2">
                        <span>🛍️</span>
                        <span>Shopee</span>
                    </div>
                    <svg class="w-3 h-3 mp-chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
                <div class="mp-group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                    @foreach([
                        // ['dashboard','Dashboard Shopee'], // Removed - keeping only main ERP dashboard
                        ['orders','Pesanan Shopee'],
                        ['products','Produk Shopee'],
                        ['chat','Chat Shopee'],
                        ['shipping','Pengiriman Shopee'],
                        ['vouchers','Voucher Shopee'],
                        ['customers','Customer Shopee'],
                        ['analytics','Analytics Shopee'],
                        ['settings','Pengaturan API Shopee'],
                    ] as [$slug,$label])
                    <a href="/marketplace/shopee/{{ $slug }}"
                        class="mp-item {{ request()->is('marketplace/shopee/'.$slug) ? 'active' : '' }}">
                        <span class="mp-dot"></span>
                        <span>{{ $label }}</span>
                    </a>
                    @endforeach
                </div>
            </div>

            {{-- ===== TIKTOK SHOP ===== --}}
            @php $tiktokActive = request()->is('marketplace/tiktok-shop*'); @endphp
            <div x-data="{ open: {{ $tiktokActive ? 'true' : 'false' }} }">
                <button @click="open=!open" class="mp-group-header w-full {{ $tiktokActive ? 'platform-active' : '' }}">
                    <div class="flex items-center gap-2">
                        <span>🎵</span>
                        <span>TikTok Shop</span>
                    </div>
                    <svg class="w-3 h-3 mp-chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
                <div class="mp-group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                    @foreach([
                        // ['dashboard','Dashboard TikTok Shop'], // Removed - keeping only main ERP dashboard
                        ['orders','Pesanan TikTok Shop'],
                        ['products','Produk TikTok Shop'],
                        ['chat','Chat TikTok Shop'],
                        ['shipping','Pengiriman TikTok Shop'],
                        ['vouchers','Voucher TikTok Shop'],
                        ['customers','Customer TikTok Shop'],
                        ['analytics','Analytics TikTok Shop'],
                        ['settings','Pengaturan API TikTok Shop'],
                    ] as [$slug,$label])
                    <a href="/marketplace/tiktok-shop/{{ $slug }}"
                        class="mp-item {{ request()->is('marketplace/tiktok-shop/'.$slug) ? 'active' : '' }}">
                        <span class="mp-dot"></span>
                        <span>{{ $label }}</span>
                    </a>
                    @endforeach
                </div>
            </div>

            {{-- ===== TOKOPEDIA ===== --}}
            @php $tokopediaActive = request()->is('marketplace/tokopedia*'); @endphp
            <div x-data="{ open: {{ $tokopediaActive ? 'true' : 'false' }} }">
                <button @click="open=!open" class="mp-group-header w-full {{ $tokopediaActive ? 'platform-active' : '' }}">
                    <div class="flex items-center gap-2">
                        <span>🟢</span>
                        <span>Tokopedia</span>
                    </div>
                    <svg class="w-3 h-3 mp-chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
                <div class="mp-group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                    @foreach([
                        // ['dashboard','Dashboard Tokopedia'], // Removed - keeping only main ERP dashboard
                        ['orders','Pesanan Tokopedia'],
                        ['products','Produk Tokopedia'],
                        ['chat','Chat Tokopedia'],
                        ['shipping','Pengiriman Tokopedia'],
                        ['vouchers','Voucher Tokopedia'],
                        ['customers','Customer Tokopedia'],
                        ['analytics','Analytics Tokopedia'],
                        ['settings','Pengaturan API Tokopedia'],
                    ] as [$slug,$label])
                    <a href="/marketplace/tokopedia/{{ $slug }}"
                        class="mp-item {{ request()->is('marketplace/tokopedia/'.$slug) ? 'active' : '' }}">
                        <span class="mp-dot"></span>
                        <span>{{ $label }}</span>
                    </a>
                    @endforeach
                </div>
            </div>

            {{-- ===== LAZADA ===== --}}
            @php $lazadaActive = request()->is('marketplace/lazada*'); @endphp
            <div x-data="{ open: {{ $lazadaActive ? 'true' : 'false' }} }">
                <button @click="open=!open" class="mp-group-header w-full {{ $lazadaActive ? 'platform-active' : '' }}">
                    <div class="flex items-center gap-2">
                        <span>🔵</span>
                        <span>Lazada</span>
                    </div>
                    <svg class="w-3 h-3 mp-chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
                <div class="mp-group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                    @foreach([
                        // ['dashboard','Dashboard Lazada'], // Removed - keeping only main ERP dashboard
                        ['orders','Pesanan Lazada'],
                        ['products','Produk Lazada'],
                        ['chat','Chat Lazada'],
                        ['shipping','Pengiriman Lazada'],
                        ['vouchers','Voucher Lazada'],
                        ['customers','Customer Lazada'],
                        ['analytics','Analytics Lazada'],
                        ['settings','Pengaturan API Lazada'],
                    ] as [$slug,$label])
                    <a href="/marketplace/lazada/{{ $slug }}"
                        class="mp-item {{ request()->is('marketplace/lazada/'.$slug) ? 'active' : '' }}">
                        <span class="mp-dot"></span>
                        <span>{{ $label }}</span>
                    </a>
                    @endforeach
                </div>
            </div>

            {{-- ===== INTEGRASI ===== --}}
            @php $integrasiActive = request()->is('marketplace/integrasi*'); @endphp
            <div x-data="{ open: {{ $integrasiActive ? 'true' : 'false' }} }">
                <button @click="open=!open" class="mp-group-header w-full {{ $integrasiActive ? 'platform-active' : '' }}">
                    <div class="flex items-center gap-2">
                        <span>🔗</span>
                        <span>Marketplace Integrasi</span>
                    </div>
                    <svg class="w-3 h-3 mp-chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
                <div class="mp-group-items pl-1 space-y-0.5 mt-0.5" :class="open ? 'open' : 'closed'">
                    @foreach([
                        ['connections','Koneksi Marketplace'],
                        ['sync','Sinkronisasi Marketplace'],
                        ['status','Status API Marketplace'],
                        ['mapping','Mapping Produk Marketplace'],
                        ['stock-sync','Sinkronisasi Stok'],
                        ['order-sync','Sinkronisasi Pesanan'],
                        ['webhook','Webhook Marketplace'],
                        ['config','Pengaturan Marketplace'],
                    ] as [$slug,$label])
                    <a href="/marketplace/integrasi/{{ $slug }}"
                        class="mp-item {{ request()->is('marketplace/integrasi/'.$slug) ? 'active' : '' }}">
                        <span class="mp-dot"></span>
                        <span>{{ $label }}</span>
                    </a>
                    @endforeach
                </div>
            </div>

            <div class="h-4"></div>
        </nav>

        {{-- Bottom: user info --}}
        <div class="px-3 py-3 flex-shrink-0" style="border-top:1px solid rgba(255,255,255,0.08)">
            <div class="flex items-center gap-2 px-3 py-2 rounded-xl" style="background:rgba(255,255,255,0.05)">
                <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs"
                    style="background:linear-gradient(135deg,#ea580c,#f97316)">
                    {{ strtoupper(substr(session('marketplace_name', 'M'), 0, 1)) }}
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-xs font-semibold text-slate-300 truncate">{{ session('marketplace_name', 'Marketplace') }}</p>
                    <p class="text-xs text-slate-600 capitalize">{{ str_replace('_', ' ', session('marketplace_role', 'admin')) }}</p>
                </div>
                <a href="{{ route('marketplace.logout') }}"
                    title="Logout"
                    class="text-slate-600 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/10">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                </a>
            </div>

            @if(session('marketplace_role') === 'super_admin')
            <a href="/" class="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <span>Kembali ke ERP</span>
            </a>
            @endif
        </div>
    </aside>

    {{-- ===== MAIN CONTENT ===== --}}
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">

        {{-- Header --}}
        <header class="bg-white border-b border-gray-100 px-4 lg:px-6 py-3 flex items-center gap-3 flex-shrink-0 shadow-sm">
            {{-- Mobile menu button --}}
            <button class="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors" @click="sidebarOpen=true">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
            </button>

            {{-- Breadcrumb / Title --}}
            <div class="flex items-center gap-2 flex-1 min-w-0">
                <div class="hidden sm:flex items-center gap-1.5 text-sm text-gray-400">
                    <span class="text-orange-500 font-semibold">Marketplace</span>
                    @hasSection('breadcrumb')
                    <span>/</span>
                    <span class="text-gray-700 font-medium truncate">@yield('breadcrumb')</span>
                    @endif
                </div>
                <div class="sm:hidden font-semibold text-gray-900 text-sm truncate">@yield('title', 'Marketplace')</div>
            </div>

            {{-- Right: badge + user --}}
            <div class="flex items-center gap-3">
                <span class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-100">
                    <span class="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                    Marketplace
                </span>
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style="background:linear-gradient(135deg,#ea580c,#f97316)">
                    {{ strtoupper(substr(session('marketplace_name', 'M'), 0, 1)) }}
                </div>
            </div>
        </header>

        {{-- Page Content --}}
        <main class="flex-1 mp-content">
            @yield('content')
        </main>
    </div>
</div>

<script>
function marketplaceLayout() {
    return {
        sidebarOpen: false,
        init() {
            window.addEventListener('resize', () => {
                if (window.innerWidth >= 1024) this.sidebarOpen = false;
            });
        }
    }
}
</script>
@stack('scripts')
</body>
</html>
