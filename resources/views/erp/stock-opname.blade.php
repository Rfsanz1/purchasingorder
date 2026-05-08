@extends('layouts.erp')

@section('title', 'Stock Opname')

@section('content')
<div x-data="stockOpnameApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">Stock Opname</h1>
            <p class="text-gray-600 mt-1">Login pengguna dulu, lalu scan barcode untuk hitung stok fisik.</p>
        </div>
        <div class="flex items-center gap-2">
            <template x-if="currentUser">
                <div class="text-sm text-gray-700">
                    <div><span class="font-medium">Role:</span> <span x-text="currentUser.role"></span></div>
                    <div><span class="font-medium">User:</span> <span x-text="currentUser.username"></span></div>
                </div>
            </template>
            <button x-show="currentUser" @click="logout()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">Logout</button>
        </div>
    </div>

    <template x-if="!currentUser">
        <div class="bg-white rounded-lg border p-6 shadow-sm max-w-xl mx-auto">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Login untuk Stock Opname</h2>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Role</label>
                    <select x-model="login.role"
                            class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="admin">Admin</option>
                        <option value="driver">Driver</option>
                        <option value="sales">Sales</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Username</label>
                    <input x-model="login.username" type="text" placeholder="Masukkan username"
                           class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div x-show="login.role === 'admin'">
                    <label class="block text-sm font-medium text-gray-700">Password</label>
                    <input x-model="login.password" type="password" placeholder="Masukkan password admin"
                           class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div class="flex justify-end">
                    <button @click="loginUser()" :disabled="loading"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50">
                        <span x-show="loading">Memeriksa...</span>
                        <span x-show="!loading">Masuk</span>
                    </button>
                </div>
                <p x-show="error" class="text-sm text-red-600" x-text="error"></p>
            </div>
        </div>
    </template>

    <template x-if="currentUser">
        <div class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div class="bg-white rounded-lg border p-4 shadow-sm">
                    <h2 class="text-lg font-semibold text-gray-900 mb-3">Scan Barcode</h2>
                    <p class="text-sm text-gray-500 mb-4">Masukkan SKU/barcode lalu tekan Enter atau klik Scan.</p>
                    <div class="space-y-3">
                        <input x-model="query" @keydown.enter.prevent="searchProduct()" type="text" placeholder="Scan atau masukkan kode produk"
                               class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" autofocus>
                        <div class="flex gap-2">
                            <button @click="searchProduct()" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Scan</button>
                            <button @click="clearScan()" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">Bersihkan</button>
                        </div>
                        <div class="space-y-3">
                            <button x-show="canUseCamera" type="button" @click="toggleCamera()"
                                    class="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
                                <span x-text="cameraActive ? 'Tutup Kamera' : 'Buka Kamera'"></span>
                            </button>
                            <div x-show="cameraActive" x-cloak class="rounded-lg overflow-hidden border border-gray-200">
                                <video x-ref="cameraVideo" class="w-full h-64 object-cover bg-black" autoplay muted playsinline></video>
                                <div class="p-3 bg-gray-50 text-xs text-gray-600">
                                    Arahkan kamera ke barcode. Jika terdeteksi, sistem akan otomatis mencari produk.
                                </div>
                            </div>
                            <p x-show="!canUseCamera" class="text-xs text-gray-500">Kamera tidak tersedia di perangkat ini. Gunakan input manual.</p>
                        </div>
                        <p x-show="searchMessage" class="text-sm text-gray-600" x-text="searchMessage"></p>
                        <p x-show="searchError" class="text-sm text-red-600" x-text="searchError"></p>
                    </div>
                </div>

                <div class="bg-white rounded-lg border p-4 shadow-sm lg:col-span-2">
                    <h2 class="text-lg font-semibold text-gray-900 mb-3">Ringkasan Scan</h2>
                    <div class="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                        <div class="bg-gray-50 rounded-lg p-4">
                            <p class="text-xs uppercase font-semibold text-gray-500">Produk Terscan</p>
                            <p class="text-2xl font-bold text-gray-900" x-text="scannedItems.length"></p>
                        </div>
                        <div class="bg-gray-50 rounded-lg p-4">
                            <p class="text-xs uppercase font-semibold text-gray-500">Selisih Total</p>
                            <p class="text-2xl font-bold text-gray-900" x-text="formatNumber(totalDiff)"></p>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full text-left text-sm text-gray-700">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-4 py-3">SKU</th>
                                    <th class="px-4 py-3">Produk</th>
                                    <th class="px-4 py-3">Stok Sistem</th>
                                    <th class="px-4 py-3">Hitung Fisik</th>
                                    <th class="px-4 py-3">Selisih</th>
                                    <th class="px-4 py-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                <template x-for="(item, index) in scannedItems" :key="item.sku + index">
                                    <tr>
                                        <td class="px-4 py-3"><span x-text="item.sku"></span></td>
                                        <td class="px-4 py-3"><span x-text="item.namaProduk"></span></td>
                                        <td class="px-4 py-3"><span x-text="item.expectedQty"></span></td>
                                        <td class="px-4 py-3">
                                            <input type="number" min="0" x-model.number="item.countedQty"
                                                   @input="updateItemDiff(item)"
                                                   class="w-24 border border-gray-300 rounded-md px-2 py-1">
                                        </td>
                                        <td class="px-4 py-3">
                                            <span :class="item.diff === 0 ? 'text-green-600' : 'text-red-600'" x-text="item.diff"></span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <button @click="removeItem(index)" class="text-red-600 hover:text-red-900 text-sm">Hapus</button>
                                        </td>
                                    </tr>
                                </template>
                                <tr x-show="scannedItems.length === 0">
                                    <td colspan="6" class="px-4 py-6 text-center text-gray-500">Belum ada produk terdaftar.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="mt-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
                        <div class="text-sm text-gray-700">
                            <div><span class="font-medium">Total Sistem:</span> <span x-text="totalExpected"></span></div>
                            <div><span class="font-medium">Total Hitung:</span> <span x-text="totalCounted"></span></div>
                        </div>
                        <button @click="saveOpname()" :disabled="saving || scannedItems.length === 0"
                                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50">
                            <span x-show="saving">Menyimpan...</span>
                            <span x-show="!saving">Simpan Opname</span>
                        </button>
                    </div>
                </div>
            </div>

            <div x-show="searchResults.length > 1" class="bg-white rounded-lg border p-4 shadow-sm">
                <h2 class="text-lg font-semibold text-gray-900 mb-3">Pilih Produk</h2>
                <div class="space-y-3">
                    <template x-for="product in searchResults" :key="product.sku">
                        <button @click="addItem(product)"
                                class="w-full text-left rounded-lg border border-gray-200 px-4 py-3 hover:border-blue-500 hover:bg-blue-50">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="font-medium text-gray-900" x-text="product.namaProduk"></p>
                                    <p class="text-xs text-gray-500">SKU: <span x-text="product.sku"></span> · Stok: <span x-text="product.expectedQty"></span></p>
                                </div>
                                <span class="text-sm text-blue-600" x-text="product.source"></span>
                            </div>
                        </button>
                    </template>
                </div>
            </div>
        </div>
    </template>
</div>

<script>
function stockOpnameApp() {
    return {
        currentUser: null,
        login: { role: 'admin', username: '', password: '' },
        query: '',
        searchResults: [],
        scannedItems: [],
        loading: false,
        saving: false,
        error: '',
        searchError: '',
        searchMessage: '',
        canUseCamera: false,
        cameraActive: false,
        barcodeDetector: null,
        videoStream: null,
        scanInterval: null,
        lastScannedCode: null,
        lastScanTime: 0,
        canvas: null,
        ctx: null,

        init() {
            const stored = localStorage.getItem('stockOpnameUser');
            if (stored) {
                try { this.currentUser = JSON.parse(stored); } catch (e) { localStorage.removeItem('stockOpnameUser'); }
            }

            this.canUseCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
            if (this.currentUser) {
                this.autoStartCamera();
            }
        },

        async loginUser() {
            this.loading = true;
            this.error = '';
            try {
                if (this.login.role === 'admin') {
                    // Admin perlu login via API
                    const res = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(this.login),
                    });
                    const data = await res.json();
                    if (data.ok) {
                        this.currentUser = { role: data.role, username: data.username ?? this.login.username };
                        localStorage.setItem('stockOpnameUser', JSON.stringify(this.currentUser));
                        this.autoStartCamera();
                    } else {
                        this.error = data.error || 'Login gagal';
                    }
                } else {
                    // Driver dan Sales langsung masuk tanpa password
                    if (!this.login.username.trim()) {
                        this.error = 'Username harus diisi';
                        return;
                    }
                    this.currentUser = { role: this.login.role, username: this.login.username };
                    localStorage.setItem('stockOpnameUser', JSON.stringify(this.currentUser));
                    this.autoStartCamera();
                }
            } catch (e) {
                this.error = 'Gagal terhubung ke server login';
            } finally {
                this.loading = false;
            }
        },

        logout() {
            this.stopCamera();
            localStorage.removeItem('stockOpnameUser');
            this.currentUser = null;
            this.query = '';
            this.searchResults = [];
            this.scannedItems = [];
            this.searchMessage = '';
            this.searchError = '';
        },

        async autoStartCamera() {
            if (!this.canUseCamera) return;
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                await this.startCamera();
            }
        },

        async toggleCamera() {
            if (this.cameraActive) {
                this.stopCamera();
            } else {
                await this.startCamera();
            }
        },

        async startCamera() {
            if (!this.canUseCamera) return;
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                this.videoStream = stream;
                this.cameraActive = true;
                const video = this.$refs.cameraVideo;
                if (video) {
                    video.srcObject = stream;
                    await video.play();
                }

                if (!('BarcodeDetector' in window)) {
                    await this.loadJsQr();
                } else {
                    this.barcodeDetector = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'code_128', 'code_39', 'qr_code'] });
                }

                this.scanInterval = setInterval(() => this.scanFrame(), 500);
            } catch (e) {
                this.searchError = 'Tidak dapat mengakses kamera. Periksa izin kamera.';
                this.cameraActive = false;
            }
        },

        stopCamera() {
            this.cameraActive = false;
            if (this.videoStream) {
                this.videoStream.getTracks().forEach(track => track.stop());
                this.videoStream = null;
            }
            if (this.scanInterval) {
                clearInterval(this.scanInterval);
                this.scanInterval = null;
            }
        },

        async scanFrame() {
            if (!this.cameraActive || !this.currentUser) return;
            const video = this.$refs.cameraVideo;
            if (!video || video.readyState < 2) return;

            try {
                if (this.barcodeDetector) {
                    const barcodes = await this.barcodeDetector.detect(video);
                    if (barcodes.length > 0) {
                        this.handleScannedCode(barcodes[0].rawValue || barcodes[0].raw_text || '');
                        return;
                    }
                }

                if (window.jsQR) {
                    if (!this.canvas) {
                        this.canvas = document.createElement('canvas');
                        this.ctx = this.canvas.getContext('2d');
                    }
                    this.canvas.width = video.videoWidth;
                    this.canvas.height = video.videoHeight;
                    this.ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);
                    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                    const code = jsQR(imageData.data, this.canvas.width, this.canvas.height);
                    if (code && code.data) {
                        this.handleScannedCode(code.data);
                    }
                }
            } catch (e) {
                console.debug('Scan error', e);
            }
        },

        handleScannedCode(code) {
            const normalized = code.trim();
            if (!normalized) return;
            const now = Date.now();
            if (normalized === this.lastScannedCode && now - this.lastScanTime < 1500) {
                return;
            }
            this.lastScannedCode = normalized;
            this.lastScanTime = now;
            this.query = normalized;
            this.searchProduct();
        },

        async loadJsQr() {
            if (window.jsQR) return;
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/jsqr/dist/jsQR.js';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        },

        async searchProduct() {
            this.searchError = '';
            this.searchMessage = '';
            if (!this.query.trim()) {
                this.searchError = 'Masukkan kode produk terlebih dahulu.';
                return;
            }

            try {
                const res = await fetch(`/api/stock-opname/search-product?q=${encodeURIComponent(this.query.trim())}`);
                const data = await res.json();
                if (!data.ok) {
                    this.searchError = data.error || 'Produk tidak ditemukan.';
                    this.searchResults = [];
                    return;
                }

                if (data.results.length === 1) {
                    this.addItem(data.results[0]);
                    this.searchMessage = `Produk "${data.results[0].namaProduk}" berhasil ditambahkan.`;
                    this.searchResults = [];
                    this.query = '';
                    return;
                }

                this.searchResults = data.results;
                this.searchMessage = `${data.results.length} produk ditemukan, pilih satu.`;
            } catch (e) {
                this.searchError = 'Gagal mencari produk.';
            }
        },

        addItem(product) {
            const existing = this.scannedItems.find(i => i.sku === product.sku);
            if (existing) {
                existing.countedQty += 1;
                existing.diff = existing.countedQty - existing.expectedQty;
            } else {
                this.scannedItems.push({
                    productId: product.productId ?? null,
                    kledoProductId: product.kledoProductId ?? null,
                    sku: product.sku,
                    namaProduk: product.namaProduk,
                    expectedQty: product.expectedQty ?? 0,
                    countedQty: 1,
                    diff: 1 - (product.expectedQty ?? 0),
                    source: product.source || 'internal',
                });
            }
            this.searchResults = [];
            this.query = '';
            this.searchMessage = '';
        },

        updateItemDiff(item) {
            item.diff = item.countedQty - item.expectedQty;
        },

        removeItem(index) {
            this.scannedItems.splice(index, 1);
        },

        clearScan() {
            this.query = '';
            this.searchResults = [];
            this.searchError = '';
            this.searchMessage = '';
        },

        get totalExpected() {
            return this.scannedItems.reduce((sum, item) => sum + Number(item.expectedQty || 0), 0);
        },

        get totalCounted() {
            return this.scannedItems.reduce((sum, item) => sum + Number(item.countedQty || 0), 0);
        },

        get totalDiff() {
            return this.scannedItems.reduce((sum, item) => sum + Number(item.diff || 0), 0);
        },

        formatNumber(value) {
            return new Intl.NumberFormat('id-ID').format(value);
        },

        async saveOpname() {
            if (this.scannedItems.length === 0) return;
            this.saving = true;
            try {
                const payload = {
                    userRole: this.currentUser.role,
                    username: this.currentUser.username,
                    notes: '',
                    items: this.scannedItems.map(item => ({
                        productId: item.productId,
                        kledoProductId: item.kledoProductId,
                        sku: item.sku,
                        namaProduk: item.namaProduk,
                        expectedQty: item.expectedQty,
                        countedQty: item.countedQty,
                        diff: item.diff,
                        source: item.source,
                    })),
                };

                const res = await fetch('/api/stock-opname', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                if (data.ok) {
                    this.searchMessage = `Opname berhasil disimpan (ID: ${data.id}).`;
                    this.scannedItems = [];
                } else {
                    this.searchError = data.error || 'Gagal menyimpan opname.';
                }
            } catch (e) {
                this.searchError = 'Gagal menyimpan opname ke server.';
            } finally {
                this.saving = false;
            }
        },
    };
}
</script>
@endsection
