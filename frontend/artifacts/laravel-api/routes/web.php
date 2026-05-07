<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;

Route::get('/', [PageController::class, 'landing']);
Route::get('/po-form', [PageController::class, 'poForm']);
Route::get('/admin', [PageController::class, 'admin']);
Route::get('/driver', [PageController::class, 'driver']);
Route::get('/loc/{token}', [PageController::class, 'location']);
