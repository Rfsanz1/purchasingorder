<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;
use App\Http\Controllers\Shopee\ShopeeController;

Route::get('/', [PageController::class, 'landing']);

// ===== SHOPEE ADMIN =====
Route::get('/shopee/login', [ShopeeController::class, 'loginPage'])->name('shopee.login');
Route::post('/shopee/login', [ShopeeController::class, 'login'])->name('shopee.login.post');
Route::get('/shopee/logout', [ShopeeController::class, 'logout'])->name('shopee.logout');
Route::middleware(\App\Http\Middleware\ShopeeAuth::class)->group(function () {
    Route::get('/shopee/dashboard', [ShopeeController::class, 'dashboard'])->name('shopee.dashboard');
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

// Coming Soon routes
$comingSoon = [
    'erp/retur'           => ['Retur', 'Manajemen pengembalian barang dari customer.', ['Retur barang', 'Alasan retur', 'Proses pengembalian dana', 'Laporan retur']],
    'erp/discount'        => ['Diskon & Promo', 'Manajemen program diskon dan promosi penjualan.', ['Buat kode promo', 'Diskon per produk / kategori', 'Periode promosi', 'Laporan efektivitas promo']],
    'erp/stock-in'        => ['Stok Masuk', 'Pencatatan barang masuk ke gudang.', ['Input penerimaan barang', 'Sinkronisasi dari PO', 'Riwayat stok masuk', 'Cetak label']],
    'erp/stock-out'       => ['Stok Keluar', 'Pencatatan barang keluar dari gudang.', ['Input pengeluaran barang', 'Stok keluar per order', 'Riwayat stok keluar']],
    'erp/stock-opname'    => ['Stock Opname', 'Pencocokan stok fisik dengan data sistem.', ['Jadwal opname', 'Input hitungan fisik', 'Selisih stok otomatis', 'Laporan opname']],
    'erp/warehouse'       => ['Gudang', 'Manajemen lokasi dan zona penyimpanan gudang.', ['Peta gudang', 'Zona penyimpanan', 'Transfer antar lokasi', 'Kapasitas gudang']],
    'erp/supplier'        => ['Supplier', 'Database dan manajemen supplier/vendor.', ['Daftar supplier', 'Kontak & alamat', 'Riwayat transaksi', 'Rating supplier']],
    'erp/purchase-order'  => ['Purchase Order', 'Buat dan kelola PO ke supplier.', ['Buat PO ke supplier', 'Approval PO', 'Status pengiriman supplier', 'Riwayat PO']],
    'erp/goods-receipt'   => ['Penerimaan Barang', 'Konfirmasi penerimaan barang dari supplier.', ['Input penerimaan', 'Verifikasi terhadap PO', 'Notifikasi admin', 'Cetak surat jalan']],
    'erp/cash-in'         => ['Kas Masuk', 'Pencatatan semua pemasukan kas.', ['Input kas masuk', 'Kategorisasi', 'Rekonsiliasi bank', 'Laporan kas masuk']],
    'erp/cash-out'        => ['Kas Keluar', 'Pencatatan semua pengeluaran kas.', ['Input pengeluaran', 'Approval pengeluaran', 'Bukti pengeluaran', 'Laporan kas keluar']],
    'erp/profit-loss'     => ['Laba Rugi', 'Laporan laba rugi periode tertentu.', ['Laba rugi harian/bulanan/tahunan', 'Grafik tren', 'Export PDF/Excel', 'Perbandingan periode']],
    'erp/expense'         => ['Pengeluaran', 'Manajemen biaya operasional.', ['Kategori biaya', 'Approval biaya', 'Budget monitoring', 'Laporan pengeluaran']],
    'erp/customers'       => ['Data Customer', 'CRM dan database pelanggan.', ['Profil customer', 'Riwayat pembelian', 'Catatan penting', 'Segmentasi customer']],
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
