<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\KledoController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\DriverAreaController;
use App\Http\Controllers\SystemController;

Route::post('/auth/login', [AuthController::class, 'login']);

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
Route::get('/kledo/products', [KledoController::class, 'products']);

Route::get('/settings', [SettingsController::class, 'index']);
Route::put('/settings', [SettingsController::class, 'update']);

Route::get('/driver-areas', [DriverAreaController::class, 'index']);
Route::put('/driver-areas', [DriverAreaController::class, 'update']);

Route::get('/system/health-check', [SystemController::class, 'healthCheck']);
