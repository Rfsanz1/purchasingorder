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
                $table->string('order_id', 20)->unique();
                $table->string('nama_kontak');
                $table->string('nomor_telepon', 30);
                $table->text('alamat');
                $table->string('patokan_lokasi')->default('');
                $table->text('nama_produk');
                $table->integer('jumlah_produk')->default(1);
                $table->bigInteger('harga_produk')->default(0);
                $table->bigInteger('biaya_pengiriman')->default(0);
                $table->bigInteger('total_harga')->default(0);
                $table->string('sales_person', 100);
                $table->string('metode_pembayaran', 50)->default('CASH');
                $table->string('keterangan_pembayaran')->nullable();
                $table->string('whatsapp_sent', 10)->default('false');
                $table->string('status_pengiriman', 30)->default('Menunggu');
                $table->string('driver_name', 100)->nullable();
                $table->string('metode_pengiriman', 30)->default('Dikirim');
                $table->string('kategori_produk', 30)->default('BahanBangunan');
                $table->string('customer_lat', 30)->nullable();
                $table->string('customer_lng', 30)->nullable();
                $table->string('customer_loc_token', 50)->nullable()->index();
                $table->timestamp('customer_loc_shared_at')->nullable();
                $table->longText('bukti_transfer_data')->nullable();
                $table->json('payment_splits')->nullable();
                $table->json('bukti_transfer_list')->nullable();
                $table->bigInteger('dp_amount')->nullable();
                $table->bigInteger('sisa_pembayaran')->nullable();
                $table->timestamp('created_at')->useCurrent();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
