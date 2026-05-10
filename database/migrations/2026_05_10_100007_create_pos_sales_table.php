<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pos_cashier_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('session_code')->unique();
            $table->foreignId('user_id')->constrained('pos_users')->restrictOnDelete();
            $table->foreignId('warehouse_id')->constrained('pos_warehouses')->restrictOnDelete();
            $table->decimal('opening_cash', 15, 2)->default(0);
            $table->decimal('closing_cash', 15, 2)->nullable();
            $table->decimal('expected_cash', 15, 2)->default(0);
            $table->decimal('cash_difference', 15, 2)->nullable();
            $table->timestamp('opened_at');
            $table->timestamp('closed_at')->nullable();
            $table->string('status')->default('open'); // open, closed
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('pos_sales', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->string('reference_number')->nullable();
            $table->foreignId('customer_id')->nullable()->constrained('pos_customers')->nullOnDelete();
            $table->foreignId('cashier_id')->constrained('pos_users')->restrictOnDelete();
            $table->foreignId('warehouse_id')->constrained('pos_warehouses')->restrictOnDelete();
            $table->foreignId('session_id')->nullable()->constrained('pos_cashier_sessions')->nullOnDelete();
            $table->string('status')->default('completed'); // draft, completed, cancelled, returned
            $table->string('sale_type')->default('pos'); // pos, order, delivery
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('discount_pct', 5, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('tax_pct', 5, 2)->default(0);
            $table->decimal('shipping_cost', 15, 2)->default(0);
            $table->decimal('other_cost', 15, 2)->default(0);
            $table->decimal('grand_total', 15, 2)->default(0);
            $table->decimal('paid_amount', 15, 2)->default(0);
            $table->decimal('change_amount', 15, 2)->default(0);
            $table->string('payment_status')->default('paid'); // paid, partial, unpaid
            $table->text('notes')->nullable();
            $table->string('customer_name')->nullable();
            $table->string('customer_phone')->nullable();
            $table->timestamps();
            $table->index(['created_at']);
            $table->index(['status']);
            $table->index(['payment_status']);
        });

        Schema::create('pos_sale_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_id')->constrained('pos_sales')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('pos_products')->restrictOnDelete();
            $table->foreignId('unit_id')->constrained('pos_units')->restrictOnDelete();
            $table->string('product_name');
            $table->string('product_sku');
            $table->decimal('qty', 12, 4);
            $table->decimal('unit_price', 15, 2);
            $table->decimal('cost_price', 15, 2)->default(0);
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('discount_pct', 5, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('subtotal', 15, 2);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('pos_sale_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_id')->constrained('pos_sales')->cascadeOnDelete();
            $table->string('method'); // cash, transfer, qris, credit, tempo
            $table->string('reference')->nullable();
            $table->decimal('amount', 15, 2);
            $table->string('bank_name')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('pos_held_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('hold_code')->unique();
            $table->foreignId('cashier_id')->constrained('pos_users')->cascadeOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained('pos_customers')->nullOnDelete();
            $table->json('cart_data');
            $table->decimal('grand_total', 15, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pos_held_transactions');
        Schema::dropIfExists('pos_sale_payments');
        Schema::dropIfExists('pos_sale_items');
        Schema::dropIfExists('pos_sales');
        Schema::dropIfExists('pos_cashier_sessions');
    }
};
