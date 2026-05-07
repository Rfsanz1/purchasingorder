<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('orders')) {
            Schema::create('orders', function (Blueprint $table) {
                $table->id();
                $table->string('order_id')->unique();
                $table->string('nama_kontak');
                $table->string('nomor_telepon');
                $table->text('alamat');
                $table->string('patokan_lokasi')->default('');
                $table->text('nama_produk');
                $table->integer('jumlah_produk');
                $table->integer('harga_produk');
                $table->integer('biaya_pengiriman')->nullable();
                $table->integer('total_harga');
                $table->string('sales_person');
                $table->string('metode_pembayaran');
                $table->string('keterangan_pembayaran')->nullable();
                $table->string('whatsapp_sent')->default('false');
                $table->string('status_pengiriman')->default('Menunggu');
                $table->string('driver_name')->nullable();
                $table->string('metode_pengiriman')->default('Dikirim');
                $table->string('kategori_produk')->default('BahanBangunan');
                $table->string('customer_lat')->nullable();
                $table->string('customer_lng')->nullable();
                $table->string('customer_loc_token')->nullable();
                $table->timestamp('customer_loc_shared_at')->nullable();
                $table->text('bukti_transfer_data')->nullable();
                $table->text('payment_splits')->nullable();
                $table->text('bukti_transfer_list')->nullable();
                $table->integer('dp_amount')->nullable();
                $table->integer('sisa_pembayaran')->nullable();
                $table->timestamp('created_at')->useCurrent();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
