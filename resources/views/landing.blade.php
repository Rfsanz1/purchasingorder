@extends('layouts.erp')
@section('title', 'Dashboard')

@section('content')
<div x-data="landingApp()" x-init="init()" class="p-4 md:p-6 max-w-5xl mx-auto">

    {{-- Page header --}}
    <div class="mb-6">
        <h1 class="text-xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-sm text-gray-400 mt-0.5">Selamat datang di ERP Gentong Mas</p>
    </div>

    {{-- Stats --}}
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div class="flex items-center gap-2 mb-2">
                <div class="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                </div>
            </div>
            <p class="text-2xl font-bold text-gray-900" x-text="stats.total ?? '—'"></p>
            <p class="text-xs text-gray-400 mt-0.5">Total PO</p>
        </div>
        <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div class="flex items-center gap-2 mb-2">
                <div class="w-8 h-8 bg-yellow-50 rounded-xl flex items-center justify-center">
                    <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
            </div>
            <p class="text-2xl font-bold text-yellow-600" x-text="stats.pending ?? '—'"></p>
            <p class="text-xs text-gray-400 mt-0.5">Tertunda</p>
        </div>
        <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div class="flex items-center gap-2 mb-2">
                <div class="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
            </div>
            <p class="text-2xl font-bold text-green-600" x-text="stats.delivered ?? '—'"></p>
            <p class="text-xs text-gray-400 mt-0.5">Terkirim</p>
        </div>
        <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div class="flex items-center gap-2 mb-2">
                <div class="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center">
                    <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                </div>
            </div>
            <p class="text-sm font-bold text-purple-700" x-text="'Rp ' + formatRupiah(stats.revenue)"></p>
            <p class="text-xs text-gray-400 mt-0.5">Total Nilai</p>
        </div>
    </div>

    {{-- Quick access --}}
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <a href="/po-form" class="bg-blue-600 text-white rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
            <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            </div>
            <span class="text-sm font-semibold">Buat Order</span>
        </a>
        <a href="/sales-dashboard" class="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <span class="text-sm font-semibold text-gray-700">Riwayat Sales</span>
        </a>
        <a href="/admin" class="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div class="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
            </div>
            <span class="text-sm font-semibold text-gray-700">Pengiriman</span>
        </a>
        <a href="/driver" class="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div class="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <span class="text-sm font-semibold text-gray-700">Driver</span>
        </a>
    </div>

    {{-- Recent orders + Coming Soon modules --}}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {{-- Recent orders --}}
        <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 class="font-semibold text-gray-800">Pesanan Terbaru</h2>
                <a href="/erp/invoice" class="text-xs text-blue-600 hover:text-blue-800 font-medium">Lihat Semua →</a>
            </div>
            <div x-show="loading" class="p-8 text-center">
                <div class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <div x-show="!loading" class="divide-y divide-gray-50">
                <template x-if="recentOrders.length === 0">
                    <div class="p-8 text-center text-gray-400 text-sm">Belum ada pesanan</div>
                </template>
                <template x-for="o in recentOrders" :key="o.orderId">
                    <div class="px-5 py-3 flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            :class="o.statusPengiriman==='Selesai' ? 'bg-green-50' : o.statusPengiriman==='Dikirim' ? 'bg-purple-50' : 'bg-yellow-50'">
                            <svg class="w-4 h-4" :class="o.statusPengiriman==='Selesai' ? 'text-green-600' : o.statusPengiriman==='Dikirim' ? 'text-purple-600' : 'text-yellow-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-800 truncate" x-text="o.namaKontak || '-'"></p>
                            <p class="text-xs text-gray-400 truncate" x-text="(Array.isArray(o.namaProduk) ? o.namaProduk.join(', ') : o.namaProduk) || '-'"></p>
                        </div>
                        <div class="text-right shrink-0">
                            <p class="text-sm font-semibold text-gray-800" x-text="'Rp ' + formatRupiah(o.totalHarga)"></p>
                            <span class="text-xs px-1.5 py-0.5 rounded-full font-medium"
                                :class="{
                                    'bg-yellow-100 text-yellow-700': !o.statusPengiriman || o.statusPengiriman==='Menunggu',
                                    'bg-blue-100 text-blue-700': o.statusPengiriman==='Diproses',
                                    'bg-purple-100 text-purple-700': o.statusPengiriman==='Dikirim',
                                    'bg-green-100 text-green-700': o.statusPengiriman==='Selesai',
                                }"
                                x-text="o.statusPengiriman || 'Menunggu'">
                            </span>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        {{-- Coming soon modules --}}
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div class="px-5 py-4 border-b border-gray-100">
                <h2 class="font-semibold text-gray-800">Modul Mendatang</h2>
            </div>
            <div class="p-4 space-y-2">
                @foreach([
                    ['icon' => '🧠', 'name' => 'AI Analytics', 'desc' => 'Prediksi penjualan otomatis'],
                    ['icon' => '📦', 'name' => 'Stock Opname', 'desc' => 'Kelola stok gudang'],
                    ['icon' => '💳', 'name' => 'Payment Gateway', 'desc' => 'Midtrans / Stripe'],
                    ['icon' => '🏬', 'name' => 'Multi Cabang', 'desc' => 'Kelola beberapa toko'],
                    ['icon' => '📊', 'name' => 'Laporan Keuangan', 'desc' => 'Laba rugi & neraca'],
                    ['icon' => '🤖', 'name' => 'Chatbot AI', 'desc' => 'Customer service otomatis'],
                ] as $mod)
                <div class="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50 opacity-70">
                    <span class="text-lg">{{ $mod['icon'] }}</span>
                    <div class="flex-1 min-w-0">
                        <p class="text-xs font-semibold text-gray-600">{{ $mod['name'] }}</p>
                        <p class="text-xs text-gray-400">{{ $mod['desc'] }}</p>
                    </div>
                    <span class="text-xs bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full shrink-0">Soon</span>
                </div>
                @endforeach
            </div>
        </div>
    </div>

    {{-- Login Modal --}}
    <div x-show="showModal" x-cloak class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" @click.stop>
            <h3 class="text-lg font-bold text-gray-900 mb-1" x-text="modalTitle"></h3>
            <p class="text-sm text-gray-500 mb-5" x-text="modalSubtitle"></p>

            <div x-show="loginRole === 'driver'" class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Pilih Driver</label>
                <select x-model="driverUsername" class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">-- Pilih Driver --</option>
                    <option value="yanto">yanto</option>
                    <option value="wawan">wawan</option>
                    <option value="chaidar">chaidar</option>
                </select>
            </div>

            <div x-show="loginRole === 'admin'" class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Password Admin</label>
                <input type="password" x-model="password" @keydown.enter="doLogin()"
                    class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukkan password">
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
        errorMsg: '',
        loading: false,
        stats: {},
        recentOrders: [],
        loading: false,

        async init() {
            await this.loadStats();
        },

        async loadStats() {
            this.loading = true;
            try {
                const res = await fetch('/api/orders');
                const data = await res.json();
                const total = data.length;
                const pending = data.filter(o => o.statusPengiriman === 'Menunggu' || o.statusPengiriman === 'Diproses').length;
                const delivered = data.filter(o => o.statusPengiriman === 'Selesai').length;
                const revenue = data.reduce((s, o) => s + (Number(o.totalHarga) || 0), 0);
                this.stats = { total, pending, delivered, revenue };
                this.recentOrders = data.slice(0, 8);
            } catch(e) {
                this.stats = {};
            } finally {
                this.loading = false;
            }
        },

        openLoginModal(role) {
            this.loginRole = role;
            this.password = '';
            this.driverUsername = '';
            this.errorMsg = '';
            this.loading = false;
            if (role === 'admin') {
                this.modalTitle = 'Login Super Admin';
                this.modalSubtitle = 'Masukkan password untuk mengakses dashboard admin';
            } else {
                this.modalTitle = 'Login Driver';
                this.modalSubtitle = 'Pilih username driver Anda';
            }
            this.showModal = true;
        },

        async doLogin() {
            this.errorMsg = '';
            this.loading = true;
            try {
                const body = { role: this.loginRole };
                if (this.loginRole === 'admin') body.password = this.password;
                if (this.loginRole === 'driver') body.username = this.driverUsername;

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
                        window.location.href = '/admin';
                    }
                } else {
                    this.errorMsg = data.error || 'Login gagal';
                }
            } catch(e) {
                this.errorMsg = 'Koneksi gagal. Coba lagi.';
            } finally {
                this.loading = false;
            }
        },

        formatRupiah(n) { return Number(n||0).toLocaleString('id-ID'); }
    }
}
</script>
@endpush
@endsection
