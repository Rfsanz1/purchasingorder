<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pos_purchases', function (Blueprint $table) {
            $table->id();
            $table->string('po_number')->unique();
            $table->foreignId('supplier_id')->constrained('pos_suppliers')->restrictOnDelete();
            $table->foreignId('warehouse_id')->constrained('pos_warehouses')->restrictOnDelete();
            $table->foreignId('created_by')->constrained('pos_users')->restrictOnDelete();
            $table->string('status')->default('draft'); // draft, ordered, partial, received, cancelled
            $table->string('payment_status')->default('unpaid'); // unpaid, partial, paid
            $table->date('order_date');
            $table->date('expected_date')->nullable();
            $table->date('received_date')->nullable();
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('shipping_cost', 15, 2)->default(0);
            $table->decimal('grand_total', 15, 2)->default(0);
            $table->decimal('paid_amount', 15, 2)->default(0);
            $table->text('notes')->nullable();
            $table->text('shipping_address')->nullable();
            $table->timestamps();
        });

        Schema::create('pos_purchase_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_id')->constrained('pos_purchases')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('pos_products')->restrictOnDelete();
            $table->foreignId('unit_id')->constrained('pos_units')->restrictOnDelete();
            $table->string('product_name');
            $table->decimal('qty_ordered', 12, 4);
            $table->decimal('qty_received', 12, 4)->default(0);
            $table->decimal('unit_price', 15, 2);
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('subtotal', 15, 2);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('pos_receivables', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('sale_id')->nullable()->constrained('pos_sales')->nullOnDelete();
            $table->foreignId('customer_id')->constrained('pos_customers')->restrictOnDelete();
            $table->decimal('amount', 15, 2);
            $table->decimal('paid_amount', 15, 2)->default(0);
            $table->decimal('remaining', 15, 2);
            $table->date('due_date');
            $table->string('status')->default('unpaid'); // unpaid, partial, paid, overdue
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('pos_receivable_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('receivable_id')->constrained('pos_receivables')->cascadeOnDelete();
            $table->decimal('amount', 15, 2);
            $table->string('method'); // cash, transfer, qris
            $table->string('reference')->nullable();
            $table->date('payment_date');
            $table->text('notes')->nullable();
            $table->foreignId('received_by')->nullable()->constrained('pos_users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('pos_payables', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('purchase_id')->nullable()->constrained('pos_purchases')->nullOnDelete();
            $table->foreignId('supplier_id')->constrained('pos_suppliers')->restrictOnDelete();
            $table->decimal('amount', 15, 2);
            $table->decimal('paid_amount', 15, 2)->default(0);
            $table->decimal('remaining', 15, 2);
            $table->date('due_date');
            $table->string('status')->default('unpaid'); // unpaid, partial, paid, overdue
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('pos_payable_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payable_id')->constrained('pos_payables')->cascadeOnDelete();
            $table->decimal('amount', 15, 2);
            $table->string('method'); // cash, transfer, qris
            $table->string('reference')->nullable();
            $table->date('payment_date');
            $table->text('notes')->nullable();
            $table->foreignId('paid_by')->nullable()->constrained('pos_users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pos_payable_payments');
        Schema::dropIfExists('pos_payables');
        Schema::dropIfExists('pos_receivable_payments');
        Schema::dropIfExists('pos_receivables');
        Schema::dropIfExists('pos_purchase_items');
        Schema::dropIfExists('pos_purchases');
    }
};
