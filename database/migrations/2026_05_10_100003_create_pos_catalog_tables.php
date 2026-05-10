<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pos_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->foreignId('parent_id')->nullable()->constrained('pos_categories')->nullOnDelete();
            $table->string('color', 20)->nullable();
            $table->string('icon', 10)->nullable();
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('pos_units', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('abbreviation', 20)->unique();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('pos_price_tiers', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('label');
            $table->integer('min_qty')->default(1);
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('pos_warehouses', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('address')->nullable();
            $table->string('phone')->nullable();
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('pos_suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('company')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->decimal('credit_limit', 15, 2)->default(0);
            $table->integer('payment_term_days')->default(30);
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('pos_customers', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('type')->default('retail');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('nik', 20)->nullable();
            $table->string('npwp', 20)->nullable();
            $table->string('membership_tier')->default('regular');
            $table->decimal('credit_limit', 15, 2)->default(0);
            $table->integer('payment_term_days')->default(0);
            $table->decimal('total_purchases', 15, 2)->default(0);
            $table->integer('total_transactions')->default(0);
            $table->foreignId('price_tier_id')->nullable()->constrained('pos_price_tiers')->nullOnDelete();
            $table->decimal('custom_discount_pct', 5, 2)->default(0);
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pos_customers');
        Schema::dropIfExists('pos_suppliers');
        Schema::dropIfExists('pos_warehouses');
        Schema::dropIfExists('pos_price_tiers');
        Schema::dropIfExists('pos_units');
        Schema::dropIfExists('pos_categories');
    }
};
