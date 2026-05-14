@extends('layouts.erp')

@section('title', 'Install Aplikasi - ERP Gentong Mas')

@section('content')
<div class="max-w-2xl mx-auto px-4 py-8">

    {{-- Header --}}
    <div class="text-center mb-8">
        <div class="w-24 h-24 bg-blue-600 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-xl">
            <svg class="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Install ERP Gentong Mas</h1>
        <p class="text-gray-500 mt-2">Pasang sebagai aplikasi di HP atau komputer kamu</p>
    </div>

    {{-- Install Button (shows if installable) --}}
    <div id="install-section" class="hidden bg-blue-600 text-white rounded-2xl p-6 mb-6 text-center">
        <svg class="w-10 h-10 mx-auto mb-3 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        <h2 class="text-lg font-bold mb-1">Siap Diinstall!</h2>
        <p class="text-blue-100 text-sm mb-4">Klik tombol di bawah untuk install langsung ke HP kamu</p>
        <button id="install-btn-main"
            class="bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm">
            📲 Install Sekarang
        </button>
    </div>

    {{-- Already Installed --}}
    <div id="installed-section" class="hidden bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 text-center">
        <div class="text-3xl mb-2">✅</div>
        <p class="font-semibold text-green-800">Aplikasi sudah terinstall!</p>
        <p class="text-green-600 text-sm mt-1">Cari "Gentong Mas" di layar home kamu</p>
    </div>

    {{-- Steps for Android --}}
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
        <div class="bg-green-500 px-5 py-3 flex items-center gap-2">
            <span class="text-2xl">🤖</span>
            <h2 class="font-bold text-white">Android (Chrome)</h2>
        </div>
        <div class="p-5 space-y-4">
            @foreach([
                ['1', 'Buka web ini di browser Chrome Android'],
                ['2', 'Tap ikon tiga titik (⋮) di pojok kanan atas Chrome'],
                ['3', 'Pilih "Tambahkan ke layar utama" atau "Install App"'],
                ['4', 'Tap "Install" / "Tambahkan" pada dialog yang muncul'],
                ['5', 'Aplikasi muncul di home screen seperti app biasa! 🎉'],
            ] as [$num, $text])
            <div class="flex items-start gap-3">
                <div class="w-7 h-7 bg-green-100 text-green-700 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">{{ $num }}</div>
                <p class="text-gray-700 text-sm pt-0.5">{{ $text }}</p>
            </div>
            @endforeach
        </div>
    </div>

    {{-- Steps for iPhone --}}
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
        <div class="bg-gray-800 px-5 py-3 flex items-center gap-2">
            <span class="text-2xl">🍎</span>
            <h2 class="font-bold text-white">iPhone / iPad (Safari)</h2>
        </div>
        <div class="p-5 space-y-4">
            @foreach([
                ['1', 'Buka web ini di Safari (browser bawaan iPhone)'],
                ['2', 'Tap ikon Share (kotak dengan panah ke atas ↑) di bagian bawah'],
                ['3', 'Scroll ke bawah, pilih "Add to Home Screen"'],
                ['4', 'Ubah nama jika mau, lalu tap "Add" di kanan atas'],
                ['5', 'Aplikasi muncul di home screen! 🎉'],
            ] as [$num, $text])
            <div class="flex items-start gap-3">
                <div class="w-7 h-7 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">{{ $num }}</div>
                <p class="text-gray-700 text-sm pt-0.5">{{ $text }}</p>
            </div>
            @endforeach
        </div>
    </div>

    {{-- Steps for Desktop --}}
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div class="bg-blue-700 px-5 py-3 flex items-center gap-2">
            <span class="text-2xl">💻</span>
            <h2 class="font-bold text-white">Desktop (Chrome / Edge)</h2>
        </div>
        <div class="p-5 space-y-4">
            @foreach([
                ['1', 'Buka web ini di Chrome atau Edge'],
                ['2', 'Lihat ikon install (⊕) di address bar kanan atas'],
                ['3', 'Klik ikon tersebut lalu klik "Install"'],
                ['4', 'Aplikasi terbuka di jendela tersendiri seperti desktop app! 🎉'],
            ] as [$num, $text])
            <div class="flex items-start gap-3">
                <div class="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">{{ $num }}</div>
                <p class="text-gray-700 text-sm pt-0.5">{{ $text }}</p>
            </div>
            @endforeach
        </div>
    </div>

    {{-- Fitur yang didapat --}}
    <div class="bg-gradient-to-br from-slate-900 to-blue-900 text-white rounded-2xl p-5 mb-6">
        <h3 class="font-bold mb-4 text-center">✨ Setelah Install, Kamu Dapat:</h3>
        <div class="grid grid-cols-2 gap-3">
            @foreach([
                ['🚀', 'Buka langsung tanpa browser'],
                ['📴', 'Bisa dibuka walau sinyal lemah'],
                ['🔔', 'Notifikasi order & tagihan'],
                ['⚡', 'Loading lebih cepat'],
                ['🖥️', 'Fullscreen tanpa address bar'],
                ['📱', 'Ikon di home screen HP'],
            ] as [$icon, $label])
            <div class="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2.5">
                <span class="text-xl">{{ $icon }}</span>
                <span class="text-xs font-medium">{{ $label }}</span>
            </div>
            @endforeach
        </div>
    </div>

    {{-- QR Code section --}}
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center">
        <h3 class="font-semibold text-gray-800 mb-2">Bagikan ke Tim</h3>
        <p class="text-gray-500 text-sm mb-4">Salin link ini dan bagikan ke seluruh tim untuk install di HP masing-masing</p>
        <div class="flex items-center gap-2 bg-gray-50 rounded-xl p-3 border border-gray-200">
            <input type="text" id="app-url" value="{{ url('/erp/dashboard') }}" readonly
                class="flex-1 bg-transparent text-sm text-gray-700 outline-none truncate">
            <button onclick="copyUrl()" class="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0">
                Salin
            </button>
        </div>
        <p id="copy-msg" class="text-green-600 text-xs mt-2 hidden">✓ Link berhasil disalin!</p>
    </div>

</div>

<script>
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('install-section').classList.remove('hidden');
});

window.addEventListener('appinstalled', () => {
    document.getElementById('install-section').classList.add('hidden');
    document.getElementById('installed-section').classList.remove('hidden');
});

if (window.matchMedia('(display-mode: standalone)').matches) {
    document.getElementById('installed-section').classList.remove('hidden');
}

document.getElementById('install-btn-main')?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
        document.getElementById('install-section').classList.add('hidden');
    }
    deferredPrompt = null;
});

function copyUrl() {
    const url = document.getElementById('app-url').value;
    navigator.clipboard.writeText(url).then(() => {
        const msg = document.getElementById('copy-msg');
        msg.classList.remove('hidden');
        setTimeout(() => msg.classList.add('hidden'), 2500);
    });
}
</script>
@endsection
