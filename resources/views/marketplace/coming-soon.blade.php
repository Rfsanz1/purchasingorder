@extends('layouts.marketplace')

@section('title', $pageTitle . ' — ' . $platformInfo['name'])
@section('breadcrumb', $platformInfo['name'] . ' / ' . $pageTitle)

@section('content')
@php
$colorMap = [
    'orange' => ['bg'=>'bg-orange-500','light'=>'bg-orange-50','text'=>'text-orange-600','border'=>'border-orange-100','gradient'=>'from-orange-500 to-orange-400'],
    'teal'   => ['bg'=>'bg-teal-500',  'light'=>'bg-teal-50',  'text'=>'text-teal-600',  'border'=>'border-teal-100',  'gradient'=>'from-teal-500 to-teal-400'],
    'green'  => ['bg'=>'bg-green-500', 'light'=>'bg-green-50', 'text'=>'text-green-600', 'border'=>'border-green-100', 'gradient'=>'from-green-500 to-green-400'],
    'blue'   => ['bg'=>'bg-blue-500',  'light'=>'bg-blue-50',  'text'=>'text-blue-600',  'border'=>'border-blue-100',  'gradient'=>'from-blue-500 to-blue-400'],
    'purple' => ['bg'=>'bg-purple-500','light'=>'bg-purple-50','text'=>'text-purple-600','border'=>'border-purple-100','gradient'=>'from-purple-500 to-purple-400'],
    'gray'   => ['bg'=>'bg-gray-500',  'light'=>'bg-gray-50',  'text'=>'text-gray-600',  'border'=>'border-gray-100',  'gradient'=>'from-gray-500 to-gray-400'],
];
$c = $colorMap[$platformInfo['color']] ?? $colorMap['orange'];
@endphp

<div class="min-h-full flex flex-col items-center justify-center p-6">

    <div class="w-full max-w-lg">

        {{-- Icon --}}
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl {{ $c['light'] }} {{ $c['border'] }} border-2 mb-4 text-4xl shadow-sm">
                {{ $platformInfo['icon'] }}
            </div>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full {{ $c['light'] }} {{ $c['text'] }} {{ $c['border'] }} border text-xs font-bold uppercase tracking-wide mb-3">
                <span class="w-1.5 h-1.5 rounded-full {{ $c['bg'] }} animate-pulse"></span>
                {{ $platformInfo['name'] }}
            </div>
            <h1 class="text-2xl font-black text-gray-900 mb-2">{{ $pageTitle }}</h1>
            <div class="inline-flex items-center gap-2 bg-gradient-to-r {{ $c['gradient'] }} text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Coming Soon
            </div>
        </div>

        {{-- Card --}}
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-4">
            <p class="text-gray-500 text-sm text-center leading-relaxed mb-6">
                Halaman <strong class="text-gray-700">{{ $pageTitle }}</strong> untuk
                <strong class="text-gray-700">{{ $platformInfo['name'] }}</strong> sedang dalam pengembangan.
                Integrasi API marketplace akan segera tersedia.
            </p>

            {{-- Progress steps --}}
            <div class="space-y-3">
                @foreach([
                    ['Struktur halaman & navigasi','done'],
                    ['Desain UI & layout','done'],
                    ['Integrasi API marketplace','pending'],
                    ['Testing & deployment','pending'],
                ] as [$step,$status])
                <div class="flex items-center gap-3">
                    <div class="w-5 h-5 rounded-full flex items-center justify-center shrink-0
                        {{ $status === 'done' ? $c['light'].' '.$c['text'] : 'bg-gray-100 text-gray-400' }}">
                        @if($status === 'done')
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                        </svg>
                        @else
                        <div class="w-2 h-2 rounded-full bg-gray-300"></div>
                        @endif
                    </div>
                    <span class="text-sm {{ $status === 'done' ? 'text-gray-700 font-medium' : 'text-gray-400' }}">
                        {{ $step }}
                    </span>
                    @if($status === 'pending')
                    <span class="ml-auto text-xs bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full font-medium">
                        Menunggu
                    </span>
                    @endif
                </div>
                @endforeach
            </div>
        </div>

        {{-- Navigation --}}
        <div class="flex flex-col sm:flex-row gap-3">
            <a href="{{ route('marketplace.dashboard') }}"
                class="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                Dashboard
            </a>
            <a href="/marketplace/{{ $platform }}/dashboard"
                class="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 bg-gradient-to-r {{ $c['gradient'] }} shadow-sm">
                <span>{{ $platformInfo['name'] }} Overview</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
            </a>
        </div>
    </div>
</div>
@endsection
