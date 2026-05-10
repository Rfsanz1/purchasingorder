<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pos_products', function (Blueprint $table) {
            $table->id();
            $table->string('sku')->unique();
            $table->string('barcode')->nullable()->index();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->foreignId('category_id')->nullable()->constrained('pos_categories')->nullOnDelete();
            $table->foreignId('unit_id')->constrained('pos_units')->restrictOnDelete();
            $table->foreignId('supplier_id')->nullable()->constrained('pos_suppliers')->nullOnDelete();
            $table->decimal('cost_price', 15, 2)->default(0);
            $table->decimal('selling_price', 15, 2)->default(0);
            $table->decimal('wholesale_price', 15, 2)->default(0);
            $table->decimal('min_selling_price', 15, 2)->default(0);
            $table->integer('min_stock_alert')->default(0);
            $table->boolean('track_stock')->default(true);
            $table->boolean('has_variants')->default(false);
            $table->boolean('is_bundled')->default(false);
            $table->decimal('tax_rate', 5, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->string('color')->nullable();
            $table->string('size')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('pos_product_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('pos_products')->cascadeOnDelete();
            $table->foreignId('unit_id')->constrained('pos_units')->restrictOnDelete();
            $table->decimal('conversion_factor', 10, 4)->default(1);
            $table->decimal('selling_price', 15, 2)->default(0);
            $table->decimal('cost_price', 15, 2)->default(0);
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

        Schema::create('pos_product_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('pos_products')->cascadeOnDelete();
            $table->foreignId('price_tier_id')->constrained('pos_price_tiers')->cascadeOnDelete();
            $table->foreignId('unit_id')->constrained('pos_units')->restrictOnDelete();
            $table->decimal('price', 15, 2);
            $table->integer('min_qty')->default(1);
            $table->timestamps();
            $table->unique(['product_id', 'price_tier_id', 'unit_id']);
        });

        Schema::create('pos_product_bundles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bundle_id')->constrained('pos_products')->cascadeOnDelete();
            $table->foreignId('component_id')->constrained('pos_products')->cascadeOnDelete();
            $table->decimal('qty', 10, 4)->default(1);
            $table->foreignId('unit_id')->constrained('pos_units')->restrictOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pos_product_bundles');
        Schema::dropIfExists('pos_product_prices');
        Schema::dropIfExists('pos_product_units');
        Schema::dropIfExists('pos_products');
    }
};
