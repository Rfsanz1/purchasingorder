<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('sales_id');
            $table->string('nama_produk');
            $table->string('sku');
            $table->bigInteger('harga')->default(0);
            $table->integer('stok')->default(1);
            $table->timestamps();

            $table->index('sales_id');
            $table->unique(['sales_id', 'sku']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
