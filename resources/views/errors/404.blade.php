@extends('layouts.app')

@section('title', 'Halaman Tidak Ditemukan - 404')

@section('content')
<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center">
        <!-- 404 Icon -->
        <div class="mb-8">
            <div class="relative">
                <div class="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
                    404
                </div>
                <!-- Decorative elements -->
                <div class="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
                <div class="absolute -bottom-2 -left-2 w-12 h-12 bg-pink-400 rounded-full opacity-20 animate-bounce" style="animation-delay: 0.5s;"></div>
            </div>
        </div>

        <!-- Error Message -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Oops! Halaman Tidak Ditemukan
            </h1>
            <p class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-4">
                Halaman yang Anda cari tidak tersedia atau mungkin telah dipindahkan.
            </p>

            <!-- Offline indicator -->
            <div class="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2 mb-6">
                <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
                <span class="text-red-700 dark:text-red-300 text-sm font-medium">
                    Tidak ada koneksi internet
                </span>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button onclick="window.history.back()"
                class="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                Kembali
            </button>

            <a href="/"
                class="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                Ke Beranda
            </a>
        </div>

        <!-- Additional Help -->
        <div class="mt-8 text-center">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Jika masalah berlanjut, hubungi tim support
            </p>
            <div class="flex justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                <span>📧 support@gentongmas.com</span>
                <span>📱 +62 812-3456-7890</span>
            </div>
        </div>

        <!-- Fun Element -->
        <div class="mt-8">
            <div class="inline-block animate-bounce">
                <span class="text-4xl">🤖</span>
            </div>
        </div>
    </div>
</div>

<style>
/* Custom animations for better UX */
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

.animate-float {
    animation: float 3s ease-in-out infinite;
}

/* Ensure smooth transitions */
* {
    transition: background-color 0.3s ease, color 0.3s ease;
}
</style>

<script>
// Auto redirect after 10 seconds if online
let onlineCheckInterval;

function checkOnline() {
    return navigator.onLine;
}

function handleOnlineStatus() {
    if (checkOnline()) {
        // If back online, redirect to home after 3 seconds
        setTimeout(() => {
            window.location.href = '/';
        }, 3000);
    }
}

// Check online status periodically
if (!checkOnline()) {
    onlineCheckInterval = setInterval(handleOnlineStatus, 2000);
}

// Listen for online event
window.addEventListener('online', () => {
    clearInterval(onlineCheckInterval);
    handleOnlineStatus();
});

// Cleanup
window.addEventListener('beforeunload', () => {
    if (onlineCheckInterval) {
        clearInterval(onlineCheckInterval);
    }
});
</script>
@endsection