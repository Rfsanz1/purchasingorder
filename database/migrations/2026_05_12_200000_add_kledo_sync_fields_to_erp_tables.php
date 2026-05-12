<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Add kledo_id and kledo_data to relevant tables
        $tables = [
            'customers' => 'kledo_id',
            'products' => 'kledo_product_id', // already exists
            'erp_suppliers' => 'kledo_id',
            'erp_stock_movements' => 'kledo_id',
            'erp_journal_entries' => 'kledo_id',
            'erp_journal_entry_lines' => 'kledo_line_id',
        ];

        foreach ($tables as $table => $column) {
            if (!Schema::hasColumn($table, $column)) {
                Schema::table($table, function (Blueprint $table) use ($column) {
                    $table->string($column)->nullable()->index();
                });
            }

            if (!Schema::hasColumn($table, 'kledo_data')) {
                Schema::table($table, function (Blueprint $table) {
                    $table->json('kledo_data')->nullable();
                });
            }
        }

        // Add reference fields to journal entries
        if (!Schema::hasColumn('erp_journal_entries', 'reference_type')) {
            Schema::table('erp_journal_entries', function (Blueprint $table) {
                $table->string('reference_type')->nullable()->index();
                $table->unsignedBigInteger('reference_id')->nullable()->index();
            });
        }

        // Add total fields to journal entries
        if (!Schema::hasColumn('erp_journal_entries', 'total_debit')) {
            Schema::table('erp_journal_entries', function (Blueprint $table) {
                $table->decimal('total_debit', 15, 2)->default(0);
                $table->decimal('total_credit', 15, 2)->default(0);
            });
        }
    }

    public function down(): void
    {
        // Rollback would be complex, so we'll skip for now
    }
};