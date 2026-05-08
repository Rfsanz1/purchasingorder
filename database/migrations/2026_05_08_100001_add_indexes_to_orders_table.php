<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!$this->hasIndex('orders', 'orders_order_id_index')) {
                $table->index('order_id');
            }
            if (!$this->hasIndex('orders', 'orders_created_at_index')) {
                $table->index('created_at');
            }
            if (!$this->hasIndex('orders', 'orders_metode_pembayaran_index')) {
                $table->index('metode_pembayaran');
            }
            if (!$this->hasIndex('orders', 'orders_sales_person_index')) {
                $table->index('sales_person');
            }
        });
    }

    private function hasIndex(string $table, string $indexName): bool
    {
        try {
            $indexes = \DB::select("SELECT indexname FROM pg_indexes WHERE tablename = ? AND indexname = ?", [$table, $indexName]);
            return count($indexes) > 0;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['order_id']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['metode_pembayaran']);
            $table->dropIndex(['sales_person']);
        });
    }
};
