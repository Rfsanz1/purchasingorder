@extends('layouts.erp')
@section('title', 'Dashboard Driver')

@section('content')
<div x-data="driverApp()" x-init="init()" class="min-h-screen bg-gray-50">

    {{-- Login Page --}}
    <div x-show="!loggedIn" class="min-h-screen flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm p-6">
            <div class="text-center mb-6">
                <div class="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <svg class="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1"/></svg>
                </div>
                <h1 class="text-xl font-bold text-gray-900">Driver Login</h1>
                <p class="text-gray-400 text-sm mt-1">Pilih nama driver Anda</p>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama Driver</label>
                <select x-model="loginUsername" class="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                    <option value="">-- Pilih Driver --</option>
                    <option value="yanto">Yanto</option>
                    <option value="wawan">Wawan</option>
                    <option value="chaidar">Chaidar</option>
                </select>
            </div>
            <div x-show="loginError" class="bg-red-50 text-red-600 text-sm rounded-xl px-3 py-2 mb-4" x-text="loginError"></div>
            <button @click="doLogin()" :disabled="loginLoading || !loginUsername"
                class="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                <span x-show="loginLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Masuk sebagai Driver
            </button>
        </div>
    </div>

    {{-- Dashboard --}}
    <div x-show="loggedIn" x-cloak>

        {{-- Header bar --}}
        <div class="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div>
                <p class="text-xs text-gray-400">Selamat datang,</p>
                <h1 class="text-base font-bold text-gray-900 capitalize" x-text="username"></h1>
            </div>
            <div class="flex items-center gap-3">
                <button @click="fetchOrders()" :disabled="loading"
                    class="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-medium transition-colors">
                    <svg class="w-3.5 h-3.5" :class="loading ? 'animate-spin' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                    Refresh
                </button>
                <button @click="logout()"
                    class="text-xs text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition-colors">
                    Keluar
                </button>
            </div>
        </div>

        {{-- Stats bar --}}
        <div class="px-4 pt-4 pb-2 grid grid-cols-3 gap-3 max-w-2xl mx-auto">
            <div class="bg-white rounded-xl border border-gray-100 p-3 text-center">
                <p class="text-xl font-bold text-gray-800" x-text="aktifOrders.length"></p>
                <p class="text-xs text-gray-400 mt-0.5">Aktif</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-100 p-3 text-center">
                <p class="text-xl font-bold text-orange-500" x-text="orders.filter(o=>o.driverName?.toLowerCase()===username.toLowerCase()&&o.statusPengiriman==='Dikirim').length"></p>
                <p class="text-xs text-gray-400 mt-0.5">Dikirim</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-100 p-3 text-center">
                <p class="text-xl font-bold text-green-600" x-text="selesaiOrders.length"></p>
                <p class="text-xs text-gray-400 mt-0.5">Selesai</p>
            </div>
        </div>

        {{-- Tabs --}}
        <div class="px-4 pt-2 pb-3 max-w-2xl mx-auto">
            <div class="flex bg-white rounded-xl border border-gray-100 p-1 gap-1">
                <button @click="activeTab='aktif'"
                    :class="activeTab==='aktif' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'"
                    class="flex-1 py-2 rounded-lg text-sm font-medium transition-all">
                    Aktif (<span x-text="aktifOrders.length"></span>)
                </button>
                <button @click="activeTab='selesai'"
                    :class="activeTab==='selesai' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'"
                    class="flex-1 py-2 rounded-lg text-sm font-medium transition-all">
                    Selesai (<span x-text="selesaiOrders.length"></span>)
                </button>
            </div>
        </div>

        {{-- Order list --}}
        <div class="px-4 pb-8 space-y-3 max-w-2xl mx-auto">

            {{-- Loading --}}
            <template x-if="loading">
                <div class="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                    <div class="w-7 h-7 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" style="border-width:3px"></div>
                    <p class="text-gray-400 text-sm">Memuat pesanan...</p>
                </div>
            </template>

            {{-- Empty --}}
            <template x-if="!loading && currentOrders.length === 0">
                <div class="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                    <svg class="w-10 h-10 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    <p class="text-gray-400 text-sm">Tidak ada pesanan</p>
                </div>
            </template>

            {{-- Cards dengan accordion --}}
            <template x-for="order in currentOrders" :key="order.id">
                <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden" x-data="{ expanded: false }">

                    {{-- Header kartu (selalu tampil) --}}
                    <div @click="expanded = !expanded" class="px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors select-none">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2 min-w-0">
                                {{-- Status badge --}}
                                <span class="shrink-0 text-xs px-2 py-0.5 rounded-full font-semibold"
                                    :class="{
                                        'bg-gray-100 text-gray-600': order.statusPengiriman === 'Menunggu',
                                        'bg-blue-100 text-blue-700': order.statusPengiriman === 'Diproses',
                                        'bg-orange-100 text-orange-700': order.statusPengiriman === 'Dikirim',
                                        'bg-green-100 text-green-700': order.statusPengiriman === 'Selesai',
                                        'bg-red-100 text-red-700': order.statusPengiriman === 'Dibatalkan',
                                    }"
                                    x-text="order.statusPengiriman || 'Menunggu'">
                                </span>
                                <span class="font-semibold text-gray-800 text-sm truncate" x-text="order.namaKontak"></span>
                            </div>
                            <div class="flex items-center gap-2 shrink-0 ml-2">
                                <span class="text-xs text-gray-400 font-mono" x-text="'#' + (order.orderId||'').slice(-6).toUpperCase()"></span>
                                <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="expanded ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                            </div>
                        </div>
                        {{-- Preview singkat --}}
                        <p class="text-xs text-gray-400 mt-1 truncate" x-text="order.alamat || '-'"></p>
                    </div>

                    {{-- Detail accordion (expand) --}}
                    <div x-show="expanded" x-collapse class="border-t border-gray-100">

                        {{-- Progress steps --}}
                        <div x-show="order.statusPengiriman !== 'Dibatalkan'" class="px-4 py-3 bg-gray-50">
                            <div class="flex items-center">
                                <template x-for="(step, idx) in ['Menunggu','Diproses','Dikirim','Selesai']" :key="step">
                                    <div class="flex items-center flex-1">
                                        <div class="flex flex-col items-center">
                                            <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                                                :class="stepDone(order.statusPengiriman, step) ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'">
                                                <template x-if="stepDone(order.statusPengiriman, step)">
                                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                                                </template>
                                                <span x-show="!stepDone(order.statusPengiriman, step)" x-text="idx+1"></span>
                                            </div>
                                            <p class="text-xs mt-1 text-center leading-tight w-12"
                                                :class="stepDone(order.statusPengiriman, step) ? 'text-orange-600 font-medium' : 'text-gray-400'"
                                                x-text="step"></p>
                                        </div>
                                        <template x-if="idx < 3">
                                            <div class="flex-1 h-0.5 mx-1 mb-4 rounded"
                                                :class="stepDone(order.statusPengiriman, ['Diproses','Dikirim','Selesai',''][idx]) ? 'bg-orange-400' : 'bg-gray-200'">
                                            </div>
                                        </template>
                                    </div>
                                </template>
                            </div>
                        </div>

                        {{-- Info detail --}}
                        <div class="px-4 py-3 space-y-2.5">

                            {{-- Customer --}}
                            <div class="flex items-start gap-2">
                                <svg class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                <div>
                                    <p class="text-sm font-semibold text-gray-800" x-text="order.namaKontak"></p>
                                    <a :href="`https://wa.me/${(order.nomorTelepon||'').replace(/\D/g,'')}`" target="_blank"
                                        class="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-0.5">
                                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                        <span x-text="order.nomorTelepon"></span>
                                    </a>
                                </div>
                            </div>

                            {{-- Alamat --}}
                            <div class="flex items-start gap-2">
                                <svg class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                <div>
                                    <p class="text-sm text-gray-700" x-text="order.alamat || '-'"></p>
                                    <p x-show="order.patokanLokasi" class="text-xs text-gray-400 mt-0.5" x-text="'Patokan: ' + order.patokanLokasi"></p>
                                </div>
                            </div>

                            {{-- Produk --}}
                            <div class="flex items-start gap-2">
                                <svg class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                                <div>
                                    <p class="text-sm text-gray-700" x-text="order.namaProduk"></p>
                                    <p class="text-xs text-gray-400 mt-0.5" x-text="(order.jumlahProduk||1) + ' unit • Rp ' + formatRupiah(order.totalHarga)"></p>
                                </div>
                            </div>
                        </div>

                        {{-- Action buttons --}}
                        <div x-show="order.statusPengiriman !== 'Selesai' && order.statusPengiriman !== 'Dibatalkan'"
                            class="px-4 pb-4 flex gap-2">
                            <button @click.stop="updateStatus(order)" :disabled="order._loading"
                                class="flex-1 bg-orange-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
                                <span x-show="order._loading" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                <span x-text="nextStatusLabel(order.statusPengiriman)"></span>
                            </button>
                            <label class="cursor-pointer bg-gray-100 text-gray-600 py-2.5 px-3.5 rounded-xl text-sm font-medium hover:bg-gray-200 flex items-center gap-1.5 transition-colors">
                                <input type="file" accept="image/*" capture="environment" class="hidden" @change="uploadPhoto($event, order)">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                Foto
                            </label>
                        </div>

                        {{-- Pesan sukses/error --}}
                        <div x-show="order._msg" class="px-4 pb-3 text-xs text-green-600 font-medium flex items-center gap-1">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                            <span x-text="order._msg"></span>
                        </div>
                    </div>
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
            return this.orders.filter(o =>
                o.driverName?.toLowerCase() === this.username.toLowerCase() &&
                ['Menunggu','Diproses','Dikirim'].includes(o.statusPengiriman));
        },
        get selesaiOrders() {
            return this.orders.filter(o =>
                o.driverName?.toLowerCase() === this.username.toLowerCase() &&
                ['Selesai','Dibatalkan'].includes(o.statusPengiriman));
        },
        get currentOrders() {
            return this.activeTab === 'aktif' ? this.aktifOrders : this.selesaiOrders;
        },

        init() {
            const savedUser = sessionStorage.getItem('driverUsername');
            const loginAt = parseInt(sessionStorage.getItem('driverLoginAt') || '0');
            if (savedUser && (Date.now() - loginAt) < 8 * 3600 * 1000) {
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
            return { 'Menunggu': 'Tandai Diproses', 'Diproses': 'Tandai Dikirim', 'Dikirim': 'Tandai Selesai' }[status] || status;
        },

        nextStatus(status) {
            return { 'Menunggu': 'Diproses', 'Diproses': 'Dikirim', 'Dikirim': 'Selesai' }[status];
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
                    order._msg = 'Status diperbarui';
                    setTimeout(() => order._msg = '', 3000);
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
                order._msg = res.ok ? 'Foto terkirim ke grup WA ✓' : 'Gagal mengirim foto';
                setTimeout(() => order._msg = '', 4000);
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
