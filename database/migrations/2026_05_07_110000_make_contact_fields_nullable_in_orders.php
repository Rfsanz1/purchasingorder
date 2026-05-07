<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('nomor_telepon', 30)->nullable()->change();
            $table->text('alamat')->nullable()->change();
            $table->string('nama_kontak')->nullable()->change();
        });
    }
    public function down(): void {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('nomor_telepon', 30)->nullable(false)->change();
            $table->text('alamat')->nullable(false)->change();
            $table->string('nama_kontak')->nullable(false)->change();
        });
    }
};
