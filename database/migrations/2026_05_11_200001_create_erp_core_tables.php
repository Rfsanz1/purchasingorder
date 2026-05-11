<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Suppliers
        if (!Schema::hasTable('suppliers')) {
            Schema::create('suppliers', function (Blueprint $table) {
                $table->id();
                $table->string('kode', 20)->unique()->nullable();
                $table->string('nama');
                $table->string('kontak', 100)->nullable();
                $table->string('telepon', 30)->nullable();
                $table->string('email', 150)->nullable();
                $table->text('alamat')->nullable();
                $table->string('kota', 100)->nullable();
                $table->string('npwp', 30)->nullable();
                $table->string('rekening_bank', 50)->nullable();
                $table->string('nama_bank', 50)->nullable();
                $table->string('atas_nama', 100)->nullable();
                $table->decimal('limit_kredit', 18, 2)->default(0);
                $table->integer('top', false, true)->default(0)->comment('Terms of Payment in days');
                $table->string('status', 20)->default('Aktif');
                $table->text('catatan')->nullable();
                $table->timestamps();
            });
        }

        // Purchase Orders
        if (!Schema::hasTable('purchase_orders')) {
            Schema::create('purchase_orders', function (Blueprint $table) {
                $table->id();
                $table->string('no_po', 30)->unique();
                $table->unsignedBigInteger('supplier_id')->nullable();
                $table->date('tanggal');
                $table->date('tanggal_kirim')->nullable();
                $table->string('status', 20)->default('Draft');
                $table->string('status_bayar', 20)->default('Belum Bayar');
                $table->decimal('subtotal', 18, 2)->default(0);
                $table->decimal('diskon', 18, 2)->default(0);
                $table->decimal('ppn', 18, 2)->default(0);
                $table->decimal('total', 18, 2)->default(0);
                $table->decimal('dp', 18, 2)->default(0);
                $table->decimal('sisa', 18, 2)->default(0);
                $table->text('catatan')->nullable();
                $table->string('dibuat_oleh', 100)->nullable();
                $table->string('disetujui_oleh', 100)->nullable();
                $table->timestamp('disetujui_at')->nullable();
                $table->timestamps();
            });
        }

        // Purchase Order Items
        if (!Schema::hasTable('purchase_order_items')) {
            Schema::create('purchase_order_items', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('purchase_order_id');
                $table->string('nama_produk');
                $table->string('sku', 50)->nullable();
                $table->string('satuan', 20)->nullable();
                $table->decimal('qty', 12, 2)->default(0);
                $table->decimal('qty_diterima', 12, 2)->default(0);
                $table->decimal('harga', 18, 2)->default(0);
                $table->decimal('diskon', 18, 2)->default(0);
                $table->decimal('total', 18, 2)->default(0);
                $table->text('keterangan')->nullable();
                $table->timestamps();
            });
        }

        // Cash Transactions (Kas Masuk & Keluar)
        if (!Schema::hasTable('cash_transactions')) {
            Schema::create('cash_transactions', function (Blueprint $table) {
                $table->id();
                $table->string('no_transaksi', 30)->unique();
                $table->string('jenis', 10); // masuk / keluar
                $table->string('kategori', 50)->nullable();
                $table->string('akun_kas', 50)->default('Kas Utama');
                $table->date('tanggal');
                $table->decimal('jumlah', 18, 2)->default(0);
                $table->string('metode_pembayaran', 30)->default('Cash');
                $table->string('referensi', 100)->nullable();
                $table->text('keterangan')->nullable();
                $table->string('dibuat_oleh', 100)->nullable();
                $table->string('status', 20)->default('Completed');
                $table->timestamps();
            });
        }

        // Expenses (Biaya Operasional)
        if (!Schema::hasTable('expenses')) {
            Schema::create('expenses', function (Blueprint $table) {
                $table->id();
                $table->string('no_expense', 30)->unique();
                $table->string('kategori', 100);
                $table->date('tanggal');
                $table->decimal('jumlah', 18, 2)->default(0);
                $table->string('metode_bayar', 30)->default('Cash');
                $table->text('deskripsi')->nullable();
                $table->string('dibuat_oleh', 100)->nullable();
                $table->string('status', 20)->default('Approved');
                $table->timestamps();
            });
        }

        // Employees
        if (!Schema::hasTable('employees')) {
            Schema::create('employees', function (Blueprint $table) {
                $table->id();
                $table->string('nik', 20)->unique()->nullable();
                $table->string('nama');
                $table->string('jabatan', 100)->nullable();
                $table->string('departemen', 100)->nullable();
                $table->string('divisi', 100)->nullable();
                $table->string('telepon', 30)->nullable();
                $table->string('email', 150)->nullable();
                $table->text('alamat')->nullable();
                $table->date('tanggal_masuk')->nullable();
                $table->decimal('gaji_pokok', 18, 2)->default(0);
                $table->string('status', 20)->default('Aktif');
                $table->string('jenis_kelamin', 5)->nullable();
                $table->date('tanggal_lahir')->nullable();
                $table->string('no_rekening', 30)->nullable();
                $table->string('nama_bank', 30)->nullable();
                $table->timestamps();
            });
        }

        // Attendance
        if (!Schema::hasTable('attendance')) {
            Schema::create('attendance', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('employee_id')->nullable();
                $table->string('nama_karyawan', 100)->nullable();
                $table->date('tanggal');
                $table->time('jam_masuk')->nullable();
                $table->time('jam_keluar')->nullable();
                $table->string('status', 20)->default('Hadir'); // Hadir, Izin, Sakit, Alpa, Cuti
                $table->text('keterangan')->nullable();
                $table->decimal('lembur_jam', 5, 2)->default(0);
                $table->timestamps();
            });
        }

        // Quotations
        if (!Schema::hasTable('quotations')) {
            Schema::create('quotations', function (Blueprint $table) {
                $table->id();
                $table->string('no_quotation', 30)->unique();
                $table->string('nama_customer', 200)->nullable();
                $table->string('telepon_customer', 30)->nullable();
                $table->date('tanggal');
                $table->date('valid_until')->nullable();
                $table->decimal('subtotal', 18, 2)->default(0);
                $table->decimal('diskon', 18, 2)->default(0);
                $table->decimal('total', 18, 2)->default(0);
                $table->string('status', 20)->default('Draft');
                $table->text('catatan')->nullable();
                $table->string('dibuat_oleh', 100)->nullable();
                $table->timestamps();
            });
        }

        // Quotation Items
        if (!Schema::hasTable('quotation_items')) {
            Schema::create('quotation_items', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('quotation_id');
                $table->string('nama_produk');
                $table->string('satuan', 20)->nullable();
                $table->decimal('qty', 12, 2)->default(1);
                $table->decimal('harga', 18, 2)->default(0);
                $table->decimal('diskon_pct', 5, 2)->default(0);
                $table->decimal('total', 18, 2)->default(0);
                $table->timestamps();
            });
        }

        // Retur Penjualan
        if (!Schema::hasTable('returns')) {
            Schema::create('returns', function (Blueprint $table) {
                $table->id();
                $table->string('no_retur', 30)->unique();
                $table->string('no_order', 50)->nullable();
                $table->string('nama_customer', 200)->nullable();
                $table->date('tanggal');
                $table->string('alasan', 200)->nullable();
                $table->string('kondisi_barang', 50)->nullable();
                $table->string('tindakan', 50)->nullable(); // Refund, Tukar Barang, Kredit
                $table->decimal('nilai_retur', 18, 2)->default(0);
                $table->string('status', 20)->default('Proses');
                $table->text('keterangan')->nullable();
                $table->timestamps();
            });
        }

        // Stock Mutations
        if (!Schema::hasTable('stock_mutations')) {
            Schema::create('stock_mutations', function (Blueprint $table) {
                $table->id();
                $table->string('no_mutasi', 30)->unique();
                $table->string('jenis', 20); // masuk, keluar, transfer, adjustment
                $table->string('nama_produk', 200);
                $table->string('sku', 50)->nullable();
                $table->string('gudang_asal', 100)->nullable();
                $table->string('gudang_tujuan', 100)->nullable();
                $table->decimal('qty', 12, 2)->default(0);
                $table->string('satuan', 20)->nullable();
                $table->date('tanggal');
                $table->string('referensi', 100)->nullable();
                $table->text('keterangan')->nullable();
                $table->string('dibuat_oleh', 100)->nullable();
                $table->timestamps();
            });
        }

        // Promo / Discount
        if (!Schema::hasTable('promos')) {
            Schema::create('promos', function (Blueprint $table) {
                $table->id();
                $table->string('kode', 30)->unique();
                $table->string('nama', 200);
                $table->string('jenis', 20)->default('persen'); // persen, nominal, gratis_ongkir
                $table->decimal('nilai', 10, 2)->default(0);
                $table->decimal('min_transaksi', 18, 2)->default(0);
                $table->decimal('max_diskon', 18, 2)->default(0);
                $table->date('mulai')->nullable();
                $table->date('berakhir')->nullable();
                $table->integer('kuota')->default(0);
                $table->integer('terpakai')->default(0);
                $table->string('status', 20)->default('Aktif');
                $table->text('deskripsi')->nullable();
                $table->timestamps();
            });
        }

        // Payroll
        if (!Schema::hasTable('payrolls')) {
            Schema::create('payrolls', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('employee_id')->nullable();
                $table->string('nama_karyawan', 100);
                $table->string('periode', 10); // YYYY-MM
                $table->decimal('gaji_pokok', 18, 2)->default(0);
                $table->decimal('tunjangan', 18, 2)->default(0);
                $table->decimal('insentif', 18, 2)->default(0);
                $table->decimal('lembur', 18, 2)->default(0);
                $table->decimal('potongan', 18, 2)->default(0);
                $table->decimal('bpjs_tk', 18, 2)->default(0);
                $table->decimal('bpjs_kes', 18, 2)->default(0);
                $table->decimal('pph21', 18, 2)->default(0);
                $table->decimal('total_gaji', 18, 2)->default(0);
                $table->string('status', 20)->default('Draft');
                $table->date('tanggal_bayar')->nullable();
                $table->text('catatan')->nullable();
                $table->timestamps();
            });
        }

        // Delivery Proofs
        if (!Schema::hasTable('delivery_proofs')) {
            Schema::create('delivery_proofs', function (Blueprint $table) {
                $table->id();
                $table->string('no_order', 50)->nullable();
                $table->string('nama_customer', 200)->nullable();
                $table->string('driver', 100)->nullable();
                $table->date('tanggal_kirim')->nullable();
                $table->string('status', 30)->default('Dalam Pengiriman');
                $table->text('alamat_kirim')->nullable();
                $table->string('foto_bukti', 500)->nullable();
                $table->string('lat', 30)->nullable();
                $table->string('lng', 30)->nullable();
                $table->text('catatan')->nullable();
                $table->timestamp('diterima_at')->nullable();
                $table->timestamps();
            });
        }

        // Sales Targets
        if (!Schema::hasTable('sales_targets')) {
            Schema::create('sales_targets', function (Blueprint $table) {
                $table->id();
                $table->string('nama_sales', 100);
                $table->string('periode', 10); // YYYY-MM
                $table->decimal('target_revenue', 18, 2)->default(0);
                $table->decimal('target_order', 10, 0)->default(0);
                $table->decimal('realisasi_revenue', 18, 2)->default(0);
                $table->decimal('realisasi_order', 10, 0)->default(0);
                $table->string('status', 20)->default('Berjalan');
                $table->timestamps();
            });
        }

        // Journal Entries
        if (!Schema::hasTable('journal_entries')) {
            Schema::create('journal_entries', function (Blueprint $table) {
                $table->id();
                $table->string('no_jurnal', 30)->unique();
                $table->date('tanggal');
                $table->string('referensi', 100)->nullable();
                $table->text('keterangan')->nullable();
                $table->string('dibuat_oleh', 100)->nullable();
                $table->string('status', 20)->default('Posted');
                $table->timestamps();
            });
        }

        // Journal Entry Lines
        if (!Schema::hasTable('journal_entry_lines')) {
            Schema::create('journal_entry_lines', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('journal_entry_id');
                $table->string('kode_akun', 20);
                $table->string('nama_akun', 100);
                $table->decimal('debit', 18, 2)->default(0);
                $table->decimal('kredit', 18, 2)->default(0);
                $table->text('keterangan')->nullable();
                $table->timestamps();
            });
        }

        // Chart of Accounts
        if (!Schema::hasTable('chart_of_accounts')) {
            Schema::create('chart_of_accounts', function (Blueprint $table) {
                $table->id();
                $table->string('kode', 20)->unique();
                $table->string('nama', 150);
                $table->string('jenis', 50); // Aktiva, Pasiva, Pendapatan, Biaya, Ekuitas
                $table->string('sub_jenis', 50)->nullable();
                $table->string('kode_induk', 20)->nullable();
                $table->decimal('saldo_awal', 18, 2)->default(0);
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // WA Notification Logs
        if (!Schema::hasTable('wa_notification_logs')) {
            Schema::create('wa_notification_logs', function (Blueprint $table) {
                $table->id();
                $table->string('tujuan', 30);
                $table->string('tipe', 50)->nullable();
                $table->text('pesan');
                $table->string('status', 20)->default('Terkirim');
                $table->string('error_msg', 500)->nullable();
                $table->string('referensi', 100)->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        $tables = [
            'wa_notification_logs', 'chart_of_accounts', 'journal_entry_lines',
            'journal_entries', 'sales_targets', 'delivery_proofs', 'payrolls',
            'promos', 'stock_mutations', 'returns', 'quotation_items', 'quotations',
            'attendance', 'employees', 'expenses', 'cash_transactions',
            'purchase_order_items', 'purchase_orders', 'suppliers',
        ];
        foreach ($tables as $t) {
            Schema::dropIfExists($t);
        }
    }
};
