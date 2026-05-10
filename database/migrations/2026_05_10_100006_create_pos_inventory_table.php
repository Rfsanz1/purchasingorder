<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pos_inventories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('pos_products')->cascadeOnDelete();
            $table->foreignId('warehouse_id')->constrained('pos_warehouses')->cascadeOnDelete();
            $table->decimal('qty_on_hand', 12, 4)->default(0);
            $table->decimal('qty_reserved', 12, 4)->default(0);
            $table->decimal('qty_available', 12, 4)->storedAs('qty_on_hand - qty_reserved');
            $table->timestamps();
            $table->unique(['product_id', 'warehouse_id']);
        });

        Schema::create('pos_stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('pos_products')->restrictOnDelete();
            $table->foreignId('warehouse_id')->constrained('pos_warehouses')->restrictOnDelete();
            $table->foreignId('unit_id')->constrained('pos_units')->restrictOnDelete();
            $table->string('type'); // in, out, adjustment, transfer_in, transfer_out, return_in, return_out
            $table->string('reference_type')->nullable(); // sale, purchase, adjustment, transfer
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->decimal('qty', 12, 4);
            $table->decimal('qty_before', 12, 4)->default(0);
            $table->decimal('qty_after', 12, 4)->default(0);
            $table->decimal('cost_price', 15, 2)->default(0);
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('pos_users')->nullOnDelete();
            $table->timestamps();
            $table->index(['reference_type', 'reference_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pos_stock_movements');
        Schema::dropIfExists('pos_inventories');
    }
};
