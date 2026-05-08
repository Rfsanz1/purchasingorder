<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kledo_sync_logs', function (Blueprint $table) {
            if (!Schema::hasColumn('kledo_sync_logs', 'alamat')) {
                $table->text('alamat')->nullable()->after('contact_name');
            }
            if (!Schema::hasColumn('kledo_sync_logs', 'metode_pembayaran')) {
                $table->string('metode_pembayaran', 100)->nullable()->after('status');
            }
            if (!Schema::hasColumn('kledo_sync_logs', 'diskon')) {
                $table->bigInteger('diskon')->default(0)->after('total');
            }
            if (!Schema::hasColumn('kledo_sync_logs', 'pajak')) {
                $table->bigInteger('pajak')->default(0)->after('diskon');
            }
        });
    }

    public function down(): void
    {
        Schema::table('kledo_sync_logs', function (Blueprint $table) {
            $table->dropColumnIfExists('alamat');
            $table->dropColumnIfExists('metode_pembayaran');
            $table->dropColumnIfExists('diskon');
            $table->dropColumnIfExists('pajak');
        });
    }
};
