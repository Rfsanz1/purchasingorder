@extends('layouts.erp')
@section('title', 'Login Shopee Admin')

@section('content')
<div class="flex-1 flex items-center justify-center bg-gray-50 min-h-full p-6">
    <div class="w-full max-w-md">

        {{-- Logo --}}
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl shadow-lg mb-4">
                <svg class="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6H5C3.9 6 3 6.9 3 8v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7 3c1.9 0 3.5 1.3 3.9 3H8.1C8.5 10.3 10.1 9 12 9zm5 9H7v-1.5c0-1.4 2.7-2.5 5-2.5s5 1.1 5 2.5V18z"/>
                </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-900">Shopee Admin Panel</h1>
            <p class="text-gray-500 text-sm mt-1">Masuk ke dashboard Shopee Anda</p>
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
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                    <input
                        type="text"
                        name="username"
                        value="{{ old('username') }}"
                        placeholder="Masukkan username"
                        required
                        autofocus
                        class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition @error('username') border-red-400 @enderror"
                    >
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Masukkan password"
                        required
                        class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition @error('password') border-red-400 @enderror"
                    >
                </div>

                <button
                    type="submit"
                    class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm text-sm"
                >
                    Masuk ke Shopee Admin
                </button>
            </form>
        </div>

        <p class="text-center text-xs text-gray-400 mt-6">Shopee Admin Panel · Gentong Mas ERP</p>
    </div>
</div>
@endsection
