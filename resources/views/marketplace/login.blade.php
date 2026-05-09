<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login — Marketplace Gentong Mas</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .gradient-bg {
            background: linear-gradient(135deg, #ea580c 0%, #f97316 30%, #fb923c 60%, #c2410c 100%);
        }
        .glass-card {
            background: rgba(255,255,255,0.97);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
        }
        .input-field {
            width: 100%; padding: 11px 14px; border: 1.5px solid #e5e7eb;
            border-radius: 10px; font-size: 0.9rem; color: #111827;
            transition: border-color 0.15s, box-shadow 0.15s; outline: none;
            background: #fafafa;
        }
        .input-field:focus { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.12); background: #fff; }
        .btn-login {
            width: 100%; padding: 12px; background: linear-gradient(135deg, #ea580c, #f97316);
            color: #fff; font-weight: 700; font-size: 0.95rem; border-radius: 10px;
            border: none; cursor: pointer; transition: opacity 0.15s, transform 0.1s;
        }
        .btn-login:hover { opacity: 0.92; }
        .btn-login:active { transform: scale(0.99); }
        .btn-login:disabled { opacity: 0.6; cursor: not-allowed; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .float-anim { animation: float 3s ease-in-out infinite; }
    </style>
</head>
<body class="gradient-bg min-h-screen flex items-center justify-center p-4">

    <!-- Background decorations -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
    </div>

    <div class="w-full max-w-sm relative z-10">

        <!-- Logo -->
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl mb-4 float-anim border border-white/30 shadow-2xl">
                <span class="text-4xl">🛍️</span>
            </div>
            <h1 class="text-2xl font-black text-white tracking-tight">Marketplace</h1>
            <p class="text-orange-100 text-sm mt-1">Gentong Mas ERP System</p>
        </div>

        <!-- Card -->
        <div class="glass-card rounded-3xl shadow-2xl p-8 border border-white/20">

            <h2 class="text-xl font-bold text-gray-900 mb-1">Selamat Datang</h2>
            <p class="text-sm text-gray-500 mb-6">Login untuk mengakses Marketplace Dashboard</p>

            @if(session('error'))
            <div class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                {{ session('error') }}
            </div>
            @endif

            @if($errors->has('error'))
            <div class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                {{ $errors->first('error') }}
            </div>
            @endif

            <form method="POST" action="{{ route('marketplace.login.post') }}" id="loginForm">
                @csrf

                <div class="mb-4">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Role Akses</label>
                    <select name="role" class="input-field" required id="roleSelect">
                        <option value="">— Pilih role —</option>
                        <option value="super_admin" {{ old('role') === 'super_admin' ? 'selected' : '' }}>
                            👑 Super Admin (ERP + Marketplace)
                        </option>
                        <option value="admin_marketplace" {{ old('role') === 'admin_marketplace' ? 'selected' : '' }}>
                            🛍️ Admin Marketplace
                        </option>
                    </select>
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <div class="relative">
                        <input type="password" name="password" id="passwordInput"
                            class="input-field pr-10" placeholder="Masukkan password" required>
                        <button type="button" onclick="togglePassword()"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <svg id="eyeIcon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <button type="submit" class="btn-login" id="submitBtn">
                    <span id="btnText">Masuk ke Marketplace</span>
                </button>
            </form>

            <div class="mt-6 pt-5 border-t border-gray-100 text-center">
                <a href="/" class="text-sm text-gray-400 hover:text-orange-600 transition-colors inline-flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                    Kembali ke ERP Dashboard
                </a>
            </div>
        </div>

        <p class="text-center text-orange-200/70 text-xs mt-6">
            Gentong Mas ERP v1.0 — Marketplace Module
        </p>
    </div>

    <script>
        function togglePassword() {
            const input = document.getElementById('passwordInput');
            input.type = input.type === 'password' ? 'text' : 'password';
        }
        document.getElementById('loginForm').addEventListener('submit', function() {
            const btn = document.getElementById('submitBtn');
            const text = document.getElementById('btnText');
            btn.disabled = true;
            text.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;justify-content:center"><span style="width:16px;height:16px;border:2px solid rgba(255,255,255,0.4);border-top-color:#fff;border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block"></span>Masuk...</span>';
        });
    </script>
    <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
</body>
</html>
