<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;
use App\Http\Controllers\KledoController;
use App\Http\Controllers\Shopee\ShopeeController;

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

    Route::get('/marketplace/shopee',        [ShopeeController::class, 'dashboard'])->name('marketplace.shopee.dashboard');
    Route::get('/marketplace/shopee/orders', [ShopeeController::class, 'orders'])->name('marketplace.shopee.orders');
});

Route::get('/marketplace', function () {
    return view('erp.coming-soon', [
        'title' => 'Marketplace Center',
        'description' => 'Dashboard pusat untuk mengelola seluruh integrasi marketplace.',
        'features' => [
            'Akses cepat ke semua marketplace',
            'Pelacakan pesanan multi-channel',
            'Sinkronisasi produk dan stok',
            'Analitik performa marketplace',
        ],
    ]);
});

$marketplaceComingSoon = [
    'marketplace/shopee/products' => ['Produk Shopee', 'Kelola katalog produk Shopee dan sinkronisasikan atribut produk dengan sistem ERP.', ['Kelola katalog produk', 'Sinkronisasi stok produk', 'Update deskripsi produk']],
    'marketplace/shopee/stocks' => ['Stok Shopee', 'Pantau dan sinkronkan stok produk Shopee dengan gudang internal.', ['Monitoring stok realtime', 'Sinkronisasi otomatis', 'Notifikasi stok rendah']],
    'marketplace/shopee/chat' => ['Chat Shopee', 'Kelola pesan pelanggan Shopee dari satu tempat.', ['Balas pesan pelanggan', 'Filter chat menurut status', 'Riwayat percakapan']],
    'marketplace/shopee/shipping' => ['Pengiriman Shopee', 'Atur metode pengiriman dan pelacakan pesanan Shopee.', ['Manajemen kurir', 'Status pengiriman', 'Cetak label pengiriman']],
    'marketplace/shopee/vouchers' => ['Voucher Shopee', 'Buat dan kelola voucher serta promo Shopee.', ['Buat voucher diskon', 'Atur periode promo', 'Laporan penggunaan voucher']],
    'marketplace/shopee/customers' => ['Customer Shopee', 'Kelola data pelanggan dan riwayat pembelian Shopee.', ['Data pelanggan', 'Riwayat pembelian', 'Segmentasi pelanggan']],
    'marketplace/shopee/analytics' => ['Analytics Shopee', 'Lihat laporan performa penjualan dan metrik Shopee.', ['Laporan penjualan', 'Trend produk', 'Analitik customer']],
    'marketplace/shopee/settings' => ['Pengaturan API Shopee', 'Konfigurasi koneksi API Shopee dan setelan integrasi.', ['Partner ID & Key', 'Token akses', 'Pengaturan webhook']],
    'marketplace/tiktok-shop' => ['Dashboard TikTok Shop', 'Overview integrasi TikTok Shop dan performa channel.', ['Ringkasan pesanan', 'Status koneksi', 'Notifikasi integrasi']],
    'marketplace/tiktok-shop/orders' => ['Pesanan TikTok Shop', 'Kelola pesanan TikTok Shop dari satu tempat.', ['Tracking pesanan', 'Filter status', 'Sinkronisasi ERP']],
    'marketplace/tiktok-shop/products' => ['Produk TikTok Shop', 'Kelola produk TikTok Shop dan sinkronisasikan katalog.', ['Daftar produk', 'Sinkronisasi stok', 'Update harga']],
    'marketplace/tiktok-shop/stocks' => ['Stok TikTok Shop', 'Pantau stok produk TikTok Shop.', ['Monitoring stok', 'Sinkron stok', 'Alert stok minimal']],
    'marketplace/tiktok-shop/chat' => ['Chat TikTok Shop', 'Kelola pesan pelanggan TikTok Shop.', ['Balas chat', 'Filter percakapan', 'Riwayat interaksi']],
    'marketplace/tiktok-shop/shipping' => ['Pengiriman TikTok Shop', 'Kelola proses pengiriman dan pelacakan TikTok Shop.', ['Metode pengiriman', 'Status kirim', 'Cetak surat jalan']],
    'marketplace/tiktok-shop/vouchers' => ['Voucher TikTok Shop', 'Atur voucher dan promo untuk TikTok Shop.', ['Manajemen promo', 'Periode diskon', 'Laporan penggunaan']],
    'marketplace/tiktok-shop/customers' => ['Customer TikTok Shop', 'Kelola pelanggan TikTok Shop.', ['Data pelanggan', 'Riwayat pembelian', 'Segmentasi']],
    'marketplace/tiktok-shop/analytics' => ['Analytics TikTok Shop', 'Lihat performa dan analitik TikTok Shop.', ['Laporan channel', 'Produk terlaris', 'Analitik customer']],
    'marketplace/tiktok-shop/settings' => ['Pengaturan API TikTok Shop', 'Konfigurasi koneksi API TikTok Shop.', ['API key', 'Webhook', 'Pengaturan integrasi']],
    'marketplace/tokopedia' => ['Dashboard Tokopedia', 'Overview integrasi Tokopedia dan performa penjualan.', ['Ringkasan pesanan', 'Status koneksi', 'Notifikasi integrasi']],
    'marketplace/tokopedia/orders' => ['Pesanan Tokopedia', 'Kelola pesanan Tokopedia.', ['Tracking pesanan', 'Sinkronisasi ERP', 'Filter status']],
    'marketplace/tokopedia/products' => ['Produk Tokopedia', 'Kelola katalog produk Tokopedia.', ['Daftar produk', 'Sinkronkan stok', 'Update harga']],
    'marketplace/tokopedia/stocks' => ['Stok Tokopedia', 'Pantau stok Tokopedia.', ['Monitoring stok', 'Sinkronisasi otomatis', 'Alert stok rendah']],
    'marketplace/tokopedia/chat' => ['Chat Tokopedia', 'Kelola komunikasi pelanggan Tokopedia.', ['Balas pesan', 'Riwayat chat', 'Filter percakapan']],
    'marketplace/tokopedia/shipping' => ['Pengiriman Tokopedia', 'Kelola pengiriman Tokopedia.', ['Metode kurir', 'Status pengiriman', 'Cetak label']],
    'marketplace/tokopedia/vouchers' => ['Voucher Tokopedia', 'Kelola voucher Tokopedia.', ['Buat voucher', 'Periode promo', 'Laporan penggunaan']],
    'marketplace/tokopedia/customers' => ['Customer Tokopedia', 'Kelola pelanggan Tokopedia.', ['Data customer', 'Riwayat transaksi', 'Segmentasi customer']],
    'marketplace/tokopedia/analytics' => ['Analytics Tokopedia', 'Lihat performa Tokopedia.', ['Laporan penjualan', 'Trend produk', 'Analytics customer']],
    'marketplace/tokopedia/settings' => ['Pengaturan API Tokopedia', 'Konfigurasi API Tokopedia.', ['API key', 'Webhook', 'Pengaturan integrasi']],
    'marketplace/lazada' => ['Dashboard Lazada', 'Overview integrasi Lazada dan performa penjualan.', ['Ringkasan pesanan', 'Status koneksi', 'Notifikasi integrasi']],
    'marketplace/lazada/orders' => ['Pesanan Lazada', 'Kelola pesanan Lazada.', ['Tracking pesanan', 'Sinkronisasi ERP', 'Filter status']],
    'marketplace/lazada/products' => ['Produk Lazada', 'Kelola katalog produk Lazada.', ['Daftar produk', 'Sinkronkan stok', 'Update harga']],
    'marketplace/lazada/stocks' => ['Stok Lazada', 'Pantau stok Lazada.', ['Monitoring stok', 'Sinkronisasi otomatis', 'Alert stok rendah']],
    'marketplace/lazada/chat' => ['Chat Lazada', 'Kelola komunikasi pelanggan Lazada.', ['Balas pesan', 'Riwayat chat', 'Filter percakapan']],
    'marketplace/lazada/shipping' => ['Pengiriman Lazada', 'Kelola pengiriman Lazada.', ['Metode kurir', 'Status pengiriman', 'Cetak label']],
    'marketplace/lazada/vouchers' => ['Voucher Lazada', 'Kelola voucher Lazada.', ['Buat voucher', 'Periode promo', 'Laporan penggunaan']],
    'marketplace/lazada/customers' => ['Customer Lazada', 'Kelola pelanggan Lazada.', ['Data customer', 'Riwayat transaksi', 'Segmentasi customer']],
    'marketplace/lazada/analytics' => ['Analytics Lazada', 'Lihat performa Lazada.', ['Laporan penjualan', 'Trend produk', 'Analytics customer']],
    'marketplace/lazada/settings' => ['Pengaturan API Lazada', 'Konfigurasi API Lazada.', ['API key', 'Webhook', 'Pengaturan integrasi']],
    'marketplace/sync' => ['Sinkronisasi Semua Marketplace', 'Sinkronkan data pesanan, produk, dan stok antar marketplace.', ['Sinkron pesanan multi-channel', 'Sinkron produk', 'Sinkron stok']],
    'marketplace/mapping' => ['Mapping Produk Marketplace', 'Pemetaan produk marketplace ke item internal ERP.', ['Mapping SKU', 'Mapping kategori', 'Mapping atribut produk']],
    'marketplace/all-orders' => ['Multi Channel Order', 'Lihat dan kelola semua order dari marketplace dalam satu layar.', ['Order multi-channel', 'Filter status', 'Sync order ke ERP']],
    'marketplace/all-chat' => ['Multi Channel Chat', 'Kelola semua percakapan pelanggan marketplace.', ['Obrolan multi-channel', 'Filter chat', 'Riwayat interaksi']],
    'marketplace/all-analytics' => ['Multi Channel Analytics', 'Analitik gabungan untuk semua marketplace.', ['Laporan multi-channel', 'Trend penjualan', 'Performa channel']],
    'marketplace/all-shipping' => ['Multi Channel Shipping', 'Manajemen pengiriman untuk semua marketplace.', ['Tracking pengiriman', 'Pengiriman multi-channel', 'Cetak label']],
];

foreach ($marketplaceComingSoon as $path => [$title, $description, $features]) {
    Route::get('/' . $path, function () use ($title, $description, $features) {
        return view('erp.coming-soon', compact('title', 'description', 'features'));
    });
}

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
?>
