<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kledo_sync_logs', function (Blueprint $table) {
            if (!Schema::hasColumn('kledo_sync_logs', 'items')) {
                $table->json('items')->nullable()->after('memo');
            }
        });
    }

    public function down(): void
    {
        Schema::table('kledo_sync_logs', function (Blueprint $table) {
            $table->dropColumn('items');
        });
    }
};
