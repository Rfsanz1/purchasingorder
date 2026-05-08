<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Shopee Admin · Gentong Mas</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-gradient-to-br from-orange-50 to-amber-50 min-h-screen flex items-center justify-center p-4">

<div class="w-full max-w-sm">

    {{-- Logo --}}
    <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl shadow-lg mb-4">
            <svg class="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6H5C3.9 6 3 6.9 3 8v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7 3c1.9 0 3.5 1.3 3.9 3H8.1C8.5 10.3 10.1 9 12 9zm5 9H7v-1.5c0-1.4 2.7-2.5 5-2.5s5 1.1 5 2.5V18z"/>
            </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Shopee Admin</h1>
        <p class="text-gray-500 text-sm mt-1">Masuk dengan password ERP</p>
    </div>

    {{-- Card --}}
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

        @if(session('success'))
            <div class="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
                {{ session('success') }}
            </div>
        @endif

        @if(session('error'))
            <div class="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {{ session('error') }}
            </div>
        @endif

        @if($errors->any())
            <div class="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {{ $errors->first() }}
            </div>
        @endif

        <form method="POST" action="/shopee/login" class="space-y-5">
            @csrf

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Password Admin ERP</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Masukkan password admin"
                    required
                    autofocus
                    class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition @error('password') border-red-400 @enderror"
                >
                <p class="text-xs text-gray-400 mt-1.5">Gunakan password yang sama dengan login ERP admin.</p>
            </div>

            <button
                type="submit"
                class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm text-sm"
            >
                Masuk ke Shopee Admin
            </button>
        </form>
    </div>

    <div class="text-center mt-6 space-y-2">
        <a href="/" class="text-xs text-gray-400 hover:text-gray-600 underline">← Kembali ke ERP</a>
        <p class="text-xs text-gray-300">Shopee Admin · Gentong Mas ERP</p>
    </div>
</div>

</body>
</html>
