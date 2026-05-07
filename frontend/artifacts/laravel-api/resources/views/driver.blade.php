@extends('layouts.app')
@section('title', 'Driver Dashboard')

@section('content')
<div x-data="driverApp()" x-init="init()" class="min-h-screen bg-gray-50">

    {{-- Login Page --}}
    <div x-show="!loggedIn" class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-amber-100">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div class="text-center mb-6">
                <div class="text-5xl mb-3">🚚</div>
                <h1 class="text-2xl font-bold text-gray-800">Driver Login</h1>
                <p class="text-gray-500 text-sm mt-1">Pilih nama driver Anda</p>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Username Driver</label>
                <select x-model="loginUsername" class="w-full border border-gray-300 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="">-- Pilih Driver --</option>
                    <option value="yanto">yanto</option>
                    <option value="wawan">wawan</option>
                    <option value="chaidar">chaidar</option>
                </select>
            </div>
            <div x-show="loginError" class="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4" x-text="loginError"></div>
            <button @click="doLogin()" :disabled="loginLoading || !loginUsername"
                class="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2">
                <span x-show="loginLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Masuk sebagai Driver
            </button>
        </div>
    </div>

    {{-- Dashboard --}}
    <div x-show="loggedIn" x-cloak>
        {{-- Header --}}
        <div class="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 pt-8 pb-6">
            <div class="max-w-md mx-auto">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-orange-100 text-sm">Selamat datang</p>
                        <h1 class="text-xl font-bold capitalize" x-text="username"></h1>
                    </div>
                    <button @click="logout()" class="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded-lg">Keluar</button>
                </div>
            </div>
        </div>

        {{-- Tabs --}}
        <div class="max-w-md mx-auto px-4">
            <div class="flex bg-white rounded-xl shadow-sm mt-4 p-1 gap-1">
                <button @click="activeTab='aktif'" :class="activeTab==='aktif' ? 'bg-orange-500 text-white' : 'text-gray-600'" class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors">
                    Aktif (<span x-text="aktifOrders.length"></span>)
                </button>
                <button @click="activeTab='selesai'" :class="activeTab==='selesai' ? 'bg-orange-500 text-white' : 'text-gray-600'" class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors">
                    Selesai (<span x-text="selesaiOrders.length"></span>)
                </button>
            </div>
        </div>

        {{-- Refresh --}}
        <div class="max-w-md mx-auto px-4 mt-3 flex justify-between items-center">
            <p class="text-sm text-gray-500">Daftar pengiriman</p>
            <button @click="fetchOrders()" :disabled="loading" class="text-orange-500 text-sm font-medium flex items-center gap-1">
                <svg class="w-4 h-4" :class="loading ? 'animate-spin' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Refresh
            </button>
        </div>

        {{-- Orders --}}
        <div class="max-w-md mx-auto px-4 mt-3 pb-8 space-y-4">
            <template x-if="loading">
                <div class="bg-white rounded-2xl p-8 text-center shadow-sm">
                    <div class="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p class="text-gray-500 text-sm">Memuat pesanan...</p>
                </div>
            </template>

            <template x-if="!loading && currentOrders.length === 0">
                <div class="bg-white rounded-2xl p-8 text-center shadow-sm">
                    <div class="text-4xl mb-3">📦</div>
                    <p class="text-gray-500 text-sm">Tidak ada pesanan</p>
                </div>
            </template>

            <template x-for="order in currentOrders" :key="order.id">
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {{-- Status bar --}}
                    <div class="px-4 pt-4 pb-3">
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-xs font-mono text-gray-400" x-text="'#' + order.orderId"></span>
                            <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                                :class="{
                                    'bg-yellow-100 text-yellow-700': order.statusPengiriman === 'Menunggu',
                                    'bg-blue-100 text-blue-700': order.statusPengiriman === 'Diproses',
                                    'bg-purple-100 text-purple-700': order.statusPengiriman === 'Dikirim',
                                    'bg-green-100 text-green-700': order.statusPengiriman === 'Selesai',
                                    'bg-red-100 text-red-700': order.statusPengiriman === 'Dibatalkan',
                                }"
                                x-text="order.statusPengiriman">
                            </span>
                        </div>

                        {{-- Progress steps --}}
                        <div class="flex items-center mb-4">
                            <template x-for="(step, idx) in ['Menunggu','Diproses','Dikirim','Selesai']" :key="step">
                                <template x-if="order.statusPengiriman !== 'Dibatalkan'">
                                    <div class="flex items-center flex-1">
                                        <div class="flex flex-col items-center">
                                            <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                                :class="stepDone(order.statusPengiriman, step) ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'">
                                                <span x-show="stepDone(order.statusPengiriman, step)">✓</span>
                                                <span x-show="!stepDone(order.statusPengiriman, step)" x-text="idx+1"></span>
                                            </div>
                                            <p class="text-xs mt-1 text-center leading-tight" :class="stepDone(order.statusPengiriman, step) ? 'text-orange-600' : 'text-gray-400'" x-text="step"></p>
                                        </div>
                                        <template x-if="idx < 3">
                                            <div class="flex-1 h-0.5 mx-1 mb-4" :class="stepDone(order.statusPengiriman, ['Diproses','Dikirim','Selesai',''][idx]) ? 'bg-orange-400' : 'bg-gray-200'"></div>
                                        </template>
                                    </div>
                                </template>
                            </template>
                        </div>

                        {{-- Customer info --}}
                        <h3 class="font-semibold text-gray-800" x-text="order.namaKontak"></h3>
                        <a :href="`https://wa.me/${order.nomorTelepon?.replace(/\D/g,'')}`" target="_blank"
                            class="text-sm text-blue-600 flex items-center gap-1 mt-0.5">
                            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                            <span x-text="order.nomorTelepon"></span>
                        </a>
                        <p class="text-sm text-gray-600 mt-1" x-text="order.alamat"></p>
                        <p x-show="order.patokanLokasi" class="text-xs text-gray-400 mt-0.5" x-text="'Patokan: ' + order.patokanLokasi"></p>

                        {{-- Product --}}
                        <div class="mt-3 bg-gray-50 rounded-xl px-3 py-2">
                            <p class="text-sm text-gray-600" x-text="order.namaProduk"></p>
                            <p class="text-xs text-gray-400 mt-0.5" x-text="order.jumlahProduk + ' unit • Rp ' + formatRupiah(order.totalHarga)"></p>
                        </div>
                    </div>

                    {{-- Actions --}}
                    <div x-show="order.statusPengiriman !== 'Selesai' && order.statusPengiriman !== 'Dibatalkan'" class="px-4 pb-4 flex gap-2">
                        <button @click="updateStatus(order)" :disabled="order._loading"
                            class="flex-1 bg-orange-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2">
                            <span x-show="order._loading" class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span x-text="nextStatusLabel(order.statusPengiriman)"></span>
                        </button>
                        <label class="cursor-pointer bg-gray-100 text-gray-700 py-2.5 px-3 rounded-xl text-sm font-medium hover:bg-gray-200 flex items-center gap-1">
                            <input type="file" accept="image/*" capture="environment" class="hidden" @change="uploadPhoto($event, order)">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            Foto
                        </label>
                    </div>

                    <div x-show="order._msg" class="px-4 pb-3 text-xs text-green-600 font-medium" x-text="order._msg"></div>
                </div>
            </template>
        </div>
    </div>
</div>

@push('scripts')
<script>
function driverApp() {
    return {
        loggedIn: false,
        loginUsername: '',
        loginError: '',
        loginLoading: false,
        username: '',
        activeTab: 'aktif',
        orders: [],
        loading: false,

        get aktifOrders() {
            return this.orders.filter(o => o.driverName?.toLowerCase() === this.username.toLowerCase() &&
                ['Menunggu','Diproses','Dikirim'].includes(o.statusPengiriman));
        },
        get selesaiOrders() {
            return this.orders.filter(o => o.driverName?.toLowerCase() === this.username.toLowerCase() &&
                ['Selesai','Dibatalkan'].includes(o.statusPengiriman));
        },
        get currentOrders() {
            return this.activeTab === 'aktif' ? this.aktifOrders : this.selesaiOrders;
        },

        init() {
            const savedUser = sessionStorage.getItem('driverUsername');
            const loginAt = parseInt(sessionStorage.getItem('driverLoginAt') || '0');
            const eightHours = 8 * 60 * 60 * 1000;
            if (savedUser && (Date.now() - loginAt) < eightHours) {
                this.username = savedUser;
                this.loggedIn = true;
                this.fetchOrders();
            }
        },

        async doLogin() {
            if (!this.loginUsername) return;
            this.loginError = '';
            this.loginLoading = true;
            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ role: 'driver', username: this.loginUsername }),
                });
                const data = await res.json();
                if (data.ok) {
                    this.username = this.loginUsername;
                    sessionStorage.setItem('driverUsername', this.username);
                    sessionStorage.setItem('driverLoginAt', Date.now().toString());
                    this.loggedIn = true;
                    this.fetchOrders();
                } else {
                    this.loginError = data.error || 'Login gagal';
                }
            } catch(e) {
                this.loginError = 'Koneksi gagal';
            } finally {
                this.loginLoading = false;
            }
        },

        logout() {
            sessionStorage.removeItem('driverUsername');
            sessionStorage.removeItem('driverLoginAt');
            this.loggedIn = false;
            this.username = '';
            this.orders = [];
        },

        async fetchOrders() {
            this.loading = true;
            try {
                const res = await fetch('/api/orders');
                const data = await res.json();
                this.orders = data.map(o => ({ ...o, _loading: false, _msg: '' }));
            } catch(e) {}
            finally { this.loading = false; }
        },

        stepDone(current, step) {
            const order = ['Menunggu','Diproses','Dikirim','Selesai'];
            return order.indexOf(current) >= order.indexOf(step);
        },

        nextStatusLabel(status) {
            const map = { 'Menunggu': '✓ Diproses', 'Diproses': '🚚 Dikirim', 'Dikirim': '✅ Selesai' };
            return map[status] || status;
        },

        nextStatus(status) {
            const map = { 'Menunggu': 'Diproses', 'Diproses': 'Dikirim', 'Dikirim': 'Selesai' };
            return map[status];
        },

        async updateStatus(order) {
            const next = this.nextStatus(order.statusPengiriman);
            if (!next) return;
            order._loading = true;
            try {
                const res = await fetch(`/api/orders/${order.id}/pengiriman`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ statusPengiriman: next, driverName: this.username }),
                });
                if (res.ok) {
                    order.statusPengiriman = next;
                    order.driverName = this.username;
                }
            } catch(e) {}
            finally { order._loading = false; }
        },

        async uploadPhoto(event, order) {
            const file = event.target.files[0];
            if (!file) return;
            order._msg = 'Mengunggah foto...';
            try {
                const base64 = await this.fileToBase64(file);
                const res = await fetch(`/api/orders/${order.id}/foto`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ photoBase64: base64, driverName: this.username }),
                });
                if (res.ok) {
                    order._msg = 'Foto terkirim ke grup WA ✅';
                    setTimeout(() => order._msg = '', 4000);
                } else {
                    order._msg = 'Gagal mengirim foto';
                    setTimeout(() => order._msg = '', 3000);
                }
            } catch(e) {
                order._msg = 'Gagal mengirim foto';
                setTimeout(() => order._msg = '', 3000);
            }
            event.target.value = '';
        },

        fileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        },

        formatRupiah(n) {
            return Number(n || 0).toLocaleString('id-ID');
        }
    }
}
</script>
@endpush
@endsection
