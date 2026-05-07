@extends('layouts.erp')
@section('title', 'Laporan Per Divisi')

@section('content')
<div x-data="laporanApp()" x-init="init()" class="p-4 md:p-6 max-w-5xl mx-auto">

    {{-- Header --}}
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-xl font-bold text-gray-900">Laporan Per Divisi</h1>
            <p class="text-sm text-gray-400 mt-0.5">Rekap penjualan Elektronik & Bahan Bangunan + posisi kas & bank</p>
        </div>
        <button @click="load()" :disabled="loading"
            class="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50">
            <svg class="w-4 h-4" :class="loading && 'animate-spin'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Refresh
        </button>
    </div>

    {{-- Filter Periode --}}
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Filter Periode</p>
        <div class="flex flex-col sm:flex-row gap-3 items-end">
            <div class="flex-1">
                <label class="text-xs text-gray-500 block mb-1">Dari Tanggal</label>
                <input type="date" x-model="dari" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            </div>
            <div class="flex-1">
                <label class="text-xs text-gray-500 block mb-1">Sampai Tanggal</label>
                <input type="date" x-model="sampai" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            </div>
            <button @click="load()" class="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 shrink-0">Tampilkan</button>
            <button @click="dari=''; sampai=''; load()" class="border border-gray-200 text-gray-500 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 shrink-0">Reset</button>
        </div>
        <p x-show="data" class="text-xs text-gray-400 mt-2">
            Menampilkan <span class="font-semibold text-gray-700" x-text="data?.totalOrders || 0"></span> order
            <template x-if="data?.periode?.dari || data?.periode?.sampai">
                <span> · Periode: <span x-text="[data.periode.dari, data.periode.sampai].filter(Boolean).join(' s/d ')"></span></span>
            </template>
        </p>
    </div>

    {{-- Loading --}}
    <div x-show="loading" class="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm mb-5">
        <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p class="text-gray-400 text-sm">Memuat laporan...</p>
    </div>

    <div x-show="!loading && data">

        {{-- Summary Cards --}}
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <p class="text-2xl font-bold text-gray-900" x-text="data?.totalOrders || 0"></p>
                <p class="text-xs text-gray-400 mt-0.5">Total Order</p>
            </div>
            <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <p class="text-sm font-bold text-blue-700" x-text="'Rp ' + fmt(data?.grandTotal)"></p>
                <p class="text-xs text-gray-400 mt-0.5">Total Penjualan</p>
            </div>
            <div class="bg-white rounded-xl p-4 border border-blue-100 shadow-sm bg-blue-50">
                <p class="text-sm font-bold text-blue-800" x-text="'Rp ' + fmt(data?.divisi?.Elektronik?.total)"></p>
                <p class="text-xs text-blue-500 mt-0.5">⚡ Divisi Elektronik</p>
            </div>
            <div class="bg-white rounded-xl p-4 border border-orange-100 shadow-sm bg-orange-50">
                <p class="text-sm font-bold text-orange-800" x-text="'Rp ' + fmt(data?.divisi?.BahanBangunan?.total)"></p>
                <p class="text-xs text-orange-500 mt-0.5">🏗️ Bahan Bangunan</p>
            </div>
        </div>

        {{-- Peringatan Alamat --}}
        <div x-show="data?.alamatWarning > 0" class="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
            <svg class="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
            <div>
                <p class="text-sm font-semibold text-yellow-800">Potensi Alamat Tidak Valid</p>
                <p class="text-xs text-yellow-600 mt-0.5">
                    Ditemukan <span class="font-bold" x-text="data?.alamatWarning"></span> order dengan alamat mencurigakan (area Temanggung tapi tertulis Magelang).
                </p>
            </div>
        </div>

        {{-- ===== PER DIVISI ===== --}}
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm mb-5">
            <div class="px-5 py-4 border-b border-gray-100">
                <h2 class="font-bold text-gray-800">Rekap Per Divisi</h2>
            </div>
            <div class="divide-y divide-gray-50">
                <template x-for="[key, label, color, icon] in [
                    ['Elektronik',    'Elektronik',    'blue',   '⚡'],
                    ['BahanBangunan', 'Bahan Bangunan','orange', '🏗️'],
                    ['Campuran',      'Campuran',      'purple', '🔀'],
                ]" :key="key">
                    <div class="px-5 py-4">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-2">
                                <span x-text="icon" class="text-lg"></span>
                                <p class="font-semibold text-gray-800 text-sm" x-text="label"></p>
                                <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium"
                                    x-text="(data?.divisi?.[key]?.count || 0) + ' order'"></span>
                            </div>
                            <p class="font-bold text-gray-900 text-sm" x-text="'Rp ' + fmt(data?.divisi?.[key]?.total)"></p>
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div class="bg-green-50 rounded-lg px-3 py-2">
                                <p class="text-xs text-green-600 font-medium">Cash</p>
                                <p class="text-xs font-bold text-green-800 mt-0.5" x-text="'Rp ' + fmt(data?.divisi?.[key]?.cash)"></p>
                            </div>
                            <div class="bg-blue-50 rounded-lg px-3 py-2">
                                <p class="text-xs text-blue-600 font-medium">Transfer</p>
                                <p class="text-xs font-bold text-blue-800 mt-0.5" x-text="'Rp ' + fmt(data?.divisi?.[key]?.transfer)"></p>
                            </div>
                            <div class="bg-purple-50 rounded-lg px-3 py-2">
                                <p class="text-xs text-purple-600 font-medium">Debit/EDC</p>
                                <p class="text-xs font-bold text-purple-800 mt-0.5" x-text="'Rp ' + fmt(data?.divisi?.[key]?.debit)"></p>
                            </div>
                            <div class="bg-red-50 rounded-lg px-3 py-2">
                                <p class="text-xs text-red-500 font-medium">Belum Bayar</p>
                                <p class="text-xs font-bold text-red-700 mt-0.5" x-text="'Rp ' + fmt(data?.divisi?.[key]?.belumBayar)"></p>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        {{-- ===== KAS PER DIVISI ===== --}}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div class="px-5 py-4 border-b border-gray-100">
                    <h2 class="font-bold text-gray-800">💵 Posisi Kas (Cash)</h2>
                    <p class="text-xs text-gray-400 mt-0.5">Penerimaan cash dipetakan ke akun kas Kledo</p>
                </div>
                <div class="divide-y divide-gray-50">
                    <template x-for="kas in (data?.kas || [])" :key="kas.id">
                        <div class="px-5 py-4 flex items-center justify-between">
                            <div>
                                <p class="text-sm font-semibold text-gray-800" x-text="kas.label"></p>
                                <p class="text-xs text-gray-400">Akun Kas Kledo ID: <span x-text="kas.id" class="font-mono"></span></p>
                            </div>
                            <p class="font-bold text-gray-900" x-text="'Rp ' + fmt(kas.total)"></p>
                        </div>
                    </template>
                </div>
            </div>

            {{-- ===== TRANSFER PER BANK ===== --}}
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div class="px-5 py-4 border-b border-gray-100">
                    <h2 class="font-bold text-gray-800">🏦 Transfer Per Bank</h2>
                    <p class="text-xs text-gray-400 mt-0.5">Total transfer masuk ke masing-masing rekening</p>
                </div>
                <template x-if="data?.transferPerBank?.length === 0">
                    <div class="px-5 py-4 text-xs text-gray-400">Tidak ada data transfer</div>
                </template>
                <div class="divide-y divide-gray-50">
                    <template x-for="bank in (data?.transferPerBank || [])" :key="bank.id">
                        <div class="px-5 py-4 flex items-center justify-between">
                            <div>
                                <p class="text-sm font-semibold text-gray-800" x-text="bank.label"></p>
                                <p class="text-xs text-gray-400 font-mono">ID: <span x-text="bank.id"></span></p>
                            </div>
                            <p class="font-bold text-blue-700" x-text="'Rp ' + fmt(bank.total)"></p>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        {{-- ===== DEBIT / EDC ===== --}}
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm mb-5">
            <div class="px-5 py-4 border-b border-gray-100">
                <h2 class="font-bold text-gray-800">💳 Debit / EDC Per Mesin</h2>
                <p class="text-xs text-gray-400 mt-0.5">Total transaksi debit per mesin EDC</p>
            </div>
            <template x-if="data?.debitPerBank?.length === 0">
                <div class="px-5 py-4 text-xs text-gray-400">Tidak ada data debit/EDC</div>
            </template>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0 divide-y sm:divide-y-0">
                <template x-for="bank in (data?.debitPerBank || [])" :key="bank.id">
                    <div class="px-5 py-4 flex items-center justify-between border-b border-gray-50 sm:border-r last:border-r-0">
                        <div>
                            <p class="text-sm font-semibold text-gray-800" x-text="bank.label"></p>
                            <p class="text-xs text-gray-400 font-mono">ID: <span x-text="bank.id"></span></p>
                        </div>
                        <p class="font-bold text-purple-700" x-text="'Rp ' + fmt(bank.total)"></p>
                    </div>
                </template>
            </div>
        </div>

        {{-- Keterangan pemetaan kas --}}
        <div class="bg-gray-50 rounded-xl px-4 py-4 border border-gray-100 text-xs text-gray-500 space-y-1.5">
            <p class="font-semibold text-gray-600 text-sm mb-2">ℹ️ Aturan Pemetaan Kas Otomatis (Kledo)</p>
            <p>• <strong>CASH Elektronik</strong> → Kas Elektronik (ID 1) — dibayar tunai untuk produk kategori elektronik</p>
            <p>• <strong>CASH Bahan Bangunan</strong> → Kas Sulawesi (ID 1466) — dibayar tunai untuk produk BB / campuran</p>
            <p>• <strong>CASH Campuran</strong> → Diproporsikan: Elektronik ke Kas Elektronik, sisanya ke Kas Sulawesi</p>
            <p>• <strong>Transfer BCA Giro</strong> → Akun ID 1470 &nbsp;|&nbsp; <strong>Transfer BNI</strong> → ID 1456</p>
            <p>• <strong>Transfer Mandiri</strong> → Akun ID 3 &nbsp;|&nbsp; <strong>Transfer BRI</strong> → ID 1464</p>
            <p>• <strong>BCA EDC</strong> → ID 1465 &nbsp;|&nbsp; <strong>BRI EDC</strong> → ID 1457 &nbsp;|&nbsp; <strong>BNI EDC</strong> → ID 1458 &nbsp;|&nbsp; <strong>Mandiri EDC</strong> → ID 1459</p>
        </div>

    </div>

    {{-- Empty state --}}
    <div x-show="!loading && !data" class="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
        <svg class="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        <p class="text-gray-400 text-sm">Klik "Tampilkan" untuk memuat laporan</p>
    </div>

</div>

@push('scripts')
<script>
function laporanApp() {
    return {
        dari: '',
        sampai: '',
        loading: false,
        data: null,

        async init() {
            const today = new Date();
            const y = today.getFullYear();
            const m = String(today.getMonth() + 1).padStart(2, '0');
            this.dari   = `${y}-${m}-01`;
            this.sampai = `${y}-${m}-${String(today.getDate()).padStart(2, '0')}`;
            await this.load();
        },

        async load() {
            this.loading = true;
            this.data    = null;
            try {
                const params = new URLSearchParams();
                if (this.dari)   params.set('dari',   this.dari);
                if (this.sampai) params.set('sampai', this.sampai);
                const res  = await fetch('/api/laporan/divisi?' + params.toString());
                const json = await res.json();
                if (json.success) this.data = json;
            } catch(e) {
                console.error('Gagal memuat laporan:', e);
            } finally {
                this.loading = false;
            }
        },

        fmt(n) { return Number(n || 0).toLocaleString('id-ID'); },
    }
}
</script>
@endpush
@endsection
