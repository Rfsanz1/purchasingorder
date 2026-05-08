<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('sale_items')) {
            Schema::create('sale_items', function (Blueprint $table) {
                $table->id();
                $table->string('order_id', 20)->index();
                $table->text('nama_produk');
                $table->integer('qty')->default(1);
                $table->bigInteger('harga_satuan')->default(0);
                $table->bigInteger('diskon')->default(0);
                $table->bigInteger('subtotal')->default(0);
                $table->string('kategori', 30)->nullable();
                $table->integer('kledo_product_id')->nullable();
                $table->timestamps();

                $table->foreign('order_id')->references('order_id')->on('orders')->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('sale_items');
    }
};
