<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'metode_pengiriman')) {
                $table->string('metode_pengiriman', 30)->default('Dikirim');
            }
            if (!Schema::hasColumn('orders', 'kategori_produk')) {
                $table->string('kategori_produk', 30)->default('BahanBangunan');
            }
            if (!Schema::hasColumn('orders', 'customer_lat')) {
                $table->string('customer_lat', 30)->nullable();
            }
            if (!Schema::hasColumn('orders', 'customer_lng')) {
                $table->string('customer_lng', 30)->nullable();
            }
            if (!Schema::hasColumn('orders', 'customer_loc_token')) {
                $table->string('customer_loc_token', 50)->nullable()->index();
            }
            if (!Schema::hasColumn('orders', 'customer_loc_shared_at')) {
                $table->timestamp('customer_loc_shared_at')->nullable();
            }
            if (!Schema::hasColumn('orders', 'bukti_transfer_data')) {
                $table->longText('bukti_transfer_data')->nullable();
            }
            if (!Schema::hasColumn('orders', 'payment_splits')) {
                $table->json('payment_splits')->nullable();
            }
            if (!Schema::hasColumn('orders', 'bukti_transfer_list')) {
                $table->json('bukti_transfer_list')->nullable();
            }
            if (!Schema::hasColumn('orders', 'dp_amount')) {
                $table->bigInteger('dp_amount')->nullable();
            }
            if (!Schema::hasColumn('orders', 'sisa_pembayaran')) {
                $table->bigInteger('sisa_pembayaran')->nullable();
            }
            if (!Schema::hasColumn('orders', 'driver_name')) {
                $table->string('driver_name', 100)->nullable();
            }
            if (!Schema::hasColumn('orders', 'keterangan_pembayaran')) {
                $table->string('keterangan_pembayaran')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $cols = [
                'metode_pengiriman', 'kategori_produk', 'customer_lat', 'customer_lng',
                'customer_loc_token', 'customer_loc_shared_at', 'bukti_transfer_data',
                'payment_splits', 'bukti_transfer_list', 'dp_amount', 'sisa_pembayaran',
                'driver_name', 'keterangan_pembayaran',
            ];
            foreach ($cols as $col) {
                if (Schema::hasColumn('orders', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
