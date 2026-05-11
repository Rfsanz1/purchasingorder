<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('erp_module_data')) {
            Schema::create('erp_module_data', function (Blueprint $table) {
                $table->id();
                $table->string('module', 100)->index();
                $table->jsonb('data')->default('{}');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('erp_module_data');
    }
};
