<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Shopee Admin') · Gentong Mas</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/collapse@3.x.x/dist/cdn.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        [x-cloak] { display: none !important; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        .sh-sidebar-item {
            display: flex; align-items: center; gap: 10px;
            padding: 7px 10px; border-radius: 10px;
            font-size: 0.8rem; font-weight: 500;
            transition: all 0.15s; cursor: pointer; user-select: none; text-decoration: none;
        }
        .sh-sidebar-item.active { background: #ea580c; color: #fff; box-shadow: 0 1px 4px rgba(234,88,12,.25); }
        .sh-sidebar-item.normal { color: #4b5563; }
        .sh-sidebar-item.normal:hover { background: #fff7ed; color: #ea580c; }

        .sh-group-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 7px 10px; border-radius: 10px; cursor: pointer;
            font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
            letter-spacing: 0.06em; color: #6b7280;
            transition: background 0.15s, color 0.15s; user-select: none;
        }
        .sh-group-header:hover { background: #fff7ed; color: #ea580c; }
        .sh-group-header.has-active { color: #ea580c; }

        .chevron { transition: transform 0.2s ease; }
        .chevron.open { transform: rotate(90deg); }

        .sh-group-items {
            overflow: hidden;
            transition: max-height 0.25s ease, opacity 0.2s ease;
        }
        .sh-group-items.open { max-height: 600px; opacity: 1; }
        .sh-group-items.closed { max-height: 0; opacity: 0; }

        .sh-badge {
            font-size: 0.6rem; padding: 1px 6px; border-radius: 999px;
            background: #ffedd5; color: #c2410c; font-weight: 600;
        }
    </style>
    @stack('head')
</head>
<body class="bg-gray-50 min-h-screen" x-data="shopeeLayout()" x-init="init()">

    {{-- Mobile overlay --}}
    <div x-show="sidebarOpen" x-cloak class="fixed inset-0 z-30 bg-black/40 lg:hidden" @click="sidebarOpen=false"></div>

    <div class="flex min-h-screen">

        {{-- ===== SHOPEE SIDEBAR ===== --}}
        <aside
            :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
            class="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-orange-100 shadow-xl flex flex-col transition-transform duration-200 lg:relative lg:translate-x-0 lg:shadow-none lg:z-auto">

            {{-- Logo --}}
            <div class="px-4 py-4 border-b border-orange-100">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 6H5C3.9 6 3 6.9 3 8v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7 3c1.9 0 3.5 1.3 3.9 3H8.1C8.5 10.3 10.1 9 12 9zm5 9H7v-1.5c0-1.4 2.7-2.5 5-2.5s5 1.1 5 2.5V18z"/>
                        </svg>
                    </div>
                    <div>
                        <p class="font-bold text-gray-900 text-sm leading-tight">Shopee Admin</p>
                        <p class="text-xs text-orange-400">Manajemen Stok</p>
                    </div>
                </div>
            </div>

            {{-- Search --}}
            <div class="px-3 py-2 border-b border-orange-50">
                <div class="relative">
                    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <input
                        type="text"
                        x-model="search"
                        placeholder="Cari menu..."
                        class="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                </div>
            </div>

            {{-- Nav --}}
            <nav class="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 scrollbar-hide">

                {{-- Dashboard link --}}
                <a href="/shopee/dashboard" class="sh-sidebar-item {{ request()->is('shopee/dashboard') && !request()->query('manager') ? 'active' : 'normal' }}">
                    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                    <span>Dashboard</span>
                </a>

                <div class="h-1"></div>

                {{-- Dynamic manager groups --}}
                @php $managers = config('shopee.managers'); @endphp
                @foreach($managers as $managerKey => $manager)
                    @php
                        $isActive = request()->query('manager') === $managerKey;
                        $methodsFiltered = collect($manager['methods']);
                    @endphp
                    <div x-data="{ open: {{ $isActive ? 'true' : 'false' }}, search: $store.shopeeSearch }"
                         x-show="!$store.shopeeSearch || Object.values({{ json_encode($manager['methods']) }}).some(m => m.toLowerCase().includes($store.shopeeSearch.toLowerCase())) || '{{ strtolower($manager['label']) }}'.includes($store.shopeeSearch.toLowerCase())">
                        <button @click="open=!open" class="sh-group-header w-full {{ $isActive ? 'has-active' : '' }}">
                            <div class="flex items-center gap-2 min-w-0">
                                <span class="truncate">{{ $manager['label'] }}</span>
                                <span class="sh-badge shrink-0">{{ count($manager['methods']) }}</span>
                            </div>
                            <svg class="w-3.5 h-3.5 shrink-0 chevron" :class="open ? 'open' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                        <div class="sh-group-items pl-1 space-y-0.5 mt-0.5" :class="open || $store.shopeeSearch ? 'open' : 'closed'">
                            @foreach($manager['methods'] as $methodKey => $methodLabel)
                                @php $isMethodActive = $isActive && request()->query('method') === $methodKey; @endphp
                                <a href="/shopee/dashboard?manager={{ $managerKey }}&method={{ $methodKey }}"
                                   x-show="!$store.shopeeSearch || '{{ strtolower($methodLabel) }}'.includes($store.shopeeSearch.toLowerCase()) || '{{ strtolower($manager['label']) }}'.includes($store.shopeeSearch.toLowerCase())"
                                   class="sh-sidebar-item {{ $isMethodActive ? 'active' : 'normal' }}">
                                    <svg class="w-3.5 h-3.5 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                    <span>{{ $methodLabel }}</span>
                                </a>
                            @endforeach
                        </div>
                    </div>
                @endforeach

                <div class="h-4"></div>
            </nav>

            {{-- Bottom user info --}}
            <div class="px-3 py-3 border-t border-orange-100">
                <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-50">
                    <div class="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                        <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="text-xs font-semibold text-gray-700 truncate">{{ session('shopee_user', 'Admin') }}</p>
                        <p class="text-xs text-orange-400">Shopee Admin</p>
                    </div>
                    <a href="/shopee/logout" title="Logout"
                       class="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                    </a>
                </div>
            </div>
        </aside>

        {{-- ===== MAIN CONTENT ===== --}}
        <div class="flex-1 flex flex-col min-w-0">

            {{-- Top bar --}}
            <div class="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-20">
                <button @click="sidebarOpen=!sidebarOpen" class="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>

                {{-- Breadcrumb --}}
                <div class="flex items-center gap-1.5 text-sm min-w-0 flex-1">
                    <a href="/" class="text-gray-400 hover:text-gray-600 shrink-0">ERP</a>
                    <svg class="w-3.5 h-3.5 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                    <a href="/shopee/dashboard" class="text-orange-500 font-medium shrink-0">Shopee Admin</a>
                    @yield('breadcrumb')
                </div>

                {{-- Right actions --}}
                <div class="flex items-center gap-2 shrink-0">
                    <a href="/" class="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                        ERP Utama
                    </a>
                    <a href="/shopee/logout" class="text-xs text-red-500 hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-lg transition-colors">Logout</a>
                </div>
            </div>

            {{-- Page content --}}
            <main class="flex-1">
                @yield('content')
            </main>
        </div>
    </div>

    @stack('scripts')
    <script>
    document.addEventListener('alpine:init', () => {
        Alpine.store('shopeeSearch', '');
    });

    function shopeeLayout() {
        return {
            sidebarOpen: false,
            search: '',
            init() {},
            get searchVal() { return this.search; }
        }
    }
    </script>
    <script>
    document.addEventListener('alpine:init', () => {});
    // Sync search input to alpine store
    document.addEventListener('DOMContentLoaded', () => {
        const input = document.querySelector('input[x-model="search"]');
        if (input) {
            input.addEventListener('input', e => {
                if (window.Alpine && Alpine.store) {
                    Alpine.store('shopeeSearch', e.target.value.toLowerCase());
                }
            });
        }
    });
    </script>
</body>
</html>
