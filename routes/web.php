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
Route::get('/api/kledo/data-penjualan', [KledoController::class, 'dataPenjualan']);

// Coming Soon routes
$comingSoon = [
    'erp/retur'           => ['Retur', 'Manajemen pengembalian barang dari customer.', ['Retur barang', 'Alasan retur', 'Proses pengembalian dana', 'Laporan retur']],
    'erp/discount'        => ['Diskon & Promo', 'Manajemen program diskon dan promosi penjualan.', ['Buat kode promo', 'Diskon per produk / kategori', 'Periode promosi', 'Laporan efektivitas promo']],
    'erp/stock-in'        => ['Stok Masuk', 'Pencatatan barang masuk ke gudang.', ['Input penerimaan barang', 'Sinkronisasi dari PO', 'Riwayat stok masuk', 'Cetak label']],
    'erp/stock-out'       => ['Stok Keluar', 'Pencatatan barang keluar dari gudang.', ['Input pengeluaran barang', 'Stok keluar per order', 'Riwayat stok keluar']],
    'erp/warehouse'       => ['Gudang', 'Manajemen lokasi dan zona penyimpanan gudang.', ['Peta gudang', 'Zona penyimpanan', 'Transfer antar lokasi', 'Kapasitas gudang']],
    'erp/supplier'        => ['Supplier', 'Database dan manajemen supplier/vendor.', ['Daftar supplier', 'Kontak & alamat', 'Riwayat transaksi', 'Rating supplier']],
    'erp/purchase-order'  => ['Purchase Order', 'Buat dan kelola PO ke supplier.', ['Buat PO ke supplier', 'Approval PO', 'Status pengiriman supplier', 'Riwayat PO']],
    'erp/goods-receipt'   => ['Penerimaan Barang', 'Konfirmasi penerimaan barang dari supplier.', ['Input penerimaan', 'Verifikasi terhadap PO', 'Notifikasi admin', 'Cetak surat jalan']],
    'erp/cash-in'         => ['Kas Masuk', 'Pencatatan semua pemasukan kas.', ['Input kas masuk', 'Kategorisasi', 'Rekonsiliasi bank', 'Laporan kas masuk']],
    'erp/cash-out'        => ['Kas Keluar', 'Pencatatan semua pengeluaran kas.', ['Input pengeluaran', 'Approval pengeluaran', 'Bukti pengeluaran', 'Laporan kas keluar']],
    'erp/profit-loss'     => ['Laba Rugi', 'Laporan laba rugi periode tertentu.', ['Laba rugi harian/bulanan/tahunan', 'Grafik tren', 'Export PDF/Excel', 'Perbandingan periode']],
    'erp/expense'         => ['Pengeluaran', 'Manajemen biaya operasional.', ['Kategori biaya', 'Approval biaya', 'Budget monitoring', 'Laporan pengeluaran']],
    'erp/loyalty'         => ['Loyalty Points', 'Program poin reward untuk pelanggan setia.', ['Akumulasi poin', 'Redeem poin', 'Level membership', 'Riwayat poin']],
    'erp/delivery-proof'  => ['Bukti Pengiriman', 'Dokumentasi foto bukti pengiriman.', ['Upload foto bukti', 'Tanda tangan digital', 'Koordinat GPS', 'Laporan pengiriman']],
    'erp/report-sales'    => ['Laporan Penjualan', 'Analisis performa penjualan tim sales.', ['Top produk terlaris', 'Performa per sales', 'Tren penjualan', 'Export laporan']],
    'erp/report-finance'  => ['Laporan Keuangan', 'Ringkasan keuangan perusahaan.', ['Neraca keuangan', 'Arus kas', 'Laba rugi', 'Piutang & hutang']],
    'erp/report-driver'   => ['Laporan Driver', 'Performa dan produktivitas driver.', ['Jumlah pengiriman', 'Tepat waktu vs terlambat', 'Rute terpopuler', 'Rating driver']],
    'erp/users'           => ['Manajemen User', 'Kelola user, role, dan hak akses.', ['Tambah user', 'Assign role', 'Hak akses per menu', 'Activity log']],
    'erp/notifications'   => ['Log Notifikasi WA', 'Riwayat pengiriman pesan WhatsApp.', ['Log pesan terkirim', 'Pesan gagal & retry', 'Template pesan', 'Statistik WA']],
    'erp/ai-inventory'    => ['AI Inventory', 'Prediksi stok dan reorder otomatis berbasis AI.', ['Prediksi kebutuhan stok', 'Auto reorder saat stok menipis', 'Analisis tren demand', 'Rekomendasi supplier']],
    'erp/ai-analytics'    => ['AI Analytics', 'Dashboard analitik prediktif berbasis AI.', ['Prediksi penjualan 30 hari', 'Rekomendasi produk top', 'Customer lifetime value', 'Anomaly detection']],
    'erp/multi-branch'    => ['Multi Cabang', 'Kelola beberapa toko/cabang dalam satu sistem.', ['Dashboard per cabang', 'Transfer stok antar cabang', 'Laporan konsolidasi', 'Hak akses per cabang']],
    'erp/payment-gateway' => ['Payment Gateway', 'Integrasi pembayaran online Midtrans / Stripe.', ['Link pembayaran otomatis', 'Konfirmasi pembayaran real-time', 'Refund otomatis', 'Rekonsiliasi transaksi']],
    'erp/mobile-sync'     => ['Mobile App Sync', 'Sinkronisasi data ke aplikasi Android / iOS.', ['Sinkronisasi real-time', 'Mode offline', 'Push notification', 'Scan barcode via kamera']],
    'erp/chatbot'         => ['Chatbot AI', 'Asisten customer service berbasis AI.', ['Auto-reply WhatsApp', 'Cek status order via WA', 'FAQ otomatis', 'Eskalasi ke human agent']],
    'erp/tax-accounting'  => ['Pajak & Akuntansi', 'Modul pajak otomatis dan laporan akuntansi lengkap.', ['Perhitungan PPN otomatis', 'Laporan SPT', 'Jurnal akuntansi', 'Integrasi e-Faktur']],
];

foreach ($comingSoon as $path => [$title, $description, $features]) {
    Route::get('/' . $path, function() use ($title, $description, $features) {
        return view('erp.coming-soon', compact('title', 'description', 'features'));
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

// AKUNTANSI
$accountingComingSoon = [
    'erp/chart-of-accounts' => ['Chart of Accounts (COA)', 'Struktur akun untuk pembukuan lengkap.', ['Akun aktiva', 'Akun pasiva', 'Akun pendapatan', 'Akun biaya']],
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

// SALES FLOW
$salesFlowComingSoon = [
    'erp/quotation' => ['Quotation / Penawaran', 'Buat dan kirim penawaran harga ke customer.', ['Template quotation', 'Validitas quotation', 'Konversi ke sales order']],
    'erp/sales-target' => ['Sales Target', 'Target penjualan per salesman/periode.', ['Target bulanan', 'Target tahunan', 'Tracking pencapaian']],
    'erp/sales-commission' => ['Komisi Sales', 'Perhitungan komisi penjualan otomatis.', ['Komisi per produk', 'Komisi per target', 'Pembayaran komisi']],
    'erp/sales-receivable' => ['Piutang Penjualan', 'Monitoring piutang dari penjualan.', ['Invoice outstanding', 'Collection tracking', 'Bad debt provision']],
    'erp/order-tracking' => ['Tracking Status Order', 'Monitoring status pesanan dari awal sampai selesai.', ['Status real-time', 'ETA estimation', 'Customer notification']],
];

// HR / KARYAWAN
$hrComingSoon = [
    'erp/employees' => ['Data Karyawan', 'Database lengkap data karyawan.', ['Profil karyawan', 'Data pribadi', 'Data kepegawaian']],
    'erp/attendance' => ['Absensi', 'Sistem absensi karyawan.', ['Check-in/out', 'Overtime tracking', 'Laporan absensi']],
    'erp/payroll' => ['Gaji', 'Perhitungan gaji dan payroll processing.', ['Perhitungan gaji', 'Deductions', 'Payslip generation']],
    'erp/roles' => ['Role & Hak Akses', 'Manajemen role dan permission sistem.', ['Role management', 'Permission matrix', 'User assignment']],
    'erp/audit-log' => ['Aktivitas User / Audit Log', 'Log aktivitas semua user dalam sistem.', ['Login history', 'Action tracking', 'Security audit']],
];

// DASHBOARD ANALYTICS
$analyticsComingSoon = [
    'erp/analytics' => ['Analytics Dashboard', 'Dashboard analitik komprehensif.', ['Real-time metrics', 'Custom dashboard', 'Export analytics']],
];

// FITUR TOKO ELEKTRONIK
$electronicStoreComingSoon = [
    'erp/service' => ['Servis Barang', 'Manajemen servis produk elektronik.', ['Service request', 'Service tracking', 'Service history']],
    'erp/warranty' => ['Klaim Garansi', 'Proses klaim garansi produk.', ['Warranty check', 'Claim processing', 'Warranty status']],
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
    // Marketplace Dashboard
    'erp/marketplace-overview'       => ['Overview Marketplace', 'Ringkasan performa semua marketplace.', ['Total order semua platform', 'Revenue per platform', 'Top produk', 'Trend omzet']],
    'erp/marketplace-sync'           => ['Sinkronisasi Marketplace', 'Sinkronisasi data ke semua marketplace.', ['Sync produk', 'Sync stok', 'Sync harga', 'Log sinkronisasi']],
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
?>
