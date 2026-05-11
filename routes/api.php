<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ErpModuleController;
use App\Modules\POS\Controllers\PosAuthController;
use App\Modules\POS\Controllers\PosDashboardController;
use App\Modules\POS\Controllers\PosProductController;
use App\Modules\POS\Controllers\PosCategoryController;
use App\Modules\POS\Controllers\PosCustomerController;
use App\Modules\POS\Controllers\PosSupplierController;
use App\Modules\POS\Controllers\PosSaleController;
use App\Modules\POS\Controllers\PosPurchaseController;
use App\Modules\POS\Controllers\PosInventoryController;
use App\Modules\POS\Controllers\PosReportController;
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
use App\Http\Controllers\StockOpnameController;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/sales', [SalesController::class, 'index']);

Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);
Route::get('/products/brands', [ProductController::class, 'brands']);
Route::post('/products/stok', [ProductController::class, 'updateStok']);

Route::get('/orders', [OrderController::class, 'index']);
Route::get('/orders/summary', [OrderController::class, 'summary']);
Route::get('/orders/{id}', [OrderController::class, 'show'])->where('id', '[0-9]+');
Route::post('/orders', [OrderController::class, 'store']);
Route::delete('/orders/{id}', [OrderController::class, 'destroy']);
Route::post('/orders/{id}/foto', [OrderController::class, 'uploadFoto']);
Route::patch('/orders/{id}/pengiriman', [OrderController::class, 'updatePengiriman']);

Route::get('/orders/loc/{token}', [OrderController::class, 'getLocation']);
Route::post('/orders/loc/{token}', [OrderController::class, 'saveLocation']);

Route::get('/orders/{orderId}/bukti-tf', [OrderController::class, 'buktiTf']);
Route::get('/orders/{orderId}/bukti-tf/{index}', [OrderController::class, 'buktiTfByIndex']);
Route::post('/orders/{orderId}/resend-kledo', [OrderController::class, 'resendKledo']);

Route::get('/kledo/contacts', [KledoController::class, 'contacts']);
Route::get('/kledo/products/with-stock', [KledoController::class, 'productsWithStock']);
Route::get('/kledo/products/{id}', [KledoController::class, 'productDetail']);
Route::get('/kledo/products', [KledoController::class, 'products']);
Route::get('/kledo/spm-brands', [KledoController::class, 'spmBrands']);
Route::get('/kledo/laporan-penjualan', [KledoController::class, 'laporanPenjualan']);
Route::post('/kledo/auto-sync', [KledoSyncController::class, 'autoSync']);

Route::get('/stock-opname/search-product', [StockOpnameController::class, 'searchProduct']);
Route::post('/stock-opname', [StockOpnameController::class, 'store']);

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

// Customer Management
Route::get('/customers/summary', [App\Http\Controllers\CustomerController::class, 'summary']);
Route::get('/customers', [App\Http\Controllers\CustomerController::class, 'index']);
Route::get('/customers/{id}', [App\Http\Controllers\CustomerController::class, 'show'])->where('id', '[0-9]+');
Route::post('/customers', [App\Http\Controllers\CustomerController::class, 'store']);
Route::put('/customers/{id}', [App\Http\Controllers\CustomerController::class, 'update'])->where('id', '[0-9]+');
Route::delete('/customers/{id}', [App\Http\Controllers\CustomerController::class, 'destroy'])->where('id', '[0-9]+');

// ═══════════════════════════════════════════════════════════════
// POS SYSTEM — /api/pos/*
// ═══════════════════════════════════════════════════════════════
Route::prefix('pos')->group(function () {
    // Auth (public)
    Route::post('/auth/login', [PosAuthController::class, 'login']);

    // Protected routes (Sanctum token)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me',     [PosAuthController::class, 'me']);
        Route::post('/auth/logout',[PosAuthController::class, 'logout']);

        // Dashboard
        Route::get('/dashboard/summary',             [PosDashboardController::class, 'summary']);
        Route::get('/dashboard/chart',               [PosDashboardController::class, 'chart']);
        Route::get('/dashboard/top-products',        [PosDashboardController::class, 'topProducts']);
        Route::get('/dashboard/recent-transactions', [PosDashboardController::class, 'recentTransactions']);
        Route::get('/dashboard/monthly-revenue',     [PosDashboardController::class, 'monthlyRevenue']);

        // Products
        Route::get('/products/search',           [PosProductController::class, 'search']);
        Route::get('/products/low-stock',        [PosProductController::class, 'lowStock']);
        Route::post('/products/{id}/barcode',    [PosProductController::class, 'generateBarcode']);
        Route::apiResource('/products', PosProductController::class);

        // Categories & lookup tables
        Route::get('/categories',     [PosCategoryController::class, 'index']);
        Route::get('/categories/all', [PosCategoryController::class, 'all']);
        Route::post('/categories',    [PosCategoryController::class, 'store']);
        Route::put('/categories/{id}',[PosCategoryController::class, 'update']);
        Route::delete('/categories/{id}',[PosCategoryController::class, 'destroy']);
        Route::get('/categories/units',      [PosCategoryController::class, 'units']);
        Route::get('/categories/price-tiers',[PosCategoryController::class, 'priceTiers']);
        Route::get('/categories/warehouses', [PosCategoryController::class, 'warehouses']);

        // Customers
        Route::get('/customers/search',          [PosCustomerController::class, 'search']);
        Route::get('/customers/{id}/history',    [PosCustomerController::class, 'purchaseHistory']);
        Route::apiResource('/customers', PosCustomerController::class);

        // Suppliers
        Route::apiResource('/suppliers', PosSupplierController::class);

        // Sales / Kasir
        Route::get('/sales/held',       [PosSaleController::class, 'heldTransactions']);
        Route::post('/sales/hold',      [PosSaleController::class, 'holdTransaction']);
        Route::delete('/sales/held/{id}',[PosSaleController::class, 'releaseHold']);
        Route::post('/sales/{id}/cancel',[PosSaleController::class, 'cancel']);
        Route::apiResource('/sales', PosSaleController::class)->only(['index', 'show', 'store']);

        // Purchases
        Route::post('/purchases/{id}/receive', [PosPurchaseController::class, 'receive']);
        Route::apiResource('/purchases', PosPurchaseController::class)->only(['index', 'show', 'store']);

        // Inventory
        Route::get('/inventory/warehouses', [PosInventoryController::class, 'warehouses']);
        Route::get('/inventory/stock',      [PosInventoryController::class, 'stockByWarehouse']);
        Route::get('/inventory/stock-value',[PosInventoryController::class, 'stockValue']);
        Route::post('/inventory/adjust',    [PosInventoryController::class, 'adjust']);
        Route::get('/inventory/{productId}/movements',[PosInventoryController::class, 'movements']);

        // Reports
        Route::get('/reports/sales',        [PosReportController::class, 'sales']);
        Route::get('/reports/stock',        [PosReportController::class, 'stock']);
        Route::get('/reports/receivables',  [PosReportController::class, 'receivables']);
        Route::get('/reports/payables',     [PosReportController::class, 'payables']);
        Route::get('/reports/cashier',      [PosReportController::class, 'cashier']);
    });
});

// ═══════════════════════════════════════════════════════════════
// ERP MODULE APIs — /api/erp/*
// ═══════════════════════════════════════════════════════════════
Route::prefix('erp')->group(function () {
    $c = ErpModuleController::class;

    // Suppliers
    Route::get('/suppliers/summary', [$c, 'suppliersSummary']);
    Route::get('/suppliers', [$c, 'suppliersIndex']);
    Route::post('/suppliers', [$c, 'suppliersStore']);
    Route::put('/suppliers/{id}', [$c, 'suppliersUpdate']);
    Route::delete('/suppliers/{id}', [$c, 'suppliersDestroy']);

    // Purchase Orders
    Route::get('/purchase-orders/summary', [$c, 'purchaseOrdersSummary']);
    Route::get('/purchase-orders', [$c, 'purchaseOrdersIndex']);
    Route::post('/purchase-orders', [$c, 'purchaseOrdersStore']);
    Route::put('/purchase-orders/{id}', [$c, 'purchaseOrdersUpdate']);
    Route::delete('/purchase-orders/{id}', [$c, 'purchaseOrdersDestroy']);

    // Cash Transactions (masuk & keluar)
    Route::get('/cash', [$c, 'cashIndex']);
    Route::post('/cash', [$c, 'cashStore']);
    Route::delete('/cash/{id}', [$c, 'cashDestroy']);

    // Expenses
    Route::get('/expenses', [$c, 'expensesIndex']);
    Route::post('/expenses', [$c, 'expensesStore']);
    Route::delete('/expenses/{id}', [$c, 'expensesDestroy']);

    // Employees
    Route::get('/employees/summary', [$c, 'employeesSummary']);
    Route::get('/employees', [$c, 'employeesIndex']);
    Route::post('/employees', [$c, 'employeesStore']);
    Route::put('/employees/{id}', [$c, 'employeesUpdate']);
    Route::delete('/employees/{id}', [$c, 'employeesDestroy']);

    // Attendance
    Route::get('/attendance', [$c, 'attendanceIndex']);
    Route::post('/attendance', [$c, 'attendanceStore']);
    Route::delete('/attendance/{id}', [$c, 'attendanceDestroy']);

    // Returns
    Route::get('/returns', [$c, 'returnsIndex']);
    Route::post('/returns', [$c, 'returnsStore']);
    Route::put('/returns/{id}', [$c, 'returnsUpdate']);
    Route::delete('/returns/{id}', [$c, 'returnsDestroy']);

    // Promos
    Route::get('/promos', [$c, 'promosIndex']);
    Route::post('/promos', [$c, 'promosStore']);
    Route::put('/promos/{id}', [$c, 'promosUpdate']);
    Route::delete('/promos/{id}', [$c, 'promosDestroy']);

    // Stock Mutations
    Route::get('/stock-mutations', [$c, 'stockMutationsIndex']);
    Route::post('/stock-mutations', [$c, 'stockMutationsStore']);
    Route::delete('/stock-mutations/{id}', [$c, 'stockMutationsDestroy']);

    // Analytics
    Route::get('/analytics/summary', [$c, 'analyticsSummary']);
    Route::get('/profit-loss', [$c, 'profitLoss']);

    // Quotations
    Route::get('/quotations', [$c, 'quotationsIndex']);
    Route::post('/quotations', [$c, 'quotationsStore']);
    Route::delete('/quotations/{id}', [$c, 'quotationsDestroy']);

    // Payroll
    Route::get('/payroll', [$c, 'payrollIndex']);
    Route::post('/payroll', [$c, 'payrollStore']);
    Route::put('/payroll/{id}', [$c, 'payrollUpdate']);
    Route::delete('/payroll/{id}', [$c, 'payrollDestroy']);

    // Delivery Proofs
    Route::get('/delivery-proofs', [$c, 'deliveryProofsIndex']);
    Route::put('/delivery-proofs/{id}', [$c, 'deliveryProofsUpdate']);

    // WA Logs
    Route::get('/wa-logs', [$c, 'waLogsIndex']);

    // Chart of Accounts
    Route::get('/coa', [$c, 'coaIndex']);
    Route::post('/coa', [$c, 'coaStore']);
    Route::put('/coa/{id}', [$c, 'coaUpdate']);
    Route::delete('/coa/{id}', [$c, 'coaDestroy']);

    // Reports
    Route::get('/report/sales', [$c, 'reportSales']);
    Route::get('/report/finance', [$c, 'reportFinance']);
    Route::get('/report/driver', [$c, 'reportDriver']);

    // Sales Targets
    Route::get('/sales-targets', [$c, 'salesTargetsIndex']);
    Route::post('/sales-targets', [$c, 'salesTargetsStore']);
    Route::delete('/sales-targets/{id}', [$c, 'salesTargetsDestroy']);
});
