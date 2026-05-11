@extends('layouts.erp')
@section('title', 'Stok Masuk')
@section('content')
<div x-data="stockApp('masuk')" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Stok Masuk</h1><p class="text-gray-500 mt-1">Pencatatan barang masuk ke gudang</p></div>
        <button @click="openCreate()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg> Input Stok Masuk
        </button>
    </div>
    @include('erp._stock-table')
</div>
@include('erp._stock-modal')
@include('erp._stock-script')
@endsection
