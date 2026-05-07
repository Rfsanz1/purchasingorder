@extends('layouts.erp')
@section('title', $title ?? 'Coming Soon')

@section('content')
<div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
    <div class="max-w-md w-full text-center">

        {{-- Icon --}}
        <div class="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <svg class="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
            </svg>
        </div>

        {{-- Badge --}}
        <div class="inline-flex items-center gap-1.5 bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Dalam Pengembangan
        </div>

        {{-- Title --}}
        <h1 class="text-3xl font-bold text-gray-900 mb-3">{{ $title ?? 'Coming Soon' }}</h1>

        {{-- Description --}}
        <p class="text-gray-500 text-base leading-relaxed mb-8">
            {{ $description ?? 'Fitur ini sedang dalam pengembangan dan akan segera tersedia di sistem ERP ini.' }}
        </p>

        {{-- Feature list if provided --}}
        @if(!empty($features))
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 text-left">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Yang akan tersedia:</p>
            <ul class="space-y-2">
                @foreach($features as $f)
                <li class="flex items-center gap-2 text-sm text-gray-600">
                    <svg class="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/></svg>
                    {{ $f }}
                </li>
                @endforeach
            </ul>
        </div>
        @endif

        {{-- Back button --}}
        <a href="/" class="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            Kembali ke Dashboard
        </a>
    </div>
</div>
@endsection
