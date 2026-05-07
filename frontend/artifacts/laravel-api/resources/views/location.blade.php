@extends('layouts.app')
@section('title', 'Bagikan Lokasi')

@section('content')
<div x-data="locationApp('{{ $token }}')" x-init="init()" class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">

        {{-- Loading --}}
        <div x-show="status === 'loading'" class="text-center py-8">
            <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-gray-600">Memuat informasi pesanan...</p>
        </div>

        {{-- Error --}}
        <div x-show="status === 'error'" class="text-center py-8">
            <div class="text-5xl mb-4">❌</div>
            <h2 class="text-lg font-bold text-gray-800 mb-2">Link Tidak Valid</h2>
            <p class="text-gray-500 text-sm" x-text="errorMsg"></p>
        </div>

        {{-- Ready --}}
        <div x-show="status === 'ready' || status === 'fetching-gps' || status === 'submitting'">
            <div class="text-center mb-6">
                <div class="text-5xl mb-3">📍</div>
                <h2 class="text-xl font-bold text-gray-800">Bagikan Lokasi Anda</h2>
                <p class="text-gray-500 text-sm mt-2">Untuk membantu driver menemukan lokasi pengiriman Anda</p>
            </div>

            <div class="bg-gray-50 rounded-xl p-4 mb-5">
                <p class="text-xs text-gray-500 mb-1">Pesanan untuk:</p>
                <p class="font-semibold text-gray-800" x-text="orderInfo.namaKontak"></p>
                <p class="text-sm text-gray-600 mt-1" x-text="orderInfo.alamat"></p>
            </div>

            <div x-show="status === 'ready'">
                <button @click="shareLocation()"
                    class="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    Bagikan Lokasi Saya
                </button>
            </div>

            <div x-show="status === 'fetching-gps'" class="text-center py-4">
                <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p class="text-gray-600 text-sm">Mendapatkan lokasi GPS...</p>
            </div>

            <div x-show="status === 'submitting'" class="text-center py-4">
                <div class="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p class="text-gray-600 text-sm">Mengirim lokasi...</p>
            </div>
        </div>

        {{-- Done --}}
        <div x-show="status === 'done'" class="text-center py-4">
            <div class="text-6xl mb-4">✅</div>
            <h2 class="text-xl font-bold text-gray-800 mb-2">Lokasi Terkirim!</h2>
            <p class="text-gray-500 text-sm mb-5">Terima kasih! Driver kami akan segera menuju lokasi Anda.</p>
            <template x-if="coords">
                <a :href="`https://maps.google.com/?q=${coords.lat},${coords.lng}`" target="_blank"
                    class="inline-flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    Lihat di Google Maps
                </a>
            </template>
        </div>

        <div x-show="errorMsg && status !== 'error'" class="mt-4 bg-red-50 text-red-600 text-sm rounded-lg p-3" x-text="errorMsg"></div>
    </div>
</div>

@push('scripts')
<script>
function locationApp(token) {
    return {
        token,
        status: 'loading',
        orderInfo: {},
        coords: null,
        errorMsg: '',

        async init() {
            try {
                const res = await fetch(`/api/orders/loc/${token}`);
                if (!res.ok) throw new Error('Pesanan tidak ditemukan');
                const data = await res.json();
                this.orderInfo = data;
                this.status = 'ready';
            } catch(e) {
                this.status = 'error';
                this.errorMsg = e.message || 'Link tidak valid atau sudah kadaluarsa';
            }
        },

        shareLocation() {
            if (!navigator.geolocation) {
                this.errorMsg = 'Browser Anda tidak mendukung GPS';
                return;
            }
            this.status = 'fetching-gps';
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    this.coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    this.status = 'submitting';
                    try {
                        const res = await fetch(`/api/orders/loc/${this.token}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(this.coords),
                        });
                        if (!res.ok) throw new Error('Gagal mengirim lokasi');
                        this.status = 'done';
                    } catch(e) {
                        this.status = 'ready';
                        this.errorMsg = 'Gagal mengirim lokasi. Coba lagi.';
                    }
                },
                (err) => {
                    this.status = 'ready';
                    this.errorMsg = 'Tidak dapat mengakses GPS. Pastikan izin lokasi diaktifkan.';
                },
                { enableHighAccuracy: true, timeout: 15000 }
            );
        }
    }
}
</script>
@endpush
@endsection
