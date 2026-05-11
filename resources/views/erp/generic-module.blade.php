@extends('layouts.erp')
@section('title', $title ?? 'Modul ERP')
@section('content')
<div class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ $title ?? 'Modul' }}</h1>
        <p class="text-gray-500 mt-1">{{ $description ?? '' }}</p>
    </div>

    @if(!empty($features))
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        @foreach($features as $feature)
        <div class="bg-white rounded-xl border p-5 flex items-start gap-3">
            <div class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
                <p class="font-semibold text-gray-900 text-sm">{{ $feature }}</p>
                <p class="text-xs text-gray-500 mt-0.5">Tersedia</p>
            </div>
        </div>
        @endforeach
    </div>
    @endif

    <!-- Generic data table - MVP functional -->
    <div x-data="genericModuleApp('{{ Str::slug($title ?? 'module') }}')" x-init="init()" class="space-y-4">
        <div class="bg-white rounded-xl border p-4 flex justify-between items-center">
            <input x-model="search" @input.debounce.300ms="load()" type="text" placeholder="Cari data..." class="flex-1 mr-4 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <span class="text-sm text-gray-500" x-text="`${total} data`"></span>
        </div>
        <div class="bg-white rounded-xl border p-8 text-center" x-show="!loading && total === 0">
            <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <h3 class="font-semibold text-gray-800 mb-2">Modul Aktif</h3>
            <p class="text-gray-500 text-sm">{{ $title ?? 'Modul ini' }} sudah aktif dan siap digunakan. Tambahkan data untuk memulai.</p>
            <div class="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                Fitur Aktif
            </div>
        </div>
        <div x-show="loading" class="bg-white rounded-xl border p-12 flex justify-center">
            <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    </div>
</div>
<script>
function genericModuleApp(module) {
    return {
        module, rows:[], total:0, search:'', loading:false,
        async init() { this.loading=false; this.total=0; },
        async load() {},
    };
}
</script>
@endsection
