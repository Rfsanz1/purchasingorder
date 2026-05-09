<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('kledo_sync_logs')) {
            Schema::create('kledo_sync_logs', function (Blueprint $table) {
                $table->id();
                $table->string('kledo_invoice_id')->unique()->index();
                $table->string('ref_number')->nullable();
                $table->string('trans_date')->nullable();
                $table->string('contact_name')->nullable();
                $table->bigInteger('total')->default(0);
                $table->string('status')->nullable();
                $table->string('sales')->nullable();
                $table->string('memo')->nullable();
                $table->json('raw_data')->nullable();
                $table->timestamp('synced_at')->useCurrent();
                $table->timestamp('updated_at')->useCurrent();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('kledo_sync_logs');
    }
};
