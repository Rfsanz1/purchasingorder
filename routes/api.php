<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\KledoController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\DriverAreaController;
use App\Http\Controllers\SystemController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\KledoSyncController;
use App\Http\Controllers\RiwayatPenjualanController;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/sales', [SalesController::class, 'index']);

Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);
Route::get('/products/brands', [ProductController::class, 'brands']);
Route::post('/products/stok', [ProductController::class, 'updateStok']);

Route::get('/orders', [OrderController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store']);
Route::delete('/orders/{id}', [OrderController::class, 'destroy']);
Route::post('/orders/{id}/foto', [OrderController::class, 'uploadFoto']);
Route::patch('/orders/{id}/pengiriman', [OrderController::class, 'updatePengiriman']);

Route::get('/orders/loc/{token}', [OrderController::class, 'getLocation']);
Route::post('/orders/loc/{token}', [OrderController::class, 'saveLocation']);

Route::get('/orders/{orderId}/bukti-tf', [OrderController::class, 'buktiTf']);
Route::get('/orders/{orderId}/bukti-tf/{index}', [OrderController::class, 'buktiTfByIndex']);

Route::get('/kledo/contacts', [KledoController::class, 'contacts']);
Route::get('/kledo/products/with-stock', [KledoController::class, 'productsWithStock']);
Route::get('/kledo/products/{id}', [KledoController::class, 'productDetail']);
Route::get('/kledo/products', [KledoController::class, 'products']);
Route::get('/kledo/spm-brands', [KledoController::class, 'spmBrands']);
Route::get('/kledo/laporan-penjualan', [KledoController::class, 'laporanPenjualan']);

// Sinkronisasi Kledo ↔ ERP
Route::post('/kledo/sync',              [KledoSyncController::class, 'sync']);
Route::post('/kledo/import-sales',      [KledoSyncController::class, 'importSales']);
Route::get('/kledo/sync/status',        [KledoSyncController::class, 'status']);
Route::get('/kledo/sync/penjualan',     [KledoSyncController::class, 'penjualan']);
Route::get('/kledo/memo-sales',         [KledoSyncController::class, 'memoSales']);
Route::get('/kledo/memo-sales/all',     [KledoSyncController::class, 'allMemoSales']);
Route::get('/kledo/token-status',       [KledoSyncController::class, 'tokenStatus']);

Route::get('/settings', [SettingsController::class, 'index']);
Route::put('/settings', [SettingsController::class, 'update']);

// Integrasi pihak ketiga
Route::get('/integrasi',                  [\App\Http\Controllers\IntegrasiController::class, 'index']);
Route::post('/integrasi/{id}/update',     [\App\Http\Controllers\IntegrasiController::class, 'update']);
Route::post('/integrasi/{id}/test',       [\App\Http\Controllers\IntegrasiController::class, 'test']);
Route::delete('/integrasi/{id}/reset',    [\App\Http\Controllers\IntegrasiController::class, 'reset']);

Route::get('/driver-areas', [DriverAreaController::class, 'index']);
Route::put('/driver-areas', [DriverAreaController::class, 'update']);

Route::get('/system/health-check', [SystemController::class, 'healthCheck']);

Route::get('/laporan/divisi', [LaporanController::class, 'divisi']);

// Riwayat Penjualan
Route::get('/riwayat-penjualan/summary', [RiwayatPenjualanController::class, 'summary']);
Route::get('/riwayat-penjualan/export',  [RiwayatPenjualanController::class, 'export']);
Route::get('/riwayat-penjualan/{id}',    [RiwayatPenjualanController::class, 'show'])->where('id', '[0-9]+');
Route::get('/riwayat-penjualan',         [RiwayatPenjualanController::class, 'index']);
