@extends('layouts.erp')
@section('title', 'Produk')

@section('content')
@include('erp.coming-soon', [
    'title' => 'Kelola Produk & Stok',
    'description' => 'Fitur manajemen produk dan stok SPM sedang dalam pengembangan dan akan segera tersedia.',
    'features' => [
        'Daftar produk dari Kledo ERP',
        'Manajemen stok SPM per brand',
        'Pencarian produk dengan autocomplete',
        'Sinkronisasi harga otomatis',
        'Laporan pergerakan stok',
    ]
])
@endsection
