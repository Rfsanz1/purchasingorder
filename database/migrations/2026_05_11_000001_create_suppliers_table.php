<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('supplier_code')->unique();
            $table->string('name');
            $table->string('contact_person')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('postal_code')->nullable();
            $table->text('notes')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('bank_account_name')->nullable();
            $table->string('bank_account_number')->nullable();
            $table->decimal('discount_percentage', 5, 2)->default(0);
            $table->integer('payment_term_days')->default(0);
            $table->enum('status', ['active', 'inactive', 'blocked'])->default('active');
            $table->integer('rating')->default(5)->comment('1-5 stars');
            $table->decimal('total_purchase_amount', 15, 2)->default(0);
            $table->integer('total_transactions')->default(0);
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('supplier_code');
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};
