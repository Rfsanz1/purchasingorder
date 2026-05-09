@extends('layouts.erp')
@section('title', 'Kelola Pengiriman')

@section('content')
<div x-data="adminApp()" x-init="init()" class="p-4 md:p-6 max-w-5xl mx-auto">

    {{-- Page header --}}
    <div class="flex items-center justify-between mb-4">
        <div>
            <h1 class="text-xl font-bold text-gray-900">Kelola Pengiriman</h1>
            <p class="text-sm text-gray-400 mt-0.5">Monitoring semua pesanan & pengiriman</p>
        </div>
        <div class="flex gap-2">
            <button @click="runHealthCheck()" class="border border-gray-200 text-gray-600 text-xs px-3 py-2 rounded-xl hover:bg-gray-50">
                Health Check
            </button>
        </div>
    </div>

    {{-- Stats --}}
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p class="text-2xl font-bold text-gray-900" x-text="filteredOrders.length"></p>
            <p class="text-xs text-gray-400 mt-0.5">Total</p>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p class="text-2xl font-bold text-gray-500" x-text="filteredOrders.filter(o=>o.statusPengiriman==='Menunggu').length"></p>
            <p class="text-xs text-gray-400 mt-0.5">Menunggu</p>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p class="text-2xl font-bold text-purple-600" x-text="filteredOrders.filter(o=>o.statusPengiriman==='Dikirim').length"></p>
            <p class="text-xs text-gray-400 mt-0.5">Dikirim</p>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p class="text-2xl font-bold text-green-600" x-text="filteredOrders.filter(o=>o.statusPengiriman==='Selesai').length"></p>
            <p class="text-xs text-gray-400 mt-0.5">Selesai</p>
        </div>
    </div>

    {{-- Tabs --}}
    <div class="flex gap-1 bg-white rounded-xl border border-gray-100 shadow-sm mb-4 p-1 overflow-x-auto scrollbar-hide">
        <button @click="tab='pesanan'" :class="tab==='pesanan'?'bg-blue-600 text-white':'text-gray-600'" class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">Pesanan</button>
        <button @click="tab='pengiriman'" :class="tab==='pengiriman'?'bg-blue-600 text-white':'text-gray-600'" class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">Pengiriman</button>
        <button @click="tab='wilayah'; loadDriverAreas()" :class="tab==='wilayah'?'bg-blue-600 text-white':'text-gray-600'" class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">Wilayah</button>
        <button @click="tab='pengaturan'; loadSettings()" :class="tab==='pengaturan'?'bg-blue-600 text-white':'text-gray-600'" class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">Pengaturan</button>
    </div>

    {{-- PESANAN TAB --}}
    <div x-show="tab==='pesanan'" class="pb-10">
        {{-- Filters --}}
        <div class="bg-white rounded-2xl shadow-sm p-4 mb-4">
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="text-xs text-gray-500 mb-1 block">Cari</label>
                    <input type="text" x-model="search" placeholder="Nama, no. telp, produk..."
                        class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                </div>
                <div>
                    <label class="text-xs text-gray-500 mb-1 block">Status Bayar</label>
                    <select x-model="filterPayment" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option value="">Semua</option>
                        <option>CASH</option><option>Transfer</option><option>Debit</option><option>BelumBayar</option><option>DP</option><option>Multi</option>
                    </select>
                </div>
                <div>
                    <label class="text-xs text-gray-500 mb-1 block">Status WA</label>
                    <select x-model="filterWA" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option value="">Semua</option>
                        <option value="true">Terkirim</option>
                        <option value="false">Gagal</option>
                    </select>
                </div>
                <div>
                    <label class="text-xs text-gray-500 mb-1 block">Kategori</label>
                    <select x-model="filterKategori" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option value="">Semua</option>
                        <option>Elektronik</option><option>BahanBangunan</option><option>Campuran</option>
                    </select>
                </div>
            </div>
            <div class="flex gap-2 mt-3">
                <div class="flex-1">
                    <label class="text-xs text-gray-500 mb-1 block">Dari</label>
                    <input type="date" x-model="filterDateFrom" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                </div>
                <div class="flex-1">
                    <label class="text-xs text-gray-500 mb-1 block">Sampai</label>
                    <input type="date" x-model="filterDateTo" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                </div>
                <div class="flex items-end">
                    <button @click="resetFilters()" class="border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-50">Reset</button>
                </div>
            </div>
        </div>

        {{-- Loading --}}
        <template x-if="loading">
            <div class="bg-white rounded-2xl p-8 text-center shadow-sm">
                <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p class="text-gray-500 text-sm">Memuat pesanan...</p>
            </div>
        </template>

        {{-- Orders list --}}
        <template x-if="!loading">
            <div class="space-y-3">
                <template x-if="filteredOrders.length === 0">
                    <div class="bg-white rounded-2xl p-8 text-center shadow-sm">
                        <div class="text-4xl mb-2">📭</div>
                        <p class="text-gray-500 text-sm">Tidak ada pesanan ditemukan</p>
                    </div>
                </template>
                <template x-for="order in filteredOrders" :key="order.id">
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                        <div class="flex items-start justify-between gap-2 mb-2">
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="text-xs font-mono text-gray-400" x-text="'#' + order.orderId"></span>
                                    <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                                        :class="{
                                            'bg-green-100 text-green-700': order.metodePembayaran==='CASH',
                                            'bg-blue-100 text-blue-700': order.metodePembayaran==='Transfer',
                                            'bg-purple-100 text-purple-700': order.metodePembayaran==='Debit',
                                            'bg-yellow-100 text-yellow-700': order.metodePembayaran==='DP',
                                            'bg-orange-100 text-orange-700': order.metodePembayaran==='Multi',
                                            'bg-red-100 text-red-700': order.metodePembayaran==='BelumBayar',
                                        }"
                                        x-text="order.metodePembayaran">
                                    </span>
                                    <span class="text-xs px-2 py-0.5 rounded-full"
                                        :class="order.whatsappSent==='true' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                                        x-text="order.whatsappSent==='true' ? 'WA ✓' : 'WA ✗'">
                                    </span>
                                    <span x-show="order.kategoriProduk" class="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full" x-text="order.kategoriProduk"></span>
                                </div>
                                <h3 class="font-semibold text-gray-800 mt-1" x-text="order.namaKontak"></h3>
                                <p class="text-sm text-gray-500" x-text="order.nomorTelepon"></p>
                            </div>
                            <div class="text-right shrink-0">
                                <p class="font-bold text-blue-700 text-sm" x-text="'Rp ' + formatRupiah(order.totalHarga)"></p>
                                <p class="text-xs text-gray-400 mt-0.5" x-text="formatDate(order.createdAt)"></p>
                            </div>
                        </div>

                        <div class="bg-gray-50 rounded-xl px-3 py-2 mb-3">
                            <p class="text-sm text-gray-700" x-text="order.namaProduk"></p>
                            <p class="text-xs text-gray-400 mt-0.5" x-text="order.jumlahProduk + ' unit • Sales: ' + order.salesPerson"></p>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="text-xs px-2 py-0.5 rounded-full"
                                    :class="{
                                        'bg-gray-100 text-gray-600': order.statusPengiriman==='Menunggu',
                                        'bg-blue-100 text-blue-700': order.statusPengiriman==='Diproses',
                                        'bg-purple-100 text-purple-700': order.statusPengiriman==='Dikirim',
                                        'bg-green-100 text-green-700': order.statusPengiriman==='Selesai',
                                        'bg-red-100 text-red-700': order.statusPengiriman==='Dibatalkan',
                                    }"
                                    x-text="order.statusPengiriman">
                                </span>
                                <template x-if="order.hasBuktiTf">
                                    <a :href="`/api/orders/${order.orderId}/bukti-tf`" target="_blank"
                                        class="text-xs text-blue-600 hover:underline">Bukti TF</a>
                                </template>
                                {{-- Status Kledo --}}
                                <template x-if="order.kledoInvoiceId">
                                    <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                                        ✓ Kledo #<span x-text="order.kledoInvoiceId"></span>
                                    </span>
                                </template>
                                <template x-if="!order.kledoInvoiceId">
                                    <button
                                        @click="resendKledo(order)"
                                        :disabled="order._kledoLoading"
                                        class="text-xs px-2 py-0.5 rounded-full font-medium border transition-all"
                                        :class="order._kledoLoading
                                            ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-wait'
                                            : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'"
                                        x-text="order._kledoLoading ? 'Mengirim...' : '↻ Kirim ke Kledo'">
                                    </button>
                                </template>
                            </div>
                            <button @click="deleteOrder(order)" class="text-xs text-red-500 hover:text-red-700 font-medium">Hapus</button>
                        </div>
                    </div>
                </template>
            </div>
        </template>
    </div>

    {{-- PENGIRIMAN TAB --}}
    <div x-show="tab==='pengiriman'" class="pb-10">
        <div class="space-y-3">
            <template x-if="loading">
                <div class="bg-white rounded-2xl p-8 text-center shadow-sm">
                    <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                </div>
            </template>
            <template x-for="order in deliveryOrders" :key="order.id">
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-mono text-gray-400" x-text="'#' + order.orderId"></span>
                        <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                            :class="{
                                'bg-gray-100 text-gray-600': order.statusPengiriman==='Menunggu',
                                'bg-blue-100 text-blue-700': order.statusPengiriman==='Diproses',
                                'bg-purple-100 text-purple-700': order.statusPengiriman==='Dikirim',
                                'bg-green-100 text-green-700': order.statusPengiriman==='Selesai',
                            }"
                            x-text="order.statusPengiriman">
                        </span>
                    </div>
                    <h3 class="font-semibold text-gray-800" x-text="order.namaKontak"></h3>
                    <p class="text-sm text-gray-500" x-text="order.alamat"></p>
                    <p class="text-xs text-gray-400 mt-1">Driver: <span class="font-medium" x-text="order.driverName || '(belum ditentukan)'"></span></p>
                    <p class="text-xs text-gray-400">Produk: <span x-text="order.namaProduk"></span></p>
                </div>
            </template>
            <template x-if="!loading && deliveryOrders.length === 0">
                <div class="bg-white rounded-2xl p-8 text-center shadow-sm">
                    <div class="text-4xl mb-2">🚚</div>
                    <p class="text-gray-500 text-sm">Tidak ada data pengiriman</p>
                </div>
            </template>
        </div>
    </div>

    {{-- WILAYAH TAB --}}
    <div x-show="tab==='wilayah'" class="pb-10">
        <div class="bg-white rounded-2xl shadow-sm p-5">
            <h2 class="font-semibold text-gray-800 mb-4">Manajemen Wilayah Driver</h2>
            <template x-for="(areas, driver) in driverAreas" :key="driver">
                <div class="mb-5">
                    <p class="font-medium text-gray-700 mb-2" x-text="driver"></p>
                    <div class="flex flex-wrap gap-2 mb-2">
                        <template x-for="(area, idx) in areas" :key="idx">
                            <span class="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                                <span x-text="area"></span>
                                <button @click="removeArea(driver, idx)" class="text-blue-400 hover:text-red-500 ml-1">×</button>
                            </span>
                        </template>
                    </div>
                    <div class="flex gap-2">
                        <input type="text" :placeholder="'Tambah wilayah untuk ' + driver"
                            @keydown.enter="addArea(driver, $event)"
                            class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            :x-ref="'area_'+driver">
                        <button @click="addArea(driver, $event)" class="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm hover:bg-blue-200">+</button>
                    </div>
                </div>
            </template>
            <button @click="saveDriverAreas()" :disabled="savingAreas"
                class="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50">
                <span x-text="savingAreas ? 'Menyimpan...' : 'Simpan Wilayah'"></span>
            </button>
            <p x-show="areasMsg" class="text-sm text-green-600 text-center mt-2" x-text="areasMsg"></p>
        </div>
    </div>

    {{-- PENGATURAN TAB --}}
    <div x-show="tab==='pengaturan'" class="pb-10">
        <div class="bg-white rounded-2xl shadow-sm p-5">
            <h2 class="font-semibold text-gray-800 mb-4">Pengaturan WhatsApp (Fonnte)</h2>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Token Fonnte (Group)</label>
                    <div class="flex items-center gap-2">
                        <input type="password" x-model="settings.fonnteTokenGroup" placeholder="Masukkan token Fonnte group..."
                            class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <span x-show="settings.fonnteTokenGroupIsSet" class="text-xs text-green-600 whitespace-nowrap">✓ Aktif</span>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Token Fonnte (Customer)</label>
                    <div class="flex items-center gap-2">
                        <input type="password" x-model="settings.fonnteTokenCustomer" placeholder="Masukkan token Fonnte customer..."
                            class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <span x-show="settings.fonnteTokenCustomerIsSet" class="text-xs text-green-600 whitespace-nowrap">✓ Aktif</span>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Group ID Invoice</label>
                    <input type="text" x-model="settings.grupInvoiceId"
                        class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Group ID Bukti TF</label>
                    <input type="text" x-model="settings.grupBuktiTfId"
                        class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                </div>
            </div>
            <button @click="saveSettings()" :disabled="savingSettings"
                class="w-full mt-5 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50">
                <span x-text="savingSettings ? 'Menyimpan...' : 'Simpan Pengaturan'"></span>
            </button>
            <p x-show="settingsMsg" class="text-sm text-green-600 text-center mt-2" x-text="settingsMsg"></p>
        </div>
    </div>

    {{-- Health Check Modal --}}
    <div x-show="showHealth" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="showHealth=false"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 class="text-lg font-bold mb-4">Health Check</h3>
            <template x-if="healthLoading">
                <div class="text-center py-4">
                    <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p class="text-gray-500 text-sm">Memeriksa koneksi...</p>
                </div>
            </template>
            <template x-if="!healthLoading && healthResult">
                <div>
                    <div class="space-y-2 mb-4">
                        <div class="flex items-center gap-2">
                            <span x-text="healthResult.database ? '✅' : '❌'"></span>
                            <span class="text-sm">Database</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span x-text="healthResult.fonnte ? '✅' : '❌'"></span>
                            <span class="text-sm">WhatsApp (Fonnte)</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span x-text="healthResult.kledo ? '✅' : '⚠️'"></span>
                            <span class="text-sm">Kledo ERP</span>
                        </div>
                    </div>
                    <template x-if="healthResult.issues && healthResult.issues.length > 0">
                        <div class="bg-red-50 rounded-xl p-3 mb-4">
                            <template x-for="issue in healthResult.issues">
                                <p class="text-xs text-red-600" x-text="'• ' + issue"></p>
                            </template>
                        </div>
                    </template>
                </div>
            </template>
            <button @click="showHealth=false" class="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200">Tutup</button>
        </div>
    </div>

    {{-- Delete confirm modal --}}
    <div x-show="deleteTarget" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="deleteTarget=null"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Hapus Pesanan?</h3>
            <p class="text-gray-500 text-sm mb-5">Pesanan <span class="font-medium" x-text="deleteTarget?.namaKontak"></span> akan dihapus permanen.</p>
            <div class="flex gap-3">
                <button @click="deleteTarget=null" class="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Batal</button>
                <button @click="confirmDelete()" :disabled="deleteLoading"
                    class="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-50">
                    <span x-text="deleteLoading ? 'Menghapus...' : 'Hapus'"></span>
                </button>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
function adminApp() {
    return {
        tab: 'pesanan',
        orders: [],
        loading: false,
        search: '',
        filterPayment: '',
        filterWA: '',
        filterKategori: '',
        filterDateFrom: '',
        filterDateTo: '',
        isSales: false,
        salesUsername: '',
        driverAreas: {},
        savingAreas: false,
        areasMsg: '',
        settings: {},
        savingSettings: false,
        settingsMsg: '',
        showHealth: false,
        healthLoading: false,
        healthResult: null,
        deleteTarget: null,
        deleteLoading: false,

        get filteredOrders() {
            return this.orders.filter(o => {
                if (this.isSales && o.salesPerson?.toLowerCase() !== this.salesUsername?.toLowerCase()) return false;
                if (this.search) {
                    const q = this.search.toLowerCase();
                    if (!(o.namaKontak?.toLowerCase().includes(q) || o.nomorTelepon?.includes(q) || o.namaProduk?.toLowerCase().includes(q) || o.orderId?.toLowerCase().includes(q))) return false;
                }
                if (this.filterPayment && o.metodePembayaran !== this.filterPayment) return false;
                if (this.filterWA && o.whatsappSent !== this.filterWA) return false;
                if (this.filterKategori && o.kategoriProduk !== this.filterKategori) return false;
                if (this.filterDateFrom) {
                    const d = new Date(o.createdAt); const from = new Date(this.filterDateFrom);
                    if (d < from) return false;
                }
                if (this.filterDateTo) {
                    const d = new Date(o.createdAt); const to = new Date(this.filterDateTo); to.setHours(23,59,59);
                    if (d > to) return false;
                }
                return true;
            });
        },

        get deliveryOrders() {
            return this.orders.filter(o => o.metodePengiriman === 'Dikirim');
        },

        init() {
            const params = new URLSearchParams(window.location.search);
            const salesParam = params.get('sales');
            if (salesParam) {
                this.isSales = true;
                this.salesUsername = salesParam;
            }
            this.fetchOrders();
        },

        async fetchOrders() {
            this.loading = true;
            try {
                const res = await fetch('/api/orders?per_page=200');
                const data = await res.json();
                this.orders = Array.isArray(data) ? data : (data.orders || []);
            } catch(e) {}
            finally { this.loading = false; }
        },

        resetFilters() {
            this.search = '';
            this.filterPayment = '';
            this.filterWA = '';
            this.filterKategori = '';
            this.filterDateFrom = '';
            this.filterDateTo = '';
        },

        deleteOrder(order) {
            this.deleteTarget = order;
        },

        async confirmDelete() {
            if (!this.deleteTarget) return;
            this.deleteLoading = true;
            try {
                const res = await fetch(`/api/orders/${this.deleteTarget.id}`, { method: 'DELETE' });
                if (res.ok) {
                    this.orders = this.orders.filter(o => o.id !== this.deleteTarget.id);
                    this.deleteTarget = null;
                }
            } catch(e) {}
            finally { this.deleteLoading = false; }
        },

        async runHealthCheck() {
            this.showHealth = true;
            this.healthLoading = true;
            this.healthResult = null;
            try {
                const res = await fetch('/api/system/health-check');
                this.healthResult = await res.json();
            } catch(e) {
                this.healthResult = { database: false, fonnte: false, kledo: false, issues: ['Gagal terhubung ke server'] };
            } finally {
                this.healthLoading = false;
            }
        },

        async loadDriverAreas() {
            try {
                const res = await fetch('/api/driver-areas');
                this.driverAreas = await res.json();
            } catch(e) {}
        },

        addArea(driver, event) {
            const input = event.target.closest('div').querySelector('input');
            const val = input.value.trim();
            if (!val) return;
            if (!this.driverAreas[driver]) this.driverAreas[driver] = [];
            if (!this.driverAreas[driver].includes(val)) {
                this.driverAreas[driver] = [...this.driverAreas[driver], val];
            }
            input.value = '';
        },

        removeArea(driver, idx) {
            this.driverAreas[driver].splice(idx, 1);
            this.driverAreas[driver] = [...this.driverAreas[driver]];
        },

        async saveDriverAreas() {
            this.savingAreas = true;
            try {
                const res = await fetch('/api/driver-areas', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.driverAreas),
                });
                if (res.ok) {
                    this.areasMsg = 'Wilayah berhasil disimpan ✅';
                    setTimeout(() => this.areasMsg = '', 3000);
                }
            } catch(e) {}
            finally { this.savingAreas = false; }
        },

        async loadSettings() {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                this.settings = {
                    fonnteTokenGroup: '',
                    fonnteTokenGroupIsSet: data.fonnteTokenGroup?.isSet,
                    fonnteTokenCustomer: '',
                    fonnteTokenCustomerIsSet: data.fonnteTokenCustomer?.isSet,
                    grupInvoiceId: data.grupInvoiceId?.value || '',
                    grupBuktiTfId: data.grupBuktiTfId?.value || '',
                };
            } catch(e) {}
        },

        async saveSettings() {
            this.savingSettings = true;
            const body = {};
            if (this.settings.fonnteTokenGroup) body.fonnteTokenGroup = this.settings.fonnteTokenGroup;
            if (this.settings.fonnteTokenCustomer) body.fonnteTokenCustomer = this.settings.fonnteTokenCustomer;
            if (this.settings.grupInvoiceId !== undefined) body.grupInvoiceId = this.settings.grupInvoiceId;
            if (this.settings.grupBuktiTfId !== undefined) body.grupBuktiTfId = this.settings.grupBuktiTfId;
            try {
                const res = await fetch('/api/settings', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                if (res.ok) {
                    this.settingsMsg = 'Pengaturan berhasil disimpan ✅';
                    setTimeout(() => this.settingsMsg = '', 3000);
                }
            } catch(e) {}
            finally { this.savingSettings = false; }
        },

        async resendKledo(order) {
            if (order._kledoLoading) return;
            if (!confirm(`Kirim ulang invoice ke Kledo untuk order #${order.orderId}?\n\nPastikan order ini belum ada di Kledo.`)) return;
            order._kledoLoading = true;
            try {
                const res = await fetch(`/api/orders/${order.orderId}/resend-kledo`, { method: 'POST' });
                const data = await res.json();
                if (data.ok) {
                    order.kledoInvoiceId = data.invoiceId;
                    alert(`✅ Invoice Kledo berhasil dibuat! ID: #${data.invoiceId}`);
                } else {
                    alert(`❌ Gagal: ${data.error || 'Error tidak diketahui'}`);
                }
            } catch(e) {
                alert('❌ Koneksi gagal. Coba lagi.');
            } finally {
                order._kledoLoading = false;
            }
        },

        formatRupiah(n) {
            return Number(n || 0).toLocaleString('id-ID');
        },

        formatDate(d) {
            if (!d) return '';
            return new Date(d).toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
        }
    }
}
</script>
@endpush
@endsection
