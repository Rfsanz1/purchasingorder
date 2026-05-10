<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
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
            $table->integer('payment_term_days')->default(0);
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('pos_customers', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('type')->default('retail'); // retail, contractor, store, reseller
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('nik', 20)->nullable();
            $table->string('npwp', 20)->nullable();
            $table->string('membership_tier')->default('regular'); // regular, silver, gold, platinum
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
    }
};
