@extends('layouts.erp')
@section('title', 'Asset Dashboard')
@section('content')
<div class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">Asset Dashboard</h1>
            <p class="text-gray-500 mt-1 text-sm">Ringkasan status asset dan kondisi maintenance.</p>
        </div>
        <div class="flex gap-2">
            <button class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Refresh</button>
            <button class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Tambah Asset</button>
        </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <div class="bg-white rounded-xl border p-5 shadow-sm">
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Jumlah Asset</p>
            <p class="mt-3 text-3xl font-bold text-gray-900">1,248</p>
            <p class="text-xs text-gray-400 mt-1">Total asset tetap terdaftar</p>
        </div>
        <div class="bg-white rounded-xl border p-5 shadow-sm">
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Asset Aktif</p>
            <p class="mt-3 text-3xl font-bold text-green-600">986</p>
            <p class="text-xs text-gray-400 mt-1">Asset siap digunakan</p>
        </div>
        <div class="bg-white rounded-xl border p-5 shadow-sm">
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Dalam Maintenance</p>
            <p class="mt-3 text-3xl font-bold text-orange-600">72</p>
            <p class="text-xs text-gray-400 mt-1">Scheduled maintenance</p>
        </div>
        <div class="bg-white rounded-xl border p-5 shadow-sm">
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Disposal</p>
            <p class="mt-3 text-3xl font-bold text-red-600">14</p>
            <p class="text-xs text-gray-400 mt-1">Asset yang sedang diproses</p>
        </div>
    </div>

    <div class="grid gap-4 xl:grid-cols-3">
        <section class="col-span-2 bg-white rounded-xl border shadow-sm p-5">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-gray-900">Top 5 Asset berdasarkan Nilai Buku</h2>
                <span class="text-xs text-gray-500">Update terakhir 1 jam lalu</span>
            </div>
            <div class="space-y-3">
                @foreach(['Truk Logistik','Mesin Press','Forklift','AC Industri','Server Rack'] as $asset)
                <div class="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-50">
                    <div>
                        <p class="font-semibold text-gray-800">{{ $asset }}</p>
                        <p class="text-xs text-gray-500">Nilai buku terhitung</p>
                    </div>
                    <p class="text-right text-sm font-bold text-gray-900">Rp 324.000.000</p>
                </div>
                @endforeach
            </div>
        </section>

        <section class="bg-white rounded-xl border shadow-sm p-5">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Maintenance Terdekat</h2>
            <div class="space-y-3">
                @foreach(['Forklift - 2026-05-18','Generator - 2026-05-20','Laptop IT - 2026-05-22'] as $item)
                <div class="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div class="flex justify-between items-center gap-2">
                        <p class="text-sm font-medium text-gray-800">{{ $item }}</p>
                        <span class="text-xs text-orange-600">Scheduled</span>
                    </div>
                </div>
                @endforeach
            </div>
        </section>
    </div>
</div>
@endsection
