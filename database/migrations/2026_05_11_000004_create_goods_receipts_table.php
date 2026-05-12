<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('goods_receipts', function (Blueprint $table) {
            $table->id();
            $table->string('gr_number')->unique();
            $table->foreignId('purchase_order_id')->nullable()->constrained('purchase_orders')->onDelete('set null');
            $table->date('receipt_date');
            $table->text('description')->nullable();
            $table->enum('status', ['draft', 'completed', 'cancelled'])->default('draft');
            $table->string('received_by')->nullable();
            $table->string('verified_by')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('gr_number');
            $table->index('purchase_order_id');
            $table->index('receipt_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('goods_receipts');
    }
};
