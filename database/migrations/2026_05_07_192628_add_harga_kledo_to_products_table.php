<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->bigInteger('harga_kledo')->default(0)->after('harga');
            $table->bigInteger('harga_jual')->default(0)->after('harga_kledo');
            $table->bigInteger('hpp')->default(0)->after('harga_jual');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['harga_kledo', 'harga_jual', 'hpp']);
        });
    }
};
