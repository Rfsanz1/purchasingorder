<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('goods_receipt_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('goods_receipt_id')->constrained('goods_receipts')->onDelete('cascade');
            $table->foreignId('purchase_order_item_id')->constrained('purchase_order_items')->onDelete('restrict');
            $table->foreignId('product_id')->constrained('products')->onDelete('restrict');
            $table->integer('quantity_received');
            $table->integer('quantity_damaged')->default(0);
            $table->integer('quantity_rejected')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index('goods_receipt_id');
            $table->index('product_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('goods_receipt_items');
    }
};
