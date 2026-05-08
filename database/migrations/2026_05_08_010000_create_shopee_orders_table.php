<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shopee_orders', function (Blueprint $table) {
            $table->id();
            $table->string('shopee_order_sn')->unique();
            $table->string('shopee_shop_name')->nullable();
            $table->string('status')->default('COMPLETED');
            $table->string('buyer_username')->nullable();
            $table->string('buyer_name')->nullable();
            $table->string('recipient_name')->nullable();
            $table->text('shipping_address')->nullable();
            $table->string('phone')->nullable();
            $table->text('product_name')->nullable();
            $table->integer('qty')->default(1);
            $table->decimal('original_price', 15, 2)->default(0);
            $table->decimal('deal_price', 15, 2)->default(0);
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('shipping_fee', 15, 2)->default(0);
            $table->decimal('voucher_discount', 15, 2)->default(0);
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->string('logistic_name')->nullable();
            $table->string('tracking_number')->nullable();
            $table->string('payment_method')->nullable();
            $table->timestamp('order_created_at')->nullable();
            $table->timestamp('order_paid_at')->nullable();
            $table->boolean('synced_to_erp')->default(false);
            $table->unsignedBigInteger('erp_order_id')->nullable();
            $table->text('raw_data')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shopee_orders');
    }
};
