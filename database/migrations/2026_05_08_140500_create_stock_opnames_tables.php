<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_opnames', function (Blueprint $table) {
            $table->id();
            $table->string('user_role');
            $table->string('username');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('stock_opname_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_opname_id')->constrained('stock_opnames')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->integer('kledo_product_id')->nullable();
            $table->string('sku');
            $table->string('nama_produk');
            $table->integer('expected_qty')->default(0);
            $table->integer('counted_qty')->default(0);
            $table->integer('diff')->default(0);
            $table->string('source')->default('internal');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_opname_items');
        Schema::dropIfExists('stock_opnames');
    }
};
