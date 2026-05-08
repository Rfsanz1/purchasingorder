<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'kledo_invoice_id')) {
                $table->integer('kledo_invoice_id')->nullable()->after('sisa_pembayaran');
            }
            if (!Schema::hasColumn('orders', 'raw_items')) {
                $table->jsonb('raw_items')->nullable()->after('kledo_invoice_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumnIfExists('kledo_invoice_id');
            $table->dropColumnIfExists('raw_items');
        });
    }
};
