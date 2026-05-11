<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // BRANCHES
        if (!Schema::hasTable('erp_branches')) {
            Schema::create('erp_branches', function (Blueprint $table) {
                $table->id();
                $table->string('kode', 20)->unique();
                $table->string('nama');
                $table->text('alamat')->nullable();
                $table->string('kota', 100)->nullable();
                $table->string('telepon', 30)->nullable();
                $table->string('email', 100)->nullable();
                $table->string('pic', 100)->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // EMPLOYEES
        if (!Schema::hasTable('erp_employees')) {
            Schema::create('erp_employees', function (Blueprint $table) {
                $table->id();
                $table->string('nik', 30)->unique();
                $table->string('nama');
                $table->string('jabatan', 100)->nullable();
                $table->string('departemen', 100)->nullable();
                $table->foreignId('branch_id')->nullable()->constrained('erp_branches')->nullOnDelete();
                $table->string('telepon', 30)->nullable();
                $table->string('email', 100)->nullable();
                $table->string('alamat')->nullable();
                $table->date('tanggal_masuk')->nullable();
                $table->decimal('gaji_pokok', 15, 2)->default(0);
                $table->enum('status', ['aktif', 'non-aktif', 'resign'])->default('aktif');
                $table->string('foto')->nullable();
                $table->timestamps();
            });
        }

        // ATTENDANCE
        if (!Schema::hasTable('erp_attendance')) {
            Schema::create('erp_attendance', function (Blueprint $table) {
                $table->id();
                $table->foreignId('employee_id')->constrained('erp_employees')->cascadeOnDelete();
                $table->date('tanggal');
                $table->time('jam_masuk')->nullable();
                $table->time('jam_keluar')->nullable();
                $table->enum('status', ['hadir', 'izin', 'sakit', 'alpha', 'cuti', 'wfh'])->default('hadir');
                $table->decimal('overtime_hours', 5, 2)->default(0);
                $table->text('keterangan')->nullable();
                $table->timestamps();
                $table->unique(['employee_id', 'tanggal']);
            });
        }

        // PAYROLL
        if (!Schema::hasTable('erp_payroll')) {
            Schema::create('erp_payroll', function (Blueprint $table) {
                $table->id();
                $table->foreignId('employee_id')->constrained('erp_employees')->cascadeOnDelete();
                $table->string('periode', 7); // YYYY-MM
                $table->decimal('gaji_pokok', 15, 2)->default(0);
                $table->decimal('tunjangan', 15, 2)->default(0);
                $table->decimal('lembur', 15, 2)->default(0);
                $table->decimal('bonus', 15, 2)->default(0);
                $table->decimal('potongan', 15, 2)->default(0);
                $table->decimal('pph21', 15, 2)->default(0);
                $table->decimal('total_gaji', 15, 2)->default(0);
                $table->enum('status', ['draft', 'approved', 'paid'])->default('draft');
                $table->date('tanggal_bayar')->nullable();
                $table->text('catatan')->nullable();
                $table->timestamps();
                $table->unique(['employee_id', 'periode']);
            });
        }

        // SUPPLIERS
        if (!Schema::hasTable('erp_suppliers')) {
            Schema::create('erp_suppliers', function (Blueprint $table) {
                $table->id();
                $table->string('kode', 20)->unique();
                $table->string('nama');
                $table->string('perusahaan', 150)->nullable();
                $table->string('telepon', 30)->nullable();
                $table->string('email', 100)->nullable();
                $table->text('alamat')->nullable();
                $table->string('kota', 100)->nullable();
                $table->string('npwp', 30)->nullable();
                $table->string('pic', 100)->nullable();
                $table->string('rekening_bank', 50)->nullable();
                $table->string('nama_bank', 50)->nullable();
                $table->decimal('total_pembelian', 15, 2)->default(0);
                $table->decimal('hutang', 15, 2)->default(0);
                $table->enum('status', ['aktif', 'non-aktif'])->default('aktif');
                $table->timestamps();
            });
        }

        // PURCHASE ORDERS
        if (!Schema::hasTable('erp_purchase_orders')) {
            Schema::create('erp_purchase_orders', function (Blueprint $table) {
                $table->id();
                $table->string('nomor', 30)->unique();
                $table->foreignId('supplier_id')->constrained('erp_suppliers')->cascadeOnDelete();
                $table->date('tanggal');
                $table->date('tanggal_kirim')->nullable();
                $table->decimal('subtotal', 15, 2)->default(0);
                $table->decimal('diskon', 15, 2)->default(0);
                $table->decimal('ppn', 15, 2)->default(0);
                $table->decimal('total', 15, 2)->default(0);
                $table->decimal('dibayar', 15, 2)->default(0);
                $table->enum('status', ['draft', 'sent', 'partial', 'received', 'cancelled'])->default('draft');
                $table->enum('status_bayar', ['belum', 'sebagian', 'lunas'])->default('belum');
                $table->text('catatan')->nullable();
                $table->string('created_by', 100)->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_purchase_order_items')) {
            Schema::create('erp_purchase_order_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('purchase_order_id')->constrained('erp_purchase_orders')->cascadeOnDelete();
                $table->string('produk_nama');
                $table->string('produk_kode', 50)->nullable();
                $table->decimal('qty', 10, 2)->default(0);
                $table->string('satuan', 20)->default('pcs');
                $table->decimal('harga', 15, 2)->default(0);
                $table->decimal('diskon', 5, 2)->default(0);
                $table->decimal('subtotal', 15, 2)->default(0);
                $table->decimal('qty_diterima', 10, 2)->default(0);
                $table->timestamps();
            });
        }

        // WAREHOUSES
        if (!Schema::hasTable('erp_warehouses')) {
            Schema::create('erp_warehouses', function (Blueprint $table) {
                $table->id();
                $table->string('kode', 20)->unique();
                $table->string('nama');
                $table->text('alamat')->nullable();
                $table->string('pic', 100)->nullable();
                $table->string('telepon', 30)->nullable();
                $table->foreignId('branch_id')->nullable()->constrained('erp_branches')->nullOnDelete();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // STOCK MOVEMENTS
        if (!Schema::hasTable('erp_stock_movements')) {
            Schema::create('erp_stock_movements', function (Blueprint $table) {
                $table->id();
                $table->foreignId('warehouse_id')->nullable()->constrained('erp_warehouses')->nullOnDelete();
                $table->string('produk_id')->nullable();
                $table->string('produk_nama');
                $table->string('produk_kode', 50)->nullable();
                $table->enum('tipe', ['masuk', 'keluar', 'transfer', 'adjustment', 'opname']);
                $table->decimal('qty', 10, 2)->default(0);
                $table->decimal('qty_sebelum', 10, 2)->default(0);
                $table->decimal('qty_sesudah', 10, 2)->default(0);
                $table->decimal('harga_satuan', 15, 2)->default(0);
                $table->string('referensi', 100)->nullable();
                $table->text('keterangan')->nullable();
                $table->string('created_by', 100)->nullable();
                $table->timestamps();
            });
        }

        // CASH TRANSACTIONS (kas masuk & keluar)
        if (!Schema::hasTable('erp_cash_transactions')) {
            Schema::create('erp_cash_transactions', function (Blueprint $table) {
                $table->id();
                $table->string('nomor', 30)->unique();
                $table->enum('tipe', ['masuk', 'keluar']);
                $table->string('kategori', 100)->nullable();
                $table->string('kas_type', 50)->default('kas_besar'); // kas_besar, kas_kecil, elektronik
                $table->date('tanggal');
                $table->decimal('jumlah', 15, 2)->default(0);
                $table->string('keterangan')->nullable();
                $table->string('referensi', 100)->nullable();
                $table->string('pihak', 150)->nullable(); // nama customer/supplier
                $table->enum('status', ['draft', 'approved', 'rejected'])->default('approved');
                $table->string('created_by', 100)->nullable();
                $table->timestamps();
            });
        }

        // BANK ACCOUNTS
        if (!Schema::hasTable('erp_bank_accounts')) {
            Schema::create('erp_bank_accounts', function (Blueprint $table) {
                $table->id();
                $table->string('nama_bank', 100);
                $table->string('no_rekening', 50)->unique();
                $table->string('atas_nama', 100);
                $table->decimal('saldo', 15, 2)->default(0);
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // BANK TRANSACTIONS
        if (!Schema::hasTable('erp_bank_transactions')) {
            Schema::create('erp_bank_transactions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('bank_account_id')->constrained('erp_bank_accounts')->cascadeOnDelete();
                $table->enum('tipe', ['kredit', 'debit']);
                $table->date('tanggal');
                $table->decimal('jumlah', 15, 2)->default(0);
                $table->string('keterangan')->nullable();
                $table->string('referensi', 100)->nullable();
                $table->decimal('saldo_setelah', 15, 2)->default(0);
                $table->boolean('is_reconciled')->default(false);
                $table->timestamps();
            });
        }

        // CHART OF ACCOUNTS
        if (!Schema::hasTable('erp_chart_of_accounts')) {
            Schema::create('erp_chart_of_accounts', function (Blueprint $table) {
                $table->id();
                $table->string('kode', 20)->unique();
                $table->string('nama');
                $table->enum('tipe', ['aktiva', 'pasiva', 'modal', 'pendapatan', 'biaya', 'harga_pokok'])->default('biaya');
                $table->enum('sub_tipe', ['aktiva_lancar', 'aktiva_tetap', 'hutang_lancar', 'hutang_jangka_panjang', 'modal', 'pendapatan_usaha', 'pendapatan_lain', 'beban_pokok', 'beban_operasional', 'beban_lain'])->nullable();
                $table->foreignId('parent_id')->nullable()->constrained('erp_chart_of_accounts')->nullOnDelete();
                $table->decimal('saldo_normal', 15, 2)->default(0);
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // JOURNAL ENTRIES
        if (!Schema::hasTable('erp_journal_entries')) {
            Schema::create('erp_journal_entries', function (Blueprint $table) {
                $table->id();
                $table->string('nomor', 30)->unique();
                $table->date('tanggal');
                $table->string('keterangan');
                $table->decimal('total_debit', 15, 2)->default(0);
                $table->decimal('total_kredit', 15, 2)->default(0);
                $table->enum('status', ['draft', 'posted', 'reversed'])->default('draft');
                $table->string('referensi', 100)->nullable();
                $table->string('created_by', 100)->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_journal_entry_lines')) {
            Schema::create('erp_journal_entry_lines', function (Blueprint $table) {
                $table->id();
                $table->foreignId('journal_entry_id')->constrained('erp_journal_entries')->cascadeOnDelete();
                $table->foreignId('account_id')->constrained('erp_chart_of_accounts')->cascadeOnDelete();
                $table->decimal('debit', 15, 2)->default(0);
                $table->decimal('kredit', 15, 2)->default(0);
                $table->string('keterangan')->nullable();
            });
        }

        // TAX RATES
        if (!Schema::hasTable('erp_tax_rates')) {
            Schema::create('erp_tax_rates', function (Blueprint $table) {
                $table->id();
                $table->string('nama', 100);
                $table->string('kode', 20)->unique();
                $table->decimal('rate', 5, 2)->default(0);
                $table->enum('tipe', ['ppn', 'pph21', 'pph23', 'pph_final', 'lainnya'])->default('ppn');
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // SERVICE TICKETS
        if (!Schema::hasTable('erp_service_tickets')) {
            Schema::create('erp_service_tickets', function (Blueprint $table) {
                $table->id();
                $table->string('nomor', 30)->unique();
                $table->string('customer_nama');
                $table->string('customer_telepon', 30)->nullable();
                $table->string('produk_nama');
                $table->string('produk_sn', 100)->nullable();
                $table->text('keluhan');
                $table->text('diagnosa')->nullable();
                $table->text('solusi')->nullable();
                $table->string('teknisi', 100)->nullable();
                $table->date('tanggal_masuk');
                $table->date('tanggal_selesai')->nullable();
                $table->decimal('biaya_servis', 15, 2)->default(0);
                $table->decimal('biaya_sparepart', 15, 2)->default(0);
                $table->decimal('total_biaya', 15, 2)->default(0);
                $table->enum('status', ['pending', 'diagnosa', 'proses', 'selesai', 'diambil', 'cancelled'])->default('pending');
                $table->enum('garansi', ['tidak', '1_bulan', '3_bulan', '6_bulan', '1_tahun'])->default('tidak');
                $table->timestamps();
            });
        }

        // DELIVERIES
        if (!Schema::hasTable('erp_deliveries')) {
            Schema::create('erp_deliveries', function (Blueprint $table) {
                $table->id();
                $table->string('nomor', 30)->unique();
                $table->string('customer_nama');
                $table->text('alamat_tujuan')->nullable();
                $table->string('driver_nama', 100)->nullable();
                $table->string('kendaraan', 50)->nullable();
                $table->date('tanggal_kirim');
                $table->time('jam_kirim')->nullable();
                $table->decimal('berat_total', 10, 2)->default(0);
                $table->enum('status', ['pending', 'pickup', 'on_delivery', 'delivered', 'returned', 'cancelled'])->default('pending');
                $table->string('order_referensi', 100)->nullable();
                $table->text('catatan')->nullable();
                $table->string('foto_bukti')->nullable();
                $table->decimal('lat', 10, 6)->nullable();
                $table->decimal('lng', 10, 6)->nullable();
                $table->timestamps();
            });
        }

        // ERP ROLES & PERMISSIONS
        if (!Schema::hasTable('erp_roles')) {
            Schema::create('erp_roles', function (Blueprint $table) {
                $table->id();
                $table->string('nama', 100)->unique();
                $table->string('slug', 100)->unique();
                $table->text('deskripsi')->nullable();
                $table->json('permissions')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('erp_user_roles')) {
            Schema::create('erp_user_roles', function (Blueprint $table) {
                $table->id();
                $table->string('username', 100);
                $table->foreignId('role_id')->constrained('erp_roles')->cascadeOnDelete();
                $table->timestamps();
                $table->unique(['username', 'role_id']);
            });
        }

        // SALES TARGETS
        if (!Schema::hasTable('erp_sales_targets')) {
            Schema::create('erp_sales_targets', function (Blueprint $table) {
                $table->id();
                $table->string('sales_nama', 100);
                $table->string('periode', 7); // YYYY-MM
                $table->decimal('target', 15, 2)->default(0);
                $table->decimal('realisasi', 15, 2)->default(0);
                $table->timestamps();
                $table->unique(['sales_nama', 'periode']);
            });
        }

        // QUOTATIONS
        if (!Schema::hasTable('erp_quotations')) {
            Schema::create('erp_quotations', function (Blueprint $table) {
                $table->id();
                $table->string('nomor', 30)->unique();
                $table->string('customer_nama');
                $table->string('customer_telepon', 30)->nullable();
                $table->date('tanggal');
                $table->date('valid_sampai')->nullable();
                $table->decimal('subtotal', 15, 2)->default(0);
                $table->decimal('diskon', 15, 2)->default(0);
                $table->decimal('ppn', 15, 2)->default(0);
                $table->decimal('total', 15, 2)->default(0);
                $table->enum('status', ['draft', 'sent', 'accepted', 'rejected', 'expired'])->default('draft');
                $table->text('catatan')->nullable();
                $table->string('sales_nama', 100)->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('erp_user_roles');
        Schema::dropIfExists('erp_roles');
        Schema::dropIfExists('erp_deliveries');
        Schema::dropIfExists('erp_service_tickets');
        Schema::dropIfExists('erp_journal_entry_lines');
        Schema::dropIfExists('erp_journal_entries');
        Schema::dropIfExists('erp_chart_of_accounts');
        Schema::dropIfExists('erp_bank_transactions');
        Schema::dropIfExists('erp_bank_accounts');
        Schema::dropIfExists('erp_cash_transactions');
        Schema::dropIfExists('erp_stock_movements');
        Schema::dropIfExists('erp_warehouses');
        Schema::dropIfExists('erp_purchase_order_items');
        Schema::dropIfExists('erp_purchase_orders');
        Schema::dropIfExists('erp_suppliers');
        Schema::dropIfExists('erp_payroll');
        Schema::dropIfExists('erp_attendance');
        Schema::dropIfExists('erp_employees');
        Schema::dropIfExists('erp_branches');
        Schema::dropIfExists('erp_tax_rates');
        Schema::dropIfExists('erp_sales_targets');
        Schema::dropIfExists('erp_quotations');
    }
};
