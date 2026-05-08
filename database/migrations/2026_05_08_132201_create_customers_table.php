<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('email')->nullable()->unique();
            $table->string('telepon', 20)->nullable();
            $table->text('alamat')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->enum('jenis_kelamin', ['L', 'P'])->nullable();
            $table->string('pekerjaan')->nullable();
            $table->string('perusahaan')->nullable();
            $table->enum('status', ['Aktif', 'Tidak Aktif', 'Blacklist'])->default('Aktif');
            $table->text('catatan')->nullable();
            $table->integer('total_order')->default(0);
            $table->bigInteger('total_nilai_order')->default(0);
            $table->timestamp('last_order_at')->nullable();
            $table->timestamps();

            $table->index(['nama', 'telepon']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
