@extends('layouts.shopee')
@section('title', 'Pesanan Shopee')

@section('breadcrumb')
    <svg class="w-3.5 h-3.5 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
    <span class="text-gray-600 truncate">Data Penjualan</span>
@endsection

@section('content')
<div x-data="shopeeOrders()" x-init="init()" class="p-4 md:p-6">

    {{-- Header --}}
    <div class="flex items-start justify-between mb-6 gap-4">
        <div>
            <h1 class="text-xl font-bold text-gray-900">Data Penjualan Shopee</h1>
            <p class="text-sm text-gray-400 mt-0.5">Import CSV dari Shopee Seller Center, lalu sinkronkan ke ERP</p>
        </div>
        <button @click="showImport = true"
            class="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/></svg>
            Import CSV
        </button>
    </div>

    {{-- Stats --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p class="text-2xl font-bold text-gray-900">{{ number_format($stats['total']) }}</p>
            <p class="text-xs text-gray-400 mt-0.5">Total Pesanan</p>
        </div>
        <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p class="text-2xl font-bold text-yellow-600">{{ number_format($stats['belum_sync']) }}</p>
            <p class="text-xs text-gray-400 mt-0.5">Belum Sync ke ERP</p>
        </div>
        <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p class="text-2xl font-bold text-green-600">{{ number_format($stats['sudah_sync']) }}</p>
            <p class="text-xs text-gray-400 mt-0.5">Sudah Sync ke ERP</p>
        </div>
        <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p class="text-2xl font-bold text-blue-600">Rp {{ number_format($stats['total_nilai'], 0, ',', '.') }}</p>
            <p class="text-xs text-gray-400 mt-0.5">Total Nilai</p>
        </div>
    </div>

    {{-- Aksi Bulk --}}
    @if($stats['belum_sync'] > 0)
    <div class="bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3 mb-4 flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-yellow-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <p class="text-sm text-yellow-800 font-medium">{{ $stats['belum_sync'] }} pesanan belum disinkronkan ke ERP</p>
        </div>
        <button @click="syncAll()"
            :disabled="syncing"
            class="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shrink-0">
            <span x-show="!syncing">Sync Semua ke ERP</span>
            <span x-show="syncing" class="flex items-center gap-1">
                <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Menyinkronkan...
            </span>
        </button>
    </div>
    @endif

    {{-- Success/Error Message --}}
    <div x-show="message" x-cloak
        :class="messageType === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'"
        class="border rounded-xl px-4 py-3 text-sm mb-4 flex items-center justify-between">
        <span x-text="message"></span>
        <button @click="message=''" class="text-current opacity-60 hover:opacity-100 ml-3">✕</button>
    </div>

    {{-- Tabel Pesanan --}}
    @if($orders->count() > 0)
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-gray-100 bg-gray-50">
                        <th class="text-left px-4 py-3 font-semibold text-gray-600 text-xs whitespace-nowrap">No. Pesanan</th>
                        <th class="text-left px-4 py-3 font-semibold text-gray-600 text-xs whitespace-nowrap">Produk</th>
                        <th class="text-left px-4 py-3 font-semibold text-gray-600 text-xs whitespace-nowrap">Pembeli</th>
                        <th class="text-right px-4 py-3 font-semibold text-gray-600 text-xs whitespace-nowrap">Total</th>
                        <th class="text-left px-4 py-3 font-semibold text-gray-600 text-xs whitespace-nowrap">Tanggal</th>
                        <th class="text-center px-4 py-3 font-semibold text-gray-600 text-xs whitespace-nowrap">Status ERP</th>
                        <th class="text-center px-4 py-3 font-semibold text-gray-600 text-xs whitespace-nowrap">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    @foreach($orders as $order)
                    <tr class="hover:bg-gray-50 transition-colors">
                        <td class="px-4 py-3">
                            <span class="font-mono text-xs text-gray-600">{{ $order->shopee_order_sn }}</span>
                        </td>
                        <td class="px-4 py-3 max-w-xs">
                            <p class="text-gray-800 text-xs line-clamp-2">{{ $order->product_name ?: '—' }}</p>
                            @if($order->qty > 1)
                                <span class="text-xs text-gray-400">×{{ $order->qty }}</span>
                            @endif
                        </td>
                        <td class="px-4 py-3">
                            <p class="text-gray-700 text-xs font-medium">{{ $order->recipient_name ?: $order->buyer_name ?: $order->buyer_username ?: '—' }}</p>
                            @if($order->phone)
                                <p class="text-gray-400 text-xs">{{ $order->phone }}</p>
                            @endif
                        </td>
                        <td class="px-4 py-3 text-right">
                            <span class="font-semibold text-gray-900 text-sm">Rp {{ number_format($order->total_amount, 0, ',', '.') }}</span>
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap">
                            <span class="text-xs text-gray-500">{{ $order->order_created_at ? $order->order_created_at->format('d/m/Y') : '—' }}</span>
                        </td>
                        <td class="px-4 py-3 text-center">
                            @if($order->synced_to_erp)
                                <span class="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                                    Sync
                                </span>
                            @else
                                <span class="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    Menunggu
                                </span>
                            @endif
                        </td>
                        <td class="px-4 py-3 text-center">
                            <div class="flex items-center justify-center gap-1">
                                @if(!$order->synced_to_erp)
                                <button @click="syncOne({{ $order->id }})"
                                    class="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                                    Sync
                                </button>
                                @endif
                                <button @click="hapus({{ $order->id }})"
                                    class="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">
                                    Hapus
                                </button>
                            </div>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        {{-- Pagination --}}
        @if($orders->hasPages())
        <div class="px-4 py-3 border-t border-gray-100">
            {{ $orders->links() }}
        </div>
        @endif
    </div>

    @else
    {{-- Empty state --}}
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <div class="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        </div>
        <h3 class="font-semibold text-gray-800 mb-2">Belum ada data penjualan</h3>
        <p class="text-sm text-gray-400 mb-6 max-w-sm mx-auto">Import file CSV dari Shopee Seller Center untuk mulai melihat data penjualan Shopee di ERP.</p>
        <div class="bg-orange-50 border border-orange-100 rounded-xl p-4 text-left max-w-sm mx-auto">
            <p class="text-xs font-semibold text-orange-700 mb-2">Cara export dari Shopee:</p>
            <ol class="text-xs text-orange-600 space-y-1 list-decimal list-inside">
                <li>Login ke <strong>Shopee Seller Center</strong></li>
                <li>Klik menu <strong>Pesanan Saya</strong></li>
                <li>Klik <strong>Export</strong> → pilih periode</li>
                <li>Download file CSV, lalu import di sini</li>
            </ol>
        </div>
        <button @click="showImport = true"
            class="mt-6 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors">
            Import CSV Sekarang
        </button>
    </div>
    @endif

    {{-- Modal Import CSV --}}
    <div x-show="showImport" x-cloak
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
        @click.self="showImport = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" @click.stop>

            <div class="flex items-center justify-between mb-5">
                <h3 class="font-bold text-gray-900">Import CSV Shopee</h3>
                <button @click="showImport = false" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>

            {{-- Info --}}
            <div class="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-5 text-xs text-blue-700 space-y-1">
                <p class="font-semibold">Format yang didukung:</p>
                <p>• CSV dari <strong>Shopee Seller Center → Pesanan → Export</strong></p>
                <p>• Kolom yang dideteksi otomatis: No. Pesanan, Produk, Pembeli, Total, dll.</p>
                <p>• Pesanan yang sudah ada akan diperbarui (tidak duplikat)</p>
            </div>

            {{-- Form --}}
            <form @submit.prevent="importFile()">
                <div class="mb-5">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Pilih File CSV</label>
                    <div class="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-orange-300 transition-colors cursor-pointer"
                        @click="$refs.fileInput.click()">
                        <svg class="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/></svg>
                        <p class="text-sm text-gray-500" x-text="fileName || 'Klik untuk pilih file CSV'"></p>
                        <p class="text-xs text-gray-400 mt-1">atau drag & drop di sini</p>
                    </div>
                    <input type="file" x-ref="fileInput" accept=".csv,.txt" class="hidden"
                        @change="fileName = $event.target.files[0]?.name">
                </div>

                <div class="flex gap-3">
                    <button type="button" @click="showImport = false"
                        class="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                        Batal
                    </button>
                    <button type="submit"
                        :disabled="importing || !$refs.fileInput?.files?.length"
                        class="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                        <span x-show="!importing">Import Sekarang</span>
                        <span x-show="importing" class="flex items-center justify-center gap-1">
                            <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                            Mengimport...
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </div>

</div>

@push('scripts')
<script>
function shopeeOrders() {
    return {
        showImport: false,
        importing: false,
        syncing: false,
        fileName: '',
        message: '',
        messageType: 'success',

        init() {},

        async importFile() {
            const fileInput = this.$refs.fileInput;
            if (!fileInput.files.length) return;
            this.importing = true;
            this.message = '';

            const form = new FormData();
            form.append('file', fileInput.files[0]);
            form.append('_token', document.querySelector('meta[name=csrf-token]')?.content || '{{ csrf_token() }}');

            try {
                const res  = await fetch('/shopee/import-csv', { method: 'POST', body: form });
                const json = await res.json();
                if (json.success) {
                    this.message = json.message;
                    this.messageType = 'success';
                    this.showImport = false;
                    this.fileName = '';
                    setTimeout(() => location.reload(), 1200);
                } else {
                    this.message = json.error || 'Import gagal.';
                    this.messageType = 'error';
                }
            } catch(e) {
                this.message = 'Terjadi kesalahan saat import.';
                this.messageType = 'error';
            } finally {
                this.importing = false;
            }
        },

        async syncAll() {
            if (!confirm('Sinkronkan semua pesanan yang belum tersync ke ERP?')) return;
            this.syncing = true;
            this.message = '';
            try {
                const res  = await fetch('/shopee/sync-to-erp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content || '{{ csrf_token() }}' },
                    body: JSON.stringify({ ids: [] }),
                });
                const json = await res.json();
                this.message = json.message;
                this.messageType = json.success ? 'success' : 'error';
                if (json.success) setTimeout(() => location.reload(), 1200);
            } catch(e) {
                this.message = 'Gagal sync ke ERP.';
                this.messageType = 'error';
            } finally {
                this.syncing = false;
            }
        },

        async syncOne(id) {
            this.message = '';
            try {
                const res  = await fetch('/shopee/sync-to-erp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content || '{{ csrf_token() }}' },
                    body: JSON.stringify({ ids: [id] }),
                });
                const json = await res.json();
                this.message = json.message;
                this.messageType = json.success ? 'success' : 'error';
                if (json.success) setTimeout(() => location.reload(), 1000);
            } catch(e) {
                this.message = 'Gagal sync.';
                this.messageType = 'error';
            }
        },

        async hapus(id) {
            if (!confirm('Hapus pesanan ini dari database lokal?')) return;
            try {
                const res  = await fetch(`/shopee/orders/${id}`, {
                    method: 'DELETE',
                    headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content || '{{ csrf_token() }}' },
                });
                const json = await res.json();
                if (json.success) location.reload();
            } catch(e) {}
        },
    };
}
</script>
@endpush
@endsection
