<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('brand')->nullable()->after('sku');
            $table->bigInteger('kledo_product_id')->nullable()->after('brand');
            $table->string('kledo_product_name')->nullable()->after('kledo_product_id');

            $table->index('brand');
            $table->unique('kledo_product_id');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropUnique(['kledo_product_id']);
            $table->dropIndex(['brand']);
            $table->dropColumn(['brand', 'kledo_product_id', 'kledo_product_name']);
        });
    }
};
