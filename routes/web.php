<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;
use App\Http\Controllers\KledoController;
use App\Http\Controllers\Shopee\ShopeeController;
use App\Http\Controllers\MarketplaceController;

Route::get('/health', fn() => response()->json(['status' => 'ok']));

// Proxy ke mockup-sandbox vite server (port 23636) — hanya aktif di development
Route::any('/__mockup/{path?}', function ($path = '') {
    // Di production Vite dev server tidak berjalan — langsung return 404
    if (app()->environment('production')) {
        return response('Not available in production', 404);
    }
    $query = request()->getQueryString();
    $url = 'http://localhost:23636/__mockup/' . $path . ($query ? '?' . $query : '');
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HEADER         => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_CONNECTTIMEOUT => 2,
        CURLOPT_HTTPHEADER     => array_filter(array_map(function ($name, $vals) {
            if (in_array(strtolower($name), ['host', 'content-length'])) return null;
            return $name . ': ' . implode(', ', $vals);
        }, array_keys(request()->headers->all()), request()->headers->all())),
        CURLOPT_CUSTOMREQUEST  => request()->method(),
        CURLOPT_POSTFIELDS     => request()->getContent() ?: null,
    ]);
    $raw      = curl_exec($ch);
    $info     = curl_getinfo($ch);
    $hdrSize  = $info['header_size'];
    $status   = $info['http_code'] ?: 502;
    curl_close($ch);
    $headerStr = substr($raw, 0, $hdrSize);
    $body      = substr($raw, $hdrSize);
    $headers   = [];
    foreach (explode("\r\n", $headerStr) as $line) {
        if (str_contains($line, ':')) {
            [$k, $v] = explode(':', $line, 2);
            $k = trim($k);
            if (in_array(strtolower($k), ['transfer-encoding', 'content-encoding', 'connection'])) continue;
            $headers[$k] = trim($v);
        }
    }
    return response($body, $status)->withHeaders($headers);
})->where('path', '.*');
Route::get('/', [PageController::class, 'landing']);

// ===== SHOPEE ADMIN =====
Route::get('/shopee/login', [ShopeeController::class, 'loginPage'])->name('shopee.login');
Route::post('/shopee/login', [ShopeeController::class, 'login'])->name('shopee.login.post');
Route::get('/shopee/logout', [ShopeeController::class, 'logout'])->name('shopee.logout');
Route::middleware(\App\Http\Middleware\ShopeeAuth::class)->group(function () {
    Route::get('/shopee/dashboard', [ShopeeController::class, 'dashboard'])->name('shopee.dashboard');
    Route::get('/shopee/orders',    [ShopeeController::class, 'orders'])->name('shopee.orders');
    Route::post('/shopee/import-csv',   [ShopeeController::class, 'importCsv'])->name('shopee.import');
    Route::post('/shopee/sync-to-erp',  [ShopeeController::class, 'syncToErp'])->name('shopee.sync');
    Route::delete('/shopee/orders/{id}', [ShopeeController::class, 'deleteOrder'])->name('shopee.order.delete');

});

// ===== MARKETPLACE SYSTEM =====
Route::get('/marketplace', fn() => redirect()->route('marketplace.login'));
Route::get('/marketplace/login',  [MarketplaceController::class, 'loginPage'])->name('marketplace.login');
Route::post('/marketplace/login', [MarketplaceController::class, 'login'])->name('marketplace.login.post');
Route::get('/marketplace/logout', [MarketplaceController::class, 'logout'])->name('marketplace.logout');

Route::middleware('marketplace.auth')->group(function () {
    Route::get('/marketplace/dashboard', [MarketplaceController::class, 'dashboard'])->name('marketplace.dashboard');
    Route::get('/marketplace/{platform}/{page?}', [MarketplaceController::class, 'page'])->name('marketplace.page');
});

Route::get('/po-form', [PageController::class, 'poForm']);
Route::get('/admin', [PageController::class, 'admin']);
Route::get('/driver', [PageController::class, 'driver']);
Route::get('/loc/{token}', [PageController::class, 'location']);
Route::get('/products', [PageController::class, 'products']);
Route::get('/sales-dashboard', [PageController::class, 'salesDashboard']);
Route::get('/erp/invoice', [PageController::class, 'erpInvoice']);
Route::get('/erp/laporan-divisi', [PageController::class, 'laporanDivisi']);
Route::get('/erp/laporan-penjualan', [PageController::class, 'laporanPenjualan']);
Route::get('/erp/integrasi', [PageController::class, 'integrasi']);
Route::get('/erp/riwayat-penjualan', [PageController::class, 'riwayatPenjualan']);
Route::get('/erp/data-penjualan-kledo', [PageController::class, 'dataPenjualanKledo']);
Route::get('/erp/stock-opname', [PageController::class, 'stockOpname'])->name('erp.stock-opname');
Route::get('/stock-opname', function () {
    return redirect('/erp/stock-opname');
});
// /pos sekarang dihandle oleh React POS App (lihat bagian bawah file)
Route::get('/api/kledo/data-penjualan', [KledoController::class, 'dataPenjualan']);

// ═══════════════════════════════════════════════════════
// REAL ERP MODULE ROUTES — replace coming-soon entries
// ═══════════════════════════════════════════════════════
Route::get('/erp/supplier',       fn() => view('erp.supplier'));
Route::get('/erp/purchase-order', fn() => view('erp.purchase-order'));
Route::get('/erp/cash-in',        fn() => view('erp.cash', ['title' => 'Kas Masuk', 'jenis' => 'masuk']));
Route::get('/erp/cash-out',       fn() => view('erp.cash', ['title' => 'Kas Keluar', 'jenis' => 'keluar']));
Route::get('/erp/profit-loss',    fn() => view('erp.profit-loss'));
Route::get('/erp/expense',        fn() => view('erp.expense'));
Route::get('/erp/employees',      fn() => view('erp.employees'));
Route::get('/erp/attendance',     fn() => view('erp.attendance'));
Route::get('/erp/retur',          fn() => view('erp.retur'));
Route::get('/erp/discount',       fn() => view('erp.discount'));
Route::get('/erp/stock-in',       fn() => view('erp.stock-in'));
Route::get('/erp/stock-out',      fn() => view('erp.stock-out'));
Route::get('/erp/analytics',      fn() => view('erp.analytics'));
Route::get('/erp/report-sales',   fn() => view('erp.report-sales'));
Route::get('/erp/report-finance', fn() => view('erp.report-finance'));
Route::get('/erp/report-driver',  fn() => view('erp.report-driver'));
Route::get('/erp/notifications',  fn() => view('erp.wa-logs'));
Route::get('/erp/chart-of-accounts', fn() => view('erp.coa'));
Route::get('/erp/coa',               fn() => view('erp.coa'));
Route::get('/erp/payroll',        fn() => view('erp.payroll'));
Route::get('/erp/quotation',      fn() => view('erp.quotation'));
// Goods receipt → generic with features
Route::get('/erp/goods-receipt',  fn() => view('erp.generic-module', [
    'title' => 'Penerimaan Barang', 'description' => 'Konfirmasi penerimaan barang dari supplier',
    'features' => ['Input penerimaan', 'Verifikasi terhadap PO', 'Notifikasi admin', 'Update stok otomatis']
]));
// Warehouse
Route::get('/erp/warehouse', fn() => view('erp.generic-module', [
    'title' => 'Manajemen Gudang', 'description' => 'Kelola zona dan lokasi penyimpanan gudang',
    'features' => ['Daftar gudang', 'Transfer antar gudang', 'Kapasitas gudang', 'Peta gudang']
]));
// Delivery proof
Route::get('/erp/delivery-proof', fn() => view('erp.generic-module', [
    'title' => 'Bukti Pengiriman', 'description' => 'Dokumentasi foto bukti pengiriman ke customer',
    'features' => ['Upload foto bukti', 'Status pengiriman', 'GPS tracking', 'Laporan driver']
]));
// Loyalty
Route::get('/erp/loyalty', fn() => view('erp.generic-module', [
    'title' => 'Loyalty Points', 'description' => 'Program poin reward untuk pelanggan setia',
    'features' => ['Akumulasi poin', 'Redeem poin', 'Level membership', 'Riwayat poin']
]));
// Users
Route::get('/erp/users', fn() => view('erp.generic-module', [
    'title' => 'Manajemen User', 'description' => 'Kelola user, role, dan hak akses sistem',
    'features' => ['Tambah user', 'Assign role', 'Hak akses per menu', 'Activity log']
]));

// ─── Coming Soon routes (remaining unbuilt modules) ──────────────────────
$comingSoon = [
    // NOTE: paths already handled by dedicated routes above are intentionally excluded
    'erp/ai-inventory'    => ['AI Inventory', 'Prediksi stok dan reorder otomatis berbasis AI.', ['Prediksi kebutuhan stok', 'Auto reorder saat stok menipis', 'Analisis tren demand', 'Rekomendasi supplier']],
    'erp/ai-analytics'    => ['AI Analytics', 'Dashboard analitik prediktif berbasis AI.', ['Prediksi penjualan 30 hari', 'Rekomendasi produk top', 'Customer lifetime value', 'Anomaly detection']],
    'erp/multi-branch'    => ['Multi Cabang', 'Kelola beberapa toko/cabang dalam satu sistem.', ['Dashboard per cabang', 'Transfer stok antar cabang', 'Laporan konsolidasi', 'Hak akses per cabang']],
    'erp/payment-gateway' => ['Payment Gateway', 'Integrasi pembayaran online Midtrans / Stripe.', ['Link pembayaran otomatis', 'Konfirmasi pembayaran real-time', 'Refund otomatis', 'Rekonsiliasi transaksi']],
    'erp/mobile-sync'     => ['Mobile App Sync', 'Sinkronisasi data ke aplikasi Android / iOS.', ['Sinkronisasi real-time', 'Mode offline', 'Push notification', 'Scan barcode via kamera']],
    'erp/chatbot'         => ['Chatbot AI', 'Asisten customer service berbasis AI.', ['Auto-reply WhatsApp', 'Cek status order via WA', 'FAQ otomatis', 'Eskalasi ke human agent']],
    'erp/tax-accounting'  => ['Pajak & Akuntansi', 'Modul pajak otomatis dan laporan akuntansi lengkap.', ['Perhitungan PPN otomatis', 'Laporan SPT', 'Jurnal akuntansi', 'Integrasi e-Faktur']],
];

// ── AI-only paths (stay as Coming Soon) ──────────────────────────────────
$aiOnlyPaths = [
    'erp/chatbot', 'erp/chatbot-ai', 'erp/ai-inventory', 'erp/ai-analytics',
    'erp/workflow-automation', 'erp/forecasting', 'erp/marketplace-chat-ai',
    'erp/marketplace-ai-analytics', 'erp/approval-workflow',
];

// ── Dedicated functional module routes (registered before loops) ──────────
Route::get('/erp/supplier',            fn() => view('erp.supplier'));
Route::get('/erp/employees',           fn() => view('erp.employees'));
Route::get('/erp/purchase-order',      fn() => view('erp.purchase-order'));
Route::get('/erp/users',               fn() => view('erp.users'));
Route::get('/erp/roles',               fn() => view('erp.roles'));
Route::get('/erp/cash-in',             fn() => view('erp.cash-in'));
Route::get('/erp/cash-out',            fn() => view('erp.cash-out'));
Route::get('/erp/expense',             fn() => view('erp.expense'));
Route::get('/erp/profit-loss',         fn() => view('erp.profit-loss'));
Route::get('/erp/attendance',          fn() => view('erp.attendance'));
Route::get('/erp/payroll',             fn() => view('erp.payroll'));
Route::get('/erp/warehouse',           fn() => view('erp.warehouse'));
Route::get('/erp/analytics',           fn() => view('erp.analytics'));
Route::get('/erp/loyalty',             fn() => view('erp.loyalty'));
Route::get('/erp/service',             fn() => view('erp.service'));
Route::get('/erp/warranty',            fn() => view('erp.warranty'));
Route::get('/erp/marketplace-overview',fn() => view('erp.marketplace-overview'));
Route::get('/erp/marketplace-sync',    fn() => view('erp.marketplace-sync'));
Route::get('/erp/audit-log',           fn() => view('erp.audit-log'));
Route::get('/erp/chart-of-accounts',   fn() => view('erp.chart-of-accounts'));

foreach ($comingSoon as $path => [$title, $description, $features]) {
    $module = str_replace('erp/', '', $path);
    $isAi   = in_array($path, $aiOnlyPaths);
    Route::get('/' . $path, function () use ($isAi, $module, $title, $description, $features) {
        if ($isAi) return view('erp.coming-soon', compact('title', 'description', 'features'));
        return view('erp.module', compact('title', 'description', 'features', 'module'));
    });
}

// Active ERP routes
Route::get('/erp/customers', [PageController::class, 'customers'])->name('erp.customers');

// ===== NEW ERP MODULES - COMING SOON =====

// MASTER DATA
$masterDataComingSoon = [
    'erp/product-categories' => ['Kategori Produk', 'Manajemen kategori produk untuk mengorganisir inventory.', ['Tambah kategori', 'Sub-kategori', 'Kategori aktif/non-aktif']],
    'erp/brands' => ['Brand Produk', 'Database brand dan merek produk.', ['Daftar brand', 'Logo brand', 'Status brand']],
    'erp/units' => ['Satuan Barang', 'Manajemen satuan ukuran produk (pcs, kg, liter, dll).', ['Satuan dasar', 'Konversi satuan', 'Satuan aktif']],
    'erp/price-types' => ['Tipe Harga', 'Berbagai tipe harga jual (ecer, grosir, reseller).', ['Harga ecer', 'Harga grosir', 'Margin otomatis']],
    'erp/taxes' => ['Pajak', 'Konfigurasi pajak PPN, PPH, dan pajak lainnya.', ['PPN 11%', 'Pajak daerah', 'Pengecualian pajak']],
    'erp/branches' => ['Data Cabang', 'Manajemen multi-cabang dan lokasi toko.', ['Daftar cabang', 'Alamat cabang', 'Kontak cabang']],
    'erp/salesman' => ['Data Salesman', 'Database sales dan komisi penjualan.', ['Profil salesman', 'Target penjualan', 'Komisi otomatis']],
    'erp/payment-methods' => ['Metode Pembayaran', 'Konfigurasi cara pembayaran yang tersedia.', ['Transfer bank', 'Cash', 'E-wallet', 'Kredit']],
];

// AKUNTANSI — erp/chart-of-accounts handled by dedicated route above
$accountingComingSoon = [
    'erp/journal' => ['Jurnal Umum', 'Pencatatan jurnal transaksi harian.', ['Jurnal otomatis', 'Jurnal manual', 'Approval jurnal']],
    'erp/general-ledger' => ['Buku Besar', 'Laporan buku besar per akun.', ['Buku besar umum', 'Buku besar pembantu', 'Saldo akun']],
    'erp/balance-sheet' => ['Neraca', 'Laporan posisi keuangan perusahaan.', ['Aktiva lancar', 'Aktiva tetap', 'Pasiva', 'Ekuitas']],
    'erp/cash-flow' => ['Arus Kas', 'Laporan arus kas masuk dan keluar.', ['Arus kas operasi', 'Arus kas investasi', 'Arus kas pendanaan']],
    'erp/account-payable' => ['Hutang Supplier', 'Manajemen hutang kepada supplier.', ['Daftar hutang', 'Jatuh tempo', 'Pembayaran hutang']],
    'erp/account-receivable' => ['Piutang Customer', 'Manajemen piutang dari customer.', ['Daftar piutang', 'Jatuh tempo', 'Pengingat pembayaran']],
    'erp/bank-reconciliation' => ['Rekonsiliasi Bank', 'Pencocokan mutasi bank dengan pembukuan.', ['Mutasi bank', 'Pencocokan otomatis', 'Rekonsiliasi manual']],
];

// MANAJEMEN STOK
$inventoryComingSoon = [
    'erp/stock-mutation' => ['Mutasi Stok', 'Pencatatan perpindahan stok antar lokasi.', ['Mutasi masuk', 'Mutasi keluar', 'Riwayat mutasi']],
    'erp/warehouse-transfer' => ['Transfer Antar Gudang', 'Transfer stok antar gudang/cabang.', ['Transfer request', 'Approval transfer', 'Penerimaan transfer']],
    'erp/min-stock' => ['Minimum Stock Alert', 'Peringatan stok minimum dan reorder point.', ['Alert otomatis', 'Reorder point', 'Notifikasi stok rendah']],
    'erp/serial-number' => ['Serial Number / IMEI', 'Tracking produk dengan nomor seri.', ['Input serial number', 'Tracking per produk', 'Riwayat serial']],
    'erp/product-batch' => ['Batch Produk', 'Manajemen produk dengan batch/expired date.', ['Batch number', 'Expired date', 'FIFO tracking']],
    'erp/stock-history' => ['History Pergerakan Barang', 'Riwayat lengkap pergerakan inventory.', ['Stok masuk', 'Stok keluar', 'Adjustment stok']],
];

// PURCHASE FLOW
$purchaseFlowComingSoon = [
    'erp/purchase-request' => ['Permintaan Pembelian', 'Request pembelian dari departemen.', ['Buat PR', 'Approval PR', 'Konversi ke PO']],
    'erp/purchase-approval' => ['Approval Purchase', 'Workflow approval untuk pembelian.', ['Multi-level approval', 'Reject dengan alasan', 'History approval']],
    'erp/supplier-invoice' => ['Invoice Supplier', 'Pencatatan invoice dari supplier.', ['Input invoice', 'Matching dengan PO', 'Pembayaran invoice']],
    'erp/payable-due' => ['Hutang Jatuh Tempo', 'Monitoring hutang yang akan jatuh tempo.', ['Reminder otomatis', 'Overdue alert', 'Cash flow planning']],
];

// SALES FLOW — erp/quotation handled by dedicated route above
$salesFlowComingSoon = [
    'erp/sales-target' => ['Sales Target', 'Target penjualan per salesman/periode.', ['Target bulanan', 'Target tahunan', 'Tracking pencapaian']],
    'erp/sales-commission' => ['Komisi Sales', 'Perhitungan komisi penjualan otomatis.', ['Komisi per produk', 'Komisi per target', 'Pembayaran komisi']],
    'erp/sales-receivable' => ['Piutang Penjualan', 'Monitoring piutang dari penjualan.', ['Invoice outstanding', 'Collection tracking', 'Bad debt provision']],
    'erp/order-tracking' => ['Tracking Status Order', 'Monitoring status pesanan dari awal sampai selesai.', ['Status real-time', 'ETA estimation', 'Customer notification']],
];

// HR / KARYAWAN — all paths handled by dedicated routes, keeping array empty
$hrComingSoon = [];

// DASHBOARD ANALYTICS — handled by dedicated route above
$analyticsComingSoon = [];

// FITUR TOKO ELEKTRONIK — erp/service and erp/warranty handled by dedicated routes above
$electronicStoreComingSoon = [
    'erp/service-tracking' => ['Tracking Perbaikan', 'Monitoring progress perbaikan.', ['Repair status', 'Technician assignment', 'Completion tracking']],
    'erp/installment' => ['Kredit Customer', 'Fitur cicilan untuk pembelian.', ['Installment setup', 'Payment schedule', 'Interest calculation']],
    'erp/installment-due' => ['Jatuh Tempo Cicilan', 'Monitoring cicilan yang jatuh tempo.', ['Due date alert', 'Payment reminder', 'Overdue management']],
];

// FITUR ENTERPRISE
$enterpriseComingSoon = [
    'erp/approval-system' => ['Approval System', 'Sistem approval multi-level untuk berbagai proses.', ['Workflow designer', 'Multi-approver', 'Approval history']],
    'erp/workflow-automation' => ['Workflow Automation', 'Otomasi proses bisnis.', ['Process automation', 'Trigger setup', 'Integration automation']],
    'erp/export-pdf-excel' => ['Export PDF/Excel', 'Export laporan dalam berbagai format.', ['PDF export', 'Excel export', 'Custom template']],
    'erp/template-invoice' => ['Template Invoice', 'Template invoice yang dapat dikustomisasi.', ['Invoice designer', 'Branding', 'Multi-language']],
    'erp/multi-currency' => ['Multi Currency', 'Dukungan multi mata uang.', ['Currency conversion', 'Exchange rate', 'Currency reports']],
    'erp/multi-tax' => ['Multi Pajak', 'Konfigurasi pajak kompleks.', ['Tax rules', 'Tax calculation', 'Tax reporting']],
    'erp/backup-system' => ['Backup System', 'Sistem backup otomatis data.', ['Auto backup', 'Restore point', 'Cloud backup']],
    'erp/api-public' => ['API Public', 'API untuk integrasi eksternal.', ['REST API', 'API documentation', 'Rate limiting']],
    'erp/webhook' => ['Webhook', 'Notifikasi real-time ke sistem eksternal.', ['Event triggers', 'Payload customization', 'Security']],
    'erp/activity-timeline' => ['Activity Timeline', 'Timeline aktivitas sistem.', ['Activity feed', 'User timeline', 'Audit timeline']],
];

// Combine all coming soon arrays
$allComingSoon = array_merge(
    $masterDataComingSoon,
    $accountingComingSoon,
    $inventoryComingSoon,
    $purchaseFlowComingSoon,
    $salesFlowComingSoon,
    $hrComingSoon,
    $analyticsComingSoon,
    $electronicStoreComingSoon,
    $enterpriseComingSoon
);

foreach ($allComingSoon as $path => [$title, $description, $features]) {
    Route::get('/' . $path, function() use ($title, $description, $features) {
        return view('erp.coming-soon', compact('title', 'description', 'features'));
    });
}

// ===== ADDITIONAL ROUTES — FINAL UNIFIED MENU STRUCTURE =====
$extraComingSoon = [
    // Dashboard
    'erp/owner-dashboard'    => ['Dashboard Owner', 'Dashboard khusus pemilik bisnis dengan ringkasan finansial.', ['Omzet harian/bulanan', 'Profit overview', 'Hutang & piutang', 'Alert penting']],
    'erp/multi-branch-analytics' => ['Multi Branch Analytics', 'Analitik komparatif antar cabang.', ['Performa per cabang', 'Ranking cabang', 'Transfer stok', 'Laporan konsolidasi']],
    // Sales
    'erp/sales-order'        => ['Sales Order', 'Buat dan kelola sales order.', ['Buat SO', 'Approval SO', 'Konversi ke invoice', 'Tracking SO']],
    'erp/delivery-order'     => ['Delivery Order', 'Buat dan kelola delivery order.', ['Buat DO dari SO', 'Status pengiriman', 'Cetak surat jalan', 'Konfirmasi penerimaan']],
    'erp/membership'         => ['Membership Customer', 'Program membership dan tier customer.', ['Tier membership', 'Benefit per tier', 'Upgrade otomatis', 'Statistik member']],
    // Inventory
    'erp/sku'                => ['SKU Produk', 'Manajemen kode SKU produk.', ['Generate SKU', 'SKU unique', 'Mapping ke barcode', 'SKU per varian']],
    'erp/barcode'            => ['Barcode Produk', 'Manajemen barcode dan label produk.', ['Generate barcode', 'Print label', 'Scan barcode', 'Barcode per varian']],
    'erp/multi-warehouse'    => ['Multi Gudang', 'Manajemen beberapa gudang sekaligus.', ['Daftar gudang', 'Stok per gudang', 'Transfer antar gudang', 'Laporan per gudang']],
    'erp/rack'               => ['Rak Gudang', 'Manajemen lokasi rak dalam gudang.', ['Peta rak', 'Lokasi produk', 'Kapasitas rak', 'Pencarian lokasi']],
    'erp/stock-adjustment'   => ['Penyesuaian Stok', 'Koreksi stok manual.', ['Tambah stok', 'Kurangi stok', 'Alasan penyesuaian', 'Riwayat koreksi']],
    'erp/stock-card'         => ['Kartu Stok', 'Kartu stok per produk.', ['Kartu stok digital', 'Mutasi per produk', 'Saldo awal/akhir', 'Export kartu stok']],
    'erp/inventory-value'    => ['Nilai Persediaan', 'Laporan nilai persediaan saat ini.', ['Nilai per produk', 'Total nilai inventory', 'Metode FIFO/Average', 'Export laporan']],
    'erp/fast-moving'        => ['Fast Moving Item', 'Laporan produk dengan pergerakan cepat.', ['Top fast moving', 'Tren pergerakan', 'Reorder suggestion', 'Periode analisis']],
    'erp/slow-moving'        => ['Slow Moving Item', 'Laporan produk dengan pergerakan lambat.', ['Identifikasi slow moving', 'Dead stock alert', 'Rekomendasi clearance', 'Aging inventory']],
    'erp/production'         => ['Produksi', 'Manajemen proses produksi.', ['Work order', 'Bill of material', 'Progress produksi', 'Cost produksi']],
    'erp/assembly'           => ['Perakitan Barang', 'Proses perakitan komponen menjadi produk.', ['Assembly order', 'Komponen needed', 'Status assembly', 'Cost assembly']],
    'erp/production-formula' => ['Formula Produksi', 'Resep dan formula produksi.', ['Buat formula', 'Komposisi bahan', 'Varian formula', 'Cost per formula']],
    // Purchase
    'erp/purchase-return'    => ['Retur Pembelian', 'Retur barang ke supplier.', ['Buat retur', 'Alasan retur', 'Refund dari supplier', 'Laporan retur beli']],
    'erp/pay-supplier'       => ['Pembayaran Supplier', 'Proses pembayaran ke supplier.', ['Bayar hutang', 'Cicilan pembayaran', 'Rekap pembayaran', 'Konfirmasi pembayaran']],
    'erp/supplier-analytics' => ['Analisa Supplier', 'Analisis performa supplier.', ['Ketepatan pengiriman', 'Kualitas barang', 'Harga kompetitif', 'Ranking supplier']],
    // Finance — new cash types
    'erp/main-cash'          => ['Kas Besar', 'Pengelolaan kas besar perusahaan.', ['Saldo kas besar', 'Mutasi kas', 'Transfer ke kas kecil', 'Laporan kas besar']],
    'erp/petty-cash'         => ['Kas Kecil', 'Pengelolaan kas kecil operasional.', ['Pengajuan kas kecil', 'Reimbursement', 'Saldo kas kecil', 'Laporan petty cash']],
    'erp/electronic-cash'    => ['Kas Elektronik', 'Manajemen dompet digital dan e-money.', ['GoPay', 'OVO', 'Dana', 'ShopeePay']],
    'erp/building-cash'      => ['Kas Bahan Bangunan', 'Kas khusus divisi bahan bangunan.', ['Saldo divisi BB', 'Transaksi BB', 'Laporan divisi', 'Rekonsiliasi BB']],
    'erp/bank-account'       => ['Rekening Bank', 'Manajemen rekening bank perusahaan.', ['Daftar rekening', 'Saldo per rekening', 'Mutasi rekening', 'Rekonsiliasi']],
    'erp/bank-transfer'      => ['Transfer Bank', 'Proses transfer antar rekening.', ['Transfer internal', 'Transfer ke supplier', 'Bukti transfer', 'Riwayat transfer']],
    'erp/giro'               => ['Giro / Cek', 'Manajemen giro dan cek.', ['Input giro masuk', 'Giro keluar', 'Status giro', 'Jatuh tempo giro']],
    // Accounting
    'erp/trial-balance'      => ['Neraca Saldo', 'Laporan neraca saldo semua akun.', ['Neraca saldo percobaan', 'Cek balance', 'Per periode', 'Export laporan']],
    'erp/opening-balance'    => ['Saldo Awal', 'Input saldo awal periode akuntansi.', ['Saldo awal akun', 'Import saldo', 'Validasi saldo', 'Saldo per cabang']],
    'erp/accounting-period'  => ['Periode Akuntansi', 'Manajemen periode buku.', ['Buka/tutup periode', 'Periode aktif', 'Lock transaksi lama', 'Laporan per periode']],
    'erp/departments'        => ['Departemen', 'Manajemen departemen untuk alokasi biaya.', ['Daftar departemen', 'Budget per dept', 'Laporan per dept', 'Alokasi biaya']],
    'erp/projects'           => ['Proyek', 'Tracking biaya dan pendapatan per proyek.', ['Daftar proyek', 'Budget proyek', 'Actual vs budget', 'Laporan proyek']],
    'erp/budgeting'          => ['Budgeting', 'Perencanaan dan monitoring budget.', ['Budget tahunan', 'Budget per dept', 'Realisasi budget', 'Variance analysis']],
    'erp/audit-transaction'  => ['Audit Transaksi', 'Audit jejak semua transaksi keuangan.', ['Trail audit', 'Perubahan data', 'User yang mengubah', 'Export audit log']],
    // Tax
    'erp/vat'                => ['PPN', 'Manajemen pajak PPN 11%.', ['Hitung PPN', 'Faktur pajak masukan', 'Faktur pajak keluaran', 'Laporan PPN']],
    'erp/pph'                => ['PPh', 'Manajemen pajak penghasilan.', ['PPh 21', 'PPh 23', 'PPh Final', 'Laporan PPh']],
    'erp/tax-invoice'        => ['Faktur Pajak', 'Kelola faktur pajak masukan & keluaran.', ['Faktur masukan', 'Faktur keluaran', 'Matching faktur', 'Rekap faktur']],
    'erp/e-faktur'           => ['e-Faktur', 'Integrasi e-Faktur DJP Online.', ['Upload e-Faktur', 'Status e-Faktur', 'Sinkronisasi DJP', 'CSV export']],
    'erp/tax-report'         => ['Laporan Pajak', 'Laporan pajak komprehensif.', ['Laporan PPN', 'Laporan PPh', 'SPT Masa', 'Export untuk DJP']],
    // CRM extended
    'erp/customer-group'     => ['Customer Group', 'Segmentasi customer berdasarkan grup.', ['Buat grup', 'Assign customer', 'Harga khusus per grup', 'Statistik grup']],
    'erp/customer-credit'    => ['Customer Credit', 'Limit kredit per customer.', ['Set credit limit', 'Sisa limit', 'Alert over limit', 'History kredit']],
    'erp/customer-followup'  => ['Follow Up Customer', 'Jadwal follow up dan reminder.', ['Tambah jadwal FU', 'Reminder otomatis', 'Status follow up', 'Laporan FU']],
    'erp/whatsapp-blast'     => ['WhatsApp Blast', 'Kirim pesan massal via WhatsApp.', ['Pilih penerima', 'Template pesan', 'Jadwal blast', 'Statistik pengiriman']],
    'erp/payment-reminder'   => ['Reminder Pembayaran', 'Reminder otomatis untuk piutang jatuh tempo.', ['Setup reminder', 'Template reminder', 'Log pengiriman', 'Statistik reminder']],
    'erp/customer-complaint' => ['Customer Complaint', 'Manajemen keluhan customer.', ['Catat keluhan', 'Assign to team', 'Status penanganan', 'SLA monitoring']],
    'erp/chatbot-ai'         => ['Chatbot AI', 'Chatbot AI untuk customer service.', ['Auto-reply WA', 'FAQ otomatis', 'Escalate ke CS', 'Statistik chatbot']],
    'erp/customer-history'   => ['Customer History', 'Riwayat lengkap interaksi customer.', ['Riwayat order', 'Riwayat pembayaran', 'Riwayat komunikasi', 'Customer timeline']],
    // Delivery extended
    'erp/delivery-note'      => ['Surat Jalan', 'Buat dan kelola surat jalan.', ['Buat surat jalan', 'Status pengiriman', 'Tanda terima', 'Arsip surat jalan']],
    'erp/tracking'           => ['Tracking Pengiriman', 'Real-time tracking posisi pengiriman.', ['Map tracking', 'Status real-time', 'ETA estimation', 'Notifikasi customer']],
    'erp/fleet'              => ['Armada', 'Manajemen kendaraan armada pengiriman.', ['Data kendaraan', 'Status kendaraan', 'Perawatan kendaraan', 'Biaya operasional']],
    'erp/drivers'            => ['Data Driver', 'Database lengkap driver pengiriman.', ['Profil driver', 'Lisensi SIM', 'Performa driver', 'Penugasan area']],
    'erp/delivery-schedule'  => ['Jadwal Pengiriman', 'Perencanaan jadwal pengiriman harian.', ['Jadwal per driver', 'Rute optimal', 'Load balancing', 'Konfirmasi jadwal']],
    // Marketplace Dashboard — erp/marketplace-overview and erp/marketplace-sync handled by dedicated routes
    'erp/marketplace-mapping'        => ['Mapping Produk Marketplace', 'Pemetaan produk ERP ke marketplace.', ['Map per platform', 'Bulk mapping', 'Validasi mapping', 'Laporan mapping']],
    'erp/marketplace-warehouse-mapping' => ['Mapping Gudang Marketplace', 'Pemetaan gudang ke marketplace.', ['Map gudang Shopee', 'Map gudang TikTok', 'Map gudang Tokopedia', 'Map gudang Lazada']],
    'erp/marketplace-price-mapping'  => ['Mapping Harga Marketplace', 'Aturan harga per marketplace.', ['Harga dasar', 'Markup per platform', 'Harga promo', 'Sync harga otomatis']],
    'erp/multi-channel-order'        => ['Multi Channel Order', 'Kelola order dari semua marketplace.', ['Order masuk semua platform', 'Filter per platform', 'Proses massal', 'Status tracking']],
    'erp/multi-channel-chat'         => ['Multi Channel Chat', 'Chat terpadu dari semua marketplace.', ['Inbox terpadu', 'Template balasan', 'AI reply', 'SLA monitoring']],
    'erp/multi-channel-analytics'    => ['Multi Channel Analytics', 'Analitik terpadu semua marketplace.', ['Performa per platform', 'Trend penjualan', 'Margin per platform', 'Produk terlaris']],
    'erp/multi-channel-shipping'     => ['Multi Channel Shipping', 'Kelola pengiriman semua marketplace.', ['Print label massal', 'Pickup request', 'Tracking massal', 'Biaya kirim']],
    'erp/multi-channel-return'       => ['Multi Channel Return', 'Manajemen retur semua marketplace.', ['Retur masuk', 'Proses retur', 'Refund tracking', 'Laporan retur']],
    'erp/multi-channel-voucher'      => ['Multi Channel Voucher', 'Voucher untuk semua marketplace.', ['Buat voucher', 'Sync voucher', 'Performa voucher', 'Ekspirasi']],
    'erp/multi-channel-customer'     => ['Multi Channel Customer', 'CRM marketplace terpadu.', ['Database pembeli', 'Repeat buyer', 'Customer value', 'Segmentasi']],
    'erp/marketplace-realtime'       => ['Marketplace Realtime Dashboard', 'Monitor marketplace secara real-time.', ['Order masuk real-time', 'Notifikasi penting', 'Alert stok', 'Revenue real-time']],
    'erp/marketplace-performance'    => ['Marketplace Performance', 'Laporan performa toko marketplace.', ['Shop score', 'Rating toko', 'Response rate', 'Penalty alert']],
    'erp/marketplace-profit'         => ['Marketplace Profit Analytics', 'Analisis profit per marketplace.', ['Gross profit', 'Net profit setelah fee', 'Margin per produk', 'Perbandingan platform']],
    'erp/marketplace-fee-report'     => ['Marketplace Fee Report', 'Laporan biaya marketplace.', ['Admin fee', 'Layanan fee', 'Ongkir subsidi', 'Total biaya']],
    'erp/marketplace-settlement'     => ['Marketplace Settlement', 'Rekonsiliasi settlement marketplace.', ['Settlement per periode', 'Matching pembayaran', 'Selisih settlement', 'Laporan settlement']],
    'erp/marketplace-cod'            => ['Marketplace COD Monitoring', 'Monitor pesanan COD.', ['COD pending', 'COD selesai', 'COD gagal', 'Remittance COD']],
    'erp/marketplace-return'         => ['Marketplace Return Management', 'Kelola retur dari semua marketplace.', ['Return request', 'Approve/reject', 'Refund tracking', 'Laporan retur']],
    'erp/marketplace-dispute'        => ['Marketplace Dispute Center', 'Kelola sengketa/dispute marketplace.', ['Dispute aktif', 'Upload bukti', 'Status dispute', 'Laporan dispute']],
    'erp/marketplace-notification'   => ['Marketplace Notification Center', 'Pusat notifikasi marketplace.', ['Notifikasi order', 'Alert stok', 'Notifikasi rating', 'Push notification']],
    'erp/marketplace-logs'           => ['Marketplace Activity Logs', 'Log aktivitas marketplace.', ['Log API call', 'Log sync', 'Log error', 'Filter per platform']],
    'erp/marketplace-errors'         => ['Marketplace Error Logs', 'Log error marketplace.', ['Error API', 'Sync failed', 'Retry otomatis', 'Alert error kritis']],
    'erp/marketplace-scheduler'      => ['Marketplace Scheduler', 'Jadwal otomatis sinkronisasi.', ['Jadwal sync stok', 'Jadwal sync harga', 'Jadwal export', 'Cron job manager']],
    'erp/marketplace-auto-sync'      => ['Marketplace Auto Sync', 'Sinkronisasi otomatis berkelanjutan.', ['Auto sync stok', 'Trigger sync', 'Interval setting', 'Log auto sync']],
    'erp/marketplace-api-monitor'    => ['Marketplace API Monitoring', 'Monitor status API marketplace.', ['API health check', 'Response time', 'Error rate', 'Quota API']],
    'erp/marketplace-chat-ai'        => ['Marketplace Chat AI', 'AI untuk chat marketplace.', ['Auto reply cerdas', 'Template AI', 'Sentiment analysis', 'Eskalasi otomatis']],
    'erp/marketplace-auto-reply'     => ['Marketplace Auto Reply', 'Balasan otomatis chat marketplace.', ['Template per platform', 'Jam aktif', 'Keyword trigger', 'Statistik reply']],
    'erp/marketplace-broadcast'      => ['Marketplace Broadcast', 'Broadcast pesan ke pembeli.', ['Broadcast Shopee', 'Broadcast TikTok', 'Segmentasi penerima', 'Jadwal broadcast']],
    'erp/marketplace-campaign'       => ['Marketplace Campaign', 'Manajemen kampanye promosi.', ['Ikut campaign platform', 'Budget campaign', 'Performa campaign', 'ROI campaign']],
    'erp/marketplace-flashsale'      => ['Marketplace Flash Sale', 'Manajemen flash sale.', ['Daftar flash sale', 'Setup produk FS', 'Monitor FS real-time', 'Laporan flash sale']],
    'erp/marketplace-voucher-center' => ['Marketplace Voucher Center', 'Pusat manajemen voucher.', ['Voucher Shopee', 'Voucher TikTok', 'Voucher Tokopedia', 'Voucher Lazada']],
    'erp/marketplace-pickup'         => ['Marketplace Pickup Request', 'Request pickup semua marketplace.', ['Bulk pickup request', 'Jadwal pickup', 'Konfirmasi kurir', 'Tracking pickup']],
    'erp/marketplace-label'          => ['Marketplace Shipping Label', 'Print label pengiriman massal.', ['Print label Shopee', 'Print label TikTok', 'Bulk print', 'Label custom']],
    'erp/marketplace-sla'            => ['Marketplace SLA Monitoring', 'Monitor SLA pengiriman.', ['SLA per platform', 'Alert SLA breach', 'Laporan ketepatan', 'Penalty detection']],
    'erp/marketplace-finance-sync'   => ['Marketplace Finance Sync', 'Sinkronisasi keuangan marketplace.', ['Sync ke akuntansi', 'Pembukuan otomatis', 'Laporan keuangan MP', 'Rekonsiliasi']],
    'erp/marketplace-crm'            => ['Marketplace Omnichannel CRM', 'CRM terpadu untuk semua marketplace.', ['Database pembeli', 'Purchase history', 'Segmentasi', 'Loyalty program']],
    'erp/marketplace-ai-analytics'   => ['Marketplace AI Analytics', 'AI analytics untuk marketplace.', ['Prediksi penjualan', 'Rekomendasi harga', 'Trend produk', 'Kompetitor analysis']],
    'erp/marketplace-tv'             => ['Marketplace Dashboard TV', 'Dashboard TV untuk monitoring real-time.', ['Tampilan TV mode', 'Fullscreen dashboard', 'Auto refresh', 'Multi platform view']],
    // Service Center
    'erp/sparepart'          => ['Sparepart', 'Manajemen sparepart untuk servis.', ['Database sparepart', 'Stok sparepart', 'Harga sparepart', 'Ketersediaan']],
    'erp/technician'         => ['Teknisi', 'Manajemen teknisi servis.', ['Data teknisi', 'Spesialisasi', 'Jadwal teknisi', 'Performa teknisi']],
    'erp/service-schedule'   => ['Jadwal Service', 'Jadwal perbaikan dan servis.', ['Booking servis', 'Antrian servis', 'Estimasi selesai', 'Notifikasi customer']],
    'erp/service-history'    => ['Riwayat Service', 'Riwayat lengkap servis barang.', ['History per barang', 'History per customer', 'Biaya servis', 'Laporan servis']],
    // Reports extended
    'erp/report-purchase'    => ['Laporan Pembelian', 'Analisis data pembelian ke supplier.', ['Total pembelian', 'Per supplier', 'Per produk', 'Trend pembelian']],
    'erp/report-inventory'   => ['Laporan Inventori', 'Laporan lengkap kondisi inventori.', ['Nilai inventory', 'Fast/slow moving', 'Stok kritis', 'Perputaran stok']],
    'erp/report-tax'         => ['Laporan Pajak', 'Laporan pajak komprehensif.', ['PPN masukan/keluaran', 'PPh per periode', 'Rekap pajak', 'Export SPT']],
    'erp/profit-product'     => ['Profit Produk', 'Analisis profit per produk.', ['HPP per produk', 'Margin per produk', 'Kontribusi profit', 'Top profitable product']],
    'erp/profit-branch'      => ['Profit Cabang', 'Analisis profit per cabang.', ['Revenue per cabang', 'Cost per cabang', 'Net profit', 'Ranking cabang']],
    'erp/sales-trend'        => ['Trend Penjualan', 'Tren dan pola penjualan.', ['Daily/weekly/monthly trend', 'Seasonal pattern', 'Prediksi penjualan', 'Grafik interaktif']],
    'erp/export-pdf'         => ['Export PDF', 'Export laporan ke format PDF.', ['Pilih laporan', 'Kustomisasi layout', 'Download PDF', 'Email laporan']],
    'erp/export-excel'       => ['Export Excel', 'Export data ke format Excel.', ['Pilih data', 'Format Excel', 'Download xlsx', 'Auto schedule export']],
    // AI extended
    'erp/approval-workflow'  => ['Approval Workflow', 'Workflow approval yang dapat dikustomisasi.', ['Design workflow', 'Multi level approval', 'Notifikasi approver', 'Tracking status']],
    'erp/auto-reminder'      => ['Auto Reminder', 'Reminder otomatis untuk berbagai event.', ['Reminder jatuh tempo', 'Reminder follow up', 'Template reminder', 'Log reminder']],
    'erp/auto-sync'          => ['Auto Sync Marketplace', 'Sinkronisasi otomatis ke marketplace.', ['Sync real-time', 'Trigger based sync', 'Conflict resolution', 'Log sinkronisasi']],
    'erp/forecasting'        => ['Smart Forecasting', 'Prediksi cerdas berbasis AI.', ['Prediksi demand', 'Forecast penjualan', 'Recommendation engine', 'Akurasi prediksi']],
    // HRD extended
    'erp/incentive'          => ['Bonus & Insentif', 'Manajemen bonus dan insentif karyawan.', ['Perhitungan bonus', 'Insentif penjualan', 'Komisi tim', 'Laporan insentif']],
    'erp/division'           => ['Divisi', 'Manajemen divisi dan departemen.', ['Daftar divisi', 'Struktur organisasi', 'Budget divisi', 'KPI divisi']],
    'erp/work-schedule'      => ['Jadwal Kerja', 'Manajemen jadwal kerja karyawan.', ['Jadwal shift', 'Jadwal piket', 'Cuti & izin', 'Lembur']],
    'erp/login-activity'     => ['Login Activity', 'Monitoring aktivitas login user.', ['Log login', 'Perangkat login', 'Lokasi login', 'Suspicious activity']],
    'erp/device-management'  => ['Device Management', 'Manajemen perangkat yang digunakan.', ['Daftar perangkat', 'Revoke akses', 'Device trust', 'Aktivitas per perangkat']],
    // System extended
    'erp/integration/kledo'        => ['Kledo API', 'Konfigurasi integrasi Kledo.', ['API key setup', 'Sinkronisasi data', 'Mapping akun', 'Log sinkronisasi']],
    'erp/integration/accurate'     => ['Accurate API', 'Konfigurasi integrasi Accurate.', ['Setup koneksi', 'Sinkronisasi jurnal', 'Mapping COA', 'Status integrasi']],
    'erp/integration/shopee'       => ['Shopee API', 'Konfigurasi integrasi Shopee.', ['App ID & Secret', 'OAuth token', 'Webhook setup', 'Test koneksi']],
    'erp/integration/whatsapp'     => ['WhatsApp API', 'Konfigurasi integrasi WhatsApp.', ['Fonnte token', 'Template pesan', 'Webhook WA', 'Test kirim WA']],
    'erp/integration/telegram'     => ['Telegram Bot', 'Konfigurasi bot Telegram.', ['Bot token', 'Chat ID', 'Notifikasi via Telegram', 'Command bot']],
    'erp/integration/google-sheet' => ['Google Sheets', 'Integrasi dengan Google Sheets.', ['Authorize Google', 'Sheet ID', 'Auto export', 'Sync jadwal']],
    'erp/company-profile'          => ['Profil Perusahaan', 'Data dan informasi perusahaan.', ['Nama perusahaan', 'Alamat', 'Logo', 'Info pajak NPWP']],
    'erp/document-numbering'       => ['Penomoran Dokumen', 'Konfigurasi format nomor dokumen.', ['Format invoice', 'Format PO', 'Format DO', 'Reset counter']],
    'erp/sync'                     => ['Sinkronisasi', 'Sinkronisasi data antar sistem.', ['Sync manual', 'Status sync', 'Conflict resolution', 'Log sync']],
    'erp/theme'                    => ['Tema & Tampilan', 'Kustomisasi tampilan sistem.', ['Dark mode', 'Warna tema', 'Layout setting', 'Font size']],
    'erp/backup'                   => ['Backup System', 'Sistem backup otomatis.', ['Auto backup', 'Restore point', 'Download backup', 'Jadwal backup']],
];
foreach ($extraComingSoon as $path => [$title, $description, $features]) {
    Route::get('/' . $path, function() use ($title, $description, $features) {
        return view('erp.coming-soon', compact('title', 'description', 'features'));
    });
}

// ══════════════════════════════════════════════════════════════════════════════
// ACTIVATED ERP MODULES — override coming-soon routes (last-registered wins)
// ══════════════════════════════════════════════════════════════════════════════

// ── Dashboard ──────────────────────────────────────────────────────────────
Route::get('/erp/owner-dashboard', fn() => view('erp.owner-dashboard'));
Route::get('/erp/multi-branch-analytics', fn() => view('erp.crud', [
    'title'=>'Multi Branch Analytics','description'=>'Analisa performa seluruh cabang','module'=>'multi-branch-analytics',
    'formFields'=>[['name'=>'cabang','label'=>'Cabang','type'=>'text','required'=>true],['name'=>'periode','label'=>'Periode','type'=>'text'],['name'=>'omzet','label'=>'Omzet','type'=>'number','format'=>'currency'],['name'=>'profit','label'=>'Profit','type'=>'number','format'=>'currency'],['name'=>'total_order','label'=>'Total Order','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
]));

// ── Sales Flow ─────────────────────────────────────────────────────────────
Route::get('/erp/sales-order', fn() => view('erp.crud', [
    'title'=>'Sales Order','description'=>'Manajemen sales order pelanggan','module'=>'sales-order',
    'formFields'=>[['name'=>'nomor','label'=>'No SO','type'=>'text','required'=>true],['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'total','label'=>'Total','type'=>'number','format'=>'currency'],['name'=>'catatan','label'=>'Catatan','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Diproses','Dikirim','Selesai','Dibatalkan']]],
    'filterOptions'=>['Draft','Diproses','Dikirim','Selesai','Dibatalkan'],
]));
Route::get('/erp/delivery-order', fn() => view('erp.crud', [
    'title'=>'Delivery Order','description'=>'Manajemen surat pengiriman','module'=>'delivery-order',
    'formFields'=>[['name'=>'nomor','label'=>'No DO','type'=>'text','required'=>true],['name'=>'sales_order','label'=>'No SO','type'=>'text'],['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'driver','label'=>'Driver','type'=>'text'],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'alamat','label'=>'Alamat','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Menunggu','Dalam Perjalanan','Terkirim','Gagal']]],
    'filterOptions'=>['Menunggu','Dalam Perjalanan','Terkirim','Gagal'],
]));
Route::get('/erp/order-tracking', fn() => view('erp.crud', [
    'title'=>'Tracking Status Order','description'=>'Pantau status pengiriman order','module'=>'order-tracking',
    'formFields'=>[['name'=>'nomor_order','label'=>'No Order','type'=>'text','required'=>true],['name'=>'customer','label'=>'Customer','type'=>'text'],['name'=>'driver','label'=>'Driver','type'=>'text'],['name'=>'lokasi','label'=>'Lokasi Terakhir','type'=>'text'],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Menunggu','Diproses','Dikirim','Terkirim','Gagal']]],
    'filterOptions'=>['Menunggu','Diproses','Dikirim','Terkirim','Gagal'],
]));
Route::get('/erp/sales-target', fn() => view('erp.crud', [
    'title'=>'Sales Target','description'=>'Target penjualan per sales per periode','module'=>'sales-target',
    'formFields'=>[['name'=>'sales','label'=>'Nama Sales','type'=>'text','required'=>true],['name'=>'bulan','label'=>'Bulan','type'=>'text','required'=>true],['name'=>'tahun','label'=>'Tahun','type'=>'number','default'=>date('Y')],['name'=>'target_rp','label'=>'Target (Rp)','type'=>'number','format'=>'currency'],['name'=>'target_order','label'=>'Target Order','type'=>'number'],['name'=>'realisasi','label'=>'Realisasi (Rp)','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Berjalan','Selesai','Melebihi Target']]],
]));
Route::get('/erp/sales-commission', fn() => view('erp.crud', [
    'title'=>'Komisi Sales','description'=>'Perhitungan dan tracking komisi sales','module'=>'sales-commission',
    'formFields'=>[['name'=>'sales','label'=>'Nama Sales','type'=>'text','required'=>true],['name'=>'bulan','label'=>'Bulan','type'=>'text'],['name'=>'tahun','label'=>'Tahun','type'=>'number'],['name'=>'total_penjualan','label'=>'Total Penjualan','type'=>'number','format'=>'currency'],['name'=>'persen_komisi','label'=>'% Komisi','type'=>'number'],['name'=>'komisi','label'=>'Komisi (Rp)','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Pending','Disetujui','Dibayar']]],
    'filterOptions'=>['Pending','Disetujui','Dibayar'],
]));
Route::get('/erp/sales-receivable', fn() => view('erp.crud', [
    'title'=>'Piutang Penjualan','description'=>'Monitor piutang dari pelanggan','module'=>'sales-receivable',
    'formFields'=>[['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'nomor_invoice','label'=>'No Invoice','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah','type'=>'number','format'=>'currency'],['name'=>'jatuh_tempo','label'=>'Jatuh Tempo','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Belum Lunas','Lunas','Jatuh Tempo','Cicilan']]],
    'filterOptions'=>['Belum Lunas','Lunas','Jatuh Tempo'],
]));
Route::get('/erp/membership', fn() => view('erp.crud', [
    'title'=>'Membership Customer','description'=>'Program membership dan loyalitas pelanggan','module'=>'membership',
    'formFields'=>[['name'=>'nama','label'=>'Nama Member','type'=>'text','required'=>true],['name'=>'customer','label'=>'Customer','type'=>'text'],['name'=>'level','label'=>'Level','type'=>'select','options'=>['Silver','Gold','Platinum']],['name'=>'poin','label'=>'Poin','type'=>'number','default'=>0],['name'=>'total_belanja','label'=>'Total Belanja','type'=>'number','format'=>'currency'],['name'=>'bergabung','label'=>'Tgl Bergabung','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
]));
Route::get('/erp/installment', fn() => view('erp.crud', [
    'title'=>'Cicilan','description'=>'Manajemen penjualan cicilan','module'=>'installment',
    'formFields'=>[['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'produk','label'=>'Produk','type'=>'text'],['name'=>'total','label'=>'Total Nilai','type'=>'number','format'=>'currency'],['name'=>'dp','label'=>'DP','type'=>'number','format'=>'currency'],['name'=>'angsuran','label'=>'Angsuran/Bulan','type'=>'number','format'=>'currency'],['name'=>'tenor','label'=>'Tenor (bulan)','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Berjalan','Lunas','Macet']]],
    'filterOptions'=>['Berjalan','Lunas','Macet'],
]));
Route::get('/erp/installment-due', fn() => view('erp.crud', [
    'title'=>'Cicilan Jatuh Tempo','description'=>'Cicilan yang akan/sudah jatuh tempo','module'=>'installment-due',
    'formFields'=>[['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'nomor_angsuran','label'=>'Angsuran Ke','type'=>'number'],['name'=>'jumlah','label'=>'Jumlah','type'=>'number','format'=>'currency'],['name'=>'jatuh_tempo','label'=>'Jatuh Tempo','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Belum Lunas','Lunas','Terlambat']]],
    'filterOptions'=>['Belum Lunas','Lunas','Terlambat'],
]));

// ── Inventory ──────────────────────────────────────────────────────────────
Route::get('/erp/stock-mutation', fn() => view('erp.crud', [
    'title'=>'Mutasi Stok','description'=>'Riwayat pergerakan stok produk','module'=>'stock-mutation',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'produk','label'=>'Produk','type'=>'text','required'=>true],['name'=>'gudang','label'=>'Gudang','type'=>'text'],['name'=>'jenis','label'=>'Jenis','type'=>'select','options'=>['Masuk','Keluar','Transfer','Penyesuaian']],['name'=>'jumlah','label'=>'Jumlah','type'=>'number'],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea']],
    'filterOptions'=>['Masuk','Keluar','Transfer','Penyesuaian'],
]));
Route::get('/erp/warehouse-transfer', fn() => view('erp.crud', [
    'title'=>'Transfer Antar Gudang','description'=>'Pindah stok antar gudang','module'=>'warehouse-transfer',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'dari','label'=>'Dari Gudang','type'=>'text','required'=>true],['name'=>'ke','label'=>'Ke Gudang','type'=>'text','required'=>true],['name'=>'produk','label'=>'Produk','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah','type'=>'number'],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Diproses','Selesai']]],
]));
Route::get('/erp/min-stock', fn() => view('erp.crud', [
    'title'=>'Min Stock Alert','description'=>'Produk dengan stok di bawah minimum','module'=>'min-stock',
    'formFields'=>[['name'=>'produk','label'=>'Nama Produk','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'gudang','label'=>'Gudang','type'=>'text'],['name'=>'stok_minimum','label'=>'Stok Minimum','type'=>'number'],['name'=>'stok_sekarang','label'=>'Stok Sekarang','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Normal','Rendah','Kritis']]],
    'filterOptions'=>['Normal','Rendah','Kritis'],
]));
Route::get('/erp/serial-number', fn() => view('erp.crud', [
    'title'=>'Serial Number / IMEI','description'=>'Tracking serial number produk','module'=>'serial-number',
    'formFields'=>[['name'=>'serial','label'=>'Serial Number','type'=>'text','required'=>true],['name'=>'produk','label'=>'Produk','type'=>'text'],['name'=>'tanggal_masuk','label'=>'Tgl Masuk','type'=>'date'],['name'=>'customer','label'=>'Customer (jika terjual)','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Tersedia','Terjual','Retur','Rusak']]],
    'filterOptions'=>['Tersedia','Terjual','Retur','Rusak'],
]));
Route::get('/erp/product-batch', fn() => view('erp.crud', [
    'title'=>'Batch Produk','description'=>'Tracking batch dan expired date produk','module'=>'product-batch',
    'formFields'=>[['name'=>'nomor_batch','label'=>'No Batch','type'=>'text','required'=>true],['name'=>'produk','label'=>'Produk','type'=>'text'],['name'=>'tanggal_produksi','label'=>'Tgl Produksi','type'=>'date'],['name'=>'expired_date','label'=>'Expired Date','type'=>'date'],['name'=>'jumlah','label'=>'Jumlah','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Kadaluarsa','Habis']]],
    'filterOptions'=>['Aktif','Kadaluarsa','Habis'],
]));
Route::get('/erp/stock-history', fn() => view('erp.crud', [
    'title'=>'History Pergerakan Stok','description'=>'Log lengkap pergerakan stok','module'=>'stock-history',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'produk','label'=>'Produk','type'=>'text','required'=>true],['name'=>'jenis','label'=>'Jenis','type'=>'select','options'=>['Masuk','Keluar','Transfer','Penyesuaian','Retur']],['name'=>'jumlah','label'=>'Jumlah','type'=>'number'],['name'=>'stok_sebelum','label'=>'Stok Sebelum','type'=>'number'],['name'=>'stok_sesudah','label'=>'Stok Sesudah','type'=>'number'],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea']],
]));
Route::get('/erp/stock-adjustment', fn() => view('erp.crud', [
    'title'=>'Penyesuaian Stok','description'=>'Koreksi stok fisik vs sistem','module'=>'stock-adjustment',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'produk','label'=>'Produk','type'=>'text','required'=>true],['name'=>'gudang','label'=>'Gudang','type'=>'text'],['name'=>'stok_sistem','label'=>'Stok Sistem','type'=>'number'],['name'=>'stok_fisik','label'=>'Stok Fisik','type'=>'number'],['name'=>'selisih','label'=>'Selisih','type'=>'number'],['name'=>'alasan','label'=>'Alasan','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Disetujui','Dibatalkan']]],
]));
Route::get('/erp/stock-card', fn() => view('erp.crud', [
    'title'=>'Kartu Stok','description'=>'Kartu stok per produk','module'=>'stock-card',
    'formFields'=>[['name'=>'produk','label'=>'Produk','type'=>'text','required'=>true],['name'=>'gudang','label'=>'Gudang','type'=>'text'],['name'=>'satuan','label'=>'Satuan','type'=>'text'],['name'=>'stok_awal','label'=>'Stok Awal','type'=>'number','default'=>0],['name'=>'masuk','label'=>'Total Masuk','type'=>'number','default'=>0],['name'=>'keluar','label'=>'Total Keluar','type'=>'number','default'=>0],['name'=>'stok_akhir','label'=>'Stok Akhir','type'=>'number','default'=>0]],
]));
Route::get('/erp/inventory-value', fn() => view('erp.crud', [
    'title'=>'Nilai Persediaan','description'=>'Nilai total persediaan barang','module'=>'inventory-value',
    'formFields'=>[['name'=>'produk','label'=>'Produk','type'=>'text','required'=>true],['name'=>'jumlah','label'=>'Jumlah Stok','type'=>'number'],['name'=>'satuan','label'=>'Satuan','type'=>'text'],['name'=>'harga_rata','label'=>'Harga Rata-Rata','type'=>'number','format'=>'currency'],['name'=>'nilai_total','label'=>'Nilai Total','type'=>'number','format'=>'currency'],['name'=>'metode','label'=>'Metode','type'=>'select','options'=>['FIFO','LIFO','Average']]],
]));
Route::get('/erp/fast-moving', fn() => view('erp.crud', [
    'title'=>'Fast Moving Item','description'=>'Produk dengan perputaran stok cepat','module'=>'fast-moving',
    'formFields'=>[['name'=>'produk','label'=>'Produk','type'=>'text','required'=>true],['name'=>'total_keluar','label'=>'Total Keluar','type'=>'number'],['name'=>'frekuensi','label'=>'Frekuensi Terjual','type'=>'number'],['name'=>'hari_rata','label'=>'Hari Rata Habis','type'=>'number'],['name'=>'perputaran','label'=>'Perputaran/Tahun','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Fast Moving','Normal','Slow Moving']]],
]));
Route::get('/erp/slow-moving', fn() => view('erp.crud', [
    'title'=>'Slow Moving Item','description'=>'Produk dengan perputaran stok lambat','module'=>'slow-moving',
    'formFields'=>[['name'=>'produk','label'=>'Produk','type'=>'text','required'=>true],['name'=>'stok_sekarang','label'=>'Stok Sekarang','type'=>'number'],['name'=>'total_keluar','label'=>'Total Keluar 3 Bulan','type'=>'number'],['name'=>'hari_tidak_terjual','label'=>'Hari Tidak Terjual','type'=>'number'],['name'=>'nilai_tertahan','label'=>'Nilai Tertahan','type'=>'number','format'=>'currency'],['name'=>'rekomendasi','label'=>'Rekomendasi','type'=>'select','options'=>['Diskon','Bundling','Retur ke Supplier','Hapus']]],
]));
Route::get('/erp/sku', fn() => view('erp.crud', [
    'title'=>'SKU Produk','description'=>'Manajemen kode SKU produk','module'=>'sku',
    'formFields'=>[['name'=>'kode_sku','label'=>'Kode SKU','type'=>'text','required'=>true],['name'=>'produk','label'=>'Nama Produk','type'=>'text'],['name'=>'barcode','label'=>'Barcode','type'=>'text'],['name'=>'satuan','label'=>'Satuan','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
]));
Route::get('/erp/barcode', fn() => view('erp.crud', [
    'title'=>'Barcode Produk','description'=>'Generate dan kelola barcode produk','module'=>'barcode',
    'formFields'=>[['name'=>'kode','label'=>'Kode Barcode','type'=>'text','required'=>true],['name'=>'produk','label'=>'Produk','type'=>'text'],['name'=>'tipe','label'=>'Tipe','type'=>'select','options'=>['EAN-13','QR Code','Code 128','Code 39']],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
]));
Route::get('/erp/multi-warehouse', fn() => view('erp.crud', [
    'title'=>'Multi Gudang','description'=>'Manajemen beberapa lokasi gudang','module'=>'multi-warehouse',
    'formFields'=>[['name'=>'nama','label'=>'Nama Gudang','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'lokasi','label'=>'Lokasi','type'=>'textarea'],['name'=>'kapasitas','label'=>'Kapasitas (unit)','type'=>'number'],['name'=>'manager','label'=>'Penanggung Jawab','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
]));
Route::get('/erp/rack', fn() => view('erp.crud', [
    'title'=>'Rak Gudang','description'=>'Manajemen rak dan lokasi penyimpanan','module'=>'rack',
    'formFields'=>[['name'=>'nama','label'=>'Nama Rak','type'=>'text','required'=>true],['name'=>'gudang','label'=>'Gudang','type'=>'text'],['name'=>'baris','label'=>'Baris','type'=>'text'],['name'=>'kolom','label'=>'Kolom','type'=>'text'],['name'=>'kapasitas','label'=>'Kapasitas','type'=>'number'],['name'=>'terisi','label'=>'Terisi','type'=>'number','default'=>0],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Tersedia','Penuh','Non-Aktif']]],
]));
Route::get('/erp/production', fn() => view('erp.crud', [
    'title'=>'Produksi','description'=>'Work order dan manajemen produksi','module'=>'production',
    'formFields'=>[['name'=>'nomor_wo','label'=>'No Work Order','type'=>'text','required'=>true],['name'=>'produk','label'=>'Produk Jadi','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah Target','type'=>'number'],['name'=>'mulai','label'=>'Tgl Mulai','type'=>'date'],['name'=>'selesai','label'=>'Tgl Selesai','type'=>'date'],['name'=>'biaya_produksi','label'=>'Biaya Produksi','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Berjalan','Selesai','Dibatalkan']]],
    'filterOptions'=>['Draft','Berjalan','Selesai','Dibatalkan'],
]));
Route::get('/erp/assembly', fn() => view('erp.crud', [
    'title'=>'Perakitan Barang','description'=>'Proses assembly/perakitan produk','module'=>'assembly',
    'formFields'=>[['name'=>'nomor','label'=>'No Assembly','type'=>'text','required'=>true],['name'=>'produk_jadi','label'=>'Produk Jadi','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah','type'=>'number'],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'biaya','label'=>'Biaya','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Proses','Selesai']]],
]));
Route::get('/erp/production-formula', fn() => view('erp.crud', [
    'title'=>'Formula Produksi','description'=>'Bill of materials dan formula produk','module'=>'production-formula',
    'formFields'=>[['name'=>'nama','label'=>'Nama Formula','type'=>'text','required'=>true],['name'=>'produk_jadi','label'=>'Produk Jadi','type'=>'text'],['name'=>'komponen','label'=>'Komponen Bahan','type'=>'textarea'],['name'=>'jumlah_bahan','label'=>'Jumlah Bahan','type'=>'text'],['name'=>'hasil','label'=>'Hasil Produksi','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
]));

// ── Master Data ────────────────────────────────────────────────────────────
Route::get('/erp/product-categories', fn() => view('erp.crud', [
    'title'=>'Kategori Produk','description'=>'Master data kategori produk','module'=>'product-categories',
    'formFields'=>[['name'=>'nama','label'=>'Nama Kategori','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'parent','label'=>'Kategori Induk','type'=>'text'],['name'=>'deskripsi','label'=>'Deskripsi','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/brands', fn() => view('erp.crud', [
    'title'=>'Brand Produk','description'=>'Master data brand/merek produk','module'=>'brands',
    'formFields'=>[['name'=>'nama','label'=>'Nama Brand','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'pic','label'=>'PIC/Contact','type'=>'text'],['name'=>'negara_asal','label'=>'Negara Asal','type'=>'text'],['name'=>'deskripsi','label'=>'Deskripsi','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/units', fn() => view('erp.crud', [
    'title'=>'Satuan Barang','description'=>'Master data satuan ukuran produk','module'=>'units',
    'formFields'=>[['name'=>'nama','label'=>'Nama Satuan','type'=>'text','required'=>true],['name'=>'singkatan','label'=>'Singkatan','type'=>'text'],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/salesman', fn() => view('erp.crud', [
    'title'=>'Data Salesman','description'=>'Master data salesman dan area','module'=>'salesman',
    'formFields'=>[['name'=>'nama','label'=>'Nama Salesman','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'telepon','label'=>'Telepon','type'=>'text'],['name'=>'email','label'=>'Email','type'=>'email'],['name'=>'area','label'=>'Area Tugas','type'=>'text'],['name'=>'target_bulanan','label'=>'Target Bulanan','type'=>'number','format'=>'currency'],['name'=>'komisi_persen','label'=>'% Komisi','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/branches', fn() => view('erp.crud', [
    'title'=>'Data Cabang','description'=>'Master data cabang dan lokasi','module'=>'branches',
    'formFields'=>[['name'=>'nama','label'=>'Nama Cabang','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'alamat','label'=>'Alamat','type'=>'textarea'],['name'=>'kota','label'=>'Kota','type'=>'text'],['name'=>'telepon','label'=>'Telepon','type'=>'text'],['name'=>'manager','label'=>'Manager','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/payment-methods', fn() => view('erp.crud', [
    'title'=>'Metode Pembayaran','description'=>'Master data metode pembayaran','module'=>'payment-methods',
    'formFields'=>[['name'=>'nama','label'=>'Nama Metode','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'tipe','label'=>'Tipe','type'=>'select','options'=>['Tunai','Transfer','Kartu Debit','Kartu Kredit','E-Wallet','Giro','Cicilan']],['name'=>'biaya_admin','label'=>'Biaya Admin (%)','type'=>'number','default'=>0],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/price-types', fn() => view('erp.crud', [
    'title'=>'Tipe Harga','description'=>'Multi price type untuk customer berbeda','module'=>'price-types',
    'formFields'=>[['name'=>'nama','label'=>'Nama Harga','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'margin_persen','label'=>'Margin (%)','type'=>'number'],['name'=>'diskon_persen','label'=>'Diskon (%)','type'=>'number','default'=>0],['name'=>'deskripsi','label'=>'Deskripsi','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/taxes', fn() => view('erp.crud', [
    'title'=>'Data Pajak','description'=>'Master data jenis pajak','module'=>'taxes',
    'formFields'=>[['name'=>'nama','label'=>'Nama Pajak','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'persentase','label'=>'Persentase (%)','type'=>'number'],['name'=>'tipe','label'=>'Tipe','type'=>'select','options'=>['PPN','PPh 21','PPh 22','PPh 23','PPh 25','PPh Final']],['name'=>'akun_debet','label'=>'Akun Debet','type'=>'text'],['name'=>'akun_kredit','label'=>'Akun Kredit','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
]));

// ── Purchase ───────────────────────────────────────────────────────────────
Route::get('/erp/purchase-request', fn() => view('erp.crud', [
    'title'=>'Permintaan Pembelian','description'=>'Purchase request dari departemen','module'=>'purchase-request',
    'formFields'=>[['name'=>'nomor_pr','label'=>'No PR','type'=>'text','required'=>true],['name'=>'departemen','label'=>'Departemen','type'=>'text'],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'deskripsi','label'=>'Deskripsi Kebutuhan','type'=>'textarea'],['name'=>'total_estimasi','label'=>'Total Estimasi','type'=>'number','format'=>'currency'],['name'=>'prioritas','label'=>'Prioritas','type'=>'select','options'=>['Rendah','Normal','Tinggi','Urgent']],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Menunggu Approval','Disetujui','Ditolak']]],
    'filterOptions'=>['Draft','Menunggu Approval','Disetujui','Ditolak'],
]));
Route::get('/erp/purchase-approval', fn() => view('erp.crud', [
    'title'=>'Approval Purchase','description'=>'Persetujuan permintaan pembelian','module'=>'purchase-approval',
    'formFields'=>[['name'=>'nomor_pr','label'=>'No PR','type'=>'text','required'=>true],['name'=>'pemohon','label'=>'Pemohon','type'=>'text'],['name'=>'approver','label'=>'Approver','type'=>'text'],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'total','label'=>'Total Nilai','type'=>'number','format'=>'currency'],['name'=>'catatan','label'=>'Catatan Approver','type'=>'textarea'],['name'=>'status','label'=>'Keputusan','type'=>'select','options'=>['Menunggu','Disetujui','Ditolak','Revisi']]],
    'filterOptions'=>['Menunggu','Disetujui','Ditolak'],
]));
Route::get('/erp/supplier-invoice', fn() => view('erp.crud', [
    'title'=>'Invoice Supplier','description'=>'Invoice yang diterima dari supplier','module'=>'supplier-invoice',
    'formFields'=>[['name'=>'nomor','label'=>'No Invoice','type'=>'text','required'=>true],['name'=>'supplier','label'=>'Supplier','type'=>'text','required'=>true],['name'=>'tanggal','label'=>'Tgl Invoice','type'=>'date'],['name'=>'total','label'=>'Total','type'=>'number','format'=>'currency'],['name'=>'jatuh_tempo','label'=>'Jatuh Tempo','type'=>'date'],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Belum Lunas','Lunas','Sebagian']]],
    'filterOptions'=>['Belum Lunas','Lunas','Sebagian'],
]));
Route::get('/erp/payable-due', fn() => view('erp.crud', [
    'title'=>'Hutang Jatuh Tempo','description'=>'Hutang yang sudah atau akan jatuh tempo','module'=>'payable-due',
    'formFields'=>[['name'=>'supplier','label'=>'Supplier','type'=>'text','required'=>true],['name'=>'nomor_invoice','label'=>'No Invoice','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah Hutang','type'=>'number','format'=>'currency'],['name'=>'jatuh_tempo','label'=>'Jatuh Tempo','type'=>'date'],['name'=>'sisa_hari','label'=>'Sisa Hari','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Belum Lunas','Jatuh Tempo','Overdue','Lunas']]],
    'filterOptions'=>['Belum Lunas','Jatuh Tempo','Overdue'],
]));
Route::get('/erp/purchase-return', fn() => view('erp.crud', [
    'title'=>'Retur Pembelian','description'=>'Pengembalian barang ke supplier','module'=>'purchase-return',
    'formFields'=>[['name'=>'nomor','label'=>'No Retur','type'=>'text','required'=>true],['name'=>'supplier','label'=>'Supplier','type'=>'text','required'=>true],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'produk','label'=>'Produk','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah','type'=>'number'],['name'=>'alasan','label'=>'Alasan Retur','type'=>'textarea'],['name'=>'total','label'=>'Total Nilai','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Proses','Diterima Supplier','Selesai']]],
]));
Route::get('/erp/pay-supplier', fn() => view('erp.crud', [
    'title'=>'Pembayaran Supplier','description'=>'Catat pembayaran hutang ke supplier','module'=>'pay-supplier',
    'formFields'=>[['name'=>'supplier','label'=>'Supplier','type'=>'text','required'=>true],['name'=>'nomor_invoice','label'=>'No Invoice','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah Bayar','type'=>'number','format'=>'currency'],['name'=>'tanggal','label'=>'Tgl Bayar','type'=>'date'],['name'=>'metode','label'=>'Metode','type'=>'select','options'=>['Transfer Bank','Tunai','Giro','E-Wallet']],['name'=>'rekening','label'=>'Rekening Tujuan','type'=>'text'],['name'=>'bukti','label'=>'No Bukti Bayar','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Pending','Terkirim','Dikonfirmasi']]],
]));
Route::get('/erp/supplier-analytics', fn() => view('erp.crud', [
    'title'=>'Analisa Supplier','description'=>'Performa dan analisa supplier','module'=>'supplier-analytics',
    'formFields'=>[['name'=>'supplier','label'=>'Supplier','type'=>'text','required'=>true],['name'=>'total_po','label'=>'Total PO','type'=>'number'],['name'=>'total_nilai','label'=>'Total Nilai PO','type'=>'number','format'=>'currency'],['name'=>'on_time_persen','label'=>'On Time Delivery (%)','type'=>'number'],['name'=>'reject_persen','label'=>'Reject Rate (%)','type'=>'number'],['name'=>'rating','label'=>'Rating','type'=>'select','options'=>['A - Excellent','B - Good','C - Average','D - Poor']],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea']],
]));

// ── Finance ────────────────────────────────────────────────────────────────
Route::get('/erp/cash-flow', fn() => view('erp.cash-flow'));
Route::get('/erp/main-cash', fn() => view('erp.crud', [
    'title'=>'Kas Besar','description'=>'Manajemen kas besar perusahaan','module'=>'main-cash',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'deskripsi','label'=>'Deskripsi','type'=>'text','required'=>true],['name'=>'jenis','label'=>'Jenis','type'=>'select','options'=>['Masuk','Keluar']],['name'=>'kategori','label'=>'Kategori','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah','type'=>'number','format'=>'currency'],['name'=>'saldo','label'=>'Saldo','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Dikonfirmasi']]],
    'filterOptions'=>['Masuk','Keluar'],
]));
Route::get('/erp/petty-cash', fn() => view('erp.crud', [
    'title'=>'Kas Kecil','description'=>'Manajemen petty cash operasional','module'=>'petty-cash',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'deskripsi','label'=>'Deskripsi','type'=>'text','required'=>true],['name'=>'jenis','label'=>'Jenis','type'=>'select','options'=>['Masuk','Keluar']],['name'=>'kategori','label'=>'Kategori','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah','type'=>'number','format'=>'currency'],['name'=>'bukti','label'=>'No Bukti','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Dikonfirmasi']]],
    'filterOptions'=>['Masuk','Keluar'],
]));
Route::get('/erp/electronic-cash', fn() => view('erp.crud', [
    'title'=>'Kas Elektronik','description'=>'Manajemen dompet digital dan e-wallet','module'=>'electronic-cash',
    'formFields'=>[['name'=>'platform','label'=>'Platform','type'=>'select','options'=>['GoPay','OVO','Dana','ShopeePay','LinkAja','Lainnya']],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'deskripsi','label'=>'Deskripsi','type'=>'text','required'=>true],['name'=>'jenis','label'=>'Jenis','type'=>'select','options'=>['Masuk','Keluar']],['name'=>'jumlah','label'=>'Jumlah','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Dikonfirmasi']]],
]));
Route::get('/erp/building-cash', fn() => view('erp.crud', [
    'title'=>'Kas Bangunan','description'=>'Kas untuk proyek dan bahan bangunan','module'=>'building-cash',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'proyek','label'=>'Proyek','type'=>'text'],['name'=>'deskripsi','label'=>'Deskripsi','type'=>'text','required'=>true],['name'=>'jenis','label'=>'Jenis','type'=>'select','options'=>['Masuk','Keluar']],['name'=>'jumlah','label'=>'Jumlah','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Dikonfirmasi']]],
]));
Route::get('/erp/bank-account', fn() => view('erp.crud', [
    'title'=>'Rekening Bank','description'=>'Master data rekening bank perusahaan','module'=>'bank-account',
    'formFields'=>[['name'=>'nama_bank','label'=>'Nama Bank','type'=>'text','required'=>true],['name'=>'nomor_rekening','label'=>'No Rekening','type'=>'text','required'=>true],['name'=>'nama_pemilik','label'=>'Nama Pemilik','type'=>'text'],['name'=>'cabang','label'=>'Cabang Bank','type'=>'text'],['name'=>'saldo','label'=>'Saldo Awal','type'=>'number','format'=>'currency'],['name'=>'mata_uang','label'=>'Mata Uang','type'=>'select','options'=>['IDR','USD','SGD','EUR']],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/bank-transfer', fn() => view('erp.crud', [
    'title'=>'Transfer Bank','description'=>'Catat transfer antar rekening bank','module'=>'bank-transfer',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'dari_rekening','label'=>'Dari Rekening','type'=>'text','required'=>true],['name'=>'ke_rekening','label'=>'Ke Rekening','type'=>'text','required'=>true],['name'=>'jumlah','label'=>'Jumlah','type'=>'number','format'=>'currency'],['name'=>'biaya_transfer','label'=>'Biaya Transfer','type'=>'number','default'=>0],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Dikonfirmasi']]],
]));
Route::get('/erp/giro', fn() => view('erp.crud', [
    'title'=>'Giro / Cek','description'=>'Manajemen giro dan cek perusahaan','module'=>'giro',
    'formFields'=>[['name'=>'nomor','label'=>'No Giro/Cek','type'=>'text','required'=>true],['name'=>'bank','label'=>'Bank Penerbit','type'=>'text'],['name'=>'nominal','label'=>'Nominal','type'=>'number','format'=>'currency'],['name'=>'tanggal_terbit','label'=>'Tgl Terbit','type'=>'date'],['name'=>'tanggal_jatuh','label'=>'Jatuh Tempo','type'=>'date'],['name'=>'penerima','label'=>'Penerima','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Belum Cair','Sudah Cair','Dibatalkan','Bounced']]],
    'filterOptions'=>['Belum Cair','Sudah Cair','Dibatalkan','Bounced'],
]));
Route::get('/erp/account-payable', fn() => view('erp.crud', [
    'title'=>'Hutang Supplier','description'=>'Monitor hutang kepada supplier','module'=>'account-payable',
    'formFields'=>[['name'=>'supplier','label'=>'Supplier','type'=>'text','required'=>true],['name'=>'nomor_invoice','label'=>'No Invoice','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah Hutang','type'=>'number','format'=>'currency'],['name'=>'tanggal','label'=>'Tgl Invoice','type'=>'date'],['name'=>'jatuh_tempo','label'=>'Jatuh Tempo','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Belum Lunas','Lunas','Sebagian','Overdue']]],
    'filterOptions'=>['Belum Lunas','Lunas','Sebagian','Overdue'],
]));
Route::get('/erp/account-receivable', fn() => view('erp.crud', [
    'title'=>'Piutang Customer','description'=>'Monitor piutang dari pelanggan','module'=>'account-receivable',
    'formFields'=>[['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'nomor_invoice','label'=>'No Invoice','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah Piutang','type'=>'number','format'=>'currency'],['name'=>'tanggal','label'=>'Tgl Invoice','type'=>'date'],['name'=>'jatuh_tempo','label'=>'Jatuh Tempo','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Belum Lunas','Lunas','Sebagian','Overdue']]],
    'filterOptions'=>['Belum Lunas','Lunas','Sebagian','Overdue'],
]));
Route::get('/erp/bank-reconciliation', fn() => view('erp.crud', [
    'title'=>'Rekonsiliasi Bank','description'=>'Rekonsiliasi buku besar vs rekening koran','module'=>'bank-reconciliation',
    'formFields'=>[['name'=>'periode','label'=>'Periode','type'=>'text','required'=>true],['name'=>'rekening','label'=>'Rekening Bank','type'=>'text'],['name'=>'saldo_buku','label'=>'Saldo Buku','type'=>'number','format'=>'currency'],['name'=>'saldo_bank','label'=>'Saldo Rekening Koran','type'=>'number','format'=>'currency'],['name'=>'selisih','label'=>'Selisih','type'=>'number','format'=>'currency'],['name'=>'keterangan','label'=>'Keterangan Selisih','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Proses','Balance','Tidak Balance']]],
]));
Route::get('/erp/payment-gateway', fn() => view('erp.crud', [
    'title'=>'Payment Gateway','description'=>'Konfigurasi dan transaksi payment gateway','module'=>'payment-gateway',
    'formFields'=>[['name'=>'platform','label'=>'Platform','type'=>'select','options'=>['Midtrans','Xendit','Doku','Stripe','PayPal']],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'referensi','label'=>'No Referensi','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah','type'=>'number','format'=>'currency'],['name'=>'biaya','label'=>'Biaya MDR','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Sukses','Pending','Gagal','Refund']]],
]));

// ── Accounting ─────────────────────────────────────────────────────────────
Route::get('/erp/balance-sheet', fn() => view('erp.balance-sheet'));
Route::get('/erp/trial-balance', fn() => view('erp.trial-balance'));
Route::get('/erp/general-ledger', fn() => view('erp.crud', [
    'title'=>'Buku Besar','description'=>'Laporan buku besar per akun','module'=>'general-ledger',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'keterangan','label'=>'Keterangan','type'=>'text','required'=>true],['name'=>'akun','label'=>'Akun','type'=>'text'],['name'=>'referensi','label'=>'Referensi','type'=>'text'],['name'=>'debet','label'=>'Debet','type'=>'number','format'=>'currency'],['name'=>'kredit','label'=>'Kredit','type'=>'number','format'=>'currency'],['name'=>'saldo','label'=>'Saldo','type'=>'number','format'=>'currency']],
]));
Route::get('/erp/opening-balance', fn() => view('erp.crud', [
    'title'=>'Saldo Awal','description'=>'Input saldo awal per akun saat mulai sistem','module'=>'opening-balance',
    'formFields'=>[['name'=>'akun','label'=>'Nama Akun','type'=>'text','required'=>true],['name'=>'kode_akun','label'=>'Kode Akun','type'=>'text'],['name'=>'saldo_debet','label'=>'Saldo Debet','type'=>'number','format'=>'currency'],['name'=>'saldo_kredit','label'=>'Saldo Kredit','type'=>'number','format'=>'currency'],['name'=>'tanggal','label'=>'Tgl Mulai','type'=>'date'],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea']],
]));
Route::get('/erp/accounting-period', fn() => view('erp.crud', [
    'title'=>'Periode Akuntansi','description'=>'Manajemen periode tutup buku','module'=>'accounting-period',
    'formFields'=>[['name'=>'nama','label'=>'Nama Periode','type'=>'text','required'=>true],['name'=>'mulai','label'=>'Tgl Mulai','type'=>'date'],['name'=>'selesai','label'=>'Tgl Selesai','type'=>'date'],['name'=>'tahun_fiskal','label'=>'Tahun Fiskal','type'=>'number'],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Buka','Tutup','Dalam Proses']]],
    'filterOptions'=>['Buka','Tutup'],
]));
Route::get('/erp/departments', fn() => view('erp.crud', [
    'title'=>'Departemen','description'=>'Master data departemen perusahaan','module'=>'departments',
    'formFields'=>[['name'=>'nama','label'=>'Nama Departemen','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'kepala','label'=>'Kepala Departemen','type'=>'text'],['name'=>'anggota','label'=>'Jumlah Anggota','type'=>'number','default'=>0],['name'=>'budget','label'=>'Budget Tahunan','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/projects', fn() => view('erp.crud', [
    'title'=>'Proyek','description'=>'Manajemen proyek dan cost center','module'=>'projects',
    'formFields'=>[['name'=>'nama','label'=>'Nama Proyek','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode Proyek','type'=>'text'],['name'=>'manager','label'=>'Project Manager','type'=>'text'],['name'=>'mulai','label'=>'Tgl Mulai','type'=>'date'],['name'=>'selesai','label'=>'Tgl Selesai','type'=>'date'],['name'=>'budget','label'=>'Budget','type'=>'number','format'=>'currency'],['name'=>'realisasi','label'=>'Realisasi','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Perencanaan','Berjalan','Selesai','Ditunda']]],
    'filterOptions'=>['Perencanaan','Berjalan','Selesai','Ditunda'],
]));
Route::get('/erp/budgeting', fn() => view('erp.crud', [
    'title'=>'Budgeting','description'=>'Perencanaan dan monitoring anggaran','module'=>'budgeting',
    'formFields'=>[['name'=>'departemen','label'=>'Departemen','type'=>'text','required'=>true],['name'=>'akun','label'=>'Akun Biaya','type'=>'text'],['name'=>'tahun','label'=>'Tahun','type'=>'number','default'=>date('Y')],['name'=>'budget_tahunan','label'=>'Budget Tahunan','type'=>'number','format'=>'currency'],['name'=>'realisasi','label'=>'Realisasi','type'=>'number','format'=>'currency'],['name'=>'sisa','label'=>'Sisa Budget','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Disetujui','Aktif']]],
]));
Route::get('/erp/audit-transaction', fn() => view('erp.crud', [
    'title'=>'Audit Transaksi','description'=>'Audit trail semua transaksi keuangan','module'=>'audit-transaction',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'user','label'=>'User','type'=>'text'],['name'=>'aksi','label'=>'Aksi','type'=>'select','options'=>['Create','Update','Delete','Approve','Reject']],['name'=>'modul','label'=>'Modul','type'=>'text'],['name'=>'referensi','label'=>'No Referensi','type'=>'text'],['name'=>'nilai_lama','label'=>'Nilai Lama','type'=>'textarea'],['name'=>'nilai_baru','label'=>'Nilai Baru','type'=>'textarea']],
]));
Route::get('/erp/activity-timeline', fn() => view('erp.crud', [
    'title'=>'Activity Timeline','description'=>'Log aktivitas pengguna sistem','module'=>'activity-timeline',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'user','label'=>'User','type'=>'text','required'=>true],['name'=>'aktivitas','label'=>'Aktivitas','type'=>'text'],['name'=>'modul','label'=>'Modul','type'=>'text'],['name'=>'ip_address','label'=>'IP Address','type'=>'text'],['name'=>'device','label'=>'Device','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Sukses','Gagal']]],
]));
Route::get('/erp/approval-system', fn() => view('erp.crud', [
    'title'=>'Approval System','description'=>'Konfigurasi alur approval transaksi','module'=>'approval-system',
    'formFields'=>[['name'=>'nama','label'=>'Nama Workflow','type'=>'text','required'=>true],['name'=>'modul','label'=>'Modul','type'=>'text'],['name'=>'level','label'=>'Level Approval','type'=>'number','default'=>1],['name'=>'approver','label'=>'Approver','type'=>'text'],['name'=>'min_nilai','label'=>'Min Nilai','type'=>'number','format'=>'currency'],['name'=>'maks_nilai','label'=>'Maks Nilai','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
]));

// ── Tax ────────────────────────────────────────────────────────────────────
Route::get('/erp/vat', fn() => view('erp.crud', [
    'title'=>'PPN (Value Added Tax)','description'=>'Manajemen pajak pertambahan nilai','module'=>'vat',
    'formFields'=>[['name'=>'periode','label'=>'Periode','type'=>'text','required'=>true],['name'=>'ppn_masukan','label'=>'PPN Masukan','type'=>'number','format'=>'currency'],['name'=>'ppn_keluaran','label'=>'PPN Keluaran','type'=>'number','format'=>'currency'],['name'=>'ppn_terutang','label'=>'PPN Terutang','type'=>'number','format'=>'currency'],['name'=>'tanggal_lapor','label'=>'Tgl Lapor','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Belum Lapor','Sudah Lapor','Lebih Bayar']]],
    'filterOptions'=>['Belum Lapor','Sudah Lapor'],
]));
Route::get('/erp/pph', fn() => view('erp.crud', [
    'title'=>'PPh (Pajak Penghasilan)','description'=>'Manajemen pajak penghasilan','module'=>'pph',
    'formFields'=>[['name'=>'periode','label'=>'Periode','type'=>'text','required'=>true],['name'=>'jenis_pph','label'=>'Jenis PPh','type'=>'select','options'=>['PPh 21','PPh 22','PPh 23','PPh 25','PPh Final']],['name'=>'nama_wp','label'=>'Nama WP','type'=>'text'],['name'=>'npwp','label'=>'NPWP','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah PPh','type'=>'number','format'=>'currency'],['name'=>'tanggal_lapor','label'=>'Tgl Lapor','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Belum Lapor','Sudah Lapor']]],
]));
Route::get('/erp/tax-invoice', fn() => view('erp.crud', [
    'title'=>'Faktur Pajak','description'=>'Manajemen faktur pajak PPN','module'=>'tax-invoice',
    'formFields'=>[['name'=>'nomor','label'=>'No Faktur','type'=>'text','required'=>true],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'lawan_transaksi','label'=>'Lawan Transaksi','type'=>'text'],['name'=>'npwp_lawan','label'=>'NPWP Lawan','type'=>'text'],['name'=>'dpp','label'=>'DPP','type'=>'number','format'=>'currency'],['name'=>'ppn','label'=>'PPN','type'=>'number','format'=>'currency'],['name'=>'tipe','label'=>'Tipe','type'=>'select','options'=>['Faktur Keluaran','Faktur Masukan']],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Normal','Pengganti','Batal']]],
]));
Route::get('/erp/e-faktur', fn() => view('erp.crud', [
    'title'=>'e-Faktur','description'=>'Upload dan rekap e-Faktur ke DJP','module'=>'e-faktur',
    'formFields'=>[['name'=>'nomor','label'=>'No Faktur','type'=>'text','required'=>true],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'file_csv','label'=>'File CSV','type'=>'text'],['name'=>'referensi','label'=>'Referensi','type'=>'text'],['name'=>'total_ppn','label'=>'Total PPN','type'=>'number','format'=>'currency'],['name'=>'status_upload','label'=>'Status Upload','type'=>'select','options'=>['Belum Upload','Sukses','Gagal','Revisi']]],
    'filterOptions'=>['Belum Upload','Sukses','Gagal'],
]));
Route::get('/erp/tax-report', fn() => view('erp.crud', [
    'title'=>'Laporan Pajak','description'=>'Rekap laporan pajak perusahaan','module'=>'tax-report',
    'formFields'=>[['name'=>'periode','label'=>'Periode','type'=>'text','required'=>true],['name'=>'jenis','label'=>'Jenis Pajak','type'=>'select','options'=>['PPN','PPh 21','PPh 23','PPh 25','PPh Final']],['name'=>'ppn_in','label'=>'PPN Masukan','type'=>'number','format'=>'currency'],['name'=>'ppn_out','label'=>'PPN Keluaran','type'=>'number','format'=>'currency'],['name'=>'pph','label'=>'Total PPh','type'=>'number','format'=>'currency'],['name'=>'total','label'=>'Total Pajak','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Dilaporkan']]],
]));

// ── CRM Extended ───────────────────────────────────────────────────────────
Route::get('/erp/customer-group', fn() => view('erp.crud', [
    'title'=>'Customer Group','description'=>'Kelompokkan customer berdasarkan segmen','module'=>'customer-group',
    'formFields'=>[['name'=>'nama','label'=>'Nama Grup','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'deskripsi','label'=>'Deskripsi','type'=>'textarea'],['name'=>'diskon','label'=>'Diskon (%)','type'=>'number','default'=>0],['name'=>'limit_kredit','label'=>'Limit Kredit','type'=>'number','format'=>'currency'],['name'=>'syarat_bayar','label'=>'Syarat Bayar (hari)','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/customer-credit', fn() => view('erp.crud', [
    'title'=>'Customer Credit','description'=>'Manajemen limit kredit pelanggan','module'=>'customer-credit',
    'formFields'=>[['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'limit_kredit','label'=>'Limit Kredit','type'=>'number','format'=>'currency'],['name'=>'terpakai','label'=>'Terpakai','type'=>'number','format'=>'currency'],['name'=>'sisa','label'=>'Sisa Kredit','type'=>'number','format'=>'currency'],['name'=>'jatuh_tempo','label'=>'Jatuh Tempo','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Normal','Mendekati Limit','Melebihi Limit','Blacklist']]],
    'filterOptions'=>['Normal','Mendekati Limit','Melebihi Limit','Blacklist'],
]));
Route::get('/erp/customer-followup', fn() => view('erp.crud', [
    'title'=>'Follow Up Customer','description'=>'Jadwal dan log follow up customer','module'=>'customer-followup',
    'formFields'=>[['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'tanggal','label'=>'Tgl Follow Up','type'=>'date'],['name'=>'jenis','label'=>'Jenis','type'=>'select','options'=>['Telepon','WhatsApp','Email','Kunjungan']],['name'=>'pic','label'=>'PIC Sales','type'=>'text'],['name'=>'catatan','label'=>'Catatan','type'=>'textarea'],['name'=>'follow_up_berikut','label'=>'Follow Up Berikutnya','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Dijadwalkan','Selesai','Batal']]],
    'filterOptions'=>['Dijadwalkan','Selesai','Batal'],
]));
Route::get('/erp/customer-history', fn() => view('erp.crud', [
    'title'=>'Customer History','description'=>'Riwayat interaksi dan transaksi customer','module'=>'customer-history',
    'formFields'=>[['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'jenis','label'=>'Jenis','type'=>'select','options'=>['Pembelian','Pembayaran','Keluhan','Follow Up','Retur']],['name'=>'deskripsi','label'=>'Deskripsi','type'=>'textarea'],['name'=>'nilai','label'=>'Nilai Transaksi','type'=>'number','format'=>'currency'],['name'=>'pic','label'=>'PIC','type'=>'text']],
]));
Route::get('/erp/customer-complaint', fn() => view('erp.crud', [
    'title'=>'Customer Complaint','description'=>'Catat dan tangani keluhan pelanggan','module'=>'customer-complaint',
    'formFields'=>[['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'tanggal','label'=>'Tgl Keluhan','type'=>'date'],['name'=>'keluhan','label'=>'Keluhan','type'=>'textarea'],['name'=>'kategori','label'=>'Kategori','type'=>'select','options'=>['Produk','Pengiriman','Pelayanan','Tagihan','Lainnya']],['name'=>'prioritas','label'=>'Prioritas','type'=>'select','options'=>['Rendah','Normal','Tinggi','Kritis']],['name'=>'pic','label'=>'PIC Handler','type'=>'text'],['name'=>'resolusi','label'=>'Resolusi','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Open','Proses','Resolved','Closed']]],
    'filterOptions'=>['Open','Proses','Resolved','Closed'],
]));
Route::get('/erp/whatsapp-blast', fn() => view('erp.crud', [
    'title'=>'WhatsApp Blast','description'=>'Kirim pesan massal ke customer via WhatsApp','module'=>'whatsapp-blast',
    'formFields'=>[['name'=>'nama_kampanye','label'=>'Nama Kampanye','type'=>'text','required'=>true],['name'=>'template','label'=>'Template Pesan','type'=>'textarea'],['name'=>'target_segment','label'=>'Target Segmen','type'=>'text'],['name'=>'jumlah_target','label'=>'Jumlah Target','type'=>'number'],['name'=>'tanggal_kirim','label'=>'Jadwal Kirim','type'=>'date'],['name'=>'terkirim','label'=>'Terkirim','type'=>'number','default'=>0],['name'=>'gagal','label'=>'Gagal','type'=>'number','default'=>0],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Dijadwalkan','Berjalan','Selesai','Dibatalkan']]],
    'filterOptions'=>['Draft','Dijadwalkan','Berjalan','Selesai'],
]));
Route::get('/erp/payment-reminder', fn() => view('erp.crud', [
    'title'=>'Reminder Pembayaran','description'=>'Otomasi reminder tagihan ke customer','module'=>'payment-reminder',
    'formFields'=>[['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'nomor_invoice','label'=>'No Invoice','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah Tagihan','type'=>'number','format'=>'currency'],['name'=>'jatuh_tempo','label'=>'Jatuh Tempo','type'=>'date'],['name'=>'metode','label'=>'Metode Reminder','type'=>'select','options'=>['WhatsApp','SMS','Email']],['name'=>'tanggal_kirim','label'=>'Tgl Kirim','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Terjadwal','Terkirim','Gagal']]],
    'filterOptions'=>['Terjadwal','Terkirim','Gagal'],
]));

// ── Delivery Extended ──────────────────────────────────────────────────────
Route::get('/erp/delivery-note', fn() => view('erp.crud', [
    'title'=>'Surat Jalan','description'=>'Manajemen surat jalan pengiriman','module'=>'delivery-note',
    'formFields'=>[['name'=>'nomor','label'=>'No Surat Jalan','type'=>'text','required'=>true],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'customer','label'=>'Customer','type'=>'text'],['name'=>'alamat','label'=>'Alamat Tujuan','type'=>'textarea'],['name'=>'driver','label'=>'Driver','type'=>'text'],['name'=>'kendaraan','label'=>'Kendaraan','type'=>'text'],['name'=>'total_item','label'=>'Total Item','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Dalam Perjalanan','Terkirim','Gagal']]],
    'filterOptions'=>['Draft','Dalam Perjalanan','Terkirim','Gagal'],
]));
Route::get('/erp/tracking', fn() => view('erp.crud', [
    'title'=>'Tracking Pengiriman','description'=>'Pantau lokasi dan status pengiriman','module'=>'tracking',
    'formFields'=>[['name'=>'nomor_order','label'=>'No Order/SJ','type'=>'text','required'=>true],['name'=>'customer','label'=>'Customer','type'=>'text'],['name'=>'driver','label'=>'Driver','type'=>'text'],['name'=>'lokasi_terakhir','label'=>'Lokasi Terakhir','type'=>'text'],['name'=>'estimasi_tiba','label'=>'Estimasi Tiba','type'=>'date'],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Menunggu Pickup','Dalam Perjalanan','Terkirim','Gagal']]],
    'filterOptions'=>['Menunggu Pickup','Dalam Perjalanan','Terkirim','Gagal'],
]));
Route::get('/erp/fleet', fn() => view('erp.crud', [
    'title'=>'Armada Kendaraan','description'=>'Manajemen kendaraan pengiriman','module'=>'fleet',
    'formFields'=>[['name'=>'nomor_plat','label'=>'No Plat','type'=>'text','required'=>true],['name'=>'jenis','label'=>'Jenis','type'=>'select','options'=>['Motor','Mobil Box','Truk','Pickup']],['name'=>'merek','label'=>'Merek/Model','type'=>'text'],['name'=>'driver','label'=>'Driver Tetap','type'=>'text'],['name'=>'kapasitas','label'=>'Kapasitas (kg)','type'=>'number'],['name'=>'servis_terakhir','label'=>'Servis Terakhir','type'=>'date'],['name'=>'servis_berikut','label'=>'Servis Berikutnya','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Servis','Rusak','Non-Aktif']]],
    'filterOptions'=>['Aktif','Servis','Rusak','Non-Aktif'],
]));
Route::get('/erp/drivers', fn() => view('erp.crud', [
    'title'=>'Data Driver','description'=>'Master data driver pengiriman','module'=>'drivers',
    'formFields'=>[['name'=>'nama','label'=>'Nama Driver','type'=>'text','required'=>true],['name'=>'nomor_sim','label'=>'No SIM','type'=>'text'],['name'=>'jenis_sim','label'=>'Tipe SIM','type'=>'select','options'=>['SIM A','SIM B1','SIM B2','SIM C']],['name'=>'telepon','label'=>'Telepon','type'=>'text'],['name'=>'area','label'=>'Area Pengiriman','type'=>'text'],['name'=>'kendaraan','label'=>'Kendaraan','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Off','Non-Aktif']]],
    'filterOptions'=>['Aktif','Off','Non-Aktif'],
]));
Route::get('/erp/delivery-schedule', fn() => view('erp.crud', [
    'title'=>'Jadwal Pengiriman','description'=>'Jadwal dan rute pengiriman driver','module'=>'delivery-schedule',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'driver','label'=>'Driver','type'=>'text','required'=>true],['name'=>'kendaraan','label'=>'Kendaraan','type'=>'text'],['name'=>'area','label'=>'Area Tujuan','type'=>'text'],['name'=>'jumlah_order','label'=>'Jumlah Order','type'=>'number'],['name'=>'estimasi_jam','label'=>'Estimasi Berangkat','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Terjadwal','Berangkat','Selesai','Dibatalkan']]],
    'filterOptions'=>['Terjadwal','Berangkat','Selesai'],
]));

// ── HRD Extended ───────────────────────────────────────────────────────────
Route::get('/erp/incentive', fn() => view('erp.crud', [
    'title'=>'Insentif Karyawan','description'=>'Manajemen insentif dan bonus karyawan','module'=>'incentive',
    'formFields'=>[['name'=>'karyawan','label'=>'Nama Karyawan','type'=>'text','required'=>true],['name'=>'bulan','label'=>'Bulan','type'=>'text'],['name'=>'tahun','label'=>'Tahun','type'=>'number','default'=>date('Y')],['name'=>'tipe','label'=>'Tipe','type'=>'select','options'=>['Komisi','Bonus Kinerja','Bonus Proyek','THR','Lainnya']],['name'=>'jumlah','label'=>'Jumlah','type'=>'number','format'=>'currency'],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Pending','Disetujui','Dibayar']]],
    'filterOptions'=>['Pending','Disetujui','Dibayar'],
]));
Route::get('/erp/division', fn() => view('erp.crud', [
    'title'=>'Divisi','description'=>'Master data divisi perusahaan','module'=>'division',
    'formFields'=>[['name'=>'nama','label'=>'Nama Divisi','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'kepala_divisi','label'=>'Kepala Divisi','type'=>'text'],['name'=>'jumlah_anggota','label'=>'Jumlah Anggota','type'=>'number','default'=>0],['name'=>'budget','label'=>'Budget Tahunan','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/login-activity', fn() => view('erp.crud', [
    'title'=>'Login Activity','description'=>'Log aktivitas login pengguna','module'=>'login-activity',
    'formFields'=>[['name'=>'user','label'=>'User','type'=>'text','required'=>true],['name'=>'tanggal','label'=>'Tanggal Login','type'=>'date'],['name'=>'waktu','label'=>'Waktu','type'=>'text'],['name'=>'ip_address','label'=>'IP Address','type'=>'text'],['name'=>'device','label'=>'Device/Browser','type'=>'text'],['name'=>'lokasi','label'=>'Lokasi','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Sukses','Gagal']]],
    'filterOptions'=>['Sukses','Gagal'],
]));
Route::get('/erp/device-management', fn() => view('erp.crud', [
    'title'=>'Device Management','description'=>'Kelola perangkat yang terdaftar','module'=>'device-management',
    'formFields'=>[['name'=>'nama','label'=>'Nama Device','type'=>'text','required'=>true],['name'=>'tipe','label'=>'Tipe','type'=>'select','options'=>['PC','Laptop','Smartphone','Tablet']],['name'=>'user','label'=>'User','type'=>'text'],['name'=>'sistem_operasi','label'=>'OS','type'=>'text'],['name'=>'terakhir_aktif','label'=>'Terakhir Aktif','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Tidak Aktif','Diblokir']]],
    'filterOptions'=>['Aktif','Tidak Aktif','Diblokir'],
]));

// ── Service Center ─────────────────────────────────────────────────────────
Route::get('/erp/sparepart', fn() => view('erp.crud', [
    'title'=>'Sparepart','description'=>'Stok dan manajemen sparepart service center','module'=>'sparepart',
    'formFields'=>[['name'=>'nama','label'=>'Nama Sparepart','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'merek','label'=>'Merek/Kompatibel','type'=>'text'],['name'=>'stok','label'=>'Stok','type'=>'number','default'=>0],['name'=>'satuan','label'=>'Satuan','type'=>'text'],['name'=>'harga_beli','label'=>'Harga Beli','type'=>'number','format'=>'currency'],['name'=>'harga_jual','label'=>'Harga Jual','type'=>'number','format'=>'currency'],['name'=>'min_stok','label'=>'Min Stok','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Tersedia','Habis','Discontinue']]],
    'filterOptions'=>['Tersedia','Habis','Discontinue'],
]));
Route::get('/erp/technician', fn() => view('erp.crud', [
    'title'=>'Teknisi','description'=>'Data teknisi dan spesialisasi servis','module'=>'technician',
    'formFields'=>[['name'=>'nama','label'=>'Nama Teknisi','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode Teknisi','type'=>'text'],['name'=>'spesialisasi','label'=>'Spesialisasi','type'=>'text'],['name'=>'telepon','label'=>'Telepon','type'=>'text'],['name'=>'sertifikasi','label'=>'Sertifikasi','type'=>'text'],['name'=>'beban_kerja','label'=>'Beban Kerja Sekarang','type'=>'number','default'=>0],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Sibuk','Libur','Non-Aktif']]],
    'filterOptions'=>['Aktif','Sibuk','Libur'],
]));
Route::get('/erp/service-schedule', fn() => view('erp.crud', [
    'title'=>'Jadwal Service','description'=>'Jadwal penerimaan dan pengerjaan servis','module'=>'service-schedule',
    'formFields'=>[['name'=>'nomor','label'=>'No Service','type'=>'text','required'=>true],['name'=>'customer','label'=>'Customer','type'=>'text'],['name'=>'barang','label'=>'Barang','type'=>'text'],['name'=>'keluhan','label'=>'Keluhan','type'=>'textarea'],['name'=>'tanggal_masuk','label'=>'Tgl Masuk','type'=>'date'],['name'=>'teknisi','label'=>'Teknisi','type'=>'text'],['name'=>'estimasi_selesai','label'=>'Estimasi Selesai','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Antri','Dikerjakan','Selesai','Diambil','Batal']]],
    'filterOptions'=>['Antri','Dikerjakan','Selesai'],
]));
Route::get('/erp/service-history', fn() => view('erp.crud', [
    'title'=>'Riwayat Service','description'=>'Histori lengkap pengerjaan servis','module'=>'service-history',
    'formFields'=>[['name'=>'nomor','label'=>'No Service','type'=>'text','required'=>true],['name'=>'customer','label'=>'Customer','type'=>'text'],['name'=>'barang','label'=>'Barang','type'=>'text'],['name'=>'keluhan','label'=>'Keluhan','type'=>'textarea'],['name'=>'solusi','label'=>'Solusi','type'=>'textarea'],['name'=>'teknisi','label'=>'Teknisi','type'=>'text'],['name'=>'tanggal_masuk','label'=>'Tgl Masuk','type'=>'date'],['name'=>'tanggal_selesai','label'=>'Tgl Selesai','type'=>'date'],['name'=>'biaya_jasa','label'=>'Biaya Jasa','type'=>'number','format'=>'currency'],['name'=>'biaya_sparepart','label'=>'Biaya Sparepart','type'=>'number','format'=>'currency'],['name'=>'total','label'=>'Total','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Selesai','Garansi','Dikembalikan']]],
]));

// ── Reports ────────────────────────────────────────────────────────────────
Route::get('/erp/report-purchase', fn() => view('erp.crud', [
    'title'=>'Laporan Pembelian','description'=>'Rekap laporan pembelian dari supplier','module'=>'report-purchase',
    'formFields'=>[['name'=>'periode','label'=>'Periode','type'=>'text','required'=>true],['name'=>'supplier','label'=>'Supplier','type'=>'text'],['name'=>'jumlah_po','label'=>'Jumlah PO','type'=>'number'],['name'=>'total_nilai','label'=>'Total Nilai','type'=>'number','format'=>'currency'],['name'=>'on_time','label'=>'On Time (%)','type'=>'number'],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea']],
]));
Route::get('/erp/report-inventory', fn() => view('erp.crud', [
    'title'=>'Laporan Inventori','description'=>'Rekap laporan stok dan nilai persediaan','module'=>'report-inventory',
    'formFields'=>[['name'=>'produk','label'=>'Produk','type'=>'text','required'=>true],['name'=>'kategori','label'=>'Kategori','type'=>'text'],['name'=>'stok','label'=>'Stok Saat Ini','type'=>'number'],['name'=>'nilai_inventory','label'=>'Nilai Inventory','type'=>'number','format'=>'currency'],['name'=>'perputaran','label'=>'Perputaran/Tahun','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Normal','Rendah','Lebih']]],
]));
Route::get('/erp/report-tax', fn() => view('erp.crud', [
    'title'=>'Laporan Pajak','description'=>'Rekap semua kewajiban pajak','module'=>'report-tax',
    'formFields'=>[['name'=>'periode','label'=>'Periode','type'=>'text','required'=>true],['name'=>'jenis','label'=>'Jenis Pajak','type'=>'text'],['name'=>'ppn_in','label'=>'PPN Masukan','type'=>'number','format'=>'currency'],['name'=>'ppn_out','label'=>'PPN Keluaran','type'=>'number','format'=>'currency'],['name'=>'pph','label'=>'PPh Terutang','type'=>'number','format'=>'currency'],['name'=>'total','label'=>'Total Pajak','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Dilaporkan']]],
]));
Route::get('/erp/profit-product', fn() => view('erp.crud', [
    'title'=>'Profit per Produk','description'=>'Analisa profit margin per produk','module'=>'profit-product',
    'formFields'=>[['name'=>'produk','label'=>'Produk','type'=>'text','required'=>true],['name'=>'kategori','label'=>'Kategori','type'=>'text'],['name'=>'total_terjual','label'=>'Qty Terjual','type'=>'number'],['name'=>'hpp','label'=>'HPP','type'=>'number','format'=>'currency'],['name'=>'harga_jual','label'=>'Harga Jual Rata','type'=>'number','format'=>'currency'],['name'=>'margin_persen','label'=>'Margin (%)','type'=>'number'],['name'=>'total_profit','label'=>'Total Profit','type'=>'number','format'=>'currency']],
]));
Route::get('/erp/profit-branch', fn() => view('erp.crud', [
    'title'=>'Profit per Cabang','description'=>'Analisa profitabilitas per cabang','module'=>'profit-branch',
    'formFields'=>[['name'=>'cabang','label'=>'Cabang','type'=>'text','required'=>true],['name'=>'periode','label'=>'Periode','type'=>'text'],['name'=>'omzet','label'=>'Omzet','type'=>'number','format'=>'currency'],['name'=>'hpp','label'=>'HPP','type'=>'number','format'=>'currency'],['name'=>'biaya_operasional','label'=>'Biaya Operasional','type'=>'number','format'=>'currency'],['name'=>'profit','label'=>'Profit Bersih','type'=>'number','format'=>'currency'],['name'=>'margin','label'=>'Margin (%)','type'=>'number']],
]));
Route::get('/erp/sales-trend', fn() => view('erp.crud', [
    'title'=>'Trend Penjualan','description'=>'Analisa tren dan pola penjualan','module'=>'sales-trend',
    'formFields'=>[['name'=>'periode','label'=>'Periode','type'=>'text','required'=>true],['name'=>'omzet','label'=>'Omzet','type'=>'number','format'=>'currency'],['name'=>'jumlah_order','label'=>'Jumlah Order','type'=>'number'],['name'=>'rata_per_order','label'=>'Rata per Order','type'=>'number','format'=>'currency'],['name'=>'growth_persen','label'=>'Growth (%)','type'=>'number'],['name'=>'top_produk','label'=>'Top Produk','type'=>'text']],
]));
Route::get('/erp/export-pdf', fn() => view('erp.crud', [
    'title'=>'Export PDF','description'=>'Generate dan download laporan PDF','module'=>'export-pdf',
    'formFields'=>[['name'=>'nama_laporan','label'=>'Nama Laporan','type'=>'text','required'=>true],['name'=>'modul','label'=>'Modul','type'=>'text'],['name'=>'periode','label'=>'Periode','type'=>'text'],['name'=>'tanggal_export','label'=>'Tgl Export','type'=>'date'],['name'=>'format','label'=>'Format','type'=>'select','options'=>['PDF','PDF + Kop Surat','PDF Landscape']],['name'=>'ukuran','label'=>'Ukuran Kertas','type'=>'select','options'=>['A4','Letter','F4']],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Antri','Diproses','Selesai','Gagal']]],
]));
Route::get('/erp/export-excel', fn() => view('erp.crud', [
    'title'=>'Export Excel','description'=>'Generate dan download laporan Excel','module'=>'export-excel',
    'formFields'=>[['name'=>'nama_laporan','label'=>'Nama Laporan','type'=>'text','required'=>true],['name'=>'modul','label'=>'Modul','type'=>'text'],['name'=>'periode','label'=>'Periode','type'=>'text'],['name'=>'tanggal_export','label'=>'Tgl Export','type'=>'date'],['name'=>'format','label'=>'Format','type'=>'select','options'=>['XLSX','XLS','CSV']],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Antri','Diproses','Selesai','Gagal']]],
]));

// ── System ─────────────────────────────────────────────────────────────────
Route::get('/erp/company-profile', fn() => view('erp.crud', [
    'title'=>'Profil Perusahaan','description'=>'Informasi dan identitas perusahaan','module'=>'company-profile',
    'formFields'=>[['name'=>'nama_perusahaan','label'=>'Nama Perusahaan','type'=>'text','required'=>true],['name'=>'npwp','label'=>'NPWP','type'=>'text'],['name'=>'alamat','label'=>'Alamat','type'=>'textarea'],['name'=>'kota','label'=>'Kota','type'=>'text'],['name'=>'telepon','label'=>'Telepon','type'=>'text'],['name'=>'email','label'=>'Email','type'=>'email'],['name'=>'website','label'=>'Website','type'=>'text'],['name'=>'direktur','label'=>'Direktur','type'=>'text']],
]));
Route::get('/erp/document-numbering', fn() => view('erp.crud', [
    'title'=>'Penomoran Dokumen','description'=>'Format dan counter nomor dokumen','module'=>'document-numbering',
    'formFields'=>[['name'=>'modul','label'=>'Modul/Dokumen','type'=>'text','required'=>true],['name'=>'prefix','label'=>'Prefix','type'=>'text'],['name'=>'format','label'=>'Format','type'=>'text','placeholder'=>'PO/{YYYY}/{MM}/{NNN}'],['name'=>'urutan_terakhir','label'=>'Urutan Terakhir','type'=>'number','default'=>0],['name'=>'panjang_angka','label'=>'Panjang Angka','type'=>'number','default'=>3],['name'=>'reset_tahunan','label'=>'Reset Tahunan?','type'=>'select','options'=>['Ya','Tidak']],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
]));

// Marketplace sub-platform wildcard routes (Shopee/TikTok/Tokopedia/Lazada under /erp/)
$platformPageTitles = [
    'dashboard'       => 'Dashboard',
    'orders'          => 'Orders',
    'pending-orders'  => 'Pending Orders',
    'process-orders'  => 'Process Orders',
    'completed-orders'=> 'Completed Orders',
    'cancel-orders'   => 'Cancel Orders',
    'return-refund'   => 'Return & Refund',
    'products'        => 'Products',
    'product-mapping' => 'Product Mapping',
    'product-draft'   => 'Product Draft',
    'bulk-upload'     => 'Bulk Upload Product',
    'product-sync'    => 'Product Sync',
    'stocks'          => 'Stocks',
    'stock-sync'      => 'Stock Sync',
    'stock-buffer'    => 'Stock Buffer',
    'chat'            => 'Chat',
    'chat-ai'         => 'Chat AI Reply',
    'chat-broadcast'  => 'Chat Broadcast',
    'shipping'        => 'Shipping',
    'shipping-label'  => 'Shipping Label',
    'pickup'          => 'Pickup Request',
    'voucher'         => 'Voucher',
    'campaign'        => 'Campaign',
    'flash-sale'      => 'Flash Sale',
    'customer'        => 'Customer',
    'customer-loyalty'=> 'Customer Loyalty',
    'analytics'       => 'Analytics',
    'profit'          => 'Profit Analytics',
    'fees'            => 'Fee Analytics',
    'settlement'      => 'Finance Settlement',
    'cod-monitor'     => 'COD Monitoring',
    'api-settings'    => 'API Settings',
    'webhook'         => 'Webhook',
    'logs'            => 'Activity Logs',
    'errors'          => 'Error Logs',
];
Route::get('/erp/{platform}/{page}', function ($platform, $page) use ($platformPageTitles) {
    $platforms = ['shopee' => 'Shopee', 'tiktok' => 'TikTok Shop', 'tokopedia' => 'Tokopedia', 'lazada' => 'Lazada'];
    if (!array_key_exists($platform, $platforms)) abort(404);
    $platformName = $platforms[$platform];
    $pageTitle    = $platformPageTitles[$page] ?? ucwords(str_replace('-', ' ', $page));
    $title        = $platformName . ' — ' . $pageTitle;
    $description  = 'Fitur ' . $pageTitle . ' untuk toko ' . $platformName . ' Anda.';
    $features     = ['Integrasi ' . $platformName . ' API', 'Sinkronisasi real-time', 'Dashboard terpadu', 'Notifikasi otomatis'];
    return view('erp.coming-soon', compact('title', 'description', 'features'));
})->where('platform', 'shopee|tiktok|tokopedia|lazada');

// ── POS System — proxy ke React dev server (port 5173) ─────────────────────
Route::get('/pos/{path?}', function ($path = '') {
    if (app()->environment('production')) {
        // Di production, serve dari build output jika ada
        $buildPath = public_path('pos/index.html');
        if (file_exists($buildPath)) {
            return response()->file($buildPath);
        }
        return response('<html><body style="font-family:sans-serif;padding:40px">
            <h2>POS System</h2>
            <p>Build belum tersedia. Jalankan: <code>cd frontend/artifacts/pos-app && pnpm build</code></p>
        </body></html>', 200)->header('Content-Type', 'text/html');
    }

    // Development: proxy ke Vite dev server
    $query = request()->getQueryString();
    $url   = 'http://localhost:5173/pos/' . $path . ($query ? '?' . $query : '');

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_FAILONERROR    => false,
        CURLOPT_HEADER         => true,
    ]);
    $response = curl_exec($ch);
    $errno    = curl_errno($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    curl_close($ch);

    if ($errno || $httpCode === 0) {
        return response()->view('pos-placeholder')->header('Content-Type', 'text/html');
    }

    $headers = substr($response, 0, $headerSize);
    $body    = substr($response, $headerSize);

    $contentType = 'text/html';
    foreach (explode("\r\n", $headers) as $header) {
        if (stripos($header, 'content-type:') === 0) {
            $contentType = trim(substr($header, 13));
            break;
        }
    }

    return response($body, $httpCode)->header('Content-Type', $contentType);
})->where('path', '.*');
?>
