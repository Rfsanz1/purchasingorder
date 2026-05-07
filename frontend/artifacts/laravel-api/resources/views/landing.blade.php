@extends('layouts.app')
@section('title', 'Purchase Order')

@section('content')
<div x-data="landingApp()" x-init="init()">

    {{-- Header --}}
    <div class="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white px-6 pt-10 pb-16 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full opacity-20 -translate-y-20 translate-x-20"></div>
        <div class="absolute bottom-0 right-12 w-32 h-32 bg-blue-500 rounded-full opacity-20 translate-y-10"></div>
        <div class="relative z-10 max-w-md mx-auto">
            <p class="text-blue-200 text-sm mb-1">Selamat Datang 👋</p>
            <h1 class="text-3xl font-bold">Purchase Order</h1>
            <div class="grid grid-cols-3 gap-4 mt-6">
                <div class="text-center">
                    <p class="text-2xl font-bold" x-text="stats.total ?? '—'"></p>
                    <p class="text-blue-200 text-xs mt-1">Total PO</p>
                </div>
                <div class="text-center border-l border-r border-blue-600">
                    <p class="text-2xl font-bold" x-text="stats.pending ?? '—'"></p>
                    <p class="text-blue-200 text-xs mt-1">Tertunda</p>
                </div>
                <div class="text-center">
                    <p class="text-2xl font-bold" x-text="stats.delivered ?? '—'"></p>
                    <p class="text-blue-200 text-xs mt-1">Terkirim</p>
                </div>
            </div>
        </div>
    </div>

    {{-- Quick actions --}}
    <div class="max-w-md mx-auto px-4 -mt-6 relative z-10">
        <div class="bg-white rounded-2xl shadow-lg p-4 flex justify-around">
            <a href="/po-form" class="flex flex-col items-center gap-1 text-gray-700 hover:text-blue-600">
                <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                </div>
                <span class="text-xs font-medium">Buat PO</span>
            </a>
            <button @click="goAdmin()" class="flex flex-col items-center gap-1 text-gray-700 hover:text-blue-600">
                <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </div>
                <span class="text-xs font-medium">Lihat</span>
            </button>
            <button @click="goAdmin()" class="flex flex-col items-center gap-1 text-gray-700 hover:text-blue-600">
                <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <span class="text-xs font-medium">Kelola</span>
            </button>
        </div>
    </div>

    {{-- Role cards --}}
    <div class="max-w-md mx-auto px-4 mt-6 pb-10">
        <div class="flex items-center justify-between mb-3">
            <h2 class="font-semibold text-gray-800">Pilih Akses</h2>
            <span class="text-xs text-blue-600 font-medium">4 Menu</span>
        </div>
        <div class="grid grid-cols-2 gap-3">
            <a href="/po-form" class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center gap-3">
                <div class="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <span class="text-3xl">🛒</span>
                </div>
                <div class="text-center">
                    <p class="font-semibold text-gray-800 text-sm">Buat Order</p>
                    <p class="text-gray-500 text-xs mt-0.5">Form pemesanan produk</p>
                </div>
            </a>

            <button @click="openLoginModal('admin')" class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center gap-3 w-full">
                <div class="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center">
                    <span class="text-3xl">📊</span>
                </div>
                <div class="text-center">
                    <p class="font-semibold text-gray-800 text-sm">Super Admin</p>
                    <p class="text-gray-500 text-xs mt-0.5">Semua pesanan & pengiriman</p>
                </div>
            </button>

            <button @click="openLoginModal('sales')" class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center gap-3 w-full">
                <div class="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
                    <span class="text-3xl">👨‍💼</span>
                </div>
                <div class="text-center">
                    <p class="font-semibold text-gray-800 text-sm">Sales</p>
                    <p class="text-gray-500 text-xs mt-0.5">Pesanan sales saya</p>
                </div>
            </button>

            <button @click="openLoginModal('driver')" class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center gap-3 w-full">
                <div class="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center">
                    <span class="text-3xl">🚚</span>
                </div>
                <div class="text-center">
                    <p class="font-semibold text-gray-800 text-sm">Driver</p>
                    <p class="text-gray-500 text-xs mt-0.5">Kelola pengiriman</p>
                </div>
            </button>
        </div>
    </div>

    {{-- Login Modal --}}
    <div x-show="showModal" x-cloak class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" @click.stop>
            <h3 class="text-lg font-bold text-gray-900 mb-1" x-text="modalTitle"></h3>
            <p class="text-sm text-gray-500 mb-5" x-text="modalSubtitle"></p>

            {{-- Driver: username picker --}}
            <div x-show="loginRole === 'driver'" class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Pilih Username</label>
                <select x-model="driverUsername" class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">-- Pilih Driver --</option>
                    <option value="yanto">yanto</option>
                    <option value="wawan">wawan</option>
                    <option value="chaidar">chaidar</option>
                </select>
            </div>

            {{-- Admin: password only --}}
            <div x-show="loginRole === 'admin'" class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Password Admin</label>
                <input type="password" x-model="password" @keydown.enter="doLogin()"
                    class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukkan password">
            </div>

            {{-- Sales: username + password --}}
            <div x-show="loginRole === 'sales'" class="space-y-3 mb-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Username Sales</label>
                    <select x-model="salesUsername" class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">-- Pilih Sales --</option>
                        <option>lehan</option><option>wiwid</option><option>priyanto</option>
                        <option>agus</option><option>agung</option><option>andre</option>
                        <option>imam</option><option>dhani</option><option>rio brandon</option>
                        <option>ivan</option><option>dias</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" x-model="password" @keydown.enter="doLogin()"
                        class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukkan password">
                </div>
            </div>

            <div x-show="errorMsg" class="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4" x-text="errorMsg"></div>

            <div class="flex gap-3">
                <button @click="showModal = false" class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">Batal</button>
                <button @click="doLogin()" :disabled="loading"
                    class="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                    <span x-show="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span x-text="loading ? 'Masuk...' : 'Masuk'"></span>
                </button>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
function landingApp() {
    return {
        showModal: false,
        loginRole: '',
        modalTitle: '',
        modalSubtitle: '',
        password: '',
        driverUsername: '',
        salesUsername: '',
        errorMsg: '',
        loading: false,
        stats: {},

        init() {
            this.loadStats();
        },

        async loadStats() {
            try {
                const res = await fetch('/api/orders');
                const data = await res.json();
                const total = data.length;
                const pending = data.filter(o => o.statusPengiriman === 'Menunggu' || o.statusPengiriman === 'Diproses').length;
                const delivered = data.filter(o => o.statusPengiriman === 'Selesai').length;
                this.stats = { total, pending, delivered };
            } catch(e) {
                this.stats = {};
            }
        },

        openLoginModal(role) {
            this.loginRole = role;
            this.password = '';
            this.driverUsername = '';
            this.salesUsername = '';
            this.errorMsg = '';
            this.loading = false;
            if (role === 'admin') {
                this.modalTitle = 'Login Super Admin';
                this.modalSubtitle = 'Masukkan password untuk mengakses dashboard admin';
            } else if (role === 'sales') {
                this.modalTitle = 'Login Sales';
                this.modalSubtitle = 'Pilih username dan masukkan password Anda';
            } else {
                this.modalTitle = 'Login Driver';
                this.modalSubtitle = 'Pilih username driver Anda';
            }
            this.showModal = true;
        },

        goAdmin() {
            this.openLoginModal('admin');
        },

        async doLogin() {
            this.errorMsg = '';
            this.loading = true;
            try {
                const body = { role: this.loginRole };
                if (this.loginRole === 'admin') body.password = this.password;
                if (this.loginRole === 'driver') body.username = this.driverUsername;
                if (this.loginRole === 'sales') {
                    body.username = this.salesUsername;
                    body.password = this.password;
                }

                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                const data = await res.json();

                if (data.ok) {
                    sessionStorage.setItem('role', data.role);
                    sessionStorage.setItem('loginAt', Date.now().toString());
                    if (data.username) sessionStorage.setItem('username', data.username);

                    if (data.role === 'driver') {
                        window.location.href = '/driver';
                    } else {
                        const params = new URLSearchParams();
                        if (data.role === 'sales') params.set('sales', data.username);
                        window.location.href = '/admin?' + params.toString();
                    }
                } else {
                    this.errorMsg = data.error || 'Login gagal';
                }
            } catch(e) {
                this.errorMsg = 'Koneksi gagal. Coba lagi.';
            } finally {
                this.loading = false;
            }
        }
    }
}
</script>
@endpush
@endsection
